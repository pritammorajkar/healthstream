import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, ChevronDown, FlaskConical } from 'lucide-react'
import type { ClinicalTrialFull, Patient } from '@healthstream/shared'
import { mockClinicalTrials, patients } from '../data/mockData'
import { useDebounce } from '../hooks'
import { PageTransition } from '../components/common/PageTransition'
import { EmptyState } from '../components/common/EmptyState'
import { PatientPanel } from '../components/matching/PatientPanel'
import { TrialCard } from '../components/matching/TrialCard'
import { TrialDrawer } from '../components/matching/TrialDrawer'

type SortMode = 'relevance' | 'distance' | 'phase'

function SkeletonCard() {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 animate-pulse">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-5 w-20 rounded-full bg-gray-100" />
        <div className="h-3 w-28 rounded bg-gray-100" />
      </div>
      <div className="h-4 w-3/4 rounded bg-gray-100 mb-2" />
      <div className="h-3 w-full rounded bg-gray-100 mb-1" />
      <div className="h-3 w-5/6 rounded bg-gray-100 mb-4" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-32 rounded bg-gray-100" />
        <div className="h-7 w-24 rounded-lg bg-gray-100" />
      </div>
    </div>
  )
}

export function MatchingPage() {
  const [searchParams] = useSearchParams()
  const paramPatientId = searchParams.get('patientId')

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [rawSearch, setRawSearch] = useState('')
  const [sort, setSort] = useState<SortMode>('relevance')
  const [drawerTrial, setDrawerTrial] = useState<ClinicalTrialFull | null>(null)
  const [loading, setLoading] = useState(true)

  const search = useDebounce(rawSearch, 300)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (paramPatientId) {
      const found = patients.find((p) => p.id === paramPatientId) ?? null
      setSelectedPatient(found)
    }
  }, [paramPatientId])

  const filteredTrials = useMemo<ClinicalTrialFull[]>(() => {
    const q = search.trim().toLowerCase()
    let results = mockClinicalTrials.filter((t) => {
      if (!q) return true
      return (
        t.title.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      )
    })

    if (sort === 'relevance') results = [...results].sort((a, b) => b.matchScore - a.matchScore)
    else if (sort === 'distance') results = [...results].sort((a, b) => a.distance - b.distance)
    else if (sort === 'phase') results = [...results].sort((a, b) => a.phase.localeCompare(b.phase))

    return results
  }, [search, sort])

  return (
    <PageTransition>
      {/* Top bar */}
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trial Matching Engine</h1>
          <p className="mt-1 text-sm text-gray-500">
            Precision matching using diagnosis, biomarker, and geographic parameters.
            {selectedPatient && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-600">
                Matching for: {selectedPatient.firstName} {selectedPatient.lastName}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search + filters bar */}
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[240px] max-w-lg">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search trials, patients, or biomarkers…"
            value={rawSearch}
            onChange={(e) => setRawSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortMode)}
              className="appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-8 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="distance">Sort: Distance</option>
              <option value="phase">Sort: Phase</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="flex gap-5 items-start">
        {/* Left panel */}
        <div className="w-[280px] shrink-0">
          <PatientPanel
            selectedPatient={selectedPatient}
            onSelectPatient={setSelectedPatient}
          />
        </div>

        {/* Right panel */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">
              Recommended Clinical Trials
            </h2>
            <span className="text-sm text-gray-400">
              {loading ? '—' : `${filteredTrials.length} result${filteredTrials.length !== 1 ? 's' : ''}`}
            </span>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredTrials.length === 0 ? (
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm">
              <EmptyState
                title="No matching trials found"
                description="No matching trials found for this biomarker profile. Try adjusting the search or filters."
                icon={<FlaskConical className="h-10 w-10" />}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrials.map((trial) => (
                <TrialCard
                  key={trial.id}
                  trial={trial}
                  onViewDetails={setDrawerTrial}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <TrialDrawer trial={drawerTrial} onClose={() => setDrawerTrial(null)} />
    </PageTransition>
  )
}

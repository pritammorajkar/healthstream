import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react'
import type { Patient, PatientRisk, PatientStatus } from '@healthstream/shared'
import { patients } from '../data/mockData'
import { hccColor } from '../utils/hccColor'
import { Avatar } from '../components/common/Avatar'
import { EmptyState } from '../components/common/EmptyState'
import { PageTransition } from '../components/common/PageTransition'

const ITEMS_PER_PAGE = 10

const statusLabel: Record<PatientStatus, string> = {
  identified: 'Identified',
  outreach: 'Outreach',
  'care-plan': 'Care Plan',
  stabilized: 'Stabilized',
}

const statusClass: Record<PatientStatus, string> = {
  identified: 'bg-blue-100 text-blue-700',
  outreach: 'bg-amber-100 text-amber-700',
  'care-plan': 'bg-purple-100 text-purple-700',
  stabilized: 'bg-emerald-100 text-emerald-700',
}

const riskClass: Record<PatientRisk, string> = {
  high: 'text-red-600',
  medium: 'text-amber-600',
  low: 'text-emerald-600',
}

type SortKey = 'hcc-desc' | 'name-asc' | 'dob-asc'
type BiomarkerFilter = 'all' | 'EGFR+' | 'PD-L1+' | 'ALK+'

const ONCOLOGY_MARKERS = ['EGFR', 'PD-L1', 'ALK']

function hasOncologyBiomarker(patient: Patient): boolean {
  return (patient.biomarkers ?? []).some((b) => ONCOLOGY_MARKERS.includes(b.name))
}

function matchesBiomarkerFilter(patient: Patient, filter: BiomarkerFilter): boolean {
  if (filter === 'all') return true
  const markerName = filter.replace('+', '')
  return (patient.biomarkers ?? []).some(
    (b) => b.name === markerName && !b.value.toLowerCase().includes('negative')
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-50">
      {[1, 2, 3, 4, 5].map((i) => (
        <td key={i} className="px-4 py-3.5">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: `${60 + i * 8}%` }} />
        </td>
      ))}
    </tr>
  )
}

export function RegistryPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<PatientRisk | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<PatientStatus | 'all'>('all')
  const [biomarkerFilter, setBiomarkerFilter] = useState<BiomarkerFilter>('all')
  const [sort, setSort] = useState<SortKey>('hcc-desc')
  const [page, setPage] = useState(1)

  useEffect(() => {
    const t = setTimeout(() => {
      setData(patients)
      setLoading(false)
    }, 600)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return data
      .filter((p) => {
        if (q && !`${p.firstName} ${p.lastName}`.toLowerCase().includes(q) && !p.id.toLowerCase().includes(q)) return false
        if (riskFilter !== 'all' && p.risk !== riskFilter) return false
        if (statusFilter !== 'all' && p.status !== statusFilter) return false
        if (!matchesBiomarkerFilter(p, biomarkerFilter)) return false
        return true
      })
      .sort((a, b) => {
        if (sort === 'hcc-desc') return b.hccScore - a.hccScore
        if (sort === 'name-asc') return `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)
        return a.dob.localeCompare(b.dob)
      })
  }, [data, search, riskFilter, statusFilter, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const handleFilterChange = () => setPage(1)

  return (
    <PageTransition>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Patient Registry</h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading ? 'Loading…' : `${data.length} total patients in Region 4 Clinical Hub`}
          </p>
        </div>
      </div>

      {/* Filters row */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); handleFilterChange() }}
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400" />
          <select
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value as PatientRisk | 'all'); handleFilterChange() }}
            className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">All Risks</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as PatientStatus | 'all'); handleFilterChange() }}
            className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">All Statuses</option>
            <option value="identified">Identified</option>
            <option value="outreach">Outreach</option>
            <option value="care-plan">Care Plan</option>
            <option value="stabilized">Stabilized</option>
          </select>

          <select
            value={biomarkerFilter}
            onChange={(e) => { setBiomarkerFilter(e.target.value as BiomarkerFilter); handleFilterChange() }}
            className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">All Biomarkers</option>
            <option value="EGFR+">EGFR+</option>
            <option value="PD-L1+">PD-L1+</option>
            <option value="ALK+">ALK+</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-lg border border-gray-200 bg-white py-2 px-3 text-sm text-gray-700 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="hcc-desc">HCC Score ↓</option>
            <option value="name-asc">Name A–Z</option>
            <option value="dob-asc">DOB</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50/60">
              <tr>
                {['Patient', 'HCC Score', 'Primary Concern', 'Status', 'Actions'].map((col) => (
                  <th
                    key={col}
                    className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 py-3"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      title="No patients found"
                      description="Try adjusting your search or filter criteria."
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => navigate(`/registry/${patient.id}`)}
                    className="hover:bg-brand-50/40 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={patient.initials} />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-gray-900">
                              {patient.firstName} {patient.lastName}
                            </p>
                            {hasOncologyBiomarker(patient) && (
                              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                                Trial Eligible
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-400">DOB: {patient.dob}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-sm font-bold ${hccColor(patient.hccScore)}`}>
                        {patient.hccScore.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-gray-600">{patient.primaryConcern}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass[patient.status]}`}>
                        {statusLabel[patient.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-semibold uppercase ${riskClass[patient.risk]}`}>
                        {patient.risk} risk
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-500">
              Showing {Math.min((page - 1) * ITEMS_PER_PAGE + 1, filtered.length)}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} of {filtered.length} patients
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-8 w-8 rounded-lg text-xs font-semibold transition-colors ${
                    page === i + 1 ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}

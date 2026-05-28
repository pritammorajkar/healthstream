import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User } from 'lucide-react'
import type { Patient } from '@healthstream/shared'
import { patients } from '../../data/mockData'

interface PatientPanelProps {
  selectedPatient: Patient | null
  onSelectPatient: (p: Patient) => void
}

function biomarkerLabel(name: string, value: string): string {
  if (name === 'EGFR') return value.toLowerCase().includes('positive') ? 'EGFR+' : 'EGFR−'
  if (name === 'ALK') return value.toLowerCase().includes('positive') ? 'ALK+' : 'ALK−'
  if (name === 'PD-L1') return `PD-L1 (${value})`
  return `${name}: ${value}`
}

function biomarkerChipClass(name: string, value: string): string {
  if ((name === 'EGFR' || name === 'ALK') && value.toLowerCase().includes('positive')) return 'bg-emerald-100 text-emerald-700'
  return 'bg-gray-100 text-gray-500'
}

const ONCOLOGY_MARKERS = ['EGFR', 'PD-L1', 'ALK']

export function PatientPanel({ selectedPatient, onSelectPatient }: PatientPanelProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  if (!selectedPatient) {
    const filtered = patients.filter((p) => {
      const q = search.trim().toLowerCase()
      if (!q) return true
      return `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    })

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-sm font-semibold text-gray-700 mb-1">Active Case</p>
          <p className="text-xs text-gray-400 mb-3">Select a patient to begin matching</p>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
          {search && (
            <ul className="mt-2 space-y-1 max-h-56 overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="py-3 text-center text-xs text-gray-400">No patients found</li>
              ) : filtered.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => onSelectPatient(p)}
                    className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-brand-50 transition-colors text-left"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-600">
                      {p.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">{p.firstName} {p.lastName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{p.diagnosis ?? '—'}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border border-dashed border-gray-200 p-6 text-center">
          <User className="mx-auto mb-2 h-8 w-8 text-gray-300" />
          <p className="text-xs font-semibold text-gray-500">No patient selected</p>
          <p className="mt-0.5 text-[11px] text-gray-400">Search above to load a patient</p>
        </div>
      </div>
    )
  }

  const p = selectedPatient
  const oncologyBiomarkers = (p.biomarkers ?? []).filter((b) => ONCOLOGY_MARKERS.includes(b.name))
  const otherBiomarkers = (p.biomarkers ?? []).filter((b) => !ONCOLOGY_MARKERS.includes(b.name))

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Active Case</p>
          {p.caseId && <span className="font-mono text-[10px] text-gray-400">#{p.caseId}</span>}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
            {p.initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">{p.firstName} {p.lastName}</p>
            <p className="text-xs text-gray-500">
              {new Date().getFullYear() - Number(p.dob.split('/')[2])} yrs
              {p.sex ? ` · ${p.sex}` : ''}
            </p>
          </div>
        </div>
      </div>

      {p.diagnosis && (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Primary Diagnosis</p>
          <p className="text-sm font-semibold text-gray-900">{p.diagnosis}</p>
          {p.staging && <p className="text-xs text-gray-500 mt-0.5">{p.staging}</p>}
        </div>
      )}

      {(p.biomarkers ?? []).length > 0 && (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Biomarker Profile</p>
          <div className="flex flex-wrap gap-1.5">
            {oncologyBiomarkers.map((b) => (
              <span key={b.name} className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${biomarkerChipClass(b.name, b.value)}`}>
                {biomarkerLabel(b.name, b.value)}
              </span>
            ))}
            {otherBiomarkers.map((b) => (
              <span key={b.name} className="rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-500">
                {b.name}: {b.value}
              </span>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate(`/registry/${p.id}`)}
        className="rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-500 hover:border-brand-300 hover:text-brand-600 transition-colors"
      >
        View Full Profile →
      </button>
    </div>
  )
}

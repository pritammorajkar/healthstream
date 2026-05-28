import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, MapPin, Phone, Mail, Stethoscope, FlaskConical, Calendar, Pill, AlertTriangle, CheckCircle, Trophy, Trash2, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Patient, PatientNote, CareTimelineEvent, TrialMatchHistory } from '@healthstream/shared'
import { patients } from '../data/mockData'
import { hccColor } from '../utils/hccColor'
import { PageTransition } from '../components/common/PageTransition'

const statusClass: Record<string, string> = {
  identified: 'bg-blue-100 text-blue-700',
  outreach: 'bg-amber-100 text-amber-700',
  'care-plan': 'bg-purple-100 text-purple-700',
  stabilized: 'bg-emerald-100 text-emerald-700',
}

const statusLabel: Record<string, string> = {
  identified: 'Identified',
  outreach: 'Outreach',
  'care-plan': 'Care Plan',
  stabilized: 'Stabilized',
}

const timelineIcon: Record<CareTimelineEvent['type'], React.ReactNode> = {
  appointment: <Calendar className="h-3.5 w-3.5" />,
  lab: <FlaskConical className="h-3.5 w-3.5" />,
  medication: <Pill className="h-3.5 w-3.5" />,
  milestone: <CheckCircle className="h-3.5 w-3.5" />,
  alert: <AlertTriangle className="h-3.5 w-3.5" />,
}

const timelineColor: Record<CareTimelineEvent['type'], string> = {
  appointment: 'bg-blue-100 text-blue-600',
  lab: 'bg-purple-100 text-purple-600',
  medication: 'bg-teal-100 text-teal-600',
  milestone: 'bg-emerald-100 text-emerald-600',
  alert: 'bg-red-100 text-red-600',
}

function biomarkerChipClass(name: string, value: string): string {
  if ((name === 'EGFR' || name === 'ALK') && value.toLowerCase().includes('positive')) return 'bg-emerald-100 text-emerald-700'
  if (name === 'PD-L1' || (name === 'ALK' && value.toLowerCase().includes('negative'))) return 'bg-gray-100 text-gray-600'
  if (name === 'EGFR' && value.toLowerCase().includes('negative')) return 'bg-gray-100 text-gray-600'
  return 'bg-gray-100 text-gray-600'
}

function biomarkerLabel(name: string, value: string): string {
  if (name === 'EGFR') return value.toLowerCase().includes('positive') ? 'EGFR+' : 'EGFR−'
  if (name === 'ALK') return value.toLowerCase().includes('positive') ? 'ALK+' : 'ALK−'
  if (name === 'PD-L1') return `PD-L1 (${value})`
  return `${name}: ${value}`
}

const outcomeColors: Record<TrialMatchHistory['outcome'], string> = {
  enrolled: 'bg-emerald-100 text-emerald-700',
  'not-eligible': 'bg-red-100 text-red-600',
  withdrawn: 'bg-gray-100 text-gray-500',
}

const outcomeLabel: Record<TrialMatchHistory['outcome'], string> = {
  enrolled: 'Enrolled',
  'not-eligible': 'Not Eligible',
  withdrawn: 'Withdrawn',
}

function calcAge(dob: string): number {
  const [m, d, y] = dob.split('/').map(Number)
  const birth = new Date(y, m - 1, d)
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  if (now < new Date(now.getFullYear(), birth.getMonth(), birth.getDate())) age--
  return age
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function PatientProfilePage() {
  const { patientId } = useParams<{ patientId: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [patient, setPatient] = useState<Patient | null>(null)
  const [notes, setNotes] = useState<PatientNote[]>([])
  const [noteText, setNoteText] = useState('')

  useEffect(() => {
    const t = setTimeout(() => {
      const found = patients.find((p) => p.id === patientId) ?? null
      setPatient(found)
      setNotes(found?.notes ?? [])
      setLoading(false)
    }, 400)
    return () => clearTimeout(t)
  }, [patientId])

  function addNote() {
    const text = noteText.trim()
    if (!text) return
    const newNote: PatientNote = {
      id: `note-new-${Date.now()}`,
      patientId: patientId ?? '',
      text,
      author: 'Dr. Sarah Chen',
      createdAt: new Date().toISOString(),
    }
    setNotes((prev) => [newNote, ...prev])
    setNoteText('')
    toast.success('Note added successfully')
  }

  function deleteNote(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id))
    toast('Note deleted', {
      icon: '🗑️',
      style: { background: '#fee2e2', color: '#dc2626' },
    })
  }

  if (loading) {
    return (
      <PageTransition>
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-100 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <div className="h-48 bg-gray-100 rounded-xl" />
            <div className="h-48 bg-gray-100 rounded-xl" />
          </div>
        </div>
      </PageTransition>
    )
  }

  if (!patient) {
    return (
      <PageTransition>
        <button
          onClick={() => navigate('/registry')}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Back to Registry
        </button>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-12 text-center">
          <AlertTriangle className="mx-auto mb-3 h-10 w-10 text-red-400" />
          <h2 className="text-xl font-bold text-gray-900">Patient not found</h2>
          <p className="mt-1 text-sm text-gray-500">No patient with ID "{patientId}" exists in the registry.</p>
          <button
            onClick={() => navigate('/registry')}
            className="mt-5 px-5 py-2.5 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors"
          >
            Back to Registry
          </button>
        </div>
      </PageTransition>
    )
  }

  const age = calcAge(patient.dob)

  return (
    <PageTransition>
      {/* Back */}
      <button
        onClick={() => navigate('/registry')}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Registry
      </button>

      {/* Profile header */}
      <div className="mb-6 flex items-center gap-5 rounded-xl bg-white border border-gray-100 shadow-sm p-6">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-brand-100 text-2xl font-bold text-brand-600">
          {patient.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">
              {patient.firstName} {patient.lastName}
            </h1>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass[patient.status]}`}>
              {statusLabel[patient.status]}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            <span>{age} years old</span>
            {patient.sex && <span>{patient.sex}</span>}
            {patient.caseId && (
              <button
                onClick={() => { navigator.clipboard.writeText(patient.caseId!); toast.success('Case ID copied') }}
                className="flex items-center gap-1 font-mono text-xs bg-gray-100 px-2 py-0.5 rounded hover:bg-gray-200 transition-colors text-gray-600"
              >
                {patient.caseId}
                <Copy className="h-3 w-3" />
              </button>
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {patient.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {patient.phone}
              </span>
            )}
            {patient.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {patient.email}
              </span>
            )}
            {patient.region && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {patient.region}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-xs text-gray-400 mb-1">Physician</p>
          <p className="text-sm font-semibold text-gray-900 flex items-center gap-1.5 justify-end">
            <Stethoscope className="h-4 w-4 text-brand-500" />
            {patient.primaryPhysician ?? 'Unassigned'}
          </p>
        </div>
      </div>

      {/* Two-column body */}
      <div className="grid grid-cols-[1fr_1.1fr] gap-5">
        {/* Left column */}
        <div className="space-y-5">
          {/* Demographics */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Demographics</h3>
            <dl className="space-y-2 text-sm">
              <Row label="Full Name" value={`${patient.firstName} ${patient.lastName}`} />
              <Row label="Date of Birth" value={patient.dob} />
              <Row label="Age" value={`${age} years`} />
              <Row label="Risk Level" value={patient.risk.charAt(0).toUpperCase() + patient.risk.slice(1)} />
              <Row label="Patient ID" value={patient.id} />
              {patient.location && <Row label="ZIP Code" value={patient.location.zip} />}
            </dl>
          </div>

          {/* Primary Diagnosis */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Primary Diagnosis</h3>
            <p className="text-sm font-semibold text-gray-900 mb-1">{patient.diagnosis ?? 'Not recorded'}</p>
            {patient.staging && (
              <p className="text-xs text-gray-500 mb-2">{patient.staging}</p>
            )}
            {patient.primaryPhysician && (
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Stethoscope className="h-3 w-3" /> {patient.primaryPhysician}
              </p>
            )}
          </div>

          {/* Biomarker Profile */}
          {patient.biomarkers && patient.biomarkers.length > 0 && (
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Biomarker Profile</h3>
              <div className="flex flex-wrap gap-2">
                {patient.biomarkers.map((b) => {
                  const isOncology = ['EGFR', 'PD-L1', 'ALK'].includes(b.name)
                  return (
                    <span
                      key={b.name}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        isOncology
                          ? biomarkerChipClass(b.name, b.value)
                          : b.type === 'flag' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {isOncology ? biomarkerLabel(b.name, b.value) : `${b.name}: ${b.value}`}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {/* Risk Score */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Risk Score</h3>
            <div className="flex items-center gap-4">
              <span className={`text-4xl font-bold rounded-xl px-4 py-2 ${hccColor(patient.hccScore)}`}>
                {patient.hccScore.toFixed(2)}
              </span>
              <div>
                <p className="text-xs text-gray-500 mb-1">HCC Score (RAF)</p>
                <div className="w-40 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${patient.hccScore >= 2.0 ? 'bg-red-400' : patient.hccScore >= 1.5 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                    style={{ width: `${Math.min(100, (patient.hccScore / 4) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {patient.hccScore >= 2.0 ? 'High risk — immediate attention' : patient.hccScore >= 1.5 ? 'Medium risk — monitor closely' : 'Low risk — stable'}
                </p>
              </div>
            </div>
          </div>

          {/* Find Matching Trials CTA */}
          <button
            onClick={() => navigate(`/matching?patientId=${patient.id}`)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-sm"
          >
            <FlaskConical className="h-4 w-4" />
            Find Matching Trials
          </button>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Care Timeline */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Care Timeline</h3>
            {(!patient.careTimeline || patient.careTimeline.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-4">No timeline events recorded.</p>
            ) : (
              <ol className="space-y-3">
                {patient.careTimeline.map((event) => (
                  <li key={event.id} className="flex gap-3">
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${timelineColor[event.type]}`}>
                      {timelineIcon[event.type]}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-gray-900">{event.title}</p>
                        <span className="text-xs text-gray-400">{event.date}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{event.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>

          {/* Notes */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Clinical Notes</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a clinical note…"
              rows={3}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100 resize-none"
            />
            <button
              onClick={addNote}
              disabled={!noteText.trim()}
              className="mt-2 px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Add Note
            </button>

            {notes.length > 0 && (
              <div className="mt-4 space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-600">{note.author}</p>
                        <p className="text-xs text-gray-400">{formatDate(note.createdAt)}</p>
                      </div>
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
            {notes.length === 0 && (
              <p className="mt-3 text-xs text-gray-400 text-center py-2">No notes yet.</p>
            )}
          </div>

          {/* Trial Match History */}
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">Trial Match History</h3>
            {(!patient.matchedTrialsHistory || patient.matchedTrialsHistory.length === 0) &&
             (!patient.matchedTrials || patient.matchedTrials.length === 0) ? (
              <p className="text-sm text-gray-400 text-center py-4">No trial match history recorded.</p>
            ) : (
              <div className="space-y-3">
                {(patient.matchedTrialsHistory ?? []).map((h) => (
                  <div key={h.trialId} className="rounded-lg border border-gray-100 p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">{h.trialTitle}</p>
                        <p className="text-xs font-mono text-gray-400 mt-0.5">{h.trialId}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{h.date}</p>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          h.matchScore >= 85 ? 'bg-emerald-100 text-emerald-700' :
                          h.matchScore >= 70 ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          <Trophy className="h-3 w-3" /> {h.matchScore}%
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${outcomeColors[h.outcome]}`}>
                          {outcomeLabel[h.outcome]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {(patient.matchedTrialsHistory ?? []).length === 0 && (patient.matchedTrials ?? []).map((trial) => (
                  <div key={trial.id} className="rounded-lg border border-gray-100 p-3.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{trial.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{trial.phase} · {trial.sponsor}</p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />{trial.location}
                        </p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        trial.matchPercentage >= 85 ? 'bg-emerald-100 text-emerald-700' :
                        trial.matchPercentage >= 70 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Trophy className="h-3 w-3" /> {trial.matchPercentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-gray-400 shrink-0">{label}</dt>
      <dd className="text-gray-800 font-medium text-right">{value}</dd>
    </div>
  )
}

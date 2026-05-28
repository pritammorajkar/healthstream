import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Phone, Mail, Users, Video, CheckCircle2, PhoneMissed, PhoneCall, UserX } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ContactMethod, ContactOutcome, ContactLog } from '@healthstream/shared'
import { useAppState } from '../../context/AppStateContext'
import { patients as allPatients } from '../../data/mockData'

const CONTACT_METHODS: { value: ContactMethod; Icon: typeof Phone; label: string }[] = [
  { value: 'Phone Call', Icon: Phone, label: 'Phone Call' },
  { value: 'Email', Icon: Mail, label: 'Email' },
  { value: 'In-Person', Icon: Users, label: 'In-Person' },
  { value: 'Video Call', Icon: Video, label: 'Video Call' },
]

const OUTCOMES: { value: ContactOutcome; Icon: typeof CheckCircle2; label: string; color: string }[] = [
  { value: 'Reached Patient', Icon: CheckCircle2, label: 'Reached Patient', color: 'text-emerald-600' },
  { value: 'No Answer', Icon: PhoneMissed, label: 'No Answer', color: 'text-gray-500' },
  { value: 'Left Voicemail', Icon: PhoneCall, label: 'Left Voicemail', color: 'text-amber-600' },
  { value: 'Patient Declined', Icon: UserX, label: 'Patient Declined', color: 'text-red-500' },
]

interface ContactModalProps {
  patientId?: string
  patientName?: string
  onClose: () => void
}

export function ContactModal({ patientId: initialPatientId, patientName: initialPatientName, onClose }: ContactModalProps) {
  const { updatePatientStatus, addContactLog, addCareStreamEvent, patients } = useAppState()

  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId ?? '')
  const [method, setMethod] = useState<ContactMethod>('Phone Call')
  const [outcome, setOutcome] = useState<ContactOutcome>('Reached Patient')
  const [note, setNote] = useState('')
  const [dateTime, setDateTime] = useState(() => {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  })
  const [saving, setSaving] = useState(false)

  const showPatientSearch = !initialPatientId

  const activePatient = showPatientSearch
    ? patients.find((p) => p.id === selectedPatientId)
    : patients.find((p) => p.id === initialPatientId)

  const resolvedPatientName = showPatientSearch
    ? activePatient ? `${activePatient.firstName} ${activePatient.lastName}` : ''
    : (initialPatientName ?? '')

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  function handleLog() {
    const pid = selectedPatientId || initialPatientId
    if (!pid) return
    setSaving(true)

    setTimeout(() => {
      const log: ContactLog = {
        id: `cl-${Date.now()}`,
        patientId: pid,
        method,
        outcome,
        note: note.trim() || undefined,
        date: new Date(dateTime).toISOString(),
        loggedBy: 'Dr. Sarah Chen',
      }
      addContactLog(pid, log)

      if (outcome === 'Reached Patient') {
        updatePatientStatus(pid, 'outreach')
      }

      addCareStreamEvent({
        id: `evt-${Date.now()}`,
        type: outcome === 'Reached Patient' ? 'success' : 'info',
        title: `Contact Logged — ${method}`,
        description: `${resolvedPatientName}: ${outcome}${note.trim() ? ` — ${note.trim().slice(0, 50)}` : ''}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        patientId: pid,
      })

      toast.success(`Contact logged for ${resolvedPatientName}`)
      setSaving(false)
      onClose()
    }, 300)
  }

  const canSubmit = (!!selectedPatientId || !!initialPatientId)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Log Contact</h2>
            {resolvedPatientName && (
              <p className="text-xs text-gray-400 mt-0.5">{resolvedPatientName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Patient search (FAB mode) */}
          {showPatientSearch && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
              >
                <option value="">Select patient…</option>
                {allPatients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Contact method */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Contact Method</label>
            <div className="grid grid-cols-2 gap-2">
              {CONTACT_METHODS.map(({ value, Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setMethod(value)}
                  className={`flex items-center gap-2 rounded-lg border py-2.5 px-3 text-sm font-semibold transition-colors ${
                    method === value
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Outcome */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2">Outcome</label>
            <div className="grid grid-cols-2 gap-2">
              {OUTCOMES.map(({ value, Icon, label, color }) => (
                <button
                  key={value}
                  onClick={() => setOutcome(value)}
                  className={`flex items-center gap-2 rounded-lg border py-2.5 px-3 text-sm font-semibold transition-colors ${
                    outcome === value
                      ? 'bg-brand-50 border-brand-300 text-brand-700'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${outcome === value ? 'text-brand-600' : color}`} strokeWidth={1.75} />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date / time */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Date &amp; Time</label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Brief note about the contact…"
              rows={3}
              className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm resize-none focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleLog}
            disabled={!canSubmit || saving}
            className="rounded-lg bg-brand-500 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Logging…' : 'Log Contact'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

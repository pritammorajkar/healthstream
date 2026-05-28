import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, User, CheckCircle, XCircle, Copy } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ClinicalTrialFull } from '@healthstream/shared'

interface TrialDrawerProps {
  trial: ClinicalTrialFull | null
  onClose: () => void
}

function StatusPill({ status }: { status: ClinicalTrialFull['enrollmentStatus'] }) {
  const map: Record<ClinicalTrialFull['enrollmentStatus'], string> = {
    recruiting: 'bg-emerald-100 text-emerald-700',
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-gray-100 text-gray-600',
    closed: 'bg-red-100 text-red-600',
  }
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${map[status]}`}>
      {status}
    </span>
  )
}

export function TrialDrawer({ trial, onClose }: TrialDrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  function copyTrialId() {
    if (!trial) return
    navigator.clipboard.writeText(trial.id)
    toast.success(`Trial ID ${trial.id} copied`)
  }

  return (
    <AnimatePresence>
      {trial && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px]"
            onClick={onClose}
          />
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed right-0 top-0 z-40 flex h-full w-[480px] max-w-full flex-col bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between border-b border-gray-100 p-5">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    onClick={copyTrialId}
                    className="flex items-center gap-1 font-mono text-xs text-gray-400 hover:text-brand-500 transition-colors"
                  >
                    {trial.id} <Copy className="h-3 w-3" />
                  </button>
                  <StatusPill status={trial.enrollmentStatus} />
                </div>
                <h2 className="text-base font-bold text-gray-900 leading-snug">{trial.title}</h2>
              </div>
              <button onClick={onClose} className="ml-3 shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-700">{trial.phase}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{trial.location} ({trial.distance} mi)</span>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h4>
                <p className="text-sm text-gray-700 leading-relaxed">{trial.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Inclusion Criteria</h4>
                <ul className="space-y-1.5">
                  {trial.inclusionCriteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Exclusion Criteria</h4>
                <ul className="space-y-1.5">
                  {trial.exclusionCriteria.map((c, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Principal Investigator</h4>
                <p className="flex items-start gap-2 text-sm text-gray-700">
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  {trial.principalInvestigator}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Match Score Breakdown</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Diagnosis similarity', value: trial.scoreBreakdown.diagnosis, color: 'bg-blue-400' },
                    { label: 'Biomarker match', value: trial.scoreBreakdown.biomarker, color: 'bg-emerald-400' },
                    { label: 'Geographic score', value: trial.scoreBreakdown.location, color: 'bg-amber-400' },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-500">{label}</span>
                        <span className="text-xs font-bold text-gray-700">{value}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 50) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

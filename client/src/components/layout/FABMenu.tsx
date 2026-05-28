import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, UserPlus, CalendarDays, CheckSquare, Phone, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { AddNoteModal } from '../modals/AddNoteModal'
import { ContactModal } from '../modals/ContactModal'
import { NewPatientModal } from '../modals/NewPatientModal'
import { useAppState } from '../../context/AppStateContext'
import { patients as allStaticPatients } from '../../data/mockData'

type ActiveModal = 'note' | 'contact' | 'newPatient' | null

const FAB_ACTIONS = [
  { id: 'newPatient' as const, Icon: UserPlus, label: 'New Patient', bg: 'bg-indigo-500 hover:bg-indigo-600' },
  { id: 'schedule' as const, Icon: CalendarDays, label: 'Schedule Appointment', bg: 'bg-blue-500 hover:bg-blue-600' },
  { id: 'task' as const, Icon: CheckSquare, label: 'Add Task', bg: 'bg-emerald-500 hover:bg-emerald-600' },
  { id: 'contact' as const, Icon: Phone, label: 'Log Contact', bg: 'bg-amber-500 hover:bg-amber-600' },
  { id: 'note' as const, Icon: FileText, label: 'New Note', bg: 'bg-purple-500 hover:bg-purple-600' },
]

// ── FAB Note: includes its own patient selector ────────────────────────────────
function FABNoteModal({ onClose }: { onClose: () => void }) {
  const [patientId, setPatientId] = useState('')
  const patient = allStaticPatients.find((p) => p.id === patientId)
  const patientName = patient ? `${patient.firstName} ${patient.lastName}` : ''

  if (!patientId) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm rounded-2xl bg-white shadow-2xl p-6"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-base font-bold text-gray-900 mb-4">New Note — Select Patient</h2>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 mb-4"
            autoFocus
          >
            <option value="">Select patient…</option>
            {allStaticPatients.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
          <button
            onClick={onClose}
            className="w-full rounded-lg border border-gray-200 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <AddNoteModal
      patientId={patientId}
      patientName={patientName}
      onClose={onClose}
    />
  )
}

// ── Quick schedule picker ──────────────────────────────────────────────────────
function QuickSchedulePicker({
  onConfirm,
  onCancel,
}: {
  onConfirm: (patientId: string) => void
  onCancel: () => void
}) {
  const [patientId, setPatientId] = useState('')

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="fixed bottom-24 right-6 z-50 w-72 rounded-2xl bg-white shadow-2xl border border-gray-100 p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-sm font-bold text-gray-900 mb-3">Schedule Appointment</p>
      <select
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
        autoFocus
        className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100 mb-3"
      >
        <option value="">Select patient…</option>
        {allStaticPatients.map((p) => (
          <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => patientId && onConfirm(patientId)}
          disabled={!patientId}
          className="flex-1 rounded-lg bg-brand-500 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Open Scheduler
        </button>
      </div>
    </motion.div>
  )
}

// ── Quick task creator ─────────────────────────────────────────────────────────
function QuickTaskPanel({ onClose }: { onClose: () => void }) {
  const { addTask } = useAppState()
  const [title, setTitle] = useState('')
  const [patientId, setPatientId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  const [saving, setSaving] = useState(false)

  function handleAdd() {
    if (!title.trim() || !patientId || !dueDate) return
    setSaving(true)
    setTimeout(() => {
      const patient = allStaticPatients.find((p) => p.id === patientId)
      addTask({
        id: `task-fab-${Date.now()}`,
        title: title.trim(),
        patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
        patientInitials: patient?.initials ?? '??',
        dueDate,
        priority,
        assignedTo: 'Dr. Sarah Chen',
        status: 'pending',
      })
      toast.success('Task created successfully')
      setSaving(false)
      onClose()
    }, 300)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl bg-white shadow-2xl border border-gray-100 p-5"
      onClick={(e) => e.stopPropagation()}
    >
      <p className="text-sm font-bold text-gray-900 mb-3">New Task</p>
      <div className="space-y-2.5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title…"
          autoFocus
          className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <select
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="">Select patient…</option>
          {allStaticPatients.map((p) => (
            <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as typeof priority)}
            className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={!title.trim() || !patientId || !dueDate || saving}
            className="flex-1 rounded-lg bg-brand-500 py-2 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Adding…' : 'Create Task'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main FABMenu ───────────────────────────────────────────────────────────────
export function FABMenu() {
  const [open, setOpen] = useState(false)
  const [modal, setModal] = useState<ActiveModal>(null)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showTask, setShowTask] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  function closeAll() {
    setOpen(false)
    setShowSchedule(false)
    setShowTask(false)
  }

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!open && !showSchedule && !showTask) return
      if (containerRef.current?.contains(e.target as Node)) return
      closeAll()
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open, showSchedule, showTask])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeAll()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  function handleAction(id: (typeof FAB_ACTIONS)[number]['id']) {
    setOpen(false)
    setShowSchedule(false)
    setShowTask(false)
    switch (id) {
      case 'newPatient': setModal('newPatient'); break
      case 'schedule': setShowSchedule(true); break
      case 'task': setShowTask(true); break
      case 'contact': setModal('contact'); break
      case 'note': setModal('note'); break
    }
  }

  return (
    <>
      {/* Dim overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/25"
            onClick={closeAll}
          />
        )}
      </AnimatePresence>

      {/* Inline panels (schedule picker, task panel) */}
      <AnimatePresence>
        {showSchedule && (
          <QuickSchedulePicker
            onConfirm={(pid) => { setShowSchedule(false); navigate(`/scheduling/${pid}`) }}
            onCancel={() => setShowSchedule(false)}
          />
        )}
        {showTask && <QuickTaskPanel onClose={() => setShowTask(false)} />}
      </AnimatePresence>

      {/* FAB + stacked buttons */}
      <div ref={containerRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {open &&
            FAB_ACTIONS.map(({ id, Icon, label, bg }, idx) => (
              <motion.div
                key={id}
                initial={{ opacity: 0, x: 20, scale: 0.7 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.7 }}
                transition={{
                  delay: idx * 0.055,
                  type: 'spring',
                  stiffness: 450,
                  damping: 26,
                }}
                className="flex items-center gap-3"
              >
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ delay: idx * 0.055 + 0.05 }}
                  className="rounded-lg bg-gray-900/85 px-2.5 py-1 text-xs font-semibold text-white shadow-lg whitespace-nowrap backdrop-blur-sm"
                >
                  {label}
                </motion.span>
                <button
                  onClick={() => handleAction(id)}
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95 ${bg}`}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                </button>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Main FAB button */}
        <motion.button
          onClick={() => { setOpen((v) => !v); setShowSchedule(false); setShowTask(false) }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500 text-white shadow-xl hover:bg-brand-600 transition-colors"
          aria-label={open ? 'Close quick actions' : 'Open quick actions'}
        >
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      </div>

      {/* Full modals */}
      <AnimatePresence>
        {modal === 'newPatient' && <NewPatientModal onClose={() => setModal(null)} />}
        {modal === 'note' && <FABNoteModal onClose={() => setModal(null)} />}
        {modal === 'contact' && <ContactModal onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  )
}

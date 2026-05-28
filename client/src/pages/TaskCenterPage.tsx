import { useEffect, useState } from 'react'
import { Plus, X, Calendar, User2, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import type { Task, TaskStatus, TaskPriority } from '@healthstream/shared'
import { mockTasks, patients } from '../data/mockData'
import { Avatar } from '../components/common/Avatar'
import { EmptyState } from '../components/common/EmptyState'
import { PageTransition } from '../components/common/PageTransition'

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'pending', label: 'Pending', color: 'text-gray-600' },
  { id: 'in-progress', label: 'In Progress', color: 'text-amber-600' },
  { id: 'completed', label: 'Completed', color: 'text-emerald-600' },
]

const priorityClass: Record<TaskPriority, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
}

const colHeaderBg: Record<TaskStatus, string> = {
  pending: 'bg-gray-50',
  'in-progress': 'bg-amber-50',
  completed: 'bg-emerald-50',
}

function TaskCard({
  task,
  onMove,
  onClick,
}: {
  task: Task
  onMove: (id: string, status: TaskStatus) => void
  onClick: (task: Task) => void
}) {
  const statuses: TaskStatus[] = ['pending', 'in-progress', 'completed']
  const currentIdx = statuses.indexOf(task.status)

  return (
    <div
      onClick={() => onClick(task)}
      className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-brand-200 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-semibold text-gray-900 leading-snug">{task.title}</p>
        <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${priorityClass[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Avatar initials={task.patientInitials} size="sm" />
        <span className="text-xs text-gray-600 font-medium">{task.patientName}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {task.dueDate}
        </span>
        <span className="flex items-center gap-1">
          <User2 className="h-3 w-3" />
          {task.assignedTo.replace('Dr. ', '')}
        </span>
      </div>

      {/* Move buttons */}
      <div className="mt-3 flex gap-1.5" onClick={(e) => e.stopPropagation()}>
        {currentIdx > 0 && (
          <button
            onClick={() => onMove(task.id, statuses[currentIdx - 1])}
            className="flex-1 rounded-md border border-gray-200 py-1 text-[10px] font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            ← {COLUMNS[currentIdx - 1].label}
          </button>
        )}
        {currentIdx < statuses.length - 1 && (
          <button
            onClick={() => onMove(task.id, statuses[currentIdx + 1])}
            className="flex-1 rounded-md bg-brand-50 border border-brand-100 py-1 text-[10px] font-semibold text-brand-600 hover:bg-brand-100 transition-colors"
          >
            {COLUMNS[currentIdx + 1].label} →
          </button>
        )}
      </div>
    </div>
  )
}

interface NewTaskForm {
  title: string
  patientId: string
  dueDate: string
  priority: TaskPriority
  notes: string
}

const INITIAL_FORM: NewTaskForm = {
  title: '',
  patientId: '',
  dueDate: '',
  priority: 'medium',
  notes: '',
}

export function TaskCenterPage() {
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])
  const [showModal, setShowModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [form, setForm] = useState<NewTaskForm>(INITIAL_FORM)

  useEffect(() => {
    const t = setTimeout(() => {
      setTasks(mockTasks)
      setLoading(false)
    }, 500)
    return () => clearTimeout(t)
  }, [])

  function moveTask(id: string, newStatus: TaskStatus) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    )
    if (newStatus === 'completed') {
      toast.success('Task marked as completed')
    }
  }

  function addTask() {
    if (!form.title.trim() || !form.patientId || !form.dueDate) return
    const patient = patients.find((p) => p.id === form.patientId)
    const newTask: Task = {
      id: `task-new-${Date.now()}`,
      title: form.title,
      patientId: form.patientId,
      patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
      patientInitials: patient?.initials ?? '??',
      dueDate: form.dueDate,
      priority: form.priority,
      assignedTo: 'Dr. Sarah Chen',
      notes: form.notes,
      status: 'pending',
    }
    setTasks((prev) => [newTask, ...prev])
    setForm(INITIAL_FORM)
    setShowModal(false)
    toast.success('Task created successfully')
  }

  function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    setSelectedTask(null)
    toast('Task deleted', {
      icon: '🗑️',
      style: { background: '#fee2e2', color: '#dc2626' },
    })
  }

  const tasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status)

  return (
    <PageTransition>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Center</h1>
          <p className="mt-1 text-sm text-gray-500">Manage and track clinical tasks across your team</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          <Plus className="h-4 w-4" /> New Task
        </button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {COLUMNS.map((col) => {
          const colTasks = tasksByStatus(col.id)
          return (
            <div key={col.id} className="flex flex-col gap-3">
              <div className={`rounded-lg ${colHeaderBg[col.id]} px-4 py-2.5 flex items-center justify-between`}>
                <span className={`text-sm font-bold ${col.color}`}>{col.label}</span>
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-gray-600 shadow-sm">
                  {loading ? '…' : colTasks.length}
                </span>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
                  ))}
                </div>
              ) : colTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-white">
                  <EmptyState title="No tasks" description="Nothing here yet." />
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onMove={moveTask} onClick={setSelectedTask} />
                ))
              )}
            </div>
          )
        })}
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">New Task</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  placeholder="Task title…"
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Patient *</label>
                <select
                  value={form.patientId}
                  onChange={(e) => setForm((f) => ({ ...f, patientId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                >
                  <option value="">Select patient…</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Due Date *</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as TaskPriority }))}
                    className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  placeholder="Optional notes…"
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 py-2 px-3 text-sm resize-none focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addTask}
                disabled={!form.title.trim() || !form.patientId || !form.dueDate}
                className="px-4 py-2 rounded-lg bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setSelectedTask(null)}>
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0 mr-3">
                <h2 className="text-base font-bold text-gray-900">{selectedTask.title}</h2>
                <span className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${priorityClass[selectedTask.priority]}`}>
                  {selectedTask.priority} priority
                </span>
              </div>
              <button onClick={() => setSelectedTask(null)} className="text-gray-400 hover:text-gray-600 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            <dl className="space-y-3 text-sm mb-5">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-gray-400 shrink-0" />
                <dt className="text-gray-500 w-24 shrink-0">Patient</dt>
                <dd className="font-medium text-gray-800">{selectedTask.patientName}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <dt className="text-gray-500 w-24 shrink-0">Due Date</dt>
                <dd className="font-medium text-gray-800">{selectedTask.dueDate}</dd>
              </div>
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-gray-400 shrink-0" />
                <dt className="text-gray-500 w-24 shrink-0">Assigned To</dt>
                <dd className="font-medium text-gray-800">{selectedTask.assignedTo}</dd>
              </div>
              {selectedTask.notes && (
                <div className="flex gap-2">
                  <AlertCircle className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                    <dt className="text-gray-500 mb-0.5">Notes</dt>
                    <dd className="text-gray-700 leading-relaxed">{selectedTask.notes}</dd>
                  </div>
                </div>
              )}
            </dl>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => deleteTask(selectedTask.id)}
                className="px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-lg bg-brand-500 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  )
}

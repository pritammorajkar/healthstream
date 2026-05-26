import { useEffect, useRef } from 'react'
import { UserCircle, CalendarDays, FileText, CheckCircle2, X } from 'lucide-react'

interface PatientActionMenuProps {
  patientName: string
  onClose: () => void
}

const actions = [
  { icon: UserCircle, label: 'View Full Profile' },
  { icon: CalendarDays, label: 'Schedule Care' },
  { icon: FileText, label: 'Add Note' },
  { icon: CheckCircle2, label: 'Mark as Contacted' },
]

export function PatientActionMenu({ patientName, onClose }: PatientActionMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-gray-100 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <span className="text-xs font-semibold text-gray-500 truncate">{patientName}</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="ml-2 shrink-0 rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <ul className="py-1">
        {actions.map(({ icon: Icon, label }) => (
          <li key={label}>
            <button
              type="button"
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#1B3F8B] transition-colors"
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

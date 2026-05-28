import { useEffect, useRef } from 'react'
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import type { Notification, NotificationType } from '@healthstream/shared'

interface NotificationPanelProps {
  notifications: Notification[]
  onClose: () => void
}

const typeConfig: Record<NotificationType, { icon: typeof Info; iconClass: string; dot: string }> = {
  alert:   { icon: AlertCircle,  iconClass: 'text-red-500',     dot: 'bg-red-500' },
  info:    { icon: Info,         iconClass: 'text-blue-500',    dot: 'bg-blue-500' },
  success: { icon: CheckCircle2, iconClass: 'text-emerald-500', dot: 'bg-emerald-500' },
}

export function NotificationPanel({ notifications, onClose }: NotificationPanelProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [onClose])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-50 mt-2 w-96 rounded-xl border border-gray-100 bg-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-900">Notifications</span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notifications"
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* List */}
      <ul className="max-h-[420px] divide-y divide-gray-50 overflow-y-auto">
        {notifications.map((n) => {
          const { icon: Icon, iconClass, dot } = typeConfig[n.type]
          return (
            <li
              key={n.id}
              className={`flex gap-3 px-5 py-4 transition-colors hover:bg-gray-50 ${
                !n.read ? 'bg-brand-50/40' : ''
              }`}
            >
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconClass}`} strokeWidth={2} />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-900 leading-snug">{n.title}</p>
                  <span className="shrink-0 text-[11px] text-gray-400">{n.time}</span>
                </div>
                <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">{n.description}</p>
              </div>
              {!n.read && (
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${dot}`} />
              )}
            </li>
          )
        })}
      </ul>

      {/* Footer */}
      <div className="border-t border-gray-100 px-5 py-3">
        <button
          type="button"
          className="text-xs font-semibold text-brand-500 hover:underline"
        >
          Mark all as read
        </button>
      </div>
    </div>
  )
}

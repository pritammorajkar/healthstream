import { useState } from 'react'
import { Bell, User } from 'lucide-react'
import { mockNotifications } from '../../data/mockData'
import { NotificationPanel } from './NotificationPanel'

export function TopHeader() {
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = mockNotifications.filter((n) => !n.read).length

  return (
    <header className="flex h-16 items-center gap-4 px-8 bg-white border-b border-gray-200">
      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            {unread > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <NotificationPanel
              notifications={mockNotifications}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        <button
          type="button"
          aria-label="Profile"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
        >
          <User className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}

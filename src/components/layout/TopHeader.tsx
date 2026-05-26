import { useState } from 'react'
import { Bell, Search, User } from 'lucide-react'
import { mockNotifications } from '../../data/mockData'
import { NotificationPanel } from './NotificationPanel'

interface TopHeaderProps {
  onSearch?: (query: string) => void
}

export function TopHeader({ onSearch }: TopHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = mockNotifications.filter((n) => !n.read).length

  return (
    <header className="flex h-16 items-center gap-4 px-8 bg-white border-b border-gray-200">
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-2xl">
          <Search
            className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            strokeWidth={2.25}
          />
          <input
            type="text"
            placeholder="Search patients, registry or ID..."
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full rounded-full border border-gray-100 bg-white py-2.5 pl-12 pr-4 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm focus:border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notification bell */}
        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={() => setNotifOpen((o) => !o)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" strokeWidth={2} />
            {unread > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {notifOpen && (
            <NotificationPanel
              notifications={mockNotifications}
              onClose={() => setNotifOpen(false)}
            />
          )}
        </div>

        {/* Profile icon */}
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

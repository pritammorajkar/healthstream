import { ShieldPlus } from 'lucide-react'
import {
  appBranding,
  currentUser,
  navLinks,
  secondaryLinks,
  type NavLink,
} from '../../data/mockData'

interface SidebarProps {
  activeId?: string
  onNavigate?: (id: string) => void
}

export function Sidebar({ activeId = 'dashboard', onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 flex-col border-r border-gray-100 bg-white">
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 shadow-sm">
          <ShieldPlus className="h-5 w-5 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-blue-600">{appBranding.name}</span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
            {appBranding.subtitle}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 pt-2">
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <SidebarItem
              key={link.id}
              link={link}
              isActive={link.id === activeId}
              onClick={() => onNavigate?.(link.id)}
            />
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-4">
        <ul className="space-y-1 border-t border-gray-100 pt-4">
          {secondaryLinks.map((link) => (
            <SidebarItem
              key={link.id}
              link={link}
              isActive={false}
              onClick={() => onNavigate?.(link.id)}
            />
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 px-4 py-4">
        <Avatar />
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-gray-900">{currentUser.name}</span>
          <span className="text-xs text-gray-500">{currentUser.role}</span>
        </div>
      </div>
    </aside>
  )
}

interface SidebarItemProps {
  link: NavLink
  isActive: boolean
  onClick: () => void
}

function SidebarItem({ link, isActive, onClick }: SidebarItemProps) {
  const Icon = link.icon
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
          isActive
            ? 'bg-blue-50 font-semibold text-blue-600'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className="h-5 w-5 shrink-0" strokeWidth={isActive ? 2.25 : 2} />
        <span>{link.label}</span>
        {isActive && (
          <span
            aria-hidden
            className="absolute right-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-l bg-blue-600"
          />
        )}
      </button>
    </li>
  )
}

function Avatar() {
  if (currentUser.avatarUrl) {
    return (
      <img
        src={currentUser.avatarUrl}
        alt={currentUser.name}
        className="h-10 w-10 rounded-full object-cover"
      />
    )
  }
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
      {currentUser.initials}
    </div>
  )
}

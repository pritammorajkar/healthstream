import { NavLink } from 'react-router-dom'
import { BrandLogo } from '../common/BrandLogo'
import {
  currentUser,
  navLinks,
  secondaryLinks,
  type NavLink as NavLinkType,
} from '../../data/mockData'

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col bg-white border-r border-gray-100 shadow-sm">
      <div className="h-1 w-full bg-brand-500 shrink-0" />

      <div className="flex items-center px-5 py-4 border-b border-gray-100">
        <BrandLogo size={38} showAppName />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pt-3">
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400">
          Navigation
        </p>
        <ul className="space-y-0.5">
          {navLinks.map((link) => (
            <SidebarItem key={link.id} link={link} />
          ))}
        </ul>
      </nav>

      <div className="px-3 pb-3 border-t border-gray-100 pt-3">
        <ul className="space-y-0.5">
          {secondaryLinks.map((link) => (
            <SidebarItem key={link.id} link={link} />
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3 border-t border-gray-100 px-4 py-3 bg-gray-50/60">
        <UserAvatar />
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-gray-900">{currentUser.name}</span>
          <span className="text-xs text-gray-500">{currentUser.role}</span>
        </div>
      </div>
    </aside>
  )
}

function SidebarItem({ link }: { link: NavLinkType }) {
  const Icon = link.icon
  return (
    <li>
      <NavLink
        to={link.href}
        end={link.href === '/'}
        className={({ isActive }) =>
          `relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive
              ? 'bg-brand-50 text-brand-600'
              : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-brand-500' : 'text-gray-400'}`}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span className={isActive ? 'font-semibold' : ''}>{link.label}</span>
            {isActive && (
              <span
                aria-hidden
                className="absolute right-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-l-full bg-brand-500"
              />
            )}
          </>
        )}
      </NavLink>
    </li>
  )
}

function UserAvatar() {
  if (currentUser.avatarUrl) {
    return (
      <img
        src={currentUser.avatarUrl}
        alt={currentUser.name}
        className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-brand-100"
      />
    )
  }
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
      {currentUser.initials}
    </div>
  )
}

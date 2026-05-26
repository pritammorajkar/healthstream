import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

interface AppShellProps {
  children: ReactNode
  activeId?: string
  onNavigate?: (id: string) => void
  onSearch?: (query: string) => void
}

export function AppShell({ children, activeId, onNavigate, onSearch }: AppShellProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeId={activeId} onNavigate={onNavigate} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader onSearch={onSearch} />
        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
      </div>
    </div>
  )
}

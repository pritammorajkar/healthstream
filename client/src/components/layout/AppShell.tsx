import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'
import { FABMenu } from './FABMenu'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopHeader />
        <main className="flex-1 overflow-y-auto px-8 py-6">{children}</main>
      </div>
      <FABMenu />
    </div>
  )
}

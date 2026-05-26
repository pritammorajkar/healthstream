import { useState } from 'react'
import { AppShell } from './components/layout'
import { Dashboard } from './components/dashboard'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <AppShell activeId="dashboard" onSearch={setSearchQuery}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clinical Command Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          Population Health Management overview for Region 4 Clinical Hub. Last synced: 2m ago.
        </p>
      </div>
      <Dashboard searchQuery={searchQuery} />
    </AppShell>
  )
}

export default App

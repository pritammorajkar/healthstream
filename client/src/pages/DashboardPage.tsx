import { PageTransition } from '../components/common/PageTransition'
import { Dashboard } from '../components/dashboard'

export function DashboardPage() {
  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Clinical Command Center</h1>
        <p className="mt-1 text-sm text-gray-500">
          Population Health Management overview for Region 4 Clinical Hub. Last synced: 2m ago.
        </p>
      </div>
      <Dashboard />
    </PageTransition>
  )
}

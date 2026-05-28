import { useNavigate } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'
import { PageTransition } from '../components/common/PageTransition'

export function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <PageTransition>
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <AlertTriangle className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="text-6xl font-bold text-gray-200 mb-3">404</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Page not found</h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
        >
          <Home className="h-4 w-4" /> Back to Dashboard
        </button>
      </div>
    </PageTransition>
  )
}

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { AppShell } from './components/layout'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { AppStateProvider } from './context/AppStateContext'
import { DashboardPage } from './pages/DashboardPage'
import { RegistryPage } from './pages/RegistryPage'
import { PatientProfilePage } from './pages/PatientProfilePage'
import { InsightsPage } from './pages/InsightsPage'
import { TaskCenterPage } from './pages/TaskCenterPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { MatchingPage } from './pages/MatchingPage'
import { SchedulingPage } from './pages/SchedulingPage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/registry" element={<RegistryPage />} />
        <Route path="/registry/:patientId" element={<PatientProfilePage />} />
        <Route path="/matching" element={<MatchingPage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/tasks" element={<TaskCenterPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/scheduling/:patientId" element={<SchedulingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppStateProvider>
          <AppShell>
            <AnimatedRoutes />
          </AppShell>
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                borderRadius: '12px',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#14b8a6', secondary: '#fff' },
              },
            }}
          />
        </AppStateProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

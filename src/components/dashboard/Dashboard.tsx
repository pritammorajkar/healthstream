import { useEffect, useMemo, useState } from 'react'
import { Users, ClipboardCheck, CalendarDays } from 'lucide-react'
import type { DashboardStats, PatientFlow, Patient, CareStreamEvent } from '../../types'
import {
  getDashboardStats,
  getPatientFlow,
  getPatients,
  getCareStreamEvents,
} from '../../services/dashboardService'
import { useDebounce } from '../../hooks/useDebounce'
import { StatCard } from './StatCard'
import { PatientFlowFunnel } from './PatientFlowFunnel'
import { HighImpactRegistry } from './HighImpactRegistry'
import { CareStream } from './CareStream'

interface DashboardProps {
  searchQuery?: string
}

export function Dashboard({ searchQuery = '' }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [flow, setFlow] = useState<PatientFlow | null>(null)
  const [allPatients, setAllPatients] = useState<Patient[]>([])
  const [events, setEvents] = useState<CareStreamEvent[]>([])
  const [loading, setLoading] = useState(true)

  const debouncedQuery = useDebounce(searchQuery, 300)

  useEffect(() => {
    Promise.all([
      getDashboardStats(),
      getPatientFlow(),
      getPatients(),
      getCareStreamEvents(),
    ]).then(([s, f, p, e]) => {
      setStats(s)
      setFlow(f)
      setAllPatients(p)
      setEvents(e)
      setLoading(false)
    })
  }, [])

  const filteredPatients = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return allPatients
    return allPatients.filter(
      (p) =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    )
  }, [allPatients, debouncedQuery])

  const isSearching = debouncedQuery.trim().length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Active Cases"
          value={stats?.activeCases ?? 0}
          subtext=""
          trend={stats?.activeCasesTrend}
          icon={Users}
          loading={loading}
        />
        <StatCard
          label="Closed Gaps"
          value={stats?.closedGaps ?? 0}
          subtext={`Goal: ${stats?.closedGapsGoal.toLocaleString() ?? ''}`}
          subtextIcon="⊙"
          icon={ClipboardCheck}
          loading={loading}
        />
        <StatCard
          label="Scheduled Care"
          value={stats?.scheduledCare ?? 0}
          subtext={stats?.scheduledCareWindow ?? ''}
          subtextIcon="⊙"
          icon={CalendarDays}
          loading={loading}
        />
      </div>

      <PatientFlowFunnel data={flow} loading={loading} />

      <div className="grid grid-cols-[1fr_320px] gap-4">
        <HighImpactRegistry
          patients={filteredPatients}
          loading={loading}
          isSearching={isSearching}
          totalCount={allPatients.length}
        />
        <CareStream events={events} loading={loading} />
      </div>
    </div>
  )
}

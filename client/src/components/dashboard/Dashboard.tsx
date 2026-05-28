import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, ClipboardCheck, CalendarDays, FlaskConical, ArrowRight } from 'lucide-react'
import type { DashboardStats, PatientFlow } from '@healthstream/shared'
import { getDashboardStats, getPatientFlow } from '../../services/dashboardService'
import { useAppState } from '../../context/AppStateContext'
import { StatCard } from './StatCard'
import { PatientFlowFunnel } from './PatientFlowFunnel'
import { HighImpactRegistry } from './HighImpactRegistry'
import { CareStream } from './CareStream'

function TrialMatchBanner() {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-between rounded-xl bg-brand-500 px-5 py-3.5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
          <FlaskConical className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            5 patients have new trial matches this week
          </p>
          <p className="text-xs text-brand-100 mt-0.5">
            Based on updated biomarker profiles and new enrolling trials
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate('/matching')}
        className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
      >
        Review Matches
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Dashboard() {
  const { patients: allPatients, careStreamEvents: events } = useAppState()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [flow, setFlow] = useState<PatientFlow | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboardStats(), getPatientFlow()]).then(([s, f]) => {
      setStats(s)
      setFlow(f)
      setLoading(false)
    })
  }, [])

  const highImpactPatients = useMemo(
    () => allPatients.filter((p) => p.risk === 'high').slice(0, 5),
    [allPatients]
  )

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
          progressPct={75}
        />
        <StatCard
          label="Closed Gaps"
          value={stats?.closedGaps ?? 0}
          subtext={`Goal: ${stats?.closedGapsGoal.toLocaleString() ?? ''}`}
          subtextIcon="⊙"
          icon={ClipboardCheck}
          loading={loading}
          progressPct={Math.round(((stats?.closedGaps ?? 0) / (stats?.closedGapsGoal ?? 1)) * 100)}
        />
        <StatCard
          label="Scheduled Care"
          value={stats?.scheduledCare ?? 0}
          subtext={stats?.scheduledCareWindow ?? ''}
          subtextIcon="⊙"
          icon={CalendarDays}
          loading={loading}
          progressPct={55}
        />
      </div>

      <TrialMatchBanner />

      <PatientFlowFunnel data={flow} loading={loading} />

      <div className="grid grid-cols-[1fr_320px] gap-4">
        <HighImpactRegistry
          patients={highImpactPatients}
          loading={loading}
          isSearching={false}
          totalCount={allPatients.length}
        />
        <CareStream events={events} loading={loading} />
      </div>
    </div>
  )
}

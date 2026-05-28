import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts'
import { Users, TrendingUp, ClipboardCheck, ShieldCheck } from 'lucide-react'
import { StatCard } from '../components/dashboard/StatCard'
import { PageTransition } from '../components/common/PageTransition'
import {
  insightsStats,
  patientFlowTrend,
  riskDistribution,
  careGapMonthly,
  hccDistribution,
} from '../data/mockData'
import type { PatientFlowWeek, CareGapMonth, HccBucket } from '@healthstream/shared'

type DateRange = '7d' | '30d' | '90d'

function ChartSkeleton() {
  return <div className="h-full w-full rounded-lg bg-gray-100 animate-pulse" />
}

function sampleByRange(data: PatientFlowWeek[], range: DateRange): PatientFlowWeek[] {
  if (range === '7d') return data.slice(-2)
  if (range === '30d') return data.slice(-4)
  return data
}

function scaleCareGap(data: CareGapMonth[], range: DateRange): CareGapMonth[] {
  if (range === '7d') return data.slice(-1)
  if (range === '30d') return data.slice(-3)
  return data
}

function scaleHcc(data: HccBucket[], _: DateRange): HccBucket[] {
  return data
}

export function InsightsPage() {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>('90d')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 700)
    return () => clearTimeout(t)
  }, [])

  const flowData = sampleByRange(patientFlowTrend, dateRange)
  const gapData = scaleCareGap(careGapMonthly, dateRange)
  const hccData = scaleHcc(hccDistribution, dateRange)

  return (
    <PageTransition>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Insights</h1>
          <p className="mt-1 text-sm text-gray-500">Population health analytics for Region 4 Clinical Hub</p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
          {(['7d', '30d', '90d'] as DateRange[]).map((r) => (
            <button
              key={r}
              onClick={() => setDateRange(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                dateRange === r ? 'bg-brand-500 text-white' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {r === '7d' ? 'Last 7 days' : r === '30d' ? 'Last 30 days' : 'Last 90 days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard label="Total Patients" value={insightsStats.totalPatients} subtext="Active cases" icon={Users} loading={loading} progressPct={100} />
        <StatCard label="Avg HCC Score" value={Number(insightsStats.avgHccScore.toFixed(1))} subtext="Population average" icon={TrendingUp} loading={loading} progressPct={Math.round((insightsStats.avgHccScore / 4) * 100)} />
        <StatCard label="Care Gaps Closed" value={insightsStats.careGapsClosed} subtext="Goal: 1,000" subtextIcon="⊙" icon={ClipboardCheck} loading={loading} progressPct={Math.round((insightsStats.careGapsClosed / 1000) * 100)} />
        <StatCard label="Stabilization Rate" value={insightsStats.stabilizationRate} subtext="% of cohort stabilized" subtextIcon="%" icon={ShieldCheck} loading={loading} progressPct={insightsStats.stabilizationRate} />
      </div>

      {/* Row 1 */}
      <div className="mb-5 grid grid-cols-2 gap-5">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Patient Flow Over Time</h3>
          <p className="text-xs text-gray-400 mb-4">Weekly patient count across care stages</p>
          <div className="h-60">
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flowData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Line type="monotone" dataKey="identified" stroke="#f58220" strokeWidth={2} dot={false} name="Identified" />
                  <Line type="monotone" dataKey="outreach" stroke="#f59e0b" strokeWidth={2} dot={false} name="Outreach" />
                  <Line type="monotone" dataKey="carePlan" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Care Plan" />
                  <Line type="monotone" dataKey="stabilized" stroke="#14b8a6" strokeWidth={2} dot={false} name="Stabilized" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Risk Distribution</h3>
          <p className="text-xs text-gray-400 mb-4">Breakdown of population by risk tier</p>
          <div className="h-60 flex items-center">
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                  >
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-5">
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-1">Care Gap Closure Rate</h3>
          <p className="text-xs text-gray-400 mb-4">Monthly gaps closed vs target</p>
          <div className="h-60">
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gapData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="closed" fill="#f58220" radius={[4, 4, 0, 0]} name="Closed" />
                  <Bar dataKey="goal" fill="#ffecdd" radius={[4, 4, 0, 0]} name="Goal" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-bold text-gray-700 mb-1">HCC Score Distribution</h3>
          <p className="text-xs text-gray-400 mb-4">Patients by RAF score range</p>
          <div className="h-60">
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hccData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 12 }} />
                  <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]}>
                    {hccData.map((entry) => (
                      <Cell
                        key={entry.range}
                        fill={
                          entry.range === '> 3.0' || entry.range === '2.5–3.0' || entry.range === '2.0–2.5' ? '#ef4444' :
                          entry.range === '1.5–2.0' ? '#f59e0b' : '#14b8a6'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

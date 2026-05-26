import { ChevronRight, ShieldCheck } from 'lucide-react'
import type { PatientFlow } from '../../types'

interface PatientFlowFunnelProps {
  data: PatientFlow | null
  loading?: boolean
}

interface StageProps {
  count: number
  label: string
  variant: 'identified' | 'outreach' | 'carePlan' | 'stabilized'
}

const stageStyles: Record<StageProps['variant'], string> = {
  identified: 'bg-blue-50 border-l-4 border-[#1B3F8B] text-[#1B3F8B]',
  outreach: 'bg-slate-100 text-slate-700',
  carePlan: 'bg-slate-200 text-slate-700',
  stabilized: 'bg-[#2D6A4F] text-white',
}

function Stage({ count, label, variant }: StageProps) {
  const isStabilized = variant === 'stabilized'
  return (
    <div className={`flex-1 rounded-xl p-5 flex flex-col gap-1 ${stageStyles[variant]}`}>
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold">{count}</span>
        {isStabilized && <ShieldCheck className="h-5 w-5 opacity-80" />}
      </div>
      <span
        className={`text-xs font-semibold uppercase tracking-widest ${
          isStabilized ? 'text-green-200' : 'text-gray-500'
        }`}
      >
        {label}
      </span>
    </div>
  )
}

export function PatientFlowFunnel({ data, loading = false }: PatientFlowFunnelProps) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Patient Flow Analytics</h2>
          <p className="text-sm text-gray-500 mt-0.5">Real-time cohort movement through care stages</p>
        </div>
        <button className="text-sm text-[#1B3F8B] font-medium hover:underline whitespace-nowrap flex items-center gap-1">
          View Detailed Report <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {loading || !data ? (
        <div className="flex gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex-1 h-20 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Stage count={data.identified} label="Identified" variant="identified" />
          <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
          <Stage count={data.outreach} label="Outreach" variant="outreach" />
          <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
          <Stage count={data.carePlan} label="Care Plan" variant="carePlan" />
          <ChevronRight className="h-5 w-5 text-gray-400 shrink-0" />
          <Stage count={data.stabilized} label="Stabilized" variant="stabilized" />
        </div>
      )}
    </div>
  )
}

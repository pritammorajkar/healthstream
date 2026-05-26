import { Plus } from 'lucide-react'
import type { CareStreamEvent, CareStreamEventType } from '../../types'
import { EmptyState } from '../common/EmptyState'

interface CareStreamProps {
  events: CareStreamEvent[]
  loading?: boolean
}

const typeConfig: Record<CareStreamEventType, { dot: string; label: string; labelClass: string }> = {
  success: {
    dot: 'bg-emerald-500',
    label: 'SUCCESS',
    labelClass: 'text-emerald-600',
  },
  critical: {
    dot: 'bg-blue-500',
    label: 'CRITICAL TASK',
    labelClass: 'text-blue-600',
  },
  info: {
    dot: 'bg-gray-400',
    label: 'INFO',
    labelClass: 'text-gray-500',
  },
}

function EventItem({ event }: { event: CareStreamEvent }) {
  const config = typeConfig[event.type]
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${config.dot}`} />
        <div className="flex-1 w-px bg-gray-100 mt-1" />
      </div>
      <div className="pb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <span className={`text-[10px] font-bold uppercase tracking-widest ${config.labelClass}`}>
            {config.label}
          </span>
          <span className="text-xs text-gray-400">{event.timestamp}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900">{event.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{event.description}</p>
      </div>
    </div>
  )
}

export function CareStream({ events, loading = false }: CareStreamProps) {
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Care Stream</h2>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-2.5 w-2.5 rounded-full bg-gray-200 mt-1.5 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-16 bg-gray-200 rounded" />
                <div className="h-3 w-32 bg-gray-100 rounded" />
                <div className="h-3 w-48 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <EmptyState title="No events" description="No recent care stream activity." />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {events.map((event) => (
            <EventItem key={event.id} event={event} />
          ))}
        </div>
      )}

      <button
        className="mt-4 self-end h-12 w-12 rounded-full bg-[#1B3F8B] text-white flex items-center justify-center shadow-lg hover:bg-[#163272] transition-colors"
        aria-label="Add care event"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  )
}

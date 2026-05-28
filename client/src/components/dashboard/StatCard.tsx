import { useEffect, useRef } from 'react'
import { animate } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: number
  subtext: string
  subtextIcon?: string
  trend?: number
  icon: LucideIcon
  loading?: boolean
  progressPct?: number
}

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const controls = animate(0, value, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate(v) {
        node.textContent = Math.round(v).toLocaleString()
      },
    })
    return () => controls.stop()
  }, [value])

  return (
    <p ref={ref} className="text-4xl font-bold text-gray-900 leading-none">
      {value.toLocaleString()}
    </p>
  )
}

export function StatCard({
  label,
  value,
  subtext,
  subtextIcon,
  trend,
  icon: Icon,
  loading = false,
  progressPct = 70,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
        <div className="h-8 w-20 bg-gray-200 rounded mb-2" />
        <div className="h-3 w-32 bg-gray-100 rounded" />
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">
          {label}
        </span>
        <Icon className="h-5 w-5 text-brand-500" strokeWidth={1.75} />
      </div>

      <AnimatedNumber value={value} />

      <div className="flex items-center gap-1.5 text-sm">
        {trend !== undefined ? (
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current">
              <path d="M1 11 L6 6 L10 9 L15 3" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {trend}% from last month
          </span>
        ) : (
          <span className="text-gray-500 flex items-center gap-1">
            {subtextIcon && <span>{subtextIcon}</span>}
            {subtext}
          </span>
        )}
      </div>

      <div className="mt-2 h-1 w-full rounded-full bg-brand-100">
        <div className="h-1 rounded-full bg-brand-500" style={{ width: `${progressPct}%` }} />
      </div>
    </div>
  )
}

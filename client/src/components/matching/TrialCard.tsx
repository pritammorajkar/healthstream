import { MapPin, Info } from 'lucide-react'
import type { ClinicalTrialFull } from '@healthstream/shared'

interface TrialCardProps {
  trial: ClinicalTrialFull
  onViewDetails: (trial: ClinicalTrialFull) => void
}

function ScoreBadge({ score }: { score: number }) {
  const cls =
    score >= 90 ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
    score >= 70 ? 'bg-blue-100 text-blue-700 border border-blue-200' :
    score >= 50 ? 'bg-amber-100 text-amber-700 border border-amber-200' :
    'bg-gray-100 text-gray-500 border border-gray-200'

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>
      {score}% MATCH
    </span>
  )
}

function PhaseBadge({ phase }: { phase: string }) {
  const cls =
    phase.includes('III') ? 'bg-purple-100 text-purple-700' :
    phase.includes('II') ? 'bg-blue-100 text-blue-700' :
    'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${cls}`}>
      {phase}
    </span>
  )
}

export function TrialCard({ trial, onViewDetails }: TrialCardProps) {
  const { diagnosis, biomarker, location } = trial.scoreBreakdown
  return (
    <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-4 hover:border-brand-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <ScoreBadge score={trial.matchScore} />
          <span className="font-mono text-[11px] text-gray-400">{trial.id}</span>
        </div>
        <div className="relative group shrink-0">
          <Info className="h-4 w-4 text-gray-300 hover:text-gray-500 cursor-help transition-colors" />
          <div className="pointer-events-none absolute right-0 top-6 z-20 hidden w-52 rounded-lg bg-gray-900 p-3 text-[11px] text-white shadow-xl group-hover:block">
            <p className="font-semibold mb-1 text-gray-200">Score Breakdown</p>
            <p>Diagnosis match: <span className="font-bold text-white">{diagnosis}%</span></p>
            <p>Biomarker match: <span className="font-bold text-white">{biomarker}%</span></p>
            <p>Location score: <span className="font-bold text-white">{location}%</span></p>
            <div className="mt-1.5 pt-1.5 border-t border-gray-700 text-gray-400 text-[10px]">
              M_s = w_d·Sim(D) + w_b·Match(B) − w_g·GeoDist(G)
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{trial.title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{trial.description}</p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <PhaseBadge phase={trial.phase} />
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="h-3 w-3" />
            {trial.location} ({trial.distance} mi)
          </span>
        </div>
        <button
          onClick={() => onViewDetails(trial)}
          className="shrink-0 rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  )
}

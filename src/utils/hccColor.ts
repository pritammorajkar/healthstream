/** Returns Tailwind badge classes based on CLAUDE.md HCC score thresholds. */
export function hccColor(score: number): string {
  if (score >= 2.0) return 'bg-red-100 text-red-700'
  if (score >= 1.5) return 'bg-amber-100 text-amber-700'
  return 'bg-green-100 text-green-700'
}

interface BrandLogoProps {
  /** Icon size in px — applies to both width and height of the mark */
  size?: number
  showAppName?: boolean
}

export function BrandLogo({ size = 38, showAppName = true }: BrandLogoProps) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/branding/bacancy-logo-without-name.png"
        alt="Bacancy"
        width={size}
        height={size}
        className="shrink-0 object-contain"
      />
      {showAppName && (
        <div className="flex flex-col leading-tight">
          <span className="font-display text-sm font-bold tracking-wide text-brand-500 whitespace-nowrap">
            Bacancy HealthStream
          </span>
          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-400">
            PHM DESKTOP
          </span>
        </div>
      )}
    </div>
  )
}

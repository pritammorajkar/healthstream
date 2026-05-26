interface EmptyStateProps {
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function EmptyState({
  title = 'No data',
  description = 'Nothing to display at this time.',
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-3 text-gray-300">{icon}</div>}
      <p className="text-sm font-semibold text-gray-500">{title}</p>
      <p className="mt-1 text-xs text-gray-400">{description}</p>
    </div>
  )
}

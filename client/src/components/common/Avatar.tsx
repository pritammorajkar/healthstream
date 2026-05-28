interface AvatarProps {
  initials: string
  imageUrl?: string
  size?: 'sm' | 'md'
  className?: string
}

export function Avatar({ initials, imageUrl, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm'

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={initials}
        className={`${sizeClasses} rounded-full object-cover shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 shrink-0 ${className}`}
    >
      {initials}
    </div>
  )
}

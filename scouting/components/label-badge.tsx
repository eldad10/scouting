import { getLabelConfig, getCategoryLabel, type LabelPhase } from '@/lib/label-config'

interface LabelBadgeProps {
  label: string
  phase: LabelPhase
  onRemove?: () => void
  showCategory?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function LabelBadge({
  label,
  phase,
  onRemove,
  showCategory = false,
  size = 'md'
}: LabelBadgeProps) {
  const config = getLabelConfig(label, phase)
  const categoryLabel = getCategoryLabel(config.category)

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const borderClasses = {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl'
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2 font-medium border-2 transition-all
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${sizeClasses[size]} ${borderClasses[size]}
        ${onRemove ? 'cursor-pointer hover:shadow-md hover:scale-105' : ''}
      `}
      onClick={onRemove}
      title={showCategory ? categoryLabel : undefined}
    >
      {config.icon && <span className="font-bold">{config.icon}</span>}
      <span>{label}</span>
      {showCategory && (
        <span className={`ml-1 px-1.5 py-0.5 rounded text-xs font-bold bg-white/30`}>
          {categoryLabel}
        </span>
      )}
      {onRemove && <span className="ml-1 font-bold cursor-pointer hover:opacity-70">×</span>}
    </div>
  )
}

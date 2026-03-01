// Label configuration with colors and categories for visual distinction

export type LabelPhase = 'auto' | 'teleop'
export type LabelCategory = 'performance' | 'issue' | 'mechanic' | 'custom'

export interface LabelConfig {
  label: string
  phase: LabelPhase
  category: LabelCategory
  bgColor: string
  textColor: string
  borderColor: string
  icon?: string
}

// Auto phase labels - Blue theme
export const AUTO_LABELS: LabelConfig[] = [
  {
    label: 'Crossed to middle of field',
    phase: 'auto',
    category: 'mechanic',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-900 dark:text-blue-100',
    borderColor: 'border-blue-300 dark:border-blue-700',
    icon: '→'
  },
  {
    label: 'Collected from human player',
    phase: 'auto',
    category: 'performance',
    bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
    textColor: 'text-cyan-900 dark:text-cyan-100',
    borderColor: 'border-cyan-300 dark:border-cyan-700',
    icon: '◆'
  },
  {
    label: 'Collected from depot',
    phase: 'auto',
    category: 'performance',
    bgColor: 'bg-sky-100 dark:bg-sky-900/30',
    textColor: 'text-sky-900 dark:text-sky-100',
    borderColor: 'border-sky-300 dark:border-sky-700',
    icon: '◇'
  },
  {
    label: 'Interfered with other robot',
    phase: 'auto',
    category: 'issue',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-900 dark:text-red-100',
    borderColor: 'border-red-300 dark:border-red-700',
    icon: '⚠'
  },
  {
    label: 'Robot not working in auto',
    phase: 'auto',
    category: 'issue',
    bgColor: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-900 dark:text-orange-100',
    borderColor: 'border-orange-300 dark:border-orange-700',
    icon: '✗'
  }
]

// Teleop phase labels - Green/Purple theme
export const TELEOP_LABELS: LabelConfig[] = [
  {
    label: 'Interfered with team robot',
    phase: 'teleop',
    category: 'issue',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-900 dark:text-red-100',
    borderColor: 'border-red-300 dark:border-red-700',
    icon: '⚠'
  },
  {
    label: 'Robot had issues - limited play',
    phase: 'teleop',
    category: 'issue',
    bgColor: 'bg-pink-100 dark:bg-pink-900/30',
    textColor: 'text-pink-900 dark:text-pink-100',
    borderColor: 'border-pink-300 dark:border-pink-700',
    icon: '✗'
  },
  {
    label: 'Collects balls very fast',
    phase: 'teleop',
    category: 'performance',
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-900 dark:text-emerald-100',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    icon: '⚡'
  },
  {
    label: 'Misses a lot of shots',
    phase: 'teleop',
    category: 'issue',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-900 dark:text-amber-100',
    borderColor: 'border-amber-300 dark:border-amber-700',
    icon: '◯'
  },
  {
    label: 'Played very good defence',
    phase: 'teleop',
    category: 'performance',
    bgColor: 'bg-violet-100 dark:bg-violet-900/30',
    textColor: 'text-violet-900 dark:text-violet-100',
    borderColor: 'border-violet-300 dark:border-violet-700',
    icon: '🛡'
  },
  {
    label: 'Fast climb',
    phase: 'teleop',
    category: 'mechanic',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-900 dark:text-purple-100',
    borderColor: 'border-purple-300 dark:border-purple-700',
    icon: '↑'
  },
  {
    label: 'Experienced in defence',
    phase: 'teleop',
    category: 'performance',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
    textColor: 'text-indigo-900 dark:text-indigo-100',
    borderColor: 'border-indigo-300 dark:border-indigo-700',
    icon: '★'
  },
  {
    label: 'Struggles with defence',
    phase: 'teleop',
    category: 'issue',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    textColor: 'text-rose-900 dark:text-rose-100',
    borderColor: 'border-rose-300 dark:border-rose-700',
    icon: '◆'
  }
]

// Custom label color scheme
export const CUSTOM_LABEL_CONFIG: LabelConfig = {
  label: 'custom',
  phase: 'auto',
  category: 'custom',
  bgColor: 'bg-gray-200 dark:bg-gray-700',
  textColor: 'text-gray-900 dark:text-gray-100',
  borderColor: 'border-gray-400 dark:border-gray-600',
  icon: '✎'
}

export function getLabelConfig(labelText: string, phase: LabelPhase): LabelConfig {
  const allLabels = phase === 'auto' ? AUTO_LABELS : TELEOP_LABELS
  return allLabels.find(l => l.label === labelText) || CUSTOM_LABEL_CONFIG
}

export function getCategoryColor(category: LabelCategory): string {
  const colors = {
    performance: 'bg-green-500',
    issue: 'bg-red-500',
    mechanic: 'bg-blue-500',
    custom: 'bg-gray-500'
  }
  return colors[category]
}

export function getCategoryLabel(category: LabelCategory): string {
  const labels = {
    performance: 'Performance',
    issue: 'Issue',
    mechanic: 'Mechanic',
    custom: 'Custom'
  }
  return labels[category]
}

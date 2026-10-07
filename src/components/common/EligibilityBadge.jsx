import { STATUS_LABELS, STATUS_STYLES } from '../../utils/eligibility'

const ICONS = {
  eligible:     '✓',
  info_needed:  '!',
  not_matching: '✕',
}

export default function EligibilityBadge({ status }) {
  const style = STATUS_STYLES[status] || 'bg-slate-50 text-slate-700 border-slate-200'
  const label = STATUS_LABELS[status] || status
  const icon = ICONS[status] || '•'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${style}`}>
      <span>{icon}</span>
      {label}
    </span>
  )
}
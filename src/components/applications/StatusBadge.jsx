import { STATUS_META } from '../../utils/applicationStatus'

export default function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.interested
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${meta.color}`}>
      <span>{meta.icon}</span>
      {meta.label}
    </span>
  )
}
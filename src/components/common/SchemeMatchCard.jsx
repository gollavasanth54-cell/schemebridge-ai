import { Link } from 'react-router-dom'
import Card from './Card'
import EligibilityBadge from './EligibilityBadge'

const reasonStyles = {
  match:    'text-emerald-700',
  mismatch: 'text-red-700',
  missing:  'text-amber-700',
}
const reasonIcons = {
  match:    '✓',
  mismatch: '✕',
  missing:  '!',
}

export default function SchemeMatchCard({ result }) {
  const { scheme, status, reasons, missingFields } = result

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900 leading-snug">{scheme.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            {scheme.provider} · {scheme.governmentLevel}
          </p>
        </div>
        <EligibilityBadge status={status} />
      </div>

      <ul className="mt-4 space-y-1.5">
        {reasons.map((r, i) => (
          <li key={i} className={`flex gap-2 text-sm ${reasonStyles[r.type]}`}>
            <span className="mt-0.5 shrink-0 font-bold">{reasonIcons[r.type]}</span>
            <span className="text-slate-700">{r.text}</span>
          </li>
        ))}
      </ul>

      {missingFields.length > 0 && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Missing info: <span className="font-medium">{missingFields.join(', ')}</span>.{' '}
          <Link to="/profile" className="font-medium underline">Complete profile</Link>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <Link
          to={`/schemes/${scheme.id}`}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          View scheme details →
        </Link>
        <a
          href={scheme.applyLink}
          target="_blank"
          rel="noreferrer"
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Official site ↗
        </a>
      </div>
    </Card>
  )
}
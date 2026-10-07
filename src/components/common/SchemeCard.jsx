import { Link } from 'react-router-dom'
import Card from './Card'

export default function SchemeCard({ scheme }) {
  const firstBenefit = Array.isArray(scheme.benefits) ? scheme.benefits[0] : scheme.benefits
  const firstEligibility = Array.isArray(scheme.eligibility) ? scheme.eligibility[0] : scheme.eligibility

  return (
    <Link to={`/schemes/${scheme.id}`} className="block h-full">
      <Card className="flex h-full flex-col p-5 transition-all hover:shadow-md hover:border-brand-200">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-900 leading-snug">{scheme.name}</h3>
          <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700 capitalize">
            {scheme.category.replace('-', ' ')}
          </span>
        </div>

        <p className="mt-1 text-xs text-slate-500">{scheme.provider}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${
            scheme.governmentLevel === 'National'
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-amber-50 text-amber-700'
          }`}>
            {scheme.governmentLevel}
          </span>
          {scheme.state && scheme.state !== 'All India' && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              📍 {scheme.state}
            </span>
          )}
        </div>

        <div className="mt-4 space-y-1.5 text-sm">
          <p className="line-clamp-2">
            <span className="text-slate-500">Benefit: </span>
            <span className="font-medium text-slate-800">{firstBenefit}</span>
          </p>
          <p className="line-clamp-2">
            <span className="text-slate-500">Eligibility: </span>
            <span className="text-slate-700">{firstEligibility}</span>
          </p>
        </div>

        <p className="mt-4 text-xs font-medium text-brand-700">View details →</p>
      </Card>
    </Link>
  )
}
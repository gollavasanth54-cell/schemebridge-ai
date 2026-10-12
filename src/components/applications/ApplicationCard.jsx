import { Link } from 'react-router-dom'
import Card from '../common/Card'
import StatusBadge from './StatusBadge'

export default function ApplicationCard({ application, onDelete }) {
  const { id, schemeName, referenceId, applicationDate, status, updatedAt } = application

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">{schemeName}</h3>
          {referenceId && (
            <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
              Ref: {referenceId}
            </p>
          )}
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="mt-3 space-y-1 text-xs text-slate-600">
        <p>
          <span className="text-slate-500">Applied:</span>{' '}
          {new Date(applicationDate).toLocaleDateString('en-IN')}
        </p>
        <p>
          <span className="text-slate-500">Updated:</span>{' '}
          {new Date(updatedAt).toLocaleDateString('en-IN')}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <Link
          to={`/applications/${id}`}
          className="text-sm font-medium text-brand-700 hover:text-brand-800"
        >
          View details →
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-xs text-red-600 hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </Card>
  )
}
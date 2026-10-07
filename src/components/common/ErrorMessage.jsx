import Button from './Button'

export default function ErrorMessage({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 flex items-start justify-between gap-3">
      <p className="flex-1">{message}</p>
      {onRetry && <Button size="sm" variant="secondary" onClick={onRetry}>Retry</Button>}
    </div>
  )
}
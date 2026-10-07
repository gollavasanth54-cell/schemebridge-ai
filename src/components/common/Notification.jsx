const styles = {
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  error:   'bg-red-50 border-red-200 text-red-800',
  info:    'bg-brand-50 border-brand-200 text-brand-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
}

export default function Notification({ message, type = 'info', onClose }) {
  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 shadow-sm ${styles[type]}`}>
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} aria-label="Close" className="text-lg leading-none opacity-60 hover:opacity-100">×</button>
      )}
    </div>
  )
}
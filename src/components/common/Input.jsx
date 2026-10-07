export default function Input({ label, error, className = '', as = 'input', options = [], ...props }) {
  const base = 'w-full rounded-lg border px-3 py-2.5 text-sm outline-none transition-colors bg-white'
  const state = error
    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
    : 'border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700">{label}</label>}

      {as === 'select' ? (
        <select className={`${base} ${state} ${className}`} {...props}>
          <option value="">Select…</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : as === 'textarea' ? (
        <textarea className={`${base} ${state} ${className}`} rows={3} {...props} />
      ) : (
        <input className={`${base} ${state} ${className}`} {...props} />
      )}

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
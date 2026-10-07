import Button from './Button'

export default function SearchBar({
  value, onChange, onSubmit,
  placeholder = 'Search schemes, scholarships…',
  className = '',
}) {
  return (
    <form
      onSubmit={onSubmit}
      className={`flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100 ${className}`}
    >
      <span className="pl-3 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
          <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
        </svg>
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
      />
      <Button type="submit" size="sm">Search</Button>
    </form>
  )
}
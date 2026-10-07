export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl bg-slate-100 px-4 py-3">
        <div className="flex gap-1">
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}
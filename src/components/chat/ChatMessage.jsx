import { Link } from 'react-router-dom'

// Render **bold** inside a line
function renderBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    )
  )
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'
        }`}
      >
        {message.text.split('\n').map((line, i) => (
          <p key={i} className={line.trim() === '' ? 'h-2' : ''}>
            {renderBold(line)}
          </p>
        ))}

        {message.links && message.links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.links.map((l, i) => (
              <a
                key={i}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-brand-200 bg-white px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-brand-50"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        )}

        {message.schemeRef && (
          <div className="mt-3 border-t border-slate-200/60 pt-2">
            <Link
              to={`/schemes/${message.schemeRef}`}
              className="text-xs font-medium text-brand-700 hover:underline"
            >
              View full scheme details →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
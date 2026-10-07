import { EXAMPLE_QUESTIONS } from '../../utils/chatbotEngine'

export default function ExampleQuestions({ onPick }) {
  return (
    <div className="flex flex-wrap gap-2">
      {EXAMPLE_QUESTIONS.map((q) => (
        <button
          key={q}
          onClick={() => onPick(q)}
          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
          {q}
        </button>
      ))}
    </div>
  )
}
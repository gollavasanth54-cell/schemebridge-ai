import { STATUS_META, TIMELINE_STEPS } from '../../utils/applicationStatus'

export default function ApplicationTimeline({ application }) {
  const { status, statusHistory = [] } = application
  const currentStep = STATUS_META[status]?.step ?? 0
  const isDecisionReached = status === 'approved' || status === 'rejected'

  // Map of status → most recent history entry
  const historyByStatus = {}
  for (const h of statusHistory) {
    historyByStatus[h.status] = h
  }

  const decisionInfo = isDecisionReached ? historyByStatus[status] : null
  const anyStepReached = currentStep >= 1 || isDecisionReached

  return (
    <ol className="relative space-y-6 pl-8">
      <span
        aria-hidden
        className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-200"
      />

      {TIMELINE_STEPS.map((step) => {
        let reached = false
        let info = null
        let label = step.label

        if (step.key === 'decision') {
          reached = isDecisionReached
          info = decisionInfo
          if (isDecisionReached) {
            label = status === 'approved' ? 'Approved' : 'Rejected'
          }
        } else {
          const stepMeta = STATUS_META[step.key]
          reached = currentStep >= stepMeta.step && stepMeta.step !== 0
          info = historyByStatus[step.key]
        }

        if (!reached) return null

        const dateStr = info?.date
          ? new Date(info.date).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : ''

        return (
          <li key={step.key} className="relative">
            <span
              className={`absolute -left-[22px] top-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brand-600 bg-brand-600 text-xs font-bold text-white`}
            >
              ✓
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900">{label}</p>
              {dateStr && <p className="mt-0.5 text-xs text-slate-500">{dateStr}</p>}
              {info?.note && (
                <p className="mt-1 text-xs italic text-slate-600">"{info.note}"</p>
              )}
            </div>
          </li>
        )
      })}

      {!anyStepReached && (
        <li className="text-sm italic text-slate-500">
          Not yet applied. Mark the status as <strong>Applied</strong> when you submit your application.
        </li>
      )}
    </ol>
  )
}
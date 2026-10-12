export const STATUS = {
  INTERESTED:   'interested',
  APPLIED:      'applied',
  VERIFICATION: 'verification',
  PROCESSING:   'processing',
  APPROVED:     'approved',
  REJECTED:     'rejected',
}

export const STATUS_META = {
  interested:   { label: 'Interested',   color: 'bg-slate-100 text-slate-700 border-slate-200',       icon: '⭐', step: 0 },
  applied:      { label: 'Applied',      color: 'bg-blue-50 text-blue-700 border-blue-200',           icon: '📤', step: 1 },
  verification: { label: 'Verification', color: 'bg-indigo-50 text-indigo-700 border-indigo-200',     icon: '🔍', step: 2 },
  processing:   { label: 'Processing',   color: 'bg-amber-50 text-amber-700 border-amber-200',        icon: '⏳', step: 3 },
  approved:     { label: 'Approved',     color: 'bg-emerald-50 text-emerald-700 border-emerald-200',  icon: '✓',  step: 4 },
  rejected:     { label: 'Rejected',     color: 'bg-red-50 text-red-700 border-red-200',              icon: '✕',  step: 4 },
}

export const PENDING_STATUSES = ['interested', 'applied', 'verification', 'processing']

export const TIMELINE_STEPS = [
  { key: 'applied',      label: 'Applied' },
  { key: 'verification', label: 'Verification' },
  { key: 'processing',   label: 'Processing' },
  { key: 'decision',     label: 'Decision' },
]
export default function Logo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="10" fill="#1d67ef" />
      <path d="M9 24c4 0 6-9 11-9s7 9 11 9" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="16" r="2" fill="white" />
      <circle cx="28" cy="16" r="2" fill="white" />
    </svg>
  )
}
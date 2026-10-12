import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'

export default function Sidebar({ open, onClose }) {
  const { user, isAdmin } = useAuth()
  const { unreadCount } = useNotifications()

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/schemes', label: 'Discover Schemes' },
    { to: '/categories', label: 'Scheme Categories' },
    { to: '/check-eligibility', label: 'Check Eligibility' },
    { to: '/assistant', label: 'Ask AI Assistant' },
    ...(user
      ? [
          { to: '/dashboard', label: 'Dashboard' },
          { to: '/applications', label: 'My Applications' },
          { to: '/notifications', label: 'Notifications', badge: unreadCount },
          { to: '/profile', label: 'My Profile' },
        ]
      : [
          { to: '/login', label: 'Login' },
          { to: '/register', label: 'Register' },
        ]),
    ...(isAdmin
      ? [
          { to: '/admin', label: '⚡ Admin Dashboard', end: true },
          { to: '/admin/schemes', label: 'Manage Schemes' },
          { to: '/admin/categories', label: 'Manage Categories' },
          { to: '/admin/states', label: 'Manage States' },
        ]
      : []),
  ]

  const linkClass = ({ isActive }) =>
    `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-700 hover:bg-slate-100'
    }`

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 z-40 bg-slate-900/40 md:hidden" />}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-white p-4 shadow-xl transition-transform md:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="font-semibold text-slate-900">Menu</span>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100" aria-label="Close">
            ×
          </button>
        </div>
        <nav className="space-y-1">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass} onClick={onClose}>
              <span>{l.label}</span>
              {l.badge > 0 && (
                <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {l.badge > 9 ? '9+' : l.badge}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
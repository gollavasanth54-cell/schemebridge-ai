import { Link, NavLink, useNavigate } from 'react-router-dom'
import Logo from '../common/Logo'
import Button from '../common/Button'
import NotificationBell from '../notifications/NotificationBell'
import { useAuth } from '../../context/AuthContext'

export default function Navbar({ onMenuClick }) {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-brand-700' : 'text-slate-600 hover:text-slate-900'}`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
          aria-label="Open menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>

        <Link to="/" className="flex items-center gap-2">
          <Logo />
          <span className="font-semibold text-slate-900">
            SchemeBridge <span className="text-brand-600">AI</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-5 md:flex">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/schemes" className={linkClass}>Schemes</NavLink>
          <NavLink to="/categories" className={linkClass}>Categories</NavLink>
          <NavLink to="/check-eligibility" className={linkClass}>Eligibility</NavLink>
          <NavLink to="/assistant" className={linkClass}>Ask AI</NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/applications" className={linkClass}>Applications</NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-amber-700' : 'text-amber-600 hover:text-amber-800'
                }`
              }
            >
              ⚡ Admin
            </NavLink>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <NotificationBell />
              <Link
                to="/profile"
                className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block"
              >
                Profile
              </Link>
              <Button size="sm" variant="secondary" onClick={() => { logout(); navigate('/') }}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login"><Button size="sm" variant="ghost">Login</Button></Link>
              <Link to="/register"><Button size="sm">Register</Button></Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import NotificationItem from '../components/notifications/NotificationItem'
import { useNotifications } from '../context/NotificationsContext'
import { useAuth } from '../context/AuthContext'

const FILTERS = [
  { id: 'all',                label: 'All' },
  { id: 'unread',             label: 'Unread' },
  { id: 'application_update', label: 'Applications' },
  { id: 'status_change',      label: 'Status changes' },
  { id: 'reminder',           label: 'Reminders' },
]

export default function Notifications() {
  const { user } = useAuth()
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications()
  const [filter, setFilter] = useState('all')

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <Card className="p-8 text-center">
          <p className="text-4xl">🔐</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Please log in first</h1>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/register"><Button variant="secondary">Register</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !n.read
    return n.type === filter
  })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Application updates, status changes, and reminders.
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead}>
              Mark all read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (confirm('Clear all notifications?')) clearAll()
              }}
            >
              Clear all
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.id === 'all'
              ? notifications.length
              : f.id === 'unread'
              ? notifications.filter((n) => !n.read).length
              : notifications.filter((n) => n.type === f.id).length
          const active = filter === f.id
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {f.label}{' '}
              <span className={`ml-1 ${active ? 'text-brand-100' : 'text-slate-400'}`}>
                ({count})
              </span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-3xl">🔕</p>
          <p className="mt-2 font-medium text-slate-800">No notifications</p>
          <p className="mt-1 text-sm text-slate-500">
            You'll see application updates, status changes, and reminders here.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          {filtered.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </Card>
      )}

      <Card className="border-slate-200 bg-slate-50 p-4">
        <p className="text-xs text-slate-600">
          ℹ️ Notifications are generated locally from your activity on SchemeBridge. We do not
          fetch status updates from government portals.
        </p>
      </Card>
    </div>
  )
}
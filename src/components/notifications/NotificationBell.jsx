import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationsContext'
import NotificationItem from './NotificationItem'

export default function NotificationBell() {
  const { notifications, unreadCount, markAllRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const recent = notifications.slice(0, 5)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-1rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg sm:w-96">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-brand-700 hover:text-brand-800"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {recent.length === 0 ? (
              <p className="p-6 text-center text-sm text-slate-500">No notifications yet.</p>
            ) : (
              recent.map((n) => (
                <NotificationItem
                  key={n.id}
                  notification={n}
                  compact
                  onClose={() => setOpen(false)}
                />
              ))
            )}
          </div>

          <div className="border-t border-slate-100 p-2">
            <Link
              to="/notifications"
              className="block rounded-lg px-3 py-2 text-center text-sm font-medium text-brand-700 hover:bg-brand-50"
              onClick={() => setOpen(false)}
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
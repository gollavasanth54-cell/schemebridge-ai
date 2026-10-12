import { Link } from 'react-router-dom'
import { useNotifications } from '../../context/NotificationsContext'

const TYPE_META = {
  application_update: { icon: '📋', bg: 'bg-blue-50' },
  status_change:      { icon: '🔄', bg: 'bg-indigo-50' },
  reminder:           { icon: '🔔', bg: 'bg-amber-50' },
  system:             { icon: 'ℹ️', bg: 'bg-slate-50' },
}

export default function NotificationItem({ notification, compact, onClose }) {
  const { markRead, deleteNotification } = useNotifications()
  const meta = TYPE_META[notification.type] || TYPE_META.system

  const handleClick = () => {
    if (!notification.read) markRead(notification.id)
    if (onClose) onClose()
  }

  const body = (
    <div
      className={`flex gap-3 px-4 py-3 transition-colors hover:bg-slate-50 ${
        !notification.read ? 'bg-brand-50/40' : ''
      }`}
    >
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${meta.bg}`}>
        <span>{meta.icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm ${
            !notification.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-800'
          }`}
        >
          {notification.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-600">{notification.message}</p>
        <p className="mt-1 text-[10px] text-slate-400">
          {new Date(notification.createdAt).toLocaleString('en-IN')}
        </p>
      </div>
      {!compact && (
        <button
          onClick={(e) => {
            e.preventDefault()
            deleteNotification(notification.id)
          }}
          className="self-start text-lg leading-none text-slate-400 hover:text-red-600"
          aria-label="Delete notification"
        >
          ×
        </button>
      )}
    </div>
  )

  const wrapperClass = 'block border-b border-slate-100 last:border-b-0'
  if (notification.actionUrl) {
    return (
      <Link to={notification.actionUrl} onClick={handleClick} className={wrapperClass}>
        {body}
      </Link>
    )
  }
  return <div className={wrapperClass}>{body}</div>
}
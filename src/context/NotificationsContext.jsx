import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { useApplications } from './ApplicationsContext'
import { STATUS_META } from '../utils/applicationStatus'

const NotificationsContext = createContext(null)

const NOTIF_PREFIX = 'sb_notifications_'
const SETTINGS_PREFIX = 'sb_notif_settings_'
const REMINDERS_PREFIX = 'sb_reminders_sent_'

const DEFAULT_SETTINGS = {
  applicationUpdates: true,
  statusChanges: true,
  reminders: true,
  reminderDays: 7,
}

export function NotificationsProvider({ children }) {
  const { user } = useAuth()
  const { applications } = useApplications()

  const [notifications, setNotifications] = useState([])
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)

  const userId = user?.id
  const notifKey = userId ? `${NOTIF_PREFIX}${userId}` : null
  const settingsKey = userId ? `${SETTINGS_PREFIX}${userId}` : null
  const remindersKey = userId ? `${REMINDERS_PREFIX}${userId}` : null

  const prevAppsRef = useRef(null)
  const remindersCheckedRef = useRef(false)

  // ---- Load when user changes ----
  useEffect(() => {
    if (!userId) {
      setNotifications([])
      setSettings(DEFAULT_SETTINGS)
      setLoading(false)
      prevAppsRef.current = null
      remindersCheckedRef.current = false
      return
    }
    try {
      setNotifications(JSON.parse(localStorage.getItem(notifKey) || '[]'))
    } catch {
      setNotifications([])
    }
    try {
      const s = JSON.parse(localStorage.getItem(settingsKey) || 'null')
      setSettings(s ? { ...DEFAULT_SETTINGS, ...s } : DEFAULT_SETTINGS)
    } catch {
      setSettings(DEFAULT_SETTINGS)
    }
    setLoading(false)
    prevAppsRef.current = null
    remindersCheckedRef.current = false
  }, [userId, notifKey, settingsKey])

  const persist = useCallback(
    (list) => {
      setNotifications(list)
      if (notifKey) {
        try {
          localStorage.setItem(notifKey, JSON.stringify(list))
        } catch {
          /* ignore */
        }
      }
    },
    [notifKey]
  )

  const persistSettings = useCallback(
    (s) => {
      setSettings(s)
      if (settingsKey) {
        try {
          localStorage.setItem(settingsKey, JSON.stringify(s))
        } catch {
          /* ignore */
        }
      }
    },
    [settingsKey]
  )

  const addNotification = useCallback(
    (data) => {
      if (data.type === 'status_change' && !settings.statusChanges) return null
      if (data.type === 'application_update' && !settings.applicationUpdates) return null
      if (data.type === 'reminder' && !settings.reminders) return null

      const newNotif = {
        id: crypto.randomUUID(),
        userId,
        type: data.type || 'system',
        title: data.title || '',
        message: data.message || '',
        applicationId: data.applicationId || null,
        actionUrl: data.actionUrl || null,
        read: false,
        createdAt: new Date().toISOString(),
      }
      persist([newNotif, ...notifications].slice(0, 100))
      return newNotif
    },
    [userId, notifications, settings, persist]
  )

  // ---- Watch applications for changes ----
  useEffect(() => {
    if (!userId) return
    if (prevAppsRef.current === null) {
      prevAppsRef.current = applications
      return
    }
    const prev = prevAppsRef.current
    const current = applications

    for (const app of current) {
      const oldApp = prev.find((a) => a.id === app.id)
      if (!oldApp) {
        addNotification({
          type: 'application_update',
          title: 'New application saved',
          message: `"${app.schemeName}" was added to your applications.`,
          applicationId: app.id,
          actionUrl: `/applications/${app.id}`,
        })
      } else if (oldApp.status !== app.status) {
        const oldLabel = STATUS_META[oldApp.status]?.label || oldApp.status
        const newLabel = STATUS_META[app.status]?.label || app.status
        addNotification({
          type: 'status_change',
          title: `${app.schemeName}: status updated`,
          message: `${oldLabel} → ${newLabel}`,
          applicationId: app.id,
          actionUrl: `/applications/${app.id}`,
        })
      }
    }

    prevAppsRef.current = current
  }, [applications, userId, addNotification])

  // ---- Stale application reminders (once per session) ----
  useEffect(() => {
    if (!userId || remindersCheckedRef.current) return
    if (!applications.length) return
    remindersCheckedRef.current = true

    const reminderDays = settings.reminderDays || 7
    const now = Date.now()
    let sent = {}
    try {
      sent = JSON.parse(localStorage.getItem(remindersKey) || '{}')
    } catch {
      /* ignore */
    }

    let updated = false
    for (const app of applications) {
      if (['approved', 'rejected'].includes(app.status)) continue

      const lastUpdate = new Date(app.updatedAt).getTime()
      const daysSince = (now - lastUpdate) / (1000 * 60 * 60 * 24)
      if (daysSince < reminderDays) continue

      const lastReminded = sent[app.id] ? new Date(sent[app.id]).getTime() : 0
      const daysSinceReminder = (now - lastReminded) / (1000 * 60 * 60 * 24)
      if (daysSinceReminder < 3) continue

      addNotification({
        type: 'reminder',
        title: `Follow up: ${app.schemeName}`,
        message: `It's been ${Math.floor(daysSince)} days since your last update. Check the official portal for status.`,
        applicationId: app.id,
        actionUrl: `/applications/${app.id}`,
      })
      sent[app.id] = new Date().toISOString()
      updated = true
    }

    if (updated) {
      try {
        localStorage.setItem(remindersKey, JSON.stringify(sent))
      } catch {
        /* ignore */
      }
    }
  }, [applications, userId, settings.reminderDays, remindersKey, addNotification])

  // ---- Actions ----
  const markRead = (id) =>
    persist(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  const markAllRead = () => persist(notifications.map((n) => ({ ...n, read: true })))
  const deleteNotification = (id) => persist(notifications.filter((n) => n.id !== id))
  const clearAll = () => persist([])
  const updateSettings = (patch) => persistSettings({ ...settings, ...patch })

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        settings,
        loading,
        unreadCount,
        addNotification,
        markRead,
        markAllRead,
        deleteNotification,
        clearAll,
        updateSettings,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => useContext(NotificationsContext)
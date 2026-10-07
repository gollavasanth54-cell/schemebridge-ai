import { createContext, useContext, useState, useCallback } from 'react'
import Notification from '../components/common/Notification'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const [list, setList] = useState([])

  const notify = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random()
    setList(prev => [...prev, { id, message, type }])
    setTimeout(() => setList(prev => prev.filter(n => n.id !== id)), 3500)
  }, [])

  const dismiss = (id) => setList(prev => prev.filter(n => n.id !== id))

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
        {list.map(n => (
          <Notification key={n.id} {...n} onClose={() => dismiss(n.id)} />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export const useNotification = () => useContext(NotificationContext)
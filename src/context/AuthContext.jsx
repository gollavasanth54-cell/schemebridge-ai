import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)
const USERS_KEY = 'sb_users'
const SESSION_KEY = 'sb_session'

const readUsers = () => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
const writeUsers = (u) => localStorage.setItem(USERS_KEY, JSON.stringify(u))

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const session = JSON.parse(localStorage.getItem(SESSION_KEY))
      if (session) setUser(session)
    } catch { /* ignore */ }
    setLoading(false)
  }, [])

  const register = async ({ name, email, password }) => {
    const users = readUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with this email already exists.')
    }
    const newUser = {
      id: crypto.randomUUID(),
      name, email, password,
      profile: {
        age: '', state: '', district: '',
        occupation: '', userType: 'Student',
        education: '', annualIncome: '',
      },
    }
    users.push(newUser); writeUsers(users)
    const session = { id: newUser.id, name, email, profile: newUser.profile }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }

  const login = async ({ email, password }) => {
    const users = readUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) throw new Error('Invalid email or password.')
    const session = { id: found.id, name: found.name, email: found.email, profile: found.profile }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const updateProfile = (patch) => {
    if (!user) return
    const users = readUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx >= 0) {
      users[idx].profile = { ...users[idx].profile, ...patch }
      writeUsers(users)
    }
    const updated = { ...user, profile: { ...user.profile, ...patch } }
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated))
    setUser(updated)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
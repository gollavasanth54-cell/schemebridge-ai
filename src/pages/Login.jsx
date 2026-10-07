import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { notify } = useNotification()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) return setError('Please fill in all fields.')
    setLoading(true)
    try {
      await login(form)
      notify('Welcome back!', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-6 sm:py-10">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Log in to continue to SchemeBridge AI.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && <ErrorMessage message={error} />}
          <Input
            label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <Input
            label="Password" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-brand-700 hover:underline">Register</Link>
        </p>
      </Card>
    </div>
  )
}
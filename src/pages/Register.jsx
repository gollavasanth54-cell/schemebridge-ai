import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import ErrorMessage from '../components/common/ErrorMessage'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'

export default function Register() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const { notify } = useNotification()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.name || !form.email || !form.password) return setError('Please fill in all fields.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.confirm) return setError('Passwords do not match.')

    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      notify('Account created. Complete your profile next!', 'success')
      navigate('/profile')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md py-6 sm:py-10">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
        <p className="mt-1 text-sm text-slate-500">It only takes a minute.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {error && <ErrorMessage message={error} />}
          <Input label="Full name" placeholder="Your name"
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <Input label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <Input label="Password" type="password" placeholder="At least 6 characters"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <Input label="Confirm password" type="password" placeholder="Repeat password"
            value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Register'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-700 hover:underline">Login</Link>
        </p>
      </Card>
    </div>
  )
}
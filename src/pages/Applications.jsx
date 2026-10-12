import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ApplicationCard from '../components/applications/ApplicationCard'
import ApplicationForm from '../components/applications/ApplicationForm'
import { useApplications } from '../context/ApplicationsContext'
import { useNotification } from '../context/NotificationContext'
import { useAuth } from '../context/AuthContext'
import { PENDING_STATUSES } from '../utils/applicationStatus'
import { schemes } from '../data/mockData'

const FILTERS = [
  { id: 'all',      label: 'All' },
  { id: 'pending',  label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
]

export default function Applications() {
  const { user } = useAuth()
  const { applications, addApplication, deleteApplication } = useApplications()
  const { notify } = useNotification()
  const [params, setParams] = useSearchParams()

  const [showForm, setShowForm] = useState(false)
  const [prefill, setPrefill] = useState(null)
  const [filter, setFilter] = useState('all')

  // Handle ?add=<schemeId> from Scheme Details page
  useEffect(() => {
    const addId = params.get('add')
    if (!addId) return
    const scheme = schemes.find((s) => s.id === addId)
    if (scheme) {
      setPrefill({
        schemeId: scheme.id,
        schemeName: scheme.name,
        trackingUrl: scheme.trackingLink || scheme.applyLink,
      })
      setShowForm(true)
    }
    setParams({}, { replace: true })
  }, [params, setParams])

  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <Card className="p-8 text-center">
          <p className="text-4xl">🔐</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Please log in first</h1>
          <p className="mt-2 text-sm text-slate-500">
            You need an account to save and track applications.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/register"><Button variant="secondary">Register</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  const filtered = applications.filter((a) => {
    if (filter === 'all') return true
    if (filter === 'pending') return PENDING_STATUSES.includes(a.status)
    return a.status === filter
  })

  const onSave = (data) => {
    addApplication(data)
    setShowForm(false)
    setPrefill(null)
    notify('Application saved.', 'success')
  }

  const onDelete = (id) => {
    if (confirm('Delete this application? This cannot be undone.')) {
      deleteApplication(id)
      notify('Application deleted.', 'info')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Applications</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track every scheme you've applied to — status, dates, and official links.
          </p>
        </div>
        <Button onClick={() => { setPrefill(null); setShowForm(true) }}>
          + Add Application
        </Button>
      </div>

      <Card className="border-amber-200 bg-amber-50 p-3">
        <p className="text-xs text-amber-900">
          <span className="font-semibold">ℹ️ </span>
          We do <strong>not</strong> automatically track government applications. You update the
          status manually here, and use the official tracking link to verify on the government portal.
        </p>
      </Card>

      {showForm && (
        <ApplicationForm
          initial={prefill}
          onSave={onSave}
          onCancel={() => { setShowForm(false); setPrefill(null) }}
        />
      )}

      {applications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count =
              f.id === 'all'
                ? applications.length
                : f.id === 'pending'
                ? applications.filter((a) => PENDING_STATUSES.includes(a.status)).length
                : applications.filter((a) => a.status === f.id).length

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
      )}

      {applications.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-4xl">📋</p>
          <h2 className="mt-3 text-lg font-semibold text-slate-900">No applications yet</h2>
          <p className="mt-1 text-sm text-slate-500">
            Save a scheme you've applied to — or plan to apply to — and track it here.
          </p>
          <Button className="mt-5" onClick={() => setShowForm(true)}>
            Add your first application
          </Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">No applications match this filter.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => (
            <ApplicationCard key={a.id} application={a} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
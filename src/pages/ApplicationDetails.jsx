import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import StatusBadge from '../components/applications/StatusBadge'
import ApplicationTimeline from '../components/applications/ApplicationTimeline'
import { useApplications } from '../context/ApplicationsContext'
import { useNotification } from '../context/NotificationContext'
import { STATUS_META } from '../utils/applicationStatus'

const statusOptions = Object.entries(STATUS_META).map(([key, meta]) => ({
  value: key,
  label: meta.label,
}))

export default function ApplicationDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getApplication, updateApplication, deleteApplication } = useApplications()
  const { notify } = useNotification()
  const app = getApplication(id)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(app || {})
  const [showStatusUpdate, setShowStatusUpdate] = useState(false)
  const [newStatus, setNewStatus] = useState(app?.status || '')
  const [statusNote, setStatusNote] = useState('')
  const [statusDate, setStatusDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    if (app) {
      setForm(app)
      setNewStatus(app.status)
    }
  }, [app])

  if (!app) {
    return (
      <Card className="mx-auto max-w-lg p-10 text-center">
        <p className="text-3xl">😕</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">Application not found</h1>
        <p className="mt-1 text-sm text-slate-500">It may have been deleted.</p>
        <Link to="/applications" className="mt-6 inline-block">
          <Button>Back to My Applications</Button>
        </Link>
      </Card>
    )
  }

  const onSaveEdit = (e) => {
    e.preventDefault()
    updateApplication(app.id, {
      schemeName: form.schemeName,
      referenceId: form.referenceId,
      applicationDate: form.applicationDate,
      trackingUrl: form.trackingUrl,
      notes: form.notes,
    })
    setEditing(false)
    notify('Application updated.', 'success')
  }

  const onUpdateStatus = (e) => {
    e.preventDefault()
    if (!newStatus || newStatus === app.status) {
      setShowStatusUpdate(false)
      return
    }
    updateApplication(app.id, { status: newStatus, statusDate, statusNote })
    setShowStatusUpdate(false)
    setStatusNote('')
    notify('Status updated.', 'success')
  }

  const onDelete = () => {
    if (confirm('Delete this application? This cannot be undone.')) {
      deleteApplication(app.id)
      notify('Application deleted.', 'info')
      navigate('/applications')
    }
  }

  const copyDetails = async () => {
    const status = STATUS_META[app.status]?.label || app.status
    const lines = [
      app.schemeName,
      `Application ID: ${app.referenceId || 'Not set'}`,
      `Application Date: ${app.applicationDate}`,
      `Status: ${status}`,
      app.trackingUrl ? `Official Tracking: ${app.trackingUrl}` : '',
    ].filter(Boolean)
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      notify('Application details copied.', 'success')
    } catch {
      notify('Could not copy details.', 'error')
    }
  }

  return (
    <div className="space-y-6">
      <nav className="text-sm text-slate-500">
        <Link to="/applications" className="hover:text-brand-700">My Applications</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{app.schemeName}</span>
      </nav>

      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{app.schemeName}</h1>
            {app.referenceId && (
              <p className="mt-1 font-mono text-sm text-slate-500">Ref: {app.referenceId}</p>
            )}
          </div>
          <StatusBadge status={app.status} />
        </div>

        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="text-slate-500">Applied on: </span>
            <span className="font-medium text-slate-800">
              {new Date(app.applicationDate).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </span>
          </p>
          <p>
            <span className="text-slate-500">Last updated: </span>
            <span className="text-slate-700">
              {new Date(app.updatedAt).toLocaleString('en-IN')}
            </span>
          </p>
        </div>

        {app.notes && (
          <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</p>
            <p className="mt-1 whitespace-pre-wrap">{app.notes}</p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Button onClick={() => setShowStatusUpdate((v) => !v)}>Update Status</Button>
          <Button variant="secondary" onClick={() => setEditing((v) => !v)}>Edit Details</Button>
          <Button variant="secondary" onClick={copyDetails}>Copy Details</Button>
          {app.trackingUrl && (
            <a href={app.trackingUrl} target="_blank" rel="noreferrer">
              <Button variant="secondary">Open Official Tracking ↗</Button>
            </a>
          )}
          <Button variant="ghost" onClick={onDelete}>Delete</Button>
        </div>

        {!app.trackingUrl && (
          <p className="mt-3 text-xs text-slate-500">
            No official tracking URL saved. Add one via <strong>Edit Details</strong> to open the
            government page later.
          </p>
        )}
      </Card>

      {showStatusUpdate && (
        <Card className="p-5">
          <form onSubmit={onUpdateStatus} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Update Status</h2>
            <p className="text-sm text-slate-500">
              Set the current status based on what the official portal shows. We do not auto-track.
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">New status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
                >
                  {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <Input
                label="Date"
                type="date"
                value={statusDate}
                onChange={(e) => setStatusDate(e.target.value)}
              />
            </div>

            <Input
              label="Note (optional)"
              placeholder='e.g. "Application submitted on NSP portal"'
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setShowStatusUpdate(false)}>
                Cancel
              </Button>
              <Button type="submit">Save status</Button>
            </div>
          </form>
        </Card>
      )}

      {editing && (
        <Card className="p-5">
          <form onSubmit={onSaveEdit} className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">Edit Details</h2>

            <Input
              label="Scheme name"
              value={form.schemeName || ''}
              onChange={(e) => setForm({ ...form, schemeName: e.target.value })}
            />
            <Input
              label="Reference / Application ID"
              value={form.referenceId || ''}
              onChange={(e) => setForm({ ...form, referenceId: e.target.value })}
            />
            <Input
              label="Application date"
              type="date"
              value={form.applicationDate || ''}
              onChange={(e) => setForm({ ...form, applicationDate: e.target.value })}
            />
            <Input
              label="Official tracking URL"
              value={form.trackingUrl || ''}
              onChange={(e) => setForm({ ...form, trackingUrl: e.target.value })}
            />
            <Input
              label="Notes"
              as="textarea"
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
          <span>📍</span> Application Timeline
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Only the stages you've reached are shown.
        </p>
        <div className="mt-6">
          <ApplicationTimeline application={app} />
        </div>
      </Card>

      <Card className="border-amber-200 bg-amber-50 p-4">
        <p className="text-xs text-amber-900">
          ⚠️ This timeline is based on manual updates you make. We do <strong>not</strong> fetch
          live status from any government API. Always confirm on the official portal.
        </p>
      </Card>
    </div>
  )
}
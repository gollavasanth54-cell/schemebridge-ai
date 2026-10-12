import { useEffect, useState } from 'react'
import Card from '../common/Card'
import Input from '../common/Input'
import Button from '../common/Button'
import { STATUS_META } from '../../utils/applicationStatus'
import { schemes } from '../../data/mockData'

const statusOptions = Object.entries(STATUS_META).map(([key, meta]) => ({
  value: key,
  label: meta.label,
}))

export default function ApplicationForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    schemeId: '',
    schemeName: '',
    referenceId: '',
    applicationDate: new Date().toISOString().slice(0, 10),
    status: 'interested',
    trackingUrl: '',
    notes: '',
  })
  const [customScheme, setCustomScheme] = useState(false)

  useEffect(() => {
    if (initial) {
      setForm({
        schemeId: initial.schemeId || '',
        schemeName: initial.schemeName || '',
        referenceId: initial.referenceId || '',
        applicationDate: initial.applicationDate || new Date().toISOString().slice(0, 10),
        status: initial.status || 'interested',
        trackingUrl: initial.trackingUrl || '',
        notes: initial.notes || '',
      })
      // If the initial scheme name isn't in our database, treat as custom
      if (initial.schemeName && !schemes.some((s) => s.name === initial.schemeName)) {
        setCustomScheme(true)
      }
    }
  }, [initial])

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onPickScheme = (e) => {
    const name = e.target.value
    if (name === '__custom__') {
      setCustomScheme(true)
      setForm({ ...form, schemeName: '', schemeId: '', trackingUrl: '' })
      return
    }
    const found = schemes.find((s) => s.name === name)
    setCustomScheme(false)
    setForm({
      ...form,
      schemeName: name,
      schemeId: found?.id || '',
      trackingUrl: form.trackingUrl || found?.trackingLink || found?.applyLink || '',
    })
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.schemeName.trim()) return
    onSave(form)
  }

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">
          {initial && initial.id ? 'Edit Application' : 'Add Application'}
        </h2>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Scheme</label>
          <select
            value={customScheme ? '__custom__' : form.schemeName}
            onChange={onPickScheme}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            required={!customScheme}
          >
            <option value="">Choose a scheme…</option>
            {schemes.map((s) => (
              <option key={s.id} value={s.name}>{s.name}</option>
            ))}
            <option value="__custom__">Other (type manually)</option>
          </select>
        </div>

        {customScheme && (
          <Input
            label="Custom scheme name"
            placeholder="e.g. State-level scholarship"
            value={form.schemeName}
            onChange={(e) => setForm({ ...form, schemeName: e.target.value })}
          />
        )}

        <Input
          label="Reference / Application ID"
          placeholder="e.g. ABC123456"
          value={form.referenceId}
          onChange={set('referenceId')}
        />

        <Input
          label="Application date"
          type="date"
          value={form.applicationDate}
          onChange={set('applicationDate')}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Current status</label>
          <select
            value={form.status}
            onChange={set('status')}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          >
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <Input
          label="Official tracking URL (optional)"
          placeholder="https://…"
          value={form.trackingUrl}
          onChange={set('trackingUrl')}
        />

        <Input
          label="Notes (optional)"
          as="textarea"
          placeholder="Any notes about this application…"
          value={form.notes}
          onChange={set('notes')}
        />

        <div className="flex justify-end gap-3 pt-2">
          {onCancel && (
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit">
            {initial && initial.id ? 'Save changes' : 'Add application'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
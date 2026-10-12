import { useState } from 'react'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { useNotifications } from '../context/NotificationsContext'
import { indianStates } from '../data/mockData'

const occupations = ['Student', 'Farmer', 'Salaried', 'Self-employed', 'Unemployed', 'Retired', 'Other']
const userTypes = ['Student', 'Employee', 'Other']
const educationLevels = ['Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Other']

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-3">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <div className="relative mt-0.5 shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className={`h-6 w-11 rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-slate-300'}`} />
        <div
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </div>
    </label>
  )
}

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { notify } = useNotification()
  const { settings, updateSettings } = useNotifications()
  const [form, setForm] = useState(user?.profile || {})
  const [saving, setSaving] = useState(false)

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const onSubmit = (e) => {
    e.preventDefault()
    setSaving(true)
    setTimeout(() => {
      updateProfile(form)
      setSaving(false)
      notify('Profile saved successfully.', 'success')
    }, 400)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Keep your profile updated — it helps match you to the right schemes.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
          <Input label="Full name" value={user?.name || ''} disabled />
          <Input label="Email" value={user?.email || ''} disabled />

          <Input label="Age" type="number" min="1" max="120" placeholder="e.g. 21"
            value={form.age || ''} onChange={set('age')} />
          <Input label="State" as="select" options={indianStates}
            value={form.state || ''} onChange={set('state')} />
          <Input label="District" placeholder="Your district"
            value={form.district || ''} onChange={set('district')} />
          <Input label="Occupation" as="select" options={occupations}
            value={form.occupation || ''} onChange={set('occupation')} />
          <Input label="I am a" as="select" options={userTypes}
            value={form.userType || 'Student'} onChange={set('userType')} />
          <Input label="Education" as="select" options={educationLevels}
            value={form.education || ''} onChange={set('education')} />
          <Input label="Annual income (₹)" type="number" min="0" placeholder="e.g. 250000"
            value={form.annualIncome || ''} onChange={set('annualIncome')} />

          <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-slate-900">Notification Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Choose what you want to be notified about.
        </p>

        <div className="mt-4 space-y-2">
          <ToggleRow
            label="Application updates"
            description="When you add a new application"
            checked={settings.applicationUpdates}
            onChange={(v) => updateSettings({ applicationUpdates: v })}
          />
          <ToggleRow
            label="Status changes"
            description="When an application status changes"
            checked={settings.statusChanges}
            onChange={(v) => updateSettings({ statusChanges: v })}
          />
          <ToggleRow
            label="Follow-up reminders"
            description="Reminders when an application hasn't been updated in a while"
            checked={settings.reminders}
            onChange={(v) => updateSettings({ reminders: v })}
          />
        </div>

        <div className="mt-4">
          <label className="mb-1.5 block text-sm font-medium text-slate-700">
            Remind me after (days without update)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={settings.reminderDays}
            onChange={(e) =>
              updateSettings({ reminderDays: Math.max(1, Number(e.target.value) || 7) })
            }
            className="w-32 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
          />
        </div>
      </Card>
    </div>
  )
}
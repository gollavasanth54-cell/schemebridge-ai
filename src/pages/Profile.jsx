import { useState } from 'react'
import Card from '../components/common/Card'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import { indianStates } from '../data/mockData'

const occupations = ['Student', 'Farmer', 'Salaried', 'Self-employed', 'Unemployed', 'Retired', 'Other']
const userTypes = ['Student', 'Employee', 'Other']
const educationLevels = ['Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Other']

export default function Profile() {
  const { user, updateProfile } = useAuth()
  const { notify } = useNotification()
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
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
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

          <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? 'Saving…' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
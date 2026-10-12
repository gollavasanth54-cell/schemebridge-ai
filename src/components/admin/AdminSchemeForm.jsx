import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import ErrorMessage from '../../components/common/ErrorMessage'
import { useData } from '../../context/DataContext'
import { useNotification } from '../../context/NotificationContext'

const slugify = (str) =>
  String(str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)

const linesToArray = (text) =>
  String(text || '')
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)

const arrayToLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : '')

const emptyForm = {
  id: '',
  name: '',
  description: '',
  governmentLevel: 'National',
  state: 'All India',
  category: '',
  provider: '',
  benefitsText: '',
  eligibilityText: '',
  documentsText: '',
  purposesText: '',
  stepsText: '',
  applyLink: '',
  trackingLink: '',
  lastVerified: new Date().toISOString().slice(0, 10),
  active: true,
}

const isUrl = (v) => !v || /^https?:\/\/.+/i.test(v)

export default function AdminSchemeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { categories, states, getSchemeById, addScheme, updateScheme } = useData()
  const { notify } = useNotification()

  const editing = Boolean(id)
  const existing = useMemo(() => (editing ? getSchemeById(id) : null), [editing, id, getSchemeById])

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (existing) {
      setForm({
        id: existing.id,
        name: existing.name || '',
        description: existing.description || '',
        governmentLevel: existing.governmentLevel || 'National',
        state: existing.state || 'All India',
        category: existing.category || '',
        provider: existing.provider || '',
        benefitsText: arrayToLines(existing.benefits),
        eligibilityText: arrayToLines(existing.eligibility),
        documentsText: Array.isArray(existing.documents)
          ? existing.documents.map((d) => d.name).join('\n')
          : '',
        purposesText: Array.isArray(existing.documents)
          ? existing.documents.map((d) => d.purpose).join('\n')
          : '',
        stepsText: arrayToLines(existing.applicationSteps),
        applyLink: existing.applyLink || '',
        trackingLink: existing.trackingLink || '',
        lastVerified: existing.lastVerified || new Date().toISOString().slice(0, 10),
        active: existing.active !== false,
      })
    } else if (!editing) {
      setForm({ ...emptyForm, category: categories[0]?.id || '' })
    }
  }, [existing, editing, categories])

  const set = (k) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [k]: value }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 3) errs.name = 'Name must be at least 3 characters.'
    if (!form.description.trim() || form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters.'
    if (!form.category) errs.category = 'Pick a category.'
    if (!form.provider.trim()) errs.provider = 'Provider is required.'
    if (form.governmentLevel === 'State' && (!form.state || form.state === 'All India')) {
      errs.state = 'State-level schemes need a specific state.'
    }
    if (!form.applyLink.trim()) errs.applyLink = 'Apply link is required.'
    if (!isUrl(form.applyLink)) errs.applyLink = 'Must start with http:// or https://'
    if (form.trackingLink && !isUrl(form.trackingLink)) errs.trackingLink = 'Must start with http:// or https://'
    if (!form.benefitsText.trim()) errs.benefitsText = 'Add at least one benefit.'
    if (!form.eligibilityText.trim()) errs.eligibilityText = 'Add at least one eligibility rule.'
    if (!form.stepsText.trim()) errs.stepsText = 'Add at least one step.'
    if (!form.lastVerified) errs.lastVerified = 'Pick a verification date.'
    return errs
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length) {
      notify('Please fix the errors below.', 'error')
      return
    }

    const benefitLines = linesToArray(form.benefitsText)
    const eligibilityLines = linesToArray(form.eligibilityText)
    const docNames = linesToArray(form.documentsText)
    const docPurposes = linesToArray(form.purposesText)

    const documents = docNames.map((name, i) => ({
      name,
      purpose: docPurposes[i] || 'Required for verification',
    }))

    const payload = {
      id: form.id || slugify(form.name) || crypto.randomUUID(),
      name: form.name.trim(),
      description: form.description.trim(),
      governmentLevel: form.governmentLevel,
      state: form.governmentLevel === 'National' ? 'All India' : form.state,
      category: form.category,
      provider: form.provider.trim(),
      benefits: benefitLines,
      eligibility: eligibilityLines,
      documents,
      applicationSteps: linesToArray(form.stepsText),
      applyLink: form.applyLink.trim(),
      trackingLink: form.trackingLink.trim() || form.applyLink.trim(),
      lastVerified: form.lastVerified,
      active: form.active !== false,
    }

    if (editing) {
      updateScheme(id, payload)
      notify('Scheme updated.', 'success')
    } else {
      // Guard against ID collision
      const existingById = getSchemeById(payload.id)
      if (existingById) payload.id = `${payload.id}-${Date.now()}`
      addScheme(payload)
      notify('Scheme added.', 'success')
    }
    navigate('/admin/schemes')
  }

  if (editing && !existing) {
    return (
      <Card className="p-10 text-center">
        <p className="text-3xl">😕</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">Scheme not found</h1>
        <Link to="/admin/schemes" className="mt-6 inline-block">
          <Button>Back to Schemes</Button>
        </Link>
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <nav className="text-sm text-slate-500">
        <Link to="/admin/schemes" className="hover:text-brand-700">Manage Schemes</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{editing ? 'Edit' : 'New'} Scheme</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {editing ? 'Edit Scheme' : 'Add New Scheme'}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Fill in all fields carefully. Fields marked * are required.
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Basic */}
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Basic Information
          </h2>

          <Input
            label="Scheme name *"
            placeholder="e.g. PM-KISAN Samman Nidhi"
            value={form.name}
            onChange={set('name')}
            error={errors.name}
          />
          <Input
            label="Provider / Ministry *"
            placeholder="e.g. Ministry of Agriculture"
            value={form.provider}
            onChange={set('provider')}
            error={errors.provider}
          />
          <Input
            label="Description *"
            as="textarea"
            placeholder="Short summary of the scheme"
            value={form.description}
            onChange={set('description')}
            error={errors.description}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Government level *"
              as="select"
              options={['National', 'State']}
              value={form.governmentLevel}
              onChange={set('governmentLevel')}
            />
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category *</label>
              <select
                value={form.category}
                onChange={set('category')}
                className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none ${
                  errors.category
                    ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                    : 'border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-100'
                }`}
              >
                <option value="">Select category…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              State {form.governmentLevel === 'State' && '*'}
            </label>
            <select
              value={form.state}
              onChange={set('state')}
              disabled={form.governmentLevel === 'National'}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="All India">All India</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="mt-1 text-xs text-red-600">{errors.state}</p>}
          </div>

          {/* Content arrays */}
          <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Content
          </h2>

          <Input
            label="Benefits * (one per line)"
            as="textarea"
            placeholder={'₹6,000 per year\nPaid in 3 instalments'}
            value={form.benefitsText}
            onChange={set('benefitsText')}
            error={errors.benefitsText}
          />
          <Input
            label="Eligibility criteria * (one per line)"
            as="textarea"
            placeholder={'Small / marginal farmer family\nLandholding under 2 hectares'}
            value={form.eligibilityText}
            onChange={set('eligibilityText')}
            error={errors.eligibilityText}
          />

          <Input
            label="Required documents (one per line)"
            as="textarea"
            placeholder={'Aadhaar Card\nLand Records\nBank Passbook'}
            value={form.documentsText}
            onChange={set('documentsText')}
          />
          <Input
            label="Purpose of each document (one per line, same order)"
            as="textarea"
            placeholder={'Identity + DBT linking\nProof of landholding\nFor instalment credit'}
            value={form.purposesText}
            onChange={set('purposesText')}
          />

          <Input
            label="Application steps * (one per line)"
            as="textarea"
            placeholder={'Visit the PM-KISAN portal\nClick "New Farmer Registration"\nComplete OTP verification'}
            value={form.stepsText}
            onChange={set('stepsText')}
            error={errors.stepsText}
          />

          {/* Links */}
          <h2 className="pt-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Links & Verification
          </h2>

          <Input
            label="Official application link *"
            placeholder="https://…"
            value={form.applyLink}
            onChange={set('applyLink')}
            error={errors.applyLink}
          />
          <Input
            label="Official tracking link (leave blank to reuse apply link)"
            placeholder="https://…"
            value={form.trackingLink}
            onChange={set('trackingLink')}
            error={errors.trackingLink}
          />
          <Input
            label="Last verified date *"
            type="date"
            value={form.lastVerified}
            onChange={set('lastVerified')}
            error={errors.lastVerified}
          />

          {/* Active toggle */}
          <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set({ target: { value: e.target.checked } })('active')}
            />
            <div>
              <p className="text-sm font-medium text-slate-800">Active</p>
              <p className="text-xs text-slate-500">
                Inactive schemes are hidden from public pages but remain editable.
              </p>
            </div>
          </label>

          {Object.keys(errors).length > 0 && (
            <ErrorMessage message="Please fix the highlighted fields above." />
          )}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Link to="/admin/schemes">
              <Button type="button" variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit">{editing ? 'Save changes' : 'Create scheme'}</Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
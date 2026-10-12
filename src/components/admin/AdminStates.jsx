import { useState } from 'react'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import { useData } from '../../context/DataContext'
import { useNotification } from '../../context/NotificationContext'

export default function AdminStates() {
  const { states, schemes, addState, deleteState } = useData()
  const { notify } = useNotification()
  const [newState, setNewState] = useState('')
  const [error, setError] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()
    setError('')
    const name = newState.trim()
    if (!name) return setError('Enter a state name.')
    if (name.length < 3) return setError('Name is too short.')
    if (states.includes(name)) return setError('This state already exists.')
    addState(name)
    setNewState('')
    notify('State added.', 'success')
  }

  const onDelete = (name) => {
    const usedBy = schemes.filter((s) => s.state === name).length
    if (usedBy > 0) {
      notify(`Cannot delete — ${usedBy} scheme(s) reference "${name}".`, 'error')
      return
    }
    if (!confirm(`Delete state "${name}"?`)) return
    deleteState(name)
    notify('State removed.', 'info')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Manage States</h1>
        <p className="mt-1 text-sm text-slate-500">
          States appear in the discovery filter and the profile form.
        </p>
      </div>

      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-900">Add State</h2>
        <form onSubmit={onSubmit} className="mt-3 flex flex-wrap items-start gap-3">
          <div className="min-w-[220px] flex-1">
            <Input
              label="State name"
              placeholder="e.g. Karnataka"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              error={error}
            />
          </div>
          <div className="pt-6">
            <Button type="submit">Add</Button>
          </div>
        </form>
      </Card>

      <Card className="p-5">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-800">{states.length}</span> states
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {states.map((s) => (
            <div
              key={s}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              <span>{s}</span>
              <button
                onClick={() => onDelete(s)}
                className="text-slate-400 hover:text-red-600"
                aria-label={`Delete ${s}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
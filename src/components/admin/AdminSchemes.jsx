import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import { useData } from '../../context/DataContext'
import { useNotification } from '../../context/NotificationContext'

export default function AdminSchemes() {
  const { schemes, categories, deleteScheme, setSchemeActive } = useData()
  const { notify } = useNotification()

  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return schemes.filter((s) => {
      if (categoryFilter !== 'all' && s.category !== categoryFilter) return false
      if (statusFilter === 'active' && s.active === false) return false
      if (statusFilter === 'inactive' && s.active !== false) return false
      if (q && !`${s.name} ${s.provider} ${s.description}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [schemes, query, categoryFilter, statusFilter])

  const onDelete = (id, name) => {
    if (!confirm(`Delete "${name}" permanently? Consider deactivating instead.`)) return
    deleteScheme(id)
    notify('Scheme deleted.', 'info')
  }

  const onToggleActive = (s) => {
    setSchemeActive(s.id, s.active === false)
    notify(`Scheme ${s.active === false ? 'activated' : 'deactivated'}.`, 'success')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Schemes</h1>
          <p className="mt-1 text-sm text-slate-500">
            {schemes.length} total · {schemes.filter((s) => s.active !== false).length} active
          </p>
        </div>
        <Link to="/admin/schemes/new">
          <Button>+ Add Scheme</Button>
        </Link>
      </div>

      <Card className="p-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            label="Search"
            placeholder="Search by name, provider…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All</option>
              <option value="active">Active only</option>
              <option value="inactive">Inactive only</option>
            </select>
          </div>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-3xl">🗂️</p>
          <p className="mt-2 text-sm text-slate-500">No schemes match your filters.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto p-0">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Scheme</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">{s.name}</p>
                    <p className="text-xs text-slate-500">{s.provider}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-slate-600">
                    {s.category.replace('-', ' ')}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {s.governmentLevel}
                    {s.state !== 'All India' ? ` · ${s.state}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    {s.active !== false ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Link to={`/admin/schemes/${s.id}/edit`}>
                        <Button size="sm" variant="secondary">Edit</Button>
                      </Link>
                      <Button size="sm" variant="ghost" onClick={() => onToggleActive(s)}>
                        {s.active !== false ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onDelete(s.id, s.name)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  )
}
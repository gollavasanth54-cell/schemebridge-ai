import { Link } from 'react-router-dom'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import { useData } from '../../context/DataContext'

export default function AdminDashboard() {
  const { schemes, categories, states } = useData()

  const total = schemes.length
  const active = schemes.filter((s) => s.active !== false).length
  const inactive = total - active

  const recent = [...schemes]
    .sort((a, b) => {
      const da = new Date(a.lastVerified || 0).getTime()
      const db = new Date(b.lastVerified || 0).getTime()
      return db - da
    })
    .slice(0, 5)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage schemes, categories, states and content.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Schemes</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{total}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Active Schemes</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{active}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Categories</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{categories.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">States</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{states.length}</p>
        </Card>
      </div>

      {/* Secondary stats */}
      <div className="grid gap-3 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
            Inactive Schemes
          </p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{inactive}</p>
          <p className="mt-1 text-xs text-slate-400">
            Hidden from public users, still editable here.
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Local Users
          </p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {(() => {
              try {
                return (JSON.parse(localStorage.getItem('sb_users')) || []).length
              } catch {
                return 0
              }
            })()}
          </p>
          <p className="mt-1 text-xs text-slate-400">Registered on this device.</p>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-5">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/admin/schemes/new">
            <Button>+ Add Scheme</Button>
          </Link>
          <Link to="/admin/schemes">
            <Button variant="secondary">Manage Schemes</Button>
          </Link>
          <Link to="/admin/categories">
            <Button variant="secondary">Manage Categories</Button>
          </Link>
          <Link to="/admin/states">
            <Button variant="secondary">Manage States</Button>
          </Link>
        </div>
      </Card>

      {/* Recently updated */}
      <Card className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Recently Verified Schemes</h2>
          <Link to="/admin/schemes" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            View all →
          </Link>
        </div>
        <div className="mt-3 divide-y divide-slate-100">
          {recent.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">{s.name}</p>
                <p className="text-xs text-slate-500">
                  {s.category} · {s.governmentLevel}
                  {s.state !== 'All India' ? ` · ${s.state}` : ''}
                </p>
              </div>
              <Link
                to={`/admin/schemes/${s.id}/edit`}
                className="shrink-0 text-xs font-medium text-brand-700 hover:underline"
              >
                Edit →
              </Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
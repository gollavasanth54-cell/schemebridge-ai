import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import ApplicationCard from '../components/applications/ApplicationCard'
import { useAuth } from '../context/AuthContext'
import { useApplications } from '../context/ApplicationsContext'

export default function Dashboard() {
  const { user } = useAuth()
  const { applications, stats } = useApplications()

  const recent = [...applications]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3)

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">
          Hi {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here's a quick overview of your SchemeBridge activity.
        </p>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Applications</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Pending</p>
          <p className="mt-2 text-2xl font-bold text-amber-700">{stats.pending}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Approved</p>
          <p className="mt-2 text-2xl font-bold text-emerald-700">{stats.approved}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-red-700">Rejected</p>
          <p className="mt-2 text-2xl font-bold text-red-700">{stats.rejected}</p>
        </Card>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/schemes"><Button className="w-full" size="lg">Discover Schemes</Button></Link>
          <Link to="/check-eligibility"><Button className="w-full" size="lg" variant="secondary">Check Eligibility</Button></Link>
          <Link to="/applications"><Button className="w-full" size="lg" variant="secondary">My Applications</Button></Link>
          <Link to="/profile"><Button className="w-full" size="lg" variant="secondary">Update Profile</Button></Link>
        </div>
      </section>

      {/* Recent applications */}
      {recent.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recently Updated Applications</h2>
            <Link to="/applications" className="text-sm font-medium text-brand-700 hover:text-brand-800">
              View all →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((a) => <ApplicationCard key={a.id} application={a} />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {applications.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-3xl">📋</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-900">
            You haven't tracked any applications yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Save schemes you're interested in or have already applied to.
          </p>
          <Link to="/applications" className="mt-5 inline-block">
            <Button>Add your first application</Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
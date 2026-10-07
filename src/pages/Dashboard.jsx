import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import SchemeCard from '../components/common/SchemeCard'
import { useAuth } from '../context/AuthContext'
import { popularSchemes } from '../data/mockData'

const stats = [
  { label: 'Schemes Matched', value: '12', hint: 'based on your profile' },
  { label: 'Saved Schemes',   value: '4',  hint: 'bookmarked' },
  { label: 'Applications',    value: '0',  hint: 'tracking arrives later' },
  { label: 'Profile Status',  value: '—',  hint: 'complete your profile' },
]

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-slate-900">Hi {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p className="mt-1 text-sm text-slate-500">Here's a quick overview of your SchemeBridge activity.</p>
      </section>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="p-5">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{s.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{s.value}</p>
            <p className="mt-1 text-xs text-slate-400">{s.hint}</p>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/schemes"><Button className="w-full" size="lg">Discover Schemes</Button></Link>
          <Link to="/profile"><Button className="w-full" size="lg" variant="secondary">Update Profile</Button></Link>
          <Link to="/schemes"><Button className="w-full" size="lg" variant="secondary">Check Eligibility</Button></Link>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Recommended for You</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularSchemes.slice(0, 3).map(s => <SchemeCard key={s.id} scheme={s} />)}
        </div>
      </section>
    </div>
  )
}
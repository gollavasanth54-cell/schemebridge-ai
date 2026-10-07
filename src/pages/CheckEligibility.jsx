import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/common/Card'
import Button from '../components/common/Button'
import SchemeMatchCard from '../components/common/SchemeMatchCard'
import { useAuth } from '../context/AuthContext'
import { schemes } from '../data/mockData'
import { evaluateAll, getMissingKeyFields, STATUS } from '../utils/eligibility'

const TABS = [
  { id: 'all',          label: 'All' },
  { id: STATUS.ELIGIBLE,     label: 'Potentially Eligible' },
  { id: STATUS.INFO_NEEDED,  label: 'More Info Required' },
  { id: STATUS.NOT_MATCHING, label: 'Not Matching' },
]

export default function CheckEligibility() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('all')

  const profile = user?.profile || {}

  const missingKeyFields = useMemo(() => getMissingKeyFields(profile), [profile])

  const results = useMemo(() => {
    if (!user) return []
    return evaluateAll(schemes, profile)
  }, [user, profile])

  const counts = useMemo(() => ({
    all:          results.length,
    eligible:     results.filter(r => r.status === STATUS.ELIGIBLE).length,
    info_needed:  results.filter(r => r.status === STATUS.INFO_NEEDED).length,
    not_matching: results.filter(r => r.status === STATUS.NOT_MATCHING).length,
  }), [results])

  const filtered = useMemo(() => {
    if (activeTab === 'all') return results
    return results.filter(r => r.status === activeTab)
  }, [results, activeTab])

  // ---- Not logged in ----
  if (!user) {
    return (
      <div className="mx-auto max-w-lg py-10">
        <Card className="p-8 text-center">
          <p className="text-4xl">🔐</p>
          <h1 className="mt-3 text-xl font-bold text-slate-900">Please log in first</h1>
          <p className="mt-2 text-sm text-slate-500">
            Eligibility matching uses your profile details. Log in to continue.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login"><Button>Login</Button></Link>
            <Link to="/register"><Button variant="secondary">Register</Button></Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Check My Eligibility</h1>
        <p className="mt-1 text-sm text-slate-500">
          We compare your profile against each scheme's published eligibility criteria.
        </p>
      </div>

      {/* Disclaimer */}
      <Card className="border-amber-200 bg-amber-50 p-4">
        <p className="text-sm text-amber-900">
          <span className="font-semibold">ℹ️ Note: </span>
          This is a preliminary self-assessment based on your profile. It is <span className="font-semibold">not</span>{' '}
          an official government eligibility confirmation. Always verify on the official scheme portal before applying.
        </p>
      </Card>

      {/* Profile completeness warning */}
      {missingKeyFields.length > 0 && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Your profile is missing some information.
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Missing: {missingKeyFields.join(', ')}. Filling these improves accuracy.
              </p>
            </div>
            <Link to="/profile"><Button size="sm" variant="secondary">Complete Profile</Button></Link>
          </div>
        </Card>
      )}

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Total Schemes</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{counts.all}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Potentially Eligible</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{counts.eligible}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">More Info Needed</p>
          <p className="mt-1 text-2xl font-bold text-amber-700">{counts.info_needed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-red-700">Not Matching</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{counts.not_matching}</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {TABS.map((tab) => {
          const active = activeTab === tab.id
          const count = tab.id === 'all' ? counts.all : counts[tab.id]
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                active
                  ? 'bg-brand-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab.label} <span className={`ml-1 ${active ? 'text-brand-100' : 'text-slate-400'}`}>({count})</span>
            </button>
          )
        })}
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-3xl">🗂️</p>
          <p className="mt-2 font-medium text-slate-800">No schemes in this category</p>
          <p className="mt-1 text-sm text-slate-500">Try a different tab.</p>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((r) => <SchemeMatchCard key={r.scheme.id} result={r} />)}
        </div>
      )}

      <p className="pt-4 text-center text-xs text-slate-400">
        Results are indicative only. Final eligibility is decided by the concerned government department.
      </p>
    </div>
  )
}
import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import Card from '../components/common/Card'
import SchemeCard from '../components/common/SchemeCard'
import SearchBar from '../components/common/SearchBar'
import Button from '../components/common/Button'
import { schemeCategories, schemes, indianStates } from '../data/mockData'

export default function Schemes() {
  const [params, setParams] = useSearchParams()

  const [query, setQuery]       = useState(params.get('q') || '')
  const [category, setCategory] = useState(params.get('cat') || 'all')
  const [level, setLevel]       = useState(params.get('level') || 'all')
  const [state, setState]       = useState(params.get('state') || 'all')

  // Keep state in sync with URL
  useEffect(() => {
    setQuery(params.get('q') || '')
    setCategory(params.get('cat') || 'all')
    setLevel(params.get('level') || 'all')
    setState(params.get('state') || 'all')
  }, [params])

  const filtered = useMemo(() => {
    return schemes.filter(s => {
      if (category !== 'all' && s.category !== category) return false
      if (level !== 'all' && s.governmentLevel !== level) return false

      if (state !== 'all') {
        // Include National schemes (apply everywhere) + matching State schemes
        if (s.governmentLevel === 'National') {
          // still include
        } else if (s.state !== state) {
          return false
        }
      }

      const q = query.trim().toLowerCase()
      if (q) {
        const hay = `${s.name} ${s.description} ${s.provider} ${s.category}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [query, category, level, state])

  const pushParams = () => {
    const next = {}
    if (query.trim()) next.q = query.trim()
    if (category !== 'all') next.cat = category
    if (level !== 'all') next.level = level
    if (state !== 'all') next.state = state
    setParams(next)
  }

  const onSearch = (e) => {
    e.preventDefault()
    pushParams()
  }

  const clearAll = () => {
    setQuery(''); setCategory('all'); setLevel('all'); setState('all')
    setParams({})
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Discover Schemes</h1>
        <p className="mt-1 text-sm text-slate-500">
          Search {schemes.length} government schemes across scholarships, health, housing and more.
        </p>
      </div>

      {/* Search */}
      <SearchBar value={query} onChange={setQuery} onSubmit={onSearch} />

      {/* Filters */}
      <Card className="p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={category}
              onChange={(e) => { setCategory(e.target.value); }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All Categories</option>
              {schemeCategories.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Level</label>
            <select
              value={level}
              onChange={(e) => { setLevel(e.target.value); }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            >
              <option value="all">All Levels</option>
              <option value="National">National</option>
              <option value="State">State</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">State</label>
            <select
              value={state}
              onChange={(e) => { setState(e.target.value); }}
              disabled={level === 'National'}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-400"
            >
              <option value="all">All States</option>
              {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filtered.length}</span> scheme{filtered.length !== 1 ? 's' : ''} found
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={clearAll}>Clear filters</Button>
            <Button size="sm" onClick={pushParams}>Apply</Button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-3xl">🔍</p>
          <p className="mt-2 font-medium text-slate-800">No schemes match your filters</p>
          <p className="mt-1 text-sm text-slate-500">Try clearing filters or searching for something else.</p>
          <Button className="mt-4" variant="secondary" onClick={clearAll}>Clear filters</Button>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => <SchemeCard key={s.id} scheme={s} />)}
        </div>
      )}
    </div>
  )
}
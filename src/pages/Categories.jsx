import { useMemo, useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Card from '../components/common/Card'
import SchemeCard from '../components/common/SchemeCard'
import SearchBar from '../components/common/SearchBar'
import { schemeCategories, schemes } from '../data/mockData'

export default function Categories() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') || '')
  const [active, setActive] = useState(params.get('cat') || 'all')

  useEffect(() => {
    setQuery(params.get('q') || '')
    setActive(params.get('cat') || 'all')
  }, [params])

  const filtered = useMemo(() => {
    return schemes.filter(s => {
      const matchCat = active === 'all' || s.category === active
      const q = query.trim().toLowerCase()
      const matchQ = !q
        || s.name.toLowerCase().includes(q)
        || s.provider.toLowerCase().includes(q)
        || s.description.toLowerCase().includes(q)
      return matchCat && matchQ
    })
  }, [active, query])

  const onSearch = (e) => {
    e.preventDefault()
    const next = {}
    if (query.trim()) next.q = query.trim()
    if (active !== 'all') next.cat = active
    setParams(next)
  }

  const pickCategory = (id) => {
    const next = {}
    if (query.trim()) next.q = query.trim()
    if (id !== 'all') next.cat = id
    setParams(next)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Scheme Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Browse schemes by category or search for something specific.</p>
      </div>

      <SearchBar value={query} onChange={setQuery} onSubmit={onSearch} />

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => pickCategory('all')}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === 'all' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          All
        </button>
        {schemeCategories.map(c => (
          <button
            key={c.id}
            onClick={() => pickCategory(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === c.id ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      <div className="text-right">
        <Link to="/schemes" className="text-sm font-medium text-brand-700 hover:text-brand-800">
          Try advanced filters on Discover Schemes →
        </Link>
      </div>

      {filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-slate-500">No schemes match your search.</p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(s => <SchemeCard key={s.id} scheme={s} />)}
        </div>
      )}
    </div>
  )
}
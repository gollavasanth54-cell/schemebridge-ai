import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import SearchBar from '../components/common/SearchBar'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import SchemeCard from '../components/common/SchemeCard'
import { schemeCategories, popularSchemes, schemes } from '../data/mockData'
import { useNotification } from '../context/NotificationContext'

export default function Home() {
  const navigate = useNavigate()
  const { notify } = useNotification()
  const [query, setQuery] = useState('')

  const onSearch = (e) => {
    e.preventDefault()
    if (!query.trim()) return notify('Type something to search.', 'warning')
    navigate(`/schemes?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-white sm:px-10 sm:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">Find the right government scheme, effortlessly.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-brand-50 sm:text-base">
            SchemeBridge AI helps students and citizens discover schemes and scholarships,
            understand eligibility, know required documents, and learn how to apply.
          </p>

          <div className="mt-8">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={onSearch}
              placeholder="Search schemes, scholarships, benefits…"
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" onClick={() => navigate('/schemes')}>
              Find Schemes
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/check-eligibility')}>
              Check Eligibility
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/assistant')}>
              Ask AI
            </Button>
          </div>

          <p className="mt-4 text-xs text-brand-100">
            {schemes.length} schemes available across {schemeCategories.length} categories
          </p>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Popular Categories</h2>
          <Link to="/schemes" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {schemeCategories.slice(0, 10).map((c) => (
            <Link key={c.id} to={`/schemes?cat=${c.id}`}>
              <Card className="flex h-full flex-col items-center gap-2 p-4 text-center transition-shadow hover:shadow-md">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-medium leading-tight text-slate-800">{c.name}</span>
                <span className="text-xs text-slate-400">{c.count} schemes</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular schemes */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Popular Schemes</h2>
          <Link to="/schemes" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            See all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popularSchemes.map((s) => (
            <SchemeCard key={s.id} scheme={s} />
          ))}
        </div>
      </section>

      {/* AI Assistant CTA */}
      <section>
        <Card className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Have a question?</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ask the AI Assistant about eligibility, documents, benefits, or application steps.
            </p>
          </div>
          <Button size="lg" onClick={() => navigate('/assistant')}>
            Ask AI Assistant
          </Button>
        </Card>
      </section>
    </div>
  )
}
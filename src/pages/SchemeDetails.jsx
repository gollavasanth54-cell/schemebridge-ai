import { useParams, Link } from 'react-router-dom'
import Button from '../components/common/Button'
import Card from '../components/common/Card'
import { getSchemeById, schemeCategories } from '../data/mockData'

function Section({ icon, title, children }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <span>{icon}</span> {title}
      </h2>
      <div className="mt-3">{children}</div>
    </Card>
  )
}

export default function SchemeDetails() {
  const { id } = useParams()
  const scheme = getSchemeById(id)

  if (!scheme) {
    return (
      <Card className="p-10 text-center">
        <p className="text-3xl">😕</p>
        <h1 className="mt-2 text-xl font-bold text-slate-900">Scheme not found</h1>
        <p className="mt-1 text-sm text-slate-500">The scheme you are looking for does not exist.</p>
        <Link to="/schemes" className="mt-6 inline-block">
          <Button>Back to Schemes</Button>
        </Link>
      </Card>
    )
  }

  const category = schemeCategories.find(c => c.id === scheme.category)
  const hasSeparateTracking =
    scheme.trackingLink && scheme.trackingLink !== scheme.applyLink

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="text-sm text-slate-500">
        <Link to="/schemes" className="hover:text-brand-700">Schemes</Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{scheme.name}</span>
      </nav>

      {/* Header */}
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{scheme.name}</h1>
            <p className="mt-1 text-sm text-slate-500">{scheme.provider}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                scheme.governmentLevel === 'National'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'bg-amber-50 text-amber-700'
              }`}>
                {scheme.governmentLevel}
              </span>
              {category && (
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                  {category.icon} {category.name}
                </span>
              )}
              {scheme.state && scheme.state !== 'All India' && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  📍 {scheme.state}
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mt-5 text-sm text-slate-700">{scheme.description}</p>

        {/* Apply buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={scheme.applyLink} target="_blank" rel="noreferrer">
            <Button size="lg">Apply on Official Portal</Button>
          </a>
          {hasSeparateTracking && (
            <a href={scheme.trackingLink} target="_blank" rel="noreferrer">
              <Button size="lg" variant="secondary">Track Application</Button>
            </a>
          )}
        </div>

        {!hasSeparateTracking && (
          <p className="mt-3 text-xs text-slate-500">
            ℹ️ Application status can be tracked on the same official portal after you submit your application.
          </p>
        )}

        <p className="mt-4 text-xs text-slate-400">
          Last verified: {new Date(scheme.lastVerified).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'long', year: 'numeric'
          })}
        </p>
      </Card>

      {/* Benefits */}
      <Section icon="🎁" title="Benefits">
        <ul className="space-y-2">
          {scheme.benefits.map((b, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-1 text-emerald-600">✓</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Eligibility */}
      <Section icon="✅" title="Eligibility Criteria">
        <ul className="space-y-2">
          {scheme.eligibility.map((e, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="mt-1 text-brand-600">•</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* Documents */}
      <Section icon="📄" title="Required Documents">
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {scheme.documents.map((doc, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium text-slate-800">{doc.name}</td>
                  <td className="px-4 py-3 text-slate-600">{doc.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Steps */}
      <Section icon="🪜" title="How to Apply — Step by Step">
        <ol className="space-y-3">
          {scheme.applicationSteps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-700">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700">
                {i + 1}
              </span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </Section>

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3">
        <a href={scheme.applyLink} target="_blank" rel="noreferrer">
          <Button size="lg">Go to Official Apply Page ↗</Button>
        </a>
        {hasSeparateTracking && (
          <a href={scheme.trackingLink} target="_blank" rel="noreferrer">
            <Button size="lg" variant="secondary">Track Status ↗</Button>
          </a>
        )}
      </div>

      <div className="pt-2">
        <Link to="/schemes">
          <Button variant="ghost">← Back to all schemes</Button>
        </Link>
      </div>
    </div>
  )
}
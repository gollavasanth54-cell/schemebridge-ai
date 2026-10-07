import Card from './Card'
import Button from './Button'

const STEPS = [
  { title: 'Preparation',          description: 'Gather every document listed in the "Required Documents" section above. Scan or photograph them clearly (JPG / PDF).', onGovSite: false },
  { title: 'Registration',         description: 'Visit the official portal and create an account using your mobile number and email. You will receive an OTP.',         onGovSite: true },
  { title: 'Filling Application',  description: 'Log in and fill the application form with accurate personal, academic, and bank details.',                              onGovSite: true },
  { title: 'Uploading Documents',  description: "Upload scanned copies of all required documents. Follow the portal's format and size limits.",                          onGovSite: true },
  { title: 'Verification',         description: 'Review your application carefully. Some schemes require verification by your school, college, or local office.',         onGovSite: true },
  { title: 'Submission',           description: 'Submit the final application before the deadline. Some portals also charge a small fee (usually ₹0–₹100).',            onGovSite: true },
  { title: 'Save Reference Number',description: 'Download or note down your application / reference number. You will need it to track your application later.',         onGovSite: false },
]

export default function ApplicationGuide({ applyLink, schemeName }) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
        <span>📘</span> Step-by-Step Application Guide
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Follow these steps to apply for <span className="font-medium text-slate-700">{schemeName}</span>. Steps
        marked <span className="rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-700">Official Site</span>{' '}
        take you away from SchemeBridge to a government website.
      </p>

      <ol className="mt-5 space-y-4">
        {STEPS.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
              {i + 1}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-slate-900">{step.title}</h3>
                {step.onGovSite && (
                  <span className="rounded bg-brand-50 px-1.5 py-0.5 text-xs font-medium text-brand-700">
                    Official Site
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-wrap gap-3">
        <a href={applyLink} target="_blank" rel="noreferrer">
          <Button>Start on Official Portal ↗</Button>
        </a>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        💡 Some government portals occasionally go down for maintenance. If a link does not open, try again later.
      </p>
    </Card>
  )
}
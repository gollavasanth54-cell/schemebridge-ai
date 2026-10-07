import { schemes, schemeCategories, getSchemeById } from '../data/mockData'
import { evaluateScheme, STATUS, STATUS_LABELS } from './eligibility'

// ---------- Helpers ----------

const norm = (s) =>
  s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()

// --- Fuzzy string matching (bigram similarity) ---
// Handles typos like "schloarship" → "scholarship", "heath" → "health"
function bigrams(s) {
  const out = []
  for (let i = 0; i < s.length - 1; i++) out.push(s.slice(i, i + 2))
  return out
}

function similarity(a, b) {
  if (a === b) return 1
  if (!a || !b) return 0
  const A = bigrams(a)
  const B = bigrams(b)
  if (!A.length || !B.length) return 0
  const setB = new Set(B)
  let hits = 0
  for (const g of A) if (setB.has(g)) hits++
  return (2 * hits) / (A.length + B.length)
}

function fuzzyIncludes(text, keyword, threshold = 0.55) {
  if (!keyword) return false
  if (text.includes(keyword)) return true
  // compare against each word in the text
  const words = text.split(' ')
  const klen = keyword.length
  for (const w of words) {
    if (Math.abs(w.length - klen) > 3) continue
    if (similarity(w, keyword) >= threshold) return true
  }
  return false
}

// Words too generic to identify a single scheme.
const SCHEME_STOPWORDS = new Set([
  'scheme', 'schemes', 'yojana', 'plan', 'program', 'programme', 'mission',
  'health', 'education', 'women', 'woman', 'child', 'children',
  'farmer', 'farmers', 'farming', 'scholarship', 'scholarships',
  'housing', 'house', 'employment', 'welfare', 'senior', 'citizens', 'citizen',
  'other', 'state', 'national', 'india', 'indian', 'government', 'govt', 'central',
  'pension', 'insurance', 'loan', 'benefit', 'benefits', 'subsidy', 'cover',
  'document', 'documents', 'eligibility', 'eligible', 'application', 'status',
  'prakalpa', 'arogya', 'suraksha', 'bima', 'samman', 'nidhi',
  'which', 'what', 'where', 'when', 'how', 'more', 'list', 'show', 'find',
  'about', 'please', 'give', 'tell', 'need', 'want', 'know', 'information',
  'card', 'cards',
])

// Find a scheme referenced in the message
function detectScheme(text) {
  const t = norm(text)
  if (!t) return null

  // 1. Exact id match (e.g. "pm kisan", "ayushman bharat")
  for (const s of schemes) {
    const idWords = s.id.replace(/-/g, ' ')
    if (t.includes(idWords)) return s
  }

  // 2. Full scheme name substring
  for (const s of schemes) {
    if (t.includes(norm(s.name))) return s
  }

  // 3. Distinctive-word scoring — require 2+ distinctive-word matches
  let best = null
  let bestScore = 0
  for (const s of schemes) {
    const words = norm(s.name)
      .split(' ')
      .filter((w) => w.length >= 4 && !SCHEME_STOPWORDS.has(w))
    let score = 0
    for (const w of words) {
      if (fuzzyIncludes(t, w, 0.75)) score++
    }
    if (score > bestScore) {
      bestScore = score
      best = s
    }
  }
  return bestScore >= 2 ? best : null
}

// Detect category — uses fuzzyIncludes so typos work.
function detectCategory(text) {
  const t = norm(text)
  const map = {
    scholarships:      ['scholarship', 'scholarships', 'schol'],
    education:         ['education', 'study', 'college', 'tuition', 'degree'],
    employment:        ['employment', 'job', 'jobs', 'skill', 'startup', 'business'],
    health:            ['health', 'medical', 'hospital', 'treatment', 'surgery'],
    housing:           ['housing', 'awas', 'rent', 'flat'],
    'women-child':     ['women', 'woman', 'girl', 'child', 'maternity', 'mother', 'pregnant'],
    'senior-citizens': ['senior', 'elderly', 'elder', 'retirement'],
    agriculture:       ['farmer', 'farmers', 'farming', 'crop', 'agriculture', 'kisan', 'soil', 'irrigation'],
    welfare:           ['welfare', 'bpl'],
    other:             ['electricity', 'sanitation', 'digital'],
  }
  for (const [cat, keys] of Object.entries(map)) {
    if (keys.some((k) => fuzzyIncludes(t, k, 0.55))) return cat
  }
  return null
}

// Detect intent
function detectIntent(text) {
  const t = norm(text)
  const has = (...words) => words.some((w) => t.includes(w))

  if (has('hello', 'hi there', 'hey', 'namaste') && t.length < 25) return 'greeting'
  if (has('what can you do', 'what can you', 'help me', 'your capabilities')) return 'help'

  // "more" / "other" schemes
  if (
    has(
      'other scheme', 'other schemes',
      'more scheme', 'more schemes',
      'any other', 'show more', 'more options',
      'list more', 'more suggestions'
    )
  ) return 'more'

  if (has('track', 'tracking', 'status of my', 'application status')) return 'tracking'

  if (has('document', 'documents', 'paper', 'papers', 'certificate', 'certificates')) {
    if (has('why', 'purpose', 'needed', 'required', 'reason')) return 'documents_purpose'
    return 'documents'
  }

  if (has('benefit', 'benefits', 'how much', 'amount', 'money', 'subsidy')) return 'benefits'

  if (
    has('eligible', 'eligibility', 'qualify', 'can i apply', 'am i', 'do i qualify', 'applicable')
  ) return 'eligibility'

  if (has('how to apply', 'how do i apply', 'how can i apply', 'application process', 'application steps', 'procedure')) return 'apply'
  if (has('apply for', 'apply to', 'want to apply', 'can apply', 'can i get')) return 'find'

  if (has('link', 'website', 'portal', 'url', 'official site', 'where to apply')) return 'link'

  if (has('which', 'find', 'show me', 'recommend', 'suggest', 'list', 'best schemes', 'available schemes')) return 'find'

  return 'unknown'
}

// ---------- Handlers ----------

function handleGreeting() {
  return {
    text:
      "👋 Hi! I'm the **SchemeBridge AI Assistant**.\n\n" +
      'I can help you:\n• Find suitable government schemes\n• Understand eligibility (preliminary)\n• List required documents and their purposes\n• Explain benefits\n• Walk you through application steps\n• Share official portals and tracking links\n\n' +
      'Ask me anything, or tap an example below.',
  }
}

function handleHelp() {
  return {
    text:
      "Here's what I can help with:\n\n" +
      '• **Finding schemes** — "Which scholarships can I apply for?"\n' +
      '• **Eligibility** — "Am I eligible for PM-KISAN?"\n' +
      '• **Documents** — "What documents are required?"\n' +
      '• **Benefits** — "What are the benefits of Ayushman Bharat?"\n' +
      '• **Application steps** — "How do I apply?"\n' +
      '• **Official links** — "Where is the official site?"\n' +
      '• **Tracking** — "Where can I track my application?"\n\n' +
      'Just ask in plain English.',
  }
}

function handleFind(scheme, category) {
  if (category && !scheme) {
    const cat = schemeCategories.find((c) => c.id === category)
    const list = schemes.filter((s) => s.category === category)
    if (list.length === 0) {
      return { text: `I couldn't find any schemes in the **${category}** category.` }
    }
    return {
      text:
        `Here are all **${cat?.name || category}** schemes (${list.length}):\n\n` +
        list.map((s) => `• **${s.name}** — ${s.provider}`).join('\n') +
        `\n\nAsk about any specific scheme for details (e.g., "What documents are required for X?").`,
      categoryRef: category,
    }
  }

  if (scheme) {
    return {
      text:
        `**${scheme.name}**\n\n` +
        `**Provider:** ${scheme.provider}\n` +
        `**Level:** ${scheme.governmentLevel}${scheme.state !== 'All India' ? ` – ${scheme.state}` : ''}\n` +
        `**Category:** ${scheme.category.replace('-', ' ')}\n\n` +
        `**Benefits:**\n${scheme.benefits.map((b) => `• ${b}`).join('\n')}\n\n` +
        `**Eligibility:**\n${scheme.eligibility.map((e) => `• ${e}`).join('\n')}\n\n` +
        `Ask me about documents, application steps, or eligibility for this scheme.`,
      schemeRef: scheme.id,
      categoryRef: scheme.category,
    }
  }

  return {
    text:
      `I have **${schemes.length} schemes** across **${schemeCategories.length} categories**. Which area interests you?\n\n` +
      schemeCategories.map((c) => `• ${c.icon} ${c.name} (${c.count})`).join('\n') +
      `\n\nOr tell me your situation (e.g., "I'm a student from West Bengal") and I'll suggest matches.`,
  }
}

function handleMore(scheme, category, context) {
  const effectiveCategory = category || scheme?.category || context.lastCategory

  if (effectiveCategory) {
    const cat = schemeCategories.find((c) => c.id === effectiveCategory)
    const list = schemes.filter(
      (s) => s.category === effectiveCategory && s.id !== scheme?.id
    )
    if (list.length === 0) {
      return {
        text: `There are no other schemes in the **${cat?.name || effectiveCategory}** category.`,
        categoryRef: effectiveCategory,
      }
    }
    return {
      text:
        `Other **${cat?.name || effectiveCategory}** schemes (${list.length}):\n\n` +
        list.map((s) => `• **${s.name}** — ${s.provider}`).join('\n') +
        `\n\nAsk about any specific one for details.`,
      categoryRef: effectiveCategory,
    }
  }

  return handleFind(null, null)
}

function handleEligibility(scheme, category, context) {
  const profile = context.profile || {}
  const filledCount = ['age', 'state', 'userType', 'education', 'annualIncome'].filter(
    (f) => profile[f] !== '' && profile[f] != null
  ).length

  if (filledCount === 0) {
    return {
      text:
        'I can run a preliminary eligibility check, but I need your profile details first — age, state, education, income.\n\nPlease fill your **Profile**, then ask again. Or visit the **Check Eligibility** page for a full breakdown.\n\n⚠️ Eligibility suggestions are preliminary and not official government approval.',
    }
  }

  if (!scheme && category) {
    const cat = schemeCategories.find((c) => c.id === category)
    const results = schemes
      .filter((s) => s.category === category)
      .map((s) => ({ scheme: s, ...evaluateScheme(s, profile) }))

    const eligible = results.filter((r) => r.status === STATUS.ELIGIBLE)
    const infoNeeded = results.filter((r) => r.status === STATUS.INFO_NEEDED)
    const notMatch = results.length - eligible.length - infoNeeded.length

    const top = eligible
      .slice(0, 5)
      .map((r) => `• **${r.scheme.name}**`)
      .join('\n')

    return {
      text:
        `Preliminary check for **${cat?.name || category}** (${results.length} schemes):\n\n` +
        `✓ Potentially Eligible: **${eligible.length}**\n` +
        `! More Info Needed: **${infoNeeded.length}**\n` +
        `✕ Not Matching: **${notMatch}**\n` +
        (top ? `\nTop matches:\n${top}\n` : '') +
        `\nOpen the **Check Eligibility** page for a detailed breakdown with reasons.\n\n` +
        `⚠️ Preliminary only — not official government approval.`,
      categoryRef: category,
    }
  }

  if (scheme) {
    const result = evaluateScheme(scheme, profile)
    const label = STATUS_LABELS[result.status]
    const reasons = result.reasons
      .map((r) => {
        const icon = r.type === 'match' ? '✓' : r.type === 'mismatch' ? '✕' : '!'
        return `${icon} ${r.text}`
      })
      .join('\n')

    const missing =
      result.missingFields.length > 0
        ? `\n\nTo improve accuracy, please add to your profile: **${result.missingFields.join(', ')}**.`
        : ''

    return {
      text:
        `**Preliminary eligibility: ${label}** for **${scheme.name}**\n\n` +
        `${reasons}${missing}\n\n` +
        `⚠️ This is a self-assessment based on your profile — not an official government confirmation. Please verify on the official portal.`,
      schemeRef: scheme.id,
      categoryRef: scheme.category,
    }
  }

  return {
    text:
      'Which scheme or category should I check? For example:\n\n' +
      '• Am I eligible for PM-KISAN?\n' +
      '• Am I eligible for scholarships?\n\n' +
      'Or visit the **Check Eligibility** page for a full check across all schemes.',
  }
}

function handleDocuments(scheme, category, withPurpose) {
  if (scheme) {
    const lines = scheme.documents
      .map((d) => (withPurpose ? `• **${d.name}** — ${d.purpose}` : `• ${d.name}`))
      .join('\n')
    return {
      text:
        `${withPurpose ? 'Required documents and their purposes' : 'Required documents'} for **${scheme.name}**:\n\n` +
        `${lines}\n\nTip: scan them clearly as PDF or JPG before applying.`,
      schemeRef: scheme.id,
      categoryRef: scheme.category,
    }
  }

  if (category) {
    const cat = schemeCategories.find((c) => c.id === category)
    const list = schemes.filter((s) => s.category === category).slice(0, 8)
    return {
      text:
        `Different **${cat?.name || category}** schemes need different documents. Which one?\n\n` +
        list.map((s) => `• ${s.name}`).join('\n') +
        `\n\nReply with the scheme name, and I'll list its required documents.`,
      categoryRef: category,
    }
  }

  return {
    text: "Tell me which scheme you're asking about, and I'll list the required documents and what each one is for.\n\nFor example: **What documents are required for Ayushman Bharat?**",
  }
}

function handleBenefits(scheme, category) {
  if (scheme) {
    return {
      text:
        `**Benefits of ${scheme.name}:**\n\n` +
        scheme.benefits.map((b) => `• ${b}`).join('\n') +
        `\n\nSource: ${scheme.provider}`,
      schemeRef: scheme.id,
      categoryRef: scheme.category,
    }
  }

  if (category) {
    const cat = schemeCategories.find((c) => c.id === category)
    return {
      text: `Benefits vary per scheme. Which one are you asking about? I have ${cat?.count || 'several'} **${cat?.name || category}** schemes. Just name the scheme.`,
      categoryRef: category,
    }
  }

  return {
    text: "Which scheme's benefits would you like to know? For example: **What are the benefits of Sukanya Samriddhi Yojana?**",
  }
}

function handleApply(scheme, category) {
  if (!scheme && category) {
    const cat = schemeCategories.find((c) => c.id === category)
    const list = schemes.filter((s) => s.category === category).slice(0, 8)
    return {
      text:
        `Which **${cat?.name || category}** scheme do you want to apply for?\n\n` +
        list.map((s) => `• ${s.name}`).join('\n') +
        `\n\nReply with the scheme name for step-by-step instructions.`,
      categoryRef: category,
    }
  }
  if (!scheme) {
    return {
      text: "Which scheme are you applying for? I'll walk you through the steps and share the official portal.\n\nFor example: **How do I apply for PM-KISAN?**",
    }
  }
  const steps = scheme.applicationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')
  return {
    text:
      `**How to apply for ${scheme.name}:**\n\n${steps}\n\n` +
      `**Official portal:** ${scheme.applyLink}\n\n` +
      `Most of these steps happen on the official government website.`,
    schemeRef: scheme.id,
    categoryRef: scheme.category,
    links: [{ label: 'Open Official Portal', url: scheme.applyLink }],
  }
}

function handleTracking(scheme, category) {
  if (!scheme) {
    return {
      text: "Which scheme are you tracking? Tell me the name, or open the scheme's details page for its tracking link.",
      ...(category ? { categoryRef: category } : {}),
    }
  }
  const link = scheme.trackingLink || scheme.applyLink
  const same = link === scheme.applyLink

  return {
    text:
      `**Tracking ${scheme.name}:**\n\n` +
      (same
        ? `Tracking is usually available on the same portal where you applied:\n${link}\n\nLook for a "Track Application" or "Check Status" link after logging in.`
        : `Official tracking link:\n${link}`) +
      `\n\nℹ️ I do **not** have access to real government application status. You'll need to check on the official portal.`,
    schemeRef: scheme.id,
    categoryRef: scheme.category,
    links: [{ label: 'Open Tracking Portal', url: link }],
  }
}

function handleLink(scheme, category) {
  if (!scheme) {
    return {
      text: "Which scheme's official link do you need? Tell me the scheme name.",
      ...(category ? { categoryRef: category } : {}),
    }
  }
  const hasTracking = scheme.trackingLink && scheme.trackingLink !== scheme.applyLink
  return {
    text:
      `**Official links for ${scheme.name}:**\n\n` +
      `• Apply: ${scheme.applyLink}\n` +
      (hasTracking ? `• Track: ${scheme.trackingLink}\n` : '') +
      `\nProvider: ${scheme.provider}\nLast verified: ${scheme.lastVerified}`,
    schemeRef: scheme.id,
    categoryRef: scheme.category,
    links: [
      { label: 'Apply Portal', url: scheme.applyLink },
      ...(hasTracking ? [{ label: 'Track Portal', url: scheme.trackingLink }] : []),
    ],
  }
}

function handleFallback(scheme) {
  if (scheme) {
    return {
      text:
        `I have information about **${scheme.name}**. What would you like to know?\n\n` +
        '• Benefits\n• Eligibility\n• Required documents\n• Application steps\n• Official link',
      schemeRef: scheme.id,
      categoryRef: scheme.category,
    }
  }
  return {
    text:
      "I'm not sure I understood that. I can help with:\n\n" +
      '• Finding schemes ("Which scholarships are there?")\n' +
      '• Eligibility ("Am I eligible for PM-KISAN?")\n' +
      '• Documents ("What documents are required?")\n' +
      '• Benefits ("What are the benefits?")\n' +
      '• Application steps ("How do I apply?")\n' +
      '• Official links ("Where is the official site?")\n\n' +
      'Try rephrasing, or tap an example below.',
  }
}

// ---------- Public API ----------

export function getBotReply(message, history = [], context = {}) {
  const text = String(message || '').trim()
  if (!text) return { text: 'Could you type something?' }

  const rawIntent = detectIntent(text)
  const category = detectCategory(text)
  let scheme = detectScheme(text)

  // If the user clearly asked for a category but no scheme,
  // and no specific intent matched → treat as "find".
  let intent = rawIntent
  if (intent === 'unknown' && (category || scheme)) {
    intent = 'find'
  }

  // Context fallback: only use lastSchemeId if the user didn't
  // mention a category or a new scheme.
  if (!scheme && !category && context.lastSchemeId) {
    scheme = getSchemeById(context.lastSchemeId)
  }

  switch (intent) {
    case 'greeting':          return handleGreeting()
    case 'help':              return handleHelp()
    case 'more':              return handleMore(scheme, category, context)
    case 'find':              return handleFind(scheme, category)
    case 'eligibility':       return handleEligibility(scheme, category, context)
    case 'documents':         return handleDocuments(scheme, category, false)
    case 'documents_purpose': return handleDocuments(scheme, category, true)
    case 'benefits':          return handleBenefits(scheme, category)
    case 'apply':             return handleApply(scheme, category)
    case 'tracking':          return handleTracking(scheme, category)
    case 'link':              return handleLink(scheme, category)
    default:                  return handleFallback(scheme)
  }
}

export const EXAMPLE_QUESTIONS = [
  'Which scholarships can I apply for?',
  'What documents are required for PM-KISAN?',
  'Am I eligible for Ayushman Bharat?',
  'How do I apply for NSP Scholarship?',
  'Where can I track my PM-KISAN application?',
  'What are the benefits of Sukanya Samriddhi?',
  'Which schemes are for farmers?',
  'Which schemes are for women?',
  'What documents are required for a housing scheme?',
]
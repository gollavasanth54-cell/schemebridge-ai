import { eligibilityRules } from '../data/eligibilityRules'

export const STATUS = {
  ELIGIBLE:     'eligible',
  INFO_NEEDED:  'info_needed',
  NOT_MATCHING: 'not_matching',
}

export const STATUS_LABELS = {
  eligible:     'Potentially Eligible',
  info_needed:  'More Information Required',
  not_matching: 'Not Matching',
}

export const STATUS_STYLES = {
  eligible:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  info_needed:  'bg-amber-50 text-amber-700 border-amber-200',
  not_matching: 'bg-red-50 text-red-700 border-red-200',
}

const EDUCATION_LEVELS = ['Below 10th', '10th Pass', '12th Pass', 'Diploma', 'Graduate', 'Post Graduate', 'Other']
const rankEducation = (lvl) => EDUCATION_LEVELS.indexOf(lvl)

const fmtINR = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export function evaluateScheme(scheme, profile = {}) {
  const rules = eligibilityRules[scheme.id] || {}
  const reasons = []
  const missingFields = []
  let hasMismatch = false
  let hasMissing = false

  // --- Age ---
  if (rules.minAge != null || rules.maxAge != null) {
    if (profile.age === '' || profile.age == null) {
      missingFields.push('age')
      reasons.push({ type: 'missing', text: 'Please add your age to verify the age requirement.' })
      hasMissing = true
    } else {
      const age = Number(profile.age)
      const min = rules.minAge ?? 0
      const max = rules.maxAge ?? 200
      if (age >= min && age <= max) {
        reasons.push({ type: 'match', text: `Your age (${age}) is within the required ${min}–${max} years.` })
      } else {
        reasons.push({ type: 'mismatch', text: `Required age is ${min}–${max} years. Your age is ${age}.` })
        hasMismatch = true
      }
    }
  }

  // --- State ---
  if (rules.states && rules.states.length > 0) {
    if (!profile.state) {
      missingFields.push('state')
      reasons.push({ type: 'missing', text: 'Please add your state to check state-specific eligibility.' })
      hasMissing = true
    } else {
      const nationalOnly = rules.states.includes('All India')
      if (nationalOnly || rules.states.includes(profile.state)) {
        reasons.push({
          type: 'match',
          text: nationalOnly
            ? 'This is a national scheme — available in all states.'
            : `Available in your state (${profile.state}).`,
        })
      } else {
        reasons.push({
          type: 'mismatch',
          text: `This scheme is only for residents of: ${rules.states.join(', ')}.`,
        })
        hasMismatch = true
      }
    }
  }

  // --- User type ---
  if (rules.userTypes && rules.userTypes.length > 0) {
    if (!profile.userType) {
      missingFields.push('userType')
      reasons.push({ type: 'missing', text: 'Please select whether you are a Student, Employee, or Other.' })
      hasMissing = true
    } else if (rules.userTypes.includes(profile.userType)) {
      reasons.push({ type: 'match', text: `Open to ${rules.userTypes.join(', ')} applicants.` })
    } else {
      reasons.push({ type: 'mismatch', text: `Open only to: ${rules.userTypes.join(', ')}.` })
      hasMismatch = true
    }
  }

  // --- Occupation ---
  if (rules.occupations && rules.occupations.length > 0) {
    if (!profile.occupation) {
      missingFields.push('occupation')
      reasons.push({ type: 'missing', text: 'Please add your occupation.' })
      hasMissing = true
    } else if (rules.occupations.includes(profile.occupation)) {
      reasons.push({ type: 'match', text: `Occupation "${profile.occupation}" matches the requirement.` })
    } else {
      reasons.push({ type: 'mismatch', text: `Open only to: ${rules.occupations.join(', ')}.` })
      hasMismatch = true
    }
  }

  // --- Income ---
  if (rules.maxIncome != null) {
    if (profile.annualIncome === '' || profile.annualIncome == null) {
      missingFields.push('annualIncome')
      reasons.push({ type: 'missing', text: 'Please add your annual income to check the income limit.' })
      hasMissing = true
    } else {
      const income = Number(profile.annualIncome)
      if (income <= rules.maxIncome) {
        reasons.push({
          type: 'match',
          text: `Your income ${fmtINR(income)} is within the ${fmtINR(rules.maxIncome)} limit.`,
        })
      } else {
        reasons.push({
          type: 'mismatch',
          text: `Income limit is ${fmtINR(rules.maxIncome)}. Your income is ${fmtINR(income)}.`,
        })
        hasMismatch = true
      }
    }
  }

  // --- Education ---
  if (rules.minEducation) {
    const userRank = rankEducation(profile.education)
    if (userRank < 0) {
      missingFields.push('education')
      reasons.push({ type: 'missing', text: 'Please add your education level.' })
      hasMissing = true
    } else {
      const requiredRank = rankEducation(rules.minEducation)
      if (userRank >= requiredRank) {
        reasons.push({
          type: 'match',
          text: `Your education (${profile.education}) meets the minimum required (${rules.minEducation}).`,
        })
      } else {
        reasons.push({
          type: 'mismatch',
          text: `Minimum education required: ${rules.minEducation}. You have ${profile.education}.`,
        })
        hasMismatch = true
      }
    }
  }

  let status
  if (hasMismatch) status = STATUS.NOT_MATCHING
  else if (hasMissing) status = STATUS.INFO_NEEDED
  else status = STATUS.ELIGIBLE

  return { status, reasons, missingFields }
}

export function evaluateAll(schemes, profile) {
  return schemes.map((scheme) => ({
    scheme,
    ...evaluateScheme(scheme, profile),
  }))
}

export const KEY_PROFILE_FIELDS = ['age', 'state', 'userType', 'education', 'annualIncome']

export function getMissingKeyFields(profile = {}) {
  return KEY_PROFILE_FIELDS.filter((f) => profile[f] === '' || profile[f] == null)
}
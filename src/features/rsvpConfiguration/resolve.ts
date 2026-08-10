import { configurableRsvpQuestionKeys, rsvpQuestionKeys, type ConfigurableRsvpQuestionKey, type RsvpConfiguration, type RsvpQuestion, type RsvpQuestionKey, type RsvpQuestionScope } from './types'

const defaults: Record<RsvpQuestionKey, RsvpQuestion> = {
  attendance: { key: 'attendance', scope: 'guest', enabled: true, required: true, label: 'Attendance', helperText: null, sortOrder: 0, system: true },
  dietaryRequirements: { key: 'dietaryRequirements', scope: 'guest', enabled: true, required: false, label: 'Dietary requirements', helperText: null, sortOrder: 10, system: false },
  accessibilityNeeds: { key: 'accessibilityNeeds', scope: 'guest', enabled: true, required: false, label: 'Accessibility requirements', helperText: null, sortOrder: 20, system: false },
  responsePhone: { key: 'responsePhone', scope: 'household', enabled: true, required: false, label: 'Contact number', helperText: null, sortOrder: 10, system: false },
  responseEmail: { key: 'responseEmail', scope: 'household', enabled: true, required: false, label: 'Email', helperText: null, sortOrder: 20, system: false },
  messageToCouple: { key: 'messageToCouple', scope: 'household', enabled: true, required: false, label: 'Message to Neil & Hazel', helperText: null, sortOrder: 30, system: false },
}

export function isRsvpQuestionKey(value: unknown): value is RsvpQuestionKey {
  return typeof value === 'string' && rsvpQuestionKeys.includes(value as RsvpQuestionKey)
}

export function isConfigurableRsvpQuestionKey(value: unknown): value is ConfigurableRsvpQuestionKey {
  return typeof value === 'string' && configurableRsvpQuestionKeys.includes(value as ConfigurableRsvpQuestionKey)
}

function validQuestion(value: unknown): value is RsvpQuestion {
  if (!value || typeof value !== 'object') return false
  const question = value as Partial<RsvpQuestion>
  return isRsvpQuestionKey(question.key) && (question.scope === 'guest' || question.scope === 'household') && typeof question.enabled === 'boolean' && typeof question.required === 'boolean' && typeof question.label === 'string' && (question.helperText === null || typeof question.helperText === 'string') && typeof question.sortOrder === 'number' && typeof question.system === 'boolean'
}

function sortQuestions(questions: RsvpQuestion[]) {
  return questions.sort((left, right) => left.sortOrder - right.sortOrder || left.key.localeCompare(right.key))
}

export function resolveRsvpConfiguration(value: unknown): RsvpConfiguration {
  const supplied = value && typeof value === 'object' ? value as Partial<RsvpConfiguration> : {}
  const candidates = [...(Array.isArray(supplied.guestQuestions) ? supplied.guestQuestions : []), ...(Array.isArray(supplied.householdQuestions) ? supplied.householdQuestions : [])]
  const known = new Map<RsvpQuestionKey, RsvpQuestion>()

  for (const candidate of candidates) {
    if (!validQuestion(candidate)) {
      if (import.meta.env.DEV && candidate && typeof candidate === 'object' && 'key' in candidate) console.warn('Ignoring unsupported RSVP question configuration.', (candidate as { key?: unknown }).key)
      continue
    }
    const expected = defaults[candidate.key]
    if (candidate.scope !== expected.scope) continue
    known.set(candidate.key, candidate.key === 'attendance' ? { ...defaults.attendance } : { ...candidate, system: false })
  }

  const resolved = rsvpQuestionKeys.map((key) => known.get(key) ?? { ...defaults[key] })
  return {
    guestQuestions: sortQuestions(resolved.filter((question) => question.scope === 'guest')),
    householdQuestions: sortQuestions(resolved.filter((question) => question.scope === 'household')),
  }
}

export function questionByKey(configuration: RsvpConfiguration, key: RsvpQuestionKey) {
  return [...configuration.guestQuestions, ...configuration.householdQuestions].find((question) => question.key === key) ?? defaults[key]
}

export function legacyRsvpConfiguration() {
  return resolveRsvpConfiguration(undefined)
}

export const rsvpQuestionScopes: Record<ConfigurableRsvpQuestionKey, RsvpQuestionScope> = Object.fromEntries(
  configurableRsvpQuestionKeys.map((key) => [key, defaults[key].scope]),
) as Record<ConfigurableRsvpQuestionKey, RsvpQuestionScope>

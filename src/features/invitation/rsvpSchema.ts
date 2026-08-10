import { z } from 'zod'
import type { DefaultValues } from 'react-hook-form'
import type {
  InvitationGuest,
  RsvpPayload,
} from './types'
import { questionByKey } from '../rsvpConfiguration/resolve'
import type { RsvpConfiguration } from '../rsvpConfiguration/types'

export const RSVP_LIMITS = {
  guestNote: 2_000,
  contactNumber: 30,
  email: 254,
  message: 5_000,
} as const

const guestSchema = z.object({
  id: z.number().int(),
  attendanceStatus: z.enum(['attending', 'declined']),
  dietaryRequirements: z.string(),
  accessibilityRequirements: z.string(),
  mealChoice: z.string(),
})

export const createRsvpSchema = (invitedGuests: InvitationGuest[], configuration: RsvpConfiguration) =>
  z
    .object({
      guests: z.array(guestSchema),
      contactNumber: z.string(),
      email: z.string(),
      message: z.string(),
    })
    .superRefine((values, context) => {
      const expectedIds = new Set(invitedGuests.map((guest) => guest.id))
      const seenIds = new Set<number>()

      values.guests.forEach((guest, index) => {
        if (seenIds.has(guest.id)) {
          context.addIssue({
            code: 'custom',
            path: ['guests', index, 'id'],
            message: 'This guest appears more than once.',
          })
        }

        seenIds.add(guest.id)
        if (!expectedIds.has(guest.id)) {
          context.addIssue({
            code: 'custom',
            path: ['guests'],
            message: 'The invitation guest list has changed. Please reload and try again.',
          })
        }
      })

      invitedGuests.forEach((guest, index) => {
        if (!seenIds.has(guest.id)) {
          context.addIssue({
            code: 'custom',
            path: ['guests', index, 'attendanceStatus'],
            message: `Please choose whether ${guest.fullName} will be attending.`,
          })
        }
      })

      const dietary = questionByKey(configuration, 'dietaryRequirements')
      const accessibility = questionByKey(configuration, 'accessibilityNeeds')
      const meal = questionByKey(configuration, 'mealChoice')
      const mealValues = new Set((meal.options ?? []).map((option) => option.value))
      values.guests.forEach((guest, index) => {
        if (guest.attendanceStatus !== 'attending') return
        if (dietary.enabled && guest.dietaryRequirements.length > RSVP_LIMITS.guestNote) context.addIssue({ code: 'custom', path: ['guests', index, 'dietaryRequirements'], message: 'Please keep dietary notes under 2,000 characters.' })
        if (dietary.enabled && dietary.required && !guest.dietaryRequirements.trim()) context.addIssue({ code: 'custom', path: ['guests', index, 'dietaryRequirements'], message: `${dietary.label} is required.` })
        if (accessibility.enabled && guest.accessibilityRequirements.length > RSVP_LIMITS.guestNote) context.addIssue({ code: 'custom', path: ['guests', index, 'accessibilityRequirements'], message: 'Please keep accessibility notes under 2,000 characters.' })
        if (accessibility.enabled && accessibility.required && !guest.accessibilityRequirements.trim()) context.addIssue({ code: 'custom', path: ['guests', index, 'accessibilityRequirements'], message: `${accessibility.label} is required.` })
        if (meal.enabled && meal.required && !guest.mealChoice) context.addIssue({ code: 'custom', path: ['guests', index, 'mealChoice'], message: `${meal.label} is required.` })
        if (meal.enabled && guest.mealChoice && !mealValues.has(guest.mealChoice)) context.addIssue({ code: 'custom', path: ['guests', index, 'mealChoice'], message: 'Please choose an available meal option.' })
      })

      const phone = questionByKey(configuration, 'responsePhone')
      const email = questionByKey(configuration, 'responseEmail')
      const message = questionByKey(configuration, 'messageToCouple')
      if (phone.enabled && values.contactNumber.length > RSVP_LIMITS.contactNumber) context.addIssue({ code: 'custom', path: ['contactNumber'], message: 'Please keep the contact number under 30 characters.' })
      if (phone.enabled && phone.required && !values.contactNumber.trim()) context.addIssue({ code: 'custom', path: ['contactNumber'], message: `${phone.label} is required.` })
      if (email.enabled && values.email.length > RSVP_LIMITS.email) context.addIssue({ code: 'custom', path: ['email'], message: 'Please keep the email address under 254 characters.' })
      if (email.enabled && values.email.trim() && !z.email().safeParse(values.email.trim()).success) context.addIssue({ code: 'custom', path: ['email'], message: 'Please enter a valid email address.' })
      if (email.enabled && email.required && !values.email.trim()) context.addIssue({ code: 'custom', path: ['email'], message: `${email.label} is required.` })
      if (message.enabled && values.message.length > RSVP_LIMITS.message) context.addIssue({ code: 'custom', path: ['message'], message: 'Please keep your message under 5,000 characters.' })
      if (message.enabled && message.required && !values.message.trim()) context.addIssue({ code: 'custom', path: ['message'], message: `${message.label} is required.` })
    })

export type RsvpFormValues = z.infer<ReturnType<typeof createRsvpSchema>>

function normalizeOptional(value: string): string | null {
  const normalized = value.trim()
  return normalized === '' ? null : normalized
}

export function toRsvpPayload(values: RsvpFormValues, configuration: RsvpConfiguration): RsvpPayload {
  const dietaryEnabled = questionByKey(configuration, 'dietaryRequirements').enabled
  const accessibilityEnabled = questionByKey(configuration, 'accessibilityNeeds').enabled
  const mealEnabled = questionByKey(configuration, 'mealChoice').enabled
  return {
    guests: values.guests.map((guest) => ({
      id: guest.id,
      attendanceStatus: guest.attendanceStatus,
      dietaryRequirements:
        guest.attendanceStatus === 'attending' && dietaryEnabled
          ? normalizeOptional(guest.dietaryRequirements)
          : null,
      accessibilityRequirements:
        guest.attendanceStatus === 'attending' && accessibilityEnabled
          ? normalizeOptional(guest.accessibilityRequirements)
          : null,
      mealChoice: guest.attendanceStatus === 'attending' && mealEnabled ? normalizeOptional(guest.mealChoice) : null,
    })),
    contactNumber: questionByKey(configuration, 'responsePhone').enabled ? normalizeOptional(values.contactNumber) : null,
    email: questionByKey(configuration, 'responseEmail').enabled ? normalizeOptional(values.email)?.toLowerCase() ?? null : null,
    message: questionByKey(configuration, 'messageToCouple').enabled ? normalizeOptional(values.message) : null,
  }
}

export function invitationToFormValues(
  guests: InvitationGuest[],
  contactNumber: string | null,
  email: string | null,
  message: string | null,
  configuration?: RsvpConfiguration,
): DefaultValues<RsvpFormValues> {
  return {
    guests: guests.map((guest) => ({
      id: guest.id,
      attendanceStatus:
        guest.attendanceStatus === 'pending'
          ? undefined
          : guest.attendanceStatus,
      dietaryRequirements: guest.dietaryRequirements ?? '',
      accessibilityRequirements: guest.accessibilityRequirements ?? '',
      mealChoice: (configuration && (questionByKey(configuration, 'mealChoice').options ?? []).some((option) => option.value === guest.mealChoice)) ? guest.mealChoice ?? '' : '',
    })),
    contactNumber: contactNumber ?? '',
    email: email ?? '',
    message: message ?? '',
  }
}

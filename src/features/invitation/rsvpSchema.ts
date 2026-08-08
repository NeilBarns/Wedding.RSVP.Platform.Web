import { z } from 'zod'
import type { DefaultValues } from 'react-hook-form'
import type {
  InvitationGuest,
  RsvpPayload,
} from './types'

export const RSVP_LIMITS = {
  guestNote: 2_000,
  contactNumber: 30,
  email: 254,
  message: 5_000,
} as const

const guestSchema = z.object({
  id: z.number().int(),
  attendanceStatus: z.enum(['attending', 'declined']),
  dietaryRequirements: z
    .string()
    .max(RSVP_LIMITS.guestNote, 'Please keep dietary notes under 2,000 characters.'),
  accessibilityRequirements: z
    .string()
    .max(
      RSVP_LIMITS.guestNote,
      'Please keep accessibility notes under 2,000 characters.',
    ),
})

export const createRsvpSchema = (invitedGuests: InvitationGuest[]) =>
  z
    .object({
      guests: z.array(guestSchema),
      contactNumber: z
        .string()
        .trim()
        .max(RSVP_LIMITS.contactNumber, 'Please keep the contact number under 30 characters.'),
      email: z
        .string()
        .trim()
        .max(RSVP_LIMITS.email, 'Please keep the email address under 254 characters.')
        .refine(
          (value) => value === '' || z.email().safeParse(value).success,
          'Please enter a valid email address.',
        ),
      message: z
        .string()
        .trim()
        .max(RSVP_LIMITS.message, 'Please keep your message under 5,000 characters.'),
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
    })

export type RsvpFormValues = z.infer<ReturnType<typeof createRsvpSchema>>

function normalizeOptional(value: string): string | null {
  const normalized = value.trim()
  return normalized === '' ? null : normalized
}

export function toRsvpPayload(values: RsvpFormValues): RsvpPayload {
  return {
    guests: values.guests.map((guest) => ({
      id: guest.id,
      attendanceStatus: guest.attendanceStatus,
      dietaryRequirements:
        guest.attendanceStatus === 'attending'
          ? normalizeOptional(guest.dietaryRequirements)
          : null,
      accessibilityRequirements:
        guest.attendanceStatus === 'attending'
          ? normalizeOptional(guest.accessibilityRequirements)
          : null,
    })),
    contactNumber: normalizeOptional(values.contactNumber),
    email: normalizeOptional(values.email)?.toLowerCase() ?? null,
    message: normalizeOptional(values.message),
  }
}

export function invitationToFormValues(
  guests: InvitationGuest[],
  contactNumber: string | null,
  email: string | null,
  message: string | null,
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
    })),
    contactNumber: contactNumber ?? '',
    email: email ?? '',
    message: message ?? '',
  }
}

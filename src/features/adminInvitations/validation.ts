import { z } from 'zod'
import type {
  CreateInvitationRequest,
  GuestRequest,
  InvitationProfileRequest,
} from './types'

export const guestTypes = [
  'adult',
  'child',
  'infant',
  'entourage',
  'principal_sponsor',
  'other',
] as const

const optionalText = (max: number, message: string) => z.string().trim().max(max, message)

export const guestFormSchema = z.object({
  fullName: z.string().trim().min(1, 'Please enter the guest’s name.').max(150, 'Guest names must be 150 characters or fewer.'),
  guestType: z.enum(guestTypes),
  sortOrder: z.number().int('Sort order must be a whole number.').min(0, 'Sort order cannot be negative.').max(10000),
  dietaryRequirements: optionalText(2000, 'Dietary notes must be 2,000 characters or fewer.'),
  accessibilityRequirements: optionalText(2000, 'Accessibility notes must be 2,000 characters or fewer.'),
})

export const invitationProfileSchema = z.object({
  displayName: z.string().trim().min(1, 'Please enter a household display name.').max(150, 'Display name must be 150 characters or fewer.'),
  contactPersonName: optionalText(150, 'Contact name must be 150 characters or fewer.'),
  contactNumber: optionalText(30, 'Contact number must be 30 characters or fewer.'),
  email: z.string().trim().max(254).refine((value) => value === '' || z.email().safeParse(value).success, 'Please enter a valid email address.'),
  internalNotes: optionalText(10000, 'Internal notes must be 10,000 characters or fewer.'),
})

export const createInvitationSchema = invitationProfileSchema.extend({
  guests: z.array(guestFormSchema).min(1, 'Add at least one named guest.').max(20, 'An invitation can contain at most 20 guests.'),
})

export type InvitationProfileFormValues = z.infer<typeof invitationProfileSchema>
export type GuestFormValues = z.infer<typeof guestFormSchema>
export type CreateInvitationFormValues = z.infer<typeof createInvitationSchema>

function nullable(value: string) {
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

export function guestPayload(values: GuestFormValues): GuestRequest {
  return {
    fullName: values.fullName.trim(),
    guestType: values.guestType,
    sortOrder: values.sortOrder,
    dietaryRequirements: nullable(values.dietaryRequirements),
    accessibilityRequirements: nullable(values.accessibilityRequirements),
  }
}

export function profilePayload(values: InvitationProfileFormValues): InvitationProfileRequest {
  return {
    displayName: values.displayName.trim(),
    contactPersonName: nullable(values.contactPersonName),
    contactNumber: nullable(values.contactNumber),
    email: nullable(values.email)?.toLowerCase() ?? null,
    internalNotes: nullable(values.internalNotes),
  }
}

export function createPayload(values: CreateInvitationFormValues): CreateInvitationRequest {
  return { ...profilePayload(values), guests: values.guests.map(guestPayload) }
}

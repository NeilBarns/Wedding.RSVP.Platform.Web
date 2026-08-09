import type { GuestType, InvitationStatus } from './types'

export const invitationStatusLabels: Record<InvitationStatus, string> = {
  draft: 'Draft',
  ready: 'Ready',
  submitted: 'Submitted',
  locked: 'Locked',
  archived: 'Archived',
}

export const guestTypeLabels: Record<GuestType, string> = {
  adult: 'Adult',
  child: 'Child',
  infant: 'Infant',
  entourage: 'Entourage',
  principal_sponsor: 'Principal sponsor',
  other: 'Other',
}

export function formatAdminDate(value: string | null, includeTime = false) {
  if (!value) return 'Not yet'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Not available'
  return new Intl.DateTimeFormat(undefined, includeTime
    ? { dateStyle: 'medium', timeStyle: 'short' }
    : { dateStyle: 'medium' }).format(date)
}

export function friendlyAdminError(status?: number) {
  if (status === 429) return 'Too many requests. Please wait a moment and try again.'
  return 'The request could not be completed. Please try again.'
}

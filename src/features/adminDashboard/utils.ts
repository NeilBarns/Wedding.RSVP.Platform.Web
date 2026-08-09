import type { InvitationListItem } from '../adminInvitations/types'
import type { AttentionItem, GuestMetrics } from './types'

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

function calendarDayNumber(value: string | Date) {
  const date = typeof value === 'string'
    ? new Date(`${value.slice(0, 10)}T00:00:00`)
    : new Date(value.getFullYear(), value.getMonth(), value.getDate())
  return Math.round(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
}

export function formatCalendarDate(value: string) {
  return dateFormatter.format(new Date(`${value.slice(0, 10)}T00:00:00`))
}

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value))
}

export function deadlineLabel(deadline: string, now = new Date()) {
  const difference = calendarDayNumber(deadline) - calendarDayNumber(now)
  if (difference < 0) return 'RSVP deadline has passed'
  if (difference === 0) return 'RSVP deadline is today'
  if (difference === 1) return 'RSVP deadline is tomorrow'
  return `RSVP deadline is in ${difference} days`
}

export function weddingCountdownLabel(weddingDate: string, now = new Date()) {
  const difference = calendarDayNumber(weddingDate) - calendarDayNumber(now)
  if (difference < 0) return 'Wedding date has passed'
  if (difference === 0) return 'Wedding day'
  if (difference === 1) return '1 day until the wedding'
  return `${difference} days until the wedding`
}

export function isDeadlineApproaching(deadline: string | null, now = new Date()) {
  if (!deadline) return false
  const difference = calendarDayNumber(deadline) - calendarDayNumber(now)
  return difference >= 0 && difference <= 14
}

export function calculateGuestMetrics(invitations: InvitationListItem[]): GuestMetrics {
  const totals = invitations.reduce(
    (result, invitation) => ({
      guests: result.guests + invitation.guestCount,
      attending: result.attending + invitation.attendingCount,
      declined: result.declined + invitation.declinedCount,
      pending: result.pending + invitation.pendingCount,
      submittedHouseholds: result.submittedHouseholds + (invitation.submittedAt ? 1 : 0),
    }),
    { guests: 0, attending: 0, declined: 0, pending: 0, submittedHouseholds: 0 },
  )
  const responded = totals.attending + totals.declined
  return {
    ...totals,
    responded,
    percentage: totals.guests === 0 ? null : Math.round((responded / totals.guests) * 100),
  }
}

export function getAttentionItems(
  invitations: InvitationListItem[],
  deadlineApproaching: boolean,
) {
  const items: AttentionItem[] = []
  for (const invitation of invitations) {
    let reason: string | null = null
    let priority = 0
    if (deadlineApproaching && invitation.pendingCount > 0) {
      reason = `${invitation.pendingCount} guest${invitation.pendingCount === 1 ? '' : 's'} pending near the RSVP deadline`
      priority = 4
    } else if (invitation.status === 'ready' && !invitation.firstOpenedAt) {
      reason = 'Ready invitation has not been opened'
      priority = 3
    } else if (invitation.status === 'draft') {
      reason = 'Invitation is still in Draft'
      priority = 2
    } else if (invitation.pendingCount > 0 && invitation.status !== 'archived') {
      reason = `${invitation.pendingCount} guest${invitation.pendingCount === 1 ? '' : 's'} awaiting a response`
      priority = 1
    }
    if (reason) items.push({ invitation, reason, priority })
  }
  return items
    .sort((left, right) => right.priority - left.priority || Date.parse(right.invitation.updatedAt) - Date.parse(left.invitation.updatedAt))
    .slice(0, 5)
}

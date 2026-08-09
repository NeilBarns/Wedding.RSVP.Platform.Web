import { RsvpExperience } from '../../../invitation/components/RsvpExperience'
import type { PublicInvitationData } from '../../../invitation/types'
import { ModernMinimalShell } from './components/ModernMinimalShell'
import { modernMinimalRsvpPresentation } from './ModernMinimalRsvpPresentation'

export function ModernMinimalInvitationPage({ token, data }: { token: string; data: PublicInvitationData }) {
  return <ModernMinimalShell wedding={data.wedding}><div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-16"><p className="mb-5 text-xs font-black uppercase tracking-[0.2em] text-[var(--color-muted)]">Private invitation / RSVP</p><RsvpExperience key={data.invitation.id} token={token} initialData={data} presentation={modernMinimalRsvpPresentation} /></div></ModernMinimalShell>
}

import { ErrorState } from '../../../../components/feedback/ErrorState'
import type { PublicInvitationData } from '../../../invitation/types'
import { ModernMinimalShell } from './components/ModernMinimalShell'
import { modernMinimalRsvpPresentation } from './ModernMinimalRsvpPresentation'

export function ModernMinimalConfirmationPage({ data, onEdit }: { data: PublicInvitationData; onEdit: () => void }) {
  const Confirmation = modernMinimalRsvpPresentation.Confirmation
  return <ModernMinimalShell wedding={data.wedding}><div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-20">{data.invitation.hasSubmitted ? <Confirmation invitation={data.invitation} readOnly={!data.invitation.canRespond} onEdit={data.invitation.canRespond ? onEdit : undefined} /> : <ErrorState title="No RSVP has been submitted yet" message="Return to your invitation to respond for your household." onRetry={onEdit} />}</div></ModernMinimalShell>
}

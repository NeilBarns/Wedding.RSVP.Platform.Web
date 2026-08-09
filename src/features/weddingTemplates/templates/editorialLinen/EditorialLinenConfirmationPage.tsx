import { ErrorState } from '../../../../components/feedback/ErrorState'
import type { PublicInvitationData } from '../../../invitation/types'
import { EditorialLinenShell } from './components/EditorialLinenShell'
import { editorialLinenRsvpPresentation } from './EditorialLinenRsvpPresentation'

export function EditorialLinenConfirmationPage({ data, onEdit }: { data: PublicInvitationData; onEdit: () => void }) {
  const Confirmation = editorialLinenRsvpPresentation.Confirmation

  return (
    <EditorialLinenShell wedding={data.wedding}>
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        {data.invitation.hasSubmitted ? <Confirmation invitation={data.invitation} readOnly={!data.invitation.canRespond} onEdit={data.invitation.canRespond ? onEdit : undefined} /> : <ErrorState title="No RSVP has been submitted yet" message="Return to your invitation to respond for your household." onRetry={onEdit} />}
      </div>
    </EditorialLinenShell>
  )
}

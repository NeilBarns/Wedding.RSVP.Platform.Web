import { RsvpExperience } from '../../../invitation/components/RsvpExperience'
import type { PublicInvitationData } from '../../../invitation/types'
import { EditorialLinenShell } from './components/EditorialLinenShell'
import { editorialLinenRsvpPresentation } from './EditorialLinenRsvpPresentation'

export function EditorialLinenInvitationPage({ token, data }: { token: string; data: PublicInvitationData }) {
  return (
    <EditorialLinenShell wedding={data.wedding}>
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-18">
        <RsvpExperience key={data.invitation.id} token={token} initialData={data} presentation={editorialLinenRsvpPresentation} />
      </div>
    </EditorialLinenShell>
  )
}

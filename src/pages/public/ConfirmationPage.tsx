import { useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { NotFoundState } from '../../components/feedback/NotFoundState'
import { RsvpConfirmation } from '../../features/invitation/components/RsvpConfirmation'
import { usePublicInvitation } from '../../features/invitation/usePublicInvitation'
import { PublicWeddingShell } from '../../features/publicWedding/components/PublicWeddingShell'

export default function ConfirmationPage() {
  const { token = '' } = useParams()
  const navigate = useNavigate()
  const { status, data, retry } = usePublicInvitation(token)

  if (status === 'loading') {
    return <FullPageLoading label="Loading your RSVP…" />
  }

  if (status === 'not-found') {
    return <NotFoundState title="Invitation not found" message="This invitation is unavailable. Please check the link you received or contact the couple." />
  }

  if (status === 'error' || !data) {
    return <ErrorState title="We couldn’t load your RSVP" message="Please check your connection and try again." onRetry={() => void retry()} />
  }

  if (!data.invitation.hasSubmitted) {
    return (
      <PublicWeddingShell wedding={data.wedding}>
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <ErrorState
            title="No RSVP has been submitted yet"
            message="Return to your invitation to respond for your household."
            onRetry={() => navigate('..', { relative: 'path' })}
          />
        </div>
      </PublicWeddingShell>
    )
  }

  return (
    <PublicWeddingShell wedding={data.wedding}>
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
        <RsvpConfirmation
          invitation={data.invitation}
          readOnly={!data.invitation.canRespond}
          onEdit={data.invitation.canRespond ? () => navigate('..', { relative: 'path' }) : undefined}
        />
      </div>
    </PublicWeddingShell>
  )
}

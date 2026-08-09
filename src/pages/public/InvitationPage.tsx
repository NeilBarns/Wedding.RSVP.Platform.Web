import { useLocation, useParams } from 'react-router-dom'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { NotFoundState } from '../../components/feedback/NotFoundState'
import { usePublicInvitation } from '../../features/invitation/usePublicInvitation'
import { resolveWeddingTemplate, templatePreviewFromSearch } from '../../features/weddingTemplates/resolveTemplate'

export default function InvitationPage() {
  const { token = '' } = useParams()
  const location = useLocation()
  const { status, data, retry } = usePublicInvitation(token)

  if (status === 'loading') {
    return <FullPageLoading label="Opening your invitation…" />
  }

  if (status === 'not-found') {
    return (
      <NotFoundState
        title="Invitation not found"
        message="This invitation is unavailable. Please check the link you received or contact the couple."
      />
    )
  }

  if (status === 'error' || !data) {
    return (
      <ErrorState
        title="We couldn’t open this invitation"
        message="Please check your connection and try again."
        onRetry={() => void retry()}
      />
    )
  }

  const TemplateInvitationPage = resolveWeddingTemplate(data.wedding.templateKey, templatePreviewFromSearch(location.search)).InvitationPage
  return <TemplateInvitationPage token={token} data={data} />
}

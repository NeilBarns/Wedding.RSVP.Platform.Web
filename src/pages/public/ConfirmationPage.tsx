import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { NotFoundState } from '../../components/feedback/NotFoundState'
import { usePublicInvitation } from '../../features/invitation/usePublicInvitation'
import { resolveWeddingTemplate, templatePreviewFromSearch } from '../../features/weddingTemplates/resolveTemplate'

export default function ConfirmationPage() {
  const { token = '' } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
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

  const TemplateConfirmationPage = resolveWeddingTemplate(data.wedding.templateKey, templatePreviewFromSearch(location.search)).ConfirmationPage
  return <TemplateConfirmationPage data={data} onEdit={() => navigate({ pathname: '..', search: location.search }, { relative: 'path' })} />
}

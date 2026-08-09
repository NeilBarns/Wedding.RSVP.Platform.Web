import type { WeddingTemplateDefinition } from '../../types'
import { EditorialLinenConfirmationPage } from './EditorialLinenConfirmationPage'
import { EditorialLinenInvitationPage } from './EditorialLinenInvitationPage'
import { EditorialLinenLandingPage } from './EditorialLinenLandingPage'
import { editorialLinenRsvpPresentation } from './EditorialLinenRsvpPresentation'

export const editorialLinenTemplate: WeddingTemplateDefinition = {
  key: 'editorial-linen-v1',
  displayName: 'Editorial Linen',
  LandingPage: EditorialLinenLandingPage,
  InvitationPage: EditorialLinenInvitationPage,
  ConfirmationPage: EditorialLinenConfirmationPage,
  rsvpPresentation: editorialLinenRsvpPresentation,
}

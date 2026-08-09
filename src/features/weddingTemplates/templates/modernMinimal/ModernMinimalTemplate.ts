import type { WeddingTemplateDefinition } from '../../types'
import { ModernMinimalConfirmationPage } from './ModernMinimalConfirmationPage'
import { ModernMinimalInvitationPage } from './ModernMinimalInvitationPage'
import { ModernMinimalLandingPage } from './ModernMinimalLandingPage'
import { modernMinimalRsvpPresentation } from './ModernMinimalRsvpPresentation'

export const modernMinimalTemplate: WeddingTemplateDefinition = {
  key: 'modern-minimal-v1',
  displayName: 'Modern Minimal',
  LandingPage: ModernMinimalLandingPage,
  InvitationPage: ModernMinimalInvitationPage,
  ConfirmationPage: ModernMinimalConfirmationPage,
  rsvpPresentation: modernMinimalRsvpPresentation,
}

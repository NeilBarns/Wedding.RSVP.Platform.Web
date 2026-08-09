import type { ComponentType, ReactNode } from 'react'
import type {
  PublicInvitation,
  PublicInvitationData,
  WeddingSummary,
} from '../invitation/types'
import type { PublicWedding } from '../publicWedding/types'

export const weddingTemplateKeys = ['editorial-linen-v1'] as const

export type WeddingTemplateKey = (typeof weddingTemplateKeys)[number]

export type RsvpConfirmationProps = {
  invitation: PublicInvitation
  readOnly?: boolean
  notice?: string
  onEdit?: () => void
}

export type RsvpPresentation = {
  Shell: ComponentType<{ children: ReactNode }>
  Overview: ComponentType<{
    invitation: PublicInvitation
    wedding: WeddingSummary
  }>
  Confirmation: ComponentType<RsvpConfirmationProps>
}

export type WeddingTemplateDefinition = {
  key: WeddingTemplateKey
  displayName: string
  LandingPage: ComponentType<{ wedding: PublicWedding }>
  InvitationPage: ComponentType<{ token: string; data: PublicInvitationData }>
  ConfirmationPage: ComponentType<{
    data: PublicInvitationData
    onEdit: () => void
  }>
  rsvpPresentation: RsvpPresentation
}

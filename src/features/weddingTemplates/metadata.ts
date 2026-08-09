import type { WeddingTemplateKey } from './types'

export type WeddingTemplateMetadata = {
  name: string
  description: string
  traits: readonly string[]
}

export const weddingTemplateMetadata: Record<WeddingTemplateKey, WeddingTemplateMetadata> = {
  'editorial-linen-v1': {
    name: 'Editorial Linen',
    description: 'A warm, refined composition with soft framing and a timeless editorial rhythm.',
    traits: ['Editorial', 'Soft', 'Elegant'],
  },
  'modern-minimal-v1': {
    name: 'Modern Minimal',
    description: 'A crisp, spacious layout with structured details and gallery-forward composition.',
    traits: ['Contemporary', 'Clean', 'Structured'],
  },
}

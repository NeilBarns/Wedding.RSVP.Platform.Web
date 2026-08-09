import { weddingTemplateRegistry } from './registry'
import type { WeddingTemplateDefinition, WeddingTemplateKey } from './types'

export const fallbackWeddingTemplateKey: WeddingTemplateKey = 'editorial-linen-v1'

export function resolveWeddingTemplate(templateKey: string | null | undefined): WeddingTemplateDefinition {
  if (templateKey && templateKey in weddingTemplateRegistry) {
    return weddingTemplateRegistry[templateKey as WeddingTemplateKey]
  }

  if (templateKey && import.meta.env.DEV) {
    console.warn('Unsupported wedding template key; using the Editorial Linen fallback.')
  }

  return weddingTemplateRegistry[fallbackWeddingTemplateKey]
}

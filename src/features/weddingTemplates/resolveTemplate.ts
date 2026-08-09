import { weddingTemplateRegistry } from './registry'
import type { WeddingTemplateDefinition, WeddingTemplateKey } from './types'

export const fallbackWeddingTemplateKey: WeddingTemplateKey = 'editorial-linen-v1'

export function isWeddingTemplateKey(templateKey: string | null | undefined): templateKey is WeddingTemplateKey {
  return Boolean(templateKey && templateKey in weddingTemplateRegistry)
}

function registeredTemplate(templateKey: string | null | undefined) {
  return isWeddingTemplateKey(templateKey) ? weddingTemplateRegistry[templateKey] : null
}

export function resolveWeddingTemplate(templateKey: string | null | undefined, previewKey?: string | null): WeddingTemplateDefinition {
  if (import.meta.env.DEV && previewKey) {
    const preview = registeredTemplate(previewKey)
    if (preview) return preview
  }

  const template = registeredTemplate(templateKey)
  if (template) {
    return template
  }

  if (templateKey && import.meta.env.DEV) {
    console.warn('Unsupported wedding template key; using the Editorial Linen fallback.')
  }

  return weddingTemplateRegistry[fallbackWeddingTemplateKey]
}

export function templatePreviewFromSearch(search: string): string | null {
  return import.meta.env.DEV ? new URLSearchParams(search).get('templatePreview') : null
}

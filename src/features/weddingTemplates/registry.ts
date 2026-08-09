import { editorialLinenTemplate } from './templates/editorialLinen/EditorialLinenTemplate'
import { modernMinimalTemplate } from './templates/modernMinimal/ModernMinimalTemplate'
import type { WeddingTemplateDefinition, WeddingTemplateKey } from './types'

export const weddingTemplateRegistry: Record<WeddingTemplateKey, WeddingTemplateDefinition> = {
  'editorial-linen-v1': editorialLinenTemplate,
  'modern-minimal-v1': modernMinimalTemplate,
}

import { editorialLinenTemplate } from './templates/editorialLinen/EditorialLinenTemplate'
import type { WeddingTemplateDefinition, WeddingTemplateKey } from './types'

export const weddingTemplateRegistry: Record<WeddingTemplateKey, WeddingTemplateDefinition> = {
  'editorial-linen-v1': editorialLinenTemplate,
}

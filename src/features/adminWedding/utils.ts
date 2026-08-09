import type { WeddingStatus } from './types'

export const weddingStatusContent: Record<WeddingStatus, { label: string; description: string }> = {
  draft: { label: 'Draft', description: 'Public invitation links are unavailable while the wedding is in Draft.' },
  published: { label: 'Published', description: 'Eligible invitation links can be opened by guests.' },
  archived: { label: 'Archived', description: 'The wedding is no longer publicly available.' },
}

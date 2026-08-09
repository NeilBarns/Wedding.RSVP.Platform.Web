import { Archive, CircleAlert, Globe2 } from 'lucide-react'
import type { WeddingStatus } from '../types'
import { weddingStatusContent } from '../utils'

export function StatusImpactNotice({ status }: { status: WeddingStatus }) {
  const Icon = status === 'published' ? Globe2 : status === 'archived' ? Archive : CircleAlert
  return <div className="mt-5 flex gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] p-4" role="status"><Icon className="mt-0.5 size-5 shrink-0 text-[var(--color-accent)]" aria-hidden="true" /><div><p className="font-medium">Public access: {weddingStatusContent[status].label}</p><p className="mt-1 text-sm text-[var(--color-muted)]">{weddingStatusContent[status].description}</p>{status === 'draft' ? <p className="mt-1 text-sm text-[var(--color-muted)]">A Ready invitation will still remain unavailable until the wedding is published.</p> : null}</div></div>
}

import { formatWeddingDate } from '../../../lib/utils/formatDate'
import type { PublicWedding } from '../types'

export function PublicWeddingFooter({ wedding }: { wedding: Pick<PublicWedding, 'partnerOneName' | 'partnerTwoName' | 'weddingDate'> }) {
  return <footer className="border-t border-[var(--color-border)] px-5 py-10 text-center"><p className="font-[var(--font-display)] text-2xl text-[var(--color-primary)]">{wedding.partnerOneName} &amp; {wedding.partnerTwoName}</p><p className="mt-2 text-sm text-[var(--color-muted)]">{formatWeddingDate(wedding.weddingDate)}</p><p className="mt-5 text-sm text-[var(--color-muted)]">With love, we look forward to celebrating together.</p></footer>
}

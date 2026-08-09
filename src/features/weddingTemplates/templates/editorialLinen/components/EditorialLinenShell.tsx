import type { ReactNode } from 'react'
import type { PublicWeddingDetails } from '../../../../publicWedding/types'
import { publicThemeStyle } from '../../../../publicWedding/utils'
import { PublicWeddingFooter } from '../../../../publicWedding/components/PublicWeddingFooter'
import { PublicWeddingHeader } from '../../../../publicWedding/components/PublicWeddingHeader'

type Props = {
  wedding: PublicWeddingDetails
  children: ReactNode
  visibleSections?: { story: boolean; gallery: boolean; faq: boolean }
}

export function EditorialLinenShell({ wedding, children, visibleSections }: Props) {
  return (
    <div
      data-wedding-template="editorial-linen-v1"
      style={publicThemeStyle(wedding.theme)}
      className="min-h-screen overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text)]"
    >
      <a href="#main-content" className="fixed left-4 top-3 z-50 -translate-y-24 rounded-[var(--radius-md)] bg-[var(--color-surface)] px-4 py-3 font-semibold shadow-[var(--shadow-soft)] focus:translate-y-0">Skip to content</a>
      <PublicWeddingHeader wedding={wedding} visibleSections={visibleSections} />
      <main id="main-content">{children}</main>
      <PublicWeddingFooter wedding={wedding} />
    </div>
  )
}

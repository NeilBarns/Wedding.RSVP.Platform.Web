import type { ReactNode } from 'react'
import type { PublicWeddingDetails } from '../types'
import { publicThemeStyle } from '../utils'
import { PublicWeddingFooter } from './PublicWeddingFooter'
import { PublicWeddingHeader } from './PublicWeddingHeader'

export function PublicWeddingShell({ wedding, children }: { wedding: PublicWeddingDetails; children: ReactNode }) {
  return <div style={publicThemeStyle(wedding.theme)} className="min-h-screen overflow-x-hidden bg-[var(--color-background)] text-[var(--color-text)]"><a href="#main-content" className="fixed left-4 top-3 z-50 -translate-y-24 rounded-[var(--radius-md)] bg-[var(--color-surface)] px-4 py-3 font-semibold shadow-[var(--shadow-soft)] focus:translate-y-0">Skip to content</a><PublicWeddingHeader wedding={wedding} /><main id="main-content">{children}</main><PublicWeddingFooter wedding={wedding} /></div>
}

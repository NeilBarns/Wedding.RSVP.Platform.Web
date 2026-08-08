import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

type PublicLayoutProps = {
  children?: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex min-h-18 max-w-6xl items-center justify-center px-5">
          <a
            href="/"
            className="rounded-[var(--radius-sm)] px-2 py-1 font-[var(--font-display)] text-xl tracking-wide text-[var(--color-primary)]"
            aria-label="Neil and Hazel wedding home"
          >
            Neil <span aria-hidden="true">&amp;</span> Hazel
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-5 py-10 sm:px-8 sm:py-14">
        {children ?? <Outlet />}
      </main>
      <footer className="border-t border-[var(--color-border)] px-5 py-6 text-center text-sm text-[var(--color-muted)]">
        <p>With love, Neil &amp; Hazel</p>
      </footer>
    </div>
  )
}

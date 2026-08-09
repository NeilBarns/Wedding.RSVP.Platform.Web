import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'

type PublicLayoutProps = {
  children?: ReactNode
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {children ?? <Outlet />}
    </div>
  )
}

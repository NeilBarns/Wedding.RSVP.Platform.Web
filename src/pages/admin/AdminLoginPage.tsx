import { Link } from 'react-router-dom'
import { LockKeyhole } from 'lucide-react'
import { InlineLoading } from '../../components/feedback/InlineLoading'
import { useAuth } from '../../features/auth/useAuth'

export default function AdminLoginPage() {
  const { status, user } = useAuth()

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--color-background)] px-5 py-12">
      <section className="w-full max-w-md rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-soft)]">
        <LockKeyhole
          className="mb-5 size-8 text-[var(--color-primary)]"
          aria-hidden="true"
        />
        <p className="text-sm font-medium uppercase tracking-[0.14em] text-[var(--color-muted)]">
          Neil &amp; Hazel CMS
        </p>
        <h1 className="mt-2 font-[var(--font-display)] text-3xl">Admin login</h1>
        {status === 'loading' ? (
          <div className="mt-5">
            <InlineLoading label="Checking your session…" />
          </div>
        ) : (
          <p className="mt-4 text-[var(--color-muted)]">
            {status === 'authenticated'
              ? `You are signed in as ${user?.name}.`
              : 'The secure login form will be implemented in a later patch.'}
          </p>
        )}
        <Link
          to="/admin"
          className="mt-7 inline-flex min-h-11 items-center rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 font-medium text-white"
        >
          Continue to admin
        </Link>
      </section>
    </main>
  )
}

import { Heart, Wifi } from 'lucide-react'
import { ErrorState } from '../../components/feedback/ErrorState'
import { FullPageLoading } from '../../components/feedback/FullPageLoading'
import { useHealthCheck } from '../../features/health/useHealthCheck'

export default function PublicHomePage() {
  const { state, retry } = useHealthCheck()

  if (state === 'loading') {
    return <FullPageLoading label="Preparing the wedding page…" />
  }

  if (state === 'error') {
    return (
      <ErrorState
        title="We’ll be right back"
        message="The wedding page is temporarily unavailable. Please try again in a moment."
        onRetry={() => void retry()}
      />
    )
  }

  return (
    <section className="mx-auto max-w-3xl py-10 text-center" aria-labelledby="home-heading">
      <Heart
        className="mx-auto mb-5 size-8 text-[var(--color-accent)]"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
        You are warmly invited
      </p>
      <h1
        id="home-heading"
        className="font-[var(--font-display)] text-4xl leading-tight text-[var(--color-primary)] sm:text-6xl"
      >
        Neil &amp; Hazel Wedding RSVP
      </h1>
      <div
        className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-2 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 text-[var(--color-muted)] shadow-[var(--shadow-soft)]"
        role="status"
      >
        <Wifi className="size-5 text-[var(--color-success)]" aria-hidden="true" />
        <p>Frontend and API foundation are connected.</p>
      </div>
    </section>
  )
}

import { MapPinOff } from 'lucide-react'
import { Link } from 'react-router-dom'

type NotFoundStateProps = {
  title?: string
  message?: string
  showHomeLink?: boolean
}

export function NotFoundState({
  title = 'Page not found',
  message = 'The page you were looking for is not available.',
  showHomeLink = true,
}: NotFoundStateProps) {
  return (
    <section className="mx-auto max-w-xl py-12 text-center">
      <MapPinOff
        className="mx-auto mb-4 size-9 text-[var(--color-accent)]"
        aria-hidden="true"
      />
      <h1 className="font-[var(--font-display)] text-3xl">{title}</h1>
      <p className="mt-3 text-[var(--color-muted)]">{message}</p>
      {showHomeLink ? (
        <Link
          className="mt-6 inline-flex min-h-11 items-center rounded-[var(--radius-md)] px-4 font-medium text-[var(--color-primary)] underline decoration-[var(--color-border)] underline-offset-4"
          to="/"
        >
          Return to the wedding page
        </Link>
      ) : null}
    </section>
  )
}

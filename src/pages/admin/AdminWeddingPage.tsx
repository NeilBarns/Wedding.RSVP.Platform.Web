import { EmptyState } from '../../components/feedback/EmptyState'

export default function AdminWeddingPage() {
  return (
    <section>
      <h1 className="font-[var(--font-display)] text-3xl">Wedding settings</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Wedding details, RSVP timing, and theme controls will be managed here.
      </p>
      <div className="mt-8">
        <EmptyState
          title="Settings editor coming next"
          message="No wedding configuration is editable in this foundation patch."
        />
      </div>
    </section>
  )
}

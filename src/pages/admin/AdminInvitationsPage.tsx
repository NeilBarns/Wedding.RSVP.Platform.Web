import { EmptyState } from '../../components/feedback/EmptyState'

export default function AdminInvitationsPage() {
  return (
    <section>
      <h1 className="font-[var(--font-display)] text-3xl">Invitations</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        Household invitations, guests, and response status will be managed here.
      </p>
      <div className="mt-8">
        <EmptyState
          title="Invitation management coming next"
          message="No invitation records can be created or changed in this foundation patch."
        />
      </div>
    </section>
  )
}

import { EmptyState } from '../../components/feedback/EmptyState'

export default function AdminDashboardPage() {
  return (
    <section>
      <h1 className="font-[var(--font-display)] text-3xl">Dashboard</h1>
      <p className="mt-2 text-[var(--color-muted)]">
        A concise overview of wedding content and RSVP activity will live here.
      </p>
      <div className="mt-8">
        <EmptyState
          title="Dashboard foundation ready"
          message="Reporting cards and activity summaries will be added with the CMS features."
        />
      </div>
    </section>
  )
}

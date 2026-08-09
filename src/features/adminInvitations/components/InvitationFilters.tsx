import { Search } from 'lucide-react'
import type { InvitationSort, InvitationStatus, SortDirection } from '../types'
import { invitationStatusLabels } from '../utils'

type InvitationFiltersProps = {
  search: string
  status: InvitationStatus | ''
  sortBy: InvitationSort
  sortDirection: SortDirection
  perPage: number
  onSearchChange: (value: string) => void
  onStatusChange: (value: InvitationStatus | '') => void
  onSortChange: (value: InvitationSort) => void
  onDirectionChange: (value: SortDirection) => void
  onPerPageChange: (value: 10 | 20 | 50) => void
}

const statuses: InvitationStatus[] = ['draft', 'ready', 'submitted', 'locked', 'archived']

export function InvitationFilters(props: InvitationFiltersProps) {
  return (
    <section aria-label="Invitation filters" className="grid gap-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 lg:grid-cols-[minmax(15rem,1fr)_11rem_12rem_9rem_7rem]">
      <div><label className="text-sm font-medium" htmlFor="invitation-search">Search</label><div className="relative mt-1"><Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-[var(--color-muted)]" aria-hidden="true" /><input id="invitation-search" value={props.search} onChange={(event) => props.onSearchChange(event.target.value)} className="min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white pl-9 pr-3" placeholder="Household, guest, or contact" /></div></div>
      <FilterSelect id="invitation-status" label="Status" value={props.status} onChange={(value) => props.onStatusChange(value as InvitationStatus | '')}><option value="">All statuses</option>{statuses.map((status) => <option key={status} value={status}>{invitationStatusLabels[status]}</option>)}</FilterSelect>
      <FilterSelect id="invitation-sort" label="Sort by" value={props.sortBy} onChange={(value) => props.onSortChange(value as InvitationSort)}><option value="createdAt">Created</option><option value="updatedAt">Updated</option><option value="displayName">Household</option><option value="status">Status</option><option value="submittedAt">Submitted</option></FilterSelect>
      <FilterSelect id="invitation-direction" label="Direction" value={props.sortDirection} onChange={(value) => props.onDirectionChange(value as SortDirection)}><option value="desc">Descending</option><option value="asc">Ascending</option></FilterSelect>
      <FilterSelect id="invitation-per-page" label="Per page" value={String(props.perPage)} onChange={(value) => props.onPerPageChange(Number(value) as 10 | 20 | 50)}><option value="10">10</option><option value="20">20</option><option value="50">50</option></FilterSelect>
    </section>
  )
}

function FilterSelect({ id, label, value, onChange, children }: { id: string; label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <div><label className="text-sm font-medium" htmlFor={id}>{label}</label><select id={id} value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 min-h-11 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3">{children}</select></div>
}

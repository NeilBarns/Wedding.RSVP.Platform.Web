import { Save } from 'lucide-react'
import { ActionButton } from '../../../components/ui/ActionButton'

export function SaveBar({ dirty, saving }: { dirty: boolean; saving: boolean }) {
  return <div className="sticky bottom-4 z-20 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-4 shadow-[var(--shadow-soft)] backdrop-blur"><p className="text-sm text-[var(--color-muted)]">{dirty ? 'You have unsaved changes.' : 'All changes are saved.'}</p><ActionButton type="submit" disabled={!dirty || saving}><Save className="size-4" aria-hidden="true" />{saving ? 'Saving…' : 'Save changes'}</ActionButton></div>
}

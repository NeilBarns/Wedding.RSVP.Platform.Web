import { Archive, FileEdit, Globe2 } from 'lucide-react'
import { Controller, useWatch, type UseFormReturn } from 'react-hook-form'
import type { WeddingStatus } from '../types'
import { weddingStatusContent } from '../utils'
import type { WeddingSettingsFormValues } from '../validation'
import { StatusImpactNotice } from './StatusImpactNotice'

const statuses: { status: WeddingStatus; icon: typeof FileEdit }[] = [{ status: 'draft', icon: FileEdit }, { status: 'published', icon: Globe2 }, { status: 'archived', icon: Archive }]

export function WeddingStatusSection({ form }: { form: UseFormReturn<WeddingSettingsFormValues> }) {
  useWatch({ control: form.control, name: 'status' })
  const selected = form.getValues('status')
  return <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"><h2 className="font-[var(--font-display)] text-2xl">Publication status</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Status directly controls whether public wedding and invitation pages are available.</p><Controller control={form.control} name="status" render={({ field }) => <fieldset className="mt-6 grid gap-3 md:grid-cols-3"><legend className="sr-only">Wedding publication status</legend>{statuses.map(({ status, icon: Icon }) => <label key={status} className={`cursor-pointer rounded-[var(--radius-md)] border p-4 ${field.value === status ? 'border-[var(--color-primary)] bg-[var(--color-background)]' : 'border-[var(--color-border)]'}`}><input type="radio" name={field.name} value={status} checked={field.value === status} onBlur={field.onBlur} onChange={() => field.onChange(status)} className="sr-only" /><span className="flex items-center gap-2 font-medium"><Icon className="size-5" aria-hidden="true" />{weddingStatusContent[status].label}</span><span className="mt-2 block text-sm text-[var(--color-muted)]">{weddingStatusContent[status].description}</span></label>)}</fieldset>} /><StatusImpactNotice status={selected} /></section>
}

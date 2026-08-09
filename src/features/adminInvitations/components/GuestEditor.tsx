import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { ActionButton } from '../../../components/ui/ActionButton'
import { ApiError } from '../../../lib/api'
import { addGuest, updateGuest } from '../api'
import type { AdminGuest } from '../types'
import { guestFormSchema, guestPayload, guestTypes, type GuestFormValues } from '../validation'
import { guestTypeLabels } from '../utils'
import { ModalShell } from './ModalShell'

type Props = { invitationId: number; guest?: AdminGuest; suggestedOrder: number; onSaved: () => void; onClose: () => void; onSessionExpired: () => void }

export function GuestEditor({ invitationId, guest, suggestedOrder, onSaved, onClose, onSessionExpired }: Props) {
  const form = useForm<GuestFormValues>({ resolver: zodResolver(guestFormSchema), defaultValues: { fullName: guest?.fullName ?? '', guestType: guest?.guestType ?? 'adult', sortOrder: guest?.sortOrder ?? suggestedOrder, dietaryRequirements: guest?.dietaryRequirements ?? '', accessibilityRequirements: guest?.accessibilityRequirements ?? '' } })
  async function submit(values: GuestFormValues) {
    form.clearErrors('root')
    try {
      if (guest) await updateGuest(invitationId, guest.id, guestPayload(values)); else await addGuest(invitationId, guestPayload(values))
      onSaved()
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return onSessionExpired()
      if (error instanceof ApiError && error.status === 422 && error.validationErrors) {
        for (const field of ['fullName', 'guestType', 'sortOrder', 'dietaryRequirements', 'accessibilityRequirements'] as const) if (error.validationErrors[field]) form.setError(field, { message: error.validationErrors[field][0] })
        form.setError('root.server', { message: 'Please review the highlighted fields.' })
      } else form.setError('root.server', { message: error instanceof ApiError && error.status === 409 ? error.message : error instanceof ApiError && error.status === 429 ? 'Too many requests. Please wait a moment and try again.' : 'The guest could not be saved. Please try again.' })
    }
  }
  return <ModalShell title={guest ? 'Edit guest' : 'Add guest'} onClose={onClose} size="lg"><form onSubmit={form.handleSubmit(submit)} noValidate>{form.formState.errors.root?.server ? <p className="mb-4 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.root.server.message}</p> : null}<div className="grid gap-5 sm:grid-cols-2"><GuestField label="Full name" name="fullName" form={form} /><div><label className="font-medium" htmlFor="guest-editor-type">Guest type</label><select id="guest-editor-type" className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3" {...form.register('guestType')}>{guestTypes.map((type) => <option key={type} value={type}>{guestTypeLabels[type]}</option>)}</select></div><GuestField label="Sort order" name="sortOrder" form={form} type="number" valueAsNumber /><div className="sm:col-span-2"><GuestArea label="Dietary requirements" name="dietaryRequirements" form={form} /></div><div className="sm:col-span-2"><GuestArea label="Accessibility requirements" name="accessibilityRequirements" form={form} /></div></div><div className="mt-7 flex justify-end gap-3"><ActionButton onClick={onClose} className="!bg-transparent !text-[var(--color-primary)] ring-1 ring-[var(--color-border)]" disabled={form.formState.isSubmitting}>Cancel</ActionButton><ActionButton type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Saving…' : 'Save guest'}</ActionButton></div></form></ModalShell>
}

type GuestForm = ReturnType<typeof useForm<GuestFormValues>>
function GuestField({ label, name, form, type = 'text', valueAsNumber }: { label: string; name: 'fullName' | 'sortOrder'; form: GuestForm; type?: string; valueAsNumber?: boolean }) { const id = `guest-editor-${name}`; const error = form.formState.errors[name]; return <div><label className="font-medium" htmlFor={id}>{label}</label><input id={id} type={type} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4" aria-invalid={Boolean(error)} {...form.register(name, valueAsNumber ? { valueAsNumber: true } : undefined)} />{error ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}</div> }
function GuestArea({ label, name, form }: { label: string; name: 'dietaryRequirements' | 'accessibilityRequirements'; form: GuestForm }) { const id = `guest-editor-${name}`; const error = form.formState.errors[name]; return <div><label className="font-medium" htmlFor={id}>{label}</label><textarea id={id} rows={3} className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3" {...form.register(name)} />{error ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}</div> }

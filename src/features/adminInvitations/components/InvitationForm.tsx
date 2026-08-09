import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash2 } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { ActionButton } from '../../../components/ui/ActionButton'
import { ApiError } from '../../../lib/api'
import { createInvitation } from '../api'
import { createInvitationSchema, createPayload, guestTypes, type CreateInvitationFormValues } from '../validation'
import { guestTypeLabels } from '../utils'
import type { CreationAccessResponse } from '../types'
import { ModalShell } from './ModalShell'

type InvitationFormProps = {
  onClose: () => void
  onCreated: (result: CreationAccessResponse) => void
  onSessionExpired: () => void
}

const blankGuest = (sortOrder: number) => ({ fullName: '', guestType: 'adult' as const, sortOrder, dietaryRequirements: '', accessibilityRequirements: '' })

export function InvitationForm({ onClose, onCreated, onSessionExpired }: InvitationFormProps) {
  const form = useForm<CreateInvitationFormValues>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: { displayName: '', contactPersonName: '', contactNumber: '', email: '', internalNotes: '', guests: [blankGuest(0)] },
  })
  const guests = useFieldArray({ control: form.control, name: 'guests' })
  const formError = form.formState.errors.root?.server?.message

  async function submit(values: CreateInvitationFormValues) {
    form.clearErrors('root')
    try {
      onCreated(await createInvitation(createPayload(values)))
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return onSessionExpired()
      if (error instanceof ApiError && error.status === 422 && error.validationErrors) {
        for (const [path, messages] of Object.entries(error.validationErrors)) {
          if (/^(displayName|contactPersonName|contactNumber|email|internalNotes|guests(?:\.\d+\.(?:fullName|guestType|sortOrder|dietaryRequirements|accessibilityRequirements))?)$/.test(path)) {
            form.setError(path as Parameters<typeof form.setError>[0], { type: 'server', message: messages[0] })
          }
        }
        form.setError('root.server', { message: 'Please review the highlighted fields.' })
      } else if (error instanceof ApiError && error.status === 429) {
        form.setError('root.server', { message: 'Too many requests. Please wait a moment and try again.' })
      } else {
        form.setError('root.server', { message: 'The invitation could not be created. Please try again.' })
      }
    }
  }

  return (
    <ModalShell title="Create invitation" onClose={onClose} size="xl">
      <form onSubmit={form.handleSubmit(submit)} noValidate>
        {formError ? <p className="mb-5 rounded-[var(--radius-md)] bg-[var(--color-background)] p-3 text-sm text-[var(--color-error)]" role="alert">{formError}</p> : null}
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Household display name" name="displayName" form={form} required placeholder="Dela Cruz Family" />
          <TextField label="Contact person" name="contactPersonName" form={form} />
          <TextField label="Contact number" name="contactNumber" form={form} type="tel" />
          <TextField label="Email" name="email" form={form} type="email" />
          <div className="sm:col-span-2"><TextArea label="Internal notes" name="internalNotes" form={form} rows={3} /></div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-4 border-t border-[var(--color-border)] pt-6">
          <div><h3 className="font-[var(--font-display)] text-xl">Named guests</h3><p className="text-sm text-[var(--color-muted)]">Add every person included in this household invitation.</p></div>
          <button type="button" onClick={() => guests.append(blankGuest(guests.fields.length))} disabled={guests.fields.length >= 20} className="inline-flex min-h-11 items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 text-sm font-medium"><Plus className="size-4" aria-hidden="true" />Add guest</button>
        </div>
        {form.formState.errors.guests?.root ? <p className="mt-2 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.guests.root.message}</p> : null}
        <div className="mt-4 space-y-4">
          {guests.fields.map((field, index) => (
            <fieldset key={field.id} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] p-4">
              <legend className="px-1 font-medium">Guest {index + 1}</legend>
              <div className="grid gap-4 sm:grid-cols-[1fr_13rem_7rem_auto] sm:items-end">
                <TextField label="Full name" name={`guests.${index}.fullName`} form={form} required />
                <div><label className="font-medium" htmlFor={`create-guest-type-${index}`}>Guest type</label><select id={`create-guest-type-${index}`} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-3" {...form.register(`guests.${index}.guestType`)}>{guestTypes.map((type) => <option key={type} value={type}>{guestTypeLabels[type]}</option>)}</select></div>
                <TextField label="Order" name={`guests.${index}.sortOrder`} form={form} type="number" valueAsNumber />
                <button type="button" onClick={() => guests.remove(index)} disabled={guests.fields.length === 1} className="flex min-h-12 items-center justify-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 text-sm text-[var(--color-error)] disabled:opacity-40"><Trash2 className="size-4" aria-hidden="true" />Remove</button>
              </div>
            </fieldset>
          ))}
        </div>
        <div className="mt-7 flex justify-end gap-3"><ActionButton className="!bg-transparent !text-[var(--color-primary)] ring-1 ring-[var(--color-border)]" onClick={onClose} disabled={form.formState.isSubmitting}>Cancel</ActionButton><ActionButton type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? 'Creating…' : 'Create invitation'}</ActionButton></div>
      </form>
    </ModalShell>
  )
}

type FormApi = ReturnType<typeof useForm<CreateInvitationFormValues>>
type TextFieldProps = { label: string; name: Parameters<FormApi['register']>[0]; form: FormApi; required?: boolean; placeholder?: string; type?: string; valueAsNumber?: boolean }
function TextField({ label, name, form, required, placeholder, type = 'text', valueAsNumber }: TextFieldProps) {
  const error = name.split('.').reduce<unknown>((current, key) => current && typeof current === 'object' ? (current as Record<string, unknown>)[key] : undefined, form.formState.errors) as { message?: string } | undefined
  const id = `create-${name.replaceAll('.', '-')}`
  return <div><label className="font-medium" htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label><input id={id} type={type} placeholder={placeholder} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4" aria-invalid={Boolean(error)} {...form.register(name, valueAsNumber ? { valueAsNumber: true } : undefined)} />{error?.message ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}</div>
}

function TextArea({ label, name, form, rows }: { label: string; name: Parameters<FormApi['register']>[0]; form: FormApi; rows: number }) {
  const error = form.formState.errors.internalNotes
  const id = `create-${name}`
  return <div><label className="font-medium" htmlFor={id}>{label}</label><textarea id={id} rows={rows} className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3" {...form.register(name)} />{error?.message ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}</div>
}

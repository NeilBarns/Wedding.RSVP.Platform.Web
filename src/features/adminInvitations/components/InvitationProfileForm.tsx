import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { ActionButton } from '../../../components/ui/ActionButton'
import { ApiError } from '../../../lib/api'
import { updateInvitation } from '../api'
import type { InvitationDetail } from '../types'
import { invitationProfileSchema, profilePayload, type InvitationProfileFormValues } from '../validation'

type Props = { invitation: InvitationDetail; onUpdated: (value: InvitationDetail) => void; onSessionExpired: () => void }

export function InvitationProfileForm({ invitation, onUpdated, onSessionExpired }: Props) {
  const readOnly = invitation.status === 'archived'
  const form = useForm<InvitationProfileFormValues>({ resolver: zodResolver(invitationProfileSchema), defaultValues: { displayName: invitation.displayName, contactPersonName: invitation.contactPersonName ?? '', contactNumber: invitation.contactNumber ?? '', email: invitation.email ?? '', internalNotes: invitation.internalNotes ?? '' } })

  async function submit(values: InvitationProfileFormValues) {
    form.clearErrors('root')
    try {
      const updated = await updateInvitation(invitation.id, profilePayload(values))
      onUpdated(updated)
      form.reset({ displayName: updated.displayName, contactPersonName: updated.contactPersonName ?? '', contactNumber: updated.contactNumber ?? '', email: updated.email ?? '', internalNotes: updated.internalNotes ?? '' })
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return onSessionExpired()
      if (error instanceof ApiError && error.status === 422 && error.validationErrors) {
        for (const field of ['displayName', 'contactPersonName', 'contactNumber', 'email', 'internalNotes'] as const) if (error.validationErrors[field]) form.setError(field, { message: error.validationErrors[field][0] })
        form.setError('root.server', { message: 'Please review the highlighted fields.' })
      } else form.setError('root.server', { message: error instanceof ApiError && error.status === 429 ? 'Too many requests. Please wait a moment and try again.' : 'The household profile could not be saved. Please try again.' })
    }
  }

  return (
    <form onSubmit={form.handleSubmit(submit)} noValidate className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7">
      <div className="flex items-center justify-between gap-3"><div><h2 className="font-[var(--font-display)] text-2xl">Household profile</h2>{readOnly ? <p className="mt-1 text-sm text-[var(--color-muted)]">Archived invitations are read-only.</p> : null}</div>{!readOnly ? <ActionButton type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}><Save className="size-4" aria-hidden="true" />{form.formState.isSubmitting ? 'Saving…' : 'Save profile'}</ActionButton> : null}</div>
      {form.formState.errors.root?.server ? <p className="mt-4 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.root.server.message}</p> : null}
      <fieldset disabled={readOnly || form.formState.isSubmitting} className="mt-6 grid gap-5 sm:grid-cols-2 disabled:opacity-75">
        <ProfileField label="Display name" name="displayName" form={form} required />
        <ProfileField label="Contact person" name="contactPersonName" form={form} />
        <ProfileField label="Contact number" name="contactNumber" form={form} type="tel" />
        <ProfileField label="Email" name="email" form={form} type="email" />
        <div className="sm:col-span-2"><label className="font-medium" htmlFor="profile-internal-notes">Internal notes</label><textarea id="profile-internal-notes" rows={5} className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4 py-3" {...form.register('internalNotes')} />{form.formState.errors.internalNotes ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.internalNotes.message}</p> : null}</div>
      </fieldset>
    </form>
  )
}

type ProfileForm = ReturnType<typeof useForm<InvitationProfileFormValues>>
function ProfileField({ label, name, form, type = 'text', required }: { label: string; name: 'displayName' | 'contactPersonName' | 'contactNumber' | 'email'; form: ProfileForm; type?: string; required?: boolean }) {
  const id = `profile-${name}`; const error = form.formState.errors[name]
  return <div><label className="font-medium" htmlFor={id}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label><input id={id} type={type} className="mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-white px-4" aria-invalid={Boolean(error)} {...form.register(name)} />{error ? <p className="mt-1 text-sm text-[var(--color-error)]" role="alert">{error.message}</p> : null}</div>
}

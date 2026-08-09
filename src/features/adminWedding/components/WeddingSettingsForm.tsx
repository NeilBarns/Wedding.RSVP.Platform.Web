import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ApiError } from '../../../lib/api'
import { fallbackWeddingTemplateKey } from '../../weddingTemplates/resolveTemplate'
import { updateAdminWedding } from '../api'
import type { AdminWeddingSettings, WeddingStatus } from '../types'
import { weddingPayload, weddingSettingsSchema, weddingToFormValues, type WeddingSettingsFormValues } from '../validation'
import { RsvpSettingsSection } from './RsvpSettingsSection'
import { SaveBar } from './SaveBar'
import { StatusConfirmationDialog } from './StatusConfirmationDialog'
import { ThemeSettingsSection } from './ThemeSettingsSection'
import { WeddingDetailsSection } from './WeddingDetailsSection'
import { WeddingStatusSection } from './WeddingStatusSection'
import { WeddingTemplateSection } from './WeddingTemplateSection'

type Props = { wedding: AdminWeddingSettings; onSaved: (wedding: AdminWeddingSettings) => void; onSessionExpired: () => void; onNotFound: () => void }
type Confirmation = { title: string; message: string; confirmLabel: string; destructive?: boolean }

function transitionConfirmation(from: WeddingStatus, to: WeddingStatus): Confirmation | null {
  if (from === to) return null
  if (to === 'archived') return { title: 'Archive wedding?', message: 'Archiving the wedding will make the wedding and its invitations unavailable publicly.', confirmLabel: 'Archive wedding', destructive: true }
  if (from === 'draft' && to === 'published') return { title: 'Publish wedding?', message: 'Publishing the wedding makes eligible invitation links publicly accessible.', confirmLabel: 'Publish wedding' }
  if (from === 'published' && to === 'draft') return { title: 'Move wedding to draft?', message: 'Moving the wedding back to Draft will make public invitation links unavailable.', confirmLabel: 'Move to draft', destructive: true }
  if (from === 'archived') return { title: `Restore wedding as ${to}?`, message: to === 'published' ? 'This will make eligible invitation links publicly accessible again.' : 'This restores editing in Draft, but public invitation links will remain unavailable.', confirmLabel: to === 'published' ? 'Republish wedding' : 'Restore as draft' }
  return null
}

const templateChangeConfirmation: Confirmation = {
  title: 'Change wedding template?',
  message: 'This will change the guest-facing layout for the wedding website, invitations, RSVP experience, and confirmation pages. Your wedding content, RSVP responses, colors, and fonts will remain unchanged.',
  confirmLabel: 'Apply template',
}

export function WeddingSettingsForm({ wedding, onSaved, onSessionExpired, onNotFound }: Props) {
  const form = useForm<WeddingSettingsFormValues>({ resolver: zodResolver(weddingSettingsSchema), defaultValues: weddingToFormValues(wedding), mode: 'onTouched' })
  const [pending, setPending] = useState<WeddingSettingsFormValues | null>(null)
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', beforeUnload)
    return () => window.removeEventListener('beforeunload', beforeUnload)
  }, [form.formState.isDirty])

  async function save(values: WeddingSettingsFormValues) {
    if (saving) return
    setSaving(true)
    setSuccess(null); form.clearErrors('root')
    try {
      const updated = await updateAdminWedding(weddingPayload(values))
      const oldStatus = wedding.status
      const templateChanged = values.templateKey !== (wedding.templateKey ?? fallbackWeddingTemplateKey)
      onSaved(updated)
      form.reset(weddingToFormValues(updated))
      setPending(null); setConfirmation(null)
      setSuccess(templateChanged ? 'Wedding template and settings saved.' : updated.status === 'archived' && oldStatus !== 'archived' ? 'Wedding archived.' : updated.status === 'published' && oldStatus !== 'published' ? 'Wedding published.' : updated.status === 'draft' && oldStatus === 'published' ? 'Wedding moved to draft.' : 'Wedding settings saved.')
    } catch (error) {
      setPending(null); setConfirmation(null)
      if (error instanceof ApiError && error.status === 401) return onSessionExpired()
      if (error instanceof ApiError && error.status === 404) return onNotFound()
      if (error instanceof ApiError && error.status === 422 && error.validationErrors) {
        for (const [path, messages] of Object.entries(error.validationErrors)) if (/^(partnerOneName|partnerTwoName|weddingDate|rsvpDeadline|dressCode|status|templateKey|theme\.(key|primaryColor|secondaryColor|accentColor|backgroundColor|headingFont|bodyFont))$/.test(path)) form.setError(path as Parameters<typeof form.setError>[0], { type: 'server', message: messages[0] })
        form.setError('root.server', { message: 'Please review the highlighted fields.' })
      } else if (error instanceof ApiError && error.status === 409) form.setError('root.server', { message: error.message })
      else if (error instanceof ApiError && error.status === 429) form.setError('root.server', { message: 'Too many requests. Please wait a moment and try again.' })
      else form.setError('root.server', { message: 'Wedding settings could not be saved. Please try again.' })
    } finally { setSaving(false) }
  }

  function requestSave(values: WeddingSettingsFormValues) {
    if (values.templateKey !== (wedding.templateKey ?? fallbackWeddingTemplateKey)) {
      const statusConfirmation = transitionConfirmation(wedding.status, values.status)
      setPending(values)
      setConfirmation(statusConfirmation ? { ...templateChangeConfirmation, message: `${templateChangeConfirmation.message} ${statusConfirmation.message}`, destructive: statusConfirmation.destructive } : templateChangeConfirmation)
      return
    }
    const nextConfirmation = transitionConfirmation(wedding.status, values.status)
    if (nextConfirmation) { setPending(values); setConfirmation(nextConfirmation) }
    else void save(values)
  }

  return <form onSubmit={form.handleSubmit(requestSave)} noValidate className="space-y-6"><fieldset disabled={saving} className="contents"><div className="grid gap-6 xl:grid-cols-2"><WeddingDetailsSection form={form} /><RsvpSettingsSection form={form} /></div><WeddingTemplateSection form={form} wedding={wedding} /><WeddingStatusSection form={form} /><ThemeSettingsSection form={form} /></fieldset>{form.formState.errors.root?.server ? <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.root.server.message}</p> : null}<div className="min-h-6" aria-live="polite">{success ? <p className="text-sm font-medium text-[var(--color-success)]">{success}</p> : null}</div><SaveBar dirty={form.formState.isDirty} saving={saving} />{confirmation && pending ? <StatusConfirmationDialog {...confirmation} saving={saving} onCancel={() => { setConfirmation(null); setPending(null) }} onConfirm={() => void save(pending)} /> : null}</form>
}

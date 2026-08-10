import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react'
import { useForm, useWatch } from 'react-hook-form'
import { ActionButton } from '../../../components/ui/ActionButton'
import { ApiError } from '../../../lib/api'
import { isConfigurableRsvpQuestionKey, rsvpQuestionScopes } from '../../rsvpConfiguration/resolve'
import type { RsvpQuestionUpdate, RsvpQuestionScope } from '../../rsvpConfiguration/types'
import { updateAdminRsvpConfiguration, type AdminRsvpConfiguration } from '../api'
import { rsvpConfigurationSchema, toConfigurationPayload, toQuestionValues, type RsvpConfigurationFormValues } from '../validation'
import { QuestionCard, SystemAttendanceCard } from './QuestionCard'

type Props = { configuration: AdminRsvpConfiguration; onSaved: (configuration: AdminRsvpConfiguration) => void; onSessionExpired: () => void }

function configurable(questions: AdminRsvpConfiguration['questions']): RsvpQuestionUpdate[] {
  return questions.flatMap(({ key, enabled, required, label, helperText, sortOrder }) => isConfigurableRsvpQuestionKey(key) ? [{ key, enabled, required, label, helperText, sortOrder }] : [])
}

export function RsvpConfigurationForm({ configuration, onSaved, onSessionExpired }: Props) {
  const form = useForm<RsvpConfigurationFormValues>({ resolver: zodResolver(rsvpConfigurationSchema), defaultValues: toQuestionValues(configurable(configuration.questions)), mode: 'onTouched' })
  const questions = useWatch({ control: form.control, name: 'questions' })
  const [guestQuestions, householdQuestions] = (['guest', 'household'] as const).map((scope) => questions.map((question, index) => ({ question, index })).filter(({ question }) => rsvpQuestionScopes[question.key] === scope))

  function move(index: number, direction: -1 | 1, scope: RsvpQuestionScope) {
    const values = form.getValues('questions')
    const scopedIndexes = values.map((question, questionIndex) => ({ question, questionIndex })).filter(({ question }) => rsvpQuestionScopes[question.key] === scope).map(({ questionIndex }) => questionIndex)
    const position = scopedIndexes.indexOf(index)
    const target = scopedIndexes[position + direction]
    if (target === undefined) return
    const reordered = [...values]
    ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
    for (const currentScope of ['guest', 'household'] as const) {
      reordered.filter((question) => rsvpQuestionScopes[question.key] === currentScope).forEach((question, order) => { question.sortOrder = (order + 1) * 10 })
    }
    form.setValue('questions', reordered, { shouldDirty: true, shouldValidate: true })
  }

  async function submit(values: RsvpConfigurationFormValues) {
    form.clearErrors('root')
    try {
      const updated = await updateAdminRsvpConfiguration(toConfigurationPayload(values))
      onSaved(updated)
      form.reset(toQuestionValues(configurable(updated.questions)))
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) return onSessionExpired()
      if (error instanceof ApiError && error.status === 422) {
        for (const [path, messages] of Object.entries(error.validationErrors ?? {})) if (/^questions(?:\.\d+\.(?:enabled|required|label|helperText|sortOrder|key))?$/.test(path)) form.setError(path as never, { type: 'server', message: messages[0] })
        form.setError('root.server', { message: 'Please review the highlighted configuration.' })
      } else form.setError('root.server', { message: 'RSVP configuration could not be saved. Please try again.' })
    }
  }

  function renderQuestion({ question, index }: { question: RsvpConfigurationFormValues['questions'][number]; index: number }, position: number, group: typeof guestQuestions, scope: RsvpQuestionScope) {
    return <QuestionCard key={question.key} index={index} name={question.label} scope={scope} enabled={question.enabled} required={question.required} first={position === 0} last={position === group.length - 1} register={form.register} errors={form.formState.errors} onEnabledChange={(enabled) => { form.setValue(`questions.${index}.enabled`, enabled, { shouldDirty: true }); if (!enabled) form.setValue(`questions.${index}.required`, false, { shouldDirty: true, shouldValidate: true }) }} onMove={(direction) => move(index, direction, scope)} />
  }

  return <form onSubmit={form.handleSubmit(submit)} noValidate className="space-y-7"><section><h2 className="font-[var(--font-display)] text-2xl">Guest questions</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Attendance is always required for every named guest.</p><div className="mt-5 grid gap-5 xl:grid-cols-2"><SystemAttendanceCard />{guestQuestions.map((item, position) => renderQuestion(item, position, guestQuestions, 'guest'))}</div></section><section><h2 className="font-[var(--font-display)] text-2xl">Household questions</h2><p className="mt-1 text-sm text-[var(--color-muted)]">Shown once for the household response.</p><div className="mt-5 grid gap-5 xl:grid-cols-2">{householdQuestions.map((item, position) => renderQuestion(item, position, householdQuestions, 'household'))}</div></section>{form.formState.errors.root?.server ? <p className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm text-[var(--color-error)]" role="alert">{form.formState.errors.root.server.message}</p> : null}<div className="min-h-6" aria-live="polite">{form.formState.isSubmitSuccessful && !form.formState.isDirty ? <p className="text-sm font-medium text-[var(--color-success)]">RSVP configuration saved.</p> : null}</div><div className="sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-surface)_94%,transparent)] p-4 shadow-[var(--shadow-soft)] backdrop-blur"><p className="text-sm text-[var(--color-muted)]">{form.formState.isDirty ? 'You have unsaved changes.' : 'All changes are saved.'}</p><ActionButton type="submit" disabled={!form.formState.isDirty || form.formState.isSubmitting}><Save className="size-4" aria-hidden="true" />{form.formState.isSubmitting ? 'Saving…' : 'Save configuration'}</ActionButton></div></form>
}

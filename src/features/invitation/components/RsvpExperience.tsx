import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Send } from 'lucide-react'
import { useMemo, useState } from 'react'
import {
  useForm,
  useWatch,
  type FieldPath,
  type UseFormSetError,
} from 'react-hook-form'
import { ActionButton } from '../../../components/ui/ActionButton'
import { NotFoundState } from '../../../components/feedback/NotFoundState'
import { ApiError } from '../../../lib/api'
import { getPublicInvitation, submitPublicRsvp } from '../api'
import {
  createRsvpSchema,
  invitationToFormValues,
  toRsvpPayload,
  type RsvpFormValues,
} from '../rsvpSchema'
import type { PublicInvitationData } from '../types'
import { RSVP_STEPS } from '../rsvpSteps'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import { GuestAttendanceCard } from './GuestAttendanceCard'
import { GuestDetailsFields } from './GuestDetailsFields'
import { HouseholdDetailsForm } from './HouseholdDetailsForm'
import { InvitationOverview } from './InvitationOverview'
import { RsvpConfirmation } from './RsvpConfirmation'
import { RsvpReview } from './RsvpReview'
import { RsvpStepper } from './RsvpStepper'

type RsvpExperienceProps = {
  token: string
  initialData: PublicInvitationData
}

function applyBackendErrors(
  validationErrors: Record<string, string[]> | undefined,
  setError: UseFormSetError<RsvpFormValues>,
) {
  if (!validationErrors) return

  for (const [backendPath, messages] of Object.entries(validationErrors)) {
    const guestMatch = /^guests\.(\d+)\.(id|attendanceStatus|dietaryRequirements|accessibilityRequirements)$/.exec(backendPath)
    const path: FieldPath<RsvpFormValues> | null =
      backendPath === 'contactNumber' || backendPath === 'email' || backendPath === 'message'
        ? backendPath
        : backendPath === 'guests'
          ? 'guests'
          : guestMatch
            ? (`guests.${guestMatch[1]}.${guestMatch[2]}` as FieldPath<RsvpFormValues>)
            : null

    if (path) {
      const message = backendPath === 'email'
        ? 'Please enter a valid email address.'
        : backendPath.endsWith('.attendanceStatus')
          ? 'Please choose an attendance response for this guest.'
          : backendPath.includes('dietaryRequirements')
            ? 'Please keep dietary notes under 2,000 characters.'
            : backendPath.includes('accessibilityRequirements')
              ? 'Please keep accessibility notes under 2,000 characters.'
              : messages[0] ?? 'Please review this field.'
      setError(path, { type: 'server', message })
    }
  }
}

export function RsvpExperience({ token, initialData }: RsvpExperienceProps) {
  const reduceMotion = useReducedMotion()
  const [data, setData] = useState(initialData)
  const [step, setStep] = useState(0)
  const [confirmed, setConfirmed] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<string | null>(null)
  const [membershipChanged, setMembershipChanged] = useState(false)
  const [invitationMissing, setInvitationMissing] = useState(false)
  const schema = useMemo(
    () => createRsvpSchema(data.invitation.guests),
    [data.invitation.guests],
  )
  const form = useForm<RsvpFormValues>({
    resolver: zodResolver(schema),
    defaultValues: invitationToFormValues(
      data.invitation.guests,
      data.invitation.responseContactNumber,
      data.invitation.responseEmail,
      data.invitation.messageToCouple,
    ),
    mode: 'onTouched',
  })
  useWatch({ control: form.control })
  const values = form.getValues()

  async function reloadInvitation(resetForm: boolean) {
    const freshData = await getPublicInvitation(token)
    setData(freshData)
    if (resetForm) {
      form.reset(
        invitationToFormValues(
          freshData.invitation.guests,
          freshData.invitation.responseContactNumber,
          freshData.invitation.responseEmail,
          freshData.invitation.messageToCouple,
        ),
      )
    }
    return freshData
  }

  async function goForward() {
    let valid = true
    if (step === 1) {
      valid = await form.trigger(
        data.invitation.guests.map(
          (_, index) => `guests.${index}.attendanceStatus` as const,
        ),
      )
      data.invitation.guests.forEach((guest, index) => {
        if (!form.getValues(`guests.${index}.attendanceStatus`)) {
          form.setError(`guests.${index}.attendanceStatus`, {
            type: 'required',
            message: `Please choose whether ${guest.fullName} will be attending.`,
          })
          valid = false
        }
      })
    } else if (step === 2) {
      valid = await form.trigger('guests')
    } else if (step === 3) {
      valid = await form.trigger(['contactNumber', 'email', 'message'])
    }

    if (valid) {
      setSubmitMessage(null)
      setStep((current) => Math.min(current + 1, RSVP_STEPS.length - 1))
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    }
  }

  async function submit(valuesToSubmit: RsvpFormValues) {
    setSubmitMessage(null)
    setMembershipChanged(false)

    try {
      const result = await submitPublicRsvp(token, toRsvpPayload(valuesToSubmit))
      const nextData = { ...data, invitation: result.invitation }
      setData(nextData)
      form.reset(
        invitationToFormValues(
          result.invitation.guests,
          result.invitation.responseContactNumber,
          result.invitation.responseEmail,
          result.invitation.messageToCouple,
        ),
      )
      setConfirmed(true)
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    } catch (error) {
      if (!(error instanceof ApiError)) {
        setSubmitMessage('We couldn’t send your RSVP. Please check your connection and try again.')
        return
      }

      if (error.status === 409) {
        setSubmitMessage('This invitation is no longer accepting RSVP responses. Your unsaved choices were not submitted.')
        try {
          await reloadInvitation(false)
        } catch {
          // Preserve the form and the authoritative conflict state if refresh fails.
        }
        return
      }

      if (error.status === 422) {
        const householdError = Object.keys(error.validationErrors ?? {}).some(
          (path) => path === 'guests' || path.endsWith('.id'),
        )
        if (householdError) {
          setSubmitMessage('This invitation was updated while you were responding. We’ve reloaded the current household list; please review each guest again.')
          setMembershipChanged(true)
          try {
            await reloadInvitation(true)
            setStep(1)
          } catch {
            setSubmitMessage('This invitation was updated. Please refresh the page before trying again.')
          }
        } else {
          applyBackendErrors(error.validationErrors, form.setError)
          setSubmitMessage('Please review the highlighted details before confirming your RSVP.')
        }
        return
      }

      if (error.status === 429) {
        setSubmitMessage('Too many RSVP attempts. Please wait a moment and try again.')
      } else if (error.status === 404) {
        setInvitationMissing(true)
      } else {
        setSubmitMessage('We couldn’t send your RSVP. Please try again in a moment.')
      }
    }
  }

  const invitation = data.invitation
  const readOnly = !invitation.canRespond

  if (invitationMissing) {
    return (
      <NotFoundState
        title="Invitation not found"
        message="This invitation is unavailable. Please check the link you received or contact the couple."
      />
    )
  }

  return (
    <article className="mx-auto max-w-3xl">
      <InvitationOverview invitation={invitation} wedding={data.wedding} />

      {readOnly ? (
        <RsvpConfirmation
          invitation={invitation}
          readOnly
          notice={submitMessage ?? (invitation.isLocked ? 'This invitation has been locked. Your current response remains available below.' : 'RSVP responses are now closed for this invitation. Your current response remains available below.')}
        />
      ) : confirmed ? (
        <RsvpConfirmation
          invitation={invitation}
          onEdit={() => {
            setConfirmed(false)
            setStep(1)
          }}
        />
      ) : (
        <form onSubmit={form.handleSubmit(submit)} noValidate>
          <RsvpStepper currentStep={step} onStepSelect={setStep} />
          {submitMessage ? (
            <div className="mb-6 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-sm" role="alert" aria-live="assertive">
              {submitMessage}
            </div>
          ) : null}
          {membershipChanged ? <p className="sr-only" aria-live="polite">The household guest list was refreshed.</p> : null}

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              {step === 0 ? (
                <section className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
                  <h2 className="font-[var(--font-display)] text-3xl">Your household invitation</h2>
                  <p className="mt-2 text-[var(--color-muted)]">One household member can respond for everyone named below.</p>
                  <ul className="mt-6 divide-y divide-[var(--color-border)]">
                    {invitation.guests.map((guest) => (
                      <li key={guest.id} className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0">
                        <span className="font-medium">{guest.fullName}</span>
                        <AttendanceStatusBadge status={guest.attendanceStatus} />
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {step === 1 ? (
                <section>
                  <h2 className="font-[var(--font-display)] text-3xl">Who will be joining us?</h2>
                  <p className="mt-2 text-[var(--color-muted)]">Please choose one response for every named guest.</p>
                  <div className="mt-6 space-y-4">
                    {invitation.guests.map((guest, index) => (
                      <GuestAttendanceCard
                        key={guest.id}
                        guest={guest}
                        index={index}
                        control={form.control}
                        error={form.formState.errors.guests?.[index]?.attendanceStatus}
                        onDecline={() => {
                          form.setValue(`guests.${index}.dietaryRequirements`, '')
                          form.setValue(`guests.${index}.accessibilityRequirements`, '')
                        }}
                      />
                    ))}
                  </div>
                </section>
              ) : null}

              {step === 2 ? (
                <section>
                  <h2 className="font-[var(--font-display)] text-3xl">Guest details</h2>
                  <p className="mt-2 text-[var(--color-muted)]">Optional notes for guests who are attending.</p>
                  <div className="mt-6 space-y-4">
                    {invitation.guests.map((guest, index) =>
                      values.guests[index]?.attendanceStatus === 'attending' ? (
                        <GuestDetailsFields
                          key={guest.id}
                          guest={guest}
                          index={index}
                          register={form.register}
                          dietaryError={form.formState.errors.guests?.[index]?.dietaryRequirements?.message}
                          accessibilityError={form.formState.errors.guests?.[index]?.accessibilityRequirements?.message}
                        />
                      ) : null,
                    )}
                    {!values.guests.some((guest) => guest.attendanceStatus === 'attending') ? (
                      <p className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-muted)]">No additional guest details are needed.</p>
                    ) : null}
                  </div>
                </section>
              ) : null}

              {step === 3 ? <HouseholdDetailsForm register={form.register} errors={form.formState.errors} /> : null}
              {step === 4 ? <RsvpReview values={values} invitedGuests={invitation.guests} /> : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap justify-between gap-3 border-t border-[var(--color-border)] pt-6">
            {step > 0 ? (
              <ActionButton className="!bg-transparent !text-[var(--color-primary)] ring-1 ring-[var(--color-border)]" onClick={() => setStep((current) => current - 1)}>
                <ArrowLeft className="size-4" aria-hidden="true" /> Back
              </ActionButton>
            ) : <span />}
            {step < RSVP_STEPS.length - 1 ? (
              <ActionButton onClick={() => void goForward()}>
                {step === 0 ? (invitation.hasSubmitted ? 'Edit RSVP' : 'Respond to invitation') : 'Continue'}
                <ArrowRight className="size-4" aria-hidden="true" />
              </ActionButton>
            ) : (
              <ActionButton type="submit" disabled={form.formState.isSubmitting}>
                <Send className="size-4" aria-hidden="true" />
                {form.formState.isSubmitting ? 'Sending RSVP…' : invitation.hasSubmitted ? 'Save updated RSVP' : 'Confirm RSVP'}
              </ActionButton>
            )}
          </div>
        </form>
      )}
    </article>
  )
}

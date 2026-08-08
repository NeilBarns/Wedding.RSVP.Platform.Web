import { Check } from 'lucide-react'
import { RSVP_STEPS } from '../rsvpSteps'

type RsvpStepperProps = {
  currentStep: number
  onStepSelect: (step: number) => void
}

export function RsvpStepper({ currentStep, onStepSelect }: RsvpStepperProps) {
  return (
    <nav aria-label="RSVP progress" className="mb-8">
      <p className="mb-3 text-sm text-[var(--color-muted)]" aria-live="polite">
        Step {currentStep + 1} of {RSVP_STEPS.length}: {RSVP_STEPS[currentStep]}
      </p>
      <ol className="grid grid-cols-5 gap-2">
        {RSVP_STEPS.map((label, index) => {
          const complete = index < currentStep
          const current = index === currentStep
          return (
            <li key={label}>
              <button
                type="button"
                disabled={index > currentStep}
                onClick={() => onStepSelect(index)}
                className="group flex min-h-11 w-full flex-col items-center gap-2 rounded-[var(--radius-sm)] disabled:cursor-default"
                aria-current={current ? 'step' : undefined}
                aria-label={`${label}${complete ? ', completed' : current ? ', current step' : ''}`}
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full border text-sm font-semibold ${
                    current
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
                      : complete
                        ? 'border-[var(--color-success)] text-[var(--color-success)]'
                        : 'border-[var(--color-border)] text-[var(--color-muted)]'
                  }`}
                >
                  {complete ? <Check className="size-4" aria-hidden="true" /> : index + 1}
                </span>
                <span className="hidden text-xs text-[var(--color-muted)] sm:block">{label}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

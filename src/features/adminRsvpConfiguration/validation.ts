import { z } from 'zod'
import { configurableRsvpQuestionKeys, type RsvpQuestionUpdate } from '../rsvpConfiguration/types'

const questionSchema = z.object({
  key: z.enum(configurableRsvpQuestionKeys),
  enabled: z.boolean(),
  required: z.boolean(),
  label: z.string().trim().min(1, 'Enter a question label.').max(150, 'Keep the label under 150 characters.'),
  helperText: z.string().trim().max(500, 'Keep the helper text under 500 characters.'),
  sortOrder: z.number().int().min(0).max(10_000),
  options: z.array(z.object({
    id: z.number().int().nullable(),
    label: z.string().trim().min(1, 'Enter an option label.').max(150),
    value: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens.'),
    sortOrder: z.number().int().min(0).max(10_000),
    enabled: z.boolean(),
  })).optional(),
}).refine((question) => question.enabled || !question.required, { path: ['required'], message: 'A disabled question cannot be required.' })

export const rsvpConfigurationSchema = z.object({ questions: z.array(questionSchema).length(6) }).superRefine(({ questions }, context) => {
  const mealIndex = questions.findIndex((question) => question.key === 'mealChoice')
  if (mealIndex < 0) return
  const meal = questions[mealIndex]
  const values = (meal.options ?? []).map((option) => option.value)
  if (new Set(values).size !== values.length) context.addIssue({ code: 'custom', path: ['questions', mealIndex, 'options'], message: 'Meal option values must be unique.' })
  if (meal.enabled && (meal.options ?? []).filter((option) => option.enabled).length < 2) context.addIssue({ code: 'custom', path: ['questions', mealIndex, 'options'], message: 'Add at least two enabled meal options.' })
})
export type RsvpConfigurationFormValues = z.infer<typeof rsvpConfigurationSchema>

export function toQuestionValues(questions: RsvpQuestionUpdate[]): RsvpConfigurationFormValues {
  return { questions: questions.map((question) => ({ ...question, helperText: question.helperText ?? '', ...(question.key === 'mealChoice' ? { options: question.options ?? [] } : {}) })) }
}

export function toConfigurationPayload(values: RsvpConfigurationFormValues) {
  return {
    questions: values.questions.map((question) => ({
      ...question,
      label: question.label.trim(),
      helperText: question.helperText.trim() || null,
      ...(question.key === 'mealChoice' ? { options: (question.options ?? []).map((option, index) => ({ ...option, label: option.label.trim(), value: option.value.trim(), sortOrder: (index + 1) * 10 })) } : { options: undefined }),
    })),
  }
}

export function mealOptionValue(label: string) {
  return label.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

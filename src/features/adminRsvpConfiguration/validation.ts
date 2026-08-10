import { z } from 'zod'
import { configurableRsvpQuestionKeys, type RsvpQuestionUpdate } from '../rsvpConfiguration/types'

const questionSchema = z.object({
  key: z.enum(configurableRsvpQuestionKeys),
  enabled: z.boolean(),
  required: z.boolean(),
  label: z.string().trim().min(1, 'Enter a question label.').max(150, 'Keep the label under 150 characters.'),
  helperText: z.string().trim().max(500, 'Keep the helper text under 500 characters.'),
  sortOrder: z.number().int().min(0).max(10_000),
}).refine((question) => question.enabled || !question.required, { path: ['required'], message: 'A disabled question cannot be required.' })

export const rsvpConfigurationSchema = z.object({ questions: z.array(questionSchema).length(5) })
export type RsvpConfigurationFormValues = z.infer<typeof rsvpConfigurationSchema>

export function toQuestionValues(questions: RsvpQuestionUpdate[]): RsvpConfigurationFormValues {
  return { questions: questions.map((question) => ({ ...question, helperText: question.helperText ?? '' })) }
}

export function toConfigurationPayload(values: RsvpConfigurationFormValues) {
  return {
    questions: values.questions.map((question) => ({
      ...question,
      label: question.label.trim(),
      helperText: question.helperText.trim() || null,
    })),
  }
}

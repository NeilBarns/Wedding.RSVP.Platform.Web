import { z } from 'zod'
import type { AdminWeddingSettings, WeddingUpdateRequest } from './types'
import { fallbackWeddingTemplateKey } from '../weddingTemplates/resolveTemplate'
import { weddingTemplateKeys, type WeddingTemplateKey } from '../weddingTemplates/types'

const validDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

const optionalText = (max: number, message: string) => z.string().trim().max(max, message)
const color = z.string().trim().refine((value) => value === '' || /^#[0-9A-Fa-f]{6}$/.test(value), 'Use a six-digit hex color such as #F5F1EA.')

export const weddingSettingsSchema = z.object({
  partnerOneName: z.string().trim().min(1, 'Please enter partner one’s name.').max(150, 'Name must be 150 characters or fewer.'),
  partnerTwoName: z.string().trim().min(1, 'Please enter partner two’s name.').max(150, 'Name must be 150 characters or fewer.'),
  weddingDate: z.string().min(1, 'Please choose the wedding date.').refine(validDate, 'Please choose a valid wedding date.'),
  rsvpDeadline: z.string().refine((value) => value === '' || validDate(value), 'Please choose a valid RSVP deadline.'),
  dressCode: optionalText(100, 'Dress code must be 100 characters or fewer.'),
  status: z.enum(['draft', 'published', 'archived']),
  templateKey: z.string().refine((value) => weddingTemplateKeys.includes(value as WeddingTemplateKey), 'Select a supported wedding template.'),
  theme: z.object({
    key: optionalText(100, 'Theme key must be 100 characters or fewer.'),
    primaryColor: color,
    secondaryColor: color,
    accentColor: color,
    backgroundColor: color,
    headingFont: optionalText(100, 'Heading font must be 100 characters or fewer.'),
    bodyFont: optionalText(100, 'Body font must be 100 characters or fewer.'),
  }),
}).superRefine((values, context) => {
  if (values.rsvpDeadline && values.rsvpDeadline >= values.weddingDate) {
    context.addIssue({ code: 'custom', path: ['rsvpDeadline'], message: 'The RSVP deadline must be before the wedding date.' })
  }
})

export type WeddingSettingsFormValues = z.infer<typeof weddingSettingsSchema>

const nullable = (value: string) => value.trim() === '' ? null : value.trim()
const upperColor = (value: string) => nullable(value)?.toUpperCase() ?? null

export function weddingToFormValues(wedding: AdminWeddingSettings): WeddingSettingsFormValues {
  return {
    partnerOneName: wedding.partnerOneName,
    partnerTwoName: wedding.partnerTwoName,
    weddingDate: wedding.weddingDate,
    rsvpDeadline: wedding.rsvpDeadline ?? '',
    dressCode: wedding.dressCode ?? '',
    status: wedding.status,
    templateKey: wedding.templateKey ?? fallbackWeddingTemplateKey,
    theme: {
      key: wedding.theme.key ?? '',
      primaryColor: wedding.theme.primaryColor ?? '',
      secondaryColor: wedding.theme.secondaryColor ?? '',
      accentColor: wedding.theme.accentColor ?? '',
      backgroundColor: wedding.theme.backgroundColor ?? '',
      headingFont: wedding.theme.headingFont ?? '',
      bodyFont: wedding.theme.bodyFont ?? '',
    },
  }
}

export function weddingPayload(values: WeddingSettingsFormValues): WeddingUpdateRequest {
  return {
    partnerOneName: values.partnerOneName.trim(),
    partnerTwoName: values.partnerTwoName.trim(),
    weddingDate: values.weddingDate,
    rsvpDeadline: nullable(values.rsvpDeadline),
    dressCode: nullable(values.dressCode),
    status: values.status,
    templateKey: values.templateKey as WeddingTemplateKey,
    theme: {
      key: nullable(values.theme.key),
      primaryColor: upperColor(values.theme.primaryColor),
      secondaryColor: upperColor(values.theme.secondaryColor),
      accentColor: upperColor(values.theme.accentColor),
      backgroundColor: upperColor(values.theme.backgroundColor),
      headingFont: nullable(values.theme.headingFont),
      bodyFont: nullable(values.theme.bodyFont),
    },
  }
}

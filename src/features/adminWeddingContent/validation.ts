import { z } from 'zod'
const plain = (max: number) => z.string().max(max).refine((value) => !/<[^>]*>/.test(value), 'Please use plain text without HTML.')
const optionalUrl = z.string().max(2048).refine((value) => value === '' || URL.canParse(value), 'Enter a valid URL.')
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date.')
const optionalDate = z.string().refine((value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value), 'Enter a valid date.')
const time = z.string().refine((value) => value === '' || /^([01]\d|2[0-3]):[0-5]\d$/.test(value), 'Enter a valid time.')
const base = { sortOrder: z.coerce.number<number>().int().min(0, 'Sort order cannot be negative.'), isPublished: z.boolean() }
export const heroSchema = z.object({ eyebrow: plain(150), headline: plain(255), subheadline: plain(1000), mediaUrl: optionalUrl, mediaAltText: plain(500), isPublished: z.boolean() })
export const storySchema = z.object({ title: plain(255), body: plain(10000).min(1, 'Body is required.'), imageUrl: optionalUrl, imageAltText: plain(500), eventDate: optionalDate, ...base })
export const eventSchema = z.object({ title: plain(255).min(1, 'Title is required.'), eventType: z.enum(['ceremony', 'reception', 'other']), eventDate: date, startTime: time, endTime: time, venueName: plain(255), addressLine: plain(1000), mapUrl: optionalUrl, description: plain(5000), dressCodeOverride: plain(1000), ...base }).refine((value) => !value.startTime || !value.endTime || value.endTime > value.startTime, { path: ['endTime'], message: 'End time must be after start time.' })
export const faqSchema = z.object({ question: plain(500).min(1, 'Question is required.'), answer: plain(10000).min(1, 'Answer is required.'), ...base })
export const gallerySchema = z.object({ imageUrl: z.string().min(1, 'Image URL is required.').max(2048).refine((value) => URL.canParse(value), 'Enter a valid URL.'), altText: plain(500), caption: plain(2000), ...base })
export const nullable = (value: string) => value.trim() || null
export type HeroValues = z.infer<typeof heroSchema>; export type StoryValues = z.infer<typeof storySchema>; export type EventValues = z.infer<typeof eventSchema>; export type FaqValues = z.infer<typeof faqSchema>; export type GalleryValues = z.infer<typeof gallerySchema>

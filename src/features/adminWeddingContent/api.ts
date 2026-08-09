import { api } from '../../lib/api'
import type { EventPayload, FaqEntry, FaqPayload, GalleryEntry, GalleryPayload, HeroContent, HeroPayload, StoryEntry, StoryPayload, WeddingEvent } from './types'
type Data<T> = { data: T }
export const weddingContentApi = {
  getHero: async (options?: { signal?: AbortSignal }) => (await api.get<Data<HeroContent>>('/api/admin/wedding-content/hero', options)).data,
  saveHero: async (payload: HeroPayload) => (await api.put<Data<HeroContent>>('/api/admin/wedding-content/hero', payload)).data,
  listStory: async (options?: { signal?: AbortSignal }) => (await api.get<Data<StoryEntry[]>>('/api/admin/wedding-content/story', options)).data,
  createStory: async (payload: StoryPayload) => (await api.post<Data<StoryEntry>>('/api/admin/wedding-content/story', payload)).data,
  updateStory: async (id: number, payload: StoryPayload) => (await api.put<Data<StoryEntry>>(`/api/admin/wedding-content/story/${id}`, payload)).data,
  deleteStory: (id: number) => api.delete<void>(`/api/admin/wedding-content/story/${id}`),
  listEvents: async (options?: { signal?: AbortSignal }) => (await api.get<Data<WeddingEvent[]>>('/api/admin/wedding-content/events', options)).data,
  createEvent: async (payload: EventPayload) => (await api.post<Data<WeddingEvent>>('/api/admin/wedding-content/events', payload)).data,
  updateEvent: async (id: number, payload: EventPayload) => (await api.put<Data<WeddingEvent>>(`/api/admin/wedding-content/events/${id}`, payload)).data,
  deleteEvent: (id: number) => api.delete<void>(`/api/admin/wedding-content/events/${id}`),
  listFaq: async (options?: { signal?: AbortSignal }) => (await api.get<Data<FaqEntry[]>>('/api/admin/wedding-content/faq', options)).data,
  createFaq: async (payload: FaqPayload) => (await api.post<Data<FaqEntry>>('/api/admin/wedding-content/faq', payload)).data,
  updateFaq: async (id: number, payload: FaqPayload) => (await api.put<Data<FaqEntry>>(`/api/admin/wedding-content/faq/${id}`, payload)).data,
  deleteFaq: (id: number) => api.delete<void>(`/api/admin/wedding-content/faq/${id}`),
  listGallery: async (options?: { signal?: AbortSignal }) => (await api.get<Data<GalleryEntry[]>>('/api/admin/wedding-content/gallery', options)).data,
  createGallery: async (payload: GalleryPayload) => (await api.post<Data<GalleryEntry>>('/api/admin/wedding-content/gallery', payload)).data,
  updateGallery: async (id: number, payload: GalleryPayload) => (await api.put<Data<GalleryEntry>>(`/api/admin/wedding-content/gallery/${id}`, payload)).data,
  deleteGallery: (id: number) => api.delete<void>(`/api/admin/wedding-content/gallery/${id}`),
}

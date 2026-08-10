import { api } from '../../lib/api'
import type { RsvpConfigurationUpdate, RsvpQuestion } from '../rsvpConfiguration/types'

export type AdminRsvpConfiguration = { questions: RsvpQuestion[] }
type ConfigurationResponse = { data: AdminRsvpConfiguration }

export async function getAdminRsvpConfiguration(options?: { signal?: AbortSignal }) {
  return (await api.get<ConfigurationResponse>('/api/admin/rsvp-configuration', options)).data
}

export async function updateAdminRsvpConfiguration(payload: RsvpConfigurationUpdate) {
  return (await api.put<ConfigurationResponse>('/api/admin/rsvp-configuration', payload)).data
}

import { api } from '../../lib/api'
import type { AdminRsvpOption, RsvpConfigurationUpdate, RsvpQuestion } from '../rsvpConfiguration/types'

export type AdminRsvpQuestion = Omit<RsvpQuestion, 'options'> & { options?: AdminRsvpOption[] }
export type AdminRsvpConfiguration = { questions: AdminRsvpQuestion[] }
type ConfigurationResponse = { data: AdminRsvpConfiguration }

export async function getAdminRsvpConfiguration(options?: { signal?: AbortSignal }) {
  return (await api.get<ConfigurationResponse>('/api/admin/rsvp-configuration', options)).data
}

export async function updateAdminRsvpConfiguration(payload: RsvpConfigurationUpdate) {
  return (await api.put<ConfigurationResponse>('/api/admin/rsvp-configuration', payload)).data
}

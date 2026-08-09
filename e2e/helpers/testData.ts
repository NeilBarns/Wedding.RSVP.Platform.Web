import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const fixturePath = path.resolve('playwright/.auth/e2e-fixture.json')
export const adminStoragePath = path.resolve('playwright/.auth/admin.json')

export type E2eInvitationFixture = {
  id: number
  displayName: string
  status: 'ready' | 'submitted' | 'locked'
  token: string
  url: string
}

export type E2eFixture = {
  admin: { id: number; name: string; email: string; password: string; role: 'owner' }
  wedding: { id: number; status: 'published' }
  invitations: {
    fresh: E2eInvitationFixture
    submitted: E2eInvitationFixture
    locked: E2eInvitationFixture
  }
}

function object(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value) }
function invitation(value: unknown, status: E2eInvitationFixture['status']): value is E2eInvitationFixture {
  return object(value) && typeof value.id === 'number' && typeof value.displayName === 'string' && value.status === status && typeof value.token === 'string' && value.token.length >= 32 && typeof value.url === 'string'
}

export function parseE2eFixture(value: unknown): E2eFixture {
  if (!object(value) || !object(value.admin) || !object(value.wedding) || !object(value.invitations) ||
    typeof value.admin.id !== 'number' || typeof value.admin.name !== 'string' || typeof value.admin.email !== 'string' || typeof value.admin.password !== 'string' || value.admin.role !== 'owner' ||
    typeof value.wedding.id !== 'number' || value.wedding.status !== 'published' ||
    !invitation(value.invitations.fresh, 'ready') || !invitation(value.invitations.submitted, 'submitted') || !invitation(value.invitations.locked, 'locked')) {
    throw new Error('The Laravel E2E reset command returned an unexpected fixture shape.')
  }
  return value as E2eFixture
}

let cached: E2eFixture | null = null
export async function getE2eFixture() {
  if (!cached) cached = parseE2eFixture(JSON.parse(await readFile(fixturePath, 'utf8')) as unknown)
  return cached
}
export async function getFreshInvitation() { return (await getE2eFixture()).invitations.fresh }
export async function getSubmittedInvitation() { return (await getE2eFixture()).invitations.submitted }
export async function getLockedInvitation() { return (await getE2eFixture()).invitations.locked }

import { chromium, request } from '@playwright/test'
import { execFile } from 'node:child_process'
import { chmod, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { apiUrl, frontendUrl, requireApiRepoPath } from './helpers/env'
import { adminStoragePath, fixturePath, parseE2eFixture } from './helpers/testData'

const execute = promisify(execFile)

export default async function globalSetup() {
  const apiRepo = await requireApiRepoPath()
  let stdout: string
  try {
    ({ stdout } = await execute('php', ['artisan', '--env=e2e', 'e2e:reset', '--json'], { cwd: apiRepo, windowsHide: true, maxBuffer: 1024 * 1024 }))
  } catch {
    throw new Error('The guarded Laravel E2E fixture reset failed. Verify the API .env.e2e database configuration; fixture secrets were not logged.')
  }

  let fixture
  try { fixture = parseE2eFixture(JSON.parse(stdout.trim()) as unknown) } catch {
    throw new Error('The guarded Laravel E2E fixture reset did not return valid JSON. Fixture secrets were not logged.')
  }

  const api = await request.newContext({ baseURL: apiUrl, extraHTTPHeaders: { Accept: 'application/json' } })
  try {
    const response = await api.get('/api/wedding')
    if (!response.ok()) throw new Error('unreachable')
    const payload = await response.json() as unknown
    if (!isExpectedWedding(payload)) throw new Error('mismatch')
  } catch {
    throw new Error('The running API is not the reset E2E fixture. Start it with php artisan serve --env=e2e --host=127.0.0.1 --port=8000.')
  } finally { await api.dispose() }

  await mkdir(path.dirname(fixturePath), { recursive: true })
  await writeFile(fixturePath, JSON.stringify(fixture), { encoding: 'utf8', mode: 0o600 })
  if (process.platform !== 'win32') await chmod(fixturePath, 0o600)

  const browser = await chromium.launch()
  let authenticationStage = 'opening the login page'
  try {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.goto(`${frontendUrl}/admin/login`)
    authenticationStage = 'submitting the login request'
    await page.getByLabel('Email').fill(fixture.admin.email)
    await page.getByLabel('Password').fill(fixture.admin.password)
    const loginResponsePromise = page.waitForResponse((response) => response.url().endsWith('/api/auth/login'))
    const meResponsePromise = page.waitForResponse((response) => response.url().endsWith('/api/auth/me') && response.request().method() === 'GET')
    await page.getByRole('button', { name: 'Sign in' }).click()
    const loginResponse = await loginResponsePromise
    if (!loginResponse.ok()) authenticationStage = `receiving login HTTP ${loginResponse.status()}`
    if (!loginResponse.ok()) throw new Error('login failed')
    authenticationStage = 'waiting for the authenticated redirect'
    const meResponse = await meResponsePromise
    if (!meResponse.ok()) {
      authenticationStage = `verifying the session with HTTP ${meResponse.status()}`
      throw new Error('auth verification failed')
    }
    await page.waitForURL(/\/admin(?:\?.*)?$/, { timeout: 15_000 })
    authenticationStage = 'saving the authenticated browser state'
    await context.storageState({ path: adminStoragePath })
  } catch {
    throw new Error(`E2E admin authentication failed while ${authenticationStage}. Verify the frontend and E2E API origins and Sanctum configuration; credentials and cookies were not logged.`)
  } finally { await browser.close() }
}

function isExpectedWedding(value: unknown) {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false
  const data = (value as { data?: unknown }).data
  return typeof data === 'object' && data !== null && 'partnerOneName' in data && 'partnerTwoName' in data && data.partnerOneName === 'E2E Partner One' && data.partnerTwoName === 'E2E Partner Two'
}

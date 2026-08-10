import { chromium, request } from '@playwright/test'
import { execFile } from 'node:child_process'
import { chmod, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { apiUrl, frontendUrl, requireApiRepoPath } from './helpers/env'
import { adminStoragePath, fixturePath, parseE2eFixture } from './helpers/testData'

const execute = promisify(execFile)

export default async function globalSetup() {
  const apiRepo = requireApiRepoPath()
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
    throw new Error(`The E2E API at ${apiUrl} is reachable but does not expose the reset E2E fixture. Frontend origin: ${frontendUrl}.`)
  } finally { await api.dispose() }

  await mkdir(path.dirname(fixturePath), { recursive: true })
  await writeFile(fixturePath, JSON.stringify(fixture), { encoding: 'utf8', mode: 0o600 })
  if (process.platform !== 'win32') await chmod(fixturePath, 0o600)

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  let authenticationStage = 'opening the login page'
  let loginFormLoaded = false
  let reachedAdmin = false
  let loginStatus: number | null = null
  let authVerificationStatus: number | null = null
  try {
    await page.goto(`${frontendUrl}/admin/login`)
    await page.getByRole('heading', { name: 'Admin login' }).waitFor()
    loginFormLoaded = true
    authenticationStage = 'submitting the login request'
    await page.getByLabel('Email').fill(fixture.admin.email)
    await page.getByLabel('Password').fill(fixture.admin.password)
    const [loginResponse] = await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/api/auth/login') && response.request().method() === 'POST'),
      page.getByRole('button', { name: 'Sign in' }).click(),
    ])
    loginStatus = loginResponse.status()
    if (!loginResponse.ok()) authenticationStage = `receiving login HTTP ${loginStatus}`
    if (!loginResponse.ok()) throw new Error('login failed')
    authenticationStage = 'waiting for the authenticated redirect'
    await page.waitForURL(/\/admin(?:\?.*)?$/, { timeout: 15_000 })
    reachedAdmin = true
    await page.getByText('E2E Owner').first().waitFor()

    authenticationStage = 'verifying the authenticated session'
    const authVerification = await context.request.get(`${apiUrl}/api/auth/me`, {
      headers: {
        Accept: 'application/json',
        Origin: frontendUrl,
        Referer: `${frontendUrl}/admin`,
      },
    })
    authVerificationStatus = authVerification.status()
    if (!authVerification.ok()) {
      authenticationStage = `verifying the session with HTTP ${authVerificationStatus}`
      throw new Error('auth verification failed')
    }
    authenticationStage = 'saving the authenticated browser state'
    await context.storageState({ path: adminStoragePath })
  } catch {
    const currentUrl = page.isClosed() ? 'page closed' : page.url()
    throw new Error(`E2E admin authentication failed while ${authenticationStage}. URL: ${currentUrl}; login form loaded: ${loginFormLoaded}; reached /admin: ${reachedAdmin}; login HTTP: ${loginStatus ?? 'not received'}; auth verification HTTP: ${authVerificationStatus ?? 'not requested'}. Verify the frontend and E2E API origins and Sanctum configuration; credentials and cookies were not logged.`)
  } finally {
    await context.close()
    await browser.close()
  }
}

function isExpectedWedding(value: unknown) {
  if (typeof value !== 'object' || value === null || !('data' in value)) return false
  const data = (value as { data?: unknown }).data
  return typeof data === 'object' && data !== null && 'partnerOneName' in data && 'partnerTwoName' in data && data.partnerOneName === 'E2E Partner One' && data.partnerTwoName === 'E2E Partner Two'
}

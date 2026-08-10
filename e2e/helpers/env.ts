import { accessSync } from 'node:fs'
import path from 'node:path'

const privateIpv4 = /^(10\.|127\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/

function isSafeHost(hostname: string) {
  return hostname === 'localhost' || hostname === '::1' || privateIpv4.test(hostname) || hostname.endsWith('.test')
}

export function safeLocalUrl(name: string, fallback: string) {
  const value = process.env[name] || fallback
  let url: URL
  try { url = new URL(value) } catch { throw new Error(`${name} must be a valid URL.`) }
  if (!['http:', 'https:'].includes(url.protocol) || !isSafeHost(url.hostname)) {
    throw new Error(`${name} must target localhost, a private network address, or a .test host. Refusing to run E2E tests.`)
  }
  return url.origin
}

export function requireApiRepoPath() {
  const configured = process.env.PLAYWRIGHT_API_REPO_PATH?.trim()
  const resolved = path.resolve(configured || path.join('..', 'Wedding.RSVP.Platform.API'))
  try { accessSync(path.join(resolved, 'artisan')) } catch { throw new Error(`PLAYWRIGHT_API_REPO_PATH must point to the Laravel API repository. Checked: ${resolved}`) }
  return resolved
}

export const frontendUrl = safeLocalUrl('PLAYWRIGHT_BASE_URL', 'http://127.0.0.1:5174')
export const apiUrl = safeLocalUrl('PLAYWRIGHT_API_BASE_URL', 'http://127.0.0.1:8001')

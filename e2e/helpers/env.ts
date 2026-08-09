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

export const frontendUrl = safeLocalUrl('PLAYWRIGHT_BASE_URL', 'http://localhost:5173')
export const apiUrl = safeLocalUrl('PLAYWRIGHT_API_BASE_URL', 'http://localhost:8000')
export const invitationToken = process.env.PLAYWRIGHT_INVITATION_TOKEN?.trim() || null
export const adminCredentials = process.env.PLAYWRIGHT_ADMIN_EMAIL && process.env.PLAYWRIGHT_ADMIN_PASSWORD
  ? { email: process.env.PLAYWRIGHT_ADMIN_EMAIL, password: process.env.PLAYWRIGHT_ADMIN_PASSWORD }
  : null

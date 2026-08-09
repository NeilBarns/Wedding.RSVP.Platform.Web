import type { Page } from '@playwright/test'

export function monitorPageErrors(page: Page) {
  const errors: Error[] = []
  page.on('pageerror', (error) => errors.push(error))
  return () => {
    if (errors.length) throw new Error(`Uncaught page error: ${errors[0].message}`)
  }
}

import { expect, test } from '@playwright/test'
import { invitationToken } from './helpers/env'
import { monitorPageErrors } from './helpers/pageErrors'

test('invalid invitation stays generic', async ({ page }) => {
  const invalidToken = 'playwright-invalid-invitation-token'
  await page.goto(`/invite/${invalidToken}`)
  await expect(page.getByRole('heading', { name: 'Invitation not found' })).toBeVisible()
  await expect(page.getByText(invalidToken)).toHaveCount(0)
  await expect(page.locator('body')).not.toContainText(/exception|stack trace|sqlstate/i)
})

test('valid invitation opens the household RSVP flow', async ({ page }) => {
  test.skip(!invitationToken, 'Set PLAYWRIGHT_INVITATION_TOKEN to a disposable or read-only local fixture token.')
  const assertNoPageErrors = monitorPageErrors(page)
  await page.goto(`/invite/${invitationToken}`)
  await expect(page.getByText('An invitation for')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const entry = page.getByRole('button', { name: /Respond to invitation|Edit RSVP/ })
  await expect(entry).toBeVisible()
  await entry.click()
  await expect(page.getByRole('navigation', { name: 'RSVP progress' })).toBeVisible()
  await expect(page.getByText(/Step 1 of 5/i)).toBeVisible()
  await expect(page.locator('body')).not.toContainText(/token hash|internal notes|revision history/i)
  assertNoPageErrors()
})

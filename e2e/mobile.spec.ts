import { expect, test, type Page } from '@playwright/test'
import { invitationToken } from './helpers/env'

async function expectNoHorizontalOverflow(page: Page) {
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true)
}

test('mobile public navigation and RSVP CTA remain reachable', async ({ page }) => {
  await page.goto('/')
  await expectNoHorizontalOverflow(page)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile wedding site navigation' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'RSVP', exact: true }).first()).toBeVisible()
})

test('mobile invitation remains usable when a fixture token is supplied', async ({ page }) => {
  test.skip(!invitationToken, 'Set PLAYWRIGHT_INVITATION_TOKEN for mobile invitation coverage.')
  await page.goto(`/invite/${invitationToken}`)
  await expect(page.getByText('An invitation for')).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await expect(page.getByRole('button', { name: /Respond to invitation|Edit RSVP/ })).toBeVisible()
})

test('mobile admin login stays within the viewport', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.getByRole('heading', { name: 'Admin login' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

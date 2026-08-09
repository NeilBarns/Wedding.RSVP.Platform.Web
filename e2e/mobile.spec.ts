import { expect, test, type Page } from '@playwright/test'
import { getLockedInvitation } from './helpers/testData'

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

test('mobile Modern Minimal preview remains responsive', async ({ page }) => {
  await page.goto('/?templatePreview=modern-minimal-v1')
  await expect(page.locator('[data-wedding-template="modern-minimal-v1"]')).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await expect(page.getByRole('navigation', { name: 'Mobile wedding site navigation' })).toBeVisible()
})

test('mobile locked invitation remains readable and stable', async ({ page }) => {
  const invitation = await getLockedInvitation()
  await page.goto(`/invite/${invitation.token}`)
  await expect(page.getByText('An invitation for')).toBeVisible()
  await expectNoHorizontalOverflow(page)
  await expect(page.getByRole('heading', { name: 'E2E Locked Household' })).toBeVisible()
  await expect(page.getByText('This invitation has been locked.')).toBeVisible()
})

test('mobile admin login stays within the viewport', async ({ page }) => {
  await page.goto('/admin/login')
  await expect(page.getByRole('heading', { name: 'Admin login' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  await expectNoHorizontalOverflow(page)
})

import { expect, test } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'
import { adminCredentials } from './helpers/env'

test.beforeEach(async ({ page }) => {
  test.skip(!adminCredentials, 'Authenticated CMS smoke tests require local Playwright admin credentials.')
  await loginAsAdmin(page)
})

test('dashboard and primary admin navigation are available', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Dashboard|Wedding overview/i })).toBeVisible()
  const navigation = page.getByRole('navigation', { name: 'Admin navigation' }).first()
  await expect(navigation.getByRole('link', { name: 'Wedding Settings' })).toBeVisible()
  await expect(navigation.getByRole('link', { name: 'Wedding Content' })).toBeVisible()
  await expect(navigation.getByRole('link', { name: 'Invitations' })).toBeVisible()
})

test('wedding settings exposes core fields without mutation', async ({ page }) => {
  await page.goto('/admin/wedding')
  await expect(page.getByRole('heading', { name: 'Wedding settings' })).toBeVisible()
  await expect(page.getByLabel(/Partner one/i)).toBeVisible()
  await expect(page.getByLabel(/Partner two/i)).toBeVisible()
  await expect(page.getByLabel(/Wedding date/i)).toBeVisible()
  await expect(page.getByRole('button', { name: /Save/i })).toBeVisible()
})

test('wedding content tabs switch panels', async ({ page }) => {
  await page.goto('/admin/content')
  await expect(page.getByRole('heading', { name: 'Wedding content' })).toBeVisible()
  for (const name of ['Hero', 'Story', 'Events', 'FAQ', 'Gallery']) await expect(page.getByRole('tab', { name })).toBeVisible()
  await page.getByRole('tab', { name: 'Story' }).click()
  await expect(page.getByRole('tab', { name: 'Story' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('Our story')
  await page.getByRole('tab', { name: 'FAQ' }).click()
  await expect(page.getByRole('tab', { name: 'FAQ' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel')).toContainText('Frequently asked questions')
})

test('invitation management renders list or empty state', async ({ page }) => {
  await page.goto('/admin/invitations')
  await expect(page.getByRole('heading', { name: 'Invitations' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Create invitation' }).first()).toBeVisible()
  await expect(page.getByRole('textbox', { name: /search/i })).toBeVisible()
  await expect(page.getByText(/total invitation|No invitations found/i)).toBeVisible()
})

import { expect, test } from '@playwright/test'
import { adminStoragePath } from './helpers/testData'

test('protected admin route redirects to the complete login form', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login$/)
  await expect(page.getByRole('heading', { name: 'Admin login' })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password')
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})

test.describe('authenticated admin', () => {
  test.use({ storageState: adminStoragePath })
  test('fixture owner opens the authenticated shell', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByText('E2E Owner').first()).toBeVisible()
    await expect(page.getByRole('navigation', { name: 'Admin navigation' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign out' }).first()).toBeVisible()
  })
})

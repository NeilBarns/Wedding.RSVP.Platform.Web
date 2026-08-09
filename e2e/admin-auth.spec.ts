import { expect, test } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'
import { adminCredentials } from './helpers/env'

test('protected admin route redirects to the complete login form', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login$/)
  await expect(page.getByRole('heading', { name: 'Admin login' })).toBeVisible()
  await expect(page.getByLabel('Email')).toBeVisible()
  await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password')
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
})

test('configured admin credentials open the authenticated shell', async ({ page }) => {
  test.skip(!adminCredentials, 'Set PLAYWRIGHT_ADMIN_EMAIL and PLAYWRIGHT_ADMIN_PASSWORD for authenticated smoke coverage.')
  await loginAsAdmin(page)
  await expect(page.getByRole('navigation', { name: 'Admin navigation' }).first()).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign out' }).first()).toBeVisible()
})

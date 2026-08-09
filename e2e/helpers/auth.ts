import { expect, type Page } from '@playwright/test'
import { adminCredentials } from './env'

export async function loginAsAdmin(page: Page) {
  if (!adminCredentials) throw new Error('Admin credentials are not configured.')
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill(adminCredentials.email)
  await page.getByLabel('Password').fill(adminCredentials.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin(?:\?.*)?$/)
}

import { expect, test } from '@playwright/test'
import { adminStoragePath } from './helpers/testData'

test.use({ storageState: adminStoragePath })

test('dashboard and primary admin navigation are available', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.getByRole('heading', { name: /Dashboard|Wedding overview/i })).toBeVisible()
  const navigation = page.getByRole('navigation', { name: 'Admin navigation' }).first()
  await expect(navigation.getByRole('link', { name: 'Wedding Settings' })).toBeVisible()
  await expect(navigation.getByRole('link', { name: 'Wedding Content' })).toBeVisible()
  await expect(navigation.getByRole('link', { name: 'Invitations' })).toBeVisible()
})

test('draft FAQ can be published and becomes publicly visible', async ({ page }) => {
  await page.goto('/admin/content?section=faq')
  const draftItem = page.getByRole('listitem').filter({ hasText: 'E2E Draft Question?' })
  await expect(draftItem.getByText('Draft', { exact: true })).toBeVisible()
  const publicPage = await page.context().newPage()
  await publicPage.goto('/')
  await expect(publicPage.getByText('E2E Draft Question?', { exact: true })).toHaveCount(0)
  await publicPage.close()

  await draftItem.getByRole('button', { name: 'Edit' }).click()
  await page.getByLabel('Published').check()
  await page.getByRole('button', { name: 'Save FAQ' }).click()
  await expect(draftItem.getByText('Published', { exact: true })).toBeVisible()

  const publishedPage = await page.context().newPage()
  await publishedPage.goto('/')
  const question = publishedPage.getByRole('button', { name: 'E2E Draft Question?' })
  await expect(question).toBeVisible()
  await question.click()
  await expect(publishedPage.getByText('E2E unpublished FAQ answer.')).toBeVisible()
  await publishedPage.close()
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

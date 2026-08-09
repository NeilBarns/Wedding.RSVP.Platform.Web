import { expect, test } from '@playwright/test'
import { monitorPageErrors } from './helpers/pageErrors'

test('published wedding landing page renders its primary guest journey', async ({ page }) => {
  const assertNoPageErrors = monitorPageErrors(page)
  await page.goto('/')
  await expect(page.locator('[data-wedding-template="editorial-linen-v1"]')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByText('E2E Wedding Headline')).toBeVisible()
  await expect(page.getByRole('link', { name: 'RSVP', exact: true }).first()).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Wedding site navigation' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Wedding website unavailable' })).toHaveCount(0)
  assertNoPageErrors()
})

test('published fixture FAQ can be expanded and collapsed', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const faq = page.locator('#faq')
  const disclosure = faq.getByRole('button', { name: 'E2E Published Question?' })
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false')
  const panelId = await disclosure.getAttribute('aria-controls')
  expect(panelId).toBeTruthy()
  await disclosure.click()
  await expect(disclosure).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator(`#${panelId}`)).toBeVisible()
  await expect(page.getByText('E2E published FAQ answer.')).toBeVisible()
  await disclosure.click()
  await expect(disclosure).toHaveAttribute('aria-expanded', 'false')
})

test('an unknown API template key falls back safely to Editorial Linen', async ({ page }) => {
  await page.route('**/api/wedding', async (route) => {
    const response = await route.fetch()
    const payload = await response.json()
    payload.data.templateKey = 'future-template-not-supported'
    await route.fulfill({ response, json: payload })
  })

  await page.goto('/')
  await expect(page.locator('[data-wedding-template="editorial-linen-v1"]')).toBeVisible()
  await expect(page.getByText('E2E Wedding Headline')).toBeVisible()
})

test('Modern Minimal landing preview renders the same published content', async ({ page }) => {
  await page.goto('/?templatePreview=modern-minimal-v1')
  await expect(page.locator('[data-wedding-template="modern-minimal-v1"]')).toBeVisible()
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  await expect(page.getByText('E2E Wedding Headline')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'E2E Ceremony' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'E2E Published Question?' })).toHaveAttribute('aria-expanded', 'false')
})

test('unknown template preview is ignored safely', async ({ page }) => {
  await page.goto('/?templatePreview=not-registered')
  await expect(page.locator('[data-wedding-template="editorial-linen-v1"]')).toBeVisible()
  await expect(page.locator('[data-wedding-template="modern-minimal-v1"]')).toHaveCount(0)
})

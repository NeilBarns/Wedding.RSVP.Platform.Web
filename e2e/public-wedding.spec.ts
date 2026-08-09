import { expect, test } from '@playwright/test'
import { monitorPageErrors } from './helpers/pageErrors'

test('published wedding landing page renders its primary guest journey', async ({ page }) => {
  const assertNoPageErrors = monitorPageErrors(page)
  await page.goto('/')
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

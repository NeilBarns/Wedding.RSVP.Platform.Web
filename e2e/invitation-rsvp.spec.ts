import { expect, test, type Page } from '@playwright/test'
import { getFreshInvitation, getLockedInvitation, getSubmittedInvitation } from './helpers/testData'
import { monitorPageErrors } from './helpers/pageErrors'

async function continueStep(page: Page) { await page.getByRole('button', { name: 'Continue' }).click() }

test('invalid invitation stays generic', async ({ page }) => {
  const invalidToken = 'playwright-invalid-invitation-token'
  await page.goto(`/invite/${invalidToken}`)
  await expect(page.getByRole('heading', { name: 'Invitation not found' })).toBeVisible()
  await expect(page.getByText(invalidToken)).toHaveCount(0)
  await expect(page.locator('body')).not.toContainText(/exception|stack trace|sqlstate/i)
})

test.describe.serial('fresh household journey', () => {
  test('valid invitation exposes its personalized RSVP flow', async ({ page }) => {
    const invitation = await getFreshInvitation()
    const assertNoPageErrors = monitorPageErrors(page)
    await page.goto(`/invite/${invitation.token}`)
    await expect(page.locator('[data-wedding-template="editorial-linen-v1"]')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'E2E Fresh Household' })).toBeVisible()
    await expect(page.getByText('E2E Guest One')).toBeVisible()
    await expect(page.getByText('E2E Guest Two')).toBeVisible()
    await page.getByRole('button', { name: 'Respond to invitation' }).click()
    await expect(page.getByRole('navigation', { name: 'RSVP progress' })).toBeVisible()
    await expect(page.getByText(/Step 2 of 5/i)).toBeVisible()
    await expect(page.locator('body')).not.toContainText(/token hash|internal notes|revision history/i)
    assertNoPageErrors()
  })

  test('fresh household can submit a complete RSVP', async ({ page }) => {
    const invitation = await getFreshInvitation()
    const assertNoPageErrors = monitorPageErrors(page)
    await page.goto(`/invite/${invitation.token}`)
    await page.getByRole('button', { name: 'Respond to invitation' }).click()
    await page.getByRole('group', { name: 'E2E Guest One' }).getByText('Joyfully accepts').click()
    await page.getByRole('group', { name: 'E2E Guest Two' }).getByText('Regretfully declines').click()
    await continueStep(page)
    await page.getByLabel('Dietary requirements').fill('E2E no shellfish')
    await continueStep(page)
    await page.getByLabel('Contact number').fill('+63 911 111 1111')
    await page.getByLabel('Email').fill('fresh-household@example.test')
    await page.getByLabel('Message to Neil & Hazel').fill('E2E fresh RSVP message.')
    await continueStep(page)
    await expect(page.getByRole('heading', { name: 'Review your RSVP' })).toBeVisible()
    await page.getByRole('button', { name: 'Confirm RSVP' }).dispatchEvent('click')
    await expect(page.getByRole('heading', { name: 'Your RSVP has been received' })).toBeVisible()
    await expect(page.locator('[data-wedding-template="editorial-linen-v1"]')).toBeVisible()
    await expect(page.getByText('E2E fresh RSVP message.')).toBeVisible()
    await page.reload()
    await expect(page.getByRole('button', { name: 'Edit RSVP' })).toBeVisible()
    await expect(page.getByText('Attending', { exact: true })).toBeVisible()
    assertNoPageErrors()
  })
})

test('submitted household can edit and persist its response', async ({ page }) => {
  const invitation = await getSubmittedInvitation()
  const updatedMessage = 'E2E updated submitted response.'
  const assertNoPageErrors = monitorPageErrors(page)
  await page.goto(`/invite/${invitation.token}`)
  await expect(page.getByRole('button', { name: 'Edit RSVP' })).toBeVisible()
  await page.getByRole('button', { name: 'Edit RSVP' }).click()
  await continueStep(page)
  await continueStep(page)
  await page.getByLabel('Message to Neil & Hazel').fill(updatedMessage)
  await continueStep(page)
  await expect(page.getByRole('heading', { name: 'Review your RSVP' })).toBeVisible()
  await page.getByRole('button', { name: 'Save updated RSVP' }).dispatchEvent('click')
  await expect(page.getByRole('heading', { name: 'Your RSVP has been received' })).toBeVisible()
  await expect(page.getByText(updatedMessage)).toBeVisible()
  await page.reload()
  await page.getByRole('button', { name: 'Edit RSVP' }).click()
  await continueStep(page)
  await continueStep(page)
  await expect(page.getByLabel('Message to Neil & Hazel')).toHaveValue(updatedMessage)
  assertNoPageErrors()
})

test('submitted household confirmation route uses Editorial Linen', async ({ page }) => {
  const invitation = await getSubmittedInvitation()
  await page.goto(`/invite/${invitation.token}/confirmation`)
  await expect(page.locator('[data-wedding-template="editorial-linen-v1"]')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Your RSVP has been received' })).toBeVisible()
})

test('locked household is viewable but cannot be edited', async ({ page }) => {
  const invitation = await getLockedInvitation()
  await page.goto(`/invite/${invitation.token}`)
  await expect(page.getByRole('heading', { name: 'E2E Locked Household' })).toBeVisible()
  await expect(page.getByText('This invitation has been locked.')).toBeVisible()
  await expect(page.getByRole('button', { name: /Respond to invitation|Edit RSVP|Confirm RSVP|Save updated RSVP/ })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Invitation not found' })).toHaveCount(0)
})

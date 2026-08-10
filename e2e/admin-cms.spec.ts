import { expect, test } from '@playwright/test'
import { adminStoragePath, getFreshInvitation, getSubmittedInvitation } from './helpers/testData'

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

test('template gallery previews and persists a template without changing its theme', async ({ page }) => {
  const invitation = await getSubmittedInvitation()
  await page.goto('/admin/wedding')

  const editorial = page.getByRole('group', { name: 'Editorial Linen template' })
  const modern = page.getByRole('group', { name: 'Modern Minimal template' })
  await expect(editorial.getByText('Current template')).toBeVisible()
  const primaryColor = await page.getByLabel('Primary color').inputValue()
  const headingFont = await page.getByLabel('Heading font').inputValue()

  await modern.getByRole('button', { name: 'Preview Modern Minimal' }).click()
  const preview = page.getByRole('dialog', { name: 'Modern Minimal' })
  await expect(preview.locator('[data-wedding-template="modern-minimal-v1"]')).toBeVisible()
  await preview.getByRole('button', { name: 'Close preview' }).click()

  await modern.getByText('Select Modern Minimal', { exact: true }).click()
  await expect(modern.getByRole('radio')).toBeChecked()
  await expect(editorial.getByText('Current template')).toBeVisible()
  await page.getByRole('button', { name: 'Save changes' }).click()
  const confirmation = page.getByRole('dialog', { name: 'Change wedding template?' })
  await expect(confirmation).toContainText('content, RSVP responses, colors, and fonts will remain unchanged')
  await confirmation.getByRole('button', { name: 'Apply template' }).click()
  await expect(page.getByText('Wedding template and settings saved.')).toBeVisible()
  await expect(modern.getByText('Current template')).toBeVisible()
  await expect(page.getByLabel('Primary color')).toHaveValue(primaryColor)
  await expect(page.getByLabel('Heading font')).toHaveValue(headingFont)

  const publicPage = await page.context().newPage()
  await publicPage.goto('/')
  await expect(publicPage.locator('[data-wedding-template="modern-minimal-v1"]')).toBeVisible()
  await publicPage.goto(`/invite/${invitation.token}`)
  await expect(publicPage.locator('[data-wedding-template="modern-minimal-v1"]')).toBeVisible()
  await publicPage.close()

  await editorial.getByText('Select Editorial Linen', { exact: true }).click()
  await page.getByRole('button', { name: 'Save changes' }).click()
  await page.getByRole('dialog', { name: 'Change wedding template?' }).getByRole('button', { name: 'Apply template' }).click()
  await expect(page.getByText('Wedding template and settings saved.')).toBeVisible()
  await expect(editorial.getByText('Current template')).toBeVisible()
})

test('RSVP configuration persists and drives the shared Modern Minimal experience', async ({ page }) => {
  test.setTimeout(60_000)
  const invitation = await getFreshInvitation()
  await page.goto('/admin/rsvp-configuration')
  await expect(page.getByRole('heading', { name: 'RSVP configuration' })).toBeVisible()
  const attendance = page.locator('article[aria-label="Attendance system field"]')
  await expect(attendance).toContainText('System field')
  await expect(attendance.locator('input')).toHaveCount(0)

  const dietary = page.getByRole('group', { name: 'Dietary requirements configuration' })
  const accessibility = page.getByRole('group', { name: 'Accessibility needs configuration' })
  const email = page.getByRole('group', { name: 'Email address configuration' })
  const message = page.getByRole('group', { name: 'Message to the couple configuration' })
  const meal = page.getByRole('group', { name: 'Meal choice configuration' })
  await dietary.getByLabel('Enabled').uncheck()
  await accessibility.getByLabel(/Helper text/).fill('Tell us what would make the celebration comfortable.')
  await accessibility.getByLabel('Question label').fill('Accessibility support')
  await email.getByLabel('Required').check()
  await meal.getByLabel('Enabled').check()
  await meal.getByLabel('Required').check()
  await page.getByRole('button', { name: 'Add option' }).click()
  await page.getByLabel('Label', { exact: true }).last().fill('Roast Chicken')
  await page.getByRole('button', { name: 'Add option' }).click()
  await page.getByLabel('Label', { exact: true }).last().fill('Vegetarian')
  await message.getByRole('button', { name: 'Move Message to the couple up' }).click()
  const [configurationResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith('/api/admin/rsvp-configuration') && response.request().method() === 'PUT'),
    page.getByRole('button', { name: 'Save configuration' }).click(),
  ])
  expect(configurationResponse.status()).toBe(200)
  await expect(page.getByText('RSVP configuration saved.')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('group', { name: 'Dietary requirements configuration' }).getByLabel('Enabled')).not.toBeChecked()
  await expect(page.getByRole('group', { name: 'Accessibility support configuration' }).getByLabel(/Helper text/)).toHaveValue('Tell us what would make the celebration comfortable.')
  await expect(page.getByRole('group', { name: 'Email address configuration' }).getByLabel('Required')).toBeChecked()
  await expect(page.getByLabel('Value').first()).toHaveValue('roast-chicken')
  await expect(page.getByLabel('Value').first()).toHaveAttribute('readonly', '')

  const publicPage = await page.context().newPage()
  await publicPage.goto(`/invite/${invitation.token}?templatePreview=modern-minimal-v1`)
  await expect(publicPage.locator('[data-wedding-template="modern-minimal-v1"]')).toBeVisible()
  await publicPage.getByRole('button', { name: 'Respond to invitation' }).click()
  await publicPage.getByRole('group', { name: 'E2E Guest One' }).getByText('Joyfully accepts').click()
  await publicPage.getByRole('group', { name: 'E2E Guest Two' }).getByText('Regretfully declines').click()
  await publicPage.getByRole('button', { name: 'Continue' }).click()
  await expect(publicPage.getByLabel('Dietary requirements')).toHaveCount(0)
  await expect(publicPage.getByLabel('Accessibility support')).toBeVisible()
  await expect(publicPage.getByText('Tell us what would make the celebration comfortable.')).toBeVisible()
  await expect(publicPage.getByRole('group', { name: /Meal choice/ })).toBeVisible()
  await publicPage.getByRole('button', { name: 'Continue' }).click()
  await expect(publicPage.getByText('Meal choice is required.')).toBeVisible()
  await publicPage.getByLabel('Vegetarian').check()
  await publicPage.getByRole('button', { name: 'Continue' }).click()
  await publicPage.getByRole('button', { name: 'Continue' }).click()
  await expect(publicPage.getByLabel('Email address')).toHaveAttribute('required', '')
  await expect(publicPage.getByText('Email address is required.')).toBeVisible()
  await publicPage.getByLabel('Email address').fill('configured@example.com')
  await expect(publicPage.getByText('Email address is required.')).toHaveCount(0)
  await publicPage.getByRole('button', { name: 'Continue' }).click()
  await expect(publicPage.getByRole('heading', { name: 'Review your RSVP' })).toBeVisible()
  await expect(publicPage.getByText('Vegetarian')).toBeVisible()
  await expect(publicPage.getByText('Dietary requirements')).toHaveCount(0)
  await publicPage.close()

  await page.goto('/admin/rsvp-configuration')
  await page.getByRole('group', { name: 'Dietary requirements configuration' }).getByLabel('Enabled').check()
  const configuredAccessibility = page.getByRole('group', { name: 'Accessibility support configuration' })
  await configuredAccessibility.getByLabel(/Helper text/).fill('')
  await configuredAccessibility.getByLabel('Question label').fill('Accessibility needs')
  await page.getByRole('group', { name: 'Email address configuration' }).getByLabel('Required').uncheck()
  await page.getByRole('group', { name: 'Meal choice configuration' }).getByLabel('Enabled').uncheck()
  const [restoreResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith('/api/admin/rsvp-configuration') && response.request().method() === 'PUT'),
    page.getByRole('button', { name: 'Save configuration' }).click(),
  ])
  expect(restoreResponse.status()).toBe(200)
  await page.reload()
  const [orderRestoreResponse] = await Promise.all([
    page.waitForResponse((response) => response.url().endsWith('/api/admin/rsvp-configuration') && response.request().method() === 'PUT'),
    (async () => {
      await page.getByRole('group', { name: 'Message to the couple configuration' }).getByRole('button', { name: 'Move Message to the couple down' }).click()
      await page.getByRole('button', { name: 'Save configuration' }).click()
    })(),
  ])
  expect(orderRestoreResponse.status()).toBe(200)
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

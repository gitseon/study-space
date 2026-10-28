import {test, expect} from '@playwright/test';

test('review answers in the backend note open and close under their question', async ({page}) => {
  await page.goto('pages/concepts.html?note=backend-concepts');
  const toggles = page.locator('details.answer');
  await expect(toggles).toHaveCount(29);
  const first = toggles.first();
  await expect(first).not.toHaveAttribute('open', '');
  await expect(first.locator('div')).toBeHidden();
  await first.locator('summary').click();
  await expect(first).toHaveAttribute('open', '');
  await expect(first.locator('div')).toContainText('/BE_01');
  await first.locator('summary').click();
  await expect(first.locator('div')).toBeHidden();
});

test('answer toggles fit a phone screen without horizontal scroll', async ({page}) => {
  await page.setViewportSize({width: 360, height: 800});
  await page.goto('pages/concepts.html?note=backend-concepts');
  await page.locator('details.answer summary').nth(3).click();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

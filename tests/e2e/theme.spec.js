import {test, expect} from '@playwright/test';

const paper = () => getComputedStyle(document.documentElement).backgroundColor;

test('the site follows the system theme until a choice is made', async ({page}) => {
  await page.emulateMedia({colorScheme: 'dark'});
  await page.goto('index.html');
  const html = page.locator('html');
  await expect(html).toHaveAttribute('data-theme-mode', 'system');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  expect(await page.evaluate(paper)).toBe('rgb(20, 24, 26)');
  await page.emulateMedia({colorScheme: 'light'});
  await expect(html).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(paper)).toBe('rgb(247, 246, 242)');
});

test('a dark or light choice is remembered across pages and beats the system setting', async ({page}) => {
  await page.goto('index.html');
  const html = page.locator('html');
  await expect(page.locator('#theme-select')).toHaveValue('system');
  await page.locator('#theme-select').selectOption('dark');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#14181a');

  for (const url of ['pages/sw-test.html?p=hunter', 'pages/concepts.html', 'pages/quiz.html?exam=subject-01&mode=study&topic=queue']) {
    await page.goto(url);
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await expect(page.locator('.site-header #theme-select')).toHaveValue('dark');
  }

  await page.locator('#theme-select').selectOption('light');
  await page.emulateMedia({colorScheme: 'dark'});
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(paper)).toBe('rgb(247, 246, 242)');
});

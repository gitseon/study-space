import {test, expect} from '@playwright/test';

const openPanel = async (page) => {
  if (await page.locator('#theme-panel').isHidden()) {
    await page.getByRole('button', {name: '테마', exact: true}).click();
  }
};
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
  await openPanel(page);
  await expect(page.locator('#theme-select')).toHaveValue('system');
  await page.locator('#theme-select').selectOption('dark');
  await expect(html).toHaveAttribute('data-theme', 'dark');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#14181a');

  for (const url of ['pages/sw-test.html?p=hunter', 'pages/concepts.html', 'pages/quiz.html?exam=subject-01&mode=study&topic=queue']) {
    await page.goto(url);
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await openPanel(page);
    await expect(page.locator('.site-header #theme-select')).toHaveValue('dark');
  }

  await openPanel(page);
  await page.locator('#theme-select').selectOption('light');
  await page.emulateMedia({colorScheme: 'dark'});
  await page.reload();
  await expect(html).toHaveAttribute('data-theme', 'light');
  expect(await page.evaluate(paper)).toBe('rgb(247, 246, 242)');
});

test('one 테마 button opens a panel with the theme and the colour palette choices', async ({page}) => {
  await page.goto('index.html');
  const html = page.locator('html');
  const panel = page.locator('#theme-panel');
  await expect(panel).toBeHidden();
  await openPanel(page);
  await expect(panel).toBeVisible();
  await expect(panel.locator('.theme-label')).toHaveText(['테마', '색상 계열']);
  await expect(page.locator('#palette-select option')).toHaveText(['현재', '블루 계열', '모노톤 계열']);
  await expect(html).toHaveAttribute('data-palette', 'default');
  expect(await page.evaluate(paper)).toBe('rgb(247, 246, 242)');

  await page.locator('#palette-select').selectOption('blue');
  await expect(html).toHaveAttribute('data-palette', 'blue');
  expect(await page.evaluate(paper)).toBe('rgb(244, 247, 251)');
  await page.locator('#palette-select').selectOption('mono');
  expect(await page.evaluate(paper)).toBe('rgb(245, 245, 245)');
  await page.locator('#theme-select').selectOption('dark');
  expect(await page.evaluate(paper)).toBe('rgb(18, 18, 18)');

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await openPanel(page);
  await page.locator('h1').first().click();
  await expect(panel).toBeHidden();

  await page.goto('pages/sw-test.html?p=hunter');
  await expect(html).toHaveAttribute('data-palette', 'mono');
  await openPanel(page);
  await expect(page.locator('#palette-select')).toHaveValue('mono');
});

test('Java code uses the Eclipse editor colours in every palette', async ({page}) => {
  await page.goto('pages/sw-test.html?p=hunter');
  const color = (selector) => page.locator('figure.snippet[data-lang="java"] ' + selector).first().evaluate((el) => getComputedStyle(el).color);
  expect(await color('.tok-k')).toBe('rgb(127, 0, 85)');
  expect(await color('.tok-c')).toBe('rgb(63, 127, 95)');
  await openPanel(page);
  await page.locator('#palette-select').selectOption('blue');
  expect(await color('.tok-k')).toBe('rgb(127, 0, 85)');
  await page.locator('#theme-select').selectOption('dark');
  expect(await color('.tok-k')).toBe('rgb(204, 120, 50)');
});

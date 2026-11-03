import {test, expect} from '@playwright/test';

test('the backend home lists note sections per topic and a link jumps to that section', async ({page}) => {
  await page.goto('index.html?track=backend');
  const study = page.locator('.topic-study');
  await expect(study).toHaveCount(1);
  await study.locator('summary').click();
  await expect(study.locator('li')).toHaveCount(9);
  await expect(study.locator('a')).toHaveCount(14);
  const link = study.locator('li', {hasText: 'JDBC와 DAO'}).locator('a');
  await expect(link).toHaveAttribute('href', /note=db-concepts&section=Part%2010/);
  await link.click();
  await expect(page).toHaveURL(/concepts\.html\?note=db-concepts&section=/);
  const heading = page.locator('.note h2', {hasText: 'Part 10. JDBC와 백엔드 연결'});
  await expect(heading).toBeVisible();
  await expect(heading).toBeInViewport();
});

test('tracks without study links show no extra row and an unknown section opens the note normally', async ({page}) => {
  await page.goto('index.html?track=frontend');
  await expect(page.locator('.topic-study')).toHaveCount(0);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('pages/concepts.html?note=db-concepts&section=' + encodeURIComponent('Part 99. 없음'));
  await expect(page.locator('.note h2').first()).toBeVisible();
  expect(errors).toEqual([]);
});

test('study mode and the review show the links of the question topic while a timed exam run hides them', async ({page}) => {
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  const links = page.locator('.study-links a');
  await expect(links).toHaveCount(1);
  await expect(links.first()).toContainText('Backend 개념 · Part 2. Servlet 기초');
  await expect(links.first()).toHaveAttribute('href', /^concepts\.html\?note=backend-concepts&section=/);
  await page.locator('.question-nav button').nth(10).click();
  await expect(page.locator('.study-links a')).toHaveCount(2);

  await page.goto('pages/quiz.html?exam=backend-01&mode=exam&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  await expect(page.locator('.study-links')).toHaveCount(0);
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', {name: '제출하고 채점하기', exact: true}).click();
  await expect(page).toHaveURL(/review\.html/);
  await expect(page.locator('.study-links a')).toHaveCount(1);
  await expect(page.locator('.study-links a').first()).toHaveAttribute('href', /^concepts\.html\?note=backend-concepts/);
});

test('other tracks keep their quiz screen without a note row', async ({page}) => {
  await page.goto('pages/quiz.html?exam=subject-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  await expect(page.locator('.study-links')).toHaveCount(0);
});

test('the SQLD note opens from its track, has ten parts and a section link reaches the right heading', async ({page}) => {
  await page.goto('index.html?track=sqld');
  const card = page.getByRole('link', {name: /^SQLD 개념/});
  await expect(card).toHaveAttribute('href', /note=sqld-concepts/);
  await card.click();
  await expect(page.locator('.note h2')).toHaveCount(10);
  await expect(page.locator('.note figure.snippet.window').first()).toBeVisible();
  const section = 'Part 7. Top N, 계층 질의, 셀프 조인';
  await page.goto('pages/concepts.html?note=sqld-concepts&section=' + encodeURIComponent(section));
  const heading = page.locator('.note h2', {hasText: section});
  await expect(heading).toBeInViewport();
});

test('the SQLD note fits a phone screen and its answer toggles open', async ({page}) => {
  await page.setViewportSize({width: 360, height: 780});
  await page.goto('pages/concepts.html?note=sqld-concepts');
  await expect(page.locator('.note h2').first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const toggles = page.locator('.note details.answer');
  expect(await toggles.count()).toBe(30);
  await toggles.first().locator('summary').click();
  await expect(toggles.first()).toHaveJSProperty('open', true);
});

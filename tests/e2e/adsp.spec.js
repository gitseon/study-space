import {test, expect} from '@playwright/test';

const track = (page) => page.getByRole('group', {name: '과목'});

test('the ADsP track shows its exam card and eleven topics without a concept note', async ({page}) => {
  await page.goto('index.html');
  await track(page).getByRole('button', {name: /^ADsP/}).click();
  await expect(page).toHaveURL(/track=adsp/);
  await expect(page.locator('#mode-adsp-01')).toBeVisible();
  await expect(page.locator('#mode-subject-01')).toHaveCount(0);
  await expect(page.locator('.hero-stats')).toHaveText(/50문항\s*1회차\s*11핵심 주제/);
  await expect(page.locator('.topic-links a')).toHaveCount(11);
  await expect(page.getByRole('link', {name: /개념$/})).toHaveCount(0);
});

test('ADsP topic practice only contains the chosen topic', async ({page}) => {
  await page.goto('index.html?track=adsp');
  await page.locator('.topic-links a', {hasText: '분류 분석과 모형 평가'}).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  const info = await page.evaluate(() => {
    const attempt = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0];
    return {topics: [...new Set(attempt.snapshot.questions.flatMap((q) => q.topics))], count: attempt.snapshot.questions.length};
  });
  expect(info.topics).toEqual(['classify']);
  expect(info.count).toBe(5);
});

test('ADsP formulas render without errors and fit a phone screen', async ({page}) => {
  await page.setViewportSize({width: 360, height: 800});
  await page.goto('index.html?track=adsp');
  await page.locator('.topic-links a', {hasText: '확률 분포와 통계적 추론'}).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  await expect(page.locator('.katex').first()).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

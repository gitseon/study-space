import {test, expect} from '@playwright/test';

const track = (page) => page.getByRole('group', {name: '과목'});

test('the AI track shows written and practical cards, topics and its concept note', async ({page}) => {
  await page.goto('index.html');
  await track(page).getByRole('button', {name: /^AI 역량검사/}).click();
  await expect(page).toHaveURL(/track=ai/);
  await expect(page.locator('#mode-ai-written-01')).toBeVisible();
  await expect(page.locator('#mode-ai-practical-01')).toBeVisible();
  await expect(page.locator('#mode-subject-01')).toHaveCount(0);
  await expect(page.locator('.hero-stats')).toHaveText(/108문항\s*2회차\s*5핵심 주제/);
  await expect(page.locator('.topic-links a')).toHaveCount(5);
  await expect(page.getByRole('link', {name: /^AI 개념/})).toBeVisible();
  await expect(page.getByRole('link', {name: /^Web 개념/})).toHaveCount(0);
});

test('AI topic practice only contains the chosen topic', async ({page}) => {
  await page.goto('index.html?track=ai');
  await page.locator('.topic-links a', {hasText: '리소스 최적화'}).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  const info = await page.evaluate(() => {
    const attempt = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0];
    return {topics: [...new Set(attempt.snapshot.questions.flatMap((q) => q.topics))], count: attempt.snapshot.questions.length};
  });
  expect(info.topics).toEqual(['efficiency']);
  expect(info.count).toBe(16);
});

test('the AI concept note opens', async ({page}) => {
  await page.goto('index.html?track=ai');
  await page.getByRole('link', {name: /^AI 개념/}).click();
  await expect(page.locator('h1')).toContainText('AI 역량검사 개념 요약 노트');
});

test('practical questions ask for a Python answer and Python snippets fit a phone screen', async ({page}) => {
  await page.setViewportSize({width: 360, height: 800});
  await page.goto('index.html?track=ai');
  await page.locator('[data-start="ai-practical-01"]').click();
  await expect(page.locator('.question-panel')).toBeVisible();
  await expect(page.getByText('Python 답안')).toBeVisible();
  const blocks = page.locator('figure.snippet[data-lang="python"] pre');
  await expect(blocks.first()).toBeVisible();
  const widths = await blocks.evaluateAll((els) => els.map((el) => [el.scrollWidth, el.clientWidth]));
  for (const [scroll, client] of widths) {
    expect(scroll).toBeLessThanOrEqual(client);
  }
});

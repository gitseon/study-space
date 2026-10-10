import {test, expect} from '@playwright/test';

test('track tabs switch the exam cards and topic buttons', async ({page}) => {
  await page.goto('index.html');
  await expect(page.locator('#mode-subject-01')).toBeVisible();
  await expect(page.locator('#mode-frontend-01')).toHaveCount(0);

  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: '프론트엔드'}).click();
  await expect(page.locator('#mode-frontend-01')).toBeVisible();
  await expect(page.locator('#mode-subject-01')).toHaveCount(0);
  await expect(page.locator('.hero-stats')).toHaveText(/96문항\s*3회차\s*7핵심 주제/);
  const topics = page.locator('.topic-links a');
  await expect(topics).toHaveCount(7);
  await expect(topics.first()).toContainText('HTML 기본과 시맨틱 웹');
});

test('frontend topic practice only contains the chosen topic', async ({page}) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: '프론트엔드'}).click();
  await page.locator('.topic-links a', {hasText: '함수와 this 바인딩'}).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  const topics = await page.evaluate(() => {
    const attempt = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0];
    return [...new Set(attempt.snapshot.questions.flatMap((q) => q.topics))];
  });
  expect(topics).toEqual(['this']);
});

test('algorithm topic practice keeps working', async ({page}) => {
  await page.goto('index.html');
  await page.locator('.topic-links a', {hasText: '큐'}).first().click();
  await expect(page.locator('.question-panel')).toBeVisible();
  const topics = await page.evaluate(() => {
    const attempt = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0];
    return [...new Set(attempt.snapshot.questions.flatMap((q) => q.topics))];
  });
  expect(topics).toEqual(['queue']);
});

// QUESTION_AUTHORING.md section 7: snippets must fit a 360px screen without horizontal scrolling.
for (const examId of ['frontend-01', 'frontend-02', 'frontend-03']) {
  test(`${examId} snippets fit a 360px screen`, async ({page}) => {
    await page.setViewportSize({width: 360, height: 800});
    const response = await page.goto(`quiz.html?exam=${examId}&mode=study`);
    expect(response.ok()).toBe(true);
    const total = await page.locator('.question-nav button').count();
    expect(total).toBe(32);
    let snippets = 0;
    for (let i = 1; i <= total; i++) {
      await page.getByRole('button', {name: `${i}번 문항`, exact: true}).click();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `question ${i} page width`).toBe(true);
      const overflow = await page.locator('.snippet pre').evaluateAll((list) => list.filter((el) => el.scrollWidth > el.clientWidth + 1).length);
      expect(overflow, `question ${i} snippet overflow`).toBe(0);
      snippets += await page.locator('.snippet').count();
    }
    expect(snippets).toBeGreaterThan(5);
  });
}

test('snippets show a language label and escape markup', async ({page}) => {
  await page.goto('quiz.html?exam=frontend-01&mode=study');
  await page.getByRole('button', {name: '4번 문항', exact: true}).click();
  const snippet = page.locator('.snippet').first();
  await expect(snippet.locator('figcaption')).toHaveText('HTML');
  await expect(snippet.locator('pre')).toContainText('<h1>제목</h1>');
  await expect(snippet.locator('h1')).toHaveCount(0);
});

test('the Web concept button opens the note and the contents link jumps to a section', async ({page}) => {
  await page.goto('index.html?track=frontend');
  await page.getByRole('link', {name: /^Web 개념/}).click();
  await expect(page).toHaveURL(/concepts\.html/);
  await expect(page.getByRole('heading', {level: 1})).toContainText('Web 개념 요약 노트');
  await expect(page.locator('.note h2')).toHaveCount(8);
  await expect(page.locator('.note table').first()).toBeVisible();
  await page.getByRole('navigation', {name: '목차'}).getByRole('link', {name: /Part 6/}).click();
  await expect(page.getByRole('heading', {name: /Part 6/})).toBeInViewport();
  await page.getByRole('link', {name: '← 문제집'}).click();
  await expect(page).toHaveURL(/index\.html|study-space\/$/);
});

test('the concept note fits a 360px screen', async ({page}) => {
  await page.setViewportSize({width: 360, height: 800});
  await page.goto('concepts.html');
  await expect(page.locator('.note h2').first()).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const overflow = await page.locator('.note pre').evaluateAll((list) => list.filter((el) => el.scrollWidth > el.clientWidth + 1).length);
  expect(overflow).toBe(0);
  expect(await page.locator('body').innerText()).not.toContain('�');
});

test('both tracks are separate buttons on the main screen and the choice is remembered', async ({page}) => {
  await page.goto('index.html');
  const group = page.getByRole('group', {name: '과목'});
  await expect(group.getByRole('button')).toHaveCount(2);
  await expect(group.getByRole('button', {name: /^자료구조와 알고리즘/})).toHaveAttribute('aria-pressed', 'true');
  await expect(group.getByRole('button', {name: /프론트엔드 3회차 96문항/})).toHaveAttribute('aria-pressed', 'false');

  await group.getByRole('button', {name: /^프론트엔드/}).click();
  await expect(page).toHaveURL(/track=frontend/);
  await page.reload();
  await expect(page.locator('#mode-frontend-01')).toBeVisible();
  await page.goto('index.html?track=algorithm');
  await expect(page.locator('#mode-subject-01')).toBeVisible();
  await page.goto('index.html?track=nope');
  await expect(page.locator('#mode-subject-01')).toBeVisible();
});

test('the concept button follows the selected track and the algorithm one is a placeholder', async ({page}) => {
  await page.goto('index.html?track=algorithm');
  const group = page.getByRole('group', {name: '과목'});
  await expect(page.getByRole('link', {name: /^Web 개념/})).toHaveCount(0);
  const placeholder = page.getByRole('button', {name: /^자료구조 알고리즘 개념/});
  await expect(placeholder).toBeVisible();
  await expect(placeholder).toBeDisabled();

  await group.getByRole('button', {name: /^프론트엔드/}).click();
  await expect(page.getByRole('link', {name: /^Web 개념/})).toBeVisible();
  await expect(page.getByRole('button', {name: /^자료구조 알고리즘 개념/})).toHaveCount(0);
});

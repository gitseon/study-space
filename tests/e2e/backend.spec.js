import {test, expect} from '@playwright/test';

const openBackend = async (page) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^백엔드 · DB/}).click();
};

test('the backend track shows one integrated exam card and both notes inside the track', async ({page}) => {
  await openBackend(page);
  await expect(page).toHaveURL(/track=backend/);
  await expect(page.locator('#mode-backend-01')).toBeVisible();
  await expect(page.locator('#mode-subject-01')).toHaveCount(0);
  await expect(page.locator('.exam-card')).toHaveCount(1);
  const types = await page.locator('.exam-card .card-types').innerText();
  expect(types).toMatch(/객관식\s*21/);
  expect(types).toMatch(/단답형\s*9/);
  expect(types).toMatch(/서술형\s*2/);
  await expect(page.getByRole('link', {name: /^Backend 개념/})).toHaveAttribute('href', /note=backend-concepts/);
  await expect(page.getByRole('link', {name: /^DB 개념/})).toHaveAttribute('href', /note=db-concepts/);
  await expect(page.getByRole('link', {name: /^Backend 개념/})).toHaveCount(1);
});

test('other tracks do not offer the backend notes and the note pages keep their addresses', async ({page}) => {
  await page.goto('index.html?track=frontend');
  await expect(page.getByRole('link', {name: /^DB 개념/})).toHaveCount(0);
  await expect(page.getByRole('link', {name: /^Backend 개념/})).toHaveCount(0);
  await page.goto('pages/concepts.html?note=backend-concepts');
  await expect(page.locator('.note h1')).toContainText('Backend');
  await page.goto('pages/concepts.html?note=db-concepts');
  await expect(page.locator('.note h1')).toContainText('DB');
  await expect(page.locator('.note h2').first()).toContainText('Part 1');
});

test('exam mode is fixed at 60 minutes while study mode lets the learner choose', async ({page}) => {
  await openBackend(page);
  const time = page.locator('#time-backend-01');
  await page.locator('#mode-backend-01').selectOption({label: '모두 풀고 한 번에 채점'});
  await expect(time).toBeDisabled();
  await expect(time).toHaveValue('60');
  await page.locator('#mode-backend-01').selectOption({label: '한 문제씩 정답 확인'});
  await expect(time).toBeEnabled();
  await time.selectOption('0');
  await page.locator('#mode-backend-01').selectOption({label: '모두 풀고 한 번에 채점'});
  await expect(time).toHaveValue('60');
});

test('starting from the card and tampering with the address both give a 60 minute exam', async ({page}) => {
  await openBackend(page);
  await page.locator('#mode-backend-01').selectOption({label: '모두 풀고 한 번에 채점'});
  await page.getByRole('button', {name: '백엔드 · DB 1회 시작', exact: true}).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  const minutes = () => page.evaluate(() => {
    const attempts = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts;
    const a = attempts[attempts.length - 1];
    return Math.round((a.deadlineAt - a.startedAt) / 60000);
  });
  expect(await minutes()).toBe(60);
  await page.goto('pages/quiz.html?exam=backend-01&mode=exam&minutes=0&new=1');
  await expect(page.locator('.question-panel')).toBeVisible();
  expect(await minutes()).toBe(60);
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.question-panel')).toBeVisible();
  const study = await page.evaluate(() => {
    const attempts = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts;
    return attempts[attempts.length - 1].deadlineAt;
  });
  expect(study).toBeNull();
});

test('every topic practice set holds only backend questions of that topic', async ({page}) => {
  await openBackend(page);
  const links = page.locator('.topic-links a');
  await expect(links).toHaveCount(9);
  const hrefs = await links.evaluateAll((all) => all.map((a) => a.getAttribute('href')));
  const sizes = {};
  for (const href of hrefs) {
    await page.goto(href);
    await expect(page.locator('.question-panel')).toBeVisible();
    const found = await page.evaluate(() => {
      const attempts = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts;
      const attempt = attempts[attempts.length - 1];
      return {ids: attempt.snapshot.questions.map((q) => q.id), topics: [...new Set(attempt.snapshot.questions.flatMap((q) => q.topics))]};
    });
    const topic = new URL(href, 'http://x/').searchParams.get('topic');
    expect(found.topics, topic).toEqual([topic]);
    expect(found.ids.every((id) => id.startsWith('backend-01-')), topic).toBe(true);
    sizes[topic] = found.ids.length;
  }
  expect(sizes).toEqual({'web-servlet': 4, 'mvc-filter': 4, 'jsp-el': 3, 'state-session': 3, 'sql-select': 4,
    'sql-join-subquery': 4, 'db-schema': 4, 'db-tx-index': 3, jdbc: 3});
});

test('the first question renders a code block and four choices without script errors', async ({page}) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  await expect(page.locator('.question-panel pre').first()).toContainText('HelloServlet');
  expect(await page.locator('body').innerText()).not.toContain('�');
  expect(errors).toEqual([]);
});

test('all 32 questions fit a 360px phone screen without sideways page scrolling', async ({page}) => {
  await page.setViewportSize({width: 360, height: 780});
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  const navButtons = page.locator('.question-nav button');
  await expect(navButtons).toHaveCount(32);
  for (let i = 0; i < 32; i++) {
    await navButtons.nth(i).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'question ' + (i + 1)).toBeLessThanOrEqual(0);
  }
});

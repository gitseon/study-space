import {test, expect} from '@playwright/test';

const openBackend = async (page) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^백엔드 · DB/}).click();
};

test('the backend track shows the integrated exam cards and both notes inside the track', async ({page}) => {
  await openBackend(page);
  await expect(page).toHaveURL(/track=backend/);
  await expect(page.locator('#mode-backend-01')).toBeVisible();
  await expect(page.locator('#mode-backend-02')).toBeVisible();
  await expect(page.locator('#mode-backend-03')).toBeVisible();
  await expect(page.locator('#mode-subject-01')).toHaveCount(0);
  await expect(page.locator('.exam-card')).toHaveCount(3);
  for (const types of await page.locator('.exam-card .card-types').allInnerTexts()) {
    expect(types).toMatch(/객관식\s*21/);
    expect(types).toMatch(/단답형\s*9/);
    expect(types).toMatch(/서술형\s*2/);
  }
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

for (const id of ['backend-01', 'backend-02', 'backend-03']) {
  test('both grading modes let the learner choose the time limit with 60 minutes preselected in ' + id, async ({page}) => {
    await openBackend(page);
    const time = page.locator('#time-' + id);
    await expect(time).toBeEnabled();
    await expect(time).toHaveValue('60');
    await page.locator('#mode-' + id).selectOption({label: '모두 풀고 한 번에 채점'});
    await expect(time).toBeEnabled();
    await time.selectOption('90');
    await expect(time).toHaveValue('90');
    await page.locator('#mode-' + id).selectOption({label: '한 문제씩 정답 확인'});
    await expect(time).toBeEnabled();
    await expect(time).toHaveValue('90');
    await time.selectOption('0');
    await page.locator('#mode-' + id).selectOption({label: '모두 풀고 한 번에 채점'});
    await expect(time).toBeEnabled();
    await expect(time).toHaveValue('0');
  });
}

test('the chosen time limit applies when starting an exam-mode attempt from the card', async ({page}) => {
  await openBackend(page);
  await page.locator('#mode-backend-01').selectOption({label: '모두 풀고 한 번에 채점'});
  const minutes = () => page.evaluate(() => {
    const attempts = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts;
    const a = attempts[attempts.length - 1];
    return a.deadlineAt === null ? 0 : Math.round((a.deadlineAt - a.startedAt) / 60000);
  });
  await page.getByRole('button', {name: '백엔드 · DB 1회 시작', exact: true}).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  expect(await minutes()).toBe(60);
  await openBackend(page);
  await page.locator('#mode-backend-01').selectOption({label: '모두 풀고 한 번에 채점'});
  await page.locator('#time-backend-01').selectOption('90');
  await page.getByRole('button', {name: '백엔드 · DB 1회 시작', exact: true}).click();
  await expect(page.locator('.question-panel')).toBeVisible();
  expect(await minutes()).toBe(90);
  await page.goto('pages/quiz.html?exam=backend-01&mode=exam&minutes=0&new=1');
  await expect(page.locator('.question-panel')).toBeVisible();
  expect(await minutes()).toBe(0);
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
    expect(found.ids.every((id) => id.startsWith('backend-0')), topic).toBe(true);
    expect(new Set(found.ids.map((id) => id.slice(0, 10))), topic).toEqual(new Set(['backend-01', 'backend-02', 'backend-03']));
    sizes[topic] = found.ids.length;
  }
  expect(sizes).toEqual({'web-servlet': 12, 'mvc-filter': 11, 'jsp-el': 10, 'state-session': 9, 'sql-select': 12,
    'sql-join-subquery': 12, 'db-schema': 11, 'db-tx-index': 10, jdbc: 9});
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

for (const id of ['backend-01', 'backend-02', 'backend-03']) {
  test('all 32 questions of ' + id + ' fit a 360px phone screen without sideways page scrolling', async ({page}) => {
    await page.setViewportSize({width: 360, height: 780});
    await page.goto('pages/quiz.html?exam=' + id + '&mode=study&minutes=0&new=1');
    const navButtons = page.locator('.question-nav button');
    await expect(navButtons).toHaveCount(32);
    for (let i = 0; i < 32; i++) {
      await navButtons.nth(i).click();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, id + ' question ' + (i + 1)).toBeLessThanOrEqual(0);
    }
  });
}

test('the explanation of a SELECT question shows the result tables of its queries above the text', async ({page}) => {
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.question-panel')).toBeVisible();
  await page.locator('[data-nav="12"]').click();
  await expect(page.locator('.question-panel')).toContainText('LEFT JOIN');
  await page.locator('.question-panel input[type=radio], .question-panel .choice').first().click();
  await page.locator('#reveal').click();
  const tables = page.locator('.explanation .result-tables .rt');
  await expect(tables).toHaveCount(2);
  await expect(tables.nth(0)).toContainText('쿼리 A');
  await expect(tables.nth(0).locator('tbody tr')).toHaveCount(1);
  await expect(tables.nth(1).locator('tbody tr')).toHaveCount(3);
  await expect(tables.nth(1).locator('td.rt-null')).toHaveCount(2);
  const order = await page.evaluate(() => {
    const box = document.querySelector('.explanation .result-tables');
    return box.compareDocumentPosition(document.querySelector('.explanation .solution')) & Node.DOCUMENT_POSITION_FOLLOWING;
  });
  expect(order).toBeTruthy();
});

test('a question without a SELECT result has no result table', async ({page}) => {
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.question-panel')).toBeVisible();
  await page.locator('.question-panel input[type=radio], .question-panel .choice').first().click();
  await page.locator('#reveal').click();
  await expect(page.locator('.explanation')).toBeVisible();
  await expect(page.locator('.explanation .result-tables')).toHaveCount(0);
});

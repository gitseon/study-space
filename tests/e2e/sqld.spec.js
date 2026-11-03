import {test, expect} from '@playwright/test';

const openSqld = async (page) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^SQLD/}).click();
};

test('the SQLD track shows one draft exam card with its note and the nine topic practice sets', async ({page}) => {
  await openSqld(page);
  await expect(page).toHaveURL(/track=sqld/);
  await expect(page.locator('.exam-card')).toHaveCount(1);
  await expect(page.locator('.exam-card .pill.draft')).toHaveText('초안');
  await expect(page.locator('.draft-note')).toContainText('아직 검증하지 못한');
  const types = await page.locator('.exam-card .card-types').innerText();
  expect(types).toMatch(/객관식\s*50/);
  expect(types).not.toMatch(/단답형|서술형/);
  await expect(page.getByRole('link', {name: /^SQLD 개념/})).toHaveAttribute('href', /note=sqld-concepts/);
  await expect(page.locator('.topic-links a')).toHaveCount(9);
});

test('exam mode is fixed at 90 minutes and the time list is ordered', async ({page}) => {
  await openSqld(page);
  const time = page.locator('#time-sqld-01');
  await expect(time.locator('option')).toHaveText(['30분', '90분', '시간 제한 없음']);
  await page.locator('#mode-sqld-01').selectOption({label: '모두 풀고 한 번에 채점'});
  await expect(time).toBeDisabled();
  await expect(time).toHaveValue('90');
  await page.goto('pages/quiz.html?exam=sqld-01&mode=exam&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  const minutes = await page.evaluate(() => {
    const a = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0];
    return Math.round((a.deadlineAt - a.startedAt) / 60000);
  });
  expect(minutes).toBe(90);
});

test('the quiz warns that the draft is unverified and hides note links while the timed run is open', async ({page}) => {
  await page.goto('pages/quiz.html?exam=sqld-01&mode=exam&minutes=0&new=1');
  await expect(page.locator('.notice')).toContainText('정답 검증 전 초안');
  await expect(page.locator('.study-links')).toHaveCount(0);
  await page.goto('pages/quiz.html?exam=sqld-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.study-links a').first()).toContainText('SQLD 개념 · Part 1');
  await expect(page.locator('.study-links a').nth(1)).toContainText('DB 개념');
});

test('submitting a blank run shows 0 points, the subject cut-offs and a failing practice verdict', async ({page}) => {
  await page.goto('pages/quiz.html?exam=sqld-01&mode=exam&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', {name: '제출하고 채점하기', exact: true}).click();
  await expect(page).toHaveURL(/review\.html/);
  const result = page.getByRole('region', {name: 'SQLD 점수'});
  await expect(result).toContainText('0 / 100');
  await expect(result).toContainText('1과목 0 / 10');
  await expect(result).toContainText('과락 기준 4문항');
  await expect(result).toContainText('과락 기준 16문항');
  await expect(result.locator('.sqld-verdict')).toContainText('과락');
});

test('answering the whole first subject correctly and part of the second follows the pass rule', async ({page}) => {
  await page.goto('pages/quiz.html?exam=sqld-01&mode=exam&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  await page.evaluate(() => {
    const key = 'algorithm-notes:v1';
    const data = JSON.parse(localStorage.getItem(key));
    const a = data.attempts[0];
    const subject2 = new Set(['sql-basics', 'join', 'subquery-set', 'group-window', 'top-hierarchy', 'pivot-regex', 'management']);
    let second = 0;
    for (const q of a.snapshot.questions) {
      const right = subject2.has(q.group) ? ++second <= 26 : true;
      a.answers[q.id] = right ? q.correctChoiceId : q.choices.find((c) => c.id !== q.correctChoiceId).id;
    }
    localStorage.setItem(key, JSON.stringify(data));
  });
  await page.reload();
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', {name: '제출하고 채점하기', exact: true}).click();
  const result = page.getByRole('region', {name: 'SQLD 점수'});
  await expect(result).toContainText('72 / 100');
  await expect(result.locator('.sqld-verdict')).toContainText('합격 연습 기준을 충족');
});

test('topic practice and study mode report accuracy without a pass verdict', async ({page}) => {
  await page.goto('pages/quiz.html?exam=sqld-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  await expect(page.locator('.sqld-result')).toHaveCount(0);
});

test('all 50 questions fit a 360px phone screen', async ({page}) => {
  await page.setViewportSize({width: 360, height: 780});
  await page.goto('pages/quiz.html?exam=sqld-01&mode=study&minutes=0&new=1');
  const nav = page.locator('.question-nav button');
  await expect(nav).toHaveCount(50);
  for (let i = 0; i < 50; i++) {
    await nav.nth(i).click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, 'question ' + (i + 1)).toBeLessThanOrEqual(0);
  }
});

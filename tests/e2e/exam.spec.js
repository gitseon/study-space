import {test, expect} from '@playwright/test';

async function startSubject(page, mode) {
  await page.goto('index.html');
  await page.locator('#mode-subject-01').selectOption({label: mode});
  await page.locator('#time-subject-01').selectOption('0');
  await page.getByRole('button', {name: '과평 1회 시작', exact: true}).click();
  await expect(page.locator('.choice')).toHaveCount(4);
}

test('batch grading hides answers until submit and then counts results', async ({page}) => {
  await startSubject(page, '모두 풀고 한 번에 채점');
  await expect(page.locator('#reveal')).toHaveCount(0);
  await page.locator('.choice').first().click();
  await expect(page.locator('.explanation')).toHaveCount(0);
  await expect(page.locator('.correct-choice')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);

  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', {name: '제출하고 채점하기', exact: true}).click();
  await expect(page).toHaveURL(/review\.html/);
  const summary = page.getByRole('region', {name: '채점 결과'});
  await expect(summary).toContainText('정답');
  await expect(summary).toContainText('오답');
  await expect(summary.locator('.count').nth(2)).toContainText('31');
  await expect(page.locator('.explanation').first()).toBeVisible();
});

test('wrong-only review lists just the incorrect and unanswered questions', async ({page}) => {
  await startSubject(page, '모두 풀고 한 번에 채점');
  const correctIndex = await page.evaluate(() => {
    const attempt = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0];
    const q = attempt.snapshot.questions[0];
    return (attempt.choiceOrders[q.id] || q.choices.map((c) => c.id)).indexOf(q.correctChoiceId);
  });
  await page.locator('.choice').nth(correctIndex).click();
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', {name: '제출하고 채점하기', exact: true}).click();
  await page.getByRole('button', {name: /틀린 문제만 31/}).click();
  await expect(page.locator('.question-nav button')).toHaveCount(31);
  await expect(page.locator('.question-nav .is-correct')).toHaveCount(0);
  await expect(page).toHaveURL(/filter=wrong/);
  await page.reload();
  await expect(page.locator('.question-nav button')).toHaveCount(31);
});

test('per-question mode checks one answer at a time and locks it', async ({page}) => {
  await startSubject(page, '한 문제씩 정답 확인');
  await expect(page.locator('#reveal')).toBeDisabled();
  const wrongIndex = await page.evaluate(() => {
    const attempt = JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0];
    const q = attempt.snapshot.questions[0];
    const order = attempt.choiceOrders[q.id] || q.choices.map((c) => c.id);
    return order.findIndex((id) => id !== q.correctChoiceId);
  });
  await page.locator('.choice').nth(wrongIndex).click();
  await expect(page.locator('.explanation')).toHaveCount(0);
  await page.getByRole('button', {name: '정답 확인', exact: true}).click();
  await expect(page.locator('.explanation-heading')).toHaveText('오답입니다');
  await expect(page.locator('.wrong-choice')).toHaveCount(1);
  await expect(page.locator('.correct-choice')).toHaveCount(1);
  await expect(page.locator('input[name=choice]:not([disabled])')).toHaveCount(0);
  await expect(page.locator('.tally')).toContainText('오답 1');
  await expect(page.locator('.question-nav .is-wrong')).toHaveCount(1);
});

test('formulas are typeset and code keeps standard braces', async ({page}) => {
  await startSubject(page, '한 문제씩 정답 확인');
  await expect(page.locator('.question-panel .katex').first()).toBeVisible();
  await expect(page.locator('.choice .katex')).toHaveCount(4);
  await page.getByRole('button', {name: '2번 문항', exact: true}).click();
  await expect(page.locator('.prose pre')).toContainText('for (int j = 0; j < i; j++) {');
});

test('topic titles stay hidden until the explanation and diagrams are drawn', async ({page}) => {
  await startSubject(page, '한 문제씩 정답 확인');
  await page.getByRole('button', {name: '12번 문항', exact: true}).click();
  await expect(page.locator('.question-panel')).not.toContainText('무방향 그래프 차수의 합');
  await page.locator('.choice').first().click();
  await page.getByRole('button', {name: '정답 확인', exact: true}).click();
  await expect(page.locator('.topic-line')).toContainText('주제무방향 그래프 차수의 합');

  await page.getByRole('button', {name: '13번 문항', exact: true}).click();
  const graph = page.getByRole('img', {name: /무방향 그래프/});
  await expect(graph).toBeVisible();
  await expect(graph.locator('circle')).toHaveCount(5);

  await page.getByRole('button', {name: '7번 문항', exact: true}).click();
  await expect(page.locator('.prose code').first()).toHaveText('[A, B, C, D, E, -, -, F]');
  await expect(page.getByRole('img', {name: /D의 왼쪽 자식 F/})).toBeVisible();
});

test('monthly text is restored and revealing a solution is not a grade', async ({page}) => {
  await page.goto('quiz.html?exam=monthly-01&mode=study');
  await page.locator('textarea').fill('public class Solution {}');
  await page.reload();
  await expect(page.locator('textarea')).toHaveValue('public class Solution {}');
  await page.getByRole('button', {name: '해설 보기', exact: true}).click();
  await expect(page.locator('.rubric input:checked')).toHaveCount(0);
  await expect(page.locator('.explanation')).toBeVisible();
  await expect(page.locator('.tally')).toContainText('확인 전 3');
});

test('mobile layout and UTF-8 prose do not overflow', async ({page}) => {
  await page.setViewportSize({width: 360, height: 800});
  await page.goto('index.html');
  await expect(page.getByRole('heading', {name: '이해한 만큼, 풀어보기'})).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('body').innerText()).not.toContain('�');
  for (const url of ['quiz.html?exam=monthly-01&mode=study', 'quiz.html?exam=subject-01&mode=study']) {
    await page.goto(url);
    await expect(page.locator('.question-panel')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

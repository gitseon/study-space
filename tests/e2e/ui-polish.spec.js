import {test, expect} from '@playwright/test';

test('the time limit list runs from short to long with no limit last and keeps the exam length selected', async ({page}) => {
  await page.goto('index.html');
  const time = page.locator('#time-subject-01');
  await expect(time.locator('option')).toHaveText(['30분', '60분', '90분', '시간 제한 없음']);
  await expect(time).toHaveValue('60');
});

test('clicking the chosen choice again withdraws the answer until the answer is revealed', async ({page}) => {
  await page.goto('pages/quiz.html?exam=subject-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  await expect(page.locator('button', {hasText: '선택 해제'})).toHaveCount(0);
  await page.locator('.choice').nth(1).click();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
  await expect(page.locator('#reveal')).toBeEnabled();
  await page.locator('.choice').nth(1).click();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
  await expect(page.locator('#reveal')).toBeDisabled();
  const answers = await page.evaluate(() => JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0].answers);
  expect(answers).toEqual({});
  await page.locator('.choice').nth(1).click();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
  await page.locator('.choice').nth(2).click();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
  await expect(page.locator('.choice').nth(2).locator('input')).toBeChecked();
  await page.locator('#reveal').click();
  await expect(page.locator('.explanation')).toBeVisible();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
  await page.locator('.choice').nth(2).click({force: true});
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
});

test('the keyboard can choose, withdraw and move the answer with Space and the arrow keys', async ({page}) => {
  await page.goto('pages/quiz.html?exam=subject-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  await page.locator('.choice').first().locator('input').focus();
  await page.keyboard.press('Space');
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
  await expect(page.locator('.choice').first().locator('input')).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
  await expect(page.locator('.choice').first().locator('input')).toBeFocused();
  await page.keyboard.press('Space');
  await page.keyboard.press('ArrowDown');
  await expect(page.locator('.choice').nth(1).locator('input')).toBeChecked();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
});

test('a withdrawn answer counts as unanswered after submitting', async ({page}) => {
  await page.goto('pages/quiz.html?exam=subject-01&mode=exam&minutes=0&new=1');
  await page.locator('.choice').first().click();
  await page.locator('.choice').first().click();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', {name: '제출하고 채점하기', exact: true}).click();
  await expect(page).toHaveURL(/review\.html/);
  await expect(page.getByRole('region', {name: '채점 결과'}).locator('.count').nth(2)).toContainText('32');
});

test('withdrawing an answer keeps the erased marks of the other choices', async ({page}) => {
  await page.goto('pages/quiz.html?exam=subject-01&mode=exam&minutes=0&new=1');
  await page.getByRole('button', {name: '3번 선택지 지우기'}).click();
  await page.locator('.choice').nth(1).click();
  await page.locator('.choice').nth(1).click();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
  await expect(page.locator('.choice.erased')).toHaveCount(1);
  await expect(page.getByRole('button', {name: '3번 선택지 복원'})).toBeVisible();
});

test('the solution shows each labelled part on its own line', async ({page}) => {
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  await page.locator('.choice').first().click();
  await page.locator('#reveal').click();
  const lines = page.locator('.explanation .solution p');
  await expect(lines).toHaveCount(3);
  await expect(lines.nth(0).locator('strong')).toHaveText('정답 근거:');
  await expect(lines.nth(1).locator('strong')).toHaveText('풀이:');
  await expect(lines.nth(2).locator('strong')).toHaveText('흔한 실수:');
});

test('code blocks are dark windows with a language label and coloured SQL', async ({page}) => {
  await page.goto('pages/quiz.html?exam=backend-01&mode=study&minutes=0&new=1');
  const java = page.locator('figure.snippet.window[data-lang="java"]').first();
  await expect(java.locator('figcaption')).toHaveText('Java');
  expect(await java.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(25, 25, 28)');
  await page.locator('.question-nav button').nth(10).click();
  const sql = page.locator('figure.snippet.window[data-lang="sql"]').first();
  await expect(sql.locator('figcaption')).toHaveText('SQL');
  expect(await sql.locator('.tok-k').first().evaluate((el) => getComputedStyle(el).color)).toBe('rgb(198, 120, 221)');
  expect(await sql.locator('.tok-n').first().evaluate((el) => getComputedStyle(el).color)).toBe('rgb(209, 154, 102)');
  await page.evaluate(() => localStorage.setItem('study-space:theme', 'light'));
  await page.reload();
  await page.locator('.question-nav button').nth(10).click();
  const light = page.locator('figure.snippet.window[data-lang="sql"]').first();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
  expect(await light.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe('rgb(25, 25, 28)');
  expect(await light.locator('.tok-k').first().evaluate((el) => getComputedStyle(el).color)).toBe('rgb(198, 120, 221)');
});

test('concept notes show code windows too while the SW test page keeps its Eclipse colours', async ({page}) => {
  await page.goto('pages/concepts.html?note=db-concepts');
  await expect(page.locator('.note figure.snippet.window').first()).toBeVisible();
  expect(await page.locator('.note figure.snippet.window').count()).toBeGreaterThan(3);
  await page.goto('pages/sw-test.html?p=hunter');
  await expect(page.locator('figure.snippet[data-lang="java"]').first()).toBeVisible();
  await expect(page.locator('figure.snippet.window')).toHaveCount(0);
});

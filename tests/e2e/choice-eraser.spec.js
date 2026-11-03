import {test, expect} from '@playwright/test';

async function startSubject(page, mode = '모두 풀고 한 번에 채점') {
  await page.goto('index.html');
  await page.locator('#mode-subject-01').selectOption({label: mode});
  await page.locator('#time-subject-01').selectOption('0');
  await page.getByRole('button', {name: '과평 1회 시작', exact: true}).click();
  await expect(page.locator('.choice')).toHaveCount(4);
}

const attemptOf = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('algorithm-notes:v1')).attempts[0]);

test('the eraser is on by default and each button strikes or restores one choice without changing the answer', async ({page}) => {
  await startSubject(page);
  const toggle = page.getByRole('button', {name: /선택지 지우개/});
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.eraser-btn')).toHaveCount(4);
  await page.getByRole('button', {name: '2번 선택지 지우기'}).click();
  await expect(page.locator('.choice.erased')).toHaveCount(1);
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
  await expect(page.getByRole('button', {name: '2번 선택지 복원'})).toBeFocused();
  await page.getByRole('button', {name: '2번 선택지 복원'}).click();
  await expect(page.locator('.choice.erased')).toHaveCount(0);
  expect((await attemptOf(page)).answers).toEqual({});
});

test('choosing an erased choice clears its mark and erasing the chosen choice withdraws the answer', async ({page}) => {
  await startSubject(page);
  await page.getByRole('button', {name: '3번 선택지 지우기'}).click();
  await page.locator('.choice').nth(2).click();
  await expect(page.locator('.choice.erased')).toHaveCount(0);
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
  const eraser = page.getByRole('button', {name: '3번 선택지 지우기'});
  await expect(eraser).not.toHaveAttribute('aria-disabled', 'true');
  await eraser.click();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
  await expect(page.locator('.choice.erased')).toHaveCount(1);
  await expect(page.getByRole('button', {name: '3번 선택지 복원'})).toBeFocused();
  const attempt = await attemptOf(page);
  expect(attempt.answers).toEqual({});
  expect(Object.values(attempt.eliminatedChoices)).toEqual([[attempt.choiceOrders[Object.keys(attempt.eliminatedChoices)[0]][2]]]);
  await page.getByRole('button', {name: '3번 선택지 복원'}).click();
  await expect(page.locator('.choice.erased')).toHaveCount(0);
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(0);
});

test('erasing a choice other than the chosen one keeps the answer', async ({page}) => {
  await startSubject(page);
  await page.locator('.choice').nth(0).click();
  await page.getByRole('button', {name: '2번 선택지 지우기'}).click();
  await expect(page.locator('.choice.erased')).toHaveCount(1);
  await expect(page.locator('.choice').nth(0).locator('input')).toBeChecked();
});

test('turning the eraser off hides the buttons and styles, and turning it on again restores the marks', async ({page}) => {
  await startSubject(page);
  await page.getByRole('button', {name: '1번 선택지 지우기'}).click();
  await page.getByRole('button', {name: /선택지 지우개/}).click();
  await expect(page.getByRole('button', {name: /선택지 지우개/})).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.eraser-btn')).toHaveCount(0);
  await expect(page.locator('.choice.erased')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('button', {name: /선택지 지우개/})).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', {name: /선택지 지우개/}).click();
  await expect(page.locator('.choice.erased')).toHaveCount(1);
});

test('marks survive a reload and a new attempt starts empty with the last setting', async ({page}) => {
  await startSubject(page);
  await page.getByRole('button', {name: '4번 선택지 지우기'}).click();
  await page.reload();
  await expect(page.locator('.choice.erased')).toHaveCount(1);
  await page.getByRole('button', {name: /선택지 지우개/}).click();
  await page.goto('index.html');
  await page.locator('#mode-subject-01').selectOption({label: '모두 풀고 한 번에 채점'});
  await page.locator('#time-subject-01').selectOption('0');
  await page.goto('pages/quiz.html?exam=subject-01&new=1&minutes=0');
  await expect(page.locator('.choice')).toHaveCount(4);
  await expect(page.getByRole('button', {name: /선택지 지우개/})).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', {name: /선택지 지우개/}).click();
  await expect(page.locator('.choice.erased')).toHaveCount(0);
});

test('revealing the answer or submitting locks the marks and hides the strikethrough', async ({page}) => {
  await startSubject(page, '한 문제씩 정답 확인');
  await page.getByRole('button', {name: '1번 선택지 지우기'}).click();
  await page.locator('.choice').nth(1).click();
  await page.getByRole('button', {name: '정답 확인', exact: true}).click();
  await expect(page.locator('.explanation')).toBeVisible();
  await expect(page.locator('.eraser-btn')).toHaveCount(0);
  await expect(page.locator('.choice.erased')).toHaveCount(0);
});

test('submitting hides the tool in the review and keeps the stored marks out of scoring', async ({page}) => {
  await startSubject(page);
  await page.getByRole('button', {name: '2번 선택지 지우기'}).click();
  page.on('dialog', (d) => d.accept());
  await page.getByRole('button', {name: '제출하고 채점하기', exact: true}).click();
  await expect(page).toHaveURL(/review\.html/);
  await expect(page.locator('.eraser-btn')).toHaveCount(0);
  await expect(page.locator('#eraser-toggle')).toHaveCount(0);
  await expect(page.locator('.choice.erased')).toHaveCount(0);
});

test('keyboard users reach the buttons with Tab and operate them with Enter and Space', async ({page}) => {
  await startSubject(page);
  const button = page.getByRole('button', {name: '1번 선택지 지우기'});
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', {name: '1번 선택지 복원'})).toBeFocused();
  await page.keyboard.press('Space');
  await expect(page.getByRole('button', {name: '1번 선택지 지우기'})).toBeFocused();
  await expect(page.locator('.choice.erased')).toHaveCount(0);
});

test('buttons stay outside the labels, keep a 44px target and do not overflow a phone screen', async ({page}) => {
  await page.setViewportSize({width: 360, height: 780});
  await startSubject(page);
  await expect(page.locator('label.choice button')).toHaveCount(0);
  const box = await page.locator('.eraser-btn').first().boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

for (const id of ['subject-01', 'frontend-01', 'adsp-01', 'ai-written-01']) {
  test('the eraser is offered on the first choice question of ' + id, async ({page}) => {
    await page.goto('pages/quiz.html?exam=' + id + '&new=1&minutes=0');
    await expect(page.locator('.choice').first()).toBeVisible();
    await expect(page.locator('.eraser-tool')).toHaveCount(1);
    await expect(page.locator('.eraser-btn')).toHaveCount(4);
  });
}

test('short answer questions show no eraser', async ({page}) => {
  await page.goto('pages/quiz.html?exam=subject-01&new=1&minutes=0');
  await page.locator('.question-nav button').nth(21).click();
  await expect(page.locator('#answer')).toBeVisible();
  await expect(page.locator('.eraser-tool')).toHaveCount(0);
  await expect(page.locator('.eraser-btn')).toHaveCount(0);
});

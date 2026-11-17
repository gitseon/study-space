import {test, expect} from '@playwright/test';

test('a switched-off track has no button, no data and no direct entry', async ({page, request}) => {
  await page.goto('index.html');
  await expect(page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^SQLD/})).toHaveCount(0);
  await expect(page.getByRole('link', {name: /SQLD/})).toHaveCount(0);
  const manifest = await (await request.get('data/manifest.json')).json();
  expect(Object.keys(manifest.tracks)).not.toContain('sqld');
  expect((await request.get('data/sqld-01.json')).status()).toBe(404);
  expect((await request.get('data/sqld-concepts.md')).status()).toBe(404);
});

test('an old SQLD link falls back to the first track instead of breaking the home page', async ({page}) => {
  await page.goto('index.html?track=sqld');
  await expect(page.locator('.track-button.active')).toHaveCount(1);
  await expect(page.locator('.track-button.active')).not.toContainText('SQLD');
  await expect(page.locator('.exam-card').first()).toBeVisible();
});

test('opening the SQLD exam or note directly shows a way back', async ({page}) => {
  await page.goto('pages/quiz.html?exam=sqld-01&mode=exam');
  await expect(page.getByRole('link', {name: '문제집으로 돌아가기'})).toBeVisible();
  await page.goto('pages/concepts.html?note=sqld-concepts');
  await expect(page.getByRole('link', {name: /돌아가기|문제집/}).first()).toBeVisible();
});

test('the SW test page is hidden too: no home link, no data, no page', async ({page, request}) => {
  await page.goto('index.html');
  await expect(page.locator('a.sw-link[href*="sw-test"]')).toHaveCount(0);
  await expect(page.getByText('SW역량테스트')).toHaveCount(0);
  const manifest = await (await request.get('data/manifest.json')).json();
  expect(manifest.swTest).toBeUndefined();
  expect((await request.get('data/sw-test.json')).status()).toBe(404);
  expect((await request.get('pages/sw-test.html')).status()).toBe(404);
});

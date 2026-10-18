import {test, expect} from '@playwright/test';

const ORDER = ['나무의 키', '산악 구조 로봇', '헌터', '선수과목', '프로세서 연결하기', '지역구 나누기', '키 순서', '등산로 조성', '사과 먹기 게임', '풍선 사격 게임', '다리 건설'];

test('home button opens the contents list in prediction order', async ({page}) => {
  await page.goto('index.html');
  await page.getByRole('link', {name: /SW역량테스트/}).click();
  await expect(page).toHaveURL(/pages\/sw-test\.html$/);
  await expect(page.getByRole('heading', {name: 'SW역량테스트', level: 1})).toBeVisible();
  await expect(page.locator('.sw-card strong')).toHaveText(ORDER.map((name) => new RegExp('^' + name)));
  await expect(page.locator('.sw-disclaimer')).toContainText('보장하지 않습니다');
});

test('choosing a problem shows its idea and highlighted Java code, and the pager moves on', async ({page, baseURL}) => {
  const outside = [];
  page.on('request', (req) => {
    if (req.url().startsWith('http://127.0.0.1') && !req.url().startsWith(baseURL)) {
      outside.push(req.url());
    }
  });
  await page.goto('pages/sw-test.html');
  await page.locator('.sw-card', {hasText: '헌터'}).click();
  await expect(page).toHaveURL(/\?p=hunter$/);
  await expect(page.getByRole('heading', {name: '발상', level: 2})).toBeVisible();
  await expect(page.getByRole('heading', {name: '코드', level: 2})).toBeVisible();
  await expect(page.locator('figure.snippet[data-lang="java"] .tok-k').first()).toBeVisible();
  await expect(page.locator('figure.snippet code')).toContainText('mobCount++');
  await expect(page.locator('.sw-nav a.active')).toContainText('헌터');
  await page.getByRole('link', {name: /선수과목 →/}).click();
  await expect(page).toHaveURL(/\?p=prerequisite$/);
  await expect(page.getByRole('heading', {name: '선수과목', level: 1})).toBeVisible();
  await page.getByRole('link', {name: '전체 목차 보기'}).click();
  await expect(page.locator('.sw-card')).toHaveCount(ORDER.length);
  expect(outside).toEqual([]);
});

test('every problem page renders without script errors and an unknown id falls back to the list', async ({page}) => {
  const errors = [];
  page.on('pageerror', (err) => errors.push(err.message));
  await page.goto('pages/sw-test.html');
  const ids = await page.locator('.sw-card').evaluateAll((cards) => cards.map((a) => new URL(a.href).searchParams.get('p')));
  expect(ids).toHaveLength(ORDER.length);
  for (const id of ids) {
    await page.goto('pages/sw-test.html?p=' + id);
    await expect(page.locator('figure.snippet[data-lang="java"]')).toHaveCount(id === 'height-order' ? 2 : 1);
    await expect(page.locator('.sw-sections a')).toHaveCount(5);
  }
  await page.goto('pages/sw-test.html?p=missing');
  await expect(page.locator('.sw-card')).toHaveCount(ORDER.length);
  expect(errors).toEqual([]);
});

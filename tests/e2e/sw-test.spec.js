import {test, expect} from '@playwright/test';

const ORDER = ['나무 높이', '산악 구조 로봇(보급로)', '헌터', '선수과목', '프로세서 연결하기', '지역구 나누기', '키 순서', '등산로 조성', '사과 먹기 게임', '풍선 사격 게임', '다리 건설'];

test('home button opens the contents list in prediction order', async ({page}) => {
  await page.goto('index.html');
  await page.getByRole('link', {name: /SW역량테스트/}).click();
  await expect(page).toHaveURL(/pages\/sw-test\.html$/);
  await expect(page.getByRole('heading', {name: 'SW역량테스트', level: 1})).toBeVisible();
  await expect(page.locator('.sw-card strong')).toHaveText(ORDER.map((name) => new RegExp('^' + name.replace(/[()]/g, '\\$&'))));
  await expect(page.locator('.sw-disclaimer')).toContainText('보장하지 않음');
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
    await expect(page.locator('figure.snippet[data-lang="java"]')).toHaveCount(1);
    await expect(page.locator('.sw-nav a[href^="#"]')).toHaveCount(0);
    await expect(page.locator('.sw-toggle')).toHaveCount(id === 'height-order' ? 1 : 0);
  }
  await page.goto('pages/sw-test.html?p=missing');
  await expect(page.locator('.sw-card')).toHaveCount(ORDER.length);
  expect(errors).toEqual([]);
});

test('height order toggles between the BFS and Floyd-Warshall solutions and keeps the choice on reload', async ({page}) => {
  await page.goto('pages/sw-test.html?p=height-order');
  const bfs = page.getByRole('button', {name: 'BFS 풀이'});
  const floyd = page.getByRole('button', {name: '플로이드–워셜 풀이'});
  await expect(bfs).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('figure.snippet code')).toContainText('smallQ');
  await floyd.click();
  await expect(floyd).toHaveAttribute('aria-pressed', 'true');
  await expect(bfs).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('figure.snippet code')).toContainText('for (int via = 1; via <= N; via++)');
  await expect(page.locator('.sw-solution')).toContainText('경유 학생 via를 가장 바깥 반복문에 둡니다');
  await expect(page).toHaveURL(/\?p=height-order&v=floyd$/);
  await page.reload();
  await expect(page.getByRole('button', {name: '플로이드–워셜 풀이'})).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('figure.snippet code')).toContainText('reachable');
});

test('the mountain robot note is the 보급로 solution', async ({page}) => {
  await page.goto('pages/sw-test.html?p=mountain-robot');
  await expect(page.getByRole('heading', {name: /산악 구조 로봇\(보급로\)/, level: 1})).toBeVisible();
  await expect(page.locator('figure.snippet code')).toContainText('class 보급로');
  await expect(page.locator('figure.snippet code')).toContainText('PriorityQueue');
});

test('the contents list can be hidden and shown again, and the choice is remembered', async ({page}) => {
  await page.goto('pages/sw-test.html?p=hunter');
  const toggle = page.getByRole('button', {name: '목차 숨기기'});
  await expect(page.locator('#sw-nav')).toBeVisible();
  await toggle.click();
  await expect(page.locator('#sw-nav')).toBeHidden();
  await expect(page.getByRole('button', {name: '목차 보이기'})).toHaveAttribute('aria-expanded', 'false');
  await page.reload();
  await expect(page.locator('#sw-nav')).toBeHidden();
  await page.getByRole('button', {name: '목차 보이기'}).click();
  await expect(page.locator('#sw-nav')).toBeVisible();
});

test('the model code folds and unfolds beside a code box that indents by four spaces', async ({page}) => {
  await page.goto('pages/sw-test.html?p=hunter');
  const reference = page.locator('.sw-code-ref');
  await expect(reference).toBeVisible();
  await page.getByRole('button', {name: '코드 접기'}).click();
  await expect(reference).toBeHidden();
  await page.reload();
  await expect(reference).toBeHidden();
  await page.getByRole('button', {name: '코드 펼치기'}).click();
  await expect(reference).toBeVisible();

  const box = page.getByLabel('내 코드 입력');
  const side = await Promise.all([reference.boundingBox(), box.boundingBox()]);
  expect(side[1].x).toBeGreaterThan(side[0].x + side[0].width - 1);
  await box.click();
  await page.keyboard.type('void f() {');
  await page.keyboard.press('Enter');
  await page.keyboard.type('x = 1;');
  await page.keyboard.press('Enter');
  await page.keyboard.type('}');
  await page.keyboard.press('Tab');
  await expect(box).toHaveValue('void f() {\n    x = 1;\n}    ');
  await page.reload();
  await expect(page.getByLabel('내 코드 입력')).toHaveValue('void f() {\n    x = 1;\n}    ');
});

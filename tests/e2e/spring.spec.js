import {test, expect} from '@playwright/test';

const openSpring = async (page) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^Spring/}).click();
};

test('the Spring track shows three exam cards with 21, 9 and 2 questions and its note', async ({page}) => {
  await openSpring(page);
  await expect(page).toHaveURL(/track=spring/);
  await expect(page.locator('.exam-card')).toHaveCount(3);
  for (const id of ['spring-01', 'spring-02', 'spring-03']) {
    await expect(page.locator('#mode-' + id)).toBeVisible();
  }
  for (const types of await page.locator('.exam-card .card-types').allInnerTexts()) {
    expect(types).toMatch(/객관식\s*21/);
    expect(types).toMatch(/단답형\s*9/);
    expect(types).toMatch(/서술형\s*2/);
  }
  await expect(page.getByRole('link', {name: /^Spring 개념/})).toHaveAttribute('href', /note=spring-concepts/);
  await expect(page.locator('.exam-card .pill.draft')).toHaveCount(0);
  await expect(page.locator('.topic-links a')).toHaveCount(9);
});

test('the Spring note has fourteen parts and a topic link reaches its heading', async ({page}) => {
  await page.goto('pages/concepts.html?note=spring-concepts');
  await expect(page.locator('.note h2')).toHaveCount(14);
  await expect(page.locator('.note figure.snippet').first()).toBeVisible();
  const section = 'Part 9. Service와 트랜잭션';
  await page.goto('pages/concepts.html?note=spring-concepts&section=' + encodeURIComponent(section));
  await expect(page.locator('.note h2', {hasText: section})).toBeInViewport();
});

test('the Spring note fits a phone screen and its answers toggle open', async ({page}) => {
  await page.setViewportSize({width: 360, height: 780});
  await page.goto('pages/concepts.html?note=spring-concepts');
  await expect(page.locator('.note h2').first()).toBeVisible();
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  const toggles = page.locator('.note details.answer');
  expect(await toggles.count()).toBeGreaterThan(30);
  await toggles.first().locator('summary').click();
  await expect(toggles.first()).toHaveAttribute('open', '');
});

test('the first question renders code and four choices without script errors', async ({page}) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('pages/quiz.html?exam=spring-01&mode=study&minutes=0&new=1');
  await expect(page.locator('.choice')).toHaveCount(4);
  expect(await page.locator('body').innerText()).not.toContain('�');
  expect(errors).toEqual([]);
});

for (const id of ['spring-01', 'spring-02', 'spring-03']) {
  test(`all 32 questions of ${id} fit a 360px phone screen without sideways page scrolling`, async ({page}) => {
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

test('every topic practice set holds only Spring questions of that topic', async ({page}) => {
  await openSpring(page);
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
    expect(found.ids.every((id) => id.startsWith('spring-0')), topic).toBe(true);
    expect(new Set(found.ids.map((id) => id.slice(0, 9))), topic).toEqual(new Set(['spring-01', 'spring-02', 'spring-03']));
    sizes[topic] = found.ids.length;
  }
  // Each topic holds its multiple choice and short answer questions plus the essays assigned to it.
  expect(sizes).toEqual({'foundation-boot': 9, 'di-bean': 13, 'aop-proxy': 9, 'mvc-binding': 13, 'web-crosscut': 6,
    'mybatis': 13, 'service-tx': 10, 'rest-api': 10, 'security': 13});
});

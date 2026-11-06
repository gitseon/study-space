import {test, expect} from '@playwright/test';

const GEAR = '/pages/project.html?project=web-01&stage=1&minutes=120';

async function start(page, {stage = 1, minutes = 120, project = 'web-01'} = {}) {
  await page.goto(`pages/project.html?project=${project}&stage=${stage}&minutes=${minutes}`);
  await page.getByRole('button', {name: '시작하기'}).click();
  await expect(page.getByTestId('project-editor')).toBeVisible();
}

test('the start screen shows the fixed environment lines, three stages and the duration options', async ({page}) => {
  await page.goto('pages/project.html');
  const env = page.locator('#pj-env p');
  await expect(env).toHaveCount(2);
  await expect(env.nth(0)).toHaveText('실행 환경: OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11');
  await expect(env.nth(1)).toHaveText('자동완성 기능을 제공하지 않으니 Spring Tools for Eclipse 사용을 권장합니다.');
  await expect(page.locator('input[name="project"]')).toHaveCount(2);
  await expect(page.locator('input[name="stage"]')).toHaveCount(3);
  await expect(page.locator('input[name="minutes"]')).toHaveCount(3);
  await expect(page.locator('input[name="minutes"]:checked')).toHaveValue('120');
  await expect(page.getByText('시간 제한 없음')).toBeVisible();
});

test('an invalid minutes value falls back to 120 with a notice', async ({page}) => {
  await page.goto('pages/project.html?minutes=45');
  await expect(page.locator('input[name="minutes"]:checked')).toHaveValue('120');
  await expect(page.getByText('주소의 시간 값이 올바르지 않아 120분으로 안내합니다.')).toBeVisible();
});

test('browsing the template creates no attempt and keeps the code read-only', async ({page}) => {
  await page.goto('pages/project.html?project=web-01&stage=2');
  await page.getByRole('button', {name: '템플릿 둘러보기'}).click();
  await expect(page.locator('#pj-timer')).toContainText('시간 기록 없음');
  await expect(page.locator('.pe-input')).toBeHidden();
  await expect(page.locator('#pj-mode-write')).toBeDisabled();
  await page.goto('pages/project.html');
  await expect(page.getByText('저장된 응시가 없습니다.')).toBeVisible();
});

test('typing is saved, survives a reload and shows saved only after the write finishes', async ({page}) => {
  await start(page, {stage: 1});
  await expect(page.locator('#pj-timer')).toContainText('남은 시간 1:59:');
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  const input = page.locator('.pe-input');
  await expect(input).toBeVisible();
  await input.click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type('\n// my-marker 한글');
  await expect(page.locator('#pj-save')).toHaveText('저장됨', {timeout: 5000});
  const url = page.url();
  await page.reload();
  await expect(page).toHaveURL(url);
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await expect(page.locator('.pe-input')).toHaveValue(/my-marker 한글/);
});

test('files provided by the template are read-only and a stage 1 file shows its blanks', async ({page}) => {
  await start(page, {stage: 1});
  await page.locator('#pj-tree').getByRole('button', {name: /Gear\.java/}).click();
  await expect(page.locator('.pe-badge')).toHaveText('제공 파일 · 읽기 전용');
  await expect(page.locator('.pe-input')).toBeHidden();
  await page.locator('#pj-tree').getByRole('button', {name: /GearDaoImpl\.java/}).click();
  await expect(page.locator('.pe-input')).toHaveValue(/____/);
});

const ENV = '실행 환경: OpenJDK25U-jdk hotspot 25.0.3_9, Apache tomcat-11.0.27, Dynamic web module version 6.0, mysql 8.4.11';
const EDITOR = '자동완성 기능을 제공하지 않으니 Spring Tools for Eclipse 사용을 권장합니다.';

const openBackendHome = async (page) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^백엔드 · DB/}).click();
};

test('selecting 월말평가 shows the two notices right under the heading and above the cards', async ({page}) => {
  await openBackendHome(page);
  await expect(page.locator('#project-env')).toHaveCount(0);
  await page.getByRole('group', {name: '평가 유형'}).getByRole('button', {name: '월말평가'}).click();
  const lines = page.locator('#project-env p');
  await expect(lines).toHaveCount(2);
  await expect(lines.nth(0)).toHaveText(ENV);
  await expect(lines.nth(1)).toHaveText(EDITOR);
  const order = await page.evaluate(() => {
    const heading = document.querySelector('.library .section-heading');
    return [heading.nextElementSibling?.id, document.querySelector('#project-env').nextElementSibling?.id];
  });
  expect(order).toEqual(['project-env', 'project-area']);
  await expect(page.locator('.project-card')).toHaveCount(2);
  await expect(page.locator('.exam-card:not(.project-card)')).toHaveCount(0);
  await page.getByRole('group', {name: '평가 유형'}).getByRole('button', {name: '전체'}).click();
  await expect(page.locator('#project-env')).toHaveCount(0);
  await expect(page.locator('.exam-card')).toHaveCount(3);
});

test('other tracks have no 월말평가 project tab', async ({page}) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^프론트엔드/}).click();
  await expect(page.getByRole('group', {name: '평가 유형'}).getByRole('button', {name: '월말평가'})).toHaveCount(0);
});

for (const width of [360, 390, 768, 1024, 1440]) {
  test(`the two notices stay readable without clipping at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await openBackendHome(page);
    await page.getByRole('group', {name: '평가 유형'}).getByRole('button', {name: '월말평가'}).click();
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - window.innerWidth,
      clipped: [...document.querySelectorAll('#project-env p')].map((p) => p.scrollWidth > p.clientWidth + 1),
      lines: [...document.querySelectorAll('#project-env p')].map((p) => Math.round(p.getBoundingClientRect().height / parseFloat(getComputedStyle(p).lineHeight))),
    }));
    expect(result.overflow).toBeLessThanOrEqual(0);
    expect(result.clipped).toEqual([false, false]);
    if (width >= 1440) expect(result.lines).toEqual([1, 1]);
  });
}

test('the flow summary switches between the overview and each feature', async ({page}) => {
  await openBackendHome(page);
  await page.getByRole('group', {name: '평가 유형'}).getByRole('button', {name: '월말평가'}).click();
  const tabs = page.getByRole('tablist', {name: '흐름 보기'}).getByRole('tab');
  await expect(tabs).toHaveCount(8);
  await expect(page.locator('#project-flow-body')).toContainText('JSP의 form이나 링크가 URL');
  await tabs.filter({hasText: '등록'}).click();
  await expect(page.locator('#project-flow-body')).toContainText('GearService.insert');
  await expect(tabs.filter({hasText: '등록'})).toHaveAttribute('aria-selected', 'true');
});

test('a project card opens the start screen with its stage and time', async ({page}) => {
  await openBackendHome(page);
  await page.getByRole('group', {name: '평가 유형'}).getByRole('button', {name: '월말평가'}).click();
  await page.locator('#pstage-web-02').selectOption('3');
  await page.locator('#ptime-web-02').selectOption('90');
  await page.getByRole('button', {name: /도서 관리 구현 시작/}).click();
  await expect(page).toHaveURL(/project=web-02&stage=3&minutes=90/);
  await expect(page.locator('input[name="stage"]:checked')).toHaveValue('3');
  await expect(page.locator('input[name="minutes"]:checked')).toHaveValue('90');
  await expect(page.locator('input[name="project"]:checked')).toHaveValue('web-02');
});

test('the book project works like the gear project and shows its own domain', async ({page}) => {
  await start(page, {project: 'web-02', stage: 2});
  await expect(page.locator('#pj-tree')).toContainText('BookController.java');
  await expect(page.locator('#pj-tree')).not.toContainText('Gear');
  await page.locator('#pj-tree').getByRole('button', {name: /BookDaoImpl\.java/}).click();
  await expect(page.locator('.pe-pathbar')).toContainText('BookDaoImpl.java');
});

test('the project zip downloads with a fixed name and no answers', async ({page}) => {
  await start(page, {stage: 2});
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#pj-zip').click()]);
  expect(download.suggestedFilename()).toBe('web-01-stage-2.zip');
  const path = await download.path();
  const {readFileSync} = await import('node:fs');
  const bytes = readFileSync(path);
  expect(bytes.subarray(0, 2).toString('latin1')).toBe('PK');
  const text = bytes.toString('latin1');
  expect(text).toContain('web-01-stage-2/pom.xml');
  expect(text).not.toContain('reference/');
  expect(text).not.toContain('review.json');
});

test('finishing locks the code, keeps check states across a reload and never grades', async ({page}) => {
  await start(page, {stage: 3, minutes: 0});
  await expect(page.locator('#pj-timer')).toContainText('경과');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#pj-finish').click();
  await expect(page.locator('#pj-timer')).toHaveText('작성 마침');
  await expect(page.locator('#pj-mode-write')).toBeDisabled();
  await expect(page.locator('#pj-sidebody')).toContainText('확인함 0/14');
  await expect(page.locator('#pj-sidebody')).toContainText('점수나 합격 판정은 없습니다');
  await page.locator('[data-act="check"][data-id="crd-list"][data-state="confirmed"]').click();
  await page.locator('[data-act="check"][data-id="crd-create"][data-state="needs-work"]').click();
  await expect(page.locator('#pj-sidebody')).toContainText('확인함 1/14');
  await expect(page.locator('#pj-save')).toHaveText('저장됨', {timeout: 5000});
  await page.reload();
  await page.getByRole('tab', {name: '점검'}).click();
  await expect(page.locator('[data-act="check"][data-id="crd-list"][data-state="confirmed"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-act="check"][data-id="crd-create"][data-state="needs-work"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#pj-sidebody')).toContainText('확인함 1/14');
});

test('the draft check reports possible gaps only and does not change the check states', async ({page}) => {
  await start(page, {stage: 2, minutes: 0});
  await page.getByRole('tab', {name: '점검'}).click();
  await page.locator('[data-act="draft-check"]').click();
  const items = page.locator('#pj-findings li');
  await expect(items).toHaveCount(20);
  await expect(items.first()).toContainText('가능성');
  await expect(page.locator('#pj-progress')).toContainText('확인함 0/14');
});

test('hints and the model answer are explicit and recorded as help', async ({page}) => {
  await start(page, {stage: 1, minutes: 0});
  await page.getByRole('tab', {name: '작성 대상'}).click();
  await page.locator('[data-act="hint"][data-target="ctrl-list"]').click();
  await expect(page.locator('.pj-hints').first()).toContainText('forward');
  await page.getByRole('tab', {name: '모범답안'}).click();
  await expect(page.locator('#pj-sidebody')).toContainText('다른 구현도 올바를 수 있습니다');
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('[data-act="open-ref"]').click();
  await expect(page.locator('.pj-ref')).toBeVisible();
  await page.getByRole('tab', {name: '점검'}).click();
  await expect(page.locator('#pj-sidebody')).toContainText('도움 사용: 힌트 1곳, 모범답안');
  await expect(page.locator('#pj-progress')).toContainText('확인함 0/14');
});

test('the timer expires, keeps the code, locks editing and continues as a new unlimited attempt', async ({page}) => {
  await page.clock.install();
  await start(page, {stage: 1, minutes: 90});
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await page.locator('.pe-input').click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type('\n// kept-before-deadline');
  await page.clock.runFor(1500);
  await expect(page.locator('#pj-save')).toHaveText('저장됨');
  const firstUrl = page.url();
  await page.clock.fastForward('01:31:00');
  await expect(page.locator('#pj-timer')).toHaveText('시간 종료');
  await expect(page.locator('.pe-input')).toBeHidden();
  await expect(page.getByText('시간이 종료되었습니다')).toBeVisible();
  await page.clock.runFor(1500);
  await expect(page.locator('#pj-save')).toHaveText('저장됨');
  await page.reload();
  await expect(page.locator('#pj-timer')).toHaveText('시간 종료');
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await expect(page.locator('.pe-view')).toContainText('kept-before-deadline');
  await page.locator('#pj-continue').click();
  await expect(page).not.toHaveURL(firstUrl);
  await expect(page.locator('#pj-timer')).toContainText('경과');
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await expect(page.locator('.pe-input')).toHaveValue(/kept-before-deadline/);
});

test('a second tab that saved first makes this tab report a conflict instead of overwriting', async ({context}) => {
  const a = await context.newPage();
  await a.goto('pages/project.html?project=web-01&stage=1&minutes=0');
  await a.getByRole('button', {name: '시작하기'}).click();
  await expect(a.locator('#pj-save')).toHaveText('저장됨', {timeout: 5000});
  const url = a.url();
  const b = await context.newPage();
  await b.goto(url);
  await expect(b.getByTestId('project-editor')).toBeVisible();
  await a.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await a.locator('.pe-input').click();
  await a.keyboard.press('Control+End');
  await a.keyboard.type('\n// tab-a');
  await expect(a.locator('#pj-save')).toHaveText('저장됨', {timeout: 5000});
  await b.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await b.locator('.pe-input').click();
  await b.keyboard.press('Control+End');
  await b.keyboard.type('\n// tab-b');
  await expect(b.locator('#pj-save')).toContainText('충돌', {timeout: 5000});
  await expect(b.locator('#pj-latest')).toBeVisible();
  await b.reload();
  await b.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  const stored = await b.locator('.pe-input').inputValue();
  expect(stored).toContain('tab-a');
  expect(stored).not.toContain('tab-b');
});

test('when the browser refuses the write the code stays on screen and a backup is offered', async ({page}) => {
  await page.addInitScript(() => {
    window.__failWrites = false;
    const original = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (window.__failWrites) throw new DOMException('quota', 'QuotaExceededError');
      return original.apply(this, args);
    };
  });
  await start(page, {stage: 1, minutes: 0});
  await expect(page.locator('#pj-save')).toHaveText('저장됨', {timeout: 5000});
  await page.evaluate(() => { window.__failWrites = true; });
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await page.locator('.pe-input').click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type('\n// not-saved');
  await expect(page.locator('#pj-save')).toContainText('저장되지 않음', {timeout: 5000});
  await expect(page.locator('#pj-save')).not.toHaveText('저장됨');
  await expect(page.locator('.pe-input')).toHaveValue(/not-saved/);
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#pj-backup').click()]);
  expect(download.suggestedFilename()).toMatch(/^project-attempt-.*\.json$/);
});

test('Esc then Tab leaves the editor while Tab alone indents', async ({page}) => {
  await start(page, {stage: 1, minutes: 0});
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  const input = page.locator('.pe-input');
  await input.click();
  await page.keyboard.press('Control+Home');
  const before = (await input.inputValue()).length;
  await page.keyboard.press('Tab');
  expect((await input.inputValue()).length).toBe(before + 4);
  await page.keyboard.press('Escape');
  await page.keyboard.press('Tab');
  await expect(input).not.toBeFocused();
});

for (const [width, layout] of [[1440, 'desktop'], [1024, 'tablet'], [768, 'tablet'], [390, 'mobile'], [360, 'mobile']]) {
  test(`the layout at ${width}px is ${layout} and never scrolls the page sideways`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await start(page, {stage: 2, minutes: 0});
    await expect(page.locator('#pj')).toHaveAttribute('data-layout', layout);
    const visible = await page.evaluate(() => ({
      files: getComputedStyle(document.querySelector('.pj-files')).display !== 'none',
      code: getComputedStyle(document.querySelector('.pj-code')).display !== 'none',
      side: getComputedStyle(document.querySelector('.pj-side')).display !== 'none',
      overflow: document.documentElement.scrollWidth - window.innerWidth,
    }));
    expect(visible.overflow).toBeLessThanOrEqual(0);
    expect(visible.code).toBe(true);
    expect(visible.files).toBe(layout !== 'mobile');
    expect(visible.side).toBe(layout === 'desktop');
  });
}

test('on a phone the code opens for reading without the keyboard and switches to writing on request', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await start(page, {stage: 1, minutes: 0});
  await expect(page.locator('.pe-input')).toBeHidden();
  await expect(page.locator('.pe-view')).toBeVisible();
  expect(await page.evaluate(() => document.activeElement?.tagName)).not.toBe('TEXTAREA');
  await page.getByRole('button', {name: '파일', exact: true}).click();
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await expect(page.locator('.pj-code')).toBeVisible();
  await expect(page.locator('.pe-pathbar')).toContainText('GearServiceImpl.java');
  await page.locator('#pj-mode-write').click();
  await expect(page.locator('.pe-input')).toBeVisible();
  await expect(page.locator('.pe-input')).toHaveValue(/class GearServiceImpl/);
  await page.locator('#pj-wrap').click();
  await expect(page.locator('.pe')).toHaveAttribute('data-wrap', 'on');
  const text = await page.locator('.pe-input').inputValue();
  await page.locator('#pj-mode-read').click();
  await page.locator('#pj-mode-write').click();
  expect(await page.locator('.pe-input').inputValue()).toBe(text);
});

test('rotating the viewport keeps the file, the text and the running timer', async ({page}) => {
  await page.setViewportSize({width: 844, height: 390});
  await start(page, {stage: 1, minutes: 90});
  await page.locator('#pj-tree').getByRole('button', {name: /GearServiceImpl\.java/}).click();
  await page.locator('.pe-input').click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type('\n// rotate-check');
  await page.setViewportSize({width: 390, height: 844});
  await expect(page.locator('#pj')).toHaveAttribute('data-layout', 'mobile');
  await expect(page.locator('#pj-timer')).toContainText('남은 시간');
  await page.locator('#pj-mode-write').click();
  await expect(page.locator('.pe-input')).toHaveValue(/rotate-check/);
  await expect(page.locator('.pe-pathbar')).toContainText('GearServiceImpl.java');
});

test('dark mode keeps the project page readable and inside the viewport', async ({page}) => {
  await page.emulateMedia({colorScheme: 'dark'});
  await page.goto('pages/project.html');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
  await page.getByRole('button', {name: '시작하기'}).click();
  await expect(page.getByTestId('project-editor')).toBeVisible();
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('.pe-body')).backgroundColor);
  expect(bg).not.toBe('rgb(244, 245, 240)');
});

const openMonthly = async (page) => {
  await page.goto('index.html');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^백엔드 · DB/}).click();
  await page.getByRole('group', {name: '평가 유형'}).getByRole('button', {name: '월말평가'}).click();
};

test('the home structure diagram opens a servlet skeleton without its method bodies', async ({page}) => {
  await openMonthly(page);
  const nodes = page.locator('#project-structure .st-node');
  await expect(nodes.first()).toBeVisible();
  expect(await nodes.count()).toBeGreaterThanOrEqual(15);
  await expect(page.locator('#project-structure .st-detail')).toContainText('상자나 화살표를 눌러');
  await page.locator('#project-structure [data-node="gearctl"]').click();
  const detail = page.locator('#project-structure .st-detail');
  await expect(detail).toContainText('GearController');
  await expect(detail).toContainText('@WebServlet("/gear")');
  await expect(detail).toContainText('작성 대상');
  await expect(detail).toContainText('private void list(');
  const text = await detail.innerText();
  expect(text).not.toContain('service.selectAll');
  expect(text).not.toContain('request.setAttribute');
  expect(text).not.toContain('response.sendError');
  await expect(page.locator('#project-structure [data-node="gearctl"]')).toHaveAttribute('aria-pressed', 'true');
});

test('arrows explain forward and redirect and link to both ends', async ({page}) => {
  await openMonthly(page);
  await page.locator('#project-structure [data-edge="e-redirect-list"]').click();
  const detail = page.locator('#project-structure .st-detail');
  await expect(detail).toContainText('새로고침해도 다시 등록되지 않습니다');
  await detail.locator('[data-node="list"]').click();
  await expect(detail).toContainText('gear/list.jsp');
  await expect(detail).toContainText('request 속성 list');
});

test('choosing a flow tab highlights only that path in the diagram', async ({page}) => {
  await openMonthly(page);
  await page.getByRole('tablist', {name: '흐름 보기'}).getByRole('tab', {name: '등록'}).click();
  await expect(page.locator('#project-structure [data-node="gearctl"]')).toHaveAttribute('data-dim', 'false');
  await expect(page.locator('#project-structure [data-node="regist"]')).toHaveAttribute('data-dim', 'false');
  await expect(page.locator('#project-structure [data-node="memberctl"]')).toHaveAttribute('data-dim', 'true');
  await expect(page.locator('#project-structure [data-edge="e-logout"]')).toHaveAttribute('data-dim', 'true');
  await page.getByRole('tablist', {name: '흐름 보기'}).getByRole('tab', {name: '전체 흐름'}).click();
  await expect(page.locator('#project-structure [data-node="memberctl"]')).toHaveAttribute('data-dim', 'false');
});

test('the diagram can be used with the keyboard', async ({page}) => {
  await openMonthly(page);
  const node = page.locator('#project-structure [data-node="session"]');
  await node.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#project-structure .st-detail')).toContainText('SessionFilter');
  await expect(page.locator('#project-structure [data-node="session"]')).toBeFocused();
});

for (const width of [360, 768, 1440]) {
  test(`the home diagram fits ${width}px without sideways scroll`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await openMonthly(page);
    await page.locator('#project-structure [data-node="dao"]').click();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    const clipped = await page.evaluate(() => [...document.querySelectorAll('#project-structure .st-node, #project-structure .st-edge')].filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1).length);
    expect(clipped).toBe(0);
  });
}

test('in the project screen a diagram box opens the real file in the editor', async ({page}) => {
  await start(page, {stage: 2, minutes: 0});
  await page.getByRole('tab', {name: '구조'}).click();
  await page.locator('#pj-sidebody [data-node="dao"]').click();
  await expect(page.locator('#pj-sidebody .st-detail')).toContainText('GearDaoImpl');
  await page.locator('#pj-sidebody [data-open]').click();
  await expect(page.locator('.pe-pathbar')).toContainText('GearDaoImpl.java');
  await page.getByRole('tab', {name: '요구사항'}).click();
  await page.getByRole('tab', {name: '구조'}).click();
  await expect(page.locator('#pj-sidebody [data-node="dao"]')).toHaveAttribute('aria-pressed', 'true');
});

test('the diagram shows only skeletons, never the answer, even for a stage 1 attempt', async ({page}) => {
  await start(page, {stage: 1, minutes: 0});
  await page.getByRole('tab', {name: '구조'}).click();
  for (const id of ['gearctl', 'service', 'dao', 'list', 'session', 'login']) {
    await page.locator(`#pj-sidebody [data-node="${id}"]`).click();
    const text = await page.locator('#pj-sidebody .st-detail').innerText();
    expect(text).not.toContain('pstmt.executeUpdate');
    expect(text).not.toContain('forward(request, response, "/gear/list.jsp")');
    expect(text).not.toContain('chain.doFilter(request, response)');
  }
});

test('the book project diagram uses its own class names', async ({page}) => {
  await start(page, {project: 'web-02', stage: 2, minutes: 0});
  await page.getByRole('tab', {name: '구조'}).click();
  await expect(page.locator('#pj-sidebody')).toContainText('BookController');
  await expect(page.locator('#pj-sidebody')).not.toContainText('Gear');
  await page.locator('#pj-sidebody [data-node="bookctl"]').click();
  await expect(page.locator('#pj-sidebody .st-detail')).toContainText('@WebServlet("/book")');
});

test('on a phone a diagram box opens the file and returns to the code', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await start(page, {stage: 2, minutes: 0});
  await page.getByRole('button', {name: '요구사항과 점검'}).click();
  await page.getByRole('tab', {name: '구조'}).click();
  await page.locator('#pj-sidebody [data-node="memberctl"]').click();
  await page.locator('#pj-sidebody [data-open]').click();
  await expect(page.locator('.pj-code')).toBeVisible();
  await expect(page.locator('.pe-pathbar')).toContainText('MemberController.java');
});

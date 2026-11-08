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
  await expect(tabs).toHaveCount(6);
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
  await expect(page.locator('#pj-sidebody')).toContainText('확인함 0/11');
  await expect(page.locator('#pj-sidebody')).toContainText('점수나 합격 판정은 없습니다');
  await page.locator('[data-act="check"][data-id="crd-list"][data-state="confirmed"]').click();
  await page.locator('[data-act="check"][data-id="crd-create"][data-state="needs-work"]').click();
  await expect(page.locator('#pj-sidebody')).toContainText('확인함 1/11');
  await expect(page.locator('#pj-save')).toHaveText('저장됨', {timeout: 5000});
  await page.reload();
  await page.getByRole('tab', {name: '점검'}).click();
  await expect(page.locator('[data-act="check"][data-id="crd-list"][data-state="confirmed"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-act="check"][data-id="crd-create"][data-state="needs-work"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#pj-sidebody')).toContainText('확인함 1/11');
});

test('the draft check reports possible gaps only and does not change the check states', async ({page}) => {
  await start(page, {stage: 2, minutes: 0});
  await page.getByRole('tab', {name: '점검'}).click();
  await page.locator('[data-act="draft-check"]').click();
  const items = page.locator('#pj-findings li');
  await expect(items).toHaveCount(16);
  await expect(items.first()).toContainText('가능성');
  await expect(page.locator('#pj-progress')).toContainText('확인함 0/11');
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
  await expect(page.locator('#pj-progress')).toContainText('확인함 0/11');
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
  await expect(page.locator('#project-structure [data-node="login"]')).toHaveAttribute('data-dim', 'true');
  await expect(page.locator('#project-structure [data-edge="e-logout"]')).toHaveAttribute('data-dim', 'true');
  await page.getByRole('tablist', {name: '흐름 보기'}).getByRole('tab', {name: '전체 흐름'}).click();
  await expect(page.locator('#project-structure [data-node="login"]')).toHaveAttribute('data-dim', 'false');
});

test('the diagram can be used with the keyboard', async ({page}) => {
  await openMonthly(page);
  const node = page.locator('#project-structure [data-node="gearctl"]');
  await node.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#project-structure .st-detail')).toContainText('GearController');
  await expect(page.locator('#project-structure [data-node="gearctl"]')).toBeFocused();
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
  for (const id of ['gearctl', 'service', 'dao', 'list', 'header', 'login']) {
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
  await page.locator('#pj-sidebody [data-node="gearctl"]').click();
  await page.locator('#pj-sidebody [data-open]').click();
  await expect(page.locator('.pj-code')).toBeVisible();
  await expect(page.locator('.pe-pathbar')).toContainText('GearController.java');
});

test('pressing the selected structure box again folds its detail back to the hint', async ({page}) => {
  await openMonthly(page);
  const box = page.locator('#project-structure [data-node="gearctl"].st-node');
  const detail = page.locator('#project-structure .st-detail');
  await box.click();
  await expect(detail).toContainText('GearController');
  await expect(box).toHaveAttribute('aria-pressed', 'true');
  await box.click();
  await expect(detail).toContainText('상자나 화살표를 눌러');
  await expect(box).toHaveAttribute('aria-pressed', 'false');
  const edge = page.locator('#project-structure [data-edge="e-redirect-list"]');
  await edge.click();
  await expect(detail).toContainText('→');
  await edge.click();
  await expect(detail).toContainText('상자나 화살표를 눌러');
  await box.click();
  await page.locator('#project-structure [data-node="service"].st-node').click();
  await expect(detail).toContainText('GearService');
});

test('the write-only toggle hides provided boxes and the write boxes carry a mark', async ({page}) => {
  await openMonthly(page);
  const nodes = page.locator('#project-structure .st-node');
  await expect(page.locator('#project-structure .st-node[data-write="true"] .st-write').first()).toBeVisible();
  const all = await nodes.count();
  const toggle = page.locator('#project-structure [data-writeonly]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  const writeOnly = await nodes.count();
  expect(writeOnly).toBeLessThan(all);
  expect(await page.locator('#project-structure .st-node[data-write="false"]').count()).toBe(0);
  await toggle.click();
  await expect(nodes).toHaveCount(all);
});

test('the architecture picture shows a summary on hover and jumps to the detail on click', async ({page}) => {
  await openMonthly(page);
  const box = page.locator('#project-structure [data-arch-node="gearctl"]');
  const tip = page.locator('#project-structure .ar-tip');
  await expect(box).toBeVisible();
  await box.hover();
  await expect(tip).toBeVisible();
  await expect(tip).toContainText('GearController');
  await expect(tip).toContainText('구현 필요');
  await page.mouse.move(0, 0);
  await expect(tip).toBeHidden();
  await box.click();
  const detail = page.locator('#project-structure .st-detail');
  await expect(detail).toContainText('@WebServlet("/gear")');
  await expect(page.locator('#project-structure [data-arch-node="gearctl"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(detail).toBeInViewport();
  await page.locator('#project-structure [data-arch-edge="e-gear-svc"]').click();
  await expect(detail).toContainText('GearController → GearService');
});

test('the architecture picture follows the write-only toggle', async ({page}) => {
  await openMonthly(page);
  const boxes = page.locator('#project-structure .ar-box');
  await expect(boxes.first()).toBeVisible();
  const all = await boxes.count();
  expect(all).toBeGreaterThanOrEqual(15);
  await page.locator('#project-structure [data-writeonly]').click();
  expect(await boxes.count()).toBeLessThan(all);
  expect(await page.locator('#project-structure .ar-box[data-write="false"]').count()).toBe(0);
});

test('the overview and the layer list fold and unfold on their own, and picking an overview box unfolds the layers', async ({page}) => {
  await openMonthly(page);
  const arch = page.locator('#project-structure [data-fold="arch"]');
  const layers = page.locator('#project-structure [data-fold="layers"]');
  const overviewBox = page.locator('#project-structure [data-arch-node="gearctl"]');
  const layerBox = page.locator('#project-structure .st-node').first();
  await expect(arch).toHaveAttribute('aria-expanded', 'true');
  await expect(layers).toHaveAttribute('aria-expanded', 'true');
  await expect(overviewBox).toBeVisible();
  await arch.click();
  await expect(arch).toHaveAttribute('aria-expanded', 'false');
  await expect(overviewBox).toBeHidden();
  await expect(layerBox).toBeVisible();
  await layers.click();
  await expect(layers).toHaveAttribute('aria-expanded', 'false');
  await expect(layerBox).toBeHidden();
  await arch.click();
  await expect(overviewBox).toBeVisible();
  await overviewBox.click();
  await expect(layers).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#project-structure .st-detail')).toContainText('@WebServlet("/gear")');
  await expect(page.locator('#project-structure .st-detail')).toBeInViewport();
});

test('on the home flow a model answer sits under the skeleton and both fold', async ({page}) => {
  await openMonthly(page);
  await page.locator('#project-structure [data-node="gearctl"].st-node').click();
  const detail = page.locator('#project-structure .st-detail');
  const skeleton = detail.locator('[data-fold="skeleton"]');
  const answer = detail.locator('[data-fold="reference"]');
  await expect(skeleton).toHaveAttribute('aria-expanded', 'true');
  await expect(answer).toHaveAttribute('aria-expanded', 'false');
  await expect(detail.locator('#st-sec-reference')).toBeHidden();
  const below = await page.evaluate(() => {
    const a = document.querySelector('#project-structure [data-fold="skeleton"]');
    const b = document.querySelector('#project-structure [data-fold="reference"]');
    return !!(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
  });
  expect(below).toBe(true);
  await answer.click();
  await expect(answer).toHaveAttribute('aria-expanded', 'true');
  const body = detail.locator('#st-sec-reference');
  await expect(body).toBeVisible();
  await expect(body).toContainText('int oneYear = 60 * 60 * 24 * 365;');
  await expect(body).toContainText('단위는 초');
  await skeleton.click();
  await expect(skeleton).toHaveAttribute('aria-expanded', 'false');
  await expect(detail.locator('#st-sec-skeleton')).toBeHidden();
  await expect(body).toBeVisible();
  await skeleton.click();
  await expect(detail.locator('#st-sec-skeleton')).toBeVisible();
  await page.locator('#project-structure [data-node="login"].st-node').click();
  await expect(page.locator('#project-structure .st-detail [data-fold="reference"]')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#project-structure .st-detail #st-sec-reference')).toContainText('remember-me');
  await page.locator('#project-structure [data-node="dbutil"].st-node').click();
  await expect(page.locator('#project-structure .st-detail [data-fold="reference"]')).toHaveCount(0);
  await expect(page.locator('#project-structure .st-detail [data-fold="skeleton"]')).toHaveCount(1);
});

test('inside the project screen the diagram folds but the model answer stays behind the help record', async ({page}) => {
  await start(page, {stage: 2, minutes: 0});
  await page.getByRole('tab', {name: '구조'}).click();
  await page.locator('#pj-sidebody [data-node="gearctl"]').click();
  await expect(page.locator('#pj-sidebody [data-fold="skeleton"]')).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#pj-sidebody [data-fold="reference"]')).toHaveCount(0);
  await expect(page.locator('#pj-sidebody .st-detail')).not.toContainText('oneYear');
  await page.locator('#pj-sidebody [data-fold="arch"]').click();
  await page.getByRole('tab', {name: '요구사항'}).click();
  await page.getByRole('tab', {name: '구조'}).click();
  await expect(page.locator('#pj-sidebody [data-fold="arch"]')).toHaveAttribute('aria-expanded', 'false');
});

test('the pair table of the flow note keeps its two columns apart', async ({page}) => {
  await openMonthly(page);
  await page.getByRole('tab', {name: '짝으로 기억할 것'}).click();
  const cell = page.locator('#project-flow-body td').first();
  await expect(cell).toBeVisible();
  const pad = await cell.evaluate((td) => {
    const s = getComputedStyle(td);
    return {left: parseFloat(s.paddingLeft), right: parseFloat(s.paddingRight), border: parseFloat(s.borderLeftWidth)};
  });
  expect(pad.left).toBeGreaterThanOrEqual(12);
  expect(pad.right).toBeGreaterThanOrEqual(16);
  expect(pad.border).toBeGreaterThan(0);
  const fills = await page.evaluate(() => {
    const table = document.querySelector('#project-flow-body table');
    return table.getBoundingClientRect().width >= table.parentElement.getBoundingClientRect().width - 2;
  });
  expect(fills).toBe(true);
});

const boxOf = (page, selector) => page.locator(selector).evaluate((el) => {
  const r = el.getBoundingClientRect();
  return {left: r.left, right: r.right, top: r.top, width: Math.round(r.width)};
});

test('the file toggle sits at the left of the top bar and folding the files keeps the code panel wide', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await start(page, {stage: 2, minutes: 0});
  const toggle = await boxOf(page, '#pj-toggle-files');
  const title = await boxOf(page, '.pj-top h1');
  const sideToggle = await boxOf(page, '#pj-toggle-side');
  expect(toggle.left).toBeLessThan(title.left);
  expect(sideToggle.left).toBeGreaterThan(title.right);
  const before = await boxOf(page, '.pj-code');
  await page.locator('#pj-toggle-files').click();
  await expect(page.locator('#pj-toggle-files')).toHaveText('파일 펼치기');
  await expect(page.locator('.pj-files')).toBeHidden();
  const folded = await boxOf(page, '.pj-code');
  expect(folded.width).toBeGreaterThan(before.width);
  expect(folded.width).toBeGreaterThan(500);
  expect(Math.abs((await boxOf(page, '.pj-side')).top - folded.top)).toBeLessThan(2);
  await page.locator('#pj-toggle-side').click();
  await expect(page.locator('.pj-side')).toBeHidden();
  expect((await boxOf(page, '.pj-code')).width).toBeGreaterThan(1300);
  await page.locator('#pj-toggle-files').click();
  await page.locator('#pj-toggle-side').click();
  await expect(page.locator('.pj-files')).toBeVisible();
  await expect(page.locator('.pj-side')).toBeVisible();
  expect((await boxOf(page, '.pj-code')).width).toBe(before.width);
});

for (const [width, expected] of [[1280, 461], [1440, 518], [1920, 600]]) {
  test(`the requirements panel starts wide enough to read the model answer at ${width}px`, async ({page}) => {
    await page.setViewportSize({width, height: 900});
    await start(page, {stage: 2, minutes: 0});
    const side = await boxOf(page, '.pj-side');
    expect(Math.abs(side.width - expected)).toBeLessThanOrEqual(2);
    expect(side.width).toBeGreaterThan(340);
    expect(Math.abs((await boxOf(page, '.pj-code')).top - side.top)).toBeLessThan(2);
  });
}

test('the requirements panel is resized by dragging and with the keyboard and the width is remembered', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  await start(page, {stage: 2, minutes: 0});
  const handle = page.locator('#pj-resizer');
  const sideWidth = async () => (await boxOf(page, '.pj-side')).width;
  const codeWidth = async () => (await boxOf(page, '.pj-code')).width;
  await expect(handle).toHaveAttribute('role', 'separator');
  const initial = await sideWidth();
  const box = await handle.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 - 120, box.y + 100, {steps: 5});
  await page.mouse.up();
  expect(Math.abs((await sideWidth()) - (initial + 120))).toBeLessThanOrEqual(3);
  await expect(handle).toHaveAttribute('aria-valuenow', String(await sideWidth()));
  const saved = await sideWidth();
  await page.reload();
  await expect(page.getByTestId('project-editor')).toBeVisible();
  expect(Math.abs((await sideWidth()) - saved)).toBeLessThanOrEqual(1);

  await handle.focus();
  await page.keyboard.press('ArrowLeft');
  expect(Math.abs((await sideWidth()) - (saved + 24))).toBeLessThanOrEqual(2);
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect(Math.abs((await sideWidth()) - (saved - 24))).toBeLessThanOrEqual(2);
  await page.keyboard.press('Home');
  expect(await sideWidth()).toBe(280);
  await expect(handle).toHaveAttribute('aria-valuemin', '280');
  await page.keyboard.press('End');
  expect(await codeWidth()).toBeGreaterThanOrEqual(318);
  expect(await sideWidth()).toBeGreaterThan(600);
  await page.keyboard.press('Enter');
  expect(Math.abs((await sideWidth()) - initial)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(() => localStorage.getItem('study-space:project-side-width'))).toBeNull();

  const again = await handle.boundingBox();
  await page.mouse.move(again.x + again.width / 2, again.y + 100);
  await page.mouse.down();
  await page.mouse.move(again.x + again.width / 2 + 800, again.y + 100, {steps: 4});
  await page.mouse.up();
  expect(await sideWidth()).toBe(280);
  await handle.dblclick();
  expect(Math.abs((await sideWidth()) - initial)).toBeLessThanOrEqual(2);
});

test('on a tablet and a phone there is no drag handle and nothing overflows sideways', async ({page}) => {
  await page.setViewportSize({width: 1024, height: 800});
  await start(page, {stage: 2, minutes: 0});
  await page.locator('#pj-toggle-side').click();
  await expect(page.locator('.pj-side')).toBeVisible();
  await expect(page.locator('#pj-resizer')).toBeHidden();
  expect((await boxOf(page, '.pj-side')).top).toBeGreaterThan((await boxOf(page, '.pj-code')).top + 100);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.setViewportSize({width: 390, height: 844});
  await expect(page.locator('#pj-resizer')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('the editor colours Java, JSP and XML like Eclipse in write mode and in read mode', async ({page}) => {
  await start(page, {stage: 2, minutes: 0});
  const style = (selector) => page.locator(selector).first().evaluate((el) => {
    const c = getComputedStyle(el);
    return [c.color, c.fontWeight, c.fontStyle];
  });
  await expect(page.locator('.pe-input')).toBeVisible();
  await expect(page.locator('.pe-hl .tok-k').first()).toBeVisible();
  expect(await style('.pe-hl .tok-k')).toEqual(['rgb(127, 0, 85)', '700', 'normal']);
  expect(await style('.pe-hl .tok-s')).toEqual(['rgb(42, 0, 255)', '400', 'normal']);
  expect(await style('.pe-hl .tok-a')).toEqual(['rgb(100, 100, 100)', '400', 'normal']);
  expect(await style('.pe-hl .tok-c')).toEqual(['rgb(63, 127, 95)', '400', 'normal']);
  const sameText = await page.evaluate(() => document.querySelector('.pe-hl code').textContent === `${document.querySelector('.pe-input').value}\n`);
  expect(sameText).toBe(true);
  const sameMetrics = await page.evaluate(() => {
    const a = getComputedStyle(document.querySelector('.pe-input'));
    const h = getComputedStyle(document.querySelector('.pe-hl'));
    return ['fontSize', 'lineHeight', 'paddingLeft', 'paddingTop', 'tabSize', 'whiteSpace'].every((k) => a[k] === h[k]);
  });
  expect(sameMetrics).toBe(true);

  await page.locator('.pe-input').click();
  await page.keyboard.press('Control+End');
  await page.keyboard.type('// my-note');
  await expect(page.locator('.pe-hl .tok-c', {hasText: 'my-note'})).toHaveCount(1);
  await page.locator('.pe-input').evaluate((el) => { el.scrollTop = 150; });
  await expect.poll(() => page.locator('.pe-hl').evaluate((el) => Math.round(el.scrollTop))).toBe(150);

  await page.locator('[data-file="src/main/webapp/login-form.jsp"]').click();
  expect(await style('.pe-hl .tok-t')).toEqual(['rgb(63, 127, 127)', '400', 'normal']);
  expect(await style('.pe-hl .tok-a')).toEqual(['rgb(127, 0, 127)', '400', 'normal']);
  expect(await style('.pe-hl .tok-s')).toEqual(['rgb(42, 0, 255)', '400', 'italic']);
  await page.locator('#pj-mode-read').click();
  await expect(page.locator('.pe-input')).toBeHidden();
  expect(await style('.pe-view .tok-t')).toEqual(['rgb(63, 127, 127)', '400', 'normal']);
  await page.locator('[data-file="pom.xml"]').click();
  expect(await style('.pe-view .tok-t')).toEqual(['rgb(63, 127, 127)', '400', 'normal']);
  await page.locator('[data-file="src/main/java/com/ssafy/sample/model/dao/GearDaoImpl.java"]').click();
  expect(await style('.pe-view .tok-k')).toEqual(['rgb(127, 0, 85)', '700', 'normal']);
});

test('the model answer lists only the files to write', async ({page}) => {
  await start(page, {stage: 1, minutes: 0});
  await page.getByRole('tab', {name: '모범답안'}).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('[data-act="open-ref"]').click();
  const select = page.locator('select[data-act="ref-file"]');
  await expect(select).toBeVisible();
  const paths = await select.locator('option').evaluateAll((options) => options.map((o) => o.value).sort());
  expect(paths).toEqual([
    'src/main/java/com/ssafy/sample/controller/GearController.java',
    'src/main/java/com/ssafy/sample/model/dao/GearDaoImpl.java',
    'src/main/java/com/ssafy/sample/model/service/GearServiceImpl.java',
    'src/main/webapp/gear/detail.jsp',
    'src/main/webapp/gear/list.jsp',
    'src/main/webapp/gear/regist.jsp',
    'src/main/webapp/header.jsp',
    'src/main/webapp/login-form.jsp',
  ]);
  await select.selectOption('src/main/webapp/login-form.jsp');
  await expect(page.locator('.pj-ref')).toContainText('remember-me');
});

test('each file remembers its own scroll position across file and mode changes', async ({page}) => {
  await start(page, {stage: 2, minutes: 0});
  const controller = 'src/main/java/com/ssafy/sample/controller/GearController.java';
  const dao = 'src/main/java/com/ssafy/sample/model/dao/GearDaoImpl.java';
  const helper = 'src/main/java/com/ssafy/sample/controller/ControllerHelper.java';
  const scrollOf = (selector) => page.locator(selector).evaluate((el) => Math.round(el.scrollTop));
  const open = (path) => page.locator(`[data-file="${path}"]`).click();
  await expect(page.locator('.pe-path-text')).toContainText('GearController.java');
  await page.locator('.pe-input').evaluate((el) => { el.scrollTop = 400; });
  await expect.poll(() => scrollOf('.pe-gutter')).toBe(400);

  await open(dao);
  await expect(page.locator('.pe-path-text')).toContainText('GearDaoImpl.java');
  expect(await scrollOf('.pe-input')).toBe(0);
  expect(await scrollOf('.pe-gutter')).toBe(0);
  expect(await scrollOf('.pe-hl')).toBe(0);
  await page.locator('.pe-input').evaluate((el) => { el.scrollTop = 120; });
  await expect.poll(() => scrollOf('.pe-gutter')).toBe(120);

  await open(controller);
  await expect(page.locator('.pe-path-text')).toContainText('GearController.java');
  expect(await scrollOf('.pe-input')).toBe(400);
  expect(await scrollOf('.pe-gutter')).toBe(400);
  expect(await scrollOf('.pe-hl')).toBe(400);
  await open(dao);
  expect(await scrollOf('.pe-input')).toBe(120);

  await page.locator('#pj-mode-read').click();
  await expect(page.locator('.pe-input')).toBeHidden();
  expect(await scrollOf('.pe-view')).toBe(120);
  await page.locator('.pe-view').evaluate((el) => { el.scrollTop = 150; });
  await open(helper);
  await expect(page.locator('.pe-path-text')).toContainText('ControllerHelper.java');
  expect(await scrollOf('.pe-view')).toBe(0);
  await page.locator('.pe-view').evaluate((el) => { el.scrollTop = 100; });
  await open(dao);
  await expect.poll(() => scrollOf('.pe-view')).toBe(150);
  await open(helper);
  await expect.poll(() => scrollOf('.pe-view')).toBe(100);
  await open(controller);
  await page.locator('#pj-mode-write').click();
  await expect(page.locator('.pe-input')).toBeVisible();
  expect(await scrollOf('.pe-input')).toBe(400);
});

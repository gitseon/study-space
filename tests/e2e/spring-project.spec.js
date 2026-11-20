import {readFile} from 'node:fs/promises';
import {test, expect} from '@playwright/test';
import {strFromU8, unzipSync} from 'fflate';

const LABEL = '자동 검증 완료 · STS 미검증';

async function start(page, {project = 'spring-web-01', stage = 1, minutes = 120} = {}) {
  await page.goto(`pages/project.html?track=spring&project=${project}&stage=${stage}&minutes=${minutes}`);
  await page.getByRole('button', {name: '시작하기'}).click();
  await expect(page.getByTestId('project-editor')).toBeVisible();
}

test('the Spring track has a 월말평가 tab with two project cards that show the verification state honestly', async ({page}) => {
  await page.goto('index.html?track=spring');
  await page.getByRole('button', {name: '월말평가', exact: true}).click();
  const cards = page.locator('.project-card');
  await expect(cards).toHaveCount(2);
  await expect(page.locator('.project-card .pill', {hasText: LABEL})).toHaveCount(2);
  await expect(page.locator('#project-env')).toContainText('Spring Boot 4.1.2');
  await expect(page.locator('#project-env')).toContainText('수업 환경과 같은지는 확인하지 못했습니다');
  await expect(page.locator('#project-env')).not.toContainText('Tomcat');
  await expect(page.locator('#project-env')).not.toContainText('Servlet');
  await expect(cards.first()).toContainText('스터디실 예약 관리');
  await expect(cards.nth(1)).toContainText('장비 대여 API');
});

test('the backend tab keeps its own environment lines and cards', async ({page}) => {
  await page.goto('index.html?track=backend');
  await page.getByRole('button', {name: '월말평가', exact: true}).click();
  await expect(page.locator('.project-card')).toHaveCount(2);
  await expect(page.locator('#project-env')).toContainText('Apache tomcat-11.0.27');
  await expect(page.locator('.project-card .pill', {hasText: '자동 검증'})).toHaveCount(0);
});

test('Spring 월말평가 downloads the Maven practice with starter and solution separated', async ({page}) => {
  await page.goto('index.html?track=spring');
  await page.getByRole('button', {name: '월말평가', exact: true}).click();
  const link = page.getByRole('link', {name: '연습 프로젝트 ZIP 내려받기'});
  const [download] = await Promise.all([page.waitForEvent('download'), link.click({timeout: 5000})]);
  expect(download.suggestedFilename()).toBe('spring-notice-practice.zip');
  const files = unzipSync(await readFile(await download.path()));
  const folder = 'spring-notice-practice';
  const dto = 'src/main/java/study/practice/notice/model/Notice.java';
  expect(files[`${folder}/README.md`]).toBeDefined();
  expect(files[`${folder}/starter/pom.xml`]).toBeDefined();
  expect(files[`${folder}/starter/src/test/java/study/practice/notice/NoticePracticeTests.java`]).toBeDefined();
  expect(strFromU8(files[`${folder}/starter/${dto}`])).toContain('TODO 1');
  expect(strFromU8(files[`${folder}/solution/${dto}`])).toContain('@Builder');
  expect(Object.keys(files).every((name) => name.startsWith(`${folder}/`) && !/\/(target|private)\/|\.pdf$/i.test(name))).toBe(true);
  await page.goto('index.html?track=backend');
  await page.getByRole('button', {name: '월말평가', exact: true}).click();
  await expect(link).toHaveCount(0);
});

test('switching between the two tracks never shows the other track cards', async ({page}) => {
  await page.goto('index.html?track=backend');
  await page.getByRole('button', {name: '월말평가', exact: true}).click();
  await expect(page.locator('.project-card').first()).toContainText('캠핑 용품 관리');
  await page.getByRole('group', {name: '과목'}).getByRole('button', {name: /^Spring/}).click();
  await page.getByRole('button', {name: '월말평가', exact: true}).click();
  await expect(page.locator('.project-card').first()).toContainText('스터디실 예약 관리');
  await expect(page.getByText('캠핑 용품 관리')).toHaveCount(0);
});

test('a Spring card opens the start screen with the track in the address', async ({page}) => {
  await page.goto('index.html?track=spring');
  await page.getByRole('button', {name: '월말평가', exact: true}).click();
  await page.locator('[data-project-start="spring-web-02"]').click();
  await expect(page).toHaveURL(/pages\/project\.html\?track=spring&project=spring-web-02&stage=1&minutes=120/);
  await expect(page.locator('input[name="project"]:checked')).toHaveValue('spring-web-02');
  await expect(page.locator('#pj-env')).toContainText('Spring Boot 4.1.2');
  await expect(page.locator('#pj-verify')).toContainText(LABEL);
  await expect(page.locator('.pj-lead').first()).toContainText('REST 프로젝트');
});

test('the start screen lists only the projects of its track and old links without a track still open backend', async ({page}) => {
  await page.goto('pages/project.html?track=spring');
  await expect(page.locator('input[name="project"]')).toHaveCount(2);
  await expect(page.locator('.pj-option', {hasText: '캠핑 용품 관리'})).toHaveCount(0);
  await page.goto('pages/project.html?project=web-02');
  await expect(page.locator('input[name="project"]:checked')).toHaveValue('web-02');
  await expect(page.locator('#pj-env')).toContainText('tomcat-11.0.27');
  await page.goto('pages/project.html?project=spring-web-01');
  await expect(page.locator('input[name="project"]:checked')).toHaveValue('spring-web-01');
});

test('a track that does not match the project is an error and never falls back to backend', async ({page}) => {
  await page.goto('pages/project.html?track=spring&project=web-01');
  await expect(page.getByText('서로 맞지 않습니다')).toBeVisible();
  await page.goto('pages/project.html?track=frontend');
  await expect(page.getByText('월말평가 프로젝트가 없습니다')).toBeVisible();
  await page.goto('pages/project.html?project=no-such-project');
  await expect(page.getByText('프로젝트를 찾을 수 없습니다')).toBeVisible();
});

test('a Spring attempt records its track and shows up only on its own start screen', async ({page}) => {
  await start(page);
  const stored = await page.evaluate(async () => {
    const open = indexedDB.open('study-space:project-attempts:v1');
    return new Promise((resolve) => {
      open.onsuccess = () => {
        const db = open.result;
        const request = db.transaction('attempts').objectStore('attempts').getAll();
        request.onsuccess = () => resolve(request.result.map((a) => ({track: a.track, projectId: a.projectId, snapshotTrack: a.projectSnapshot.track})));
      };
      open.onerror = () => resolve([]);
    });
  });
  expect(stored.length).toBeGreaterThan(0);
  expect(stored[0]).toEqual({track: 'spring', projectId: 'spring-web-01', snapshotTrack: 'spring'});
  await page.goto('pages/project.html?track=spring');
  await expect(page.getByText('1단계 · 120분 · 진행 중')).toBeVisible();
  await page.goto('pages/project.html');
  await expect(page.getByText('저장된 응시가 없습니다.')).toBeVisible();
});

test('the structure diagram follows the Spring layers and notes instead of the Servlet ones', async ({page}) => {
  await start(page, {stage: 2});
  await page.getByRole('tab', {name: '구조'}).click();
  const diagram = page.locator('#pj-sidebody');
  await expect(diagram).toContainText('ReservationController');
  await expect(diagram).toContainText('Mapper');
  await expect(diagram).not.toContainText('Servlet');
  await expect(diagram).not.toContainText('Filter');
});

test('the REST project diagram has a security layer in its main path and no view side', async ({page}) => {
  await start(page, {project: 'spring-web-02', stage: 2});
  await page.getByRole('tab', {name: '구조'}).click();
  const diagram = page.locator('#pj-sidebody');
  await expect(diagram).toContainText('SecurityFilterChain');
  await expect(diagram).toContainText('RentalApiController');
  await expect(diagram.locator('.ar-side')).toHaveCount(0);
});

test('the provided and write files are listed and the stage 3 template shows no reference code', async ({page}) => {
  await start(page, {stage: 3});
  await expect(page.locator('.pj-tree [data-file$="ReservationController.java"] .tag')).toHaveText('작성');
  await expect(page.locator('.pj-tree [data-file$="StudyRoomApplication.java"] .tag')).toHaveText('제공');
  await page.locator('.pj-tree [data-file$="ReservationController.java"]').click();
  const text = await page.getByTestId('project-editor').innerText();
  expect(text).toContain('study-target:ctrl-list:start');
  expect(text).not.toContain('service.search(roomId, keyword)');
});

for (const {project, domain, dto} of [
  {project: 'spring-web-01', domain: 'room', dto: 'Reservation'},
  {project: 'spring-web-02', domain: 'rental', dto: 'Rental'},
]) {
  test(`${project} shows the sample-style steps, editable DTO and provided JUnit`, async ({page}) => {
    await start(page, {project, stage: 3});
    const side = page.locator('#pj-sidebody');
    await page.getByRole('tab', {name: '요구사항'}).click();
    await expect(side.getByRole('heading', {name: 'STEP 1. DTO'})).toBeVisible();
    await expect(side.getByRole('heading', {name: /STEP 4\. 컨트롤러/})).toBeVisible();

    await page.getByRole('tab', {name: '구조'}).click();
    await expect(side.locator('.ar-box[data-arch-node="dto"]')).toHaveAttribute('data-write', 'true');
    await expect(side.locator('.ar-box[data-arch-node="tests"]')).toHaveAttribute('data-write', 'false');

    await expect(page.locator(`.pj-tree [data-file$="model/${dto}.java"] .tag`)).toHaveText('작성');
    await expect(page.locator('.pj-tree [data-file$="UnitTests.java"] .tag')).toHaveText('제공');
    const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#pj-zip').click()]);
    const files = unzipSync(await readFile(await download.path()));
    const root = `${project}-stage-3/src`;
    const template = strFromU8(files[`${root}/main/java/com/study/${domain}/model/${dto}.java`]);
    expect(template).toContain('study-target:dto-');
    expect(template).not.toContain('@Builder');
    expect(files[`${root}/test/java/com/study/${domain}/UnitTests.java`]).toBeDefined();
  });
}

test('the project zip downloads with the stage files and no answers', async ({page}) => {
  await start(page, {project: 'spring-web-02', stage: 3});
  const [download] = await Promise.all([page.waitForEvent('download'), page.locator('#pj-zip').click()]);
  expect(download.suggestedFilename()).toBe('spring-web-02-stage-3.zip');
});

for (const width of [360, 768, 1280]) {
  test(`the Spring project screen fits ${width}px without sideways scrolling`, async ({page}) => {
    await page.setViewportSize({width, height: 800});
    await page.goto('pages/project.html?track=spring');
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await page.getByRole('button', {name: '시작하기'}).click();
    await expect(page.getByTestId('project-editor')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  });
}

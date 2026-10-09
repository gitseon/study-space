// Runs the code shown in frontend questions (Node vm for JavaScript, Chromium for DOM and CSS) and
// compares the observed value with the declared answer. Usage: node scripts/verify_frontend_answers.mjs [--report path]
import {readFileSync, readdirSync, writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
import {format} from 'node:util';
import {chromium} from '@playwright/test';
import {checks as firstChecks} from './frontend_checks.mjs';
import {checks as laterChecks} from './frontend_checks_02_03.mjs';

const checks = {...firstChecks, ...laterChecks};

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const reportPath = process.argv.includes('--report') ? process.argv[process.argv.indexOf('--report') + 1] : 'reports/frontend-verification.json';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const plain = (text) => String(text).replaceAll('`', '').trim();

function codeBlocks(text) {
  return [...text.matchAll(/```(\w*)\n([\s\S]*?)```/g)].map((m) => ({lang: m[1], code: m[2].trimEnd()}));
}

async function runJs(code, wait = 80) {
  const logs = [];
  let error = null;
  const sandbox = {
    console: {log: (...args) => logs.push(format(...args))},
    setTimeout, clearTimeout, setInterval, clearInterval, Promise, JSON,
  };
  vm.createContext(sandbox);
  try {
    new vm.Script(code).runInContext(sandbox);
  } catch (err) {
    error = err?.name || 'Error';
  }
  await sleep(wait);
  return {logs, error};
}

const exams = readdirSync(resolve(root, 'data'))
  .filter((f) => /^frontend-\d+\.json$/.test(f))
  .map((f) => JSON.parse(readFileSync(resolve(root, 'data', f), 'utf8')));
const reviews = JSON.parse(readFileSync(resolve(root, 'source/frontend-reviews.json'), 'utf8'));
const browser = await chromium.launch();
const results = [];

for (const exam of exams) {
  for (const q of exam.questions) {
    const record = {questionId: q.id, revision: q.revision};
    const check = checks[q.id];
    const needsCheck = /```(js|css)\n/.test(q.stem);
    if (!check) {
      const review = reviews.find((r) => r.questionId === q.id && r.revision === q.revision);
      record.method = 'review';
      record.passed = !needsCheck && !!review;
      record.detail = needsCheck ? 'question has code but no executable check' : review ? review.note : 'no review record for this revision';
      results.push(record);
      continue;
    }
    record.method = 'executed';
    if (check.revision !== q.revision) {
      Object.assign(record, {passed: false, detail: `check is for revision ${check.revision}`});
      results.push(record);
      continue;
    }
    if (check.choice !== null) {
      const declared = plain(check.choice);
      const ok = q.type === 'mc'
        ? plain(q.choices.find((c) => c.id === q.correctChoiceId).text) === declared
        : q.acceptedAnswers.some((a) => plain(a) === declared);
      if (!ok) {
        Object.assign(record, {passed: false, detail: `declared choice "${declared}" is not the answer in the manuscript`});
        results.push(record);
        continue;
      }
    }
    const context = await browser.newContext();
    const page = await context.newPage();
    const ctx = {
      page, context, question: q, blocks: codeBlocks(q.stem), runJs,
      async runInPage(code) {
        const logs = [];
        page.on('console', (msg) => logs.push(msg.text()));
        await page.addScriptTag({content: code});
        await page.waitForTimeout(50);
        page.removeAllListeners('console');
        return logs;
      },
    };
    try {
      const actual = await check.run(ctx);
      Object.assign(record, {passed: actual === check.value, expected: check.value, actual});
    } catch (err) {
      Object.assign(record, {passed: false, detail: String(err.message).slice(0, 300)});
    }
    await context.close();
    results.push(record);
  }
}
await browser.close();

const target = resolve(root, reportPath);
mkdirSync(dirname(target), {recursive: true});
writeFileSync(target, JSON.stringify(results, null, 2));
const failed = results.filter((r) => !r.passed);
for (const r of failed) {
  console.log(JSON.stringify(r));
}
console.log(`Frontend answers: ${results.length - failed.length} passed / ${results.length} questions (${results.filter((r) => r.method === 'executed').length} executed)`);
process.exit(failed.length ? 1 : 0);

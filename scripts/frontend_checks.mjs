// Executable checks for frontend questions. Each entry runs the code shown in the question and compares the
// observed value with the answer the manuscript declares. `choice` must equal the correct choice text
// (or one accepted short answer), so a changed choice order or text invalidates the check.
// Questions without a check are listed in source/frontend-reviews.json as independent re-solves.

const page$ = async (ctx, html) => {
  await ctx.page.setContent(html);
  return ctx.page;
};

const display = (ctx, tags) =>
  ctx.page.evaluate((list) => list.filter((tag) => {
    const el = document.createElement(tag);
    document.body.append(el);
    const value = getComputedStyle(el).display;
    el.remove();
    return value === 'inline';
  }), tags);

export const checks = {
  'frontend-01-q01': {
    revision: 1, choice: '<span>', value: '<span>',
    async run(ctx) {
      return (await display(ctx, ['span', 'div', 'form', 'ul'])).map((t) => `<${t}>`).join(',');
    },
  },
  'frontend-01-q02': {
    revision: 1, choice: 'radio', value: 'radio',
    async run(ctx) {
      const found = await ctx.page.evaluate(() => ['radio', 'checkbox', 'text', 'submit'].filter((type) => {
        const [a, b] = [0, 1].map(() => Object.assign(document.createElement('input'), {type, name: 'g'}));
        document.body.append(a, b);
        a.click();
        b.click();
        const only = !a.checked && b.checked;
        a.remove();
        b.remove();
        return only;
      }));
      return found.join(',');
    },
  },
  'frontend-01-q04': {
    revision: 1, choice: 'h1 바로 뒤의 형제 p 하나', value: '1:첫 문단',
    async run(ctx) {
      const html = ctx.blocks.find((b) => b.lang === 'html').code;
      await page$(ctx, html);
      return ctx.page.evaluate(() => {
        const found = document.querySelectorAll('h1 + p');
        return found.length + ':' + found[0].textContent;
      });
    },
  },
  'frontend-01-q05': {
    revision: 1, choice: 'green', value: 'rgb(0, 128, 0)',
    async run(ctx) {
      const html = ctx.blocks.find((b) => b.lang === 'html').code;
      const css = ctx.blocks.find((b) => b.lang === 'css').code;
      await page$(ctx, `<style>${css}</style>${html}`);
      return ctx.page.evaluate(() => getComputedStyle(document.querySelector('p')).color);
    },
  },
  'frontend-01-q06': {
    revision: 1, choice: '170px', value: '170px',
    async run(ctx) {
      const css = ctx.blocks.find((b) => b.lang === 'css').code;
      await page$(ctx, `<style>${css}</style><div class="box"></div>`);
      return ctx.page.evaluate(() => {
        const el = document.querySelector('.box');
        const s = getComputedStyle(el);
        return (el.offsetWidth + parseFloat(s.marginLeft) + parseFloat(s.marginRight)) + 'px';
      });
    },
  },
  'frontend-01-q07': {
    revision: 1, choice: '30px', value: '30px',
    async run(ctx) {
      const css = ctx.blocks.find((b) => b.lang === 'css').code;
      await page$(ctx, `<style>${css}</style><div class="a">A</div><div class="b">B</div>`);
      return ctx.page.evaluate(() => {
        const a = document.querySelector('.a').getBoundingClientRect();
        const b = document.querySelector('.b').getBoundingClientRect();
        return (b.top - a.bottom) + 'px';
      });
    },
  },
  'frontend-01-q08': {
    revision: 1, choice: 'undefined 출력 후 ReferenceError', value: 'undefined|ReferenceError',
    async run(ctx) {
      const r = await ctx.runJs(ctx.blocks[0].code);
      return r.logs.join(',') + '|' + r.error;
    },
  },
  'frontend-01-q09': {
    revision: 1, choice: '[]', value: '[]',
    async run(ctx) {
      const r = await ctx.runJs('const c = { "[]": [], "0n": 0n, "NaN": NaN, "empty": "" };\nconsole.log(Object.keys(c).filter((k) => c[k]).join());');
      return r.logs[0];
    },
  },
  'frontend-01-q10': {
    revision: 1, choice: '1 3', value: '1 3',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs[0];
    },
  },
  'frontend-01-q11': {
    revision: 1, choice: '1-a-4-5', value: '1-a-4-5',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs[0];
    },
  },
  'frontend-01-q12': {
    revision: 1, choice: 'TypeError가 발생한다', value: 'TypeError',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).error;
    },
  },
  'frontend-01-q14': {
    revision: 1, choice: '13P2', value: '13P2',
    async run(ctx) {
      await page$(ctx, ctx.blocks.find((b) => b.lang === 'html').code);
      const logs = await ctx.runInPage(ctx.blocks.find((b) => b.lang === 'js').code);
      return logs[0];
    },
  },
  'frontend-01-q15': {
    revision: 1, choice: 'false true b c', value: 'false true b c',
    async run(ctx) {
      await page$(ctx, '');
      return (await ctx.runInPage(ctx.blocks[0].code))[0];
    },
  },
  'frontend-01-q16': {
    revision: 1, choice: 'setInterval은 반복되고 setTimeout은 한 번 실행된다', value: 'interval:3,timeout:1',
    async run(ctx) {
      const r = await ctx.runJs(`let i = 0;
let t = 0;
const id = setInterval(() => { i++; }, 10);
setTimeout(() => { t++; }, 10);
setTimeout(() => { clearInterval(id); console.log('interval:' + (i >= 3 ? 3 : i) + ',timeout:' + t); }, 55);`, 120);
      return r.logs[0];
    },
  },
  'frontend-01-q17': {
    revision: 1, choice: '출력은 A', value: 'A',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs.join(',');
    },
  },
  'frontend-01-q18': {
    revision: 1, choice: '출력은 fixed', value: 'fixed',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs.join(',');
    },
  },
  'frontend-01-q19': {
    revision: 1, choice: 'object', value: 'object',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs.join(',');
    },
  },
  'frontend-01-q20': {
    revision: 1, choice: '{"a":1,"c":[1,null]}', value: '{"a":1,"c":[1,null]}',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs[0];
    },
  },
  'frontend-01-q21': {
    revision: 1, choice: 'localStorage는 남고 sessionStorage는 탭을 닫으면 사라진다', value: 'local:kept,session:gone',
    async run(ctx) {
      const {context} = ctx;
      await context.route('http://app.test/**', (route) => route.fulfill({contentType: 'text/html', body: '<html></html>'}));
      const first = await context.newPage();
      await first.goto('http://app.test/');
      await first.evaluate(() => {
        localStorage.setItem('k', 'v');
        sessionStorage.setItem('k', 'v');
      });
      await first.close();
      const second = await context.newPage();
      await second.goto('http://app.test/');
      const seen = await second.evaluate(() => [localStorage.getItem('k'), sessionStorage.getItem('k')]);
      await second.close();
      return `local:${seen[0] ? 'kept' : 'gone'},session:${seen[1] ? 'kept' : 'gone'}`;
    },
  },
  'frontend-01-q24': {
    revision: 1, choice: 'top', value: 'top',
    async run(ctx) {
      const stuck = [];
      for (const prop of ['top', 'bottom', 'left']) {
        await page$(ctx, `<div style="height:2000px"><div id="s" style="position:sticky;${prop}:0;height:20px">x</div></div>`);
        const top = await ctx.page.evaluate(() => {
          window.scrollTo(0, 500);
          return Math.round(document.querySelector('#s').getBoundingClientRect().top);
        });
        if (top === 0) {
          stuck.push(prop);
        }
      }
      return stuck.join(',');
    },
  },
  'frontend-01-q25': {
    revision: 1, choice: '13', value: '13',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs[0];
    },
  },
  'frontend-01-q26': {
    revision: 1, choice: '3 + 6 = 9', value: '3 + 6 = 9',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs[0];
    },
  },
  'frontend-01-q27': {
    revision: 1, choice: '1', value: '1',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs[0];
    },
  },
  'frontend-01-q30': {
    revision: 1, choice: 'GET', value: '?q=1',
    async run(ctx) {
      const {context} = ctx;
      await context.route('http://app.test/**', (route) => route.fulfill({contentType: 'text/html', body: '<form id="f" method="get" action="/s"><input name="q" value="1"></form>'}));
      const p = await context.newPage();
      await p.goto('http://app.test/');
      await Promise.all([p.waitForURL('**/s?**'), p.evaluate(() => document.querySelector('#f').submit())]);
      const search = new URL(p.url()).search;
      await p.close();
      return search;
    },
  },
  'frontend-01-q32': {
    revision: 1, choice: null, value: 'B,C',
    async run(ctx) {
      return (await ctx.runJs(ctx.blocks[0].code)).logs.join(',');
    },
  },
};

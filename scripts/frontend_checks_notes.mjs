// Executable checks added when the bank was reinforced from source/Web_복습노트.md,
// plus checks that replaced earlier independent re-solves. See frontend_checks.mjs for the contract.
import {readFileSync} from 'node:fs';

const bootstrapCss = readFileSync(new URL('../node_modules/bootstrap/dist/css/bootstrap.min.css', import.meta.url), 'utf8');

const htmlOf = (ctx) => ctx.blocks.find((b) => b.lang === 'html')?.code ?? '';
const cssOf = (ctx) => ctx.blocks.find((b) => b.lang === 'css')?.code ?? '';
const jsOf = (ctx) => ctx.blocks.find((b) => b.lang === 'js').code;
const open = async (ctx, html) => {
  await ctx.page.setContent(html);
  return ctx.page;
};

// Serves a small origin so XMLHttpRequest, fetch, storage and history behave as on a real site.
const serve = async (ctx, handler = null) => {
  await ctx.context.route('http://app.test/**', async (route) => {
    const url = new URL(route.request().url());
    if (handler) {
      const done = await handler(route, url);
      if (done) {
        return;
      }
    }
    if (url.pathname === '/data.json') {
      await route.fulfill({contentType: 'application/json', body: '{"ok":true}'});
    } else {
      await route.fulfill({contentType: 'text/html', body: '<html><body></body></html>'});
    }
  });
  await ctx.page.goto('http://app.test/');
};

export const checks = {
  // ---- earlier independent re-solves that can be executed ----
  'frontend-01-q13': {
    revision: 1, choice: '바깥 스코프의 this를 그대로 쓴다', value: 'regular-bound:true,arrow-bound:false',
    async run(ctx) {
      const r = await ctx.runJs(`const o = {};
const regular = function () { return this; };
const arrow = () => this;
console.log('regular-bound:' + (regular.call(o) === o) + ',arrow-bound:' + (arrow.call(o) === o));`);
      return r.logs[0];
    },
  },
  'frontend-01-q23': {
    revision: 1, choice: 'justify-content', value: 'justify-content',
    async run(ctx) {
      const moved = [];
      for (const prop of ['justify-content', 'align-items']) {
        await open(ctx, `<style>body{margin:0}.row{display:flex;width:300px;height:100px;${prop}:center}.row div{width:50px;height:20px}</style><div class="row"><div></div></div>`);
        const left = await ctx.page.evaluate(() => document.querySelector('.row div').getBoundingClientRect().left);
        if (left > 0) {
          moved.push(prop);
        }
      }
      return moved.join(',');
    },
  },
  'frontend-01-q28': {
    revision: 1, choice: 'addEventListener', value: 'listeners:2,onclick:1',
    async run(ctx) {
      await open(ctx, '');
      return ctx.page.evaluate(() => {
        let a = 0;
        document.body.addEventListener('click', () => { a++; });
        document.body.addEventListener('click', () => { a++; });
        document.body.click();
        const first = a;
        let b = 0;
        document.body.onclick = () => { b++; };
        document.body.onclick = () => { b++; };
        document.body.click();
        return `listeners:${first},onclick:${b}`;
      });
    },
  },
  'frontend-02-q23': {
    revision: 1, choice: '세로', value: 'vertical',
    async run(ctx) {
      await open(ctx, '<style>body{margin:0}.col{display:flex;flex-direction:column;justify-content:center;width:300px;height:100px}.col div{width:50px;height:20px}</style><div class="col"><div></div></div>');
      const top = await ctx.page.evaluate(() => document.querySelector('.col div').getBoundingClientRect().top);
      return top > 0 ? 'vertical' : 'horizontal';
    },
  },
  'frontend-02-q28': {
    revision: 1, choice: 'replace', value: 'replace:0,assign:1',
    async run(ctx) {
      await serve(ctx);
      const before = await ctx.page.evaluate(() => history.length);
      await ctx.page.evaluate(() => location.replace('/b'));
      await ctx.page.waitForURL('**/b');
      const afterReplace = await ctx.page.evaluate(() => history.length);
      await ctx.page.evaluate(() => location.assign('/c'));
      await ctx.page.waitForURL('**/c');
      const afterAssign = await ctx.page.evaluate(() => history.length);
      return `replace:${afterReplace - before},assign:${afterAssign - afterReplace}`;
    },
  },
  'frontend-02-q29': {
    revision: 1, choice: 'method', value: 'method:POST,type:GET',
    async run(ctx) {
      const seen = {};
      await serve(ctx, async (route, url) => {
        if (url.pathname.startsWith('/api')) {
          seen[url.pathname] = route.request().method();
          await route.fulfill({contentType: 'application/json', body: '{}'});
          return true;
        }
        return false;
      });
      await ctx.page.evaluate(async () => {
        await fetch('/api/a', {method: 'POST'});
        await fetch('/api/b', {type: 'POST'});
      });
      return `method:${seen['/api/a']},type:${seen['/api/b']}`;
    },
  },
  'frontend-02-q30': {
    revision: 1, choice: '본문', value: 'body',
    async run(ctx) {
      let post = null;
      await serve(ctx, async (route, url) => {
        if (url.pathname === '/s') {
          post = {query: url.search, body: route.request().postData()};
          await route.fulfill({contentType: 'text/html', body: '<html></html>'});
          return true;
        }
        return false;
      });
      await ctx.page.setContent('<form id="f" method="post" action="http://app.test/s"><input name="q" value="1"></form>');
      await Promise.all([ctx.page.waitForURL('**/s'), ctx.page.evaluate(() => document.querySelector('#f').submit())]);
      return post.query === '' && post.body === 'q=1' ? 'body' : 'other:' + JSON.stringify(post);
    },
  },
  'frontend-03-q13': {
    revision: 1, choice: 'this가 객체가 아니라 바깥 스코프의 this가 되기 때문이다', value: 'false',
    async run(ctx) {
      const r = await ctx.runJs('const o = { f: () => this };\nconsole.log(o.f() === o);');
      return r.logs[0];
    },
  },
  'frontend-03-q24': {
    revision: 1, choice: 'relative', value: 'relative',
    async run(ctx) {
      const same = [];
      const follower = async (position) => {
        await open(ctx, `<style>body{margin:0}.t{position:${position};top:0;height:20px}.n{height:20px}</style><div class="t"></div><div class="n"></div>`);
        return ctx.page.evaluate(() => document.querySelector('.n').getBoundingClientRect().top);
      };
      const sticky = await follower('sticky');
      for (const position of ['relative', 'absolute', 'fixed']) {
        if ((await follower(position)) === sticky) {
          same.push(position);
        }
      }
      return same.join(',');
    },
  },
  'frontend-03-q30': {
    revision: 1, choice: 'setItem', value: 'setItem',
    async run(ctx) {
      await serve(ctx);
      return ctx.page.evaluate(() => ['setItem', 'saveItem', 'putItem', 'addItem'].filter((n) => typeof Storage.prototype[n] === 'function').join());
    },
  },

  // ---- questions added from the review note (revision 2 of their ids) ----
  'frontend-02-q01': {
    revision: 2, choice: 'for="py"', value: 'for="py"',
    async run(ctx) {
      await open(ctx, htmlOf(ctx));
      return ctx.page.evaluate(() => {
        const input = document.querySelector('input');
        const label = document.querySelector('label');
        for (const [name, value] of [['for', 'py'], ['form', 'py'], ['target', 'py'], ['href', '#py']]) {
          input.checked = false;
          for (const attr of [...label.attributes]) {
            label.removeAttribute(attr.name);
          }
          label.setAttribute(name, value);
          label.click();
          if (input.checked) {
            return `${name}="${value}"`;
          }
        }
        return 'none';
      });
    },
  },
  'frontend-02-q03': {
    revision: 2, choice: '처음에는 펼쳐져 있고 summary를 누르면 접힌다', value: 'open-then-closes',
    async run(ctx) {
      await open(ctx, htmlOf(ctx));
      return ctx.page.evaluate(() => {
        const d = document.querySelector('details');
        const first = d.open;
        d.querySelector('summary').click();
        return first && !d.open ? 'open-then-closes' : `first:${first},after:${d.open}`;
      });
    },
  },
  'frontend-02-q06': {
    revision: 2, choice: '화면의 오른쪽 아래 모서리', value: 'viewport',
    async run(ctx) {
      await open(ctx, `<style>${cssOf(ctx)}</style>${htmlOf(ctx)}`);
      return ctx.page.evaluate(() => {
        const b = document.querySelector('button').getBoundingClientRect();
        const w = document.documentElement.clientWidth;
        const h = innerHeight;
        return Math.abs(b.right - w) < 1 && Math.abs(b.bottom - h) < 1 ? 'viewport' : `right:${b.right},bottom:${b.bottom}`;
      });
    },
  },
  'frontend-02-q13': {
    revision: 2, choice: '출력은 false', value: 'false',
    async run(ctx) {
      await serve(ctx);
      return (await ctx.runInPage(jsOf(ctx), 300))[0];
    },
  },
  'frontend-02-q16': {
    revision: 2, choice: '찜이 한 번 출력된다', value: '찜',
    async run(ctx) {
      await open(ctx, '<ul></ul>');
      return (await ctx.runInPage(jsOf(ctx))).join(',');
    },
  },
  'frontend-02-q18': {
    revision: 2, choice: 'sent load', value: 'sent load',
    async run(ctx) {
      await serve(ctx);
      return (await ctx.runInPage(jsOf(ctx), 300)).join(' ');
    },
  },
  'frontend-03-q07': {
    revision: 2, choice: '각각 한 줄을 차지해 위아래로 쌓인다', value: 'stack@600,row@800:75%',
    async run(ctx) {
      const html = `<style>${bootstrapCss}</style><div class="container-fluid">${htmlOf(ctx)}</div>`;
      const measure = async (width) => {
        await ctx.page.setViewportSize({width, height: 700});
        await open(ctx, html);
        return ctx.page.evaluate(() => {
          const [a, b] = [...document.querySelectorAll('.row > div')].map((el) => el.getBoundingClientRect());
          return {stacked: b.top >= a.bottom - 1, ratio: Math.round((a.width / (a.width + b.width)) * 100)};
        });
      };
      const narrow = await measure(600);
      const wide = await measure(800);
      return `${narrow.stacked ? 'stack' : 'row'}@600,${wide.stacked ? 'stack' : 'row'}@800:${wide.ratio}%`;
    },
  },
  'frontend-03-q15': {
    revision: 2, choice: '출력은 null', value: 'null',
    async run(ctx) {
      await open(ctx, '');
      ctx.page.once('dialog', (dialog) => dialog.dismiss());
      return (await ctx.runInPage(jsOf(ctx)))[0];
    },
  },
  'frontend-03-q21': {
    revision: 2, choice: 'done 하나를 출력한다', value: 'done',
    async run(ctx) {
      await serve(ctx);
      return (await ctx.runInPage(jsOf(ctx), 300)).join(',');
    },
  },
  'frontend-03-q22': {
    revision: 2, choice: 'button', value: 'button',
    async run(ctx) {
      await open(ctx, '<form id="f"><button id="a" type="button">a</button><button id="b" type="submit">b</button></form>');
      return ctx.page.evaluate(() => {
        const sent = [];
        document.querySelector('#f').addEventListener('submit', (e) => {
          e.preventDefault();
          sent.push('submitted');
        });
        const result = [];
        for (const id of ['a', 'b']) {
          sent.length = 0;
          document.getElementById(id).click();
          if (!sent.length) {
            result.push(document.getElementById(id).type);
          }
        }
        return result.join();
      });
    },
  },
  'frontend-03-q28': {
    revision: 2, choice: 'NodeList', value: 'NodeList',
    async run(ctx) {
      await open(ctx, '<p></p>');
      return ctx.page.evaluate(() => Object.prototype.toString.call(document.querySelectorAll('p')).slice(8, -1));
    },
  },
  'frontend-03-q29': {
    revision: 2, choice: '4', value: '4',
    async run(ctx) {
      await serve(ctx);
      return ctx.page.evaluate(() => new Promise((resolve) => {
        const states = [];
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/data.json');
        xhr.onreadystatechange = () => {
          states.push(xhr.readyState);
          if (xhr.readyState === 4) {
            resolve(String(xhr.readyState));
          }
        };
        xhr.send();
      }));
    },
  },
};

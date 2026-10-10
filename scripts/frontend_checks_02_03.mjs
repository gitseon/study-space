// Executable checks for frontend-02 and frontend-03. See frontend_checks.mjs for the contract.
// Questions that cannot be run are listed in source/frontend-reviews.json.

const open = async (ctx, html) => {
  await ctx.page.setContent(html);
  return ctx.page;
};
const htmlOf = (ctx) => ctx.blocks.find((b) => b.lang === 'html')?.code ?? '';
const cssOf = (ctx) => ctx.blocks.find((b) => b.lang === 'css')?.code ?? '';
const jsOf = (ctx) => ctx.blocks.find((b) => b.lang === 'js').code;
const withCss = (ctx, body) => `<style>${cssOf(ctx)}</style>${body}`;

// Runs the first code block in the Node vm and compares the joined console output.
const vmCheck = (choice, value, joiner = ',') => ({
  revision: 1, choice, value,
  run: async (ctx) => (await ctx.runJs(jsOf(ctx))).logs.join(joiner),
});

// Runs the question's HTML and JavaScript in Chromium and returns the first console line.
const pageCheck = (choice, value, joiner = null) => ({
  revision: 1, choice, value,
  async run(ctx) {
    await open(ctx, htmlOf(ctx));
    const logs = await ctx.runInPage(jsOf(ctx));
    return joiner === null ? logs[0] : logs.join(joiner);
  },
});

// Reads a computed colour after applying the question's HTML and CSS.
const colorCheck = (choice, value) => ({
  revision: 1, choice, value,
  async run(ctx) {
    await open(ctx, withCss(ctx, htmlOf(ctx)));
    return ctx.page.evaluate(() => getComputedStyle(document.querySelector('p')).color);
  },
});

const gap = (ctx, html) => async () => {
  await open(ctx, html);
  return ctx.page.evaluate(() => {
    const a = document.querySelector('.a').getBoundingClientRect();
    const b = document.querySelector('.b').getBoundingClientRect();
    return (b.top - a.bottom) + 'px';
  });
};

export const checks = {
  // ---- frontend-02 ----
  'frontend-02-q02': {
    revision: 1, choice: '전송 데이터에 포함되지 않는다', value: 'omitted',
    async run(ctx) {
      await open(ctx, htmlOf(ctx));
      return ctx.page.evaluate(() => (new FormData(document.querySelector('form')).has('agree') ? 'sent' : 'omitted'));
    },
  },
  'frontend-02-q04': {
    revision: 1, choice: 'A만 빨간색이다', value: 'A:red,B:black',
    async run(ctx) {
      await open(ctx, withCss(ctx, htmlOf(ctx)));
      return ctx.page.evaluate(() => {
        const name = (el) => ({'rgb(255, 0, 0)': 'red', 'rgb(0, 0, 0)': 'black'}[getComputedStyle(el).color]);
        return `A:${name(document.querySelector('p.note'))},B:${name(document.querySelector('span.note'))}`;
      });
    },
  },
  'frontend-02-q05': colorCheck('blue', 'rgb(0, 0, 255)'),
  'frontend-02-q07': {
    revision: 1, choice: '50px', value: '50px',
    run: (ctx) => gap(ctx, withCss(ctx, '<div class="row"><div class="a">A</div><div class="b">B</div></div>'))(),
  },
  'frontend-02-q08': {
    revision: 1, choice: 'B를 출력한 뒤 TypeError가 발생한다', value: 'B|TypeError',
    async run(ctx) {
      const r = await ctx.runJs(jsOf(ctx));
      return r.logs.join(',') + '|' + r.error;
    },
  },
  'frontend-02-q09': vmCheck('2', '2'),
  'frontend-02-q10': vmCheck('a,b,c 3', 'a,b,c 3'),
  'frontend-02-q11': vmCheck('2,3 2,3,4', '2,3 2,3,4'),
  'frontend-02-q12': vmCheck('결과는 Ta,Tb', 'Ta,Tb'),
  'frontend-02-q14': pageCheck('1y2x', '1y2x'),
  'frontend-02-q15': {
    revision: 1, choice: '결과는 b', value: 'b',
    async run(ctx) {
      await open(ctx, '');
      return (await ctx.runInPage(jsOf(ctx)))[0];
    },
  },
  'frontend-02-q17': vmCheck('A C D B', 'A C D B', ' '),
  'frontend-02-q19': vmCheck('1 3 2', '1 3 2', ' '),
  'frontend-02-q20': vmCheck('SyntaxError', 'SyntaxError'),
  'frontend-02-q21': {
    revision: 1, choice: 'string 51', value: 'string 51',
    async run(ctx) {
      await ctx.context.route('http://app.test/**', (route) => route.fulfill({contentType: 'text/html', body: '<html></html>'}));
      await ctx.page.goto('http://app.test/');
      return (await ctx.runInPage(jsOf(ctx)))[0];
    },
  },
  'frontend-02-q24': {
    revision: 1, choice: '10', value: '10',
    async run(ctx) {
      await open(ctx, withCss(ctx, '<div style="height:2000px"><div class="bar">x</div></div>'));
      return ctx.page.evaluate(() => {
        window.scrollTo(0, 500);
        return String(Math.round(document.querySelector('.bar').getBoundingClientRect().top));
      });
    },
  },
  'frontend-02-q25': vmCheck('object undefined', 'object undefined'),
  'frontend-02-q26': vmCheck('33', '33'),
  'frontend-02-q27': vmCheck('2', '2'),
  'frontend-02-q31': vmCheck(null, 'Kim'),

  // ---- frontend-03 ----
  'frontend-03-q01': {
    revision: 1, choice: '같은 줄에 놓이고 크기를 지정할 수 있다', value: 'sized,same-line',
    async run(ctx) {
      await open(ctx, '<style>.i{display:inline-block;width:100px;height:30px}</style><span class="i"></span><span class="i"></span>');
      return ctx.page.evaluate(() => {
        const [a, b] = document.querySelectorAll('.i');
        const sized = a.offsetWidth === 100 && a.offsetHeight === 30;
        const line = a.getBoundingClientRect().top === b.getBoundingClientRect().top;
        return (sized ? 'sized' : 'not-sized') + ',' + (line ? 'same-line' : 'new-line');
      });
    },
  },
  'frontend-03-q02': pageCheck('출력은 51', '51'),
  'frontend-03-q04': {
    revision: 1, choice: '1번과 3번만', value: '1,3',
    async run(ctx) {
      await open(ctx, htmlOf(ctx));
      return ctx.page.evaluate(() => [...document.querySelectorAll('.box > p')].map((p) => p.textContent).join());
    },
  },
  'frontend-03-q05': colorCheck('blue', 'rgb(0, 0, 255)'),
  'frontend-03-q06': {
    revision: 1, choice: '240px', value: '240px',
    async run(ctx) {
      await open(ctx, withCss(ctx, '<div style="width:400px"><div class="c">x</div></div>'));
      return ctx.page.evaluate(() => document.querySelector('.c').offsetWidth + 'px');
    },
  },
  'frontend-03-q08': vmCheck('3,3,3', '3,3,3'),
  'frontend-03-q09': vmCheck('x 0 null', 'x 0 null'),
  'frontend-03-q10': vmCheck('2 2', '2 2'),
  'frontend-03-q11': vmCheck('1,10,9', '1,10,9'),
  'frontend-03-q12': {
    revision: 1, choice: 'true false', value: 'true false',
    async run(ctx) {
      await open(ctx, '');
      return (await ctx.runInPage(jsOf(ctx))).join(' ');
    },
  },
  'frontend-03-q14': pageCheck('BA', 'BA'),
  'frontend-03-q16': {
    revision: 1, choice: 'A가 한 번 출력된다', value: 'A',
    async run(ctx) {
      await open(ctx, '');
      return (await ctx.runInPage(jsOf(ctx))).join(',');
    },
  },
  'frontend-03-q17': vmCheck('출력은 ok', 'ok'),
  'frontend-03-q18': vmCheck('출력은 e1+!', 'e1+!'),
  'frontend-03-q19': vmCheck('f 다음 cx', 'f cx', ' '),
  'frontend-03-q20': vmCheck('string object', 'string object'),
  'frontend-03-q23': {
    revision: 1, choice: '125', value: '125',
    async run(ctx) {
      await open(ctx, withCss(ctx, '<style>body{margin:0}</style><div class="row"><div></div><div></div><div></div></div>'));
      return ctx.page.evaluate(() => String(document.querySelectorAll('.row div')[1].getBoundingClientRect().left));
    },
  },
  'frontend-03-q25': vmCheck('2 3', '2 3'),
  'frontend-03-q26': vmCheck('7 is odd', '7 is odd'),
  'frontend-03-q27': vmCheck('TypeError', 'TypeError'),
  'frontend-03-q31': vmCheck(null, '1 3'),
  'frontend-03-q32': {
    revision: 1, choice: null, value: 'POST|application/json|{"name":"pen"}|1',
    async run(ctx) {
      const model = ctx.question.modelAnswer.match(/^(async function[\s\S]*?\}) method로/)[1];
      const r = await ctx.runJs(`const seen = {};
const fetch = async (url, opts) => {
  Object.assign(seen, { url, opts });
  return { ok: true, json: async () => ({ id: 1 }) };
};
${model}
create().then((v) => console.log([seen.opts.method, seen.opts.headers['Content-Type'], seen.opts.body, v.id].join('|')));`);
      return r.logs[0];
    },
  },
};

// Shows how Chromium scopes a cookie whose Set-Cookie header has no Path attribute.
// A tiny local server plays the login servlet; the browser is the real judge. Prints one "name=value" line per case.
import http from 'node:http';
import {chromium} from '@playwright/test';

const seen = [];
const server = http.createServer((req, res) => {
  seen.push({url: req.url, cookie: req.headers.cookie || ''});
  if (req.url === '/app/auth/login') {
    res.setHeader('Set-Cookie', 'savedId=kim; Max-Age=604800');
  }
  res.setHeader('Content-Type', 'text/plain');
  res.end('ok');
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(base + '/app/auth/login');
  const fetchCookieOf = async (path) => {
    seen.length = 0;
    await page.evaluate((url) => fetch(url).then((r) => r.text()), base + path);
    return seen.find((s) => s.url === path)?.cookie || '';
  };
  const underAuth = await fetchCookieOf('/app/auth/mypage');
  const underContext = await fetchCookieOf('/app/index.jsp');
  console.log('cookie_sent_under_auth=' + (underAuth.includes('savedId=kim') ? 'yes' : 'no'));
  console.log('cookie_sent_to_context_root=' + (underContext.includes('savedId=kim') ? 'yes' : 'no'));
} finally {
  await browser.close();
  server.close();
}

// Shows what Chromium does with an HttpOnly cookie: it is sent with requests but hidden from document.cookie.
import http from 'node:http';
import {chromium} from '@playwright/test';

const seen = [];
const server = http.createServer((req, res) => {
  seen.push({url: req.url, cookie: req.headers.cookie || ''});
  if (req.url === '/login') {
    res.setHeader('Set-Cookie', ['sid=abc; Path=/; HttpOnly', 'theme=dark; Path=/']);
  }
  res.setHeader('Content-Type', 'text/plain');
  res.end('ok');
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port;
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(base + '/login');
  const visible = await page.evaluate(() => document.cookie);
  seen.length = 0;
  await page.evaluate((url) => fetch(url).then((r) => r.text()), base + '/next');
  const sent = seen.find((s) => s.url === '/next')?.cookie || '';
  console.log('httponly_visible_to_script=' + (visible.includes('sid=') ? 'yes' : 'no'));
  console.log('plain_cookie_visible_to_script=' + (visible.includes('theme=dark') ? 'yes' : 'no'));
  console.log('httponly_sent_with_request=' + (sent.includes('sid=abc') ? 'yes' : 'no'));
} finally {
  await browser.close();
  server.close();
}

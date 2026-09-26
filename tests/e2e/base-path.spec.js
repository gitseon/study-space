import {test,expect} from '@playwright/test';
test('all requests stay under the Pages project path and review survives reload',async({page,baseURL})=>{
  const outside=[];
  page.on('request',req=>{if(req.url().startsWith('http://127.0.0.1')&&!req.url().startsWith(baseURL))outside.push(req.url());});
  await page.goto('index.html');
  await page.getByRole('button',{name:'1회 시험 시작',exact:true}).first().click();
  await page.locator('.choice').first().click();
  page.on('dialog',d=>d.accept());
  await page.getByRole('button',{name:'제출하기',exact:true}).click();
  await expect(page).toHaveURL(/review\.html\?attempt=/);
  await page.reload();
  await expect(page.locator('.explanation').first()).toBeVisible();
  await page.goto('quiz.html?exam=missing&mode=exam');
  await expect(page.getByRole('link',{name:'문제집으로 돌아가기'})).toBeVisible();
  expect(outside).toEqual([]);
});

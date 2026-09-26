import {test,expect} from '@playwright/test';
test('exam hides answers and restores typed responses before review',async({page})=>{
  await page.goto('index.html');
  await page.getByRole('button',{name:'1회 시험 시작',exact:true}).first().click();
  await expect(page.locator('.choice')).toHaveCount(4);
  await page.locator('.choice').first().click();
  await expect(page.locator('.explanation')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('input[type=radio]:checked')).toHaveCount(1);
  page.on('dialog',d=>d.accept());
  await page.getByRole('button',{name:'제출하기',exact:true}).click();
  await expect(page.locator('.explanation').first()).toBeVisible();
});
test('monthly text is restored and revealing a solution is not a grade',async({page})=>{
  await page.goto('quiz.html?exam=monthly-01&mode=study');
  await page.locator('textarea').fill('public class Solution {}');
  await page.reload();
  await expect(page.locator('textarea')).toHaveValue('public class Solution {}');
  await page.getByRole('button',{name:'해설 보기',exact:true}).click();
  await expect(page.locator('.rubric input:checked')).toHaveCount(0);
  await expect(page.locator('.explanation')).toBeVisible();
});
test('mobile layout and UTF-8 prose do not overflow',async({page})=>{
  await page.setViewportSize({width:360,height:800});
  await page.goto('index.html');
  await expect(page.getByRole('heading',{name:'이해한 만큼, 풀어보기'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('body').innerText()).not.toContain('\uFFFD');
  await page.goto('quiz.html?exam=monthly-01&mode=study');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

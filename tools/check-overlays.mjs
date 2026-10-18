import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage();
await page.addInitScript(()=>sessionStorage.setItem('vr-age-confirmed','yes'));
const checks=[];
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
for(const route of ['index','collection','product','cart','about','help','contact','404','search'])for(const width of [390,1440]) {
  await page.setViewportSize({width,height:900});
  await page.goto(`http://127.0.0.1:4173/${route}.html`,{waitUntil:'networkidle'});
  await page.locator('.header__search input[type=search]').evaluate(el=>el.value='');
  await page.locator('.header__search > details > summary').click();
  const opens=await page.locator('.header__search > details').evaluate(el=>el.open&&el.contains(document.activeElement)&&document.activeElement.tagName==='INPUT');
  await page.keyboard.press('Escape');
  const closes=await page.locator('.header__search > details').evaluate(el=>!el.open);
  checks.push({type:'empty-query search dialog',route,width,pass:opens&&closes});
  if(['index','product','cart'].includes(route)) {
    await page.locator('#cart-icon-bubble').click();
    await page.waitForTimeout(450);
    const cartOpens=await page.locator('cart-drawer').evaluate(el=>el.classList.contains('active')&&el.contains(document.elementFromPoint(innerWidth-40,150)));
    await page.keyboard.press('Escape');
    const cartCloses=await page.locator('cart-drawer').evaluate(el=>!el.classList.contains('active'));
    checks.push({type:'cart drawer',route,width,pass:cartOpens&&cartCloses});
  }
}
for(const width of [390,640]) {
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:4173/collection.html',{waitUntil:'networkidle'});
  await page.locator('summary.mobile-facets__open-wrapper').click();
  await page.waitForTimeout(450);
  const opens=await page.locator('.mobile-facets__disclosure').evaluate(el=>el.open&&el.contains(document.elementFromPoint(innerWidth-70,100)));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  const closes=await page.locator('.mobile-facets__disclosure').evaluate(el=>!el.open);
  checks.push({type:'filter drawer',route:'collection',width,pass:opens&&closes});
}
const report={scope:'Overlay presentation and Escape close; search results and cart/filter updates require Shopify',checks,errors,pass:checks.every(c=>c.pass)&&errors.length===0};
fs.writeFileSync(path.join(import.meta.dirname,'validation','overlay-checks.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,total:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));
await browser.close();
if(!report.pass)process.exitCode=1;

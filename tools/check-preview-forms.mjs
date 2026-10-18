import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage();
await page.addInitScript(()=>sessionStorage.setItem('vr-age-confirmed','yes'));
const requests=[];
const errors=[];
const dialogs=[];
page.on('request',request=>{if(request.method()==='POST')requests.push(request.url());});
page.on('pageerror',error=>errors.push(error.message));
page.on('dialog',async dialog=>{dialogs.push(dialog.message());await dialog.dismiss();});
const checks=[];
for(const route of ['product','contact','index','cart']) {
  await page.goto(`http://127.0.0.1:4173/${route}.html`,{waitUntil:'networkidle'});
  const before=dialogs.length;
  if(route==='contact') {
    await page.locator('.contact input[type=email]').fill('preview@example.com');
    await page.locator('.contact textarea').fill('Local design check only.');
    await page.locator('.contact button[type=submit]').click();
  } else if(route==='index') {
    await page.locator('.newsletter input[type=email]').fill('preview@example.com');
    await page.locator('.newsletter button[type=submit]').click();
  } else if(route==='product') {
    await page.locator('.product-form button[type=submit]').first().click();
  } else {
    await page.locator('#main-cart-footer .cart__checkout-button').click();
  }
  checks.push({route,noticeShown:dialogs.length===before+1&&dialogs.at(-1).startsWith('Design preview only.')});
}
const report={scope:'Preview submission guards; actual store submission remains untested',checks,requests,errors,pass:checks.every(c=>c.noticeShown)&&requests.length===0&&errors.length===0};
fs.writeFileSync(path.join(import.meta.dirname,'validation','preview-form-checks.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(!report.pass)process.exitCode=1;

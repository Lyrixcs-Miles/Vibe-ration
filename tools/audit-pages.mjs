import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.addInitScript(()=>sessionStorage.setItem('vr-age-confirmed','yes'));
const routes=['index','collection','product','cart','about','help','contact','404','search'];
const pages=[];
const internal=new Set();
for(const route of routes) {
  await page.goto(`http://127.0.0.1:4173/${route}.html`,{waitUntil:'networkidle'});
  const result=await page.evaluate(()=>{
    const visible=el=>el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden';
    const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
    const duplicateIds=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
    const unlabeledFields=[...document.querySelectorAll('main input:not([type=hidden]),main select,main textarea')].filter(visible).filter(el=>!el.labels?.length&&!el.getAttribute('aria-label')&&!el.getAttribute('aria-labelledby')).map(el=>({tag:el.tagName,id:el.id}));
    const invalidAnchors=[...document.querySelectorAll('a[href^="#"]')].filter(visible).filter(el=>el.hash&&!document.getElementById(decodeURIComponent(el.hash.slice(1)))).map(el=>el.getAttribute('href'));
    const links=[...document.querySelectorAll('a[href]')].filter(visible).map(el=>el.getAttribute('href')).filter(href=>href.startsWith('/')&&!href.startsWith('//'));
    return {duplicateIds,unlabeledFields,invalidAnchors,links,unrenderedText:/\[object Object\]|{{|{%/.test(document.body.innerText),h1:document.querySelector('main h1')?.textContent.trim()};
  });
  for(const href of result.links)internal.add(href);
  pages.push({route,...result});
}
const links=[];
for(const href of internal) {
  const url=new URL(href,'http://127.0.0.1:4173');
  const response=await page.request.get(url.href);
  links.push({href,status:response.status()});
}
const stickyMenus=[];
for(const route of ['index','product','help','contact'])for(const width of [390,820]) {
  await page.setViewportSize({width,height:900});
  await page.goto(`http://127.0.0.1:4173/${route}.html`,{waitUntil:'networkidle'});
  await page.evaluate(()=>window.scrollTo(0,600));
  await page.waitForTimeout(250);
  await page.locator('#Details-menu-drawer-container > summary').click();
  await page.waitForTimeout(450);
  const result=await page.evaluate(()=>{
    const drawer=document.querySelector('#menu-drawer').getBoundingClientRect();
    const header=document.querySelector('.section-header');
    const hit=document.elementFromPoint(Math.min(100,drawer.right-10),drawer.top+50);
    return {drawerTop:drawer.top,drawerBottom:drawer.bottom,coversPage:header.contains(hit),scrollLocked:document.body.className.includes('overflow-hidden')};
  });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(450);
  const restored=await page.evaluate(()=>!document.body.className.includes('overflow-hidden'));
  stickyMenus.push({route,width,...result,restored,pass:result.coversPage&&result.scrollLocked&&restored&&result.drawerTop>=0&&result.drawerBottom>=899});
}
const report={checkedAt:new Date().toISOString(),scope:'Local preview links, field labels, markup and scrolled mobile navigation',pages,links,stickyMenus,pass:pages.every(p=>!p.duplicateIds.length&&!p.unlabeledFields.length&&!p.invalidAnchors.length&&!p.unrenderedText)&&links.every(l=>l.status===200)&&stickyMenus.every(m=>m.pass)};
fs.writeFileSync(path.join(import.meta.dirname,'validation','page-audit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,pages:pages.filter(p=>p.duplicateIds.length||p.unlabeledFields.length||p.invalidAnchors.length||p.unrenderedText),brokenLinks:links.filter(l=>l.status!==200),menuFailures:stickyMenus.filter(m=>!m.pass)},null,2));
await browser.close();
if(!report.pass)process.exitCode=1;

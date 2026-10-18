import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage();
await page.addInitScript(()=>sessionStorage.setItem('vr-age-confirmed','yes'));
const errors=[];
page.on('pageerror',error=>errors.push(error.message));
const checks=[];
const directory=path.join(import.meta.dirname,'validation');
for(const width of [360,390,768,820,1024,1440]) {
  await page.setViewportSize({width,height:1000});
  await page.goto('http://127.0.0.1:4173/',{waitUntil:'networkidle'});
  const result=await page.evaluate(()=>{
    const categories=document.querySelector('.vr-categories');
    const head=categories.previousElementSibling;
    const h1=document.querySelector('main h1');
    const arrivals=[...document.querySelectorAll('[id^="collection-"] .card__heading')].map(el=>el.textContent.trim());
    const deals=[...document.querySelectorAll('.vr-deals .card__heading')].map(el=>el.textContent.trim());
    return {viewport:innerWidth,documentWidth:document.documentElement.scrollWidth,h1Count:document.querySelectorAll('main h1').length,headingFits:h1.getBoundingClientRect().right<=innerWidth,categoryCount:categories.children.length,mobileHeadingFits:innerWidth>=640||head.firstElementChild.getBoundingClientRect().width>=head.clientWidth*.9,primaryLink:document.querySelector('.vr-hero .button').getAttribute('href'),storyLink:document.querySelector('.vr-editorial a').getAttribute('href'),distinctProducts:arrivals.length>0&&deals.length>0&&!arrivals.some(title=>deals.includes(title)),newsletter:Boolean(document.querySelector('.newsletter input[type=email]'))};
  });
  checks.push({...result,pass:result.documentWidth===width&&result.h1Count===1&&result.headingFits&&result.categoryCount===3&&result.mobileHeadingFits&&result.primaryLink==='/collection.html'&&result.storyLink==='/about.html'&&result.distinctProducts&&result.newsletter});
  if([360,768,1440].includes(width))await page.screenshot({path:path.join(directory,`index-${width}.png`),fullPage:true});
}
const report={checkedAt:new Date().toISOString(),scope:'Homepage redesign rendered with local fixtures',checks,errors,pass:checks.every(x=>x.pass)&&errors.length===0};
fs.writeFileSync(path.join(directory,'homepage-redesign-checks.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
await browser.close();
if(!report.pass)process.exitCode=1;

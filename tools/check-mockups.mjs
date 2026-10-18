import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage();
await page.addInitScript(()=>sessionStorage.setItem('vr-age-confirmed','yes'));
const checks=[];
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
const directory=path.join(import.meta.dirname,'validation');
const routes=['index','collection','product','cart','about','search','product-plum-wand','product-rose-rabbit','product-rose-bullet','product-curved-vibrator','product-couples-ring','product-massage-candle','product-personal-lubricant'];
for(const route of routes)for(const width of route==='index'?[360,390,768,820,1024,1440]:[390,1440]) {
  await page.setViewportSize({width,height:1000});
  await page.goto(`http://127.0.0.1:4173/${route}.html`,{waitUntil:'networkidle'});
  await page.evaluate(async()=>{const images=[...document.images];for(const image of images)image.loading='eager';await Promise.all(images.map(image=>image.decode().catch(()=>{})));});
  const result=await page.evaluate(()=>{
    const mockups=[...document.querySelectorAll('main img')].filter(img=>img.src.includes('/vr-mockup-'));
    const frames=[...document.querySelectorAll('.vr-hero__media > img,.vr-category__media > img,.vr-editorial__media > img')];
    return {count:mockups.length,missing:mockups.filter(img=>!img.complete||!img.naturalWidth).map(img=>img.src),unlabeled:mockups.filter(img=>!img.alt.trim()).map(img=>img.src),frameOverflow:frames.filter(img=>{const r=img.getBoundingClientRect(),p=img.parentElement.getBoundingClientRect();return r.right>p.right+1||r.bottom>p.bottom+1;}).map(img=>img.src),documentWidth:document.documentElement.scrollWidth};
  });
  const matchingProduct=!route.startsWith('product')||await page.locator('.product__media-list img').first().evaluate((image,key)=>image.src.includes(`vr-mockup-${key}.jpg`),route==='product'?'rose-pebble':route.slice('product-'.length));
  checks.push({route,width,...result,matchingProduct,pass:result.count>0&&!result.missing.length&&!result.unlabeled.length&&!result.frameOverflow.length&&result.documentWidth===width&&matchingProduct});
  if([360,390,1440].includes(width))await page.screenshot({path:path.join(directory,`${route}-${width}.png`),fullPage:true});
}
const report={scope:'Generated mockup image loading, alt text, frame sizing and page overflow',checks,errors,pass:checks.every(c=>c.pass)&&!errors.length};
fs.writeFileSync(path.join(directory,'mockup-image-checks.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,total:checks.length,failed:checks.filter(c=>!c.pass),errors},null,2));
await browser.close();
if(!report.pass)process.exitCode=1;

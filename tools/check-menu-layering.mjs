import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright-core';

const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage();
await page.addInitScript(()=>sessionStorage.setItem('vr-age-confirmed','yes'));
const directory=path.join(import.meta.dirname,'validation');
const checks=[];
for(const route of ['index','collection','product','cart','about','help','contact','404','search']) {
  for(const width of [390,820]) {
    await page.setViewportSize({width,height:1000});
    await page.goto(`http://127.0.0.1:4173/${route}.html`,{waitUntil:'networkidle'});
    await page.locator('#Details-menu-drawer-container > summary').click();
    await page.waitForTimeout(450);
    const result=await page.evaluate(()=>{
      const header=document.querySelector('.section-header');
      const drawer=document.querySelector('#menu-drawer');
      const bounds=drawer.getBoundingClientRect();
      const buttonPoints=[...document.querySelectorAll('main .button')].map(el=>el.getBoundingClientRect()).map(r=>({x:r.x+r.width/2,y:r.y+r.height/2})).filter(p=>p.x>0&&p.x<innerWidth&&p.y>bounds.top&&p.y<innerHeight);
      const gridPoints=[];
      for(let x=20;x<innerWidth;x+=100)for(let y=Math.ceil(bounds.top)+20;y<innerHeight;y+=100)gridPoints.push({x,y});
      const leaks=[...buttonPoints,...gridPoints].filter(p=>!header.contains(document.elementFromPoint(p.x,p.y)));
      return {headerZ:getComputedStyle(header).zIndex,open:document.querySelector('#Details-menu-drawer-container').open,buttonPoints:buttonPoints.length,leaks,overflow:document.documentElement.scrollWidth>innerWidth};
    });
    if(route==='index')await page.screenshot({path:path.join(directory,`mobile-menu-${width}.png`)});
    await page.keyboard.press('Escape');
    await page.waitForTimeout(450);
    const closes=await page.locator('#Details-menu-drawer-container').evaluate(el=>!el.open);
    checks.push({route,width,...result,closes,pass:result.open&&result.leaks.length===0&&!result.overflow&&closes});
  }
}
const report={scope:'Local preview mobile-menu layering and Escape close',checks,pass:checks.every(c=>c.pass)};
fs.writeFileSync(path.join(directory,'menu-layering-checks.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({pass:report.pass,total:checks.length,failed:checks.filter(c=>!c.pass)},null,2));
await browser.close();
if(!report.pass)process.exitCode=1;

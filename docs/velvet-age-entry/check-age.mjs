import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || '../../tools/node_modules/playwright-core/index.mjs');
const root=path.resolve(import.meta.dirname);
const read=f=>fs.readFileSync(path.join(root,f),'utf8').replace(/^\uFEFF/,'');
const settings=JSON.parse(read('config/settings_data.json')).current;
const locale=JSON.parse(read('locales/en.default.json'));
const lookup=key=>key.split('.').reduce((v,k)=>v?.[k],locale);
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const render=f=>read(f).replace(/{% doc %}[\s\S]*?{% enddoc %}/g,'').replace(/{{\s*'([^']+)'\s*\|\s*t\s*}}/g,(_,key)=>escape(lookup(key))).replace(/{{\s*settings\.(\w+)\s*\|\s*escape\s*}}/g,(_,key)=>escape(settings[key])).replace(/{{\s*shop.name\s*\|\s*escape\s*}}/g,'MY STORE').replace(/{{\s*routes.all_products_collection_url\s*}}/g,'/collections/all').replace(/{{\s*collections\['for-couples'\].*?}}/g,'/collections/for-couples');
const init=read('layout/theme.liquid').match(/<script>\s*try \{ if \(sessionStorage[\s\S]*?<\/script>/)[0];
const html=`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>:root{--font-heading:Georgia,serif;--font-body:Arial,sans-serif}body{margin:0;background:#120c0f;color:#f2e8dd;font-family:Arial,sans-serif}header{padding:24px 5%;border-bottom:1px solid #493037}header a{color:inherit;text-decoration:none}.fixture-footer{padding:32px;text-align:center}button,a{touch-action:manipulation}</style><link rel="stylesheet" href="/assets/vr-age-gate.css">${init}</head><body ><header><a href="/">MY STORE</a></header><main><h1>Stay curious.</h1><a href="/collections/all">Shop all products</a></main><footer class="fixture-footer">Private moments. Discreetly delivered.</footer>${render('snippets/vr-age-gate.liquid')}<script src="/assets/vr-age-gate.js" defer></script></body></html>`;
if(html.includes('{{')||html.includes('{%'))throw Error('Unrendered fixture Liquid');
const server=http.createServer((req,res)=>{
  const asset={'/assets/vr-age-gate.css':['assets/vr-age-gate.css','text/css'],'/assets/vr-age-gate.js':['assets/vr-age-gate.js','text/javascript']}[req.url];
  res.setHeader('Content-Type',asset?asset[1]:'text/html');res.end(asset?read(asset[0]):html);
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({executablePath:process.env.BROWSER_EXECUTABLE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const results=[];
const assert=(condition,message)=>{if(!condition)throw Error(message);results.push(message);};
try {
  for(const width of [1440,390]){
    const context=await browser.newContext({viewport:{width,height:1000}});const page=await context.newPage();
    await page.goto(url);await page.locator('#vr-age-gate').waitFor({state:'visible'});
    assert(await page.locator('#vr-age-gate').evaluate(x=>x.matches(':modal')),`${width}: native modal opens`);
    assert(await page.locator('main').evaluate(x=>getComputedStyle(x).visibility==='hidden'),`${width}: browsing hidden before acceptance`);
    await page.keyboard.press('Escape');assert(await page.locator('#vr-age-gate').evaluate(x=>x.open),`${width}: Escape cannot bypass`);
    for(let i=0;i<5;i++){await page.keyboard.press('Tab');assert(await page.evaluate(()=>!!document.activeElement.closest('dialog')),`${width}: keyboard focus stays in dialog ${i}`);}
    await page.screenshot({path:path.join(root,`validation/age-${width}.png`),fullPage:true});
    await page.locator('[data-age-accept]').click();
    assert(await page.locator('#vr-age-gate').evaluate(x=>!x.open),`${width}: acceptance closes dialog`);
    assert(await page.locator('main').isVisible(),`${width}: acceptance reveals store`);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${width}: store page has no overflow`);
    await page.screenshot({path:path.join(root,`validation/store-${width}.png`),fullPage:true});
    await page.goto(url+'/collections/all');assert(await page.locator('#vr-age-gate').evaluate(x=>!x.open),`${width}: acceptance persists across pages`);
    await context.close();
  }
  const fresh=await browser.newContext();const denied=await fresh.newPage();await denied.goto(url);await denied.locator('[data-age-decline]').click();
  assert(await denied.locator('[data-age-denied]').isVisible(),'Under-18 path shows exit message');
  assert(await denied.locator('#vr-age-gate').evaluate(x=>x.matches(':modal')),'Under-18 path keeps browsing blocked');
  assert(await denied.evaluate(()=>sessionStorage.getItem('vr-age-confirmed-v1')!=='yes'),'Under-18 path never stores acceptance');await fresh.close();
  const blocked=await browser.newContext();await blocked.addInitScript(()=>Object.defineProperty(window,'sessionStorage',{get(){throw Error('Unavailable');}}));const page=await blocked.newPage();await page.goto(url);await page.locator('[data-age-accept]').click();assert(await page.locator('main').isVisible(),'Acceptance works with blocked storage');await blocked.close();
  const nojs=await browser.newContext({javaScriptEnabled:false});const fallback=await nojs.newPage();await fallback.goto(url);assert(await fallback.locator('.vr-age-nojs').isVisible(),'JavaScript-disabled fallback is visible');assert(await fallback.locator('main').evaluate(x=>getComputedStyle(x).visibility==='hidden'),'JavaScript-disabled fallback hides browsing');await nojs.close();
  fs.writeFileSync(path.join(root,'validation/checks.json'),JSON.stringify({passed:true,results},null,2));
  console.log(`Passed ${results.length} age-confirmation checks.`);
} finally { await browser.close();server.close(); }

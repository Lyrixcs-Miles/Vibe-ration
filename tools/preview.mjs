import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { Liquid } from 'liquidjs';

const theme = path.resolve(import.meta.dirname, '..');
const workspace = path.resolve(theme, '..');
const output = path.join(workspace, 'preview');
fs.mkdirSync(output, { recursive: true });
const read = file => fs.readFileSync(path.join(theme,file),'utf8');
const data = JSON.parse(read('config/settings_data.json')).current;
const translations = JSON.parse(read('locales/en.default.json'));
const escape = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const warnings = new Set();

function prepare(source) {
  return source.replace(/{%-?\s*(schema|doc|comment)\s*-?%}[\s\S]*?{%-?\s*end\1\s*-?%}/g,'')
    .replace(/{%-?\s*style\s*-?%}/g,'<style>').replace(/{%-?\s*endstyle\s*-?%}/g,'</style>')
    .replace(/{%-?\s*stylesheet\s*-?%}[\s\S]*?{%-?\s*endstylesheet\s*-?%}/g,'')
    .replace(/{%-?\s*javascript\s*-?%}[\s\S]*?{%-?\s*endjavascript\s*-?%}/g,'')
    .replace(/{%-?\s*paginate\s+.*?-?%}/g,'').replace(/{%-?\s*endpaginate\s*-?%}/g,'')
    .replace(/{%-?\s*form\s+([^%]*?)-?%}/g,(_,args) => {
      const id = args.match(/\bid:\s*('[^']*'|"[^"]*"|[\w.]+)/)?.[1];
      const cls = args.match(/\bclass:\s*('[^']*'|"[^"]*"|[\w.]+)/)?.[1];
      return `<form action="/preview-only" method="post"${id?` id="{{ ${id} }}"`:''}${cls?` class="{{ ${cls} }}"`:''}>`;
    }).replace(/{%-?\s*endform\s*-?%}/g,'</form>');
}
const engine = new Liquid({root:[path.join(theme,'snippets'),path.join(theme,'sections')],extname:'.liquid',strictFilters:false,strictVariables:false,fs:{
  exists: async file => fs.existsSync(file), existsSync: file => fs.existsSync(file),
  readFile: async file => prepare(fs.readFileSync(file,'utf8')),readFileSync: file => prepare(fs.readFileSync(file,'utf8')),
  resolve: (root,file,ext) => path.resolve(root,file.endsWith(ext)?file:file+ext),
  dirname:path.dirname, sep:path.sep
}});
const flatten = args => Object.fromEntries(args.filter(Array.isArray));
engine.registerFilter('asset_url',file=>'/assets/'+file);
engine.registerFilter('stylesheet_tag',url=>`<link rel="stylesheet" href="${escape(url)}">`);
engine.registerFilter('script_tag',url=>`<script src="${escape(url)}" defer></script>`);
engine.registerFilter('inline_asset_content',file=>fs.existsSync(path.join(theme,'assets',file))?read('assets/'+file):'');
engine.registerFilter('t',(key,...args)=>{
  let value=key.split('.').reduce((obj,k)=>obj?.[k],translations);
  const vars=flatten(args);
  if(typeof value==='object') value=value[vars.count===1?'one':'other'] ?? value.other;
  if(typeof value!=='string') {warnings.add('Missing translation: '+key);return key;}
  return value.replace(/{{\s*(\w+)\s*}}/g,(_,name)=>escape(vars[name] ?? ''));
});
engine.registerFilter('money',cents=>'R '+(Number(cents??0)/100).toFixed(2));
engine.registerFilter('money_with_currency',cents=>'R '+(Number(cents??0)/100).toFixed(2)+' ZAR');
engine.registerFilter('money_without_currency',cents=>(Number(cents??0)/100).toFixed(2));
engine.registerFilter('item_count_for_variant',()=>0);
engine.registerFilter('payment_terms',()=> '');
engine.registerFilter('image_url',(image,...args)=>typeof image==='string'?image:image?.src??'/photo.svg');
engine.registerFilter('image_tag',(src,...args)=>{const opts=flatten(args);return `<img src="${escape(src)}" alt="${escape(opts.alt??'')}" width="800" height="1000"${opts.class?` class="${escape(opts.class)}"`:''} loading="${opts.loading??'lazy'}">`;});
engine.registerFilter('placeholder_svg_tag',(_name,cls)=>`<svg class="${escape(cls??'placeholder-svg')}" viewBox="0 0 800 1000" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Photo placeholder"><rect width="800" height="1000" fill="#efe9e3"/><text x="400" y="510" fill="#6f6671" text-anchor="middle" font-family="Arial" font-size="24" letter-spacing="5">PHOTO</text></svg>`);
for (const filter of ['font_face','font_url','font_modify','structured_data','standard_event_data','payment_type_svg_tag','payment_button','default_errors']) engine.registerFilter(filter,()=> '');
engine.registerFilter('color_brightness',()=>200);
engine.registerFilter('color_lighten',v=>v);
engine.registerFilter('color_darken',v=>v);
engine.registerFilter('color_to_rgb',()=> 'rgb(46,26,51)');
engine.registerFilter('link_to',(text,link)=>`<a href="${escape(link)}">${text}</a>`);

const photo={src:'/photo.svg',alt:'Product photograph placeholder',width:800,height:1000,aspect_ratio:.8,media_type:'image'};
const products=Array.from({length:8},(_,i)=>{
  const id=i+1, price=(i+1)*15000;
  const available=i!==3;
  const variant={id:100+id,title:'Default Title',available,price,compare_at_price:i%3===0?price+5000:null,featured_media:{...photo,id},quantity_rule:{min:1,increment:1,max:null},inventory_management:'shopify',inventory_policy:'deny',inventory_quantity:available?12:0,quantity_price_breaks:[]};
  return {id,title:['Everyday essential','A moment for you','Something to share','Your next favourite','A little discovery','Everyday comfort','Thoughtful essentials','Private moments'][i],handle:'sample-'+id,url:'/product.html',vendor:'Vibe-ration',description:'<p>A sample product for reviewing the design. Product details, specifications and photography will be supplied before launch.</p>',price,price_min:price,price_max:price,price_varies:false,compare_at_price:variant.compare_at_price,compare_at_price_varies:false,available,featured_media:{...photo,id},featured_image:photo,media:[{...photo,id,position:1,preview_image:photo}],images:[photo],variants:[variant],variants_count:1,selected_or_first_available_variant:variant,selected_variant:variant,has_only_default_variant:true,options:['Title'],options_with_values:[],tags:i===1?['best-seller']:i===2?['new']:[],metafields:{reviews:{}},requires_selling_plan:false,selling_plan_groups:[], 'quantity_price_breaks_configured?':false};
});
const collection={id:1,title:'Explore the collection',description:'<p>Considered essentials. Take a moment to find your favourites.</p>',url:'/collection.html',products,products_count:products.length,all_products_count:products.length,filters:[],sort_options:[{value:'manual',name:'Featured'},{value:'price-ascending',name:'Price, low to high'}],sort_by:'manual',default_sort_by:'manual'};
const navigation=[{title:'Shop all',url:'/collection.html',links:[]},{title:'About us',url:'/about.html',links:[]},{title:'Help',url:'/help.html',links:[]}];
const menus={'main-menu':{links:navigation},footer:{links:[{title:'Contact us',url:'/contact.html',links:[]},{title:'Help centre',url:'/help.html',links:[]}]}};
const policy={title:'Privacy policy',url:'/help.html'};
const routes={root_url:'/',all_products_collection_url:'/collection.html',collections_url:'/collection.html',cart_url:'/cart.html',cart_add_url:'/cart/add',cart_change_url:'/cart/change',cart_update_url:'/cart/update',predictive_search_url:'/search/suggest',search_url:'/search.html',account_login_url:'/account',account_url:'/account'};
const item={...products[0],index:1,key:'sample-cart-item',quantity:1,product:products[0],variant:products[0].variants[0],image:photo,original_price:15000,final_price:15000,original_line_price:15000,final_line_price:15000,url:'/product.html',options_with_values:[],properties:{},discounts:[],line_level_discount_allocations:[],requires_shipping:true};
const context={settings:{...data},shop:{name:'Vibe-ration',url:'http://localhost:4173',description:'Considered essentials for your private moments.',currency:'ZAR',money_format:'R {{amount}}',policies:[policy],privacy_policy:policy,refund_policy:{title:'Refund policy',url:'/help.html'},shipping_policy:{title:'Shipping policy',url:'/help.html'},terms_of_service:{title:'Terms of service',url:'/help.html'},enabled_payment_types:[],customer_accounts_enabled:false,brand:{}},routes,cart:{items:[item],item_count:1,total_price:15000,original_total_price:15000,total_discount:0,cart_level_discount_applications:[],requires_shipping:true,taxes_included:false,currency:{iso_code:'ZAR'},attributes:{}},product:products[0],collection,collections:{all:collection},linklists:menus,localization:{available_countries:[{iso_code:'ZA',name:'South Africa'}],available_languages:[{iso_code:'en',name:'English'}],country:{iso_code:'ZA',currency:{iso_code:'ZAR',symbol:'R'}},language:{iso_code:'en'}},request:{locale:{iso_code:'en'},origin:'http://localhost:4173',design_mode:false,page_type:'index'},form:{errors:null,posted_successfully:false},paginate:{pages:1,current_page:1,items:8,parts:[]},recommendations:{performed:true,products:products.slice(4)},search:{performed:true,results:products,results_count:products.length,terms:'essentials',types:['product'],sort_options:[],filters:[]},page:{title:'About us',content:''},template:{name:'index'},current_page:1,content_for_header:'',canonical_url:'http://localhost:4173',page_title:'Vibe-ration',page_description:'Considered essentials for your private moments.'};

context.settings.type_body_font = {family:'system-ui',fallback_families:'sans-serif',style:'normal',weight:400,'system?':true};
context.settings.type_header_font = {family:'Georgia',fallback_families:'serif',style:'normal',weight:400,'system?':true};
context.pages = Object.fromEntries(['about','help','contact'].map(name=>[name,{url:`/${name}.html`,title:name}]));
context.recommendations.products_count = context.recommendations.products.length;
for (const product of products) product.object_type = 'product';
collection.filters = [{type:'list',label:'Availability',param_name:'filter.v.availability',active_values:[],values:[{label:'In stock',value:'1',count:7,param_name:'filter.v.availability',active:false,url_to_add:'/collection.html?filter.v.availability=1'},{label:'Out of stock',value:'0',count:1,param_name:'filter.v.availability',active:false,url_to_add:'/collection.html?filter.v.availability=0'}],url_to_remove:'/collection.html'}];

function resourceSettings(schema,values={}) {
  const result={};
  for(const s of schema??[]) {
    let v=values[s.id]??s.default;
    if(s.type==='collection') v=collection;
    if(s.type==='link_list') v=menus[v]??{links:[]};
    if(s.type==='url' && typeof v==='string') v=v.replace('shopify://collections/all','/collection.html').replace('shopify://pages/','/').replace(/\/(about|help|contact)$/, '/$1.html');
    if(v!==undefined) result[s.id]=v;
  }
  return result;
}
async function renderSection(id,config,ctx) {
  if(config.disabled) return '';
  const source=read('sections/'+config.type+'.liquid');
  const schema=JSON.parse(source.match(/{%-?\s*schema\s*-?%}([\s\S]*?){%-?\s*endschema\s*-?%}/)?.[1]??'{}');
  const blocks=(config.block_order??[]).map(key=>{
    const block=config.blocks[key];
    const bs=schema.blocks?.find(b=>b.type===block.type);
    return {id:key,type:block.type,settings:resourceSettings(bs?.settings,block.settings),shopify_attributes:`data-preview-block="${key}"`};
  });
  const section={id,settings:resourceSettings(schema.settings,config.settings),blocks,index:1,location:'template'};
  engine.options.globals = {...ctx,section};
  return `<div id="shopify-section-${id}" class="shopify-section ${schema.class??''}">${await engine.parseAndRender(prepare(source),{...ctx,section})}</div>`;
}
async function renderGroup(file,ctx){const group=JSON.parse(read(file));let html='';for(const id of group.order) html+=await renderSection(id,group.sections[id],ctx);return html;}
const pages=[['index','index'],['collection','collection'],['product','product'],['cart','cart'],['about','page.about'],['help','page.help'],['contact','page.contact'],['404','404'],['search','search']];
const paletteCss=Object.entries(data.color_schemes).map(([id,{settings:s}])=>{
  const rgb=hex=>hex.replace('#','').match(/../g).map(x=>parseInt(x,16)).join(',');
  return `${id==='scheme-1'?':root, ':''}.color-${id}{--color-background:${rgb(s.background)};--gradient-background:${s.background};--color-foreground:${rgb(s.text)};--color-button:${rgb(s.button)};--color-button-text:${rgb(s.button_label)};--color-secondary-button:${rgb(s.background)};--color-secondary-button-text:${rgb(s.secondary_button_label)};--color-link:${rgb(s.secondary_button_label)};--color-badge-foreground:${rgb(s.text)};--color-badge-background:${rgb(s.background)};--color-shadow:36,29,38;--color-background-contrast:228,220,212;}`;
}).join('\n');

for(const [name,file] of pages){
  const template=JSON.parse(read(`templates/${file}.json`));
  const ctx={...context,template:{name:file.split('.')[0],suffix:file.split('.')[1]??''},request:{...context.request,page_type:file.split('.')[0],path:name==='index'?'/':`/${name}.html`},page:{title:name[0].toUpperCase()+name.slice(1),content:''}};
  let content='';
  for(const id of template.order) content+=await renderSection(id,template.sections[id],ctx);
  let layout=prepare(read('layout/theme.liquid'));
  layout=layout.replace(/{%-?\s*sections\s+'header-group'\s*-?%}/g,await renderGroup('sections/header-group.json',ctx));
  layout=layout.replace(/{%-?\s*sections\s+'footer-group'\s*-?%}/g,await renderGroup('sections/footer-group.json',ctx));
  layout=layout.replace(/{%-?\s*section\s+'([^']+)'\s*-?%}/g,'');
  engine.options.globals = ctx;
  let html=await engine.parseAndRender(layout,{...ctx,content_for_layout:content});
  html=html.replace(/<script type="module">[\s\S]*?<\/script>/g,'');
  html=html.replace('<head>',`<head><script>window.Shopify={designMode:false};window.StandardEvents={createViewEventElement:(Base=HTMLElement)=>class extends Base{connectedCallback(){}},PageViewEvent:Event};</script>`);
  html=html.replace('</head>',`<style>${paletteCss}\n[class*="color-scheme-"] { color: rgba(var(--color-foreground), .85); }</style></head>`);
  html=html.replace('<body ', '<body data-local-preview="true" ');
  html=html.replace('</body>',`<script>document.addEventListener('submit',e=>{e.preventDefault();alert('Design preview only. Forms and checkout will be tested after the Shopify store is connected.');},true);</script></body>`);
  fs.writeFileSync(path.join(output,name+'.html'),html);
}
fs.writeFileSync(path.join(output,'photo.svg'),`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#efe9e3"/><text x="400" y="510" fill="#6f6671" text-anchor="middle" font-family="Arial" font-size="24" letter-spacing="5">PHOTO</text></svg>`);
fs.writeFileSync(path.join(theme,'tools','preview-render.json'),JSON.stringify({renderer:'LiquidJS with local Shopify object/filter fixtures',pages:pages.map(p=>p[0]),warnings:[...warnings],limitations:['Local fixtures are design samples, not store content.','Shopify forms, Ajax cart, predictive search, filters, variant updates and checkout require connected-store testing.','Native Shopify output may differ; repeat responsive checks on the connected theme.']},null,2));
console.log('Rendered '+pages.length+' pages from the actual theme.');
if(process.argv.includes('--serve')) {
  http.createServer((req,res)=>{
    const url=new URL(req.url,'http://localhost');
    let file=url.pathname.startsWith('/assets/')?path.join(theme,url.pathname):path.join(output,url.pathname==='/'?'index.html':url.pathname);
    if(!file.startsWith(theme+path.sep)&&!file.startsWith(output+path.sep)){res.writeHead(403);res.end();return;}
    if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not available in local design preview');return;}
    const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml'}[path.extname(file)]??'application/octet-stream';
    res.writeHead(200,{'Content-Type':mime});fs.createReadStream(file).pipe(res);
  }).listen(4173,'127.0.0.1',()=>console.log('Local design preview: http://127.0.0.1:4173'));
}

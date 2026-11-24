const $=id=>document.getElementById(id);
let products=[];try{products=JSON.parse($("data").textContent||"[]")}catch(e){}
try{if(localStorage.getItem("insta-store-admin2")==="1"){const lp=localStorage.getItem("insta-store-products");if(lp){const a=JSON.parse(lp);if(Array.isArray(a))products=a}}}catch(e){}
const DEF={title:"Today Special Deals 🔥",sub:"Shop your favourite products with one tap",show:true,theme:"sunset",deals:[]};
const THEMES={sunset:"linear-gradient(120deg,#232f3e,#ff9900)",ocean:"linear-gradient(120deg,#19549b,#19c3b4)",berry:"linear-gradient(120deg,#a02a8f,#ff6b9a)",forest:"linear-gradient(120deg,#1f7a4c,#a6d94a)",night:"linear-gradient(120deg,#2b2b6b,#7a5cff)"};
let cfg=Object.assign({},DEF);try{Object.assign(cfg,JSON.parse($("cfg").textContent||"{}"))}catch(e){}
try{if(localStorage.getItem("insta-store-admin2")==="1"){const lc=localStorage.getItem("insta-store-cfg");if(lc)Object.assign(cfg,JSON.parse(lc))}}catch(e){}
let cbCat=null,cbrand="",ctab="Products";let heroSig="";
let flt={min:0,max:0,off:0},view="Home",isOwner=false,art=null,cat="All",user=null,pendingPhone="",otp="",tries=0,cool=null,pendingUrl="";
const U_KEY="insta-store-user";
let custView=false,animNext=true;function ownerMode(){return isOwner&&!custView}
/* in-page dialogs (browser confirm/prompt do not work inside the viewer) */
let dgRes=null;
function dlg(msg,withInput,def){return new Promise(res=>{dgRes=res;$("dgm").textContent=msg;$("dgi").hidden=!withInput;$("dgi").value=def||"";$("dg").classList.add("open");if(withInput)setTimeout(()=>$("dgi").focus(),50)})}
function dgDone(v){$("dg").classList.remove("open");const r=dgRes;dgRes=null;if(r)r(v)}
$("dgy").onclick=()=>dgDone($("dgi").hidden?true:$("dgi").value);
$("dgn").onclick=()=>dgDone($("dgi").hidden?false:null);
const askConfirm=m=>dlg(m,false),askInput=(m,d)=>dlg(m,true,d);
const FY="For You",H_KEY="insta-store-history";
const CATS=["Mobiles","Electronics","Appliances","Kids & Toys","Furniture","Beauty","Books"];
const KW={"Mobiles":["mobile","phone","smartphone","iphone","redmi"],"Electronics":["earbud","headphone","speaker","watch","laptop","camera","charger","tv","power bank","bluetooth","gadget"],"Appliances":["mixer","grinder","cooker","fridge","washing","iron","fan","heater","kettle","oven","vacuum"],"Kids & Toys":["toy","kids","baby","doll","lego","puzzle"],"Furniture":["chair","table","sofa","bed","shelf","desk","wardrobe","mattress"],"Beauty":["cream","lipstick","serum","shampoo","makeup","perfume","skin","hair","face"],"Books":["book","novel","notebook","diary"]};
function autoCat(n){for(const c in KW)if(KW[c].some(k=>new RegExp("\\b"+k,"i").test(n)))return c;return ""}
const IC=p=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
const CI={"All":IC('<rect x="3.5" y="3.5" width="7" height="7" rx="2"/><rect x="13.5" y="3.5" width="7" height="7" rx="2"/><rect x="3.5" y="13.5" width="7" height="7" rx="2"/><rect x="13.5" y="13.5" width="7" height="7" rx="2"/>'),[FY]:IC('<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),"Mobiles":IC('<rect x="7" y="2.5" width="10" height="19" rx="2.5"/><path d="M11 18.5h2"/>'),"Electronics":IC('<path d="M4 15v-3a8 8 0 0116 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.8"/><rect x="17" y="14" width="4" height="7" rx="1.8"/>'),"Appliances":IC('<rect x="4" y="2.5" width="16" height="19" rx="2.5"/><circle cx="12" cy="13.5" r="4.5"/><path d="M7.5 6h.01M10.5 6h3"/>'),"Kids & Toys":IC('<circle cx="12" cy="13.5" r="6"/><circle cx="6.5" cy="7.5" r="2.5"/><circle cx="17.5" cy="7.5" r="2.5"/><path d="M10 13h.01M14 13h.01M10.5 16c.9.8 2.1.8 3 0"/>'),"Furniture":IC('<path d="M5 11V8a3 3 0 013-3h8a3 3 0 013 3v3"/><path d="M3 13a2 2 0 014 0v2h10v-2a2 2 0 014 0v5H3z"/><path d="M6 18v2M18 18v2"/>'),"Beauty":IC('<rect x="8" y="13" width="8" height="8" rx="1.5"/><path d="M10 13V8l4-4.5V13"/>'),"Books":IC('<path d="M12 6.5C10 5 7 4.5 4 4.5v14c3 0 6 .5 8 2 2-1.5 5-2 8-2v-14c-3 0-6 .5-8 2z"/><path d="M12 6.5v14"/>')};
function catOf(p){return p.cat&&p.cat!=="General"?p.cat:(autoCat(p.name)||"General")}
function getHist(){try{return JSON.parse(localStorage.getItem(H_KEY)||"[]")}catch(e){return[]}}
function addHist(t){t=t.trim();if(!t)return;let h=getHist().filter(x=>x.toLowerCase()!==t.toLowerCase());h.unshift(t);h=h.slice(0,8);try{localStorage.setItem(H_KEY,JSON.stringify(h))}catch(e){}}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function safeUrl(u){try{const x=new URL(u);return(x.protocol==="http:"||x.protocol==="https:")?x.href:""}catch(e){return""}}
function num(v){return parseFloat(String(v).replace(/[^\d.]/g,""))||0}
function fmt(v){return "₹"+num(v).toLocaleString("en-IN")}
function find(id){return products.find(p=>String(p.id)===String(id))}
function toast(t,ms){const e=$("toast");e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>{e.hidden=true},ms||2500)}
function offTxt(p){const m=num(p.mrp),pr=num(p.price);return m>pr&&pr>0?`<span class="mrp">${fmt(m)}</span> <span class="off">${Math.round((m-pr)/m*100)}% off</span>`:""}
function btnTxt(){return "Buy Now"}

function renderOd(){const el=$("od");if(!ownerMode()){el.innerHTML="";return}
  const t=products.length,o=products.filter(x=>x.stock==="out").length,c=new Set(products.map(catOf)).size;
  el.innerHTML=`<div class="panel"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap"><div><b style="font-size:1.15rem">🛠 Owner Dashboard</b><div class="note">Manage products, prices and stock</div></div><div style="display:flex;gap:6px;flex-wrap:wrap"><button class="or" id="upb">⬆ Upload</button><button class="gh" id="cvb2">👁 Customer view</button></div></div><div class="ostats"><div class="ostat"><b>${t}</b><span>Products</span></div><div class="ostat"><b style="color:#188038">${t-o}</b><span>In stock</span></div><div class="ostat"><b style="color:#d93025">${o}</b><span>Out of stock</span></div><div class="ostat"><b>${c}</b><span>Categories</span></div></div></div>`}
function sets(){if(!Array.isArray(cfg.sets)||!cfg.sets.length)cfg.sets=[{id:"s0",title:cfg.title||DEF.title,sub:cfg.sub||"",theme:cfg.theme||"sunset",show:cfg.show!==false,deals:(cfg.deals||[]).slice()}];return cfg.sets}
function dealCard(p,i,om){
  const m=num(p.mrp),pr=num(p.price),pc=m>pr&&pr>0?Math.round((m-pr)/m*100):0;
  let hl=kv(p.hl);if(!hl.length)hl=kv(p.desc).slice(0,4);
  return `<div class="dc" data-open="${esc(p.id)}"><div class="dci">${p.img?`<img src="${esc(p.img)}" alt="">`:esc(p.emoji||"🛒")}${pc?`<span class="dcb">−${pc}%</span>`:""}</div><div class="dcx"><div class="nm">${esc(p.name)}</div><div><span class="pr">${fmt(p.price)}</span> ${offTxt(p)}</div>${hl.length?`<div class="dhl" data-hl="${esc(JSON.stringify(hl.slice(0,8)))}"></div>`:""}${om?`<button class="gh" data-dr="${esc(p.id)}" data-ds="${i}" style="padding:3px 6px;font-size:.72rem;color:#d93025">✕ Remove</button>`:""}</div></div>`}
function dealBlock(S,i,om){
  const l=(S.deals||[]).map(find).filter(Boolean);
  if(!l.length&&!om)return "";
  const head=i===0?`<h3 style="margin:0 0 10px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">⚡ ${esc(S.title||"Today's picks")}${om?`<button class="gh" data-de="${i}" style="padding:4px 10px;font-size:.8rem">✏️ Edit deals</button>`:""}</h3>`
    :`<div class="dhd t-${THEMES[S.theme]?S.theme:"sunset"}"><b>${esc(S.title||"Special deals")}</b><span>${esc(S.sub||"")}</span>${om?`<button class="gh" data-de="${i}" style="padding:4px 10px;font-size:.8rem;color:#fff;border-color:rgba(255,255,255,.6);justify-self:start;margin-top:6px">✏️ Edit deals</button>`:""}</div>`;
  return `<div class="panel dblk">${head}${l.length?`<div class="dscr">${l.map(p=>dealCard(p,i,om)).join("")}</div>`:'<div class="note">No products picked yet.</div>'}</div>`}
/* rotate each card's highlights with different animations */
function tickHl(first){document.querySelectorAll(".dhl").forEach(el=>{let a;try{a=JSON.parse(el.dataset.hl)}catch(e){return}if(!a.length)return;
  el._i=first||el._i===undefined?0:((el._i+1)%a.length);const it=a[el._i];
  el.className="dhl a"+(((el._n=(el._n||0)+1)+(el._s||(el._s=Math.floor(Math.random()*6))))%6);
  el.innerHTML=`<div class="hi">${it[0]?`<div class="hk">${esc(it[0])}</div>`:""}<b>${esc(it[1])}</b></div>`})}
setInterval(()=>{if(!document.hidden)tickHl(false)},2600);
function renderHero(){
  const om=ownerMode(),SS=sets(),S0=SS[0],q=$("q").value.trim(),strp=cat==="All"&&!q;
  const dl=SS.map(x=>(x.deals||[]).map(find).filter(Boolean).map(p=>[p.id,p.name,p.price,p.mrp,p.stock,!!p.img,p.hl,p.emoji]));
  const sig=JSON.stringify([cfg,om,view,strp,dl]);if(sig===heroSig)return;heroSig=sig;
  $("hero").hidden=(view!=="Home")||(S0.show===false&&!om);
  $("hero").className="hero t-"+(THEMES[S0.theme]?S0.theme:"sunset");
  $("hT").textContent=S0.title||DEF.title;$("hS").textContent=S0.sub||"";
  $("hE").innerHTML=om?`<button id="hEdit" style="background:rgba(255,255,255,.22);color:#fff;border:1px solid rgba(255,255,255,.55)">✏️ Customize deals</button>${S0.show===false?' <span style="opacity:.85;font-size:.8rem">(Banner hidden from customers)</span>':""}`:"";
  $("dealstrip").innerHTML=strp?SS.map((x,i)=>dealBlock(x,i,om)).join("")+(om?'<div style="margin-bottom:12px"><button class="or" data-dn="1">+ Add another Today Special Deal</button></div>':""):"";
  tickHl(true)}
function render(){renderOd();renderHero();
  const extra=[...new Set(products.map(catOf))].filter(c=>!CATS.includes(c)&&c!=="General");const cats=["All",FY,...CATS,...extra];
  if(!cats.includes(cat))cat="All";
  $("cats").innerHTML=cats.map(c=>`<button class="chip${c===cat?" on":""}" data-cat="${esc(c)}"><span class="ic">${c in CI?CI[c]:"🏷️"}</span>${esc(c)}</button>`).join("");$("cats").insertAdjacentHTML("afterbegin",'<i class="cind" id="cind"></i>');moveCind();if(window.__cs===undefined)window.__cs=cat;else if(cat!==window.__cs){window.__cs=cat;catPop(cat)}
  const q=$("q").value.trim().toLowerCase();
  const hist=getHist().map(x=>x.toLowerCase());
  const hay=p=>(p.name+" "+catOf(p)+" "+(p.desc||"")).toLowerCase();
  const real=cat!=="All"&&cat!==FY;if(cat!==cbCat){cbCat=cat;cbrand="";ctab="Products"}
  const bm=new Map();if(real)products.filter(p=>catOf(p)===cat).forEach(p=>{const nm=(p.brand||"").trim();if(!nm)return;const k=nm.toLowerCase(),e=bm.get(k)||{k,name:nm,n:0,img:"",emoji:p.emoji};e.n++;if(!e.img&&p.img)e.img=p.img;bm.set(k,e)});
  const brands=[...bm.values()].sort((a,b)=>b.n-a.n||a.name.localeCompare(b.name));if(cbrand&&!bm.has(cbrand))cbrand="";
  let list=products.filter(p=>(cat==="All"||(cat===FY?hist.some(h=>hay(p).includes(h)):catOf(p)===cat))&&(!real||!cbrand||(p.brand||"").trim().toLowerCase()===cbrand)&&(!q||hay(p).includes(q))&&passF(p));
  const s=$("so").value;
  if(s==="l")list=[...list].sort((a,b)=>num(a.price)-num(b.price));
  if(s==="h")list=[...list].sort((a,b)=>num(b.price)-num(a.price));
  $("cnt").innerHTML=list.length+" product"+(list.length===1?"":"s")+(q?` • Results for <b>${esc(q)}</b> <button class="rm" data-qclr="1">✕ Clear</button>`:"");
  const hh=getHist();$("hs").innerHTML=cat===FY&&hh.length?'<div style="margin-bottom:10px"><span class="note">Recent searches: </span>'+hh.map(x=>`<button class="gh" style="padding:3px 10px;margin:2px" data-q="${esc(x)}">${esc(x)}</button>`).join("")+'<button class="rm" data-clr="1" style="margin-left:6px">Clear</button></div>':"";
  $("grid").className="grid"+(animNext?"":" still");animNext=false;
  $("grid").innerHTML=list.length?list.map((p,i)=>`<div class="card" data-open="${esc(p.id)}" style="cursor:pointer;--i:${Math.min(i,12)}">
   <div class="img">${p.img?`<img src="${esc(p.img)}" alt="" loading="lazy">`:esc(p.emoji||"🛒")}</div>
   <div class="in"><div class="nm">${esc(p.name)}</div><div class="ct">${esc(p.cat||"General")}${p.seller?" • "+esc(p.seller):""}</div>
   <div><span class="pr">${fmt(p.price)}</span> ${offTxt(p)}</div>${p.rating?`<div class="note">★ ${esc(p.rating)}${p.rc?" ("+esc(p.rc)+")":""}</div>`:""}${p.stock==="out"?'<div class="off" style="font-weight:700">Out of stock</div>':""}${ownerMode()?`<div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px"><button class="gh" data-stk="${esc(p.id)}" style="padding:4px 8px;font-size:.75rem">${p.stock==="out"?"✅ Mark in stock":"⛔ Mark out"}</button><button class="gh" data-px="${esc(p.id)}" style="padding:4px 8px;font-size:.75rem">✏️ Price</button><button class="gh" data-ed="${esc(p.id)}" style="padding:4px 8px;font-size:.75rem">📝 Edit</button><button class="gh" data-del="${esc(p.id)}" style="padding:4px 8px;font-size:.75rem;color:#d93025">🗑 Remove</button></div>`:""}</div></div>`).join(""):'<div class="empty">'+(cat===FY&&!hist.length?"Search for something. Products related to your recent searches will appear here 🔎":"No products found.")+'</div>';
  $("cbar").innerHTML=real?`<div class="ctabs"><button class="ctab${ctab==="Brands"?" on":""}" data-ct="Brands">🏷️ Brands</button><button class="ctab${ctab!=="Brands"?" on":""}" data-ct="Products">${CI[cat]||"🏷️"} ${esc(cat)}</button></div>`+(brands.length?`<div class="brow"><button class="bchip${!cbrand?" on":""}" data-br="">All</button>${brands.map(b=>`<button class="bchip${cbrand===b.k?" on":""}" data-br="${esc(b.k)}">${esc(b.name)}<i>${b.n}</i></button>`).join("")}</div>`:""):"";
  if(real&&ctab==="Brands"){$("cnt").textContent=brands.length+" brand"+(brands.length===1?"":"s");
    $("grid").innerHTML=brands.length?brands.map((b,i)=>`<div class="btile" data-br="${esc(b.k)}" style="--i:${Math.min(i,12)}"><div class="bi">${b.img?`<img src="${esc(b.img)}" alt="" loading="lazy">`:esc(b.emoji||"🏷️")}</div><b>${esc(b.name)}</b><span class="note">${b.n} product${b.n===1?"":"s"}</span></div>`).join(""):'<div class="empty">No brands yet. Add a brand name when you add products in this category.</div>'}
}
function kv(txt){return String(txt||"").split(/\n+/).map(x=>x.trim()).filter(Boolean).map(l=>{const i=l.indexOf(":");return i>0&&i<45?[l.slice(0,i).trim(),l.slice(i+1).trim()]:["",l]})}
function stars(r){const n=Math.max(0,Math.min(5,Math.round(num(r))));return "★".repeat(n)+"☆".repeat(5-n)}
function openDetail(id){
  const p=find(id);if(!p)return;
  const pr=num(p.price),m=num(p.mrp),sv=m>pr?m-pr:0,pc=sv?Math.round(sv/m*100):0,out=p.stock==="out";
  const about=String(p.desc||"").split(/\n+/).map(x=>x.trim()).filter(Boolean),hl=kv(p.hl),sp=kv(p.spec);
  const host=(()=>{try{return new URL(p.link).hostname.replace(/^www\./,"")}catch(e){return ""}})();
  const dl=new Date(Date.now()+4*864e5).toLocaleDateString("en-IN",{weekday:"short",day:"numeric",month:"short"});
  const q=encodeURIComponent((p.brand&&!p.name.toLowerCase().includes(p.brand.toLowerCase())?p.brand+" ":"")+p.name+" price history");
  const rows=[...(p.brand?[["Brand",p.brand]]:[]),...(p.color?[["Colour",p.color]]:[]),...(p.size?[["Size",p.size]]:[]),...sp.map(r=>[r[0]||"Detail",r[1]]),["Category",catOf(p)],...((p.seller||host)?[["Seller site",p.seller||host]]:[])];
  $("pvb").innerHTML=`<div class="pvhero">${p.img?`<img src="${esc(p.img)}" alt="">`:`<span style="font-size:6rem">${esc(p.emoji||"🛒")}</span>`}${pc?`<span class="pvb1">−${pc}%</span>`:""}<span class="pvb2 ${out?"out":"in"}">${out?"Out of stock":"In stock"}</span></div>
  <div class="pvbody">
  <div style="display:flex;gap:6px;flex-wrap:wrap"><span class="pill">${esc(catOf(p))}</span>${(p.seller||host)?`<span class="pill">🛍️ ${esc(p.seller||host)}</span>`:""}${out?"":`<span class="pill">🚚 By ${esc(dl)}</span>`}</div>
  <div>${p.brand?`<div class="note" style="color:#3aa0b8;font-weight:600">${esc(p.brand)}</div>`:""}<h2 style="margin:2px 0 0;font-size:1.25rem;font-weight:700;line-height:1.3">${esc(p.name)}</h2></div>
  ${p.rating?`<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="rp">${esc(p.rating)} ★</span><span style="color:#ffa41c;letter-spacing:1px">${stars(p.rating)}</span><span class="note">${esc(p.rc||"")}</span></div>`:""}
  <div><span class="pvpr">${fmt(pr)}</span>${m>pr?` <span class="mrp" style="font-size:1rem">${fmt(m)}</span> <span class="off" style="font-weight:700">${pc}% off</span><div class="note">You save ${fmt(sv)} • Inclusive of all taxes</div>`:`<div class="note">Inclusive of all taxes</div>`}</div>
  ${ownerMode()?`<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="gh" data-stk="${esc(p.id)}">🔁 Mark as ${out?"In stock":"Out of stock"}</button><button class="gh" data-px="${esc(p.id)}">✏️ Update price</button><button class="gh" data-ed="${esc(p.id)}">📝 Edit details</button></div>`:""}
  ${(p.color||p.size)?`<div style="display:flex;gap:8px;flex-wrap:wrap">${p.color?`<span class="pill">🎨 Colour: <b>${esc(p.color)}</b></span>`:""}${p.size?`<span class="pill">📐 Size: <b>${esc(p.size)}</b></span>`:""}</div>`:""}
  ${hl.length?`<div><b>Top highlights</b><div class="hlg" style="margin-top:8px">${hl.map(r=>`<div class="hlt">${r[0]?`<span>${esc(r[0])}</span>`:""}<b>${esc(r[1])}</b></div>`).join("")}</div></div>`:""}
  <div class="panel" style="margin:0"><b>About this item</b>${about.length?(about.length>1?'<ul style="margin:8px 0 0;padding-left:18px;display:grid;gap:4px">'+about.map(x=>"<li>"+esc(x)+"</li>").join("")+"</ul>":'<div style="margin-top:6px;white-space:pre-wrap">'+esc(about[0])+"</div>"):'<div class="note" style="margin-top:6px">No details available.</div>'}</div>
  <div><b>Specifications</b><div class="spt" style="margin-top:8px">${rows.map(r=>`<span class="note">${esc(r[0])}</span><span>${esc(r[1])}</span>`).join("")}</div></div>
  <details class="sd" style="margin:0"><summary>📈 Price history (tap)</summary><div class="sx">${histHtml(p)}
  <div class="note" style="margin-top:8px">Only prices updated on this website are shown here. Google results can't be shown inside this page, so the button below opens Google.</div>
  <a href="https://www.google.com/search?q=${q}" target="_blank" rel="noopener"><button class="gh" type="button" style="margin-top:8px;width:100%">🔎 View price history on Google</button></a></div></details>
  </div>
  <div class="pvbar">${out?`<button class="yl" disabled>Currently unavailable</button>`:`<button class="or" data-cart="${esc(p.id)}">🛒 Add to Cart</button><button class="yl" data-buy="${esc(p.id)}">${btnTxt()}</button>`}</div>`;
  $("pv").classList.add("open");$("pvb").scrollTop=0;
}
function buy(id){
  const p=find(id);if(!p)return;if(p.stock==="out"){toast("Out of stock 😔");return}const u=safeUrl(p.link);if(!u){toast("Invalid link");return}
  
  window.open(u,"_blank","noopener");logOrder(p);
}
document.addEventListener("click",e=>{
  const t=e.target.closest&&e.target.closest("[data-buy],[data-open],[data-del],[data-cat],[data-q],[data-clr],[data-stk],[data-px],[data-qclr],[data-ed],[data-ct],[data-br]");if(!t)return;
  if(t.dataset.buy)buy(t.dataset.buy);
  else if(t.dataset.ed){if(isOwner)openEdit(t.dataset.ed)}
  else if(t.dataset.ct){ctab=t.dataset.ct;animNext=true;render()}
  else if(t.dataset.br!==undefined){cbrand=t.dataset.br;ctab="Products";animNext=true;render()}
  else if(t.dataset.open)openDetail(t.dataset.open);
  else if(t.dataset.cat){cat=t.dataset.cat;animNext=true;render()}
  else if(t.dataset.q){$("q").value=t.dataset.q;render()}
  else if(t.dataset.qclr){$("q").value="";render()}
  else if(t.dataset.clr){try{localStorage.removeItem(H_KEY)}catch(x){}render()}
  else if(t.dataset.del&&isOwner){const p=find(t.dataset.del);if(p)askConfirm("Remove: "+p.name+"?").then(ok=>{if(ok){products=products.filter(x=>x!==p);render();publish()}})}
});
$("sf").addEventListener("submit",e=>{e.preventDefault();addHist($("q").value);render()});
$("q").addEventListener("input",render);$("so").addEventListener("change",render);
$("px").onclick=()=>$("pv").classList.remove("open");

/* ---- Owner-only publishing ---- */
async function publish(){
  if(!isOwner){toast("Only the owner can save");return}
  if(!art){try{localStorage.setItem("insta-store-products",JSON.stringify(products));localStorage.setItem("insta-store-cfg",JSON.stringify(cfg))}catch(e){}
    toast("Saved ✅ Ellarukum kaata ⬆ Upload button tap pannunga",4500);return}
  const c=document.documentElement.cloneNode(true);
  c.querySelector("#data").textContent=JSON.stringify(products).replace(/</g,"\\u003c");c.querySelector("#cfg").textContent=JSON.stringify(cfg).replace(/</g,"\\u003c");
  ["grid","auth","cats","pvb","hs","bg","cb","wb","ab"].forEach(i=>{c.querySelector("#"+i).innerHTML=""});
  c.querySelector("#loc").textContent="";["#catpop","#glow"].forEach(q=>{const x=c.querySelector(q);if(x)x.remove()});c.querySelector("#fp").hidden=true;c.querySelector("#cc").hidden=true;
  c.querySelectorAll("main[id^=v]").forEach(m=>{m.hidden=m.id!=="vHome"});c.querySelector("#hero").hidden=false;c.querySelector("#cats").hidden=false;
  c.querySelectorAll("#bn button").forEach(b=>b.classList.toggle("on",b.dataset.v==="Home"));
  ["cnt","e1","e2","e4","demo","sent","toast"].forEach(i=>{c.querySelector("#"+i).textContent=""});
  c.querySelectorAll(".ov").forEach(o=>o.classList.remove("open"));
  c.querySelectorAll(".pwx").forEach(w=>{const i=w.querySelector("input");i.type="password";i.style.paddingRight="";w.replaceWith(i)});
  c.querySelector("#adm").hidden=true;c.querySelector("#toast").hidden=true;c.querySelector("#olk").hidden=false;c.querySelector("body").classList.remove("om");c.querySelector("#od").innerHTML="";c.querySelector("#od").hidden=true;c.querySelector("#hE").innerHTML="";c.querySelector("#dealstrip").innerHTML="";
  c.querySelector("#s1").hidden=false;c.querySelector("#s2").hidden=true;c.querySelector("#s3").hidden=true;c.querySelector("#s4").hidden=true;
  toast("Saving...",6000);
  try{await art.publish("<!DOCTYPE html>\n"+c.outerHTML)}catch(e){toast("Could not save: "+((e&&e.code)||"error"),4000)}
}
(async()=>{
  try{if(window.claude){const u=await claude.use("user");const co=!!(u&&u.isOwner());isOwner=co||adminOn;if(co)art=await claude.use("artifact");}}catch(e){}
  $("adm").hidden=!isOwner;paintAuth();
})();
$("adm").onclick=()=>{if(editId!==null)clearForm();$("ad").classList.add("open")};
$("ax").onclick=()=>$("ad").classList.remove("open");
function readImg(file){return new Promise(res=>{
  if(!file)return res("");
  const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{
    const k=Math.min(1,500/Math.max(im.width,im.height)),w=Math.round(im.width*k),h=Math.round(im.height*k);
    const cv=document.createElement("canvas");cv.width=w;cv.height=h;cv.getContext("2d").drawImage(im,0,0,w,h);res(cv.toDataURL("image/jpeg",.8))};
    im.onerror=()=>res("");im.src=r.result};
  r.onerror=()=>res("");r.readAsDataURL(file)})}
/* ---- Auto details from product link + Amazon search (best effort via public CORS proxies) ---- */
let autoImg="",aTimer=null,aSeq=0;
const PROXIES=[u=>"https://api.allorigins.win/raw?url="+encodeURIComponent(u),u=>"https://corsproxy.io/?url="+encodeURIComponent(u)];
async function viaProxy(u,asBlob){let last;for(const px of PROXIES){try{const c=new AbortController(),t=setTimeout(()=>c.abort(),12000);const r=await fetch(px(u),{signal:c.signal});clearTimeout(t);if(!r.ok)throw new Error(r.status);return asBlob?await r.blob():await r.text()}catch(e){last=e}}throw last}
const tx=e=>e?(e.textContent||"").replace(/[‎‏]/g,"").replace(/\s+/g," ").trim():"";
function isBlocked(h){return !h||/api-services-support@amazon|Enter the characters you see below|Robot Check|Type the characters you see/i.test(h)}
function extract(html,base){
  const d=new DOMParser().parseFromString(html,"text/html");
  const m=q=>{const e=d.querySelector(q);return e?(e.getAttribute("content")||"").trim():""};
  const o={img:"",name:"",desc:"",price:"",brand:"",rating:"",rc:"",color:"",size:"",hl:[],about:[],spec:[]};
  d.querySelectorAll('script[type="application/ld+json"]').forEach(sc=>{try{const j=JSON.parse(sc.textContent);[].concat(j["@graph"]||j).forEach(x=>{
    if(x&&/Product/.test([].concat(x["@type"]).join())){
      o.name=o.name||String(x.name||"");o.brand=o.brand||String((x.brand&&(x.brand.name||x.brand))||"");
      o.color=o.color||(typeof x.color==="string"?x.color:"");o.size=o.size||(typeof x.size==="string"?x.size:"");
      const ar=x.aggregateRating;if(ar){o.rating=o.rating||String(ar.ratingValue||"");o.rc=o.rc||String(ar.reviewCount||ar.ratingCount||"")}
      const of=[].concat(x.offers||[])[0];if(of&&!o.price)o.price=String(of.price||of.lowPrice||"");
      if(!o.desc&&x.description)o.desc=String(x.description);
      const im=[].concat(x.image||[])[0];if(im&&!o.img)o.img=typeof im==="string"?im:String(im.url||"")}})}catch(e){}});
  o.img=o.img||m('meta[property="og:image"]')||m('meta[property="og:image:secure_url"]')||m('meta[name="twitter:image"]');
  if(!o.img){const li=d.querySelector("#landingImage,#imgBlkFront");if(li)o.img=li.getAttribute("data-old-hires")||li.getAttribute("src")||""}
  if(!o.img){const mm=html.match(/"hiRes":"(https:[^"]+)"/)||html.match(/data-old-hires="(https:[^"]+)"/)||html.match(/"large":"(https:[^"]+)"/);if(mm)o.img=mm[1]}
  try{if(o.img)o.img=new URL(o.img,base).href}catch(e){o.img=""}
  const t=tx(d.querySelector("#productTitle"));
  o.name=(t||o.name||m('meta[property="og:title"]')||m('meta[name="twitter:title"]')||tx(d.querySelector("title"))).slice(0,150);
  o.desc=o.desc||m('meta[property="og:description"]')||m('meta[name="description"]');
  o.price=o.price||m('meta[property="product:price:amount"]')||m('meta[property="og:price:amount"]')||m('meta[itemprop="price"]');
  const by=tx(d.querySelector("#bylineInfo"));if(by&&!o.brand)o.brand=by.replace(/^Visit the\s+/i,"").replace(/\s+Store$/i,"").replace(/^Brand:\s*/i,"");
  const pop=d.querySelector("#acrPopover");const rt=(pop&&pop.getAttribute("title"))||tx(d.querySelector("#acrPopover .a-icon-alt"))||tx(d.querySelector("i.a-icon-star .a-icon-alt"));
  const rm=rt.match(/([\d.]+)\s*out of/);if(rm)o.rating=rm[1];
  const rcm=tx(d.querySelector("#acrCustomerReviewText")).match(/[\d,]+/);if(rcm)o.rc=rcm[0];
  o.color=o.color||tx(d.querySelector("#variation_color_name .selection"))||tx(d.querySelector("#inline-twister-expanded-dimension-text-color_name"));
  o.size=o.size||tx(d.querySelector("#variation_size_name .selection"))||tx(d.querySelector("#inline-twister-expanded-dimension-text-size_name"))||tx(d.querySelector("#variation_style_name .selection"));
  d.querySelectorAll("#feature-bullets li span.a-list-item").forEach(e=>{const x=tx(e);if(x.length>3&&!/^Make sure this fits/i.test(x))o.about.push(x)});
  d.querySelectorAll("#productOverview_feature_div tr").forEach(r=>{const c=r.querySelectorAll("td");if(c.length>1&&tx(c[0])&&tx(c[1]))o.hl.push(tx(c[0])+": "+tx(c[1]))});
  d.querySelectorAll("#productDetails_techSpec_section_1 tr,#productDetails_techSpec_section_2 tr,#productDetails_detailBullets_sections1 tr,#technicalSpecifications_section_1 tr").forEach(r=>{const k=tx(r.querySelector("th")),v=tx(r.querySelector("td"));if(k&&v&&!/customer reviews|best sellers rank/i.test(k))o.spec.push(k+": "+v)});
  if(!o.spec.length)d.querySelectorAll("#detailBullets_feature_div li").forEach(li=>{const x=tx(li).replace(/\s*:\s*/,": ");if(x.includes(": ")&&!/customer reviews|best sellers rank/i.test(x))o.spec.push(x)});
  o.spec=o.spec.slice(0,30);o.hl=o.hl.slice(0,10);o.about=o.about.slice(0,10);
  const find=(re)=>{for(const l of o.spec.concat(o.hl)){const i=l.indexOf(": ");if(i>0&&re.test(l.slice(0,i)))return l.slice(i+2)}return ""};
  o.brand=o.brand||find(/^brand/i);o.color=o.color||find(/^colou?r/i);o.size=o.size||find(/^size/i);
  if(/^\d+$/.test(o.rc))o.rc=Number(o.rc).toLocaleString("en-IN");
  if(!o.about.length&&o.desc)o.about=[o.desc.slice(0,300)];
  return o}
async function amazonLookup(name){
  const q=name.replace(/[^\w\s]/g," ").trim().split(/\s+/).slice(0,8).join("+");if(!q)throw new Error("noname");
  const h=await viaProxy("https://www.amazon.in/s?k="+q,false);if(isBlocked(h))throw new Error("blocked");
  const mm=h.match(/\/dp\/([A-Z0-9]{10})/);if(!mm)throw new Error("nomatch");
  const u="https://www.amazon.in/dp/"+mm[1],pg=await viaProxy(u,false);if(isBlocked(pg))throw new Error("blocked");
  return extract(pg,u)}

/* ---- web search fallback (DuckDuckGo / Bing via public proxy; Google blocks browser requests) ---- */
async function webSearch(q){
  const enc=encodeURIComponent(q);
  for(const [u,k] of [["https://html.duckduckgo.com/html/?q="+enc,"d"],["https://www.bing.com/search?q="+enc+"&cc=IN","b"]]){
    try{const h=await viaProxy(u,false),d=new DOMParser().parseFromString(h,"text/html");
      const T=[...d.querySelectorAll(k==="d"?".result__a":"li.b_algo h2")].map(tx).filter(Boolean);
      const S=[...d.querySelectorAll(k==="d"?".result__snippet":"li.b_algo .b_caption p")].map(tx).filter(x=>x.length>30);
      if(T.length||S.length)return{t:T.slice(0,6),s:S.slice(0,6)}}catch(e){}}
  return null}
function slugName(u){try{let best="";new URL(u).pathname.split("/").filter(Boolean).forEach(x=>{if(/[a-z]{3,}[-_+][a-z]/i.test(x)&&x.length>best.length)best=x});return decodeURIComponent(best).replace(/[-_+]+/g," ").replace(/\.(html?|php)$/i,"").trim().slice(0,90)}catch(e){return ""}}
const COLS=["black","white","blue","red","green","yellow","pink","purple","grey","gray","silver","gold","orange","brown","beige","navy","maroon","cyan","violet"];
function guess(n){const l=" "+String(n).toLowerCase()+" ",c=COLS.find(x=>new RegExp("\\b"+x+"\\b").test(l)),sz=String(n).match(/\d+(?:\.\d+)?\s?(?:GB|TB|MB|inch|inches|cm|mm|ml|ltr|litre|kg|gm|g|L)\b/i),w=String(n).trim().split(/\s+/)[0]||"";
  return{color:c?c.charAt(0).toUpperCase()+c.slice(1):"",size:sz?sz[0]:"",brand:/^[A-Za-z][A-Za-z0-9&'-]{1,20}$/.test(w)&&!/^(The|New|Men|Women|Mens|Womens|Pack|Set)$/i.test(w)?w:""}}
const setSt=t=>{$("a_st").textContent=t};
async function autoFetch(){
  const u=safeUrl($("a_l").value.trim());if(!u)return;const my=++aSeq;
  setSt("🔍 Fetching details from the link...");$("a_pv").hidden=true;
  let main=null,az=null;
  try{const h=await viaProxy(u,false);if(!isBlocked(h))main=extract(h,u)}catch(e){}
  if(my!==aSeq)return;
  const isAz=/amazon\.|amzn\./i.test(u),weak=!main||!main.rating||!main.spec.length||!main.about.length;
  if(!isAz||weak){const nm=(main&&main.name)||$("a_n").value.trim();
    if(nm){setSt("🔍 Searching Amazon...");try{az=await amazonLookup(nm)}catch(e){}}}
  if(my!==aSeq)return;
  const g=k=>(main&&main[k])||(az&&az[k])||"",ga=k=>(main&&main[k].length?main[k]:(az&&az[k])||[]);
  const put=(id,v)=>{if(v&&!$(id).value.trim())$(id).value=v};
  let ws=null;const nm0=g("name")||$("a_n").value.trim()||slugName(u);
  if(nm0&&(!main||!g("rating")||!g("brand")||!ga("about").length)){setSt("🔍 Searching the web for details...");ws=await webSearch(nm0)}
  if(my!==aSeq)return;
  if(!main&&!az&&!ws&&!nm0){autoImg="";setSt("⚠️ Couldn't fetch details automatically (the site may be blocking it). Type the product name and tap '🔍 Fetch again', or fill them in yourself.");return}
  const nameF=g("name")||(ws&&ws.t[0]?ws.t[0].replace(/\s*[-|–:]\s*(amazon|flipkart|meesho|myntra|ajio|nykaa|snapdeal|croma)[^]*$/i,"").slice(0,150):"")||nm0;
  const wsAbout=ws?ws.s.slice(0,4):[];
  const wsRating=ws?((ws.s.join(" ")+" "+ws.t.join(" ")).match(/\b([1-5](?:\.\d)?)\s*(?:out of 5|\/\s*5|stars?|★)/i)||[])[1]||"":"";
  const gs=guess(nameF);
  put("a_n",nameF);put("a_b",g("brand")||gs.brand);put("a_rt",g("rating")||wsRating);put("a_rc",g("rc")?(/ratings?$/i.test(g("rc"))?g("rc"):g("rc")+" ratings"):"");
  put("a_co",g("color")||gs.color);put("a_sz",g("size")||gs.size);put("a_hl",ga("hl").join("\n"));put("a_d",(ga("about").length?ga("about"):wsAbout).join("\n"));put("a_sp",ga("spec").join("\n"));
  if(!selManual&&!$("a_sel").value.trim())$("a_sel").value=sellerFrom(u);
  if(main&&num(main.price)>0)put("a_p",String(num(main.price)));
  const im=g("img");let got=false;
  if(im){try{const bl=await viaProxy(im,true);const r=await readImg(bl);if(r){autoImg=r;got=true}}catch(e){}if(!got){autoImg=im;got=true}}
  if(my!==aSeq)return;
  if(got){$("a_pv").src=autoImg;$("a_pv").hidden=false}
  setSt("✅ Details added"+(az&&!(main&&main.rating&&main.spec.length)?" (Amazon search match, please check it is the right product)":"")+". Please check the price and stock."+(got?"":" No photo found, please select one yourself."))}
$("a_l").addEventListener("input",()=>{clearTimeout(aTimer);aSeq++;autoImg="";$("a_pv").hidden=true;setSt("Paste a link and all details are searched and filled automatically.");if(safeUrl($("a_l").value.trim()))aTimer=setTimeout(autoFetch,800)});
$("a_fb").onclick=autoFetch;
const SELLERS={amazon:"Amazon",amzn:"Amazon",flipkart:"Flipkart",fkrt:"Flipkart",meesho:"Meesho",myntra:"Myntra",ajio:"Ajio",nykaa:"Nykaa",snapdeal:"Snapdeal",croma:"Croma",tatacliq:"Tata CLiQ",jiomart:"JioMart",reliancedigital:"Reliance Digital",shopsy:"Shopsy"};
let selManual=false;
function sellerFrom(u){try{const k=new URL(u).hostname.replace(/^www\./,"").split(".");let i=k.length-2;if(i>0&&["co","com","org","net"].includes(k[i]))i--;const b=k[Math.max(0,i)];return SELLERS[b]||SELLERS[k[0]]||b.charAt(0).toUpperCase()+b.slice(1)}catch(e){return ""}}
$("a_sel").addEventListener("input",()=>{selManual=!!$("a_sel").value.trim()});
$("a_l").addEventListener("input",()=>{if(!selManual)$("a_sel").value=sellerFrom(safeUrl($("a_l").value.trim()))});
const FORM_IDS=["a_n","a_c","a_p","a_m","a_l","a_d","a_f","a_b","a_sel","a_rt","a_rc","a_co","a_sz","a_hl","a_sp"];
let editId=null;
function clearForm(){FORM_IDS.forEach(i=>{$(i).value=""});$("a_sk").value="in";selManual=false;autoImg="";$("a_pv").hidden=true;$("a_st").textContent="Paste a link and all details are searched and filled automatically.";editId=null;$("ad_h").textContent="Add Product";$("a_s").textContent="💾 Save"}
function openEdit(id){const p=find(id);if(!p)return;clearForm();editId=p.id;$("pv").classList.remove("open");
  const set=(i,v)=>{$(i).value=v==null?"":v};
  set("a_n",p.name);set("a_b",p.brand);set("a_l",p.link);set("a_sel",p.seller);set("a_rt",p.rating);set("a_rc",p.rc);set("a_co",p.color);set("a_sz",p.size);set("a_d",p.desc);set("a_p",p.price);set("a_m",p.mrp);set("a_hl",p.hl);set("a_sp",p.spec);
  $("a_sk").value=p.stock==="out"?"out":"in";
  if([...$("a_c").options].some(o=>(o.value||o.text)===p.cat))$("a_c").value=p.cat;
  selManual=!!p.seller;autoImg=p.img||"";if(p.img){$("a_pv").src=p.img;$("a_pv").hidden=false}
  $("ad_h").textContent="Edit Product";$("a_s").textContent="💾 Save changes";$("a_st").textContent="Change any detail below, then Save or Publish.";
  $("ad").classList.add("open")}
async function addProduct(){
  const name=$("a_n").value.trim(),link=safeUrl($("a_l").value.trim()),price=$("a_p").value.trim();
  if(!name||!price||!link){toast("Name, price and a valid link (https://...) are required.",3500);return false}
  const img=$("a_f").files[0]?await readImg($("a_f").files[0]):autoImg;
  const ep=editId!==null?find(editId):null;
  const o={name,cat:$("a_c").value||(ep&&ep.cat)||autoCat(name)||"General",price,mrp:$("a_m").value.trim(),desc:$("a_d").value.trim(),link,img,brand:$("a_b").value.trim(),seller:$("a_sel").value.trim()||sellerFrom(link),rating:$("a_rt").value.trim(),rc:$("a_rc").value.trim(),color:$("a_co").value.trim(),size:$("a_sz").value.trim(),stock:$("a_sk").value,hl:$("a_hl").value.trim(),spec:$("a_sp").value.trim()};
  if(ep){if(num(o.price)!==num(ep.price)){ep.ph=ep.ph&&ep.ph.length?ep.ph:[{d:"Earlier",p:ep.price}];ep.ph.push({d:today(),p:String(num(o.price))})}Object.assign(ep,o)}
  else products.unshift(Object.assign({id:Date.now(),ph:[{d:today(),p:price}],emoji:"🛒"},o));
  clearForm();heroSig="";
  $("ad").classList.remove("open");render();return true}
$("a_s").onclick=async()=>{if(await addProduct())publish()};
$("a_pub").onclick=async()=>{if(await addProduct()){const S=getSync();if(S)pushRemote(S);else{toast("First time mattum: GitHub token podunga",4000);openSync()}}};
$("a_f").addEventListener("change",async()=>{const f=$("a_f").files[0];if(!f)return;const r=await readImg(f);if(r){$("a_pv").src=r;$("a_pv").hidden=false}});

/* ---- Customer login (DEMO OTP: shown on screen, no real SMS) ---- */
function loadUser(){try{const a=localStorage.getItem(U_KEY)||sessionStorage.getItem(U_KEY);user=a?JSON.parse(a):null}catch(e){user=null}}
function storeUser(r){try{(r?localStorage:sessionStorage).setItem(U_KEY,JSON.stringify(user))}catch(e){}}
function doLogout(){const n=user&&user.name;clearUser();paintAuth();if(view!=="Home")show("Home");toast("👋 Logged out"+(n?", "+n:"")+". See you again!",3500)}
function clearUser(){try{localStorage.removeItem(U_KEY);sessionStorage.removeItem(U_KEY)}catch(e){}user=null}
function mask(){return user&&user.name?user.name:""}
function step(k){["s1","s2","s3","s4"].forEach((id,i)=>{$(id).hidden=(i!==k-1)})}
function paintAuth(){
  $("auth").innerHTML=(isOwner?'<span class="tag">OWNER</span>':"")+(user?`<span>👤 ${mask(user.phone)}</span><button id="lo">Logout</button>`:`<button id="li">Login</button>`);
  render();
}
function openLogin(){step(1);$("ln").value=$("lpw").value="";$("e1").textContent="";$("ov").classList.add("open")}
function closeLogin(){$("ov").classList.remove("open")}
function goPending(){if(pendingUrl){window.open(pendingUrl,"_blank","noopener");logOrder(find(pendingId));pendingUrl=""}}
$("auth").addEventListener("click",e=>{
  if(e.target.id==="li")openLogin();
  if(e.target.id==="lo"){askLogout()}
});
$("mx").onclick=()=>{pendingUrl="";closeLogin()};
/* ---- Accounts: name + password (stored on this device only) ---- */
const ACC_KEY="insta-store-accts";
function accts(){return LS(ACC_KEY,{})}
function akey(n){return n.trim().toLowerCase()}
async function startSession(a,k){
  user={phone:k,name:a.name};
  if(prof.owner!==k){prof={name:a.name,pic:"",owner:k}}
  else if(!prof.name)prof.name=a.name;
  SV("insta-store-prof",prof);step(3)}
$("tc").onclick=()=>{$("cn").value=$("cp1").value=$("cp2").value="";$("e2").textContent="";step(2)};
$("tl").onclick=()=>{$("e1").textContent="";step(1)};
$("lgo").onclick=async()=>{
  const k=akey($("ln").value),a=accts()[k];
  if(!k||!$("lpw").value){$("e1").textContent="Enter your name and password.";return}
  if(!a||await hashPw($("lpw").value)!==a.h){$("e1").textContent="Wrong name or password. No account yet? Tap Create account.";return}
  $("lpw").value="";await startSession(a,k)};
let pend=null;
function userPhone(){const a=user&&accts()[user.phone];return a&&a.phone?"+91 "+a.phone.slice(0,2)+"******"+a.phone.slice(-2):""}
function coolDown(){const b=$("rs");let t=30;b.disabled=true;clearInterval(cool);b.textContent="Resend OTP (30s)";
  cool=setInterval(()=>{t--;b.textContent=t>0?"Resend OTP ("+t+"s)":"Resend OTP";if(t<=0){clearInterval(cool);b.disabled=false}},1000)}
function sendOtp(){otp=String(Math.floor(100000+Math.random()*900000));tries=0;$("ot").value="";$("e4").textContent="";
  $("sent").textContent="We sent an OTP to +91 "+pend.ph.slice(0,2)+"******"+pend.ph.slice(-2)+".";$("demo").textContent="Demo OTP: "+otp;step(4);coolDown()}
$("cgo").onclick=async()=>{
  const n=$("cn").value.trim().replace(/\s+/g," "),k=akey(n),ph=$("cph").value.trim(),p1=$("cp1").value,p2=$("cp2").value,e=$("e2");
  if(n.length<3){e.textContent="Name must be at least 3 characters.";return}
  if(accts()[k]){e.textContent="This name is already taken. Please choose another.";return}
  if(!/^[6-9]\d{9}$/.test(ph)){e.textContent="Enter a valid 10-digit mobile number.";return}
  if(Object.values(accts()).some(a=>a.phone===ph)){e.textContent="This mobile number is already in use.";return}
  if(p1.length<6){e.textContent="Password must be at least 6 characters.";return}
  if(p1!==p2){e.textContent="Passwords do not match.";return}
  pend={n,k,ph,h:await hashPw(p1)};sendOtp()};
$("rs").onclick=sendOtp;
$("ch").onclick=()=>{clearInterval(cool);otp="";step(2)};
$("vf").onclick=async()=>{
  if(!pend)return;
  if(otp&&$("ot").value.trim()===otp){
    const o=accts();
    if(o[pend.k]){$("e4").textContent="This name was just taken. Please use another.";return}
    o[pend.k]={name:pend.n,phone:pend.ph,h:pend.h};SV(ACC_KEY,o);otp="";const a=o[pend.k],k=pend.k;pend=null;
    $("cp1").value=$("cp2").value="";toast("Account created 🎉");await startSession(a,k)}
  else{tries++;if(tries>=5){otp="";$("e2").textContent="Too many wrong attempts. Please try again.";step(2)}else $("e4").textContent="Wrong OTP. ("+(5-tries)+" attempts left)"}};
$("sv").onclick=()=>{storeUser(true);closeLogin();paintAuth();goPending()};
$("ns").onclick=()=>{storeUser(false);closeLogin();paintAuth();goPending()};
/* ---- Views, cart, wallet, filters, location, voice, lens ---- */
const LS=(k,d)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}};
const SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let cart=LS("insta-store-cart",[]),wallet=LS("insta-store-wallet",{bal:0,tx:[]});
function today(){return new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
function show(v){view=v;["Home","Browse","Cart","Wallet","Account"].forEach(n=>{$("v"+n).hidden=n!==v});
  $("hero").hidden=$("cats").hidden=(v!=="Home");
  $("bn").querySelectorAll("button").forEach(b=>b.classList.toggle("on",b.dataset.v===v));
  if(v==="Browse")drawBrowse();if(v==="Cart")drawCart();if(v==="Wallet")drawWallet();if(v==="Account")drawAcc();window.scrollTo(0,0)}
$("bn").addEventListener("click",e=>{const b=e.target.closest("button");if(b)show(b.dataset.v)});
$("sf").addEventListener("submit",()=>{if(view!=="Home")show("Home")});
/* filters */
function passF(p){const pr=num(p.price),m=num(p.mrp),d=m>pr?(m-pr)/m*100:0;return(!flt.min||pr>=flt.min)&&(!flt.max||pr<=flt.max)&&d>=flt.off}
$("fb").onclick=()=>{$("fp").hidden=!$("fp").hidden};
["f1","f2","f3"].forEach(i=>$(i).addEventListener("input",()=>{flt={min:num($("f1").value),max:num($("f2").value),off:num($("f3").value)};render()}));
$("fc").onclick=()=>{$("f1").value=$("f2").value="";$("f3").value="0";flt={min:0,max:0,off:0};render()};
/* cart */
function saveCart(){SV("insta-store-cart",cart);updBadge()}
function updBadge(){const n=cart.reduce((a,x)=>a+x.q,0);$("cc").textContent=n;$("cc").hidden=!n}
function addCart(id){const pp=find(id);if(pp&&pp.stock==="out"){toast("Out of stock 😔");return}const x=cart.find(c=>String(c.id)===String(id));if(x)x.q++;else cart.push({id:String(id),q:1});saveCart();toast("Added to cart 🛒");if(view==="Cart")drawCart()}
function histHtml(p){const h=p.ph&&p.ph.length?p.ph:[{d:"Now",p:p.price}];return h.map((x,i)=>`<div class="note">${esc(x.d)}: ${fmt(x.p)}${i>0?(num(x.p)<num(h[i-1].p)?" ⬇":" ⬆"):""}</div>`).join("")}
function drawCart(){
  const rows=cart.map(c=>({p:find(c.id),q:c.q})).filter(r=>r.p);
  if(!rows.length){$("cb").innerHTML='<div class="empty">Cart empty 🛒</div>';return}
  const qty=rows.reduce((a,r)=>a+r.q,0),tot=rows.reduce((a,r)=>a+r.q*num(r.p.price),0),mrp=rows.reduce((a,r)=>a+r.q*Math.max(num(r.p.mrp),num(r.p.price)),0);
  $("cb").innerHTML=rows.map(r=>`<div class="row"><div class="th">${r.p.img?`<img src="${esc(r.p.img)}" alt="">`:esc(r.p.emoji||"🛒")}</div><div style="flex:1;min-width:0"><div class="nm" data-open="${esc(r.p.id)}">${esc(r.p.name)}</div><div class="pr">${fmt(r.p.price)}</div><div class="q"><button class="gh" data-qm="${esc(r.p.id)}">−</button><b>${r.q}</b><button class="gh" data-qp="${esc(r.p.id)}">+</button></div> <span class="note">= ${fmt(r.q*num(r.p.price))}</span></div><div style="display:grid;gap:6px"><button class="yl" data-buy="${esc(r.p.id)}">${btnTxt()}</button><button class="rm" data-cr="${esc(r.p.id)}">Remove</button></div></div>`).join("")
  +`<div class="panel"><div>Net quantity: <b>${qty}</b> item${qty>1?"s":""}</div><div>Total: <b class="pr">${fmt(tot)}</b>${mrp>tot?` <span class="off">You save ${fmt(mrp-tot)}</span>`:""}</div></div><h3>📈 Price history</h3>`
  +rows.map(r=>`<div class="panel"><b>${esc(r.p.name)}</b>${histHtml(r.p)}</div>`).join("");
}
document.addEventListener("click",e=>{
  const t=e.target.closest&&e.target.closest("[data-qm],[data-qp],[data-cr],[data-cart],[data-px],[data-stk],[data-sq],[data-pr],[data-bc],[data-wa]");if(!t)return;const d=t.dataset;
  if(d.cart)addCart(d.cart);
  else if(d.qp)addCart(d.qp);
  else if(d.qm){const x=cart.find(c=>String(c.id)===d.qm);if(x){x.q--;if(x.q<=0)cart=cart.filter(c=>c!==x)}saveCart();drawCart()}
  else if(d.cr){cart=cart.filter(c=>String(c.id)!==d.cr);saveCart();drawCart()}
  else if(d.px&&isOwner){const p=find(d.px);if(p)askInput("New price (₹)",p.price).then(v=>{
    if(v&&num(v)>0){p.ph=p.ph&&p.ph.length?p.ph:[{d:"Earlier",p:p.price}];p.ph.push({d:today(),p:String(num(v))});p.price=String(num(v));render();if($("pv").classList.contains("open"))openDetail(p.id);publish()}})}
  else if(d.stk&&isOwner){const p=find(d.stk);if(p){p.stock=p.stock==="out"?"in":"out";render();if($("pv").classList.contains("open"))openDetail(p.id);publish();toast(p.stock==="out"?"Marked as out of stock":"Marked as in stock")}}
  else if(d.pr){const [a,b]=d.pr.split("-").map(Number);flt={min:a,max:b,off:0};$("f1").value=a||"";$("f2").value=b||"";$("f3").value="0";cat="All";$("q").value="";show("Home");$("fp").hidden=false;render()}
  else if(d.sq){cat=d.bc||"All";$("q").value=d.sq;addHist(d.sq);show("Home");render()}
  else if(d.bc){cat=d.bc;$("q").value="";show("Home");render()}
  else if(d.wa){wallet.bal+=+d.wa;wallet.tx.unshift({t:"Demo credit",d:today(),a:+d.wa});SV("insta-store-wallet",wallet);drawWallet()}
});
/* browse, wallet, account */
const SUB={"Mobiles":["Smartphone","Case","Charger","Earphone"],"Electronics":["Earbud","Watch","Speaker","Power bank","Camera"],"Appliances":["Mixer","Cooker","Fan","Iron","Kettle"],"Kids & Toys":["Toy","Baby","Puzzle","Doll"],"Furniture":["Chair","Table","Bed","Sofa","Shelf"],"Beauty":["Cream","Serum","Shampoo","Perfume"],"Books":["Novel","Notebook","Guide"]};
function strip(t,l,own){return `<div class="panel"><h3 style="margin:0 0 10px;display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap">${t}${own?'<button class="gh" id="dEdit2" style="padding:4px 10px;font-size:.8rem">✏️ Edit deals</button>':""}</h3><div class="hs2">`+l.map(p=>`<div class="mc" data-open="${esc(p.id)}"><div class="mi">${p.img?`<img src="${esc(p.img)}" alt="">`:esc(p.emoji||"🛒")}</div><div class="nm" style="font-size:.8rem;margin-top:4px">${esc(p.name)}</div><div class="pr" style="font-size:1rem">${fmt(p.price)}</div>${offTxt(p)}${own?`<button class="gh" data-dr="${esc(p.id)}" style="padding:3px 6px;font-size:.7rem;margin-top:4px;width:100%;color:#d93025">✕ Remove</button>`:""}</div>`).join("")+`</div></div>`}
function drawBrowse(){
  const deals=products.filter(p=>{const pr=num(p.price),m=num(p.mrp);return m>pr&&(m-pr)/m>=.3});
  $("bg").innerHTML=`<div class="panel"><h3 style="margin:0 0 10px">Shop by Category</h3><div class="tiles">`+CATS.map(c=>`<div class="ctile" data-bc="${esc(c)}"><div class="ci">${CI[c]}</div>${esc(c)}</div>`).join("")+`</div></div>`
  +(deals.length?strip("🔥 Today's Deals",deals):"")+(products.length?strip("🆕 New Arrivals",products.slice(0,8)):"")
  +`<div class="panel"><h3 style="margin:0 0 8px">Shop by Price</h3>`+[[0,499,"Under ₹499"],[0,999,"Under ₹999"],[0,1999,"Under ₹1,999"],[2000,0,"₹2,000 & above"]].map(([a,b,t])=>`<button class="gh" style="margin:3px" data-pr="${a}-${b}">${t}</button>`).join("")+`</div>`
  +`<div class="panel"><h3 style="margin:0 0 4px">Shop by Department</h3>`+CATS.map(c=>`<details class="dep"><summary>${CI[c]} ${esc(c)}</summary><div class="dl"><a data-bc="${esc(c)}">All in ${esc(c)}</a>`+SUB[c].map(s=>`<a data-sq="${esc(s)}" data-bc="${esc(c)}">${esc(s)}</a>`).join("")+`</div></details>`).join("")+`</div>`;
}
function drawWallet(){
  if(!user){$("wb").innerHTML='<div class="empty">Please log in to use your wallet.<br><br><button class="yl" id="wl">Login</button></div>';return}
  $("wb").innerHTML=`<div class="panel"><div class="note">Wallet balance</div><div class="pr" style="font-size:1.8rem">${fmt(wallet.bal)}</div><div class="note">⚠️ Demo wallet: this is not real money. Real payments need a payment gateway (Razorpay etc.).</div><button class="or" data-wa="500" style="margin-top:8px">+ ₹500 demo</button></div><h3>Transactions</h3>`
  +(wallet.tx.length?wallet.tx.map(t=>`<div class="row"><div style="flex:1">${esc(t.t)}<div class="note">${esc(t.d)}</div></div><b>${t.a<0?"−":"+"}${fmt(Math.abs(t.a))}</b></div>`).join(""):'<div class="note">No transactions yet.</div>');
}
$("wb").addEventListener("click",e=>{if(e.target.id==="wl")openLogin()});
function drawAcc(){const l=LS("insta-store-loc","");
  $("ab").innerHTML=`<div class="panel">`+(user?`<div>👤 ${mask(user.phone)}</div><button class="gh" id="alo" style="margin-top:8px">Logout</button>`:`<div class="note">You are not logged in</div><button class="yl" id="al" style="margin-top:8px">Login / Create account</button>`)+`</div><div class="panel"><div>📍 ${esc(l||"Location not set")}</div><button class="gh" id="alc" style="margin-top:8px">Change location</button></div>`
  +(isOwner?`<div class="panel"><span class="tag">OWNER</span> Add or remove products with "+ Add Product" on Home.</div>`:"")}
$("ab").addEventListener("click",e=>{const i=e.target.id;if(i==="al")openLogin();if(i==="alo"){askLogout()}if(i==="alc")openLoc()});
/* location */
function paintLoc(){const l=LS("insta-store-loc","");$("loc").textContent="📍 "+(l?"Deliver to "+l:"Select delivery location")+" ▾"}
function openLoc(){$("lt").value=LS("insta-store-loc","");$("lo2").classList.add("open")}
$("loc").onclick=openLoc;$("lx").onclick=()=>$("lo2").classList.remove("open");
$("ls").onclick=()=>{const v=$("lt").value.trim();if(!v)return;SV("insta-store-loc",v);paintLoc();$("lo2").classList.remove("open");if(view==="Account")drawAcc()};
$("lg").onclick=()=>{if(!navigator.geolocation){toast("Location is not supported");return}toast("Getting location...",4000);
  navigator.geolocation.getCurrentPosition(p=>{SV("insta-store-loc","Current location ("+p.coords.latitude.toFixed(2)+", "+p.coords.longitude.toFixed(2)+")");paintLoc();$("lo2").classList.remove("open");if(view==="Account")drawAcc()},()=>toast("Permission denied. Please type your city or pincode.",4000),{timeout:8000})};
/* voice search */
let dict=null,dTxt="";
(async()=>{try{dict=window.claude?await claude.use("dictation"):null;if(dict){dict.onFinal(({text})=>{dTxt=(dTxt+" "+text).trim();$("q").value=dTxt});dict.onState(({state})=>{if(state==="idle"){$("mic").textContent="🎤";if($("q").value.trim()){addHist($("q").value);if(view!=="Home")show("Home");render()}}})}}catch(e){}})();
$("mic").onclick=()=>{
  if(dict){if($("mic").textContent==="🔴"){dict.stop();return}dTxt="";$("mic").textContent="🔴";dict.start().catch(()=>{$("mic").textContent="🎤"});return}
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){toast("Voice search is not supported on this device");return}
  const r=new SR();r.lang="en-IN";r.onresult=e=>{$("q").value=e.results[0][0].transcript;addHist($("q").value);if(view!=="Home")show("Home");render()};r.onerror=()=>toast("Couldn't hear you");r.start();toast("Speak now... 🎤")};
/* lens (photo search) */
let sm=null;(async()=>{try{sm=window.claude?await claude.use("sample"):null}catch(e){}})();
function imgBlob(f){return new Promise(res=>{const im=new Image();im.onload=()=>{const k=Math.min(1,768/Math.max(im.width,im.height)),cv=document.createElement("canvas");cv.width=Math.round(im.width*k);cv.height=Math.round(im.height*k);cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);cv.toBlob(b=>res(b),"image/jpeg",.8)};im.onerror=()=>res(null);im.src=URL.createObjectURL(f)})}
$("lens").onclick=()=>{if(!sm){toast("Lens is not available here");return}$("lf").click()};
$("lf").onchange=async()=>{const f=$("lf").files[0];$("lf").value="";if(!f)return;toast("Analyzing photo... 🔍",15000);
  try{const b=await imgBlob(f);const r=await sm("This is a photo of a shopping product. Reply with only 2 to 4 simple English keywords naming it, on one line, no punctuation.",{images:[b],modelTier:"quick"});
    const k=(r.text||"").replace(/[^\w\s]/g," ").trim().split(/\s+/).slice(0,4).join(" ");
    if(k){$("q").value=k;addHist(k);cat="All";show("Home");render();toast("Lens: "+k)}else toast("Couldn't identify the product")}catch(e){toast("Lens failed",3000)}};
/* ---- Account: profile, orders, addresses, payments, membership, subscriptions ---- */
let prof=LS("insta-store-prof",{name:"",pic:""}),addrs=LS("insta-store-addr",[]),orders=LS("insta-store-orders",[]),mem=LS("insta-store-mem",""),subs=LS("insta-store-subs",[]),openSec="",pendingId="";
const PLANS=[["Free","₹0","Basic access"],["Plus","₹99 / month","Early deal alerts, priority support"],["Premium","₹199 / month","Extra offers, early access to new products"]];
const FREQ={w:["Every week",7],m:["Every month",30],q:["Every 3 months",90]};
function nextDate(n){return new Date(Date.now()+n*864e5).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}
function logOrder(p){if(!p)return;orders.unshift({id:Date.now(),pid:p.id,name:p.name,price:p.price,emoji:p.emoji||"🛒",d:today(),st:"Seller link opened"});orders=orders.slice(0,50);SV("insta-store-orders",orders)}
function avHtml(){return prof.pic?`<img src="${esc(prof.pic)}" alt="">`:esc((prof.name||"C").trim().charAt(0).toUpperCase())}
function addrHtml(){return(addrs.length?addrs.map((a,i)=>`<div class="panel"><b>${esc(a.n)}</b>${i===0?' <span class="tag">Default</span>':""}<div class="note">${esc(a.l)}, ${esc(a.c)} - ${esc(a.z)}</div><div class="note">📞 ${esc(a.p)}</div><div style="margin-top:6px">${i?`<button class="gh" data-ad="${i}">Set default</button> `:""}<button class="gh" data-ar="${i}">Remove</button></div></div>`).join(""):'<div class="note">No addresses.</div>')+'<button class="or" id="aa" style="margin-top:8px">+ Add address</button>'}
function payHtml(){const rows=[...orders.map(o=>({t:"Order: "+o.name,d:o.d,a:fmt(o.price)})),...wallet.tx.map(t=>({t:"Wallet: "+t.t,d:t.d,a:(t.a<0?"−":"+")+fmt(Math.abs(t.a))}))];
  return '<div class="note" style="margin-bottom:8px">Payments made on the seller’s site are not tracked here. Only Buy Now orders and demo wallet records are shown.</div>'+(rows.length?rows.map(r=>`<div class="row"><div style="flex:1;min-width:0">${esc(r.t)}<div class="note">${esc(r.d)}</div></div><b>${r.a}</b></div>`).join(""):'<div class="note">No payment history.</div>')}
function memHtml(){return '<div class="note" style="margin-bottom:8px">Demo plans: no real payment.</div>'+PLANS.map(([k,pr,pk])=>{const cur=(mem||"Free")===k;return `<div class="panel"><b>${k}</b> • ${pr}${cur?' <span class="tag">Current</span>':""}<div class="note">${pk}</div>${cur?"":`<button class="or" data-mp="${k}" style="margin-top:6px">${k==="Free"?"Switch":"Join"}</button>`}</div>`}).join("")}
function subHtml(){const opts=products.map(p=>`<option value="${esc(p.id)}">${esc(p.name)}</option>`).join("");
  return '<div class="note" style="margin-bottom:8px">Demo: no automatic payment, only a next-order-date reminder.</div>'
  +(subs.length?subs.map((s,i)=>{const p=find(s.pid);return `<div class="row"><div style="flex:1;min-width:0"><div class="nm">${esc(s.name)}</div><div class="note">${esc(FREQ[s.f][0])} • Next: ${esc(s.nx)}</div></div>${p?`<button class="yl" data-buy="${esc(s.pid)}">Order</button>`:""}<button class="rm" data-sc="${i}">Cancel</button></div>`}).join(""):'<div class="note">No subscriptions.</div>')
  +(products.length?`<div style="display:grid;gap:6px;margin-top:8px"><select id="sp">${opts}</select><select id="sfq"><option value="w">Every week</option><option value="m" selected>Every month</option><option value="q">Every 3 months</option></select><button class="or" id="sa">+ Subscribe</button></div>`:"")}
function drawAcc(){
  const l=LS("insta-store-loc","");
  if(!user){$("ab").innerHTML='<div class="empty">Please log in to use your account.<br><br><button class="yl" id="al">Login / Create account</button></div>';return}
  const od=orders.slice(0,5),sec=(k,t,b)=>`<details class="sd" data-sec="${k}"${openSec===k?" open":""}><summary>${t}</summary><div class="sx">${b}</div></details>`;
  $("ab").innerHTML=`<div class="ah"><div><div class="note">Hello,</div><div class="an">${esc(prof.name||"Customer")}</div><div class="note">${esc(userPhone())}</div>${isOwner?'<span class="tag">OWNER</span>':""}</div><div style="display:grid;gap:6px;justify-items:center"><div class="av" id="av" title="Edit profile">${avHtml()}</div><button class="gh" id="ep" style="padding:4px 10px;font-size:.8rem">✏️ Edit profile</button></div></div>`
  +`<h3>📦 Your Orders</h3>`+(od.length?od.map(o=>{const p=find(o.pid);return `<div class="row"><div class="th">${p&&p.img?`<img src="${esc(p.img)}" alt="">`:esc(o.emoji)}</div><div style="flex:1;min-width:0"><div class="nm">${esc(o.name)}</div><div class="note">${esc(o.d)} • ${esc(o.st)}</div><div class="pr" style="font-size:1rem">${fmt(o.price)}</div></div>${p?`<button class="yl" data-buy="${esc(o.pid)}">Buy again</button>`:""}</div>`}).join(""):'<div class="panel note">No orders yet. Orders are recorded here when you tap Buy Now.</div>')
  +`<h3 style="margin-top:18px">👤 Your Account</h3>`+sec("addr","📍 Your Addresses",addrHtml())+sec("pay","💳 Payment History",payHtml())+sec("mem","⭐ Membership",memHtml())+sec("sub","🔁 Subscriptions",subHtml())
  +`<div class="panel">📍 ${esc(l||"Delivery location not set")} <button class="gh" id="alc" style="margin-left:8px">Change</button></div><button class="gh" id="alo">Logout</button>`;
}
$("ab").addEventListener("toggle",e=>{const k=e.target.dataset&&e.target.dataset.sec;if(k){if(e.target.open)openSec=k;else if(openSec===k)openSec=""}},true);
document.addEventListener("click",e=>{
  const t=e.target.closest&&e.target.closest("[data-ad],[data-ar],[data-mp],[data-sc],#aa,#sa,#av,#ep");if(!t)return;const d=t.dataset;
  if(d.ad!==undefined){addrs.unshift(addrs.splice(+d.ad,1)[0]);SV("insta-store-addr",addrs);drawAcc()}
  else if(d.ar!==undefined){askConfirm("Remove this address?").then(ok=>{if(ok){addrs.splice(+d.ar,1);SV("insta-store-addr",addrs);drawAcc()}})}
  else if(d.mp){mem=d.mp;SV("insta-store-mem",mem);drawAcc()}
  else if(d.sc!==undefined){subs.splice(+d.sc,1);SV("insta-store-subs",subs);drawAcc()}
  else if(t.id==="aa"){$("s_e").textContent="";$("am").classList.add("open")}
  else if(t.id==="sa"){const p=find($("sp").value);if(!p)return;const f=$("sfq").value;subs.unshift({pid:p.id,name:p.name,f,nx:nextDate(FREQ[f][1])});SV("insta-store-subs",subs);toast("Subscription added");drawAcc()}
  else if(t.id==="av"||t.id==="ep")openProf();
});
/* ---- Edit profile + password (stored on this device only) ---- */
const PW_KEY="insta-store-pw";let newPic=null;
async function hashPw(p){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("insta-store:"+p));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("")}
function getPw(k){const a=accts()[k];return a?a.h:""}
function setPw(k,h){const o=accts();if(o[k]){o[k].h=h;SV(ACC_KEY,o)}}
function paintPav(){const s=newPic===""?"":(newPic||prof.pic);$("pav").innerHTML=s?`<img src="${esc(s)}" alt="">`:esc(($("pn").value||prof.name||"C").trim().charAt(0).toUpperCase())}
function openProf(){
  if(!user)return;newPic=null;
  $("pn").value=prof.name||"";$("pe").value=prof.email||"";$("pph").value=user.name;$("pmb").value=userPhone();
  ["pwo","pw1","pw2"].forEach(i=>{$(i).value=""});$("pe_err").textContent="";$("pf").value="";
  const has=!!getPw(user.phone);$("pocw").hidden=!has;
  $("pwn").textContent=has?"To change your password, enter your current password and a new one. Leave blank to keep it.":"No password set.";
  paintPav();$("pm").classList.add("open")}
$("pn").addEventListener("input",paintPav);
/* crop */
const CV=280;let cim=null,cs=1,cmin=1,cox=0,coy=0,cdrag=null;
function cclamp(){cox=Math.min(0,Math.max(CV-cim.width*cs,cox));coy=Math.min(0,Math.max(CV-cim.height*cs,coy))}
function cdraw(){const g=$("crc").getContext("2d");g.clearRect(0,0,CV,CV);g.drawImage(cim,cox,coy,cim.width*cs,cim.height*cs);
  g.save();g.fillStyle="rgba(0,0,0,.55)";g.beginPath();g.rect(0,0,CV,CV);g.arc(CV/2,CV/2,CV/2-1,0,Math.PI*2,true);g.fill("evenodd");g.restore();
  g.strokeStyle="#fff";g.lineWidth=2;g.beginPath();g.arc(CV/2,CV/2,CV/2-1,0,Math.PI*2);g.stroke()}
function openCrop(f){const r=new FileReader();
  r.onload=()=>{const im=new Image();im.onload=()=>{cim=im;cmin=CV/Math.min(im.width,im.height);cs=cmin;cox=(CV-im.width*cs)/2;coy=(CV-im.height*cs)/2;$("crz").value=1;cclamp();cdraw();$("cr").classList.add("open")};im.onerror=()=>toast("Could not open photo");im.src=r.result};
  r.onerror=()=>toast("Could not open photo");r.readAsDataURL(f)}
$("pf").addEventListener("change",()=>{const f=$("pf").files[0];$("pf").value="";if(f)openCrop(f)});
$("crz").addEventListener("input",()=>{const cx=(CV/2-cox)/cs,cy=(CV/2-coy)/cs;cs=cmin*parseFloat($("crz").value);cox=CV/2-cx*cs;coy=CV/2-cy*cs;cclamp();cdraw()});
$("crc").addEventListener("pointerdown",e=>{cdrag={x:e.clientX,y:e.clientY};$("crc").setPointerCapture(e.pointerId);$("crc").style.cursor="grabbing"});
$("crc").addEventListener("pointermove",e=>{if(!cdrag)return;const k=CV/$("crc").getBoundingClientRect().width;cox+=(e.clientX-cdrag.x)*k;coy+=(e.clientY-cdrag.y)*k;cdrag={x:e.clientX,y:e.clientY};cclamp();cdraw()});
["pointerup","pointercancel"].forEach(t=>$("crc").addEventListener(t,()=>{cdrag=null;$("crc").style.cursor="grab"}));
$("crx").onclick=()=>{$("cr").classList.remove("open");cim=null};
$("cry").onclick=()=>{if(!cim)return;const O=320,k=O/CV,cv=document.createElement("canvas");cv.width=cv.height=O;
  cv.getContext("2d").drawImage(cim,cox*k,coy*k,cim.width*cs*k,cim.height*cs*k);
  newPic=cv.toDataURL("image/jpeg",.85);paintPav();$("cr").classList.remove("open");cim=null};
$("prp").onclick=()=>{newPic="";$("pf").value="";paintPav()};
function askLogout(){if(!user)return;$("lga").innerHTML=avHtml();$("lgt").textContent="Log out of "+user.name+"?";$("lgm").classList.add("open")}
$("lgy").onclick=()=>{$("lgm").classList.remove("open");doLogout()};
$("lgn").onclick=()=>$("lgm").classList.remove("open");
$("lgm").addEventListener("click",e=>{if(e.target===$("lgm"))$("lgm").classList.remove("open")});
$("pmx").onclick=()=>$("pm").classList.remove("open");$("amx").onclick=()=>$("am").classList.remove("open");
$("ps").onclick=async()=>{
  const em=$("pe").value.trim(),err=$("pe_err");err.textContent="";
  if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){err.textContent="Enter a valid email.";return}
  const p1=$("pw1").value,p2=$("pw2").value,has=!!getPw(user.phone);
  if(p1||p2){
    if(p1.length<6){err.textContent="Password must be at least 6 characters.";return}
    if(p1!==p2){err.textContent="Passwords do not match.";return}
    if(has&&await hashPw($("pwo").value)!==getPw(user.phone)){err.textContent="Current password is wrong.";return}
    setPw(user.phone,await hashPw(p1));toast("Password updated 🔑")}
  prof.name=$("pn").value.trim();prof.email=em;
  if(newPic!==null)prof.pic=newPic;
  SV("insta-store-prof",prof);$("pm").classList.remove("open");drawAcc()};
$("s_s").onclick=()=>{const a={n:$("s_n").value.trim(),p:$("s_p").value.trim(),l:$("s_l").value.trim(),c:$("s_c").value.trim(),z:$("s_z").value.trim()};
  if(!a.n||!a.l||!a.c){$("s_e").textContent="Please fill in all details.";return}
  if(!/^[6-9]\d{9}$/.test(a.p)){$("s_e").textContent="Enter a valid 10-digit mobile number.";return}
  if(!/^\d{6}$/.test(a.z)){$("s_e").textContent="Enter a valid 6-digit pincode.";return}
  addrs.push(a);SV("insta-store-addr",addrs);["s_n","s_p","s_l","s_c","s_z"].forEach(i=>{$(i).value=""});$("am").classList.remove("open");openSec="addr";drawAcc()};
const _pa=paintAuth;paintAuth=function(){_pa();updBadge();if(view==="Account")drawAcc();if(view==="Wallet")drawWallet();if(view==="Cart")drawCart()};
/* ---- Owner login (username + password). Client-side only ---- */
const OWNER_HASH="c7039219b9c00d5ad988a6b7f69f52ddb7d1899dd6084d5fbea5776a625babad",A_KEY="insta-store-admin2";
let adminOn=false;
try{adminOn=localStorage.getItem(A_KEY)==="1"}catch(e){}
if(adminOn)isOwner=true;
async function ownerHash(id,pw){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode("insta-owner:"+id.trim().toLowerCase()+"|"+pw));return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,"0")).join("")}
function ownerUi(){custView=false;$("olk").hidden=adminOn;paintAuth()}
$("tow").onclick=()=>{closeLogin();openOwner()};
function openOwner(){$("oid").value=$("opw").value="";$("oerr").textContent="";$("om").classList.add("open")}
$("olk").onclick=openOwner;
$("omx").onclick=()=>$("om").classList.remove("open");
$("ogo").onclick=async()=>{
  if(await ownerHash($("oid").value,$("opw").value)!==OWNER_HASH){$("oerr").textContent="Wrong username or password.";return}
  adminOn=true;isOwner=true;try{localStorage.setItem(A_KEY,"1")}catch(e){}
  $("opw").value="";$("om").classList.remove("open");toast("Owner login success ✅");ownerUi()};
$("auth").addEventListener("click",e=>{if(e.target.id==="olb")openOwner();if(e.target.id==="oxl"){adminOn=false;try{localStorage.removeItem(A_KEY)}catch(x){}isOwner=false;toast("Owner logged out");ownerUi()}});
function applyMode(){const om=ownerMode();document.body.classList.toggle("om",om);$("adm").hidden=!om;$("od").hidden=!om;
  if(om){flt={min:0,max:0,off:0};["f1","f2"].forEach(i=>{$(i).value=""});$("f3").value="0";$("fp").hidden=true;if(view!=="Home")show("Home")}
  render()}
const _pb=paintAuth;paintAuth=function(){_pb();
  if(ownerMode())$("auth").innerHTML='<span class="tag">OWNER</span>'+(adminOn?'<button id="oxl">Owner logout</button>':"");
  else $("auth").innerHTML=(isOwner?'<button id="ov2">🛠 Owner view</button>':'<button id="olb">🔐 Owner</button>');
  applyMode()};
$("auth").addEventListener("click",e=>{if(e.target.id==="ov2"){custView=false;paintAuth()}});
$("od").addEventListener("click",e=>{if(e.target.id==="cvb2"){custView=true;paintAuth()}});
$("olk").hidden=adminOn;$("adm").hidden=!isOwner;
/* show/hide password (eye) on every password field */
function hidePw(){document.querySelectorAll(".pwx").forEach(w=>{w.querySelector("input").type="password";w.querySelector("button").textContent="👁"})}
document.querySelectorAll("input[type=password]").forEach(i=>{
  if(i.parentNode.classList.contains("pwx"))return;
  const w=document.createElement("div");w.className="pwx";w.style.position="relative";i.parentNode.insertBefore(w,i);w.appendChild(i);i.style.paddingRight="44px";
  const b=document.createElement("button");b.type="button";b.textContent="👁";b.title="Show / hide password";b.setAttribute("aria-label","Show or hide password");
  b.style.cssText="position:absolute;right:4px;top:50%;transform:translateY(-50%);background:none;padding:4px 8px;font-size:1.1rem";
  b.onclick=()=>{const show=i.type==="password";i.type=show?"text":"password";b.textContent=show?"🙈":"👁"};w.appendChild(b)});
const _mo=new MutationObserver(()=>{if(!document.querySelector(".ov.open"))hidePw();else document.querySelectorAll(".ov:not(.open) .pwx").forEach(w=>{w.querySelector("input").type="password";w.querySelector("button").textContent="👁"})});
document.querySelectorAll(".ov").forEach(o=>_mo.observe(o,{attributes:true,attributeFilter:["class"]}));
/* ---- Today Special Deals: owner customize ---- */
let dmTheme="sunset";
function drawTh(){$("dm_th").innerHTML=Object.keys(THEMES).map(k=>`<button type="button" class="sw${k===dmTheme?" on":""}" data-th="${k}" title="${k}" style="background:${THEMES[k]}"></button>`).join("")}
let dmSets=[],dmI=0;
function dmSave(){const S=dmSets[dmI];if(!S)return;S.title=$("dm_t").value.trim()||(dmI?"Special deals":DEF.title);S.sub=$("dm_s").value.trim();S.show=$("dm_show").checked;S.theme=dmTheme;S.deals=[...$("dm_list").querySelectorAll("input:checked")].map(i=>i.value)}
function dmLoad(){const S=dmSets[dmI];$("dm_t").value=S.title||"";$("dm_s").value=S.sub||"";$("dm_show").checked=S.show!==false;dmTheme=THEMES[S.theme]?S.theme:"sunset";drawTh();
  const sel=new Set((S.deals||[]).map(String));
  $("dm_list").innerHTML=products.length?products.map(p=>`<label class="dchk"><input type="checkbox" value="${esc(p.id)}"${sel.has(String(p.id))?" checked":""}><span class="dn">${esc(p.name)}</span><b>${fmt(p.price)}</b></label>`).join(""):'<div class="note">Add some products first.</div>';
  $("dm_tabs").innerHTML=dmSets.map((x,i)=>`<button type="button" class="gh dmt${i===dmI?" on":""}" data-dt="${i}">${i+1}. ${esc((x.title||"Deal").slice(0,16))}</button>`).join("")+'<button type="button" class="gh dmt" data-dt="new">+ New</button>';
  $("dm_del").hidden=dmSets.length<2;$("dm_e").textContent=""}
function openDeals(i,isNew){dmSets=JSON.parse(JSON.stringify(sets()));dmI=Math.min(+i||0,dmSets.length-1);
  if(isNew){dmSets.push({id:"s"+Date.now(),title:"Special deals",sub:"",theme:"ocean",show:true,deals:[]});dmI=dmSets.length-1}
  dmLoad();$("dm").classList.add("open")}
$("hero").addEventListener("click",e=>{if(e.target.id==="hEdit"&&ownerMode())openDeals(0)});
$("dm_th").addEventListener("click",e=>{const b=e.target.closest("[data-th]");if(b){dmTheme=b.dataset.th;drawTh()}});
$("dm_tabs").addEventListener("click",e=>{const b=e.target.closest("[data-dt]");if(!b)return;dmSave();
  if(b.dataset.dt==="new"){dmSets.push({id:"s"+Date.now(),title:"Special deals",sub:"",theme:"ocean",show:true,deals:[]});dmI=dmSets.length-1}else dmI=+b.dataset.dt;dmLoad()});
$("dmx").onclick=()=>$("dm").classList.remove("open");
$("dm_clr").onclick=()=>{$("dm_list").querySelectorAll("input").forEach(i=>{i.checked=false})};
$("dm_rst").onclick=()=>{$("dm_t").value=dmI?"Special deals":DEF.title;$("dm_s").value=dmI?"":DEF.sub;$("dm_show").checked=true;dmTheme=dmI?"ocean":"sunset";drawTh()};
$("dm_del").onclick=()=>{if(dmSets.length<2)return;dmSets.splice(dmI,1);dmI=0;dmLoad()};
$("dm_save").onclick=()=>{
  if(!isOwner)return;dmSave();
  cfg={sets:dmSets,title:dmSets[0].title,sub:dmSets[0].sub,show:dmSets[0].show,theme:dmSets[0].theme,deals:dmSets[0].deals};
  heroSig="";renderHero();$("dm").classList.remove("open");toast("Today Special Deals saved ✅");publish()};
$("dealstrip").addEventListener("click",e=>{const b=e.target.closest("[data-dr],[data-de],[data-dn]");if(!b||!ownerMode())return;e.stopPropagation();
  if(b.dataset.dr!==undefined){const S=sets()[+b.dataset.ds||0];S.deals=(S.deals||[]).filter(x=>String(x)!==b.dataset.dr);if(!(+b.dataset.ds)){cfg.deals=S.deals}heroSig="";renderHero();toast("Removed from deals");publish()}
  else if(b.dataset.dn)openDeals(0,true);else openDeals(+b.dataset.de)});
/* liquid glass nav indicator */
function moveInd(sq){const b=document.querySelector("#bn button.on"),i=$("ind");if(!b||!i||!$("bn").offsetWidth)return;
  i.style.width=b.offsetWidth+"px";i.style.transform="translateX("+b.offsetLeft+"px)";
  if(sq){i.classList.remove("go");void i.offsetWidth;i.classList.add("go")}}
const _show=show;show=function(v){animNext=true;_show(v);heroSig="";renderHero();moveInd(true);moveCind()};
var cPrev=null,cLast="";
function moveCind(){const c=document.querySelector("#cats .chip.on"),i=$("cind"),sc=$("cats");if(!c||!i||!c.offsetWidth)return;
  if(cPrev){i.style.transition="none";i.style.width=cPrev.w+"px";i.style.transform="translateX("+cPrev.x+"px)";void i.offsetWidth;i.style.transition=""}
  i.style.width=c.offsetWidth+"px";i.style.transform="translateX("+c.offsetLeft+"px)";cPrev={x:c.offsetLeft,w:c.offsetWidth};
  if(c.dataset.cat!==cLast){cLast=c.dataset.cat;try{sc.scrollTo({left:Math.max(0,c.offsetLeft-(sc.clientWidth-c.offsetWidth)/2),behavior:"smooth"})}catch(e){}}}
window.addEventListener("resize",()=>moveCind());
window.addEventListener("resize",()=>moveInd());
try{new ResizeObserver(()=>moveInd()).observe($("bn"))}catch(e){}
requestAnimationFrame(()=>moveInd());
/* category name pop animation */
function catPop(c){let e=$("catpop");if(!e){e=document.createElement("div");e.id="catpop";document.body.appendChild(e)}
  e.innerHTML='<span class="cpi">'+(CI[c]||"")+'</span><span class="cpt">'+[...c].map((ch,i)=>'<i style="animation-delay:'+(i*40)+'ms">'+(ch===" "?"&nbsp;":esc(ch))+'</i>').join("")+'</span>';
  e.classList.remove("show");void e.offsetWidth;e.classList.add("show");clearTimeout(catPop.t);catPop.t=setTimeout(()=>e.classList.remove("show"),1700)}
/* background colour follows cursor / finger */
(function(){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;const g=document.createElement("div");g.id="glow";document.body.appendChild(g);
  let tx=innerWidth/2,ty=innerHeight*.3,cx=tx,cy=ty,run=false;
  function loop(){cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;g.style.setProperty("--mx",cx+"px");g.style.setProperty("--my",cy+"px");g.style.setProperty("--hue",Math.round(cx/innerWidth*300+cy/innerHeight*60));
    if(Math.abs(tx-cx)+Math.abs(ty-cy)>.5)requestAnimationFrame(loop);else run=false}
  function mv(x,y){tx=x;ty=y;if(!run){run=true;requestAnimationFrame(loop)}}
  addEventListener("pointermove",e=>mv(e.clientX,e.clientY),{passive:true});
  ["touchstart","touchmove"].forEach(n=>addEventListener(n,e=>{const t=e.touches[0];if(t)mv(t.clientX,t.clientY)},{passive:true}));
  mv(tx+1,ty)})();
drawAcc=function(){const l=LS("insta-store-loc","");
  $("ab").innerHTML=`<div class="panel"><b>🛍️ MyStore</b><div class="note">${isOwner?"You are signed in as the owner.":"Browse products and tap Buy Now to open the seller's site."}</div>${isOwner?"":'<button class="or" id="olb2" style="margin-top:8px">🔐 Owner login</button>'}</div><div class="panel">📍 ${esc(l||"Delivery location not set")} <button class="gh" id="alc" style="margin-left:8px">Change</button></div>`};
$("ab").addEventListener("click",e=>{if(e.target.id==="olb2")openOwner()});
/* detect device type and adapt automatically (live on resize / rotate) */
function devCls(){const w=window.innerWidth,touch=matchMedia("(pointer:coarse)").matches,ua=/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent),m=w<700||(ua&&touch&&w<900),d=document.documentElement;
  d.classList.toggle("dev-mobile",m);d.classList.toggle("dev-desktop",!m);d.dataset.dev=m?"mobile":(w<1000?"tablet":"desktop");
  try{moveInd();moveCind()}catch(e){}}
window.addEventListener("resize",devCls);window.addEventListener("orientationchange",()=>setTimeout(devCls,200));devCls();
paintLoc();updBadge();
user=null;paintAuth();
/* ---- GitHub sync: shared products.json so every device sees owner changes ---- */
const SY_KEY="insta-store-sync";
function getSync(){try{const v=JSON.parse(localStorage.getItem(SY_KEY)||"null");return v&&v.repo&&v.token?v:null}catch(e){return null}}
function openSync(){const v=getSync()||{};$("sy_r").value=v.repo||"";$("sy_b").value=v.branch||"main";$("sy_t").value=v.token||"";$("sy_e").textContent="";$("sy").classList.add("open")}
async function pushRemote(S){
  toast("GitHub ku save aagudhu...",9000);
  try{
    const api="https://api.github.com/repos/"+S.repo+"/contents/products.json",h={Authorization:"Bearer "+S.token,Accept:"application/vnd.github+json"};
    let sha;const g=await fetch(api+"?ref="+encodeURIComponent(S.branch)+"&t="+Date.now(),{headers:h,cache:"no-store"});
    if(g.ok)sha=(await g.json()).sha;else if(g.status!==404)throw new Error(g.status);
    const bytes=new TextEncoder().encode(JSON.stringify({products,cfg}));let bin="";
    for(let i=0;i<bytes.length;i+=32768)bin+=String.fromCharCode.apply(null,bytes.subarray(i,i+32768));
    const r=await fetch(api,{method:"PUT",headers:h,body:JSON.stringify({message:"Update store products",content:btoa(bin),branch:S.branch,sha})});
    if(!r.ok)throw new Error(r.status);
    toast("✅ Save aachu! 1-2 min la ella mobile layum theriyum",5000)
  }catch(e){toast("GitHub save aagala ("+(e&&e.message)+"). Repo / token check pannunga",6000)}
}
$("od").addEventListener("click",e=>{if(e.target.id==="upb")openSync()});
$("syx").onclick=()=>$("sy").classList.remove("open");
$("sy_s").onclick=async()=>{
  const repo=$("sy_r").value.trim().replace(/^https?:\/\/github\.com\//i,"").replace(/\.git$/,"").replace(/\/$/,""),branch=$("sy_b").value.trim()||"main",token=$("sy_t").value.trim();
  if(!/^[\w.-]+\/[\w.-]+$/.test(repo)){$("sy_e").textContent="Repo format: username/repo";return}
  if(!token){$("sy_e").textContent="Token podunga";return}
  const S={repo,branch,token};try{localStorage.setItem(SY_KEY,JSON.stringify(S))}catch(e){}
  $("sy").classList.remove("open");await pushRemote(S)};
let remoteSig="";
async function loadRemote(){try{const r=await fetch("products.json?t="+Date.now(),{cache:"no-store"});if(!r.ok)return;const t=await r.text();if(t===remoteSig)return;const j=JSON.parse(t);
  if(j&&Array.isArray(j.products)){remoteSig=t;products=j.products;cfg=Object.assign({},DEF,j.cfg||{});heroSig="";render()}}catch(e){}}
loadRemote();
/* customers: pick up owner changes automatically every minute and when the tab is opened again */
setInterval(()=>{if(!isOwner&&!document.hidden)loadRemote()},60000);
document.addEventListener("visibilitychange",()=>{if(!document.hidden&&!isOwner)loadRemote()});
/* owner: ask for the one-time GitHub setup automatically */
function askSyncOnce(){if(isOwner&&!art&&!getSync())setTimeout(()=>{if(!getSync()&&!document.querySelector(".ov.open"))openSync()},900)}
const _ou=ownerUi;ownerUi=function(){_ou();askSyncOnce()};
setTimeout(askSyncOnce,2500);

const DEFAULT_PRODUCTS = [{"id": 1, "name": "Forma Vase", "desc": "Керамическая ваза ручной формы", "category": "Керамика", "price": 3900, "tone": "sand", "tag": "01 / CERAMIC", "image": "assets/forma-vase.jpg"}, {"id": 2, "name": "Soft Light", "desc": "Настольный светильник с мягким светом", "category": "Свет", "price": 6500, "tone": "sage", "tag": "02 / LIGHT", "image": "assets/soft-light.jpeg"}, {"id": 3, "name": "Daily Tray", "desc": "Поднос из натурального дерева", "category": "Аксессуары", "price": 2400, "tone": "clay", "tag": "03 / OBJECT", "image": "assets/daily-tray.jpeg"}, {"id": 4, "name": "Stone Cup", "desc": "Чашка из матовой керамики", "category": "Керамика", "price": 1600, "tone": "stone", "tag": "04 / CERAMIC", "image": "assets/stone-cup.jpeg"}, {"id": 5, "name": "Arc Lamp", "desc": "Лаконичный настольный светильник", "category": "Свет", "price": 8900, "tone": "sage", "tag": "05 / LIGHT", "image": "assets/arc-lamp.jpeg"}, {"id": 6, "name": "Forma Bowl", "desc": "Глубокая чаша для сервировки", "category": "Керамика", "price": 2800, "tone": "clay", "tag": "06 / CERAMIC", "image": "assets/forma-bowl.jpeg"}, {"id": 7, "name": "Wood Stand", "desc": "Подставка для книг и мелочей", "category": "Аксессуары", "price": 3200, "tone": "sand", "tag": "07 / OBJECT", "image": "assets/wood-stand.jpeg"}, {"id": 8, "name": "Cloud Vase", "desc": "Ваза с мягким скульптурным силуэтом", "category": "Керамика", "price": 4700, "tone": "stone", "tag": "08 / CERAMIC", "image": "assets/cloud-vase.jpeg"}];
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const $=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const savedProducts=read('mono_products',null);
let products=savedProducts?savedProducts.map(p=>({...DEFAULT_PRODUCTS.find(d=>d.id===p.id),...p,image:DEFAULT_PRODUCTS.find(d=>d.id===p.id)?.image||p.image})):DEFAULT_PRODUCTS;
if(!savedProducts)localStorage.setItem('mono_products',JSON.stringify(products));
let cart=read('mono_cart',{});
let favorites=read('mono_favorites',[]);
let compare=read('mono_compare',[]);
let recent=read('mono_recent',[]);
let catalogView='grid';
let activeCategory='all',viewMode='all';
const save=()=>{localStorage.setItem('mono_cart',JSON.stringify(cart));localStorage.setItem('mono_products',JSON.stringify(products));localStorage.setItem('mono_favorites',JSON.stringify(favorites));localStorage.setItem('mono_compare',JSON.stringify(compare));localStorage.setItem('mono_recent',JSON.stringify(recent));};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function toast(t){$('toast').textContent=t;$('toast').classList.remove('hidden');clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').classList.add('hidden'),2400);}
function updateCounts(){
 $('favoritesCount').textContent=favorites.length;$('compareCount').textContent=compare.length;$('recentCount').textContent=recent.length;
 $('cartCount').textContent=Object.values(cart).reduce((a,n)=>a+n,0);
 $('count-all').textContent=products.length;
 $('count-ceramic').textContent=products.filter(p=>p.category==='Керамика').length;
 $('count-light').textContent=products.filter(p=>p.category==='Свет').length;
 $('count-accessories').textContent=products.filter(p=>p.category==='Аксессуары').length;
}
function setCategory(cat){
 activeCategory=cat;viewMode='all';
 document.querySelectorAll('.category-link').forEach(b=>b.classList.toggle('selected',b.dataset.category===cat));
 $('catalogTitle').textContent=cat==='all'?'Все предметы':cat==='Свет'?'Освещение':cat;
 $('catalog').scrollIntoView({behavior:'smooth',block:'start'});render();
}
function currentList(){
 let q=($('search').value+' '+$('catalogSearch').value).trim().toLowerCase();
 let list=products.filter(p=>(activeCategory==='all'||p.category===activeCategory)&&
  (viewMode!=='favorites'||favorites.includes(p.id))&&
  (viewMode!=='recent'||recent.includes(p.id))&&
  (!Number($('maxPrice').value)||p.price<=Number($('maxPrice').value))&&
  (q===''||(p.name+' '+p.desc+' '+p.category).toLowerCase().includes(q)));
 const sort=$('sort').value;
 if(sort==='low')list.sort((a,b)=>a.price-b.price);
 if(sort==='high')list.sort((a,b)=>b.price-a.price);
 if(sort==='az')list.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
 return list;
}
function productCard(p){
 const fav=favorites.includes(p.id);
 return `<article class="product-card">
  <div class="product-art tone-${esc(p.tone||'sand')}">
   <img class="product-photo" src="${esc(p.image||'')}" alt="${esc(p.name)}" loading="lazy">
   <span class="product-tag">${esc(p.tag||'MONO / OBJECT')}</span>
   <div class="product-actions">
    <button data-fav="${p.id}" class="favorite-action ${fav?'active':''}" aria-label="${fav?'Убрать из избранного':'В избранное'}" aria-pressed="${fav}"><svg viewBox="0 0 24 24"><path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"/></svg></button>
    <button data-view="${p.id}" aria-label="Быстрый просмотр"><svg viewBox="0 0 24 24"><path d="M7 17 17 7M8 7h9v9"/></svg></button>
   </div>
  </div>
  <div class="product-info"><div><span class="product-category">${esc(p.category)}</span><h3>${esc(p.name)}</h3><p>${esc(p.desc)}</p></div><b>${money(p.price)}</b></div>
  <div class="product-card-bottom"><button class="add" data-add="${p.id}">В корзину <span>＋</span></button><button class="quick-view" data-view="${p.id}">Подробнее ↗</button></div>
 </article>`;
}
function render(){
 const list=currentList();
 $('products').innerHTML=list.map(productCard).join('');
 $('products').classList.toggle('list-view',catalogView==='list');
 $('empty').classList.toggle('hidden',list.length>0);
 $('resultsCount').textContent=`${list.length} ${list.length===1?'предмет':list.length<5?'предмета':'предметов'}`;
 $('activeFilters').innerHTML=(activeCategory!=='all'?`<button data-clear-cat>${esc(activeCategory)} ×</button>`:'')+(viewMode==='favorites'?'<button data-clear-fav>Избранное ×</button>':'');
 updateCounts();
}
function changeCart(id,delta){cart[id]=(cart[id]||0)+delta;if(cart[id]<=0)delete cart[id];save();updateCart();}
function updateCart(){
 const entries=Object.entries(cart).filter(([id,n])=>n>0);
 const total=entries.reduce((a,[id,n])=>a+(products.find(p=>p.id==id)?.price||0)*n,0);
 $('cartTotal').textContent=money(total);$('cartCount').textContent=entries.reduce((a,[id,n])=>a+n,0);
 $('cartItems').innerHTML=entries.length?entries.map(([id,n])=>{const p=products.find(x=>x.id==id);if(!p)return '';
 return `<div class="cart-row"><img src="${esc(p.image)}" alt=""><div class="cart-row-info"><b>${esc(p.name)}</b><small>${money(p.price)} за шт.</small><div class="qty"><button data-dec="${id}">−</button><span>${n}</span><button data-inc="${id}">+</button><button class="remove" data-del="${id}">Удалить</button></div></div><strong>${money(p.price*n)}</strong></div>`}).join(''):'<p class="empty-cart">Корзина пока пуста. Выберите предмет из каталога.</p>';
}
function openProduct(id){
 const p=products.find(x=>x.id==id);if(!p)return;
 recent=[Number(id),...recent.filter(x=>x!==Number(id))].slice(0,6);save();updateCounts();
 $('productModalContent').innerHTML=`<div class="product-detail"><div class="detail-photo"><img src="${esc(p.image)}" alt="${esc(p.name)}"></div><div class="detail-copy"><span class="eyebrow">${esc(p.category)} / MONO OBJECT</span><h2>${esc(p.name)}</h2><p>${esc(p.desc)}</p><strong>${money(p.price)}</strong><div class="detail-actions"><button class="dark-button" data-add="${p.id}">Добавить в корзину ↗</button><button class="detail-fav" data-fav="${p.id}">${favorites.includes(p.id)?'♥ В избранном':'♡ В избранное'}</button></div><small>Демонстрационная карточка товара. Сейчас это демонстрационный каталог. Если предмет понравился, добавьте его в корзину.</small></div></div>`;
 $('productModal').classList.remove('hidden');
}
function openTool(type){
 let content='';
 if(type==='favorites'||type==='recent'){
  const ids=type==='favorites'?favorites:recent;
  const list=products.filter(p=>ids.includes(p.id));
  const heading=type==='favorites'?'Избранное':'Недавно просмотренные';
  content=`<span class="eyebrow">ВАША ПОДБОРКА</span><h2>${heading}</h2>${list.length?`<div class="tool-product-list">${list.map(p=>`<div><img src="${esc(p.image)}"><b>${esc(p.name)}</b><span>${money(p.price)}</span><button data-view="${p.id}">Открыть ↗</button></div>`).join('')}</div>`:'<p>Вы пока ничего не добавили в избранное.</p>'}`;
 }else{
  const selected=products.filter(p=>compare.includes(p.id));
  const available=products.filter(p=>!compare.includes(p.id));
  content=`<span class="eyebrow">MONO / СРАВНЕНИЕ</span>
   <h2>Сравнение предметов</h2>
   <p class="compare-intro">Выберите до четырёх предметов, чтобы сопоставить их форму, категорию и стоимость.</p>
   <div class="compare-picker">
    <div class="compare-picker-head"><b>Выберите товары</b><span>${selected.length} из 4 выбрано</span></div>
    <div class="compare-choices">${products.map(p=>{const active=compare.includes(p.id);return `<article class="compare-choice ${active?'selected':''}">
      <img src="${esc(p.image)}" alt="${esc(p.name)}">
      <div class="compare-choice-info"><b>${esc(p.name)}</b><small>${esc(p.category)} · ${money(p.price)}</small></div>
      <button data-compare-toggle="${p.id}" class="${active?'chosen':''}" ${!active&&selected.length>=4?'disabled':''}>${active?'Добавлен ✓':'＋ Добавить'}</button>
    </article>`}).join('')}</div>
   </div>
   <div class="compare-results">
    <div class="compare-results-head"><b>Результат сравнения</b>${selected.length?'<button data-compare-clear>Очистить выбор</button>':''}</div>
    ${selected.length?`<div class="compare-table"><div class="compare-row"><b>Предмет</b>${selected.map(p=>`<span>${esc(p.name)} <button class="compare-remove" data-compare-toggle="${p.id}" aria-label="Убрать">×</button></span>`).join('')}</div><div class="compare-row"><b>Категория</b>${selected.map(p=>`<span>${esc(p.category)}</span>`).join('')}</div><div class="compare-row"><b>Описание</b>${selected.map(p=>`<span>${esc(p.desc)}</span>`).join('')}</div><div class="compare-row"><b>Цена</b>${selected.map(p=>`<strong>${money(p.price)}</strong>`).join('')}</div></div>`:'<p class="compare-empty">Пока нет выбранных товаров. Добавьте предметы выше — они появятся здесь.</p>'}
   </div>`;
 }
 $('toolModalContent').innerHTML=content;$('toolModal').classList.remove('hidden');
}
function toggleFavorite(id){id=Number(id);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];save();render();updateCounts();}
function toggleCompare(id){id=Number(id);if(compare.includes(id))compare=compare.filter(x=>x!==id);else if(compare.length>=4){toast('Можно сравнить не более четырёх товаров');return;}else compare.push(id);save();render();updateCounts();}
document.addEventListener('click',e=>{
 const add=e.target.closest('[data-add]');if(add){const id=Number(add.dataset.add);changeCart(id,1);toast('Предмет добавлен в корзину');return;}
 const fav=e.target.closest('[data-fav]');if(fav){toggleFavorite(fav.dataset.fav);if(!$('productModal').classList.contains('hidden'))openProduct(fav.dataset.fav);return;}
 const cmp=e.target.closest('[data-compare]');if(cmp){toggleCompare(cmp.dataset.compare);return;}
 const compareToggle=e.target.closest('[data-compare-toggle]');if(compareToggle){toggleCompare(compareToggle.dataset.compareToggle);openTool('compare');return;}
 if(e.target.closest('[data-compare-clear]')){compare=[];save();updateCounts();openTool('compare');return;}
 const view=e.target.closest('[data-view]');if(view){openProduct(view.dataset.view);return;}
 if(e.target.closest('[data-clear-cat]')){setCategory('all');return;}
 if(e.target.closest('[data-clear-fav]')){viewMode='all';render();return;}
 const cat=e.target.closest('[data-category]');if(cat){setCategory(cat.dataset.category);$('sidebar').classList.remove('mobile-open');return;}
 const dec=e.target.closest('[data-dec]');if(dec){changeCart(dec.dataset.dec,-1);return;}
 const inc=e.target.closest('[data-inc]');if(inc){changeCart(inc.dataset.inc,1);return;}
 const del=e.target.closest('[data-del]');if(del){delete cart[del.dataset.del];save();updateCart();return;}
});
$('searchForm').addEventListener('submit',e=>{e.preventDefault();$('catalog').scrollIntoView({behavior:'smooth'});render();});
$('search').addEventListener('input',render);$('catalogSearch').addEventListener('input',()=>{$('search').value='';render();});
$('sort').addEventListener('change',render);
$('maxPrice').addEventListener('input',render);
$('gridView').onclick=()=>{catalogView='grid';$('gridView').classList.add('selected');$('listView').classList.remove('selected');render();};
$('listView').onclick=()=>{catalogView='list';$('listView').classList.add('selected');$('gridView').classList.remove('selected');render();};
$('clearFilters').onclick=()=>{$('search').value='';$('catalogSearch').value='';$('sort').value='default';$('maxPrice').value='';activeCategory='all';viewMode='all';document.querySelectorAll('.category-link').forEach(b=>b.classList.toggle('selected',b.dataset.category==='all'));render();};
$('favoritesButton').onclick=()=>openTool('favorites');$('compareButton').onclick=()=>openTool('compare');
function showRecent(){viewMode='recent';activeCategory='all';$('catalogTitle').textContent='Недавно просмотренные';document.querySelectorAll('.category-link').forEach(b=>b.classList.toggle('selected',b.dataset.category==='all'));render();$('catalog').scrollIntoView({behavior:'smooth'});}
$('recentButton').onclick=()=>openTool('recent');$('recentCatalogButton').onclick=()=>showRecent();
$('cartButton').onclick=()=>$('overlay').classList.remove('hidden');$('closeCart').onclick=()=>$('overlay').classList.add('hidden');
$('overlay').onclick=e=>{if(e.target===$('overlay'))$('overlay').classList.add('hidden');};
$('checkoutButton').onclick=()=>{if(!Object.keys(cart).length)return toast('Сначала добавьте предметы');$('checkoutModal').classList.remove('hidden');};
$('closeCheckout').onclick=()=>$('checkoutModal').classList.add('hidden');
$('closeProduct').onclick=()=>$('productModal').classList.add('hidden');$('productModal').onclick=e=>{if(e.target===$('productModal'))$('productModal').classList.add('hidden');};
$('closeTool').onclick=()=>$('toolModal').classList.add('hidden');$('toolModal').onclick=e=>{if(e.target===$('toolModal'))$('toolModal').classList.add('hidden');};
$('checkoutForm').onsubmit=e=>{
 e.preventDefault();const fd=new FormData(e.target);
 const items=Object.entries(cart).map(([id,qty])=>{const p=products.find(x=>x.id==id);return p?{id:Number(id),name:p.name,price:p.price,qty}:null;}).filter(Boolean);
 const order={id:'M'+Date.now(),date:new Date().toISOString(),name:fd.get('name'),phone:fd.get('phone'),email:fd.get('email'),comment:fd.get('comment'),items,total:items.reduce((s,x)=>s+x.price*x.qty,0),status:'Новый'};
 const orders=read('mono_orders',[]);orders.unshift(order);localStorage.setItem('mono_orders',JSON.stringify(orders));
 cart={};save();updateCart();$('checkoutModal').classList.add('hidden');$('overlay').classList.add('hidden');e.target.reset();toast('Заказ '+order.id+' сохранён в демо-режиме');
};
$('mobileMenu').onclick=()=>$('sidebar').classList.toggle('mobile-open');
const promos=[
 {k:'MONO / OBJECTS 001',title:'Форма, которая<br><i>создаёт настроение.</i>',text:'Предметы для дома, к которым хочется возвращаться каждый день.',image:'assets/mono-vase.jpg',tone:'sage'},
 {k:'CERAMIC / COLLECTION',title:'Тактильность<br><i>в каждой детали.</i>',text:'Керамика с выразительной формой для спокойных домашних ритуалов.',image:'assets/cloud-vase.jpeg',tone:'clay'},
 {k:'LIGHT / EVERYDAY',title:'Свет, который<br><i>меняет атмосферу.</i>',text:'Лаконичные световые объекты и мягкие акценты в пространстве.',image:'assets/arc-lamp.jpeg',tone:'blue'}
];
let promoIndex=0;
function showPromo(){const p=promos[promoIndex];$('promoKicker').textContent=p.k;$('promoTitle').innerHTML=p.title;$('promoText').textContent=p.text;$('promoImage').style.backgroundImage=`url("${p.image}")`;$('promo').dataset.tone=p.tone;$('promoDots').textContent=promos.map((x,i)=>i===promoIndex?'●':'○').join('  ');}
$('promoPrev').onclick=()=>{promoIndex=(promoIndex+promos.length-1)%promos.length;showPromo();};
$('promoNext').onclick=()=>{promoIndex=(promoIndex+1)%promos.length;showPromo();};
showPromo();render();updateCart();

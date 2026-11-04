const serviceDetails={
 wash:{title:'Детейлинг-мойка',text:'Комплексная деликатная очистка кузова, колёс, стёкол и труднодоступных зон. Состав и последовательность этапов подбираются после осмотра автомобиля.'},
 polish:{title:'Полировка кузова',text:'Восстановительная или финишная полировка подбирается после оценки состояния лакокрасочного покрытия. Цель — улучшить внешний вид и убрать подходящие для коррекции дефекты.'},
 coating:{title:'Защитные покрытия',text:'Подготовка поверхности и нанесение защитного состава. Тип покрытия и срок обслуживания зависят от состояния автомобиля и выбранного решения.'},
 film:{title:'Антигравийная плёнка',text:'Оклейка отдельных элементов или зон риска полиуретановой плёнкой. Конфигурация защиты согласовывается до начала работ.'},
 interior:{title:'Уход за салоном',text:'Деликатная очистка текстиля, кожи, пластика и других интерьерных поверхностей с учётом материала и его состояния.'},
 lights:{title:'Восстановление оптики',text:'Очистка и восстановление внешней поверхности фар с подбором подходящей защиты.'}
};
const modal=document.querySelector('#detailModal');
function openDetail(key){const item=serviceDetails[key];if(!item)return;document.querySelector('#modalTitle').textContent=item.title;document.querySelector('#modalText').textContent=item.text;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-detail]').forEach(btn=>btn.addEventListener('click',()=>openDetail(btn.dataset.detail)));
modal.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeModal();closeLightbox();}});
document.querySelector('#modalCta').addEventListener('click',closeModal);

const search=document.querySelector('#serviceSearch'),cards=[...document.querySelectorAll('.service-card')],empty=document.querySelector('#emptyState');
search.addEventListener('input',()=>{const q=search.value.trim().toLowerCase();let count=0;cards.forEach(card=>{const match=card.dataset.search.includes(q)||card.innerText.toLowerCase().includes(q);card.hidden=!match;if(match)count++;});empty.hidden=count!==0;});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();search.focus();}});

document.querySelectorAll('.price-tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.price-tab').forEach(t=>t.classList.toggle('active',t===tab));document.querySelectorAll('.price-row').forEach(row=>row.hidden=tab.dataset.filter!=='all'&&row.dataset.category!==tab.dataset.filter);}));

const lightbox=document.querySelector('#lightbox'),lightboxVisual=document.querySelector('#lightboxVisual'),lightboxCaption=document.querySelector('#lightboxCaption');
function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';}
document.querySelectorAll('[data-gallery]').forEach((btn,i)=>btn.addEventListener('click',()=>{lightboxVisual.className='';lightboxVisual.classList.add('gp-'+['one','two','three'][i]);lightboxCaption.textContent=btn.querySelector('b').textContent;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}));
lightbox.querySelector('.lightbox-close').addEventListener('click',closeLightbox);lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});

const form=document.querySelector('#requestForm'),note=document.querySelector('#formNote');
form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const data=new FormData(form);note.textContent=`Спасибо, ${data.get('name')}! Форма работает в демо-режиме — подключение отправки заявки настраивается отдельно.`;note.style.color='#168bca';form.reset();});

const menuBtn=document.querySelector('.menu-toggle'),nav=document.querySelector('.main-nav');
menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}));
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const sections=[...document.querySelectorAll('main section[id]')],navLinks=[...nav.querySelectorAll('a')];
const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(section=>sectionObserver.observe(section));

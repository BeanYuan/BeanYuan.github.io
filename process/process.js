/* Shared lightbox: click any figure image to open it in place. Arrow keys / buttons step through
   every image on the page, Esc or a click on the backdrop closes. Links around images are intercepted
   so they still work without JS. */
(function () {
  if (window.__lbx) return; window.__lbx = 1;

  var box = document.createElement('div');
  box.className = 'lbx'; box.hidden = true;
  box.innerHTML = '<button class="lbx-x" type="button" aria-label="Close">&times;</button>'
    + '<button class="lbx-nav lbx-prev" type="button" aria-label="Previous">&#8249;</button>'
    + '<button class="lbx-nav lbx-next" type="button" aria-label="Next">&#8250;</button>'
    + '<figure class="lbx-fig"><img alt=""><figcaption><span class="lbx-cap"></span><span class="lbx-n"></span></figcaption></figure>';
  document.body.appendChild(box);
  var img = box.querySelector('img'), cap = box.querySelector('.lbx-cap'), num = box.querySelector('.lbx-n');
  var items = [], at = -1;

  function collect() {
    items = [].slice.call(document.querySelectorAll('figure img')).filter(function (el) {
      return el.offsetParent !== null;   // only what is on the visible tab
    });
  }
  function full(el) {
    var a = el.closest('a[href]');
    return (a && /\.(webp|png|jpe?g|gif|svg)$/i.test(a.getAttribute('href'))) ? a.getAttribute('href') : el.currentSrc || el.src;
  }
  function show(i) {
    if (!items.length) return;
    at = (i + items.length) % items.length;
    var el = items[at], fc = el.closest('figure') && el.closest('figure').querySelector('figcaption');
    img.src = full(el); img.alt = el.alt || '';
    cap.innerHTML = fc ? fc.innerHTML : '';
    num.textContent = items.length > 1 ? (at + 1) + ' / ' + items.length : '';
    box.querySelectorAll('.lbx-nav').forEach(function (b) { b.hidden = items.length < 2; });
  }
  function open(el) {
    collect(); var i = items.indexOf(el); if (i < 0) { items = [el]; i = 0; }
    box.hidden = false; document.documentElement.style.overflow = 'hidden'; show(i);
  }
  function close() { box.hidden = true; document.documentElement.style.overflow = ''; img.src = ''; }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('figure img');
    if (el) { e.preventDefault(); open(el); return; }
    if (e.target === box || e.target.closest('.lbx-x')) { close(); return; }
    var nav = e.target.closest('.lbx-nav');
    if (nav) { e.stopPropagation(); show(at + (nav.classList.contains('lbx-next') ? 1 : -1)); }
  });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(at + 1);
    else if (e.key === 'ArrowLeft') show(at - 1);
  });
})();

(function(){
  var LANG_KEY='lizhuoyuan_lang', THEME_KEY='lizhuoyuan_theme_v2', root=document.documentElement;

  // language: #en / #zh from the portfolio link wins, then the saved choice, then the browser
  function setLang(lang, save){
    root.setAttribute('data-lang', lang); root.lang = lang==='zh' ? 'zh-CN' : 'en';
    document.querySelectorAll('.lang button').forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.set===lang); });
    if(save){ try{ localStorage.setItem(LANG_KEY, lang); }catch(e){} }
  }
  var init='en';
  try{ var s=localStorage.getItem(LANG_KEY); if(s==='zh'||s==='en') init=s; else if((navigator.language||'').toLowerCase().indexOf('zh')===0) init='zh'; }catch(e){}
  if(location.hash==='#zh'||location.hash==='#en'){ init=location.hash.slice(1); history.replaceState(null,'',location.pathname+location.search); }
  setLang(init, false);
  document.querySelectorAll('.lang button').forEach(function(b){ b.addEventListener('click', function(){ setLang(b.dataset.set, true); }); });

  // theme shared with the portfolio
  document.querySelector('.theme').addEventListener('click', function(){
    var light=!root.classList.contains('theme-light'); root.classList.toggle('theme-light', light);
    try{ localStorage.setItem(THEME_KEY, light?'light':'dark'); }catch(e){}
  });

  // back links keep the language
  document.querySelectorAll('a[href^="index.html"]').forEach(function(a){
    a.addEventListener('click', function(){ a.href='index.html#work'; });
  });

  // sub-navbar: one phase at a time, remembered in the URL hash
  var secs=[].slice.call(document.querySelectorAll('main .phase')), links={};
  var bar=document.querySelector('.phasebar-in'), nav=document.querySelector('.phasebar'), top=document.querySelector('.topbar');
  document.querySelectorAll('.phasebar a').forEach(function(a){ links[a.getAttribute('href').slice(1)]=a; });
  function show(id, scroll){
    if(!links[id]) id=secs[0].id;
    secs.forEach(function(s){ s.classList.toggle('on', s.id===id); });
    Object.keys(links).forEach(function(k){
      links[k].classList.toggle('on', k===id);
      if(k===id) links[k].setAttribute('aria-current','page'); else links[k].removeAttribute('aria-current');
    });
    var a=links[id]; bar.scrollTo({left:a.offsetLeft-(bar.clientWidth-a.offsetWidth)/2, behavior:'smooth'});
    if(scroll){
      var y=nav.getBoundingClientRect().top+window.scrollY-top.offsetHeight;
      if(window.scrollY>y+1) window.scrollTo({top:y, behavior:'auto'});
    }
  }
  document.addEventListener('click', function(e){
    var a=e.target.closest('a[href^="#"]'); if(!a) return;
    var id=a.getAttribute('href').slice(1); if(!links[id]) return;
    e.preventDefault(); show(id, true); history.replaceState(null,'','#'+id);
  });
  bar.addEventListener('keydown', function(e){
    if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft') return;
    var ids=Object.keys(links), cur=ids.indexOf((document.activeElement.getAttribute('href')||'').slice(1)); if(cur<0) return;
    var nx=ids[(cur+(e.key==='ArrowRight'?1:ids.length-1))%ids.length]; links[nx].focus(); show(nx,false); history.replaceState(null,'','#'+nx);
  });
  window.addEventListener('hashchange', function(){ show(location.hash.slice(1), true); });
  show(location.hash.slice(1), false);
})();

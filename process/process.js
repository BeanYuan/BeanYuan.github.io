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

(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='sessionBook.saved';
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}};
  const setSaved=a=>localStorage.setItem(STORE,JSON.stringify([...new Set(a)]));
  const toast=(msg)=>{const t=$('.toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1800)};
  const tiles=()=>$$('.tile');
  const activeLevel=()=>$('.filter-chip[data-filter-level].is-active')?.dataset.filterLevel||'all';
  const activeTheme=()=>$('.filter-chip[data-filter-theme].is-active')?.dataset.filterTheme||'all';
  const applyFilters=()=>{
    const players=$('#finder-players')?.value||'all';
    const time=$('#finder-time')?.value||'all';
    const level=activeLevel();
    const theme=activeTheme();
    const q=($('.search input')?.value||'').trim().toLowerCase();
    let n=0;
    tiles().forEach(t=>{
      const ok=(players==='all'||t.dataset.squad===players)&&(time==='all'||t.dataset.time===time)&&(level==='all'||t.dataset.level===level)&&(theme==='all'||t.dataset.theme===theme)&&(!q||t.dataset.search.includes(q));
      t.classList.toggle('hidden',!ok); if(ok)n++;
    });
    const count=$('#count'); if(count)count.textContent=`${n} session${n===1?'':'s'}`;
    const result=$('#find-result'); if(result)result.textContent=`${n} session${n===1?'':'s'} match your choices`;
  };
  const clearFinder=()=>{$$('#finder-players,#finder-time').forEach(s=>s.value='all');const q=$('.search input');if(q)q.value='';$$('.filter-chip[data-filter-level],.filter-chip[data-filter-theme]').forEach(b=>{const isAll=b.dataset.filterLevel==='all'||b.dataset.filterTheme==='all';b.classList.toggle('is-active',isAll);b.setAttribute('aria-pressed',isAll)});applyFilters()};
  const updateSavedUI=()=>{
    const saved=getSaved(), count=$('#saved-count'); if(count)count.textContent=saved.length;
    $$('.save-tile').forEach(b=>{const yes=saved.includes(b.dataset.saveHref);b.classList.toggle('saved',yes);b.setAttribute('aria-pressed',yes);const st=$('.star',b);if(st)st.textContent=yes?'★':'☆';b.lastChild.textContent=yes?' Saved':' Save session'});
    tiles().forEach(t=>t.classList.toggle('is-saved',saved.includes(t.querySelector('a')?.getAttribute('href'))));
  };
  $$('.find-field select').forEach(s=>s.addEventListener('change',applyFilters));
  $$('.filter-chip[data-filter-level]').forEach(b=>b.addEventListener('click',()=>{ $$('.filter-chip[data-filter-level]').forEach(x=>{const active=x===b;x.classList.toggle('is-active',active);x.setAttribute('aria-pressed',active)}); applyFilters(); }));
  $$('.filter-chip[data-filter-theme]').forEach(b=>b.addEventListener('click',()=>{ $$('.filter-chip[data-filter-theme]').forEach(x=>{const active=x===b;x.classList.toggle('is-active',active);x.setAttribute('aria-pressed',active)}); applyFilters(); }));
  $('.search input')?.addEventListener('input',applyFilters);
  $('#find-btn')?.addEventListener('click',()=>{applyFilters();$('#main')?.scrollIntoView({behavior:'smooth',block:'start'})});
  $('#find-clear')?.addEventListener('click',clearFinder);
  $$('.save-tile').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const saved=getSaved(),href=b.dataset.saveHref;const next=saved.includes(href)?saved.filter(x=>x!==href):[...saved,href];setSaved(next);updateSavedUI();toast(next.includes(href)?'Session saved for later':'Session removed')}));
  $('#show-saved')?.addEventListener('click',()=>{const saved=getSaved();if(!saved.length){toast('You have no saved sessions yet');return}tiles().forEach(t=>t.classList.toggle('hidden',!saved.includes(t.querySelector('a')?.getAttribute('href'))));const r=$('#find-result');if(r)r.textContent=`${saved.length} saved session${saved.length===1?'':'s'}`});
  updateSavedUI(); applyFilters();
})();

(()=>{
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='sessionBook.saved';
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch(e){return[]}};
  const setSaved=a=>localStorage.setItem(STORE,JSON.stringify([...new Set(a)]));
  const toast=(msg)=>{const t=$('.toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1800)};
  const updateSavedUI=()=>{const saved=getSaved();const count=$('#saved-count');if(count)count.textContent=saved.length;$$('.save-tile').forEach(b=>{const yes=saved.includes(b.dataset.saveHref);b.classList.toggle('saved',yes);b.setAttribute('aria-pressed',yes);const st=$('.star',b);if(st)st.textContent=yes?'★':'☆';b.lastChild.textContent=yes?' Saved':' Save session'});$$('.tile').forEach(t=>t.classList.toggle('is-saved',saved.includes(t.querySelector('a')?.getAttribute('href'))));};
  const tiles=()=>$$('.tile');
  const applyFinder=()=>{
    const players=$('#finder-players')?.value||'all', time=$('#finder-time')?.value||'all', theme=$('#finder-theme')?.value||'all', level=$('#finder-level')?.value||'all';
    let n=0; tiles().forEach(t=>{const ok=(players==='all'||t.dataset.squad===players)&&(time==='all'||t.dataset.time===time)&&(theme==='all'||t.dataset.theme===theme)&&(level==='all'||t.dataset.level===level);t.classList.toggle('hidden',!ok);if(ok)n++});
    $$('.group-head').forEach(g=>{const group=g.dataset.group;const any=tiles().some(t=>!t.classList.contains('hidden')&&t.dataset.level===group);g.classList.toggle('hidden',!any)});
    const r=$('#find-result');if(r)r.textContent=`${n} session${n===1?'':'s'} match your choices`;
    return n;
  };
  const clearFinder=()=>{$$('#finder-players,#finder-time,#finder-theme,#finder-level').forEach(s=>s.value='all');applyFinder()};
  $$('.find-field select').forEach(s=>s.addEventListener('change',applyFinder));
  $('#find-btn')?.addEventListener('click',()=>{applyFinder();$('#main')?.scrollIntoView({behavior:'smooth',block:'start'})});
  $('#find-clear')?.addEventListener('click',clearFinder);
  $$('.save-tile').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const saved=getSaved(),href=b.dataset.saveHref;setSaved(saved.includes(href)?saved.filter(x=>x!==href):[...saved,href]);updateSavedUI();toast(saved.includes(href)?'Session removed':'Session saved for later')}));
  $('#show-saved')?.addEventListener('click',()=>{const saved=getSaved();if(!saved.length){toast('You have no saved sessions yet');return}tiles().forEach(t=>t.classList.toggle('hidden',!saved.includes(t.querySelector('a')?.getAttribute('href'))));$$('.group-head').forEach(g=>{const group=g.dataset.group;g.classList.toggle('hidden',!tiles().some(t=>!t.classList.contains('hidden')&&t.dataset.level===group))});const r=$('#find-result');if(r)r.textContent=`${saved.length} saved session${saved.length===1?'':'s'}`});
  // Keep the original level/theme filter controls working alongside the quick finder.
  const state={level:'all',theme:'all'};
  $$('.chip[data-dim]').forEach(ch=>ch.addEventListener('click',()=>{
    const dim=ch.dataset.dim,val=ch.dataset.val;state[dim]=val;$$(`.chip[data-dim="${dim}"]`).forEach(x=>{const on=x===ch;x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)});
    const players=$('#finder-players')?.value||'all',time=$('#finder-time')?.value||'all';let n=0;
    tiles().forEach(t=>{const ok=(state.level==='all'||t.dataset.level===state.level)&&(state.theme==='all'||t.dataset.theme===state.theme)&&(players==='all'||t.dataset.squad===players)&&(time==='all'||t.dataset.time===time);t.classList.toggle('hidden',!ok);if(ok)n++});
    $$('.group-head').forEach(g=>g.classList.toggle('hidden',!tiles().some(t=>!t.classList.contains('hidden')&&t.dataset.level===g.dataset.group)));
    const r=$('#find-result');if(r)r.textContent=`${n} session${n===1?'':'s'} match your choices`;
  }));
  const search=$('.search input');
  const applyAll=()=>{
    const players=$('#finder-players')?.value||'all', time=$('#finder-time')?.value||'all', theme=$('#finder-theme')?.value||'all', level=$('#finder-level')?.value||'all', q=(search?.value||'').trim().toLowerCase();
    let n=0; tiles().forEach(t=>{const ok=(players==='all'||t.dataset.squad===players)&&(time==='all'||t.dataset.time===time)&&(theme==='all'||t.dataset.theme===theme)&&(level==='all'||t.dataset.level===level)&&(!q||t.dataset.search.includes(q));t.classList.toggle('hidden',!ok);if(ok)n++});
    $$('.group-head').forEach(g=>{const group=g.dataset.group;g.classList.toggle('hidden',!tiles().some(t=>!t.classList.contains('hidden')&&t.dataset.level===group))});
    const count=$('#count');if(count)count.textContent=`${n} session${n===1?'':'s'}`;
    const r=$('#find-result');if(r)r.textContent=`${n} session${n===1?'':'s'} match your choices`;
  };
  search?.addEventListener('input',applyAll);
  $$('.chip[data-dim]').forEach(ch=>ch.addEventListener('click',()=>{const sel=$(`#finder-${ch.dataset.dim}`);if(sel)sel.value=ch.dataset.val;setTimeout(applyAll,0)}));
  // Make the quick finder and legacy chips cooperate with text search.
  $$('.find-field select').forEach(s=>s.addEventListener('change',applyAll));
  $('#find-btn')?.addEventListener('click',applyAll);
  $('#find-clear')?.addEventListener('click',()=>{clearFinder();if(search)search.value='';applyAll()});
  updateSavedUI();
})();
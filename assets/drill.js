
(function(){
'use strict';
var toast=document.querySelector('.toast');
function flash(m){toast.textContent=m;toast.classList.add('show');
  clearTimeout(flash.t);flash.t=setTimeout(function(){toast.classList.remove('show')},1900);}
var copy=document.querySelector('[data-copy]');
if(copy) copy.addEventListener('click',function(){
  var url=location.href.split('#')[0];
  if(navigator.clipboard) navigator.clipboard.writeText(url).then(
    function(){flash('Link copied');},function(){flash(url);});
  else flash(url);
});
var pr=document.querySelector('[data-print]');
if(pr) pr.addEventListener('click',function(){window.print();});
/* native share where the device offers it */
var ns=document.querySelector('[data-native]');
if(ns){
  if(navigator.share){
    ns.hidden=false;
    ns.addEventListener('click',function(){
      navigator.share({title:document.title,url:location.href.split('#')[0]}).catch(function(){});
    });
  }
}
})();


/* Session Book v2: local saves + private coach notes */
(()=>{
 const STORE='sessionBook.saved', NOTES='sessionBook.notes';
 const get=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch(e){return[]}};
 const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
 const toast=m=>{const t=document.querySelector('.toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(window.__sbtoast);window.__sbtoast=setTimeout(()=>t.classList.remove('show'),1800)};
 document.querySelectorAll('[data-save-drill]').forEach(b=>{const key=b.dataset.saveDrill;let a=get(STORE);const sync=()=>{a=get(STORE);const yes=a.includes(key);b.setAttribute('aria-pressed',yes);b.textContent=yes?'★ Saved':'☆ Save session';b.classList.toggle('saved',yes)};sync();b.addEventListener('click',()=>{a=get(STORE);a=a.includes(key)?a.filter(x=>x!==key):[...a,key];set(STORE,a);sync();toast(a.includes(key)?'Session saved':'Session removed')})});
 document.querySelectorAll('[data-session-notes]').forEach(ta=>{const key=ta.dataset.sessionNotes;let all=get(NOTES);ta.value=all[key]||'';const status=ta.parentElement.querySelector('.note-status');let timer;ta.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(()=>{all=get(NOTES);all[key]=ta.value;set(NOTES,all);if(status)status.textContent='Saved on this device';setTimeout(()=>{if(status)status.textContent=''},1500)},350)})});
})();


/* Version 4 — diagram focus mode */
(()=>{
 const btn=document.querySelector('[data-fullscreen-diagram]');
 const fig=document.querySelector('.v4-diagram-card figure');
 if(btn && fig){
  btn.addEventListener('click',()=>{
   if(fig.requestFullscreen){fig.requestFullscreen().catch(()=>{});} else {fig.classList.toggle('diagram-focus');}
  });
 }
})();

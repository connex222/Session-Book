
(function(){
'use strict';
var $=function(s,c){return (c||document).querySelector(s)},
    $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
var tiles=$$('.tile'), input=$('.search input'), state={level:'all',theme:'all',q:''};
var LABEL={};
$$('.chip').forEach(function(c){LABEL[c.dataset.dim+':'+c.dataset.val]=c.dataset.label||c.textContent.trim();});

function hit(t,st){
  return (st.level==='all'||t.dataset.level===st.level)
      && (st.theme==='all'||t.dataset.theme===st.theme)
      && (!st.q||t.dataset.search.indexOf(st.q.toLowerCase())>-1);
}
/* how many results a chip would give, holding the other filters steady */
function wouldGive(dim,val){
  var probe={level:state.level,theme:state.theme,q:state.q};
  probe[dim]=val;
  return tiles.filter(function(t){return hit(t,probe)}).length;
}
function paintChips(){
  $$('.chip').forEach(function(c){
    var n=wouldGive(c.dataset.dim,c.dataset.val);
    var box=$('.n',c);
    if(box) box.textContent=n;
    var dead = n===0 && !c.classList.contains('on');
    c.classList.toggle('dead',dead);
    c.setAttribute('aria-disabled',dead?'true':'false');
  });
}
function paintActive(){
  var bar=$('#active'), bits=[];
  ['level','theme'].forEach(function(d){
    if(state[d]!=='all') bits.push('<button class="pill" data-clear="'+d+'">'+
      LABEL[d+':'+state[d]]+'<span aria-hidden="true">\u00d7</span></button>');
  });
  if(state.q) bits.push('<button class="pill" data-clear="q">\u201c'+
    state.q.replace(/[<>&"]/g,'')+'\u201d<span aria-hidden="true">\u00d7</span></button>');
  if(bits.length){
    bar.innerHTML='<span class="af-label">Filtering by</span>'+bits.join('')+
      '<button class="pill pill--clear" data-clear="all">Clear all</button>';
    bar.hidden=false;
  } else { bar.hidden=true; bar.innerHTML=''; }
  $$('[data-clear]',bar).forEach(function(b){
    b.addEventListener('click',function(){
      var w=b.dataset.clear;
      if(w==='all'){state.level='all';state.theme='all';state.q='';input.value='';}
      else if(w==='q'){state.q='';input.value='';}
      else state[w]='all';
      syncChips(); apply();
    });
  });
}
function syncChips(){
  ['level','theme'].forEach(function(d){
    $$('.chip[data-dim="'+d+'"]').forEach(function(c){
      var on=c.dataset.val===state[d];
      c.classList.toggle('on',on);
      c.setAttribute('aria-pressed',on?'true':'false');
    });
  });
}
function apply(){
  var shown=0;
  tiles.forEach(function(t){
    var ok=hit(t,state);
    t.classList.toggle('hidden',!ok); if(ok) shown++;
  });
  $$('.group-head').forEach(function(h){
    var any=tiles.some(function(t){return t.dataset.level===h.dataset.group&&!t.classList.contains('hidden')});
    h.classList.toggle('hidden',!any);
  });
  $('#count').textContent=shown+(shown===1?' session':' sessions');
  $('.empty').hidden = shown>0;
  paintChips(); paintActive();
  var u=new URL(location.href);
  state.level==='all'?u.searchParams.delete('level'):u.searchParams.set('level',state.level);
  state.theme==='all'?u.searchParams.delete('theme'):u.searchParams.set('theme',state.theme);
  history.replaceState(null,'',u.toString().replace(/\?$/,''));
}
$$('.chip').forEach(function(c){
  c.addEventListener('click',function(){
    if(c.classList.contains('dead')) return;
    state[c.dataset.dim]=c.dataset.val; syncChips(); apply();
  });
});
input.addEventListener('input',function(){state.q=input.value.trim();apply();});
$('#resetall').addEventListener('click',function(){
  state={level:'all',theme:'all',q:''};input.value='';syncChips();apply();
});
document.addEventListener('keydown',function(e){
  if(e.key==='/'&&!/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)){
    e.preventDefault();input.focus();}
});
var p=new URLSearchParams(location.search);
['level','theme'].forEach(function(d){var v=p.get(d);if(v)state[d]=v;});
syncChips(); apply();
})();

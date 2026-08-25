
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

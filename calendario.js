// CALENDAR
var selDay=new Date(TODAY);
var weMap={};

function buildWeek(){
  var ws=document.getElementById('week-sel');ws.innerHTML='';
  var sun=new Date(TODAY);sun.setDate(TODAY.getDate()-TODAY.getDay());
  for(var i=0;i<7;i++){
    var d=new Date(sun);d.setDate(sun.getDate()+i);
    var p=document.createElement('div');
    p.className='day-pill'+(d.toDateString()===selDay.toDateString()?' active':'');
    p.innerHTML='<div class="dpn">'+DAYS[d.getDay()]+'</div><div class="dpd">'+d.getDate()+'</div><div class="dotrow"><div class="dot a"></div><div class="dot e"></div></div>';
    (function(dd,el){el.onclick=function(){document.querySelectorAll('.day-pill').forEach(function(x){x.classList.remove('active');});el.classList.add('active');selDay=dd;renderCal();};})(new Date(d),p);
    ws.appendChild(p);
  }
}

function getWE(ds){
  if(!weMap[ds])weMap[ds]=[
    {e:'🧹',n:'Faxina da casa',w:'both'},
    {e:'🐕',n:'Cachorros',w:'a'},
    {e:'🍳',n:'Almoço juntos',w:'both'},
    {e:'🎬',n:'Lazer juntos',w:'both'},
  ];
  return weMap[ds];
}
var WES=[
  {e:'🧹',n:'Faxina'},{e:'🐕',n:'Passeio cachorros'},
  {e:'🌳',n:'Parque'},{e:'🎬',n:'Filme/série'},
  {e:'📚',n:'Estudos'},{e:'🍕',n:'Comer fora'},
  {e:'🏊',n:'Praia/piscina'},{e:'🛍',n:'Mercado'},
  {e:'🧘',n:'Descanso'}
];

var wDS=null,wI=null;
function openWECtx(e,i){
  e.stopPropagation();wDS=selDay.toDateString();wI=i;
  var ctx=document.getElementById('ctx');
  document.getElementById('ctx-edit').onclick=function(){ctx.classList.remove('open');openEditWE();};
  document.getElementById('ctx-del').onclick=function(){ctx.classList.remove('open');weMap[wDS].splice(wI,1);renderCal();};
  ctx.classList.add('open');
  var r=e.target.getBoundingClientRect();
  ctx.style.top=(r.bottom+6)+'px';
  ctx.style.left=Math.min(r.left-90,window.innerWidth-165)+'px';
}
function openEditWE(){
  var t=weMap[wDS][wI];
  openModal('Editar Atividade','<div class="fg"><label class="fl">Emoji</label><input class="fi" id="we-e" value="'+t.e+'" style="width:65px"></div><div class="fg"><label class="fl">Nome</label><input class="fi" id="we-n" value="'+t.n+'"></div><div class="fg"><label class="fl">Responsável</label><div class="wsel"><button class="wo'+(t.w==='a'?' sa':'')+'" onclick="sw2(this,\'a\')">Allan</button><button class="wo'+(t.w==='p'?' sp2':'')+'" onclick="sw2(this,\'p\')">Perla</button><button class="wo'+(t.w==='both'?' sb':'')+'" onclick="sw2(this,\'both\')">Ambos</button></div><input type="hidden" id="tw" value="'+t.w+'"></div><button class="save-btn" onclick="saveEWE()">Salvar</button>');
}
function saveEWE(){var t=weMap[wDS][wI];t.e=document.getElementById('we-e').value||t.e;t.n=document.getElementById('we-n').value.trim()||t.n;t.w=document.getElementById('tw').value;closeModal();renderCal();}

function openAddWE(ds){
  var sugg=WES.map(function(s){return'<button class="fbtn" style="font-size:11px;padding:5px 10px" onclick="qWE(\''+ds+'\',\''+s.e+'\',\''+s.n+'\')">'+s.e+' '+s.n+'</button>';}).join('');
  openModal('Adicionar Atividade','<div class="fg"><label class="fl">Sugestões</label><div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">'+sugg+'</div></div><div class="fg"><label class="fl">Personalizar</label><div style="display:flex;gap:6px;margin-bottom:8px"><input class="fi" id="we-ne" value="🎯" style="width:60px"><input class="fi" id="we-nn" placeholder="Nome" style="flex:1"></div></div><div class="fg"><label class="fl">Responsável</label><div class="wsel"><button class="wo" onclick="sw2(this,\'a\')">Allan</button><button class="wo" onclick="sw2(this,\'p\')">Perla</button><button class="wo sb" onclick="sw2(this,\'both\')">Ambos</button></div><input type="hidden" id="tw" value="both"></div><button class="save-btn" onclick="sNWE(\''+ds+'\')">Adicionar</button>');
}
function qWE(ds,e,n){if(!weMap[ds])weMap[ds]=[];weMap[ds].push({e:e,n:n,w:'both'});closeModal();renderCal();}
function sNWE(ds){var n=document.getElementById('we-nn').value.trim();if(!n)return;if(!weMap[ds])weMap[ds]=[];weMap[ds].push({e:document.getElementById('we-ne').value||'🎯',n:n,w:document.getElementById('tw').value});closeModal();renderCal();}

function cRow(e,n,t,w){return'<div class="task-item" style="margin-bottom:7px"><span class="temi">'+e+'</span><div class="tinfo"><div class="tn">'+n+'</div>'+(t?'<div class="tt">'+t+'</div>':'')+'</div><span class="twh '+(w==='both'?'both':w)+'">'+(w==='both'?'Ambos':nm(w))+'</span></div>';}

var calMenuIdx=0;
function renderCal(){
  var d=selDay,dow=d.getDay(),isWE=dow===0||dow===6,ds=d.toDateString();
  var ms=gM(d),ns=gN(d);
  var h='';
  h+='<div class="cal-sec"><div class="cal-hd">Manhã</div>';
  if(!isWE)h+=cRow('💪','Academia','05:30','both');
  h+=cRow('🐕','Cachorros',isWE?'Manhã':'07:00',ms.dog);
  h+=cRow('☕','Café da manhã','07:00',ms.cafe);
  if(!isWE)h+=cRow('💼','Trabalho','08:00–18:00','both');
  h+='</div>';
  if(isWE){
    var wt=getWE(ds);
    h+='<div class="cal-sec"><div class="cal-hd">Fim de semana 🌅</div>';
    wt.forEach(function(t,i){h+='<div class="task-item" style="margin-bottom:7px"><span class="temi">'+t.e+'</span><div class="tinfo"><div class="tn">'+t.n+'</div></div><span class="twh '+(t.w==='both'?'both':t.w)+'">'+(t.w==='both'?'Ambos':nm(t.w))+'</span><button class="tmenu" onclick="openWECtx(event,'+i+')">⋯</button></div>';});
    h+='<button class="add-dashed" style="margin-top:4px" onclick="openAddWE(\''+ds+'\')">+ Adicionar atividade</button></div>';
  }else{
    h+='<div class="cal-sec"><div class="cal-hd">Noite</div>';
    h+=cRow('🍳','Fazer a janta','18:30',ns.cook);
    h+=cRow('🐕','Cachorros noite','18:30',ns.dog);
    if(ns.ch)h+=cRow('⛪','Catecumenato','19:30','a');
    h+='</div>';
  }
  var cm=menus[calMenuIdx];
  h+='<div class="cal-sec"><div class="cal-hd">Cardápio</div><div class="menu-card" style="margin:0"><div class="mmeal">Janta</div><div class="mname" id="cal-mn">'+cm.n+'</div><div class="mtags">'+cm.t.map(function(x){return'<span class="mtag g">'+x+'</span>';}).join('')+'</div><button class="sug-btn" onclick="nextCalMenu()">↻ Trocar</button></div></div>';
  document.getElementById('cal-content').innerHTML=h;
}
function nextCalMenu(){calMenuIdx=(calMenuIdx+1)%menus.length;var el=document.getElementById('cal-mn');if(el)el.textContent=menus[calMenuIdx].n;}
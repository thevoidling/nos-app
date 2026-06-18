// MOOD
function mood(who,btn){
  var parent = btn.parentNode;
  parent.querySelectorAll('.mbtn').forEach(function(b){ b.classList.remove('on'); });
  btn.classList.add('on');
  if(!moodState) moodState = {};
  moodState[who] = btn.textContent.trim();
  saveState();
}

// NOTE
var noteText = '';
var moodState = {};
function openNoteModal(){
  openModal('Recado 💬','<div class="fg"><label class="fl">Para o parceiro</label><textarea class="fi" id="note-ta" style="height:80px;resize:none">'+noteText+'</textarea></div><button class="save-btn" onclick="saveNote()">Salvar</button>');
}
function saveNote(){
  noteText = document.getElementById('note-ta').value.trim();
  var t = noteText || 'Deixe um recado para o parceiro...';
  var el1 = document.getElementById('note-tx');
  var el2 = document.getElementById('note-tx-s');
  if(el1) el1.textContent = t;
  if(el2) el2.textContent = t;
  closeModal();
  saveState();
}

// MENUS (quick suggestions)
var menus=[
  {n:'Frango grelhado com batata doce 🍗🍠',t:['⚡ ~30 min','💪 Proteico']},
  {n:'Bife acebolado com arroz e feijão 🥩',t:['⚡ ~25 min','💪 Proteico']},
  {n:'Omelete de frango com queijo 🥚🍗',t:['⚡ ~15 min','💪 Proteico']},
  {n:'Filé de frango ao molho de ervas 🍗',t:['⚡ ~25 min','🥗 Saudável']},
  {n:'Carne moída com legumes e arroz 🥩🥕',t:['⚡ ~25 min','💪 Proteico']},
  {n:'Frango assado com brócolis 🍗🥦',t:['⚡ ~35 min','🥗 Saudável']},
  {n:'Bife grelhado com salada e ovo 🥩🥚',t:['⚡ ~20 min','💪 Proteico']},
  {n:'Picanha ao alho com arroz 🥩🍚',t:['⚡ ~30 min','💪 Proteico']},
  {n:'Frango desfiado com macarrão 🍝🍗',t:['⚡ ~25 min','💪 Energia']},
  {n:'Tapioca de frango com queijo 🫓🍗',t:['⚡ ~15 min','🌿 Leve']},
];
var mIdx = 0;
function nextMenu(){
  mIdx = (mIdx+1) % menus.length;
  var m = menus[mIdx];
  document.getElementById('dinner-name').textContent = m.n;
  document.getElementById('dinner-tags').innerHTML = m.t.map(function(x){ return '<span class="mtag g">'+x+'</span>'; }).join('');
}

// ── WEEKLY MEAL PLAN ──────────────────────────────────────
// weekPlan = { '2026-05-26': recipeIndex, '2026-05-27': recipeIndex, ... }
var weekPlan = {};

function getDateKey(d){
  return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
}

function getTodayPlanned(){
  var key = getDateKey(TODAY);
  if(weekPlan[key] !== undefined && recipes[weekPlan[key]]){
    return recipes[weekPlan[key]];
  }
  return null;
}

function renderTodayMenu(){
  var planned = getTodayPlanned();
  var el = document.getElementById('dinner-name');
  var tags = document.getElementById('dinner-tags');
  if(planned && el){
    el.textContent = planned.e + ' ' + planned.n;
    if(tags) tags.innerHTML = planned.tl.map(function(x){ return '<span class="mtag g">'+x+'</span>'; }).join('');
  }
}

function renderWeekPlan(){
  var el = document.getElementById('week-plan-grid');
  if(!el) return;
  var DAYS_SHORT = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  // Show Mon-Sun of current week
  var today = new Date(TODAY);
  var mon = new Date(today);
  mon.setDate(today.getDate() - (today.getDay() === 0 ? 6 : today.getDay()-1));

  var html = '';
  for(var i=0; i<7; i++){
    var d = new Date(mon);
    d.setDate(mon.getDate() + i);
    var key = getDateKey(d);
    var isToday = d.toDateString() === TODAY.toDateString();
    var recIdx = weekPlan[key];
    var rec = (recIdx !== undefined && recipes[recIdx]) ? recipes[recIdx] : null;
    var dayLabel = DAYS_SHORT[d.getDay()] + ' ' + d.getDate();

    html += '<div style="background:var(--sf2);border-radius:12px;border:'+
      (isToday ? '2px solid var(--ac)' : '1px solid var(--br)')+
      ';padding:10px;margin-bottom:8px;display:flex;align-items:center;gap:10px">'+
      '<div style="font-size:11px;font-weight:700;color:'+(isToday?'var(--ac)':'var(--tx2)')+
      ';width:36px;flex-shrink:0">'+dayLabel+'</div>'+
      '<div style="flex:1;font-size:13px;color:'+(rec?'var(--tx)':'var(--tx3)')+'">'+
        (rec ? rec.e+' '+rec.n : 'Não planejado')+'</div>'+
      '<button onclick="openPlanDay(\''+key+'\')" style="padding:5px 10px;border-radius:8px;'+
        'background:rgba(232,200,122,.1);border:1px solid rgba(232,200,122,.3);'+
        'color:var(--ac);font-size:11px;font-weight:700;cursor:pointer;font-family:\'DM Sans\',sans-serif">'+
        (rec ? '✏️':'+ Escolher')+'</button>'+
      '</div>';
  }
  el.innerHTML = html;
  // Also update today's card
  renderTodayMenu();
}

function openPlanDay(key){
  var d = new Date(key);
  var DAYS_FULL = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
  var title = '🍽 ' + DAYS_FULL[d.getDay()] + ', ' + d.getDate();
  var opts = recipes.map(function(r, i){
    return '<div onclick="setPlanDay(\''+key+'\','+i+')" style="display:flex;align-items:center;gap:10px;'+
      'padding:10px 12px;background:var(--sf2);border-radius:10px;margin-bottom:7px;cursor:pointer;border:1px solid var(--br)">'+
      '<span style="font-size:18px">'+r.e+'</span>'+
      '<div style="flex:1"><div style="font-size:13px;font-weight:500">'+r.n+'</div>'+
      '<div style="font-size:11px;color:var(--tx2)">⏱ '+r.t+'</div></div></div>';
  }).join('');
  openModal(title,
    '<div style="margin-bottom:10px">'+
    '<button onclick="setPlanDay(\''+key+'\',null)" style="width:100%;padding:9px;border-radius:10px;'+
    'background:rgba(232,122,122,.08);border:1px solid rgba(232,122,122,.2);color:var(--rd);'+
    'font-size:12px;font-weight:600;cursor:pointer;font-family:\'DM Sans\',sans-serif;margin-bottom:10px">'+
    '🗑 Remover planejamento</button></div>'+opts
  );
}

function setPlanDay(key, idx){
  if(idx === null){
    delete weekPlan[key];
  } else {
    weekPlan[key] = idx;
  }
  closeModal();
  renderWeekPlan();
  saveState();
}

// ── TIMELINE ─────────────────────────────────────────────
var routine=[
  {t:'05:00',e:'🌅',n:'Acordar',w:'both'},
  {t:'05:30',e:'💪',n:'Academia',w:'both',wd:true},
  {t:'07:00',e:'🐕',n:'Cachorros + área',w:'a',id:'dog-m'},
  {t:'07:00',e:'☕',n:'Café da manhã',w:'p',id:'cafe-m'},
  {t:'08:00',e:'💼',n:'Trabalho',w:'both',wd:true},
  {t:'15:30',e:'🍵',n:'Café da tarde',w:'both'},
  {t:'18:40',e:'🏃',n:'Corrida',w:'both',run:true},
  {t:'18:30',e:'🍳',n:'Fazer a janta',w:'p',id:'dinner'},
  {t:'18:30',e:'🐕',n:'Cachorros noite',w:'a',id:'dog-n'},
  {t:'19:30',e:'⛪',n:'Catecumenato',w:'a',thu:true},
  {t:'21:00',e:'🌙',n:'Tempo livre / Estudos',w:'both'},
];

// Per-profile done state — individual per person
var tlDone_a = {};
var tlDone_p = {};
var tlExtra  = [];
var tlCtxIdx = -1;

function getTLDone(){
  // Returns the done object for the current profile
  return currentProfile === 'p' ? tlDone_p : tlDone_a;
}

// ── PROGRESS BAR: advances automatically with the clock ─────
// Day starts at 05:00 (300min) and ends at 23:00 (1380min)
var TL_START_MIN = 5 * 60;   // 05:00
var TL_END_MIN   = 23 * 60;  // 23:00

function getDayProgress(){
  var now = new Date();
  var nowM = now.getHours()*60 + now.getMinutes();
  var pct = (nowM - TL_START_MIN) / (TL_END_MIN - TL_START_MIN);
  return Math.min(Math.max(pct, 0), 1); // clamp 0-1
}

function renderProgressBar(allItems, nowM){
  // Find which item slot the current time falls between
  var times = allItems.map(function(it){
    var p = it.t.split(':'); return +p[0]*60 + +p[1];
  });
  var first = times[0] || TL_START_MIN;
  var last  = times[times.length-1] || TL_END_MIN;
  var pct   = Math.min(Math.max((nowM - first) / (last - first), 0), 1) * 100;

  return '<div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;padding:0 2px">' +
    '<div style="font-size:10px;color:var(--tx3);flex-shrink:0">' + new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}) + '</div>' +
    '<div style="flex:1;height:4px;background:var(--br);border-radius:2px;overflow:hidden">' +
      '<div style="width:'+pct.toFixed(1)+'%;height:100%;background:linear-gradient(90deg,var(--ac),rgba(232,200,122,.5));border-radius:2px;transition:width 1s linear"></div>' +
    '</div>' +
    '<div style="font-size:10px;color:var(--ac);font-weight:700;flex-shrink:0">'+Math.round(pct)+'%</div>' +
  '</div>';
}

function renderTL(){
  var d=TODAY, dow=d.getDay(), isWE=dow===0||dow===6, isThu=dow===4;
  var isRun = dow===1||dow===5;
  var ms=gM(d), ns=gN(d);
  var done = getTLDone();
  var nowM = new Date().getHours()*60 + new Date().getMinutes();

  var baseItems = routine.filter(function(it){
    if(it.wd && isWE) return false;
    if(it.thu && !isThu) return false;
    if(it.run && (!isRun || isThu)) return false;
    return true;
  }).map(function(it){
    var w = it.w;
    if(it.id==='dog-m')  w = ms.dog;
    if(it.id==='cafe-m') w = ms.cafe;
    if(it.id==='dinner') w = ns.cook;
    if(it.id==='dog-n')  w = ns.dog;
    return Object.assign({}, it, {w:w, _base:true});
  });

  var allItems = baseItems.concat(tlExtra);
  allItems.sort(function(a,b){
    var ta=a.t.split(':'), tb=b.t.split(':');
    return(+ta[0]*60+ +ta[1])-(+tb[0]*60+ +tb[1]);
  });

  var tl = document.getElementById('today-tl');
  if(!tl) return;

  // Progress bar at top — purely time-based, does NOT mark tasks
  var html = renderProgressBar(allItems, nowM);

  for(var i=0; i<allItems.length; i++){
    var it = allItems[i];
    var parts = it.t.split(':');
    var hh = +parts[0], mm2 = +parts[1];
    var k = it.t + it.n;
    var isDone = !!done[k];
    if(done['_hide_'+k]) continue;

    // isPast: the item's time has passed — show visually dimmed but NOT auto-checked
    var isPast = (hh*60+mm2) < nowM;
    // isCurrent: the current time slot
    var isCurrent = !isDone && isPast && (i === allItems.length-1 || (+allItems[i+1].t.split(':')[0]*60 + +allItems[i+1].t.split(':')[1]) > nowM);

    var wl = it.w==='both' ? 'Ambos' : nm(it.w);
    var wc = it.w==='both' ? 'both' : it.w;

    // Dot style: done=green, current=amber pulsing, past=dimmed, future=default
    var dotCls = isDone ? ' dn' : isCurrent ? ' act' : '';
    var nameStyle = isDone ? 'text-decoration:line-through;opacity:.4' : isPast && !isCurrent ? 'opacity:.55' : '';

    html += '<div class="tl-item" style="'+(isPast&&!isDone&&!isCurrent?'opacity:.7':'')+'">'+
      '<div class="tl-dot'+dotCls+'">'+it.e+'</div>'+
      '<div class="tl-body">'+
        '<div class="tl-t">'+it.t+'</div>'+
        '<div class="tl-name" style="'+nameStyle+'">'+it.n+'</div>'+
        '<div class="tl-wrow"><span class="twh '+wc+'">'+wl+'</span></div>'+
      '</div>'+
      '<button class="tl-btn'+(isDone?' dn':'')+'" data-k="'+k+'" onclick="togTL(this.dataset.k)" title="Marcar como '+(isDone?'pendente':'concluído')+'">'+
        (isDone ? '✓' : isPast ? '○' : '○')+
      '</button>'+
      '<button class="tmenu" style="color:var(--tx3);width:24px;height:24px;margin-top:3px" data-i="'+i+'" onclick="openTLCtx(event,+this.dataset.i)">⋯</button>'+
      '</div>';
  }
  html += '<button class="add-dashed" style="margin-top:6px" onclick="openAddTL()">+ Adicionar</button>';
  tl.innerHTML = html;
}

// Auto-refresh timeline every minute so progress bar stays accurate
if(typeof tlRefreshInterval === 'undefined'){
  var tlRefreshInterval = setInterval(function(){
    if(document.getElementById('page-hoje') && document.getElementById('page-hoje').classList.contains('active')){
      renderTL();
    }
  }, 60000);
}
function togTL(k){
  var done = getTLDone();
  done[k] = !done[k];
  renderTL();
  saveState();
}

// TL context menu / edit
function openTLCtx(e, idx){
  e.stopPropagation();
  tlCtxIdx = idx;
  var ctx = document.getElementById('ctx');
  document.getElementById('ctx-edit').onclick = function(){ ctx.classList.remove('open'); openEditTL(idx); };
  document.getElementById('ctx-del').onclick  = function(){ ctx.classList.remove('open'); delTLItem(idx); };
  ctx.classList.add('open');
  var r = e.target.getBoundingClientRect();
  ctx.style.top  = (r.bottom+6)+'px';
  ctx.style.left = Math.min(r.left-90, window.innerWidth-165)+'px';
}

function getActiveTLItems(){
  var d=TODAY, dow=d.getDay(), isWE=dow===0||dow===6, isThu=dow===4, isRun=dow===1||dow===5;
  var ms=gM(d), ns=gN(d);
  var base = routine.filter(function(it){
    if(it.wd&&isWE) return false;
    if(it.thu&&!isThu) return false;
    if(it.run&&(!isRun||isThu)) return false;
    return true;
  }).map(function(it){
    var w=it.w;
    if(it.id==='dog-m') w=ms.dog; if(it.id==='cafe-m') w=ms.cafe;
    if(it.id==='dinner') w=ns.cook; if(it.id==='dog-n') w=ns.dog;
    return Object.assign({},it,{w:w,_base:true});
  });
  var all = base.concat(tlExtra);
  all.sort(function(a,b){var ta=a.t.split(':'),tb=b.t.split(':');return(+ta[0]*60+ +ta[1])-(+tb[0]*60+ +tb[1]);});
  return all;
}

function openEditTL(idx){
  var items = getActiveTLItems();
  var it = items[idx];
  if(!it) return;
  openModal('Editar item','');
  var mb = document.getElementById('mb');
  mb.innerHTML = '';
  function mkFg(lbl,id,val,extra){
    var div = document.createElement('div'); div.className='fg';
    div.innerHTML='<label class="fl">'+lbl+'</label><input class="fi" id="'+id+'" '+(extra||'')+' value="">';
    div.querySelector('#'+id).value = val;
    return div;
  }
  mb.appendChild(mkFg('Emoji','tl-e',it.e,'style="width:65px"'));
  mb.appendChild(mkFg('Nome','tl-n',it.n,''));
  mb.appendChild(mkFg('Horário','tl-t',it.t,''));
  var wDiv = document.createElement('div'); wDiv.className='fg';
  wDiv.innerHTML='<label class="fl">Responsável</label>'+
    '<div class="wsel">'+
    '<button class="wo'+(it.w==='a'?' sa':'')+'" onclick="sw2(this,\'a\')">Allan</button>'+
    '<button class="wo'+(it.w==='p'?' sp2':'')+'" onclick="sw2(this,\'p\')">Perla</button>'+
    '<button class="wo'+(it.w==='both'?' sb':'')+'" onclick="sw2(this,\'both\')">Ambos</button>'+
    '</div><input type="hidden" id="tw" value="'+it.w+'">';
  mb.appendChild(wDiv);
  var btn = document.createElement('button'); btn.className='save-btn'; btn.textContent='Salvar';
  btn.onclick = function(){ saveEditTL(idx); };
  mb.appendChild(btn);
}

function saveEditTL(idx){
  var items = getActiveTLItems();
  var it = items[idx];
  if(!it) return;
  var ne=document.getElementById('tl-e').value||it.e;
  var nn=document.getElementById('tl-n').value.trim()||it.n;
  var nt=document.getElementById('tl-t').value||it.t;
  var nw=document.getElementById('tw').value;
  if(it._base){
    tlExtra.push({e:ne,n:nn,t:nt,w:nw});
    var done = getTLDone();
    done['_hide_'+it.t+it.n] = true;
  } else {
    var ei = tlExtra.indexOf(it);
    if(ei>=0) tlExtra[ei] = {e:ne,n:nn,t:nt,w:nw};
  }
  closeModal(); renderTL(); saveState();
}

function delTLItem(idx){
  var items = getActiveTLItems();
  var it = items[idx];
  if(!it) return;
  if(!it._base){
    var ei = tlExtra.indexOf(it);
    if(ei>=0) tlExtra.splice(ei,1);
  } else {
    var done = getTLDone();
    done['_hide_'+it.t+it.n] = true;
  }
  renderTL(); saveState();
}

function openAddTL(){
  openModal('Adicionar à rotina',
    '<div class="fg"><label class="fl">Emoji</label><input class="fi" id="tl-e" value="📌" style="width:65px"></div>'+
    '<div class="fg"><label class="fl">Nome</label><input class="fi" id="tl-n" placeholder="Ex: Lanche da tarde"></div>'+
    '<div class="fg"><label class="fl">Horário</label><input class="fi" id="tl-t" placeholder="Ex: 16:00"></div>'+
    '<div class="fg"><label class="fl">Responsável</label>'+
    '<div class="wsel">'+
    '<button class="wo" onclick="sw2(this,\'a\')">Allan</button>'+
    '<button class="wo" onclick="sw2(this,\'p\')">Perla</button>'+
    '<button class="wo sb" onclick="sw2(this,\'both\')">Ambos</button>'+
    '</div><input type="hidden" id="tw" value="both"></div>'+
    '<button class="save-btn" onclick="saveAddTL()">Adicionar</button>'
  );
}
function saveAddTL(){
  var n = document.getElementById('tl-n').value.trim();
  if(!n) return;
  tlExtra.push({
    e: document.getElementById('tl-e').value||'📌',
    n: n,
    t: document.getElementById('tl-t').value||'12:00',
    w: document.getElementById('tw').value
  });
  closeModal(); renderTL(); saveState();
}

// ── TURNO MODAL ───────────────────────────────────────────
function openTurnoModal(who){
  var cur = document.getElementById('t'+who+'-tx').textContent.trim();
  openModal('Tarefa de '+nm(who),
    '<div class="fg"><label class="fl">Tarefa</label><input class="fi" id="ti" value="'+cur+'"></div>'+
    '<button style="width:100%;padding:10px;border-radius:10px;background:var(--sf2);border:1px solid var(--br);color:var(--tx2);font-size:13px;cursor:pointer;font-family:\'DM Sans\',sans-serif;margin-bottom:10px" onclick="swapT()">🔄 Trocar com '+nm(who==='a'?'p':'a')+'</button>'+
    '<button class="save-btn" onclick="saveT(\''+who+'\')">Salvar</button>'
  );
}
function saveT(who){
  var v = document.getElementById('ti').value.trim();
  if(v) document.getElementById('t'+who+'-tx').textContent = v;
  closeModal();
}
function swapT(){
  var a=document.getElementById('ta-tx').textContent;
  var b=document.getElementById('tp-tx').textContent;
  document.getElementById('ta-tx').textContent = b;
  document.getElementById('tp-tx').textContent = a;
  closeModal();
}

// ── GREETING ─────────────────────────────────────────────
var greetings=[
  'Cada dia juntos é uma conquista. Aproveitem ao máximo! 💛',
  'Vocês são uma equipe incrível. Força nos estudos hoje! 📚',
  'Pequenos hábitos, grandes resultados. Sigam em frente! 🚀',
  'Cuidar de si e do outro é o maior ato de amor. 🐾',
  'A rotina de vocês é linda. Um dia de cada vez! 🌱',
  'Estudos, saúde, amor — vocês têm tudo. Vai ser um ótimo dia! ☀️',
  'Cada copo de água, cada passo, cada tarefa — tudo conta! 💧',
  'Juntos, vocês constroem o futuro que sonham. 🏠✨',
  'Corpos fortes, mentes focadas, coração cheio. Bora! 💪',
  'Mais um dia para evoluir juntos. Orgulho de vocês! 🌟',
];

function initGreeting(){
  var h = new Date().getHours();
  var period = h<12 ? 'Bom dia ☀️' : h<18 ? 'Boa tarde 🌤' : 'Boa noite 🌙';
  var msg = greetings[new Date().getDate() % greetings.length];

  var elTime = document.getElementById('greeting-time');
  var elSTime = document.getElementById('s-greeting-time');
  if(elTime)  elTime.textContent  = period;
  if(elSTime) elSTime.textContent = period;

  var me = document.getElementById('greeting-msg');
  if(me) me.textContent = msg;

  var hd = document.getElementById('hero-day');
  if(hd){
    if(currentProfile){ hd.textContent = currentProfile==='a' ? 'Allan' : 'Perla'; }
    else { hd.textContent = 'casal'; }
  }

  var ds = document.getElementById('hero-date-sub');
  if(ds) ds.textContent = TODAY.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});

  var nt = document.getElementById('note-tx-s');
  if(nt) nt.textContent = noteText || 'Deixe um recado para o parceiro...';

  // Turno dinâmico
  var ms2 = gM(TODAY), ns2 = gN(TODAY);
  var titleEl = document.getElementById('turno-title');
  var taEl    = document.getElementById('ta-tx');
  var tpEl    = document.getElementById('tp-tx');
  if(h < 12){
    if(titleEl) titleEl.textContent = 'Turno da manhã — quem faz o quê';
    if(taEl)    taEl.textContent    = ms2.dog==='a'  ? '🐕 Cachorros' : '☕ Café da manhã';
    if(tpEl)    tpEl.textContent    = ms2.cafe==='p' ? '☕ Café da manhã' : '🐕 Cachorros';
  } else if(h < 17){
    if(titleEl) titleEl.textContent = 'Boa tarde — em andamento';
    if(taEl)    taEl.textContent    = '💼 Trabalhando';
    if(tpEl)    tpEl.textContent    = '💼 Trabalhando';
  } else {
    if(titleEl) titleEl.textContent = 'Turno da noite — quem faz o quê';
    if(taEl)    taEl.textContent    = ns2.dog==='a'   ? '🐕 Cachorros' : '🍳 Fazer a janta';
    if(tpEl)    tpEl.textContent    = ns2.cook==='p'  ? '🍳 Fazer a janta' : '🐕 Cachorros';
  }

  // Show today's planned meal
  renderTodayMenu();
}

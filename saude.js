// ── ACADEMIA ──────────────────────────────────────────────
var academiaDone = {};

// ── ÁGUA ──────────────────────────────────────────────────
var agua = {a:0, p:0};
var META = {a:15, p:12}; // Allan 2830ml, Perla 2275ml (copo=200ml)

// aguaHistory: array of {date:'YYYY-MM-DD', a:n, p:n} — up to 30 entries
var aguaHistory = [];

function getDateKey(d){
  var dd = d || TODAY;
  return dd.getFullYear()+'-'+('0'+(dd.getMonth()+1)).slice(-2)+'-'+('0'+dd.getDate()).slice(-2);
}

// Ensure today has an entry in aguaHistory; prune to 30 days
function ensureTodayEntry(){
  var key = getDateKey(TODAY);
  var last = aguaHistory[aguaHistory.length-1];
  if(!last || last.date !== key){
    aguaHistory.push({date:key, a:0, p:0});
    if(aguaHistory.length > 30) aguaHistory.shift();
    agua = {a:0, p:0};
  }
}

function updateAgua(){
  ensureTodayEntry();
  // Sync today's values into history
  var today = aguaHistory[aguaHistory.length-1];
  today.a = agua.a;
  today.p = agua.p;

  ['a','p'].forEach(function(who){
    var n    = agua[who];
    var meta = META[who];
    var pct  = Math.min(n / meta * 100, 100);
    var elFill = document.getElementById('agua-fill-'+who);
    var elNum  = document.getElementById('agua-n-'+who);
    var elSub  = document.getElementById('agua-sub-'+who);
    if(elFill) elFill.style.height = pct+'%';
    if(elNum)  elNum.textContent   = n;
    if(elSub)  elSub.textContent   = 'de '+meta+' copos ('+Math.round(n*200)+'ml / '+(meta*200)+'ml)';
  });

  renderAguaChart();

  var msg = document.getElementById('agua-msg');
  if(!msg) return;
  if(agua.a >= META.a && agua.p >= META.p) msg.textContent = '🎉 Os dois bateram a meta hoje!';
  else if(agua.a >= META.a) msg.textContent = '💪 Allan bateu a meta! Vai, Perla!';
  else if(agua.p >= META.p) msg.textContent = '💪 Perla bateu a meta! Vai, Allan!';
  else msg.textContent = '';
}

function addAgua(who){ if(agua[who] < META[who]+4) agua[who]++; updateAgua(); saveState(); }
function rmAgua(who){  if(agua[who] > 0) agua[who]--;           updateAgua(); saveState(); }

function renderAguaChart(){
  var c = document.getElementById('agua-chart');
  if(!c) return;

  // Show last 30 days (or however many we have)
  var history = aguaHistory.slice(); // copy
  // Ensure today is included
  var todayKey = getDateKey(TODAY);
  if(!history.length || history[history.length-1].date !== todayKey){
    history.push({date:todayKey, a:agua.a, p:agua.p});
  }

  var maxA = META.a, maxP = META.p;
  var html  = '';

  for(var i=0; i<history.length; i++){
    var entry   = history[i];
    var isToday = entry.date === todayKey;
    var pa  = entry.a > 0 ? Math.max(Math.round(entry.a / maxA * 100), 4) : 0;
    var pp  = entry.p > 0 ? Math.max(Math.round(entry.p / maxP * 100), 4) : 0;
    var mlA = entry.a * 200;
    var mlP = entry.p * 200;

    // Label: day number from date string
    var parts   = entry.date.split('-');
    var dayNum  = parseInt(parts[2], 10);
    var tipA    = 'Allan: '+mlA+'ml ('+entry.a+' copos)';
    var tipP    = 'Perla: '+mlP+'ml ('+entry.p+' copos)';

    html += '<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;height:100%;min-width:0">';
    html += '<div style="flex:1;width:100%;display:flex;align-items:flex-end;gap:1px;justify-content:center">';
    // Allan bar
    html += '<div style="width:46%;background:'+(isToday?'rgba(122,196,232,.95)':'rgba(122,196,232,.5)')+
            ';border-radius:3px 3px 0 0;height:'+pa+'%;min-height:'+(entry.a>0?'3px':'0')+';"'+
            ' data-tip="'+tipA+'" onmouseenter="showTip(event,this)" onmouseleave="hideTip()" ontouchstart="showTip(event,this)"></div>';
    // Perla bar
    html += '<div style="width:46%;background:'+(isToday?'rgba(232,122,176,.95)':'rgba(232,122,176,.5)')+
            ';border-radius:3px 3px 0 0;height:'+pp+'%;min-height:'+(entry.p>0?'3px':'0')+';"'+
            ' data-tip="'+tipP+'" onmouseenter="showTip(event,this)" onmouseleave="hideTip()" ontouchstart="showTip(event,this)"></div>';
    html += '</div>';
    // Label: show day number; only show every 5th day + today to avoid crowding
    var showLabel = isToday || dayNum % 5 === 0 || dayNum === 1;
    html += '<div style="font-size:8px;color:'+(isToday?'var(--ac)':'var(--tx3)')+
            ';font-weight:'+(isToday?'700':'400')+'">'+(showLabel ? dayNum : '')+'</div>';
    html += '</div>';
  }

  c.innerHTML = html;
}

function showTip(e, el){
  var tip = document.getElementById('chart-tip');
  if(!tip){
    tip = document.createElement('div');
    tip.id = 'chart-tip';
    tip.style.cssText = 'position:fixed;background:var(--sf);border:1px solid var(--br);border-radius:8px;padding:6px 10px;font-size:11px;color:var(--tx);pointer-events:none;z-index:999;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.3)';
    document.body.appendChild(tip);
  }
  tip.textContent = el.dataset.tip;
  var r = el.getBoundingClientRect();
  tip.style.left    = Math.min(r.left, window.innerWidth-160)+'px';
  tip.style.top     = Math.max(r.top-36, 4)+'px';
  tip.style.display = 'block';
}
function hideTip(){ var tip=document.getElementById('chart-tip'); if(tip) tip.style.display='none'; }

// ── ACADEMIA ──────────────────────────────────────────────
function renderAcademia(){
  var el = document.getElementById('academia-grid');
  if(!el) return;

  // Show all days of the current month, day 1 to last day, in order
  var year  = TODAY.getFullYear();
  var month = TODAY.getMonth();
  var daysInMonth = new Date(year, month+1, 0).getDate();

  var html = '';
  for(var day=1; day<=daysInMonth; day++){
    var d       = new Date(year, month, day);
    var dow     = d.getDay();
    var key     = 'acad-'+d.toISOString().slice(0,10);
    var done    = !!academiaDone[key];
    var isToday = d.toDateString() === TODAY.toDateString();
    var isFuture= d > TODAY;
    var isSun   = dow === 0;

    var bg     = isSun    ? 'transparent'   :
                 isFuture ? 'var(--sf3)'    :
                 done     ? 'var(--gn)'     : 'var(--sf2)';
    var col    = isFuture ? 'var(--tx3)'    :
                 done     ? '#000'          : 'var(--tx2)';
    var border = isToday  ? '2px solid var(--ac)' : isSun ? '1px dashed var(--br)' : '1px solid var(--br)';
    var opacity= (isFuture || isSun) ? '.35' : '1';

    html += '<div'+
      (isFuture||isSun ? '' : ' onclick="togAcad(this)" data-k="'+key+'"')+
      ' style="width:36px;height:40px;border-radius:8px;background:'+bg+
      ';border:'+border+';display:flex;flex-direction:column;align-items:center;'+
      'justify-content:center;gap:1px;cursor:'+(isFuture||isSun?'default':'pointer')+
      ';opacity:'+opacity+';transition:all .2s">';
    html += '<div style="font-size:10px;font-weight:600;color:'+col+'">'+day+'</div>';
    html += '<div style="font-size:11px">'+(isSun?'':'')+(done?'✓':isFuture?'':'')+( !done&&!isFuture&&!isSun ? '·':'' )+'</div>';
    html += '</div>';
  }

  el.innerHTML = html;
}

function togAcad(el){
  var key = el.dataset.k;
  if(!key) return;
  academiaDone[key] = !academiaDone[key];
  renderAcademia();
  saveState();
}

// ── CORRIDA ───────────────────────────────────────────────
// corridaDone: stores 'feito' state per run date key
var corridaDone = {};

function renderCorrida(){
  var el = document.getElementById('corrida-list');
  if(!el) return;

  var DAYS_FULL = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
  // Get Mon and Fri of current week, plus next 2 weeks ahead
  var rows = [];
  var seen = {};

  // Go back 2 weeks and forward 2 weeks to show context
  for(var offset=-14; offset<=14; offset++){
    var d = new Date(TODAY);
    d.setDate(TODAY.getDate() + offset);
    var dow = d.getDay();
    if(dow !== 1 && dow !== 5) continue; // only Mon and Fri
    var key = 'run-'+d.toISOString().slice(0,10);
    if(seen[key]) continue;
    seen[key] = true;

    var isToday  = d.toDateString() === TODAY.toDateString();
    var isFuture = d > TODAY;
    var isPast   = d < new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
    var isDone   = !!corridaDone[key];
    var dateLabel = DAYS_FULL[dow]+' '+d.getDate()+'/'+('0'+(d.getMonth()+1)).slice(-2);
    if(isToday) dateLabel = 'Hoje';

    // Button state
    var btnStyle, btnLabel;
    if(isFuture){
      btnStyle = 'background:rgba(122,196,232,.1);border:1px solid rgba(122,196,232,.25);color:var(--al)';
      btnLabel = '📅 Programado';
    } else if(isDone){
      btnStyle = 'background:rgba(122,232,160,.15);border:1px solid rgba(122,232,160,.3);color:var(--gn)';
      btnLabel = '✓ Feito';
    } else {
      btnStyle = 'background:rgba(232,122,122,.08);border:1px solid rgba(232,122,122,.2);color:var(--rd)';
      btnLabel = '○ Não feito';
    }

    rows.push(
      '<div class="task-item" style="margin-bottom:8px">'+
        '<span class="temi">🏃</span>'+
        '<div class="tinfo">'+
          '<div class="tn">Corrida — '+dateLabel+'</div>'+
          '<div class="tt">18:40 • Allan & Perla</div>'+
        '</div>'+
        (isFuture
          ? '<span style="padding:5px 10px;border-radius:8px;font-size:11px;font-weight:700;'+btnStyle+'">'+btnLabel+'</span>'
          : '<button data-k="'+key+'" onclick="togCorrida(this)" style="padding:5px 10px;border-radius:8px;font-size:11px;font-weight:700;cursor:pointer;font-family:\'DM Sans\',sans-serif;'+btnStyle+'">'+btnLabel+'</button>'
        )+
      '</div>'
    );
  }

  el.innerHTML = rows.join('');
}

function togCorrida(btn){
  var key = btn.dataset.k;
  if(!key) return;
  corridaDone[key] = !corridaDone[key];
  renderCorrida();
  saveState();
}

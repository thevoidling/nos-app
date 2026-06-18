// THEME
function setTheme(t){
  document.documentElement.setAttribute('data-theme',t);
  document.getElementById('btn-dark').classList.toggle('on',t==='dark');
  document.getElementById('btn-light').classList.toggle('on',t==='light');
}

// SETTINGS PANEL
function openSP(){document.getElementById('sp').classList.add('open');document.getElementById('sp-bd').classList.add('open');}
function closeSP(){document.getElementById('sp').classList.remove('open');document.getElementById('sp-bd').classList.remove('open');}

// SETTINGS PANEL
function openSP(){document.getElementById('sp').classList.add('open');document.getElementById('sp-bd').classList.add('open');}
function closeSP(){document.getElementById('sp').classList.remove('open');document.getElementById('sp-bd').classList.remove('open');}

function sw2(btn,who){btn.closest('.wsel').querySelectorAll('.wo').forEach(function(b){b.className='wo';});btn.classList.add(who==='a'?'sa':who==='p'?'sp2':'sb');document.getElementById('tw').value=who;}

document.addEventListener('click',function(){document.getElementById('ctx').classList.remove('open');});

function openModal(title,body){document.getElementById('mt').textContent=title;document.getElementById('mb').innerHTML=body;document.getElementById('mo').classList.add('open');}
function closeModal(){document.getElementById('mo').classList.remove('open');}
function closeMO(e){if(e.target===document.getElementById('mo'))closeModal();}

function sw(tab,btn){
  document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active');});
  document.getElementById('page-'+tab).classList.add('active');
  btn.classList.add('active');
  try{ localStorage.setItem('nos_active_tab', tab); }catch(e){}
}

function restoreTab(){
  try{
    var saved = localStorage.getItem('nos_active_tab');
    if(!saved) return;
    var tabs = document.querySelectorAll('.tab');
    var tabMap = ['hoje','calendario','cardapio','lista','saude'];
    var idx = tabMap.indexOf(saved);
    if(idx >= 0){ sw(saved, tabs[idx]); }
  }catch(e){}
}
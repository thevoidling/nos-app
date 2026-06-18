// MARKET
var mktItems=[
  {tx:'Frango (filé)',ck:false},{tx:'Ovos',ck:false},
  {tx:'Queijo mussarela',ck:false},{tx:'Requeijão',ck:false},
  {tx:'Arroz integral',ck:true},{tx:'Brócolis',ck:false},
  {tx:'Ração dos cachorros',ck:false},{tx:'Frutas da semana',ck:false},
  {tx:'Pão de forma integral',ck:true},
];
function renderMkt(){
  document.getElementById('mkt-list').innerHTML=mktItems.map(function(it,i){
    return'<div class="li'+(it.ck?' ck':'')+'"><button class="lchk'+(it.ck?' ck':'')+'" onclick="togMkt('+i+')">'+(it.ck?'✓':'')+'</button><span class="li-tx">'+it.tx+'</span><button class="li-del" onclick="delMkt('+i+')">×</button></div>';
  }).join('');
}
function addMkt(){var inp=document.getElementById('mkt-inp');if(inp.value.trim()){mktItems.push({tx:inp.value.trim(),ck:false});inp.value='';renderMkt();saveState();}}
function togMkt(i){mktItems[i].ck=!mktItems[i].ck;renderMkt();saveState();}
function delMkt(i){mktItems.splice(i,1);renderMkt();saveState();}

// GOALS — eye toggle, sem PIN
var gHide={a:true,p:true};
var goals={
  a:['📚 Estudar PM-ES (IDECAN)','✍️ Treinar dissertativa','🏃 Manter condicionamento','📖 Língua Portuguesa e Raciocínio'],
  p:['⚖️ Fazer a OAB','📝 Passar no concurso','🚗 Tirar carteira','🏠 Casa maior','💼 Mudar de emprego','🚗 Ter um carro']
};
function renderGoals(){
  document.getElementById('goals-sec').innerHTML=['a','p'].map(function(who){
    var h=gHide[who];
    var sub=who==='a'?'“Passar no concurso PM-ES”':'“Independência e crescimento”';
    var inner=h
      ?'<div class="g-hidden">Oculto — clique no olho para ver</div>'
      :'<div class="g-sub">'+sub+'</div>'
        +goals[who].map(function(g,i){return'<div class="goal-item"><div class="gbul '+who+'"></div><span class="gtx">'+g+'</span><button class="gdel" onclick="delGoal(\''+who+'\','+i+')">×</button></div>';}).join('')
        +'<button class="gadd" onclick="openAddGoal(\''+who+'\')">+ Adicionar objetivo</button>';
    return'<div class="goal-card"><div class="g-hd"><span class="gwho '+who+'">'+nm(who)+'</span><button class="eye-btn" onclick="togEye(\''+who+'\')"><span id="eye-'+who+'">'+(h?'👁️':'🙈')+'</span></button></div>'+inner+'</div>';
  }).join('');
}
function togEye(who){gHide[who]=!gHide[who];renderGoals();}
function delGoal(who,i){goals[who].splice(i,1);renderGoals();saveState();}
function openAddGoal(who){openModal('Novo Objetivo de '+nm(who),'<div class="fg"><label class="fl">Objetivo</label><input class="fi" id="g-inp" placeholder="Ex: Aprender inglês"></div><button class="save-btn" onclick="saveGoal(\''+who+'\')">Adicionar</button>');}
function saveGoal(who){var v=document.getElementById('g-inp').value.trim();if(v){goals[who].push(v);closeModal();gHide[who]=false;renderGoals();saveState();}}

// HELPERS
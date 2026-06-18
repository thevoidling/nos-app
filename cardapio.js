// RECIPES
// recipes array is now editable and synced via Firebase
var recipes = [
  {e:'🍗',n:'Frango grelhado com legumes',tags:['fast','prot'],tl:['⚡ Rápido','💪 Proteico'],t:'25 min',d:'Filé na frigideira + brócolis e cenoura no vapor.',ing:['Filé de frango','Brócolis','Cenoura','Azeite e alho','Sal e temperos']},
  {e:'🥚',n:'Omelete de frango e queijo',tags:['fast','prot'],tl:['⚡ Rápido','💪 Proteico'],t:'15 min',d:'Omelete proteico com frango desfiado e queijo derretido.',ing:['3 ovos','Frango desfiado','Queijo mussarela','Requeijão','Sal e pimenta']},
  {e:'🥩',n:'Bife acebolado com arroz',tags:['prot'],tl:['💪 Proteico','🍽 Clássico'],t:'25 min',d:'Bife grelhado acebolado com arroz soltinho.',ing:['Bife bovino','Cebola','Arroz','Alho e sal','Azeite']},
  {e:'🍳',n:'Pão com ovos mexidos e queijo',tags:['fast','prot'],tl:['⚡ Rápido','💪 Proteico'],t:'10 min',d:'O café favorito do casal. Cremoso, proteico e delicioso.',ing:['4 ovos','Queijo fatiado','Requeijão','Pão de forma','Manteiga']},
  {e:'🍗',n:'Frango assado ao alho',tags:['prot'],tl:['💪 Proteico','🥗 Saudável'],t:'35 min',d:'Peças marinadas e assadas com alho e ervas.',ing:['Coxa/sobrecoxa','Alho','Limão','Azeite','Ervas e temperos']},
  {e:'🥩',n:'Carne moída com legumes',tags:['fast','prot'],tl:['⚡ Rápido','💪 Proteico'],t:'20 min',d:'Carne moída refogada com legumes e arroz.',ing:['Carne moída','Abobrinha','Cenoura','Arroz','Temperos']},
  {e:'🫓',n:'Tapioca de frango e queijo',tags:['fast','light'],tl:['⚡ Rápido','🌿 Leve'],t:'15 min',d:'Tapioca recheada com frango desfiado e queijo. Sem glúten.',ing:['Goma de tapioca','Frango desfiado','Queijo','Requeijão','Sal']},
  {e:'🐟',n:'Tilápia grelhada',tags:['prot','light'],tl:['🥗 Saudável','💪 Proteico'],t:'25 min',d:'Filé com limão e ervas na frigideira.',ing:['Filé de tilápia','Limão','Alho','Arroz integral','Azeite']},
  {e:'🥩',n:'Picanha ao alho',tags:['prot'],tl:['💪 Proteico','🍽 Especial'],t:'30 min',d:'Picanha grelhada com manteiga de alho.',ing:['Picanha fatiada','Alho','Manteiga','Arroz','Sal grosso']},
  {e:'🍗',n:'Frango com macarrão',tags:['fast','prot'],tl:['⚡ Rápido','💪 Energia'],t:'25 min',d:'Macarrão ao molho com frango desfiado.',ing:['Macarrão','Frango desfiado','Molho de tomate','Alho','Queijo ralado']},
];

var af = 'all';

function filt(btn, f){
  document.querySelectorAll('.fbtn').forEach(function(b){ b.classList.remove('active'); });
  btn.classList.add('active');
  af = f;
  renderRec();
}

function renderRec(){
  var g = document.getElementById('rec-grid');
  if(!g) return;
  var fr = af==='all' ? recipes : recipes.filter(function(r){ return r.tags.indexOf(af)>=0; });
  g.innerHTML = fr.map(function(r){
    var i = recipes.indexOf(r);
    return '<div class="rec-card">'+
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">'+
        '<div class="re">'+r.e+'</div>'+
        '<div style="display:flex;gap:6px">'+
          '<button onclick="editRec('+i+')" style="padding:4px 9px;border-radius:8px;background:var(--sf2);border:1px solid var(--br);color:var(--tx2);font-size:11px;cursor:pointer;font-family:\'DM Sans\',sans-serif">✏️ Editar</button>'+
          '<button onclick="delRec('+i+')" style="padding:4px 9px;border-radius:8px;background:rgba(232,122,122,.08);border:1px solid rgba(232,122,122,.2);color:var(--rd);font-size:11px;cursor:pointer;font-family:\'DM Sans\',sans-serif">🗑</button>'+
        '</div>'+
      '</div>'+
      '<div class="rn" onclick="openRec('+i+')" style="cursor:pointer">'+r.n+'</div>'+
      '<div class="rtags">'+r.tl.map(function(x){ return '<span class="mtag y">'+x+'</span>'; }).join('')+'</div>'+
      '<div class="rd">'+r.d+'</div>'+
      '<div class="rmeta">⏱ <strong>'+r.t+'</strong></div>'+
    '</div>';
  }).join('');
}

function openRec(i){
  var r = recipes[i];
  openModal(r.e+' '+r.n,
    '<div class="mtags" style="margin-bottom:12px">'+
      r.tl.map(function(x){ return '<span class="mtag g">'+x+'</span>'; }).join('')+
      '<span class="mtag">⏱ '+r.t+'</span>'+
    '</div>'+
    '<p style="font-size:14px;color:var(--tx2);margin-bottom:14px;line-height:1.6">'+r.d+'</p>'+
    '<div class="ctitle" style="margin-bottom:8px">Ingredientes</div>'+
    '<ul class="ing-list">'+r.ing.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>'+
    '<button class="save-btn" style="margin-top:14px" onclick="useRec('+i+')">✦ Usar no cardápio de hoje</button>'
  );
}

function useRec(i){
  document.getElementById('dinner-name').textContent = recipes[i].e+' '+recipes[i].n;
  closeModal();
  sw('hoje', document.querySelectorAll('.tab')[0]);
}

// ── ADD / EDIT RECIPE ─────────────────────────────────────
function openAddRec(){
  openRecForm(-1, {e:'🍽',n:'',tags:['prot'],tl:['💪 Proteico'],t:'',d:'',ing:['','','','','']});
}

function editRec(i){
  openRecForm(i, recipes[i]);
}

function openRecForm(idx, r){
  var title = idx === -1 ? '+ Nova Receita' : '✏️ Editar Receita';
  var ingVal = (r.ing||[]).join('\n');
  var tagsChecked = function(tag){ return (r.tags||[]).indexOf(tag)>=0; };

  openModal(title,
    '<div class="fg"><label class="fl">Emoji</label>'+
      '<input class="fi" id="rf-e" value="'+r.e+'" style="width:65px"></div>'+
    '<div class="fg"><label class="fl">Nome</label>'+
      '<input class="fi" id="rf-n" value="'+r.n+'" placeholder="Ex: Frango grelhado"></div>'+
    '<div class="fg"><label class="fl">Tempo de preparo</label>'+
      '<input class="fi" id="rf-t" value="'+r.t+'" placeholder="Ex: 25 min"></div>'+
    '<div class="fg"><label class="fl">Descrição</label>'+
      '<textarea class="fi" id="rf-d" style="height:60px;resize:none" placeholder="Breve descrição...">'+r.d+'</textarea></div>'+
    '<div class="fg"><label class="fl">Ingredientes (um por linha)</label>'+
      '<textarea class="fi" id="rf-i" style="height:100px;resize:none">'+ingVal+'</textarea></div>'+
    '<div class="fg"><label class="fl">Categorias</label>'+
      '<div style="display:flex;gap:8px;flex-wrap:wrap">'+
        '<label style="display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer">'+
          '<input type="checkbox" id="rf-fast" '+(tagsChecked('fast')?'checked':'')+'>⚡ Rápido</label>'+
        '<label style="display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer">'+
          '<input type="checkbox" id="rf-prot" '+(tagsChecked('prot')?'checked':'')+'>💪 Proteico</label>'+
        '<label style="display:flex;align-items:center;gap:5px;font-size:13px;cursor:pointer">'+
          '<input type="checkbox" id="rf-light" '+(tagsChecked('light')?'checked':'')+'>🌿 Leve</label>'+
      '</div></div>'+
    '<button class="save-btn" onclick="saveRecForm('+idx+')">Salvar receita</button>'
  );
}

function saveRecForm(idx){
  var e    = document.getElementById('rf-e').value.trim() || '🍽';
  var n    = document.getElementById('rf-n').value.trim();
  var t    = document.getElementById('rf-t').value.trim();
  var d    = document.getElementById('rf-d').value.trim();
  var iRaw = document.getElementById('rf-i').value.trim();
  if(!n){ alert('Digite o nome da receita'); return; }

  var tags = [];
  if(document.getElementById('rf-fast').checked)  tags.push('fast');
  if(document.getElementById('rf-prot').checked)  tags.push('prot');
  if(document.getElementById('rf-light').checked) tags.push('light');

  var tl = [];
  if(tags.indexOf('fast')  >= 0) tl.push('⚡ Rápido');
  if(tags.indexOf('prot')  >= 0) tl.push('💪 Proteico');
  if(tags.indexOf('light') >= 0) tl.push('🌿 Leve');

  var ing = iRaw.split('\n').map(function(l){ return l.trim(); }).filter(Boolean);

  var rec = {e:e, n:n, tags:tags, tl:tl, t:t, d:d, ing:ing};

  if(idx === -1){
    recipes.push(rec);
  } else {
    recipes[idx] = rec;
  }

  closeModal();
  renderRec();
  saveState();
}

function delRec(i){
  if(!confirm('Excluir "'+recipes[i].n+'"?')) return;
  recipes.splice(i, 1);
  renderRec();
  saveState();
}

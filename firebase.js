// ── FIREBASE SYNC ─────────────────────────────────────────
var db = null;
var DOC_ID = 'nos-casal-main';
var COLLECTION = 'state';
var syncTimeout = null;
var isSyncing = false;

function initFirebase(){
  var firebaseConfig = {
    apiKey: "AIzaSyBGkH-_Sl1WTC9w9RUmF94Ao_5pLfb0GvY",
    authDomain: "nos-casal-app.firebaseapp.com",
    projectId: "nos-casal-app",
    storageBucket: "nos-casal-app.firebasestorage.app",
    messagingSenderId: "542210392072",
    appId: "1:542210392072:web:5de54c4573dcad3b7e91bd"
  };
  try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    db.collection(COLLECTION).doc(DOC_ID).onSnapshot(function(doc){
      if(doc.exists && !isSyncing){
        applyCloudState(doc.data());
      }
    }, function(err){
      console.warn('Firebase listener error:', err);
      showSyncStatus('offline');
    });
    showSyncStatus('online');
  } catch(e){
    console.warn('Firebase init failed:', e);
    showSyncStatus('offline');
  }
}

function getLocalState(){
  return {
    agua: agua,
    aguaHistory: aguaHistory,
    corridaDone: corridaDone,
    academiaDone: academiaDone,
    goals: goals,
    mktItems: mktItems,
    noteText: noteText,
    // tlDone stored per profile: tlDone_a and tlDone_p
    tlDone_a: tlDone_a,
    tlDone_p: tlDone_p,
    tlExtra: tlExtra,
    recipes: recipes,          // custom recipes synced
    weekPlan: weekPlan,        // weekly meal plan synced
    savedDate: TODAY.toDateString(),
    updatedAt: Date.now()
  };
}

function saveState(){
  try{ localStorage.setItem('nos_mood', JSON.stringify(moodState)); }catch(e){}
  // Save this profile's tlDone locally for instant restore on reload
  try{
    if(currentProfile==='a') localStorage.setItem('nos_tlDone_a', JSON.stringify(tlDone_a));
    if(currentProfile==='p') localStorage.setItem('nos_tlDone_p', JSON.stringify(tlDone_p));
  }catch(e){}
  if(syncTimeout) clearTimeout(syncTimeout);
  syncTimeout = setTimeout(function(){
    if(!db){ saveLocalFallback(); return; }
    isSyncing = true;
    var state = getLocalState();
    db.collection(COLLECTION).doc(DOC_ID).set(state)
      .then(function(){
        isSyncing = false;
        showSyncStatus('saved');
      })
      .catch(function(e){
        isSyncing = false;
        saveLocalFallback();
        showSyncStatus('offline');
      });
  }, 800);
}

function applyCloudState(s){
  if(!s) return;
  var isNewDay = (s.savedDate || '') !== TODAY.toDateString();

  if(s.agua){ agua = s.agua; }
  if(s.aguaHistory){
    aguaHistory = s.aguaHistory;
    if(isNewDay){
      aguaHistory.push({a:0,p:0});
      if(aguaHistory.length > 7) aguaHistory.shift();
      agua = {a:0, p:0};
    }
    aguaHistory[aguaHistory.length-1] = {a:agua.a, p:agua.p};
  }
  if(s.academiaDone){ academiaDone = s.academiaDone; }
  if(s.corridaDone){  corridaDone  = s.corridaDone;  }
  if(s.goals)       { goals = s.goals; }
  if(s.mktItems)    { mktItems = s.mktItems; }
  if(s.tlExtra)     { tlExtra = s.tlExtra; }
  if(s.recipes)     { recipes = s.recipes; }
  if(s.weekPlan)    { weekPlan = s.weekPlan; }

  // Per-profile tlDone — only update the OTHER person's done state
  // (we never overwrite our own local done state from cloud)
  if(s.tlDone_a && currentProfile !== 'a'){ tlDone_a = s.tlDone_a; }
  if(s.tlDone_p && currentProfile !== 'p'){ tlDone_p = s.tlDone_p; }

  if(typeof s.noteText === 'string'){
    noteText = s.noteText;
    var el1 = document.getElementById('note-tx');
    var el2 = document.getElementById('note-tx-s');
    if(el1) el1.textContent = noteText || 'Deixe um recado para o parceiro...';
    if(el2) el2.textContent = noteText || 'Deixe um recado para o parceiro...';
  }

  renderTL(); renderMkt(); renderGoals(); updateAgua(); renderAcademia(); renderCorrida();
  renderRec(); renderWeekPlan();
}

function saveLocalFallback(){
  try { localStorage.setItem('nos_offline', JSON.stringify(getLocalState())); } catch(e){}
}
function loadLocalFallback(){
  try {
    var raw = localStorage.getItem('nos_offline');
    if(raw) applyCloudState(JSON.parse(raw));
  } catch(e){}
}

function showSyncStatus(status){
  var el = document.getElementById('sync-status');
  if(!el) return;
  if(status === 'online')  { el.textContent = '☁️'; el.style.color = 'var(--gn)'; }
  if(status === 'saved')   { el.textContent = '✓'; el.style.color = 'var(--gn)'; setTimeout(function(){ el.textContent = '☁️'; }, 1500); }
  if(status === 'offline') { el.textContent = '⚡'; el.style.color = 'var(--ac)'; }
}
// ─────────────────────────────────────────────────────────

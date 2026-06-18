// ── PERFIL ────────────────────────────────────────────────
var currentProfile = null; // 'a' or 'p'
var PROFILE_KEY = 'nos_profile';

function selectProfile(who){
  currentProfile = who;
  localStorage.setItem(PROFILE_KEY, who);
  var screen = document.getElementById('profile-screen');
  if(screen){ screen.style.opacity='0'; setTimeout(function(){ screen.style.display='none'; }, 300); }
  updateProfileUI();
  initGreeting();
  renderTL(); // re-render timeline with correct profile's tlDone
}

function updateProfileUI(){
  var who = currentProfile;
  if(!who) return;
  var color = who === 'a' ? 'var(--al)' : 'var(--pe)';
  var name  = who === 'a' ? 'Allan' : 'Perla';
  var dot      = document.getElementById('profile-chip-dot');
  var chipName = document.getElementById('profile-chip-name');
  var spInfo   = document.getElementById('sp-profile-info');
  var heroDay  = document.getElementById('hero-day');
  if(dot)      dot.style.background = color;
  if(chipName){ chipName.textContent = name; chipName.style.color = color; }
  if(spInfo)   spInfo.innerHTML = '<span style="font-weight:700;color:'+color+'">'+name+'</span> · logado neste dispositivo';
  if(heroDay)  heroDay.textContent = name;
}

function switchProfile(){
  // closeSP instead of closeS — matches the function name in ui.js
  if(typeof closeSP === 'function') closeSP();
  currentProfile = null;
  localStorage.removeItem(PROFILE_KEY);
  var screen = document.getElementById('profile-screen');
  if(screen){
    screen.style.opacity = '0';
    screen.style.display = 'flex';
    setTimeout(function(){ screen.style.opacity = '1'; }, 20);
  }
}

function checkSavedProfile(){
  var saved = localStorage.getItem(PROFILE_KEY);
  if(saved === 'a' || saved === 'p'){
    var screen = document.getElementById('profile-screen');
    if(screen) screen.style.display = 'none';
    currentProfile = saved;
    updateProfileUI();
  }
}
// ──────────────────────────────────────────────────────────

// INIT
// Load personal mood from this device
try{ var savedMood=localStorage.getItem('nos_mood'); if(savedMood) moodState=JSON.parse(savedMood); }catch(e){}
// Load per-profile tlDone from localStorage
try{ var s_a=localStorage.getItem('nos_tlDone_a'); if(s_a) tlDone_a=JSON.parse(s_a); }catch(e){}
try{ var s_p=localStorage.getItem('nos_tlDone_p'); if(s_p) tlDone_p=JSON.parse(s_p); }catch(e){}

loadLocalFallback();
initFirebase();
checkSavedProfile();

document.getElementById('hd-day').textContent  = DAYSF[TODAY.getDay()];
document.getElementById('hd-date').textContent = TODAY.toLocaleDateString('pt-BR',{day:'numeric',month:'short'});

ensureTodayEntry(); // make sure today has a slot in aguaHistory
initGreeting();
renderTL();
buildWeek();
renderCal();
renderRec();
renderMkt();
renderGoals();
updateAgua();
renderCorrida();
renderAcademia();
renderWeekPlan();
restoreTab();

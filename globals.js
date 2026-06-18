var DAYS=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
var DAYSF=['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado'];
var BASE=new Date('2026-01-01');
var TODAY=new Date(); // live date

function dn(d){return Math.floor((new Date(d.getFullYear(),d.getMonth(),d.getDate())-BASE)/86400000);}
function gM(d){return dn(d)%2===0?{cafe:'p',dog:'a'}:{cafe:'a',dog:'p'};}
function gN(d){if(d.getDay()===4)return{cook:'p',dog:'a',ch:true};return dn(d)%2===0?{cook:'p',dog:'a',ch:false}:{cook:'a',dog:'p',ch:false};}
function nm(id){return id==='a'?'Allan':'Perla';}

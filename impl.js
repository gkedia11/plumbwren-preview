(function(){
var T={starter:["Starter",1500],core:["Core",2950],full:["Full",4500]};
var k=(new URLSearchParams(location.search).get('tier')||'starter').toLowerCase();if(!T[k])k='starter';
var tier=T[k],fmt=function(n){return '$'+n.toLocaleString('en-US')};
document.getElementById('tierline').textContent=tier[0]+', '+fmt(tier[1]);
var f=document.getElementById('impl'),step=document.getElementById('step'),no=document.getElementById('notyet'),err=document.getElementById('ierr');
f.addEventListener('change',function(e){if(e.target.name==='done'){var y=e.target.value==='yes';step.hidden=!y;no.hidden=y}});
function d0(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
var p=(window.PW_EARLIEST_START||'').split('-'),earliest=p.length===3?new Date(+p[0],p[1]-1,+p[2]):new Date(0);
var today=d0(new Date()),start=today>earliest?today:earliest,end=new Date(start);end.setDate(end.getDate()+14);end.setHours(23,59);
function loc(d){var z=function(n){return String(n).padStart(2,'0')};return d.getFullYear()+'-'+z(d.getMonth()+1)+'-'+z(d.getDate())+'T'+z(d.getHours())+':'+z(d.getMinutes())}
['t1','t2','t3'].forEach(function(n){f[n].min=loc(start);f[n].max=loc(end)});
f.addEventListener('submit',function(e){e.preventDefault();err.hidden=true;
 var m=[];
 if(!f.ref.value.trim())m.push('Please enter your assessment reference.');
 var ts=['t1','t2','t3'].map(function(n){return f[n].value}).filter(Boolean);
 if(ts.length<3)m.push('Please pick 3 times so we can find one that works.');
 else if(ts.some(function(v){var d=new Date(v);return isNaN(d)||d<start||d>end}))m.push('Please pick times from the dates shown.');
 if(m.length){err.textContent=m.join(' ');err.hidden=false;return}
 var code=f.code.value.trim(),c=document.getElementById('credit');
 c.textContent=code?('Credit applied: $497 off. Your price: '+fmt(tier[1]-497)+' for '+tier[0]+'.'):('Your package: '+tier[0]+', '+fmt(tier[1])+'.');
 f.hidden=true;var d=document.getElementById('done');d.hidden=false;document.getElementById('tierline').hidden=true;document.getElementById('ih').hidden=true;d.focus();
});})();

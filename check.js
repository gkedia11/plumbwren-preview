(function(){
var f=document.getElementById('check'),out=document.getElementById('result'),err=document.getElementById('err'),P=window.PW;
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
f.addEventListener('submit',function(ev){
  ev.preventDefault();err.hidden=true;
  var fd=new FormData(f),miss=[],answers=[],total=0,area={};
  Object.keys(P.areas).forEach(function(k){area[k]=0});
  document.querySelectorAll('.q').forEach(function(q){q.classList.remove('bad')});
  P.q.forEach(function(q,i){var v=fd.get('q'+(i+1));
    if(v===null){miss.push(i);document.querySelectorAll('.q')[i].classList.add('bad');answers.push(null);return}
    var pts=q[1][+v];answers.push(+v);total+=pts;area[q[0]]+=pts});
  var name=(fd.get('name')||'').trim(),email=(fd.get('email')||'').trim(),org=(fd.get('org')||'').trim();
  var msgs=[];
  if(!name||!org||!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))msgs.push('Please enter your name, organization name, and a valid email.');
  if(miss.length)msgs.push('Please answer question'+(miss.length>1?'s ':' ')+miss.map(function(i){return i+1}).join(', ')+'.');
  if(msgs.length){err.textContent=msgs.join(' ');err.hidden=false;err.scrollIntoView({block:'center'});return}
  var band=P.bands.filter(function(b){return total>=b[0]&&total<=b[1]})[0]||P.bands[total<22?0:total<=40?1:2];
  var gaps=P.order.slice().sort(function(a,b){return area[a]-area[b]||P.order.indexOf(a)-P.order.indexOf(b)}).slice(0,3);
  var rec={ts:new Date().toISOString(),name:name,org:org,email:email,role:fd.get('role'),state:fd.get('state'),founded:fd.get('founded'),budget:fd.get('budget'),staff:fd.get('staff'),fund:fd.get('fund'),notes:fd.get('notes'),optin:!!fd.get('optin'),answers:answers,areaScores:area,score:total,band:band[2],gaps:gaps};
  if(window.PW_ENDPOINT){try{fetch(window.PW_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(rec),keepalive:true}).catch(function(){})}catch(e){}}
  var s=(total%1?total.toFixed(1):total);
  out.innerHTML='<div class="band"><h2>'+esc(band[2])+'</h2><p class="score">Your score: '+s+' out of 54</p><p>'+esc(band[3])+'</p></div>'+
   '<h2>Your top 3 gaps</h2><ol class="gaps">'+gaps.map(function(k){return '<li><strong>'+esc(P.areas[k][0])+'.</strong> '+esc(P.areas[k][1])+'</li>'}).join('')+'</ol>'+
   '<p>A copy goes to '+esc(email)+'.</p><p><a class="btn" href="assessment.html">Book the Full Readiness Assessment</a></p>'+
   '<p class="small">This score is a starting point, not a funding decision. We don\'t guarantee funding.</p>';
  f.hidden=true;out.hidden=false;out.focus();window.scrollTo(0,out.offsetTop-80);
  window.PW_LAST=rec;
});})();

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mailtoLink(subject,body){return "mailto:"+SITE_EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)}
function jobCard(j){
  return '<a class="card" style="display:block;color:inherit" href="kaam-detail.html?id='+encodeURIComponent(j.id)+'">'
  +'<h3>'+esc(j.title)+'</h3>'
  +'<div class="meta"><span class="tag">'+esc(j.cat)+'</span><span class="tag green">₹'+esc(j.budget)+'</span>'
  +(j.sample?'<span class="tag amber">Sample</span>':'')+'</div>'
  +'<div class="meta">'+esc(j.city)+' • '+esc(j.posted)+'</div></a>';
}
function freelancerCard(f){
  return '<a class="card" style="display:block;color:inherit" href="freelancer.html?id='+encodeURIComponent(f.id)+'">'
  +'<h3>'+esc(f.name)+' '+(f.sample?'<span class="tag amber">Sample</span>':'')+'</h3>'
  +'<div class="meta"><span class="tag">'+esc(f.skill)+'</span></div>'
  +'<div class="meta"><span class="rate">'+esc(f.rate)+'</span> • '+esc(f.city)+'</div></a>';
}

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mailtoLink(subject,body){return "mailto:"+SITE_EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)}
function jobCard(j){
  const snip=j.desc.length>90?j.desc.slice(0,90)+'...':j.desc;
  return '<a class="card" style="display:block;color:inherit" href="kaam-detail.html?id='+encodeURIComponent(j.id)+'">'
  +'<div class="job-head"><h3>'+esc(j.title)+'</h3><span class="job-budget">₹'+esc(j.budget)+'</span></div>'
  +'<div class="snip">'+esc(snip)+'</div>'
  +'<div class="meta"><span class="tag">'+esc(j.cat)+'</span>'
  +(j.sample?'<span class="tag amber">Sample</span>':'')
  +esc(j.city)+' • '+esc(j.posted)+'</div></a>';
}
function freelancerCard(f){
  return '<a class="card" style="display:block;color:inherit" href="freelancer.html?id='+encodeURIComponent(f.id)+'">'
  +'<h3>'+esc(f.name)+' '+(f.sample?'<span class="tag amber">Sample</span>':'')+'</h3>'
  +'<div class="meta"><span class="tag">'+esc(f.skill)+'</span></div>'
  +'<div class="meta"><span class="rate">'+esc(f.rate)+'</span> • '+esc(f.city)+'</div></a>';
}
function gigCard(g){
  const start=g.packs[0].p;
  return '<a class="card" style="display:block;color:inherit" href="gig-detail.html?id='+encodeURIComponent(g.id)+'">'
  +'<div class="job-head"><h3>'+esc(g.title)+'</h3><span class="job-budget">₹'+esc(start)+' se</span></div>'
  +'<div class="snip">'+esc(g.desc)+'</div>'
  +'<div class="meta"><span class="tag">'+esc(g.cat)+'</span>'
  +(g.sample?'<span class="tag amber">Sample</span>':'')
  +esc(g.by)+' • Delivery: '+esc(g.delivery)+'</div></a>';
}

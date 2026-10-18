function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function mailtoLink(subject,body){return "mailto:"+SITE_EMAIL+"?subject="+encodeURIComponent(subject)+"&body="+encodeURIComponent(body)}
/* Favourites (on-device) */
function getFavs(){try{return JSON.parse(localStorage.getItem('df_favs')||'[]')}catch(e){return[]}}
function isFav(k){return getFavs().includes(k)}
function toggleFav(btn){
 const k=btn.dataset.fav;let f=getFavs();
 if(f.includes(k)){f=f.filter(x=>x!==k);btn.classList.remove('on');}
 else{f.push(k);btn.classList.add('on');}
 localStorage.setItem('df_favs',JSON.stringify(f));
}
function heartBtn(kind,id){const k=kind+':'+id;return '<button class="heart'+(isFav(k)?' on':'')+'" data-fav="'+k+'" onclick="event.preventDefault();event.stopPropagation();toggleFav(this)" aria-label="save">♥</button>'}
function vBadge(v){return v?'<span class="vbadge">'+T("verified")+'</span> ':''}
function sBadge(s){return s?'<span class="tag amber">'+T("sample")+'</span>':''}
function jobCard(j){
  const snip=j.desc.length>90?j.desc.slice(0,90)+'...':j.desc;
  return '<a class="card" style="display:block;color:inherit" href="kaam-detail.html?id='+encodeURIComponent(j.id)+'">'
  +heartBtn('job',j.id)
  +'<div class="job-head"><h3>'+esc(j.title)+'</h3><span class="job-budget">₹'+esc(j.budget)+'</span></div>'
  +'<div class="snip">'+esc(snip)+'</div>'
  +'<div class="meta"><span class="tag">'+esc(j.cat)+'</span>'
  +sBadge(j.sample)
  +esc(j.city)+' • '+esc(j.posted)+'</div></a>';
}
function freelancerCard(f){
  return '<a class="card" style="display:block;color:inherit" href="freelancer.html?id='+encodeURIComponent(f.id)+'">'
  +heartBtn('fl',f.id)
  +'<h3>'+esc(f.name)+' '+vBadge(f.verified)+sBadge(f.sample)+'</h3>'
  +'<div class="meta"><span class="tag">'+esc(f.skill)+'</span></div>'
  +'<div class="meta"><span class="rate">'+esc(f.rate)+'</span> • '+esc(f.city)+'</div></a>';
}
function gigCard(g){
  const start=g.packs[0].p;
  return '<a class="card" style="display:block;color:inherit" href="gig-detail.html?id='+encodeURIComponent(g.id)+'">'
  +heartBtn('gig',g.id)
  +'<div class="job-head"><h3>'+esc(g.title)+'</h3><span class="job-budget">₹'+esc(start)+' '+T("from")+'</span></div>'
  +'<div class="snip">'+esc(g.desc)+'</div>'
  +'<div class="meta"><span class="tag">'+esc(g.cat)+'</span>'
  +sBadge(g.sample)
  +esc(g.by)+' '+vBadge(g.verified)+' • '+T("deliv")+' '+esc(g.delivery)+'</div></a>';
}

/* DeoriaFreelance backend client (Supabase). Filled at provisioning. */
const SB_URL = "https://fuyzmhchzrrbiavffosw.supabase.co";
const SB_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1eXptaGNoenJyYmlhdmZmb3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzMzM1MTMsImV4cCI6MjEwNzkwOTUxM30.K4M1OjmKCKe3juTJ7XFyF3SDy7D1nQ_lkU6GbEw21k4";
let _sb = null;
function sbReady(){
  if(!SB_URL || !SB_ANON || typeof supabase==='undefined') return false;
  if(!_sb) _sb = supabase.createClient(SB_URL, SB_ANON);
  return true;
}
async function sbUser(){ if(!sbReady()) return null; const {data}=await _sb.auth.getUser(); return data.user||null; }
async function sbSignIn(email){
  if(!sbReady()) return {error:'backend'};
  return _sb.auth.signInWithOtp({email, options:{emailRedirectTo: location.origin + location.pathname.replace(/[^/]*$/,'') + 'auth.html'}});
}
async function sbSignOut(){ if(sbReady()) await _sb.auth.signOut(); location.href='index.html'; }
/* listings */
async function sbLiveListings(type){
  if(!sbReady()) return [];
  const {data,error}=await _sb.from('public_listings').select('*').eq('type',type).order('created_at',{ascending:false}).limit(50);
  return error?[]:data;
}
/* submit a listing (auto-screened server-side) */
async function sbSubmit(type,title,payload,contact){
  if(!sbReady()) return {error:'backend'};
  const {error}=await _sb.from('submissions').insert({type,title,payload,contact_email:contact});
  return {error};
}
/* profiles */
async function sbMyProfile(){
  const u=await sbUser(); if(!u) return null;
  const {data}=await _sb.from('profiles').select('*').eq('id',u.id).maybeSingle();
  return data;
}
async function sbSaveProfile(p){
  const u=await sbUser(); if(!u) return {error:'login'};
  return _sb.from('profiles').upsert({id:u.id, ...p, updated_at:new Date().toISOString()});
}
async function sbProfiles(){
  if(!sbReady()) return [];
  const {data}=await _sb.from('profiles').select('*').order('updated_at',{ascending:false}).limit(50);
  return data||[];
}
/* ratings */
async function sbRatings(target){
  if(!sbReady()) return {list:[],avg:0,count:0};
  const {data}=await _sb.from('ratings').select('stars,comment,nick,created_at').eq('target',target).eq('status','live').order('created_at',{ascending:false}).limit(50);
  const list=data||[]; const avg=list.length?(list.reduce((a,r)=>a+r.stars,0)/list.length):0;
  return {list,avg:Math.round(avg*10)/10,count:list.length};
}
async function sbAddRating(target,stars,comment,nick){
  const u=await sbUser(); if(!u) return {error:'login'};
  return _sb.from('ratings').insert({target,stars,comment,nick,user_id:u.id});
}
/* messages */
async function sbSendMessage(toUser,nick,body){
  const u=await sbUser(); if(!u) return {error:'login'};
  return _sb.from('messages').insert({to_user:toUser,sender_nick:nick,body,sender:u.id});
}
async function sbInbox(){
  const u=await sbUser(); if(!u) return {inbox:[],sent:[]};
  const {data:inbox}=await _sb.from('messages').select('*').eq('to_user',u.id).order('created_at',{ascending:false}).limit(50);
  const {data:sent}=await _sb.from('messages').select('*').eq('sender',u.id).order('created_at',{ascending:false}).limit(50);
  return {inbox:inbox||[],sent:sent||[]};
}
/* owner */
const OWNER_EMAIL='dheerajhj42@gmail.com';
async function sbIsOwner(){ const u=await sbUser(); return u && u.email===OWNER_EMAIL; }
async function sbFlagged(){
  if(!sbReady()) return [];
  const {data}=await _sb.from('submissions').select('*').eq('status','flagged').order('created_at',{ascending:false}).limit(50);
  return data||[];
}
async function sbSetStatus(id,status){
  return _sb.from('submissions').update({status}).eq('id',id);
}

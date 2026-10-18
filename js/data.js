// DeoriaFreelance - sample data (owner approved listings yahan add honge)
const SITE_EMAIL = "dheerajhj42@gmail.com";
const CATEGORIES = ["Sab","Video Editing","Design","Typing","Form Bharna","Social Media","Aur Kuch"];
const JOBS = [
 {id:"DF-101",title:"Shaadi ki reel edit karni hai (1 min)",cat:"Video Editing",budget:"800",city:"Deoria",posted:"2026-10-18",sample:true,
  desc:"Shaadi ke clips se 1 minute ki Instagram reel banani hai. Music aur transition ke saath. Sample kaam dikha sake to behtar."},
 {id:"DF-102",title:"Clinic ke liye poster design",cat:"Design",budget:"300",city:"Bhaluani",posted:"2026-10-18",sample:true,
  desc:"Dental clinic ka A4 poster: naam, timing, phone, photo. Simple aur saaf design chahiye."},
 {id:"DF-103",title:"Hindi typing - 10 page",cat:"Typing",budget:"200",city:"Deoria",posted:"2026-10-18",sample:true,fresher:true,
  desc:"Handwritten notes ko Hindi me type karke PDF banana hai. 2 din me chahiye."},
 {id:"DF-104",title:"Online form bharne me madad (10 form)",cat:"Form Bharna",budget:"150",city:"Tarkulaha",posted:"2026-10-18",sample:true,fresher:true,
  desc:"Sarkari online form sahi se bharne hain. Computer aur document ki samajh honi chahiye."},
 {id:"DF-105",title:"Dukaan ka Instagram page sambhalna (mahine ka)",cat:"Social Media",budget:"1500",city:"Deoria",posted:"2026-10-18",sample:true,
  desc:"Kapde ki dukaan ke liye hafte me 3 post/reel. Page manage karna aur reply karna."}
];
const FREELANCERS = [
 {id:"editorpro",name:"EditorPro",skill:"Video Editing",rate:"₹299 - ₹1000 / video",city:"Deoria",sample:true,verified:true,
  about:"Reels, wedding highlights, YouTube videos. CapCut aur Premiere Pro.",samples:["Instagram reels","Wedding teaser","Lyric video"]},
 {id:"designwala",name:"DesignWala",skill:"Design",rate:"₹200 se",city:"Bhaluani",sample:true,
  about:"Poster, logo, banner, visiting card. Canva aur Photoshop.",samples:["Clinic poster","Dukaan banner"]},
 {id:"typefast",name:"TypeFast",skill:"Typing",rate:"₹20 / page",city:"Deoria",sample:true,
  about:"Hindi aur English typing, data entry, PDF banane ka kaam.",samples:["Typed notes","Form data entry"]}
];
const GIGS = [
 {id:"G-201",title:"Instagram reel edit (1 min)",by:"EditorPro",cat:"Video Editing",sample:true,verified:true,delivery:"2 din",
  desc:"Aapke clips se professional reel: cuts, music sync, captions.",
  packs:[{n:"Basic",p:"299",d:"1 reel, simple cuts + music"},{n:"Standard",p:"599",d:"1 reel + captions + transitions"},{n:"Premium",p:"999",d:"2 reels + transitions + thumbnail"}]},
 {id:"G-202",title:"Poster / banner design",by:"DesignWala",cat:"Design",sample:true,delivery:"1 din",
  desc:"Dukaan, clinic, event ke liye saaf aur sundar design.",
  packs:[{n:"Basic",p:"200",d:"1 design, 1 badlav (revision)"},{n:"Standard",p:"450",d:"2 designs + 3 badlav"},{n:"Premium",p:"800",d:"3 designs + unlimited badlav + print file"}]},
 {id:"G-203",title:"Hindi/English typing (10 page)",by:"TypeFast",cat:"Typing",sample:true,delivery:"2 din",
  desc:"Notes, form data, documents - saaf typing, PDF ke saath.",
  packs:[{n:"Basic",p:"150",d:"5 page typing"},{n:"Standard",p:"300",d:"10 page + PDF"},{n:"Premium",p:"500",d:"20 page + PDF + table/formatting"}]}
];

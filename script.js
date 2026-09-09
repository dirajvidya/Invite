// ===== EDIT THESE DETAILS =====
const WEDDING_DATE = "2026-12-21T10:00:00+05:30";
const CALENDAR_TITLE = "Wedding of YOUR NAME & PARTNER'S NAME";
const CALENDAR_LOCATION = "VENUE NAME, City";
const CALENDAR_DESCRIPTION = "Wedding celebration of YOUR NAME & PARTNER'S NAME.";
// ===============================

const opening = document.getElementById("opening");
const enterBtn = document.getElementById("enterBtn");
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");

enterBtn.addEventListener("click", async () => {
  opening.classList.add("hide");
  try { await music.play(); musicBtn.textContent = "❚❚"; } catch(e) {}
  window.scrollTo({top:0,behavior:"smooth"});
});

musicBtn.addEventListener("click", async () => {
  if (music.paused) {
    try { await music.play(); musicBtn.textContent = "❚❚"; } catch(e) {}
  } else { music.pause(); musicBtn.textContent = "♫"; }
});

// Rose petals
const petals = document.getElementById("petals");
function makePetal(){
  const p=document.createElement("i");
  p.className="petal";
  p.style.left=Math.random()*100+"vw";
  p.style.animationDuration=(7+Math.random()*7)+"s";
  p.style.setProperty("--drift",(Math.random()*160-80)+"px");
  p.style.transform=`rotate(${Math.random()*360}deg) scale(${.65+Math.random()*.8})`;
  petals.appendChild(p);
  setTimeout(()=>p.remove(),15000);
}
setInterval(makePetal,500);
for(let i=0;i<15;i++) setTimeout(makePetal,i*250);

// Scroll reveals
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

// Scratch cards
document.querySelectorAll(".scratch-canvas").forEach(canvas=>{
  const ctx=canvas.getContext("2d");
  let drawing=false, scratched=0;
  function resize(){
    const r=canvas.getBoundingClientRect();
    canvas.width=r.width*devicePixelRatio; canvas.height=r.height*devicePixelRatio;
    ctx.scale(devicePixelRatio,devicePixelRatio);
    ctx.fillStyle="#c99a4e"; ctx.fillRect(0,0,r.width,r.height);
    ctx.fillStyle="rgba(255,255,255,.22)";
    for(let x=-r.height;x<r.width+r.height;x+=22){
      ctx.save();ctx.translate(x,0);ctx.rotate(-.25);
      ctx.fillRect(0,0,8,r.height);ctx.restore();
    }
    ctx.fillStyle="#fff1cf";ctx.font="600 12px Manrope";ctx.textAlign="center";
    ctx.fillText("SCRATCH TO REVEAL",r.width/2,r.height/2+4);
  }
  resize(); window.addEventListener("resize",resize);
  function scratch(e){
    if(!drawing)return;
    const r=canvas.getBoundingClientRect();
    const x=(e.clientX-r.left),y=(e.clientY-r.top);
    ctx.globalCompositeOperation="destination-out";
    ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fill();
    scratched++;
    if(scratched>55){canvas.style.opacity="0";canvas.style.pointerEvents="none"}
  }
  canvas.addEventListener("pointerdown",e=>{drawing=true;scratch(e)});
  canvas.addEventListener("pointermove",scratch);
  canvas.addEventListener("pointerup",()=>drawing=false);
  canvas.addEventListener("pointerleave",()=>drawing=false);
});

// Countdown
function updateTimer(){
 const diff=new Date(WEDDING_DATE)-new Date();
 const d=Math.max(0,Math.floor(diff/86400000));
 const h=Math.max(0,Math.floor(diff%86400000/3600000));
 const m=Math.max(0,Math.floor(diff%3600000/60000));
 const s=Math.max(0,Math.floor(diff%60000/1000));
 document.getElementById("days").textContent=String(d).padStart(2,"0");
 document.getElementById("hours").textContent=String(h).padStart(2,"0");
 document.getElementById("minutes").textContent=String(m).padStart(2,"0");
 document.getElementById("seconds").textContent=String(s).padStart(2,"0");
}
updateTimer(); setInterval(updateTimer,1000);

// Add to calendar (.ics)
document.getElementById("calendarBtn").addEventListener("click",()=>{
 const start=new Date(WEDDING_DATE);
 const end=new Date(start.getTime()+3*60*60*1000);
 const fmt=d=>d.toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z");
 const ics=[
 "BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Wedding Invitation//EN",
 "BEGIN:VEVENT","UID:"+Date.now()+"@invitation",
 "DTSTAMP:"+fmt(new Date()),"DTSTART:"+fmt(start),"DTEND:"+fmt(end),
 "SUMMARY:"+CALENDAR_TITLE,"LOCATION:"+CALENDAR_LOCATION,
 "DESCRIPTION:"+CALENDAR_DESCRIPTION,"END:VEVENT","END:VCALENDAR"
 ].join("\r\n");
 const blob=new Blob([ics],{type:"text/calendar"});
 const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="wedding.ics";a.click();
});

// Share
document.getElementById("shareBtn").addEventListener("click",async()=>{
 const data={title:document.title,text:"You are invited! ✨",url:location.href};
 if(navigator.share){try{await navigator.share(data)}catch(e){}}
 else{await navigator.clipboard.writeText(location.href);alert("Invitation link copied!");}
});

const state = { digits: [] };
const screens = [...document.querySelectorAll(".screen")];
const display = document.querySelector("#dateDisplay");
const keypad = document.querySelector("#keypad");
const toast = document.querySelector("#toast");

function show(id){
  screens.forEach(s => s.classList.toggle("active", s.id === id));
}
function notify(msg){
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(notify.t);
  notify.t = setTimeout(()=>toast.classList.remove("show"), 1800);
}

for(let n=1;n<=9;n++){
  const b=document.createElement("button");
  b.textContent=n;
  b.onclick=()=>press(String(n));
  keypad.appendChild(b);
}
const zero=document.createElement("button");
zero.textContent="0"; zero.onclick=()=>press("0");
keypad.appendChild(zero);

function press(n){
  if(state.digits.length >= 3) return;
  state.digits.push(n);
  display.textContent = state.digits.join(" ");
  if(state.digits.length === 3){
    setTimeout(()=>{
      // The reference video uses a short 3-digit date entry before the gifts.
      show("gifts");
    },450);
  }
}
document.querySelector("#clearBtn").onclick=()=>{
  state.digits=[];
  display.textContent="0 0 0";
};

document.querySelectorAll("[data-open]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    show(btn.dataset.open);
  });
});
document.querySelectorAll("[data-back]").forEach(btn=>{
  btn.addEventListener("click",()=>show("gifts"));
});

document.querySelector("#playSong").onclick=()=>{
  const raw=document.querySelector("#songUrl").value.trim();
  const frame=document.querySelector("#player");
  if(!raw){ notify("Paste a YouTube link first."); return; }
  try{
    const u=new URL(raw);
    let id="";
    if(u.hostname.includes("youtu.be")) id=u.pathname.slice(1);
    if(u.hostname.includes("youtube.com")) id=u.searchParams.get("v") || u.pathname.split("/").pop();
    if(!id){ notify("That doesn't look like a YouTube link."); return; }
    frame.src=`https://www.youtube.com/embed/${encodeURIComponent(id)}?autoplay=1`;
    frame.hidden=false;
  }catch(e){ notify("Please enter a valid link."); }
};

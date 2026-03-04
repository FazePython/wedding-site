// Countdown (Central Time) — starts at 7:00 PM CDT for Oct 4, 2026
const weddingDate = new Date("2026-10-04T19:00:00-05:00");
const d = document.getElementById("d");
const h = document.getElementById("h");
const m = document.getElementById("m");
const s = document.getElementById("s");

function pad(n){ return String(n).padStart(2, "0"); }

function tick(){
  const now = new Date();
  let diff = weddingDate.getTime() - now.getTime();

  if (diff <= 0){
    if (d) d.textContent = "0";
    if (h) h.textContent = "0";
    if (m) m.textContent = "0";
    if (s) s.textContent = "0";
    return;
  }

  const days = Math.floor(diff / (1000*60*60*24));
  diff -= days * (1000*60*60*24);

  const hours = Math.floor(diff / (1000*60*60));
  diff -= hours * (1000*60*60);

  const mins = Math.floor(diff / (1000*60));
  diff -= mins * (1000*60);

  const secs = Math.floor(diff / 1000);

  if (d) d.textContent = String(days);
  if (h) h.textContent = pad(hours);
  if (m) m.textContent = pad(mins);
  if (s) s.textContent = pad(secs);
}
tick();
setInterval(tick, 1000);

// ===============================
// Background frames (Night builds)
// ===============================
const bgImgs = Array.from(document.querySelectorAll(".bgImg"));
const bgPanels = Array.from(document.querySelectorAll(".panel"));

const frameForPanel = {
  home:   0,
  events: 1,
  dress:  2,
  travel: 3,
  rsvp:   4,
};

function setFrame(idx){
  if (typeof idx !== "number") return;
  bgImgs.forEach((img, i) => img.classList.toggle("isOn", i === idx));
}

// initial
setFrame(frameForPanel[location.hash.replace("#","")] ?? 0);

const bgObserver = new IntersectionObserver((entries) => {
  const best = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!best) return;

  const idx = frameForPanel[best.target.id];
  setFrame(idx);
}, { threshold: [0.55, 0.7, 0.85] });

bgPanels.forEach(p => bgObserver.observe(p));

// =====================
// Dot active highlight
// =====================
const dots = Array.from(document.querySelectorAll(".dot"));

const dotObserver = new IntersectionObserver((entries) => {
  const best = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!best) return;

  const id = best.target.id;
  dots.forEach(dot => dot.classList.toggle("active", dot.getAttribute("href") === `#${id}`));
}, { threshold: [0.55, 0.7, 0.85] });

bgPanels.forEach(p => dotObserver.observe(p));

// =====================
// Add to Calendar (.ics)
// =====================
const icsBtn = document.getElementById("icsBtn");
if (icsBtn) {
  icsBtn.addEventListener("click", () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Z&F Wedding//EN",
      "CALSCALE:GREGORIAN",
      "BEGIN:VEVENT",
      "UID:" + (Date.now() + "@zf-wedding"),
      "DTSTAMP:" + toICSDate(new Date()),
      "DTSTART:20261005T000000Z",
      "DTEND:20261005T040000Z",
      "SUMMARY:Zahin & Faizan — Nikkah + Wedding",
      "LOCATION:The Crown Venue, 10841 Composite Drive, Dallas, TX 75220",
      "DESCRIPTION:Gates close at 7:20 PM. Please arrive on time.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "zahin-faizan-oct-4.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(url);
  });
}

function toICSDate(date){
  const y = date.getUTCFullYear();
  const mo = String(date.getUTCMonth()+1).padStart(2,"0");
  const da = String(date.getUTCDate()).padStart(2,"0");
  const ho = String(date.getUTCHours()).padStart(2,"0");
  const mi = String(date.getUTCMinutes()).padStart(2,"0");
  const se = String(date.getUTCSeconds()).padStart(2,"0");
  return `${y}${mo}${da}T${ho}${mi}${se}Z`;
}


const sceneForPanel = {
  home: "scene-home",
  events: "scene-events",
  dress: "scene-dress",
  travel: "scene-travel",
  rsvp: "scene-rsvp",
};

function setScene(id){
  const scene = sceneForPanel[id];
  if (!scene) return;

  document.body.classList.remove(
    "scene-home","scene-events","scene-dress","scene-travel","scene-rsvp"
  );
  document.body.classList.add(scene);
}

// set initial scene
setScene(location.hash.replace("#","") || "home");

const sceneObserver = new IntersectionObserver((entries) => {
  const best = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!best) return;

  setScene(best.target.id);
}, { threshold: [0.55, 0.7, 0.85] });

document.querySelectorAll(".panel").forEach(p => sceneObserver.observe(p));


document.addEventListener("DOMContentLoaded", () => {
  const curtain = document.getElementById("curtain");
  if (!curtain) return;

  const prompt = curtain.querySelector(".curtain__prompt");

  // Keep page from scrolling before reveal (optional)
  document.body.classList.add("pre-reveal");

  let opened = false;

  function openCurtain() {
    if (opened) return;
    opened = true;

    curtain.classList.add("open");

    // Reveal your page content shortly after animation begins
    setTimeout(() => {
      document.body.classList.remove("pre-reveal");
      document.body.classList.add("revealed");
    }, 250);

    // After curtains finish, fade overlay out then remove
    setTimeout(() => {
      curtain.classList.add("done");
      setTimeout(() => curtain.remove(), 300);
    }, 1400);
  }

  // Click anywhere on the curtain to open
  curtain.addEventListener("click", openCurtain);

  // Also allow keyboard (Enter/Space) on the prompt
  if (prompt) {
    prompt.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openCurtain();
      }
    });
  }
});

// ===== Scratch Reveal Logic (FIXED for mobile sizing + DPR) =====
(function initScratchReveal(){
  const revealSection = document.getElementById("reveal");
  if (!revealSection) return;

  const tiles = Array.from(revealSection.querySelectorAll(".scratch"));
  const doneText = document.getElementById("revealDone");
  const nextBtn = document.getElementById("revealNext");

  let completed = new Set();

  function makeGoldTexture(ctx, w, h){
    const g1 = ctx.createRadialGradient(w*0.35, h*0.35, 10, w*0.5, h*0.5, w*0.7);
    g1.addColorStop(0, "#f7e2b5");
    g1.addColorStop(0.35, "#e9c78a");
    g1.addColorStop(0.7, "#d2a35e");
    g1.addColorStop(1, "#f2d6a3");

    const g2 = ctx.createLinearGradient(0, 0, w, h);
    g2.addColorStop(0, "rgba(255,255,255,.35)");
    g2.addColorStop(0.5, "rgba(0,0,0,.10)");
    g2.addColorStop(1, "rgba(255,255,255,.25)");

    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = g1;
    ctx.fillRect(0,0,w,h);
    ctx.fillStyle = g2;
    ctx.fillRect(0,0,w,h);

    // subtle circular "brushed metal" rings
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    for (let r = 10; r < Math.min(w,h)/2; r += 10){
      ctx.beginPath();
      ctx.arc(w/2, h/2, r, 0, Math.PI*2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function getScratchPercent(ctx, w, h){
    const img = ctx.getImageData(0,0,w,h).data;
    let transparent = 0;
    const step = 10; // bigger step = faster
    for (let y=0; y<h; y+=step){
      for (let x=0; x<w; x+=step){
        const i = (y*w + x) * 4;
        if (img[i+3] === 0) transparent++;
      }
    }
    const total = (Math.ceil(h/step) * Math.ceil(w/step));
    return transparent / total;
  }

  function checkAllDone(){
    if (completed.size === tiles.length){
      if (doneText) doneText.hidden = false;
      if (nextBtn){
        nextBtn.disabled = false;
        nextBtn.style.opacity = "1";
      }
    }
  }

  tiles.forEach((tile, idx) => {
    const canvas = tile.querySelector(".scratch__canvas");
    const ctx = canvas.getContext("2d");

    let opened = false;
    let isDown = false;

    // ✅ RESIZE CANVAS TO MATCH CSS SIZE (fixes mobile circle mismatch)
    function resizeCanvasToCSS(){
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);

      // scale drawing so 1 unit = 1 CSS pixel
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // draw cover using CSS pixel sizes
      makeGoldTexture(ctx, rect.width, rect.height);

      // reset to normal mode after drawing cover
      ctx.globalCompositeOperation = "source-over";
    }

    // initial draw (slight delay helps if fonts/layout still loading)
    setTimeout(resizeCanvasToCSS, 50);
    window.addEventListener("resize", resizeCanvasToCSS, { passive: true });

    function scratchAt(clientX, clientY){
      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left);
      const y = (clientY - rect.top);

      const brush = rect.width < 130 ? 10 : 12; // smaller brush on mobile

      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brush, 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    function maybeComplete(){
      const pct = getScratchPercent(ctx, canvas.width, canvas.height);
      if (pct > 0.45 && !tile.classList.contains("done")){
        tile.classList.add("done");
        completed.add(idx);
        checkAllDone();
      }
    }

    // Mouse
    canvas.addEventListener("mousedown", (e) => {
      isDown = true;
      scratchAt(e.clientX, e.clientY);
    });

    window.addEventListener("mouseup", () => {
      if (!isDown) return;
      isDown = false;
      maybeComplete();
    });

    canvas.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      scratchAt(e.clientX, e.clientY);
    });

    // Touch
    canvas.addEventListener("touchstart", (e) => {
      isDown = true;
      const t = e.touches[0];
      scratchAt(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchmove", (e) => {
      if (!isDown) return;
      const t = e.touches[0];
      scratchAt(t.clientX, t.clientY);
      e.preventDefault();
    }, { passive: false });

    canvas.addEventListener("touchend", () => {
      if (!isDown) return;
      isDown = false;
      maybeComplete();
    });
  });

  // Continue button scrolls to your real home page (if you add it later)
  if (nextBtn){
    nextBtn.addEventListener("click", () => {
      const home = document.getElementById("home");
      if (home) home.scrollIntoView({ behavior: "smooth" });
    });
  }
})();

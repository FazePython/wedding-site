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

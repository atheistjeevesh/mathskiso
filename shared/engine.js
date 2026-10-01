/* =========================================================
   KISO MATHS ENGINE  (shared by every chapter)
   One stage that never leaves the screen + a step card that swaps beat by beat.
   A lesson = { id, title, blurb, face, kind, view:{w,h}, init(W), draw(W,dt), tick?(W,dt), steps:[async fn] }
   Steps are scripts: tween the world, talk, ask, await the learner.
   ========================================================= */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const AUTO = /[?&]auto/.test(location.search) || !!window.__AUTO;
const AUTO_MIX = /[?&]auto=mix/.test(location.search);
const $ = (s) => document.querySelector(s);
const CH = window.CH || { n: 0, key: 'x' };

/* ---------- DOM skeleton (chapter pages only provide window.CH) ---------- */
document.body.insertAdjacentHTML('beforeend', `
<div class="map" id="map" hidden>
  <header class="mhead">
    <div>
      <div class="eyebrow">${CH.eyebrow || ''}</div>
      <h1>${CH.title || ''}</h1>
      <p>${CH.blurb || ''}</p>
    </div>
    <div class="art" aria-hidden="true"><div><img src="m/jess-body.png" alt="" width="29" height="76"></div><div><img src="m/kimmy-sit.png" alt="" width="61" height="76"></div></div>
  </header>
  <div class="mtools"><a class="pill" href="index.html">← All chapters</a><span class="prog" id="mapProg"></span><span class="xp" id="mapXp"></span><button class="pill snd" type="button" aria-pressed="false">Sound</button></div>
  <nav id="path" aria-label="Lessons"></nav>
</div>
<div class="app" id="player" hidden>
  <div class="bar">
    <button class="back" id="back" type="button" aria-label="Back to the chapter map">←</button>
    <span class="ttl" id="ltitle"></span>
    <div class="segs" id="segs" aria-label="Lesson progress"></div>
    <span class="score" id="score"><span>pts </span><b>0</b></span>
    <span class="streak" id="streak"><span>streak </span><b>0</b></span>
    <button class="pill snd" type="button" aria-pressed="false">Sound</button>
  </div>
  <div class="stage" id="stage">
    <canvas id="cv" role="img" aria-label="Simulation"></canvas>
    <div class="speed" id="speed"></div>
    <div class="flash" id="flash"></div>
    <div class="fx" id="fx"></div>
    <div class="livetag" id="live"></div>
    <div class="slam" id="slam"><b></b><span></span></div>
    <div class="found" id="found"><div class="ava"><img src="m/jess-happy.png" alt="Jeevesh smiles"></div><div><div class="tag">Discovered</div><b></b><div class="cap"></div></div></div>
  </div>
  <section class="sheet" id="sheet" aria-live="polite"></section>
</div>`);

const C = {};
for (const n of ['paper', 'panel', 'ink', 'ink-muted', 'tone', 'beni', 'sakura', 'sakura-deep', 'peach', 'sora-tint', 'sora', 'matcha-tint', 'matcha-deep', 'khaki', 'kin', 'kin-tint', 'mascot-ground']) C[n] = getComputedStyle(document.documentElement).getPropertyValue('--' + n).trim();
function h(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const k in attrs || {}) { const v = attrs[k]; if (v == null || v === false) continue; if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v); else e.setAttribute(k, v); }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : document.createTextNode(c));
  return e;
}
const clamp = (x, a, b) => Math.max(a, Math.min(b, x)), lerp = (a, b, t) => a + (b - a) * t, deg = (r) => (r * 180) / Math.PI, rad = (d) => (d * Math.PI) / 180;
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const Store = { get(k, d) { try { const v = localStorage.getItem('kisoM' + CH.n + ':' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('kisoM' + CH.n + ':' + k, JSON.stringify(v)); } catch (e) { } } };
const GStore = { get(k, d) { try { const v = localStorage.getItem('kisoM:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem('kisoM:' + k, JSON.stringify(v)); } catch (e) { } } };

/* ---------- maths text: [[a|b]] fraction, √{x} root, ^{x} sup, _{x} sub ---------- */
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function fm(s) {
  let t = esc(s);
  for (let k = 0; k < 3; k++) t = t.replace(/\[\[([^\[\]|]*)\|([^\[\]|]*)\]\]/g, '<span class="fr"><span>$1</span><span>$2</span></span>');
  t = t.replace(/√\{([^{}]*)\}/g, '√<span class="rt">$1</span>').replace(/\^\{([^{}]*)\}/g, '<sup>$1</sup>').replace(/_\{([^{}]*)\}/g, '<sub>$1</sub>');
  return t;
}
const plain = (s) => String(s).replace(/\[\[([^\[\]|]*)\|([^\[\]|]*)\]\]/g, '$1/$2').replace(/√\{([^{}]*)\}/g, '√$1').replace(/\^\{([^{}]*)\}/g, '^$1').replace(/_\{([^{}]*)\}/g, '$1');
const H = (tag, cls, s) => h(tag, { class: cls, html: fm(s) });
/* safe evaluator for typed answers: digits . + − × / ( ) π √ */
function evalExpr(s) {
  if (typeof s === 'number') return s;
  let t = String(s).replace(/\s+/g, '').replace(/−/g, '-').replace(/×/g, '*').replace(/÷/g, '/');
  if (!t) return NaN;
  t = t.replace(/√(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)').replace(/√\(/g, 'Math.sqrt(');
  t = t.replace(/(\d|\))π/g, '$1*π').replace(/π(\d|\()/g, 'π*$1').replace(/π/g, '(Math.PI)');
  t = t.replace(/(\d|\))(Math)/g, '$1*$2');
  if (!/^[0-9.+\-*/()]*$/.test(t.replace(/Math\.(sqrt|PI)/g, ''))) return NaN;
  try { const v = Function('"use strict";return (' + t + ')')(); return typeof v === 'number' ? v : NaN; } catch (e) { return NaN; }
}
const fmtN = (x, d = 3) => { if (!isFinite(x)) return String(x); const r = Math.round(x * 10 ** d) / 10 ** d; return String(r).replace('-', '−'); };
function fracStr(x, maxDen = 1000) { // nearest simple fraction as "p/q"
  if (Number.isInteger(x)) return String(x).replace('-', '−');
  for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return (p < 0 ? '−' : '') + Math.abs(p) + '/' + q; }
  return fmtN(x);
}

/* ---------- images ---------- */
const IMG = {};
['jess-normal', 'jess-happy', 'jess-curious', 'jess-thinking', 'jess-excited', 'jess-smile', 'jess-body', 'kimmy-front', 'kimmy-excited', 'kimmy-curious', 'kimmy-lookup', 'kimmy-surprised', 'kimmy-content', 'kimmy-playful', 'kimmy-walk', 'kimmy-sit']
  .forEach((n) => { const i = new Image(); i.src = 'm/' + n + '.png'; IMG[n] = i; });

/* =========================================================
   SOUND BOARD (WebAudio synth, no files) + haptics
   ========================================================= */
let muted = GStore.get('muted', true), AC = null, NOISE = null;
function actx() { if (muted) return null; try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { return null; } return AC; }
function tone(f, d, type = 'square', v = 0.05, slide = 0, delay = 0) {
  const ac = actx(); if (!ac) return; const t0 = ac.currentTime + delay;
  const o = ac.createOscillator(), g = ac.createGain(); o.type = type; o.frequency.setValueAtTime(f, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, f + slide), t0 + d);
  g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d); o.connect(g).connect(ac.destination); o.start(t0); o.stop(t0 + d + 0.02);
}
function noise(d, v = 0.08, f = 1200, q = 0.8, type = 'bandpass', delay = 0, sweep = 0) {
  const ac = actx(); if (!ac) return; const t0 = ac.currentTime + delay;
  if (!NOISE) { NOISE = ac.createBuffer(1, ac.sampleRate, ac.sampleRate); const ch = NOISE.getChannelData(0); for (let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1; }
  const s = ac.createBufferSource(); s.buffer = NOISE; const fl = ac.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t0); fl.Q.value = q;
  if (sweep) fl.frequency.exponentialRampToValueAtTime(Math.max(60, f + sweep), t0 + d);
  const g = ac.createGain(); g.gain.setValueAtTime(v, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d); s.connect(fl).connect(g).connect(ac.destination); s.start(t0); s.stop(t0 + d + 0.02);
}
const SFX = {
  pop: () => tone(880, 0.06, 'triangle', 0.05),
  click: () => { tone(2200, 0.02, 'square', 0.02); noise(0.03, 0.04, 3000, 2); },
  tick: () => tone(1200, 0.03, 'square', 0.025), tock: () => { tone(1600, 0.05, 'square', 0.04); tone(800, 0.05, 'square', 0.02, 0, 0.05); },
  slam: () => { tone(90, 0.3, 'sine', 0.14, -45); noise(0.18, 0.12, 900, 0.7, 'lowpass'); tone(1400, 0.12, 'sawtooth', 0.025, -1200); },
  don: () => { tone(72, 0.45, 'sine', 0.2, -20); noise(0.08, 0.14, 300, 1, 'lowpass'); },
  whoosh: () => noise(0.35, 0.09, 400, 1.2, 'bandpass', 0, 3000),
  swish: () => noise(0.16, 0.05, 2500, 1.5, 'bandpass', 0, -1800),
  win: () => { tone(523, 0.1, 'triangle', 0.07); tone(659, 0.1, 'triangle', 0.07, 0, 0.08); tone(784, 0.1, 'triangle', 0.07, 0, 0.16); tone(1047, 0.25, 'triangle', 0.07, 0, 0.24); },
  combo: (n) => { const b = 440 * Math.pow(2, Math.min(n, 12) / 12); [0, 4, 7, 12].forEach((s, i) => tone(b * Math.pow(2, s / 12), 0.12, 'square', 0.035, 0, i * 0.055)); },
  coin: () => { tone(988, 0.07, 'square', 0.04); tone(1319, 0.22, 'square', 0.04, 0, 0.07); },
  lose: () => { tone(330, 0.18, 'sawtooth', 0.04, -60); tone(247, 0.35, 'sawtooth', 0.04, -80, 0.17); },
  boing: () => tone(180, 0.28, 'sine', 0.09, 420),
  snap: () => { tone(1800, 0.03, 'square', 0.03); tone(900, 0.05, 'triangle', 0.05, 0, 0.02); },
  chime: () => { [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.4, 'sine', 0.04, 0, i * 0.07)); },
  sparkle: () => { for (let i = 0; i < 5; i++) tone(2000 + Math.random() * 2000, 0.08, 'sine', 0.02, 0, i * 0.04); },
  zap: () => { tone(1800, 0.15, 'sawtooth', 0.04, -1600); noise(0.1, 0.05, 4000, 3); },
  thud: () => tone(110, 0.2, 'sine', 0.12, -50),
  flip: () => { tone(300, 0.18, 'square', 0.035, 900); tone(1200, 0.15, 'square', 0.03, -900, 0.18); },
  type: () => tone(1500 + Math.random() * 300, 0.015, 'square', 0.01),
  roll: () => { for (let i = 0; i < 10; i++) noise(0.05, 0.05, 600, 1, 'lowpass', i * 0.045); },
  fanfare: () => { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? 0.5 : 0.14, 'square', 0.035, 0, i * 0.12)); SFX.don(); },
  rise: () => tone(220, 0.5, 'sawtooth', 0.03, 660),
  drop: () => tone(700, 0.35, 'triangle', 0.05, -550),
  key: () => tone(600 + Math.random() * 80, 0.03, 'triangle', 0.04),
};
function buzz(p) { try { if (!muted && navigator.vibrate) navigator.vibrate(p); } catch (e) { } }

/* =========================================================
   STAGE: camera, pointer, drawing helpers
   ========================================================= */
const cv = $('#cv'), ctx = cv.getContext('2d');
let SW = 0, SH = 0, BASE = 1, VIEW = { w: 10, h: 6 };
let W = {}, L = null; // world + current lesson
function resize() {
  const r = cv.getBoundingClientRect(); const d = Math.min(2, devicePixelRatio || 1);
  if (!r.width) return; SW = r.width; SH = r.height; cv.width = SW * d; cv.height = SH * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  BASE = Math.min(SW / VIEW.w, SH / VIEW.h); const S = W.__scene || L; if (S && S.onResize) S.onResize(W);
}
addEventListener('resize', resize);
const sc = () => BASE * (W.cam ? W.cam.z : 1);
function toS(x, y) { const cam = W.cam || { x: 0, y: 0, z: 1, shake: 0 }; const j = cam.shake ? cam.shake * (Math.random() - 0.5) * 8 : 0; return [SW / 2 + (x - cam.x) * sc() + j, SH / 2 - (y - cam.y) * sc() + j * 0.6]; }
function toW(sx, sy) { const cam = W.cam || { x: 0, y: 0 }; return [(sx - SW / 2) / sc() + cam.x, -(sy - SH / 2) / sc() + cam.y]; }
function viewBounds(pad = 0) { const a = toW(0, SH), b = toW(SW, 0); return [a[0] - pad, a[1] - pad, b[0] + pad, b[1] + pad]; }
const FONT = (w, s, disp) => `${w} ${s}px ${disp ? '"Inter Tight"' : 'Inter'},sans-serif`;
const D = {
  head(x, y, a, s = 7) { ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * s, y + Math.sin(a) * s); ctx.lineTo(x + Math.cos(a + 2.5) * s, y + Math.sin(a + 2.5) * s); ctx.lineTo(x + Math.cos(a - 2.5) * s, y + Math.sin(a - 2.5) * s); ctx.closePath(); ctx.fill(); },
  arrow(x1, y1, x2, y2, col, w = 3, hs = 10) { const a = Math.atan2(y2 - y1, x2 - x1), L2 = Math.hypot(x2 - x1, y2 - y1); if (L2 < 2) return; ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2 - Math.cos(a) * hs * 0.6, y2 - Math.sin(a) * hs * 0.6); ctx.stroke(); D.head(x2 - Math.cos(a) * hs * 0.3, y2 - Math.sin(a) * hs * 0.3, a, hs); },
  arrowW(x1, y1, x2, y2, col, w, hs) { const a = toS(x1, y1), b = toS(x2, y2); D.arrow(a[0], a[1], b[0], b[1], col, w, hs); },
  sprite(n, sx, sy, hp, flip = false, alpha = 1, rot = 0) { const im = IMG[n]; if (!im || !im.naturalWidth || alpha <= 0) return; const w = (im.naturalWidth / im.naturalHeight) * hp; ctx.save(); ctx.globalAlpha *= alpha; ctx.translate(sx, sy); if (rot) ctx.rotate(rot); if (flip) ctx.scale(-1, 1); ctx.drawImage(im, -w / 2, -hp, w, hp); ctx.restore(); },
  text(t, x, y, { col = C.ink, size = 13, w = 700, align = 'center', disp = false, base = 'alphabetic', stroke } = {}) { ctx.font = FONT(w, size, disp); ctx.textAlign = align; ctx.textBaseline = base; if (stroke) { ctx.lineWidth = 4; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.strokeText(t, x, y); } ctx.fillStyle = col; ctx.fillText(t, x, y); ctx.textBaseline = 'alphabetic'; },
  textW(t, x, y, o) { const p = toS(x, y); D.text(t, p[0], p[1], o); },
  label(t, x, y, col = C.ink, bg = C.panel, size = 12) { ctx.font = FONT(700, size); const w = ctx.measureText(t).width + 12; ctx.fillStyle = bg; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.fillRect(x - w / 2, y - size + 1, w, size + 8); ctx.strokeRect(x - w / 2, y - size + 1, w, size + 8); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(t, x, y + 3); return w; },
  rect(x0, y0, x1, y1, fill, stroke = C.ink, lw = 2) { const a = toS(x0, y1), b = toS(x1, y0); if (fill) { ctx.fillStyle = fill; ctx.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); } },
  line(pts, col, w = 2, dash) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); pts.forEach((p, i) => { const s = toS(p[0], p[1]); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.stroke(); ctx.setLineDash([]); },
  dot(x, y, r, fill = C.ink, stroke = C.ink, lw = 2) { const p = toS(x, y); ctx.beginPath(); ctx.arc(p[0], p[1], r, 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } },
  circleW(x, y, r, fill, stroke = C.ink, lw = 2) { const p = toS(x, y); ctx.beginPath(); ctx.arc(p[0], p[1], r * sc(), 0, 7); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } },
  hand(hd) {
    if (!hd || hd.a <= 0) return; const p = toS(hd.x, hd.y); const rip = (performance.now() / 700) % 1; ctx.save(); ctx.globalAlpha = hd.a; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
    ctx.globalAlpha = hd.a * (1 - rip); ctx.beginPath(); ctx.arc(p[0], p[1], 10 + rip * 22, 0, 7); ctx.stroke(); ctx.globalAlpha = hd.a;
    ctx.fillStyle = C.panel; ctx.beginPath(); ctx.arc(p[0], p[1], 11 - hd.press * 3, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = C.beni; ctx.beginPath(); ctx.arc(p[0], p[1], 4, 0, 7); ctx.fill(); ctx.restore();
  },
  target(t) { if (!t || t.a <= 0) return; const p = toS(t.x, t.y), Tm = performance.now() / 1000; ctx.save(); ctx.globalAlpha = t.a; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -Tm * 20; ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p[0], p[1], (t.r || 0.3) * sc() + 6 + Math.sin(Tm * 5) * 3, 0, 7); ctx.stroke(); ctx.restore(); },
  // manga starburst drawn on canvas (for in-sim impacts)
  star(sx, sy, r, n = 12, fill = C.panel, stroke = C.ink) { ctx.beginPath(); for (let i = 0; i <= n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? r * 0.62 : r; ctx.lineTo(sx + Math.cos(a) * rr, sy + Math.sin(a) * rr); } ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); },
  bubbleW(t, x, y, { col = C.ink, bg = C.panel, size = 13 } = {}) { const p = toS(x, y); ctx.font = FONT(800, size, true); const w = ctx.measureText(t).width + 16, hh = size + 12; ctx.fillStyle = bg; ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(p[0] - w / 2, p[1] - hh, w, hh, 10) : ctx.rect(p[0] - w / 2, p[1] - hh, w, hh); ctx.fill(); ctx.stroke(); ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.fillText(t, p[0], p[1] - 7); },
};

/* ---------- Kimmy lives in the corner of every sim and reacts ---------- */
const KIM = { mood: 'kimmy-sit', j: 0, a: 1, sweat: 0, heart: 0, x: null };
function kimReact(kind) {
  if (kind === 'ok') { KIM.mood = 'kimmy-excited'; gsap.fromTo(KIM, { j: 0 }, { j: 1, duration: 0.2, yoyo: true, repeat: 3, ease: 'power2.out' }); gsap.fromTo(KIM, { heart: 1 }, { heart: 0, duration: 1.4 }); }
  else if (kind === 'no') { KIM.mood = 'kimmy-surprised'; gsap.fromTo(KIM, { sweat: 1 }, { sweat: 0, duration: 1.6 }); }
  else if (kind === 'think') KIM.mood = 'kimmy-lookup';
  else KIM.mood = kind || 'kimmy-sit';
  clearTimeout(KIM._t); KIM._t = setTimeout(() => (KIM.mood = 'kimmy-sit'), 2600);
}
function drawKim() {
  if (W.kimCorner === false || !SW) return; const hp = Math.min(76, SH * 0.24); const x = W.kimX != null ? W.kimX * SW : SW - hp * 0.62, y = SH - 4 - KIM.j * 22;
  D.sprite(KIM.mood, x, y, hp, false, KIM.a * (W.kimAlpha == null ? 1 : W.kimAlpha));
  if (KIM.sweat > 0) { ctx.save(); ctx.globalAlpha = KIM.sweat; ctx.fillStyle = C['sora-tint']; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; const sx = x + hp * 0.3, sy = y - hp * 0.95 + (1 - KIM.sweat) * 14; ctx.beginPath(); ctx.moveTo(sx, sy - 9); ctx.quadraticCurveTo(sx + 7, sy + 2, sx, sy + 5); ctx.quadraticCurveTo(sx - 7, sy + 2, sx, sy - 9); ctx.fill(); ctx.stroke(); ctx.restore(); }
  if (KIM.heart > 0) { ctx.save(); ctx.globalAlpha = KIM.heart; D.text('♥', x + hp * 0.35, y - hp * 0.9 - (1 - KIM.heart) * 30, { col: C.beni, size: 22, w: 800 }); ctx.restore(); }
}

/* =========================================================
   POINTER: scenes register drags and taps on W
   W.drags = [{ get:()=>[x,y], set:(x,y)=>{}, r, on:()=>bool, end?:()=>{} }]   W.onTap = (x,y)=>{}
   ========================================================= */
let dragging = null;
cv.addEventListener('pointerdown', (e) => {
  const r = cv.getBoundingClientRect(); const sx = e.clientX - r.left, sy = e.clientY - r.top; const [x, y] = toW(sx, sy);
  const rr = 22 / sc();
  for (const d of W.drags || []) { if (d.on && !d.on()) continue; const p = d.get(); if (Math.hypot(p[0] - x, p[1] - y) < Math.max(d.r || 0, rr)) { dragging = d; d.off = [x - p[0], y - p[1]]; cv.setPointerCapture(e.pointerId); W.dragging = true; SFX.click(); buzz(8); e.preventDefault(); return; } }
  if (W.onTap) W.onTap(x, y, sx, sy);
});
cv.addEventListener('pointermove', (e) => {
  if (!dragging) return; const r = cv.getBoundingClientRect(); const [x, y] = toW(e.clientX - r.left, e.clientY - r.top); dragging.set(x - dragging.off[0], y - dragging.off[1]);
});
const endPtr = () => { if (dragging && dragging.end) dragging.end(); dragging = null; W.dragging = false; };
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);

/* =========================================================
   SCRIPT HELPERS
   ========================================================= */
let GEN = 0, T = 0, last = 0; const waits = [];
class Stop extends Error { }
const guard = (g) => { if (g !== GEN) throw new Stop(); };
function waitFor(cond) { const g = GEN; return new Promise((res, rej) => waits.push({ cond, res, rej, g })); }
function tickWaits() { for (let i = waits.length - 1; i >= 0; i--) { const w = waits[i]; if (w.g !== GEN) { waits.splice(i, 1); w.rej(new Stop()); continue; } let ok = false; try { ok = w.cond(); } catch (e) { } if (ok) { waits.splice(i, 1); w.res(); } } }
const wait = (s) => { const t0 = T; return waitFor(() => T - t0 >= (AUTO ? s * 0.05 : s)); };
const tw = (target, vars) => new Promise((res) => gsap.to(target, { ...vars, onComplete: res }));
const sheet = $('#sheet');
async function newCard() { const g = GEN; SFX.swish(); await tw(sheet, { x: -30, opacity: 0, duration: 0.16, ease: 'power2.in' }); guard(g); sheet.innerHTML = ''; sheet.classList.remove('dense', 'dense2'); gsap.fromTo(sheet, { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.28, ease: 'back.out(1.6)' }); }
const MOOD = { jess: { idle: 'jess-normal', happy: 'jess-happy', wrong: 'jess-curious', think: 'jess-thinking', wow: 'jess-excited', done: 'jess-smile' }, kimmy: { idle: 'kimmy-front', happy: 'kimmy-excited', wrong: 'kimmy-curious', think: 'kimmy-lookup', wow: 'kimmy-surprised', done: 'kimmy-content', play: 'kimmy-playful' } };
function ava(who, mood) { return h('div', { class: 'ava' }, h('img', { src: 'm/' + (MOOD[who][mood] || MOOD[who].idle) + '.png', alt: (who === 'jess' ? 'Jeevesh' : 'Kimmy') + ' looks ' + (mood || 'on') })); }
async function say(who, mood, text) {
  const g = GEN; const body = h('span'); const b = h('div', { class: 'bubble', title: 'Tap to skip' }, h('small', null, who === 'jess' ? 'Jeevesh' : 'Kimmy'), body); const a = ava(who, mood);
  sheet.append(h('div', { class: 'line ' + who }, a, b));
  gsap.from(a, { scale: 0.4, rotate: -12, duration: 0.35, ease: 'back.out(3)' }); gsap.from(b, { y: 10, opacity: 0, duration: 0.25 });
  if (who === 'kimmy' && W) kimReact(mood === 'wow' ? 'kimmy-surprised' : mood === 'think' ? 'think' : mood === 'happy' ? 'kimmy-excited' : mood === 'play' ? 'kimmy-playful' : 'kimmy-curious');
  let skip = false; b.onclick = () => (skip = true); const txt = plain(text);
  for (let i = 1; i <= txt.length; i++) { if (skip || RM || AUTO) break; body.textContent = txt.slice(0, i); if (i % 3 === 0) SFX.type(); await wait(0.014); guard(g); }
  body.innerHTML = fm(text);
  await wait(0.15); guard(g);
}
const J = (m, t) => say('jess', m, t), K = (m, t) => say('kimmy', m, t);
function todo(text) { const dot = h('span', { class: 'dot' }); const el = h('div', { class: 'todo' }, dot, h('span', { html: fm(text) })); sheet.append(el); gsap.from(el, { scale: 0.9, opacity: 0, duration: 0.3, ease: 'back.out(2)' }); const p = gsap.to(dot, { scale: 1.5, repeat: -1, yoyo: true, duration: 0.5 }); return { el, done() { el.classList.add('done'); p.kill(); gsap.set(dot, { scale: 1 }); gsap.fromTo(el, { scale: 1.06 }, { scale: 1, duration: 0.3 }); SFX.snap(); buzz(15); } }; }
function button(text, cls = 'btn primary', rowEl) { let hits = 0; const b = h('button', { class: cls, type: 'button', html: fm(text) }); b.onclick = () => { hits++; SFX.pop(); buzz(10); }; (rowEl || row()).append(b); gsap.from(b, { scale: 0.7, opacity: 0, duration: 0.35, ease: 'back.out(2.5)' }); let pulse = gsap.to(b, { scale: 1.04, repeat: -1, yoyo: true, duration: 0.45 }); if (AUTO) setTimeout(() => { if (!b.disabled) b.click(); }, 30); return { el: b, get hits() { return hits; }, clicked: () => hits > 0, calm() { pulse.kill(); gsap.set(b, { scale: 1 }); }, stop() { pulse.kill(); gsap.set(b, { scale: 1 }); b.disabled = true; } }; }
function row() { const r = h('div', { class: 'row' }); sheet.append(r); return r; }
function slider(label, min, max, step, val, fmtF, on, autoTo) { const out = h('output'), inp = h('input', { type: 'range', min, max, step, value: val, 'aria-label': label }); let lastV = val; const upd = () => { out.textContent = fmtF(+inp.value); on(+inp.value); if (+inp.value !== lastV) { lastV = +inp.value; SFX.key(); } }; inp.oninput = upd; sheet.append(h('label', { class: 'ctl' }, h('span', { html: fm(label) }), out, inp)); upd(); gsap.from(inp.parentNode, { y: 12, opacity: 0, duration: 0.3 }); if (AUTO && autoTo != null) setTimeout(() => { inp.value = autoTo; upd(); }, 40); return inp; }
async function cont(text = 'Continue') { const g = GEN; const b = h('button', { class: 'btn go', type: 'button' }, text + ' →'); sheet.append(b); gsap.from(b, { y: 20, opacity: 0, duration: 0.35, ease: 'back.out(2)' }); let go = false; b.onclick = () => { go = true; SFX.pop(); buzz(10); }; if (AUTO) setTimeout(() => (go = true), 20); await waitFor(() => go); guard(g); b.remove(); }
/* a sim interaction: show a todo, wait for cond; AUTO performs it */
async function task(text, cond, auto, handPath) {
  const g = GEN; const td = todo(text); const hl = handPath ? handLoop(handPath) : null;
  if (AUTO && auto) setTimeout(() => { try { auto(W); } catch (e) { } }, 30);
  await waitFor(cond); guard(g); if (hl) hl.stop(); td.done(); return td;
}

/* =========================================================
   MANGA FX
   ========================================================= */
const fxEl = $('#fx');
const STAR = (n = 14, jag = 0.6) => { let d = ''; for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? 50 * jag : 50 * (0.92 + Math.random() * 0.12); d += (i ? 'L' : 'M') + (50 + Math.cos(a) * r).toFixed(1) + ' ' + (50 + Math.sin(a) * r).toFixed(1); } return d + 'Z'; };
const FX = {
  burst(text, { x = 50, y = 40, fill = C.beni, size = 150, rot = -8, hold = 0.6, ink = false } = {}) {
    if (!fxEl.isConnected) return; const el = h('div', { class: 'burst' + (ink ? ' ink' : ''), style: `left:${x}%;top:${y}%;width:${size}px;height:${size * 0.75}px` });
    el.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${STAR(16)}" fill="${fill}" stroke="${C.ink}" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg><b>${esc(text)}</b>`;
    fxEl.append(el); gsap.fromTo(el, { scale: 0.2, rotate: rot - 25, opacity: 0 }, { scale: 1, rotate: rot, opacity: 1, duration: 0.28, ease: 'back.out(2.6)' });
    gsap.to(el, { opacity: 0, scale: 1.25, delay: hold, duration: 0.25, onComplete: () => el.remove() });
  },
  ono(text, { x = 70, y = 25, red = false, rot = 10, hold = 0.7 } = {}) {
    const el = h('div', { class: 'ono' + (red ? ' red' : ''), style: `left:${x}%;top:${y}%` }, text); fxEl.append(el);
    gsap.fromTo(el, { scale: 2.4, rotate: rot + 15, opacity: 0 }, { scale: 1, rotate: rot, opacity: 1, duration: 0.25, ease: 'back.out(2)' });
    gsap.to(el, { y: -18, opacity: 0, delay: hold, duration: 0.35, onComplete: () => el.remove() });
  },
  lines(red = false) { if (RM) return; const s = $('#speed'); s.classList.toggle('red', red); gsap.fromTo(s, { opacity: 0.95, rotate: 0, scale: 1 }, { opacity: 0, rotate: 7, scale: 1.08, duration: 0.75 }); },
  flash() { gsap.fromTo('#flash', { opacity: 0.85 }, { opacity: 0, duration: 0.35 }); },
  shake() { const a = $('#player'); a.classList.remove('shake'); void a.offsetWidth; a.classList.add('shake'); },
  wob(el) { if (!el) return; el.classList.remove('wob'); void el.offsetWidth; el.classList.add('wob'); },
  sparkle(el) {
    if (!el || !el.isConnected) return; const r = el.getBoundingClientRect();
    for (let i = 0; i < 9; i++) { const s = h('div', { style: `position:fixed;left:${r.left + Math.random() * r.width}px;top:${r.top + Math.random() * r.height}px;font:800 ${12 + Math.random() * 12}px/1 Inter;color:${i % 2 ? C.kin : C.beni};pointer-events:none;z-index:40` }, i % 3 ? '✦' : '★'); document.body.append(s); gsap.to(s, { x: (Math.random() - 0.5) * 90, y: -30 - Math.random() * 60, rotate: 180, opacity: 0, duration: 0.8 + Math.random() * 0.4, ease: 'power2.out', onComplete: () => s.remove() }); }
  },
  pts(n, el) {
    const tgt = $('#score b'); const r = (el && el.isConnected ? el : sheet).getBoundingClientRect(); const t = tgt.getBoundingClientRect();
    const s = h('div', { style: `position:fixed;left:${r.left + r.width / 2}px;top:${r.top + 10}px;font:800 22px/1 "Inter Tight";color:${C.kin};-webkit-text-stroke:2px ${C.ink};paint-order:stroke fill;pointer-events:none;z-index:40;transform:translate(-50%,0)` }, '+' + n); document.body.append(s);
    gsap.timeline().to(s, { y: -30, duration: 0.3, ease: 'power2.out' }).to(s, { left: t.left + t.width / 2, top: t.top, scale: 0.5, opacity: 0.2, duration: 0.5, ease: 'power2.in', onComplete: () => { s.remove(); SFX.coin(); bumpScore(); } });
  },
};
const ONO_OK = ['DON!', 'ZUBAAN!', 'BAM!', 'KIRA☆', 'YOSH!', 'GACHI!', 'SUGOI!'], ONO_NO = ['GAAN…', 'ZUKOO!', 'OOF…', 'DOKI!', 'GUSA!'];
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

async function slam(big, small = '', hold = 0.9) {
  const g = GEN; const el = $('#slam'); el.querySelector('b').textContent = big; const sp = el.querySelector('span'); sp.textContent = small; sp.style.display = small ? '' : 'none'; SFX.slam(); buzz(30);
  FX.lines(); FX.flash();
  await tw(el, { startAt: { opacity: 0, scale: 2.6, rotate: -14 }, opacity: 1, scale: 1, rotate: -4, duration: 0.3, ease: 'back.out(2.2)' }); guard(g);
  await wait(hold); guard(g); await tw(el, { opacity: 0, scale: 0.8, duration: 0.2 }); guard(g);
}
let found = [];
async function discover(title, text) { const g = GEN; found.push(title); const el = $('#found'); el.querySelector('b').innerHTML = fm(title); el.querySelector('.cap').innerHTML = fm(text); el.style.display = 'flex'; SFX.chime(); FX.ono('KIRA☆', { x: 82, y: 18 }); await tw(el, { startAt: { y: 80, opacity: 0 }, y: 0, opacity: 1, duration: 0.45, ease: 'back.out(1.8)' }); guard(g); }
function hideFound() { gsap.to('#found', { y: 80, opacity: 0, duration: 0.25, onComplete: () => ($('#found').style.display = 'none') }); }
function shake(k = 1) { if (W.cam) gsap.fromTo(W.cam, { shake: k }, { shake: 0, duration: 0.45 }); }
function handLoop(path) { W.hand = W.hand || { a: 0, x: 0, y: 0, press: 0 }; W.hand.a = 1; const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.4 }); tl.set(W.hand, { x: path[0][0], y: path[0][1], press: 0 }).to(W.hand, { press: 1, duration: 0.15 }); for (let i = 1; i < path.length; i++) tl.to(W.hand, { x: path[i][0], y: path[i][1], duration: 0.9, ease: 'power1.inOut' }); tl.to(W.hand, { press: 0, duration: 0.15 }); return { stop() { tl.kill(); gsap.to(W.hand, { a: 0, duration: 0.2 }); } }; }
function live(html) { const el = $('#live'); if (html == null) { el.style.display = 'none'; el._h = null; return; } el.style.display = 'block'; if (el._h !== html) { el.innerHTML = html; el._h = html; } }

/* =========================================================
   SCORE · STREAK · INPUTS (Kahoot tiles, true/false, chips, keypad, order, match)
   ========================================================= */
let streak = 0, right = 0, asked = 0, best = 0, score = 0, shownScore = 0;
function bumpScore() { const el = $('#score b'); gsap.to({ v: shownScore }, { v: score, duration: 0.5, onUpdate() { el.textContent = Math.round(this.targets()[0].v); } }); shownScore = score; gsap.fromTo(el, { scale: 1.6 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }); }
const SHAPES = ['<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 21H2Z"/></svg>', '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 22 12 12 22 2 12Z"/></svg>', '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/></svg>', '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18"/></svg>'];
function timerEl(time) { const bar = h('i'), num = h('span', null, String(time)), bonus = h('em', null, '+1000'); const el = h('div', { class: 'timer' }, bar, num, bonus); return { el, bar, num, bonus }; }
function runTimer(tm, time, t0, hard) {
  let left = time; const g = gsap.to(tm.bar, { scaleX: 0, duration: AUTO ? 0.01 : time, ease: 'none' });
  return { step() { const el = T - t0; const l = Math.ceil(time - el); tm.bonus.textContent = '+' + ptsFor(el, time, 1); if (l !== left) { left = l; tm.num.textContent = Math.max(0, l) || (hard ? 0 : 'OT'); if (l <= 3 && l > 0) { SFX.tock(); tm.el.classList.add('hot'); } } return el >= time; }, kill() { g.kill(); } };
}
const ptsFor = (t, time, mult = 1) => Math.round((500 + 500 * (1 - clamp(t / time, 0, 1))) * mult);
const autoPickWrong = () => AUTO_MIX && Math.random() < 0.25;
async function kahoot(q, opts, correct, time = 20) {
  const g = GEN; const qEl = H('p', 'q', q); const tm = timerEl(time); const short = opts.every((o) => plain(o).length < 14);
  const tiles = h('div', { class: 'tiles' + (opts.length === 2 ? ' tf' : '') + (short ? ' short' : '') }); const kq = h('div', { class: 'kq' }, qEl, tm.el, tiles); sheet.append(kq);
  gsap.from(qEl, { y: -14, opacity: 0, duration: 0.3 }); SFX.whoosh();
  // display order is shuffled (3+ options) so the right answer is never in a predictable place; els stay indexed by the original option
  const order = opts.map((_, i) => i); if (opts.length > 2) for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  let pick = null; const els = opts.map((t, i) => { const b = h('button', { class: 'tile', type: 'button' }); b.append(h('span', { html: fm(t) })); b.onclick = () => { if (pick == null) { pick = i; SFX.click(); buzz(12); } }; return b; });
  order.forEach((i, k) => { if (opts.length !== 2) els[i].insertAdjacentHTML('afterbegin', SHAPES[k] || ''); tiles.append(els[i]); });
  gsap.from(els, { scale: 0.5, opacity: 0, rotate: () => gsap.utils.random(-8, 8), duration: 0.4, stagger: 0.07, ease: 'back.out(2.2)' });
  const t0 = T; const rt = runTimer(tm, time, t0, true);
  if (AUTO) setTimeout(() => { pick = autoPickWrong() ? (correct + 1) % opts.length : correct; }, 20);
  await waitFor(() => rt.step() || pick != null); guard(g);
  const tUsed = T - t0; rt.kill(); tm.el.remove(); asked++; els.forEach((b, i) => { b.disabled = true; if (i !== pick) b.classList.add('dim'); }); if (pick != null) gsap.fromTo(els[pick], { scale: 1.08 }, { scale: 1, duration: 0.3 });
  if (pick != null || !AUTO) { SFX.roll(); await wait(0.45); guard(g); }
  return { pick, t: tUsed, time, ok: pick === correct, el: els[correct], reveal() { els.forEach((b, i) => { b.classList.toggle('dim', i !== correct && i !== pick); b.classList.toggle('win', i === correct); if (i === pick && i !== correct) { b.classList.add('wrong'); FX.wob(b); } }); els.forEach((b, i) => { if (i !== correct && i !== pick) b.remove(); }); gsap.fromTo(els[correct], { scale: 0.9 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' }); } };
}
const tf = (q, a, labels = ['True', 'False'], time = 15) => kahoot(q, labels, a ? 0 : 1, time);
/* chips → build a set. ans = array of pool labels. Empty answer = φ. One retry. */
async function pickSet(q, pool, ans, { time = 45, brace = true, single = false, hint = '' } = {}) {
  const g = GEN; const qEl = H('p', 'q', q); const tm = timerEl(time); const out = h('div', { class: 'pickout' }); const chips = h('div', { class: 'chips' }); const lock = h('button', { class: 'btn primary', type: 'button' }, 'Lock in ✓');
  const box = h('div', { class: 'pick' }, qEl, tm.el, out, chips, h('div', { class: 'row' }, lock)); sheet.append(box);
  const on = new Set(); const want = new Set(ans);
  const render = () => { const sel = pool.filter((p) => on.has(p)); out.innerHTML = sel.length ? (brace ? '{ ' : '') + sel.map(fm).join(', ') + (brace ? ' }' : '') : '<i>' + (brace ? 'φ  (empty set — tap chips to add)' : 'tap to choose') + '</i>'; };
  const els = pool.map((p) => { const b = h('button', { class: 'chip', type: 'button', html: fm(p) }); b.onclick = () => { if (b.classList.contains('lock')) return; if (single) { on.clear(); els.forEach((x) => x.classList.remove('on')); } on.has(p) ? on.delete(p) : on.add(p); b.classList.toggle('on', on.has(p)); SFX.key(); buzz(6); gsap.fromTo(b, { scale: 0.85 }, { scale: 1, duration: 0.25, ease: 'back.out(3)' }); render(); }; chips.append(b); return b; });
  render(); gsap.from(els, { scale: 0, duration: 0.3, stagger: 0.02, ease: 'back.out(2)' });
  const t0 = T; const rt = runTimer(tm, time, t0, false); let tries = 0, done = false, ok = false; let locked = false; lock.onclick = () => { locked = true; SFX.click(); };
  const same = () => on.size === want.size && [...want].every((x) => on.has(x));
  if (AUTO) setTimeout(() => { on.clear(); (autoPickWrong() ? ans.slice(1) : ans).forEach((x) => on.add(x)); els.forEach((b, i) => b.classList.toggle('on', on.has(pool[i]))); render(); locked = true; }, 20);
  while (!done) {
    await waitFor(() => { rt.step(); return locked; }); guard(g); locked = false; tries++;
    if (same()) { ok = true; done = true; }
    else if (tries === 1 && !AUTO) { FX.wob(out); SFX.boing(); buzz([20, 40, 20]); kimReact('no'); const wrongN = [...on].filter((x) => !want.has(x)).length, missN = [...want].filter((x) => !on.has(x)).length; const hn = H('div', 'hint', 'Not yet! ' + (wrongN ? wrongN + ' chip' + (wrongN > 1 ? 's' : '') + ' should not be there. ' : '') + (missN ? missN + ' missing. ' : '') + (hint || 'One more try (half points).')); box.insertBefore(hn, box.lastChild); }
    else done = true;
  }
  rt.kill(); tm.el.remove(); asked++; const tUsed = T - t0; lock.remove();
  return { ok, t: tUsed, time, mult: tries > 1 ? 0.5 : 1, el: out, reveal() { els.forEach((b, i) => { const p = pool[i]; b.classList.add('lock'); b.classList.remove('on'); if (want.has(p) && on.has(p)) b.classList.add('ok'); else if (want.has(p)) b.classList.add('miss'); else if (on.has(p)) b.classList.add('bad'); else b.style.opacity = 0.3; }); const sel = pool.filter((p) => want.has(p)); out.innerHTML = sel.length ? (brace ? '{ ' : '') + sel.map(fm).join(', ') + (brace ? ' }' : '') : 'φ'; gsap.fromTo(out, { scale: 1.06 }, { scale: 1, duration: 0.3 }); } };
}
/* keypad fields. specs = [{l:'x', a:2, tol, pre, post}] */
async function fields(q, specs, { time = 60, keys = '' } = {}) {
  const g = GEN; const qEl = H('p', 'q', q); const tm = timerEl(time);
  const vals = specs.map(() => ''); let cur = 0; const fEls = specs.map((s, i) => { const v = h('span'); const f = h('div', { class: 'field', role: 'textbox', tabindex: 0 }, s.l ? h('small', { html: fm(s.l + ' =') }) : null, s.pre ? h('small', { html: fm(s.pre) }) : null, v, h('span', { class: 'caret' }), s.post ? h('small', { html: fm(s.post) }) : null); f.onclick = () => { cur = i; paint(); SFX.key(); }; f._v = v; return f; });
  const paint = () => fEls.forEach((f, i) => { f.classList.toggle('focus', i === cur); f.querySelector('.caret').style.display = i === cur ? '' : 'none'; f._v.textContent = vals[i]; });
  const KS = ['1', '2', '3', '4', '5', '⌫', '6', '7', '8', '9', '0', 'OK', '−', '.', '/', ...keys.split(' ').filter(Boolean)];
  while (KS.length % 6) KS.push('');
  let sub = false, tries = 0, done = false, ok = false;
  const press = (k) => { if (!k) return; SFX.key(); buzz(5); if (k === 'OK') { sub = true; return; } if (k === '⌫') vals[cur] = vals[cur].slice(0, -1); else if (vals[cur].length < 14) vals[cur] += k; paint(); };
  const keysEl = h('div', { class: 'keys' }, ...KS.map((k) => { const b = h('button', { class: 'key' + (k === 'OK' ? ' ok' : /[0-9]/.test(k) ? '' : ' fn'), type: 'button' }, k); if (!k) b.style.visibility = 'hidden'; b.onclick = () => press(k); return b; }));
  const box = h('div', { class: 'numq' }, qEl, tm.el, h('div', { class: 'fields' }, ...fEls), keysEl); sheet.append(box); paint();
  const onKey = (e) => { if (!box.isConnected) return; const m = { '-': '−', Backspace: '⌫', Enter: 'OK', p: 'π', '*': '×' }; let k = m[e.key] || e.key; if (k === 'Tab') { cur = (cur + 1) % fEls.length; paint(); e.preventDefault(); return; } if (KS.includes(k) && k) { press(k); e.preventDefault(); e.stopPropagation(); } };
  addEventListener('keydown', onKey, true);
  const t0 = T; const rt = runTimer(tm, time, t0, false);
  const check = () => specs.map((s, i) => { const u = evalExpr(vals[i]), a = evalExpr(s.a); const tol = s.tol != null ? s.tol : 1e-6 * Math.max(1, Math.abs(a)); return isFinite(u) && Math.abs(u - a) <= tol; });
  if (AUTO) setTimeout(() => { specs.forEach((s, i) => (vals[i] = autoPickWrong() ? '0' : (() => { const t = String(s.show || s.a).replace(/−/g, '-'); return Math.abs(evalExpr(t) - evalExpr(s.a)) <= (s.tol != null ? s.tol : 1e-6 * Math.max(1, Math.abs(evalExpr(s.a)))) ? t : String(evalExpr(s.a)); })())); paint(); sub = true; }, 20);
  while (!done) {
    await waitFor(() => { rt.step(); return sub; }); guard(g); sub = false;
    const res = check(); if (vals.some((v) => !v)) { FX.wob(box.querySelector('.fields')); continue; } tries++;
    if (res.every(Boolean)) { ok = true; done = true; }
    else if (tries === 1 && !AUTO) { res.forEach((r, i) => fEls[i].classList.toggle('bad', !r)); FX.wob(box.querySelector('.fields')); SFX.boing(); buzz([20, 40, 20]); kimReact('no'); box.insertBefore(H('div', 'hint', (specs[0].hint || 'Close? Check your working once more.') + ' One more try (half points).'), keysEl); }
    else done = true;
  }
  removeEventListener('keydown', onKey, true); rt.kill(); tm.el.remove(); asked++; keysEl.remove();
  return { ok, t: T - t0, time, mult: tries > 1 ? 0.5 : 1, el: box, reveal() { fEls.forEach((f, i) => { f.classList.remove('bad', 'focus'); f.querySelector('.caret').style.display = 'none'; f.classList.add('ok'); f._v.innerHTML = fm(String(specs[i].show != null ? specs[i].show : specs[i].a)); }); } };
}
const num = (q, a, o = {}) => fields(q, [{ l: o.l, a, tol: o.tol, show: o.show, pre: o.pre, post: o.post, hint: o.hint }], o);
/* tap the steps in the right order */
async function order(q, steps, { time = 60 } = {}) {
  const g = GEN; const qEl = H('p', 'q', q); const tm = timerEl(time); const list = h('div', { class: 'olist' }); sheet.append(h('div', { class: 'kq' }, qEl, tm.el, list));
  const sh = shuffle(steps.map((s, i) => i)); let next = 0, miss = 0;
  const els = sh.map((i) => { const b = h('button', { class: 'ostep', type: 'button' }, h('i', null, ''), h('span', { html: fm(steps[i]) })); b.onclick = () => { if (b.classList.contains('set')) return; if (i === next) { b.classList.add('set'); b.querySelector('i').textContent = ++next; SFX.snap(); buzz(10); list.append(b); gsap.fromTo(b, { x: 20 }, { x: 0, duration: 0.25 }); } else { miss++; FX.wob(b); SFX.boing(); buzz([15, 30, 15]); } }; list.append(b); return b; });
  gsap.from(els, { x: -20, opacity: 0, stagger: 0.06, duration: 0.3 });
  const t0 = T; const rt = runTimer(tm, time, t0, false);
  if (AUTO) { const go = () => { const b = els.find((e, k) => sh[k] === next); if (b) { b.click(); setTimeout(go, 5); } }; setTimeout(go, 20); }
  await waitFor(() => { rt.step(); return next === steps.length; }); guard(g); rt.kill(); tm.el.remove(); asked++;
  return { ok: miss === 0, t: T - t0, time, mult: miss === 0 ? 1 : miss === 1 ? 0.6 : 0.3, el: list, miss, reveal() { } };
}
/* tap a left item, then its partner on the right */
async function match(q, Lt, Rt, ans, { time = 60 } = {}) {
  const g = GEN; const qEl = H('p', 'q', q); const tm = timerEl(time); const lc = h('div', { class: 'mcol' }), rc = h('div', { class: 'mcol' }); const lock = h('button', { class: 'btn primary', type: 'button' }, 'Lock in ✓'); lock.disabled = true;
  sheet.append(h('div', { class: 'kq' }, qEl, tm.el, h('div', { class: 'mgrid' }, lc, rc), h('div', { class: 'row' }, lock)));
  const pair = Lt.map(() => -1); let sel = -1;
  const lEls = Lt.map((t, i) => { const b = h('button', { class: 'mi', type: 'button', html: fm(t) }); b.onclick = () => { sel = i; SFX.key(); paint(); }; lc.append(b); return b; });
  const rEls = Rt.map((t, j) => { const b = h('button', { class: 'mi', type: 'button', html: fm(t) }); b.onclick = () => { if (sel < 0) { FX.wob(b); return; } for (let k = 0; k < pair.length; k++) if (pair[k] === j) pair[k] = -1; pair[sel] = j; sel = -1; SFX.snap(); buzz(8); paint(); }; rc.append(b); return b; });
  const paint = () => { lEls.forEach((b, i) => { b.className = 'mi' + (pair[i] >= 0 ? ' p' + i : '') + (sel === i ? ' sel' : ''); }); rEls.forEach((b, j) => { const i = pair.indexOf(j); b.className = 'mi' + (i >= 0 ? ' p' + i : ''); }); lock.disabled = pair.some((p) => p < 0); };
  let locked = false; lock.onclick = () => (locked = true);
  const t0 = T; const rt = runTimer(tm, time, t0, false);
  if (AUTO) setTimeout(() => { ans.forEach((j, i) => (pair[i] = j)); paint(); locked = true; }, 20);
  await waitFor(() => { rt.step(); return locked; }); guard(g); rt.kill(); tm.el.remove(); lock.remove(); asked++;
  const nOk = pair.filter((p, i) => p === ans[i]).length;
  return { ok: nOk === ans.length, t: T - t0, time, mult: nOk / ans.length, el: lc.parentNode, reveal() { ans.forEach((j, i) => (pair[i] = j)); sel = -1; paint(); lEls.concat(rEls).forEach((b) => (b.disabled = true)); } };
}
async function verdict(res, yes, no) {
  res.reveal(); const g = GEN;
  let pts = 0;
  if (res.ok || (res.mult && res.mult >= 0.5 && res.ok !== false)) { }
  if (res.ok) { streak++; right++; best = Math.max(best, streak); pts = ptsFor(res.t || 0, res.time || 20, res.mult || 1) + Math.min(500, 100 * (streak - 1)); score += pts; SFX.win(); if (streak >= 2) setTimeout(() => SFX.combo(streak), 250); buzz(25); kimReact('ok'); FX.burst(streak >= 3 ? 'COMBO ×' + streak : pickOne(ONO_OK), { x: 32 + Math.random() * 20, y: 30 + Math.random() * 15, fill: streak >= 3 ? C.kin : C.beni }); FX.lines(streak >= 3); FX.sparkle(res.el); }
  else { streak = 0; SFX.lose(); buzz([40, 60, 40]); kimReact('no'); FX.ono(pickOne(ONO_NO), { x: 30 + Math.random() * 30, y: 30, red: true, rot: -6 }); FX.shake(); }
  const st = $('#streak b'); st.textContent = streak; gsap.fromTo(st, { scale: 2 }, { scale: 1, duration: 0.4, ease: 'back.out(3)' });
  const v = h('div', { class: 'verdict ' + (res.ok ? 'ok' : 'no') }, ava(res.ok ? 'jess' : 'kimmy', res.ok ? 'happy' : 'wrong'), h('div', null, h('b', null, res.ok ? (streak >= 3 ? 'ON FIRE ×' + streak : res.mult && res.mult < 1 ? 'GOT IT!' : 'NAILED IT') : res.pick === null && res.time && res.t >= res.time ? 'TIME!' : 'PLOT TWIST'), h('span', { html: fm(res.ok ? yes : no) })), pts ? h('span', { class: 'pts' }, '+' + pts) : null);
  sheet.append(v); gsap.from(v, { y: 20, opacity: 0, duration: 0.35, ease: 'back.out(2)' });
  if (pts) FX.pts(pts, v);
  if (W.onVerdict) W.onVerdict(res.ok);
  await wait(0.2); guard(g);
}
async function summary(cards) {
  const g = GEN; SFX.fanfare(); await slam('LESSON CLEAR', right + ' of ' + asked + ' right · ' + score + ' pts', 1.1); guard(g);
  const s = h('div', { class: 'sum' }); sheet.append(s);
  const els = cards.map((c) => h('div', { class: 'card' + (c.eq ? ' eq' : ''), html: fm(c.t || c) })); s.append(...els);
  gsap.from(els, { x: -30, opacity: 0, stagger: 0.18, duration: 0.4, ease: 'back.out(2)' });
}
function propCards(list) {
  const box = h('div', { class: 'props' }); sheet.append(box);
  const els = list.map(([t, d, tag]) => h('div', { class: 'prop' }, tag ? h('span', { class: 'ptag', html: fm(tag) }) : null, h('b', { html: fm(t) }), d ? h('span', { html: fm(d) }) : null));
  box.append(...els); gsap.from(els, { x: -24, opacity: 0, stagger: 0.25, duration: 0.4, ease: 'back.out(2)' });
  return box;
}
function solution(lines, title = 'Solution', cls = '') {
  const el = h('div', { class: 'sol ' + cls }, h('div', { class: 'stitle' }, title), ...lines.map((t) => h('div', { class: 'srow', html: fm(t) })));
  sheet.append(el); gsap.from(el.querySelectorAll('.srow'), { y: 10, opacity: 0, stagger: 0.18, duration: 0.3 });
  return el;
}
const model = (lines) => solution(lines, 'Write this in the exam', 'model');

/* =========================================================
   NO-SCROLL FIT
   ========================================================= */
function isKeep(el) {
  if (el.matches('.sum, .result, .rank, .btn.go, .props:last-child, .sol:last-child, .exh, .qq:last-of-type')) return true;
  if (el.classList.contains('todo') && !el.classList.contains('done')) return true;
  if (el.matches('button:not(:disabled), .ctl') || el.querySelector('button:not(:disabled), input[type=range]')) return true;
  return false;
}
function fit() {
  if (!sheet.isConnected || !sheet.clientHeight) return;
  const over = () => sheet.scrollHeight > sheet.clientHeight + 2;
  let n = 0;
  while (over() && n++ < 30) { const kids = [...sheet.children]; let v = kids.slice(0, -1).find((k) => !isKeep(k)); if (!v) v = kids.slice(0, -1).find((k) => k.matches('.exh, .qq') && sheet.querySelector('.kq, .pick, .numq')); if (!v) break; v.remove(); }
  if (over()) sheet.classList.add('dense');
  if (over()) sheet.classList.add('dense2');
}
let fitQ = 0; function fitSoon() { if (fitQ) return; fitQ = requestAnimationFrame(() => { fitQ = 0; fit(); }); }
new MutationObserver(fitSoon).observe(sheet, { childList: true, subtree: true, characterData: true });
addEventListener('resize', fitSoon);
if ('ResizeObserver' in window) new ResizeObserver(() => { resize(); fitSoon(); }).observe($('#stage'));

/* =========================================================
   SCENES: any lesson / question can borrow a scene
   ========================================================= */
const LESSONS = [];
const MINI = {};
function sceneObj(name) { return MINI[name] || LESSONS.find((l) => l.id === name); }
function enterScene(name, setup) {
  const S = sceneObj(name); if (!S) throw new Error('no scene ' + name);
  W = { __scene: S, cam: { x: 0, y: 0, z: 1, shake: 0 } }; VIEW = S.view; gsap.set('#slam', { opacity: 0 }); live(null); hideFoundNow();
  S.init(W); if (setup) setup(W); resize();
}
function hideFoundNow() { $('#found').style.display = 'none'; }
/* default scene: a manga panel with the two of them */
MINI.board = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { tag: W.tag || '', sub: W.sub || '', k: 0, kimCorner: false }); gsap.to(W, { k: 1, duration: 0.6, ease: 'back.out(2)' }); },
  draw(W) {
    ctx.save(); ctx.strokeStyle = C.tone; ctx.lineWidth = 1; for (let i = -20; i < 40; i++) { ctx.beginPath(); ctx.moveTo(SW / 2, SH * 0.45); ctx.lineTo(SW / 2 + Math.cos(i / 6) * SW, SH * 0.45 + Math.sin(i / 6) * SW); ctx.stroke(); } ctx.restore();
    const hp = Math.min(SH * 0.8, 260); D.sprite('jess-body', SW * 0.24, SH - 6, hp * W.k); D.sprite(KIM.mood, SW * 0.76, SH - 6 - KIM.j * 20, hp * 0.55 * W.k);
    if (W.tag) { ctx.save(); ctx.translate(SW / 2, SH * 0.36); ctx.rotate(-0.05); ctx.scale(W.k, W.k); D.star(0, 0, Math.min(SW, SH) * 0.3, 16, C.panel); D.text(W.tag, 0, 8, { size: clamp(SW / 12, 22, 44), w: 800, disp: true, col: C.beni, stroke: C.ink }); if (W.sub) D.text(W.sub, 0, 34, { size: 13, w: 700 }); ctx.restore(); }
  },
};

/* =========================================================
   EXERCISE RUNNER — every textbook question becomes a short sequence of parts
   E = { id:'1.1-2', ex:'Ex 1.1', n:'Q2 (iii)', q:'question text', scene, setup(W), kim?, say?, parts:[...], w:[model answer] }
   part = { k:'mcq'|'tf'|'pick'|'num'|'fields'|'order'|'match'|'task'|'say'|'run', ...}
   ========================================================= */
async function ask(p) {
  const tm = p.time;
  if (p.k === 'mcq') return kahoot(p.q, p.o, p.a, tm || 25);
  if (p.k === 'tf') return kahoot(p.q, p.o || ['True', 'False'], p.o ? p.a : p.a ? 0 : 1, tm || 18);
  if (p.k === 'pick') return pickSet(p.q, p.pool, p.a, { time: tm || 45, brace: p.brace !== false, single: p.single, hint: p.hint });
  if (p.k === 'num') return num(p.q, p.a, { time: tm || 60, tol: p.tol, show: p.show, l: p.l, keys: p.keys, pre: p.pre, post: p.post, hint: p.hint });
  if (p.k === 'fields') return fields(p.q, p.f, { time: tm || 75, keys: p.keys });
  if (p.k === 'order') return order(p.q, p.s, { time: tm || 75 });
  if (p.k === 'match') return match(p.q, p.L, p.R, p.a, { time: tm || 60 });
  if (p.k === 'task') { // sim interaction graded by check(W)
    const g = GEN; const qEl = H('p', 'q', p.q); sheet.append(qEl); const t0 = T; const td = todo(p.todo || 'Do it on the stage, then lock in.');
    const lock = button('Lock in ✓', 'btn primary'); lock.calm();
    if (AUTO && p.auto) setTimeout(() => { if (!autoPickWrong()) p.auto(W); }, 10);
    let tries = 0, ok = false;
    for (;;) { await waitFor(() => lock.hits > tries); guard(g); tries++; ok = !!p.check(W); if (ok || tries >= 2 || AUTO) break; FX.wob(lock.el); SFX.boing(); kimReact('no'); sheet.insertBefore(H('div', 'hint', (p.hint || 'Not quite.') + ' One more try (half points).'), lock.el.parentNode); }
    lock.stop(); lock.el.parentNode.remove(); td.done(); asked++;
    return { ok, t: T - t0, time: 60, mult: tries > 1 ? 0.5 : 1, el: qEl, reveal() { if (!ok && p.reveal) p.reveal(W); } };
  }
  throw new Error('unknown part ' + p.k);
}
function qStep(E) {
  return async function () {
    const g = GEN;
    enterScene(E.scene || 'board', E.setup || ((W) => { W.tag = E.n; W.sub = E.ex; }));
    sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' + (E.ex && E.ex.startsWith('Ex') ? ' ex' : '') }, E.ex || 'Example'), h('span', { class: 'ychip' }, E.n), E.tag ? h('span', { class: 'ychip' }, E.tag) : null));
    if (E.say) await J(E.say[0] || 'think', E.say[1]); guard(g);
    sheet.append(H('div', 'qq', E.q));
    if (E.kim) { await K('think', E.kim); guard(g); }
    if (E.intro) { await E.intro(W); guard(g); }
    if (!E.noSolve) { await cont(E.parts.length > 1 ? 'Solve it · ' + E.parts.length + ' steps' : 'Solve it'); guard(g); }
    for (const [i, p] of E.parts.entries()) {
      if (p.pre) { await p.pre(W); guard(g); }
      if (p.k === 'say') { await say(p.who || 'jess', p.m || 'idle', p.t); guard(g); continue; }
      if (p.k === 'run') { await p.run(W); guard(g); continue; }
      const r = await ask(p); guard(g);
      if (p.act) { await p.act(W, r); guard(g); }
      await verdict(r, p.x || 'Correct.', p.no || ('Answer: ' + answerText(p) + '. ' + (p.x || ''))); guard(g);
      if (p.post2) { await p.post2(W, r); guard(g); }
      if (i < E.parts.length - 1) { await cont('Next step'); guard(g); }
    }
    if (E.w) model(E.w);
    if (E.outro) { await E.outro(W); guard(g); }
    await cont('Next'); guard(g);
  };
}
function answerText(p) {
  if (p.k === 'mcq') return plain(p.o[p.a]);
  if (p.k === 'tf') return p.o ? plain(p.o[p.a]) : p.a ? 'True' : 'False';
  if (p.k === 'pick') return p.a.length ? (p.brace === false ? p.a.map(plain).join(', ') : '{ ' + p.a.map(plain).join(', ') + ' }') : 'φ';
  if (p.k === 'num') return plain(String(p.show != null ? p.show : p.a));
  if (p.k === 'fields') return p.f.map((f) => (f.l ? f.l + ' = ' : '') + plain(String(f.show != null ? f.show : f.a))).join(', ');
  if (p.k === 'order' || p.k === 'match') return 'see the highlighted order';
  return 'see the stage';
}
/* an exercise lesson from a list of questions */
function exLesson({ id, title, blurb, face = 'kimmy-lookup', qs, intro }) {
  const steps = [async function () {
    enterScene('board', (W) => { W.tag = title.replace('Exercise ', 'EX '); W.sub = qs.length + ' questions'; });
    await slam(title.toUpperCase(), qs.length + ' questions · every part as a sim', 0.9);
    if (intro) await intro(); else { await K('play', 'Exercise time! Do I get points?'); await J('happy', 'Speed points like Kahoot, streak bonus, and every question opens its own simulation. Tap any bar at the top to jump.'); }
    await cont('Start');
  }, ...qs.map(qStep), async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = title; }); await summary([title + ' complete', 'Best streak: ' + best, 'Accuracy: ' + (asked ? Math.round((100 * right) / asked) : 0) + '%']); }];
  return { id, title, blurb, face, kind: 'ex', view: MINI.board.view, init: MINI.board.init, draw: MINI.board.draw, steps, qN: qs.length, qs };
}

/* =========================================================
   PLAYER: chapter map ↔ lesson runner
   ========================================================= */
const progress = Store.get('progress', {});
const mapEl = $('#map'), playerEl = $('#player'), segs = $('#segs');
const starsOf = (p) => (!p || !p.asked ? 0 : p.right / p.asked >= 0.9 ? 3 : p.right / p.asked >= 0.7 ? 2 : p.right / p.asked >= 0.4 ? 1 : 0);
function renderMap() {
  const path = $('#path'); path.innerHTML = '';
  const n = LESSONS.length; const cols = innerWidth < 640 ? 3 : n > 12 ? 5 : 4; path.style.setProperty('--cols', cols);
  const doneN = LESSONS.filter((l) => progress[l.id] && progress[l.id].done).length;
  $('#mapProg').textContent = doneN + ' of ' + n + ' cleared';
  const xp = LESSONS.reduce((s, l) => s + ((progress[l.id] && progress[l.id].best) || 0), 0); $('#mapXp').textContent = xp ? '★ ' + xp.toLocaleString() + ' pts' : '';
  const next = LESSONS.find((l) => !(progress[l.id] && progress[l.id].done));
  LESSONS.forEach((l) => {
    const p = progress[l.id]; const done = p && p.done; const isNext = next && next.id === l.id; const st = starsOf(p);
    const node = h('button', { class: 'node' + (l.kind === 'ex' ? ' ex' : '') + (done ? ' done' : '') + (isNext ? ' next' : ''), type: 'button', 'aria-label': l.title },
      h('div', { class: 'disc' }, h('img', { src: 'm/' + l.face + '.png', alt: '' }), h('span', { class: 'n' }, done ? '✓' : l.kind === 'ex' ? l.short || 'EX' : String(l.num)), st ? h('span', { class: 'stars' }, '★'.repeat(st)) : null),
      h('div', { class: 'meta' }, h('div', { class: 'k' }, (l.kind === 'ex' ? (l.qN + ' Qs') : 'Lesson ' + l.num) + (isNext ? ' · next' : p && p.at && !done ? ' · resume' : '')), h('b', null, l.title), h('div', { class: 'cap' }, l.blurb)));
    node.onclick = () => { SFX.pop(); buzz(10); play(l); };
    path.append(node);
  });
  if (!RM) gsap.from('#path .node', { y: 24, opacity: 0, stagger: 0.04, duration: 0.4, ease: 'back.out(1.8)' });
}
function showMap() { GEN++; playerEl.classList.remove('tall'); for (const w of waits.splice(0)) w.rej(new Stop()); L = null; live(null); playerEl.hidden = true; mapEl.hidden = false; renderMap(); history.replaceState(null, '', location.pathname + location.search); }
function play(lesson, at) {
  GEN++; gsap.globalTimeline.getChildren().forEach((t) => t.kill()); fxEl.innerHTML = '';
  mapEl.hidden = true; playerEl.hidden = false;
  W = { cam: { x: 0, y: 0, z: 1, shake: 0 } }; L = lesson; VIEW = lesson.view; streak = 0; right = 0; asked = 0; best = 0; found = []; score = 0; shownScore = 0;
  playerEl.classList.toggle('tall', lesson.kind === 'ex');
  $('#streak b').textContent = '0'; $('#score b').textContent = '0'; hideFoundNow(); $('#slam').style.opacity = 0; gsap.set(sheet, { x: 0, opacity: 1 }); sheet.innerHTML = '';
  $('#ltitle').textContent = (lesson.kind === 'ex' ? '' : lesson.num + ' · ') + lesson.title;
  lesson.init(W); resize();
  segs.innerHTML = ''; segs.classList.toggle('many', lesson.steps.length > 24); lesson.steps.forEach((s, i) => { const b = h('button', { class: 'seg', type: 'button', 'aria-label': 'Jump to step ' + (i + 1) }, h('i')); b.onclick = () => { if (L !== lesson) return; SFX.whoosh(); jump(i); }; segs.append(b); });
  history.replaceState(null, '', '#' + lesson.id);
  const p = progress[lesson.id]; const start = at != null ? at : 0;
  if (at == null && p && p.at && !p.done && !AUTO) return resumeAsk(lesson, p.at);
  run(start).catch(stopOK);
}
async function resumeAsk(lesson, at) {
  const g = GEN; enterScene('board', (W) => { W.tag = 'WELCOME BACK'; W.sub = lesson.title; });
  await K('happy', 'You stopped at step ' + (at + 1) + ' of ' + lesson.steps.length + ' last time.');
  const r = row(); const a = h('button', { class: 'btn primary', type: 'button' }, 'Resume step ' + (at + 1)), b = h('button', { class: 'btn', type: 'button' }, 'Start over'); r.append(a, b);
  let pick = -1; a.onclick = () => (pick = at); b.onclick = () => (pick = 0); await waitFor(() => pick >= 0); guard(g); SFX.pop(); jump(pick);
}
function jump(i) { const l = L; GEN++; for (const w of waits.splice(0)) w.rej(new Stop()); fxEl.innerHTML = ''; W = { cam: { x: 0, y: 0, z: 1, shake: 0 } }; VIEW = l.view; l.init(W); resize(); hideFoundNow(); gsap.set('#slam', { opacity: 0 }); live(null); run(i).catch(stopOK); }
const stopOK = (e) => { if (!(e instanceof Stop)) { console.error(e); window.__errs = (window.__errs || []).concat(String(e && e.stack || e)); } };
async function run(i) {
  const g = GEN; const L0 = L;
  [...segs.children].forEach((s, k) => { s.classList.toggle('now', k === i); gsap.to(s.firstChild, { scaleX: k < i ? 1 : k === i ? 0.35 : 0, duration: 0.4 }); });
  if (i > 0 || sheet.children.length) await newCard(); guard(g);
  if (i > 0) { progress[L0.id] = Object.assign(progress[L0.id] || {}, { at: i }); Store.set('progress', progress); }
  await L0.steps[i](); guard(g);
  gsap.to(segs.children[i].firstChild, { scaleX: 1, duration: 0.3 });
  if (i + 1 < L0.steps.length) return run(i + 1);
  const prev = progress[L0.id] || {};
  progress[L0.id] = { done: true, right: Math.max(right, prev.right || 0), asked: Math.max(asked, prev.asked || 0), best: Math.max(score, prev.best || 0), at: 0 }; Store.set('progress', progress);
  const all = GStore.get('chapters', {}); all[CH.n] = { done: LESSONS.filter((l) => progress[l.id] && progress[l.id].done).length, total: LESSONS.length, pts: LESSONS.reduce((s, l) => s + ((progress[l.id] && progress[l.id].best) || 0), 0) }; GStore.set('chapters', all);
  const acc = asked ? Math.round((100 * right) / asked) : 100; const ghost = Math.round(asked * 720);
  if (asked) {
    sheet.append(h('div', { class: 'result' }, h('div', null, h('b', null, score.toLocaleString()), h('small', null, 'points')), h('div', null, h('b', null, acc + '%'), h('small', null, 'accuracy')), h('div', null, h('b', null, '×' + best), h('small', null, 'best streak'))));
    sheet.append(h('div', { class: 'rank' }, score >= ghost ? '🏆 You beat Kimmy’s ' + ghost.toLocaleString() + ' pts!' : 'Kimmy scored ' + ghost.toLocaleString() + '. Replay to beat her!'));
  }
  const nx = LESSONS[LESSONS.indexOf(L0) + 1]; const r = row();
  const again = h('button', { class: 'btn', type: 'button' }, 'Replay'); again.onclick = () => play(L0, 0);
  const map = h('button', { class: 'btn', type: 'button' }, 'Map'); map.onclick = showMap;
  r.classList.add('endrow'); r.append(again, map);
  if (nx) { const b = h('button', { class: 'btn primary nextb', type: 'button' }, 'Next: ' + nx.title + ' →'); b.onclick = () => play(nx, 0); r.append(b); }
  gsap.from(r.children, { y: 16, opacity: 0, stagger: 0.08, duration: 0.35, ease: 'back.out(2)' });
  window.__done = (window.__done || 0) + 1;
}

/* frame loop */
function frame(t) {
  const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; T += AUTO ? dt * 20 : dt;
  if (L && !playerEl.hidden) {
    if (!SW) resize();
    const S = W.__scene || L;
    if (S.tick) S.tick(W, dt);
    ctx.fillStyle = C.paper; ctx.fillRect(0, 0, SW, SH);
    try { S.draw(W, dt); if (W.overlay) W.overlay(W); drawKim(); D.hand(W.hand); } catch (e) { if (!frame._e) { frame._e = 1; console.error(e); window.__errs = (window.__errs || []).concat('draw: ' + e.stack); } }
  }
  tickWaits(); requestAnimationFrame(frame);
}

/* boot: called at the end of each chapter page */
function boot() {
  LESSONS.forEach((l, i) => { l.num = LESSONS.filter((x, k) => k <= i && x.kind !== 'ex').length; });
  $('#back').onclick = () => { SFX.pop(); showMap(); };
  const setSnd = () => document.querySelectorAll('.snd').forEach((x) => { x.setAttribute('aria-pressed', !muted); x.textContent = muted ? '🔇 Sound' : '🔊 Sound'; });
  setSnd(); for (const b of document.querySelectorAll('.snd')) b.onclick = () => { muted = !muted; GStore.set('muted', muted); setSnd(); SFX.pop(); };
  addEventListener('keydown', (e) => { if (playerEl.hidden) return; if (e.key === 'Enter') { const b = sheet.querySelector('.btn.go'); if (b) b.click(); } if (['1', '2', '3', '4'].includes(e.key) && !sheet.querySelector('.numq')) { const t = sheet.querySelectorAll('.tile:not(:disabled)')[+e.key - 1]; if (t) t.click(); } });
  if (RM && window.gsap) gsap.globalTimeline.timeScale(4);
  if (AUTO && window.gsap) gsap.globalTimeline.timeScale(20);
  requestAnimationFrame(frame);
  if (!window.gsap) { mapEl.hidden = false; mapEl.innerHTML = '<p style="padding:24px">The animation library could not load. Check your connection and reload.</p>'; return; }
  const hash = location.hash.slice(1); const l = LESSONS.find((x) => x.id === hash); l ? play(l) : showMap();
}
window.addEventListener('error', (e) => { window.__errs = (window.__errs || []).concat(String(e.message)); });
/* concept lesson defaults: starts on the board scene, steps switch scenes as they go */
function lesson(o) { return Object.assign({ kind: 'learn', view: MINI.board.view, init: MINI.board.init, draw: MINI.board.draw }, o); }
/* quick kahoot + verdict */
async function quiz(q, opts, a, yes, no, time = 20) { const r = await kahoot(q, opts, a, time); await verdict(r, yes, no || 'Answer: ' + plain(opts[a]) + '. ' + yes); return r; }
async function pickQ(q, pool, ans, yes, o = {}) { const r = await pickSet(q, pool, ans, o); await verdict(r, yes, 'Answer: ' + (ans.length ? (o.brace === false ? ans.map(plain).join(', ') : '{' + ans.map(plain).join(', ') + '}') : 'φ') + '. ' + yes); return r; }
async function numQ(q, a, yes, o = {}) { const r = await num(q, a, o); await verdict(r, yes, 'Answer: ' + plain(String(o.show != null ? o.show : a)) + '. ' + yes); return r; }

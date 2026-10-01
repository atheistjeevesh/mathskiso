/* =========================================================
   CHAPTER 5 · LINEAR INEQUALITIES — simulations
   scale (balance that flips on ×negative), bars (marks / lengths), tank (mixtures), thermo (°C ↔ °F)
   number line comes from shared scenes (builder + integer dots)
   ========================================================= */
/* =============== SCALE: an inequality is a tipped balance =============== */
MINI.scale = {
  view: { w: 10, h: 6.2 },
  init(W) { Object.assign(W, { L: '5x − 3', R: '3x + 1', sign: '<', tilt: 0.16, flip: 0, wL: [], wR: [], op: '', opA: 0, kimCorner: true, kimX: 0.1 }); },
  draw(W) {
    const base = toS(0, -2.6), top = toS(0, 0.9); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(base[0] - 50, base[1]); ctx.lineTo(base[0] + 50, base[1]); ctx.lineTo(base[0] + 10, top[1]); ctx.lineTo(base[0] - 10, top[1]); ctx.closePath(); ctx.fill();
    const a = W.tilt * (1 - 2 * W.flip); const len = 3.6 * sc(); const ca = Math.cos(a), sa = Math.sin(a);
    const Lp = [top[0] - len * ca, top[1] + len * sa], Rp = [top[0] + len * ca, top[1] - len * sa];
    ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(...Lp); ctx.lineTo(...Rp); ctx.stroke(); ctx.lineCap = 'butt';
    ctx.beginPath(); ctx.arc(top[0], top[1], 9, 0, 7); ctx.fillStyle = C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
    const pan = (p, txt, ws, heavy) => { const hh = 1.25 * sc(); const py = p[1] + hh; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] - 1.25 * sc(), py); ctx.moveTo(p[0], p[1]); ctx.lineTo(p[0] + 1.25 * sc(), py); ctx.stroke();
      ctx.fillStyle = heavy ? C.sakura : C.panel; ctx.beginPath(); ctx.ellipse(p[0], py, 1.45 * sc(), 0.28 * sc(), 0, 0, Math.PI); ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke();
      ws.forEach((w, i) => { const wx = p[0] - 0.9 * sc() + (i % 4) * 0.6 * sc(), wy = py - 10 - Math.floor(i / 4) * 16 - (w.dy || 0) * sc(); ctx.globalAlpha = w.a == null ? 1 : w.a; ctx.fillStyle = C.kin; ctx.fillRect(wx - 10, wy - 12, 20, 14); ctx.strokeRect(wx - 10, wy - 12, 20, 14); ctx.fillStyle = C.ink; ctx.font = FONT(800, 9); ctx.textAlign = 'center'; ctx.fillText(w.t, wx, wy - 2); ctx.globalAlpha = 1; });
      const fs = clamp(SW / 26, 13, 22); ctx.font = FONT(800, fs, true); const tw2 = ctx.measureText(txt).width + 16; const by = py - 8 - (ws.length ? 34 : 0); ctx.fillStyle = heavy ? C.peach : C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.fillRect(p[0] - tw2 / 2, by - fs - 10, tw2, fs + 14); ctx.strokeRect(p[0] - tw2 / 2, by - fs - 10, tw2, fs + 14); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.fillText(txt, p[0], by - 6); };
    const lHeavy = a > 0.02, rHeavy = a < -0.02; pan(Lp, W.L, W.wL, lHeavy); pan(Rp, W.R, W.wR, rHeavy);
    const sp = toS(0, 1.9); ctx.save(); ctx.translate(sp[0], sp[1]); ctx.scale(1, Math.cos(W.flip * Math.PI) || 0.01); D.star(0, -6, 26, 10, W.flip > 0.02 && W.flip < 0.98 ? C.kin : C.panel); D.text(W.sign, 0, 4, { size: 26, w: 800, disp: true, col: C.beni }); ctx.restore();
    if (W.op && W.opA > 0) { ctx.save(); ctx.globalAlpha = W.opA; D.label(W.op, SW / 2, 22, C.ink, C['kin-tint'], 14); ctx.restore(); }
  },
};
const FLIPS = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
/* one step: op text, optional weights on both pans, new sides */
async function scaleStep(W, op, L2, R2, { neg = false, weight = '' } = {}) {
  W.op = op; gsap.fromTo(W, { opA: 0 }, { opA: 1, duration: 0.25 }); SFX.whoosh(); await wait(0.5);
  if (weight) { const a = { t: weight, a: 0, dy: 2 }, b = { t: weight, a: 0, dy: 2 }; W.wL.push(a); W.wR.push(b); gsap.to([a, b], { a: 1, dy: 0, duration: 0.4, ease: 'bounce.out' }); SFX.thud(); await wait(0.5); W.wL = []; W.wR = []; }
  if (neg) { SFX.flip(); FX.lines(true); FX.burst('FLIP!', { x: 50, y: 30, fill: C.kin }); buzz([30, 40, 30]); await tw(W, { flip: 1, duration: 0.6, ease: 'back.out(1.5)' }); W.sign = FLIPS[W.sign]; W.tilt = -W.tilt; W.flip = 0; shake(1); }
  W.L = L2; W.R = R2; SFX.snap(); await wait(0.4); gsap.to(W, { opA: 0, duration: 0.3 });
}

/* =============== BARS: test marks / lengths =============== */
MINI.bars = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { bars: [], line: null, max: 100, cap: '', kimCorner: true }); },
  draw(W) {
    const n = W.bars.length; if (!n) return; const x0 = -4.3, x1 = 3.4, y0 = -2.6, y1 = 2.3; const bw = (x1 - x0) / n; const yv = (v) => y0 + ((y1 - y0) * v) / W.max;
    D.line([[x0 - 0.1, y0], [x1 + 0.2, y0]], C.ink, 2.5); D.line([[x0 - 0.1, y0], [x0 - 0.1, y1 + 0.2]], C.ink, 2);
    for (let v = 0; v <= W.max; v += W.max / 5) { const p = toS(x0 - 0.1, yv(v)); D.text(fmtN(v, 1), p[0] - 6, p[1] + 4, { size: 11, w: 600, align: 'right', col: C['ink-muted'] }); }
    W.bars.forEach((b, i) => { const xa = x0 + i * bw + bw * 0.15, xb = x0 + (i + 1) * bw - bw * 0.15; D.rect(xa, y0, xb, yv(b.v), b.drag ? C.sakura : b.col || C['sora-tint']); const t = toS((xa + xb) / 2, yv(b.v)); D.text(fmtN(b.v, 1), t[0], t[1] - 6, { size: 14, w: 800, disp: true }); const l = toS((xa + xb) / 2, y0); D.text(b.lab, l[0], l[1] + 16, { size: 12, w: 700 }); if (b.drag) { ctx.beginPath(); ctx.arc(t[0], t[1] + 2, 9 + Math.sin(T * 6) * 2, 0, 7); ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.stroke(); } });
    if (W.line) { const p = toS(x0 - 0.1, yv(W.line.v)), q = toS(x1 + 0.3, yv(W.line.v)); ctx.setLineDash([8, 5]); ctx.strokeStyle = W.line.col || C.beni; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); ctx.setLineDash([]); D.text(W.line.t, q[0] + 4, q[1] + 4, { size: 12, w: 800, align: 'left', col: W.line.col || C.beni }); }
    if (W.avg != null) { const p = toS(x0 - 0.1, yv(W.avg)), q = toS(x1 + 0.3, yv(W.avg)); ctx.strokeStyle = C.sora; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); D.text('avg ' + fmtN(W.avg, 2), q[0] + 4, q[1] - 8, { size: 12, w: 800, align: 'left', col: C.sora }); }
    if (W.cap) D.text(W.cap, SW / 2, 20, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
function barDrag(W, b, { lo = 0, hi = 100, step = 1, onMove } = {}) { b.drag = true; const n = W.bars.length, i = W.bars.indexOf(b); const x0 = -4.3, x1 = 3.4, y0 = -2.6, y1 = 2.3; const bw = (x1 - x0) / n; W.drags = [{ get: () => [x0 + (i + 0.5) * bw, y0 + ((y1 - y0) * b.v) / W.max], r: 0.7, set: (x, y) => { const v = clamp(Math.round((((y - y0) / (y1 - y0)) * W.max) / step) * step, lo, hi); if (v !== b.v) { b.v = v; SFX.tick(); b.moved = (b.moved || 0) + 1; if (onMove) onMove(v); } } }]; }

/* =============== TANK: mixing solutions =============== */
MINI.tank = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { base: 600, pct0: 12, add: 0, pct1: 30, lo: 15, hi: 18, unit: 'litres', what: 'acid', kimCorner: true, kimX: 0.08 }); },
  conc(W) { return (W.base * W.pct0 + W.add * W.pct1) / (W.base + W.add); },
  draw(W) {
    const c = MINI.tank.conc(W); const tot = W.base + W.add; const cap = W.cap || Math.max(tot, W.base * 3.2);
    const x0 = -1.6, x1 = 1.6, y0 = -2.7, y1 = 2.2; D.rect(x0, y0, x1, y1, C.panel);
    const lv = y0 + ((y1 - y0) * tot) / cap; const mix = c / 50; const col = `rgba(200,16,46,${clamp(0.15 + mix, 0.15, 0.95)})`;
    D.rect(x0, y0, x1, lv, col, null); const wv = toS(x0, lv), wv2 = toS(x1, lv); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const xx = lerp(wv[0], wv2[0], i / 30); ctx.lineTo(xx, wv[1] + Math.sin(T * 3 + i) * 2); } ctx.stroke();
    D.rect(x0, y0, x1, y1, null, C.ink, 3);
    const p = toS(x1 + 0.3, 1.8); D.text(fmtN(c, 2) + '% ' + W.what, p[0], p[1], { size: 20, w: 800, disp: true, align: 'left', col: c > W.lo && c < W.hi ? C['matcha-deep'] : C.beni });
    D.text(fmtN(tot, 1) + ' ' + W.unit + ' total', p[0], p[1] + 24, { size: 13, w: 700, align: 'left' }); D.text('added: ' + fmtN(W.add, 1) + ' ' + W.unit, p[0], p[1] + 44, { size: 13, w: 700, align: 'left', col: C.sora });
    D.text('target: ' + W.lo + '% < mix < ' + W.hi + '%', p[0], p[1] + 70, { size: 13, w: 800, align: 'left', col: C['ink-muted'] });
    const q = toS(x0 - 0.2, y1); D.text(W.base + ' ' + W.unit + ' of ' + W.pct0 + '%', q[0], q[1] + 4, { size: 12, w: 700, align: 'right' }); D.text('+ x of ' + W.pct1 + '%', q[0], q[1] + 22, { size: 12, w: 700, align: 'right', col: C.sora });
  },
};

/* =============== THERMO: °C ↔ °F =============== */
MINI.thermo = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { cLo: 0, cHi: 40, band: null, kimCorner: true }); },
  draw(W) {
    const y0 = -2.5, y1 = 2.4; const yC = (c) => y0 + ((c - W.cLo) / (W.cHi - W.cLo)) * (y1 - y0);
    for (const [x, lab, f] of [[-1.6, '°C', (c) => c], [1.6, '°F', (c) => (9 * c) / 5 + 32]]) {
      D.rect(x - 0.3, y0, x + 0.3, y1, C.panel); if (W.band) D.rect(x - 0.3, yC(W.band[0]), x + 0.3, yC(W.band[1]), C.sakura, null);
      D.rect(x - 0.3, y0, x + 0.3, y1, null, C.ink, 2.5); D.circleW(x, y0 - 0.35, 0.45, C.beni);
      const t = toS(x, y1 + 0.3); D.text(lab, t[0], t[1], { size: 16, w: 800, disp: true });
      for (let c = W.cLo; c <= W.cHi + 1e-9; c += (W.cHi - W.cLo) / 8) { const p = toS(x + (x < 0 ? -0.35 : 0.35), yC(c)); D.text(fmtN(f(c), 1), p[0], p[1] + 4, { size: 11, w: 700, align: x < 0 ? 'right' : 'left' }); }
    }
    if (W.band) { for (const c of W.band) { const a = toS(-1.3, yC(c)), b = toS(1.3, yC(c)); ctx.setLineDash([5, 4]); ctx.strokeStyle = C.beni; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.setLineDash([]); } }
  },
};
/* integer dots for {…} solutions on the number line */
function intDots(W, lo, hi, test) { W.dots = []; for (let k = Math.ceil(lo); k <= Math.floor(hi); k++) W.dots.push({ x: k, on: false, ok: test(k) }); }
async function lightDots(W, d = 0.08) { for (const p of W.dots) if (p.ok) { p.on = true; SFX.pop(); await wait(d); } }

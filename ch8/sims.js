/* =========================================================
   CHAPTER 8 · SEQUENCES & SERIES — simulations
   seq (term bars + ×r arrows), shift (rSₙ slides under Sₙ and cancels), dots (doubling generations),
   amgm (semicircle: radius = A.M., half-chord = G.M.)
   ========================================================= */
const gpTerm = (a, r, n) => a * r ** (n - 1);
const gpSum = (a, r, n) => (r === 1 ? a * n : (a * (r ** n - 1)) / (r - 1));
const fmtV = (v) => (Math.abs(v - Math.round(v)) < 1e-9 ? Math.round(v).toLocaleString('en-IN').replace('-', '−') : fracStr(v).replace('-', '−'));

/* =============== SEQ: one bar per term =============== */
MINI.seq = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { bars: [], ratio: false, rtext: null, cap: '', top: '', fmt: fmtV, kimCorner: true, kimX: 0.93, sel: -1 }); },
  draw(W) {
    const n = W.bars.length; if (W.top) D.text(W.top, SW / 2, toS(0, 2.55)[1], { size: clamp(SW / 26, 13, 22), w: 800, disp: true });
    if (!n) return; const M = Math.max(...W.bars.map((b) => Math.abs(b.v)), 1e-9); const neg = W.bars.some((b) => b.v < 0);
    const y0 = neg ? -0.2 : -2.1, H = neg ? 1.85 : 3.9; const bw = Math.min(1.4, 8.6 / n); const x0 = -((n - 1) * bw) / 2;
    D.line([[x0 - bw * 0.6, y0], [x0 + (n - 1) * bw + bw * 0.6, y0]], C.ink, 2);
    W.bars.forEach((b, i) => {
      const k = b.k == null ? 1 : b.k; const x = x0 + i * bw; const hh = (b.v / M) * H * k; const col = b.hl ? C.kin : b.v < 0 ? C.sakura : i === W.sel ? C['sora-tint'] : C['matcha-tint'];
      if (k > 0.01) D.rect(x - bw * 0.36, Math.min(y0, y0 + hh), x + bw * 0.36, Math.max(y0, y0 + hh) + (Math.abs(hh) < 0.03 ? 0.03 : 0), col, C.ink, 2);
      const fs = clamp(bw * sc() * 0.28, 9, 15);
      if (k > 0.6) { const p = toS(x, y0 + hh); D.text(b.lab != null ? b.lab : W.fmt(b.v), p[0], p[1] + (b.v < 0 ? fs + 6 : -6), { size: fs, w: 800, col: b.v < 0 ? C.beni : C.ink, stroke: C.paper }); }
      const q = toS(x, y0); D.text(b.n != null ? b.n : 'a' + subN(i + 1), q[0], q[1] + (neg && b.v < 0 ? -6 : 16), { size: clamp(fs * 0.85, 9, 13), w: 700, col: C['ink-muted'] });
      if (W.ratio && i > 0 && k > 0.9) { const pa = toS(x - bw, y0 + H * 0.98 + 0.1), pb = toS(x, y0 + H * 0.98 + 0.1); const mx = (pa[0] + pb[0]) / 2; ctx.strokeStyle = C.beni; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(pa[0] + 4, pa[1]); ctx.quadraticCurveTo(mx, pa[1] - 18, pb[0] - 6, pb[1]); ctx.stroke(); D.head(pb[0] - 4, pb[1], 0.6, 8); D.text(W.rtext ? W.rtext(i) : '×r', mx, pa[1] - 14, { size: clamp(fs * 0.85, 9, 13), w: 800, col: C.beni, stroke: C.paper }); }
    });
    if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: clamp(SW / 36, 11, 16), w: 800, stroke: C.paper });
  },
};
const SUB8 = '₀₁₂₃₄₅₆₇₈₉'; const subN = (n) => String(n).split('').map((d) => SUB8[+d]).join(''); const SUP8 = '⁰¹²³⁴⁵⁶⁷⁸⁹'; const supN = (n) => String(n).split('').map((d) => (d === '-' ? '⁻' : SUP8[+d])).join('');
function seqSet(W, vals, labs) { W.bars = vals.map((v, i) => ({ v, k: 0, lab: labs ? labs[i] : null })); }
async function seqGrow(W, d = 0.16) { for (const [i, b] of W.bars.entries()) { if (b.k >= 1) continue; gsap.to(b, { k: 1, duration: 0.35, ease: 'back.out(2)' }); SFX.tick(); await wait(d); } }
async function seqAdd(W, v, lab) { const b = { v, k: 0, lab }; W.bars.push(b); gsap.to(b, { k: 1, duration: 0.35, ease: 'back.out(2)' }); SFX.pop(); await wait(0.2); }

/* =============== SHIFT: Sₙ and rSₙ, slide and subtract =============== */
MINI.shift = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { top: [], bot: [], slide: 0, cancel: 0, cap: '', kimCorner: true, kimX: 0.93, rowL: ['Sₙ =', 'rSₙ ='] }); },
  draw(W) {
    const n = W.top.length; if (!n) return; const bw = Math.min(1.25, 7.4 / (n + 1)); const x0 = -3.3 + bw / 2; const fs = clamp(bw * sc() * 0.25, 9, 15);
    const yT = 1.2, yB = -0.4 + 0 * W.slide;
    D.textW(W.rowL[0], x0 - bw * 0.65, yT - 0.12, { size: fs, w: 800, align: 'right' }); D.textW(W.rowL[1], x0 - bw * 0.65, yB - 0.12, { size: fs, w: 800, align: 'right' });
    W.top.forEach((t, i) => { const x = x0 + i * bw; const gone = i > 0 ? W.cancel : 0; ctx.save(); ctx.globalAlpha = 1 - gone * 0.8; D.rect(x - bw * 0.46, yT - 0.42, x + bw * 0.46, yT + 0.42, i === 0 && W.cancel > 0.5 ? C.kin : C['matcha-tint'], C.ink, 2); D.textW(t, x, yT - 0.1, { size: fs, w: 800 }); ctx.restore(); if (gone > 0.3) D.line([[x - bw * 0.4, yT - 0.38], [x + bw * 0.4, yT + 0.38]], C.beni, 3); });
    W.bot.forEach((t, i) => { const x = x0 + (i + W.slide) * bw; const gone = i < n - 1 ? W.cancel : 0; ctx.save(); ctx.globalAlpha = 1 - gone * 0.8; D.rect(x - bw * 0.46, yB - 0.42, x + bw * 0.46, yB + 0.42, i === n - 1 && W.cancel > 0.5 ? C.kin : C['sora-tint'], C.ink, 2); D.textW(t, x, yB - 0.1, { size: fs, w: 800 }); ctx.restore(); if (gone > 0.3) D.line([[x - bw * 0.4, yB - 0.38], [x + bw * 0.4, yB + 0.38]], C.beni, 3); });
    if (W.cancel > 0.5) { D.line([[x0 - bw * 0.5, -1.1], [x0 + n * bw + bw * 0.5, -1.1]], C.ink, 2); D.textW('(1 − r)Sₙ = ' + W.top[0] + ' − ' + W.bot[n - 1], 0, -1.8, { size: clamp(SW / 30, 13, 20), w: 800, disp: true }); }
    if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: clamp(SW / 36, 11, 16), w: 800, stroke: C.paper });
  },
};
async function shiftRun(W) { gsap.to(W, { slide: 1, duration: 0.9, ease: 'power2.inOut' }); SFX.whoosh(); await wait(1); gsap.to(W, { cancel: 1, duration: 0.6 }); SFX.zap(); FX.ono('ZAP!', { x: 50, y: 30 }); await wait(0.7); }

/* =============== DOTS: generations multiply =============== */
MINI.dots = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { m: 2, a: 2, gens: 0, kGen: 0, cap: '', unit: '', kimCorner: true, kimX: 0.93, rows: 5 }); },
  draw(W) {
    const R = W.rows; const dy = 4.8 / R; let total = 0; const shown = Math.ceil(W.kGen);
    for (let g = 0; g < shown; g++) {
      const cnt = W.a * W.m ** g; total += cnt; const y = 2.3 - g * dy - dy / 2 + 0.2; const k = Math.min(1, W.kGen - g);
      const draw = Math.min(cnt, 64); const span = 6.2; const r = clamp((span / Math.max(draw, 8)) * sc() * 0.38, 1.5, 9);
      for (let j = 0; j < draw * k; j++) { const x = -3.9 + (j + 0.5) * (span / Math.max(draw, 8)); D.dot(x, y, r, g % 2 ? C.sora : C.beni, null); }
      if (cnt > 64) D.textW('…', -3.9 + span + 0.2, y - 0.1, { size: 14, w: 800 });
      D.textW('gen ' + (g + 1), -4.2, y - 0.08, { size: 11, w: 700, col: C['ink-muted'], align: 'right' });
      D.textW(cnt.toLocaleString('en-IN'), 3.35, y - 0.08, { size: 13, w: 800, align: 'left' });
    }
    if (shown) D.text('total ' + total.toLocaleString('en-IN') + (W.unit ? ' ' + W.unit : ''), SW - 12, 20, { size: clamp(SW / 34, 12, 17), w: 800, align: 'right', disp: true, col: C.beni });
    if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: clamp(SW / 36, 11, 16), w: 800, stroke: C.paper });
  },
};
async function dotsGen(W, upto) { while (W.gens < upto) { W.gens++; gsap.to(W, { kGen: W.gens, duration: 0.45 }); SFX.pop(); buzz(6); await wait(0.5); } }

/* =============== AMGM: drag P along the diameter =============== */
MINI.amgm = {
  view: { w: 10, h: 6 },
  init(W) {
    Object.assign(W, { L: 7.2, t: 0.3, lock: false, cap: '', kimCorner: true, kimX: 0.93, showA: true, showG: true, scale: 1 });
    W.drags = [{ get: () => [-W.L / 2 + W.t * W.L, -1.8], set: (x) => { if (!W.lock) W.t = clamp((x + W.L / 2) / W.L, 0.04, 0.96); }, r: 0.6 }];
  },
  draw(W) {
    const L = W.L, R = L / 2, cy = -1.8, a = W.t * L, b = L - a, px = -R + a, g = Math.sqrt(a * b);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; const c = toS(0, cy); ctx.beginPath(); ctx.arc(c[0], c[1], R * sc(), Math.PI, 2 * Math.PI); ctx.stroke();
    D.line([[-R, cy], [R, cy]], C.ink, 3);
    D.line([[-R, cy - 0.25], [px, cy - 0.25]], C.beni, 5); D.line([[px, cy - 0.25], [R, cy - 0.25]], C.sora, 5);
    const s = W.scale; D.textW('a = ' + fmtN(a * s, 2), (-R + px) / 2, cy - 0.75, { size: 13, w: 800, col: C.beni }); D.textW('b = ' + fmtN(b * s, 2), (px + R) / 2, cy - 0.75, { size: 13, w: 800, col: C.sora });
    if (W.showG) { D.line([[px, cy], [px, cy + g]], C['matcha-deep'], 5); D.textW('G', px + (px > 0 ? 0.25 : -0.25), cy + g / 2, { size: 15, w: 800, col: C['matcha-deep'], stroke: C.paper }); }
    if (W.showA) { const ang = Math.PI / 2 + (px > 0 ? 0.6 : -0.6); const ex = Math.cos(ang) * R, ey = cy + Math.sin(ang) * R; D.line([[0, cy], [ex, ey]], C.kin, 4, [8, 5]); D.textW('A', ex * 0.55 + (px > 0 ? -0.25 : 0.25), cy + (ey - cy) * 0.55, { size: 15, w: 800, col: C.ink, stroke: C.paper }); }
    const A = R * s, G = g * s; const bx = 10, by = 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(bx, by - 14, 128, 58); ctx.strokeRect(bx, by - 14, 128, 58);
    D.text('A = ' + fmtN(A, 2), bx + 8, by + 2, { size: 13, w: 800, align: 'left' }); D.text('G = ' + fmtN(G, 2), bx + 8, by + 20, { size: 13, w: 800, align: 'left', col: C['matcha-deep'] }); D.text('A − G = ' + fmtN(A - G, 2), bx + 8, by + 38, { size: 13, w: 800, align: 'left', col: C.beni });
    D.dot(px, cy, 9, C.kin, C.ink, 2.5); D.dot(0, cy, 4, C.ink, null);
    if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: clamp(SW / 36, 11, 16), w: 800, stroke: C.paper });
  },
};

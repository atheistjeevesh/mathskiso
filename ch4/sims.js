/* =========================================================
   CHAPTER 4 · COMPLEX NUMBERS — simulations
   cx (complex arithmetic), argand scene: z as arrows, animated add / multiply / conjugate / i-powers
   ========================================================= */
const Cx = {
  add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
  mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
  conj: (a) => [a[0], -a[1]], abs: (a) => Math.hypot(a[0], a[1]), arg: (a) => Math.atan2(a[1], a[0]),
  inv: (a) => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; },
  div: (a, b) => Cx.mul(a, Cx.inv(b)), pow: (a, n) => { let r = [1, 0]; const b = n < 0 ? Cx.inv(a) : a; for (let k = 0; k < Math.abs(n); k++) r = Cx.mul(r, b); return r; },
  str: (a) => { const re = Math.abs(a[0]) < 1e-12 ? 0 : a[0], im = Math.abs(a[1]) < 1e-12 ? 0 : a[1]; const rs = fracStr(re), is = fracStr(Math.abs(im)); if (im === 0) return rs; if (re === 0) return (im < 0 ? '−' : '') + (is === '1' ? '' : is) + 'i'; return rs + (im < 0 ? ' − ' : ' + ') + (is === '1' ? '' : is) + 'i'; },
};
const I = [0, 1];

MINI.argand = {
  view: { w: 12, h: 8 },
  init(W) {
    Object.assign(W, { zs: [], ghost: [], circ: null, drag: null, caption: '', ipow: null, kimCorner: true });
    MINI.plane.init(W); W.pl.ax = ['Re', 'Im'];
  },
  draw(W) {
    MINI.plane.draw(W);
    if (W.circ) { const c = toS(0, 0); ctx.save(); ctx.globalAlpha = W.circ.a == null ? 1 : W.circ.a; ctx.setLineDash([6, 5]); ctx.strokeStyle = W.circ.col || C.kin; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(c[0], c[1], W.circ.r * sc(), 0, 7); ctx.stroke(); ctx.setLineDash([]); if (W.circ.t) { const p = toS(W.circ.r * 0.71, W.circ.r * 0.71); D.text(W.circ.t, p[0] + 6, p[1] - 6, { size: 12, w: 800, align: 'left', col: C.ink, stroke: C.paper }); } ctx.restore(); }
    for (const g of W.ghost) { if (g.a === 0) continue; ctx.save(); ctx.globalAlpha = g.a == null ? 0.5 : g.a; ctx.setLineDash([6, 5]); const a = toS(g.x0, g.y0), b = toS(g.x1, g.y1); ctx.strokeStyle = g.col || C.tone; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.restore(); }
    for (const z of W.zs) {
      if (z.a === 0) continue; ctx.save(); ctx.globalAlpha = z.a == null ? 1 : z.a; const o = toS(z.ox || 0, z.oy || 0), p = toS((z.ox || 0) + z.re, (z.oy || 0) + z.im);
      if (z.vec !== false) D.arrow(o[0], o[1], p[0], p[1], z.col || C.sora, z.w || 3.5, 12); else { ctx.beginPath(); ctx.arc(p[0], p[1], 7, 0, 7); ctx.fillStyle = z.col || C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); }
      if (z.drag) { ctx.beginPath(); ctx.arc(p[0], p[1], 10 + Math.sin(T * 6) * 2, 0, 7); ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.stroke(); }
      const lab = z.t != null ? z.t : Cx.str([z.re, z.im]); if (lab) D.text(lab, p[0] + (z.re >= 0 ? 10 : -10), p[1] + (z.im >= 0 ? -10 : 18), { size: 13, w: 800, align: z.re >= 0 ? 'left' : 'right', col: z.col || C.sora, stroke: C.paper });
      ctx.restore();
    }
    if (W.ipow) { const n = W.ipow.n; D.text('i^' + n + ' = ' + ['1', 'i', '−1', '−i'][((n % 4) + 4) % 4], SW / 2, 24, { size: 20, w: 800, disp: true, col: C.beni, stroke: C.paper }); }
    if (W.caption) D.text(W.caption, SW / 2, SH - 10, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
function argView(W, r = 5) { planeView(W, -r * 1.25, r * 1.25, -r * 0.82, r * 0.82, r > 8 ? 2 : 1, r > 8 ? 2 : r > 4 ? 1 : 0.5); }
const zObj = (z, o = {}) => Object.assign({ re: z[0], im: z[1], a: 1 }, o);
function zDrag(W, z, { snap = 0.5, lim = 6 } = {}) { z.drag = true; W.drags = [{ get: () => [z.re, z.im], r: 0.5, set: (x, y) => { const nx = clamp(Math.round(x / snap) * snap, -lim, lim), ny = clamp(Math.round(y / snap) * snap, -lim, lim); if (nx !== z.re || ny !== z.im) { z.re = nx; z.im = ny; SFX.tick(); z.moved = (z.moved || 0) + 1; } } }]; }
/* add: z2 slides to the tip of z1, then the sum appears */
async function animAdd(W, z1, z2, col = C.beni) {
  const a = zObj(z1, { col: C.sora }), b = zObj(z2, { col: C.khaki }); W.zs.push(a, b); await wait(0.4);
  SFX.whoosh(); await tw(b, { ox: z1[0], oy: z1[1], duration: 0.7, ease: 'power2.inOut' }); b.t = '';
  const s = Cx.add(z1, z2); const r = zObj(s, { col, w: 4.5, p: 0 }); W.zs.push(r); SFX.don(); FX.ono('GATTAI!', { x: 70, y: 22 });
  W.ghost.push({ x0: z2[0], y0: z2[1], x1: s[0], y1: s[1] }, { x0: 0, y0: 0, x1: z2[0], y1: z2[1] }); return r;
}
/* multiply: rotate by arg(w), stretch by |w| */
async function animMul(W, z, w2, col = C.beni) {
  const a = zObj(z, { col: C.sora }); W.zs.push(a); await wait(0.3); const r0 = Cx.abs(z), t0 = Cx.arg(z), dr = Cx.abs(w2), dt = Cx.arg(w2);
  const m = zObj(z, { col, w: 4.5 }); W.zs.push(m); const st = { k: 0 }; SFX.rise();
  await tw(st, { k: 1, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { const rr = r0 * (1 + (dr - 1) * st.k), tt = t0 + dt * st.k; m.re = rr * Math.cos(tt); m.im = rr * Math.sin(tt); m.t = ''; } });
  const p = Cx.mul(z, w2); m.re = p[0]; m.im = p[1]; m.t = null; SFX.snap(); return m;
}
async function animConj(W, z) { const a = zObj(z, { col: C.sora }); W.zs.push(a); const b = zObj(z, { col: C.beni }); W.zs.push(b); SFX.flip(); await tw(b, { im: -z[1], duration: 0.7, ease: 'back.out(1.5)' }); W.ghost.push({ x0: z[0], y0: z[1], x1: z[0], y1: -z[1], col: C.tone }); return b; }
async function ipowSpin(W, n) { W.ipow = { n: 0 }; const z = zObj([1, 0], { col: C.beni, w: 4.5 }); W.zs = [z]; W.circ = { r: 1, a: 0.6 }; const sgn = Math.sign(n) || 1; for (let k = 1; k <= Math.abs(n); k++) { const t0 = ((k - 1) * sgn * PI) / 2, st = { a: t0 }; await tw(st, { a: (k * sgn * PI) / 2, duration: Math.abs(n) > 12 ? 0.08 : 0.22, onUpdate: () => { z.re = Math.cos(st.a); z.im = Math.sin(st.a); z.t = ''; } }); W.ipow.n = k * sgn; SFX.tick(); } z.t = null; const v = Cx.pow(I, n); z.re = Math.round(v[0]); z.im = Math.round(v[1]); SFX.snap(); }
const PI = Math.PI;

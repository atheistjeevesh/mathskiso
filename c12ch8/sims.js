/* =========================================================
   CLASS 12 · CHAPTER 8 · APPLICATION OF INTEGRALS — simulations
   area : built on the Chapter 7 integ scene. Adds
          · a draggable thin strip (vertical dA = y dx, or horizontal dA = x dy)
          · horizontal-strip regions between the y-axis and x = g(y)
          · extra outline curves (the rest of a circle or ellipse) and a ×4 mirror fill
          · its own readout: signed integral vs. area = sum of |pieces|
   ========================================================= */
MINI.area = {
  view: { w: 12, h: 8 },
  init(W) { MINI.integ.init(W); Object.assign(W, { read: false, extra: [], hz: null, strip: null, mirror: 0, rd: null, kimY: 0.85 }); },
  draw(W) {
    const [bx0, by0, bx1, by1] = viewBounds(0), ys = W.ys;
    /* mirror copies of the shaded first-quadrant piece (circle / ellipse ×4) */
    if (W.mirror > 0 && W.f && W.a != null) for (const [sx, sy] of [[-1, 1], [-1, -1], [1, -1]]) { ctx.beginPath(); ctx.moveTo(...toS(sx * W.a, 0)); for (let i = 0; i <= 160; i++) { const x = lerp(W.a, W.b, i / 160); ctx.lineTo(...toS(sx * x, (sy * W.f(x)) / ys)); } ctx.lineTo(...toS(sx * W.b, 0)); ctx.closePath(); ctx.fillStyle = C['sora-tint']; ctx.globalAlpha = 0.8 * W.mirror; ctx.fill(); ctx.globalAlpha = 1; }
    /* horizontal-strip region: 0 ≤ x ≤ g(y), c ≤ y ≤ d */
    if (W.hz && W.hz.p > 0) { const { g, c, d, p } = W.hz, top = lerp(c, d, p); ctx.beginPath(); ctx.moveTo(...toS(0, c)); for (let i = 0; i <= 160; i++) { const y = lerp(c, top, i / 160); ctx.lineTo(...toS(g(y), y)); } ctx.lineTo(...toS(0, top)); ctx.closePath(); ctx.fillStyle = C['sora-tint']; ctx.globalAlpha = 0.85; ctx.fill(); ctx.globalAlpha = 1; }
    MINI.integ.draw(W);
    for (const e of W.extra) drawCurve({ f: (x) => e.f(x) / ys, col: e.col || C.sora, w: e.w || 4, dash: e.dash, n: 500, jump: 1e9 }, Math.max(bx0, e.x0 ?? bx0), Math.min(bx1, e.x1 ?? bx1), by0, by1);
    if (W.hz) { const { g, c, d } = W.hz; ctx.strokeStyle = C.sora; ctx.lineWidth = 4; ctx.beginPath(); for (let i = 0; i <= 200; i++) { const y = lerp(W.hz.y0 ?? c, W.hz.y1 ?? d, i / 200); const s = toS(g(y), y); i ? ctx.lineTo(...s) : ctx.moveTo(...s); } ctx.stroke(); for (const y of [c, d]) { D.line([[bx0, y], [bx1, y]], C.ink, 1.5, [4, 4]); D.text('y = ' + fmtN(y, 2), toS(bx1, y)[0] - 30, toS(0, y)[1] - 7, { size: 12, w: 800, stroke: C.paper }); } }
    /* the elementary strip */
    if (W.strip) { const s = W.strip, w = s.w || 0.12; ctx.fillStyle = C.kin; ctx.strokeStyle = C.ink; ctx.lineWidth = 2;
      if (s.h) { const x = W.hz.g(s.y), p = toS(0, s.y + w / 2), q = toS(x, s.y - w / 2); ctx.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); ctx.strokeRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); D.text('x = ' + fmtN(x, 2), (p[0] + q[0]) / 2, p[1] - 8, { size: 12.5, w: 800, stroke: C.paper }); D.text('dy', p[0] - 16, (p[1] + q[1]) / 2 + 4, { size: 12, w: 800, stroke: C.paper }); }
      else { const y = W.f(s.x) / ys, p = toS(s.x - w / 2, Math.max(0, y)), q = toS(s.x + w / 2, Math.min(0, y)); ctx.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); ctx.strokeRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); D.text('y = ' + fmtN(W.f(s.x), 2), q[0] + 32, (p[1] + q[1]) / 2, { size: 12.5, w: 800, stroke: C.paper }); D.text('dx', (p[0] + q[0]) / 2, toS(0, 0)[1] + (y >= 0 ? 16 : -8), { size: 12, w: 800, stroke: C.paper }); } }
    const L = []; if (W.n > 0 && W.a != null) L.push(['rectangles (n = ' + W.n + '): ≈ ' + fmtN(riemAbs(W.f, W.a, W.b, W.n), 1), C.ink]); if (W.rd) L.push(...W.rd.filter(Boolean));
    if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.46, SH - 26, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
/* area counts every rectangle as positive */
const riemAbs = (f, a, b, n) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += Math.abs(f(a + (i + 0.5) * h)); return s * h; };
const areaOf = (f, a, b) => quad((x) => Math.abs(f(x)), a, b);
function areaSet(W, f, x0, x1, o = {}) { integSet(W, f, null, x0, x1, o); Object.assign(W, { extra: o.extra || [], hz: o.hz || null, strip: null, mirror: 0, rd: null, read: false }); if (o.y) { /* integSet already used o.y */ } }
/* zeros of f in (a, b), so the pieces can be shown one by one */
function zerosIn(f, a, b) { const z = []; const N = 2000; let px = a, pv = f(a); for (let i = 1; i <= N; i++) { const x = lerp(a, b, i / N), v = f(x); if (pv === 0 && i > 1) z.push(px); else if (pv * v < 0) { let lo = px, hi = x; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; f(lo) * f(m) <= 0 ? (hi = m) : (lo = m); } z.push((lo + hi) / 2); } px = x; pv = v; } return z.filter((x) => x > a + 1e-9 && x < b - 1e-9); }
/* readout: one line per piece, signed integral, then |A₁| + |A₂| + … */
function pieceLines(f, a, b, lab = (x) => fmtN(x, 2)) { const cuts = [a, ...zerosIn(f, a, b), b], L = []; for (let i = 0; i + 1 < cuts.length; i++) { const v = quad(f, cuts[i], cuts[i + 1]); L.push(['∫ from ' + lab(cuts[i]) + ' to ' + lab(cuts[i + 1]) + ' = ' + fmtN(v, 3), v >= 0 ? C.sora : C.beni]); } return L; }
async function stripSweep(W, a, b, d = 1.4) { W.strip = { x: a }; SFX.swish(); await tw(W.strip, { x: b, duration: AUTO ? 0.05 : d, ease: 'power1.inOut' }); W.strip = null; }
async function mirrorRun(W) { SFX.whoosh(); await tw(W, { mirror: 1, duration: AUTO ? 0.05 : 0.9 }); SFX.pop(); }
async function hzRun(W, d = 1.2) { W.hz.p = 0; SFX.swish(); await tw(W.hz, { p: 1, duration: AUTO ? 0.05 : d, ease: 'power1.inOut' }); }

/* ---------- question builders ---------- */
const ellF = (a, b) => (x) => (Math.abs(x) > a + 1e-9 ? NaN : b * Math.sqrt(Math.max(0, 1 - (x * x) / (a * a))));
/* area under y = f between a and b (pieces below the axis count as positive) */
function arQ(ex, n, q, f, a, b, val, show, o = {}) {
  const v = o.view || [Math.min(a, b) - (Math.abs(b - a) * 0.2 + 0.3), Math.max(a, b) + (Math.abs(b - a) * 0.2 + 0.3)];
  return { ex, n, q, scene: 'area', f, a, b, val,
    setup: (W) => { areaSet(W, f, v[0], v[1], { ab: [a, b], y: o.y, lab: o.lab, fx: o.fx, cap: o.cap, extra: o.extra }); },
    parts: [{ k: 'run', run: async (W) => { await stripSweep(W, a, b); await shadeRun(W); } }, ...(o.steps || []),
      { k: 'num', q: o.nq || 'Area = ?', a: val, show, keys: o.keys || 'π √', tol: o.tol || 1e-4 * Math.max(1, Math.abs(val)), act: async (W) => { W.rd = [...pieceLines(f, a, b, o.lab), ['area = ' + show + ' ≈ ' + fmtN(val, 4), C['matcha-deep']]]; SFX.pop(); }, x: o.x || 'Area = ' + show + '.' }, ...(o.post || [])],
    w: [o.w || 'Area = ' + show] };
}
/* ellipse / circle: shade the first quadrant, then mirror ×4 */
function ellQ(ex, n, q, A, B, val, show, o = {}) {
  const f = ellF(A, B), m = Math.max(A, B) + 0.8;
  return { ex, n, q, scene: 'area', f, a: 0, b: A, val: val / 4,
    setup: (W) => { areaSet(W, f, -m * 1.25, m * 1.25, { ab: [0, A], y: [-B - 0.5, B + 0.5], extra: [{ f, x0: -A, x1: A }, { f: (x) => -f(x), x0: -A, x1: A }] }); },
    parts: [{ k: 'run', run: async (W) => { await stripSweep(W, 0, A); await shadeRun(W); } },
      { k: 'mcq', q: 'First-quadrant area = ?', o: ['∫₀^' + A + ' (' + B + '/' + A + ')√(' + A * A + ' − x²) dx', '∫₀^' + B + ' √(' + A * A + ' − x²) dx', '∫₀^' + A + ' (' + B + '/' + A + ')(' + A * A + ' − x²) dx', '∫₋' + A + '^' + A + ' √(' + B * B + ' − x²) dx'], a: 0, x: 'y = (b/a)√(a² − x²) on the arc, x from 0 to a.' },
      { k: 'num', q: 'That quarter = ?', a: val / 4, show: o.qshow, keys: 'π √', tol: 1e-4, act: async (W) => { W.rd = [['quarter = ' + o.qshow, C.sora]]; } },
      { k: 'run', run: async (W) => { await mirrorRun(W); } },
      { k: 'num', q: o.nq || 'Whole area = ?', a: val, show, keys: 'π √', tol: 1e-4, act: async (W) => { W.rd = [['quarter = ' + o.qshow, C.sora], ['× 4 = ' + show + ' ≈ ' + fmtN(val, 3), C['matcha-deep']]]; SFX.pop(); }, x: 'Area = 4 × ' + o.qshow + ' = ' + show + ' (πab with a = ' + A + ', b = ' + B + ').' }, ...(o.post || [])],
    w: ['Area = ' + show] };
}

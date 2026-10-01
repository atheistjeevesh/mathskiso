/* =========================================================
   CLASS 12 · CHAPTER 5 · CONTINUITY & DIFFERENTIABILITY — simulations
   (also loads ch12/sims.js for the calc scene: drag P along y = f(x), tangent slope readout)
   pw  : piecewise graphs with filled/hollow dots; a pen traces the graph and LIFTS at every break;
         left/right secants at a point show a kink (left and right derivatives)
   imp : an implicit curve G(x, y) = 0 (marching squares); drag a point along it; tangent slope −Gx/Gy
   par : a parametric curve (x(t), y(t)); slide t; dx/dt, dy/dt arrows and the tangent dy/dx
   ========================================================= */
const PI = Math.PI, E = Math.E;
const EPS = 1e-7;
/* left limit, right limit and value of F at b (numerically) */
const lrv = (F, b) => [F(b - EPS), F(b + EPS), F(b)];
const isCont = (F, b, tol = 1e-4) => { const [l, r, v] = lrv(F, b); return isFinite(v) && Math.abs(l - v) < tol && Math.abs(r - v) < tol; };
const disc = (F, cuts) => cuts.filter((b) => !isCont(F, b));
const ND2 = (f, x, e = 1e-4) => (f(x + e) - 2 * f(x) + f(x - e)) / (e * e);

MINI.pw = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { F: null, cuts: [], pen: null, lr: null, kimCorner: true, kimX: 0.95, kimY: 0.85, flags: [], picked: new Set(), cap2: '' }); },
  draw(W) {
    MINI.plane.draw(W); if (!W.F) return; const [bx0, by0, bx1, by1] = viewBounds(0); const F = W.F; const cuts = W.cuts.filter((b) => b > bx0 && b < bx1).sort((p, q) => p - q);
    const edges = [bx0, ...cuts, bx1]; const upto = W.pen ? W.pen.x : bx1;
    for (let i = 0; i < edges.length - 1; i++) { const a = edges[i] + (i ? 1e-6 : 0), b = Math.min(edges[i + 1] - (i < edges.length - 2 ? 1e-6 : 0), upto); if (b <= a) continue; drawCurve({ f: F, col: W.fcol || C.sora, w: 4, x0: a, x1: b, n: 500, jump: (by1 - by0) * 0.3 }, bx0, bx1, by0, by1); }
    // dots at the cut points
    for (const b of cuts) { if (W.pen && b > W.pen.x) continue; const [l, r, v] = lrv(F, b); const hollow = (y) => { if (!isFinite(y) || y < by0 || y > by1) return; const s = toS(b, y); ctx.beginPath(); ctx.arc(s[0], s[1], 6, 0, 7); ctx.fillStyle = C.paper; ctx.fill(); ctx.strokeStyle = W.fcol || C.sora; ctx.lineWidth = 2.5; ctx.stroke(); };
      if (!(isFinite(v) && Math.abs(l - v) < 1e-4)) hollow(l); if (!(isFinite(v) && Math.abs(r - v) < 1e-4)) hollow(r); if (isFinite(v) && v > by0 && v < by1) D.dot(b, v, 6, W.fcol || C.sora, C.ink, 1.5); }
    // flags on the x-axis (tap to mark a break)
    for (const x of W.flags) { const s = toS(x, 0), on = W.picked.has(x); ctx.fillStyle = on ? C.beni : C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(s[0], s[1], 9, 0, 7); ctx.fill(); ctx.stroke(); if (on) { ctx.strokeStyle = C.panel; ctx.beginPath(); ctx.moveTo(s[0] - 4, s[1] - 4); ctx.lineTo(s[0] + 4, s[1] + 4); ctx.moveTo(s[0] + 4, s[1] - 4); ctx.lineTo(s[0] - 4, s[1] + 4); ctx.stroke(); } D.text(cell(x), s[0], s[1] + 24, { size: 11, w: 800, stroke: C.paper }); }
    // pen
    if (W.pen) { const y = F(W.pen.x); if (isFinite(y)) { const s = toS(W.pen.x, y); ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(-0.6); ctx.fillStyle = C.kin; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(8, -6); ctx.lineTo(40, -6); ctx.lineTo(40, 6); ctx.lineTo(8, 6); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); } D.text('lifts: ' + W.pen.lifts, 14, 24, { size: 15, w: 800, disp: true, align: 'left', stroke: C.paper, col: C.beni }); }
    // left / right secants at c (kinks)
    if (W.lr) { const { c, h } = W.lr, fc = F(c), mL = (fc - F(c - h)) / h, mR = (F(c + h) - fc) / h; D.line([[c - h, F(c - h)], [c, fc]], C.beni, 3); D.line([[c, fc], [c + h, F(c + h)]], C['matcha-deep'], 3); D.dot(c - h, F(c - h), 7, C.beni, C.ink); D.dot(c + h, F(c + h), 7, C['matcha-deep'], C.ink); D.dot(c, fc, 8, C.kin, C.ink, 2.5);
      ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, 230, 62); ctx.strokeRect(8, 8, 230, 62); D.text('h = ' + fmtN(h, 4), 16, 26, { size: 12.5, w: 800, align: 'left' }); D.text('left slope ' + fmt4(mL), 16, 44, { size: 12.5, w: 800, align: 'left', col: C.beni }); D.text('right slope ' + fmt4(mR), 16, 62, { size: 12.5, w: 800, align: 'left', col: C['matcha-deep'] }); }
    if (W.cap2) D.text(W.cap2, SW * 0.46, SH - 14, { size: 13, w: 800, stroke: C.paper });
  },
};
function pwSet(W, F, cuts, view, o = {}) { W.F = F; W.cuts = cuts; planeView(W, ...view); if (o.grid) { W.pl.grid = o.grid; W.pl.lab = o.grid; } W.flags = o.flags || []; W.picked = new Set(); W.pen = null; W.lr = null; W.cap2 = o.cap || ''; }
/* the pen traces left → right and lifts at every break */
async function penRun(W, d = 2.2) { const [bx0, , bx1] = viewBounds(0); W.pen = { x: bx0, lifts: 0 }; const brk = W.cuts.filter((b) => b > bx0 && b < bx1 && !isCont(W.F, b)).sort((p, q) => p - q); let k = 0; SFX.swish(); await tw(W.pen, { x: bx1, duration: AUTO ? 0.05 : d, ease: 'none', onUpdate: () => { while (k < brk.length && W.pen.x >= brk[k]) { k++; W.pen.lifts = k; SFX.zap(); FX.ono('LIFT!', { x: 30 + 40 * ((brk[k - 1] - bx0) / (bx1 - bx0)), y: 30 }); } } }); W.pen = null; }
/* tap flags to mark breaks */
function flagTaps(W) { W.onTap = (x, y) => { const f = W.flags.find((v) => Math.abs(v - x) < 0.35 * Math.max(1, (W.pl.x1 - W.pl.x0) / 12)); if (f == null) return; W.picked.has(f) ? W.picked.delete(f) : W.picked.add(f); SFX.snap(); buzz(8); }; }

/* =============== IMP: implicit curve =============== */
MINI.imp = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { G: null, P: null, kimCorner: true, kimX: 0.95, kimY: 0.85, segs: null, showTan: true }); },
  draw(W) {
    MINI.plane.draw(W); if (!W.G) return; const [bx0, by0, bx1, by1] = viewBounds(0);
    if (!W.segs || W.segsKey !== [bx0, by0, bx1, by1].join()) { W.segs = contour(W.G, bx0, bx1, by0, by1); W.segsKey = [bx0, by0, bx1, by1].join(); }
    ctx.strokeStyle = C.sora; ctx.lineWidth = 3.5; ctx.beginPath(); for (const [a, b] of W.segs) { const p = toS(...a), q = toS(...b); ctx.moveTo(...p); ctx.lineTo(...q); } ctx.stroke();
    if (W.P) { const [x, y] = W.P; const m = impSlope(W.G, x, y); if (W.showTan && isFinite(m)) D.line([[bx0, y + m * (bx0 - x)], [bx1, y + m * (bx1 - x)]], C['matcha-deep'], 3, [9, 5]); D.dot(x, y, 10, C.kin, C.ink, 2.5);
      const t = ['P = (' + fmtN(x, 3) + ', ' + fmtN(y, 3) + ')', W.showTan ? 'tangent slope dy/dx = ' + fmt4(m) : '']; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, 250, W.showTan ? 46 : 28); ctx.strokeRect(8, 8, 250, W.showTan ? 46 : 28); t.forEach((s, i) => s && D.text(s, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: i ? C['matcha-deep'] : C.ink })); }
  },
};
function contour(G, x0, x1, y0, y1, nx = 140, ny = 100) {
  const segs = [], dx = (x1 - x0) / nx, dy = (y1 - y0) / ny; const v = []; for (let i = 0; i <= nx; i++) { v[i] = []; for (let j = 0; j <= ny; j++) v[i][j] = G(x0 + i * dx, y0 + j * dy); }
  const it = (p, q, a, b) => { const t = a / (a - b); return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]; };
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) { const P = [[x0 + i * dx, y0 + j * dy], [x0 + (i + 1) * dx, y0 + j * dy], [x0 + (i + 1) * dx, y0 + (j + 1) * dy], [x0 + i * dx, y0 + (j + 1) * dy]]; const V = [v[i][j], v[i + 1][j], v[i + 1][j + 1], v[i][j + 1]]; if (V.some((z) => !isFinite(z))) continue; const pts = []; for (let k = 0; k < 4; k++) { const a = V[k], b = V[(k + 1) % 4]; if ((a < 0) !== (b < 0)) pts.push(it(P[k], P[(k + 1) % 4], a, b)); } if (pts.length === 2) segs.push(pts); else if (pts.length === 4) { segs.push([pts[0], pts[1]]); segs.push([pts[2], pts[3]]); } }
  return segs;
}
const impSlope = (G, x, y, e = 1e-6) => { const gx = (G(x + e, y) - G(x - e, y)) / (2 * e), gy = (G(x, y + e) - G(x, y - e)) / (2 * e); return -gx / gy; };
/* move P to a new x, keeping it on the curve (Newton in y from the current y) */
function impSnap(G, x, y) { for (let k = 0; k < 40; k++) { const e = 1e-6, g = G(x, y), gy = (G(x, y + e) - G(x, y - e)) / (2 * e); if (!isFinite(g) || !gy) break; const ny = y - g / gy; if (Math.abs(ny - y) < 1e-12) { y = ny; break; } y = ny; } return Math.abs(G(x, y)) < 1e-6 ? y : null; }
function impDrag(W, snap = 0.05) { W.drags = [{ get: () => W.P, r: 0.8, set: (x) => { const nx = Math.round(x / snap) * snap; if (Math.abs(nx - W.P[0]) < 1e-9) return; const ny = impSnap(W.G, nx, W.P[1]); if (ny != null) { W.P = [nx, ny]; SFX.tick(); W.moved = (W.moved || 0) + 1; } } }]; }

/* =============== PAR: parametric curve =============== */
MINI.par = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { X: null, Y: null, t0: -1, t1: 1, t: 0, kimCorner: true, kimX: 0.95, kimY: 0.85, tn: 't' }); },
  draw(W) {
    MINI.plane.draw(W); if (!W.X) return; const [bx0, , bx1] = viewBounds(0);
    ctx.strokeStyle = C.sora; ctx.lineWidth = 3.5; ctx.beginPath(); let pen = false; for (let i = 0; i <= 600; i++) { const t = lerp(W.t0, W.t1, i / 600), x = W.X(t), y = W.Y(t); if (!isFinite(x) || !isFinite(y)) { pen = false; continue; } const s = toS(x, y); pen ? ctx.lineTo(...s) : ctx.moveTo(...s); pen = true; } ctx.stroke();
    const t = W.t, x = W.X(t), y = W.Y(t), xd = ND(W.X, t), yd = ND(W.Y, t), m = yd / xd; if (!isFinite(x) || !isFinite(y)) return;
    if (isFinite(m) && Math.abs(m) < 1e6) D.line([[bx0, y + m * (bx0 - x)], [bx1, y + m * (bx1 - x)]], C['matcha-deep'], 3, [9, 5]);
    const k = 0.6 / Math.max(1e-9, Math.hypot(xd, yd)) * Math.min(3, Math.hypot(xd, yd)); D.arrowW(x, y, x + xd * k, y, C.beni, 3, 10); D.arrowW(x, y, x, y + yd * k, C.sora, 3, 10);
    D.dot(x, y, 10, C.kin, C.ink, 2.5);
    const L = [W.tn + ' = ' + fmtN(t, 3), 'dx/d' + W.tn + ' = ' + fmt4(xd), 'dy/d' + W.tn + ' = ' + fmt4(yd), 'dy/dx = ' + fmt4(m)]; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, 190, 80); ctx.strokeRect(8, 8, 190, 80); L.forEach((s, i) => D.text(s, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: [C.ink, C.beni, C.sora, C['matcha-deep']][i] }));
  },
};
function parSet(W, X, Y, t0, t1, t, view, tn = 't') { Object.assign(W, { X, Y, t0, t1, t, tn }); if (view) planeView(W, ...view); else { let a = Infinity, b = -Infinity, c = Infinity, d = -Infinity; for (let i = 0; i <= 200; i++) { const s = lerp(t0, t1, i / 200), x = X(s), y = Y(s); if (isFinite(x) && isFinite(y)) { a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, y); d = Math.max(d, y); } } const px = (b - a) * 0.2 + 0.5, py = (d - c) * 0.2 + 0.5; planeView(W, a - px, b + px, c - py, d + py); } }
function parSlider(W, snap = 0.01) { return slider(W.tn + ' (slide me)', W.t0, W.t1, snap, W.t, (v) => fmtN(v, 2), (v) => { W.t = v; W.moved = (W.moved || 0) + 1; }); }

/* ---------- question builders ---------- */
/* derivative question: pick the formula, drag P to x0, read the tangent slope and type it */
function dQ(ex, n, q, f, df, opts, x0, o = {}) {
  const v = o.view || [x0 - 2.5, x0 + 2.5];
  return { ex, n, q, scene: 'calc', kim: o.kim, f, df, x0,
    setup: (W) => { calcView(W, f, v[0], v[1], { y: o.y, fit: true }); W.a = clamp(v[0] + (v[1] - v[0]) * 0.2, v[0], v[1]); if (!isFinite(f(W.a))) W.a = x0 - (v[1] - v[0]) * 0.15; W.tan = true; W.read = true; grabCalc(W, { snap: o.snap }); if (o.cap) W.pl.caption = o.cap; },
    parts: [...(o.steps || []), { k: 'mcq', q: o.mq || 'dy/dx = ?', o: opts, a: 0, x: o.x || plain(opts[0]) + '.' },
      ...(o.noDrag ? [] : [{ k: 'task', q: 'Drag P to x = ' + (o.x0s || fmtN(x0, 3)) + ' and read the tangent slope', todo: 'The green dashed line is the tangent.', check: (W) => Math.abs(W.a - x0) < (o.snap || 0.05) / 2 + 1e-9, auto: (W) => (W.a = x0), reveal: (W) => (W.a = x0) }]),
      { k: 'num', q: 'Slope at x = ' + (o.x0s || fmtN(x0, 3)) + ' = ? (2 decimals are enough)', a: df(x0), tol: Math.max(0.011, Math.abs(df(x0)) * 0.003), show: o.show || fmtN(df(x0), 3), act: async (W) => { W.a = x0; }, x: 'From the formula: ' + fmtN(df(x0), 4) + '.' }, ...(o.post || [])],
    w: [o.w || 'dy/dx = ' + plain(opts[0])] };
}
/* second derivative: formula pick, then f″(x0); the stage shows f′ as a dashed curve */
function d2Q(ex, n, q, f, d2f, opts, x0, o = {}) {
  const v = o.view || [x0 - 2.5, x0 + 2.5];
  return { ex, n, q, scene: 'calc', f, d2f, x0,
    setup: (W) => { calcView(W, f, v[0], v[1], { y: o.y, fit: true }); W.extraF = [{ f: (x) => ND(f, x) / (W.ys || 1), col: C.beni, dash: [7, 5] }]; W.a = x0; W.tan = true; W.read = true; grabCalc(W); W.pl.caption = 'solid: y · dashed: dy/dx'; },
    parts: [...(o.steps || []), { k: 'mcq', q: o.mq || 'd²y/dx² = ?', o: opts, a: 0, x: o.x || plain(opts[0]) + '.' }, { k: 'num', q: 'd²y/dx² at x = ' + (o.x0s || fmtN(x0, 3)) + ' = ? (2 decimals)', a: d2f(x0), tol: Math.max(0.011, Math.abs(d2f(x0)) * 0.003), show: fmtN(d2f(x0), 3), x: '= ' + fmtN(d2f(x0), 4) + ' (the slope of the dashed curve there).' }, ...(o.post || [])],
    w: [o.w || 'd²y/dx² = ' + plain(opts[0])] };
}
/* implicit: formula pick, drag along the curve to the point, then the slope */
function impQ(ex, n, q, G, slope, opts, P0, o = {}) {
  return { ex, n, q, scene: 'imp', G, slope, P0,
    setup: (W) => { W.G = G; planeView(W, ...(o.view || [P0[0] - 4, P0[0] + 4, P0[1] - 3, P0[1] + 3])); const sx = o.start || P0[0] - 0.5; const sy = impSnap(G, sx, P0[1]); W.P = sy != null ? [sx, sy] : P0.slice(); impDrag(W, o.snap || 0.05); },
    parts: [...(o.steps || []), { k: 'mcq', q: o.mq || 'dy/dx = ?', o: opts, a: 0, x: o.x || plain(opts[0]) + '.' },
      { k: 'task', q: 'Drag P along the curve to x = ' + fmtN(P0[0], 3), todo: 'P stays on the curve; the green line is the tangent.', check: (W) => Math.abs(W.P[0] - P0[0]) < 1e-6, auto: (W) => (W.P = P0.slice()), reveal: (W) => (W.P = P0.slice()) },
      { k: 'num', q: 'Slope at (' + fmtN(P0[0], 3) + ', ' + fmtN(P0[1], 3) + ') = ?', a: slope(...P0), tol: Math.max(0.011, Math.abs(slope(...P0)) * 0.003), show: fmtN(slope(...P0), 3), act: async (W) => { W.P = P0.slice(); }, x: 'From the formula: ' + fmtN(slope(...P0), 4) + '.' }],
    w: [o.w || 'dy/dx = ' + plain(opts[0])] };
}
/* parametric: formula pick, slide t to t0, read dy/dx */
function parQ(ex, n, q, X, Y, dydx, opts, t0, o = {}) {
  const r = o.range || [t0 - 1.5, t0 + 1.5];
  return { ex, n, q, scene: 'par', X, Y, dydx, t0,
    setup: (W) => { parSet(W, X, Y, r[0], r[1], r[0] + (r[1] - r[0]) * 0.15, o.view, o.tn || 't'); if (o.cap) W.pl.caption = o.cap; },
    parts: [{ k: 'mcq', q: o.mq || 'dy/dx = ?', o: opts, a: 0, x: o.x || plain(opts[0]) + '.' },
      { k: 'task', q: 'Slide ' + (o.tn || 't') + ' to ' + (o.t0s || fmtN(t0, 2)), pre: async (W) => { W.sl = parSlider(W); }, check: (W) => Math.abs(W.t - t0) < 0.006, auto: (W) => { W.t = t0; if (W.sl) W.sl.value = t0; }, reveal: (W) => (W.t = t0) },
      { k: 'num', q: (o.nq || 'dy/dx') + ' at ' + (o.tn || 't') + ' = ' + (o.t0s || fmtN(t0, 2)) + ' = ?', a: dydx(t0), tol: Math.max(0.011, Math.abs(dydx(t0)) * 0.003), show: fmtN(dydx(t0), 3), act: async (W) => { W.t = t0; }, x: 'From the formula: ' + fmtN(dydx(t0), 4) + '.' }],
    w: [o.w || 'dy/dx = ' + plain(opts[0])] };
}
/* continuity: pen run, then tap the breaks (or pick "none") */
function contQ(ex, n, q, F, cuts, view, o = {}) {
  const br = disc(F, cuts); const flags = o.flags || cuts;
  return { ex, n, q, scene: 'pw', F, cuts, br,
    setup: (W) => pwSet(W, F, cuts, view, { flags: [], cap: o.cap, grid: o.grid }),
    parts: [...(o.pre || []), { k: 'run', run: async (W) => { await penRun(W); } },
      ...(o.noPick ? [] : [{ k: 'pick', q: o.pq || 'Points of discontinuity (none? lock in with nothing picked)', pool: flags.map((v) => (typeof v === 'number' ? 'x = ' + cell(v) : v)), a: br.map((v) => 'x = ' + cell(v)), brace: false, x: br.length ? 'Breaks at ' + br.map((v) => 'x = ' + cell(v)).join(', ') + '.' : 'No breaks: continuous everywhere.' }]),
      ...(o.post || [])],
    w: [o.w || (br.length ? 'Discontinuous only at ' + br.map((v) => 'x = ' + cell(v)).join(', ') : 'Continuous everywhere')] };
}
/* find k (or λ) so f is continuous at c: slider, then type */
function kQ(ex, n, q, Fk, c, k, view, o = {}) {
  return { ex, n, q, scene: 'pw', Fk, c, k,
    setup: (W) => { W.kv = o.k0 != null ? o.k0 : k + 1.5; pwSet(W, (x) => Fk(x, W.kv), [c], view, { cap: o.cap }); },
    parts: [{ k: 'task', q: 'Slide ' + (o.kn || 'k') + ' until the graph joins up at x = ' + (o.cs || cell(c)), pre: async (W) => { W.ksl = slider(o.kn || 'k', o.lo != null ? o.lo : k - 5, o.hi != null ? o.hi : k + 5, o.step || 0.5, W.kv, (v) => (o.kn || 'k') + ' = ' + fmtN(v, 2), (v) => (W.kv = v)); }, check: (W) => Math.abs(W.kv - k) < (o.step || 0.5) / 2 + 1e-9, auto: (W) => { W.kv = k; if (W.ksl) W.ksl.value = k; }, reveal: (W) => (W.kv = k), x: 'Left limit = right limit = value.' },
      { k: 'num', q: (o.kn || 'k') + ' = ?', pre: async (W) => { if (W.ksl && W.ksl.parentNode) W.ksl.parentNode.remove(); }, a: k, show: o.show || cell(k), keys: o.keys, x: o.x || (o.kn || 'k') + ' = ' + (o.show || cell(k)) + '.' }, ...(o.post || [])],
    w: [(o.kn || 'k') + ' = ' + (o.show || cell(k))] };
}
const tfP = (q, a, x) => ({ k: 'tf', q, a, x });

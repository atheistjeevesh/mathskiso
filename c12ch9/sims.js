/* =========================================================
   CLASS 12 · CHAPTER 9 · DIFFERENTIAL EQUATIONS — simulations
   field : slope field of dy/dx = F(x, y). Tap the field to release a solution curve (RK4 along arc length).
           The textbook answer G(x, y) = C is overlaid as a red glow through the same points:
           when it is right, red sits exactly on blue. Also plots explicit families and a residual
           "LHS − RHS" curve for verification questions.
   tower : the derivatives in an equation stacked as blocks by order; powers on top; blocks caged
           inside sin / cos / e^ / log make the degree undefined.
   Every answer carries F and G; the test page checks Gx + Gy·F = 0 numerically.
   ========================================================= */
const { sin, cos, tan, log, exp, sqrt, abs, asin, atan } = Math;
const PI = Math.PI, E = Math.E, ln = (x) => log(abs(x));
const sec = (x) => 1 / cos(x), csc = (x) => 1 / sin(x), cot = (x) => 1 / tan(x);

MINI.field = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { F: null, G: null, sols: [], ov: [], ovA: 0, fam: [], res: null, seed: null, tapOn: false, taps: 0, kimCorner: true, kimX: 0.95, kimY: 0.85, rd: null, cap: '', ic: null }); },
  draw(W) {
    MINI.plane.draw(W); const [bx0, by0, bx1, by1] = viewBounds(0);
    if (W.F) { const step = Math.max((bx1 - bx0) / 22, (by1 - by0) / 15), L = step * 0.36; ctx.lineWidth = 1.6; ctx.strokeStyle = C['ink-muted'];
      for (let x = Math.ceil(bx0 / step) * step; x < bx1; x += step) for (let y = Math.ceil(by0 / step) * step; y < by1; y += step) { const m = W.F(x, y); let dx, dy; if (!isFinite(m)) { if (!(m === Infinity || m === -Infinity)) continue; dx = 0; dy = L; } else { const k = 1 / Math.sqrt(1 + m * m); dx = L * k; dy = L * m * k; } const p = toS(x - dx, y - dy), q = toS(x + dx, y + dy); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); } }
    for (const c of W.fam) drawCurve({ f: c.f, col: c.col || C.sora, w: c.w || 3, dash: c.dash, a: c.a, n: 700, jump: (by1 - by0) * 0.5 }, bx0, bx1, by0, by1);
    if (W.res) { drawCurve({ f: W.res, col: C.beni, w: 3.5, n: 800, jump: (by1 - by0) * 0.5 }, bx0, bx1, by0, by1); D.text('LHS − RHS', toS(bx1, 0)[0] - 50, toS(0, 0)[1] - 10, { size: 12.5, w: 800, col: C.beni, stroke: C.paper }); }
    if (W.ovA > 0 && W.G) { ctx.save(); ctx.globalAlpha = W.ovA * 0.5; for (const c of W.ov) contour(W.G, c, C.beni, bx0, bx1, by0, by1, W.Gjump); ctx.restore(); }
    for (const s of W.sols) { ctx.strokeStyle = s.col || C.sora; ctx.lineWidth = 4; ctx.lineJoin = 'round'; const n = Math.floor(s.pts.length * (s.p == null ? 1 : s.p)); let pen = false; ctx.beginPath(); for (let i = 0; i < n; i++) { const pt = s.pts[i]; if (!pt) { pen = false; continue; } const sp = toS(...pt); pen ? ctx.lineTo(...sp) : ctx.moveTo(...sp); pen = true; } ctx.stroke(); D.dot(s.x0, s.y0, 7, C.kin, C.ink, 2); }
    if (W.ic) { const s = toS(...W.ic); ctx.strokeStyle = C.beni; ctx.lineWidth = 2.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(s[0], s[1], 14 + 3 * Math.sin(T * 5), 0, 7); ctx.stroke(); ctx.setLineDash([]); D.text(W.icLab || '', s[0], s[1] - 22, { size: 12.5, w: 800, col: C.beni, stroke: C.paper }); }
    if (W.seed) D.dot(W.seed[0], W.seed[1], 10, C.kin, C.ink, 2.5);
    const L = (W.rd || []).filter(Boolean); if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.46, SH - 26, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
/* marching squares for G(x, y) = c; cells straddling a jump of G are skipped */
function contour(G, c, col, x0, x1, y0, y1, jump) {
  const nx = 110, ny = Math.round((nx * (y1 - y0)) / (x1 - x0)) || 60, hx = (x1 - x0) / nx, hy = (y1 - y0) / ny, v = [];
  for (let j = 0; j <= ny; j++) { const r = []; for (let i = 0; i <= nx; i++) { const g = G(x0 + i * hx, y0 + j * hy); r.push(isFinite(g) ? g - c : NaN); } v.push(r); }
  const diffs = []; for (let j = 0; j < ny; j += 3) for (let i = 0; i < nx; i += 3) { const d = Math.abs(v[j][i + 1] - v[j][i]); if (isFinite(d)) diffs.push(d); } diffs.sort((p, q) => p - q); const J = jump || (diffs[Math.floor(diffs.length * 0.9)] || 1) * 8;
  ctx.strokeStyle = col; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath();
  const ip = (a, b) => a / (a - b);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const a = v[j][i], b = v[j][i + 1], cc = v[j + 1][i + 1], d = v[j + 1][i]; if (!(isFinite(a) && isFinite(b) && isFinite(cc) && isFinite(d))) continue; if (Math.max(a, b, cc, d) - Math.min(a, b, cc, d) > J) continue;
    const X = x0 + i * hx, Y = y0 + j * hy, P = []; if (a * b < 0) P.push([X + ip(a, b) * hx, Y]); if (b * cc < 0) P.push([X + hx, Y + ip(b, cc) * hy]); if (cc * d < 0) P.push([X + (1 - ip(d, cc)) * hx, Y + hy]); if (d * a < 0) P.push([X, Y + (1 - ip(a, d)) * hy]);
    if (P.length >= 2) { ctx.moveTo(...toS(...P[0])); ctx.lineTo(...toS(...P[1])); } if (P.length === 4) { ctx.moveTo(...toS(...P[2])); ctx.lineTo(...toS(...P[3])); } }
  ctx.stroke(); ctx.lineCap = 'butt';
}
/* integrate along arc length in both directions from (x0, y0) */
function trace(F, x0, y0, b) {
  const [bx0, by0, bx1, by1] = b, h = Math.max(bx1 - bx0, by1 - by0) / 500, dir = (x, y, px, py) => { const m = F(x, y); let dx, dy; if (m === Infinity || m === -Infinity) { dx = 0; dy = 1; } else { if (!isFinite(m)) return null; const k = 1 / Math.sqrt(1 + m * m); dx = k; dy = m * k; } if (px != null && dx * px + dy * py < 0) { dx = -dx; dy = -dy; } return [dx, dy]; };
  const run = (sg) => { const out = []; let x = x0, y = y0, d0 = dir(x, y); if (!d0) return out; let px = sg * d0[0], py = sg * d0[1];
    for (let i = 0; i < 900; i++) { const k1 = dir(x, y, px, py); if (!k1) break; const k2 = dir(x + (h / 2) * k1[0], y + (h / 2) * k1[1], k1[0], k1[1]); if (!k2) break; const k3 = dir(x + (h / 2) * k2[0], y + (h / 2) * k2[1], k2[0], k2[1]); if (!k3) break; const k4 = dir(x + h * k3[0], y + h * k3[1], k3[0], k3[1]); if (!k4) break;
      const dx = (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]) / 6, dy = (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]) / 6; x += h * dx; y += h * dy; px = dx; py = dy; if (x < bx0 - 1 || x > bx1 + 1 || y < by0 - 1 || y > by1 + 1 || !isFinite(x + y)) break; out.push([x, y]); }
    return out; };
  const back = run(-1).reverse(), fwd = run(1); return [...back, [x0, y0], ...fwd];
}
async function release(W, x, y, col) { const s = { x0: x, y0: y, pts: trace(W.F, x, y, viewBounds(0)), p: 0, col }; W.sols.push(s); W.taps++; SFX.whoosh(); await tw(s, { p: 1, duration: AUTO ? 0.05 : 0.8, ease: 'power1.out' }); }
async function overlay(W) { W.ov = W.sols.map((s) => W.G(s.x0, s.y0)).filter(isFinite); SFX.swish(); await tw(W, { ovA: 1, duration: AUTO ? 0.05 : 0.6 }); SFX.chime(); if (!AUTO) FX.burst('MATCH!', { x: 30, y: 30, size: 120, fill: C.kin }); }
function fieldSet(W, F, G, v, o = {}) { Object.assign(W, { F, G, sols: [], ov: [], ovA: 0, fam: o.fam || [], res: o.res || null, seed: null, tapOn: false, taps: 0, rd: null, cap: o.cap || '', ic: null, icLab: '', Gjump: o.jump }); planeView(W, ...v); if (o.fx) W.pl.fx = o.fx; if (o.ax) W.pl.ax = o.ax;
  W.onTap = (x, y) => { if (!W.tapOn || !W.F) return; let px = x, py = y; if (W.ic && Math.hypot(x - W.ic[0], y - W.ic[1]) < (W.pl.x1 - W.pl.x0) * 0.08) [px, py] = W.ic; else if (W.ic) { SFX.boing(); return; } release(W, px, py); }; }
const piLab9 = (x) => { const k = x / PI; for (const [v, t] of [[0, '0'], [1, 'π'], [0.5, 'π/2'], [0.25, 'π/4'], [1 / 3, 'π/3'], [2, '2π'], [-0.5, '−π/2'], [-1, '−π']]) if (Math.abs(k - v) < 1e-9) return t; return fmtN(x, 2); };

/* ---------- tower: order and degree ---------- */
const PR = ['y', 'y′', 'y″', 'y‴', 'y⁗'];
MINI.tower = {
  view: { w: 12, h: 8 },
  init(W) { Object.assign(W, { terms: [], hi: -1, pick: null, show: 0, kimCorner: false, eq: '' }); },
  draw(W) {
    const cw = Math.min(SW / 5.6, 120), x0 = SW / 2 - cw * 2.5, base = SH - 46;
    D.text(W.eq, SW / 2, 30, { size: clamp(SW / 32, 14, 20), w: 800 });
    for (let k = 0; k <= 4; k++) { const x = x0 + k * cw + cw / 2, ts = W.terms.filter((t) => t.d === k), on = W.pick === k;
      ctx.fillStyle = on ? C['kin'] : C.paper; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(x - cw * 0.42, base, cw * 0.84, 30); ctx.strokeRect(x - cw * 0.42, base, cw * 0.84, 30); D.text(k === 0 ? 'y' : 'order ' + k, x, base + 20, { size: 12.5, w: 800 });
      ts.forEach((t, i) => { const hgt = 28 + 16 * Math.min(t.p || 1, 5), y = base - 8 - i * (hgt + 10) - hgt; ctx.fillStyle = t.cage ? C.sakura : k ? C['sora-tint'] : C.panel; ctx.fillRect(x - cw * 0.38, y, cw * 0.76, hgt); ctx.strokeRect(x - cw * 0.38, y, cw * 0.76, hgt);
        if (t.cage) { ctx.save(); ctx.strokeStyle = C.beni; ctx.lineWidth = 2.5; for (let b = 1; b < 5; b++) { const bx = x - cw * 0.38 + (cw * 0.76 * b) / 5; ctx.beginPath(); ctx.moveTo(bx, y - 4); ctx.lineTo(bx, y + hgt + 4); ctx.stroke(); } ctx.restore(); D.text(t.cage, x, y - 8, { size: 12, w: 800, col: C.beni, stroke: C.paper }); }
        D.text(t.lab, x, y + hgt / 2 + 5, { size: clamp(cw / 7, 12, 16), w: 800, stroke: C.paper });
        if (W.show && k === W.hi && !t.cage) D.text('power ' + (t.p || 1), x, y - 8, { size: 12, w: 800, col: C['matcha-deep'], stroke: C.paper }); }); }
  },
};
function towerSet(W, eq, terms) { Object.assign(W, { eq, terms, hi: Math.max(...terms.map((t) => t.d)), pick: null, show: 0 });
  W.onTap = (x, y, sx) => { const cw = Math.min(SW / 5.6, 120), x0 = SW / 2 - cw * 2.5; const k = Math.floor((sx - x0) / cw); if (k >= 0 && k <= 4) { W.pick = k; SFX.tick(); } }; }
/* terms: [d, p, label, cage?]   deg: number or 'not defined' */
function odQ(ex, n, q, eq, terms, ord, deg, o = {}) {
  const T = terms.map(([d, p, lab, cage]) => ({ d, p, lab, cage })), dOpts = deg === 'nd' ? ['not defined', '1', '2', '3'] : [String(deg), ...['1', '2', '3', 'not defined'].filter((s) => s !== String(deg))].slice(0, 4);
  return { ex, n, q, scene: 'tower', setup: (W) => towerSet(W, eq, T),
    parts: [{ k: 'task', q: 'Tap the column of the highest derivative', check: (W) => W.pick === ord, auto: (W) => (W.pick = ord), reveal: (W) => (W.pick = ord) },
      { k: 'num', q: 'Order = ?', a: ord, x: 'Highest derivative: ' + PR[ord] + ', so order ' + ord + '.' },
      { k: 'mcq', q: 'Degree = ?', o: dOpts, a: 0, act: async (W) => { W.show = 1; }, x: o.x || (deg === 'nd' ? 'A derivative is trapped inside ' + (T.find((t) => t.cage) || {}).cage + ': not a polynomial in the derivatives, so the degree is not defined.' : 'Polynomial in the derivatives; ' + PR[ord] + ' appears to the power ' + deg + '.') }, ...(o.post || [])],
    w: ['Order ' + ord + ', degree ' + (deg === 'nd' ? 'not defined' : deg)] };
}

/* ---------- question builders ---------- */
const mcqP = (q, o, x) => ({ k: 'mcq', q, o, a: 0, x });
/* general / particular solution.  o: { v view, steps, opts (first correct), seeds, ic:[x,y], icLab, cq:{q,a,show}, F, G } */
function solQ(ex, n, q, F, G, opts, o = {}) {
  const v = o.v || [-4, 4, -3, 3];
  const seeds = o.seeds || [[lerp(v[0], v[1], 0.35), lerp(v[2], v[3], 0.55)], [lerp(v[0], v[1], 0.65), lerp(v[2], v[3], 0.35)]];
  return { ex, n, q, scene: 'field', F, G, ic: o.ic, v, cval: o.cval, kim: o.kim,
    setup: (W) => fieldSet(W, F, G, v, { fx: o.fx, jump: o.jump, cap: o.cap }),
    parts: [...(o.steps || []), { k: 'mcq', q: o.mq || (o.ic ? 'General solution?' : 'General solution?'), o: opts, a: 0, x: o.x || plain(opts[0]) + '.' },
      ...(o.ic ? [{ k: 'task', q: 'Tap the pulsing point ' + (o.icLab || '') + ' to release the particular solution', pre: async (W) => { W.ic = o.ic; W.icLab = o.icLab || ''; W.tapOn = true; }, check: (W) => W.taps > 0, auto: (W) => release(W, ...o.ic) },
          ...(o.cq ? [{ k: 'num', q: o.cq.q, a: o.cq.a, show: o.cq.show, keys: o.cq.keys || 'π √', tol: o.cq.tol || 1e-4 * Math.max(1, Math.abs(o.cq.a)), x: o.cq.x || '' }] : []),
          ...(o.pq ? [mcqP('Particular solution?', o.pq, plain(o.pq[0]) + '.')] : [])]
        : [{ k: 'task', q: 'Tap the field to release 2 solution curves', pre: async (W) => { W.tapOn = true; }, check: (W) => W.taps >= 2, auto: async (W) => { for (const s of seeds) await release(W, ...s); } }]),
      { k: 'run', run: async (W) => { W.tapOn = false; await overlay(W); W.rd = [['red glow: ' + plain(o.ic && o.pq ? o.pq[0] : opts[0]).slice(0, 46), C.beni], ['blue: traced from the slope field', C.sora]]; await wait(AUTO ? 0.05 : 0.8); } }, ...(o.post || [])],
    w: [o.w || (o.ic && o.pq ? plain(o.pq[0]) : plain(opts[0]))] };
}
/* verify: plot the family (explicit) with a C slider, residual LHS − RHS flat at 0 */
function verQ(ex, n, q, o) {
  const v = o.v || [-4, 4, -3, 3];
  return { ex, n, q, scene: 'field', F: o.F, G: o.G, fam0: o.fam, res0: o.res, v, imp: o.imp, onlyLevel: o.onlyLevel, cs: o.cs, ok: o.ok,
    setup: (W) => { fieldSet(W, o.F || null, o.G || null, v, { fx: o.fx, cap: o.cap }); W.Cv = o.c0 != null ? o.c0 : 1; W.fam = o.fam ? [{ f: (x) => o.fam(x, W.Cv) }] : []; },
    parts: [...(o.steps || []),
      ...(o.fam && o.cs ? [{ k: 'task', q: 'Slide the constant: does the curve keep following the ' + (o.F ? 'slope marks' : 'equation') + '?', pre: async (W) => { W.sl = slider(o.cname || 'C', o.cs[0], o.cs[1], o.cs[2], W.Cv, (x) => (o.cname || 'C') + ' = ' + x, (x) => (W.Cv = x), o.cs[3]); }, check: (W) => W.Cv === o.cs[3], auto: (W) => { W.Cv = o.cs[3]; if (W.sl) W.sl.value = o.cs[3]; }, todo: 'Slide to ' + o.cs[3] + '.' }] : []),
      { k: 'run', run: async (W) => { if (W.sl && W.sl.parentNode) W.sl.parentNode.remove(); if (o.res) { W.res = (x) => o.res(x, W.Cv); SFX.swish(); } if (o.imp) { for (const s of o.imp) await release(W, ...s); await overlay(W); W.rd = [['blue: traced from the slope field', C.sora], ['red glow: the given curve', C.beni]]; } await wait(AUTO ? 0.05 : 0.8); } },
      { k: 'tf', q: o.tq || 'So the function is a solution of the equation.', a: o.ok !== false, x: o.tx || (o.imp ? 'The curve traced from the equation lands exactly on the given curve.' : o.res ? 'Substituting makes LHS − RHS = 0 identically: the red residual lies flat on the x-axis.' : 'The curve follows every slope mark, for every value of the constant.') }, ...(o.post || [])],
    w: [o.w || (o.ok === false ? 'Not a solution everywhere' : 'Verified')] };
}
/* a plain board question */
const bQ = (ex, n, q, parts, w, o = {}) => ({ ex, n, q, scene: o.scene || 'field', setup: o.setup || ((W) => fieldSet(W, o.F || null, o.G || null, o.v || [-4, 4, -3, 3], { fam: o.fam, fx: o.fx, ax: o.ax, cap: o.cap })), parts, w: [w], kim: o.kim });

/* =========================================================
   CLASS 12 · CHAPTER 7 · INTEGRALS — simulations
   integ : the integrand f (blue), its shaded area from a to b with optional Riemann rectangles,
           and an antiderivative F + C (red, dashed) whose rise F(b) − F(a) equals that area.
   Every indefinite answer carries F; the test page checks F′ = f numerically. Definite answers are checked by quadrature.
   ========================================================= */
const quad = (f, a, b, n = 20000) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h); return s * h; };
const riem = (f, a, b, n) => { const h = (b - a) / n; let s = 0; for (let i = 0; i < n; i++) s += f(a + (i + 0.5) * h); return s * h; };

MINI.integ = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { f: null, F: null, Fp: 0, C: 0, a: null, b: null, n: 0, shade: 0, ys: 1, kimCorner: true, kimX: 0.95, kimY: 0.85, read: true, P: null }); },
  draw(W) {
    MINI.plane.draw(W); if (!W.f) return; const [bx0, by0, bx1, by1] = viewBounds(0); const ys = W.ys, f = (x) => W.f(x) / ys;
    if (W.a != null && W.shade > 0) { const a = W.a, b = lerp(W.a, W.b, W.shade); for (const pos of [true, false]) { ctx.beginPath(); ctx.moveTo(...toS(a, 0)); for (let i = 0; i <= 240; i++) { const x = lerp(a, b, i / 240), y = f(x); const v = isFinite(y) ? (pos ? Math.max(0, y) : Math.min(0, y)) : 0; ctx.lineTo(...toS(x, clamp(v, by0 - 1, by1 + 1))); } ctx.lineTo(...toS(b, 0)); ctx.closePath(); ctx.fillStyle = pos ? C['sora-tint'] : C.sakura; ctx.globalAlpha = 0.8; ctx.fill(); ctx.globalAlpha = 1; } }
    if (W.a != null && W.n > 0) { const h = (W.b - W.a) / W.n; ctx.strokeStyle = C.ink; ctx.lineWidth = 1.2; for (let i = 0; i < W.n; i++) { const x = W.a + i * h, y = f(x + h / 2); if (!isFinite(y)) continue; const p = toS(x, 0), q = toS(x + h, clamp(y, by0 - 1, by1 + 1)); ctx.fillStyle = y >= 0 ? 'rgba(80,140,200,0.18)' : 'rgba(220,80,100,0.18)'; ctx.fillRect(p[0], Math.min(p[1], q[1]), q[0] - p[0], Math.abs(q[1] - p[1])); ctx.strokeRect(p[0], Math.min(p[1], q[1]), q[0] - p[0], Math.abs(q[1] - p[1])); } }
    drawCurve({ f, col: C.sora, w: 4, jump: (by1 - by0) * 0.4, n: 700 }, bx0, bx1, by0, by1);
    if (W.F && W.Fp > 0) { ctx.save(); ctx.globalAlpha = W.Fp; drawCurve({ f: (x) => (W.F(x) + W.C) / ys, col: C.beni, w: 3, dash: [9, 6], jump: (by1 - by0) * 0.4, n: 700 }, bx0, bx1, by0, by1); ctx.restore(); }
    if (W.a != null) for (const x of [W.a, W.b]) { const s = toS(x, 0); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(s[0], 0); ctx.lineTo(s[0], SH); ctx.stroke(); ctx.setLineDash([]); D.text(W.lab ? W.lab(x) : fmtN(x, 2), s[0], SH - 8, { size: 12, w: 800, stroke: C.paper }); }
    if (W.P != null && W.F) { const x = W.P, y = (W.F(x) + W.C) / ys, m = W.f(x) / ys; if (isFinite(y)) { D.line([[bx0, y + m * (bx0 - x)], [bx1, y + m * (bx1 - x)]], C['matcha-deep'], 2.5, [6, 5]); D.dot(x, y, 9, C.kin, C.ink, 2.5); const fy = f(x); if (isFinite(fy)) { D.line([[x, 0], [x, fy]], C.sora, 2, [3, 3]); D.dot(x, fy, 7, C.sora, C.ink); } } }
    if (W.read) { const L = []; if (W.a != null && W.shade > 0) { if (W.n > 0) L.push(['rectangles (n = ' + W.n + '): ≈ ' + fmtN(riem(W.f, W.a, W.b, W.n), 1), C.ink]); if (!W.hideArea) L.push(['area so far: ' + fmtN(quad(W.f, W.a, lerp(W.a, W.b, W.shade), 600), 4), C.sora]); if (W.F && W.Fp > 0.5) L.push(['F(b) − F(a) = ' + fmtN(W.F(W.b) - W.F(W.a), 4), C.beni]); }
      if (W.P != null && W.F) L.push(['slope of F at P = ' + fmtN(W.f(W.P), 3) + ' = height of f', C['matcha-deep']]);
      if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col })); }
      if (W.cap) D.text(W.cap, SW * 0.46, SH - 26, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] }); }
  },
};
/* set up the view so f (and F, when shown) fit; tall ranges get a scaled y-axis */
function integSet(W, f, F, x0, x1, o = {}) {
  const v = []; for (let i = 0; i <= 300; i++) { const x = lerp(x0, x1, i / 300); for (const g of [f, ...(o.withF && F ? [F] : [])]) { const y = g(x); if (isFinite(y)) v.push(y); } } v.sort((p, q) => p - q);
  let lo = v.length ? v[Math.floor(v.length * 0.04)] : -1, hi = v.length ? v[Math.floor(v.length * 0.96)] : 1; if (o.y) [lo, hi] = o.y; lo = Math.min(lo, 0); hi = Math.max(hi, 0); if (!(hi > lo)) hi = lo + 1;
  const ys = (hi - lo) / (x1 - x0) > 1.3 ? (hi - lo) / ((x1 - x0) * 0.62) : 1; Object.assign(W, { f, F, ys, Fp: o.Fp || 0, C: 0, a: o.ab ? o.ab[0] : null, b: o.ab ? o.ab[1] : null, shade: o.shade || 0, n: 0, P: null, lab: o.lab, cap: o.cap || '' });
  const pad = ((hi - lo) / ys) * 0.15 + 0.2; planeView(W, x0, x1, lo / ys - pad, hi / ys + pad); W.pl.fy = ys === 1 ? null : (y) => fmtN(y * ys, Math.abs(y * ys) >= 10 ? 1 : 2); if (o.fx) W.pl.fx = o.fx;
}
async function shadeRun(W, d = 1.2) { W.shade = 0; SFX.swish(); await tw(W, { shade: 1, duration: AUTO ? 0.05 : d, ease: 'power1.inOut' }); }
async function showF(W) { SFX.whoosh(); await tw(W, { Fp: 1, duration: AUTO ? 0.05 : 0.7 }); }
const piLab7 = (x) => { const k = x / Math.PI; for (const [v, t] of [[0, '0'], [1, 'π'], [0.5, 'π/2'], [0.25, 'π/4'], [1 / 3, 'π/3'], [1 / 6, 'π/6'], [2, '2π'], [-0.5, '−π/2'], [-0.25, '−π/4'], [1.5, '3π/2']]) if (Math.abs(k - v) < 1e-9) return t; return fmtN(x, 2); };

/* ---------- question builders ---------- */
/* indefinite integral: pick F (first option correct), then watch F rise by exactly the shaded area */
function aQ(ex, n, q, f, F, opts, o = {}) {
  const v = o.view || [-3, 3], ab = o.ab || [lerp(v[0], v[1], 0.3), lerp(v[0], v[1], 0.7)];
  return { ex, n, q, scene: 'integ', f, F, ab, pts: o.pts,
    setup: (W) => integSet(W, f, F, v[0], v[1], { ab, y: o.y, cap: o.cap }),
    parts: [...(o.steps || []), { k: 'mcq', q: o.mq || '∫ = ? (+ C)', o: opts, a: 0, x: o.x || plain(opts[0]) + ' + C.' },
      { k: 'run', run: async (W) => { await showF(W); W.P = ab[0]; await shadeRun(W); W.P = null; await wait(AUTO ? 0.05 : 0.6); } }, ...(o.post || [])],
    w: [o.w || '∫ = ' + plain(opts[0]) + ' + C'] };
}
/* definite integral: Riemann slider then the exact value */
function vQ(ex, n, q, f, a, b, val, show, o = {}) {
  const v = o.view || [Math.min(a, b) - (Math.abs(b - a) * 0.25 + 0.2), Math.max(a, b) + (Math.abs(b - a) * 0.25 + 0.2)];
  return { ex, n, q, scene: 'integ', f, a, b, val,
    setup: (W) => { integSet(W, f, null, v[0], v[1], { ab: [a, b], y: o.y, lab: o.lab, fx: o.fx, cap: o.cap }); W.hideArea = true; },
    parts: [...(o.steps || []),
      ...(o.noRiem ? [{ k: 'run', run: async (W) => shadeRun(W) }] : [{ k: 'task', q: 'Slide n up to 40 rectangles and watch the sum settle', pre: async (W) => { W.shade = 1; W.nsl = slider('rectangles n', 1, 40, 1, 1, (v) => 'n = ' + v, (v) => { W.n = v; }); }, check: (W) => W.n >= 40, auto: (W) => { W.n = 40; if (W.nsl) W.nsl.value = 40; } }]),
      { k: 'num', q: o.nq || 'Exact value = ?' + (o.dec ? ' (2 decimals)' : ''), a: val, show, keys: o.keys || 'π √', tol: o.dec ? 0.006 : o.tol || 1e-4 * Math.max(1, Math.abs(val)), pre: async (W) => { if (W.nsl && W.nsl.parentNode) W.nsl.parentNode.remove(); }, act: async (W) => { W.hideArea = false; SFX.pop(); }, x: o.x || '= ' + show + (o.dec ? '' : ' ≈ ' + fmtN(val, 4)) + '.' }, ...(o.post || [])],
    w: [o.w || '= ' + show] };
}
const mcqP = (q, o, x) => ({ k: 'mcq', q, o, a: 0, x });

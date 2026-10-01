/* =========================================================
   CLASS 12 · CHAPTER 6 · APPLICATION OF DERIVATIVES — simulations
   (uses ch12/sims.js calc scene, c12ch5/sims.js helpers, c12ch3/sims.js builders)
   rate : living pictures of related rates (ripple, cube, balloon, ladder, cone tank, lamp-post shadow, rectangle, sand pile, cylinder tank)
   mono : y = f(x) with a sign strip of f′ underneath (green rising, red falling) and turning-point markers
   opt  : an optimisation playground: a picture on the left driven by x, the objective graph on the right
   ========================================================= */
const R2 = Math.SQRT2, R3 = Math.sqrt(3);

/* =============== RATE =============== */
MINI.rate = {
  view: { w: 12, h: 7 },
  init(W) { Object.assign(W, { kind: 'circle', v: 1, lines: [], kimCorner: true, kimX: 0.95, ph: 0 }); },
  tick(W) { W.ph = (W.ph + 0.016) % 1; },
  draw(W) {
    const k = W.kind, v = W.v, ink = C.ink; const P = (x, y) => toS(x, y); const S = sc();
    const poly = (pts, fill, stroke = ink, lw = 2.5) => { ctx.beginPath(); pts.forEach((p, i) => { const s = P(...p); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } };
    if (k === 'circle') { const sc0 = W.scale || 0.35; for (let i = 0; i < 3; i++) { const r = v * sc0 * (1 - i * 0.25 + 0.06 * Math.sin((W.ph + i / 3) * 6.28)); D.circleW(-1.5, 0, Math.max(0.05, r), i ? null : C['sora-tint'], i ? C.sora : ink, i ? 1.5 : 2.5); } D.line([[-1.5, 0], [-1.5 + v * sc0, 0]], C.beni, 3); D.textW('r = ' + fmtN(v, 2), -1.5 + (v * sc0) / 2, 0.35, { size: 14, w: 800, stroke: C.paper }); }
    if (k === 'cube' || k === 'rect') { const s = Math.min(3.2, v * (W.scale || 0.25)), h = k === 'rect' ? Math.min(3, (W.v2 || 1) * (W.scale || 0.25)) : s; const x0 = -1.5 - s / 2, y0 = -h / 2; poly([[x0, y0], [x0 + s, y0], [x0 + s, y0 + h], [x0, y0 + h]], C['sora-tint']); if (k === 'cube') { const d = s * 0.4; poly([[x0, y0 + h], [x0 + d, y0 + h + d], [x0 + s + d, y0 + h + d], [x0 + s, y0 + h]], C['matcha-tint']); poly([[x0 + s, y0], [x0 + s + d, y0 + d], [x0 + s + d, y0 + h + d], [x0 + s, y0 + h]], C.sakura); } D.textW((k === 'cube' ? 'x = ' : 'x = ') + fmtN(v, 2), x0 + s / 2, y0 - 0.4, { size: 14, w: 800, stroke: C.paper }); if (k === 'rect') D.textW('y = ' + fmtN(W.v2, 2), x0 - 0.25, y0 + h / 2, { size: 14, w: 800, align: 'right', stroke: C.paper }); }
    if (k === 'sphere') { const r = Math.min(2.8, v * (W.scale || 0.15)); const c = P(-1.5, 0); const g = ctx.createRadialGradient(c[0] - r * S * 0.3, c[1] - r * S * 0.3, 2, c[0], c[1], r * S); g.addColorStop(0, C.panel); g.addColorStop(1, C.sakura); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c[0], c[1], r * S, 0, 7); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.stroke(); D.line([[-1.5, -r], [-1.5, -r - 0.8]], ink, 2); D.textW('r = ' + fmtN(v, 2), -1.5, 0, { size: 14, w: 800, stroke: C.paper }); }
    if (k === 'ladder') { const L = W.L || 5, x = v, y = Math.sqrt(Math.max(0, L * L - x * x)), s = 0.55, ox = -4, oy = -2.6; D.line([[ox, oy], [ox, oy + 5.4]], ink, 4); D.line([[ox, oy], [ox + 6, oy]], ink, 4); D.line([[ox + x * s, oy], [ox, oy + y * s]], C.kin, 7); D.line([[ox + x * s, oy], [ox, oy + y * s]], ink, 1.5); D.textW('x = ' + fmtN(x, 2), ox + (x * s) / 2, oy - 0.45, { size: 13, w: 800 }); D.textW('y = ' + fmtN(y, 2), ox - 0.15, oy + (y * s) / 2, { size: 13, w: 800, align: 'right' }); }
    if (k === 'cone' || k === 'sand') { const sc0 = W.scale || 0.5, h = v * sc0, rr = (k === 'cone' ? 0.5 : 6) * h, top = 2.6; if (k === 'cone') { const H = 5.2; poly([[-1.5, top - H], [-1.5 - H * 0.5, top], [-1.5 + H * 0.5, top]], null, ink, 2.5); poly([[-1.5, top - H], [-1.5 - rr, top - H + h], [-1.5 + rr, top - H + h]], C['sora-tint'], C.sora, 2); D.textW('h = ' + fmtN(v, 2), -1.5, top - H + h + 0.3, { size: 13, w: 800, stroke: C.paper }); } else { const base = -2.4, hh = Math.min(4, h), r6 = Math.min(5, hh * 6 * 0.25); poly([[-1.5 - r6, base], [-1.5 + r6, base], [-1.5, base + hh]], C['kin-tint']); D.line([[-1.5, base + 4.8], [-1.5, base + hh]], C.kin, 2, [3, 4]); D.textW('h = ' + fmtN(v, 2) + ', r = 6h', -1.5, base - 0.4, { size: 13, w: 800 }); } }
    if (k === 'shadow') { const ox = -5, oy = -2.4, s = 0.9, l = v; D.line([[ox, oy], [ox, oy + 6 * 0.75]], ink, 5); D.dot(ox, oy + 6 * 0.75, 9, C.kin, ink); const m = ox + l * s, sh = l / 2; D.line([[m, oy], [m, oy + 2 * 0.75]], C.sora, 6); D.line([[ox, oy + 6 * 0.75], [m + sh * s, oy]], C.kin, 1.5, [5, 4]); D.line([[m, oy], [m + sh * s, oy]], C.beni, 6); D.line([[ox - 0.5, oy], [ox + 9.5, oy]], ink, 2); D.textW('l = ' + fmtN(l, 2), (ox + m) / 2, oy - 0.45, { size: 13, w: 800 }); D.textW('s = ' + fmtN(sh, 2), m + (sh * s) / 2, oy - 0.45, { size: 13, w: 800, col: C.beni }); }
    if (k === 'cyl') { const h = Math.min(4.6, v * (W.scale || 0.5)); const x0 = -3.2, x1 = 0.2, b = -2.4; poly([[x0, b], [x1, b], [x1, b + h], [x0, b + h]], C['kin-tint'], null); D.line([[x0, b + 5], [x0, b], [x1, b], [x1, b + 5]], ink, 2.5); D.textW('h = ' + fmtN(v, 2), (x0 + x1) / 2, b + h + 0.3, { size: 13, w: 800 }); }
    // readouts
    const L = W.lines || []; const bx = toS(1.4, 2.7); L.forEach(([t, col], i) => D.text(t, bx[0], bx[1] + i * 22, { size: 15, w: 800, align: 'left', col: col || ink }));
  },
};
function rateSet(W, kind, v, lines, o = {}) { Object.assign(W, { kind, v, lines: lines || [] }, o); }
/* scrub a quantity with a slider; lines(v) gives the readouts */
function rateSlider(W, label, lo, hi, step, fmtF, lines) { return slider(label, lo, hi, step, W.v, fmtF, (v) => { W.v = v; if (lines) W.lines = lines(v); W.moved = (W.moved || 0) + 1; }); }

/* =============== MONO: sign strip of f′ =============== */
MINI.mono = {
  view: { w: 12, h: 8 },
  init(W) { MINI.calc.init(W); Object.assign(W, { crit: [], strip: 1, marks: [], dom: null }); },
  tick(W) { if (MINI.calc.tick) MINI.calc.tick(W); },
  draw(W) {
    MINI.calc.draw(W); const [bx0, by0, bx1] = viewBounds(0); const F = W.F; if (!F) return; const y = SH - 26, n = 240;
    if (W.strip > 0) { for (let i = 0; i < n; i++) { const x = lerp(bx0, bx1, (i + 0.5) / n); if (W.dom && (x < W.dom[0] || x > W.dom[1])) continue; if (x > lerp(bx0, bx1, W.strip)) break; const d = ND(F, x); if (!isFinite(d)) continue; ctx.fillStyle = Math.abs(d) < 1e-9 ? C.tone : d > 0 ? C['matcha-deep'] : C.beni; ctx.fillRect((i / n) * SW, y - 7, SW / n + 1, 14); }
      D.text("f′ > 0 rising", 10, y - 14, { size: 11, w: 800, align: 'left', col: C['matcha-deep'], stroke: C.paper }); D.text("f′ < 0 falling", SW - 70, y - 14, { size: 11, w: 800, align: 'right', col: C.beni, stroke: C.paper }); }
    for (const c of W.crit) { const s = toS(c, 0); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(s[0], 0); ctx.lineTo(s[0], SH); ctx.stroke(); ctx.setLineDash([]); D.text(W.critLab ? W.critLab(c) : cell(c), s[0], y + 20, { size: 11, w: 800, stroke: C.paper }); }
    for (const m of W.marks) { const v = F(m.x); if (!isFinite(v)) continue; const s = toS(m.x, v); D.star(s[0], s[1] + (m.kind === 'max' ? -16 : 16), 11, 8, m.kind === 'max' ? C.kin : m.kind === 'min' ? C['sora-tint'] : C.panel); D.text(m.kind === 'max' ? 'MAX' : m.kind === 'min' ? 'MIN' : 'flat', s[0], s[1] + (m.kind === 'max' ? -32 : 36), { size: 11, w: 800, stroke: C.paper }); }
  },
};
function monoSet(W, f, x0, x1, o = {}) { calcView(W, f, x0, x1, { y: o.y, fit: true }); W.crit = o.crit || []; W.critLab = o.critLab; W.marks = []; W.dom = o.dom || null; W.strip = o.strip != null ? o.strip : 1; W.a = o.a != null ? o.a : null; W.tan = !!o.tan; W.read = W.a != null; if (W.a != null) grabCalc(W, { snap: o.snap }); if (o.cap) W.pl.caption = o.cap; }
async function stripRun(W) { W.strip = 0; SFX.swish(); await tw(W, { strip: 1, duration: AUTO ? 0.05 : 1.4, ease: 'none' }); }
/* classify turning points of f at the given critical points */
const turn = (f, c, h = 1e-3) => { const l = ND(f, c - h), r = ND(f, c + h); return l > 0 && r < 0 ? 'max' : l < 0 && r > 0 ? 'min' : 'neither'; };
/* monotonic intervals: labels[i] describes the interval between bounds[i] and bounds[i + 1] */
function monoQ(ex, n, q, f, view, bounds, labels, o = {}) {
  const mids = bounds.slice(0, -1).map((b, i) => { if (!isFinite(b) && !isFinite(bounds[i + 1])) return 0; const lo = isFinite(b) ? b : bounds[i + 1] - 1, hi = isFinite(bounds[i + 1]) ? bounds[i + 1] : b + 1; return (lo + hi) / 2; });
  const inc = labels.filter((_, i) => ND(f, mids[i]) > 0), dec = labels.filter((_, i) => ND(f, mids[i]) < 0);
  return { ex, n, q, scene: 'mono', f, inc, dec, mids,
    setup: (W) => monoSet(W, f, view[0], view[1], { y: view.length > 2 ? [view[2], view[3]] : undefined, crit: bounds.filter(isFinite), critLab: o.critLab, strip: 0, dom: o.dom, cap: o.cap }),
    parts: [...(o.pre || []), { k: 'run', run: async (W) => { await stripRun(W); } },
      ...(o.only === 'dec' ? [] : [{ k: 'pick', q: o.iq || 'Where is f increasing? (pick every interval)', pool: labels, a: inc, brace: false, x: inc.length ? 'f′ > 0 on ' + inc.join(' ∪ ') + '.' : 'Nowhere.' }]),
      ...(o.only === 'inc' ? [] : [{ k: 'pick', q: o.dq || 'Where is f decreasing?', pool: labels, a: dec, brace: false, x: dec.length ? 'f′ < 0 on ' + dec.join(' ∪ ') + '.' : 'Nowhere.' }]), ...(o.post || [])],
    w: [o.w || (inc.length ? 'Increasing on ' + inc.join(' ∪ ') : 'never increasing') + (o.only === 'inc' ? '' : '; ' + (dec.length ? 'decreasing on ' + dec.join(' ∪ ') : 'never decreasing'))] };
}

/* =============== OPT: optimisation playground =============== */
MINI.opt = {
  view: { w: 12, h: 7 },
  init(W) { Object.assign(W, { x: 1, lo: 0, hi: 2, F: null, pic: null, ylo: 0, yhi: 1, kimCorner: true, kimX: 0.95, flab: 'V', xlab: 'x', best: null, found: false }); },
  draw(W) {
    if (W.pic) { ctx.save(); W.pic(W, W.x); ctx.restore(); }
    // graph panel on the right
    const gx0 = SW * (SW > 600 ? 0.56 : 0.5), gx1 = SW - 12, gy0 = 16, gy1 = SH * 0.62; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0); ctx.strokeRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
    const X = (x) => gx0 + 8 + ((x - W.lo) / (W.hi - W.lo)) * (gx1 - gx0 - 16), Y = (y) => gy1 - 10 - ((y - W.ylo) / (W.yhi - W.ylo)) * (gy1 - gy0 - 30);
    ctx.strokeStyle = C.sora; ctx.lineWidth = 3; ctx.beginPath(); let pen = false; for (let i = 0; i <= 200; i++) { const x = lerp(W.lo, W.hi, i / 200), y = W.F(x); if (!isFinite(y)) { pen = false; continue; } const sx = X(x), sy = clamp(Y(y), gy0, gy1); pen ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy); pen = true; } ctx.stroke();
    const fy = W.F(W.x); if (isFinite(fy)) { ctx.strokeStyle = C.ink; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(W.x), gy1); ctx.lineTo(X(W.x), Y(fy)); ctx.stroke(); ctx.setLineDash([]); ctx.beginPath(); ctx.arc(X(W.x), Y(fy), 8, 0, 7); ctx.fillStyle = W.found ? C.kin : C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); if (W.found) D.star(X(W.x), Y(fy) - 18, 10, 8, C.kin); }
    D.text(W.xlab + ' = ' + fmtN(W.x, 3), gx0 + 10, gy1 + 22, { size: 14, w: 800, align: 'left' }); D.text(W.flab + ' = ' + fmtN(fy, 3), gx0 + 10, gy1 + 42, { size: 14, w: 800, align: 'left', col: C.beni });
    D.text(W.flab + ' against ' + W.xlab, (gx0 + gx1) / 2, gy0 + 16, { size: 11, w: 700, col: C['ink-muted'] });
  },
};
function optSet(W, F, lo, hi, x, pic, o = {}) { let a = Infinity, b = -Infinity; for (let i = 0; i <= 200; i++) { const y = F(lerp(lo, hi, i / 200)); if (isFinite(y)) { a = Math.min(a, y); b = Math.max(b, y); } } const pad = (b - a) * 0.1 || 1; Object.assign(W, { F, lo, hi, x, pic, ylo: o.ylo != null ? o.ylo : a - pad, yhi: o.yhi != null ? o.yhi : b + pad, flab: o.flab || 'V', xlab: o.xlab || 'x', found: false }); }
/* find the best x with a slider, then answer */
function optQ(ex, n, q, F, lo, hi, best, pic, o = {}) {
  const step = o.step || (hi - lo) / 100;
  return { ex, n, q, scene: 'opt', F, best, kind: o.min ? 'min' : 'max',
    setup: (W) => optSet(W, F, lo, hi, o.x0 != null ? o.x0 : lo + (hi - lo) * 0.15, pic, o),
    parts: [...(o.pre || []),
      { k: 'task', q: 'Slide ' + (o.xlab || 'x') + ' to make ' + (o.flab || 'V') + ' as ' + (o.min ? 'small' : 'large') + ' as possible', pre: async (W) => { W.sl = slider(o.xlab || 'x', lo, hi, step, W.x, (v) => fmtN(v, 3), (v) => { W.x = v; }); }, check: (W) => Math.abs(W.x - best) <= step * 1.01, auto: (W) => { W.x = best; if (W.sl) W.sl.value = best; }, reveal: (W) => { W.x = best; }, x: 'The ' + (o.min ? 'lowest' : 'highest') + ' point of the graph.', act: async (W) => { W.found = true; SFX.chime(); } },
      ...(o.fields ? [{ k: 'fields', q: o.fq || 'The exact answer', f: o.fields, keys: o.keys, pre: async (W) => { if (W.sl && W.sl.parentNode) W.sl.parentNode.remove(); W.x = best; W.found = true; }, x: o.x || '' }] : []), ...(o.post || [])],
    w: [o.w || q] };
}
/* small drawing helpers for pictures (screen space, left panel) */
const LP = () => ({ cx: SW * (SW > 600 ? 0.27 : 0.25), cy: SH * 0.42, s: Math.min(SW * 0.022, SH * 0.045) });

/* =========================================================
   CLASS 12 · CHAPTER 10 · VECTOR ALGEBRA — simulations
   vec : arrows in the plane (drag the heads, snapping to the grid or to compass bearings)
         or in space (drag to orbit). Parallelograms, triangles, angle arcs, projection shadows,
         a cross-product arrow standing up from its parallelogram, and a live readout.
   V   : small vector toolkit (add, sub, dot, cross, norm, unit, angle, section).
   ========================================================= */
const V = {
  add: (a, b) => a.map((x, i) => x + b[i]), sub: (a, b) => a.map((x, i) => x - b[i]), mul: (k, a) => a.map((x) => k * x),
  dot: (a, b) => a.reduce((s, x, i) => s + x * b[i], 0), cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  norm: (a) => Math.hypot(...a), unit: (a) => V.mul(1 / V.norm(a), a), ang: (a, b) => Math.acos(clamp(V.dot(a, b) / (V.norm(a) * V.norm(b)), -1, 1)),
  sec: (p, q, m, n) => p.map((x, i) => (m * q[i] + n * x) / (m + n)), secX: (p, q, m, n) => p.map((x, i) => (m * q[i] - n * x) / (m - n)),
};
const v3 = (a) => (a.length === 2 ? [a[0], a[1], 0] : a);
/* "2î − ĵ + 3k̂" */
function vs(a, units = ['î', 'ĵ', 'k̂']) { let s = ''; a.forEach((x, i) => { if (Math.abs(x) < 1e-12) return; const c = fracStr(Math.abs(x)), k = c === '1' ? '' : c; s += (s ? (x < 0 ? ' − ' : ' + ') : x < 0 ? '−' : '') + k + units[i]; }); return s || '0⃗'; }
/* "2√5" from an integer square (or "√12.5") */
function rt(n) { if (Math.abs(n - Math.round(n)) > 1e-9) return '√' + fmtN(n, 3); n = Math.round(n); let o = 1, i = n; for (let k = Math.floor(Math.sqrt(n)); k > 1; k--) if (n % (k * k) === 0) { o = k; i = n / (k * k); break; } return i === 1 ? String(o) : (o === 1 ? '' : o) + '√' + i; }

MINI.vec = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { d3: false, yaw: -0.62, pitch: 0.38, R: 5, arr: [], para: [], tri: [], ang: [], proj: null, dots: [], rd: null, cap: '', kimCorner: true, kimX: 0.95, spun: 0, heads: [], nb: null }); },
  pr(W, p) { p = v3(p); if (!W.d3) return [p[0], p[1]]; const c = Math.cos(W.yaw), s = Math.sin(W.yaw), x1 = p[0] * c - p[1] * s, y1 = p[0] * s + p[1] * c; return [y1 * W.s, (p[2] * Math.cos(W.pitch) - x1 * Math.sin(W.pitch)) * W.s]; },
  draw(W) {
    const pr = (p) => MINI.vec.pr(W, p);
    if (!W.d3) MINI.plane.draw(W);
    else { const R = W.R; for (const [n, d, col] of [['x', [1, 0, 0], C.beni], ['y', [0, 1, 0], C['matcha-deep']], ['z', [0, 0, 1], C.sora]]) { const a = pr(d.map((v) => -v * R)), b = pr(d.map((v) => v * R)); D.line([a, b], col, 2, [2, 0]); const sa = toS(...a), sb = toS(...b); ctx.fillStyle = col; D.head(sb[0], sb[1], Math.atan2(sb[1] - sa[1], sb[0] - sa[0]), 8); D.text(n.toUpperCase(), sb[0] + (sb[0] - sa[0]) * 0.05, sb[1] + (sb[1] - sa[1]) * 0.05 + 4, { size: 13, w: 800, col, stroke: C.paper }); for (let k = -R + 1; k < R; k++) { if (!k) continue; const t = toS(...pr(d.map((v) => v * k))); ctx.fillRect(t[0] - 1.5, t[1] - 1.5, 3, 3); } } const o = toS(...pr([0, 0, 0])); D.text('O', o[0] - 9, o[1] + 14, { size: 11, w: 700, col: C['ink-muted'] }); }
    const poly = (ps, fill, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = fill; ctx.beginPath(); ps.forEach((q, i) => { const s = toS(...pr(q)); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); ctx.fill(); ctx.restore(); };
    for (const q of W.para) { const o = v3(q.o || [0, 0, 0]), u = v3(q.u), w = v3(q.v), k = q.p == null ? 1 : q.p; if (k <= 0) continue; poly([o, V.add(o, V.mul(k, u)), V.add(V.add(o, V.mul(k, u)), V.mul(k, w)), V.add(o, V.mul(k, w))], q.col || C.kin, q.a || 0.35); }
    for (const t of W.tri) poly(t.pts.map(v3), t.col || C['sora-tint'], t.a || 0.5);
    for (const g of W.ang) { const o = v3(g.o || [0, 0, 0]), u = V.unit(v3(g.u)), w = V.unit(v3(g.v)), th = V.ang(u, w), r = g.r || 0.8; if (!(th > 1e-6)) continue; const perp = V.unit(V.sub(w, V.mul(Math.cos(th), u))); ctx.strokeStyle = g.col || C.kin; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const t = (th * i) / 30, p = V.add(o, V.mul(r, V.add(V.mul(Math.cos(t), u), V.mul(Math.sin(t), perp)))); const s = toS(...pr(p)); i ? ctx.lineTo(...s) : ctx.moveTo(...s); } ctx.stroke(); if (g.t) { const m = V.add(o, V.mul(r * 1.35, V.unit(V.add(u, w)))), s = toS(...pr(m)); D.text(g.t, s[0], s[1] + 4, { size: 13, w: 800, col: C.ink, stroke: C.paper }); } }
    if (W.proj) { const { o = [0, 0, 0], a, b } = W.proj, O = v3(o), A = v3(a), B = v3(b), k = V.dot(A, B) / V.dot(B, B), F = V.add(O, V.mul(k, B)); const far = V.mul(Math.max(3, Math.abs(k) + 1.5) / V.norm(B), B); D.line([pr(V.sub(O, far)), pr(V.add(O, far))], C['ink-muted'], 1.5, [6, 5]); D.line([pr(V.add(O, A)), pr(F)], C.ink, 1.5, [4, 4]); const s0 = toS(...pr(O)), s1 = toS(...pr(F)); D.arrow(s0[0], s0[1], s1[0], s1[1], C['matcha-deep'], 6, 13); }
    for (const q of W.dots) { const s = toS(...pr(q.p)); ctx.beginPath(); ctx.arc(s[0], s[1], q.r || 6, 0, 7); ctx.fillStyle = q.col || C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); if (q.t) D.text(q.t, s[0] + 9, s[1] - 8, { size: 13, w: 800, align: 'left', stroke: C.paper }); }
    for (const a of W.arr) { const k = a.p == null ? 1 : a.p; if (k <= 0 || a.hide) continue; const o = v3(a.o || [0, 0, 0]), e = V.add(o, V.mul(k, v3(a.v))), s0 = toS(...pr(o)), s1 = toS(...pr(e)); if (a.dash) { ctx.save(); ctx.setLineDash(a.dash); D.line([pr(o), pr(e)], a.col || C.sora, a.w || 3.5); ctx.restore(); ctx.fillStyle = a.col || C.sora; D.head(s1[0], s1[1], Math.atan2(s1[1] - s0[1], s1[0] - s0[0]), 9); } else D.arrow(s0[0], s0[1], s1[0], s1[1], a.col || C.sora, a.w || 4, 13);
      if (a.t && k >= 1) { const m = V.add(o, V.mul(a.tp || 0.55, v3(a.v))), s = toS(...pr(m)); const dx = s1[0] - s0[0], dy = s1[1] - s0[1], L = Math.hypot(dx, dy) || 1; D.text(a.t, s[0] - (dy / L) * 15, s[1] + (dx / L) * 15 + 4, { size: 14, w: 800, col: a.col || C.sora, stroke: C.paper }); } }
    for (const hd of W.heads) { const a = W.arr[hd.i]; if (!a) continue; const s = toS(...pr(V.add(v3(a.o || [0, 0, 0]), v3(a.v)))); ctx.beginPath(); ctx.arc(s[0], s[1], 11 + 2 * Math.sin(T * 5), 0, 7); ctx.strokeStyle = C.kin; ctx.lineWidth = 3; ctx.stroke(); }
    if (W.nb) { const s = toS(...pr([0, 0, 0])); const r = Math.min(SW, SH) * 0.08; D.text('N', s[0], s[1] - r * 4.3, { size: 14, w: 800, stroke: C.paper }); }
    const L = (typeof W.rd === 'function' ? W.rd() : W.rd || []).filter(Boolean); if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.5, SH - 14, { size: 12.5, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
/* set up the scene: 2D plane [x0,x1,y0,y1] or 3D with axis length R */
function vecSet(W, o = {}) {
  Object.assign(W, { arr: (o.arr || []).map((a) => ({ ...a })), para: o.para || [], tri: o.tri || [], ang: o.ang || [], proj: o.proj || null, dots: o.dots || [], rd: o.rd || null, cap: o.cap || '', heads: [], d3: !!o.d3, drags: [] });
  if (W.d3) { const R = o.R || 5; W.R = R; setView(10, 6.6, 0, 0.1); W.s = 3.4 / R; W.yaw = o.yaw != null ? o.yaw : -0.62; W.pitch = o.pitch != null ? o.pitch : 0.38; W.drags = [{ get: () => [W.yaw * 3, W.pitch * 3], r: 1e9, set: (x, y) => { const ny = x / 3, np = clamp(y / 3, -0.3, 1.3); W.spun += Math.abs(ny - W.yaw); W.yaw = ny; W.pitch = np; } }]; }
  else planeView(W, ...(o.v || [-5, 5, -3.5, 3.5]));
}
/* make arrow heads draggable in 2D: snap to the grid (or to bearings with polar: {step°, len step}) */
function dragHeads(W, idx, o = {}) {
  W.heads = idx.map((i) => ({ i })); W.drags = idx.map((i) => ({ get: () => { const a = W.arr[i], e = V.add(v3(a.o || [0, 0, 0]), v3(a.v)); return [e[0], e[1]]; }, r: 0.9,
    set: (x, y) => { const a = W.arr[i], O = v3(a.o || [0, 0, 0]); let vx = x - O[0], vy = y - O[1]; if (o.polar) { const [da, dl] = o.polar; let ang = Math.atan2(vy, vx), len = Math.hypot(vx, vy); ang = (Math.round(((ang * 180) / Math.PI) / da) * da * Math.PI) / 180; len = Math.max(dl, Math.round(len / dl) * dl); vx = len * Math.cos(ang); vy = len * Math.sin(ang); } else { const g = o.snap || 1; vx = Math.round(vx / g) * g; vy = Math.round(vy / g) * g; } if (Math.abs(vx - a.v[0]) > 1e-9 || Math.abs(vy - a.v[1]) > 1e-9) { a.v = [vx, vy, 0]; SFX.tick(); W.moved = (W.moved || 0) + 1; if (o.on) o.on(W); } } })); }
async function grow(W, i, d = 0.6) { const a = W.arr[i]; a.p = 0; SFX.whoosh(); await tw(a, { p: 1, duration: AUTO ? 0.05 : d, ease: 'power2.out' }); }
async function growAll(W, d = 0.5) { for (let i = 0; i < W.arr.length; i++) if (W.arr[i].p === 0) await grow(W, i, d); }
async function spin(W, by = 1.2) { SFX.swish(); await tw(W, { yaw: W.yaw + by, duration: AUTO ? 0.05 : 1.4, ease: 'power1.inOut' }); }
const A3 = (v, col, t, o) => ({ v, col, t, o, p: 0 });

/* ---------- question builders ---------- */
const mcqP = (q, o, x) => ({ k: 'mcq', q, o, a: 0, x });
const numP = (q, a, show, x, o = {}) => ({ k: 'num', q, a, show, x, keys: o.keys != null ? o.keys : '√ π', tol: o.tol || 1e-4 * Math.max(1, Math.abs(a)), ...o });
const fldP = (q, f, x, keys = '√') => ({ k: 'fields', q, f, x, keys });
const cmp = (a, shows, l = ['î', 'ĵ', 'k̂']) => a.map((x, i) => ({ l: l[i], a: x, show: shows ? shows[i] : fracStr(x) }));
const runP = (fn) => ({ k: 'run', run: fn });
/* a question whose scene is a vector picture: s = vecSet options; parts given */
const vQ = (ex, n, q, s, parts, w, o = {}) => ({ ex, n, q, scene: 'vec', kim: o.kim, setup: (W) => vecSet(W, typeof s === 'function' ? s() : s), parts: [runP(async (W) => { await growAll(W); if (W.d3 && !AUTO) await spin(W, 0.5); }), ...parts], w: [w] });
const bQ = (ex, n, q, parts, w, tag) => ({ ex, n, q, scene: 'board', setup: (W) => { W.tag = tag || n; W.sub = ex; }, parts, w: [w] });

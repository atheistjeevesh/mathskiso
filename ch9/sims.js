/* =========================================================
   CHAPTER 9 · STRAIGHT LINES — simulations
   MINI.lines = the coordinate plane + lines Ax + By + C = 0, a draggable "your line" (two handles or a pivot),
   slope triangles, perpendicular feet with live distance, mirror images and angle arcs.
   ========================================================= */
const L9 = {
  thru: (p, q) => ({ A: q[1] - p[1], B: p[0] - q[0], C: q[0] * p[1] - p[0] * q[1] }), // line through two points
  ps: (p, m) => (isFinite(m) ? { A: m, B: -1, C: p[1] - m * p[0] } : { A: 1, B: 0, C: -p[0] }), // point–slope
  slope: (l) => (Math.abs(l.B) < 1e-12 ? Infinity : -l.A / l.B),
  val: (l, p) => l.A * p[0] + l.B * p[1] + l.C,
  dist: (l, p) => Math.abs(L9.val(l, p)) / Math.hypot(l.A, l.B),
  foot: (l, p) => { const t = L9.val(l, p) / (l.A * l.A + l.B * l.B); return [p[0] - l.A * t, p[1] - l.B * t]; },
  image: (l, p) => { const t = L9.val(l, p) / (l.A * l.A + l.B * l.B); return [p[0] - 2 * l.A * t, p[1] - 2 * l.B * t]; },
  meet: (l1, l2) => { const d = l1.A * l2.B - l2.A * l1.B; if (Math.abs(d) < 1e-12) return null; return [(l1.B * l2.C - l2.B * l1.C) / d, (l2.A * l1.C - l1.A * l2.C) / d]; },
  same: (l1, l2, tol = 1e-6) => { const n1 = Math.hypot(l1.A, l1.B), n2 = Math.hypot(l2.A, l2.B); const a = [l1.A / n1, l1.B / n1, l1.C / n1], b = [l2.A / n2, l2.B / n2, l2.C / n2]; const s = a[0] * b[0] + a[1] * b[1] < 0 ? -1 : 1; return a.every((v, i) => Math.abs(v - s * b[i]) < tol); },
};
/* "3x − 4y + 18 = 0" with small integer coefficients when they are rational */
function eqStr(l) {
  let { A, B, C } = l; const lead = Math.abs(A) > 1e-12 ? A : B; [A, B, C] = [A / lead, B / lead, C / lead];
  let den = 1; for (const v of [A, B, C]) { const f = fracStr(v); if (f.includes('/')) den = lcm9(den, +f.split('/')[1]); }
  const ok = [A, B, C].every((v) => Math.abs(v * den - Math.round(v * den)) < 1e-6) && den < 1000;
  const fmt = (v) => (ok ? String(Math.round(Math.abs(v * den))) : fmtN(Math.abs(v * den), 3));
  const term = (v, s, first) => { if (Math.abs(v) < 1e-9) return ''; const c = fmt(v); const cs = s && c === '1' ? '' : c; return (first ? (v < 0 ? '−' : '') : v < 0 ? ' − ' : ' + ') + cs + s; };
  let out = term(A, 'x', true); out += term(B, 'y', !out); out += term(C, '', !out); return out + ' = 0';
}
const gcd9 = (a, b) => (b ? gcd9(b, a % b) : a); const lcm9 = (a, b) => (a * b) / gcd9(a, b);
const slopeStr = (m) => (!isFinite(m) ? 'undefined' : fracStr(m).replace('-', '−'));
const degOf = (m) => { let a = (Math.atan(m) * 180) / Math.PI; if (a < 0) a += 180; return a; };

MINI.lines = {
  view: { w: 12, h: 8 },
  init(W) {
    MINI.plane.init(W);
    Object.assign(W, { L: [], ul: null, tri: null, feet: [], mirrors: [], arcs: [], labs: [], read: true, kimCorner: true, kimX: 0.95, kimY: 0.85 });
  },
  tick(W) { if (W.tickV) W.tickV(); },
  draw(W) {
    MINI.plane.draw(W); const [bx0, by0, bx1, by1] = viewBounds(0);
    const seg = (l) => { const ps = []; if (Math.abs(l.B) > 1e-9) for (const x of [bx0, bx1]) ps.push([x, -(l.A * x + l.C) / l.B]); if (Math.abs(l.A) > 1e-9) for (const y of [by0, by1]) ps.push([-(l.B * y + l.C) / l.A, y]); const ins = ps.filter((p) => p[0] >= bx0 - 1e-6 && p[0] <= bx1 + 1e-6 && p[1] >= by0 - 1e-6 && p[1] <= by1 + 1e-6); ins.sort((a, b) => a[0] - b[0] || a[1] - b[1]); return ins.length >= 2 ? [ins[0], ins[ins.length - 1]] : null; };
    const drawL = (l) => { const s = seg(l); if (!s) return; const pr = l.p == null ? 1 : l.p; if (pr <= 0) return; const e = [lerp(s[0][0], s[1][0], pr), lerp(s[0][1], s[1][1], pr)]; ctx.save(); ctx.globalAlpha = l.a == null ? 1 : l.a; D.line([s[0], e], l.col || C.sora, l.w || 3, l.dash); ctx.restore(); if (l.t && pr >= 1) { const tp = l.tAt != null ? l.tAt : 0.82; const q = toS(lerp(s[0][0], s[1][0], tp), lerp(s[0][1], s[1][1], tp)); D.text(l.t, q[0], q[1] - 8, { size: 12, w: 800, col: l.col || C.sora, stroke: C.paper }); } };
    for (const l of W.L) drawL(l);
    for (const a of W.arcs) { const p = toS(a.x, a.y); ctx.strokeStyle = a.col || C.beni; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(p[0], p[1], a.r || 26, -a.a1, -a.a2, true); ctx.stroke(); if (a.t) { const m = (a.a1 + a.a2) / 2; D.text(a.t, p[0] + Math.cos(m) * ((a.r || 26) + 16), p[1] - Math.sin(m) * ((a.r || 26) + 16) + 4, { size: 12, w: 800, col: a.col || C.beni, stroke: C.paper }); } }
    const TR = typeof W.tri === 'function' ? W.tri() : W.tri; if (TR) { const [p, q] = TR; const r = [q[0], p[1]]; D.line([p, r], C.beni, 3, [6, 4]); D.line([r, q], C['matcha-deep'], 3, [6, 4]); const mr = toS((p[0] + r[0]) / 2, p[1]), mu = toS(q[0], (r[1] + q[1]) / 2); D.text('run ' + fmtN(q[0] - p[0], 2), mr[0], mr[1] + (q[1] > p[1] ? 16 : -8), { size: 12, w: 800, col: C.beni, stroke: C.paper }); D.text('rise ' + fmtN(q[1] - p[1], 2), mu[0] + (q[0] > p[0] ? 8 : -8), mu[1], { size: 12, w: 800, col: C['matcha-deep'], stroke: C.paper, align: q[0] > p[0] ? 'left' : 'right' }); }
    for (const f of W.feet) { const P = f.P(), Fp = L9.foot(f.l, P); D.line([P, Fp], C.beni, 3, [7, 5]); const s = toS(...Fp); const ang = Math.atan2(-f.l.A, f.l.B); ctx.save(); ctx.translate(s[0], s[1]); ctx.rotate(-ang); ctx.strokeStyle = C.ink; ctx.lineWidth = 1.5; const d = (L9.val(f.l, P) > 0 ? -1 : 1) * (f.l.B < 0 ? -1 : 1); ctx.strokeRect(0, d > 0 ? 0 : -9, 9, 9); ctx.restore(); D.dot(Fp[0], Fp[1], 5, C.kin, C.ink); const m = toS((P[0] + Fp[0]) / 2, (P[1] + Fp[1]) / 2); if (f.show !== false) D.text('d = ' + fmtN(L9.dist(f.l, P), 3), m[0] + 8, m[1], { size: 13, w: 800, col: C.beni, align: 'left', stroke: C.paper }); }
    for (const mi of W.mirrors) { const P = mi.P(), Q = L9.image(mi.l, P); const k = mi.k == null ? 1 : mi.k; D.line([P, [lerp(P[0], Q[0], k), lerp(P[1], Q[1], k)]], C.sakura, 2.5, [5, 4]); if (k >= 1) { D.dot(Q[0], Q[1], 7, C.sakura, C.ink); const s = toS(...Q); D.text("image (" + fmtN(Q[0], 2) + ', ' + fmtN(Q[1], 2) + ')', s[0] + 10, s[1] - 8, { size: 12, w: 800, align: 'left', stroke: C.paper }); } }
    if (W.ul) { const U = W.ul; const l = U.line(); const s = seg(l); if (s) D.line(s, U.ok ? C['matcha-deep'] : C.beni, 4); for (const hd of U.handles()) { const p = toS(...hd); ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, 7); ctx.fillStyle = C.kin; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); }
      if (W.read) { const m = L9.slope(l); const lines = [U.mode === 'pivot' ? 'θ = ' + fmtN(U.deg, 1) + '°' : 'slope ' + slopeStr(m), eqStr(l)]; const bw = Math.max(...lines.map((t) => t.length)) * 7.4 + 16; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, 42); ctx.strokeRect(8, 8, bw, 42); D.text(lines[0], 16, 25, { size: 13, w: 800, align: 'left', col: C.beni }); D.text(lines[1], 16, 43, { size: 13, w: 800, align: 'left' }); } }
    for (const t of W.labs) { const p = toS(typeof t.x === 'function' ? t.x() : t.x, typeof t.y === 'function' ? t.y() : t.y); D.text(typeof t.t === 'function' ? t.t() : t.t, p[0] + (t.dx || 0), p[1] + (t.dy || 0), { size: t.size || 12, w: 800, col: t.col || C.ink, stroke: C.paper, align: t.align || 'center' }); }
  },
};
/* the learner's line. mode 'two': two handles snapped to the grid; mode 'pivot': fixed point, rotate a handle (1° steps) */
function userLine(W, o = {}) {
  const snap = o.snap || 0.5; const sn = (v) => Math.round(v / snap) * snap;
  const U = { mode: o.mode || 'two', p: (o.p || [-2, -1]).slice(), q: (o.q || [2, 1]).slice(), piv: o.piv, deg: o.deg != null ? o.deg : 30, R: o.R || 2.2, ok: false, moved: 0 };
  U.handles = () => (U.mode === 'pivot' ? [[U.piv[0] + U.R * Math.cos((U.deg * Math.PI) / 180), U.piv[1] + U.R * Math.sin((U.deg * Math.PI) / 180)]] : [U.p, U.q]);
  U.line = () => (U.mode === 'pivot' ? (Math.abs(U.deg - 90) < 1e-9 ? { A: 1, B: 0, C: -U.piv[0] } : L9.ps(U.piv, Math.tan((U.deg * Math.PI) / 180))) : L9.thru(U.p, U.q));
  W.ul = U;
  if (U.mode === 'pivot') { W.pts.push({ x: U.piv[0], y: U.piv[1], col: C.ink, r: 5 }); W.drags = [{ get: () => U.handles()[0], r: 0.7, set: (x, y) => { let d = Math.round((Math.atan2(y - U.piv[1], x - U.piv[0]) * 180) / Math.PI); if (d < 0) d += 180; if (d >= 180) d -= 180; if (d !== U.deg) { U.deg = d; U.moved++; SFX.tick(); } } }]; }
  else W.drags = [U.p, U.q].map((h) => ({ get: () => h, r: 0.6, set: (x, y) => { const nx = clamp(sn(x), W.pl.x0, W.pl.x1), ny = clamp(sn(y), W.pl.y0, W.pl.y1); if (nx !== h[0] || ny !== h[1]) { const o2 = h === U.p ? U.q : U.p; if (Math.abs(nx - o2[0]) < 1e-9 && Math.abs(ny - o2[1]) < 1e-9) return; h[0] = nx; h[1] = ny; U.moved++; SFX.tick(); } } }));
  return U;
}
/* exercise part: drag your line onto the target line */
function linePart(q, target, o = {}) {
  const TG = Array.isArray(target) ? target : [target]; target = TG[0];
  return {
    k: 'task', q, todo: o.todo || 'Drag the gold handles until the line is right, then lock in.', hint: o.hint, x: o.x || 'Equation: ' + TG.map(eqStr).join('  or  ') + '.', no: 'It is ' + TG.map(eqStr).join('  or  ') + '. ' + (o.x || ''),
    pre: async () => { if (o.view) planeView(W, ...o.view); userLine(W, o); },
    check: (W) => { const U = W.ul; const ok = TG.some((t) => (U.mode === 'pivot' ? Math.abs(((U.deg - degOf(L9.slope(t)) + 270) % 180) - 90) <= 1.01 : L9.same(U.line(), t, 0.02))); U.ok = ok; return ok; },
    auto: (W) => { const U = W.ul; if (U.mode === 'pivot') U.deg = Math.round(degOf(L9.slope(target))) % 180; else { const a = o.ans || nicePts(target, W); U.p[0] = a[0][0]; U.p[1] = a[0][1]; U.q[0] = a[1][0]; U.q[1] = a[1][1]; } },
    reveal: (W) => { W.L.push({ ...target, col: C['matcha-deep'], dash: [8, 5], p: 0 }); gsap.to(W.L[W.L.length - 1], { p: 1, duration: 0.8 }); },
    act: async (W, r) => { W.drags = []; if (r.ok) { W.ul.ok = true; SFX.sparkle(); } },
  };
}
/* two grid points on a line (for autopilot) */
function nicePts(l, W) { const out = []; for (let x = Math.ceil(W.pl.x0); x <= W.pl.x1 && out.length < 2; x += 0.5) { if (Math.abs(l.B) < 1e-9) { out.push([-l.C / l.A, out.length ? 1 : -1]); continue; } const y = -(l.A * x + l.C) / l.B; if (Math.abs(y * 2 - Math.round(y * 2)) < 1e-9 && y >= W.pl.y0 && y <= W.pl.y1) out.push([x, y]); } return out; }
function dropPoint(W, P, l, o = {}) { const pt = { x: P[0], y: P[1], col: C.beni, t: o.t || 'P', r: 7 }; W.pts.push(pt); W.feet.push({ P: () => [pt.x, pt.y], l, show: o.show }); if (o.drag) W.drags = [{ get: () => [pt.x, pt.y], r: 0.7, set: (x, y) => { pt.x = Math.round(x * 2) / 2; pt.y = Math.round(y * 2) / 2; } }]; return pt; }
const pt9 = (x, y, t, o = {}) => Object.assign({ x, y, t, col: C.beni }, o);
const lineOf = (A, B, C2, o = {}) => Object.assign({ A, B, C: C2, col: C.sora, p: 1 }, o);
async function drawLines(W, ls, d = 0.6) { for (const l of ls) { l.p = 0; W.L.push(l); gsap.to(l, { p: 1, duration: d }); SFX.swish(); await wait(d * 0.8); } }
/* a point you slide along an axis (axis 'x' or 'y'); returns the point object */
function axisDrag(W, axis, start, snap = 0.5) { const pt = { x: axis === 'x' ? start : 0, y: axis === 'y' ? start : 0, col: C.kin, r: 9, moved: 0 }; W.pts.push(pt); W.drags = [{ get: () => [pt.x, pt.y], r: 0.8, set: (x, y) => { const v = Math.round((axis === 'x' ? x : y) / snap) * snap; const k = axis === 'x' ? 'x' : 'y'; const lo = axis === 'x' ? W.pl.x0 : W.pl.y0, hi = axis === 'x' ? W.pl.x1 : W.pl.y1; const nv = clamp(v, lo, hi); if (nv !== pt[k]) { pt[k] = nv; pt.moved++; SFX.tick(); } } }]; return pt; }

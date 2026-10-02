/* =========================================================
   CLASS 12 · CHAPTER 12 · LINEAR PROGRAMMING — simulations
   lp : constraint lines that draw themselves, the feasible region as a shaded polygon,
        tap-to-evaluate corner points, a sliding objective line Z = ax + by that sweeps the region
        and leaves at the optimal corner, a draggable test point (feasible or not), the open
        half-plane used to test an unbounded region, and an infeasible (empty) outcome.
   lpAnalyze is exact (pairwise line intersections), so every question's answer is computed, not typed.
   ========================================================= */
const OPS = { '≤': 1, '≥': -1 };
const consTxt = (c) => (c[0] === 1 ? 'x' : c[0] === -1 ? '−x' : c[0] ? fracStr(c[0]) + 'x' : '') + (c[1] ? (c[0] ? (c[1] < 0 ? ' − ' : ' + ') : c[1] < 0 ? '−' : '') + (Math.abs(c[1]) === 1 ? '' : fracStr(Math.abs(c[1]))) + 'y' : '') + ' ' + c[2] + ' ' + fracStr(c[3]);
const objTxt = (o) => (o[0] === 1 ? 'x' : o[0] === -1 ? '−x' : o[0] ? fracStr(o[0]) + 'x' : '') + (o[1] ? (o[0] ? (o[1] < 0 ? ' − ' : ' + ') : o[1] < 0 ? '−' : '') + (Math.abs(o[1]) === 1 ? '' : fracStr(Math.abs(o[1]))) + 'y' : '');
const okC = (c, x, y, e = 1e-9) => (c[2] === '≤' ? c[0] * x + c[1] * y <= c[3] + e : c[0] * x + c[1] * y >= c[3] - e);
const NN = [[1, 0, '≥', 0], [0, 1, '≥', 0]];
/* Sutherland–Hodgman clip of a polygon by a half-plane */
function clipHP(poly, c) { const f = (p) => (c[2] === '≤' ? c[3] - c[0] * p[0] - c[1] * p[1] : c[0] * p[0] + c[1] * p[1] - c[3]); const out = []; for (let i = 0; i < poly.length; i++) { const A = poly[i], B = poly[(i + 1) % poly.length], fa = f(A), fb = f(B); if (fa >= -1e-12) out.push(A); if ((fa > 1e-12 && fb < -1e-12) || (fa < -1e-12 && fb > 1e-12)) { const t = fa / (fa - fb); out.push([A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])]); } } return out; }
const clipAll = (box, cons) => cons.reduce((p, c) => (p.length ? clipHP(p, c) : p), [[box[0], box[2]], [box[1], box[2]], [box[1], box[3]], [box[0], box[3]]]);
/* corners, boundedness, optimum (dir 'max' | 'min') */
function lpAnalyze(cons, obj, dir) {
  const all = cons, corners = [];
  for (let i = 0; i < all.length; i++) for (let j = i + 1; j < all.length; j++) { const a = all[i], b = all[j], d = a[0] * b[1] - a[1] * b[0]; if (Math.abs(d) < 1e-12) continue; const x = (a[3] * b[1] - a[1] * b[3]) / d, y = (a[0] * b[3] - a[3] * b[0]) / d; if (all.every((c) => okC(c, x, y, 1e-7)) && !corners.some((p) => Math.hypot(p[0] - x, p[1] - y) < 1e-7)) corners.push([Math.abs(x) < 1e-12 ? 0 : x, Math.abs(y) < 1e-12 ? 0 : y]); }
  corners.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const Z = (p) => obj[0] * p[0] + obj[1] * p[1], res = { corners, feasible: corners.length > 0, Z };
  if (!res.feasible) return Object.assign(res, { bounded: false, exists: false, best: null, pts: [] });
  const M = 1e5, big = clipAll([-M, M, -M, M], all); res.bounded = big.every((p) => Math.abs(p[0]) < M * 0.99 && Math.abs(p[1]) < M * 0.99);
  const sg = dir === 'max' ? 1 : -1, bc = Math.max(...corners.map((p) => sg * Z(p))) * sg, bb = Math.max(...big.map((p) => sg * Z(p))) * sg;
  res.exists = res.bounded || sg * bb <= sg * bc + 1e-6; res.best = bc; res.pts = corners.filter((p) => Math.abs(Z(p) - bc) < 1e-7);
  return res;
}
const nice = (v) => { const e = Math.pow(10, Math.floor(Math.log10(v))), m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };
const pt2 = (p) => '(' + fracStr(p[0]) + ', ' + fracStr(p[1]) + ')';

MINI.lp = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { cons: [], obj: null, z: null, corners: [], poly: true, reg: 0, hp: null, shown: new Set(), best: [], pt: null, rd: null, cap: '', kimCorner: true, kimX: 0.95, kimY: 0.85, tapOn: false, empty: false, lab: true, pts: [] }); },
  draw(W) {
    MINI.plane.draw(W); const [bx0, by0, bx1, by1] = viewBounds(0), box = [bx0, bx1, by0, by1];
    const poly = (ps, fill, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = fill; ctx.beginPath(); ps.forEach((q, i) => { const s = toS(...q); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); ctx.fill(); ctx.restore(); };
    if (W.hp) { const q = clipHP(clipAll(box, []), W.hp); if (q.length > 2) poly(q, C.sakura, 0.55); }
    const real = W.cons.filter((c) => c.on !== false);
    if (W.reg > 0 && real.length) { const q = clipAll(box, real); if (q.length > 2) { poly(q, C['sora-tint'], 0.85 * W.reg); ctx.save(); ctx.globalAlpha = W.reg; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); q.forEach((p, i) => { const s = toS(...p); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); ctx.stroke(); ctx.restore(); } }
    for (const c of W.cons) { const k = c.p == null ? 1 : c.p; if (k <= 0 || c.axis) continue; const [a, b, , cc] = c; const P = []; if (Math.abs(b) > 1e-12) { for (const x of [bx0, bx1]) { const y = (cc - a * x) / b; if (y >= by0 - 1e-9 && y <= by1 + 1e-9) P.push([x, y]); } } if (Math.abs(a) > 1e-12) { for (const y of [by0, by1]) { const x = (cc - b * y) / a; if (x >= bx0 - 1e-9 && x <= bx1 + 1e-9 && !P.some((p) => Math.hypot(p[0] - x, p[1] - y) < 1e-6)) P.push([x, y]); } } if (P.length < 2) continue; const e = [P[0], [P[0][0] + (P[1][0] - P[0][0]) * k, P[0][1] + (P[1][1] - P[0][1]) * k]]; D.line(e, c.col || C.ink, 3); if (k >= 1 && W.lab) { const s = toS(...P[1]), s0 = toS(...P[0]); const m = [lerp(s0[0], s[0], 0.82), lerp(s0[1], s[1], 0.82)]; D.text(c.t || consTxt(c), Math.min(Math.max(m[0], 60), SW - 60), Math.min(Math.max(m[1] - 8, 14), SH - 8), { size: 12, w: 800, col: c.col || C.ink, stroke: C.paper }); } }
    if (W.obj && W.z != null) { const [a, b] = W.obj, P = []; if (Math.abs(b) > 1e-12) for (const x of [bx0, bx1]) { const y = (W.z - a * x) / b; if (y >= by0 && y <= by1) P.push([x, y]); } if (Math.abs(a) > 1e-12) for (const y of [by0, by1]) { const x = (W.z - b * y) / a; if (x >= bx0 && x <= bx1) P.push([x, y]); } if (P.length >= 2) { D.line([P[0], P[1]], C.kin, 4, [10, 6]); const s = toS(...P[0]); D.text('Z = ' + fmtN(W.z, 2), Math.min(Math.max(s[0] + 4, 40), SW - 70), Math.min(Math.max(s[1] - 10, 14), SH - 8), { size: 13, w: 800, col: C.ink, stroke: C.kin }); } }
    for (const [i, p] of W.corners.entries()) { if (W.reg < 0.5) break; const s = toS(...p), on = W.shown.has(i), bst = W.best.includes(i); if (bst && on) { ctx.beginPath(); ctx.arc(s[0], s[1], 14 + 2 * Math.sin(T * 5), 0, 7); ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.stroke(); } ctx.beginPath(); ctx.arc(s[0], s[1], 7, 0, 7); ctx.fillStyle = on ? (bst ? C.beni : C.kin) : C.paper; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); if (W.lab) { const txt = pt2(p) + (on && W.obj ? '  Z = ' + fracStr(W.obj[0] * p[0] + W.obj[1] * p[1]) : ''); const left = s[0] > SW * 0.62; D.text(txt, s[0] + (left ? -11 : 11), s[1] - 11, { size: SW < 520 ? 10.5 : 12, w: 800, align: left ? 'right' : 'left', stroke: C.paper }); } }
    if (W.pt) { const s = toS(...W.pt), good = (W.cons.length ? W.cons : []).every((c) => okC(c, W.pt[0], W.pt[1])); ctx.beginPath(); ctx.arc(s[0], s[1], 10, 0, 7); ctx.fillStyle = good ? C['matcha-deep'] : C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); D.text(pt2(W.pt), s[0] + 14, s[1] - 12, { size: 13, w: 800, align: 'left', stroke: C.paper }); }
    for (const q of W.pts) { const s = toS(...q.p); ctx.beginPath(); ctx.arc(s[0], s[1], 7, 0, 7); ctx.fillStyle = q.col || C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); if (q.t) D.text(q.t, s[0] + 10, s[1] - 9, { size: 12.5, w: 800, align: 'left', stroke: C.paper }); }
    if (W.empty) D.text('NO FEASIBLE REGION', SW / 2, SH * 0.42, { size: clamp(SW / 14, 20, 40), w: 800, disp: true, col: C.beni, stroke: C.paper });
    const L = (typeof W.rd === 'function' ? W.rd() : W.rd || []).filter(Boolean); if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.5, SH - 12, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
/* set up from a list of constraints [a, b, op, c] (the x, y ≥ 0 pair is added unless nn === false) */
function lpSet(W, cons, obj, o = {}) {
  const user = cons.map((c) => ({ ...c }));
  const all = o.nn === false ? user : [...user, ...NN.map((c) => ({ ...c, axis: true }))];
  const A = lpAnalyze(all, obj || [1, 0], o.dir || 'max');
  let mx = 1, my = 1; for (const p of A.corners) { mx = Math.max(mx, p[0]); my = Math.max(my, p[1]); } if (!A.corners.length || !A.bounded) for (const c of user) { if (c[0] > 0) mx = Math.max(mx, c[3] / c[0]); if (c[1] > 0) my = Math.max(my, c[3] / c[1]); }
  const S = Math.max(mx / 1.5, my) * 1.3, g = o.grid || nice(S / 5);
  Object.assign(W, { cons: [], obj: obj || null, z: null, corners: A.corners.slice(), reg: 0, hp: null, shown: new Set(), best: [], pt: null, rd: null, cap: o.cap || '', empty: false, pts: [], A, tapOn: false });
  all.forEach((c, i) => { W.cons[i] = Object.assign([c[0], c[1], c[2], c[3]], { p: o.draw === false ? 1 : 0, axis: c.axis, col: [C.sora, C.beni, C['matcha-deep'], C.kin, C.ink][i % 5] }); });
  if (o.draw === false) W.reg = o.reg == null ? 1 : o.reg;
  planeView(W, -0.14 * S * 1.5, S * 1.5 * 1.08, -0.14 * S, S * 1.08, g, 1);
  W.onTap = (x, y) => { if (!W.tapOn) return; let k = -1, d = Infinity; W.corners.forEach((p, i) => { const e = Math.hypot(p[0] - x, p[1] - y); if (e < d) { d = e; k = i; } }); if (d < S * 0.12 && k >= 0 && !W.shown.has(k)) { W.shown.add(k); SFX.pop(); W.tapped = (W.tapped || 0) + 1; } };
  return A;
}
async function lpDraw(W) { for (const c of W.cons) if (!c.axis) { c.p = 0; SFX.swish(); await tw(c, { p: 1, duration: AUTO ? 0.05 : 0.5 }); } for (const c of W.cons) c.p = 1; SFX.whoosh(); await tw(W, { reg: 1, duration: AUTO ? 0.05 : 0.6 }); }
async function lpSweep(W, to, from) { const A = W.A; const lo = from != null ? from : (to > (A.best || 0) ? to - 1 : to + 1); W.z = from != null ? from : to; SFX.whoosh(); await tw(W, { z: to, duration: AUTO ? 0.05 : 1.6, ease: 'power1.inOut' }); }

/* ---------- question builders ---------- */
const mcqL = (q, o, x) => ({ k: 'mcq', q, o, a: 0, x });
const tfL = (q, a, x) => ({ k: 'tf', q, a, x });
const runL = (fn) => ({ k: 'run', run: fn });
const numL = (q, a, show, x, o = {}) => ({ k: 'num', q, a, show, x, keys: o.keys != null ? o.keys : '', tol: o.tol || 1e-4 * Math.max(1, Math.abs(a)), ...o });
const optsFor = (pts, all, extra = []) => { const first = pts[0], rest = all.filter((p) => !pts.some((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-9)).map(pt2); return [pt2(first), ...rest, ...extra].slice(0, 4); };
/* one optimisation pass: tap corners, choose the best, say the value, sweep the objective line */
function passParts(A, obj, dir, o = {}) {
  const verb = dir === 'max' ? 'maximum' : 'minimum', P = [];
  const sg = dir === 'max' ? 1 : -1;
  if (!A.exists) {
    return [mcqL('Does Z have a ' + verb + '?', ['No: Z can keep ' + (dir === 'max' ? 'growing' : 'falling') + ' inside the region', 'Yes, at the best corner', 'Yes, at the origin', 'Yes, at every corner'], 'The best corner value is ' + fracStr(A.best) + ', but the open half-plane ' + objTxt(obj) + (dir === 'max' ? ' > ' : ' < ') + fracStr(A.best) + ' still has feasible points.'),
      runL(async (W) => { W.hp = [obj[0], obj[1], dir === 'max' ? '≥' : '≤', A.best]; W.z = A.best; SFX.swish(); await wait(AUTO ? 0.05 : 1.2); })];
  }
  const multi = A.pts.length > 1;
  if (!A.bounded) P.push(mcqL('Is the ' + verb + ' really ' + fracStr(A.best) + '? Does the open half-plane ' + objTxt(obj) + (dir === 'max' ? ' > ' : ' < ') + fracStr(A.best) + ' meet the region?', ['No common point, so yes: the ' + verb + ' is ' + fracStr(A.best), 'It meets the region, so no ' + verb + ' exists', 'It does not matter', 'Only if the region is bounded'], 'For an unbounded region you must test the half-plane (Step 4 of the corner point method).'));
  P.push(mcqL(multi ? 'Which corners give the ' + verb + '?' : 'Which corner gives the ' + verb + '?', multi ? [A.pts.map(pt2).join(' and '), ...A.corners.filter((p) => !A.pts.includes(p)).map(pt2).slice(0, 3)].slice(0, 4) : optsFor(A.pts, A.corners), (multi ? 'Both give Z = ' + fracStr(A.best) + ': every point on the segment joining them does too.' : pt2(A.pts[0]) + ' gives Z = ' + fracStr(A.best) + '.')));
  P.push(numL('The ' + verb + ' value of Z = ?', A.best, fracStr(A.best), 'Z = ' + objTxt(obj) + ' at ' + A.pts.map(pt2).join(' and ') + '.', { act: async (W) => { W.best = A.pts.map((p) => W.corners.findIndex((q) => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-9)); W.corners.forEach((_, i) => W.shown.add(i)); } }));
  P.push(runL(async (W) => { await lpSweep(W, A.best, A.best - sg * (Math.abs(A.best) * 0.6 + 4)); SFX.pop(); await wait(AUTO ? 0.05 : 0.6); }));
  return P;
}
/* the generic LP question. o: { dir: 'max' | 'min' | 'both', both: true } */
function lpQ(ex, n, q, cons, obj, dirs, o = {}) {
  const base = lpAnalyze([...cons, ...NN], obj, 'max');
  const dl = Array.isArray(dirs) ? dirs : [dirs];
  const parts = [];
  parts.push(runL(async (W) => { await lpDraw(W); if (!base.feasible) { W.empty = true; SFX.boing(); await wait(AUTO ? 0.05 : 0.8); } }));
  parts.push(mcqL('The feasible region is', base.feasible ? (base.bounded ? ['bounded', 'unbounded', 'empty', 'a single point'] : ['unbounded', 'bounded', 'empty', 'a single point']) : ['empty: no point satisfies every constraint', 'bounded', 'unbounded', 'a single point'], base.feasible ? (base.bounded ? 'It can be enclosed in a circle.' : 'It runs off to infinity in some direction.') : 'The shaded half-planes never overlap.'));
  if (base.feasible) {
    parts.push({ k: 'task', q: 'Tap every corner point to read Z there', todo: 'Tap each ● on the region.', pre: async (W) => { W.tapOn = true; W.tapped = 0; }, check: (W) => W.shown.size >= W.corners.length, auto: (W) => { W.corners.forEach((_, i) => W.shown.add(i)); }, reveal: (W) => { W.corners.forEach((_, i) => W.shown.add(i)); } });
    parts.push(runL(async (W) => { W.tapOn = false; await wait(0.05); }));
    for (const d of dl) parts.push(...passParts(lpAnalyze([...cons, ...NN], obj, d), obj, d));
  }
  const w = !base.feasible ? 'No feasible region: no solution' : dl.map((d) => { const A = lpAnalyze([...cons, ...NN], obj, d); return A.exists ? (d === 'max' ? 'Max' : 'Min') + ' Z = ' + fracStr(A.best) + ' at ' + A.pts.map(pt2).join(' and ') : 'No ' + (d === 'max' ? 'maximum' : 'minimum'); }).join('; ');
  return { ex, n, q, scene: 'lp', setup: (W) => { lpSet(W, cons, obj, { dir: dl[0] }); W.rd = () => [['Z = ' + objTxt(obj), C.ink]]; }, parts, w: [w], A: base, cons, obj, dl };
}

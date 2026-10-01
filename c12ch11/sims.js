/* =========================================================
   CLASS 12 · CHAPTER 11 · THREE DIMENSIONAL GEOMETRY — simulations
   line3 : the Chapter 10 space scene plus infinite lines r⃗ = a⃗ + λb⃗, a point riding each line
           (slide λ), and the segment joining two riders. For skew lines, slide λ and μ to hunt
           for the shortest distance before computing it.
   Loads after c12ch10/sims.js (V, vecSet, A3, mcqP, numP, fldP, cmp, runP, bQ).
   ========================================================= */
MINI.line3 = {
  view: { w: 12, h: 8 },
  init(W) { MINI.vec.init(W); Object.assign(W, { lines: [], segs: [] }); },
  draw(W) {
    MINI.vec.draw(W); const pr = (p) => MINI.vec.pr(W, p);
    for (const l of W.lines) { const a = l.a, b = l.b, T = (2.2 * W.R) / V.norm(b), k = l.p == null ? 1 : l.p; if (k <= 0) continue; D.line([pr(V.add(a, V.mul(-T * k, b))), pr(V.add(a, V.mul(T * k, b)))], l.col || C.sora, l.w || 3); if (l.t) { const s = toS(...pr(V.add(a, V.mul(l.tl || 1.6, b)))); D.text(l.t, s[0] + 10, s[1] - 8, { size: 13, w: 800, col: l.col || C.sora, align: 'left', stroke: C.paper }); } if (l.lam != null) { const s = toS(...pr(V.add(a, V.mul(l.lam, b)))); ctx.beginPath(); ctx.arc(s[0], s[1], 8, 0, 7); ctx.fillStyle = l.col || C.sora; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); } }
    for (const sg of W.segs) { const P = typeof sg.a === 'function' ? sg.a() : sg.a, Q = typeof sg.b === 'function' ? sg.b() : sg.b; D.line([pr(P), pr(Q)], sg.col || C.kin, sg.w || 4, sg.dash); if (sg.t) { const s = toS(...pr(V.mul(0.5, V.add(P, Q)))); D.text(typeof sg.t === 'function' ? sg.t() : sg.t, s[0] + 8, s[1] + 4, { size: 13, w: 800, col: C.ink, align: 'left', stroke: C.paper }); } }
  },
};
const lineAt = (l, t) => V.add(l.a, V.mul(t, l.b));
/* closest points of two lines (λ, μ) */
function closest(a1, b1, a2, b2) { const w = V.sub(a1, a2), A = V.dot(b1, b1), B = V.dot(b1, b2), Cc = V.dot(b2, b2), Dd = V.dot(b1, w), E = V.dot(b2, w), den = A * Cc - B * B; if (Math.abs(den) < 1e-12) return [0, E / Cc]; return [(B * E - Cc * Dd) / den, (A * E - B * Dd) / den]; }
const skewD = (a1, b1, a2, b2) => { const n = V.cross(b1, b2); return Math.abs(V.dot(n, V.sub(a2, a1))) / V.norm(n); };
const parD = (a1, a2, b) => V.norm(V.cross(b, V.sub(a2, a1))) / V.norm(b);
function lineSet(W, lines, o = {}) { vecSet(W, { d3: true, R: o.R || 6, arr: o.arr || [], dots: o.dots || [], tri: o.tri || [], ang: o.ang || [] }); W.lines = lines.map((l) => ({ ...l })); W.segs = []; }
async function drawLines(W) { for (const l of W.lines) { l.p = 0; SFX.whoosh(); await tw(l, { p: 1, duration: AUTO ? 0.05 : 0.5 }); } }
/* hunt: sliders λ, μ move two riders; |PQ| shows live; succeed near the minimum */
const huntP = (tol = 0.06) => ({ k: 'task', q: 'Slide λ and μ to make |PQ| as small as you can', todo: 'The riders are the two dots. Get within ' + tol + ' of the true minimum.',
  pre: async (W) => { const [L1, L2] = W.lines; L1.lam = 0; L2.lam = 0; W.dmin = V.norm(V.sub(lineAt(L2, closest(L1.a, L1.b, L2.a, L2.b)[1]), lineAt(L1, closest(L1.a, L1.b, L2.a, L2.b)[0]))); W.segs = [{ a: () => lineAt(L1, L1.lam), b: () => lineAt(L2, L2.lam), col: C.kin, t: () => '|PQ| = ' + fmtN(V.norm(V.sub(lineAt(L2, L2.lam), lineAt(L1, L1.lam))), 3) }];
    W.s1 = slider('λ', -3, 3, 0.05, 0, (v) => 'λ = ' + v, (v) => (L1.lam = v)); W.s2 = slider('μ', -3, 3, 0.05, 0, (v) => 'μ = ' + v, (v) => (L2.lam = v)); },
  check: (W) => { const [L1, L2] = W.lines; return V.norm(V.sub(lineAt(L2, L2.lam), lineAt(L1, L1.lam))) - W.dmin < tol; },
  auto: (W) => { const [L1, L2] = W.lines, [l, m] = closest(L1.a, L1.b, L2.a, L2.b); L1.lam = l; L2.lam = m; },
  reveal: (W) => { const [L1, L2] = W.lines, [l, m] = closest(L1.a, L1.b, L2.a, L2.b); L1.lam = l; L2.lam = m; } });
const huntEnd = runP(async (W) => { for (const s of [W.s1, W.s2]) if (s && s.parentNode && s.parentNode.parentNode) s.parentNode.remove(); const [L1, L2] = W.lines, [l, m] = closest(L1.a, L1.b, L2.a, L2.b); SFX.swish(); await tw(L1, { lam: l, duration: AUTO ? 0.05 : 0.6 }); await tw(L2, { lam: m, duration: AUTO ? 0.05 : 0.4 }); SFX.pop(); });
/* ride: slide λ along one line from its anchor point */
const rideP = (i, to) => ({ k: 'task', q: 'Slide λ: the point r⃗ = a⃗ + λb⃗ rides the line. Go to λ = ' + to, pre: async (W) => { const L = W.lines[i]; L.lam = 0; W.rs = slider('λ', -2, 2, 0.5, 0, (v) => 'λ = ' + v, (v) => (L.lam = v)); }, check: (W) => W.lines[i].lam === to, auto: (W) => (W.lines[i].lam = to), todo: 'Every λ gives a point of the line.' });
const lQ = (ex, n, q, lines, parts, w, o = {}) => ({ ex, n, q, scene: 'line3', kim: o.kim, setup: (W) => lineSet(W, typeof lines === 'function' ? lines() : lines, o), parts: [runP(async (W) => { await drawLines(W); await growAll(W); if (!AUTO) await spin(W, 0.5); }), ...parts], w: [w] });

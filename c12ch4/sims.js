/* =========================================================
   CLASS 12 · CHAPTER 4 · DETERMINANTS — simulations (uses the mat/sq scenes from c12ch3/sims.js)
   tri    : drag three vertices; the determinant ½|x y 1| gives the area live (0 when collinear)
   lines2 : two linear equations as lines: one crossing point, parallel, or the same line
   Exact helpers: det, minor, cofactor, adj, inv, solve.
   ========================================================= */
const DT = {
  det(A) { const n = A.length; if (n === 1) return A[0][0]; if (n === 2) return A[0][0] * A[1][1] - A[0][1] * A[1][0]; return A[0].reduce((s, v, j) => s + (j % 2 ? -1 : 1) * v * DT.det(DT.sub(A, 0, j)), 0); },
  sub: (A, i, j) => A.filter((_, r) => r !== i).map((r) => r.filter((_, c) => c !== j)),
  minor: (A, i, j) => DT.det(DT.sub(A, i, j)),
  cof: (A, i, j) => ((i + j) % 2 ? -1 : 1) * DT.minor(A, i, j),
  cofM: (A) => A.map((r, i) => r.map((_, j) => DT.cof(A, i, j))),
  adj: (A) => (A.length === 2 ? [[A[1][1], -A[0][1]], [-A[1][0], A[0][0]]] : MM.T(DT.cofM(A))),
  inv: (A) => MM.k(1 / DT.det(A), DT.adj(A)),
  solve: (A, b) => MM.mul(DT.inv(A), b.map((v) => [v])).map((r) => r[0]),
};
const clean = (A) => A.map((r) => r.map((v) => (Math.abs(v) < 1e-12 ? 0 : v)));

/* =============== TRI: area of a triangle by determinant =============== */
MINI.tri = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { P: [[1, 0], [6, 0], [4, 3]], snap: 1, kimCorner: true, kimX: 0.95, lockAt: null, showArea: true }); planeView(W, -3, 11, -4, 9); },
  draw(W) {
    MINI.plane.draw(W); const P = W.P; const S = P.map((p) => toS(...p)); const d = DT.det(P.map(([x, y]) => [x, y, 1]));
    ctx.save(); ctx.globalAlpha = 0.45; ctx.fillStyle = Math.abs(d) < 1e-9 ? C.tone : d > 0 ? C['sora-tint'] : C.sakura; ctx.beginPath(); S.forEach((s, i) => (i ? ctx.lineTo(...s) : ctx.moveTo(...s))); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); S.forEach((s, i) => (i ? ctx.lineTo(...s) : ctx.moveTo(...s))); ctx.closePath(); ctx.stroke();
    P.forEach((p, i) => { D.dot(p[0], p[1], 9, [C.beni, C.sora, C['matcha-deep']][i], C.ink, 2.5); const s = toS(...p); D.text('(' + cell(p[0]) + ', ' + cell(p[1]) + ')', s[0] + 10, s[1] - 10, { size: 12, w: 800, align: 'left', stroke: C.paper }); });
    if (W.showArea) { const t = Math.abs(d) < 1e-9 ? 'Δ = 0 → collinear!' : 'Area = ½|Δ| = ½|' + cell(d) + '| = ' + cell(Math.abs(d) / 2); D.text(t, 14, 24, { size: 16, w: 800, disp: true, align: 'left', stroke: C.paper, col: Math.abs(d) < 1e-9 ? C.beni : C.ink }); }
  },
};
const triArea = (P) => Math.abs(DT.det(P.map(([x, y]) => [x, y, 1]))) / 2;
function triDrag(W, which = [0, 1, 2], snap = 1) { W.drags = which.map((k) => ({ get: () => W.P[k], r: 0.6, set: (x, y) => { const v = [Math.round(x / snap) * snap, Math.round(y / snap) * snap]; if (v[0] !== W.P[k][0] || v[1] !== W.P[k][1]) { W.P[k] = v; SFX.tick(); W.moved = (W.moved || 0) + 1; } } })); }
function triFit(W, P, pad = 2) { const xs = P.map((p) => p[0]), ys = P.map((p) => p[1]); planeView(W, Math.min(0, ...xs) - pad, Math.max(0, ...xs) + pad, Math.min(0, ...ys) - pad, Math.max(0, ...ys) + pad); }

/* =============== LINES2: consistency of a 2 × 2 system =============== */
MINI.lines2 = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { eqs: [], kimCorner: true, kimX: 0.95, show: 0 }); planeView(W, -6, 6, -4.5, 4.5); },
  draw(W) {
    MINI.plane.draw(W); const [bx0, by0, bx1, by1] = viewBounds(0); const cols = [C.sora, C.beni];
    W.eqs.forEach(([a, b, c], k) => { if (k >= W.show) return; let p; if (Math.abs(b) > 1e-9) p = [[bx0, (c - a * bx0) / b], [bx1, (c - a * bx1) / b]]; else p = [[c / a, by0], [c / a, by1]]; D.line(p, cols[k], k ? 3 : 5, k ? [9, 6] : null); });
    if (W.show >= 2 && W.eqs.length === 2) { const A = W.eqs.map((e) => [e[0], e[1]]), d = DT.det(A); let t; if (Math.abs(d) > 1e-9) { const [x, y] = DT.solve(A, W.eqs.map((e) => e[2])); D.dot(x, y, 10, C.kin, C.ink, 3); const s = toS(x, y); D.star(s[0], s[1], 16, 8, C.kin); t = 'one point (' + cell(x) + ', ' + cell(y) + '): consistent'; } else { const same = Math.abs(W.eqs[0][0] * W.eqs[1][2] - W.eqs[1][0] * W.eqs[0][2]) < 1e-9 && Math.abs(W.eqs[0][1] * W.eqs[1][2] - W.eqs[1][1] * W.eqs[0][2]) < 1e-9; t = same ? 'same line: infinitely many solutions' : 'parallel: no solution → inconsistent'; } D.text('|A| = ' + cell(d) + ' · ' + t, SW * 0.46, 24, { size: 14, w: 800, disp: true, stroke: C.paper }); }
    W.eqs.forEach(([a, b, c], k) => { if (k >= W.show) return; D.text(eqTxt(a, b, c), 14, SH - 40 + k * 20, { size: 13, w: 800, align: 'left', stroke: C.paper, col: cols[k] }); });
  },
};
/* "2x − y + 3z = 5" from coefficients [a, b, (c,) rhs] */
const eqTxt = (...co) => { const rhs = co.pop(); const v = ['x', 'y', 'z']; let t = ''; co.forEach((k, i) => { if (!k) return; const m = (Math.abs(k) === 1 ? '' : cell(Math.abs(k))) + v[i]; t += t ? (k < 0 ? ' − ' : ' + ') + m : (k < 0 ? '−' : '') + m; }); return t + ' = ' + cell(rhs); };

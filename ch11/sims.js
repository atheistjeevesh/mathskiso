/* =========================================================
   CHAPTER 11 · INTRODUCTION TO 3D GEOMETRY — simulations
   MINI.space: drag anywhere to orbit the axes. Points with drop lines to the coordinate planes,
   segments, boxes (the rectangular parallelepiped behind the distance formula), coordinate planes
   and octants that light up, plus sliders that move a point.
   ========================================================= */
const OCT = [[1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1]];
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
const octOf = (p) => OCT.findIndex((s) => s.every((v, i) => Math.sign(p[i]) === v));
const d3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const sq3 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
const P3 = (p) => '(' + p.map((v) => fracStr(v).replace('-', '−')).join(', ') + ')';
/* "2√5" from an integer square */
function rt(n) { if (Math.abs(n - Math.round(n)) > 1e-9) return '√' + fmtN(n, 3); n = Math.round(n); let o = 1, i = n; for (let k = Math.floor(Math.sqrt(n)); k > 1; k--) if (n % (k * k) === 0) { o = k; i = n / (k * k); break; } return i === 1 ? String(o) : (o === 1 ? '' : o) + '√' + i; }

MINI.space = {
  view: { w: 7.6, h: 5 },
  init(W) {
    Object.assign(W, { yaw: -0.62, pitch: 0.42, R: 6, s: 0.42, pts: [], segs: [], boxes: [], planes: [], oct: -1, cap: '', kimCorner: true, kimX: 0.94, spun: 0, cy: -0.1 });
    W.drags = [{ get: () => [W.yaw * 3, W.pitch * 3], r: 1e9, set: (x, y) => { const ny = x / 3, np = clamp(y / 3, -0.2, 1.3); W.spun += Math.abs(ny - W.yaw); W.yaw = ny; W.pitch = np; } }];
  },
  draw(W) {
    const pr = (p) => { const c = Math.cos(W.yaw), s = Math.sin(W.yaw), x1 = p[0] * c - p[1] * s, y1 = p[0] * s + p[1] * c; return [y1 * W.s, (p[2] * Math.cos(W.pitch) - x1 * Math.sin(W.pitch)) * W.s + W.cy]; };
    W.pr = pr; const R = W.R;
    const poly = (ps, fill, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = fill; ctx.beginPath(); ps.forEach((q, i) => { const s = toS(...pr(q)); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); ctx.fill(); ctx.restore(); };
    const PL = { xy: [[R, R, 0], [-R, R, 0], [-R, -R, 0], [R, -R, 0]], yz: [[0, R, R], [0, -R, R], [0, -R, -R], [0, R, -R]], zx: [[R, 0, R], [-R, 0, R], [-R, 0, -R], [R, 0, -R]] };
    const PC = { xy: C['sora-tint'], yz: C['matcha-tint'], zx: C.sakura };
    for (const p of W.planes) poly(PL[p.n || p], PC[p.n || p], p.a == null ? 0.55 : p.a);
    if (W.oct >= 0) { const s = OCT[W.oct], k = R * 0.75; const v = (a, b, c) => [a * s[0] * k, b * s[1] * k, c * s[2] * k]; for (const f of [[v(0, 0, 0), v(1, 0, 0), v(1, 1, 0), v(0, 1, 0)], [v(0, 0, 0), v(0, 1, 0), v(0, 1, 1), v(0, 0, 1)], [v(0, 0, 0), v(1, 0, 0), v(1, 0, 1), v(0, 0, 1)]]) poly(f, C.kin, 0.35); }
    // axes
    const ax = [['x', [1, 0, 0], C.beni], ['y', [0, 1, 0], C['matcha-deep']], ['z', [0, 0, 1], C.sora]];
    for (const [n, d, col] of ax) { const a = pr(d.map((v) => -v * R)), b = pr(d.map((v) => v * R)); D.line([a, b], col, 2.5); const sa = toS(...a), sb = toS(...b); D.head(sb[0], sb[1], Math.atan2(sb[1] - sa[1], sb[0] - sa[0]), 9); ctx.fillStyle = col; D.text(n.toUpperCase(), sb[0] + (sb[0] - sa[0]) * 0.04, sb[1] + (sb[1] - sa[1]) * 0.04 + 4, { size: 14, w: 800, col, stroke: C.paper }); D.text(n.toUpperCase() + '′', sa[0] - (sb[0] - sa[0]) * 0.03, sa[1] - (sb[1] - sa[1]) * 0.03 + 4, { size: 11, w: 700, col: C['ink-muted'], stroke: C.paper });
      for (let k = -R + 1; k < R; k++) { if (!k) continue; const t = toS(...pr(d.map((v) => v * k))); ctx.fillStyle = col; ctx.fillRect(t[0] - 1.5, t[1] - 1.5, 3, 3); } }
    const o = toS(...pr([0, 0, 0])); D.text('O', o[0] - 9, o[1] + 14, { size: 11, w: 700, col: C['ink-muted'] });
    for (const b of W.boxes) { const [a, c] = [b.a, b.b]; const V = (i, j, k) => [i ? c[0] : a[0], j ? c[1] : a[1], k ? c[2] : a[2]]; const E = [[[0, 0, 0], [1, 0, 0]], [[0, 0, 0], [0, 1, 0]], [[0, 0, 0], [0, 0, 1]], [[1, 1, 1], [0, 1, 1]], [[1, 1, 1], [1, 0, 1]], [[1, 1, 1], [1, 1, 0]], [[1, 0, 0], [1, 1, 0]], [[1, 0, 0], [1, 0, 1]], [[0, 1, 0], [1, 1, 0]], [[0, 1, 0], [0, 1, 1]], [[0, 0, 1], [1, 0, 1]], [[0, 0, 1], [0, 1, 1]]]; for (const [u, w] of E) D.line([pr(V(...u)), pr(V(...w))], b.col || C['ink-muted'], 1.5, [5, 4]); }
    for (const sg of W.segs) { const k = sg.p == null ? 1 : sg.p; if (k <= 0) continue; const A = pr(sg.a), Bq = pr(sg.b.map((v, i) => sg.a[i] + (v - sg.a[i]) * k)); D.line([A, Bq], sg.col || C.ink, sg.w || 3, sg.dash); if (sg.t && k >= 1) { const m = toS((A[0] + Bq[0]) / 2, (A[1] + Bq[1]) / 2); D.text(sg.t, m[0] + 6, m[1] - 6, { size: 12, w: 800, col: sg.col || C.ink, align: 'left', stroke: C.paper }); } }
    for (const q of W.pts) { const p = typeof q.p === 'function' ? q.p() : q.p; if (q.drop) { const M = [p[0], p[1], 0], L = [p[0], 0, 0]; D.line([pr(p), pr(M)], C.sora, 1.8, [4, 4]); D.line([pr(M), pr(L)], C['matcha-deep'], 1.8, [4, 4]); D.line([pr(M), pr([0, p[1], 0])], C.beni, 1.8, [4, 4]); } const s = toS(...pr(p)); ctx.beginPath(); ctx.arc(s[0], s[1], q.r || 7, 0, 7); ctx.fillStyle = q.col || C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); const t = typeof q.t === 'function' ? q.t() : q.t; if (t) D.text(t, s[0] + 10, s[1] - 8, { size: 13, w: 800, align: 'left', stroke: C.paper }); }
    if (W.cap) D.text(typeof W.cap === 'function' ? W.cap() : W.cap, 10, 20, { size: 14, w: 800, align: 'left', stroke: C.paper, col: C.beni });
  },
};
/* sliders that move a point; returns the live point array */
function xyzSliders(W, p, lim = 5, autoTo) { const P = p.slice(); ['x', 'y', 'z'].forEach((n, i) => slider(n, -lim, lim, 1, P[i], (v) => n + ' = ' + String(v).replace('-', '−'), (v) => { P[i] = v; }, autoTo ? autoTo[i] : null)); return P; }

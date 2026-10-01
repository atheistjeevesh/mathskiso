/* =========================================================
   CHAPTER 10 · CONIC SECTIONS — simulations
   cone  : side view of a double cone + slicing plane; inset draws the true section (e = cos β / cos α)
   conic : coordinate plane + circle / parabola / ellipse / hyperbola with foci, directrix, latus rectum,
           a draggable point P with live distance readouts, a buildable circle and a sliding rod
   ========================================================= */
/* "2√5", "√13/2", "6√5/5" from a rational square x2 */
function surd(x2) {
  if (Math.abs(x2) < 1e-12) return '0'; const f = fracStr(x2).split('/'); const p = +f[0], q = f[1] ? +f[1] : 1; let n = p * q, out = 1, den = q;
  for (let k = Math.floor(Math.sqrt(n)); k > 1; k--) if (n % (k * k) === 0) { out = k; n /= k * k; break; }
  const g = gcdC(out, den); out /= g; den /= g; const num = n === 1 ? String(out) : (out === 1 ? '' : out) + '√' + n; return den === 1 ? num : num + '/' + den;
}
const gcdC = (a, b) => (b ? gcdC(b, a % b) : a);
const hyp2 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/* =============== CONE SLICER =============== */
MINI.cone = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { alpha: 30, beta: 90, off: 1.2, kimCorner: true, kimX: 0.95, cap: '' }); },
  draw(W) {
    const vx = -2.4, vy = 0, H = 2.7, ta = Math.tan((W.alpha * Math.PI) / 180);
    // cone (side view): two nappes
    ctx.save(); ctx.fillStyle = C['sora-tint']; ctx.globalAlpha = 0.55; for (const s of [1, -1]) { ctx.beginPath(); const a = toS(vx, vy), b = toS(vx - H * ta, vy + s * H), c = toS(vx + H * ta, vy + s * H); ctx.moveTo(...a); ctx.lineTo(...b); ctx.lineTo(...c); ctx.closePath(); ctx.fill(); } ctx.restore();
    D.line([[vx - H * ta, vy + H], [vx + H * ta, vy - H]], C.ink, 2.5); D.line([[vx + H * ta, vy + H], [vx - H * ta, vy - H]], C.ink, 2.5); D.line([[vx, vy - H], [vx, vy + H]], C['ink-muted'], 1.5, [5, 5]);
    for (const s of [1, -1]) { const c = toS(vx, vy + s * H); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.ellipse(c[0], c[1], H * ta * sc(), H * ta * sc() * 0.22, 0, 0, 7); ctx.stroke(); }
    // plane: through (vx, off), angle β with the axis
    const b = (W.beta * Math.PI) / 180, dx = Math.sin(b), dy = -Math.cos(b); const L = 6; const p0 = [vx - dx * L, W.off - dy * L], p1 = [vx + dx * L, W.off + dy * L];
    ctx.save(); const r = viewBounds(0); ctx.beginPath(); const ca = toS(-5, 3), cb = toS(0.6, -3); ctx.rect(ca[0], ca[1], cb[0] - ca[0], cb[1] - ca[1]); ctx.clip(); D.line([p0, p1], C.beni, 4); ctx.restore();
    const e = Math.cos(b) / Math.cos((W.alpha * Math.PI) / 180); const deg = Math.abs(W.off) < 0.06;
    const type = deg ? (W.beta > W.alpha + 0.5 ? 'a point' : Math.abs(W.beta - W.alpha) <= 0.5 ? 'a straight line' : 'two crossing lines') : W.beta >= 89.5 ? 'CIRCLE' : W.beta > W.alpha + 0.5 ? 'ELLIPSE' : Math.abs(W.beta - W.alpha) <= 0.5 ? 'PARABOLA' : 'HYPERBOLA';
    W.type = type;
    // inset: the true shape of the section
    const cx = 2.9, cy = -0.25; D.rect(1, -2.6, 4.8, 2.6, C.panel, C.ink, 2);
    ctx.save(); const ia = toS(1, 2.6), ib = toS(4.8, -2.6); ctx.beginPath(); ctx.rect(ia[0], ia[1], ib[0] - ia[0], ib[1] - ia[1]); ctx.clip();
    const pts = []; const col = C.beni;
    if (deg) { if (type === 'a point') D.dot(cx, cy, 6, col, null); else if (type === 'a straight line') D.line([[cx - 1.7, cy], [cx + 1.7, cy]], col, 3); else { const m = Math.min(2, Math.sqrt(Math.max(e * e - 1, 0.05))); D.line([[cx - 1.7, cy - 1.7 * m], [cx + 1.7, cy + 1.7 * m]], col, 3); D.line([[cx - 1.7, cy + 1.7 * m], [cx + 1.7, cy - 1.7 * m]], col, 3); } }
    else if (e < 0.999) { const a = 1.5, bb = a * Math.sqrt(1 - e * e); for (let i = 0; i <= 120; i++) { const t = (i / 120) * Math.PI * 2; pts.push([cx + a * Math.cos(t), cy + bb * Math.sin(t)]); } D.line(pts, col, 3.5); if (e > 0.02) { D.dot(cx - a * e, cy, 4, C.ink, null); D.dot(cx + a * e, cy, 4, C.ink, null); } }
    else if (Math.abs(e - 1) < 0.02) { const a = 0.35; for (let s = -3.2; s <= 3.2; s += 0.05) pts.push([cx - 1.4 + a * s * s, cy + 2 * a * s]); D.line(pts, col, 3.5); D.dot(cx - 1.4 + a, cy, 4, C.ink, null); }
    else { const a = 0.7, bb = a * Math.sqrt(e * e - 1); for (const sg of [1, -1]) { const q = []; for (let s = -2.2; s <= 2.2; s += 0.05) q.push([cx + sg * a * Math.cosh(s), cy + bb * Math.sinh(s)]); D.line(q, col, 3.5); } }
    ctx.restore();
    D.textW(type, cx, 2.15, { size: 15, w: 800, disp: true, col: C.beni }); D.textW('β = ' + Math.round(W.beta) + '°  ·  α = ' + W.alpha + '°' + (deg ? '' : '  ·  e = ' + fmtN(e, 2)), cx, 1.75, { size: 11, w: 700, col: C['ink-muted'] });
    
  },
};

/* =============== CONIC on the plane =============== */
MINI.conic = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { cn: null, rod: null, build: null, extra: [], kimCorner: true, kimX: 0.95, kimY: 0.85, readout: true }); },
  tick(W) { if (W.tickV) W.tickV(); },
  draw(W) {
    MINI.plane.draw(W); const K = W.cn;
    if (K) {
      const pr = K.p == null ? 1 : K.p; const col = K.col || C.beni;
      for (const br of conicBranches(K)) { const n = Math.max(2, Math.floor(br.length * pr)); D.line(br.slice(0, n), col, 3.5); }
      const F = conicFoci(K); if (K.showF !== false && pr >= 1) F.forEach((f, i) => { D.dot(f[0], f[1], 6, C.kin, C.ink); const s = toS(...f); D.text(F.length > 1 ? 'F' + (i + 1) : 'F', s[0] + 8, s[1] - 8, { size: 12, w: 800, align: 'left', stroke: C.paper }); });
      if (K.type === 'circle' && pr >= 1) D.dot(K.h, K.k, 5, C.ink, null);
      if (K.type === 'parabola' && K.showD !== false && pr >= 1) { const a = K.a; if (K.vert) D.line([[W.pl.x0, -a], [W.pl.x1, -a]], C['matcha-deep'], 2.5, [8, 5]); else D.line([[-a, W.pl.y0], [-a, W.pl.y1]], C['matcha-deep'], 2.5, [8, 5]); }
      if (K.showLR && pr >= 1) { const lr = latusEnds(K); lr.forEach((pq) => D.line(pq, C.sora, 3)); }
      if (K.showP && pr >= 1) { const P = conicPoint(K, K.t); const ds = []; if (K.type === 'circle') { D.line([[K.h, K.k], P], C.sora, 2.5, [6, 4]); ds.push('CP = ' + fmtN(hyp2([K.h, K.k], P), 2)); }
        if (K.type === 'parabola') { const Mp = K.vert ? [P[0], -K.a] : [-K.a, P[1]]; D.line([P, F[0]], C.sora, 2.5, [6, 4]); D.line([P, Mp], C['matcha-deep'], 2.5, [6, 4]); ds.push('PF = ' + fmtN(hyp2(P, F[0]), 2), 'PM = ' + fmtN(hyp2(P, Mp), 2)); }
        if (K.type === 'ellipse' || K.type === 'hyperbola') { D.line([P, F[0]], C.sora, 2.5, [6, 4]); D.line([P, F[1]], C['matcha-deep'], 2.5, [6, 4]); const d1 = hyp2(P, F[0]), d2 = hyp2(P, F[1]); ds.push('PF₁ = ' + fmtN(d1, 2), 'PF₂ = ' + fmtN(d2, 2), K.type === 'ellipse' ? 'sum = ' + fmtN(d1 + d2, 2) : '|diff| = ' + fmtN(Math.abs(d1 - d2), 2)); }
        const s = toS(...P); ctx.beginPath(); ctx.arc(s[0], s[1], 10, 0, 7); ctx.fillStyle = C.kin; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); D.text('P', s[0], s[1] + 4, { size: 11, w: 800 });
        if (W.readout) { const bw = Math.max(...ds.map((t) => t.length)) * 7.4 + 16, bh = ds.length * 17 + 10; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, bh); ctx.strokeRect(8, 8, bw, bh); ds.forEach((t, i) => D.text(t, 16, 25 + i * 17, { size: 13, w: 800, align: 'left', col: i === ds.length - 1 && ds.length === 3 ? C.beni : C.ink })); } }
    }
    if (W.build) { const B = W.build; const c = toS(B.c[0], B.c[1]); ctx.strokeStyle = B.ok ? C['matcha-deep'] : C.beni; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(c[0], c[1], B.r * sc(), 0, 7); ctx.stroke(); D.dot(B.c[0], B.c[1], 9, C.kin, C.ink, 2.5); const rp = [B.c[0] + B.r, B.c[1]]; D.line([B.c, rp], C.ink, 2, [5, 4]); D.dot(rp[0], rp[1], 8, C.panel, C.ink, 2.5);
      const t1 = 'centre (' + fmtN(B.c[0], 2) + ', ' + fmtN(B.c[1], 2) + ')', t2 = 'r = ' + fmtN(B.r, 2); const bw = Math.max(t1.length, t2.length) * 7.4 + 16; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, 42); ctx.strokeRect(8, 8, bw, 42); D.text(t1, 16, 25, { size: 13, w: 800, align: 'left' }); D.text(t2, 16, 43, { size: 13, w: 800, align: 'left', col: C.beni }); }
    if (W.rod) { const R = W.rod; const th = R.th; const A = [R.L * Math.cos(th), 0], Bp = [0, R.L * Math.sin(th)]; const P = [A[0] - (R.ap / R.L) * (A[0] - Bp[0]), (R.ap / R.L) * Bp[1]]; R.trail.push(P); if (R.trail.length > 600) R.trail.shift(); D.line(R.trail, C.sakura, 3); D.line([A, Bp], C.ink, 5); D.dot(A[0], A[1], 7, C.sora, C.ink); D.dot(Bp[0], Bp[1], 7, C.sora, C.ink); D.dot(P[0], P[1], 8, C.beni, C.ink); const s = toS(...P); D.text('P', s[0] + 10, s[1] - 6, { size: 13, w: 800, align: 'left', stroke: C.paper }); }
    for (const t of W.extra) { if (t.seg) D.line(t.seg, t.col || C.ink, t.w || 2.5, t.dash); if (t.txt) { const p = toS(t.x, t.y); D.text(t.txt, p[0], p[1], { size: t.size || 12, w: 800, col: t.col || C.ink, stroke: C.paper, align: t.align || 'center' }); } }
  },
};
/* point at parameter t (radians / hyperbolic s) */
function conicPoint(K, t) {
  if (K.type === 'circle') return [K.h + K.r * Math.cos(t), K.k + K.r * Math.sin(t)];
  if (K.type === 'parabola') { const a = K.a, s = t; return K.vert ? [2 * a * s, a * s * s] : [a * s * s, 2 * a * s]; }
  if (K.type === 'ellipse') return [K.A * Math.cos(t), K.B * Math.sin(t)];
  if (K.type === 'hyperbola') { const sg = K.br || 1; return K.vert ? [K.B * Math.sinh(t), sg * K.A * Math.cosh(t)] : [sg * K.A * Math.cosh(t), K.B * Math.sinh(t)]; }
}
function conicBranches(K) {
  const out = [];
  if (K.type === 'circle' || K.type === 'ellipse') { const q = []; for (let i = 0; i <= 160; i++) q.push(conicPoint(K, (i / 160) * Math.PI * 2)); out.push(q); }
  if (K.type === 'parabola') { const q = []; const S = K.span || 3; for (let i = 0; i <= 160; i++) q.push(conicPoint(K, -S + (2 * S * i) / 160)); out.push(q); }
  if (K.type === 'hyperbola') for (const sg of [1, -1]) { const q = []; const S = K.span || 2; for (let i = 0; i <= 120; i++) q.push(conicPoint(Object.assign({}, K, { br: sg }), -S + (2 * S * i) / 120)); out.push(q); }
  return out;
}
function conicFoci(K) {
  if (K.type === 'circle') return [];
  if (K.type === 'parabola') return [K.vert ? [0, K.a] : [K.a, 0]];
  const a = K.vert ? K.B : K.A, b = K.vert ? K.A : K.B; // a along the x-axis when horizontal
  if (K.type === 'ellipse') { const big = Math.max(K.A, K.B), small = Math.min(K.A, K.B); const c = Math.sqrt(big * big - small * small); return K.A >= K.B ? [[-c, 0], [c, 0]] : [[0, -c], [0, c]]; }
  const c = Math.hypot(K.A, K.B); return K.vert ? [[0, -c], [0, c]] : [[-c, 0], [c, 0]];
}
function latusEnds(K) {
  if (K.type === 'parabola') { const a = K.a; return [K.vert ? [[-2 * a, a], [2 * a, a]] : [[a, -2 * a], [a, 2 * a]]]; }
  const F = conicFoci(K); if (K.type === 'ellipse') { const big = Math.max(K.A, K.B), small = Math.min(K.A, K.B); const l = (small * small) / big; return F.map((f) => (K.A >= K.B ? [[f[0], -l], [f[0], l]] : [[-l, f[1]], [l, f[1]]])); }
  const l = (K.B * K.B) / K.A; return F.map((f) => (K.vert ? [[-l, f[1]], [l, f[1]]] : [[f[0], -l], [f[0], l]]));
}
/* make P draggable along the conic (nearest sampled parameter) */
function grabP(W, t0 = 0.8) {
  const K = W.cn; K.showP = true; K.t = t0; const R = K.type === 'parabola' ? [-(K.span || 3), K.span || 3] : K.type === 'hyperbola' ? [-(K.span || 2), K.span || 2] : [0, Math.PI * 2];
  W.drags = [{ get: () => conicPoint(K, K.t), r: 0.8, set: (x, y) => { let best = K.t, bd = 1e9, bb = K.br; const brs = K.type === 'hyperbola' ? [1, -1] : [K.br]; for (const sg of brs) for (let i = 0; i <= 400; i++) { const t = R[0] + ((R[1] - R[0]) * i) / 400; const p = conicPoint(Object.assign({}, K, { br: sg }), t); const d = (p[0] - x) ** 2 + (p[1] - y) ** 2; if (d < bd) { bd = d; best = t; bb = sg; } } if (Math.abs(best - K.t) > 0.02) SFX.tick(); K.t = best; K.br = bb; K.moved = (K.moved || 0) + 1; } }];
}
async function traceConic(W, K, d = 1.1) { K.p = 0; W.cn = K; await tw(K, { p: 1, duration: d, ease: 'power1.inOut' }); SFX.swish(); }
/* build a circle: drag the centre (snaps to the grid) and the radius handle */
function buildCircle(W, o = {}) {
  const snap = o.snap || 0.5; const B = { c: (o.c || [0, 0]).slice(), r: o.r || 1.5, ok: false }; W.build = B;
  W.drags = [{ get: () => B.c, r: 0.6, set: (x, y) => { const nx = Math.round(x / snap) * snap, ny = Math.round(y / snap) * snap; if (nx !== B.c[0] || ny !== B.c[1]) { B.c[0] = nx; B.c[1] = ny; SFX.tick(); } } }, { get: () => [B.c[0] + B.r, B.c[1]], r: 0.6, set: (x) => { const nr = Math.max(0.25, Math.round((x - B.c[0]) * 100) / 100); B.r = nr; } }];
  return B;
}
function circlePart(q, h, k, r, o = {}) {
  return { k: 'task', q, todo: o.todo || 'Drag the centre, then stretch the radius handle. Lock in.', x: o.x, no: 'Centre (' + fmtN(h, 3) + ', ' + fmtN(k, 3) + '), r = ' + (o.rs || fmtN(r, 3)) + '. ' + (o.x || ''),
    pre: async () => buildCircle(W, o), check: (W) => { const B = W.build; const ok = Math.abs(B.c[0] - h) < 1e-6 && Math.abs(B.c[1] - k) < 1e-6 && Math.abs(B.r - r) < (o.tol || 0.08); B.ok = ok; return ok; },
    auto: (W) => { W.build.c = [h, k]; W.build.r = r; }, reveal: (W) => { W.build.c = [h, k]; gsap.to(W.build, { r, duration: 0.6 }); W.build.ok = true; }, act: async (W, r2) => { W.drags = []; if (r2.ok) SFX.sparkle(); } };
}

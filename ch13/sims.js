/* =========================================================
   CHAPTER 13 · STATISTICS — simulations and exact statistics helpers
   strip : a dot plot on a number line. Drag any dot; the mean is a balance fulcrum, the median a flag,
           deviations show as bars (|x − x̄|) or as real squares ((x − x̄)², so variance is an area)
   freq  : frequency table as bars (discrete) or a histogram (classes) with mean / median lines
   ========================================================= */
const ST = {
  mean: (xs, fs) => (fs ? xs.reduce((s, x, i) => s + x * fs[i], 0) / ST.N(fs) : xs.reduce((s, x) => s + x, 0) / xs.length),
  N: (fs) => fs.reduce((a, b) => a + b, 0),
  median: (xs) => { const a = xs.slice().sort((p, q) => p - q), n = a.length; return n % 2 ? a[(n - 1) / 2] : (a[n / 2 - 1] + a[n / 2]) / 2; },
  medianD: (xs, fs) => { const N = ST.N(fs); let c = 0; const at = (k) => { let cc = 0; for (let i = 0; i < xs.length; i++) { cc += fs[i]; if (cc >= k) return xs[i]; } }; return N % 2 ? at((N + 1) / 2) : (at(N / 2) + at(N / 2 + 1)) / 2; },
  medianG: (lo, h, fs) => { const N = ST.N(fs); let c = 0; for (let i = 0; i < fs.length; i++) { if (c + fs[i] >= N / 2) return lo[i] + ((N / 2 - c) / fs[i]) * h; c += fs[i]; } },
  md: (xs, c, fs) => (fs ? xs.reduce((s, x, i) => s + fs[i] * Math.abs(x - c), 0) / ST.N(fs) : xs.reduce((s, x) => s + Math.abs(x - c), 0) / xs.length),
  sumAbs: (xs, c, fs) => xs.reduce((s, x, i) => s + (fs ? fs[i] : 1) * Math.abs(x - c), 0),
  sumSq: (xs, c, fs) => xs.reduce((s, x, i) => s + (fs ? fs[i] : 1) * (x - c) ** 2, 0),
  vr: (xs, fs) => ST.sumSq(xs, ST.mean(xs, fs), fs) / (fs ? ST.N(fs) : xs.length),
};
const r2 = (v) => Math.round(v * 100) / 100;
const fm2 = (v) => fmtN(r2(v), 2);

MINI.strip = {
  view: { w: 12, h: 6 },
  init(W) { Object.assign(W, { xs: [], lo: 0, hi: 20, mode: 'none', showMean: true, showMed: false, center: null, lock: false, kimCorner: true, kimX: 0.95, cap: '', ys: 0.55 }); },
  draw(W) {
    const L = -5.4, R = 5.4, y0 = -1.6; const X = (v) => L + ((v - W.lo) / (W.hi - W.lo)) * (R - L); W.X = X;
    const m = ST.mean(W.xs.map((d) => d.v)); const c = typeof W.center === 'number' ? W.center : W.center === 'median' ? ST.median(W.xs.map((d) => d.v)) : m; const u = (R - L) / (W.hi - W.lo);
    // squares (x − c)² drawn to scale: side = |x − c|
    if (W.mode === 'sq') { const big = Math.max(...W.xs.map((d) => Math.abs(d.v - c))) * u; const kq = Math.min(1, 3.6 / Math.max(big, 1e-9)); W.sqScale = kq; W.xs.forEach((d) => { const s = Math.abs(d.v - c) * u * kq; if (s < 1e-6) return; const x0 = d.v < c ? X(c) - s : X(c); ctx.save(); ctx.globalAlpha = 0.18; D.rect(x0, y0, x0 + s, y0 + s, C.beni, null); ctx.restore(); D.rect(x0, y0, x0 + s, y0 + s, null, C.beni, 1.2); }); }
    D.line([[L - 0.2, y0], [R + 0.2, y0]], C.ink, 2.5);
    const step = W.tick || Math.max(1, Math.ceil((W.hi - W.lo) / 12)); for (let v = Math.ceil(W.lo / step) * step; v <= W.hi; v += step) { const p = toS(X(v), y0); ctx.fillStyle = C.ink; ctx.fillRect(p[0] - 1, p[1] - 5, 2, 10); D.text(String(v).replace('-', '−'), p[0], p[1] + 18, { size: 11, w: 600, col: C['ink-muted'] }); }
    // stacked dots
    const cnt = {}; W.xs.forEach((d) => { const k = d.v; cnt[k] = (cnt[k] || 0) + 1; d.row = cnt[k] - 1; });
    W.xs.forEach((d, i) => { const yy = y0 + 0.32 + d.row * W.ys; if (W.mode === 'dev') { const yd = yy; D.line([[X(c), yd], [X(d.v), yd]], d.v >= c ? C['matcha-deep'] : C.beni, 3); } D.dot(X(d.v), yy, 9, d.hl ? C.kin : C.sora, C.ink, 2); });
    if (W.showMean && W.xs.length) { const p = toS(X(m), y0); ctx.fillStyle = C.kin; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p[0], p[1] + 2); ctx.lineTo(p[0] - 11, p[1] + 20); ctx.lineTo(p[0] + 11, p[1] + 20); ctx.closePath(); ctx.fill(); ctx.stroke(); D.text('x̄ = ' + fm2(m), p[0], p[1] + 36, { size: 13, w: 800, col: C.ink, stroke: C.paper }); }
    if (typeof W.center === 'number') { const p = toS(X(c), y0); ctx.beginPath(); ctx.arc(p[0], p[1], 10, 0, 7); ctx.fillStyle = C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); D.text('c = ' + fm2(c), p[0], p[1] + 52, { size: 13, w: 800, col: C.beni, stroke: C.paper }); }
    if (W.showMed && W.xs.length) { const md = ST.median(W.xs.map((d) => d.v)); const p = toS(X(md), y0); D.line([[X(md), y0], [X(md), y0 + 3.2]], C['matcha-deep'], 2.5, [6, 4]); D.text('M = ' + fm2(md), p[0], toS(0, y0 + 3.4)[1], { size: 13, w: 800, col: C['matcha-deep'], stroke: C.paper }); }
    const xs = W.xs.map((d) => d.v), n = xs.length; if (n && W.mode !== 'none') { const lines = W.mode === 'dev' ? ['Σ|x − ' + (W.center === 'median' ? 'M' : 'x̄') + '| = ' + fm2(ST.sumAbs(xs, c)), 'M.D. = ' + fm2(ST.sumAbs(xs, c) / n)] : (typeof W.center === 'number' ? ['Σ(x − c)² = ' + fm2(ST.sumSq(xs, c)), 'smallest when c = x̄'] : ['Σ(x − x̄)² = ' + fm2(ST.sumSq(xs, m)), 'σ² = ' + fm2(ST.sumSq(xs, m) / n) + ',  σ = ' + fm2(Math.sqrt(ST.sumSq(xs, m) / n))]); const bw = Math.max(...lines.map((t) => t.length)) * 7.4 + 16; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, 44); ctx.strokeRect(8, 8, bw, 44); lines.forEach((t, i) => D.text(t, 16, 26 + i * 18, { size: 13, w: 800, align: 'left', col: i ? C.beni : C.ink })); }
    if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: 13, w: 800, stroke: C.paper });
  },
};
function stripSet(W, vals, lo, hi, o = {}) { W.xs = vals.map((v) => ({ v })); W.lo = lo; W.hi = hi; Object.assign(W, o); if (!W.lock) W.drags = W.xs.map((d) => ({ get: () => [W.X ? W.X(d.v) : 0, -1.6 + 0.32 + (d.row || 0) * W.ys], r: 0.45, set: (x) => { const L = -5.4, R = 5.4; const v = clamp(Math.round(W.lo + ((x - L) / (R - L)) * (W.hi - W.lo)), W.lo, W.hi); if (v !== d.v) { d.v = v; SFX.tick(); W.moved = (W.moved || 0) + 1; } } })); }

MINI.freq = {
  view: { w: 12, h: 6.4 },
  init(W) { Object.assign(W, { xs: [], fs: [], lo: null, h: 0, k: 1, mean: null, med: null, kimCorner: true, kimX: 0.95, title: '', hl: -1 }); },
  draw(W) {
    const n = W.fs.length; if (!n) return; const L = -5.2, R = 5.2, y0 = -2.2, H = 3.8; const F = Math.max(...W.fs);
    const grouped = W.lo != null; const a = grouped ? W.lo[0] : W.xs[0] - (W.xs[1] - W.xs[0] || 1) / 2, b = grouped ? W.lo[n - 1] + W.h : W.xs[n - 1] + (W.xs[n - 1] - W.xs[n - 2] || 1) / 2; const X = (v) => L + ((v - a) / (b - a)) * (R - L);
    if (W.title) D.textW(W.title, 0, 2.6, { size: 14, w: 800, disp: true });
    D.line([[L, y0], [R, y0]], C.ink, 2.5);
    for (let i = 0; i < n; i++) { const hh = (W.fs[i] / F) * H * W.k; const x0 = grouped ? X(W.lo[i]) : X(W.xs[i]) - Math.min(0.35, ((R - L) / n) * 0.3), x1 = grouped ? X(W.lo[i] + W.h) : X(W.xs[i]) + Math.min(0.35, ((R - L) / n) * 0.3); D.rect(x0, y0, x1, y0 + hh, i === W.hl ? C.kin : C['sora-tint'], C.ink, 2); const p = toS((x0 + x1) / 2, y0 + hh); if (W.k > 0.6) D.text(String(W.fs[i]), p[0], p[1] - 5, { size: 11, w: 800 }); const q = toS(grouped ? x0 : (x0 + x1) / 2, y0); D.text(grouped ? String(W.lo[i]) : String(W.xs[i]), q[0], q[1] + 15, { size: 10, w: 600, col: C['ink-muted'] }); }
    if (grouped) { const q = toS(X(b), y0); D.text(String(b), q[0], q[1] + 15, { size: 10, w: 600, col: C['ink-muted'] }); }
    if (W.mean != null) { const x = X(W.mean); D.line([[x, y0], [x, y0 + H + 0.2]], C.beni, 3); const p = toS(x, y0 + H + 0.25); D.text('x̄ = ' + fm2(W.mean), p[0], p[1] - 4, { size: 13, w: 800, col: C.beni, stroke: C.paper }); }
    if (W.med != null) { const x = X(W.med); D.line([[x, y0], [x, y0 + H - 0.3]], C['matcha-deep'], 3, [7, 5]); const p = toS(x, y0 + H - 0.25); D.text('M = ' + fm2(W.med), p[0], p[1] - 4, { size: 13, w: 800, col: C['matcha-deep'], stroke: C.paper }); }
  },
};
async function growFreq(W) { W.k = 0; await tw(W, { k: 1, duration: 0.7, ease: 'back.out(1.6)' }); SFX.swish(); }

/* =========================================================
   CHAPTER 12 · LIMITS AND DERIVATIVES — simulations
   calc : coordinate plane + y = f(x). Points that slide in from the left and right of a (limits, holes),
          a draggable point P with a secant to Q = a + h that collapses into the tangent (derivatives)
   sand : unit circle; triangle < sector < triangle squeezes sin x / x between cos x and 1
   ========================================================= */
const ND = (f, x, e = 1e-5) => (f(x + e) - f(x - e)) / (2 * e); // numeric derivative (used by the sims and the tests)
const fmt4 = (v) => (!isFinite(v) ? 'undefined' : fmtN(v, 4));

MINI.calc = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { F: null, fcol: null, a: null, h: null, tan: false, read: true, app: null, holes: [], dotsF: [], kimCorner: true, kimX: 0.95, kimY: 0.85, fLab: 'f' }); },
  tick(W) { if (W.tickV) W.tickV(); },
  draw(W) {
    MINI.plane.draw(W); const [bx0, by0, bx1, by1] = viewBounds(0);
    if (W.F) drawCurve({ f: W.F, col: W.fcol || C.sora, w: 3.5, jump: (by1 - by0) * 0.35, n: 900 }, bx0, bx1, by0, by1);
    for (const g of W.extraF || []) drawCurve({ f: g.f, col: g.col, w: 2.5, dash: g.dash, jump: (by1 - by0) * 0.35 }, bx0, bx1, by0, by1);
    for (const [x, y] of W.holes) { const s = toS(x, y); ctx.beginPath(); ctx.arc(s[0], s[1], 6, 0, 7); ctx.fillStyle = C.paper; ctx.fill(); ctx.strokeStyle = W.fcol || C.sora; ctx.lineWidth = 2.5; ctx.stroke(); }
    for (const [x, y] of W.dotsF) D.dot(x, y, 6, W.fcol || C.sora, null);
    const lines = [];
    if (W.app) { const A = W.app, d = Math.max(A.d, 1e-6); for (const [sg, col] of [[-1, C.beni], [1, C['matcha-deep']]]) { const x = A.a + sg * d, y = W.F(x); if (!isFinite(y)) continue; const s = toS(x, y); D.line([[x, 0], [x, y]], col, 1.5, [4, 4]); ctx.beginPath(); ctx.arc(s[0], s[1], 8, 0, 7); ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); }
      D.line([[A.a, by0], [A.a, by1]], C['ink-muted'], 1.5, [6, 5]); lines.push(['x → ' + fmtN(A.a, 3) + '⁻: f = ' + fmt4(W.F(A.a - d)), C.beni], ['x → ' + fmtN(A.a, 3) + '⁺: f = ' + fmt4(W.F(A.a + d)), C['matcha-deep']], ['distance ' + fmtN(d, 4), C['ink-muted']]); }
    if (W.a != null) { const a = W.a, fa = W.F(a); const P = [a, fa];
      if (W.h != null && Math.abs(W.h) > 1e-9) { const Q = [a + W.h, W.F(a + W.h)], m = (Q[1] - P[1]) / W.h; D.line([[bx0, P[1] + m * (bx0 - a)], [bx1, P[1] + m * (bx1 - a)]], C.beni, 2.5); D.dot(Q[0], Q[1], 8, C.panel, C.beni, 3); lines.push(['h = ' + fmtN(W.h, 4), C.ink], ['secant slope ' + fmt4(m * (W.ys || 1)), C.beni]); }
      if (W.tan) { const m = ND(W.F, a); D.line([[bx0, fa + m * (bx0 - a)], [bx1, fa + m * (bx1 - a)]], C['matcha-deep'], 3, [9, 5]); lines.push(['tangent slope ' + fmt4(m * (W.ys || 1)), C['matcha-deep']]); }
      const s = toS(...P); ctx.beginPath(); ctx.arc(s[0], s[1], 10, 0, 7); ctx.fillStyle = C.kin; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); lines.unshift(['x = ' + fmtN(a, 3) + ',  ' + W.fLab + '(x) = ' + fmt4(fa * (W.ys || 1)), C.ink]); }
    if (W.read && lines.length) { const bw = Math.max(...lines.map((l) => l[0].length)) * 7.2 + 16, bh = lines.length * 17 + 8; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, bh); ctx.strokeRect(8, 8, bw, bh); lines.forEach(([t, col], i) => D.text(t, 16, 24 + i * 17, { size: 12.5, w: 800, align: 'left', col })); }
  },
};
function calcView(W, F, x0, x1, o = {}) {
  let lo = Infinity, hi = -Infinity; const ys = []; for (let i = 0; i <= 200; i++) { const y = F(x0 + ((x1 - x0) * i) / 200); if (isFinite(y)) ys.push(y); } ys.sort((p, q) => p - q);
  if (ys.length) { lo = ys[Math.floor(ys.length * 0.05)]; hi = ys[Math.floor(ys.length * 0.95)]; } if (o.y) [lo, hi] = o.y; if (!(hi > lo)) { lo -= 1; hi += 1; }
  W.ys = 1; if (W.pl) W.pl.fy = null;
  if (o.fit && (hi - lo) / (x1 - x0) > 1.4) { const ys = (hi - lo) / ((x1 - x0) * 0.55); W.ys = ys; lo /= ys; hi /= ys; const G = F; F = (x) => G(x) / ys; W.pl.fy = (y) => { const v = y * ys; return fmtN(v, Math.abs(v) >= 100 ? 0 : Math.abs(v) >= 10 ? 1 : 2); }; }
  const pad = (hi - lo) * 0.18 + 0.3; planeView(W, x0, x1, Math.min(lo - pad, -0.3), Math.max(hi + pad, 0.3)); W.F = F;
}
/* drag P along the curve (x snaps to 0.05); optional draggable Q for the secant */
function grabCalc(W, o = {}) {
  const snap = o.snap || 0.05; W.drags = [{ get: () => [W.a, W.F(W.a)], r: 0.8, set: (x) => { const nx = clamp(Math.round(x / snap) * snap, W.pl.x0 + 0.05, W.pl.x1 - 0.05); if (nx !== W.a) { W.a = nx; SFX.tick(); W.moved = (W.moved || 0) + 1; } } }];
  if (W.h != null) W.drags.push({ get: () => [W.a + W.h, W.F(W.a + W.h)], r: 0.8, set: (x) => { let nh = Math.round((x - W.a) * 100) / 100; if (Math.abs(nh) < 0.01) nh = 0.01 * Math.sign(nh || 1); W.h = nh; } });
}
async function approach(W, a, from = 1.5, d = 1.6) { W.app = { a, d: from }; SFX.whoosh(); await tw(W.app, { d: 0.001, duration: d, ease: 'power2.in' }); SFX.ding ? SFX.ding() : SFX.chime(); }

/* =============== SANDWICH: area OAC < sector OAC < area OAB =============== */
MINI.sand = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { x: 0.9, kimCorner: true, kimX: 0.95, show: 3 }); },
  draw(W) {
    const R = 2.6, O = [-3, -2.2], x = W.x; const P = (r, t) => [O[0] + r * Math.cos(t), O[1] + r * Math.sin(t)]; const A = P(R, 0), Cc = P(R, x), B = [A[0], O[1] + R * Math.tan(x)], Dd = [Cc[0], O[1]];
    const fill = (pts, col, a) => { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); pts.forEach((q, i) => { const s = toS(...q); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); ctx.fill(); ctx.restore(); };
    const o = toS(...O); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(o[0], o[1], R * sc(), -Math.PI / 2 - 0.05, 0.05, false); ctx.stroke(); ctx.beginPath(); ctx.arc(o[0], o[1], R * sc(), -Math.PI / 2, 0); ctx.stroke();
    if (W.show >= 3) fill([O, A, B], C.sakura, 0.6);
    if (W.show >= 2) { ctx.save(); ctx.globalAlpha = 0.65; ctx.fillStyle = C['sora-tint']; ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.arc(o[0], o[1], R * sc(), 0, -x, true); ctx.closePath(); ctx.fill(); ctx.restore(); }
    if (W.show >= 1) fill([O, A, Cc], C['kin-tint'], 0.9);
    D.line([O, A], C.ink, 2.5); D.line([O, B], C.ink, 2); D.line([A, B], C.beni, 3); D.line([Cc, Dd], C['matcha-deep'], 3); D.line([O, Cc], C.ink, 2);
    for (const [p, t, dx, dy] of [[O, 'O', -14, 14], [A, 'A', 6, 14], [B, 'B', 8, 0], [Cc, 'C', -12, -6], [Dd, 'D', -4, 16]]) { const s = toS(...p); D.text(t, s[0] + dx, s[1] + dy, { size: 13, w: 800 }); }
    const sx = Math.sin(x) / x; const lines = [['x = ' + fmtN(x, 3) + ' rad', C.ink], ['cos x = ' + fmtN(Math.cos(x), 4), C['matcha-deep']], ['sin x / x = ' + fmtN(sx, 4), C.beni], ['upper bound 1', C.sora]];
    const bx = toS(1.2, 2.6); lines.forEach(([t, col], i) => D.text(t, bx[0], bx[1] + i * 20, { size: 15, w: 800, align: 'left', col }));
    const y0 = 0.1, y1 = 0.7; D.rect(1.2, y0, 4.4, y1, C.panel, C.ink, 2); const X = (v) => toS(1.2 + 3.2 * clamp(v, 0, 1), 0)[0]; const T0 = toS(0, y1)[1], T1 = toS(0, y0)[1]; ctx.fillStyle = C['matcha-deep']; ctx.fillRect(X(0), T0, X(Math.cos(x)) - X(0), T1 - T0); ctx.fillStyle = C.beni; ctx.fillRect(X(sx) - 2, T0 - 6, 4, T1 - T0 + 12); D.textW('0', 1.2, y0 - 0.4, { size: 11, col: C['ink-muted'] }); D.textW('1', 4.4, y0 - 0.4, { size: 11, col: C['ink-muted'] }); D.textW('cos x ▮   sin x/x |', 2.8, y0 - 0.4, { size: 11, w: 700, col: C['ink-muted'] });
  },
};

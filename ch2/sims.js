/* =========================================================
   CHAPTER 2 · RELATIONS & FUNCTIONS — simulations
   grid (Cartesian product lattice, tap points), arrows (arrow diagrams you draw),
   machine (function machine with a table), plane (shared) for graphs
   ========================================================= */
const pk = (a, b) => SET.lbl(a) + '|' + SET.lbl(b);
const pstr = (a, b) => '(' + SET.lbl(a) + ', ' + SET.lbl(b) + ')';
const prodPairs = (A, B) => A.flatMap((a) => B.map((b) => [a, b]));
const relStr = (ps) => (ps.length ? '{' + ps.map(([a, b]) => pstr(a, b)).join(', ') + '}' : 'φ');

/* =============== GRID: A × B lattice =============== */
MINI.grid = {
  view: { w: 8, h: 6 },
  init(W) { Object.assign(W, { A: [], B: [], on: new Set(), hl: new Set(), tapOn: false, labA: 'A', labB: 'B', showLab: true, k: 1, kimCorner: true, caption: '' }); },
  draw(W) {
    const nA = W.A.length, nB = W.B.length; if (!nA) return;
    const o = toS(0, 0), xe = toS(nA + 0.8, 0), ye = toS(0, nB + 0.8);
    ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...o); ctx.lineTo(...xe); ctx.moveTo(...o); ctx.lineTo(...ye); ctx.stroke(); D.head(xe[0] + 4, xe[1], 0, 8); D.head(ye[0], ye[1] - 4, -Math.PI / 2, 8);
    D.text(W.labA, xe[0] - 4, xe[1] - 10, { size: 15, w: 800, disp: true, align: 'right' }); D.text(W.labB, ye[0] + 10, ye[1] + 12, { size: 15, w: 800, disp: true, align: 'left' });
    W.A.forEach((a, i) => { const p = toS(i + 1, 0); D.text(SET.lbl(a), p[0], p[1] + 18, { size: 13, w: 800 }); ctx.strokeStyle = C.tone; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); const q = toS(i + 1, nB + 0.4); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); ctx.setLineDash([]); });
    W.B.forEach((b, j) => { const p = toS(0, j + 1); D.text(SET.lbl(b), p[0] - 8, p[1] + 4, { size: 13, w: 800, align: 'right' }); ctx.strokeStyle = C.tone; ctx.lineWidth = 1; ctx.setLineDash([3, 4]); const q = toS(nA + 0.4, j + 1); ctx.beginPath(); ctx.moveTo(...p); ctx.lineTo(...q); ctx.stroke(); ctx.setLineDash([]); });
    W.A.forEach((a, i) => W.B.forEach((b, j) => {
      const key = pk(a, b); const p = toS(i + 1, j + 1); const on = W.on.has(key), hl = W.hl.has(key);
      ctx.beginPath(); ctx.arc(p[0], p[1], on ? 9 * W.k : 5, 0, 7); ctx.fillStyle = hl ? C.kin : on ? C.beni : C.panel; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke();
      if (on && W.showLab) D.text(pstr(a, b), p[0], p[1] - 14, { size: 11, w: 800, stroke: C.paper });
    }));
    if (W.caption) D.text(W.caption, SW / 2, 20, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
function gridLoad(W, A, B, { labA = 'A', labB = 'B', on = [], tap = false } = {}) {
  Object.assign(W, { A, B, labA, labB }); W.on = new Set(on.map(([a, b]) => pk(a, b))); const nA = A.length, nB = B.length;
  setView(nA + 2.4, nB + 2.2, (nA + 1) / 2, (nB + 1) / 2 + 0.1);
  W.onTap = tap ? (x, y) => { const i = Math.round(x) - 1, j = Math.round(y) - 1; if (i < 0 || j < 0 || i >= nA || j >= nB || Math.hypot(x - i - 1, y - j - 1) > 0.45) return; const key = pk(A[i], B[j]); if (W.on.has(key)) { W.on.delete(key); SFX.drop(); } else { W.on.add(key); SFX.pop(); FX.ono(pickOne(['PON!', 'POKE!', 'TAP!']), { x: 30 + Math.random() * 40, y: 25, hold: 0.25 }); } buzz(8); } : null;
}
async function gridLight(W, pairs, d = 0.12) { for (const [a, b] of pairs) { W.on.add(pk(a, b)); SFX.pop(); await wait(d); } }
function gridPart(q, A, B, ans, o = {}) {
  const want = new Set(ans.map(([a, b]) => pk(a, b)));
  return {
    k: 'task', q, todo: o.todo || 'Tap every point that belongs, then lock in.', x: o.x || relStr(ans) + '.', no: 'It is ' + relStr(ans) + '. ' + (o.x || ''),
    pre: () => { if (W.__scene !== MINI.grid) enterScene('grid'); gridLoad(W, A, B, { labA: o.labA, labB: o.labB, tap: true }); W.on = new Set(); },
    check: (W) => W.on.size === want.size && [...want].every((k) => W.on.has(k)),
    auto: (W) => { W.on = new Set(want); },
    reveal: (W) => { W.hl = new Set(want); },
    act: async () => { W.onTap = null; },
  };
}

/* =============== ARROWS: arrow diagram =============== */
MINI.arrows = {
  view: { w: 10, h: 7 },
  init(W) { Object.assign(W, { A: [], B: [], arr: [], sel: -1, tapOn: false, LA: 'A', LB: 'B', fnCheck: false, kimCorner: false, caption: '', same: false }); },
  pos(W, side, i) { const n = side ? W.B.length : W.A.length; const span = Math.min(4.2, n * 0.85); return [side ? 2.6 : -2.6, span / 2 - (n > 1 ? (i * span) / (n - 1) : span / 2) - 0.2]; },
  draw(W) {
    const S = MINI.arrows; const oval = (cx, n, lab) => { const p = toS(cx, -0.2); const hgt = Math.min(5.2, n * 0.9 + 1.2); ctx.beginPath(); ctx.ellipse(p[0], p[1], 1.25 * sc(), (hgt / 2) * sc(), 0, 0, 7); ctx.fillStyle = C.panel; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); const t = toS(cx, -0.2 + hgt / 2 + 0.35); D.text(lab, t[0], t[1], { size: 16, w: 800, disp: true }); };
    oval(-2.6, W.A.length, W.LA); oval(2.6, W.B.length, W.LB);
    const cnt = W.A.map((a, i) => W.arr.filter((r) => r.i === i).length);
    for (const r of W.arr) { const a = S.pos(W, 0, r.i), b = S.pos(W, 1, r.j); const pr = r.p == null ? 1 : r.p; const A2 = toS(a[0] + 0.45, a[1]), B2 = toS(lerp(a[0] + 0.45, b[0] - 0.45, pr), lerp(a[1], b[1], pr)); D.arrow(A2[0], A2[1], B2[0], B2[1], r.col || (W.fnCheck && cnt[r.i] > 1 ? C.beni : C.sora), 2.5, 10); }
    W.A.forEach((a, i) => { const p = S.pos(W, 0, i); const bad = W.fnCheck && cnt[i] !== 1; chipW(SET.lbl(a), p[0], p[1], { size: 13, hl: W.sel === i ? 1 : 0, bg: bad ? C.sakura : W.fnCheck ? C['matcha-tint'] : C.panel }); if (bad) { const s = toS(p[0] - 0.55, p[1]); D.text(cnt[i] ? cnt[i] + ' arrows!' : 'no arrow!', s[0], s[1] + 4, { size: 11, w: 800, col: C.beni, align: 'right' }); } });
    W.B.forEach((b, j) => { const p = S.pos(W, 1, j); const used = W.arr.some((r) => r.j === j); chipW(SET.lbl(b), p[0], p[1], { size: 13, bg: W.showRange && used ? C['sora-tint'] : C.panel }); });
    if (W.caption) D.text(W.caption, SW / 2, SH - 10, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
function arrowsLoad(W, A, B, { LA = 'A', LB = 'B', pairs = [], tap = false } = {}) {
  Object.assign(W, { A, B, LA, LB, sel: -1 }); W.arr = pairs.map(([a, b]) => ({ i: A.indexOf(a), j: B.indexOf(b), p: 1 }));
  W.onTap = tap ? (x, y) => {
    const S = MINI.arrows; for (let i = 0; i < A.length; i++) { const p = S.pos(W, 0, i); if (Math.abs(x - p[0]) < 0.7 && Math.abs(y - p[1]) < 0.35) { W.sel = i; SFX.key(); return; } }
    for (let j = 0; j < B.length; j++) { const p = S.pos(W, 1, j); if (Math.abs(x - p[0]) < 0.7 && Math.abs(y - p[1]) < 0.35) { if (W.sel < 0) { FX.ono('LEFT FIRST!', { x: 30, y: 20, red: true, hold: 0.4 }); SFX.boing(); return; } const k = W.arr.findIndex((r) => r.i === W.sel && r.j === j); if (k >= 0) { W.arr.splice(k, 1); SFX.drop(); } else { const r = { i: W.sel, j, p: 0 }; W.arr.push(r); gsap.to(r, { p: 1, duration: 0.25 }); SFX.zap(); buzz(10); } return; } }
  } : null;
}
async function arrowsDraw(W, pairs, d = 0.18) { for (const [a, b] of pairs) { const r = { i: W.A.indexOf(a), j: W.B.indexOf(b), p: 0 }; W.arr.push(r); SFX.zap(); await tw(r, { p: 1, duration: d }); } }
function arrowPart(q, A, B, ans, o = {}) {
  const want = new Set(ans.map(([a, b]) => pk(a, b)));
  return {
    k: 'task', q, todo: 'Tap an element on the left, then its partner on the right, to draw an arrow. Tap again to erase.', x: o.x || relStr(ans) + '.', no: 'It is ' + relStr(ans) + '. ' + (o.x || ''),
    pre: () => { if (W.__scene !== MINI.arrows) enterScene('arrows'); arrowsLoad(W, A, B, { LA: o.LA, LB: o.LB, tap: true }); },
    check: (W) => { const got = new Set(W.arr.map((r) => pk(W.A[r.i], W.B[r.j]))); return got.size === want.size && [...want].every((k) => got.has(k)); },
    auto: (W) => { W.arr = ans.map(([a, b]) => ({ i: A.indexOf(a), j: B.indexOf(b), p: 1 })); },
    reveal: (W) => { W.arr = ans.map(([a, b]) => ({ i: A.indexOf(a), j: B.indexOf(b), p: 1, col: C['matcha-deep'] })); },
    act: async () => { W.onTap = null; W.sel = -1; },
  };
}

/* =============== MACHINE: function machine =============== */
MINI.machine = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { rule: 'f(x) = ?', f: (x) => x, rows: [], ball: null, out: null, gear: 0, shake: 0, kimCorner: false }); },
  tick(W, dt) { W.gear += dt * (W.spin || 0.4); },
  draw(W) {
    const j = W.shake ? (Math.random() - 0.5) * 6 * W.shake : 0;
    ctx.save(); ctx.translate(j, 0);
    D.rect(-1.6, 0.2, 1.6, 2.6, C['sora-tint']); D.rect(-1.6, 2.2, 1.6, 2.6, C.ink); const tp = toS(0, 2.4); D.text('FUNCTION MACHINE', tp[0], tp[1] + 4, { size: 10, w: 800, col: C.panel });
    const rp = toS(0, 1.55); D.text(W.rule, rp[0], rp[1], { size: clamp(SW / 28, 13, 20), w: 800, disp: true });
    for (const gx of [-0.9, 0.9]) { const g = toS(gx, 0.75); ctx.save(); ctx.translate(g[0], g[1]); ctx.rotate(W.gear * (gx > 0 ? 1 : -1)); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillStyle = C.panel; const R = 0.32 * sc(); ctx.beginPath(); for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2, rr = k % 2 ? R : R * 1.25; ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    // input chute and output chute
    D.line([[-4.6, 1.4], [-1.6, 1.4]], C.ink, 2); D.line([[1.6, 1.4], [4.6, 1.4]], C.ink, 2);
    const ip = toS(-3.6, 1.95), op = toS(3.4, 1.95); D.text('input x', ip[0], ip[1], { size: 12, w: 700, col: C['ink-muted'] }); D.text('output f(x)', op[0], op[1], { size: 12, w: 700, col: C['ink-muted'] });
    ctx.restore();
    if (W.ball) chipW(W.ball.t, W.ball.x, W.ball.y, { size: 15, s: W.ball.s || 1 });
    if (W.out) chipW(W.out.t, W.out.x, W.out.y, { size: 15, s: W.out.s || 1, bg: C['matcha-tint'] });
    // table
    const n = Math.max(W.rows.length, W.cols || 0); if (n) { const cw = Math.min(1.25, 9 / (n + 1)); const x0 = -(cw * (n + 1)) / 2; const yy = -1.3; D.rect(x0, yy - 0.5, x0 + cw, yy + 0.5, C.ink); D.rect(x0, yy - 1.5, x0 + cw, yy - 0.5, C.ink); let p = toS(x0 + cw / 2, yy); D.text('x', p[0], p[1] + 5, { size: 14, w: 800, col: C.panel }); p = toS(x0 + cw / 2, yy - 1); D.text(W.yLab || 'f(x)', p[0], p[1] + 5, { size: 12, w: 800, col: C.panel });
      W.rows.forEach((r, i) => { const xa = x0 + cw * (i + 1); D.rect(xa, yy - 0.5, xa + cw, yy + 0.5, C.panel); D.rect(xa, yy - 1.5, xa + cw, yy - 0.5, r.yShow === false ? C.panel : C['matcha-tint']); let q = toS(xa + cw / 2, yy); D.text(r.xt != null ? r.xt : fmtN(r.x, 2), q[0], q[1] + 5, { size: 13, w: 800 }); q = toS(xa + cw / 2, yy - 1); if (r.yShow !== false) D.text(r.yt != null ? r.yt : fmtN(r.y, 2), q[0], q[1] + 5, { size: 13, w: 800, col: r.a ? C.ink : C.ink }); else D.text('?', q[0], q[1] + 5, { size: 15, w: 800, col: C.beni }); }); }
  },
};
async function feed(W, x, { xt, yt, add = true, d = 0.35 } = {}) {
  const y = W.f(x); W.ball = { t: xt != null ? xt : fmtN(x, 3), x: -4.3, y: 1.75, s: 1 }; SFX.click();
  await tw(W.ball, { x: -1.4, duration: d, ease: 'power1.in' }); W.ball = null; W.spin = 9; W.shake = 1; SFX.roll(); gsap.to(W, { shake: 0, duration: d * 1.4 }); await wait(d * 1.2); W.spin = 0.4;
  W.out = { t: yt != null ? yt : (isFinite(y) ? fmtN(y, 3) : 'undefined'), x: 1.4, y: 1.75, s: 1.6 }; SFX.coin(); FX.ono(pickOne(['CHIN!', 'PON!', 'KACHAN!']), { x: 75, y: 18, hold: 0.3 });
  await tw(W.out, { x: 3.6, s: 1, duration: d, ease: 'power2.out' });
  if (add) { const r = W.rows.find((q) => q.x === x && q.yShow === false); if (r) { r.yShow = true; r.y = y; r.yt = yt; } else W.rows.push({ x, y, xt, yt }); }
  await wait(d * 0.4); W.out = null; return y;
}


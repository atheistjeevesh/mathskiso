/* =========================================================
   SHARED MATH SCENES: number line + coordinate plane
   World units = real numbers. setView() fits the camera.
   ========================================================= */
function setView(w, h, cx = 0, cy = 0) { VIEW = { w, h }; W.cam = W.cam || { x: 0, y: 0, z: 1, shake: 0 }; W.cam.x = cx; W.cam.y = cy; resize(); }
const INF = Infinity;
const nfmt = (x) => (x === -INF ? '−∞' : x === INF ? '∞' : W && W.nl && W.nl.fmt ? W.nl.fmt(x) : fracStr(x));
function ivText(b) { return (b.a === -INF || !b.lc ? '(' : '[') + nfmt(b.a) + ', ' + nfmt(b.b) + (b.b === INF || !b.rc ? ')' : ']'); }

/* ---------------- NUMBER LINE ---------------- */
MINI.numline = {
  view: { w: 14, h: 5 },
  init(W) {
    Object.assign(W, { nl: { lo: -6, hi: 6, step: 1, label: 1, p: 0 }, segs: [], marks: [], dots: [], builder: null, walker: null, caption: '' });
  },
  onResize(W) { },
  fit(W) { const n = W.nl; setView((n.hi - n.lo) * 1.12, (n.hi - n.lo) * 1.12 * 0.42, (n.lo + n.hi) / 2, 0.5 * (n.hi - n.lo) * 0.12); },
  draw(W) {
    const n = W.nl; const pr = n.p == null ? 1 : n.p; const y0 = 0;
    const xa = n.lo - (n.hi - n.lo) * 0.04, xb = n.hi + (n.hi - n.lo) * 0.04;
    const A = toS(xa, y0), B = toS(lerp(xa, xb, pr), y0);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...A); ctx.lineTo(...B); ctx.stroke(); ctx.fillStyle = C.ink;
    if (pr >= 1) { D.head(B[0] + 4, B[1], 0, 8); D.head(A[0] - 4, A[1], Math.PI, 8); }
    const k0 = Math.ceil(n.lo / n.step - 1e-9), k1 = Math.floor(n.hi / n.step + 1e-9);
    for (let k = k0; k <= k1; k++) { const x = k * n.step; if ((x - xa) / (xb - xa) > pr) break; const p = toS(x, y0); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p[0], p[1] - 6); ctx.lineTo(p[0], p[1] + 6); ctx.stroke(); if (Math.abs(Math.round(x / n.label) * n.label - x) < 1e-9) D.text((n.fmt ? n.fmt(x) : fracStr(x)), p[0], p[1] + 22, { size: 12, w: 700, col: C['ink-muted'] }); }
    // integer dots
    for (const d of W.dots) { const p = toS(d.x, y0); ctx.beginPath(); ctx.arc(p[0], p[1], d.on ? 7 : 4, 0, 7); ctx.fillStyle = d.on ? (d.col || C.beni) : C.panel; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); }
    // segments (solution sets)
    W.segs.forEach((s, i) => { if ((s.p == null ? 1 : s.p) > 0) drawSeg(s, s.y != null ? s.y : 0.55 + i * 0.5); });
    if (W.builder) drawSeg(Object.assign({ col: C.beni, p: 1, big: true }, W.builder), 0.0001);
    for (const m of W.marks) { if (m.a === 0) continue; const p = toS(m.x, y0); ctx.save(); ctx.globalAlpha = m.a == null ? 1 : m.a; D.arrow(p[0], p[1] - 46, p[0], p[1] - 12, m.col || C.sora, 2.5, 9); D.label(m.t, p[0], p[1] - 52, m.col || C.sora); ctx.restore(); }
    if (W.walker) { const p = toS(W.walker.x, y0); D.sprite('kimmy-walk', p[0], p[1] - 6, Math.min(70, SH * 0.3), W.walker.flip); if (W.walker.say) D.bubbleW(W.walker.say, W.walker.x, y0 + 1.6 * (VIEW.h / 5), { bg: W.walker.ok === false ? C.sakura : W.walker.ok ? C['matcha-tint'] : C.panel }); }
    if (W.caption) D.text(W.caption, SW / 2, 24, { size: 15, w: 800, disp: true });
  },
};
function drawSeg(s, yOff) {
  const pr = s.p == null ? 1 : s.p; const n = W.nl; const lo = n.lo - (n.hi - n.lo) * 0.03, hi = n.hi + (n.hi - n.lo) * 0.03;
  const a = s.a === -INF ? lo : s.a, b = s.b === INF ? hi : s.b; const bb = lerp(a, b, pr);
  const yy = s.big ? 0 : yOff * (VIEW.h / 5);
  const P = toS(a, yy), Q = toS(bb, yy); ctx.strokeStyle = s.col || C.sora; ctx.fillStyle = s.col || C.sora; ctx.lineWidth = s.big ? 7 : 5; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(...P); ctx.lineTo(...Q); ctx.stroke();
  if (s.a === -INF) D.head(P[0] - 6, P[1], Math.PI, 11); if (s.b === INF && pr >= 1) D.head(Q[0] + 6, Q[1], 0, 11);
  const end = (x, closed) => { const p = toS(x, yy); ctx.beginPath(); ctx.arc(p[0], p[1], s.big ? 9 : 7, 0, 7); ctx.fillStyle = closed ? (s.col || C.sora) : C.panel; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = s.col || C.sora; ctx.stroke(); };
  if (s.a !== -INF) end(s.a, s.lc); if (s.b !== INF && pr >= 1) end(s.b, s.rc);
  if (s.t && pr >= 1) D.text(s.t, (P[0] + Q[0]) / 2, P[1] - 12, { size: 12, w: 800, col: s.col || C.sora });
}
/* interactive interval builder: drag the two ends, tap an end to toggle open/closed, ∞ buttons in the card */
function useBuilder(W, init, { snap = 0.5, allowInf = true } = {}) {
  W.builder = Object.assign({ a: -1, b: 1, lc: true, rc: true }, init);
  const B = W.builder; const n = W.nl;
  const sn = (x) => clamp(Math.round(x / snap) * snap, n.lo, n.hi);
  W.drags = [
    { get: () => [B.a === -INF ? n.lo : B.a, 0], r: 0.6, on: () => B.a !== -INF, set: (x) => { const v = sn(x); if (v !== B.a && v <= B.b) { B.a = v; SFX.tick(); } B.moved = true; }, end: () => { B._t = T; } },
    { get: () => [B.b === INF ? n.hi : B.b, 0], r: 0.6, on: () => B.b !== INF, set: (x) => { const v = sn(x); if (v !== B.b && v >= B.a) { B.b = v; SFX.tick(); } B.moved = true; }, end: () => { B._t = T; } },
  ];
  W.onTap = (x, y) => { const tol = 0.5 * (VIEW.w / 14); if (B.a !== -INF && Math.abs(x - B.a) < tol && Math.abs(y) < 1) { B.lc = !B.lc; SFX.pop(); } else if (B.b !== INF && Math.abs(x - B.b) < tol && Math.abs(y) < 1) { B.rc = !B.rc; SFX.pop(); } };
  const upd = () => live('Your set: <b>' + esc(ivText(B)) + '</b>');
  W.overlay = upd;
  if (allowInf) {
    const r = row(); const l = h('button', { class: 'btn', type: 'button' }, '← −∞'), rr = h('button', { class: 'btn', type: 'button' }, '+∞ →');
    l.onclick = () => { if (B.a === -INF) { B.a = Math.min(B.b, n.lo + snap * 2); } else B.a = -INF; SFX.whoosh(); }; rr.onclick = () => { if (B.b === INF) { B.b = Math.max(B.a, n.hi - snap * 2); } else B.b = INF; SFX.whoosh(); };
    r.append(l, rr, h('span', { class: 'cap' }, 'Drag ends · tap an end to fill/hollow it'));
  } else sheet.append(h('div', { class: 'cap' }, 'Drag the ends · tap an end to fill (included) or hollow (excluded) it'));
}
/* part factory: build the interval on the line */
function ivPart(q, ans, { lo, hi, step = 1, snap, start, x, label } = {}) {
  return {
    k: 'task', q, todo: 'Build ' + (label || 'the set') + ' on the number line, then lock in.', x: x || 'Exactly ' + ivText(ans) + '.', no: 'It is ' + ivText(ans) + '. ' + (x || ''),
    pre: async () => { if (W.__scene !== MINI.numline) enterScene('numline'); const lo2 = lo != null ? lo : Math.floor(Math.min(isFinite(ans.a) ? ans.a : 0, isFinite(ans.b) ? ans.b : 0) - 3), hi2 = hi != null ? hi : Math.ceil(Math.max(isFinite(ans.a) ? ans.a : 0, isFinite(ans.b) ? ans.b : 0) + 3); Object.assign(W.nl, { lo: lo2, hi: hi2, step, label: step * (hi2 - lo2 > 16 ? 2 : 1) }); MINI.numline.fit(W); useBuilder(W, start || { a: Math.round(lo2 + (hi2 - lo2) * 0.35), b: Math.round(lo2 + (hi2 - lo2) * 0.65), lc: true, rc: true }, { snap: snap || step }); },
    check: (W) => { const B = W.builder; const eq = (u, v) => u === v || Math.abs(u - v) < 1e-9; return eq(B.a, ans.a) && eq(B.b, ans.b) && (B.a === -INF || !!B.lc === !!ans.lc) && (B.b === INF || !!B.rc === !!ans.rc); },
    auto: (W) => Object.assign(W.builder, ans),
    reveal: (W) => { W.segs.push(Object.assign({ col: C['matcha-deep'], t: 'answer ' + ivText(ans) }, ans, { p: 0 })); gsap.to(W.segs[W.segs.length - 1], { p: 1, duration: 0.8 }); },
    act: async (W, r) => { W.overlay = null; live(null); if (r.ok) { W.builder.col = C['matcha-deep']; SFX.sparkle(); } },
  };
}

/* ---------------- COORDINATE PLANE ---------------- */
MINI.plane = {
  view: { w: 12, h: 8 },
  init(W) { Object.assign(W, { pl: { x0: -5, x1: 5, y0: -4, y1: 4, grid: 1, lab: 1, ax: ['x', 'y'], p: 1, fx: null, fy: null }, curves: [], pts: [], vecs: [], polys: [], tracer: null, vline: null, shadeX: null, shadeY: null, caption: '' }); },
  draw(W) {
    const P = W.pl; const [bx0, by0, bx1, by1] = viewBounds(0); const k = sc(); const grow = (st, px) => { for (const m of [1, 2, 4, 10, 20, 40, 100, 200, 400]) if (st * m * k >= px) return st * m; return st * 400; };
    const G = grow(P.grid || 1, 14), GY = grow(P.gridY || P.grid || 1, 14), LX = grow(P.lab || 1, 34), LY = grow(P.labY || P.lab || 1, 22);
    ctx.save(); ctx.globalAlpha = P.p;
    if (P.grid) { ctx.strokeStyle = C.tone; ctx.lineWidth = 1; for (let x = Math.ceil(bx0 / G) * G; x <= bx1; x += G) { const a = toS(x, by0), b = toS(x, by1); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); } const gy = GY; for (let y = Math.ceil(by0 / gy) * gy; y <= by1; y += gy) { const a = toS(bx0, y), b = toS(bx1, y); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); } }
    // shaded domain / range
    if (W.shadeX) { const a = toS(W.shadeX.a, 0), b = toS(W.shadeX.b, 0); ctx.fillStyle = C.sakura; ctx.fillRect(Math.max(0, a[0]), a[1] - 6, Math.min(SW, b[0]) - Math.max(0, a[0]), 12); }
    if (W.shadeY) { const a = toS(0, W.shadeY.a), b = toS(0, W.shadeY.b); ctx.fillStyle = C['sora-tint']; ctx.fillRect(a[0] - 6, Math.max(0, b[1]), 12, Math.min(SH, a[1]) - Math.max(0, b[1])); }
    const o = toS(0, 0); ctx.strokeStyle = C.ink; ctx.fillStyle = C.ink; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, o[1]); ctx.lineTo(SW, o[1]); ctx.moveTo(o[0], 0); ctx.lineTo(o[0], SH); ctx.stroke(); D.head(SW - 4, o[1], 0, 8); D.head(o[0], 4, -Math.PI / 2, 8);
    D.text(P.ax[0], SW - 12, o[1] - 10, { size: 13, w: 800 }); D.text(P.ax[1], o[0] + 14, 16, { size: 13, w: 800, align: 'left' });
    if (P.lab) { for (let x = Math.ceil(bx0 / LX) * LX; x <= bx1; x += LX) { if (Math.abs(x) < 1e-9) continue; const p = toS(x, 0); if (p[0] < 10 || p[0] > SW - 20) continue; ctx.fillRect(p[0] - 1, p[1] - 4, 2, 8); D.text(P.fx ? P.fx(x) : fmtN(x, 2), p[0], p[1] + 16, { size: 11, w: 600, col: C['ink-muted'] }); } const ly = LY; for (let y = Math.ceil(by0 / ly) * ly; y <= by1; y += ly) { if (Math.abs(y) < 1e-9) continue; const p = toS(0, y); if (p[1] < 14 || p[1] > SH - 8) continue; ctx.fillRect(p[0] - 4, p[1] - 1, 8, 2); D.text(P.fy ? P.fy(y) : fmtN(y, 2), p[0] - 8, p[1] + 4, { size: 11, w: 600, col: C['ink-muted'], align: 'right' }); } D.text('O', o[0] - 8, o[1] + 15, { size: 11, w: 700, col: C['ink-muted'], align: 'right' }); }
    ctx.restore();
    for (const pg of W.polys) { if (pg.a === 0) continue; ctx.save(); ctx.globalAlpha = pg.a == null ? 0.5 : pg.a; ctx.fillStyle = pg.col || C.sakura; ctx.beginPath(); pg.pts.forEach((q, i) => { const s = toS(q[0], q[1]); i ? ctx.lineTo(...s) : ctx.moveTo(...s); }); ctx.closePath(); ctx.fill(); ctx.restore(); }
    for (const c of W.curves) drawCurve(c, bx0, bx1, by0, by1);
    for (const v of W.vecs) { if (v.a === 0) continue; const pr = v.p == null ? 1 : v.p; ctx.save(); ctx.globalAlpha = v.a == null ? 1 : v.a; const a = toS(v.x0, v.y0), b = toS(lerp(v.x0, v.x1, pr), lerp(v.y0, v.y1, pr)); if (v.dash) { ctx.setLineDash([6, 5]); ctx.strokeStyle = v.col || C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); ctx.setLineDash([]); } else D.arrow(a[0], a[1], b[0], b[1], v.col || C.ink, v.w || 3, 11); if (v.t && pr >= 1) D.text(v.t, (a[0] + b[0]) / 2 + (v.dx || 8), (a[1] + b[1]) / 2 - 8, { size: 12, w: 800, col: v.col || C.ink, align: 'left', stroke: C.paper }); ctx.restore(); }
    for (const q of W.pts) { if (q.a === 0) continue; ctx.save(); ctx.globalAlpha = q.a == null ? 1 : q.a; const s = toS(q.x, q.y); ctx.beginPath(); ctx.arc(s[0], s[1], q.r || 6, 0, 7); ctx.fillStyle = q.open ? C.panel : q.col || C.beni; ctx.fill(); ctx.strokeStyle = q.col || C.ink; ctx.lineWidth = 2.5; ctx.stroke(); if (q.t) D.text(q.t, s[0] + (q.dx != null ? q.dx : 9), s[1] + (q.dy != null ? q.dy : -9), { size: q.size || 12, w: 800, align: q.align || 'left', col: C.ink, stroke: C.paper }); ctx.restore(); }
    if (W.vline && W.vline.on) { const p = toS(W.vline.x, 0); ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.setLineDash([8, 6]); ctx.beginPath(); ctx.moveTo(p[0], 0); ctx.lineTo(p[0], SH); ctx.stroke(); ctx.setLineDash([]); const hits = W.vline.hits ? W.vline.hits(W.vline.x) : []; hits.forEach((yy) => { const s = toS(W.vline.x, yy); D.star(s[0], s[1], 11, 8, C.kin); }); D.label(hits.length + ' hit' + (hits.length === 1 ? '' : 's'), p[0], 22, hits.length === 1 ? C['matcha-deep'] : C.beni); }
    if (W.tracer && W.tracer.on) { const t = W.tracer; const y = t.f(t.x); const s = toS(t.x, isFinite(y) ? y : 0); const ax = toS(t.x, 0); ctx.strokeStyle = C.sora; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(ax[0], ax[1]); ctx.lineTo(s[0], s[1]); ctx.lineTo(o[0], s[1]); ctx.stroke(); ctx.setLineDash([]); D.sprite('kimmy-walk', s[0], s[1] + 2, Math.min(44, SH * 0.18)); ctx.beginPath(); ctx.arc(s[0], s[1], 6, 0, 7); ctx.fillStyle = C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); live((t.lab || 'f') + '(' + fmtN(t.x, 2) + ') = <b>' + (isFinite(y) ? fmtN(y, 3) : 'undefined') + '</b>'); }
    if (W.caption) D.text(W.caption, SW / 2, 22, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
function drawCurve(c, bx0, bx1, by0, by1) {
  const pr = c.p == null ? 1 : c.p; if (pr <= 0 || c.a === 0) return; const x0 = Math.max(bx0, c.x0 != null ? c.x0 : bx0), x1 = Math.min(bx1, c.x1 != null ? c.x1 : bx1); const xe = lerp(x0, x1, pr);
  ctx.save(); ctx.globalAlpha = c.a == null ? 1 : c.a; ctx.strokeStyle = c.col || C.sora; ctx.lineWidth = c.w || 3; ctx.lineJoin = 'round'; ctx.setLineDash(c.dash || []);
  const N = c.n || 600; let pen = false, py = null; ctx.beginPath();
  for (let i = 0; i <= N; i++) { const x = lerp(x0, xe, i / N); const y = c.f(x); const bad = !isFinite(y) || y > by1 + (by1 - by0) * 2 || y < by0 - (by1 - by0) * 2 || (py != null && Math.abs(y - py) > (c.jump || (by1 - by0) * 0.9)); if (bad) { pen = false; py = isFinite(y) ? y : null; continue; } const s = toS(x, y); pen ? ctx.lineTo(...s) : ctx.moveTo(...s); pen = true; py = y; }
  ctx.stroke(); ctx.setLineDash([]);
  if (pr >= 1) { (c.open || []).forEach(([x, y]) => { const s = toS(x, y); ctx.beginPath(); ctx.arc(s[0], s[1], 5, 0, 7); ctx.fillStyle = C.panel; ctx.fill(); ctx.lineWidth = 2.5; ctx.stroke(); }); (c.closed || []).forEach(([x, y]) => { const s = toS(x, y); ctx.beginPath(); ctx.arc(s[0], s[1], 5, 0, 7); ctx.fillStyle = c.col || C.sora; ctx.fill(); }); if (c.t) { const lx = c.tx != null ? c.tx : xe - (x1 - x0) * 0.12; const ly = c.f(lx); if (isFinite(ly)) { const s = toS(lx, ly); D.text(c.t, s[0], s[1] - 10, { size: 13, w: 800, col: c.col || C.sora, stroke: C.paper }); } } }
  ctx.restore();
}
/* plane helpers */
const curve = (f, col, extra = {}) => Object.assign({ f, col: col || C.sora, p: 0 }, extra);
async function drawCurves(W, cs, d = 0.9) { for (const c of cs) { W.curves.push(c); await tw(c, { p: 1, duration: d, ease: 'power1.inOut' }); SFX.swish(); } }
function vlineTask(W, hits) { W.vline = { on: true, x: (W.pl.x0 + W.pl.x1) * 0.25, hits }; W.drags = [{ get: () => [W.vline.x, 0], r: 0.8, set: (x) => { W.vline.x = clamp(x, W.pl.x0 + 0.2, W.pl.x1 - 0.2); W.vline.moved = (W.vline.moved || 0) + 1; } }]; }
function tracerOn(W, f, lab = 'f', x = 1) { W.tracer = { on: true, f, x, lab }; W.drags = [{ get: () => { const y = f(W.tracer.x); return [W.tracer.x, isFinite(y) ? y : 0]; }, r: 0.8, set: (x2) => { const nx = clamp(Math.round(x2 * 4) / 4, W.pl.x0 + 0.25, W.pl.x1 - 0.25); if (nx !== W.tracer.x) { W.tracer.x = nx; SFX.tick(); W.tracer.moved = (W.tracer.moved || 0) + 1; } } }]; }

function planeView(W, x0, x1, y0, y1, grid = 1, lab = 1) { Object.assign(W.pl, { x0, x1, y0, y1, grid, lab }); const w = x1 - x0, hh = y1 - y0; setView(w, hh, (x0 + x1) / 2, (y0 + y1) / 2); }

/* ---------------- shared helpers: sets, chips, braces ---------------- */
const rng = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
/* ---------- set helpers (arrays of primitives) ---------- */
const SET = {
  of: (a) => [...new Set(a)],
  uni: (a, b) => SET.sort(SET.of([...a, ...b])),
  int: (a, b) => SET.sort(a.filter((x) => b.includes(x))),
  dif: (a, b) => SET.sort(a.filter((x) => !b.includes(x))),
  sub: (a, b) => a.every((x) => b.includes(x)),
  eq: (a, b) => SET.sub(a, b) && SET.sub(b, a),
  sort: (a) => a.slice().sort((x, y) => (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y)))),
  str: (a) => (a.length ? '{' + a.map((x) => (typeof x === 'number' ? String(x).replace('-', '−') : x)).join(', ') + '}' : 'φ'),
  range: (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; },
  lbl: (x) => (typeof x === 'number' ? String(x).replace('-', '−') : String(x)),
};
const NUMS = (a) => a.map(SET.lbl);
const letters = (w) => SET.of(w.toUpperCase().replace(/[^A-Z]/g, '').split(''));

/* ---------- token chip drawn on canvas ---------- */
function chipW(t, x, y, { a = 1, s = 1, hl = 0, dim = 0, bg = C.panel, size = 14 } = {}) {
  if (a <= 0 || s <= 0) return; const p = toS(x, y); ctx.save(); ctx.globalAlpha *= a * (dim ? 0.3 : 1); ctx.translate(p[0], p[1]); ctx.scale(s, s);
  ctx.font = FONT(800, size, true); const w = Math.max(26, ctx.measureText(t).width + 14), hh = size + 12;
  if (hl) { ctx.fillStyle = C.kin; ctx.fillRect(-w / 2 - 4, -hh / 2 - 4, w + 8, hh + 8); }
  ctx.fillStyle = bg; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(-w / 2, -hh / 2, w, hh); ctx.strokeRect(-w / 2, -hh / 2, w, hh);
  ctx.fillStyle = C.ink; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t, 0, 1); ctx.textBaseline = 'alphabetic'; ctx.restore();
}

function wrapText(t, x, y, maxW, size) { ctx.font = FONT(800, size, true); ctx.fillStyle = C.ink; ctx.textAlign = 'center'; const words = String(t).split(' '); const lines = []; let cur = ''; for (const w of words) { const tt = cur ? cur + ' ' + w : w; if (ctx.measureText(tt).width > maxW && cur) { lines.push(cur); cur = w; } else cur = tt; } if (cur) lines.push(cur); lines.forEach((l, i) => ctx.fillText(l, x, y + (i - (lines.length - 1) / 2) * (size + 3))); }

/* =============== BAG: roster form inside braces =============== */
MINI.bag = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { bags: [], note: '', kimCorner: true }); },
  draw(W) {
    const n = W.bags.length; const bw = (9.6 - (n - 1) * 0.3) / Math.max(1, n);
    W.bags.forEach((b, k) => {
      const cx = -4.8 + bw / 2 + k * (bw + 0.3); b.cx = cx; const a = b.a == null ? 1 : b.a; if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
      const top = 2.1, bot = -2.3; const L0 = toS(cx - bw / 2 + 0.25, top), R0 = toS(cx + bw / 2 - 0.25, top), B0 = toS(cx, bot);
      const bh = B0[1] - L0[1]; ctx.font = FONT(300, bh * 1.05, false); ctx.fillStyle = b.col || C.ink; ctx.textBaseline = 'top';
      ctx.textAlign = 'left'; ctx.fillText('{', L0[0] - bh * 0.12, L0[1] - bh * 0.1); ctx.textAlign = 'right'; ctx.fillText('}', R0[0] + bh * 0.12, R0[1] - bh * 0.1); ctx.textBaseline = 'alphabetic';
      D.text(b.label || '', toS(cx, 2.55)[0], toS(cx, 2.55)[1], { size: clamp(SW / 36, 12, 17), w: 800, disp: true, col: b.col || C.ink });
      const inner = bw - 1.3; const per = Math.max(1, Math.floor(inner / (b.cw || 1.05)));
      b.items.forEach((it, i) => { const r = Math.floor(i / per), c = i % per; const cols = Math.min(per, b.items.length - r * per); const x = cx + (c - (cols - 1) / 2) * (inner / per) + (it.dx || 0); const y = 1.35 - r * 0.78 + (it.dy || 0); if (it.at) { it.at[0] = x; it.at[1] = y; } chipW(it.t, x, y, { a: it.a == null ? 1 : it.a, s: it.s == null ? 1 : it.s, hl: it.hl, dim: it.dim, bg: it.bg, size: b.size || 14 }); });
      if (b.empty && !b.items.length) D.text('(nothing inside: φ)', toS(cx, 0)[0], toS(cx, 0)[1], { size: 14, w: 700, col: C['ink-muted'] });
      ctx.restore();
    });
    if (W.note) D.text(W.note, SW / 2, SH - 10, { size: 13, w: 700, col: C['ink-muted'] });
  },
};
function bagSet(W, specs) { W.bags = specs.map((s) => ({ label: s.label, col: s.col, empty: s.empty, size: s.size, cw: s.cw, items: (s.items || []).map((t) => ({ t: SET.lbl(t), v: t, a: s.hide ? 0 : 1, s: 1 })) })); }
async function bagDrop(bag, t, { dupCheck = true } = {}) {
  const lb = SET.lbl(t);
  if (dupCheck && bag.items.some((it) => it.t === lb)) { const it = { t: lb, a: 1, s: 1, dy: 2, bg: C.sakura }; bag.items.push(it); SFX.boing(); await tw(it, { dy: 0, duration: 0.25, ease: 'power2.in' }); FX.ono('DUP!', { x: 50 + Math.random() * 20, y: 30, red: true }); await tw(it, { dy: 3, dx: 3, a: 0, duration: 0.35, ease: 'power2.out' }); bag.items.splice(bag.items.indexOf(it), 1); return false; }
  const it = { t: lb, v: t, a: 0, s: 1.6, dy: 1.5 }; bag.items.push(it); SFX.pop(); await tw(it, { a: 1, s: 1, dy: 0, duration: 0.28, ease: 'back.out(2)' }); return true;
}
function bagHL(W, k, list) { const L2 = list.map(SET.lbl); W.bags[k].items.forEach((it) => { it.hl = L2.includes(it.t) ? 1 : 0; it.dim = L2.includes(it.t) ? 0 : 1; }); }
async function bagFill(W, k, list, delay = 0.12) { for (const t of list) { await bagDrop(W.bags[k], t, { dupCheck: false }); await wait(delay); } }


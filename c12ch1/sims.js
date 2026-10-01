/* =========================================================
   CLASS 12 · CHAPTER 1 · RELATIONS AND FUNCTIONS — simulations
   Builds on the Class 11 Ch 2 grid/arrow scenes (loaded first on this page).
   grid + props : tap pairs of A × A; reflexive / symmetric / transitive badges update live with a counter-example
   hlt          : horizontal-line test on a graph (dots for N or Z domains): count solutions of f(x) = c
   compose      : A → B → C arrow diagrams; gof arrows appear dashed
   classes      : elements fall into equivalence-class bins
   ========================================================= */
/* properties of a relation given as a Set of pk keys on the set A */
function relProps(A, on) {
  const has = (a, b) => on.has(pk(a, b)); let refl = null, sym = null, tr = null;
  for (const a of A) if (!has(a, a)) { refl = [a, a]; break; }
  for (const a of A) { for (const b of A) if (has(a, b) && !has(b, a)) { sym = [[a, b], [b, a]]; break; } if (sym) break; }
  outer: for (const a of A) for (const b of A) if (has(a, b)) for (const c of A) if (has(b, c) && !has(a, c)) { tr = [[a, b], [b, c], [a, c]]; break outer; }
  return { R: !refl, S: !sym, T: !tr, refl, sym, tr };
}
const propWords = (p) => (p.R && p.S && p.T ? 'an equivalence relation' : ['reflexive', 'symmetric', 'transitive'].map((w, i) => ([p.R, p.S, p.T][i] ? '' : 'not ') + w).join(', '));
/* wrap the shared grid scene: a diagonal for reflexivity, live badges and a counter-example message */
(() => {
  const draw0 = MINI.grid.draw;
  MINI.grid.draw = function (W) {
    if (W.props && W.A.length) { const n = W.A.length; D.line([[0.6, 0.6], [n + 0.4, n + 0.4]], C['matcha-tint'], 10); }
    draw0(W);
    if (!W.props || !W.A.length) return;
    const p = relProps(W.A, W.on); W.lastProps = p;
    const rows = [['Reflexive', p.R, p.refl ? 'missing ' + pstr(...p.refl) : ''], ['Symmetric', p.S, p.sym ? pstr(...p.sym[0]) + ' but no ' + pstr(...p.sym[1]) : ''], ['Transitive', p.T, p.tr ? pstr(...p.tr[0]) + ', ' + pstr(...p.tr[1]) + ' but no ' + pstr(...p.tr[2]) : '']];
    const x = SW - 10; rows.forEach(([t, ok, why], i) => { const y = 18 + i * 40; ctx.fillStyle = ok ? C['matcha-tint'] : C.sakura; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; const w = 118; ctx.fillRect(x - w, y - 13, w, 20); ctx.strokeRect(x - w, y - 13, w, 20); D.text((ok ? '✓ ' : '✗ ') + t, x - w / 2, y + 2, { size: 12, w: 800 }); if (!ok && W.why !== false) D.text(why, x, y + 19, { size: 10, w: 700, col: C.beni, align: 'right', stroke: C.paper }); });
  };
})();
function relLoad(W, A, pairs = [], o = {}) { gridLoad(W, A, A, { labA: o.lab || 'A', labB: o.lab || 'A', on: pairs, tap: !!o.tap }); W.props = o.props !== false; W.showLab = o.showLab != null ? o.showLab : A.length <= 4; const n = A.length; setView(n + 5.2, n + 2.2, (n + 1) / 2 + 1.4, (n + 1) / 2 + 0.1); }
/* exercise part: build a relation with the given property pattern [R, S, T] that contains `must` */
function buildRelPart(q, A, want, o = {}) {
  return { k: 'task', q, todo: o.todo || 'Tap pairs on the grid until the badges match, then lock in.', x: o.x, no: 'One answer: ' + relStr(o.example) + '. ' + (o.x || ''),
    pre: () => { if (W.__scene !== MINI.grid) enterScene('grid'); relLoad(W, A, o.start || [], { tap: true }); },
    check: (W) => { const p = relProps(A, W.on); return p.R === want[0] && p.S === want[1] && p.T === want[2] && (o.must || []).every(([a, b]) => W.on.has(pk(a, b))); },
    auto: (W) => { W.on = new Set(o.example.map(([a, b]) => pk(a, b))); }, reveal: (W) => { W.on = new Set(o.example.map(([a, b]) => pk(a, b))); }, act: async () => { W.onTap = null; } };
}

/* =============== HLT: horizontal-line test =============== */
MINI.hlt = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { F: null, dom: 'R', cod: 'R', c: 1, kimCorner: true, kimX: 0.95, kimY: 0.85, line: true, ylabel: 'f' }); },
  draw(W) {
    MINI.plane.draw(W); const [bx0, by0, bx1, by1] = viewBounds(0); const F = W.F; if (!F) return;
    if (W.dom === 'R' || W.dom === 'R*' || W.dom === 'I') drawCurve({ f: (x) => (W.dom === 'R*' && Math.abs(x) < 1e-3 ? NaN : W.dom === 'I' && (x < W.I[0] || x > W.I[1]) ? NaN : F(x)), col: C.sora, w: 3.5, jump: (by1 - by0) * 0.3, n: 1200 }, bx0, bx1, by0, by1);
    else for (let n = Math.ceil(bx0); n <= bx1; n++) { if (W.dom === 'N' && n < 1) continue; const y = F(n); if (isFinite(y) && y >= by0 && y <= by1) D.dot(n, y, 6, C.sora, C.ink, 1.5); }
    for (const [x, y] of W.open || []) { const s = toS(x, y); ctx.beginPath(); ctx.arc(s[0], s[1], 6, 0, 7); ctx.fillStyle = C.paper; ctx.fill(); ctx.strokeStyle = C.sora; ctx.lineWidth = 2.5; ctx.stroke(); }
    if (!W.line) return; const c = W.c; D.line([[bx0, c], [bx1, c]], C.beni, 3, [9, 5]); const hx = (W.pl.x0 + W.pl.x1) / 2 + (W.pl.x1 - W.pl.x0) * 0.43; const hp = toS(hx, c); ctx.beginPath(); ctx.arc(hp[0], hp[1], 11, 0, 7); ctx.fillStyle = C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); D.text('↕', hp[0], hp[1] + 5, { size: 14, w: 800, col: C.paper });
    const xs = hltSolve(W, c); xs.forEach((x) => D.star(...toS(x, c), 10, 7, C.kin));
    const inCod = W.cod === 'R' || (W.cod === 'N' ? c >= 1 && Number.isInteger(c) : W.cod === 'Z' ? Number.isInteger(c) : W.cod === 'R*' ? c !== 0 : W.codTest ? W.codTest(c) : true);
    const t = 'y = ' + fmtN(c, 2) + (inCod ? '' : ' (not in co-domain)') + ':  ' + xs.length + (xs.length === 1 ? ' pre-image' : ' pre-images'); ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; const bw = t.length * 7.2 + 16; ctx.fillRect(8, 8, bw, 26); ctx.strokeRect(8, 8, bw, 26); D.text(t, 16, 26, { size: 13, w: 800, align: 'left', col: xs.length === 1 ? C['matcha-deep'] : C.beni });
  },
};
function hltSolve(W, c) {
  const F = W.F, out = []; const [bx0, , bx1] = viewBounds(0);
  if (W.dom === 'N' || W.dom === 'Z') { for (let n = Math.ceil(bx0) - 50; n <= bx1 + 50; n++) { if (W.dom === 'N' && n < 1) continue; if (Math.abs(F(n) - c) < 1e-9) out.push(n); } return out; }
  const N = 3000, a = W.dom === 'I' ? W.I[0] : bx0 - 5, b = W.dom === 'I' ? W.I[1] : bx1 + 5; let px = a, pv = F(a) - c;
  for (let i = 1; i <= N; i++) { const x = a + ((b - a) * i) / N; const v = F(x) - c; if (W.dom === 'R*' && Math.abs(x) < 1e-6) { px = x; pv = v; continue; } if (isFinite(v) && isFinite(pv)) { if (Math.abs(v) < 1e-9) { if (!out.length || Math.abs(out[out.length - 1] - x) > 1e-3) out.push(x); } else if (pv * v < 0 && Math.abs(v - pv) < 5) out.push(px + ((x - px) * Math.abs(pv)) / Math.abs(v - pv)); } px = x; pv = v; }
  return out;
}
function hltSetup(W, F, view, dom = 'R', cod = 'R', o = {}) { planeView(W, ...view); Object.assign(W, { F, dom, cod, c: o.c != null ? o.c : 1 }, o); W.drags = [{ get: () => [(W.pl.x0 + W.pl.x1) / 2 + (W.pl.x1 - W.pl.x0) * 0.43, W.c], r: 0.9, set: (x, y) => { const s = W.snap || 0.1; const nc = clamp(Math.round(y / s) * s, W.pl.y0, W.pl.y1); if (nc !== W.c) { W.c = nc; SFX.tick(); W.moved = (W.moved || 0) + 1; } } }]; }

/* =============== COMPOSE: f then g =============== */
MINI.compose = {
  view: { w: 12, h: 7 },
  init(W) { Object.assign(W, { A: [], B: [], Cs: [], f: [], g: [], gof: [], kf: 1, kg: 1, kc: 0, kimCorner: true, kimX: 0.95, labs: ['A', 'B', 'C'], fn: ['f', 'g'] }); },
  pos(W, col, i) { const arr = [W.A, W.B, W.Cs][col]; const n = arr.length; const span = Math.min(4.4, n * 0.95); return [[-4, 0, 4][col], span / 2 - (n > 1 ? (i * span) / (n - 1) : span / 2) - 0.3]; },
  draw(W) {
    const S = MINI.compose; [W.A, W.B, W.Cs].forEach((arr, col) => { const x = [-4, 0, 4][col]; const hgt = Math.min(5.2, arr.length * 0.95 + 1.1); const p = toS(x, -0.3); ctx.beginPath(); ctx.ellipse(p[0], p[1], 1.05 * sc(), (hgt / 2) * sc(), 0, 0, 7); ctx.fillStyle = C.panel; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); D.textW(W.labs[col], x, -0.3 + hgt / 2 + 0.3, { size: 16, w: 800, disp: true }); });
    const arrow = (c1, i, c2, j, col, k, dash) => { const a = S.pos(W, c1, i), b = S.pos(W, c2, j); const A2 = toS(a[0] + 0.45, a[1]), B2 = toS(lerp(a[0] + 0.45, b[0] - 0.45, k), lerp(a[1], b[1], k)); if (dash) ctx.setLineDash([6, 5]); D.arrow(A2[0], A2[1], B2[0], B2[1], col, 2.5, 10); ctx.setLineDash([]); };
    W.f.forEach(([i, j]) => arrow(0, i, 1, j, C.sora, W.kf)); W.g.forEach(([i, j]) => arrow(1, i, 2, j, C['matcha-deep'], W.kg));
    if (W.kc > 0) W.gof.forEach(([i, j]) => { const a = S.pos(W, 0, i), b = S.pos(W, 2, j); const P = toS(a[0] + 0.45, a[1]), Q = toS(lerp(a[0] + 0.45, b[0] - 0.45, W.kc), lerp(a[1], b[1], W.kc)); const m = [(P[0] + Q[0]) / 2, Math.min(P[1], Q[1]) - 40]; ctx.strokeStyle = C.beni; ctx.lineWidth = 2.5; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(...P); ctx.quadraticCurveTo(m[0], m[1], Q[0], Q[1]); ctx.stroke(); ctx.setLineDash([]); });
    [W.A, W.B, W.Cs].forEach((arr, col) => arr.forEach((t, i) => { const p = S.pos(W, col, i); chipW(String(t), p[0], p[1], { size: 13 }); }));
    D.textW(W.fn[0], -2, 2.6, { size: 15, w: 800, col: C.sora }); D.textW(W.fn[1], 2, 2.6, { size: 15, w: 800, col: C['matcha-deep'] }); if (W.kc > 0) D.textW(W.fn[1] + 'o' + W.fn[0], 0, -3.1, { size: 15, w: 800, col: C.beni });
  },
};
function composeSet(W, A, B, Cs, fmap, gmap) { Object.assign(W, { A, B, Cs }); W.f = A.map((a, i) => [i, B.indexOf(fmap[a])]); W.g = B.map((b, j) => [j, Cs.indexOf(gmap[b])]).filter(([, k]) => k >= 0); W.gof = A.map((a, i) => [i, Cs.indexOf(gmap[fmap[a]])]); }

/* =============== CLASSES: equivalence classes =============== */
MINI.classes = {
  view: { w: 12, h: 6 },
  init(W) { Object.assign(W, { items: [], bins: [], k: 0, kimCorner: true, kimX: 0.95, cap: '' }); },
  draw(W) {
    const nb = W.bins.length; if (!nb) return; const bw = 10.4 / nb;
    W.bins.forEach((b, i) => { const x0 = -5.2 + i * bw; D.rect(x0 + 0.1, -2.6, x0 + bw - 0.1, 0.6, [C['sora-tint'], C['matcha-tint'], C.sakura, C['kin-tint'], C.peach][i % 5], C.ink, 2); D.textW(b, x0 + bw / 2, -2.35, { size: 13, w: 800 }); });
    const start = W.items.map((t, i) => [-5 + ((i + 0.5) * 10) / W.items.length, 2.2]);
    const cnt = W.bins.map(() => 0);
    W.items.forEach((it, i) => { const b = it.g; const x0 = -5.2 + b * bw; const per = Math.max(1, Math.floor((bw - 0.4) / 0.9)); const k = cnt[b]++; const end = [x0 + 0.6 + (k % per) * 0.9, 0 - Math.floor(k / per) * 0.75]; const t = clamp(W.k * W.items.length - i * 0.6, 0, 1); chipW(String(it.t), lerp(start[i][0], end[0], t), lerp(start[i][1], end[1], t), { size: 13 }); });
    if (W.cap) D.text(W.cap, SW / 2, 20, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
async function sortClasses(W, items, bins, cls, d = 1.6) { W.items = items.map((t) => ({ t, g: cls(t) })); W.bins = bins; W.k = 0; await tw(W, { k: 1 + 0.6, duration: d, ease: 'none' }); SFX.chime(); }

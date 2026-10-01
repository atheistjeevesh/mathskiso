/* =========================================================
   CLASS 12 · CHAPTER 2 · INVERSE TRIGONOMETRIC FUNCTIONS — simulations
   inv   : plane with y = f(x); the principal branch is bold; morph reflects the curve in y = x
   pcirc : unit-circle principal-value finder (sin: horizontal line, cos: vertical line, tan: slope line)
   ========================================================= */
const PI = Math.PI;
const TR = {
  sin: { f: Math.sin, inv: Math.asin, dom: [-PI / 2, PI / 2], name: 'sin' },
  cos: { f: Math.cos, inv: Math.acos, dom: [0, PI], name: 'cos' },
  tan: { f: Math.tan, inv: Math.atan, dom: [-PI / 2 + 1e-3, PI / 2 - 1e-3], name: 'tan' },
  cot: { f: (x) => 1 / Math.tan(x), inv: (y) => (y > 0 ? Math.atan(1 / y) : y < 0 ? PI + Math.atan(1 / y) : PI / 2), dom: [1e-3, PI - 1e-3], name: 'cot' },
  sec: { f: (x) => 1 / Math.cos(x), inv: (y) => Math.acos(1 / y), dom: [0, PI], name: 'sec' },
  cosec: { f: (x) => 1 / Math.sin(x), inv: (y) => Math.asin(1 / y), dom: [-PI / 2, PI / 2], name: 'cosec' },
};
/* "−π/6", "3π/4", "π" from an angle */
const piStr = (t) => { if (Math.abs(t) < 1e-9) return '0'; const f = fracStr(t / PI).replace('−', '-'); const [p, q] = f.split('/'); const sgn = p.startsWith('-') ? '−' : ''; const a = p.replace('-', ''); return sgn + (a === '1' ? '' : a) + 'π' + (q ? '/' + q : ''); };

MINI.inv = {
  view: { w: 12, h: 8 },
  init(W) { MINI.plane.init(W); Object.assign(W, { fn: 'sin', m: 0, full: true, probe: null, kimCorner: true, kimX: 0.95, kimY: 0.85 }); W.pl.fx = (x) => piLab(x); },
  draw(W) {
    MINI.plane.draw(W); const T = TR[W.fn]; const [bx0, by0, bx1, by1] = viewBounds(0);
    D.line([[Math.max(bx0, by0), Math.max(bx0, by0)], [Math.min(bx1, by1), Math.min(bx1, by1)]], C['ink-muted'], 1.5, [6, 5]);
    const m = W.m; const map = (x, y) => [lerp(x, y, m), lerp(y, x, m)];
    const path = (a, b, col, w, alpha) => { ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); let pen = false, py = null; for (let i = 0; i <= 800; i++) { const x = lerp(a, b, i / 800), y = T.f(x); if (!isFinite(y) || Math.abs(y) > 9 || (py != null && Math.abs(y - py) > 3)) { pen = false; py = isFinite(y) ? y : null; continue; } const s = toS(...map(x, y)); pen ? ctx.lineTo(...s) : ctx.moveTo(...s); pen = true; py = y; } ctx.stroke(); ctx.restore(); };
    if (W.full) path(-2.5 * PI, 2.5 * PI, C.sora, 2, 0.35);
    if (W.fn === 'sec' || W.fn === 'cosec') { const gap = W.fn === 'sec' ? PI / 2 : 0; path(T.dom[0], gap - 1e-3, C.beni, 4, 1); path(gap + 1e-3, T.dom[1], C.beni, 4, 1); } else path(T.dom[0], T.dom[1], C.beni, 4, 1);
    if (W.probe != null && m > 0.99) { const x = W.probe, y = T.inv(x); if (isFinite(y)) { D.line([[x, 0], [x, y]], C['matcha-deep'], 2, [4, 4]); D.line([[0, y], [x, y]], C['matcha-deep'], 2, [4, 4]); D.dot(x, y, 9, C.kin, C.ink, 2.5); const s = toS(x, y); D.text(T.name + '⁻¹(' + fmtN(x, 2) + ') = ' + fmtN(y, 3) + (Math.abs(y / PI * 12 - Math.round(y / PI * 12)) < 1e-6 ? ' = ' + piStr(y) : ''), s[0] + 12, s[1] - 10, { size: 13, w: 800, align: 'left', stroke: C.paper }); } }
    D.text((m > 0.5 ? 'y = ' + T.name + '⁻¹x (principal branch)' : 'y = ' + T.name + ' x'), SW / 2, 20, { size: 14, w: 800, disp: true, stroke: C.paper, col: C.beni });
  },
};
const piLab = (x) => { const k = Math.round(x / (PI / 2)); return Math.abs(x - (k * PI) / 2) < 1e-6 && k ? piStr((k * PI) / 2) : fmtN(x, 2); };
function invView(W, fn, m = 0) { W.fn = fn; W.m = m; planeView(W, -2.2 * PI, 2.2 * PI, -4.2, 4.2); W.pl.lab = PI / 2; W.pl.grid = PI / 4; W.pl.labY = 1; W.pl.gridY = 1; W.pl.fx = piLab; }
function invProbe(W, x0 = 0.5, lo = -1, hi = 1) { W.probe = x0; W.drags = [{ get: () => [W.probe, 0], r: 0.8, set: (x) => { const v = clamp(Math.round(x * 20) / 20, lo, hi); if (v !== W.probe) { W.probe = v; SFX.tick(); } } }]; }

/* =============== PCIRC: principal value finder =============== */
MINI.pcirc = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { mode: 'sin', v: 0.5, kimCorner: true, kimX: 0.95, lock: false, showAns: true }); },
  draw(W) {
    const R = 2.5, cx = -1.6, cy = 0; const P = (t) => [cx + R * Math.cos(t), cy + R * Math.sin(t)];
    D.line([[cx - R - 0.5, cy], [cx + R + 0.5, cy]], C['ink-muted'], 1.5); D.line([[cx, cy - R - 0.4], [cx, cy + R + 0.4]], C['ink-muted'], 1.5);
    D.circleW(cx, cy, R, null, C.ink, 2);
    const arc = { sin: [-PI / 2, PI / 2], cos: [0, PI], tan: [-PI / 2, PI / 2] }[W.mode]; const c = toS(cx, cy); ctx.strokeStyle = C['matcha-deep']; ctx.lineWidth = 8; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(c[0], c[1], R * sc(), -arc[1], -arc[0]); ctx.stroke(); ctx.globalAlpha = 1;
    const v = W.v; let sols = [];
    if (W.mode === 'sin') { D.line([[cx - R - 0.4, cy + v * R], [cx + R + 0.4, cy + v * R]], C.beni, 2.5, [7, 5]); if (Math.abs(v) <= 1) sols = [Math.asin(v), PI - Math.asin(v)]; }
    if (W.mode === 'cos') { D.line([[cx + v * R, cy - R - 0.4], [cx + v * R, cy + R + 0.4]], C.beni, 2.5, [7, 5]); if (Math.abs(v) <= 1) sols = [Math.acos(v), -Math.acos(v)]; }
    if (W.mode === 'tan') { const t = Math.atan(v); D.line([P(t + PI), P(t)], C.beni, 2.5, [7, 5]); sols = [t, t + PI]; }
    sols.forEach((t, i) => { const p = P(t); if (i === 0) { D.line([[cx, cy], p], C.kin, 3.5); const s = toS(...p); D.star(s[0], s[1], 11, 7, C.kin); } else { const s = toS(...p); ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(s[0] - 7, s[1] - 7); ctx.lineTo(s[0] + 7, s[1] + 7); ctx.moveTo(s[0] + 7, s[1] - 7); ctx.lineTo(s[0] - 7, s[1] + 7); ctx.stroke(); } });
    const t0 = sols[0]; const nm = W.mode; const lines = [nm + '⁻¹(' + fmtN(v, 3) + ')', t0 == null ? 'undefined' : W.showAns ? '= ' + (Math.abs(t0 / PI * 12 - Math.round(t0 / PI * 12)) < 1e-6 ? piStr(t0) : fmtN(t0, 3) + ' rad') : '= ?', 'principal arc: ' + { sin: '[−π/2, π/2]', cos: '[0, π]', tan: '(−π/2, π/2)' }[nm]];
    lines[2] = lines[2].replace('principal arc: ', 'arc '); lines.forEach((t, i) => D.textW(t, 1.25, 2.2 - i * 0.7, { size: i === 1 ? 19 : 12, w: 800, align: 'left', disp: i === 1, col: i === 2 ? C['matcha-deep'] : C.ink }));
    const hp = W.mode === 'sin' ? [cx + R + 0.4, cy + v * R] : W.mode === 'cos' ? [cx + v * R, cy + R + 0.4] : P(Math.atan(v)); D.dot(hp[0], hp[1], 10, C.beni, C.ink, 2.5); W.handle = hp;
  },
};
function pcircSet(W, mode, v, o = {}) { Object.assign(W, { mode, v }, o); if (W.lock) { W.drags = []; return; } W.drags = [{ get: () => W.handle || [0, 0], r: 0.7, set: (x, y) => { const R = 2.5, cx = -1.6; let nv = W.mode === 'sin' ? y / R : W.mode === 'cos' ? (x - cx) / R : Math.tan(Math.atan2(y, x - cx)); if (W.mode !== 'tan') nv = clamp(nv, -1, 1); nv = Math.round(nv * 100) / 100; if (nv !== W.v) { W.v = nv; SFX.tick(); W.moved = (W.moved || 0) + 1; } } }]; }

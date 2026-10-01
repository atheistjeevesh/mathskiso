/* =========================================================
   CHAPTER 3 · TRIGONOMETRIC FUNCTIONS — simulations
   circle (spin the unit circle, multi-turn winding), arc (radian roller, pendulum, clock, wheel),
   wave (unroll sin/cos/tan), sumfig (Fig 3.14), identity checker on the shared plane
   ========================================================= */
const PI = Math.PI;
const D2R = (d) => (d * PI) / 180, R2D = (r) => (r * 180) / PI;
/* radians as a multiple of π when it is a nice fraction */
function piStr(th) { const k = th / PI; for (const q of [1, 2, 3, 4, 6, 8, 12, 18, 36, 180]) { const p = Math.round(k * q); if (Math.abs(p / q - k) < 1e-9) { const g = gcd(Math.abs(p), q); const P2 = p / g, Q2 = q / g; if (P2 === 0) return '0'; const top = (P2 < 0 ? '−' : '') + (Math.abs(P2) === 1 ? '' : Math.abs(P2)) + 'π'; return Q2 === 1 ? top : top + '/' + Q2; } } return fmtN(th, 3); }
const gcd = (a, b) => (b ? gcd(b, a % b) : a || 1);
function dms(deg) { const s = deg < 0 ? '−' : ''; let d = Math.abs(deg); let D = Math.floor(d + 1e-9); let m = (d - D) * 60; let M = Math.floor(m + 1e-9); let S = Math.round((m - M) * 60); if (S === 60) { S = 0; M++; } if (M === 60) { M = 0; D++; } return s + D + '°' + (M || S ? ' ' + M + '′' : '') + (S ? ' ' + S + '″' : ''); }
const QUAD = (th) => { const d = ((R2D(th) % 360) + 360) % 360; return d === 0 || d === 90 || d === 180 || d === 270 ? 0 : d < 90 ? 1 : d < 180 ? 2 : d < 270 ? 3 : 4; };

/* =============== CIRCLE: the unit circle you can spin =============== */
MINI.circle = {
  view: { w: 10.4, h: 6.4 },
  init(W) { Object.assign(W, { uc: { th: D2R(30), cx: -2.3, r: 2.35, drag: false, snap: 5, vals: true, proj: true, astc: false, shadeQ: 0, target: null, ref: false, tri: false, tan: false, k: 1, turns: true, lab: 'P' }, kimCorner: true, kimX: 0.93 }); },
  draw(W) {
    const U = W.uc; const cx = U.cx, R = U.r * U.k; const c = toS(cx, 0); const Rp = R * sc();
    // quadrant shading + ASTC
    if (U.shadeQ) { ctx.save(); ctx.fillStyle = C.sakura; ctx.globalAlpha = 0.6; ctx.beginPath(); ctx.moveTo(...c); const a0 = -(U.shadeQ - 1) * PI / 2; ctx.arc(c[0], c[1], Rp, a0, a0 - PI / 2, true); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.strokeStyle = C.tone; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c[0] - Rp * 1.25, c[1]); ctx.lineTo(c[0] + Rp * 1.25, c[1]); ctx.moveTo(c[0], c[1] - Rp * 1.2); ctx.lineTo(c[0], c[1] + Rp * 1.2); ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(c[0], c[1], Rp, 0, 7); ctx.stroke();
    D.text('A(1, 0)', c[0] + Rp + 4, c[1] + 16, { size: 11, w: 700, align: 'left', col: C['ink-muted'] }); D.text('O', c[0] - 10, c[1] + 15, { size: 11, w: 700, col: C['ink-muted'] });
    if (U.astc) { const L4 = [['S', 'sin +', -1, 1], ['A', 'all +', 1, 1], ['T', 'tan +', -1, -1], ['C', 'cos +', 1, -1]]; for (const [l, t, sx, sy] of L4) { const p = toS(cx + sx * R * 0.55, sy * R * 0.55); D.text(l, p[0], p[1], { size: 26, w: 800, disp: true, col: C.beni, stroke: C.paper }); D.text(t, p[0], p[1] + 16, { size: 11, w: 700, col: C['ink-muted'] }); } }
    else { const L4 = [['I', 1, 1], ['II', -1, 1], ['III', -1, -1], ['IV', 1, -1]]; for (const [l, sx, sy] of L4) { const p = toS(cx + sx * R * 0.78, sy * R * 0.78); D.text(l, p[0], p[1], { size: 13, w: 800, col: C.tone }); } }
    // winding arc (spiral for extra turns)
    const th = U.th; const n = Math.max(1, Math.ceil(Math.abs(th) / (2 * PI) + 1e-9)); ctx.strokeStyle = C.beni; ctx.fillStyle = C.beni; ctx.lineWidth = 3; ctx.beginPath();
    const N = Math.max(40, Math.ceil(Math.abs(th) * 30)); let last = null;
    for (let i = 0; i <= N; i++) { const a = (th * i) / N; const rr = Rp * (0.22 + 0.07 * Math.min(6, Math.abs(a) / (2 * PI))); const p = [c[0] + Math.cos(a) * rr, c[1] - Math.sin(a) * rr]; i ? ctx.lineTo(...p) : ctx.moveTo(...p); last = p; }
    ctx.stroke(); if (Math.abs(th) > 0.05) { const a = th; const rr = Rp * (0.22 + 0.07 * Math.min(6, Math.abs(a) / (2 * PI))); D.head(c[0] + Math.cos(a) * rr, c[1] - Math.sin(a) * rr, -a + (th > 0 ? -PI / 2 : PI / 2), 8); }
    if (Math.abs(th) > 2 * PI + 0.01 && U.turns) D.text(Math.floor(Math.abs(th) / (2 * PI)) + ' full turn' + (Math.abs(th) >= 4 * PI ? 's' : '') + (th < 0 ? ' (clockwise)' : ''), c[0], c[1] - Rp * 1.12, { size: 12, w: 800, col: C.beni, stroke: C.paper });
    // P and projections
    const px = Math.cos(th), py = Math.sin(th); const P = toS(cx + R * px, R * py);
    if (U.target != null) { const tp = toS(cx + R * Math.cos(U.target), R * Math.sin(U.target)); ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = C.kin; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(tp[0], tp[1], 16 + Math.sin(T * 5) * 3, 0, 7); ctx.stroke(); ctx.restore(); }
    if (U.proj) { const M = toS(cx + R * px, 0); ctx.lineWidth = 4; ctx.strokeStyle = C.sora; ctx.beginPath(); ctx.moveTo(...c); ctx.lineTo(...M); ctx.stroke(); ctx.strokeStyle = C.beni; ctx.beginPath(); ctx.moveTo(...M); ctx.lineTo(...P); ctx.stroke(); D.text('cos', (c[0] + M[0]) / 2, c[1] + (py >= 0 ? 16 : -8), { size: 11, w: 800, col: C.sora }); D.text('sin', M[0] + (px >= 0 ? 16 : -16), (M[1] + P[1]) / 2, { size: 11, w: 800, col: C.beni }); }
    if (U.tan && Math.abs(px) > 0.05) { const t = py / px; const T1 = toS(cx + R, R * t), A1 = toS(cx + R, 0); ctx.strokeStyle = C.khaki; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(...A1); ctx.lineTo(...T1); ctx.stroke(); ctx.setLineDash([4, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(...c); ctx.lineTo(...T1); ctx.stroke(); ctx.setLineDash([]); D.text('tan', T1[0] + 6, T1[1], { size: 11, w: 800, col: C.khaki, align: 'left' }); }
    if (U.ref) { const Q = toS(cx + R * px, -R * py); ctx.setLineDash([5, 4]); ctx.strokeStyle = C.sora; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...c); ctx.lineTo(...Q); ctx.stroke(); ctx.setLineDash([]); D.dot(cx + R * px, -R * py, 6, C.panel, C.sora); D.text('Q (a, −b)', Q[0] + 8, Q[1] + 14, { size: 11, w: 800, col: C.sora, align: 'left' }); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(...c); ctx.lineTo(...P); ctx.stroke();
    ctx.beginPath(); ctx.arc(P[0], P[1], U.drag ? 11 + Math.sin(T * 6) * 1.5 : 8, 0, 7); ctx.fillStyle = C.beni; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke();
    D.text(U.lab, P[0] + (px >= 0 ? 12 : -12), P[1] - 10, { size: 14, w: 800, disp: true, align: px >= 0 ? 'left' : 'right', stroke: C.paper });
    // readout panel
    if (U.vals) {
      const x0 = Math.max(toS(U.cx + U.r * 1.45, 0)[0], c[0] + Rp + 34); let y = Math.max(24, c[1] - Rp * 0.95); const ln = (k, v, col) => { D.text(k, x0, y, { size: 13, w: 700, align: 'left', col: C['ink-muted'] }); D.text(v, x0 + 40, y, { size: clamp(SW / 50, 13, 18), w: 800, align: 'left', col: col || C.ink, disp: true }); y += clamp(SH / 11, 18, 30); };
      const dg = R2D(th); ln('θ', fmtN(dg, 1) + '°'); ln('rad', piStr(Math.round(dg * 1e6) / 1e6 * PI / 180)); ln('cos', fmtN(px, 3), C.sora); ln('sin', fmtN(py, 3), C.beni); ln('tan', Math.abs(px) < 1e-9 ? 'undefined' : fmtN(py / px, 3), C.khaki); const q = QUAD(th); ln('quad', q ? ['I', 'II', 'III', 'IV'][q - 1] : 'on an axis');
    }
  },
};
function circleDrag(W, on = true) {
  const U = W.uc; U.drag = on;
  W.drags = on ? [{ get: () => [U.cx + U.r * Math.cos(U.th), U.r * Math.sin(U.th)], r: 0.5, set: (x, y) => { const a = Math.atan2(y, x - U.cx); const cur = ((U.th % (2 * PI)) + 2 * PI) % (2 * PI); let d = a - cur; while (d > PI) d -= 2 * PI; while (d < -PI) d += 2 * PI; const raw = U.raw != null ? U.raw + d : U.th + d; U.raw = raw; const st = D2R(U.snap || 1); const nt = Math.round(raw / st) * st; if (Math.abs(nt - U.th) > 1e-9) { U.th = nt; if (Math.round(R2D(nt)) % 90 === 0) SFX.snap(); else SFX.tick(); U.moved = (U.moved || 0) + 1; } }, end: () => { U.raw = null; } }] : [];
}
async function spinTo(W, th, d = 1.2) { SFX.whoosh(); await tw(W.uc, { th, duration: d, ease: 'power2.inOut' }); SFX.snap(); }
/* part: drag P to an angle (winding allowed). Buttons add/remove full turns. */
function anglePart(q, deg, o = {}) {
  const tgt = D2R(deg);
  return {
    k: 'task', q, todo: o.todo || 'Drag P round the circle (use the turn buttons for full turns), then lock in.', x: o.x || 'θ = ' + deg + '°.', no: 'Target was ' + deg + '°. ' + (o.x || ''),
    pre: () => { if (W.__scene !== MINI.circle) enterScene('circle'); W.uc.th = 0; W.uc.snap = o.snap || 5; W.uc.target = o.showTarget ? tgt : null; circleDrag(W); if (Math.abs(deg) >= 360) { const r = row(); const a = h('button', { class: 'btn', type: 'button' }, '↺ +1 turn'), b = h('button', { class: 'btn', type: 'button' }, '↻ −1 turn'); a.onclick = () => { spinTo(W, W.uc.th + 2 * PI, 0.5); }; b.onclick = () => { spinTo(W, W.uc.th - 2 * PI, 0.5); }; r.append(a, b); } },
    check: (W) => Math.abs(W.uc.th - tgt) < D2R(0.6), auto: (W) => { W.uc.th = tgt; }, reveal: (W) => { spinTo(W, tgt); },
    act: async () => { circleDrag(W, false); W.uc.target = null; },
  };
}

/* =============== ARC: radians, arcs, pendulum, clock, wheel =============== */
MINI.arc = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { mode: 'roll', r: 2.2, th: 1, u: 0, L: 3, pth: 0.4, clock: 0, spin: 0, revs: 0, labels: true, kimCorner: true, kimX: 0.92, cap: '' }); },
  tick(W, dt) { if (W.mode === 'wheel' && W.spinning) { W.spin += dt * W.w; } },
  draw(W) {
    const c = toS(-0.6, -0.1), R = W.r * sc();
    if (W.mode === 'roll' || W.mode === 'arc') {
      ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, 7); ctx.stroke(); D.dot(-0.6, -0.1, 4, C.ink);
      const th = W.th; ctx.strokeStyle = C.tone; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...c); ctx.lineTo(c[0] + R, c[1]); ctx.moveTo(...c); ctx.lineTo(c[0] + R * Math.cos(th), c[1] - R * Math.sin(th)); ctx.stroke();
      ctx.fillStyle = C.sakura; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.moveTo(...c); ctx.arc(c[0], c[1], R * 0.3, 0, -th, th > 0); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = C.beni; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(c[0], c[1], R, 0, -th * Math.min(1, W.mode === 'roll' ? W.u : 1), th > 0); ctx.stroke();
      if (W.mode === 'roll' && W.u < 1) { // the radius-long string: wrapped part on the circle, the rest still straight along the tangent
        const done = W.u * th; const S = [c[0] + R * Math.cos(done), c[1] - R * Math.sin(done)]; const rest = (1 - W.u) * th * R;
        ctx.strokeStyle = C.beni; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(...S); ctx.lineTo(S[0] - Math.sin(done) * rest, S[1] - Math.cos(done) * rest); ctx.stroke();
      }
      D.text('r', c[0] + R / 2, c[1] + 16, { size: 13, w: 800 }); const mid = toS(-0.6 + W.r * 1.12 * Math.cos(W.th / 2), -0.1 + W.r * 1.12 * Math.sin(W.th / 2)); D.text('l', mid[0], mid[1], { size: 14, w: 800, col: C.beni, stroke: C.paper });
      const x0 = toS(2.3, 0)[0]; D.text('θ = l / r', x0, c[1] - R * 0.7, { size: 18, w: 800, disp: true, align: 'left' }); D.text('θ = ' + fmtN(W.th, 3) + ' rad = ' + fmtN(R2D(W.th), 1) + '°', x0, c[1] - R * 0.35, { size: 13, w: 700, align: 'left' }); if (W.cap) D.text(W.cap, x0, c[1], { size: 13, w: 800, align: 'left', col: C.beni });
    }
    if (W.mode === 'pend') {
      const piv = toS(-0.6, 2.7), L = W.L * sc() * 0.0 + Math.min(SH * 0.75, W.Lpx || SH * 0.7); ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(piv[0] - 40, piv[1]); ctx.lineTo(piv[0] + 40, piv[1]); ctx.stroke();
      ctx.strokeStyle = C.tone; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(...piv); ctx.lineTo(piv[0], piv[1] + L); ctx.stroke(); ctx.setLineDash([]);
      const amp = W.pth; ctx.strokeStyle = C.beni; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(piv[0], piv[1], L, PI / 2 - amp / 2, PI / 2 + amp / 2); ctx.stroke();
      const a = PI / 2 + (amp / 2) * Math.sin(T * 2.2); const b = [piv[0] + L * Math.cos(a), piv[1] + L * Math.sin(a)]; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...piv); ctx.lineTo(...b); ctx.stroke(); ctx.beginPath(); ctx.arc(b[0], b[1], 13, 0, 7); ctx.fillStyle = C.kin; ctx.fill(); ctx.stroke();
      const x0 = toS(1.8, 0)[0]; D.text('length r = ' + W.Lcm + ' cm', x0, 40, { size: 13, w: 700, align: 'left' }); D.text('arc l = ' + W.lcm + ' cm', x0, 62, { size: 13, w: 800, align: 'left', col: C.beni }); if (W.cap) D.text(W.cap, x0, 88, { size: 15, w: 800, align: 'left', disp: true });
    }
    if (W.mode === 'clock') {
      const R2 = Math.min(SH * 0.4, SW * 0.28); const cc = [SW * 0.36, SH * 0.5]; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cc[0], cc[1], R2, 0, 7); ctx.fill(); ctx.stroke();
      for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * PI; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cc[0] + Math.sin(a) * R2 * 0.86, cc[1] - Math.cos(a) * R2 * 0.86); ctx.lineTo(cc[0] + Math.sin(a) * R2 * 0.96, cc[1] - Math.cos(a) * R2 * 0.96); ctx.stroke(); }
      const m = W.clock; const a = (m / 60) * 2 * PI; ctx.strokeStyle = C.beni; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cc[0], cc[1], R2 * 0.8, -PI / 2, -PI / 2 + a); ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(...cc); ctx.lineTo(cc[0] + Math.sin(a) * R2 * 0.8, cc[1] - Math.cos(a) * R2 * 0.8); ctx.stroke();
      const x0 = SW * 0.66; D.text(Math.round(m) + ' minutes', x0, SH * 0.3, { size: 16, w: 800, disp: true, align: 'left' }); D.text('θ = ' + piStr((2 * PI * Math.round(m)) / 60), x0, SH * 0.3 + 26, { size: 14, w: 700, align: 'left' }); if (W.cap) D.text(W.cap, x0, SH * 0.3 + 52, { size: 14, w: 800, align: 'left', col: C.beni });
    }
    if (W.mode === 'wheel') {
      const R2 = Math.min(SH * 0.4, SW * 0.28); const cc = [SW * 0.36, SH * 0.5]; ctx.strokeStyle = C.ink; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(cc[0], cc[1], R2, 0, 7); ctx.stroke();
      for (let k = 0; k < 8; k++) { const a = W.spin + (k / 8) * 2 * PI; ctx.lineWidth = 2.5; ctx.strokeStyle = k ? C.ink : C.beni; ctx.beginPath(); ctx.moveTo(...cc); ctx.lineTo(cc[0] + Math.cos(a) * R2, cc[1] + Math.sin(a) * R2); ctx.stroke(); }
      const x0 = SW * 0.66; D.text(W.cap || '', x0, SH * 0.35, { size: 15, w: 800, disp: true, align: 'left' }); D.text('turned: ' + fmtN(W.spin / (2 * PI), 1) + ' rev', x0, SH * 0.35 + 26, { size: 13, w: 700, align: 'left' });
    }
  },
};

/* =============== WAVE: unroll the circle into a graph =============== */
MINI.wave = {
  view: { w: 12, h: 6 },
  init(W) { Object.assign(W, { fn: 'sin', th: 0, run: false, speed: 1.2, xmax: 2 * PI, kimCorner: false, trail: [] }); },
  tick(W, dt) { if (W.run) { W.th += dt * W.speed; if (W.th > W.xmax) { W.th = W.xmax; W.run = false; } } },
  draw(W) {
    const cx = -4.4, R = 1.3, gx0 = -2.4, gw = 7.8; const sx = gw / W.xmax; const F = { sin: Math.sin, cos: Math.cos, tan: Math.tan, cot: (x) => 1 / Math.tan(x), sec: (x) => 1 / Math.cos(x), cosec: (x) => 1 / Math.sin(x) }[W.fn];
    const c = toS(cx, 0); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(c[0], c[1], R * sc(), 0, 7); ctx.stroke(); ctx.strokeStyle = C.tone; ctx.beginPath(); ctx.moveTo(c[0] - R * sc() * 1.2, c[1]); ctx.lineTo(c[0] + R * sc() * 1.2, c[1]); ctx.stroke();
    // graph axes
    D.line([[gx0, 0], [gx0 + gw + 0.3, 0]], C.ink, 2); D.line([[gx0, -2.6], [gx0, 2.6]], C.ink, 2);
    for (let k = 1; k <= Math.round(W.xmax / (PI / 2)); k++) { const p = toS(gx0 + k * (PI / 2) * sx, 0); ctx.fillStyle = C.ink; ctx.fillRect(p[0] - 1, p[1] - 4, 2, 8); D.text(piStr((k * PI) / 2), p[0], p[1] + 16, { size: 11, w: 700, col: C['ink-muted'] }); }
    for (const v of [1, -1]) { const p = toS(gx0, v * R); D.text(v > 0 ? '1' : '−1', p[0] - 6, p[1] + 4, { size: 11, w: 700, align: 'right', col: C['ink-muted'] }); D.line([[gx0, v * R], [gx0 + gw, v * R]], C.tone, 1, [3, 4]); }
    // traced graph
    ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.beginPath(); let pen = false, py = null;
    for (let i = 0; i <= 400; i++) { const x = (W.th * i) / 400; const y = F(x) * R; if (!isFinite(y) || Math.abs(y) > 2.8 || (py != null && Math.abs(y - py) > 2)) { pen = false; py = null; continue; } const p = toS(gx0 + x * sx, y); pen ? ctx.lineTo(...p) : ctx.moveTo(...p); pen = true; py = y; }
    ctx.stroke();
    const th = W.th; const P = toS(cx + R * Math.cos(th), R * Math.sin(th)); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...c); ctx.lineTo(...P); ctx.stroke(); D.dot(cx + R * Math.cos(th), R * Math.sin(th), 6, C.beni);
    const yv = F(th); if (isFinite(yv) && Math.abs(yv * R) < 2.8) { const G = toS(gx0 + th * sx, yv * R); ctx.setLineDash([4, 4]); ctx.strokeStyle = C.sora; ctx.beginPath(); ctx.moveTo(...(W.fn === 'sin' ? P : toS(cx, yv * R))); ctx.lineTo(...G); ctx.stroke(); ctx.setLineDash([]); D.dot(gx0 + th * sx, yv * R, 6, C.kin); D.sprite('kimmy-walk', G[0], G[1] - 4, Math.min(40, SH * 0.16)); }
    D.text('y = ' + W.fn + ' x', toS(gx0 + gw, 2.4)[0], toS(0, 2.4)[1], { size: 16, w: 800, disp: true, align: 'right', col: C.beni });
  },
};
async function unroll(W, fn, xmax = 2 * PI, speed = 2.4) { W.fn = fn; W.th = 0; W.xmax = xmax; W.speed = AUTO ? 99 : speed; W.run = true; SFX.rise(); await waitFor(() => !W.run); }

/* =============== SUMFIG: Fig 3.14, cos(x + y) =============== */
MINI.sumfig = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { x: 0.7, y: 0.6, kimCorner: false }); },
  draw(W) {
    const R = 2.6, cx = -1.6; const c = toS(cx, 0); ctx.strokeStyle = C.tone; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c[0] - R * sc() * 1.15, c[1]); ctx.lineTo(c[0] + R * sc() * 1.15, c[1]); ctx.stroke();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(c[0], c[1], R * sc(), 0, 7); ctx.stroke();
    const pt = (a) => [cx + R * Math.cos(a), R * Math.sin(a)]; const P1 = pt(W.x), P2 = pt(W.x + W.y), P3 = pt(-W.y), P4 = pt(0);
    D.line([[cx, 0], P1], C.tone, 2); D.line([[cx, 0], P2], C.tone, 2); D.line([[cx, 0], P3], C.tone, 2);
    D.line([P1, P3], C.beni, 4); D.line([P2, P4], C.sora, 4);
    [[P1, 'P₁ (cos x, sin x)'], [P2, 'P₂ (cos(x+y), sin(x+y))'], [P3, 'P₃ (cos y, −sin y)'], [P4, 'P₄ (1, 0)']].forEach(([p, t], i) => { D.dot(p[0], p[1], 6, i === 0 || i === 2 ? C.beni : C.sora); const s = toS(...p); D.text(t, s[0] + (p[0] >= cx ? 8 : -8), s[1] + (i === 2 ? 18 : -8), { size: 11, w: 800, align: p[0] >= cx ? 'left' : 'right', stroke: C.paper }); });
    const d13 = Math.hypot(P1[0] - P3[0], P1[1] - P3[1]) / R, d24 = Math.hypot(P2[0] - P4[0], P2[1] - P4[1]) / R; const x0 = toS(1.6, 0)[0];
    D.text('P₁P₃ = ' + fmtN(d13, 4), x0, SH * 0.3, { size: 15, w: 800, align: 'left', col: C.beni, disp: true }); D.text('P₂P₄ = ' + fmtN(d24, 4), x0, SH * 0.3 + 26, { size: 15, w: 800, align: 'left', col: C.sora, disp: true }); D.text('always equal!', x0, SH * 0.3 + 50, { size: 12, w: 700, align: 'left', col: C['ink-muted'] });
  },
};

/* =============== IDENTITY CHECKER (plane) =============== */
function idSetup(W, Lf, Rf, { x0 = -PI, x1 = PI, y0, y1 } = {}) {
  let lo = Infinity, hi = -Infinity; for (let i = 0; i <= 300; i++) { const x = lerp(x0, x1, i / 300); const v = Lf(x); if (isFinite(v) && Math.abs(v) < 8) { lo = Math.min(lo, v); hi = Math.max(hi, v); } }
  if (y0 == null) { y0 = Math.min(-1.2, lo - 0.6); y1 = Math.max(1.2, hi + 0.6); }
  planeView(W, x0, x1, y0, y1, PI / 4, PI / 2); W.pl.fx = (x) => piStr(x); W.pl.fy = (y) => fmtN(y, 1); W.pl.grid = Math.PI / 4; W.pl.lab = PI / 2; const sp = y1 - y0; W.pl.labY = W.pl.gridY = sp > 8 ? 2 : sp > 3 ? 1 : 0.5;
  W.curves.push(curve(Lf, C.sora, { w: 6, t: 'LHS', jump: (y1 - y0) * 0.5, n: 900 }), curve(Rf, C.beni, { w: 2.5, dash: [8, 6], t: 'RHS', jump: (y1 - y0) * 0.5, n: 900 }));
  W.idL = Lf; W.idR = Rf; W.ix = x0 + (x1 - x0) * 0.37;
  W.overlay = () => { const x = W.ix; const a = W.idL(x), b = W.idR(x); if (isFinite(a)) { D.dot(x, clamp(a, y0, y1), 8, C.sora); } if (isFinite(b)) D.dot(x, clamp(b, y0, y1), 4, C.beni, C.beni); const p = toS(x, y0); ctx.strokeStyle = C.kin; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(p[0], 0); ctx.lineTo(p[0], SH); ctx.stroke(); ctx.setLineDash([]); live('x = ' + fmtN(x, 2) + '<br>LHS = <b>' + (isFinite(a) ? fmtN(a, 4) : '—') + '</b><br>RHS = <b>' + (isFinite(b) ? fmtN(b, 4) : '—') + '</b>'); };
}
async function idAnimate(W) { for (const c of W.curves) await tw(c, { p: 1, duration: 0.7 }); SFX.swish(); }
/* the standard 3-part proof question */
function proofQ(ex, n, q, Lf, Rf, key, steps, o = {}) {
  return {
    ex, n, q, idL: Lf, idR: Rf, idO: o, scene: 'plane', setup: (W) => idSetup(W, Lf, Rf, o),
    parts: [
      { k: 'run', run: async () => { await idAnimate(W); } },
      { k: 'task', q: 'Graph check: the two curves sit on top of each other. Slide x and compare the numbers.', todo: 'Drag the slider through at least 3 places.', pre: () => { let n2 = 0, lv = null; slider('x', W.pl.x0 + 0.05, W.pl.x1 - 0.05, 0.05, W.ix, (v) => fmtN(v, 2), (v) => { W.ix = v; if (lv != null && Math.abs(v - lv) > 0.3) { n2++; lv = v; } if (lv == null) lv = v; W.slid = n2; }, W.pl.x0 + 0.5); }, check: (W) => (W.slid || 0) >= 2, auto: (W) => (W.slid = 3), x: 'LHS = RHS at every x: it IS an identity. Now prove it.', hint: 'Slide the x slider a few times.' },
      Object.assign({ k: 'mcq', time: 30 }, key),
      { k: 'order', q: 'Build the proof: tap the steps in order', s: steps, x: 'Proved.' },
    ],
    w: o.w || steps,
  };
}

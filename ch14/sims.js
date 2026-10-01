/* =========================================================
   CHAPTER 14 · PROBABILITY — simulations
   dice36 : the 36 outcomes of two dice; tap cells to build an event, events light up in colour
   deck   : a 52-card deck in four suit rows; events highlight cards
   roll   : roll a coin or die many times and watch relative frequencies settle
   pvenn  : two-event Venn diagram with probabilities in each region; regions light up
   ========================================================= */
const nCk = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };
const FR = (v) => fracStr(v).replace('-', '−');
const PAIRS = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) PAIRS.push([a, b]);
const pip = (n) => ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][n];

MINI.dice36 = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { sel: new Set(), ev: [], tapOn: false, kimCorner: true, kimX: 0.96, cap: '' }); },
  draw(W) {
    const cs = 0.78, x0 = -3.5, y0 = 2.4; D.textW('second die →', x0 + 3 * cs, y0 + 0.42, { size: 11, w: 700, col: C['ink-muted'] });
    for (let b = 1; b <= 6; b++) D.textW(String(b), x0 + (b - 0.5) * cs, y0 + 0.06, { size: 12, w: 800, col: C['ink-muted'] });
    for (let a = 1; a <= 6; a++) { D.textW(String(a), x0 - 0.3, y0 - (a - 0.5) * cs - 0.08, { size: 12, w: 800, col: C['ink-muted'] });
      for (let b = 1; b <= 6; b++) { const k = a + ',' + b; const cx = x0 + (b - 1) * cs, cy = y0 - a * cs; const evs = W.ev.filter((e) => e.has(a, b)); let fill = C.panel; if (evs.length === 1) fill = evs[0].col; if (evs.length > 1) fill = C.kin; if (W.sel.has(k)) fill = C['matcha-tint']; D.rect(cx + 0.03, cy + 0.03, cx + cs - 0.03, cy + cs - 0.03, fill, W.sel.has(k) ? C['matcha-deep'] : C.ink, W.sel.has(k) ? 3 : 1.5); const p = toS(cx + cs / 2, cy + cs / 2); D.text(a + b + '', p[0], p[1] + 5, { size: clamp(cs * sc() * 0.32, 9, 14), w: 700, col: C['ink-muted'] }); } }
    D.textW('first ↓', x0 - 0.3, y0 + 0.42, { size: 11, w: 700, col: C['ink-muted'] });
    const lx = 1.35; let ly = 2.2; for (const e of W.ev) { D.rect(lx, ly - 0.32, lx + 0.35, ly + 0.03, e.col, C.ink, 1.5); D.textW(e.name + ': ' + PAIRS.filter(([a, b]) => e.has(a, b)).length + '/36', lx + 0.48, ly - 0.24, { size: 11, w: 800, align: 'left' }); ly -= 0.6; }
    if (W.tapOn || W.sel.size) D.textW('selected ' + W.sel.size + '/36', lx, ly - 0.22, { size: 14, w: 800, align: 'left', col: C['matcha-deep'] });
    if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: 13, w: 800, stroke: C.paper });
  },
};
function diceTap(W) { W.tapOn = true; W.sel = new Set(); const cs = 0.78, x0 = -3.5, y0 = 2.4; W.onTap = (x, y) => { const b = Math.floor((x - x0) / cs) + 1, a = Math.floor((y0 - y) / cs) + 1; if (a < 1 || a > 6 || b < 1 || b > 6) return; const k = a + ',' + b; if (W.sel.has(k)) W.sel.delete(k); else W.sel.add(k); SFX.snap(); buzz(6); }; }
/* exercise part: tap exactly the outcomes of an event */
function dicePart(q, test, o = {}) {
  const want = PAIRS.filter(([a, b]) => test(a, b)).map(([a, b]) => a + ',' + b);
  return { k: 'task', q, todo: o.todo || 'Tap every outcome in the event (tap again to remove), then lock in.', x: o.x || want.length + ' outcomes.', no: 'It has ' + want.length + ' outcomes (now lit). ' + (o.x || ''),
    pre: async () => { W.ev = []; diceTap(W); }, check: (W) => W.sel.size === want.length && want.every((k) => W.sel.has(k)), auto: (W) => want.forEach((k) => W.sel.add(k)), reveal: (W) => { W.sel = new Set(want); }, act: async (W) => { W.onTap = null; W.tapOn = false; } };
}

const SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
MINI.deck = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { hl: null, cap: '', kimCorner: true, kimX: 0.96, k: 1 }); },
  draw(W) {
    const cw = 0.68, ch = 1.05, x0 = -4.45, y0 = 2.3; let n = 0;
    SUITS.forEach((s, si) => RANKS.forEach((r, ri) => { const on = W.hl ? W.hl(s, r) : false; if (on) n++; const x = x0 + ri * cw, y = y0 - si * (ch + 0.12); const red = s === '♥' || s === '♦'; D.rect(x + 0.03, y - ch, x + cw - 0.03, y, on ? C.kin : C.panel, on ? C.beni : C.ink, on ? 2.5 : 1.2); const p = toS(x + cw / 2, y - ch / 2); D.text(r, p[0], p[1] - 2, { size: clamp(cw * sc() * 0.36, 8, 14), w: 800, col: red ? C.beni : C.ink }); D.text(s, p[0], p[1] + 14, { size: clamp(cw * sc() * 0.36, 8, 14), w: 800, col: red ? C.beni : C.ink }); }));
    if (W.hl) D.text((W.capName || 'event') + ': ' + n + '/52 = ' + FR(n / 52), SW / 2, SH - 10, { size: 15, w: 800, disp: true, stroke: C.paper, col: C.beni });
  },
};

MINI.roll = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { kind: 'coin', faces: ['H', 'T'], counts: [0, 0], n: 0, last: null, spin: 0, target: null, kimCorner: true, kimX: 0.96 }); },
  draw(W) {
    const m = W.faces.length; const c = toS(-3.2, 0.6); const r = 1.2 * sc(); ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate(W.spin * 6); ctx.fillStyle = W.kind === 'coin' ? C.kin : C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 3;
    if (W.kind === 'coin') { ctx.beginPath(); ctx.ellipse(0, 0, r * Math.max(0.15, Math.abs(Math.cos(W.spin * 9))), r, 0, 0, 7); ctx.fill(); ctx.stroke(); } else { ctx.fillRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6); ctx.strokeRect(-r * 0.8, -r * 0.8, r * 1.6, r * 1.6); }
    ctx.restore(); if (W.last != null) D.text(String(W.faces[W.last]), c[0], c[1] + 14, { size: 40, w: 800, disp: true });
    D.textW('rolls: ' + W.n, -3.2, -1.6, { size: 15, w: 800 });
    const L = -0.9, R = 4.6, y0 = -2.3, H = 4.4, bw = (R - L) / m; D.line([[L, y0], [R, y0]], C.ink, 2);
    if (W.target != null) { const yt = y0 + W.target * H; D.line([[L, yt], [R, yt]], C.beni, 2.5, [7, 5]); D.textW('P = ' + FR(W.target), R, yt + 0.12, { size: 12, w: 800, col: C.beni, align: 'right' }); }
    W.faces.forEach((f, i) => { const fr = W.n ? W.counts[i] / W.n : 0; const x = L + i * bw; D.rect(x + bw * 0.15, y0, x + bw * 0.85, y0 + fr * H, i === W.last ? C.kin : C['sora-tint'], C.ink, 2); const p = toS(x + bw / 2, y0); D.text(String(f), p[0], p[1] + 16, { size: 13, w: 800 }); if (W.n) { const q = toS(x + bw / 2, y0 + fr * H); D.text(fmtN(fr, 2), q[0], q[1] - 5, { size: 11, w: 700 }); } });
  },
};
async function doRolls(W, k, fast) { for (let i = 0; i < k; i++) { const f = Math.floor(Math.random() * W.faces.length); W.counts[f]++; W.n++; W.last = f; if (!fast || i % 25 === 0) { W.spin += 0.3; SFX.tick(); await wait(fast ? 0.02 : 0.12); } } SFX.pop(); }

MINI.pvenn = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { a: 0, b: 0, ab: 0, labA: 'A', labB: 'B', lit: [], kimCorner: true, kimX: 0.96, show: true }); },
  draw(W) {
    const cA = [-1.1, 0.1], cB = [1.1, 0.1], r = 1.9; D.rect(-4.6, -2.6, 4.6, 2.7, C.panel, C.ink, 2.5); D.textW('S', -4.3, 2.25, { size: 15, w: 800 });
    const region = (name) => { ctx.save(); const pa = toS(...cA), pb = toS(...cB), R = r * sc(); const A = () => { ctx.beginPath(); ctx.arc(pa[0], pa[1], R, 0, 7); }, B = () => { ctx.beginPath(); ctx.arc(pb[0], pb[1], R, 0, 7); };
      ctx.fillStyle = C.kin; ctx.globalAlpha = 0.75;
      if (name === 'ab') { A(); ctx.clip(); B(); ctx.fill(); }
      if (name === 'a-b') { A(); ctx.clip(); ctx.beginPath(); ctx.rect(0, 0, SW, SH); ctx.moveTo(pb[0] + R, pb[1]); ctx.arc(pb[0], pb[1], R, 0, 7, true); ctx.fill('evenodd'); }
      if (name === 'b-a') { B(); ctx.clip(); ctx.beginPath(); ctx.rect(0, 0, SW, SH); ctx.moveTo(pa[0] + R, pa[1]); ctx.arc(pa[0], pa[1], R, 0, 7, true); ctx.fill('evenodd'); }
      if (name === 'out') { const t = toS(-4.6, 2.7), u = toS(4.6, -2.6); ctx.beginPath(); ctx.rect(t[0], t[1], u[0] - t[0], u[1] - t[1]); ctx.moveTo(pa[0] + R, pa[1]); ctx.arc(pa[0], pa[1], R, 0, 7, true); ctx.fill('evenodd'); ctx.restore(); ctx.save(); ctx.globalAlpha = 1; ctx.fillStyle = C.panel; ctx.beginPath(); ctx.arc(pb[0], pb[1], R, 0, 7); ctx.fill(); }
      ctx.restore(); };
    W.lit.slice().sort((p, q) => (p === 'out' ? -1 : q === 'out' ? 1 : 0)).forEach(region);
    D.circleW(cA[0], cA[1], r, null, C.sora, 3); D.circleW(cB[0], cB[1], r, null, C.beni, 3); D.textW(W.labA, cA[0] - 1.3, cA[1] + 1.65, { size: 16, w: 800, col: C.sora }); D.textW(W.labB, cB[0] + 1.3, cB[1] + 1.65, { size: 16, w: 800, col: C.beni });
    if (W.show) { const v = (x) => (x == null || !isFinite(x) ? '?' : fmtN(x, 3)); D.textW(v(W.a - W.ab), -1.9, 0, { size: 15, w: 800 }); D.textW(v(W.ab), 0, 0, { size: 15, w: 800 }); D.textW(v(W.b - W.ab), 1.9, 0, { size: 15, w: 800 }); D.textW(v(1 - W.a - W.b + W.ab), 3.6, -2.2, { size: 15, w: 800 }); }
  },
};

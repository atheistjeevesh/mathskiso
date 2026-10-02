/* =========================================================
   CLASS 12 · CHAPTER 13 · PROBABILITY — simulations
   out    : a grid of outcomes (coins, dice, cards, lineups). Tap outcomes to build events; colours show E, F, G and
            their overlaps. "Given F" dims everything outside F: the universe shrinks, which IS conditional probability.
   venn   : a schematic Venn with region probabilities plus an exact proportional bar. "Given B" stretches the B part
            of the bar to full width and P(A|B) is what A takes up.
   shrink : probability left after each step of a chain (draws, with or without replacement): the bar shrinks by each factor.
   areas  : the area model. Strips are the hypotheses (width = prior); the shaded height of each strip is P(A | hypothesis).
            Shaded area = P(Eᵢ)P(A|Eᵢ). Total probability = all shaded area. Bayes = one strip's share of it.
   Every answer is computed with exact rationals (Qr), never typed by hand.
   ========================================================= */
const gcdN = (a, b) => (b ? gcdN(b, a % b) : Math.abs(a));
const Qr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcdN(n, d) || 1; return { n: n / g, d: d / g }; };
const qadd = (a, b) => Qr(a.n * b.d + b.n * a.d, a.d * b.d), qsub = (a, b) => Qr(a.n * b.d - b.n * a.d, a.d * b.d), qmul = (a, b) => Qr(a.n * b.n, a.d * b.d), qdiv = (a, b) => Qr(a.n * b.d, a.d * b.n);
const qv = (a) => a.n / a.d, qs = (a) => (a.d === 1 ? String(a.n) : a.n + '/' + a.d).replace('-', '−');
const qd = (x) => { let k = 0, v = x; while (Math.abs(v - Math.round(v)) > 1e-9 && k < 8) { v *= 10; k++; } return Qr(Math.round(v), Math.pow(10, k)); };   // 0.65 → 13/20
const qsum = (xs) => xs.reduce((s, x) => qadd(s, x), Qr(0));
const Q1 = Qr(1), Q0 = Qr(0);
const pct = (a) => fmtN(qv(a), 4);
const nCk = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return Math.round(r); };

/* ---------- sample spaces ---------- */
const coinsK = (k) => { const out = []; for (let m = 0; m < 2 ** k; m++) { let s = ''; for (let i = k - 1; i >= 0; i--) s += (m >> i) & 1 ? 'T' : 'H'; out.push({ lab: s, w: 1 }); } return out; };
const coinSpace = (k) => ({ items: coinsK(k), cols: k === 3 ? 4 : 2, aspect: 0.7 });
const diceSpace = () => { const it = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) it.push({ lab: a + ',' + b, a, b, w: 1, c: b - 1, r: a - 1 }); return { items: it, cols: 6, aspect: 0.8, head: ['second die →', 'first ↓'] }; };
const dice3Space = () => { const it = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) it.push({ lab: a + ',' + b + ',' + c, a, b, c, w: 1, c_: (a - 1) * 6 + (b - 1), r: c - 1 }); it.forEach((i) => { i.c = i.c_; }); return { items: it, cols: 36, rows: 6, aspect: 1, head: ['(first, second) →', 'third ↓'] }; };
const SUITS = ['♠', '♥', '♦', '♣'], RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const deckSpace = () => { const it = []; SUITS.forEach((s, r) => RANKS.forEach((k, c) => it.push({ lab: k + s, rank: k, suit: s, black: r === 0 || r === 3, w: 1, c, r }))); return { items: it, cols: 13, rows: 4, aspect: 1 }; };
const lineSpace = () => { const P = [['M', 'F', 'S'], ['M', 'S', 'F'], ['F', 'M', 'S'], ['F', 'S', 'M'], ['S', 'M', 'F'], ['S', 'F', 'M']]; return { items: P.map((p) => ({ lab: p.join(' '), p, w: 1 })), cols: 3, aspect: 0.6 }; };
const famSpace = () => ({ items: [{ lab: 'b b', w: 1, e: 'b', y: 'b' }, { lab: 'g b', w: 1, e: 'g', y: 'b' }, { lab: 'b g', w: 1, e: 'b', y: 'g' }, { lab: 'g g', w: 1, e: 'g', y: 'g' }], cols: 2, aspect: 0.7, note: '(elder, younger)' });
const SC = { E: () => C['sora-tint'], F: () => C.sakura, G: () => C['matcha-tint'] };

MINI.out = {
  view: { w: 12, h: 8 },
  init(W) { Object.assign(W, { items: [], cols: 4, rows: 0, aspect: 0.8, sets: {}, sel: new Set(), given: null, vis: { E: 1, F: 1, G: 1 }, tapOn: false, rd: null, cap: '', head: null, kimCorner: true, kimX: 0.96, kimY: 0.9, note: '', pulse: null }); },
  geo(W) { const n = W.items.length, cols = W.cols, rows = W.rows || Math.ceil(n / cols); const cw = Math.min(10.4 / cols, 2.6), ch = Math.min(5.6 / rows, cw * W.aspect); return { cols, rows, cw, ch, x0: -(cols * cw) / 2, y0: (rows * ch) / 2 + 0.2 }; },
  draw(W) {
    const g = MINI.out.geo(W), small = g.cw < 0.55; W.g = g;
    if (W.head) { D.textW(W.head[0], 0, g.y0 + 0.5, { size: 11, w: 700, col: C['ink-muted'] }); D.textW(W.head[1], g.x0 - 0.2, g.y0 + 0.5, { size: 11, w: 700, col: C['ink-muted'], align: 'left' }); }
    if (W.note) D.textW(W.note, 0, g.y0 + 0.5, { size: 11, w: 700, col: C['ink-muted'] });
    W.items.forEach((it, i) => {
      const c = it.c != null ? it.c : i % g.cols, r = it.r != null ? it.r : Math.floor(i / g.cols), x = g.x0 + c * g.cw, y = g.y0 - r * g.ch;
      const ins = Object.keys(W.sets).filter((k) => W.vis[k] && W.sets[k](it)); let fill = C.panel; if (ins.length === 1) fill = SC[ins[0]](); else if (ins.length > 1) fill = C.kin;
      const dim = W.given && !W.sets[W.given](it); const sel = W.sel.has(i);
      ctx.save(); ctx.globalAlpha = dim ? 0.18 : 1; D.rect(x + 0.02, y - g.ch + 0.02, x + g.cw - 0.02, y - 0.02, sel ? C['matcha-tint'] : fill, sel ? C['matcha-deep'] : C.ink, sel ? 3.5 : small ? 0.6 : 1.4); ctx.restore();
      if (!small) { ctx.save(); ctx.globalAlpha = dim ? 0.25 : 1; D.textW(it.lab, x + g.cw / 2, y - g.ch / 2 - 0.08, { size: clamp(g.cw * 17, 9, 15), w: 800 }); if (it.t2) D.textW(it.t2, x + g.cw / 2, y - g.ch / 2 + 0.28, { size: 10, w: 700, col: C['ink-muted'] }); ctx.restore(); }
    });
    let ly = -g.y0 + g.rows * 0 - 0.7; const ky = -3.55; let kx = -5.6;
    for (const k of Object.keys(W.sets)) if (W.vis[k]) { D.rect(kx, ky - 0.18, kx + 0.34, ky + 0.12, SC[k](), C.ink, 1.5); const cnt = W.items.reduce((s, it) => s + (W.sets[k](it) ? it.w : 0), 0); D.textW(((W.setNames && W.setNames[k]) || k) + (W.showN === false ? '' : ' (' + cnt + ')'), kx + 0.45, ky - 0.1, { size: 12.5, w: 800, align: 'left' }); kx += 2.1; }
    const L = (typeof W.rd === 'function' ? W.rd() : W.rd || []).filter(Boolean); if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.5, SH - 10, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
const idxs = (sp, f) => sp.items.map((it, i) => (f(it) ? i : -1)).filter((i) => i >= 0);
const wsum = (sp, f) => sp.items.reduce((s, it) => s + (f(it) ? it.w : 0), 0);
function outSet(W, sp, sets, o = {}) { Object.assign(W, { items: sp.items, cols: sp.cols, rows: sp.rows || 0, aspect: sp.aspect || 0.8, head: sp.head || null, note: sp.note || '', sets, setNames: o.names || null, sel: new Set(), given: null, vis: Object.assign({ E: 1, F: 1, G: 1 }, o.vis || {}), tapOn: false, rd: null, cap: o.cap || '', showN: o.showN, space: sp });
  W.onTap = (x, y) => { if (!W.tapOn || !W.g) return; const g = W.g; const c = Math.floor((x - g.x0) / g.cw), r = Math.floor((g.y0 - y) / g.ch); const i = W.items.findIndex((it, k) => (it.c != null ? it.c : k % g.cols) === c && (it.r != null ? it.r : Math.floor(k / g.cols)) === r); if (i < 0) return; if (W.sel.has(i)) W.sel.delete(i); else W.sel.add(i); SFX.snap(); buzz(6); }; }

/* ---------- venn + proportional bar ---------- */
MINI.venn = {
  view: { w: 12, h: 8 },
  init(W) { Object.assign(W, { v: { a: Q0, b: Q0, ab: Q0 }, names: ['A', 'B'], given: null, zoom: 0, hide: {}, rd: null, cap: '', kimCorner: true, kimX: 0.96, kimY: 0.9 }); },
  draw(W) {
    const { a, b, ab } = W.v, [nA, nB] = W.names, pa = qv(a), pb = qv(b), pab = qv(ab), aOnly = pa - pab, bOnly = pb - pab, none = 1 - (pa + pb - pab);
    const cx = 0, cy = 1.15, R = 1.9, dx = 1.25;
    ctx.save(); ctx.lineWidth = 3; ctx.strokeStyle = C.ink;
    const circ = (x, r) => { const s = toS(x, cy), e = toS(x + r, cy), rr = Math.abs(e[0] - s[0]); return [s[0], s[1], rr]; };
    const [ax, ay, ar] = circ(cx - dx, R), [bx, by, br] = circ(cx + dx, R);
    D.rect(-5.4, cy - 2.5, 5.4, cy + 2.5, C.panel, C.ink, 2.5);
    const dimA = W.given === 'B', dimB = W.given === 'A';
    ctx.globalAlpha = 1; ctx.fillStyle = C['sora-tint']; ctx.beginPath(); ctx.arc(ax, ay, ar, 0, 7); ctx.fill();
    ctx.fillStyle = C.sakura; ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(ax, ay, ar, 0, 7); ctx.clip(); ctx.fillStyle = C.kin; ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = C.ink; ctx.beginPath(); ctx.arc(ax, ay, ar, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.stroke();
    if (W.given) { ctx.save(); ctx.globalAlpha = 0.78 * W.zoom; ctx.fillStyle = C.paper; const keep = W.given === 'A' ? [ax, ay, ar] : [bx, by, br]; const top = toS(-5.4, cy + 2.5), bot = toS(5.4, cy - 2.5); ctx.beginPath(); ctx.rect(top[0], top[1], bot[0] - top[0], bot[1] - top[1]); ctx.arc(keep[0], keep[1], keep[2], 0, 7, true); ctx.fill('evenodd'); ctx.restore(); }
    ctx.restore();
    const lab = (t, x, y, col) => D.textW(t, x, y, { size: 13, w: 800, col: col || C.ink, stroke: C.paper });
    const val = (k, v) => (W.hide[k] ? '?' : qs(v));
    D.textW(nA, cx - dx - 1.15, cy + 1.9, { size: 16, w: 800 }); D.textW(nB, cx + dx + 1.15, cy + 1.9, { size: 16, w: 800 });
    lab(val('aOnly', Qr(Math.round(aOnly * 1e6), 1e6)), cx - dx - 0.75, cy); lab(val('ab', ab), cx, cy); lab(val('bOnly', Qr(Math.round(bOnly * 1e6), 1e6)), cx + dx + 0.75, cy); lab(val('none', Qr(Math.round(none * 1e6), 1e6)), 4.5, cy - 2.0, C['ink-muted']);
    // exact proportional bar
    const x0 = -5.4, wTot = 10.8, yb = -2.05, hb = 0.8; const segs = [{ k: 'aOnly', v: aOnly, col: C['sora-tint'], inA: 1, inB: 0 }, { k: 'ab', v: pab, col: C.kin, inA: 1, inB: 1 }, { k: 'bOnly', v: bOnly, col: C.sakura, inA: 0, inB: 1 }, { k: 'none', v: none, col: C.panel, inA: 0, inB: 0 }];
    const z = W.zoom, g = W.given; const keepOf = (s) => (g === 'A' ? s.inA : g === 'B' ? s.inB : 1); const base = g ? (g === 'A' ? pa : pb) : 1;
    let x = x0; const widths = segs.map((s) => (g ? (keepOf(s) ? s.v / base * z + s.v * (1 - z) : s.v * (1 - z)) : s.v));
    segs.forEach((s, i) => { const w = widths[i] * wTot; if (w > 0.002) { D.rect(x, yb - hb, x + w, yb, s.col, C.ink, 2); if (w > 0.7 && !(g && z > 0.9 && !keepOf(s))) D.textW(W.hide[s.k] ? '?' : fmtN(widths[i], 3), x + w / 2, yb - hb / 2 - 0.08, { size: 11, w: 800 }); } x += w; });
    D.textW(g ? 'universe shrunk to ' + (g === 'A' ? nA : nB) : 'whole sample space = 1', 0, yb - hb - 0.35, { size: 11.5, w: 700, col: C['ink-muted'] });
    const L = (typeof W.rd === 'function' ? W.rd() : W.rd || []).filter(Boolean); if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.5, SH - 10, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
/* v: { a, b, ab } as rationals; unknown regions can be hidden until answered */
function vennSet(W, a, b, ab, o = {}) { Object.assign(W, { v: { a, b, ab }, names: o.names || ['A', 'B'], given: null, zoom: 0, hide: Object.assign({}, o.hide), rd: null, cap: o.cap || '' }); }
async function vennGiven(W, which) { W.given = which; W.zoom = 0; SFX.whoosh(); await tw(W, { zoom: 1, duration: AUTO ? 0.05 : 1.2, ease: 'power2.inOut' }); }

/* ---------- shrinking chain ---------- */
MINI.shrink = {
  view: { w: 12, h: 8 },
  init(W) { Object.assign(W, { steps: [], k: 0, rd: null, cap: '', kimCorner: true, kimX: 0.96, kimY: 0.9, title: '' }); },
  draw(W) {
    const n = W.steps.length, top = 2.7, rh = Math.min(0.95, 5 / Math.max(n, 1)), x0 = -5.2, wT = 10.4; if (W.title) D.textW(W.title, 0, top + 0.95, { size: 13, w: 800, col: C['ink-muted'] });
    let cum = Q1; D.rect(x0, top - 0.55, x0 + wT, top, C.paper, C.ink, 2); D.textW('whole = 1', x0 + wT / 2, top - 0.33, { size: 11, w: 800, col: C['ink-muted'] });
    W.steps.forEach((s, i) => { cum = qmul(cum, s.p); if (W.k <= i) return; const y = top - (i + 1) * (rh + 0.12) - 0.55, k = clamp(W.k - i, 0, 1); const wPrev = qv(s.prev || qdiv(cum, s.p)) , w = lerp(wPrev, qv(cum), k) * wT; D.rect(x0, y, x0 + wPrev * wT, y + rh, C.panel, C.ink, 1); D.rect(x0, y, x0 + w, y + rh, s.col || C.sora, C.ink, 2.5); D.textW(s.lab + '   × ' + qs(s.p), x0 + 0.1, y + rh / 2 - 0.1, { size: 12, w: 800, align: 'left', stroke: C.paper }); if (k >= 1) D.textW('= ' + qs(cum), x0 + wT, y + rh / 2 - 0.1, { size: 13, w: 800, align: 'right', col: C.ink, stroke: C.paper }); s.cum = cum; });
    const L = (typeof W.rd === 'function' ? W.rd() : W.rd || []).filter(Boolean); if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.5, SH - 10, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
const CH_COL = [() => C.sora, () => C.beni, () => C['matcha-deep'], () => C.kin];
function shrinkSet(W, steps, o = {}) { let cum = Q1; W.steps = steps.map((s, i) => { const prev = cum; cum = qmul(cum, s.p); return { lab: s.lab, p: s.p, prev, col: [C['sora-tint'], C.sakura, C['matcha-tint'], C.kin][i % 4] }; }); W.k = 0; W.rd = null; W.cap = o.cap || ''; W.title = o.title || ''; }
async function shrinkRun(W) { W.k = 0; SFX.swish(); await tw(W, { k: W.steps.length, duration: AUTO ? 0.05 : 0.7 * W.steps.length, ease: 'none' }); }

/* ---------- area model ---------- */
const areaW = (W, wT) => { const tot = W.hy.reduce((s, h) => s + qv(h.prior), 0) || 1, ws = W.hy.map((h) => Math.max((qv(h.prior) / tot) * wT, 0.5)), sm = ws.reduce((a, b) => a + b, 0); return ws.map((w) => (w * wT) / sm); };
MINI.areas = {
  view: { w: 12, h: 8 },
  init(W) { Object.assign(W, { hy: [], aname: 'A', pick: -1, ph: 0, ps: 0, post: false, hideJ: true, rd: null, cap: '', kimCorner: true, kimX: 0.96, kimY: 0.9, tapOn: false, colw: 0 }); },
  draw(W) {
    const x0 = -4.6, wT = 8.2, y0 = -3.0, H = 5.2; if (!W.hy.length) return;
    D.textW('height = P(' + W.aname + ' | hypothesis)', x0 - 0.2, y0 + H + 1.15, { size: 11, w: 700, align: 'left', col: C['ink-muted'] });
    for (const t of [0, 0.5, 1]) { D.textW(String(t), x0 - 0.35, y0 + t * H - 0.1, { size: 10, w: 700, col: C['ink-muted'] }); }
    let x = x0; const AW = areaW(W, wT);
    W.hy.forEach((h, i) => {
      const w = AW[i] * (W.ps == null ? 1 : W.ps), hh = qv(h.like) * H * W.ph, on = W.pick === i, dim = W.pick >= 0 && !on && W.post;
      ctx.save(); ctx.globalAlpha = dim ? 0.3 : 1; D.rect(x, y0, x + w, y0 + H, C.panel, C.ink, on ? 4 : 2.5); if (hh > 0.001) D.rect(x, y0, x + w, y0 + hh, h.col || C.sora, C.ink, 1.5); ctx.restore();
      D.textW(h.n, x + w / 2, y0 + H + 0.12, { size: w > 0.9 ? 12.5 : 10, w: 800 }); D.textW(W.hideP && W.hideP[i] ? '?' : qs(h.prior), x + w / 2, y0 + H + 0.5, { size: w > 0.9 ? 12 : 10, w: 700, col: C['ink-muted'] });
      if (hh > 0.001 && w > 0.5) D.textW(qs(h.like), x + w / 2, y0 + hh / 2 - 0.08, { size: 11.5, w: 800, stroke: C.paper });
      if (W.showJ && w > 0.7 && hh > 0.2) D.textW('area ' + qs(qmul(h.prior, h.like)), x + w / 2, y0 + hh + 0.22 > y0 + H - 0.2 ? y0 + hh - 0.5 : y0 + hh + 0.2, { size: 10.5, w: 800 });
      x += w; });
    W.xs = { x0, wT, y0, H };
    const L = (typeof W.rd === 'function' ? W.rd() : W.rd || []).filter(Boolean); if (L.length) { ctx.font = FONT(800, 12.5); const bw = Math.max(...L.map((l) => ctx.measureText(l[0]).width)) + 18; ctx.fillStyle = C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(8, 8, bw, L.length * 18 + 10); ctx.strokeRect(8, 8, bw, L.length * 18 + 10); L.forEach(([t, col], i) => D.text(t, 16, 26 + i * 18, { size: 12.5, w: 800, align: 'left', col: col || C.ink })); }
    if (W.cap) D.text(W.cap, SW * 0.5, SH - 10, { size: 12, w: 800, stroke: C.paper, col: C['ink-muted'] });
  },
};
/* hyps: [{ n, prior, like }] with rational prior/like; aname: name of the observed event */
function areaSet(W, hyps, aname = 'A', o = {}) { Object.assign(W, { hy: hyps.map((h, i) => ({ ...h, col: [C['sora-tint'], C.sakura, C['matcha-tint'], C.kin, C.peach][i % 5] })), aname, pick: -1, ph: o.ph != null ? o.ph : 0, ps: o.ps != null ? o.ps : 1, post: false, showJ: false, hideP: o.hideP || null, rd: null, cap: o.cap || '', tapOn: false });
  W.onTap = (x) => { if (!W.tapOn || !W.xs) return; const { x0, wT } = W.xs; const AW = areaW(W, wT); let c = x0; W.hy.forEach((h, i) => { const w = AW[i]; if (x >= c && x < c + w) { W.pick = i; W.taps = (W.taps || 0) + 1; SFX.pop(); } c += w; }); }; }
async function areaIn(W) { W.ps = 0; W.ph = 0; SFX.whoosh(); await tw(W, { ps: 1, duration: AUTO ? 0.05 : 0.7 }); SFX.swish(); await tw(W, { ph: 1, duration: AUTO ? 0.05 : 0.8 }); }
const bayes = (hy) => { const j = hy.map((h) => qmul(h.prior, h.like)), tot = qsum(j); return { j, tot, post: j.map((x) => (tot.n ? qdiv(x, tot) : Q0)) }; };

/* ---------- part builders ---------- */
const mcqP = (q, o, x) => ({ k: 'mcq', q, o, a: 0, x });
const tfP = (q, a, x) => ({ k: 'tf', q, a, x });
const runP = (fn) => ({ k: 'run', run: fn });
/* probability answer: the exact rational, typed as a fraction or 3-decimal number */
const qshow = (r) => (r.d <= 1000 ? qs(r) : String(+qv(r).toFixed(7)));
const ptol = (a) => (a === 0 ? 1e-9 : Math.min(5e-4, Math.abs(a) * 5e-3));
const pnum = (q, r, x, o = {}) => ({ k: 'num', q, a: qv(r), show: o.show || qshow(r), x: x || '', keys: '', tol: o.tol || ptol(qv(r)), ...o });
const pfld = (q, specs, x) => ({ k: 'fields', q, f: specs.map(([l, r, sh]) => ({ l, a: qv(r), show: sh || qshow(r), tol: ptol(qv(r)) })), x: x || '', keys: '' });
const tapP = (q, test, o = {}) => ({ k: 'task', q, todo: o.todo || 'Tap every outcome in the event, then lock in.', x: o.x || '', no: o.no,
  pre: async (W) => { W.sel = new Set(); W.tapOn = true; }, check: (W) => { const want = idxs(W.space, test); return W.sel.size === want.length && want.every((i) => W.sel.has(i)); },
  auto: (W) => { W.sel = new Set(idxs(W.space, test)); }, reveal: (W) => { W.sel = new Set(idxs(W.space, test)); }, act: async (W) => { W.tapOn = false; W.sel = new Set(); } });
const exBase = (ex, n, q, scene, setup, parts, w, o = {}) => ({ ex, n, q, scene, setup, parts, w: [w], kim: o.kim });

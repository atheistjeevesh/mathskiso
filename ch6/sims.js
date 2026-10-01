/* =========================================================
   CHAPTER 6 · PERMUTATIONS & COMBINATIONS — simulations
   slots (fill boxes, multiplication principle), tree (Fig 6.1/6.2), tiles (letter arrangements, glued blocks),
   pick (choose teams / chords on a circle / cards)
   ========================================================= */
const fact = (n) => { let r = 1; for (let k = 2; k <= n; k++) r *= k; return r; };
const P = (n, r) => (r < 0 || r > n ? 0 : fact(n) / fact(n - r));
const Cn = (n, r) => { if (r < 0 || r > n) return 0; let x = 1; for (let k = 1; k <= r; k++) x = (x * (n - r + k)) / k; return Math.round(x); };
const multiset = (w) => { const m = {}; for (const c of w) m[c] = (m[c] || 0) + 1; return m; };
const arrangements = (w) => Object.values(multiset(w)).reduce((s, k) => s / fact(k), fact(w.length));
const fmtBig = (n) => n.toLocaleString('en-IN');

/* =============== SLOTS =============== */
MINI.slots = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { slots: [], pool: [], eq: '', cap: '', kimCorner: true }); },
  draw(W) {
    const n = W.slots.length; if (!n) return; const bw = Math.min(1.5, 8.6 / n), gap = 0.18, tot = n * bw + (n - 1) * gap; const x0 = -tot / 2;
    W.slots.forEach((s, i) => {
      const x = x0 + i * (bw + gap); D.rect(x, 0.05, x + bw, 1.55, s.fill ? C['sora-tint'] : C.panel, C.ink, 2.5);
      if (s.lab) { const p = toS(x + bw / 2, -0.3); D.text(s.lab, p[0], p[1], { size: 11, w: 700, col: C['ink-muted'] }); }
      if (s.t) { const p = toS(x + bw / 2, 0.8); D.text(s.t, p[0], p[1] + 8 - (1 - (s.k == null ? 1 : s.k)) * 40, { size: clamp(sc() * bw * 0.45, 13, 30), w: 800, disp: true, col: s.col || C.ink }); }
      if (s.c != null && s.c !== '') { const p = toS(x + bw / 2, -0.95); D.text(String(s.c), p[0], p[1], { size: clamp(sc() * 0.42, 14, 24), w: 800, disp: true, col: C.beni }); if (i < n - 1) { const q = toS(x + bw + gap / 2, -0.95); D.text('×', q[0], q[1], { size: 16, w: 800 }); } }
    });
    W.pool.forEach((t, i) => { const per = Math.min(W.pool.length, 12); const x = -((per - 1) * 0.72) / 2 + (i % per) * 0.72, y = 2.5 - Math.floor(i / per) * 0.55; chipW(t.t, x, y, { size: 13, dim: t.used, bg: t.bg || C.panel }); });
    if (W.eq) D.text(W.eq, SW / 2, toS(0, -2.0)[1], { size: clamp(SW / 26, 14, 24), w: 800, disp: true, col: C.ink });
    if (W.cap) D.text(W.cap, SW / 2, SH - 10, { size: 13, w: 700, col: C['ink-muted'] });
  },
};
function slotsSet(W, labs, pool = []) { W.slots = labs.map((l) => ({ lab: l, t: '', c: '' })); W.pool = pool.map((t) => ({ t })); W.eq = ''; }
/* counts: number of choices for each slot (shown in red), picks: what lands in each */
async function slotsFill(W, counts, picks = [], d = 0.35) {
  for (let i = 0; i < W.slots.length; i++) {
    const s = W.slots[i]; s.c = counts[i]; s.fill = true; SFX.tick(); if (picks[i] != null) { s.t = String(picks[i]); s.k = 0; gsap.to(s, { k: 1, duration: 0.3, ease: 'bounce.out' }); const pt = W.pool.find((p) => p.t === String(picks[i]) && !p.used); if (pt && !W.repeat) pt.used = true; }
    SFX.pop(); await wait(d);
  }
  const tot = counts.reduce((a, b) => a * b, 1); W.eq = counts.join(' × ') + ' = ' + fmtBig(tot); SFX.coin(); FX.ono(pickOne(['DON!', 'KACHI!', 'ZUBAN!']), { x: 78, y: 18 });
  return tot;
}

/* =============== TREE (Fig 6.1, 6.2) =============== */
MINI.tree = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { levels: [], p: 0, kimCorner: false }); },
  draw(W) {
    const L0 = W.levels; if (!L0.length) return; const leaves = L0.reduce((a, l) => a * l.length, 1); const depth = L0.length;
    const xs = (d) => -4.2 + ((d + 1) * 8.2) / (depth + 0.6);
    // recursive layout by leaf index
    const nodes = []; const walk = (d, lo, hi, path) => { if (d === depth) return; const k = L0[d].length; for (let i = 0; i < k; i++) { const a = lo + ((hi - lo) * i) / k, b = lo + ((hi - lo) * (i + 1)) / k; nodes.push({ d, y: (a + b) / 2, t: L0[d][i], parentY: (lo + hi) / 2 }); walk(d + 1, a, b, path.concat(L0[d][i])); } };
    walk(0, 2.9, -2.9, []);
    const shown = Math.floor(W.p * nodes.length + 1e-9);
    const sz = clamp(SH / (leaves * 1.8 + 4), 8, 14);
    nodes.forEach((nd, i) => { if (i >= shown) return; const px = nd.d ? xs(nd.d - 1) : -4.6; const a = toS(px + 0.3, nd.parentY), b = toS(xs(nd.d) - 0.3, nd.y); ctx.strokeStyle = C.tone; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke(); D.text(nd.t, b[0] + 2, b[1] + 4, { size: sz + 2, w: 800, align: 'left', col: nd.d === depth - 1 ? C.beni : C.ink }); });
    const st = toS(-4.6, 0); D.dot(-4.6, 0, 5, C.ink);
    if (W.p >= 1) D.text(L0.map((l) => l.length).join(' × ') + ' = ' + leaves + ' ways', SW / 2, 18, { size: 15, w: 800, disp: true, stroke: C.paper });
  },
};
async function treeGrow(W, levels, d = 1.6) { W.levels = levels; W.p = 0; SFX.rise(); await tw(W, { p: 1, duration: d, ease: 'none' }); SFX.coin(); }

/* =============== TILES: arrangements of letters =============== */
const TILECOL = ['--sakura', '--sora-tint', '--peach', '--matcha-tint', '--kin-tint', '--tone'];
MINI.tiles = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { tiles: [], cap: '', count: '', kimCorner: true }); },
  draw(W) {
    const n = W.tiles.length; if (!n) return; const tw2 = Math.min(1.05, 9.2 / n); const x0 = -((n - 1) * tw2) / 2;
    W.tiles.forEach((t, i) => { const x = t.x != null ? t.x : x0 + t.pos * tw2; t.x = x; const y = (t.y || 0.6) + (t.j || 0); const p = toS(x, y); const s = tw2 * sc() * 0.86; ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(t.r || 0); ctx.fillStyle = t.bg || C.panel; ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.fillRect(-s / 2, -s / 2, s, s); ctx.strokeRect(-s / 2, -s / 2, s, s); if (t.glue) { ctx.strokeStyle = C.beni; ctx.lineWidth = 4; ctx.strokeRect(-s / 2 - 3, -s / 2 - 3, s + 6, s + 6); } D.text(t.ch, 0, s * 0.18, { size: s * 0.55, w: 800, disp: true }); ctx.restore(); });
    if (W.count) D.text(W.count, SW / 2, toS(0, -1.5)[1], { size: clamp(SW / 24, 14, 26), w: 800, disp: true, col: C.beni });
    if (W.cap) D.text(W.cap, SW / 2, toS(0, -2.3)[1], { size: 13, w: 700, col: C['ink-muted'] });
  },
};
function tilesSet(W, word) { const cols = {}; let k = 0; const ms = multiset(word); W.tiles = word.split('').map((ch, i) => { if (ms[ch] > 1 && !cols[ch]) cols[ch] = C[TILECOL[k++ % TILECOL.length].slice(2)]; return { ch, pos: i, bg: cols[ch] || C.panel }; }); }
async function tilesShuffle(W, times = 3) { const n = W.tiles.length; const tw2 = Math.min(1.05, 9.2 / n), x0 = -((n - 1) * tw2) / 2; for (let k = 0; k < times; k++) { const perm = shuffle([...Array(n).keys()]); SFX.swish(); await Promise.all(W.tiles.map((t, i) => tw(t, { x: x0 + perm[i] * tw2, r: (Math.random() - 0.5) * 0.3, duration: 0.35, ease: 'back.out(1.5)' }))); W.tiles.forEach((t, i) => (t.pos = perm[i])); } W.tiles.forEach((t) => gsap.to(t, { r: 0, duration: 0.2 })); }
/* glue: letters matching test are pulled together into one block */
async function tilesGlue(W, test) { const n = W.tiles.length; const tw2 = Math.min(1.05, 9.2 / n), x0 = -((n - 1) * tw2) / 2; const g = W.tiles.filter((t) => test(t.ch)), o = W.tiles.filter((t) => !test(t.ch)); const order = [...o.slice(0, 1), ...g, ...o.slice(1)]; SFX.whoosh(); await Promise.all(order.map((t, i) => { t.pos = i; t.glue = test(t.ch); return tw(t, { x: x0 + i * tw2, duration: 0.5, ease: 'power2.inOut' }); })); FX.ono('GATTAI!', { x: 50, y: 25 }); }

/* =============== PICK: choose r of n (teams, chords, cards) =============== */
MINI.pick = {
  view: { w: 10, h: 6.2 },
  init(W) { Object.assign(W, { groups: [], mode: 'team', box: [], chords: [], pts: 0, cap: '', kimCorner: false }); },
  draw(W) {
    if (W.mode === 'circle') {
      const R = 2.5, n = W.pts; const pt = (i) => [-1.2 + R * Math.cos((2 * Math.PI * i) / n + 0.3), R * Math.sin((2 * Math.PI * i) / n + 0.3)];
      D.circleW(-1.2, 0, R, null, C.tone, 2); W.chords.forEach(([i, j], k) => { if (k < (W.cp == null ? 1e9 : W.cp)) D.line([pt(i), pt(j)], C.sora, 1.5); });
      for (let i = 0; i < n; i++) { const p = pt(i); D.dot(p[0], p[1], 6, C.beni); }
      const t = toS(2.2, 1); D.text(W.chords.length && W.cp >= W.chords.length ? W.chords.length + ' chords' : '', t[0], t[1], { size: 18, w: 800, disp: true, align: 'left' });
      if (W.cap) D.text(W.cap, t[0], t[1] + 26, { size: 13, w: 700, align: 'left', col: C['ink-muted'] }); return;
    }
    if (W.mode === 'cards') { const suits = [['♠', C.ink], ['♣', C.ink], ['♥', C.beni], ['♦', C.beni]]; const ranks = 'A23456789TJQK'; const cw = 0.68, ch = 1.05; for (let s = 0; s < 4; s++) for (let r = 0; r < 13; r++) { const x = -4.4 + r * cw, y = 2.1 - s * (ch + 0.12); const on = W.hl && W.hl(r, s); D.rect(x, y - ch, x + cw - 0.06, y, on ? C.kin : C.panel, C.ink, 1.5); const p = toS(x + cw / 2 - 0.03, y - ch / 2); D.text((ranks[r] === 'T' ? '10' : ranks[r]) + suits[s][0], p[0], p[1] + 5, { size: clamp(sc() * 0.26, 9, 15), w: 800, col: suits[s][1] }); } if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: 13, w: 800, disp: true, stroke: C.paper }); return; }
    // team mode: groups of tokens; selected tokens fly into the box
    D.rect(-4.8, -2.9, 4.8, -1.2, C['matcha-tint'], C.ink, 2); const bl = toS(-4.7, -1.35); D.text('selected', bl[0] + 4, bl[1] + 12, { size: 11, w: 800, align: 'left', col: C['matcha-deep'] });
    let row = 0; for (const g of W.groups) { g.items.forEach((it) => { const p = toS(it.x, it.y); ctx.beginPath(); ctx.arc(p[0], p[1], 13, 0, 7); ctx.fillStyle = g.col; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.stroke(); D.text(it.t, p[0], p[1] + 4, { size: 11, w: 800 }); }); const lp = toS(-4.7, g.y0); D.text(g.name, lp[0], lp[1] + 4, { size: 12, w: 800, align: 'left' }); row++; }
    if (W.cap) D.text(W.cap, SW / 2, 18, { size: 15, w: 800, disp: true, stroke: C.paper });
  },
};
function pickSetup(W, groups) { W.mode = 'team'; let y = 2.0; W.groups = groups.map(([name, n, col, lab]) => { const g = { name, col, y0: y, items: [] }; for (let i = 0; i < n; i++) g.items.push({ t: lab ? lab + (i + 1) : String(i + 1), x: -3.2 + (i % 13) * 0.62, y: y - Math.floor(i / 13) * 0.6, hx: -3.2 + (i % 13) * 0.62, hy: y - Math.floor(i / 13) * 0.6 }); y -= 0.75 + Math.floor((n - 1) / 13) * 0.6; return g; }); }
async function pickTake(W, counts, d = 0.12) { let slot = 0; for (const [gi, k] of counts) { const g = W.groups[gi]; const pool = shuffle(g.items.filter((it) => !it.sel)).slice(0, k); for (const it of pool) { it.sel = true; SFX.pop(); await tw(it, { x: -4.3 + (slot % 15) * 0.6, y: -1.75 - Math.floor(slot / 15) * 0.55, duration: 0.25 }); slot++; await wait(d); } } }
function pickReset(W) { W.groups.forEach((g) => g.items.forEach((it) => { it.sel = false; it.x = it.hx; it.y = it.hy; })); }
async function chordsDraw(W, n) { W.mode = 'circle'; W.pts = n; W.chords = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) W.chords.push([i, j]); W.cp = 0; SFX.rise(); await tw(W, { cp: W.chords.length, duration: 1.4, ease: 'none' }); SFX.coin(); }

/* =========================================================
   CHAPTER 1 · SETS — simulations
   judges (well-defined?), bag (roster braces), filter (set-builder machine),
   venn (tap-to-shade regions with element tokens), power (subsets), nested (N⊂Z⊂Q⊂R)
   ========================================================= */
/* =============== JUDGES: is the collection well-defined? =============== */
MINI.judges = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { title: '', jp: [], kp: [], stamp: '', stampOk: true, st: 0, k: 0, kimCorner: false }); },
  draw(W) {
    if (W.title) D.text(W.title, SW / 2, 22, { size: clamp(SW / 34, 12, 16), w: 800, disp: true });
    const panel = (cx, who, items, face) => {
      const x0 = cx - 2.25, x1 = cx + 2.25, y0 = -2.7, y1 = 2.0; D.rect(x0, y0, x1, y1, C.panel); const tl = toS(x0, y1);
      D.text(who, tl[0] + 8, tl[1] + 18, { size: 13, w: 800, align: 'left', disp: true });
      const f = toS(x1 - 0.5, y1 + 0.05); D.sprite(face, f[0], f[1] + 4, Math.min(50, SH * 0.17));
      items.forEach((it, i) => { const yy = y1 - 0.75 - i * 0.62 - (1 - (it.k == null ? 1 : it.k)) * 1.2; if (yy < y0 + 0.2) return; chipW(it.t, cx, yy, { a: it.k == null ? 1 : it.k, size: 12, bg: it.bg || C.panel }); });
    };
    panel(-2.45, 'Jeevesh’s list', W.jp, 'jess-thinking'); panel(2.45, 'Kimmy’s list', W.kp, 'kimmy-lookup');
    if (W.stamp && W.st > 0) { const p = toS(0, -0.4); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(-0.18); ctx.scale(W.st, W.st); D.star(0, 0, Math.min(SW, SH) * 0.2, 14, W.stampOk ? C['matcha-tint'] : C.sakura); D.text(W.stamp, 0, 8, { size: clamp(SW / 20, 16, 30), w: 800, disp: true, col: W.stampOk ? C['matcha-deep'] : C.beni }); ctx.restore(); }
  },
};
async function judgeRun(W, jp, kp, ok) {
  W.jp = jp.map((t) => ({ t, k: 0 })); W.kp = kp.map((t) => ({ t, k: 0 }));
  for (let i = 0; i < Math.max(jp.length, kp.length); i++) { if (W.jp[i]) gsap.to(W.jp[i], { k: 1, duration: 0.35, ease: 'bounce.out' }); if (W.kp[i]) gsap.to(W.kp[i], { k: 1, duration: 0.35, ease: 'bounce.out', delay: 0.1 }); SFX.pop(); await wait(0.28); }
  W.kp.forEach((it) => { if (!jp.includes(it.t)) it.bg = C.sakura; }); W.jp.forEach((it) => { if (!kp.includes(it.t)) it.bg = C.sakura; });
  W.stamp = ok ? 'SAME LIST → SET ✓' : 'DIFFERENT → NOT A SET'; W.stampOk = ok; SFX.don(); FX.lines(!ok); await tw(W, { startAt: { st: 2.5 }, st: 1, duration: 0.35, ease: 'back.out(2)' });
}

/* =============== FILTER: set-builder machine =============== */
MINI.filter = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { rule: '', cands: [], out: [], rej: [], cur: null, glow: 0, more: false, kimCorner: false }); },
  draw(W) {
    // conveyor
    const y = 1.6; D.line([[-4.9, y - 0.35], [0, y - 0.35]], C.ink, 2); for (let x = -4.8; x < 0; x += 0.4) D.line([[x + ((T * 0.8) % 0.4), y - 0.35], [x + ((T * 0.8) % 0.4) - 0.15, y - 0.5]], C.tone, 2);
    W.cands.forEach((c, i) => { if (c.gone) return; chipW(c.t, c.x, c.y, { size: 13, a: c.a == null ? 1 : c.a }); });
    if (W.more) D.textW('…', -4.7, y - 0.1, { size: 20, w: 800 });
    // machine
    const g = W.glow; D.rect(-0.2, 0.2, 2.6, 2.6, g > 0 ? (W.glowOk ? C['matcha-tint'] : C.sakura) : C['sora-tint']); D.rect(-0.2, 2.25, 2.6, 2.6, C.ink);
    const mt = toS(1.2, 2.42); D.text('SET-BUILDER MACHINE', mt[0], mt[1] + 4, { size: 9, w: 800, col: C.panel });
    const r = toS(1.2, 1.1); ctx.save(); ctx.beginPath(); const a0 = toS(-0.15, 2.2), a1 = toS(2.55, 0.25); ctx.rect(a0[0], a0[1], a1[0] - a0[0], a1[1] - a0[1]); ctx.clip(); wrapText(W.rule, r[0], r[1] - 8, (a1[0] - a0[0]) - 10, clamp(SW / 48, 10, 14)); ctx.restore();
    if (W.cur) chipW(W.cur.t, W.cur.x, W.cur.y, { size: 14, s: W.cur.s || 1 });
    // output bag + reject bin
    D.rect(-4.9, -2.9, -1.4, -0.6, C.sakura); const rl = toS(-3.15, -0.75); D.text('✗ fails the rule', rl[0], rl[1], { size: 11, w: 800, col: C['sakura-deep'] });
    W.rej.forEach((c, i) => chipW(c.t, -4.4 + (i % 6) * 0.6, -1.35 - Math.floor(i / 6) * 0.55, { size: 11, a: c.a == null ? 1 : c.a }));
    D.rect(-0.9, -2.9, 4.9, -0.6, C['matcha-tint']); const ol = toS(2, -0.75); D.text('✓ in the set', ol[0], ol[1], { size: 11, w: 800, col: C['matcha-deep'] });
    const bl = toS(-0.75, -1.75), br = toS(4.75, -1.75); ctx.font = FONT(300, 54); ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.fillText('{', bl[0] - 4, bl[1] + 18); ctx.textAlign = 'right'; ctx.fillText('}', br[0] + 4, br[1] + 18);
    W.out.forEach((c, i) => chipW(c.t, -0.1 + (i % 8) * 0.62, -1.35 - Math.floor(i / 8) * 0.6, { size: 12, a: c.a == null ? 1 : c.a, hl: c.hl }));
    if (W.emptyNote && !W.out.length) { const p = toS(2, -1.9); D.text('nothing passed → φ', p[0], p[1], { size: 13, w: 800, col: C['ink-muted'] }); }
  },
};
/* cands: [{t, ok}] — runs every candidate through the machine */
async function runFilter(W, cands, { fast = 0.32, more = false } = {}) {
  W.cands = cands.map((c, i) => ({ ...c, x: -4.4 + i * 0.62, y: 1.6, a: 1 })); W.out = []; W.rej = []; W.more = more;
  if (W.cands.length > 8) W.cands.forEach((c, i) => { c.x = -4.4 + (i % 8) * 0.55; c.y = 1.6 + (i >= 8 ? 0.5 : 0); c.a = i < 8 ? 1 : 0; });
  for (const c of W.cands) {
    c.gone = true; W.cur = { t: c.t, x: c.x, y: c.y, s: 1 }; SFX.click();
    await tw(W.cur, { x: 1.2, y: 1.3, duration: fast * 0.6, ease: 'power1.in' });
    W.glow = 1; W.glowOk = c.ok; if (c.ok) SFX.snap(); else SFX.thud(); await wait(fast * 0.3);
    if (c.ok) { await tw(W.cur, { x: 2, y: -1.4, duration: fast * 0.5 }); W.out.push({ t: c.t, a: 1 }); } else { await tw(W.cur, { x: -3, y: -1.6, duration: fast * 0.5 }); W.rej.push({ t: c.t, a: 1 }); }
    W.glow = 0; W.cur = null; W.cands.forEach((d) => { if (!d.gone && d.a === 0 && W.cands.filter((e) => !e.gone && e.a > 0).length < 8) d.a = 1; });
  }
  W.emptyNote = true;
}

/* =============== VENN: tap regions, element tokens =============== */
const VL = {
  one: { A: [0, 0, 2.2] },
  two: { A: [-1.15, 0, 2.05], B: [1.15, 0, 2.05] },
  three: { A: [-1.05, 0.72, 1.62], B: [1.05, 0.72, 1.62], C: [0, -1.05, 1.62] },
  subset: { A: [0, 0, 2.5], B: [0.55, -0.3, 1.2] },
  disjoint: { A: [-2.1, 0, 1.6], B: [2.1, 0, 1.6] },
};
MINI.venn = {
  view: { w: 10.2, h: 6.4 },
  init(W) { Object.assign(W, { lay: 'two', names: ['A', 'B'], U: true, Ulab: 'U', toks: [], shade: {}, tap: false, p: 1, title: '', glow: null }); },
  draw(W) {
    const lay = VL[W.lay]; const keys = Object.keys(lay);
    if (W.U) { D.rect(-4.85, -2.95, 4.85, 2.95, C.panel); const p = toS(-4.85, 2.95); D.text(W.Ulab, p[0] + 10, p[1] + 20, { size: 15, w: 800, disp: true, align: 'left' }); }
    // shaded regions
    for (const r in W.shade) { const a = W.shade[r]; if (!a) continue; ctx.save(); ctx.globalAlpha = a; clipRegion(lay, keys, r); ctx.fillStyle = W.shadeCol || C.sakura; ctx.fillRect(0, 0, SW, SH); drawHatch(); ctx.restore(); }
    keys.forEach((k, i) => { const [x, y, r] = lay[k]; D.circleW(x, y, r * W.p, null, C.ink, 2.5); const lp = toS(x + (i === 2 ? 0 : (i ? 1 : -1) * r * 0.62), y + (i === 2 ? -r * 0.9 : r * 0.88)); D.text(W.names[i] || k, lp[0], lp[1], { size: 18, w: 800, disp: true, col: C.ink, stroke: C.panel }); });
    for (const t of W.toks) { chipW(t.t, t.x, t.y + (t.j || 0), { size: t.size || 12, a: t.a == null ? 1 : t.a, hl: t.hl, dim: t.dim, s: t.s == null ? 1 : t.s }); }
    if (W.title) D.text(W.title, SW / 2, SH - 8, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
function inC(c, x, y) { return Math.hypot(x - c[0], y - c[1]) < c[2]; }
function regionAt(W, x, y) { const lay = VL[W.lay]; if (W.U && (Math.abs(x) > 4.85 || Math.abs(y) > 2.95)) return null; return Object.keys(lay).map((k) => (inC(lay[k], x, y) ? '1' : '0')).join(''); }
function clipRegion(lay, keys, r) {
  const a = toS(-4.85, 2.95), b = toS(4.85, -2.95); ctx.beginPath(); ctx.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ctx.clip();
  keys.forEach((k, i) => { const [x, y, rr] = lay[k]; const p = toS(x, y); ctx.beginPath(); if (r[i] === '1') { ctx.arc(p[0], p[1], rr * sc(), 0, 7); ctx.clip(); } else { ctx.rect(0, 0, SW, SH); ctx.moveTo(p[0] + rr * sc(), p[1]); ctx.arc(p[0], p[1], rr * sc(), 0, Math.PI * 2, true); ctx.closePath(); ctx.clip('evenodd'); } });
}
function drawHatch() { ctx.strokeStyle = 'rgba(176,58,85,.45)'; ctx.lineWidth = 1.5; ctx.beginPath(); for (let x = -SH; x < SW; x += 9) { ctx.moveTo(x, SH); ctx.lineTo(x + SH, 0); } ctx.stroke(); }
/* load sets: sets = {A:[...], B:[...]}, U = [...] universe extras */
function vennLoad(W, sets, { lay, U, names, seed = 7 } = {}) {
  const keys = Object.keys(sets); W.lay = lay || (keys.length === 3 ? 'three' : keys.length === 1 ? 'one' : 'two'); W.names = names || keys; W.sets = sets;
  const lay2 = VL[W.lay]; const ks = Object.keys(lay2); const all = SET.of([...keys.flatMap((k) => sets[k]), ...(U || [])]); W.U = !!U || W.U; W.univ = U || null;
  const R = rng(seed); const placed = [];
  W.toks = all.map((v) => {
    const bits = keys.map((k) => (sets[k].includes(v) ? '1' : '0')).join(''); let best = null, bd = -1;
    for (let tries = 0; tries < 400; tries++) { const x = -4.5 + R() * 9, y = -2.6 + R() * 5.2; if (regionAt(W, x, y) !== bits) continue; let md = 9; for (const p of placed) md = Math.min(md, Math.hypot((p[0] - x) * 0.8, (p[1] - y) * 1.4)); for (const k of ks) { const c = lay2[k]; md = Math.min(md, Math.abs(Math.hypot(x - c[0], y - c[1]) - c[2]) * 2.2); } if (md > bd) { bd = md; best = [x, y]; } if (md > 1.1) break; }
    if (!best) best = [0, 0]; placed.push(best); return { t: SET.lbl(v), v, x: best[0], y: best[1], bits, a: 1, s: 1 };
  });
}
function regionsWhere(W, f) { const n = Object.keys(VL[W.lay]).length; const out = []; for (let m = 0; m < 1 << n; m++) { const bits = [...Array(n)].map((_, i) => ((m >> (n - 1 - i)) & 1 ? '1' : '0')).join(''); if (!W.U && !bits.includes('1')) continue; if (f(...bits.split('').map((b) => b === '1'))) out.push(bits); } return out; }
async function vennShade(W, regs, { only = true, hlToks = true } = {}) {
  if (only) for (const r in W.shade) if (!regs.includes(r)) gsap.to(W.shade, { [r]: 0, duration: 0.3 });
  for (const r of regs) { gsap.fromTo(W.shade, { [r]: 0 }, { [r]: 0.75, duration: 0.5 }); }
  SFX.whoosh(); if (hlToks) W.toks.forEach((t) => { const on = regs.includes(t.bits); t.hl = on ? 1 : 0; t.dim = on ? 0 : 1; if (on) gsap.fromTo(t, { s: 1.5 }, { s: 1, duration: 0.4, ease: 'back.out(3)' }); });
  await wait(0.6);
}
function vennClear(W) { W.shade = {}; W.toks.forEach((t) => { t.hl = 0; t.dim = 0; }); }
function vennTapMode(W, on = true) {
  W.userShade = new Set(); W.onTap = on ? (x, y) => { const r = regionAt(W, x, y); if (r == null) return; if (W.userShade.has(r)) { W.userShade.delete(r); gsap.to(W.shade, { [r]: 0, duration: 0.2 }); SFX.drop(); } else { W.userShade.add(r); gsap.to(W.shade, { [r]: 0.75, duration: 0.2 }); SFX.pop(); FX.ono(pickOne(['PETA!', 'BETA!', 'SHAA!']), { x: 20 + Math.random() * 60, y: 20 + Math.random() * 50, hold: 0.3 }); } buzz(8); } : null;
}
/* part factory: shade the regions of an expression */
function shadePart(q, f, { x, lay, sets = { A: [], B: [] }, names, U = true } = {}) {
  return {
    k: 'task', q, todo: 'Tap regions of the Venn diagram to shade them. Tap again to unshade.', x: x || 'That is the region.',
    pre: () => { enterScene('venn', (W) => { W.lay = lay || 'two'; W.names = names || ['A', 'B', 'C']; W.U = U; W.toks = []; }); vennTapMode(W); },
    check: (W) => { const want = regionsWhere(W, f); return want.length === W.userShade.size && want.every((r) => W.userShade.has(r)); },
    auto: (W) => { regionsWhere(W, f).forEach((r) => { W.userShade.add(r); W.shade[r] = 0.75; }); },
    reveal: (W) => { W.shadeCol = C['matcha-tint']; vennShade(W, regionsWhere(W, f)); },
    act: async () => { W.onTap = null; },
  };
}

/* =============== POWER: all subsets =============== */
MINI.power = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { els: [], cards: [], sel: -1, kimCorner: true, note: '' }); },
  draw(W) {
    const n = W.els.length; const N = W.cards.length; if (!N) return; const cols = N <= 4 ? N : N <= 8 ? 4 : 8; const rows = Math.ceil(N / cols);
    const cw = 9.4 / cols, ch = Math.min(1.1, 4.6 / rows);
    W.cards.forEach((c, i) => { const r = Math.floor(i / cols), k = i % cols; const x = -4.7 + cw * (k + 0.5), y = 1.9 - ch * (r + 0.5) - (1 - c.k) * 1.5; c.x = x; c.y = y; if (c.k <= 0) return; chipW(c.t, x, y, { a: c.k, s: c.s || 1, hl: W.sel === c.mask || c.hl, size: clamp(SW / 50, 10, 14), bg: c.bg || (c.n === 0 ? C['sora-tint'] : c.n === n ? C.peach : C.panel) }); });
    D.text(W.note || ('2^' + n + ' = ' + (1 << n) + ' subsets'), SW / 2, 22, { size: 15, w: 800, disp: true });
  },
};
function subsetLabel(els, mask) { const a = els.filter((e, i) => (mask >> i) & 1); return a.length ? '{' + a.map(SET.lbl).join(', ') + '}' : 'φ'; }
async function powerDeal(W, els, d = 0.12) {
  W.els = els; const n = els.length; const masks = [...Array(1 << n).keys()].sort((a, b) => popc(a) - popc(b) || a - b);
  W.cards = masks.map((m) => ({ mask: m, t: subsetLabel(els, m), k: 0, n: popc(m) }));
  for (const c of W.cards) { gsap.to(c, { k: 1, duration: 0.3, ease: 'back.out(2)' }); SFX.pop(); await wait(d); }
}
const popc = (m) => { let c = 0; while (m) { c += m & 1; m >>= 1; } return c; };

/* =============== NESTED: N ⊂ Z ⊂ Q ⊂ R, and T =============== */
const NEST = { R: [0, 0, 4.7, 2.85], Q: [-1.05, 0, 3.3, 2.55], Z: [-1.6, -0.1, 2.3, 1.85], N: [-2.0, -0.2, 1.25, 1.15] };
const inE = (e, x, y) => ((x - e[0]) / e[2]) ** 2 + ((y - e[1]) / e[3]) ** 2 < 1;
function nestClass(x, y) { if (inE(NEST.N, x, y)) return 'N'; if (inE(NEST.Z, x, y)) return 'Z'; if (inE(NEST.Q, x, y)) return 'Q'; if (inE(NEST.R, x, y)) return 'T'; return null; }
MINI.nested = {
  view: { w: 10, h: 6.2 },
  init(W) { Object.assign(W, { toks: [], kimCorner: false }); },
  draw(W) {
    const E = (e, fill, lab, lx) => { const p = toS(e[0], e[1]); ctx.beginPath(); ctx.ellipse(p[0], p[1], e[2] * sc(), e[3] * sc(), 0, 0, 7); ctx.fillStyle = fill; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 2.5; ctx.stroke(); const q = toS(e[0] + (lx || 0), e[1] + e[3] - 0.32); D.text(lab, q[0], q[1], { size: 14, w: 800, disp: true }); };
    E(NEST.R, C.peach, 'R  (real)'); E(NEST.Q, C['sora-tint'], 'Q (rational)', -0.4); E(NEST.Z, C['matcha-tint'], 'Z (integers)'); E(NEST.N, C.panel, 'N');
    const tp = toS(3.2, 0.9); D.text('T', tp[0], tp[1], { size: 18, w: 800, disp: true, col: C.beni }); D.text('(irrational)', tp[0], tp[1] + 16, { size: 11, w: 700, col: C.beni });
    for (const t of W.toks) chipW(t.t, t.x, t.y, { size: 13, hl: t.hl, bg: t.bad ? C.sakura : t.done ? C['matcha-tint'] : C.panel });
  },
};
function nestSetup(W, items) {
  W.toks = items.map(([t, cls], i) => ({ t, cls, x: -4.3 + i * (8.6 / Math.max(1, items.length - 1)), y: -2.6, hx: -4.3 + i * (8.6 / Math.max(1, items.length - 1)), hy: -2.6 }));
  W.drags = W.toks.map((tk) => ({ get: () => [tk.x, tk.y], r: 0.45, set: (x, y) => { tk.x = clamp(x, -4.8, 4.8); tk.y = clamp(y, -2.9, 2.9); tk.bad = false; }, end: () => { const c = nestClass(tk.x, tk.y); tk.done = c === tk.cls; tk.bad = c && c !== tk.cls; if (tk.done) { SFX.snap(); FX.ono('PITA!', { x: 50, y: 20, hold: 0.3 }); } else if (c) { SFX.boing(); } } }));
}

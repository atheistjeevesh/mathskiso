/* =========================================================
   CHAPTER 7 · BINOMIAL THEOREM — simulations
   pascal (build the triangle by tapping), terms (expansion cards assemble), poly helpers (exact expansions)
   ========================================================= */
const Cn = (n, r) => { if (r < 0 || r > n) return 0; let x = 1; for (let k = 1; k <= r; k++) x = (x * (n - r + k)) / k; return Math.round(x); };
/* polynomials in one variable x as Map(exponent → coefficient) */
const Poly = {
  mono: (c, e) => new Map([[e, c]]),
  add: (...ps) => { const m = new Map(); for (const p of ps) for (const [e, c] of p) m.set(e, (m.get(e) || 0) + c); return Poly.clean(m); },
  mul: (p, q) => { const m = new Map(); for (const [e1, c1] of p) for (const [e2, c2] of q) m.set(e1 + e2, (m.get(e1 + e2) || 0) + c1 * c2); return Poly.clean(m); },
  pow: (p, n) => { let r = new Map([[0, 1]]); for (let k = 0; k < n; k++) r = Poly.mul(r, p); return r; },
  clean: (m) => { for (const [e, c] of [...m]) if (Math.abs(c) < 1e-12) m.delete(e); return m; },
  terms: (m, desc = true) => [...m].sort((a, b) => (desc ? b[0] - a[0] : a[0] - b[0])),
  monoStr: (c, e, v = 'x') => {
    const sign = c < 0 ? '−' : '+'; const [a, b] = fracStr(Math.abs(c)).split('/'); const pw = Math.abs(e) === 1 ? v : v + supN(Math.abs(e));
    if (e === 0) return sign + ' ' + (b ? a + '/' + b : a);
    if (e > 0) return sign + ' ' + (a === '1' ? '' : a) + pw + (b ? '/' + b : '');
    return sign + ' ' + a + '/' + (b ? '(' + b + pw + ')' : pw);
  },
  str: (m, v) => Poly.terms(m).map(([e, c]) => Poly.monoStr(c, e, v)).join(' ').replace(/^\+ /, '').replace(/^− /, '−'),
};
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹', SUB = '₀₁₂₃₄₅₆₇₈₉'; const supN = (n) => String(n).split('').map((d) => SUP[+d]).join(''); const subN = (n) => String(n).split('').map((d) => SUB[+d]).join(''); const nCr = (n, r) => supN(n) + 'C' + subN(r);

/* =============== PASCAL =============== */
MINI.pascal = {
  view: { w: 10, h: 6.4 },
  init(W) { Object.assign(W, { N: 6, shown: [], hl: null, cap: '', tap: null, kimCorner: true, kimX: 0.92 }); },
  draw(W) {
    const N = W.N; const dy = 5.6 / (N + 1), dx = Math.min(1.1, 9 / (N + 1)); const fs = clamp(dy * sc() * 0.42, 9, 18);
    for (let n = 0; n <= N; n++) for (let r = 0; r <= n; r++) {
      const x = (r - n / 2) * dx, y = 2.7 - n * dy; const key = n + ',' + r; const st = W.shown[n] && W.shown[n][r];
      const p = toS(x, y); const w = dx * sc() * 0.86, hh = dy * sc() * 0.78; const hl = W.hl && W.hl(n, r);
      ctx.fillStyle = hl ? C.kin : st ? (st.fresh ? C['matcha-tint'] : C.panel) : 'transparent'; const tgt = !st && W.tapRow === n; if (tgt) { ctx.fillStyle = 'rgba(214,69,65,' + (0.12 + 0.1 * Math.sin(T * 6)) + ')'; } ctx.strokeStyle = st ? C.ink : tgt ? C.beni : C['ink-muted']; ctx.lineWidth = st ? 2 : tgt ? 2.5 : 1; ctx.setLineDash(st ? [] : [3, 3]);
      ctx.fillRect(p[0] - w / 2, p[1] - hh / 2, w, hh); ctx.strokeRect(p[0] - w / 2, p[1] - hh / 2, w, hh); ctx.setLineDash([]);
      if (tgt) D.text('?', p[0], p[1] + fs * 0.35, { size: fs, w: 800, col: C.beni });
      if (st) D.text(W.labC ? nCr(n, r) : String(Cn(n, r)), p[0], p[1] + fs * 0.35, { size: W.labC ? fs * 0.7 : fs, w: 800, disp: !W.labC, col: C.ink });
      if (W.tap && W.tap.n === n && W.tap.r === r && !st) { ctx.strokeStyle = C.beni; ctx.lineWidth = 3; ctx.strokeRect(p[0] - w / 2 - 3, p[1] - hh / 2 - 3, w + 6, hh + 6); }
    }
    for (let n = 0; n <= N; n++) { const p = toS(-(n / 2) * dx - dx * 0.8, 2.7 - n * dy); if (W.shown[n] && W.shown[n].some(Boolean)) D.text('n=' + n, p[0], p[1] + 4, { size: 10, w: 700, align: 'right', col: C['ink-muted'] }); }
    if (W.cap) D.text(W.cap, SW / 2, SH - 8, { size: 14, w: 800, disp: true, stroke: C.paper });
  },
};
function pascalShow(W, upto) { for (let n = 0; n <= upto; n++) { W.shown[n] = W.shown[n] || []; for (let r = 0; r <= n; r++) W.shown[n][r] = W.shown[n][r] || { fresh: false }; } }
async function pascalGrow(W, from, to, d = 0.05) { for (let n = from; n <= to; n++) { W.shown[n] = []; for (let r = 0; r <= n; r++) { W.shown[n][r] = { fresh: true }; SFX.tick(); await wait(d); } SFX.pop(); } }
/* the learner fills row n by tapping each empty cell; each value appears as the sum of the two above */
function pascalTapRow(W, n) {
  W.shown[n] = W.shown[n] || []; W.tapRow = n; const N = W.N, dy = 5.6 / (N + 1), dx = Math.min(1.1, 9 / (N + 1));
  W.onTap = (x, y) => { for (let r = 0; r <= n; r++) { const cx = (r - n / 2) * dx, cy = 2.7 - n * dy; if (Math.abs(x - cx) < dx / 2 && Math.abs(y - cy) < dy / 2 && !W.shown[n][r]) { W.shown[n][r] = { fresh: true }; SFX.snap(); buzz(8); FX.ono(r === 0 || r === n ? '1!' : Cn(n - 1, r - 1) + '+' + Cn(n - 1, r), { x: 40 + Math.random() * 20, y: 25, hold: 0.35 }); W.filled = (W.filled || 0) + 1; return; } } };
}

/* =============== TERMS: an expansion assembling card by card =============== */
MINI.terms = {
  view: { w: 10, h: 6 },
  init(W) { Object.assign(W, { head: '', cards: [], total: '', kimCorner: true }); },
  draw(W) {
    if (W.head) D.text(W.head, SW / 2, toS(0, 2.4)[1], { size: clamp(SW / 22, 15, 28), w: 800, disp: true });
    const n = W.cards.length; if (!n) return; const per = Math.min(n, SW < 500 ? 3 : 4); const cw = 9.4 / per, ch = Math.min(1.5, 4 / Math.ceil(n / per));
    W.cards.forEach((c, i) => { const r = Math.floor(i / per), k = i % per; const cols = Math.min(per, n - r * per); const x = (k - (cols - 1) / 2) * cw, y = 1.3 - r * (ch + 0.1) - (1 - (c.k == null ? 1 : c.k)) * 1.5; if ((c.k == null ? 1 : c.k) <= 0) return; ctx.save(); ctx.globalAlpha = c.k == null ? 1 : c.k; D.rect(x - cw / 2 + 0.08, y - ch / 2, x + cw / 2 - 0.08, y + ch / 2, c.hl ? C.kin : C.panel, C.ink, 2); const p = toS(x, y); D.text(c.top, p[0], p[1] - 4, { size: clamp(sc() * 0.24, 10, 15), w: 700, col: C['ink-muted'] }); D.text(c.val, p[0], p[1] + 16, { size: clamp(sc() * 0.32, 12, 20), w: 800, disp: true, col: c.val.startsWith('−') ? C.beni : C.ink }); ctx.restore(); });
    if (W.total) D.text(W.total, SW / 2, SH - 10, { size: clamp(SW / 40, 11, 16), w: 800, stroke: C.paper });
  },
};
async function dealTerms(W, list, d = 0.18) { W.cards = list.map(([top, val]) => ({ top, val, k: 0 })); for (const c of W.cards) { gsap.to(c, { k: 1, duration: 0.3, ease: 'back.out(2)' }); SFX.pop(); await wait(d); } }
/* cards for (p x^e1 + q x^e2)^n */
function binomCards(p, e1, q, e2, n, v = 'x') { const out = []; for (let k = 0; k <= n; k++) { const c = Cn(n, k) * p ** (n - k) * q ** k, e = e1 * (n - k) + e2 * k; out.push([nCr(n, k), Poly.monoStr(c, e, v).replace(/^\+ /, '').replace(/^− /, '−')]); } return out; }

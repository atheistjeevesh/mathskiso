/* =========================================================
   CLASS 12 · CHAPTER 3 · MATRICES — simulations
   mat : a row of matrices and operators laid out on the stage. Cells can hide ("?"), glow,
         and a tapped result cell lights up its row of A and column of B with the dot product.
   sq  : a 2×2 matrix acting on the unit square (rotation, shear, products).
   Small exact matrix helpers (numbers or Fractions as plain floats) — every answer is computed.
   ========================================================= */
const MM = {
  add: (A, B) => A.map((r, i) => r.map((v, j) => v + B[i][j])),
  sub: (A, B) => A.map((r, i) => r.map((v, j) => v - B[i][j])),
  k: (k, A) => A.map((r) => r.map((v) => k * v)),
  mul: (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, t) => s + v * B[t][j], 0))),
  T: (A) => A[0].map((_, j) => A.map((r) => r[j])),
  I: (n) => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => +(i === j))),
  pow: (A, n) => { let R = MM.I(A.length); for (let i = 0; i < n; i++) R = MM.mul(R, A); return R; },
  eq: (A, B, e = 1e-9) => A.length === B.length && A.every((r, i) => r.length === B[i].length && r.every((v, j) => Math.abs(v - B[i][j]) < e)),
  zero: (A) => A.every((r) => r.every((v) => Math.abs(v) < 1e-9)),
};
/* show a number as "−3", "5/2", "√3", "2.5" */
const SURDS = [[Math.sqrt(3), '√3'], [Math.SQRT2, '√2'], [Math.sqrt(6), '√6'], [1 / Math.SQRT2, '1/√2'], [1 / Math.sqrt(3), '1/√3'], [1 / Math.sqrt(6), '1/√6']];
function cell(v) {
  if (typeof v === 'string') return v;
  if (Math.abs(v - Math.round(v)) < 1e-9) return String(Math.round(v)).replace('-', '−');
  for (const [s, t] of SURDS) { if (Math.abs(Math.abs(v) - s) < 1e-9) return (v < 0 ? '−' : '') + t; }
  const f = fracStr(v, 300); if (Math.abs(evalExpr(f.replace('−', '-')) - v) < 1e-9) return f;
  return fmtN(v, 3);
}
const mStr = (A) => '[' + A.map((r) => r.map(cell).join(', ')).join('; ') + ']';
/* fields for every entry of a matrix (or chosen rows) */
const mFields = (A, nm = 'c', rows) => (rows || A.map((_, i) => i)).flatMap((i) => A[i].map((v, j) => ({ l: nm + '_{' + (i + 1) + (j + 1) + '}', a: v, show: cell(v) })));

MINI.mat = {
  view: { w: 12, h: 7 },
  init(W) { Object.assign(W, { items: [], trace: '', cap: '', kimCorner: true, kimX: 0.94, pulse: 0, sel: null, tapMode: null }); },
  /* item: { M, name, hide:Set('i,j') | 'all', hl:{r:Set,c:Set,cells:Set}, col, a, sub } | { op:'×' } */
  draw(W) {
    const its = W.items; if (!its.length) return;
    const fs = W.fs || 17; ctx.font = FONT(800, fs, true);
    // measure
    const lay = its.map((it) => {
      if (it.op != null) { ctx.font = FONT(800, fs + 6, true); return { w: ctx.measureText(it.op).width + 18, h: fs * 2 }; }
      const M = it.M, cw = []; ctx.font = FONT(800, fs, true);
      for (let j = 0; j < M[0].length; j++) cw[j] = Math.max(fs * 1.6, ...M.map((r) => ctx.measureText(cell(r[j])).width + fs * 0.9));
      const rh = fs * 1.75; return { cw, rh, w: cw.reduce((a, b) => a + b, 0) + 18 + (it.name ? 0 : 0), h: rh * M.length };
    });
    const nameW = its.map((it) => { if (!it.name) return 0; ctx.font = FONT(800, fs, true); return ctx.measureText(it.name + ' =').width + 10; });
    const gap = 6; let tot = lay.reduce((s, l, i) => s + l.w + nameW[i] + gap, -gap);
    const maxH = Math.max(...lay.map((l) => l.h));
    const avail = SW * (W.kimCorner === false ? 0.96 : 0.86), availH = SH * (W.trace || W.cap ? 0.66 : 0.8);
    const s = Math.min(1.25, avail / tot, availH / maxH); W._s = s;
    ctx.save(); const cx0 = (W.kimCorner === false ? SW / 2 : SW * 0.46) - (tot * s) / 2, cy = SH * (W.trace || W.cap ? 0.42 : 0.48);
    ctx.translate(cx0, cy); ctx.scale(s, s);
    let x = 0; W._cells = [];
    its.forEach((it, k) => {
      const L = lay[k]; const a = it.a == null ? 1 : it.a; ctx.globalAlpha = a;
      if (it.op != null) { D.text(it.op, x + L.w / 2, fs * 0.45, { size: fs + 6, w: 800, disp: true, col: it.col || C.ink }); x += L.w + gap; ctx.globalAlpha = 1; return; }
      if (it.name) { D.text(it.name + ' =', x, fs * 0.38, { size: fs, w: 800, disp: true, align: 'left', col: it.col || C.ink }); x += nameW[k]; }
      const M = it.M, top = -L.h / 2, x0 = x + 9; const hl = it.hl || {};
      // highlight bands
      M.forEach((r, i) => r.forEach((v, j) => {
        let cx = x0 + L.cw.slice(0, j).reduce((p, q) => p + q, 0), cyy = top + i * L.rh; const key = i + ',' + j;
        let fill = null; if (hl.r && hl.r.has(i)) fill = C['sora-tint']; if (hl.c && hl.c.has(j)) fill = hl.r && hl.r.has(i) ? C['kin-tint'] : C.sakura; if (hl.cells && hl.cells.has(key)) fill = C.kin; if (it.tone && it.tone(i, j)) fill = it.tone(i, j);
        if (!fill && it.signs) { ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = (i + j) % 2 ? C.sakura : C['matcha-tint']; ctx.fillRect(cx + 1, cyy + 2, L.cw[j] - 2, L.rh - 4); ctx.restore(); }
        if (fill) { ctx.fillStyle = fill; ctx.fillRect(cx + 1, cyy + 2, L.cw[j] - 2, L.rh - 4); }
        const hid = it.hide === 'all' || (it.hide && it.hide.has && it.hide.has(key));
        const t = hid ? '?' : cell(v); D.text(t, cx + L.cw[j] / 2, cyy + L.rh * 0.64, { size: fs, w: 800, disp: true, col: hid ? C['ink-muted'] : it.col || C.ink });
        W._cells.push({ it, i, j, x: cx0 + (cx) * s, y: cy + cyy * s, w: L.cw[j] * s, h: L.rh * s });
      }));
      // crossed-out row/column (minors) and cofactor sign chips
      if (it.cross) { ctx.save(); ctx.fillStyle = C.ink; ctx.globalAlpha = 0.16; const cw0 = L.cw.slice(0, it.cross.j).reduce((p, q) => p + q, 0); ctx.fillRect(x0, top + it.cross.i * L.rh + 2, L.cw.reduce((p, q) => p + q, 0), L.rh - 4); ctx.fillRect(x0 + cw0 + 1, top, L.cw[it.cross.j] - 2, L.h); ctx.restore(); ctx.strokeStyle = C.beni; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, top + (it.cross.i + 0.5) * L.rh); ctx.lineTo(x0 + L.cw.reduce((p, q) => p + q, 0), top + (it.cross.i + 0.5) * L.rh); ctx.moveTo(x0 + cw0 + L.cw[it.cross.j] / 2, top); ctx.lineTo(x0 + cw0 + L.cw[it.cross.j] / 2, top + L.h); ctx.stroke(); }
      if (it.signs) D.text('green +  ·  pink −', x0 + L.cw.reduce((p, q) => p + q, 0) / 2, top + L.h + 16, { size: 11, w: 700, col: C['ink-muted'] });
      // brackets (or determinant bars)
      ctx.strokeStyle = it.col || C.ink; ctx.lineWidth = 2.5; const bw = 7, xr = x0 + L.cw.reduce((p, q) => p + q, 0);
      if (it.bars) { ctx.beginPath(); ctx.moveTo(x0 - 7, top); ctx.lineTo(x0 - 7, top + L.h); ctx.moveTo(xr + 5, top); ctx.lineTo(xr + 5, top + L.h); ctx.stroke(); if (it.sub) D.text(it.sub, xr + 8, top + L.h + 4, { size: 11, w: 700, align: 'left', col: C['ink-muted'] }); x += L.w + gap; ctx.globalAlpha = 1; return; }
      ctx.beginPath(); ctx.moveTo(x0 + bw - 9, top); ctx.lineTo(x0 - 9 + 2, top); ctx.lineTo(x0 - 9 + 2, top + L.h); ctx.lineTo(x0 + bw - 9, top + L.h); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xr - bw + 7, top); ctx.lineTo(xr + 5, top); ctx.lineTo(xr + 5, top + L.h); ctx.lineTo(xr - bw + 7, top + L.h); ctx.stroke();
      if (it.sub) D.text(it.sub, xr + 8, top + L.h + 4, { size: 11, w: 700, align: 'left', col: C['ink-muted'] });
      x += L.w + gap; ctx.globalAlpha = 1;
    });
    ctx.restore();
    if (W.trace) { const ts = clamp(SW / (W.trace.length * 0.62), 11, 17); D.text(W.trace, SW * 0.46, SH * 0.84, { size: ts, w: 800, disp: true, stroke: C.paper, col: C.beni }); }
    if (W.cap) D.text(W.cap, SW * 0.46, SH * 0.1, { size: 14, w: 800, stroke: C.paper });
  },
};
/* put items on the stage: matSet(W, [{M,name}, '×', {M}, '=', {M, hide:'all'}]) */
function matSet(W, items, o = {}) { W.items = items.map((it) => (typeof it === 'string' ? { op: it } : it)); W.trace = o.trace || ''; W.cap = o.cap || ''; W.fs = o.fs; W.onTap = null; return W.items; }
const hideAll = (M) => new Set(M.flatMap((r, i) => r.map((_, j) => i + ',' + j)));
/* dot product text for c_ij of A·B */
function dotStr(A, B, i, j) { return A[i].map((v, t) => (v < 0 ? '(' + cell(v) + ')' : cell(v)) + '·' + (B[t][j] < 0 ? '(' + cell(B[t][j]) + ')' : cell(B[t][j]))).join(' + ') + ' = ' + cell(MM.mul(A, B)[i][j]); }
/* light up row i of A, column j of B and cell (i,j) of C, with the dot product */
function lightIJ(W, iA, iB, iC, i, j) {
  const A = W.items[iA], B = W.items[iB], Cc = W.items[iC];
  A.hl = { r: new Set([i]) }; B.hl = { c: new Set([j]) }; Cc.hl = { cells: new Set([i + ',' + j]) };
  W.trace = 'c' + (i + 1) + (j + 1) + ' = ' + dotStr(A.M, B.M, i, j);
}
/* tap any result cell to compute it (tactile multiplication) */
function tapToMultiply(W, iA = 0, iB = 2, iC = 4, onCell) {
  W.seen = new Set();
  W.onTap = (x, y, sx, sy) => { const c = (W._cells || []).find((c) => c.it === W.items[iC] && sx >= c.x && sx <= c.x + c.w && sy >= c.y && sy <= c.y + c.h); if (!c) return; lightIJ(W, iA, iB, iC, c.i, c.j); const it = W.items[iC]; if (it.hide && it.hide.delete) it.hide.delete(c.i + ',' + c.j); W.seen.add(c.i + ',' + c.j); SFX.snap(); buzz(8); if (onCell) onCell(c.i, c.j); };
}
/* animate the whole product cell by cell */
async function sweepMul(W, iA = 0, iB = 2, iC = 4, dt = 0.45) {
  const Cc = W.items[iC]; const M = Cc.M;
  for (let i = 0; i < M.length; i++) for (let j = 0; j < M[0].length; j++) { lightIJ(W, iA, iB, iC, i, j); if (Cc.hide && Cc.hide.delete) Cc.hide.delete(i + ',' + j); SFX.tick(); await wait(dt); }
  W.items[iA].hl = W.items[iB].hl = Cc.hl = null; W.trace = ''; SFX.chime();
}
/* reveal a hidden matrix with a pop */
async function revealM(W, idx, dt = 0.06) { const it = W.items[idx]; const M = it.M; if (!it.hide || it.hide === 'all') it.hide = hideAll(M); for (let i = 0; i < M.length; i++) for (let j = 0; j < M[0].length; j++) { it.hide.delete(i + ',' + j); SFX.tick(); await wait(dt); } SFX.pop(); }
/* a hidden-cell set for "show some, hide others" */
const hideCells = (list) => new Set(list);

/* =============== SQ: 2×2 matrix acting on the unit square =============== */
MINI.sq = {
  view: { w: 10, h: 7 },
  init(W) { MINI.plane.init(W); Object.assign(W, { A: [[1, 0], [0, 1]], tA: [[1, 0], [0, 1]], kimCorner: true, kimX: 0.95, ghost: true, label: '' }); planeView(W, -3.2, 3.2, -2.3, 2.3); },
  draw(W) {
    MINI.plane.draw(W); const A = W.A; const P = (x, y) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]];
    if (W.ghost) { const s = sq.map((p) => toS(...p)); ctx.fillStyle = C['sora-tint']; ctx.beginPath(); s.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill(); }
    const s2 = sq.map((p) => toS(...P(...p))); ctx.save(); ctx.globalAlpha = 0.55; ctx.fillStyle = C.sakura; ctx.beginPath(); s2.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill(); ctx.restore();
    ctx.strokeStyle = C.beni; ctx.lineWidth = 2.5; ctx.beginPath(); s2.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.stroke();
    D.arrowW(0, 0, ...P(1, 0), C.sora, 4, 12); D.arrowW(0, 0, ...P(0, 1), C['matcha-deep'], 4, 12);
    const e1 = toS(...P(1, 0)), e2 = toS(...P(0, 1)); D.text('col 1', e1[0] + 8, e1[1] - 8, { size: 12, w: 800, align: 'left', stroke: C.paper, col: C.sora }); D.text('col 2', e2[0] + 8, e2[1] - 8, { size: 12, w: 800, align: 'left', stroke: C.paper, col: C['matcha-deep'] });
    const t = '[' + A.map((r) => r.map((v) => fmtN(v, 2)).join('  ')).join(' ; ') + ']'; D.text((W.label ? W.label + ' = ' : '') + t, 12, 24, { size: 15, w: 800, disp: true, align: 'left', stroke: C.paper });
  },
};
const rotM = (t) => [[Math.cos(t), -Math.sin(t)], [Math.sin(t), Math.cos(t)]];
async function sqTo(W, B, d = 1) { const from = W.A.map((r) => r.slice()); const o = { t: 0 }; SFX.whoosh(); await tw(o, { t: 1, duration: d, ease: 'power2.inOut', onUpdate: () => { W.A = from.map((r, i) => r.map((v, j) => lerp(v, B[i][j], o.t))); } }); W.A = B.map((r) => r.slice()); }

/* ---------- question builders shared by the matrix chapters (3 and 4) ---------- */
const rv = async (W) => { const i = W.items.length - 1; if (W.items[i].hide) await revealM(W, i, 0.03); };
const cellAt = (W, iC, sx, sy) => (W._cells || []).find((c) => c.it === W.items[iC] && sx >= c.x && sx <= c.x + c.w && sy >= c.y && sy <= c.y + c.h);
/* light the matching cells of every matrix on stage and show a trace */
function lightSame(W, i, j, text) { W.items.forEach((it) => { if (it.M && it.M[i] && it.M[i][j] !== undefined) it.hl = { cells: new Set([i + ',' + j]) }; }); W.trace = text; }
/* generic "fill the hidden matrix" question.
   items: stage items (strings are operators); res: index of the hidden answer.
   o.mul: result = items[res-4] × items[res-2] (row × column traces). o.trace(i,j): text for a tapped cell.
   Rows in o.ask are typed; the other cells are tapped open one by one. */
function mq(ex, n, q, items, o = {}) {
  const iC = o.res != null ? o.res : items.length - 1; const R = items[iC].M;
  const all = R.flatMap((r, i) => r.map((_, j) => [i, j]));
  const ask = o.ask || (all.length <= 6 ? R.map((_, i) => i) : [0]);
  const rest = all.filter(([i]) => !ask.includes(i)).map(([i, j]) => i + ',' + j);
  const show = (W, i, j) => { if (o.mul) lightIJ(W, iC - 4, iC - 2, iC, i, j); else lightSame(W, i, j, o.trace ? o.trace(i, j) : ''); };
  const open = (W, k) => { W.items[iC].hide.delete(k); W.seen.add(k); };
  const tapPart = rest.length ? [{ k: 'task', q: o.tq || 'Tap every ? cell outside ' + (ask.length === 1 ? 'row ' + (ask[0] + 1) : 'the typed rows') + ' to work it out', todo: 'Tap the cells on the stage, then lock in.', pre: async (W) => { W.seen = new Set(); W.onTap = (x, y, sx, sy) => { const c = cellAt(W, iC, sx, sy); if (!c || ask.includes(c.i)) return; show(W, c.i, c.j); open(W, c.i + ',' + c.j); SFX.snap(); buzz(8); }; }, check: (W) => rest.every((k) => W.seen.has(k)), auto: (W) => rest.forEach((k) => open(W, k)), reveal: (W) => rest.forEach((k) => open(W, k)), x: 'Each cell is its own small sum.' }] : [];
  const nm = o.nm || (items[iC].name ? items[iC].name.toLowerCase().replace(/[^a-z]/g, '').slice(0, 1) || 'c' : 'c');
  return {
    ex, n, q, scene: 'mat', kim: o.kim,
    setup: (W) => { const its = matSet(W, items.map((it) => (typeof it === 'string' ? it : { ...it })), { fs: o.fs, cap: o.cap }); its[iC].hide = hideAll(R); },
    parts: [...(o.pre || []), ...tapPart,
      { k: 'fields', q: o.fq || (rest.length ? 'Now type row ' + ask.map((i) => i + 1).join(' and ') : 'Fill in the answer'), f: mFields(R, nm, ask), keys: o.keys, pre: async (W) => { W.onTap = null; }, x: o.x || '= ' + mStr(R) + '.', act: async (W) => { if (o.mul && !AUTO) await sweepMul(W, iC - 4, iC - 2, iC, all.length > 6 ? 0.08 : 0.3); else await revealM(W, iC, 0.04); } },
      ...(o.post || [])],
    w: o.w || [q + ': ' + mStr(R)],
  };
}
const pm = (A, B, nA = 'A', nB = 'B', o = {}) => [{ M: A, name: nA }, '×', { M: B, name: nB }, '=', { M: MM.mul(A, B), name: o.nR || '', hide: 'all' }];
const sumItems = (A, op, B, R, nA = 'A', nB = 'B') => [{ M: A, name: nA }, op, { M: B, name: nB }, '=', { M: R }];
const opTrace = (A, B, op, kA = 1, kB = 1) => (i, j) => (kA !== 1 ? kA + '·' : '') + cell(A[i][j]) + ' ' + op + ' ' + (kB !== 1 ? kB + '·' : '') + (B[i][j] < 0 ? '(' + cell(B[i][j]) + ')' : cell(B[i][j])) + ' = ' + cell(op === '+' ? kA * A[i][j] + kB * B[i][j] : kA * A[i][j] - kB * B[i][j]);
const showM = (...items) => ({ k: 'run', run: async (W) => { matSet(W, items.map((it) => (typeof it === 'string' ? it : { ...it })), {}); SFX.flip(); await wait(AUTO ? 0.05 : 0.4); } });
const boardQ = (ex, n, q, parts, w, o = {}) => ({ ex, n, q, scene: o.scene || 'board', setup: o.setup, kim: o.kim, parts, w: [w] });
const mcq = (q, o, x) => ({ k: 'mcq', q, o, a: 0, x });
/* a stage with given matrices and some quick parts */
const stageQ = (ex, n, q, items, parts, w, o = {}) => ({ ex, n, q, scene: 'mat', kim: o.kim, setup: (W) => matSet(W, items.map((it) => (typeof it === 'string' ? it : { ...it })), { fs: o.fs, cap: o.cap }), parts, w: [w] });

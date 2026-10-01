/* =========================================================
   CLASS 12 · CHAPTER 4 · DETERMINANTS — every exercise question as a sim
   Determinants, cofactors, adjoints, inverses and solutions are all computed with DT / MM.
   ========================================================= */
const S3 = Math.sqrt(3);
/* evaluate a numeric determinant: tap to expand, then type the value */
const detQ = (ex, n, q, A, o = {}) => stageQ(ex, n, q, [detIt(A, o.name || 'Δ', { signs: true })], [
  ...(o.pre || []),
  { k: 'task', q: 'Tap the entries of the row or column you will expand along', todo: 'Tap three entries in one line (zeros make it easy).', pre: async (W) => tapMinor(W, 0, A), check: (W) => [0, 1, 2].some((r) => [0, 1, 2].every((c) => W.picked.has(r + ',' + c))) || [0, 1, 2].some((c) => [0, 1, 2].every((r) => W.picked.has(r + ',' + c))), auto: (W) => [0, 1, 2].forEach((c) => W.picked.add('0,' + c)), x: 'Each tap shows the minor and cofactor.' },
  { k: 'num', q: o.nq || 'Δ = ?', a: DT.det(A), pre: async (W) => { W.onTap = null; }, x: o.x || 'Δ = ' + cell(DT.det(A)) + '.' },
  ...(o.post || []),
], o.w || 'Δ = ' + cell(DT.det(A)), { fs: o.fs });
const triQ = (ex, n, q, P, o = {}) => ({ ex, n, q, scene: 'tri', setup: (W) => { W.P = P.map((p) => p.slice()); triFit(W, P); W.showArea = false; }, parts: [...(o.pre || []), { k: 'num', q: 'Area = ½|Δ| = ?', a: triArea(P), show: cell(triArea(P)), act: async (W) => { W.showArea = true; SFX.pop(); }, x: o.x || 'Area = ' + cell(triArea(P)) + ' square units.' }], w: ['Area = ' + cell(triArea(P))] });
/* inverse of A: |A|, adj A, then A⁻¹ */
function invQ(ex, n, q, A, o = {}) {
  const d = DT.det(A), ad = clean(DT.adj(A)), iv = clean(DT.inv(A)), big = A.length === 3;
  return {
    ex, n, q, scene: 'mat', kim: o.kim,
    setup: (W) => { const its = matSet(W, [{ M: A, name: 'A', signs: big }, '→', { M: ad, name: 'adj A' }], { fs: big ? 15 : 17 }); its[2].hide = hideAll(ad); },
    parts: [
      { k: 'num', q: '|A| = ?', a: d, x: '|A| = ' + cell(d) + (d ? ' ≠ 0, so A⁻¹ exists.' : '.') },
      ...(big ? [{ k: 'task', q: 'Tap every ? of rows 2 and 3 of adj A (each is a cofactor, transposed)', todo: 'Tap the cells, then lock in.', pre: async (W) => { W.seen = new Set(); W.onTap = (x, y, sx, sy) => { const c = cellAt(W, 2, sx, sy); if (!c || c.i === 0) return; const k = c.i + ',' + c.j; W.items[2].hide.delete(k); W.seen.add(k); W.items[0].cross = { i: c.j, j: c.i }; W.trace = 'adj entry (' + (c.i + 1) + ',' + (c.j + 1) + ') = A' + (c.j + 1) + (c.i + 1) + ' = ' + cell(ad[c.i][c.j]); SFX.snap(); }; }, check: (W) => W.seen.size >= 6, auto: (W) => { for (let i = 1; i < 3; i++) for (let j = 0; j < 3; j++) { W.items[2].hide.delete(i + ',' + j); W.seen.add(i + ',' + j); } }, reveal: (W) => { W.items[2].hide = null; } }] : []),
      { k: 'fields', q: big ? 'adj A, first row (A₁₁, A₂₁, A₃₁)' : 'adj A (swap the diagonal, negate the rest)', f: mFields(ad, 'b', big ? [0] : [0, 1]), pre: async (W) => { W.onTap = null; W.items[0].cross = null; }, act: async (W) => { await revealM(W, 2, 0.03); }, x: 'adj A = ' + mStr(ad) + '.' },
      ...(o.skipInv ? [] : [{ k: 'fields', q: 'A⁻¹ = adj A / ' + cell(d) + (big ? ', first row' : ''), f: mFields(iv, 'c', big ? [0] : [0, 1]), pre: async (W) => { matSet(W, [{ M: iv, name: 'A⁻¹', hide: hideAll(iv) }], { fs: big ? 15 : 17 }); }, act: async (W) => { await revealM(W, 0, 0.03); }, x: 'A⁻¹ = ' + mStr(iv) + '.' }]),
      ...(o.post || []),
    ],
    w: [o.skipInv ? 'adj A = ' + mStr(ad) : 'A⁻¹ = ' + mStr(iv)],
  };
}
/* system by matrix method */
function sysQ(ex, n, q, A, B, o = {}) {
  const d = DT.det(A), X = DT.solve(A, B), v = ['x', 'y', 'z'];
  return {
    ex, n, q, scene: A.length === 2 ? 'lines2' : 'mat', kim: o.kim,
    setup: (W) => { if (A.length === 2) { W.eqs = A.map((r, i) => [...r, B[i]]); W.show = 2; const [x, y] = X; planeView(W, x - 6, x + 6, y - 4.5, y + 4.5); } else matSet(W, [{ M: A, name: 'A' }, '×', { M: v.map((t) => [t]) }, '=', { M: B.map((b) => [b]), name: '' }], { fs: 15 }); },
    parts: [{ k: 'num', q: '|A| = ?', a: d, x: '|A| = ' + cell(d) + ' ≠ 0: unique solution.' }, { k: 'fields', q: 'X = A⁻¹B', f: X.map((a, i) => ({ l: v[i], a, show: cell(a) })), x: v.slice(0, A.length).map((t, i) => t + ' = ' + cell(X[i])).join(', ') + '.' }, ...(o.post || [])],
    w: [v.slice(0, A.length).map((t, i) => t + ' = ' + cell(X[i])).join(', ')],
  };
}
/* consistency check */
function conQ(ex, n, q, A, B, ans, x) {
  const d = DT.det(A), aB = MM.mul(DT.adj(A), B.map((b) => [b]));
  return { ex, n, q, scene: A.length === 2 ? 'lines2' : 'mat', setup: (W) => { if (A.length === 2) { W.eqs = A.map((r, i) => [...r, B[i]]); W.show = 2; } else matSet(W, [{ M: A, name: 'A' }, ' ', { M: B.map((b) => [b]), name: 'B' }], { fs: 15 }); },
    parts: [{ k: 'num', q: '|A| = ?', a: d, x: '|A| = ' + cell(d) + '.' }, ...(Math.abs(d) < 1e-9 ? [{ k: 'mcq', q: '(adj A)B = ' + mStr(aB) + '. So (adj A)B is…', o: MM.zero(aB) ? ['= O', '≠ O'] : ['≠ O', '= O'], a: 0, x: '(adj A)B = ' + mStr(aB) + '.' }] : []), { k: 'mcq', q: 'The system is', o: [ans, ans === 'consistent' ? 'inconsistent' : 'consistent'], a: 0, x }], w: [ans] };
}

/* ===================== EXERCISE 4.1 ===================== */
const EX41 = [
  stageQ('Ex 4.1', 'Q1', 'Evaluate |2 4; −5 −1|', [detIt([[2, 4], [-5, -1]], 'Δ')], [{ k: 'num', q: '2(−1) − 4(−5) = ?', a: 18, x: '−2 + 20 = 18.' }], '18'),
  stageQ('Ex 4.1', 'Q2 (i)', 'Evaluate |cos θ −sin θ; sin θ cos θ|', [detIt([['cos θ', '−sin θ'], ['sin θ', 'cos θ']], 'Δ')], [{ k: 'num', q: 'cos²θ + sin²θ = ?', a: 1, x: 'It is a rotation: area is kept.' }], '1'),
  stageQ('Ex 4.1', 'Q2 (ii)', 'Evaluate |x² − x + 1  x − 1; x + 1  x + 1|', [detIt([['x²−x+1', 'x−1'], ['x+1', 'x+1']], 'Δ')], [{ k: 'mcq', q: '(x + 1)(x² − x + 1) − (x − 1)(x + 1) =', o: ['x³ − x² + 2', 'x³ + 1', 'x³ − x² − 2', 'x² + 2'], a: 0, x: '(x³ + 1) − (x² − 1) = x³ − x² + 2.' }, { k: 'num', q: 'Check at x = 2: (4 − 2 + 1)(3) − (1)(3) = ?', a: 6, x: '2³ − 2² + 2 = 6 ✓.' }], 'x³ − x² + 2', { fs: 15 }),
  stageQ('Ex 4.1', 'Q3', 'If A = [1 2; 4 2], show that |2A| = 4|A|', [detIt([[1, 2], [4, 2]], '|A|'), ' ', detIt([[2, 4], [8, 4]], '|2A|')], [{ k: 'fields', q: 'Evaluate both', f: [{ l: '|A|', a: -6 }, { l: '|2A|', a: -24 }], x: '−24 = 4(−6) ✓ (2² = 4 for order 2).' }], '|A| = −6, |2A| = −24 = 4|A|'),
  stageQ('Ex 4.1', 'Q4', 'If A = [1 0 1; 0 1 2; 0 0 4], show that |3A| = 27|A|', [detIt([[1, 0, 1], [0, 1, 2], [0, 0, 4]], '|A|', { signs: true })], [{ k: 'num', q: 'Expand along C₁: |A| = 1·|1 2; 0 4| = ?', a: 4, x: '|A| = 4.' }, { k: 'num', q: '|3A| = 3³|A| = ?', a: 108, x: 'Each of the 3 rows scales by 3: 27 × 4 = 108.', act: async (W) => { W.items = [detIt([[3, 0, 3], [0, 3, 6], [0, 0, 12]], '|3A|')]; SFX.pop(); } }], '|3A| = 108 = 27|A|'),
  detQ('Ex 4.1', 'Q5 (i)', 'Evaluate |3 −1 −2; 0 0 −1; 3 −5 0|', [[3, -1, -2], [0, 0, -1], [3, -5, 0]]),
  detQ('Ex 4.1', 'Q5 (ii)', 'Evaluate |3 −4 5; 1 1 −2; 2 3 1|', [[3, -4, 5], [1, 1, -2], [2, 3, 1]]),
  detQ('Ex 4.1', 'Q5 (iii)', 'Evaluate |0 1 2; −1 0 −3; −2 3 0|', [[0, 1, 2], [-1, 0, -3], [-2, 3, 0]], { x: '0: skew symmetric of odd order.' }),
  detQ('Ex 4.1', 'Q5 (iv)', 'Evaluate |2 −1 −2; 0 2 −1; 3 −5 0|', [[2, -1, -2], [0, 2, -1], [3, -5, 0]]),
  detQ('Ex 4.1', 'Q6', 'If A = [1 1 −2; 2 1 −3; 5 4 −9], find |A|', [[1, 1, -2], [2, 1, -3], [5, 4, -9]], { name: '|A|' }),
  stageQ('Ex 4.1', 'Q7 (i)', 'Find x: |2 4; 5 1| = |2x 4; 6 x|', [detIt([[2, 4], [5, 1]], ''), '=', detIt([['2x', 4], [6, 'x']], '')], [{ k: 'num', q: '−18 = 2x² − 24, positive x = ? (use √)', keys: '√', a: S3, show: '√3', x: 'x² = 3, x = ±√3.' }], 'x = ±√3'),
  stageQ('Ex 4.1', 'Q7 (ii)', 'Find x: |2 3; 4 5| = |x 3; 2x 5|', [detIt([[2, 3], [4, 5]], ''), '=', detIt([['x', 3], ['2x', 5]], '')], [{ k: 'num', q: '−2 = 5x − 6x, so x = ?', a: 2, x: 'x = 2.' }], 'x = 2'),
  stageQ('Ex 4.1', 'Q8', 'If |x 2; 18 x| = |6 2; 18 6|, then x is (A) 6 (B) ±6 (C) −6 (D) 0', [detIt([['x', 2], [18, 'x']], ''), '=', detIt([[6, 2], [18, 6]], '')], [{ k: 'num', q: 'x² − 36 = 0, so x² = ?', a: 36, x: 'x = ±6.' }, mcq('Answer', ['(B) ±6', '(A) 6', '(C) −6', '(D) 0'], 'Both signs work.')], '(B) ±6'),
];

/* ===================== EXERCISE 4.2 ===================== */
const EX42 = [
  triQ('Ex 4.2', 'Q1 (i)', 'Area of the triangle with vertices (1, 0), (6, 0), (4, 3)', [[1, 0], [6, 0], [4, 3]]),
  triQ('Ex 4.2', 'Q1 (ii)', 'Area of the triangle with vertices (2, 7), (1, 1), (10, 8)', [[2, 7], [1, 1], [10, 8]]),
  triQ('Ex 4.2', 'Q1 (iii)', 'Area of the triangle with vertices (−2, −3), (3, 2), (−1, −8)', [[-2, -3], [3, 2], [-1, -8]]),
  { ex: 'Ex 4.2', n: 'Q2', q: 'Show that A(a, b + c), B(b, c + a), C(c, a + b) are collinear', scene: 'tri', setup: (W) => { W.abc = [1, 2, 4]; const [a, b, c] = W.abc; W.P = [[a, b + c], [b, c + a], [c, a + b]]; planeView(W, -2, 8, -1, 9); }, parts: [
    { k: 'order', q: 'Order the proof', s: ['Δ = |a b+c 1; b c+a 1; c a+b 1|', 'C₂ → C₂ + C₁ gives a column of (a + b + c)', 'Take (a + b + c) out: two columns become identical (both all 1s)', 'So Δ = 0: the points are collinear'] },
    { k: 'run', run: async (W) => { for (const t of [[0, 3, 5], [-1, 2, 6], [2, 3, 5]]) { const [a, b, c] = t; W.P = [[a, b + c], [b, c + a], [c, a + b]]; SFX.tick(); await wait(AUTO ? 0.05 : 0.7); } } },
    { k: 'tf', q: 'For every a, b, c tried, the area stayed 0', a: true, x: 'All three points lie on x + y = a + b + c.' },
  ], w: ['Δ = 0, so A, B, C are collinear'] },
  { ex: 'Ex 4.2', n: 'Q3 (i)', q: 'Find k if the area is 4 sq units: (k, 0), (4, 0), (0, 2)', scene: 'tri', setup: (W) => { W.P = [[1, 0], [4, 0], [0, 2]]; planeView(W, -2, 10, -3, 5); W.drags = [{ get: () => W.P[0], r: 0.6, set: (x) => { const v = Math.round(x); if (v !== W.P[0][0]) { W.P[0] = [v, 0]; SFX.tick(); } } }]; }, parts: [
    { k: 'task', q: 'Slide (k, 0) to make the area 4', check: (W) => Math.abs(triArea(W.P) - 4) < 1e-9, auto: (W) => (W.P[0] = [8, 0]), x: '½|−2k + 8| = 4.' },
    { k: 'fields', q: 'Both values of k', f: [{ l: 'k₁', a: 0 }, { l: 'k₂', a: 8 }], x: 'k = 0 or 8.' },
  ], w: ['k = 0 or 8'] },
  { ex: 'Ex 4.2', n: 'Q3 (ii)', q: 'Find k if the area is 4 sq units: (−2, 0), (0, 4), (0, k)', scene: 'tri', setup: (W) => { W.P = [[-2, 0], [0, 4], [0, 1]]; planeView(W, -5, 5, -3, 11); W.drags = [{ get: () => W.P[2], r: 0.6, set: (x, y) => { const v = Math.round(y); if (v !== W.P[2][1]) { W.P[2] = [0, v]; SFX.tick(); } } }]; }, parts: [
    { k: 'task', q: 'Slide (0, k) to make the area 4', check: (W) => Math.abs(triArea(W.P) - 4) < 1e-9, auto: (W) => (W.P[2] = [0, 8]), x: '½|−2(4 − k)| = |k − 4| = 4.' },
    { k: 'fields', q: 'Both values of k', f: [{ l: 'k₁', a: 0 }, { l: 'k₂', a: 8 }], x: 'k = 0 or 8.' },
  ], w: ['k = 0 or 8'] },
  { ex: 'Ex 4.2', n: 'Q4 (i)', q: 'Find the equation of the line joining (1, 2) and (3, 6) using determinants', scene: 'tri', setup: (W) => { W.P = [[1, 2], [3, 6], [0, 3]]; planeView(W, -3, 7, -2, 9); triDrag(W, [2]); }, parts: [
    { k: 'task', q: 'Drag P(x, y) onto the line (area 0)', check: (W) => triArea(W.P) < 1e-9, auto: (W) => (W.P[2] = [2, 4]) },
    mcq('½|1 2 1; 3 6 1; x y 1| = 0 simplifies to', ['y = 2x', 'y = x + 1', 'y = 3x', '2y = x'], '1(6 − y) − 2(3 − x) + (3y − 6x) = 2y − 4x = 0.'),
  ], w: ['y = 2x'] },
  { ex: 'Ex 4.2', n: 'Q4 (ii)', q: 'Find the equation of the line joining (3, 1) and (9, 3) using determinants', scene: 'tri', setup: (W) => { W.P = [[3, 1], [9, 3], [2, 3]]; planeView(W, -2, 11, -2, 6); triDrag(W, [2]); }, parts: [
    { k: 'task', q: 'Drag P(x, y) onto the line (area 0)', check: (W) => triArea(W.P) < 1e-9, auto: (W) => (W.P[2] = [6, 2]) },
    mcq('The determinant condition gives', ['x − 3y = 0', 'x + 3y = 0', '3x − y = 0', 'x − y = 2'], 'Expanding: 2x − 6y = 0.'),
  ], w: ['x − 3y = 0'] },
  { ex: 'Ex 4.2', n: 'Q5', q: 'If the area of the triangle with vertices (2, −6), (5, 4), (k, 4) is 35 sq units, k is (A) 12 (B) −2 (C) −12, −2 (D) 12, −2', scene: 'tri', setup: (W) => { W.P = [[2, -6], [5, 4], [0, 4]]; planeView(W, -6, 16, -9, 8); W.drags = [{ get: () => W.P[2], r: 0.7, set: (x) => { const v = Math.round(x); if (v !== W.P[2][0]) { W.P[2] = [v, 4]; SFX.tick(); } } }]; }, parts: [
    { k: 'task', q: 'Slide (k, 4) to an area of 35', check: (W) => Math.abs(triArea(W.P) - 35) < 1e-9, auto: (W) => (W.P[2] = [12, 4]) },
    { k: 'mcq', q: '½|50 − 10k| = 35 gives', o: ['(D) k = 12 or −2', '(A) 12', '(B) −2', '(C) −12, −2'], a: 0, x: '50 − 10k = ±70.' },
  ], w: ['(D) 12, −2'] },
];

/* ===================== EXERCISE 4.3 ===================== */
const cofFields = (A, rows) => rows.flatMap((i) => A[i].map((_, j) => ({ l: 'A_{' + (i + 1) + (j + 1) + '}', a: DT.cof(A, i, j) })));
const minFields = (A, rows) => rows.flatMap((i) => A[i].map((_, j) => ({ l: 'M_{' + (i + 1) + (j + 1) + '}', a: DT.minor(A, i, j) })));
const cofQ = (n, q, A) => stageQ('Ex 4.3', n, q, [detIt(A, 'Δ', { signs: true })], [
  { k: 'task', q: 'Tap every entry to see its minor and cofactor', pre: async (W) => tapMinor(W, 0, A), check: (W) => W.picked.size >= A.length * A.length, auto: (W) => A.forEach((r, i) => r.forEach((_, j) => W.picked.add(i + ',' + j))) },
  { k: 'fields', q: 'Minors of row 1', f: minFields(A, [0]), pre: async (W) => { W.onTap = null; }, x: 'Row 1 minors: ' + A[0].map((_, j) => cell(DT.minor(A, 0, j))).join(', ') + '.' },
  { k: 'fields', q: 'Cofactors of row ' + A.length, f: cofFields(A, [A.length - 1]), x: 'Cofactors: ' + mStr(clean(DT.cofM(A))) + '.' },
], 'Minors ' + mStr(A.map((r, i) => r.map((_, j) => DT.minor(A, i, j)))) + ', cofactors ' + mStr(clean(DT.cofM(A))));
const D43 = [[5, 3, 8], [2, 0, 1], [1, 2, 3]];
const EX43 = [
  cofQ('Q1 (i)', 'Write the minors and cofactors of |2 −4; 0 3|', [[2, -4], [0, 3]]),
  stageQ('Ex 4.3', 'Q1 (ii)', 'Write the minors and cofactors of |a c; b d|', [detIt([['a', 'c'], ['b', 'd']], 'Δ', { signs: true })], [mcq('Minors M₁₁, M₁₂, M₂₁, M₂₂ are', ['d, b, c, a', 'a, b, c, d', 'd, c, b, a', 'a, c, b, d'], 'Cross out and read the leftover.'), mcq('Cofactors A₁₁, A₁₂, A₂₁, A₂₂ are', ['d, −b, −c, a', 'd, b, c, a', '−d, b, c, −a', 'a, −c, −b, d'], 'Flip signs at (1,2) and (2,1).')], 'M: d, b, c, a · A: d, −b, −c, a'),
  cofQ('Q2 (i)', 'Write the minors and cofactors of |1 0 0; 0 1 0; 0 0 1|', [[1, 0, 0], [0, 1, 0], [0, 0, 1]]),
  cofQ('Q2 (ii)', 'Write the minors and cofactors of |1 0 4; 3 5 −1; 0 1 2|', [[1, 0, 4], [3, 5, -1], [0, 1, 2]]),
  stageQ('Ex 4.3', 'Q3', 'Using cofactors of the second row, evaluate |5 3 8; 2 0 1; 1 2 3|', [detIt(D43, 'Δ', { signs: true })], [
    { k: 'fields', q: 'Cofactors of row 2', f: cofFields(D43, [1]), pre: async (W) => { tapMinor(W, 0, D43); }, x: 'A₂₁ = 7, A₂₂ = 7, A₂₃ = −7.' },
    { k: 'num', q: 'Δ = 2A₂₁ + 0·A₂₂ + 1·A₂₃ = ?', a: DT.det(D43), x: 'Δ = 14 + 0 − 7 = 7.' },
  ], 'Δ = 7'),
  stageQ('Ex 4.3', 'Q4', 'Using cofactors of the third column, evaluate |1 x yz; 1 y zx; 1 z xy|', [detIt([[1, 'x', 'yz'], [1, 'y', 'zx'], [1, 'z', 'xy']], 'Δ', { signs: true })], [
    mcq('A₁₃ = |1 y; 1 z| = ?', ['z − y', 'y − z', 'y + z', 'yz'], 'Cross out row 1, column 3.'),
    mcq('Δ = yz(z − y) − zx(z − x) + xy(y − x) factorises as', ['(x − y)(y − z)(z − x)', '(x + y)(y + z)(z + x)', 'xyz', '0'], 'Put x = y: two rows match, so (x − y) is a factor, and so on.'),
    { k: 'num', q: 'Check at x = 1, y = 2, z = 3: (x − y)(y − z)(z − x) = ?', a: (1 - 2) * (2 - 3) * (3 - 1), x: 'And the determinant |1 1 6; 1 2 3; 1 3 2| is also ' + DT.det([[1, 1, 6], [1, 2, 3], [1, 3, 2]]) + '.' },
  ], '(x − y)(y − z)(z − x)', { fs: 15 }),
  boardQ('Ex 4.3', 'Q5', 'If Aᵢⱼ is the cofactor of aᵢⱼ, then Δ = (A) a₁₁A₃₁ + a₁₂A₃₂ + a₁₃A₃₃ (B) a₁₁A₁₁ + a₁₂A₂₁ + a₁₃A₃₁ (C) a₂₁A₁₁ + a₂₂A₁₂ + a₂₃A₁₃ (D) a₁₁A₁₁ + a₂₁A₂₁ + a₃₁A₃₁', [mcq('Same line for elements and cofactors:', ['(D) column 1 with its own cofactors', '(A) row 1 with row 3’s cofactors', '(B) mixed rows and columns', '(C) row 2 with row 1’s cofactors'], '(A) and (C) give 0; (B) mixes lines.')], '(D)'),
];

/* ===================== EXERCISE 4.4 ===================== */
const a11 = (t) => [[1, 0, 0], [0, Math.cos(t), Math.sin(t)], [0, Math.sin(t), -Math.cos(t)]];
const A12 = [[3, 7], [2, 5]], B12 = [[6, 8], [7, 9]];
const A15 = [[1, 1, 1], [1, 2, -3], [2, -1, 3]], A16 = [[2, -1, 1], [-1, 2, -1], [1, -1, 2]];
const poly = (A, cs) => cs.reduce((S, c, k) => MM.add(S, MM.k(c, MM.pow(A, cs.length - 1 - k))), MM.k(0, A)); // c₀Aⁿ + … + cₙI
const EX44 = [
  invQ('Ex 4.4', 'Q1', 'Find the adjoint of [1 2; 3 4]', [[1, 2], [3, 4]], { skipInv: true }),
  invQ('Ex 4.4', 'Q2', 'Find the adjoint of [1 −1 2; 2 3 5; −2 0 1]', [[1, -1, 2], [2, 3, 5], [-2, 0, 1]], { skipInv: true }),
  stageQ('Ex 4.4', 'Q3', 'Verify A(adj A) = (adj A)A = |A| I for A = [2 3; −4 −6]', [{ M: [[2, 3], [-4, -6]], name: 'A' }, '×', { M: DT.adj([[2, 3], [-4, -6]]), name: 'adj A' }, '=', { M: [[0, 0], [0, 0]], hide: 'all' }], [
    { k: 'num', q: '|A| = −12 + 12 = ?', a: 0, x: '|A| = 0: A is singular.' },
    { k: 'fields', q: 'A(adj A)', f: mFields(MM.mul([[2, 3], [-4, -6]], DT.adj([[2, 3], [-4, -6]])), 'c'), act: rv, x: 'O = 0·I = |A| I ✓ (and (adj A)A is O too).' },
  ], 'A(adj A) = (adj A)A = O = |A| I'),
  stageQ('Ex 4.4', 'Q4', 'Verify A(adj A) = (adj A)A = |A| I for A = [1 −1 2; 3 0 −2; 1 0 3]', [{ M: [[1, -1, 2], [3, 0, -2], [1, 0, 3]], name: 'A' }, '×', { M: DT.adj([[1, -1, 2], [3, 0, -2], [1, 0, 3]]), name: 'adj A' }, '=', { M: MM.mul([[1, -1, 2], [3, 0, -2], [1, 0, 3]], DT.adj([[1, -1, 2], [3, 0, -2], [1, 0, 3]])), hide: 'all' }], [
    { k: 'num', q: '|A| = ? (expand along column 2)', a: DT.det([[1, -1, 2], [3, 0, -2], [1, 0, 3]]), x: '|A| = 11.' },
    { k: 'run', run: async (W) => { W.items[4].hide = hideAll(W.items[4].M); await sweepMul(W, 0, 2, 4, AUTO ? 0.01 : 0.15); } },
    { k: 'tf', q: 'The product is 11I = |A| I', a: MM.eq(MM.mul([[1, -1, 2], [3, 0, -2], [1, 0, 3]], DT.adj([[1, -1, 2], [3, 0, -2], [1, 0, 3]])), MM.k(11, MM.I(3))), x: 'Diagonal 11, zeros elsewhere ✓.' },
  ], 'A(adj A) = 11I', { fs: 14 }),
  invQ('Ex 4.4', 'Q5', 'Find the inverse of [2 −2; 4 3]', [[2, -2], [4, 3]]),
  invQ('Ex 4.4', 'Q6', 'Find the inverse of [−1 5; −3 2]', [[-1, 5], [-3, 2]]),
  invQ('Ex 4.4', 'Q7', 'Find the inverse of [1 2 3; 0 2 4; 0 0 5]', [[1, 2, 3], [0, 2, 4], [0, 0, 5]]),
  invQ('Ex 4.4', 'Q8', 'Find the inverse of [1 0 0; 3 3 0; 5 2 −1]', [[1, 0, 0], [3, 3, 0], [5, 2, -1]]),
  invQ('Ex 4.4', 'Q9', 'Find the inverse of [2 1 3; 4 −1 0; −7 2 1]', [[2, 1, 3], [4, -1, 0], [-7, 2, 1]]),
  invQ('Ex 4.4', 'Q10', 'Find the inverse of [1 −1 2; 0 2 −3; 3 −2 4]', [[1, -1, 2], [0, 2, -3], [3, -2, 4]]),
  stageQ('Ex 4.4', 'Q11', 'Find the inverse of [1 0 0; 0 cos α sin α; 0 sin α −cos α]', [{ M: [[1, 0, 0], [0, 'cos α', 'sin α'], [0, 'sin α', '−cos α']], name: 'A' }], [
    { k: 'num', q: '|A| = −cos²α − sin²α = ?', a: -1, x: '|A| = −1.' },
    mcq('adj A = [−1 0 0; 0 −cos α −sin α; 0 −sin α cos α], so A⁻¹ = adj A / (−1) =', ['A itself', '−A', 'Aᵀ with signs flipped', 'I'], 'A⁻¹ = [1 0 0; 0 cos α sin α; 0 sin α −cos α] = A (A is its own inverse).'),
    { k: 'tf', q: 'Live check at α = 0.7: A × A = I', a: MM.eq(MM.mul(a11(0.7), a11(0.7)), MM.I(3)), x: 'A² = I ✓.' },
  ], 'A⁻¹ = A = [1 0 0; 0 cos α sin α; 0 sin α −cos α]', { fs: 15 }),
  stageQ('Ex 4.4', 'Q12', 'A = [3 7; 2 5], B = [6 8; 7 9]. Verify (AB)⁻¹ = B⁻¹A⁻¹', [{ M: DT.inv(MM.mul(A12, B12)), name: '(AB)⁻¹', hide: 'all' }, ' ', { M: MM.mul(DT.inv(B12), DT.inv(A12)), name: 'B⁻¹A⁻¹', hide: 'all' }], [
    { k: 'fields', q: 'AB = ?', f: mFields(MM.mul(A12, B12), 'c'), x: 'AB = [67 87; 47 61].' },
    { k: 'num', q: '|AB| = ?', a: DT.det(MM.mul(A12, B12)), x: '|AB| = −2 (= |A||B| = 1 × −2).' },
    { k: 'fields', q: '(AB)⁻¹ = −½[61 −87; −47 67]', f: mFields(DT.inv(MM.mul(A12, B12)), 'd'), act: async (W) => { await revealM(W, 0); await revealM(W, 2); }, x: '(AB)⁻¹ = ' + mStr(DT.inv(MM.mul(A12, B12))) + '.' },
    { k: 'tf', q: 'B⁻¹A⁻¹ (right) is the same', a: MM.eq(DT.inv(MM.mul(A12, B12)), MM.mul(DT.inv(B12), DT.inv(A12))), x: 'Verified.' },
  ], '(AB)⁻¹ = B⁻¹A⁻¹ = ' + mStr(DT.inv(MM.mul(A12, B12))), { fs: 15 }),
  stageQ('Ex 4.4', 'Q13', 'If A = [3 1; −1 2], show A² − 5A + 7I = O and hence find A⁻¹', [{ M: poly([[3, 1], [-1, 2]], [1, -5, 7]), name: 'A²−5A+7I', hide: 'all' }], [
    { k: 'fields', q: 'A² − 5A + 7I', f: mFields(poly([[3, 1], [-1, 2]], [1, -5, 7]), 'c'), act: rv, x: 'O ✓ (A² = [8 5; −5 3]).' },
    { k: 'order', q: 'Find A⁻¹ from it', s: ['A² − 5A + 7I = O', 'Multiply by A⁻¹: A − 5I + 7A⁻¹ = O', 'A⁻¹ = (5I − A)/7', '= (1/7)[2 −1; 1 3]'] },
    { k: 'fields', q: 'A⁻¹', f: mFields(DT.inv([[3, 1], [-1, 2]]), 'b'), x: 'A⁻¹ = [2/7 −1/7; 1/7 3/7].' },
  ], 'A⁻¹ = (1/7)[2 −1; 1 3]'),
  stageQ('Ex 4.4', 'Q14', 'For A = [3 2; 1 1], find a and b such that A² + aA + bI = O', [{ M: MM.mul([[3, 2], [1, 1]], [[3, 2], [1, 1]]), name: 'A²' }, '+ a', { M: [[3, 2], [1, 1]] }, '+ b', { M: [[1, 0], [0, 1]] }, '= O'], [
    { k: 'fields', q: 'Cell (1,2): 8 + 2a = 0 · cell (1,1): 11 + 3a + b = 0', f: [{ l: 'a', a: -4 }, { l: 'b', a: 1 }], x: 'a = −4, b = 1.' },
  ], 'a = −4, b = 1'),
  stageQ('Ex 4.4', 'Q15', 'For A = [1 1 1; 1 2 −3; 2 −1 3], show A³ − 6A² + 5A + 11I = O and hence find A⁻¹', [{ M: poly(A15, [1, -6, 5, 11]), name: 'A³−6A²+5A+11I', hide: 'all' }], [
    { k: 'fields', q: 'A², first row', f: mFields(MM.mul(A15, A15), 'a', [0]), x: 'A² = ' + mStr(MM.mul(A15, A15)) + '.' },
    { k: 'fields', q: 'A³, first row', f: mFields(MM.pow(A15, 3), 'b', [0]), act: rv, x: 'A³ = ' + mStr(MM.pow(A15, 3)) + '; the combination is O ✓.' },
    mcq('Multiply by A⁻¹: A² − 6A + 5I + 11A⁻¹ = O, so A⁻¹ =', ['−(1/11)(A² − 6A + 5I)', '(1/11)(A² − 6A + 5I)', '(A² − 6A)/11', '−11(A² − 6A + 5I)'], 'Solve for A⁻¹.'),
    { k: 'fields', q: 'A⁻¹, first row', f: mFields(DT.inv(A15), 'c', [0]), x: 'A⁻¹ = ' + mStr(DT.inv(A15)) + '.' },
  ], 'A⁻¹ = (1/11)' + mStr(MM.k(11, DT.inv(A15))), { fs: 13 }),
  stageQ('Ex 4.4', 'Q16', 'If A = [2 −1 1; −1 2 −1; 1 −1 2], verify A³ − 6A² + 9A − 4I = O and hence find A⁻¹', [{ M: poly(A16, [1, -6, 9, -4]), name: 'A³−6A²+9A−4I', hide: 'all' }], [
    { k: 'fields', q: 'A², first row', f: mFields(MM.mul(A16, A16), 'a', [0]), x: 'A² = ' + mStr(MM.mul(A16, A16)) + '.' },
    { k: 'fields', q: 'A³, first row', f: mFields(MM.pow(A16, 3), 'b', [0]), act: rv, x: 'A³ = ' + mStr(MM.pow(A16, 3)) + '; the combination is O ✓.' },
    mcq('So A⁻¹ =', ['(1/4)(A² − 6A + 9I)', '(1/4)(A² + 6A − 9I)', '4(A² − 6A + 9I)', '−(1/4)(A² − 6A + 9I)'], 'A² − 6A + 9I − 4A⁻¹ = O.'),
    { k: 'fields', q: 'A⁻¹, first row', f: mFields(DT.inv(A16), 'c', [0]), x: 'A⁻¹ = ' + mStr(DT.inv(A16)) + '.' },
  ], 'A⁻¹ = (1/4)' + mStr(MM.k(4, DT.inv(A16))), { fs: 13 }),
  boardQ('Ex 4.4', 'Q17', 'If A is non-singular of order 3, |adj A| = (A) |A| (B) |A|² (C) |A|³ (D) 3|A|', [mcq('|adj A| = |A|ⁿ⁻¹ with n = 3', ['(B) |A|²', '(A) |A|', '(C) |A|³', '(D) 3|A|'], 'From A(adj A) = |A| I take determinants: |A||adj A| = |A|³.')], '(B)'),
  boardQ('Ex 4.4', 'Q18', 'If A is invertible of order 2, det(A⁻¹) = (A) det A (B) 1/det A (C) 1 (D) 0', [mcq('AA⁻¹ = I ⇒ |A||A⁻¹| = 1', ['(B) 1/det(A)', '(A) det(A)', '(C) 1', '(D) 0'], 'det(A⁻¹) = 1/det A.')], '(B)'),
];

/* ===================== EXERCISE 4.5 ===================== */
const EX45 = [
  conQ('Ex 4.5', 'Q1', 'Examine consistency: x + 2y = 2, 2x + 3y = 3', [[1, 2], [2, 3]], [2, 3], 'consistent', '|A| ≠ 0: unique solution (0, 1).'),
  conQ('Ex 4.5', 'Q2', 'Examine consistency: 2x − y = 5, x + y = 4', [[2, -1], [1, 1]], [5, 4], 'consistent', 'Unique solution (3, 1).'),
  conQ('Ex 4.5', 'Q3', 'Examine consistency: x + 3y = 5, 2x + 6y = 8', [[1, 3], [2, 6]], [5, 8], 'inconsistent', 'Parallel lines: no solution.'),
  { ex: 'Ex 4.5', n: 'Q4', q: 'Examine consistency: x + y + z = 1, 2x + 3y + 2z = 2, ax + ay + 2az = 4', scene: 'mat', setup: (W) => matSet(W, [{ M: [[1, 1, 1], [2, 3, 2], ['a', 'a', '2a']], name: 'A' }, ' ', { M: [[1], [2], [4]], name: 'B' }]), parts: [
    mcq('|A| = 1(6a − 2a) − 1(4a − 2a) + 1(2a − 3a) =', ['a', '0', '2a', '3a'], '4a − 2a − a = a.'),
    mcq('So the system is', ['consistent for every a ≠ 0', 'always inconsistent', 'consistent for every a', 'consistent only when a = 0'], 'If a = 0 the third equation reads 0 = 4: no solution.'),
    { k: 'say', who: 'jess', m: 'think', t: 'Answer-key check: the book’s answer just says “consistent”. That is true only for a ≠ 0; with a = 0 the system is inconsistent.' },
  ], w: ['Consistent for a ≠ 0 (inconsistent when a = 0)'] },
  conQ('Ex 4.5', 'Q5', 'Examine consistency: 3x − y − 2z = 2, 2y − z = −1, 3x − 5y = 3', [[3, -1, -2], [0, 2, -1], [3, -5, 0]], [2, -1, 3], 'inconsistent', '|A| = 0 but (adj A)B ≠ O.'),
  conQ('Ex 4.5', 'Q6', 'Examine consistency: 5x − y + 4z = 5, 2x + 3y + 5z = 2, 5x − 2y + 6z = −1', [[5, -1, 4], [2, 3, 5], [5, -2, 6]], [5, 2, -1], 'consistent', '|A| = 51 ≠ 0: unique solution.'),
  sysQ('Ex 4.5', 'Q7', 'Solve 5x + 2y = 4, 7x + 3y = 5', [[5, 2], [7, 3]], [4, 5]),
  sysQ('Ex 4.5', 'Q8', 'Solve 2x − y = −2, 3x + 4y = 3', [[2, -1], [3, 4]], [-2, 3]),
  sysQ('Ex 4.5', 'Q9', 'Solve 4x − 3y = 3, 3x − 5y = 7', [[4, -3], [3, -5]], [3, 7]),
  sysQ('Ex 4.5', 'Q10', 'Solve 5x + 2y = 3, 3x + 2y = 5', [[5, 2], [3, 2]], [3, 5]),
  sysQ('Ex 4.5', 'Q11', 'Solve 2x + y + z = 1, x − 2y − z = 3/2, 3y − 5z = 9', [[2, 1, 1], [1, -2, -1], [0, 3, -5]], [1, 1.5, 9]),
  sysQ('Ex 4.5', 'Q12', 'Solve x − y + z = 4, 2x + y − 3z = 0, x + y + z = 2', [[1, -1, 1], [2, 1, -3], [1, 1, 1]], [4, 0, 2]),
  sysQ('Ex 4.5', 'Q13', 'Solve 2x + 3y + 3z = 5, x − 2y + z = −4, 3x − y − 2z = 3', [[2, 3, 3], [1, -2, 1], [3, -1, -2]], [5, -4, 3]),
  sysQ('Ex 4.5', 'Q14', 'Solve x − y + 2z = 7, 3x + 4y − 5z = −5, 2x − y + 3z = 12', [[1, -1, 2], [3, 4, -5], [2, -1, 3]], [7, -5, 12]),
  { ...invQ('Ex 4.5', 'Q15', 'If A = [2 −3 5; 3 2 −4; 1 1 −2], find A⁻¹ and solve 2x − 3y + 5z = 11, 3x + 2y − 4z = −5, x + y − 2z = −3', [[2, -3, 5], [3, 2, -4], [1, 1, -2]], { post: [{ k: 'fields', q: 'X = A⁻¹[11; −5; −3]', f: DT.solve([[2, -3, 5], [3, 2, -4], [1, 1, -2]], [11, -5, -3]).map((a, i) => ({ l: 'xyz'[i], a })), x: 'x = 1, y = 2, z = 3.' }] }), w: ['A⁻¹ = ' + mStr(clean(DT.inv([[2, -3, 5], [3, 2, -4], [1, 1, -2]]))) + '; x = 1, y = 2, z = 3'] },
  sysQ('Ex 4.5', 'Q16', 'Onion, wheat, rice: 4o + 3w + 2r = 60, 2o + 4w + 6r = 90, 6o + 2w + 3r = 70. Find the cost per kg of each', [[4, 3, 2], [2, 4, 6], [6, 2, 3]], [60, 90, 70], { post: [{ k: 'say', who: 'jess', m: 'happy', t: 'Onion ₹5/kg, wheat ₹8/kg, rice ₹8/kg.' }] }),
];

/* ===================== MISCELLANEOUS ===================== */
const M3inv = [[3, -1, 1], [-15, 6, -5], [5, -2, 2]], M3B = [[1, 2, -2], [-1, 3, 0], [0, -2, 1]];
const M4 = [[1, 2, 1], [2, 3, 1], [1, 1, 5]];
const dM1 = (x, t) => DT.det([[x, Math.sin(t), Math.cos(t)], [-Math.sin(t), -x, 1], [Math.cos(t), 1, x]]);
const dM2 = (a, b) => DT.det([[Math.cos(a) * Math.cos(b), Math.cos(a) * Math.sin(b), -Math.sin(a)], [-Math.sin(b), Math.cos(b), 0], [Math.sin(a) * Math.cos(b), Math.sin(a) * Math.sin(b), Math.cos(a)]]);
const dM9 = (t) => DT.det([[1, Math.sin(t), 1], [-Math.sin(t), 1, Math.sin(t)], [-1, -Math.sin(t), 1]]);
const EX4M = [
  { ex: 'Misc', n: 'Q1', q: 'Prove that |x sin θ cos θ; −sin θ −x 1; cos θ 1 x| is independent of θ', scene: 'mat', setup: (W) => matSet(W, [detIt([['x', 'sin θ', 'cos θ'], ['−sin θ', '−x', 1], ['cos θ', 1, 'x']], 'Δ')], { fs: 15 }), parts: [
    { k: 'run', run: async (W) => { let x = 2, t = 0.4; const up = () => (W.trace = 'x = ' + x + ', θ = ' + fmtN(t, 1) + ' → Δ = ' + fmtN(dM1(x, t), 4)); slider('θ', 0, 6.2, 0.1, t, (v) => fmtN(v, 1), (v) => { t = v; up(); }, 3); slider('x', -3, 3, 1, x, (v) => 'x = ' + v, (v) => { x = v; up(); }, 2); await wait(AUTO ? 0.05 : 0.6); } },
    mcq('Expanding along R₁, Δ =', ['−x³', 'x³ + sin 2θ', '−x³ + cos θ', 'x(1 − x²)'], 'x(−x² − 1) − sin θ(−x sin θ − cos θ) + cos θ(−sin θ + x cos θ) = −x³.'),
  ], w: ['Δ = −x³, no θ in it'] },
  { ex: 'Misc', n: 'Q2', q: 'Evaluate |cos α cos β  cos α sin β  −sin α; −sin β  cos β  0; sin α cos β  sin α sin β  cos α|', scene: 'mat', setup: (W) => matSet(W, [detIt([['cos α cos β', 'cos α sin β', '−sin α'], ['−sin β', 'cos β', 0], ['sin α cos β', 'sin α sin β', 'cos α']], 'Δ')], { fs: 13 }), parts: [
    { k: 'run', run: async (W) => { W.trace = 'α = 0.5, β = 1.2 → Δ = ' + fmtN(dM2(0.5, 1.2), 6); await wait(AUTO ? 0.05 : 0.5); W.trace = 'α = 2.0, β = −0.7 → Δ = ' + fmtN(dM2(2, -0.7), 6); await wait(AUTO ? 0.05 : 0.8); } },
    { k: 'num', q: 'Δ = ?', a: 1, x: 'Expand along C₃: sin²α(…) + cos²α(…) = 1.' },
  ], w: ['Δ = 1'] },
  stageQ('Misc', 'Q3', 'If A⁻¹ = [3 −1 1; −15 6 −5; 5 −2 2] and B = [1 2 −2; −1 3 0; 0 −2 1], find (AB)⁻¹', [{ M: clean(DT.inv(M3B)), name: 'B⁻¹', hide: 'all' }, '×', { M: M3inv, name: 'A⁻¹' }, '=', { M: MM.mul(DT.inv(M3B), M3inv), hide: 'all' }], [
    mcq('(AB)⁻¹ = ?', ['B⁻¹A⁻¹', 'A⁻¹B⁻¹', 'AB', 'BA'], 'Reverse order.'),
    { k: 'num', q: '|B| = ?', a: DT.det(M3B), x: '|B| = 1(3) − 2(−1) − 2(2) = 1.' },
    { k: 'fields', q: 'B⁻¹ = adj B, first row', f: mFields(clean(DT.inv(M3B)), 'b', [0]), act: async (W) => { await revealM(W, 0, 0.03); }, x: 'B⁻¹ = ' + mStr(clean(DT.inv(M3B))) + '.' },
    { k: 'fields', q: '(AB)⁻¹ = B⁻¹A⁻¹, first row', f: mFields(MM.mul(DT.inv(M3B), M3inv), 'c', [0]), act: async (W) => { await revealM(W, 4, 0.03); }, x: '(AB)⁻¹ = ' + mStr(MM.mul(DT.inv(M3B), M3inv)) + '.' },
  ], '(AB)⁻¹ = ' + mStr(MM.mul(DT.inv(M3B), M3inv)), { fs: 14 }),
  stageQ('Misc', 'Q4', 'A = [1 2 1; 2 3 1; 1 1 5]. Verify (i) (adj A)⁻¹ = adj(A⁻¹) (ii) (A⁻¹)⁻¹ = A', [{ M: clean(DT.inv(DT.adj(M4))), name: '(adj A)⁻¹', hide: 'all' }, '=', { M: clean(DT.adj(DT.inv(M4))), name: 'adj(A⁻¹)', hide: 'all' }], [
    { k: 'num', q: '|A| = ?', a: DT.det(M4), x: '|A| = −3.' },
    { k: 'fields', q: 'adj A, first row', f: mFields(clean(DT.adj(M4)), 'b', [0]), x: 'adj A = ' + mStr(clean(DT.adj(M4))) + '.' },
    { k: 'run', run: async (W) => { await revealM(W, 0, 0.03); await revealM(W, 2, 0.03); } },
    { k: 'tf', q: '(i) both stage matrices are equal (they are A/|A| = −A/3)', a: MM.eq(DT.inv(DT.adj(M4)), DT.adj(DT.inv(M4))) && MM.eq(DT.inv(DT.adj(M4)), MM.k(1 / DT.det(M4), M4)), x: 'Verified.' },
    { k: 'tf', q: '(ii) inverting A⁻¹ gives back A', a: MM.eq(DT.inv(DT.inv(M4)), M4), x: '(A⁻¹)⁻¹ = A.' },
  ], 'Both identities hold', { fs: 14 }),
  { ex: 'Misc', n: 'Q5', q: 'Evaluate |x y x+y; y x+y x; x+y x y|', scene: 'mat', setup: (W) => matSet(W, [detIt([['x', 'y', 'x+y'], ['y', 'x+y', 'x'], ['x+y', 'x', 'y']], 'Δ')], { fs: 15 }), parts: [
    mcq('R₁ → R₁ + R₂ + R₃ pulls out 2(x + y). The answer is', ['−2(x³ + y³)', '2(x³ + y³)', '−2(x + y)³', '0'], 'Then reduce to 2(x + y)(−x² + xy − y²) = −2(x³ + y³).'),
    { k: 'num', q: 'Check at x = 1, y = 2: Δ = ?', a: DT.det([[1, 2, 3], [2, 3, 1], [3, 1, 2]]), x: '−2(1 + 8) = −18 ✓.' },
  ], w: ['−2(x³ + y³)'] },
  { ex: 'Misc', n: 'Q6', q: 'Evaluate |1 x y; 1 x+y y; 1 x x+y|', scene: 'mat', setup: (W) => matSet(W, [detIt([[1, 'x', 'y'], [1, 'x+y', 'y'], [1, 'x', 'x+y']], 'Δ')], { fs: 15 }), parts: [
    mcq('R₂ − R₁ and R₃ − R₁ give |1 x y; 0 y 0; 0 0 x|, so Δ =', ['xy', 'x + y', 'x²y', '0'], 'Expand along C₁: 1·(y·x − 0) = xy.'),
    { k: 'num', q: 'Check at x = 3, y = 4: Δ = ?', a: DT.det([[1, 3, 4], [1, 7, 4], [1, 3, 7]]), x: '3 × 4 = 12 ✓.' },
  ], w: ['xy'] },
  stageQ('Misc', 'Q7', 'Solve 2/x + 3/y + 10/z = 4, 4/x − 6/y + 5/z = 1, 6/x + 9/y − 20/z = 2', [{ M: [[2, 3, 10], [4, -6, 5], [6, 9, -20]], name: 'A' }, '×', { M: [['u'], ['v'], ['w']] }, '=', { M: [[4], [1], [2]] }], [
    { k: 'num', q: 'Put u = 1/x, v = 1/y, w = 1/z. |A| = ?', a: DT.det([[2, 3, 10], [4, -6, 5], [6, 9, -20]]), x: '|A| = 1200.' },
    { k: 'fields', q: '(u, v, w) = A⁻¹B', f: DT.solve([[2, 3, 10], [4, -6, 5], [6, 9, -20]], [4, 1, 2]).map((a, i) => ({ l: 'uvw'[i], a, show: cell(a) })), x: 'u = 1/2, v = 1/3, w = 1/5.' },
    { k: 'fields', q: 'So x, y, z', f: [{ l: 'x', a: 2 }, { l: 'y', a: 3 }, { l: 'z', a: 5 }], x: 'x = 2, y = 3, z = 5.' },
  ], 'x = 2, y = 3, z = 5'),
  boardQ('Misc', 'Q8', 'If x, y, z are non-zero, the inverse of [x 0 0; 0 y 0; 0 0 z] is (A) [x⁻¹ 0 0; 0 y⁻¹ 0; 0 0 z⁻¹] (B) xyz[x⁻¹ …] (C) (1/xyz)[x 0 0; …] (D) (1/xyz) I', [mcq('Diagonal matrices invert entry by entry:', ['(A)', '(B)', '(C)', '(D)'], '[x 0 0; 0 y 0; 0 0 z][1/x 0 0; 0 1/y 0; 0 0 1/z] = I.')], '(A)'),
  { ex: 'Misc', n: 'Q9', q: 'A = [1 sin θ 1; −sin θ 1 sin θ; −1 −sin θ 1], 0 ≤ θ ≤ 2π. Then (A) det A = 0 (B) det A ∈ (2, ∞) (C) det A ∈ (2, 4) (D) det A ∈ [2, 4]', scene: 'mat', setup: (W) => matSet(W, [detIt([[1, 'sin θ', 1], ['−sin θ', 1, 'sin θ'], [-1, '−sin θ', 1]], '|A|')], { fs: 15 }), parts: [
    { k: 'run', run: async (W) => { slider('θ', 0, 6.28, 0.01, 0, (v) => fmtN(v, 2), (v) => (W.trace = '|A| = 2 + 2 sin²θ = ' + fmtN(dM9(v), 3)), 1.57); await wait(AUTO ? 0.05 : 0.6); } },
    mcq('|A| = 2 + 2sin²θ and 0 ≤ sin²θ ≤ 1, so', ['(D) det A ∈ [2, 4]', '(C) (2, 4)', '(B) (2, ∞)', '(A) 0'], 'Both ends are reached (θ = 0 and θ = π/2).'),
  ], w: ['(D)'] },
];

const BOSS4 = [['|3 1; 2 4|', ['10', '14', '2', '−10'], 0], ['|kA| for order 3', ['k³|A|', 'k|A|', 'k²|A|', '3k|A|'], 0], ['Sign at position (2, 3)', ['−', '+', '0', 'depends'], 0], ['Collinear points ⇒ area', ['0', '1', '½', 'undefined'], 0], ['A⁻¹ exists iff', ['|A| ≠ 0', '|A| = 0', 'A = Aᵀ', 'A is 2 × 2'], 0], ['adj [a b; c d]', ['[d −b; −c a]', '[a −b; −c d]', '[d b; c a]', '[−d b; c −a]'], 0], ['|adj A| for order n', ['|A|ⁿ⁻¹', '|A|ⁿ', '|A|', 'n|A|'], 0], ['Row × other row’s cofactors', ['0', 'Δ', '1', '−Δ'], 0], ['det(A⁻¹)', ['1/det A', 'det A', '−det A', '1'], 0], ['|A| = 0 and (adj A)B ≠ O', ['inconsistent', 'unique solution', 'infinitely many', 'consistent'], 0]];
const byId = (id) => LESSONS.find((l) => l.id === id);
(() => {
  const g = (ids) => ids.map(byId);
  const [d2, d3, ar, cf, ai, sy] = g(['det2', 'det3', 'area', 'cofactor', 'adjinv', 'systems']);
  LESSONS.length = 0;
  LESSONS.push(d2, d3, exLesson({ id: 'ex41', title: 'Exercise 4.1', blurb: 'All 8: 2 × 2 and 3 × 3 determinants, find x.', face: 'kimmy-playful', qs: EX41 }), ar, exLesson({ id: 'ex42', title: 'Exercise 4.2', blurb: 'All 5: drag triangles, collinear points, lines.', face: 'jess-happy', qs: EX42 }), cf, exLesson({ id: 'ex43', title: 'Exercise 4.3', blurb: 'All 5: tap to cross out, minors and cofactors.', face: 'kimmy-curious', qs: EX43 }), ai, exLesson({ id: 'ex44', title: 'Exercise 4.4', blurb: 'All 18: adjoints, inverses, matrix polynomials.', face: 'jess-thinking', qs: EX44 }), sy, exLesson({ id: 'ex45', title: 'Exercise 4.5', blurb: 'All 16: consistency and X = A⁻¹B.', face: 'kimmy-excited', qs: EX45 }), exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 9 Miscellaneous Exercise questions.', face: 'jess-thinking', qs: EX4M }));
})();
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 4'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Cross out and conquer!'); await cont('Fight'); }, ...BOSS4.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 4'; }); await summary(['Chapter complete!', { t: 'Determinant = area scale · A⁻¹ = adj A / |A|', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

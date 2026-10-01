/* =========================================================
   CLASS 12 · CHAPTER 3 · MATRICES — every exercise question as a sim
   Every matrix answer is computed with MM (add, sub, k, mul, T) — nothing typed by hand.
   ========================================================= */
const r3 = Math.sqrt(3), PI3 = Math.PI / 3;
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
const orders = (N) => { const r = []; for (let m = 1; m <= N; m++) if (N % m === 0) r.push(m + ' × ' + N / m); return r; };

/* ===================== EXERCISE 3.1 ===================== */
const A31 = [[2, 5, 19, -7], [35, -2, 2.5, 12], [r3, 1, -5, 17]];
const build = (m, n, f) => Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => f(i + 1, j + 1)));
const EX31 = [
  stageQ('Ex 3.1', 'Q1', 'For A = [2 5 19 −7; 35 −2 5/2 12; √3 1 −5 17], find the order, the number of elements and a₁₃, a₂₁, a₃₃, a₂₄, a₂₃', [{ M: A31, name: 'A' }], [
    { k: 'fields', q: '(i) Order m × n', f: [{ l: 'rows m', a: 3 }, { l: 'columns n', a: 4 }], x: '3 × 4.' },
    { k: 'num', q: '(ii) Number of elements', a: 12, x: '3 × 4 = 12.' },
    { k: 'task', q: '(iii) Tap a₂₄ (row 2, column 4)', pre: async (W) => { W.onTap = (x, y, sx, sy) => { const c = cellAt(W, 0, sx, sy); if (!c) return; W.pick = c; W.items[0].hl = { cells: new Set([c.i + ',' + c.j]) }; W.trace = 'a' + (c.i + 1) + (c.j + 1) + ' = ' + cell(A31[c.i][c.j]); SFX.snap(); }; }, check: (W) => W.pick && W.pick.i === 1 && W.pick.j === 3, auto: (W) => { W.pick = { i: 1, j: 3 }; W.items[0].hl = { cells: new Set(['1,3']) }; W.trace = 'a24 = 12'; }, reveal: (W) => { W.items[0].hl = { cells: new Set(['1,3']) }; }, x: 'Row first, then column.' },
    { k: 'fields', q: 'Read off the elements', f: [{ l: 'a_{13}', a: 19 }, { l: 'a_{21}', a: 35 }, { l: 'a_{33}', a: -5 }, { l: 'a_{24}', a: 12 }, { l: 'a_{23}', a: 2.5, show: '5/2' }], x: 'a₁₃ = 19, a₂₁ = 35, a₃₃ = −5, a₂₄ = 12, a₂₃ = 5/2.' },
  ], 'Order 3 × 4, 12 elements; a₁₃ = 19, a₂₁ = 35, a₃₃ = −5, a₂₄ = 12, a₂₃ = 5/2'),
  boardQ('Ex 3.1', 'Q2', 'A matrix has 24 elements. What are its possible orders? What if it has 13 elements?', [
    { k: 'pick', q: '24 elements: pick every order', pool: [...orders(24), '5 × 5', '2 × 10', '3 × 9'], a: orders(24), brace: false, x: 'mn = 24: eight orders.' },
    { k: 'pick', q: '13 elements: pick every order', pool: ['1 × 13', '13 × 1', '2 × 7', '3 × 4', '13 × 13'], a: ['1 × 13', '13 × 1'], brace: false, x: '13 is prime.' },
  ], '24: 1 × 24, 24 × 1, 2 × 12, 12 × 2, 3 × 8, 8 × 3, 4 × 6, 6 × 4. 13: 1 × 13, 13 × 1'),
  boardQ('Ex 3.1', 'Q3', 'A matrix has 18 elements. What are its possible orders? What if it has 5 elements?', [
    { k: 'pick', q: '18 elements', pool: [...orders(18), '4 × 5', '3 × 5'], a: orders(18), brace: false, x: 'Factor pairs of 18.' },
    { k: 'pick', q: '5 elements', pool: ['1 × 5', '5 × 1', '2 × 3', '5 × 5'], a: ['1 × 5', '5 × 1'], brace: false, x: '5 is prime.' },
  ], '18: 1 × 18, 18 × 1, 2 × 9, 9 × 2, 3 × 6, 6 × 3. 5: 1 × 5, 5 × 1'),
  mq('Ex 3.1', 'Q4 (i)', 'Construct a 2 × 2 matrix with aᵢⱼ = (i + j)²/2', [{ M: build(2, 2, (i, j) => (i + j) ** 2 / 2), name: 'A' }], { nm: 'a', trace: (i, j) => '(' + (i + 1) + ' + ' + (j + 1) + ')²/2' }),
  mq('Ex 3.1', 'Q4 (ii)', 'Construct a 2 × 2 matrix with aᵢⱼ = i/j', [{ M: build(2, 2, (i, j) => i / j), name: 'A' }], { nm: 'a' }),
  mq('Ex 3.1', 'Q4 (iii)', 'Construct a 2 × 2 matrix with aᵢⱼ = (i + 2j)²/2', [{ M: build(2, 2, (i, j) => (i + 2 * j) ** 2 / 2), name: 'A' }], { nm: 'a' }),
  mq('Ex 3.1', 'Q5 (i)', 'Construct a 3 × 4 matrix with aᵢⱼ = ½|−3i + j|', [{ M: build(3, 4, (i, j) => Math.abs(-3 * i + j) / 2), name: 'A' }], { nm: 'a', trace: (i, j) => '½|−3·' + (i + 1) + ' + ' + (j + 1) + '| = ' + cell(Math.abs(-3 * (i + 1) + j + 1) / 2), fs: 15 }),
  mq('Ex 3.1', 'Q5 (ii)', 'Construct a 3 × 4 matrix with aᵢⱼ = 2i − j', [{ M: build(3, 4, (i, j) => 2 * i - j), name: 'A' }], { nm: 'a', trace: (i, j) => '2·' + (i + 1) + ' − ' + (j + 1) + ' = ' + (2 * (i + 1) - (j + 1)) }),
  stageQ('Ex 3.1', 'Q6 (i)', 'Find x, y, z: [4 3; x 5] = [y z; 1 5]', [{ M: [[4, 3], ['x', 5]] }, '=', { M: [['y', 'z'], [1, 5]] }], [{ k: 'fields', q: 'Match cell by cell', f: [{ l: 'x', a: 1 }, { l: 'y', a: 4 }, { l: 'z', a: 3 }], x: 'x = 1, y = 4, z = 3.' }], 'x = 1, y = 4, z = 3'),
  stageQ('Ex 3.1', 'Q6 (ii)', 'Find x, y, z: [x+y 2; 5+z xy] = [6 2; 5 8]', [{ M: [['x+y', 2], ['5+z', 'xy']] }, '=', { M: [[6, 2], [5, 8]] }], [{ k: 'num', q: '5 + z = 5, so z = ?', a: 0, x: 'z = 0.' }, mcq('x + y = 6 and xy = 8, so…', ['x = 2, y = 4 or x = 4, y = 2', 'x = 3, y = 3', 'x = 1, y = 8', 'x = 6, y = 0'], 't² − 6t + 8 = 0 gives t = 2 or 4.')], 'z = 0 and (x, y) = (2, 4) or (4, 2)'),
  stageQ('Ex 3.1', 'Q6 (iii)', 'Find x, y, z: [x+y+z; x+z; y+z] = [9; 5; 7]', [{ M: [['x+y+z'], ['x+z'], ['y+z']] }, '=', { M: [[9], [5], [7]] }], [{ k: 'fields', q: 'Subtract equations: y = 9 − 5, x = 9 − 7', f: [{ l: 'x', a: 2 }, { l: 'y', a: 4 }, { l: 'z', a: 3 }], x: 'x = 2, y = 4, z = 3.' }], 'x = 2, y = 4, z = 3'),
  stageQ('Ex 3.1', 'Q7', 'Find a, b, c, d: [a−b 2a+c; 2a−b 3c+d] = [−1 5; 0 13]', [{ M: [['a−b', '2a+c'], ['2a−b', '3c+d']] }, '=', { M: [[-1, 5], [0, 13]] }], [{ k: 'fields', q: 'a − b = −1 and 2a − b = 0 give a first', f: [{ l: 'a', a: 1 }, { l: 'b', a: 2 }, { l: 'c', a: 3 }, { l: 'd', a: 4 }], x: 'a = 1, b = 2, c = 3, d = 4.' }], 'a = 1, b = 2, c = 3, d = 4'),
  boardQ('Ex 3.1', 'Q8', 'A = [aᵢⱼ]ₘₓₙ is a square matrix if (A) m < n (B) m > n (C) m = n (D) None of these', [mcq('Answer', ['(C) m = n', '(A) m < n', '(B) m > n', '(D) None of these'], 'Square means as many rows as columns.')], '(C)'),
  stageQ('Ex 3.1', 'Q9', 'Which values of x, y make [3x+7 5; y+1 2−3x] = [0 y−2; 8 4]? (A) x = −1/3, y = 7 (B) Not possible (C) y = 7, x = −2/3 (D) x = −1/3, y = −2/3', [{ M: [['3x+7', 5], ['y+1', '2−3x']] }, '=', { M: [[0, 'y−2'], [8, 4]] }], [
    { k: 'fields', q: 'Cell (1,1) and cell (2,2) each give x', f: [{ l: 'from 3x + 7 = 0, x', a: -7 / 3, show: '−7/3' }, { l: 'from 2 − 3x = 4, x', a: -2 / 3, show: '−2/3' }], x: 'Two different values of x!' },
    mcq('So the answer is', ['(B) Not possible', '(A)', '(C)', '(D)'], 'x cannot be both −7/3 and −2/3 (and y = 7 from one cell, y = 7 from another, but x fails).'),
  ], '(B) Not possible'),
  boardQ('Ex 3.1', 'Q10', 'The number of 3 × 3 matrices with each entry 0 or 1 is (A) 27 (B) 18 (C) 81 (D) 512', [{ k: 'num', q: '9 entries, 2 choices each: 2⁹ = ?', a: 512, x: '2⁹ = 512.' }, mcq('Answer', ['(D) 512', '(A) 27', '(B) 18', '(C) 81'], '512.')], '(D) 512'),
];

/* ===================== EXERCISE 3.2 ===================== */
const qA = [[2, 4], [3, 2]], qB = [[1, 3], [-2, 5]], qC = [[-2, 5], [3, 4]];
const A4 = [[1, 2, -3], [5, 0, 2], [1, -1, 1]], B4 = [[3, -1, 2], [4, 2, 5], [2, 0, 3]], C4 = [[4, 1, 2], [0, 3, 2], [1, -2, 3]];
const A5 = [[2 / 3, 1, 5 / 3], [1 / 3, 2 / 3, 4 / 3], [7 / 3, 2, 2 / 3]], B5 = [[2 / 5, 3 / 5, 1], [1 / 5, 2 / 5, 4 / 5], [7 / 5, 6 / 5, 2 / 5]];
const solve2 = (P, Q, a, b, c, d) => { const det = a * d - b * c; return [MM.k(1 / det, MM.sub(MM.k(d, P), MM.k(b, Q))), MM.k(1 / det, MM.sub(MM.k(a, Q), MM.k(c, P)))]; }; // aX + bY = P, cX + dY = Q
const [X7a, Y7a] = solve2([[7, 0], [2, 5]], [[3, 0], [0, 3]], 1, 1, 1, -1);
const [X7b, Y7b] = solve2([[2, 3], [4, 0]], [[2, -2], [-1, 5]], 2, 3, 3, 2);
const X8 = MM.k(0.5, MM.sub([[1, 0], [-3, 2]], [[3, 2], [1, 4]]));
const A14 = [[1, 2, 3], [0, 1, 0], [1, 1, 0]], B14 = [[-1, 1, 0], [0, -1, 1], [2, 3, 4]];
const A15 = [[2, 0, 1], [2, 1, 3], [1, -1, 0]], A16 = [[1, 0, 2], [0, 2, 1], [2, 0, 3]], A17 = [[3, -2], [4, -2]];
const EX32 = [
  mq('Ex 3.2', 'Q1 (i)', 'A = [2 4; 3 2], B = [1 3; −2 5], C = [−2 5; 3 4]. Find A + B', sumItems(qA, '+', qB, MM.add(qA, qB)), { trace: opTrace(qA, qB, '+') }),
  mq('Ex 3.2', 'Q1 (ii)', 'Find A − B', sumItems(qA, '−', qB, MM.sub(qA, qB)), { trace: opTrace(qA, qB, '−') }),
  mq('Ex 3.2', 'Q1 (iii)', 'Find 3A − C', sumItems(qA, '−', qC, MM.sub(MM.k(3, qA), qC), '3A', 'C'), { trace: opTrace(qA, qC, '−', 3) }),
  mq('Ex 3.2', 'Q1 (iv)', 'Find AB', pm(qA, qB), { mul: true }),
  mq('Ex 3.2', 'Q1 (v)', 'Find BA', pm(qB, qA, 'B', 'A'), { mul: true }),
  boardQ('Ex 3.2', 'Q2 (i)', 'Compute [a b; −b a] + [a b; b a]', [mcq('Sum', ['[2a 2b; 0 2a]', '[2a 2b; 2b 2a]', '[a² b²; 0 a²]', '[0 2b; 0 2a]'], '−b + b = 0.')], '[2a 2b; 0 2a]'),
  boardQ('Ex 3.2', 'Q2 (ii)', 'Compute [a²+b² b²+c²; a²+c² a²+b²] + [2ab 2bc; −2ac −2ab]', [mcq('Sum', ['[(a+b)² (b+c)²; (a−c)² (a−b)²]', '[(a+b)² (b+c)²; (a+c)² (a−b)²]', '[(a−b)² (b−c)²; (a−c)² (a+b)²]', '[2ab 2bc; 0 0]'], 'Each cell is a perfect square.')], '[(a+b)² (b+c)²; (a−c)² (a−b)²]'),
  mq('Ex 3.2', 'Q2 (iii)', 'Compute [−1 4 −6; 8 5 16; 2 8 5] + [12 7 6; 8 0 5; 3 2 4]', sumItems([[-1, 4, -6], [8, 5, 16], [2, 8, 5]], '+', [[12, 7, 6], [8, 0, 5], [3, 2, 4]], MM.add([[-1, 4, -6], [8, 5, 16], [2, 8, 5]], [[12, 7, 6], [8, 0, 5], [3, 2, 4]]), '', ''), { trace: opTrace([[-1, 4, -6], [8, 5, 16], [2, 8, 5]], [[12, 7, 6], [8, 0, 5], [3, 2, 4]], '+'), fs: 15 }),
  stageQ('Ex 3.2', 'Q2 (iv)', 'Compute [cos²x sin²x; sin²x cos²x] + [sin²x cos²x; cos²x sin²x]', [{ M: [['cos²x', 'sin²x'], ['sin²x', 'cos²x']] }, '+', { M: [['sin²x', 'cos²x'], ['cos²x', 'sin²x']] }], [{ k: 'fields', q: 'Every cell is sin²x + cos²x', f: mFields([[1, 1], [1, 1]], 'c'), x: '[1 1; 1 1].' }], '[1 1; 1 1]', { fs: 15 }),
  boardQ('Ex 3.2', 'Q3 (i)', 'Compute [a b; −b a][a −b; b a]', [mcq('Product', ['[a²+b² 0; 0 a²+b²]', '[a²−b² 0; 0 a²−b²]', '[a²+b² 2ab; −2ab a²+b²]', '[0 a²+b²; a²+b² 0]'], 'Row 1 · column 2: −ab + ba = 0.')], '[a² + b² 0; 0 a² + b²]'),
  mq('Ex 3.2', 'Q3 (ii)', 'Compute [1; 2; 3][2 3 4]', pm([[1], [2], [3]], [[2, 3, 4]], '', ''), { mul: true }),
  mq('Ex 3.2', 'Q3 (iii)', 'Compute [1 −2; 2 3][1 2 3; 2 3 1]', pm([[1, -2], [2, 3]], [[1, 2, 3], [2, 3, 1]], '', ''), { mul: true }),
  mq('Ex 3.2', 'Q3 (iv)', 'Compute [2 3 4; 3 4 5; 4 5 6][1 −3 5; 0 2 4; 3 0 5]', pm([[2, 3, 4], [3, 4, 5], [4, 5, 6]], [[1, -3, 5], [0, 2, 4], [3, 0, 5]], '', ''), { mul: true, fs: 15 }),
  mq('Ex 3.2', 'Q3 (v)', 'Compute [2 1; 3 2; −1 1][1 0 1; −1 2 1]', pm([[2, 1], [3, 2], [-1, 1]], [[1, 0, 1], [-1, 2, 1]], '', ''), { mul: true }),
  mq('Ex 3.2', 'Q3 (vi)', 'Compute [3 −1 3; −1 0 2][2 −3; 1 0; 3 1]', pm([[3, -1, 3], [-1, 0, 2]], [[2, -3], [1, 0], [3, 1]], '', ''), { mul: true }),
  mq('Ex 3.2', 'Q4', 'A = [1 2 −3; 5 0 2; 1 −1 1], B = [3 −1 2; 4 2 5; 2 0 3], C = [4 1 2; 0 3 2; 1 −2 3]. Find A + B and B − C, and verify A + (B − C) = (A + B) − C', sumItems(A4, '+', B4, MM.add(A4, B4)), { trace: opTrace(A4, B4, '+'), fs: 14, post: [
    showM({ M: B4, name: 'B' }, '−', { M: C4, name: 'C' }, '=', { M: MM.sub(B4, C4), hide: 'all' }),
    { k: 'fields', q: 'B − C, first row', act: rv, f: mFields(MM.sub(B4, C4), 'd', [0]), x: 'B − C = ' + mStr(MM.sub(B4, C4)) + '.' },
    showM({ M: MM.add(A4, MM.sub(B4, C4)), name: 'A+(B−C)' }, '=', { M: MM.sub(MM.add(A4, B4), C4), name: '(A+B)−C' }),
    { k: 'tf', q: 'Both sides came out equal', a: MM.eq(MM.add(A4, MM.sub(B4, C4)), MM.sub(MM.add(A4, B4), C4)), x: 'Both are ' + mStr(MM.sub(MM.add(A4, B4), C4)) + '.' },
  ] }),
  mq('Ex 3.2', 'Q5', 'A = [2/3 1 5/3; 1/3 2/3 4/3; 7/3 2 2/3], B = [2/5 3/5 1; 1/5 2/5 4/5; 7/5 6/5 2/5]. Find 3A − 5B', [{ M: A5, name: '3 ×' }, '− 5 ×', { M: B5 }, '=', { M: MM.sub(MM.k(3, A5), MM.k(5, B5)) }], { fs: 14, trace: opTrace(A5, B5, '−', 3, 5), pre: [{ k: 'fields', q: '3A first row', f: mFields(MM.k(3, A5), 'a', [0]), x: '3A = [2 3 5; 1 2 4; 7 6 2], and 5B is the same!' }] }),
  boardQ('Ex 3.2', 'Q6', 'Simplify cos θ [cos θ sin θ; −sin θ cos θ] + sin θ [sin θ −cos θ; cos θ sin θ]', [mcq('Diagonal: cos²θ + sin²θ; off-diagonal: cos θ sin θ − sin θ cos θ. Result', ['I = [1 0; 0 1]', 'O', '[cos 2θ 0; 0 cos 2θ]', '[1 1; 1 1]'], 'The identity matrix.')], 'I'),
  mq('Ex 3.2', 'Q7 (i)', 'Find X and Y if X + Y = [7 0; 2 5] and X − Y = [3 0; 0 3]', [{ M: X7a, name: 'X' }, ' ', { M: Y7a, name: 'Y', hide: 'all' }], { res: 0, nm: 'x', cap: 'add: 2X = [10 0; 2 8] · subtract: 2Y = [4 0; 2 2]', post: [{ k: 'fields', q: 'Now Y', f: mFields(Y7a, 'y'), x: 'Y = ' + mStr(Y7a) + '.', act: async (W) => { W.items[2].hide = null; SFX.pop(); } }], w: ['X = ' + mStr(X7a) + ', Y = ' + mStr(Y7a)] }),
  mq('Ex 3.2', 'Q7 (ii)', 'Find X and Y if 2X + 3Y = [2 3; 4 0] and 3X + 2Y = [2 −2; −1 5]', [{ M: X7b, name: 'X' }, ' ', { M: Y7b, name: 'Y', hide: 'all' }], { res: 0, nm: 'x', cap: '3(first) − 2(second): 5Y = …  ·  3(second) − 2(first): 5X = …', post: [{ k: 'fields', q: 'Now Y', f: mFields(Y7b, 'y'), x: 'Y = ' + mStr(Y7b) + '.', act: async (W) => { W.items[2].hide = null; SFX.pop(); } }], w: ['X = ' + mStr(X7b) + ', Y = ' + mStr(Y7b)] }),
  mq('Ex 3.2', 'Q8', 'Find X if Y = [3 2; 1 4] and 2X + Y = [1 0; −3 2]', [{ M: X8, name: 'X' }], { nm: 'x', cap: '2X = [1 0; −3 2] − [3 2; 1 4]' }),
  stageQ('Ex 3.2', 'Q9', 'Find x and y if 2[1 3; 0 x] + [y 0; 1 2] = [5 6; 1 8]', [{ M: [[1, 3], [0, 'x']], name: '2 ×' }, '+', { M: [['y', 0], [1, 2]] }, '=', { M: [[5, 6], [1, 8]] }], [{ k: 'fields', q: '2 + y = 5 and 2x + 2 = 8', f: [{ l: 'x', a: 3 }, { l: 'y', a: 3 }], x: 'x = 3, y = 3.' }], 'x = 3, y = 3'),
  stageQ('Ex 3.2', 'Q10', 'Solve 2[x z; y t] + 3[1 −1; 0 2] = 3[3 5; 4 6] for x, y, z, t', [{ M: [['x', 'z'], ['y', 't']], name: '2 ×' }, '+ 3 ×', { M: [[1, -1], [0, 2]] }, '= 3 ×', { M: [[3, 5], [4, 6]] }], [{ k: 'fields', q: '2x + 3 = 9, 2z − 3 = 15, 2y = 12, 2t + 6 = 18', f: [{ l: 'x', a: 3 }, { l: 'y', a: 6 }, { l: 'z', a: 9 }, { l: 't', a: 6 }], x: 'x = 3, y = 6, z = 9, t = 6.' }], 'x = 3, y = 6, z = 9, t = 6'),
  stageQ('Ex 3.2', 'Q11', 'If x[2; 3] + y[−1; 1] = [10; 5], find x and y', [{ M: [[2], [3]], name: 'x' }, '+ y', { M: [[-1], [1]] }, '=', { M: [[10], [5]] }], [{ k: 'fields', q: '2x − y = 10 and 3x + y = 5', f: [{ l: 'x', a: 3 }, { l: 'y', a: -4 }], x: 'Add: 5x = 15, so x = 3, y = −4.' }], 'x = 3, y = −4'),
  stageQ('Ex 3.2', 'Q12', 'Given 3[x y; z w] = [x 6; −1 2w] + [4 x+y; z+w 3], find x, y, z, w', [{ M: [['3x', '3y'], ['3z', '3w']] }, '=', { M: [['x+4', '6+x+y'], ['−1+z+w', '2w+3']] }], [{ k: 'fields', q: 'Solve the four cell equations', f: [{ l: 'x', a: 2 }, { l: 'y', a: 4 }, { l: 'z', a: 1 }, { l: 'w', a: 3 }], x: '3x = x + 4 → x = 2; 3y = 6 + x + y → y = 4; 3w = 2w + 3 → w = 3; 3z = −1 + z + w → z = 1.' }], 'x = 2, y = 4, z = 1, w = 3', { fs: 15 }),
  boardQ('Ex 3.2', 'Q13', 'If F(x) = [cos x −sin x 0; sin x cos x 0; 0 0 1], show that F(x)F(y) = F(x + y)', [
    { k: 'run', run: async () => { enterScene('sq', (W) => { W.label = 'F(x)'; }); await sqTo(W, rotM(0.5), AUTO ? 0.05 : 0.8); W.label = 'F(x)F(y)'; await sqTo(W, MM.mul(rotM(0.5), rotM(0.7)), AUTO ? 0.05 : 0.8); } },
    mcq('Entry (1,1) of F(x)F(y) is cos x cos y − sin x sin y =', ['cos(x + y)', 'sin(x + y)', 'cos(x − y)', '1'], 'Each entry is an angle-sum formula, so the product is F(x + y): a turn by x then by y.'),
  ], 'F(x)F(y) = F(x + y)'),
  mq('Ex 3.2', 'Q14 (i)', 'Show that [5 −1; 6 7][2 1; 3 4] ≠ [2 1; 3 4][5 −1; 6 7]', pm([[5, -1], [6, 7]], [[2, 1], [3, 4]], '', ''), { mul: true, post: [showM(...pm([[2, 1], [3, 4]], [[5, -1], [6, 7]], '', '')), { k: 'fields', q: 'The other order', act: rv, f: mFields(MM.mul([[2, 1], [3, 4]], [[5, -1], [6, 7]]), 'd'), x: 'Different from the first product.' }] }),
  mq('Ex 3.2', 'Q14 (ii)', 'Show that [1 2 3; 0 1 0; 1 1 0][−1 1 0; 0 −1 1; 2 3 4] ≠ [−1 1 0; 0 −1 1; 2 3 4][1 2 3; 0 1 0; 1 1 0]', pm(A14, B14, '', ''), { mul: true, fs: 14, post: [showM(...pm(B14, A14, '', '')), { k: 'tf', q: 'The reverse product [−1 1 −3; −1 0 0; 9 11 6] is the same', act: rv, a: MM.eq(MM.mul(A14, B14), MM.mul(B14, A14)), x: 'Not equal: AB ≠ BA.' }] }),
  stageQ('Ex 3.2', 'Q15', 'Find A² − 5A + 6I if A = [2 0 1; 2 1 3; 1 −1 0]', pm(A15, A15, 'A', 'A'), [
    { k: 'fields', q: 'A², first row', act: rv, f: mFields(MM.mul(A15, A15), 'a', [0]), x: 'A² = ' + mStr(MM.mul(A15, A15)) + '.' },
    showM({ M: MM.mul(A15, A15), name: 'A²' }, '− 5A + 6I =', { M: MM.add(MM.sub(MM.mul(A15, A15), MM.k(5, A15)), MM.k(6, MM.I(3))), hide: 'all' }),
    { k: 'fields', q: 'Result, first row: 5 − 10 + 6, −1 − 0, 2 − 5', act: rv, f: mFields(MM.add(MM.sub(MM.mul(A15, A15), MM.k(5, A15)), MM.k(6, MM.I(3))), 'c', [0]), x: '= ' + mStr(MM.add(MM.sub(MM.mul(A15, A15), MM.k(5, A15)), MM.k(6, MM.I(3)))) + '.' },
  ], 'A² − 5A + 6I = ' + mStr(MM.add(MM.sub(MM.mul(A15, A15), MM.k(5, A15)), MM.k(6, MM.I(3)))), { fs: 14 }),
  stageQ('Ex 3.2', 'Q16', 'If A = [1 0 2; 0 2 1; 2 0 3], prove that A³ − 6A² + 7A + 2I = O', pm(A16, A16, 'A', 'A'), [
    { k: 'fields', q: 'A², first row', act: rv, f: mFields(MM.mul(A16, A16), 'a', [0]), x: 'A² = ' + mStr(MM.mul(A16, A16)) + '.' },
    showM(...pm(A16, MM.mul(A16, A16), 'A', 'A²')),
    { k: 'fields', q: 'A³, first row', act: rv, f: mFields(MM.pow(A16, 3), 'b', [0]), x: 'A³ = ' + mStr(MM.pow(A16, 3)) + '.' },
    showM({ M: MM.add(MM.add(MM.sub(MM.pow(A16, 3), MM.k(6, MM.mul(A16, A16))), MM.k(7, A16)), MM.k(2, MM.I(3))), name: 'A³−6A²+7A+2I' }),
    { k: 'tf', q: 'The result is the zero matrix', a: MM.zero(MM.add(MM.add(MM.sub(MM.pow(A16, 3), MM.k(6, MM.mul(A16, A16))), MM.k(7, A16)), MM.k(2, MM.I(3)))), x: 'Every cell cancels: proved.' },
  ], 'A³ − 6A² + 7A + 2I = O', { fs: 14 }),
  stageQ('Ex 3.2', 'Q17', 'If A = [3 −2; 4 −2] and I = [1 0; 0 1], find k so that A² = kA − 2I', pm(A17, A17, 'A', 'A'), [
    { k: 'fields', q: 'A²', act: rv, f: mFields(MM.mul(A17, A17), 'a'), x: 'A² = [1 −2; 4 −4].' },
    { k: 'num', q: 'kA − 2I = [3k−2 −2k; 4k −2k−2]. Match: k = ?', a: 1, x: 'k = 1 works in all four cells.' },
  ], 'k = 1'),
  stageQ('Ex 3.2', 'Q18', 'If A = [0 −tan(α/2); tan(α/2) 0], show that I + A = (I − A)[cos α −sin α; sin α cos α]', [{ M: [[1, -1 / r3], [1 / r3, 1]], name: 'I + A' }, ' ', { M: MM.mul([[1, 1 / r3], [-1 / r3, 1]], rotM(PI3)), name: '(I−A)R' }], [
    mcq('Put t = tan(α/2). Then cos α and sin α are', ['(1 − t²)/(1 + t²) and 2t/(1 + t²)', '(1 + t²)/(1 − t²) and 2t', '1 − t² and 2t', 't and 1/t'], 'The half-angle (t) formulas.'),
    mcq('(I − A)R, entry (1,1) = cos α + t sin α = (1 − t² + 2t²)/(1 + t²) =', ['1', 't', '0', 'cos α'], 'The other cells give −t, t, 1: exactly I + A.'),
    { k: 'tf', q: 'Live check at α = π/3: both stage matrices match', a: true, x: 'Both are [1 −1/√3; 1/√3 1].' },
  ], 'I + A = (I − A)[cos α −sin α; sin α cos α]', { cap: 'check at α = π/3, tan(α/2) = 1/√3' }),
  stageQ('Ex 3.2', 'Q19', 'A trust fund has ₹30000 to invest in two bonds paying 5% and 7%. How should it be split to earn (a) ₹1800 (b) ₹2000?', [{ M: [['x', '30000−x']], name: '' }, '×', { M: [[0.05], [0.07]] }, '=', { M: [['interest']] }], [
    { k: 'fields', q: '(a) 0.05x + 0.07(30000 − x) = 1800', f: [{ l: 'at 5%', a: 15000, pre: '₹' }, { l: 'at 7%', a: 15000, pre: '₹' }], x: '2100 − 0.02x = 1800 gives x = 15000.' },
    { k: 'fields', q: '(b) interest ₹2000', f: [{ l: 'at 5%', a: 5000, pre: '₹' }, { l: 'at 7%', a: 25000, pre: '₹' }], x: '2100 − 0.02x = 2000 gives x = 5000.' },
  ], '(a) ₹15000 each (b) ₹5000 at 5%, ₹25000 at 7%', { fs: 15 }),
  mq('Ex 3.2', 'Q20', 'A bookshop has 10 dozen chemistry, 8 dozen physics and 10 dozen economics books at ₹80, ₹60, ₹40 each. Find the total received', pm([[120, 96, 120]], [[80], [60], [40]], 'books', '₹'), { mul: true, x: '9600 + 5760 + 4800 = ₹20160.' }),
  boardQ('Ex 3.2', 'Q21', 'X, Y, Z, W, P have orders 2 × n, 3 × k, 2 × p, n × 3, p × k. PY + WY is defined when (A) k = 3, p = n (B) k arbitrary, p = 2 (C) p arbitrary, k = 3 (D) k = 2, p = 3', [
    mcq('PY is (p × k)(3 × k): it needs k =', ['3', '2', 'p', 'n'], 'Columns of P = rows of Y.'),
    mcq('PY is p × k and WY is n × k. Adding them needs', ['p = n', 'p = k', 'n = 3', 'nothing'], 'Same order.'),
    mcq('Answer', ['(A) k = 3, p = n', '(B)', '(C)', '(D)'], '(A).'),
  ], '(A)'),
  boardQ('Ex 3.2', 'Q22', 'If n = p, the order of 7X − 5Z is (A) p × 2 (B) 2 × n (C) n × 3 (D) p × n', [mcq('X is 2 × n and Z is 2 × p = 2 × n. So 7X − 5Z is', ['(B) 2 × n', '(A) p × 2', '(C) n × 3', '(D) p × n'], 'Scaling keeps the order.')], '(B) 2 × n'),
];

/* ===================== EXERCISE 3.3 (+ 3.4) ===================== */
const A2_3 = [[-1, 2, 3], [5, 7, 9], [-2, 1, 1]], B2_3 = [[-4, 1, -5], [1, 2, 0], [1, 3, 1]];
const A3_3 = MM.T([[3, 4], [-1, 2], [0, 1]]), B3_3 = [[-1, 2, 1], [1, 2, 3]];
const A4_3 = MM.T([[-2, 3], [1, 2]]), B4_3 = [[-1, 0], [1, 2]];
const symQ = (n, A) => { const P = MM.k(0.5, MM.add(A, MM.T(A))), Q = MM.k(0.5, MM.sub(A, MM.T(A))); return mq('Ex 3.3', n, 'Express ' + mStr(A) + ' as the sum of a symmetric and a skew symmetric matrix', [{ M: A, name: 'A' }, '=', { M: P, name: '' }, '+', { M: Q, hide: 'all' }], { res: 2, nm: 'p', ask: A.length === 2 ? [0, 1] : [0], fq: A.length === 2 ? 'P = ½(A + A′)' : 'P = ½(A + A′), first row', trace: (i, j) => '½(' + cell(A[i][j]) + ' + ' + cell(A[j][i]) + ') = ' + cell(P[i][j]), post: [{ k: 'fields', q: 'Q = ½(A − A′), first row', f: mFields(Q, 'q', [0]), x: 'Q = ' + mStr(Q) + ' (zero diagonal).', act: async (W) => { await revealM(W, 4, 0.04); } }], w: ['P = ' + mStr(P) + ', Q = ' + mStr(Q)] }); };
const EX33 = [
  mq('Ex 3.3', 'Q1 (i)', 'Find the transpose of [5; 1/2; −1]', [{ M: [[5], [0.5], [-1]] }, '→', { M: [[5, 0.5, -1]], name: '' }], { nm: 'a' }),
  mq('Ex 3.3', 'Q1 (ii)', 'Find the transpose of [1 −1; 2 3]', [{ M: [[1, -1], [2, 3]] }, '→', { M: [[1, 2], [-1, 3]] }], { nm: 'a' }),
  mq('Ex 3.3', 'Q1 (iii)', 'Find the transpose of [−1 5 6; √3 5 6; 2 3 −1]', [{ M: [[-1, 5, 6], [r3, 5, 6], [2, 3, -1]] }, '→', { M: MM.T([[-1, 5, 6], [r3, 5, 6], [2, 3, -1]]) }], { nm: 'a', keys: '√', trace: (i, j) => 'row ' + (j + 1) + ' → column ' + (j + 1) }),
  mq('Ex 3.3', 'Q2 (i)', 'A = [−1 2 3; 5 7 9; −2 1 1], B = [−4 1 −5; 1 2 0; 1 3 1]. Verify (A + B)′ = A′ + B′', [{ M: MM.T(MM.add(A2_3, B2_3)), name: '(A+B)′' }, '=', { M: MM.add(MM.T(A2_3), MM.T(B2_3)), name: 'A′+B′', hide: 'all' }], { res: 0, fs: 14, ask: [0], nm: 'c', fq: '(A + B)′, first row (the first column of A + B)', post: [{ k: 'tf', pre: async (W) => revealM(W, 2, 0.03), q: 'A′ + B′ (right) matches cell for cell', a: MM.eq(MM.T(MM.add(A2_3, B2_3)), MM.add(MM.T(A2_3), MM.T(B2_3))), x: 'Verified.' }] }),
  mq('Ex 3.3', 'Q2 (ii)', 'Same A, B. Verify (A − B)′ = A′ − B′', [{ M: MM.T(MM.sub(A2_3, B2_3)), name: '(A−B)′' }, '=', { M: MM.sub(MM.T(A2_3), MM.T(B2_3)), name: 'A′−B′', hide: 'all' }], { res: 0, fs: 14, ask: [0], nm: 'c', fq: '(A − B)′, first row', post: [{ k: 'tf', pre: async (W) => revealM(W, 2, 0.03), q: 'A′ − B′ matches', a: true, x: 'Verified.' }] }),
  mq('Ex 3.3', 'Q3 (i)', 'A′ = [3 4; −1 2; 0 1], B = [−1 2 1; 1 2 3]. Verify (A + B)′ = A′ + B′', [{ M: MM.T(MM.add(A3_3, B3_3)), name: '(A+B)′' }, '=', { M: MM.add(MM.T(A3_3), MM.T(B3_3)), name: 'A′+B′', hide: 'all' }], { res: 0, nm: 'c', pre: [{ k: 'mcq', q: 'First, A = (A′)′ =', o: ['[3 −1 0; 4 2 1]', '[3 4; −1 2; 0 1]', '[4 3; 2 −1; 1 0]', '[0 −1 3; 1 2 4]'], a: 0, x: 'Rows of A′ become columns.' }], post: [{ k: 'tf', pre: async (W) => revealM(W, 2, 0.03), q: 'A′ + B′ matches', a: true, x: 'Verified.' }] }),
  mq('Ex 3.3', 'Q3 (ii)', 'Same A, B. Verify (A − B)′ = A′ − B′', [{ M: MM.T(MM.sub(A3_3, B3_3)), name: '(A−B)′' }, '=', { M: MM.sub(MM.T(A3_3), MM.T(B3_3)), name: 'A′−B′', hide: 'all' }], { res: 0, nm: 'c', post: [{ k: 'tf', pre: async (W) => revealM(W, 2, 0.03), q: 'A′ − B′ matches', a: true, x: 'Verified.' }] }),
  mq('Ex 3.3', 'Q4', 'If A′ = [−2 3; 1 2] and B = [−1 0; 1 2], find (A + 2B)′', [{ M: MM.T(MM.add(A4_3, MM.k(2, B4_3))), name: '(A+2B)′' }], { nm: 'c', cap: 'A = [−2 1; 3 2], 2B = [−2 0; 2 4]' }),
  mq('Ex 3.3', 'Q5 (i)', 'Verify (AB)′ = B′A′ for A = [1; −4; 3], B = [−1 2 1]', pm(MM.T([[-1, 2, 1]]), MM.T([[1], [-4], [3]]), 'B′', 'A′'), { mul: true, post: [{ k: 'tf', q: 'This equals the transpose of AB', a: MM.eq(MM.T(MM.mul([[1], [-4], [3]], [[-1, 2, 1]])), MM.mul(MM.T([[-1, 2, 1]]), MM.T([[1], [-4], [3]]))), x: 'AB = [−1 2 1; 4 −8 −4; −3 6 3], and its transpose is B′A′.' }] }),
  mq('Ex 3.3', 'Q5 (ii)', 'Verify (AB)′ = B′A′ for A = [0; 1; 2], B = [1 5 7]', pm(MM.T([[1, 5, 7]]), MM.T([[0], [1], [2]]), 'B′', 'A′'), { mul: true, post: [{ k: 'tf', q: 'This equals (AB)′', a: true, x: 'AB = [0 0 0; 1 5 7; 2 10 14]; transposed it matches.' }] }),
  boardQ('Ex 3.3', 'Q6', 'Verify A′A = I for (i) A = [cos α sin α; −sin α cos α] (ii) A = [sin α cos α; −cos α sin α]', [
    { k: 'run', run: async () => { enterScene('sq', (W) => { W.label = 'A'; }); await sqTo(W, [[Math.cos(0.6), Math.sin(0.6)], [-Math.sin(0.6), Math.cos(0.6)]], AUTO ? 0.05 : 0.8); } },
    mcq('(i) A′A, entry (1,1) = cos²α + sin²α and entry (1,2) = cos α sin α − sin α cos α. So A′A =', ['I', 'O', 'A', '2I'], 'A is a rotation: it keeps lengths and right angles.'),
    mcq('(ii) Entry (1,1) = sin²α + cos²α, entry (1,2) = sin α cos α − cos α sin α. So A′A =', ['I', 'O', '−I', 'A²'], 'Also the identity.'),
  ], 'A′A = I in both cases'),
  stageQ('Ex 3.3', 'Q7', 'Show (i) [1 −1 5; −1 2 1; 5 1 3] is symmetric (ii) [0 1 −1; −1 0 1; 1 −1 0] is skew symmetric', [{ M: [[1, -1, 5], [-1, 2, 1], [5, 1, 3]], name: 'A', tone: (i, j) => (i === j ? C['kin-tint'] : i < j ? C['sora-tint'] : C.sakura) }, ' ', { M: [[0, 1, -1], [-1, 0, 1], [1, -1, 0]], name: 'B', tone: (i, j) => (i === j ? C['kin-tint'] : i < j ? C['sora-tint'] : C.sakura) }], [
    { k: 'tf', q: '(i) In A every blue cell equals its pink mirror: A′ = A', a: true, x: 'Symmetric.' },
    { k: 'tf', q: '(ii) In B every mirror pair is opposite and the diagonal is 0: B′ = −B', a: true, x: 'Skew symmetric.' },
  ], 'A′ = A; B′ = −B'),
  stageQ('Ex 3.3', 'Q8', 'For A = [1 5; 6 7], verify that (i) A + A′ is symmetric (ii) A − A′ is skew symmetric', [{ M: [[1, 5], [6, 7]], name: 'A' }, '+', { M: [[1, 6], [5, 7]], name: 'A′' }], [
    { k: 'fields', q: '(i) A + A′', f: mFields([[2, 11], [11, 14]], 'c'), x: '[2 11; 11 14]: symmetric.' },
    { k: 'fields', q: '(ii) A − A′', f: mFields([[0, -1], [1, 0]], 'd'), x: '[0 −1; 1 0]: skew symmetric.' },
  ], 'A + A′ = [2 11; 11 14], A − A′ = [0 −1; 1 0]'),
  boardQ('Ex 3.3', 'Q9', 'Find ½(A + A′) and ½(A − A′) for A = [0 a b; −a 0 c; −b −c 0]', [mcq('A is already skew symmetric (A′ = −A). So', ['½(A + A′) = O and ½(A − A′) = A', '½(A + A′) = A and ½(A − A′) = O', 'both are O', 'both are A'], 'A + A′ = A − A = O and A − A′ = 2A.')], '½(A + A′) = O, ½(A − A′) = A'),
  symQ('Q10 (i)', [[3, 5], [1, -1]]),
  symQ('Q10 (ii)', [[6, -2, 2], [-2, 3, -1], [2, -1, 3]]),
  symQ('Q10 (iii)', [[3, 3, -1], [-2, -2, 1], [-4, -5, 2]]),
  symQ('Q10 (iv)', [[1, 5], [-1, 2]]),
  boardQ('Ex 3.3', 'Q11', 'If A, B are symmetric of the same order, then AB − BA is (A) skew symmetric (B) symmetric (C) zero (D) identity', [mcq('(AB − BA)′ = B′A′ − A′B′ = BA − AB, so it is', ['(A) skew symmetric', '(B) symmetric', '(C) zero matrix', '(D) identity'], 'Its transpose is its negative.')], '(A)'),
  stageQ('Ex 3.3', 'Q12', 'If A = [cos α −sin α; sin α cos α] and A + A′ = I, then α = (A) π/6 (B) π/3 (C) π (D) 3π/2', [{ M: [['2cos α', 0], [0, '2cos α']], name: 'A + A′' }, '=', { M: [[1, 0], [0, 1]], name: 'I' }], [{ k: 'num', q: '2 cos α = 1, so cos α = ?', a: 0.5, show: '1/2', x: 'cos α = 1/2.' }, mcq('Answer', ['(B) π/3', '(A) π/6', '(C) π', '(D) 3π/2'], 'α = π/3.')], '(B) π/3'),
  boardQ('Ex 3.4', 'Q1', 'Matrices A and B are inverses of each other only if (A) AB = BA (B) AB = BA = O (C) AB = O, BA = I (D) AB = BA = I', [mcq('Answer', ['(D) AB = BA = I', '(A) AB = BA', '(B) AB = BA = O', '(C) AB = O, BA = I'], 'The definition of the inverse.')], '(D)'),
];

/* ===================== MISCELLANEOUS ===================== */
const AM3 = (x, y, z) => [[0, 2 * y, z], [x, y, -z], [x, -y, z]];
const Ms = [[10000, 2000, 18000], [6000, 20000, 8000]];
const EX3M = [
  boardQ('Misc', 'Q1', 'If A and B are symmetric matrices, prove that AB − BA is skew symmetric', [{ k: 'order', q: 'Order the proof', s: ['A′ = A, B′ = B', '(AB − BA)′ = (AB)′ − (BA)′', '= B′A′ − A′B′', '= BA − AB = −(AB − BA)'] }], '(AB − BA)′ = −(AB − BA)'),
  boardQ('Misc', 'Q2', 'Show that B′AB is symmetric or skew symmetric according as A is symmetric or skew symmetric', [
    mcq('(B′AB)′ = ?', ['B′A′(B′)′ = B′A′B', 'B′AB', 'BA′B′', 'A′B′B'], 'Reverse the order and transpose each factor.'),
    mcq('If A′ = A then (B′AB)′ = B′AB; if A′ = −A then (B′AB)′ =', ['−B′AB', 'B′AB', 'O', 'BAB′'], 'So B′AB copies the symmetry of A.'),
  ], '(B′AB)′ = B′A′B'),
  stageQ('Misc', 'Q3', 'Find x, y, z if A = [0 2y z; x y −z; x −y z] satisfies A′A = I', [{ M: [[0, '2y', 'z'], ['x', 'y', '−z'], ['x', '−y', 'z']], name: 'A' }], [
    mcq('A′A is diagonal with entries', ['2x², 6y², 3z²', 'x², y², z²', '2x², 2y², 2z²', 'x², 4y², z²'], 'Column 1·column 1 = x² + x², column 2: 4y² + y² + y², column 3: 3z².'),
    { k: 'fields', q: 'Each diagonal entry equals 1. Positive values:', keys: '√', f: [{ l: 'x', a: 1 / Math.SQRT2, show: '1/√2' }, { l: 'y', a: 1 / Math.sqrt(6), show: '1/√6' }, { l: 'z', a: 1 / r3, show: '1/√3' }], x: 'x = ±1/√2, y = ±1/√6, z = ±1/√3.', act: async (W) => { W.items = [{ M: MM.mul(MM.T(AM3(1 / Math.SQRT2, 1 / Math.sqrt(6), 1 / r3)), AM3(1 / Math.SQRT2, 1 / Math.sqrt(6), 1 / r3)), name: 'A′A' }]; SFX.chime(); } },
  ], 'x = ±1/√2, y = ±1/√6, z = ±1/√3', { fs: 15 }),
  stageQ('Misc', 'Q4', 'For what x is [1 2 1][1 2 0; 2 0 1; 1 0 2][0; 2; x] = O?', pm([[1, 2, 1]], [[1, 2, 0], [2, 0, 1], [1, 0, 2]], '', ''), [
    { k: 'fields', q: 'First [1 2 1] × the 3 × 3 matrix', act: rv, f: mFields([[6, 2, 4]], 'c'), x: '[6 2 4].' },
    { k: 'num', q: '[6 2 4][0; 2; x] = 4 + 4x = 0, so x = ?', a: -1, x: 'x = −1.' },
  ], 'x = −1'),
  stageQ('Misc', 'Q5', 'If A = [3 1; −1 2], show that A² − 5A + 7I = O', pm([[3, 1], [-1, 2]], [[3, 1], [-1, 2]], 'A', 'A'), [
    { k: 'fields', q: 'A²', act: rv, f: mFields(MM.mul([[3, 1], [-1, 2]], [[3, 1], [-1, 2]]), 'a'), x: 'A² = [8 5; −5 3].' },
    showM({ M: [[8, 5], [-5, 3]] }, '−', { M: [[15, 5], [-5, 10]] }, '+', { M: [[7, 0], [0, 7]] }, '=', { M: MM.add(MM.sub([[8, 5], [-5, 3]], [[15, 5], [-5, 10]]), [[7, 0], [0, 7]]) }),
    { k: 'tf', q: 'The result is O', a: true, x: '8 − 15 + 7 = 0 and so on.' },
  ], 'A² − 5A + 7I = O'),
  stageQ('Misc', 'Q6', 'Find x if [x −5 −1][1 0 2; 0 2 1; 2 0 3][x; 4; 1] = O', [{ M: [['x', -5, -1]] }, '×', { M: [[1, 0, 2], [0, 2, 1], [2, 0, 3]] }, '×', { M: [['x'], [4], [1]] }], [
    mcq('Row × matrix gives', ['[x − 2  −10  2x − 8]', '[x  −10  2x]', '[x − 2  10  2x − 8]', '[x + 2  −10  2x + 8]'], 'x·1 + (−5)·0 + (−1)·2 = x − 2, and so on.'),
    mcq('Then × [x; 4; 1]: x² − 2x − 40 + 2x − 8 =', ['x² − 48', 'x² − 40', 'x² − 2x − 48', '2x² − 48'], 'The x terms cancel.'),
    { k: 'num', q: 'x² = 48, positive x = ? (use √)', keys: '√', a: 4 * r3, show: '4√3', x: 'x = ±4√3.' },
  ], 'x = ±4√3'),
  mq('Misc', 'Q7', 'Sales [10000 2000 18000; 6000 20000 8000] in markets I, II. (a) Prices ₹2.50, ₹1.50, ₹1.00: revenue? (b) Costs ₹2.00, ₹1.00, ₹0.50: gross profit?', pm(Ms, [[2.5], [1.5], [1]], 'sales', 'price'), { mul: true, nm: 'r', fs: 13, x: 'Revenue ₹46000 (I) and ₹53000 (II).', post: [
    showM(...pm(Ms, [[2], [1], [0.5]], 'sales', 'cost')),
    { k: 'fields', q: '(b) Cost: market I and market II', act: rv, f: mFields(MM.mul(Ms, [[2], [1], [0.5]]), 'c'), x: 'Costs ₹31000 and ₹36000.' },
    { k: 'fields', q: 'Gross profit = revenue − cost', f: [{ l: 'I', a: 15000, pre: '₹' }, { l: 'II', a: 17000, pre: '₹' }], x: '₹15000 and ₹17000.' },
  ], w: ['Revenue ₹46000, ₹53000; profit ₹15000, ₹17000'] }),
  stageQ('Misc', 'Q8', 'Find X so that X[1 2 3; 4 5 6] = [−7 −8 −9; 2 4 6]', [{ M: [['a', 'b'], ['c', 'd']], name: 'X' }, '×', { M: [[1, 2, 3], [4, 5, 6]] }, '=', { M: [[-7, -8, -9], [2, 4, 6]] }], [
    mcq('X must be of order', ['2 × 2', '3 × 2', '2 × 3', '3 × 3'], '(m × 2)(2 × 3) = 2 × 3 needs m = 2.'),
    { k: 'fields', q: 'a + 4b = −7, 2a + 5b = −8 · c + 4d = 2, 2c + 5d = 4', f: [{ l: 'a', a: 1 }, { l: 'b', a: -2 }, { l: 'c', a: 2 }, { l: 'd', a: 0 }], x: 'X = [1 −2; 2 0].', act: async (W) => { W.items[0].M = [[1, -2], [2, 0]]; SFX.pop(); } },
    { k: 'tf', q: 'Check: [1 −2; 2 0][1 2 3; 4 5 6] gives the right side', a: MM.eq(MM.mul([[1, -2], [2, 0]], [[1, 2, 3], [4, 5, 6]]), [[-7, -8, -9], [2, 4, 6]]), x: 'It does.' },
  ], 'X = [1 −2; 2 0]', { fs: 15 }),
  boardQ('Misc', 'Q9', 'If A = [α β; γ −α] and A² = I, then (A) 1 + α² + βγ = 0 (B) 1 − α² + βγ = 0 (C) 1 − α² − βγ = 0 (D) 1 + α² − βγ = 0', [mcq('A² = (α² + βγ)I = I, so', ['(C) 1 − α² − βγ = 0', '(A)', '(B)', '(D)'], 'α² + βγ = 1.')], '(C)'),
  boardQ('Misc', 'Q10', 'If A is both symmetric and skew symmetric, then (A) A is diagonal (B) A is a zero matrix (C) A is square (D) None of these', [mcq('A′ = A and A′ = −A give A = −A, so', ['(B) A is a zero matrix', '(A) diagonal', '(C) square', '(D) None'], '2A = O.')], '(B)'),
  boardQ('Misc', 'Q11', 'If A is square and A² = A, then (I + A)³ − 7A = (A) A (B) I − A (C) I (D) 3A', [
    mcq('(I + A)³ = I + 3A + 3A² + A³ (I commutes with A). With A² = A³ = A this is', ['I + 7A', 'I + 3A', 'I + 6A', '7A'], 'A³ = A·A² = A·A = A.'),
    mcq('So (I + A)³ − 7A =', ['(C) I', '(A) A', '(B) I − A', '(D) 3A'], 'I.'),
  ], '(C) I'),
];

const BOSS3 = [['Order of a matrix with 3 rows, 2 columns', ['3 × 2', '2 × 3', '6', '5'], 0], ['(2 × 3)(3 × 4) has order', ['2 × 4', '3 × 3', '4 × 2', 'undefined'], 0], ['[1 2][3; 4] = ?', ['[11]', '[3 8]', '[4 6]', '[3; 8]'], 0], ['(AB)′ = ?', ['B′A′', 'A′B′', 'AB', 'BA'], 0], ['Diagonal of a skew symmetric matrix', ['all zero', 'all one', 'equal', 'anything'], 0], ['AB = BA always?', ['No', 'Yes', 'Only for 2 × 2', 'Only for zero'], 0], ['Number of 2 × 2 matrices with entries 0 or 1', ['16', '8', '4', '32'], 0], ['A symmetric means', ['A′ = A', 'A′ = −A', 'A² = I', 'A = I'], 0], ['3[1 −2] = ?', ['[3 −6]', '[3 −2]', '[4 1]', '[1 −6]'], 0], ['B = A⁻¹ when', ['AB = BA = I', 'AB = O', 'A + B = I', 'AB = BA'], 0]];
const byId = (id) => LESSONS.find((l) => l.id === id);
(() => {
  const L0 = ['what', 'types'].map(byId), L1 = ['addscale', 'multiply'].map(byId), L2 = ['transpose'].map(byId), L3 = ['inverse'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(...L0, exLesson({ id: 'ex31', title: 'Exercise 3.1', blurb: 'All 10: orders, aᵢⱼ rules, equal matrices.', face: 'kimmy-playful', qs: EX31 }), ...L1, exLesson({ id: 'ex32', title: 'Exercise 3.2', blurb: 'All 22: add, scale, tap-to-multiply, and the word problems.', face: 'jess-happy', qs: EX32 }), ...L2, exLesson({ id: 'ex33', title: 'Exercises 3.3 & 3.4', blurb: 'All 12 of Ex 3.3 plus Ex 3.4: transposes and symmetric + skew splits.', face: 'kimmy-curious', qs: EX33 }), ...L3, exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 11 Miscellaneous Exercise questions.', face: 'jess-thinking', qs: EX3M }));
})();
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 3'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Row times column, go!'); await cont('Fight'); }, ...BOSS3.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 3'; }); await summary(['Chapter complete!', { t: 'Row × column, order matters, (AB)′ = B′A′', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.id === 'ex33' ? '3.3' : l.title.replace('Exercise ', ''); });

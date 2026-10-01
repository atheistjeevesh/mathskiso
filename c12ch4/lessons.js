/* =========================================================
   CLASS 12 · CHAPTER 4 · DETERMINANTS — lessons (Examples 1–19)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const detIt = (M, name, o = {}) => ({ M, name, bars: true, ...o });
const cellAtL = (W, iC, sx, sy) => (W._cells || []).find((c) => c.it === W.items[iC] && sx >= c.x && sx <= c.x + c.w && sy >= c.y && sy <= c.y + c.h);
/* tap a cell of a numeric determinant: its row and column are crossed out and the minor/cofactor shown */
function tapMinor(W, iC, A, onPick) {
  W.picked = new Set();
  W.onTap = (x, y, sx, sy) => { const c = cellAtL(W, iC, sx, sy); if (!c) return; const it = W.items[iC]; it.cross = { i: c.i, j: c.j }; it.signs = true; W.picked.add(c.i + ',' + c.j);
    const m = DT.minor(A, c.i, c.j); const sg = (c.i + c.j) % 2 ? '−' : '+'; W.trace = 'M' + (c.i + 1) + (c.j + 1) + ' = ' + cell(m) + ' · A' + (c.i + 1) + (c.j + 1) + ' = ' + sg + '(' + cell(m) + ') = ' + cell(DT.cof(A, c.i, c.j)); SFX.snap(); buzz(8); if (onPick) onPick(c.i, c.j); };
}

LESSONS.push(lesson({
  id: 'det2', title: 'Determinant = Area', blurb: 'A 2 × 2 matrix stretches the unit square; the determinant is the signed area it becomes. Examples 1–2.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('sq', (W) => { W.label = 'A'; });
      await slam('|A|', 'Class 12 · Lesson 1 · Section 4.2');
      await J('idle', 'Every square matrix has a number called its determinant. For 2 × 2, |a b; c d| = ad − bc. Watch what it means.');
      W.A = [[1, 0], [0, 1]]; const A0 = [[2, 4], [-1, 2]]; planeView(W, -1.5, 7, -2.5, 3.2);
      const b = button('Apply A = [2 4; −1 2]'); await waitFor(() => b.clicked()); b.stop(); await sqTo(W, A0, 1.2);
      exTag('Example 1', '|2 4; −1 2|');
      await numQ('|2 4; −1 2| = 2·2 − 4·(−1) = ?', 8, 'The unit square (area 1) became a parallelogram of area 8.');
      await discover('|A| = scale factor of area', 'Negative means the square got flipped over.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [detIt([['x', 'x+1'], ['x−1', 'x']], ''), '=', { M: [['?']] }], { trace: 'x · x − (x + 1)(x − 1)' }));
      exTag('Example 2', '|x x+1; x−1 x|');
      await J('think', 'Main diagonal product minus the other diagonal product.');
      let xv = 2; slider('Try any x', -5, 5, 1, 2, (v) => 'x = ' + v, (v) => { xv = v; W.items[2].M = [[xv * xv - (xv + 1) * (xv - 1)]]; W.trace = xv + '·' + xv + ' − (' + (xv + 1) + ')(' + (xv - 1) + ') = ' + (xv * xv - (xv + 1) * (xv - 1)); }, -3);
      await numQ('x² − (x² − 1) = ?', 1, 'Always 1, whatever x is.');
      await quiz('A = 2B for 2 × 2 matrices. Then |A| =', ['4|B|', '2|B|', '|B|', '8|B|'], 0, '|kB| = kⁿ|B| with n = 2: both rows scale by k.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: '|a b; c d| = ad − bc', eq: true }, '|A| is the area scale factor; |kA| = kⁿ|A| for order n.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'det3', title: 'Expanding 3 × 3', blurb: 'Pick a row or column, cross out, multiply by + − + signs. Choose the line with the most zeros. Examples 3–5.', face: 'jess-thinking',
  steps: [
    async function () {
      const A = [[1, 2, 4], [-1, 3, 0], [4, 1, 0]];
      enterScene('mat', (W) => { matSet(W, [detIt(A, 'Δ', { signs: true })]); });
      await slam('EXPAND', 'Lesson ' + L.num + ' · Section 4.2.3');
      await J('idle', 'Tap an entry: its row and column vanish, leaving a 2 × 2 minor. The sign checkerboard + − + gives the cofactor.');
      exTag('Example 3', 'expand along C₃');
      tapMinor(W, 0, A);
      await task('Tap the three entries of column 3', () => [0, 1, 2].every((i) => W.picked.has(i + ',2')), (W) => [0, 1, 2].forEach((i) => W.picked.add(i + ',2')));
      await quiz('Which line is easiest to expand along?', ['column 3 (two zeros)', 'row 1', 'row 2', 'column 1'], 0, 'Zeros kill their terms.');
      await numQ('Δ = 4·|−1 3; 4 1| − 0 + 0 = ?', -52, '4(−1 − 12) = −52.');
      await cont();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [detIt([[0, 'sin α', '−cos α'], ['−sin α', 0, 'sin β'], ['cos α', '−sin β', 0]], 'Δ')], { fs: 15 }));
      exTag('Example 4', 'trig determinant');
      let a = 0.7, b = 1.1; const val = () => DT.det([[0, Math.sin(a), -Math.cos(a)], [-Math.sin(a), 0, Math.sin(b)], [Math.cos(a), -Math.sin(b), 0]]);
      const upd = () => (W.trace = 'α = ' + fmtN(a, 2) + ', β = ' + fmtN(b, 2) + ' → Δ = ' + fmtN(val() + 0, 6));
      slider('α', -3, 3, 0.1, a, (v) => fmtN(v, 1), (v) => { a = v; upd(); }, 2); slider('β', -3, 3, 0.1, b, (v) => fmtN(v, 1), (v) => { b = v; upd(); }, -1);
      await J('think', 'Slide α and β. Expanding along R₁: sin α sin β cos α − cos α sin α sin β = 0.');
      await numQ('Δ = ?', 0, 'Always 0: it is a skew symmetric 3 × 3 determinant.');
      await cont();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [detIt([[3, 'x'], ['x', 1]], ''), '=', detIt([[3, 2], [4, 1]], '')]));
      exTag('Example 5', 'find x');
      await J('idle', 'Left: 3 − x². Right: 3 − 8 = −5.');
      await numQ('x² = 8, so the positive x = ? (use √)', 2 * Math.SQRT2, 'x = ±2√2.', { keys: '√', show: '2√2' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Δ = a₁₁A₁₁ + a₁₂A₁₂ + a₁₃A₁₃ (any row or column)', eq: true }, 'Sign of position (i, j): (−1)ⁱ⁺ʲ, the + − + checkerboard.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'area', title: 'Triangle Area', blurb: 'Drag three corners: ½|x y 1| gives the area, and 0 means the points are collinear. Examples 6–7.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('tri', (W) => { W.P = [[3, 8], [-4, 2], [5, 1]]; triFit(W, W.P); triDrag(W); W.showArea = false; });
      await slam('½ |x y 1|', 'Lesson ' + L.num + ' · Section 4.3');
      exTag('Example 6', '(3, 8), (−4, 2), (5, 1)');
      await J('idle', 'Put each vertex in a row with a 1 at the end. Half the determinant (taken positive) is the area.');
      await numQ('Area = ½|3(2 − 1) − 8(−4 − 5) + 1(−4 − 10)| = ?', 61 / 2, '½(3 + 72 − 14) = 61/2.', { show: '61/2' }); W.showArea = true;
      await J('think', 'Now drag any corner. Can you make the area zero?');
      await task('Drag a corner until Δ = 0 (all three in a line)', () => triArea(W.P) < 1e-9, (W) => (W.P[2] = [10, 14]));
      await discover('Collinear ⇔ Δ = 0', 'Three points on a line enclose no area.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('tri', (W) => { W.P = [[1, 3], [0, 0], [2, 6]]; planeView(W, -5, 5, -3, 7); triDrag(W, [2], 0.5); });
      exTag('Example 7', 'line AB, and D(k, 0)');
      await J('idle', 'P(x, y) is on line AB exactly when the triangle ABP has zero area: ½|0 0 1; 1 3 1; x y 1| = 0 gives y − 3x = 0.');
      await task('Drag the green point along the line y = 3x (somewhere new)', () => triArea(W.P) < 1e-9 && W.moved > 0, (W) => { W.P[2] = [-1, -3]; W.moved = 1; });
      await quiz('Equation of AB', ['y = 3x', 'y = x + 3', 'x = 3y', 'y = 3'], 0, 'Expanding gives ½(y − 3x) = 0.');
      W.P = [[1, 3], [0, 0], [2, 0]]; triDrag(W, [2], 1); W.drags[0].set = (x) => { const v = [Math.round(x), 0]; if (v[0] !== W.P[2][0]) { W.P[2] = v; SFX.tick(); } };
      await task('Slide D(k, 0) so the area is 3', () => Math.abs(triArea(W.P) - 3) < 1e-9, (W) => (W.P[2] = [2, 0]));
      const r = await fields('½|1 3 1; 0 0 1; k 0 1| = −3k/2 = ±3. Both k:', [{ l: 'k₁', a: 2 }, { l: 'k₂', a: -2 }]); await verdict(r, 'k = ±2: D on either side of the origin.', 'k = 2 or −2.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Area = ½|x₁ y₁ 1; x₂ y₂ 1; x₃ y₃ 1|', eq: true }, 'Take the absolute value; if the area is given, use ± both.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'cofactor', title: 'Minors & Cofactors', blurb: 'Cross out a row and column to get the minor; add the checkerboard sign for the cofactor. Examples 8–11.', face: 'jess-excited',
  steps: [
    async function () {
      const A = [[1, 2, 3], [4, 5, 6], [7, 8, 9]];
      enterScene('mat', (W) => matSet(W, [detIt(A, 'Δ')]));
      await slam('Mᵢⱼ · Aᵢⱼ', 'Lesson ' + L.num + ' · Section 4.4');
      exTag('Example 8', 'minor of 6');
      tapMinor(W, 0, A);
      await task('Tap the element 6', () => W.picked.has('1,2'), (W) => { W.picked.add('1,2'); W.items[0].cross = { i: 1, j: 2 }; });
      await numQ('M₂₃ = |1 2; 7 8| = ?', -6, '8 − 14 = −6.');
      await cont();
    },
    async function () {
      const A = [[1, -2], [4, 3]];
      enterScene('mat', (W) => { matSet(W, [detIt(A, 'Δ', { signs: true })]); tapMinor(W, 0, A); });
      exTag('Example 9', '|1 −2; 4 3|');
      await J('idle', 'For a 2 × 2, the minor of an entry is the single entry left after crossing out.');
      const r = await fields('Minors', [{ l: 'M_{11}', a: 3 }, { l: 'M_{12}', a: 4 }, { l: 'M_{21}', a: -2 }, { l: 'M_{22}', a: 1 }]); await verdict(r, 'M₁₁ = 3, M₁₂ = 4, M₂₁ = −2, M₂₂ = 1.', 'Cross out and read the leftover.');
      const r2 = await fields('Cofactors (flip the sign at − positions)', [{ l: 'A_{11}', a: 3 }, { l: 'A_{12}', a: -4 }, { l: 'A_{21}', a: 2 }, { l: 'A_{22}', a: 1 }]); await verdict(r2, 'A₁₂ and A₂₁ change sign.', '3, −4, 2, 1.');
      exTag('Example 10', 'general 3 × 3');
      await quiz('Cofactor of a₂₁ in |aᵢⱼ| (3 × 3) is', ['−(a₁₂a₃₃ − a₁₃a₃₂)', 'a₁₂a₃₃ − a₁₃a₃₂', 'a₂₂a₃₃ − a₂₃a₃₂', '−(a₂₂a₃₃ − a₂₃a₃₂)'], 0, 'Cross out row 2, column 1; position (2,1) carries a minus.');
      await cont();
    },
    async function () {
      const A = [[2, -3, 5], [6, 0, 4], [1, 5, -7]];
      enterScene('mat', (W) => { matSet(W, [detIt(A, 'Δ', { signs: true })]); tapMinor(W, 0, A); });
      exTag('Example 11', 'cofactors of row 3');
      await task('Tap each entry of row 3', () => [0, 1, 2].every((j) => W.picked.has('2,' + j)), (W) => [0, 1, 2].forEach((j) => W.picked.add('2,' + j)));
      const r = await fields('Cofactors of row 3', [{ l: 'A_{31}', a: DT.cof(A, 2, 0) }, { l: 'A_{32}', a: DT.cof(A, 2, 1) }, { l: 'A_{33}', a: DT.cof(A, 2, 2) }]); await verdict(r, 'A₃₁ = −12, A₃₂ = 22, A₃₃ = 18.', '−12, 22, 18.');
      await numQ('Row 1 with row 3’s cofactors: 2(−12) + (−3)(22) + 5(18) = ?', 0, 'Zero! Elements of one row times cofactors of ANOTHER row always give 0.');
      await numQ('But row 3 with its own cofactors: 1(−12) + 5(22) + (−7)(18) = Δ = ?', DT.det(A), 'That is Δ itself.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Aᵢⱼ = (−1)ⁱ⁺ʲ Mᵢⱼ', eq: true }, 'Own row × own cofactors = Δ; other row × cofactors = 0.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'adjinv', title: 'Adjoint & Inverse', blurb: 'adj A = transpose of the cofactors; A⁻¹ = adj A / |A| when |A| ≠ 0. Examples 12–15.', face: 'kimmy-playful',
  steps: [
    async function () {
      const A = [[2, 3], [1, 4]];
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A' }, '→', { M: DT.adj(A), name: 'adj A', hide: 'all' }]));
      await slam('adj A', 'Lesson ' + L.num + ' · Section 4.5');
      exTag('Example 12', 'A = [2 3; 1 4]');
      await J('idle', 'Shortcut for 2 × 2: swap the diagonal, change the sign of the other two.');
      const r = await fields('adj A', mFields(DT.adj(A), 'b')); await verdict(r, 'adj A = [4 −3; −1 2].', 'Swap 2 and 4, negate 3 and 1.'); await revealM(W, 2);
      await quiz('A·(adj A) = ?', ['|A| I = 5I', 'I', 'O', 'A²'], 0, '[2 3; 1 4][4 −3; −1 2] = [5 0; 0 5].');
      await cont();
    },
    async function () {
      const A = [[1, 3, 3], [1, 4, 3], [1, 3, 4]], ad = DT.adj(A);
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A' }, '→', { M: ad, name: 'adj A', hide: 'all' }]));
      exTag('Example 13', 'A adj A = |A| I');
      await numQ('|A| = 1(16 − 9) − 3(4 − 3) + 3(3 − 4) = ?', 1, '|A| = 1.');
      const r = await fields('First row of adj A (the cofactors A₁₁, A₂₁, A₃₁)', mFields(ad, 'b', [0])); await verdict(r, 'adj A = ' + mStr(ad) + '.', 'adj takes the TRANSPOSE: row 1 holds A₁₁, A₂₁, A₃₁.'); await revealM(W, 2, 0.05);
      matSet(W, [{ M: A, name: 'A' }, '×', { M: ad }, '=', { M: MM.mul(A, ad), hide: hideAll(A) }]); await sweepMul(W, 0, 2, 4, 0.12);
      await quiz('So A⁻¹ = adj A / |A| =', ['adj A itself', 'A', '−adj A', 'it does not exist'], 0, '|A| = 1, so A⁻¹ = adj A.');
      await cont();
    },
    async function () {
      const A = [[2, 3], [1, -4]], B = [[1, -2], [-1, 3]], AB = MM.mul(A, B);
      enterScene('mat', (W) => matSet(W, [{ M: DT.inv(AB), name: '(AB)⁻¹', hide: 'all' }, ' ', { M: MM.mul(DT.inv(B), DT.inv(A)), name: 'B⁻¹A⁻¹', hide: 'all' }], { cap: 'A = [2 3; 1 −4], B = [1 −2; −1 3], AB = [−1 5; 5 −14]', fs: 15 }));
      exTag('Example 14', '(AB)⁻¹ = B⁻¹A⁻¹');
      await numQ('|AB| = 14 − 25 = ?', -11, '|AB| = −11 ≠ 0.');
      const r = await fields('(AB)⁻¹ = −(1/11)[−14 −5; −5 −1]', mFields(DT.inv(AB), 'c')); await verdict(r, '(AB)⁻¹ = [14/11 5/11; 5/11 1/11].', 'Divide adj(AB) by −11.'); await revealM(W, 0);
      await revealM(W, 2); await tf('B⁻¹A⁻¹ (right) is the same matrix', MM.eq(DT.inv(AB), MM.mul(DT.inv(B), DT.inv(A)))).then((r) => verdict(r, 'Verified: socks then shoes, undone shoes first.', 'They are equal.'));
      await cont();
    },
    async function () {
      const A = [[2, 3], [1, 2]];
      enterScene('mat', (W) => matSet(W, [{ M: MM.mul(A, A), name: 'A²' }, '− 4A + I =', { M: clean(MM.add(MM.sub(MM.mul(A, A), MM.k(4, A)), MM.I(2))), hide: 'all' }]));
      exTag('Example 15', 'A² − 4A + I = O');
      await revealM(W, 2, 0.15); FX.ono('ZERO', { x: 50, y: 30 });
      await order('Use it to find A⁻¹', ['A² − 4A + I = O', 'Multiply by A⁻¹: A − 4I + A⁻¹ = O', 'A⁻¹ = 4I − A', '= [2 −3; −1 2]']).then((r) => verdict(r, 'No adjoint needed!', 'Multiply through by A⁻¹.'));
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'A⁻¹ = (1/|A|) adj A, only if |A| ≠ 0', eq: true }, 'A(adj A) = (adj A)A = |A| I · |adj A| = |A|ⁿ⁻¹', '(AB)⁻¹ = B⁻¹A⁻¹']); },
  ],
}));

LESSONS.push(lesson({
  id: 'systems', title: 'Solving AX = B', blurb: 'Lines that cross, run parallel or coincide. Then X = A⁻¹B solves any non-singular system. Examples 16–19.', face: 'jess-happy',
  steps: [
    async function () {
      enterScene('lines2', (W) => { W.eqs = [[2, 5, 1], [3, 2, 7]]; W.show = 0; });
      await slam('AX = B', 'Lesson ' + L.num + ' · Section 4.6');
      exTag('Example 16', '2x + 5y = 1, 3x + 2y = 7');
      const b = button('Draw both lines'); await waitFor(() => b.clicked()); b.stop(); W.show = 1; SFX.whoosh(); await wait(0.5); W.show = 2; SFX.zap();
      await numQ('|A| = |2 5; 3 2| = ?', -11, 'Non-zero, so exactly one crossing point.');
      const r = await fields('X = A⁻¹B = −(1/11)[2 −5; −3 2][1; 7]', [{ l: 'x', a: 3 }, { l: 'y', a: -1 }]); await verdict(r, 'x = 3, y = −1: the gold star.', '(3, −1).');
      await J('think', 'If |A| = 0 the lines are parallel (no solution: inconsistent) or the same line. Watch:');
      W.eqs = [[1, 3, 5], [2, 6, 8]]; SFX.flip(); await wait(1);
      await quiz('x + 3y = 5 and 2x + 6y = 8 are…', ['parallel: inconsistent', 'crossing once', 'the same line', 'perpendicular'], 0, '|A| = 0 and (adj A)B ≠ O.');
      await cont();
    },
    async function () {
      const A = [[3, -2, 3], [2, 1, -1], [4, -3, 2]], B = [8, 1, 4];
      enterScene('mat', (W) => matSet(W, [{ M: clean(DT.inv(A)), name: 'A⁻¹' }, '×', { M: B.map((v) => [v]), name: 'B' }, '=', { M: DT.solve(A, B).map((v) => [v]), hide: 'all' }], { cap: '3x − 2y + 3z = 8 · 2x + y − z = 1 · 4x − 3y + 2z = 4', fs: 14 }));
      exTag('Example 17', 'three equations');
      await numQ('|A| = ?', DT.det(A), '|A| = −17 ≠ 0.');
      const r = await fields('X = A⁻¹B', [{ l: 'x', a: 1 }, { l: 'y', a: 2 }, { l: 'z', a: 3 }]); await verdict(r, 'x = 1, y = 2, z = 3.', 'Row × column with A⁻¹.'); await sweepMul(W, 0, 2, 4, 0.3);
      await cont();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [{ M: [[1, 1, 1], [0, 1, 3], [1, -2, 1]], name: 'A' }, '×', { M: [['x'], ['y'], ['z']] }, '=', { M: [[6], [11], [0]] }]));
      exTag('Example 18', 'three numbers');
      await J('idle', 'Sum is 6: x + y + z = 6. Third × 3 plus second is 11: y + 3z = 11. First + third = 2 × second: x − 2y + z = 0.');
      const r = await fields('Solve with A⁻¹ = (1/9) adj A', [{ l: 'x', a: 1 }, { l: 'y', a: 2 }, { l: 'z', a: 3 }]); await verdict(r, 'The numbers are 1, 2, 3.', '1, 2, 3.');
      await cont();
    },
    async function () {
      const P = [[1, -1, 2], [0, 2, -3], [3, -2, 4]], Q = [[-2, 0, 1], [9, 2, -3], [6, 1, -2]];
      enterScene('mat', (W) => matSet(W, [{ M: P }, '×', { M: Q }, '=', { M: MM.mul(P, Q), hide: hideAll(P) }]));
      exTag('Example 19', 'use the product');
      await sweepMul(W, 0, 2, 4, AUTO ? 0.01 : 0.12);
      await quiz('The product is I. So', ['Q is the inverse of P', 'P = Q', 'P is singular', 'nothing'], 0, 'PQ = I means Q = P⁻¹.');
      const r = await fields('x − y + 2z = 1, 2y − 3z = 1, 3x − 2y + 4z = 2: X = Q[1; 1; 2]', [{ l: 'x', a: 0 }, { l: 'y', a: 5 }, { l: 'z', a: 3 }]); await verdict(r, 'x = 0, y = 5, z = 3.', '(0, 5, 3).');
      await J('think', 'Answer-key check: in the printed solution the book dropped some minus signs when it rewrote the inverse ([2 0 1; 9 2 3; 6 1 2]). Its working and the answer (0, 5, 3) use the correct [−2 0 1; 9 2 −3; 6 1 −2].');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '|A| ≠ 0 ⇒ X = A⁻¹B, unique solution', eq: true }, '|A| = 0 and (adj A)B ≠ O ⇒ inconsistent', '|A| = 0 and (adj A)B = O ⇒ infinitely many or none']); },
  ],
}));

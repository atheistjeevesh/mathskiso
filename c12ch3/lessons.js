/* =========================================================
   CLASS 12 · CHAPTER 3 · MATRICES — lessons (Examples 1–25)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const R3 = Math.sqrt(3), R5 = Math.sqrt(5);

LESSONS.push(lesson({
  id: 'what', title: 'What Is a Matrix?', blurb: 'Rows, columns, order m × n and the address aᵢⱼ. Tap cells, count orders, build a matrix from a rule. Examples 1–3.', face: 'kimmy-curious',
  steps: [
    async function () {
      const F = [[30, 25], [25, 31], [27, 26]];
      enterScene('mat', (W) => matSet(W, [{ M: F, name: 'A', sub: '3 × 2' }], { cap: 'rows: factories I, II, III · columns: men, women' }));
      await slam('[ aᵢⱼ ]', 'Class 12 · Lesson 1 · Section 3.2');
      await J('idle', 'A matrix is a rectangle of numbers. Rows run across, columns run down. This one has 3 rows and 2 columns, so its order is 3 × 2.');
      exTag('Example 1', 'workers in three factories');
      W.onTap = (x, y, sx, sy) => { const c = (W._cells || []).find((c) => sx >= c.x && sx <= c.x + c.w && sy >= c.y && sy <= c.y + c.h); if (!c) return; W.items[0].hl = { cells: new Set([c.i + ',' + c.j]) }; W.pick = c; W.trace = 'a' + (c.i + 1) + (c.j + 1) + ' = ' + F[c.i][c.j] + (c.j ? ' women' : ' men') + ' in factory ' + ['I', 'II', 'III'][c.i]; SFX.snap(); };
      await task('Tap the entry in row 3, column 2', () => W.pick && W.pick.i === 2 && W.pick.j === 1, (W) => { W.pick = { i: 2, j: 1 }; W.items[0].hl = { cells: new Set(['2,1']) }; W.trace = 'a32 = 26 women in factory III'; });
      await quiz('a₃₂ = 26 represents…', ['women workers in factory III', 'men workers in factory III', 'women workers in factory II', 'workers in factory II'], 0, 'Row 3 = factory III, column 2 = women.');
      await discover('A = [aᵢⱼ]ₘₓₙ', 'i is the row, j is the column; it has mn elements.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [{ M: [[1, 2, 3, 4, 5, 6, 7, 8]], sub: '1 × 8' }]));
      exTag('Example 2', 'orders with 8 elements');
      await J('think', 'Eight elements can be arranged as m × n whenever mn = 8.');
      for (const [m, n] of [[2, 4], [4, 2], [8, 1]]) { await wait(0.5); const v = Array.from({ length: m }, (_, i) => Array.from({ length: n }, (_, j) => i * n + j + 1)); W.items[0] = { M: v, sub: m + ' × ' + n }; SFX.flip(); }
      await pickQ('Pick every possible order', ['1 × 8', '8 × 1', '2 × 4', '4 × 2', '3 × 3', '2 × 6', '4 × 4'], ['1 × 8', '8 × 1', '2 × 4', '4 × 2'], 'The factor pairs of 8.', { brace: false });
      await cont();
    },
    async function () {
      const A = [1, 2, 3].map((i) => [1, 2].map((j) => Math.abs(i - 3 * j) / 2));
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A', hide: 'all', sub: '3 × 2' }], { trace: 'aᵢⱼ = ½ |i − 3j|' }));
      exTag('Example 3', 'aᵢⱼ = ½|i − 3j|');
      await J('idle', 'Build it cell by cell: plug in the row i and the column j.');
      const r = await fields('Fill row 1 and row 2', mFields(A, 'a', [0, 1]), { keys: '' }); await verdict(r, 'a₁₁ = ½|1 − 3| = 1, a₁₂ = ½|1 − 6| = 5/2, a₂₁ = 1/2, a₂₂ = 2.', 'Plug i, j into ½|i − 3j|.');
      await revealM(W, 0, 0.12);
      await numQ('Last row: a₃₁ = ½|3 − 3| = ?', 0, 'Zero, and a₃₂ = 3/2.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'Order m × n: m rows, n columns, mn elements', eq: true }, 'aᵢⱼ sits in row i, column j.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'types', title: 'Types & Equality', blurb: 'Column, row, square, diagonal, scalar, identity, zero. Equal matrices match cell by cell. Examples 4–5.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('mat', (W) => matSet(W, [{ M: [[3, 0, 0], [0, 3, 0], [0, 0, 3]], name: 'S' }, ' ', { M: [[1, 0], [0, 1]], name: 'I' }, ' ', { M: [[0], [R3], [-1]], name: 'c' }]));
      await slam('TYPES', 'Lesson ' + L.num + ' · Section 3.3');
      W.items[0].tone = (i, j) => (i === j ? C['kin-tint'] : null); W.items[2].tone = (i, j) => (i === j ? C['kin-tint'] : null);
      await J('idle', 'The gold cells are the diagonal a₁₁, a₂₂, a₃₃. Only square matrices have one.');
      const r = await match('Match each matrix to its type', ['[4  0; 0  −1]', '[3  0; 0  3]', '[1  0; 0  1]', '[0  0; 0  0]', '[½  √5  2]', '[0; √3; −1]'], ['row matrix', 'scalar matrix', 'identity matrix', 'zero matrix', 'diagonal (not scalar)', 'column matrix'], [4, 1, 2, 3, 0, 5]); await verdict(r, 'Every identity matrix is scalar; every scalar matrix is diagonal.', 'Diagonal: only the diagonal can be non-zero. Scalar: equal diagonal. Identity: diagonal of 1s.');
      await quiz('Is every scalar matrix an identity matrix?', ['No, only when k = 1', 'Yes, always', 'Only if it is 2 × 2', 'Only if it is zero'], 0, 'Identity is the scalar matrix with k = 1.');
      await cont();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [{ M: [['x+3', 'z+4', '2y−7'], [-6, 'a−1', 0], ['b−3', -21, 0]] }, '=', { M: [[0, 6, '3y−2'], [-6, -3, '2c+2'], ['2b+4', -21, 0]] }], { fs: 15 }));
      exTag('Example 4', 'equal matrices');
      await J('think', 'Equal matrices have the same order and every matching cell is equal. Tap a pair to see the equation.');
      const eqs = { '0,0': 'x + 3 = 0', '0,1': 'z + 4 = 6', '0,2': '2y − 7 = 3y − 2', '1,1': 'a − 1 = −3', '1,2': '0 = 2c + 2', '2,0': 'b − 3 = 2b + 4' }; W.seen = new Set();
      W.onTap = (x, y, sx, sy) => { const c = (W._cells || []).find((c) => sx >= c.x && sx <= c.x + c.w && sy >= c.y && sy <= c.y + c.h); if (!c) return; const k = c.i + ',' + c.j; W.items[0].hl = W.items[2].hl = { cells: new Set([k]) }; W.trace = eqs[k] || 'already equal'; if (eqs[k]) W.seen.add(k); SFX.snap(); };
      await task('Tap three different cell pairs', () => W.seen.size >= 3, (W) => ['0,0', '0,1', '1,1'].forEach((k) => W.seen.add(k)));
      const r = await fields('Solve every equation', [{ l: 'a', a: -2 }, { l: 'b', a: -7 }, { l: 'c', a: -1 }, { l: 'x', a: -3 }, { l: 'y', a: -5 }, { l: 'z', a: 2 }]); await verdict(r, 'a = −2, b = −7, c = −1, x = −3, y = −5, z = 2.', 'Solve each cell equation.');
      await cont();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [{ M: [['2a+b', 'a−2b'], ['5c−d', '4c+3d']] }, '=', { M: [[4, -3], [11, 24]] }]));
      exTag('Example 5', 'a, b, c, d');
      await J('idle', 'The top row gives 2a + b = 4 and a − 2b = −3. The bottom row gives 5c − d = 11 and 4c + 3d = 24.');
      const r = await fields('Solve the two pairs', [{ l: 'a', a: 1 }, { l: 'b', a: 2 }, { l: 'c', a: 3 }, { l: 'd', a: 4 }]); await verdict(r, 'a = 1, b = 2, c = 3, d = 4.', 'Solve each pair of simultaneous equations.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'A = B ⇔ same order and aᵢⱼ = bᵢⱼ for every i, j', eq: true }, 'Identity ⊂ scalar ⊂ diagonal ⊂ square.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'addscale', title: 'Adding & Scaling', blurb: 'Add cell by cell, scale every cell, solve matrix equations like ordinary ones. Examples 6–11.', face: 'kimmy-excited',
  steps: [
    async function () {
      const A = [[R3, 1, -1], [2, 3, 0]], B = [[2, R5, 1], [-2, 3, 0.5]];
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A' }, '+', { M: B, name: 'B' }, '=', { M: [['2+√3', '1+√5', 0], [0, 6, '1/2']], hide: 'all' }]));
      await slam('A + B', 'Lesson ' + L.num + ' · Section 3.4');
      exTag('Example 6', 'A + B');
      await J('idle', 'Same order, so add matching cells. Tap each ? to add it.');
      W.seen = new Set(); W.onTap = (x, y, sx, sy) => { const c = (W._cells || []).find((c) => c.it === W.items[4] && sx >= c.x && sx <= c.x + c.w && sy >= c.y && sy <= c.y + c.h); if (!c) return; const k = c.i + ',' + c.j; W.items[4].hide.delete(k); W.seen.add(k); [0, 2, 4].forEach((n) => (W.items[n].hl = { cells: new Set([k]) })); W.trace = cell(A[c.i][c.j]) + ' + ' + cell(B[c.i][c.j]) + ' = ' + W.items[4].M[c.i][c.j]; SFX.snap(); };
      W.items[4].hide = hideAll(A);
      await task('Tap all six ? cells', () => W.seen.size >= 6, (W) => { for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) { W.seen.add(i + ',' + j); W.items[4].hide.delete(i + ',' + j); } });
      await quiz('A 2 × 2 plus a 2 × 3 matrix is…', ['not defined', 'a 2 × 3 matrix', 'a 2 × 5 matrix', 'zero'], 0, 'Addition needs the same order.');
      await cont();
    },
    async function () {
      const A = [[1, 2, 3], [2, 3, 1]], B = [[3, -1, 3], [-1, 0, 2]], R = MM.sub(MM.k(2, A), B);
      enterScene('mat', (W) => matSet(W, [{ M: A, name: '2 ×' }, '−', { M: B }, '=', { M: R, hide: 'all' }]));
      exTag('Example 7', '2A − B');
      await J('think', 'Double every cell of A first, then subtract B cell by cell.');
      const r = await fields('Fill 2A − B', mFields(R, 'c')); await verdict(r, '2A − B = ' + mStr(R) + '.', 'For example 2·1 − 3 = −1.'); await revealM(W, 4);
      await cont();
    },
    async function () {
      const A = [[8, 0], [4, -2], [3, 6]], B = [[2, -2], [4, 2], [-5, 1]], X = MM.k(1 / 3, MM.sub(MM.k(5, B), MM.k(2, A)));
      enterScene('mat', (W) => matSet(W, [{ M: [['5B − 2A']] }, '→', { M: MM.sub(MM.k(5, B), MM.k(2, A)) }, '÷ 3 =', { M: X, name: 'X', hide: 'all' }]));
      exTag('Example 8', '2A + 3X = 5B');
      await J('idle', 'Treat it like an ordinary equation: 3X = 5B − 2A, so X = ⅓(5B − 2A).');
      const r = await fields('First row of X', mFields(X, 'x', [0])); await verdict(r, 'x₁₁ = −6/3 = −2, x₁₂ = −10/3.', 'Divide −6 and −10 by 3.'); await revealM(W, 4);
      await cont();
    },
    async function () {
      const P = [[5, 2], [0, 9]], Q = [[3, 6], [0, -1]], X = MM.k(0.5, MM.add(P, Q)), Y = MM.k(0.5, MM.sub(P, Q));
      enterScene('mat', (W) => matSet(W, [{ M: X, name: 'X', hide: 'all' }, ' ', { M: Y, name: 'Y', hide: 'all' }], { cap: 'X + Y = [5 2; 0 9],  X − Y = [3 6; 0 −1]' }));
      exTag('Example 9', 'X and Y');
      await J('think', 'Add the two equations: 2X = [8 8; 0 8]. Subtract them: 2Y = [2 −4; 0 10].');
      const r = await fields('Fill X', mFields(X, 'x')); await verdict(r, 'X = [4 4; 0 4].', 'Halve [8 8; 0 8].'); await revealM(W, 0);
      const r2 = await fields('Fill Y', mFields(Y, 'y')); await verdict(r2, 'Y = [1 −2; 0 5].', 'Halve [2 −4; 0 10].'); await revealM(W, 2);
      exTag('Example 10', '2[x 5; 7 y−3] + [3 −4; 1 2] = [7 6; 15 14]');
      const r3 = await fields('Compare cells: 2x + 3 = 7 and 2y − 4 = 14', [{ l: 'x', a: 2 }, { l: 'y', a: 9 }]); await verdict(r3, 'x = 2, y = 9.', 'x = 2, y = 9.');
      await cont();
    },
    async function () {
      const A = [[10000, 20000, 30000], [50000, 30000, 10000]], B = [[5000, 10000, 6000], [20000, 10000, 10000]];
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'Sep' }, ' ', { M: B, name: 'Oct' }], { cap: 'rows: Ramkishan, Gurcharan · columns: Basmati, Permal, Naura', fs: 14 }));
      exTag('Example 11', 'rice sales');
      const r = await fields('(i) Combined sales A + B, Ramkishan’s row', mFields(MM.add(A, B), 's', [0])); await verdict(r, '15000, 30000, 36000.', 'Add September and October cells.');
      const r2 = await fields('(ii) Decrease A − B, Gurcharan’s row', mFields(MM.sub(A, B), 'd', [1])); await verdict(r2, '30000, 20000, 0.', 'Subtract October from September.');
      W.items = [{ M: MM.k(0.02, B), name: '0.02 × Oct' }]; SFX.flip();
      const r3 = await fields('(iii) 2% profit in October, Ramkishan’s row', mFields(MM.k(0.02, B), 'p', [0])); await verdict(r3, '₹100, ₹200, ₹120 (Gurcharan: ₹400, ₹200, ₹200).', '0.02 × each October cell.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '(A + B)ᵢⱼ = aᵢⱼ + bᵢⱼ ·  (kA)ᵢⱼ = k aᵢⱼ', eq: true }, 'Addition is commutative and associative; O is the identity, −A the inverse.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'multiply', title: 'Row × Column', blurb: 'Tap a cell of AB and watch a row of A meet a column of B. Non-commuting, zero products, A³ − 23A − 40I. Examples 12–19.', face: 'jess-excited',
  steps: [
    async function () {
      const Q = [[2, 5], [8, 10]], Pr = [[5], [50]];
      enterScene('mat', (W) => matSet(W, [{ M: Q, name: 'needs' }, '×', { M: Pr }, '=', { M: MM.mul(Q, Pr), hide: 'all' }], { cap: 'Meera: 2 pens, 5 books · Nadeem: 8 pens, 10 books' }));
      await slam('ROW × COLUMN', 'Lesson ' + L.num + ' · Section 3.4.5');
      await J('idle', 'Pens cost ₹5 and books ₹50. Meera pays 2·5 + 5·50: her ROW times the price COLUMN.');
      tapToMultiply(W);
      await task('Tap both ? cells', () => W.seen.size >= 2, (W) => { W.seen.add('0,0'); W.seen.add('1,0'); sweepMul(W); });
      await numQ('Nadeem pays 8·5 + 10·50 = ?', 540, '₹540.', { pre: '₹' });
      await cont();
    },
    async function () {
      const Cm = [[1, -1, 2], [0, 3, 4]], Dm = [[2, 7], [-1, 1], [5, -4]], P = MM.mul(Cm, Dm);
      enterScene('mat', (W) => matSet(W, [{ M: Cm, name: 'C' }, '×', { M: Dm, name: 'D' }, '=', { M: P, hide: hideAll(P) }]));
      await J('think', '2 × 3 times 3 × 2: the inside numbers match (3 = 3), and the outside numbers give the order 2 × 2.');
      tapToMultiply(W);
      await task('Tap all four ? cells and watch each row meet each column', () => W.seen.size >= 4, (W) => { ['0,0', '0,1', '1,0', '1,1'].forEach((k) => W.seen.add(k)); sweepMul(W, 0, 2, 4, 0.2); });
      await discover('cᵢₖ = Σ aᵢⱼ bⱼₖ', 'Row i of A, column k of B: multiply pairs and add.');
      await cont(); hideFound();
    },
    async function () {
      const A = [[6, 9], [2, 3]], B = [[2, 6, 0], [7, 9, 8]], P = MM.mul(A, B);
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A' }, '×', { M: B, name: 'B' }, '=', { M: P, hide: hideAll(P) }]));
      exTag('Example 12', 'AB');
      tapToMultiply(W);
      await task('Tap the bottom row of ?s', () => [0, 1, 2].every((j) => W.seen.has('1,' + j)), (W) => [0, 1, 2].forEach((j) => { W.seen.add('1,' + j); W.items[4].hide.delete('1,' + j); }));
      const r = await fields('Now type the top row', mFields(P, 'c', [0])); await verdict(r, '6·2 + 9·7 = 75, 6·6 + 9·9 = 117, 0 + 72 = 72.', 'Row 1 of A is (6, 9).'); await revealM(W, 4);
      await quiz('Is BA defined here?', ['No: B has 3 columns but A has 2 rows', 'Yes, it is 3 × 3', 'Yes, it equals AB', 'Yes, it is 2 × 2'], 0, 'Columns of the left must equal rows of the right.');
      await cont();
    },
    async function () {
      const A = [[1, -2, 3], [-4, 2, 5]], B = [[2, 3], [4, 5], [2, 1]];
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A' }, '×', { M: B, name: 'B' }, '=', { M: MM.mul(A, B), hide: 'all' }]));
      exTag('Example 13', 'AB vs BA');
      const r = await fields('AB (2 × 2)', mFields(MM.mul(A, B), 'c')); await verdict(r, 'AB = ' + mStr(MM.mul(A, B)) + '.', 'Row × column.'); await revealM(W, 4);
      W.items = matSet(W, [{ M: B, name: 'B' }, '×', { M: A, name: 'A' }, '=', { M: MM.mul(B, A), hide: hideAll(MM.mul(B, A)) }]); SFX.flip();
      await quiz('BA has order…', ['3 × 3, so AB ≠ BA', '2 × 2, equal to AB', '3 × 2', 'undefined'], 0, 'BA = ' + mStr(MM.mul(B, A)) + '.'); await sweepMul(W, 0, 2, 4, 0.12);
      await cont();
    },
    async function () {
      enterScene('sq', (W) => { W.label = 'A'; });
      exTag('Example 14', 'A = [1 0; 0 −1], B = [0 1; 1 0]');
      await J('idle', 'Watch matrices as moves of the unit square. A flips it upside down; B swaps x and y.');
      const A = [[1, 0], [0, -1]], B = [[0, 1], [1, 0]];
      const b1 = button('Do AB (B first, then A)'); await waitFor(() => b1.clicked()); b1.stop(); W.label = 'AB'; await sqTo(W, MM.mul(A, B));
      const b2 = button('Do BA'); await waitFor(() => b2.clicked()); b2.stop(); W.label = 'BA'; await sqTo(W, MM.mul(B, A));
      await quiz('AB = [0 1; −1 0] and BA = [0 −1; 1 0]. So…', ['AB ≠ BA: order matters', 'AB = BA', 'AB = O', 'BA = I'], 0, 'Matrix multiplication is not commutative.');
      exTag('Example 15', 'zero product');
      await sqTo(W, [[0, -1], [0, 2]]); W.label = 'A = [0 −1; 0 2]';
      await quiz('A = [0 −1; 0 2], B = [3 5; 0 0]. AB = ?', ['O, though A ≠ O and B ≠ O', 'I', 'A', 'B'], 0, 'AB = [0 0; 0 0]. AB = O does not force A or B to be O.');
      await sqTo(W, [[0, 0], [0, 0]]); FX.ono('POOF', { x: 50, y: 30 });
      await cont();
    },
    async function () {
      const A = [[1, 1, -1], [2, 0, 3], [3, -1, 2]], B = [[1, 3], [0, 2], [-1, 4]], Cc = [[1, 2, 3, -4], [2, 0, -2, 1]];
      const AB = MM.mul(A, B), L1 = MM.mul(AB, Cc), R1 = MM.mul(A, MM.mul(B, Cc));
      enterScene('mat', (W) => matSet(W, [{ M: AB, name: '(AB)' }, '×', { M: Cc, name: 'C' }, '=', { M: L1, hide: 'all' }], { fs: 14 }));
      exTag('Example 16', '(AB)C = A(BC)');
      await sweepMul(W, 0, 2, 4, 0.06);
      W.items = matSet(W, [{ M: A, name: 'A' }, '×', { M: MM.mul(B, Cc), name: '(BC)' }, '=', { M: R1, hide: 'all' }], { fs: 14 }); await sweepMul(W, 0, 2, 4, 0.06);
      const rt = await tf('(AB)C and A(BC) came out identical', MM.eq(L1, R1)); await verdict(rt, 'Associative law: brackets can move.', 'They match cell by cell: (AB)C = A(BC).');
      exTag('Example 17', '(A + B)C = AC + BC');
      const A7 = [[0, 6, 7], [-6, 0, 8], [7, -8, 0]], B7 = [[0, 1, 1], [1, 0, 2], [1, 2, 0]], C7 = [[2], [-2], [3]];
      W.items = matSet(W, [{ M: MM.add(A7, B7), name: 'A+B' }, '×', { M: C7 }, '=', { M: MM.mul(MM.add(A7, B7), C7), hide: 'all' }]);
      const r = await fields('(A + B)C', mFields(MM.mul(MM.add(A7, B7), C7), 'c')); await verdict(r, '[10; 20; 28], the same as AC + BC = [9; 12; 30] + [1; 8; −2].', 'Row × column with A + B = [0 7 8; −5 0 10; 8 −6 0].'); await revealM(W, 4);
      await cont();
    },
    async function () {
      const A = [[1, 2, 3], [3, -2, 1], [4, 2, 1]], A2 = MM.mul(A, A), A3 = MM.mul(A, A2);
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A' }, '×', { M: A }, '=', { M: A2, name: '', hide: hideAll(A2) }]));
      exTag('Example 18', 'A³ − 23A − 40I = O');
      tapToMultiply(W);
      await task('Tap three cells of A²', () => W.seen.size >= 3, (W) => ['0,0', '1,1', '2,2'].forEach((k) => { W.seen.add(k); W.items[4].hide.delete(k); }));
      await sweepMul(W, 0, 2, 4, 0.08);
      W.items = matSet(W, [{ M: A, name: 'A' }, '×', { M: A2, name: 'A²' }, '=', { M: A3, hide: hideAll(A3) }]);
      const r = await fields('A³: first row', mFields(A3, 'c', [0])); await verdict(r, 'A³ = ' + mStr(A3) + '.', 'Row (1, 2, 3) times the columns of A².'); await revealM(W, 4, 0.04);
      const Z = MM.sub(MM.sub(A3, MM.k(23, A)), MM.k(40, MM.I(3)));
      W.items = matSet(W, [{ M: A3, name: 'A³' }, '− 23A − 40I =', { M: Z, hide: 'all' }]); await revealM(W, 2, 0.08); FX.ono('ZERO!', { x: 50, y: 30 }); SFX.zap();
      await cont();
    },
    async function () {
      const B = [[1000, 500, 5000], [3000, 1000, 10000]], A = [[40], [100], [50]];
      enterScene('mat', (W) => matSet(W, [{ M: B, name: 'B' }, '×', { M: A, name: 'A' }, '=', { M: MM.mul(B, A), hide: 'all' }], { cap: 'contacts (tel, house, letter) in X, Y × paise per contact', fs: 14 }));
      exTag('Example 19', 'election campaign');
      const r = await fields('Total paise spent', mFields(MM.mul(B, A), 'BA')); await verdict(r, '340000 paise = ₹3400 in X, 720000 paise = ₹7200 in Y.', 'Row × column.'); await revealM(W, 4);
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '(m × n)(n × p) = m × p; cᵢₖ = row i · column k', eq: true }, 'AB ≠ BA in general; AB = O can happen with A, B ≠ O.', '(AB)C = A(BC), A(B + C) = AB + AC, IA = AI = A.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'transpose', title: 'Transpose & Symmetry', blurb: 'Flip rows into columns. Symmetric: A′ = A. Skew: A′ = −A. Split any square matrix into both. Examples 20–22.', face: 'kimmy-playful',
  steps: [
    async function () {
      const A = [[3, 5], [R3, 1], [0, -0.2]];
      enterScene('mat', (W) => matSet(W, [{ M: A, name: 'A', sub: '3 × 2' }, '→', { M: MM.T(A), name: 'A′', hide: hideAll(MM.T(A)), sub: '2 × 3' }]));
      await slam('A′', 'Lesson ' + L.num + ' · Section 3.5');
      await J('idle', 'The transpose turns row 1 into column 1, row 2 into column 2… aᵢⱼ moves to position (j, i).');
      const b = button('Flip!'); await waitFor(() => b.clicked()); b.stop();
      for (let i = 0; i < 3; i++) { W.items[0].hl = { r: new Set([i]) }; W.items[2].hl = { c: new Set([i]) }; for (let j = 0; j < 2; j++) W.items[2].hide.delete(j + ',' + i); SFX.flip(); await wait(0.5); }
      W.items[0].hl = W.items[2].hl = null;
      exTag('Example 20', 'A = [3 √3 2; 4 2 0], B = [2 −1 2; 1 2 4]');
      const r = await match('Which rules always hold?', ['(A′)′', '(A + B)′', '(kB)′', '(AB)′'], ['kB′', 'A', 'B′A′', 'A′ + B′'], [1, 3, 0, 2]); await verdict(r, 'Note the order swap in (AB)′ = B′A′.', '(A′)′ = A, (A + B)′ = A′ + B′, (kB)′ = kB′, (AB)′ = B′A′.');
      await cont();
    },
    async function () {
      const A = [[-2], [4], [5]], B = [[1, 3, -6]], AB = MM.mul(A, B);
      enterScene('mat', (W) => matSet(W, [{ M: MM.T(B), name: 'B′' }, '×', { M: MM.T(A), name: 'A′' }, '=', { M: MM.T(AB), hide: hideAll(MM.T(AB)) }]));
      exTag('Example 21', '(AB)′ = B′A′');
      tapToMultiply(W);
      await task('Tap the three cells of the first column', () => [0, 1, 2].every((i) => W.seen.has(i + ',0')), (W) => [0, 1, 2].forEach((i) => { W.seen.add(i + ',0'); W.items[4].hide.delete(i + ',0'); }));
      const r = await fields('Top row of B′A′', mFields(MM.T(AB), 'c', [0])); await verdict(r, '−2, 4, 5: it is the transpose of AB = [−2 −6 12; 4 12 −24; 5 15 −30].', '1 × (−2, 4, 5).'); await revealM(W, 4);
      await cont();
    },
    async function () {
      enterScene('mat', (W) => matSet(W, [{ M: [[R3, 2, 3], [2, -1.5, -1], [3, -1, 1]], name: 'S' }, ' ', { M: [[0, 'e', 'f'], ['−e', 0, 'g'], ['−f', '−g', 0]], name: 'K' }]));
      const mir = (i, j) => (i === j ? C['kin-tint'] : i < j ? C['sora-tint'] : C.sakura); W.items[0].tone = mir; W.items[2].tone = mir;
      await J('idle', 'Fold along the gold diagonal. In S the blue and pink cells match: symmetric. In K they are negatives and the diagonal is 0: skew symmetric.');
      await quiz('In a skew symmetric matrix the diagonal entries are…', ['all 0', 'all 1', 'equal', 'anything'], 0, 'aᵢᵢ = −aᵢᵢ forces aᵢᵢ = 0.');
      await discover('A = ½(A + A′) + ½(A − A′)', 'Symmetric part plus skew part, for every square A.');
      await cont(); hideFound();
    },
    async function () {
      const B = [[2, -2, -4], [-1, 3, 4], [1, -2, -3]], P = MM.k(0.5, MM.add(B, MM.T(B))), Q = MM.k(0.5, MM.sub(B, MM.T(B)));
      enterScene('mat', (W) => matSet(W, [{ M: B, name: 'B' }, '=', { M: P, name: '', hide: 'all' }, '+', { M: Q, hide: 'all' }], { fs: 14 }));
      exTag('Example 22', 'symmetric + skew');
      const r = await fields('P = ½(B + B′): first row', mFields(P, 'p', [0])); await verdict(r, 'P = ' + mStr(P) + '.', '½(2 + 2) = 2, ½(−2 − 1) = −3/2, ½(−4 + 1) = −3/2.'); await revealM(W, 2, 0.05);
      const r2 = await fields('Q = ½(B − B′): first row', mFields(Q, 'q', [0])); await verdict(r2, 'Q = ' + mStr(Q) + '.', '0, ½(−2 + 1) = −1/2, ½(−4 − 1) = −5/2.'); await revealM(W, 4, 0.05);
      W.items[2].tone = (i, j) => (i === j ? C['kin-tint'] : null); W.items[4].tone = (i, j) => (i === j ? C['kin-tint'] : null);
      await K('wow', 'P mirrors itself and Q has a zero diagonal. They add back to B!');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '(AB)′ = B′A′', eq: true }, 'Symmetric: A′ = A. Skew symmetric: A′ = −A (zero diagonal).', 'A = ½(A + A′) + ½(A − A′).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'inverse', title: 'Inverses & Powers', blurb: 'AB = BA = I makes B the inverse. Rotation powers, symmetric products and solving CD − AB = O. Examples 23–25.', face: 'jess-happy',
  steps: [
    async function () {
      enterScene('sq', (W) => { W.label = 'A'; });
      await slam('Aⁿ', 'Lesson ' + L.num + ' · Miscellaneous Examples');
      exTag('Example 23', 'A = [cos θ sin θ; −sin θ cos θ]');
      await J('idle', 'This A turns the square clockwise by θ. Applying it n times turns it by nθ, so Aⁿ = [cos nθ sin nθ; −sin nθ cos nθ].');
      const th = 0.5; const A = rotM(-th); W.n = 0;
      for (let k = 1; k <= 3; k++) { const b = button('Apply A (' + k + ' of 3)'); await waitFor(() => b.clicked()); b.el.parentNode.remove(); W.label = 'A' + ['', '', '²', '³'][k]; await sqTo(W, MM.pow(A, k), 0.5); }
      const rt = await tf('A³ equals the rotation by 3θ: [cos 3θ  sin 3θ; −sin 3θ  cos 3θ]', MM.eq(MM.pow(A, 3), rotM(-3 * th))); await verdict(rt, 'Induction proves it for every n: Aᵏ⁺¹ = A·Aᵏ and the angle-sum formulas.', 'True: three turns by θ make one turn by 3θ.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 24'; W.sub = 'AB symmetric ⇔ AB = BA'; });
      exTag('Example 24', 'A, B symmetric');
      const r = await order('Order the proof', ['A′ = A and B′ = B', '(AB)′ = B′A′ = BA', 'So (AB)′ = AB exactly when BA = AB', 'AB is symmetric ⇔ A and B commute']); await verdict(r, 'The transpose reverses the order.', 'Start with A′ = A, B′ = B.');
      await cont();
    },
    async function () {
      const A = [[2, -1], [3, 4]], B = [[5, 2], [7, 4]], Cm = [[2, 5], [3, 8]], AB = MM.mul(A, B);
      enterScene('mat', (W) => matSet(W, [{ M: Cm, name: 'C' }, '×', { M: [['a', 'b'], ['c', 'd']], name: 'D' }, '=', { M: AB, name: '', hide: 'all' }]));
      exTag('Example 25', 'CD − AB = O');
      const r = await fields('First compute AB', mFields(AB, 'c')); await verdict(r, 'AB = [3 0; 43 22].', 'Row × column.'); await revealM(W, 4);
      W.trace = '2a + 5c = 3, 3a + 8c = 43 · 2b + 5d = 0, 3b + 8d = 22';
      const r2 = await fields('Solve for D', [{ l: 'a', a: -191 }, { l: 'b', a: -110 }, { l: 'c', a: 77 }, { l: 'd', a: 44 }]); await verdict(r2, 'D = [−191 −110; 77 44].', 'Solve the two pairs of equations.');
      await J('happy', 'Check: CD = [2·(−191) + 5·77, …] = [3 0; 43 22] = AB.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'B = A⁻¹ ⇔ AB = BA = I; the inverse is unique', eq: true }, '(AB)⁻¹ = B⁻¹A⁻¹', 'Rotation by θ, n times = rotation by nθ.']); },
  ],
}));

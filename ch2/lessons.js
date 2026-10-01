/* =========================================================
   CHAPTER 2 · RELATIONS & FUNCTIONS — concept lessons (Examples 1–22)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));

/* ================= LESSON 1 · CARTESIAN PRODUCTS ================= */
LESSONS.push(lesson({
  id: 'cart', title: 'Cartesian Products', blurb: 'Ordered pairs, A × B as a grid of points, n(A × B) = pq.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('grid', (W) => gridLoad(W, ['red', 'blue'], ['bag', 'coat', 'shirt'], { labA: 'colour', labB: 'object' }));
      await slam('CARTESIAN PRODUCTS', 'Lesson 1 · Section 2.2');
      await J('idle', 'Two colours, three objects. Every way to colour an object is a point on this grid.');
      const r = await kahoot('How many coloured objects can we make?', ['5', '6', '8', '9'], 1, 15);
      await gridLight(W, prodPairs(['red', 'blue'], ['bag', 'coat', 'shirt']));
      await verdict(r, '2 × 3 = 6 pairs.', 'Count the lit points: 2 × 3 = 6.');
      await cont();
    },
    async function () {
      enterScene('grid', (W) => gridLoad(W, ['DL', 'MP', 'KA'], ['01', '02', '03'], { labA: 'state', labB: 'code', tap: true }));
      await J('idle', 'Licence-plate codes must start with a state: DL, MP or KA, then 01, 02 or 03. Tap all possible codes.');
      await task('Tap all 9 codes on the grid', () => W.on.size >= 9, (W) => { W.on = new Set(prodPairs(W.A, W.B).map(([a, b]) => pk(a, b))); });
      await K('think', 'Is (DL, 01) the same as (01, DL)?');
      await J('happy', 'No! Order matters in an ordered pair. (01, DL) is not even a valid code.');
      await discover('P × Q = {(p, q) : p ∈ P, q ∈ Q}', 'n(P × Q) = n(P) × n(Q). If either set is φ, so is P × Q.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '(x+1, y−2)'; W.sub = 'Example 1'; });
      exTag('Example 1', 'equal ordered pairs');
      await J('think', '(x + 1, y − 2) = (3, 1). Equal pairs means equal first parts AND equal second parts.');
      const r = await fields('Find x and y', [{ l: 'x', a: 2 }, { l: 'y', a: 3 }]); await verdict(r, 'x + 1 = 3 ⇒ x = 2; y − 2 = 1 ⇒ y = 3.', 'x = 2, y = 3.');
      await cont();
    },
    async function () {
      enterScene('grid', (W) => gridLoad(W, ['a', 'b', 'c'], ['r'], { labA: 'P', labB: 'Q', on: prodPairs(['a', 'b', 'c'], ['r']) }));
      exTag('Example 2');
      await J('idle', 'P = {a, b, c}, Q = {r}. Here is P × Q = {(a, r), (b, r), (c, r)}.');
      await quiz('Is P × Q equal to Q × P?', ['Yes', 'No, but same number of elements', 'No, different sizes', 'Only if P = Q'], 1, '(a, r) ≠ (r, a). Both have 3 elements though.');
      await cont();
    },
    async function () {
      enterScene('grid', (W) => gridLoad(W, [1, 2, 3], [3, 4, 5, 6], { labA: 'A', labB: 'B ∪ C' }));
      exTag('Example 3', 'A = {1,2,3}, B = {3,4}, C = {4,5,6}');
      await J('think', 'Four products. B ∩ C = {4}, B ∪ C = {3, 4, 5, 6}.');
      await quiz('n(A × (B ∩ C)) = ?', ['1', '3', '6', '12'], 1, '{(1, 4), (2, 4), (3, 4)}.');
      await gridLight(W, [[1, 4], [2, 4], [3, 4]]); W.caption = 'A × (B ∩ C) = (A × B) ∩ (A × C)';
      await quiz('(A × B) ∩ (A × C) = ?', ['the same 3 points', 'φ', '12 points', 'A × B'], 0, 'Pairs common to both products: second entry must be 4.');
      W.on = new Set(); await gridLight(W, prodPairs([1, 2, 3], [3, 4, 5, 6]), 0.05); W.caption = 'A × (B ∪ C) = (A × B) ∪ (A × C)';
      await quiz('n(A × (B ∪ C)) = ?', ['7', '12', '9', '6'], 1, '3 × 4 = 12, and (A × B) ∪ (A × C) gives the same 12.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'P × P × P'; W.sub = 'Example 4'; });
      exTag('Example 4', 'ordered triplets');
      await pickQ('P = {1, 2}. Tap every element of P × P × P', ['(1,1,1)', '(1,1,2)', '(1,2,1)', '(1,2,2)', '(2,1,1)', '(2,1,2)', '(2,2,1)', '(2,2,2)', '(1,2)', '(3,1,1)'], ['(1,1,1)', '(1,1,2)', '(1,2,1)', '(1,2,2)', '(2,1,1)', '(2,1,2)', '(2,2,1)', '(2,2,2)'], '2 × 2 × 2 = 8 ordered triplets.', { brace: false });
      enterScene('plane', (W) => planeView(W, -4, 4, -3, 3));
      exTag('Example 5');
      await quiz('R × R represents…', ['all points of a line', 'all points of the plane', 'only integer points', 'nothing'], 1, '(x, y) with x, y real: every point of the plane. R × R × R is 3-D space.');
      enterScene('grid', (W) => gridLoad(W, ['p', 'm'], ['q', 'r'], { on: prodPairs(['p', 'm'], ['q', 'r']) }));
      exTag('Example 6');
      await pickQ('A × B = {(p, q), (p, r), (m, q), (m, r)}. A = ?', ['p', 'q', 'r', 'm'], ['p', 'm'], 'A = set of first elements.');
      await pickQ('B = ?', ['p', 'q', 'r', 'm'], ['q', 'r'], 'B = set of second elements.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; });
      await summary(['(a, b) = (x, y) ⇔ a = x and b = y.', { t: 'n(A × B) = n(A) · n(B)', eq: true }, 'A × B ≠ B × A in general. A × φ = φ.', 'R × R = the plane, R × R × R = space.']);
    },
  ],
}));

/* ================= LESSON 2 · RELATIONS ================= */
LESSONS.push(lesson({
  id: 'rel', title: 'Relations', blurb: 'A relation is a subset of A × B. Arrow diagrams, domain, range, codomain, 2^{pq}.', face: 'jess-normal',
  steps: [
    async function () {
      enterScene('arrows', (W) => arrowsLoad(W, ['a', 'b', 'c'], ['Ali', 'Bhanu', 'Binoy', 'Chandra', 'Divya'], { LA: 'P', LB: 'Q' }));
      await slam('RELATIONS', 'Lesson ' + L.num + ' · Section 2.3');
      await J('idle', 'P × Q has 15 pairs. Keep only the pairs where x is the first letter of the name y.');
      const r = await kahoot('How many arrows will there be?', ['3', '4', '5', '15'], 1, 15);
      await arrowsDraw(W, [['a', 'Ali'], ['b', 'Bhanu'], ['b', 'Binoy'], ['c', 'Chandra']]);
      await verdict(r, 'a→Ali, b→Bhanu, b→Binoy, c→Chandra.', 'Four arrows. Divya gets none because there is no d in P.');
      await discover('A relation R from A to B is a subset of A × B', 'The second element of a pair is the image of the first.');
      await cont(); hideFound();
    },
    async function () {
      W.showRange = true;
      await J('think', 'Domain = all first elements used. Range = all second elements hit. Codomain = the whole set B.');
      await pickQ('Domain of R', ['a', 'b', 'c'], ['a', 'b', 'c'], 'Every letter starts some name.');
      await pickQ('Range of R', ['Ali', 'Bhanu', 'Binoy', 'Chandra', 'Divya'], ['Ali', 'Bhanu', 'Binoy', 'Chandra'], 'Divya is in the codomain but not the range.');
      await K('happy', 'So range ⊂ codomain!');
      await cont();
    },
    async function () {
      exTag('Example 7', 'y = x + 1 on A = {1, …, 6}');
      const A = [1, 2, 3, 4, 5, 6]; const p = arrowPart('Draw R = {(x, y) : y = x + 1}', A, A, [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]], { LA: 'A', LB: 'A' });
      await p.pre(); const r = await ask(p); await p.act(); await verdict(r, '(1,2), (2,3), (3,4), (4,5), (5,6).', 'R = {(1,2), (2,3), (3,4), (4,5), (5,6)}.');
      await pickQ('Domain of R', A.map(String), ['1', '2', '3', '4', '5'], '6 has no image (7 ∉ A).');
      await pickQ('Range of R', A.map(String), ['2', '3', '4', '5', '6'], 'Nothing maps to 1.');
      await cont();
    },
    async function () {
      enterScene('arrows', (W) => arrowsLoad(W, [9, 4, 25], [1, 2, -2, 3, -3, 5, -5], { LA: 'P', LB: 'Q', pairs: [[9, 3], [9, -3], [4, 2], [4, -2], [25, 5], [25, -5]] }));
      exTag('Example 8', 'Fig 2.6');
      await quiz('What rule links P to Q?', ['x is the square of y', 'y is the square of x', 'x = y + 6', 'x is twice y'], 0, '9 → ±3, 4 → ±2, 25 → ±5.');
      await quiz('Which element of Q is NOT in the range?', ['2', '1', '−3', '5'], 1, 'No arrow hits 1.');
      await cont();
    },
    async function () {
      enterScene('grid', (W) => gridLoad(W, [1, 2], [3, 4], { tap: true }));
      exTag('Example 9', 'how many relations?');
      await J('idle', 'Every subset of A × B is a relation. A = {1, 2}, B = {3, 4}. Tap any points you like: each pattern is one relation.');
      await task('Make any relation (tap at least one point)', () => W.on.size > 0, (W) => W.on.add(pk(1, 3)));
      await numQ('So how many relations from A to B?', 16, 'n(A × B) = 4, and a 4-element set has 2⁴ = 16 subsets.');
      await discover('Number of relations = 2^{pq}', 'when n(A) = p and n(B) = q.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary(['A relation from A to B is a subset of A × B.', 'Domain: first elements · Range: images · Codomain: all of B.', { t: '#relations = 2^{pq}', eq: true }]);
    },
  ],
}));

/* ================= LESSON 3 · FUNCTIONS ================= */
LESSONS.push(lesson({
  id: 'fun', title: 'Functions', blurb: 'Exactly one arrow from every element. The function machine. The vertical-line test.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('arrows', (W) => arrowsLoad(W, [1, 2, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6], { pairs: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]] }));
      await slam('FUNCTIONS', 'Lesson ' + L.num + ' · Section 2.4');
      await J('idle', 'A function f : A → B is a relation where EVERY element of A has ONE and ONLY ONE image.');
      const b = button('Run the function check'); await waitFor(() => b.clicked()); b.stop(); W.fnCheck = true; SFX.zap();
      await K('wow', '6 has no arrow! So Example 7 is NOT a function.');
      enterScene('arrows', (W) => arrowsLoad(W, [9, 4, 25], [1, 2, -2, 3, -3, 5, -5], { LA: 'P', LB: 'Q', pairs: [[9, 3], [9, -3], [4, 2], [4, -2], [25, 5], [25, -5]] }));
      W.fnCheck = true; SFX.zap();
      await J('think', 'Example 8: 9 shoots two arrows. Not a function either.');
      await cont();
    },
    async function () {
      enterScene('arrows', (W) => arrowsLoad(W, [2, 3, 4], [1, 2], { pairs: [[2, 1], [3, 1], [4, 2]] }));
      exTag('Example 11', 'function or not?');
      await quiz('(i) R = {(2,1), (3,1), (4,2)}', ['Function', 'Not a function'], 0, 'Two arrows may land on the same image. That is fine.');
      W.fnCheck = true; await wait(0.5);
      enterScene('arrows', (W) => arrowsLoad(W, [2, 3, 4], [2, 3, 4], { pairs: [[2, 2], [2, 4], [3, 3], [4, 4]] }));
      await quiz('(ii) R = {(2,2), (2,4), (3,3), (4,4)}', ['Function', 'Not a function'], 1, '2 has two images, 2 and 4.');
      W.fnCheck = true; await wait(0.5);
      enterScene('arrows', (W) => arrowsLoad(W, [1, 2, 3, 4, 5, 6], [2, 3, 4, 5, 6, 7], { pairs: [[1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]] }));
      await quiz('(iii) R = {(1,2), (2,3), (3,4), (4,5), (5,6), (6,7)}', ['Function', 'Not a function'], 0, 'Every element has exactly one image.');
      W.fnCheck = true;
      await cont();
    },
    async function () {
      enterScene('machine', (W) => { W.rule = 'f(x) = 2x'; W.f = (x) => 2 * x; });
      exTag('Example 10', 'f : N → N, y = 2x');
      await J('idle', 'Here is a function as a machine. Every input gets exactly one output.');
      for (const x of [1, 2, 3, 4]) await feed(W, x, { d: 0.25 });
      await quiz('Range of y = 2x on N', ['N', 'even natural numbers', 'odd natural numbers', '{2}'], 1, 'Outputs are 2, 4, 6, …');
      await cont();
    },
    async function () {
      enterScene('machine', (W) => { W.rule = 'f(x) = 2x + 1'; W.f = (x) => 2 * x + 1; W.rows = [1, 2, 3, 4, 5, 6, 7].map((x) => ({ x, yShow: false })); });
      exTag('Example 12', 'complete the table');
      await J('think', 'f(x) = 2x + 1. Predict f(5) before the machine does.');
      await numQ('f(5) = ?', 11, '2 × 5 + 1 = 11.');
      for (const x of [1, 2, 3, 4, 5, 6, 7]) await feed(W, x, { d: 0.18 });
      await K('happy', '3, 5, 7, 9, 11, 13, 15. Odd numbers!');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => { planeView(W, -4, 4, -3, 5); });
      await J('idle', 'On a graph, “one image per x” means any vertical line hits the curve at most once. Drag the red line.');
      W.curves.push(curve((x) => (x * x) / 2, C.sora, { p: 1, t: 'y = x²/2' }));
      vlineTask(W, (x) => [x * x / 2]);
      await task('Drag the vertical line across the parabola', () => (W.vline.moved || 0) > 12, (W) => (W.vline.moved = 20));
      W.curves = [curve((x) => Math.sqrt(Math.max(0, x + 3)), C.beni, { p: 1, x0: -3 }), curve((x) => -Math.sqrt(Math.max(0, x + 3)), C.beni, { p: 1, x0: -3, t: 'y² = x + 3' })];
      W.vline.hits = (x) => (x < -3 ? [] : x === -3 ? [0] : [Math.sqrt(x + 3), -Math.sqrt(x + 3)]); W.vline.moved = 0;
      await task('Now drag it across this sideways parabola', () => (W.vline.moved || 0) > 12, (W) => (W.vline.moved = 20));
      await quiz('Is y² = x + 3 the graph of a function of x?', ['Yes', 'No'], 1, 'Two hits on one vertical line: two images.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary(['f : A → B — every element of A has exactly one image.', 'Many-to-one is allowed. One-to-many is not.', { t: 'Vertical-line test: ≤ 1 hit', eq: true }, 'Real function: domain and range ⊂ R.']);
    },
  ],
}));

/* ================= LESSON 4 · GRAPH GALLERY ================= */
const GAL = [
  { id: 'identity', name: 'Identity f(x) = x', f: (x) => x, dom: 'R', rng: 'R', o: ['R', '[0, ∞)', '{0}', '(−∞, 0)'], a: 0 },
  { id: 'const', name: 'Constant f(x) = 3', f: () => 3, dom: 'R', rng: '{3}', o: ['R', '{3}', '[3, ∞)', '{0, 3}'], a: 1 },
  { id: 'sq', name: 'f(x) = x²  (Example 13)', f: (x) => x * x, dom: 'R', rng: '[0, ∞)', o: ['R', '[0, ∞)', '(0, ∞)', '{0}'], a: 1 },
  { id: 'cube', name: 'f(x) = x³  (Example 14)', f: (x) => x * x * x, dom: 'R', rng: 'R', o: ['[0, ∞)', 'R', '{−1, 0, 1}', '(0, ∞)'], a: 1 },
  { id: 'recip', name: 'f(x) = 1/x  (Example 15)', f: (x) => (Math.abs(x) < 1e-9 ? NaN : 1 / x), dom: 'R − {0}', rng: 'R − {0}', o: ['R', 'R − {0}', '(0, ∞)', '{1}'], a: 1 },
  { id: 'mod', name: 'Modulus f(x) = |x|', f: (x) => Math.abs(x), dom: 'R', rng: '[0, ∞)', o: ['R', '[0, ∞)', '(0, ∞)', '{−1, 1}'], a: 1 },
  { id: 'sgn', name: 'Signum f(x) = |x|/x, 0 at 0', f: (x) => Math.sign(x), dom: 'R', rng: '{−1, 0, 1}', o: ['R', '{−1, 1}', '{−1, 0, 1}', '[−1, 1]'], a: 2, open: [[0, 1], [0, -1]], closed: [[0, 0]] },
  { id: 'gif', name: 'Greatest integer f(x) = [x]', f: (x) => Math.floor(x + 1e-12), dom: 'R', rng: 'Z', o: ['R', 'Z', 'N', '[0, ∞)'], a: 1 },
];
LESSONS.push(lesson({
  id: 'graphs', title: 'Graph Gallery', blurb: 'Identity, constant, x², x³, 1/x, |x|, signum and [x]: trace each one live.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('plane', (W) => planeView(W, -4, 4, -3, 4));
      await slam('GRAPH GALLERY', 'Lesson ' + L.num + ' · Section 2.4.1');
      await J('idle', 'Eight famous real functions. For each one: it draws, you trace it, then you name its range.');
      await cont('Open the gallery');
    },
    ...GAL.map((g) => async function () {
      enterScene('plane', (W) => planeView(W, -4, 4, -3.2, 4.2));
      exTag(g.name.split('  ')[1] || 'Gallery', g.name.split('  ')[0]);
      const c = curve(g.f, C.sora, { open: g.open, closed: g.closed, n: g.id === 'gif' || g.id === 'sgn' ? 1600 : 600, jump: g.id === 'gif' || g.id === 'sgn' ? 0.5 : null }); await drawCurves(W, [c], 0.9);
      if (g.id === 'gif') { for (let k = -4; k <= 3; k++) { W.pts.push({ x: k, y: k, r: 4, col: C.sora }, { x: k + 1, y: k, r: 4, open: true, col: C.sora }); } }
      tracerOn(W, g.f, 'f', g.id === 'recip' ? 1 : 1.5);
      await task('Drag Kimmy along the curve', () => (W.tracer.moved || 0) > 6, (W) => (W.tracer.moved = 9));
      const r = await kahoot('Range of ' + g.name.split('  ')[0] + ' ?', g.o, g.a, 15);
      W.tracer.on = false; live(null);
      if (g.id === 'recip') W.shadeY = null; else W.shadeY = g.rng === '[0, ∞)' ? { a: 0, b: 9 } : g.rng === 'R' || g.rng === 'Z' ? { a: -9, b: 9 } : null;
      await verdict(r, 'Domain ' + g.dom + ', range ' + g.rng + '.', 'Range is ' + g.rng + '. Domain ' + g.dom + '.');
      if (g.id === 'recip') await quiz('Example 15: 1/x at x = −1.5 ≈ ?', ['−0.67', '−1.5', '0.67', '−0.5'], 0, '1/(−1.5) = −2/3 ≈ −0.67.');
      if (g.id === 'sq') await quiz('Example 13: f(−3) = ?', ['−9', '9', '6', '−6'], 1, '(−3)² = 9.');
      if (g.id === 'cube') await quiz('Example 14: f(−2) = ?', ['8', '−8', '−6', '4'], 1, '(−2)³ = −8.');
      if (g.id === 'gif') await quiz('[−1.5] = ?', ['−1', '−2', '1', '−1.5'], 1, 'Greatest integer ≤ −1.5 is −2.');
      await cont();
    }),
    async function () {
      enterScene('plane', (W) => planeView(W, -3, 4, -1, 4));
      await J('think', 'Why is h(x) = x^{2/3} + 2x NOT a polynomial function?');
      await quiz('Because…', ['the power 2/3 is not a non-negative integer', 'it has two terms', 'it is not defined at 0', 'it is linear'], 0, 'Polynomials only use powers 0, 1, 2, 3, …');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary(['Identity & x³: range R.  x² & |x|: [0, ∞).', 'Constant c: range {c}.  1/x: R − {0}.', { t: 'signum: {−1, 0, 1} · [x]: Z', eq: true }]);
    },
  ],
}));

/* ================= LESSON 5 · ALGEBRA OF FUNCTIONS + MISC EXAMPLES ================= */
LESSONS.push(lesson({
  id: 'alg', title: 'Algebra of Functions', blurb: 'f + g, f − g, fg, f/g as stacked bars. Examples 16–22.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('plane', (W) => planeView(W, -3, 3, -3, 6));
      await slam('ALGEBRA OF FUNCTIONS', 'Lesson ' + L.num + ' · Section 2.4.2');
      exTag('Example 16', 'f(x) = x², g(x) = 2x + 1');
      const f = (x) => x * x, g = (x) => 2 * x + 1;
      await drawCurves(W, [curve(f, C.sora, { t: 'f' }), curve(g, C.khaki, { t: 'g' })], 0.6);
      W.ax = 1; W.overlay = () => { const x = W.ax; const a = toS(x, 0), b = toS(x, f(x)), c = toS(x, f(x) + g(x)); ctx.lineWidth = 8; ctx.strokeStyle = C.sora; ctx.beginPath(); ctx.moveTo(a[0] - 5, a[1]); ctx.lineTo(b[0] - 5, b[1]); ctx.stroke(); ctx.strokeStyle = C.khaki; ctx.beginPath(); ctx.moveTo(a[0] + 5, a[1]); ctx.lineTo(a[0] + 5, toS(x, g(x))[1]); ctx.stroke(); D.dot(x, f(x) + g(x), 7, C.beni); D.text('(f+g)(' + fmtN(x, 2) + ') = ' + fmtN(f(x) + g(x), 2), c[0] + 10, c[1], { size: 12, w: 800, align: 'left', stroke: C.paper }); };
      await J('idle', 'Add pointwise: (f + g)(x) = f(x) + g(x). Slide x and watch the bars stack.');
      slider('x', -2.5, 2, 0.25, 1, (v) => fmtN(v, 2), (v) => (W.ax = v), -1);
      await drawCurves(W, [curve((x) => f(x) + g(x), C.beni, { t: 'f + g', w: 4 })], 0.8);
      await quiz('(f + g)(x) = ?', ['x² + 2x + 1', 'x² − 2x − 1', '2x³ + x²', 'x² + 2x'], 0, 'Add the formulas.');
      await quiz('(f − g)(x) = ?', ['x² − 2x + 1', 'x² − 2x − 1', 'x² + 2x − 1', '−x² + 2x + 1'], 1, 'x² − (2x + 1).');
      await quiz('(fg)(x) = ?', ['2x³ + x²', 'x² + 2x + 1', '2x² + x', '2x³ + 1'], 0, 'x²(2x + 1).');
      await quiz('(f/g)(x) = x²/(2x + 1), valid for…', ['all x', 'x ≠ −1/2', 'x ≠ 0', 'x > 0'], 1, 'g(x) ≠ 0 ⇒ x ≠ −1/2.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => planeView(W, -0.5, 5, -1, 5));
      exTag('Example 17', 'f(x) = x, g(x) = √x on x ≥ 0');
      await drawCurves(W, [curve((x) => x, C.sora, { x0: 0, t: 'f' }), curve((x) => Math.sqrt(x), C.khaki, { x0: 0, t: 'g' })], 0.5);
      await quiz('(fg)(x) = x·√x = ?', ['x^{3/2}', 'x²', '√x', 'x^{1/2}'], 0, 'x¹ · x^{1/2} = x^{3/2}.');
      await quiz('(f/g)(x) = x/√x = ?', ['x^{1/2}', 'x^{−1/2}', 'x', '1'], 0, 'x / x^{1/2} = x^{1/2}, for x ≠ 0.');
      await cont();
    },
    async function () {
      enterScene('machine', (W) => { W.rule = 'f(x) = x + 10'; W.f = (x) => x + 10; });
      exTag('Example 18', 'linear function');
      for (const x of [-10, -2, 0, 2, 10]) await feed(W, x, { d: 0.18 });
      enterScene('plane', (W) => planeView(W, -12, 4, -2, 14, 2, 2));
      await drawCurves(W, [curve((x) => x + 10, C.sora, { t: 'y = x + 10' })]);
      await J('happy', 'f(x) = mx + c is a LINEAR function: a straight line.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => { planeView(W, -3, 3, -4, 4); W.pts.push({ x: 1, y: 1, t: '(1, 1)' }, { x: 2, y: 3, t: '(2, 3)' }, { x: 0, y: -1, t: '(0, −1)' }, { x: -1, y: -3, t: '(−1, −3)' }); });
      exTag('Example 20', 'f = {(1,1), (2,3), (0,−1), (−1,−3)} is linear');
      await J('think', 'f(x) = mx + c. Use f(0) = −1 and f(1) = 1.');
      const r = await fields('Find m and c', [{ l: 'm', a: 2 }, { l: 'c', a: -1 }]); await verdict(r, 'c = −1, m + c = 1 ⇒ m = 2. So f(x) = 2x − 1.', 'm = 2, c = −1.');
      await drawCurves(W, [curve((x) => 2 * x - 1, C.beni, { t: 'f(x) = 2x − 1' })]);
      await cont();
    },
    async function () {
      enterScene('plane', (W) => planeView(W, -2, 7, -6, 10, 1, 2));
      exTag('Example 21', 'domain');
      await J('idle', 'f(x) = (x² + 3x + 5)/(x² − 5x + 4). Where does the bottom vanish?');
      await pickQ('Excluded values of x', ['−4', '−1', '0', '1', '4', '5'], ['1', '4'], 'x² − 5x + 4 = (x − 1)(x − 4).', { brace: false });
      await drawCurves(W, [curve((x) => (x * x + 3 * x + 5) / (x * x - 5 * x + 4), C.sora, { n: 1400 })]); W.curves.push(curve(() => 0, C.beni, { a: 0 }));
      W.vecs.push({ x0: 1, y0: -6, x1: 1, y1: 10, col: C.beni, dash: true, t: 'x = 1' }, { x0: 4, y0: -6, x1: 4, y1: 10, col: C.beni, dash: true, t: 'x = 4' });
      await J('happy', 'Domain = R − {1, 4}.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => planeView(W, -4, 4, -1, 6));
      exTag('Example 22', 'piecewise');
      await J('idle', 'f(x) = 1 − x for x < 0, 1 at x = 0, x + 1 for x > 0.');
      await quiz('f(−3) = ?', ['−2', '4', '1', '−4'], 1, '1 − (−3) = 4.');
      await drawCurves(W, [curve((x) => (x < 0 ? 1 - x : x > 0 ? x + 1 : 1), C.sora, { closed: [[0, 1]] })]);
      await K('happy', 'A V shape that sits on (0, 1)!');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'a − b ∈ Z'; W.sub = 'Example 19'; });
      exTag('Example 19', 'R = {(a, b) : a, b ∈ Q, a − b ∈ Z}');
      await quiz('(a, a) ∈ R because a − a = …', ['0 ∈ Z', '1', 'a', '2a'], 0, '0 is an integer.');
      await quiz('If a − b ∈ Z then b − a = −(a − b) is…', ['an integer, so (b, a) ∈ R', 'not an integer', 'zero', 'rational only'], 0, 'Negatives of integers are integers.');
      await quiz('If a − b, b − c ∈ Z then a − c = (a − b) + (b − c) is…', ['an integer', 'not defined', 'zero', 'irrational'], 0, 'Sum of integers. So (a, c) ∈ R.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: '(f ± g)(x) = f(x) ± g(x)', eq: true }, '(fg)(x) = f(x)g(x),  (kf)(x) = k·f(x)', '(f/g)(x) = f(x)/g(x), only where g(x) ≠ 0', 'Domain of a rational function: remove zeros of the bottom.']);
    },
  ],
}));

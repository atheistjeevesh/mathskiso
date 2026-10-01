/* =========================================================
   CHAPTER 9 · STRAIGHT LINES — concept lessons (Examples 1–16)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const lv = (x0, x1, y0, y1) => (W) => planeView(W, x0, x1, y0, y1);

LESSONS.push(lesson({
  id: 'slope', title: 'Slope of a Line', blurb: 'Grab two points, watch rise over run, then tilt lines until they are parallel or perpendicular. Examples 1–3.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('lines', lv(-6, 6, -4, 4));
      await slam('SLOPE', 'Lesson 1 · Section 9.2');
      const U = userLine(W, { p: [-2, -1], q: [2, 1] }); W.tri = () => [U.p, U.q];
      await J('idle', 'Slope m = rise ÷ run = (y₂ − y₁)/(x₂ − x₁) = tan θ. Drag the gold handles.');
      await task('Make the slope negative', () => isFinite(L9.slope(U.line())) && L9.slope(U.line()) < 0, (W) => { U.q[0] = 2; U.q[1] = -2; });
      await task('Now make it a vertical line', () => !isFinite(L9.slope(U.line())), (W) => { U.q[0] = U.p[0]; U.q[1] = 2; });
      await K('wow', 'Run = 0: the slope is undefined!');
      await discover('m = (y₂ − y₁)/(x₂ − x₁) = tan θ', 'Horizontal: m = 0. Vertical: m undefined.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('lines', lv(-3, 8, -4, 5)); W.pts.push(pt9(3, -2, 'A(3, −2)'));
      exTag('Example 1', 'slopes through (3, −2)');
      const r = await fields('Slope through (3, −2) and…', [{ l: '(−1, 4)', a: -1.5, show: '−3/2' }, { l: '(7, −2)', a: 0 }, { l: '60° incline', a: Math.sqrt(3), show: '√3', tol: 0.01 }], { keys: '√' }); await verdict(r, '6/(−4) = −3/2, 0/4 = 0, tan 60° = √3. Through (3, 4) the run is 0: undefined.', '−3/2, 0, √3; and (3, 4) gives undefined.');
      await drawLines(W, [lineOf(6, 4, -10, { t: 'm = −3/2' }), lineOf(0, 1, 2, { col: C['matcha-deep'], t: 'm = 0' }), lineOf(1, 0, -3, { col: C.ink, t: 'undefined' })], 0.5);
      await cont();
    },
    async function () {
      enterScene('lines', lv(-6, 6, -4, 4)); W.L.push(lineOf(1, -2, 0, { t: 'm₁ = 1/2', col: C.ink }));
      await J('think', 'Parallel lines: equal slopes. Perpendicular lines: m₁m₂ = −1. Tilt your line about the origin.');
      const U = userLine(W, { mode: 'pivot', piv: [0, 0], deg: 60 });
      await task('Make your line perpendicular to the black one', () => U.deg === Math.round(degOf(-2)), (W) => (U.deg = Math.round(degOf(-2))));
      await K('happy', 'm₂ = −2, and (1/2)(−2) = −1!');
      await discover('tan θ = |(m₂ − m₁)/(1 + m₁m₂)|', 'The acute angle θ between two lines.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('lines', lv(-6, 6, -4, 4)); W.L.push(lineOf(1, -2, 0, { t: 'm₁ = 1/2', col: C.ink }));
      exTag('Example 2', 'angle π/4, one slope 1/2');
      const U = userLine(W, { mode: 'pivot', piv: [0, 0], deg: 10 });
      await task('Find a line at 45° to the black line', () => [72, 162].includes(U.deg) || Math.abs(U.deg - 71.57) < 1 || Math.abs(U.deg - 161.57) < 1, (W) => (U.deg = 72));
      await quiz('(m − 1/2)/(1 + m/2) = ±1 gives m = ?', ['3 or −1/3', '3 only', '1 or −1', '2 or −1/2'], 0, 'Two answers: the 45° can open either way.');
      exTag('Example 3', '(−2, 6),(4, 8) ⟂ (8, 12),(x, 24)');
      await numQ('m₁ = 1/3, m₂ = 12/(x − 8), m₁m₂ = −1 ⇒ x = ?', 4, 'x = 4.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'm = tan θ = rise/run', eq: true }, 'Parallel: m₁ = m₂.  Perpendicular: m₁m₂ = −1.', 'Collinear A, B, C ⇔ slope AB = slope BC.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'forms', title: 'Equations of a Line', blurb: 'Point–slope, two-point, slope–intercept, intercept form, all built by dragging. Examples 4–8.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('lines', lv(-6, 4, -2, 5)); W.pts.push(pt9(-2, 3, '(−2, 3)'));
      await slam('y − y₀ = m(x − x₀)', 'Lesson ' + L.num + ' · Section 9.3');
      exTag('Example 4', 'lines through (−2, 3) parallel to the axes');
      await J('idle', 'Every point on a horizontal line has the same y. Every point on a vertical line has the same x.');
      const r = await fields('Equations', [{ l: 'parallel to x-axis: y', a: 3 }, { l: 'parallel to y-axis: x', a: -2 }]); await drawLines(W, [lineOf(0, 1, -3, { t: 'y = 3' }), lineOf(1, 0, 2, { col: C['matcha-deep'], t: 'x = −2', tAt: 0.9 })], 0.4); await verdict(r, 'y = 3 and x = −2.', 'y = 3 and x = −2.');
      await cont();
    },
    async function () {
      enterScene('lines', lv(-6, 4, -4, 6)); W.pts.push(pt9(-2, 3, '(−2, 3)'));
      exTag('Example 5', 'through (−2, 3), slope −4');
      const p = linePart('Drag the line: through (−2, 3) with slope −4', lineOf(4, 1, 5), { p: [-2, 3], q: [0, 0] }); await p.pre(); const r = await ask(p); await p.act(W, r); await verdict(r, 'y − 3 = −4(x + 2), i.e. 4x + y + 5 = 0.', 'y − 3 = −4(x + 2) ⇒ 4x + y + 5 = 0.');
      await cont();
    },
    async function () {
      enterScene('lines', lv(-3, 6, -3, 6)); W.pts.push(pt9(1, -1, '(1, −1)'), pt9(3, 5, '(3, 5)'));
      exTag('Example 6', 'two-point form');
      const p = linePart('Drag the line through (1, −1) and (3, 5)', lineOf(-3, 1, 4), { p: [0, 0], q: [2, 0] }); await p.pre(); const r = await ask(p); await p.act(W, r); await verdict(r, 'y + 1 = (6/2)(x − 1) ⇒ −3x + y + 4 = 0.', '−3x + y + 4 = 0.');
      await cont();
    },
    async function () {
      enterScene('lines', lv(-4, 7, -3, 3));
      exTag('Example 7', 'tan θ = 1/2');
      await J('idle', 'y = mx + c uses the y-intercept c; y = m(x − d) uses the x-intercept d.');
      const r = await fields('Write ay − x + b = 0', [{ l: '(i) c = −3/2: 2y − x + ', a: 3 }, { l: '(ii) d = 4: 2y − x + ', a: 4 }]); await verdict(r, '2y − x + 3 = 0 and 2y − x + 4 = 0.', '2y − x + 3 = 0 and 2y − x + 4 = 0.');
      await drawLines(W, [lineOf(-1, 2, 3, { t: 'c = −3/2', tAt: 0.9 }), lineOf(-1, 2, 4, { col: C['matcha-deep'], t: 'd = 4', tAt: 0.65 })], 0.45);
      exTag('Example 8', 'intercepts −3 and 2');
      await quiz('x/(−3) + y/2 = 1 becomes…', ['2x − 3y + 6 = 0', '2x + 3y − 6 = 0', '3x − 2y + 6 = 0', '2x − 3y − 6 = 0'], 0, 'Multiply by −6.');
      await discover('x/a + y/b = 1', 'Intercept form. General form: Ax + By + C = 0.');
      await cont(); hideFound();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['y − y₀ = m(x − x₀)', 'y = mx + c,  y = m(x − d)', { t: 'x/a + y/b = 1;  Ax + By + C = 0', eq: true }]); },
  ],
}));

LESSONS.push(lesson({
  id: 'dist', title: 'Distance from a Line', blurb: 'Drag a point around and watch the perpendicular distance update live. Examples 9–10.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('lines', lv(-2, 10, -8, 2)); const l = lineOf(3, -4, -26, { t: '3x − 4y − 26 = 0', tAt: 0.3 }); W.L.push(l);
      await slam('d = |Ax₁ + By₁ + C|/√(A² + B²)', 'Lesson ' + L.num + ' · Section 9.4');
      const P = dropPoint(W, [3, -1], l, { drag: true, t: 'P' });
      await J('idle', 'The distance from P to the line is the length of the perpendicular. Drag P!');
      await task('Drag P onto the line (distance 0)', () => L9.dist(l, [P.x, P.y]) < 0.05, (W) => { P.x = 6; P.y = -2; });
      await K('wow', 'Ax₁ + By₁ + C = 0 exactly when P is on the line.');
      exTag('Example 9', 'distance of (3, −5)');
      gsap.to(P, { x: 3, y: -5, duration: 0.6 });
      await numQ('|9 + 20 − 26|/5 = ?', 0.6, '3/5.', { show: '3/5' });
      await cont();
    },
    async function () {
      enterScene('lines', lv(-4, 4, -2, 4)); const l1 = lineOf(3, -4, 7, { t: 'C₁ = 7' }), l2 = lineOf(3, -4, 5, { col: C['matcha-deep'], t: 'C₂ = 5', tAt: 0.6 }); W.L.push(l1, l2);
      exTag('Example 10', 'parallel lines 3x − 4y + 7 = 0, 3x − 4y + 5 = 0');
      dropPoint(W, [-1, 1], l2, { t: 'on L₁' });
      await discover('d = |C₁ − C₂|/√(A² + B²)', 'Same A and B for parallel lines.');
      await numQ('|7 − 5|/5 = ?', 0.4, '2/5.', { show: '2/5' });
      hideFound(); await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'd = |Ax₁ + By₁ + C|/√(A² + B²)', eq: true }, 'Parallel lines: d = |C₁ − C₂|/√(A² + B²)']); },
  ],
}));

LESSONS.push(lesson({
  id: 'mixed', title: 'Lines in Action', blurb: 'Concurrency, distance along a line, mirror images, a bisected segment. Examples 11–16.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('lines', lv(-3, 4, -3, 4)); await drawLines(W, [lineOf(2, 1, -3, { t: '2x + y = 3' }), lineOf(3, -1, -2, { col: C['matcha-deep'], t: '3x − y = 2', tAt: 0.6 })], 0.4);
      await slam('MIXED', 'Lesson ' + L.num + ' · Examples 11–16');
      exTag('Example 11', 'concurrent lines');
      const r = await fields('Where do the first two meet?', [{ l: 'x', a: 1 }, { l: 'y', a: 1 }]); W.pts.push(pt9(1, 1, '(1, 1)')); await verdict(r, '(1, 1).', '(1, 1).');
      await numQ('5x + ky − 3 = 0 must pass through (1, 1) ⇒ k = ?', -2, 'k = −2.'); await drawLines(W, [lineOf(5, -2, -3, { col: C.beni, t: 'k = −2', tAt: 0.4 })], 0.4);
      await cont();
    },
    async function () {
      enterScene('lines', lv(-1, 6, -1, 6)); W.L.push(lineOf(4, -1, 0, { t: '4x − y = 0', tAt: 0.7 })); W.pts.push(pt9(4, 1, 'P(4, 1)'));
      exTag('Example 12', 'distance along a 135° line');
      const U = userLine(W, { mode: 'pivot', piv: [4, 1], deg: 60 });
      await task('Rotate the line through P to 135°', () => U.deg === 135, (W) => (U.deg = 135));
      W.pts.push(pt9(1, 4, 'Q(1, 4)')); SFX.snap();
      await numQ('PQ = √(9 + 9) = ? (type 3√2 or a decimal)', 3 * Math.SQRT2, '3√2 ≈ 4.24.', { show: '3√2', tol: 0.01, keys: '√' });
      await cont();
    },
    async function () {
      enterScene('lines', lv(-3, 4, -1, 4)); const l = lineOf(1, -3, 4, { t: 'x − 3y + 4 = 0', tAt: 0.15 }); W.L.push(l);
      exTag('Example 13', 'image of (1, 2) in x − 3y + 4 = 0');
      const P = pt9(1, 2, 'P'); W.pts.push(P); const M = { P: () => [P.x, P.y], l, k: 0 }; W.mirrors.push(M);
      await J('idle', 'The mirror line is the perpendicular bisector of P and its image.');
      const b = button('Reflect!'); await waitFor(() => b.clicked()); b.stop(); gsap.to(M, { k: 1, duration: 0.8 }); SFX.whoosh(); FX.ono('PING!', { x: 60, y: 30 }); await wait(0.9);
      const r = await fields('Image Q(h, k)', [{ l: 'h', a: 1.2, show: '6/5' }, { l: 'k', a: 1.4, show: '7/5' }]); await verdict(r, 'Slope of PQ = −3 and the midpoint is on the line: (6/5, 7/5).', '(6/5, 7/5).');
      await cont();
    },
    async function () {
      enterScene('lines', lv(-3, 4, -2, 9)); W.L.push(lineOf(5, -1, 4, { t: '5x − y + 4 = 0', tAt: 0.95 }), lineOf(3, 4, -4, { col: C['matcha-deep'], t: '3x + 4y − 4 = 0', tAt: 0.2 })); W.pts.push(pt9(1, 5, 'M(1, 5)'));
      exTag('Example 14', 'area by y = m₁x + c₁, y = m₂x + c₂, x = 0');
      const r1 = await order('Order the proof', ['Two vertices on x = 0: (0, c₁) and (0, c₂)', 'Third vertex: x = (c₂ − c₁)/(m₁ − m₂)', 'Base |c₁ − c₂|, height |x| of the third vertex', 'Area = (c₁ − c₂)²/(2|m₁ − m₂|)']); await verdict(r1, 'Use the y-axis as the base.', 'Base on the y-axis, height = |x| of the third vertex.');
      exTag('Example 15', 'segment bisected at (1, 5)');
      await quiz('Solving α₁ + α₂ = 2, 20α₁ − 3α₂ = 20 gives the line…', ['107x − 3y − 92 = 0', '107x + 3y − 122 = 0', 'x − 3y + 14 = 0', '5x − y = 0'], 0, 'Through (1, 5) and (26/23, 222/23).');
      await drawLines(W, [lineOf(107, -3, -92, { col: C.beni, t: '107x − 3y − 92 = 0', tAt: 0.5 })], 0.5);
      await cont();
    },
    async function () {
      enterScene('lines', lv(-2, 5, -4, 4)); W.L.push(lineOf(3, -2, -5, { t: '3x − 2y = 5', tAt: 0.85 }), lineOf(3, 2, -5, { col: C['matcha-deep'], t: '3x + 2y = 5', tAt: 0.15 }));
      exTag('Example 16', 'equidistant from 3x − 2y = 5 and 3x + 2y = 5');
      const P = pt9(0, 2, 'P'); W.pts.push(P); W.feet.push({ P: () => [P.x, P.y], l: W.L[0] }, { P: () => [P.x, P.y], l: W.L[1] }); W.drags = [{ get: () => [P.x, P.y], r: 0.7, set: (x, y) => { P.x = Math.round(x * 6) / 6; P.y = Math.round(y * 2) / 2; } }];
      await task('Drag P until both distances are equal', () => Math.abs(L9.dist(W.L[0], [P.x, P.y]) - L9.dist(W.L[1], [P.x, P.y])) < 0.02, (W) => { P.x = 2; P.y = 0; });
      await quiz('All such points lie on…', ['y = 0 or x = 5/3', 'y = x', 'x = 0 only', 'a circle'], 0, '|3h − 2k − 5| = |3h + 2k − 5| ⇒ k = 0 or h = 5/3.');
      await drawLines(W, [lineOf(0, 1, 0, { col: C.beni, t: 'y = 0' }), lineOf(3, 0, -5, { col: C.beni, t: 'x = 5/3', tAt: 0.9 })], 0.4);
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['Concurrent: the meeting point of two satisfies the third.', 'Mirror line = perpendicular bisector of P and its image.', { t: 'Distance along a line: intersect, then use the distance formula', eq: true }]); },
  ],
}));

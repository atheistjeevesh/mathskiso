/* =========================================================
   CLASS 12 · CHAPTER 8 · APPLICATION OF INTEGRALS — lessons (Examples 1–4), Exercise 8.1, Miscellaneous
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const { sin, cos, sqrt, abs } = Math;
const PI = Math.PI;
const hzScene = (g, c, d, v, o = {}) => (W) => { Object.assign(W, { f: null, F: null, a: null, b: null, ys: 1, n: 0, shade: 0, extra: [], strip: null, mirror: 0, rd: null, read: false, cap: o.cap || '' }); W.hz = { g, c, d, p: 0, y0: o.y0, y1: o.y1 }; planeView(W, ...v); W.pl.fy = null; };
async function hzStrip(W, c, d) { W.strip = { h: true, y: c }; SFX.swish(); await tw(W.strip, { y: d, duration: AUTO ? 0.05 : 1.3, ease: 'power1.inOut' }); W.strip = null; }

LESSONS.push(lesson({
  id: 'strips', title: 'Area = Sum of Strips', blurb: 'Slice the region into thin strips, add them up, and take care with parts below the x-axis. Section 8.2.', face: 'kimmy-curious',
  steps: [
    async function () {
      const f = (x) => 0.25 * x * x + 1;
      enterScene('area', (W) => areaSet(W, f, -0.6, 5, { ab: [1, 4] }));
      await slam('∫ = AREA', 'Class 12 · Ch 8 · Section 8.2');
      await J('idle', 'Here is y = x²/4 + 1 between x = 1 and x = 4. Cut the region into thin vertical strips. Each strip has height y and width dx.');
      W.strip = { x: 1.5 }; W.drags = [{ get: () => [W.strip.x, f(W.strip.x) / 2], r: 1, set: (x) => { const v = clamp(Math.round(x * 4) / 4, 1, 4); if (v !== W.strip.x) { W.strip.x = v; SFX.tick(); } } }];
      await task('Drag the gold strip to x = 3', () => W.strip.x === 3, (W) => (W.strip.x = 3));
      await K('think', 'One strip is a tiny rectangle, dA = y dx. But the region has a curved top. How do we add infinitely many?');
      await J('happy', 'That is exactly what the integral does. Watch the rectangles fill it.');
      W.strip = null; W.drags = []; W.shade = 1;
      const sl = slider('strips n', 1, 40, 1, 1, (v) => 'n = ' + v, (v) => (W.n = v), 40);
      await task('Slide to 40 strips', () => W.n >= 40, (W) => { W.n = 40; sl.value = 40; });
      await discover('A = ∫ₐᵇ y dx = ∫ₐᵇ f(x) dx', 'Area under y = f(x) from x = a to x = b, above the x-axis.');
      await numQ('Area = ∫₁⁴ (x²/4 + 1) dx = ?', 33 / 4, '[x³/12 + x] from 1 to 4 = 64/12 + 4 − 1/12 − 1 = 33/4.', { show: '33/4' });
      W.rd = [['area = 33/4 = 8.25', C['matcha-deep']]]; await cont(); hideFound();
    },
    async function () {
      const g = (y) => (y * y) / 2;
      enterScene('area', hzScene(g, 0, 2, [-1, 4.5, -1, 3], { y0: -0.2, y1: 2.4 }));
      exTag('Fig 8.2', 'horizontal strips');
      await J('idle', 'Some curves are easier as x = g(y). Then slice sideways: each strip has length x and thickness dy.');
      W.strip = { h: true, y: 0.5 }; W.drags = [{ get: () => [g(W.strip.y) / 2, W.strip.y], r: 1, set: (x, y) => { const v = clamp(Math.round(y * 4) / 4, 0, 2); if (v !== W.strip.y) { W.strip.y = v; SFX.tick(); } } }];
      await task('Drag the strip up to y = 1.5', () => W.strip.y === 1.5, (W) => (W.strip.y = 1.5));
      W.drags = []; W.strip = null; await hzRun(W);
      await discover('A = ∫꜀ᵈ x dy = ∫꜀ᵈ g(y) dy', 'Area between x = g(y), the y-axis, and y = c, y = d.');
      await numQ('Area between x = y²/2, the y-axis, y = 0 and y = 2 = ?', 4 / 3, '[y³/6] from 0 to 2 = 8/6 = 4/3.', { show: '4/3' });
      await cont(); hideFound();
    },
    async function () {
      const f = (x) => x * x - 1;
      enterScene('area', (W) => areaSet(W, f, -0.8, 2.6, { ab: [0, 2] }));
      exTag('Remark', 'curve below the x-axis');
      await J('think', 'y = x² − 1 dips below the axis from 0 to 1. There the integral comes out negative.');
      await shadeRun(W); W.rd = pieceLines(f, 0, 2);
      await K('surprised', 'So ∫₀² (x² − 1) dx = −2/3 + 4/3 = 2/3. Is the area 2/3?');
      await quiz('Area between y = x² − 1, the x-axis, x = 0 and x = 2 =', ['|A₁| + A₂ = 2/3 + 4/3 = 2', '∫₀² (x² − 1) dx = 2/3', '4/3 − 2/3 = 2/3', '4/3'], 0, 'Area never cancels: take the absolute value of each piece.');
      W.rd.push(['area = 2/3 + 4/3 = 2', C['matcha-deep']]);
      await discover('A = |A₁| + A₂', 'Split at the zeros of f and add the absolute values of the pieces.');
      await cont(); hideFound();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'A = ∫ₐᵇ f(x) dx (vertical strips),  A = ∫꜀ᵈ g(y) dy (horizontal strips)', eq: true }, 'Below the x-axis the integral is negative: area = |∫|. Split at the zeros of f.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'circle', title: 'Circles & Ellipses', blurb: 'One quadrant, then ×4 by symmetry. Examples 1 and 2.', face: 'jess-thinking',
  steps: [
    async function () {
      const setA = (W, a) => { const f = ellF(a, a); W.f = f; W.b = a; W.extra = [{ f, x0: -a, x1: a }, { f: (x) => -f(x), x0: -a, x1: a }]; };
      enterScene('area', (W) => { areaSet(W, ellF(2, 2), -5.5, 5.5, { ab: [0, 2], y: [-3.6, 3.6] }); setA(W, 2); });
      await slam('πa²', 'Example 1 · the circle x² + y² = a²');
      exTag('Example 1', 'area of a circle');
      await J('idle', 'The circle is symmetric about both axes, so find the first-quadrant piece and multiply by 4. On the arc, y = √(a² − x²).');
      await stripSweep(W, 0, 2); await shadeRun(W);
      await quiz('Whole area =', ['4∫₀ᵃ √(a² − x²) dx', '∫₀ᵃ √(a² − x²) dx', '2∫₋ₐᵃ (a² − x²) dx', '4∫₀ᵃ (a² − x²) dx'], 0, 'Four equal quadrants, each ∫₀ᵃ y dx.');
      await quiz('∫₀ᵃ √(a² − x²) dx =', ['πa²/4', 'πa²/2', 'a²/2', 'πa'], 0, '[x/2 √(a² − x²) + a²/2 sin⁻¹(x/a)] from 0 to a = (a²/2)(π/2).');
      await mirrorRun(W);
      await K('think', 'Could we use horizontal strips instead?');
      await J('happy', 'Yes. Swapping x and y leaves x² + y² = a² unchanged, so 4∫₀ᵃ √(a² − y²) dy gives the same πa². That is the book\'s “Why?”.');
      const sl = slider('radius a', 1, 3, 0.5, 2, (v) => 'a = ' + v, (v) => { setA(W, v); W.rd = [['area = π·' + v + '² ≈ ' + fmtN(PI * v * v, 3), C['matcha-deep']]]; }, 3);
      await task('Slide the radius to a = 3', () => W.b === 3, (W) => { setA(W, 3); sl.value = 3; });
      await numQ('Area of x² + y² = 9?', 9 * PI, 'πa² = 9π.', { show: '9π', keys: 'π √' });
      await discover('Circle: A = πa²', 'Proved by integration: 4 × ∫₀ᵃ √(a² − x²) dx.');
      await cont(); hideFound();
    },
    async function () {
      let A = 3, B = 2;
      const setE = (W) => { const f = ellF(A, B); W.f = f; W.b = A; W.extra = [{ f, x0: -A, x1: A }, { f: (x) => -f(x), x0: -A, x1: A }]; W.rd = [['a = ' + A + ', b = ' + B + '   area = π·' + A + '·' + B + ' ≈ ' + fmtN(PI * A * B, 3), C['matcha-deep']]]; };
      enterScene('area', (W) => { areaSet(W, ellF(3, 2), -5.5, 5.5, { ab: [0, 3], y: [-3.6, 3.6] }); setE(W); W.rd = null; });
      exTag('Example 2', 'the ellipse x²/a² + y²/b² = 1');
      await J('idle', 'On the upper arc y = (b/a)√(a² − x²). That is the circle\'s height squashed by b/a.');
      await stripSweep(W, 0, 3); await shadeRun(W);
      await quiz('So the ellipse area =', ['(b/a) × πa² = πab', 'πa²', 'πb²', 'π(a + b)'], 0, '4(b/a)∫₀ᵃ √(a² − x²) dx = (b/a)πa².');
      await mirrorRun(W); setE(W);
      const s1 = slider('a', 1, 5, 1, 3, (v) => 'a = ' + v, (v) => { A = v; setE(W); }, 4), s2 = slider('b', 1, 3, 1, 2, (v) => 'b = ' + v, (v) => { B = v; setE(W); }, 3);
      await task('Make the ellipse x²/16 + y²/9 = 1 (a = 4, b = 3)', () => A === 4 && B === 3, (W) => { A = 4; B = 3; s1.value = 4; s2.value = 3; setE(W); });
      await numQ('Its area = ?', 12 * PI, 'πab = π·4·3 = 12π.', { show: '12π', keys: 'π √' });
      await discover('Ellipse: A = πab', 'A circle is the case a = b.');
      await cont(); hideFound();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 2'; }); await summary([{ t: 'Circle πa²,  ellipse πab', eq: true }, 'Use symmetry: integrate one quadrant, multiply by 4.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'signed', title: 'Above & Below', blurb: 'Lines and waves that cross the axis: split, take absolute values, add. Examples 3 and 4.', face: 'kimmy-excited',
  steps: [
    async function () {
      const f = (x) => 3 * x + 2;
      enterScene('area', (W) => areaSet(W, f, -1.6, 1.6, { ab: [-1, 1] }));
      exTag('Example 3', 'y = 3x + 2, x = −1 to x = 1');
      await numQ('Where does y = 3x + 2 cross the x-axis? x = ?', -2 / 3, '3x + 2 = 0 at x = −2/3.', { show: '−2/3' });
      await shadeRun(W); W.rd = pieceLines(f, -1, 1);
      await fields('A₁ = |∫ from −1 to −2/3|, A₂ = ∫ from −2/3 to 1', [{ l: 'A₁', a: 1 / 6, show: '1/6' }, { l: 'A₂', a: 25 / 6, show: '25/6' }]).then((r) => verdict(r, '[3x²/2 + 2x] gives −1/6 and 25/6.', '1/6 and 25/6.'));
      await numQ('Total area = ?', 13 / 3, '1/6 + 25/6 = 26/6 = 13/3.', { show: '13/3' });
      W.rd.push(['area = 13/3', C['matcha-deep']]); await cont();
    },
    async function () {
      enterScene('area', (W) => areaSet(W, cos, -0.5, 2 * PI + 0.5, { ab: [0, 2 * PI], lab: piLab7, fx: piLab7 }));
      exTag('Example 4', 'y = cos x, x = 0 to x = 2π');
      await shadeRun(W);
      await K('think', 'Easy: ∫₀^2π cos x dx = [sin x] = 0. So the area is 0?');
      await quiz('Is the area 0?', ['No: the pink part below cancels the blue in the integral, but area adds them', 'Yes, the integral is 0', 'Yes, cos x averages to 0', 'No, it is 2π'], 0, 'Split at π/2 and 3π/2.');
      W.rd = pieceLines(cos, 0, 2 * PI, piLab7);
      await numQ('Area = 1 + |−2| + 1 = ?', 4, 'Area = 4.');
      W.rd.push(['area = 4', C['matcha-deep']]); await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 3'; }); await summary([{ t: 'Area = Σ |∫ over each piece between zeros|', eq: true }, 'A zero integral can still hide a lot of area.']); },
  ],
}));

/* ===================== EXERCISE 8.1 ===================== */
const EX81 = [
  ellQ('Ex 8.1', 'Q1', 'Find the area of the region bounded by the ellipse x²/16 + y²/9 = 1', 4, 3, 12 * PI, '12π', { qshow: '3π' }),
  ellQ('Ex 8.1', 'Q2', 'Find the area of the region bounded by the ellipse x²/4 + y²/9 = 1', 2, 3, 6 * PI, '6π', { qshow: '3π/2' }),
  arQ('Ex 8.1', 'Q3', 'Area in the first quadrant bounded by x² + y² = 4 and x = 0, x = 2 is (A) π (B) π/2 (C) π/3 (D) π/4', ellF(2, 2), 0, 2, PI, 'π', { view: [-2.8, 2.8], y: [-2.4, 2.4], extra: [{ f: (x) => sqrt(Math.max(0, 4 - x * x)), x0: -2, x1: 2, w: 2, dash: [6, 5] }, { f: (x) => -sqrt(Math.max(0, 4 - x * x)), x0: -2, x1: 2, w: 2, dash: [6, 5] }], post: [mcqP('Answer', ['(A) π', '(B) π/2', '(C) π/3', '(D) π/4'], 'A quarter of π·2² = π.')] }),
  { ex: 'Ex 8.1', n: 'Q4', q: 'Area of the region bounded by y² = 4x, the y-axis and the line y = 3 is (A) 2 (B) 9/4 (C) 9/3 (D) 9/2', scene: 'area', kim: 'The region touches the y-axis, so should we slice sideways?',
    setup: hzScene((y) => (y * y) / 4, 0, 3, [-1.2, 4.5, -1.5, 3.8], { y0: -3, y1: 3.6, cap: 'x = y²/4' }),
    parts: [{ k: 'run', run: async (W) => { await hzStrip(W, 0, 3); await hzRun(W); } },
      mcqP('Area = ?', ['∫₀³ (y²/4) dy', '∫₀³ 2√x dx', '∫₀³ (3 − y²/4) dy', '∫₀^(9/4) 2√x dx'], 'Horizontal strips of length x = y²/4 from y = 0 to y = 3.'),
      { k: 'num', q: '∫₀³ (y²/4) dy = ?', a: 9 / 4, show: '9/4', act: async (W) => { W.rd = [['area = 27/12 = 9/4', C['matcha-deep']]]; SFX.pop(); }, x: '[y³/12] from 0 to 3 = 27/12 = 9/4.' },
      mcqP('Answer', ['(B) 9/4', '(A) 2', '(C) 9/3', '(D) 9/2'], '9/4.')],
    w: ['Area = 9/4 (B)'] },
];

/* ===================== MISCELLANEOUS EXERCISE ===================== */
const EX8M = [
  arQ('Misc 8', 'Q1(i)', 'Find the area under y = x², x = 1, x = 2 and the x-axis', (x) => x * x, 1, 2, 7 / 3, '7/3', { x: '[x³/3] from 1 to 2 = 8/3 − 1/3 = 7/3.' }),
  arQ('Misc 8', 'Q1(ii)', 'Find the area under y = x⁴, x = 1, x = 5 and the x-axis', (x) => x ** 4, 1, 5, 3124 / 5, '3124/5', { x: '[x⁵/5] from 1 to 5 = 3125/5 − 1/5 = 3124/5 = 624.8.' }),
  arQ('Misc 8', 'Q2', 'Sketch the graph of y = |x + 3| and evaluate ∫₋₆⁰ |x + 3| dx', (x) => abs(x + 3), -6, 0, 9, '9', { view: [-7.2, 1.2], steps: [mcqP('The graph of y = |x + 3| is', ['a V with its corner at (−3, 0)', 'a V with its corner at (3, 0)', 'a line through (0, 3)', 'a V with its corner at (0, 3)'], 'y = x + 3 for x ≥ −3 and −(x + 3) for x < −3.')], x: 'Two triangles of area ½·3·3 = 9/2 each: 9.' }),
  arQ('Misc 8', 'Q3', 'Find the area bounded by the curve y = sin x between x = 0 and x = 2π', sin, 0, 2 * PI, 4, '4', { lab: piLab7, fx: piLab7, x: '2 + |−2| = 4.' }),
  arQ('Misc 8', 'Q4', 'Area bounded by y = x³, the x-axis and x = −2, x = 1 is (A) −9 (B) −15/4 (C) 15/4 (D) 17/4', (x) => x ** 3, -2, 1, 17 / 4, '17/4', { y: [-8.5, 1.5], post: [mcqP('Answer', ['(D) 17/4', '(A) −9', '(B) −15/4', '(C) 15/4'], '|−4| + 1/4 = 17/4. The signed integral −15/4 is a trap.')], x: '|∫₋₂⁰ x³ dx| + ∫₀¹ x³ dx = 4 + 1/4 = 17/4.' }),
  arQ('Misc 8', 'Q5', 'Area bounded by y = x|x|, the x-axis and x = −1, x = 1 is (A) 0 (B) 1/3 (C) 2/3 (D) 4/3', (x) => x * abs(x), -1, 1, 2 / 3, '2/3', { view: [-1.8, 1.8], post: [mcqP('Answer', ['(C) 2/3', '(A) 0', '(B) 1/3', '(D) 4/3'], '1/3 + 1/3.')], x: 'y = −x² for x < 0 and x² for x > 0: 1/3 + 1/3 = 2/3.' }),
];
EX8M.forEach((q) => { const k = { Q2: 'Is this a V shape?', Q3: '∫₀^2π sin x dx is 0. Is the area 0 again?' }[q.n]; if (k) q.kim = k; });

const BOSS8 = [
  ['Area of x² + y² = 25', ['25π', '5π', '10π', '625π'], 0],
  ['Area of x²/9 + y²/4 = 1', ['6π', '13π', '36π', '3π'], 0],
  ['Area under y = x from 0 to 4', ['8', '16', '4', '2'], 0],
  ['Area between y = sin x and the x-axis, 0 to π', ['2', '0', '1', 'π'], 0],
  ['∫₀^2π sin x dx', ['0', '4', '2', '−2'], 0],
  ['Horizontal strip area element', ['x dy', 'y dx', 'xy', 'dx dy'], 0],
  ['Area under y = x² from 0 to 3', ['9', '27', '3', '6'], 0],
  ['Area between y = x³ and the x-axis, −1 to 1', ['1/2', '0', '1/4', '1'], 0],
  ['Area between x = y², the y-axis, y = 0 to y = 3', ['9', '27', '3', '√3'], 0],
  ['Area of a quarter of x² + y² = 16', ['4π', '16π', '2π', 'π'], 0],
];

{
  const byId = (id) => LESSONS.find((l) => l.id === id);
  const [st, ci, sg] = ['strips', 'circle', 'signed'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(st, ci, exLesson({ id: 'ex81', title: 'Exercise 8.1', blurb: 'All 4: ellipses, a quarter circle, and a sideways parabola.', face: 'kimmy-playful', qs: EX81 }), sg, exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 5 Miscellaneous Exercise questions (Q1 in two parts).', face: 'jess-happy', qs: EX8M }));
}
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 8'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Find the areas faster than me!'); await cont('Fight'); }, ...BOSS8.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 8'; }); await summary(['Chapter complete!', { t: 'Area = Σ|∫ f dx| over the pieces', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

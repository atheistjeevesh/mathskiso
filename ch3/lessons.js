/* =========================================================
   CHAPTER 3 · TRIGONOMETRIC FUNCTIONS — concept lessons (Examples 1–22)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const SQ = ' √ π';

/* ================= LESSON 1 · DEGREES & RADIANS ================= */
LESSONS.push(lesson({
  id: 'angles', title: 'Degrees & Radians', blurb: 'Spin the ray, roll a radius round the rim, l = rθ, and Examples 1–5.', face: 'kimmy-lookup',
  steps: [
    async function () {
      enterScene('circle', (W) => { W.uc.th = 0; W.uc.vals = true; });
      await slam('ANGLES', 'Lesson 1 · Section 3.2');
      await J('idle', 'An angle is an amount of ROTATION. Anticlockwise is positive, clockwise is negative. Grab P and spin it.');
      circleDrag(W); await task('Drag P all the way round once (past 360°)', () => W.uc.th >= 2 * PI - 0.01, (W) => (W.uc.th = 2 * PI + 0.1), [[-2.3 + 2.35, 0], [-2.3, 2.35], [-2.3 - 2.35, 0]]);
      FX.burst('1 REV!', { x: 40, y: 30 });
      await K('wow', 'The arrow keeps a record of extra turns!');
      await J('think', 'One revolution = 360°. 1° = 60′ (minutes), 1′ = 60″ (seconds).');
      await quiz('Spin clockwise to −30°. Where does P end up?', ['Quadrant I', 'Quadrant IV', 'Quadrant II', 'Quadrant III'], 1, 'Clockwise from the x-axis goes down into IV.');
      await spinTo(W, D2R(-30)); await cont();
    },
    async function () {
      enterScene('arc', (W) => { W.mode = 'roll'; W.th = 1; W.u = 0; });
      await J('idle', 'Radian: take a string as long as the radius and wrap it round the rim.');
      const b = button('Wrap the string'); await waitFor(() => b.clicked()); b.stop(); SFX.rise(); await tw(W, { u: 1, duration: 1.4, ease: 'power1.inOut' }); W.cap = 'arc = radius ⇒ 1 radian';
      const r = await kahoot('1 radian is about…', ['1°', '57°', '90°', '180°'], 1, 15);
      await verdict(r, '180°/π ≈ 57° 16′.', '1 rad = 180°/π ≈ 57° 16′.');
      W.mode = 'arc'; W.cap = ''; await J('happy', 'Arc l on a circle of radius r subtends θ = l/r radians. So l = rθ.');
      slider('θ (radians)', 0.2, 6.28, 0.01, 1, (v) => fmtN(v, 2) + ' rad', (v) => (W.th = v), 3.14);
      await task('Slide θ to half a turn (π ≈ 3.14)', () => Math.abs(W.th - PI) < 0.02, (W) => (W.th = PI));
      await discover('π radians = 180°', 'Radian = (π/180) × degree.   Degree = (180/π) × radian.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('circle', (W) => { W.uc.th = 0; });
      await J('think', 'The table you must know. Convert, and I spin the circle to check.');
      for (const [d, a, o] of [[30, 1, ['π/3', 'π/6', 'π/4', '2π/3']], [45, 2, ['π/2', 'π/3', 'π/4', 'π/8']], [270, 0, ['3π/2', '2π/3', '3π/4', '5π/4']]]) { await quiz(d + '° = ? radians', o, o.indexOf(piStr(D2R(d))), d + '° × π/180 = ' + piStr(D2R(d)) + '.', null, 15); await spinTo(W, D2R(d), 0.7); }
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '40° 20′'; W.sub = 'Example 1'; });
      exTag('Example 1', 'degree → radian');
      await J('idle', '40° 20′ = 40 1/3 degrees = 121/3 degrees.');
      await numQ('40° 20′ in radians = ?·π  (type the multiplier as a fraction, e.g. 121/540)', '121/540', '(121/3) × π/180 = 121π/540.');
      exTag('Example 2', 'radian → degree, π = 22/7');
      await quiz('6 radians ≈ ?', ['343° 38′ 11″', '343° 38′', '360°', '340° 11′'], 0, '6 × 180 × 7/22 = 343 7/11 degrees = 343° 38′ 11″.');
      await cont();
    },
    async function () {
      enterScene('arc', (W) => { W.mode = 'arc'; W.th = PI / 3; W.cap = 'θ = 60°, l = 37.4 cm'; });
      exTag('Example 3', 'radius from an arc');
      await numQ('r = l/θ = 37.4 ÷ (π/3), with π = 22/7. r = ? cm', 35.7, '37.4 × 3 × 7/22 = 35.7 cm.', { tol: 0.05 });
      enterScene('arc', (W) => { W.mode = 'clock'; W.clock = 0; W.cap = 'hand 1.5 cm'; });
      exTag('Example 4', 'minute hand');
      await J('idle', 'The minute hand is 1.5 cm long. How far does its tip travel in 40 minutes?');
      await tw(W, { clock: 40, duration: 2, ease: 'none', onUpdate: () => { if (Math.round(W.clock) % 5 === 0) SFX.tick(); } });
      await numQ('Tip distance (π = 3.14) = ? cm', 6.28, 'θ = 2/3 of a turn = 4π/3; l = 1.5 × 4π/3 = 2π = 6.28 cm.', { tol: 0.01 });
      await cont();
    },
    async function () {
      enterScene('arc', (W) => { W.mode = 'arc'; W.th = D2R(65); });
      exTag('Example 5', 'same arc, two circles');
      await J('think', 'Same arc length l. One circle shows 65°, the other 110°. l = r₁θ₁ = r₂θ₂.');
      await quiz('r₁ : r₂ = ?', ['13 : 22', '22 : 13', '65 : 110', '1 : 1'], 1, 'Bigger angle needs a smaller radius: r₁/r₂ = 110/65 = 22/13.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; });
      await summary([{ t: 'π rad = 180°', eq: true }, 'l = rθ (θ in radians).', '1 rad ≈ 57° 16′, 1° ≈ 0.01746 rad.', '30° = π/6, 45° = π/4, 60° = π/3, 90° = π/2.']);
    },
  ],
}));

/* ================= LESSON 2 · THE UNIT CIRCLE ================= */
LESSONS.push(lesson({
  id: 'unit', title: 'Trig Functions', blurb: 'cos x = a, sin x = b on the unit circle. Quadrantal angles, zeros, sin² + cos² = 1.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('circle', (W) => { W.uc.th = D2R(35); });
      await slam('THE UNIT CIRCLE', 'Lesson ' + L.num + ' · Section 3.3');
      await J('idle', 'Unit circle: radius 1. For the point P(a, b) at angle x we DEFINE cos x = a and sin x = b.');
      circleDrag(W); await task('Drag P and watch the blue (cos) and red (sin) bars', () => (W.uc.moved || 0) > 15, (W) => (W.uc.moved = 20));
      await K('think', 'a² + b² is the radius squared…');
      await discover('sin²x + cos²x = 1', 'For every real x: Pythagoras on the unit circle.');
      await cont(); hideFound();
    },
    async function () {
      await J('think', 'Quadrantal angles: the four points A, B, C, D on the axes. Predict, then I spin.');
      for (const [d, f, o, a] of [[90, 'cos', ['0', '1', '−1', 'undefined'], 0], [180, 'sin', ['0', '1', '−1', 'undefined'], 0], [270, 'sin', ['0', '1', '−1', 'undefined'], 2], [180, 'cos', ['0', '1', '−1', '1/2'], 2]]) { await quiz(f + ' ' + piStr(D2R(d)) + ' = ?', o, a, 'At ' + d + '° the point is (' + fmtN(Math.cos(D2R(d)), 0) + ', ' + fmtN(Math.sin(D2R(d)), 0) + ').', null, 12); await spinTo(W, D2R(d), 0.6); }
      await cont();
    },
    async function () {
      await J('idle', 'Go once more round from any point: you land on the same P. So sin(2nπ + x) = sin x and cos(2nπ + x) = cos x.');
      const t0 = W.uc.th; await spinTo(W, t0 + 2 * PI, 1); FX.ono('SAME P!', { x: 30, y: 25 });
      await quiz('sin x = 0 exactly when x = …', ['nπ', '(2n + 1)π/2', '2nπ only', 'nπ/2'], 0, 'P is at A or C: x = 0, ±π, ±2π, …');
      await quiz('cos x = 0 exactly when x = …', ['nπ', '(2n + 1)π/2', 'nπ/4', '2nπ'], 1, 'P is at B or D: odd multiples of π/2.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'tan, cot, sec, cosec'; W.sub = '3.3'; });
      propCards([['cosec x = 1/sin x', 'x ≠ nπ', '1'], ['sec x = 1/cos x', 'x ≠ (2n + 1)π/2', '2'], ['tan x = sin x / cos x', 'x ≠ (2n + 1)π/2', '3'], ['cot x = cos x / sin x', 'x ≠ nπ', '4']]);
      await quiz('Divide sin²x + cos²x = 1 by cos²x:', ['1 + tan²x = sec²x', '1 + cot²x = cosec²x', 'tan²x − 1 = sec²x', 'sec²x + 1 = tan²x'], 0, 'tan²x + 1 = sec²x.');
      await quiz('Divide by sin²x instead:', ['1 + tan²x = sec²x', '1 + cot²x = cosec²x', 'cot²x = 1 + cosec²x', 'sin²x = cos²x'], 1, '1 + cot²x = cosec²x.');
      await cont();
    },
    async function () {
      enterScene('circle', (W) => { W.uc.th = PI / 6; W.uc.tan = true; });
      await J('think', 'Standard values race. 12 seconds each.');
      const V = [['sin π/6', ['1/2', '√3/2', '1/√2', '0'], 0, 30], ['cos π/3', ['√3/2', '1/2', '1', '0'], 1, 60], ['tan π/4', ['0', '√3', '1', '1/√3'], 2, 45], ['tan π/3', ['1/√3', '√3', '1', '3'], 1, 60], ['cos π/6', ['1/2', '√3/2', '√2', '1/√2'], 1, 30]];
      for (const [q, o, a, d] of V) { await spinTo(W, D2R(d), 0.4); await quiz(q + ' = ?', o, a, q + ' = ' + o[a] + '.', null, 12); }
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'cos x = a,  sin x = b', eq: true }, 'sin²x + cos²x = 1,  1 + tan²x = sec²x,  1 + cot²x = cosec²x', 'Period 2π: sin(2nπ + x) = sin x.', 'sin x = 0 ⇔ x = nπ;  cos x = 0 ⇔ x = (2n + 1)π/2.']);
    },
  ],
}));

/* ================= LESSON 3 · SIGNS, RANGES, GRAPHS ================= */
LESSONS.push(lesson({
  id: 'signs', title: 'Signs & Graphs', blurb: 'ASTC, sin(−x) = −sin x, ranges, unrolled graphs and Examples 6–9.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('circle', (W) => { W.uc.th = D2R(40); W.uc.ref = true; });
      await slam('SIGNS & GRAPHS', 'Lesson ' + L.num + ' · Sections 3.3.1–3.3.2');
      await J('idle', 'Reflect P(a, b) in the x-axis: Q(a, −b) is at angle −x.');
      await quiz('So cos(−x) = ?', ['cos x', '−cos x', 'sin x', '−sin x'], 0, 'Same a.');
      await quiz('and sin(−x) = ?', ['sin x', '−sin x', 'cos x', '0'], 1, 'b flips to −b.');
      W.uc.ref = false; W.uc.astc = true;
      await J('think', 'Signs by quadrant: All positive in I, Sin in II, Tan in III, Cos in IV. “All Students Take Coffee.”');
      circleDrag(W); await task('Drag P into quadrant III', () => QUAD(W.uc.th) === 3, (W) => (W.uc.th = D2R(220)));
      await quiz('In quadrant III, which is positive?', ['sin', 'cos', 'tan', 'sec'], 2, 'a < 0 and b < 0, so b/a > 0.');
      await cont();
    },
    async function () {
      enterScene('wave');
      await J('idle', 'Watch the unit circle unroll into graphs.');
      await unroll(W, 'sin'); await quiz('Range of sin x', ['R', '[−1, 1]', '[0, 1]', '(−1, 1)'], 1, 'b is always between −1 and 1.');
      await unroll(W, 'cos'); await quiz('cos x on (π/2, π) is…', ['increasing from 0 to 1', 'decreasing from 0 to −1', 'increasing from −1 to 0', 'constant'], 1, 'Quadrant II: cos falls from 0 to −1.');
      await unroll(W, 'tan', 2 * PI, 2); await quiz('tan x repeats after…', ['2π', 'π', 'π/2', '4π'], 1, 'tan(π + x) = tan x.');
      await quiz('Range of sec x', ['[−1, 1]', 'R', '{y : y ≤ −1 or y ≥ 1}', '(0, ∞)'], 2, 'Reciprocal of a number in [−1, 1].');
      await cont();
    },
    async function () {
      enterScene('circle', (W) => { W.uc.th = D2R(233.13); W.uc.shadeQ = 3; });
      exTag('Example 6', 'cos x = −3/5, x in quadrant III');
      await J('think', 'sin²x = 1 − 9/25 = 16/25, so sin x = ±4/5. Quadrant III picks the sign.');
      let r = await fields('Fill sin x and tan x', [{ l: 'sin x', a: '-4/5', show: '−4/5' }, { l: 'tan x', a: '4/3', show: '4/3' }]); await verdict(r, 'sin x = −4/5, tan x = (−4/5)/(−3/5) = 4/3.', 'sin x = −4/5, tan x = 4/3.');
      r = await fields('And the reciprocals', [{ l: 'cosec x', a: '-5/4', show: '−5/4' }, { l: 'sec x', a: '-5/3', show: '−5/3' }, { l: 'cot x', a: '3/4', show: '3/4' }]); await verdict(r, 'Flip each one.', 'cosec x = −5/4, sec x = −5/3, cot x = 3/4.');
      await cont();
    },
    async function () {
      enterScene('circle', (W) => { W.uc.th = PI - Math.atan(12 / 5); W.uc.shadeQ = 2; });
      exTag('Example 7', 'cot x = −5/12, x in quadrant II');
      await J('idle', 'tan x = −12/5, sec²x = 1 + 144/25 = 169/25. Quadrant II: sec is negative.');
      const r = await fields('Fill these', [{ l: 'sec x', a: '-13/5', show: '−13/5' }, { l: 'sin x', a: '12/13', show: '12/13' }]); await verdict(r, 'sec x = −13/5, cos x = −5/13, sin x = tan·cos = 12/13.', 'sec x = −13/5, sin x = 12/13.');
      await cont();
    },
    async function () {
      enterScene('circle', (W) => { W.uc.th = 0; });
      exTag('Examples 8 & 9', 'periodicity');
      await J('think', 'sin(31π/3). Spin it all the way and see where it lands.');
      await spinTo(W, (31 * PI) / 3, 2.4);
      await quiz('31π/3 = 10π + π/3. So sin(31π/3) = ?', ['1/2', '√3/2', '−√3/2', '0'], 1, 'Five full turns change nothing: sin π/3.');
      await spinTo(W, 0, 0.5); await spinTo(W, D2R(-1710), 2.6);
      await quiz('cos(−1710°) = cos(−1710° + 5 × 360°) = cos 90° = ?', ['0', '1', '−1', '1/2'], 0, 'P ends at the top: (0, 1).');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'All · Sin · Tan · Cos', eq: true }, 'cos(−x) = cos x,  sin(−x) = −sin x', 'sin, cos: range [−1, 1], period 2π.', 'tan, cot: range R, period π.']);
    },
  ],
}));

/* ================= LESSON 4 · SUM & DIFFERENCE ================= */
LESSONS.push(lesson({
  id: 'sum', title: 'Sum & Difference', blurb: 'Equal chords prove cos(x + y). Allied angles. Examples 10–14.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('sumfig');
      await slam('cos (x + y)', 'Lesson ' + L.num + ' · Section 3.4');
      await J('idle', 'P₁ at x, P₂ at x + y, P₃ at −y, P₄ at 0. Triangles P₁OP₃ and P₂OP₄ both have angle x + y at O, so the chords are equal.');
      slider('x', 0.1, 2.5, 0.01, W.x, (v) => fmtN(R2D(v), 0) + '°', (v) => (W.x = v), 1.2); slider('y', 0.1, 2.5, 0.01, W.y, (v) => fmtN(R2D(v), 0) + '°', (v) => (W.y = v), 1.5);
      await task('Move both sliders. The two chords stay equal.', () => Math.abs(W.x - 0.7) + Math.abs(W.y - 0.6) > 0.8, (W) => { W.x = 1.2; W.y = 1.5; });
      await J('think', 'Distance formula: P₁P₃² = 2 − 2(cos x cos y − sin x sin y) and P₂P₄² = 2 − 2cos(x + y).');
      await discover('cos(x + y) = cos x cos y − sin x sin y', 'Replace y by −y: cos(x − y) = cos x cos y + sin x sin y.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('circle', (W) => { W.uc.th = D2R(30); W.uc.lab = 'x'; });
      await J('idle', 'Allied angles. Put x = π/2 in cos(x − y): cos(π/2 − y) = sin y. Then the rest follow.');
      const A = [['cos(π/2 + x)', ['−sin x', 'sin x', 'cos x', '−cos x'], 0], ['sin(π − x)', ['−sin x', 'sin x', 'cos x', '−cos x'], 1], ['cos(π + x)', ['cos x', '−cos x', 'sin x', '−sin x'], 1], ['sin(2π − x)', ['sin x', '−sin x', 'cos x', '−cos x'], 1], ['sin(π/2 + x)', ['cos x', '−cos x', 'sin x', '−sin x'], 0]];
      for (const [q, o, a] of A) await quiz(q + ' = ?', o, a, q + ' = ' + o[a] + '.', null, 14);
      await J('happy', 'Trick: π ± x and 2π ± x keep the function; π/2 ± x swaps sin ↔ cos. The sign comes from the quadrant.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'sin(x+y)'; W.sub = 'tan(x+y)'; });
      propCards([['sin(x ± y) = sin x cos y ± cos x sin y', '', '1'], ['cos(x ± y) = cos x cos y ∓ sin x sin y', '', '2'], ['tan(x ± y) = (tan x ± tan y)/(1 ∓ tan x tan y)', 'x, y, x ± y not odd multiples of π/2', '3'], ['cot(x ± y) = (cot x cot y ∓ 1)/(cot y ± cot x)', 'x, y, x ± y not multiples of π', '4']]);
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '= 1 ?'; W.sub = 'Example 10'; });
      exTag('Example 10', 'prove 3 sin π/6 sec π/3 − 4 sin 5π/6 cot π/4 = 1');
      const r = await fields('Evaluate the pieces', [{ l: 'sin π/6', a: '1/2' }, { l: 'sec π/3', a: 2 }, { l: 'sin 5π/6', a: '1/2' }]); await verdict(r, 'sin 5π/6 = sin(π − π/6) = 1/2.', 'sin π/6 = 1/2, sec π/3 = 2, sin 5π/6 = 1/2.');
      await numQ('3 × ½ × 2 − 4 × ½ × 1 = ?', 1, '3 − 2 = 1 = RHS.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => idSetup(W, (x) => Math.sin(x), (x) => Math.sin(x), { x0: 0, x1: PI }));
      exTag('Example 11', 'sin 15°');
      await quiz('sin 15° = sin(45° − 30°) = ?', ['(√3 − 1)/(2√2)', '(√3 + 1)/(2√2)', '(1 − √3)/2', '√3/4'], 0, 'sin45 cos30 − cos45 sin30 = (√3 − 1)/(2√2) ≈ 0.2588.');
      exTag('Example 12', 'tan 13π/12');
      await quiz('tan(13π/12) = tan(π + π/12) = tan(π/4 − π/6) = ?', ['2 + √3', '2 − √3', '√3 − 1', '1/√3'], 1, '(1 − 1/√3)/(1 + 1/√3) = (√3 − 1)/(√3 + 1) = 2 − √3.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => idSetup(W, (x) => Math.sin(x + 0.5) / Math.sin(x - 0.5), (x) => (Math.tan(x) + Math.tan(0.5)) / (Math.tan(x) - Math.tan(0.5)), { x0: 0.6, x1: 3 }));
      exTag('Example 13', 'sin(x + y)/sin(x − y) = (tan x + tan y)/(tan x − tan y)');
      await idAnimate(W);
      const r = await order('Order the proof', ['LHS = (sin x cos y + cos x sin y)/(sin x cos y − cos x sin y)', 'Divide top and bottom by cos x cos y', '= (tan x + tan y)/(tan x − tan y) = RHS']); await verdict(r, 'Divide by cos x cos y.', 'Expand, then divide by cos x cos y.');
      exTag('Example 14', 'tan 3x tan 2x tan x = tan 3x − tan 2x − tan x');
      const r2 = await order('Order the proof', ['tan 3x = tan(2x + x) = (tan 2x + tan x)/(1 − tan 2x tan x)', 'tan 3x − tan 3x tan 2x tan x = tan 2x + tan x', 'tan 3x tan 2x tan x = tan 3x − tan 2x − tan x']); await verdict(r2, 'Cross-multiply and rearrange.', 'Write 3x = 2x + x first.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'cos(x + y) = cos x cos y − sin x sin y', eq: true }, 'sin(x + y) = sin x cos y + cos x sin y', 'cos(π/2 − x) = sin x,  sin(π − x) = sin x,  cos(π + x) = −cos x', 'tan(x + y) = (tan x + tan y)/(1 − tan x tan y)']);
    },
  ],
}));

/* ================= LESSON 5 · MULTIPLE ANGLES & SUM-TO-PRODUCT ================= */
LESSONS.push(lesson({
  id: 'multi', title: 'Double Angles & Products', blurb: 'cos 2x, sin 2x, 3x formulas, sum ↔ product. Examples 15–22.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('plane', (W) => idSetup(W, (x) => Math.cos(2 * x), (x) => 1 - 2 * Math.sin(x) ** 2));
      await slam('DOUBLE ANGLES', 'Lesson ' + L.num + ' · identities 14–19');
      await idAnimate(W);
      await J('idle', 'Put y = x in cos(x + y): cos 2x = cos²x − sin²x. Swap in sin²x + cos²x = 1 to get the other forms.');
      await quiz('cos 2x also equals…', ['2cos²x − 1', '2sin²x − 1', '1 + 2sin²x', 'cos²x + sin²x'], 0, 'cos²x − (1 − cos²x).');
      await quiz('sin 2x = ?', ['2 sin x cos x', 'sin²x − cos²x', '2 sin x', 'sin x cos x'], 0, 'y = x in sin(x + y).');
      await quiz('tan 2x = ?', ['2tan x/(1 − tan²x)', '2tan x/(1 + tan²x)', '(1 − tan²x)/(1 + tan²x)', 'tan²x'], 0, 'y = x in tan(x + y).');
      await quiz('sin 3x = ?', ['3 sin x − 4 sin³x', '4 sin³x − 3 sin x', '3 sin x + 4 sin³x', '3 sin x'], 0, 'sin(2x + x) and cos 2x = 1 − 2sin²x.');
      await quiz('cos 3x = ?', ['4cos³x − 3cos x', '3cos x − 4cos³x', '4cos³x + 3cos x', 'cos³x'], 0, 'cos(2x + x) expanded.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => idSetup(W, (x) => Math.cos(x) + Math.cos(2.2), (x) => 2 * Math.cos((x + 2.2) / 2) * Math.cos((x - 2.2) / 2)));
      await J('think', 'Add cos(x + y) and cos(x − y): 2 cos x cos y. Rename x + y = θ, x − y = φ and you get sum-to-product.');
      await idAnimate(W);
      propCards([['cos x + cos y = 2 cos ½(x + y) cos ½(x − y)', '', '1'], ['cos x − cos y = −2 sin ½(x + y) sin ½(x − y)', '', '2'], ['sin x + sin y = 2 sin ½(x + y) cos ½(x − y)', '', '3'], ['sin x − sin y = 2 cos ½(x + y) sin ½(x − y)', '', '4']]);
      await quiz('2 sin x cos y = ?', ['sin(x + y) + sin(x − y)', 'cos(x + y) + cos(x − y)', 'sin(x + y) − sin(x − y)', 'cos(x − y) − cos(x + y)'], 0, 'Product-to-sum.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => idSetup(W, (x) => Math.cos(PI / 4 + x) + Math.cos(PI / 4 - x), (x) => Math.SQRT2 * Math.cos(x)));
      exTag('Example 15', 'cos(π/4 + x) + cos(π/4 − x) = √2 cos x'); await idAnimate(W);
      let r = await order('Order the proof', ['Use cos A + cos B = 2 cos ½(A + B) cos ½(A − B)', '= 2 cos(π/4) cos x', '= 2 × (1/√2) cos x = √2 cos x']); await verdict(r, 'Sum-to-product.', 'Sum-to-product, then cos π/4 = 1/√2.');
      enterScene('plane', (W) => idSetup(W, (x) => (Math.cos(7 * x) + Math.cos(5 * x)) / (Math.sin(7 * x) - Math.sin(5 * x)), (x) => 1 / Math.tan(x), { x0: 0.05, x1: 1.5, y0: -6, y1: 6 }));
      exTag('Example 16', '(cos 7x + cos 5x)/(sin 7x − sin 5x) = cot x'); await idAnimate(W);
      r = await quiz('Numerator → 2cos 6x cos x. Denominator → ?', ['2 cos 6x sin x', '2 sin 6x cos x', '2 sin 6x sin x', '−2 cos 6x sin x'], 0, 'sin A − sin B = 2 cos ½(A + B) sin ½(A − B).');
      enterScene('plane', (W) => idSetup(W, (x) => (Math.sin(5 * x) - 2 * Math.sin(3 * x) + Math.sin(x)) / (Math.cos(5 * x) - Math.cos(x)), (x) => Math.tan(x), { x0: 0.05, x1: 1.4, y0: -6, y1: 6 }));
      exTag('Example 17', '(sin 5x − 2 sin 3x + sin x)/(cos 5x − cos x) = tan x'); await idAnimate(W);
      r = await order('Order the proof', ['sin 5x + sin x = 2 sin 3x cos 2x', 'Numerator = 2 sin 3x (cos 2x − 1), denominator = −2 sin 3x sin 2x', '= (1 − cos 2x)/sin 2x = 2 sin²x/(2 sin x cos x)', '= tan x']); await verdict(r, 'Group sin 5x + sin x first.', 'Group sin 5x + sin x first.');
      await cont();
    },
    async function () {
      enterScene('circle', (W) => { W.uc.th = PI - Math.asin(0.6); W.uc.shadeQ = 2; });
      exTag('Example 18', 'sin x = 3/5, cos y = −12/13, both in quadrant II');
      const r = await fields('Signs first: cos x and sin y', [{ l: 'cos x', a: '-4/5', show: '−4/5' }, { l: 'sin y', a: '5/13' }]); await verdict(r, 'II: cos negative, sin positive.', 'cos x = −4/5, sin y = 5/13.');
      await numQ('sin(x + y) = (3/5)(−12/13) + (−4/5)(5/13) = ?', '-56/65', '−36/65 − 20/65 = −56/65.', { show: '−56/65' });
      await cont();
    },
    async function () {
      enterScene('plane', (W) => idSetup(W, (x) => Math.cos(2 * x) * Math.cos(x / 2) - Math.cos(3 * x) * Math.cos((9 * x) / 2), (x) => Math.sin(5 * x) * Math.sin((5 * x) / 2), { x0: -1.5, x1: 1.5 }));
      exTag('Example 19', 'cos 2x cos(x/2) − cos 3x cos(9x/2) = sin 5x sin(5x/2)'); await idAnimate(W);
      const r = await order('Order the proof', ['LHS = ½[2cos 2x cos(x/2) − 2cos(9x/2) cos 3x]', '= ½[cos(5x/2) + cos(3x/2) − cos(15x/2) − cos(3x/2)]', '= ½[cos(5x/2) − cos(15x/2)]', '= −sin 5x sin(−5x/2) = sin 5x sin(5x/2)']); await verdict(r, 'Product → sum, cancel, then sum → product.', 'Product-to-sum first.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'tan π/8'; W.sub = 'Example 20'; });
      exTag('Example 20', 'tan π/8');
      await J('think', 'Let y = tan π/8. tan π/4 = 2y/(1 − y²) = 1, so y² + 2y − 1 = 0, y = −1 ± √2.');
      await quiz('Which root?', ['√2 − 1', '−1 − √2', 'both', '√2 + 1'], 0, 'π/8 is in quadrant I, so tan is positive.');
      enterScene('circle', (W) => { W.uc.th = PI + Math.atan(0.75); W.uc.shadeQ = 3; });
      exTag('Example 21', 'tan x = 3/4, π < x < 3π/2');
      const r = await fields('cos x = −4/5. Use 2sin²(x/2) = 1 − cos x and 2cos²(x/2) = 1 + cos x', [{ l: 'sin(x/2)', a: '3/√10' }, { l: 'cos(x/2)', a: '-1/√10', show: '−1/√10' }, { l: 'tan(x/2)', a: -3, show: '−3' }], { keys: SQ }); await verdict(r, 'x/2 is in quadrant II: sin +, cos −.', 'sin(x/2) = 3/√10, cos(x/2) = −1/√10, tan(x/2) = −3.');
      await cont();
    },
    async function () {
      enterScene('plane', (W) => idSetup(W, (x) => Math.cos(x) ** 2 + Math.cos(x + PI / 3) ** 2 + Math.cos(x - PI / 3) ** 2, () => 1.5, { y0: 0, y1: 2.5 }));
      exTag('Example 22', 'cos²x + cos²(x + π/3) + cos²(x − π/3) = 3/2'); await idAnimate(W);
      await K('wow', 'The blue curve is completely flat at 1.5!');
      const r = await order('Order the proof', ['Use cos²θ = (1 + cos 2θ)/2 on each term', 'LHS = ½[3 + cos 2x + cos(2x + 2π/3) + cos(2x − 2π/3)]', '= ½[3 + cos 2x + 2cos 2x cos(2π/3)]', '= ½[3 + cos 2x − cos 2x] = 3/2']); await verdict(r, 'Half-angle form, then sum-to-product.', 'Start with cos²θ = (1 + cos 2θ)/2.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'cos 2x = cos²x − sin²x = 2cos²x − 1 = 1 − 2sin²x', eq: true }, 'sin 2x = 2 sin x cos x,  tan 2x = 2tan x/(1 − tan²x)', 'sin 3x = 3sin x − 4sin³x,  cos 3x = 4cos³x − 3cos x', 'Sum ↔ product: cos x + cos y = 2cos ½(x+y) cos ½(x−y), …']);
    },
  ],
}));

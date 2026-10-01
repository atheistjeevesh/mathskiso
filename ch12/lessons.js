/* =========================================================
   CHAPTER 12 · LIMITS AND DERIVATIVES — concept lessons (Examples 1–22)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));

LESSONS.push(lesson({
  id: 'limit', title: 'What Is a Limit?', blurb: 'Slide in from the left and the right. Where are the values heading? Holes, jumps and one-sided limits.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('calc', (W) => calcView(W, (x) => x * x, -3, 3, { y: [-1, 5] }));
      await slam('lim f(x)', 'Lesson 1 · Sections 12.2–12.3');
      await J('idle', 'f(x) = x². Watch two points slide towards x = 0 from both sides. Look at the f values.');
      const b = button('Approach 0'); await waitFor(() => b.clicked()); b.stop(); await approach(W, 0, 2);
      await quiz('Both sides head towards…', ['0', '1', '∞', 'nothing'], 0, 'lim (x→0) x² = 0.');
      await discover('lim f(x) = L', 'Values of f(x) get as close to L as we like as x gets close to a (from both sides).');
      await cont(); hideFound();
    },
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => (x * x - 1) / (x - 1), -2, 4, { y: [-1, 5] }); W.holes.push([1, 2]); });
      await J('think', 'g(x) = (x² − 1)/(x − 1) is not even defined at x = 1: there is a hole. Does the limit care?');
      const s = slider('distance from 1', 0.001, 1.5, 0.001, 1.5, (v) => fmtN(v, 3), (v) => (W.app = { a: 1, d: v }), 0.001);
      await task('Slide the distance down to almost 0', () => W.app.d < 0.02, (W) => (W.app.d = 0.001));
      await numQ('So lim (x→1) g(x) = ?', 2, '2, even though g(1) is undefined.');
      await K('wow', 'The limit only looks near the point, never at it!');
      await cont();
    },
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => (x <= 0 ? x + 2 : x * x - 1), -3, 3, { y: [-2, 4] }); W.dotsF.push([0, 2]); W.holes.push([0, -1]); });
      await J('idle', 'Left-hand limit: approach from below. Right-hand limit: approach from above.');
      const b = button('Approach 0'); await waitFor(() => b.clicked()); b.stop(); await approach(W, 0, 2);
      const r = await fields('One-sided limits at 0', [{ l: 'LHL', a: 2 }, { l: 'RHL', a: -1 }]); await verdict(r, '2 and −1.', 'LHL 2, RHL −1.');
      await quiz('LHL ≠ RHL, so lim (x→0) f(x)…', ['does not exist', '= 2', '= −1', '= 0.5'], 0, 'The limit exists only when the two agree.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'lim f(x) exists ⇔ LHL = RHL', eq: true }, 'The value at a (or a hole) does not matter.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'algebra', title: 'Algebra of Limits', blurb: 'Substitute, factor out the troublemaker, and the xⁿ − aⁿ theorem. Examples 1–3.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('board', (W) => { W.tag = 'plug in'; W.sub = 'polynomials'; });
      await slam('lim [f ± g], f·g, f/g', 'Lesson ' + L.num + ' · Section 12.3');
      await J('idle', 'Limits respect +, −, ×, ÷. So for a polynomial, lim (x→a) p(x) = p(a): just plug in.');
      exTag('Example 1');
      const r = await fields('Plug in', [{ l: '(i) x³ − x² + 1 at 1', a: 1 }, { l: '(ii) x(x + 1) at 3', a: 12 }, { l: '(iii) 1 + x + … + x¹⁰ at −1', a: 1 }]); await verdict(r, '1, 12, 1.', '1, 12, 1.');
      await cont();
    },
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => (x ** 3 - 4 * x * x + 4 * x) / (x * x - 4), -1, 5, { y: [-2, 3] }); W.holes.push([2, 0]); });
      exTag('Example 2', 'rational functions');
      await numQ('(i) (x² + 1)/(x + 100) at x → 1 = ?', 2 / 101, '2/101: nothing goes wrong, plug in.', { show: '2/101' });
      await J('think', '(ii) At x = 2 we get 0/0. Factor: x(x − 2)²/((x + 2)(x − 2)). Cancel the (x − 2).');
      await numQ('(ii) lim (x→2) (x³ − 4x² + 4x)/(x² − 4) = ?', 0, 'x(x − 2)/(x + 2) → 0/4 = 0.');
      await quiz('(iii) The flipped fraction (x² − 4)/(x³ − 4x² + 4x) at 2 becomes 4/0, so…', ['the limit is not defined', 'it is 0', 'it is 4', 'it is 1'], 0, 'Nonzero ÷ 0: no limit.');
      await numQ('(iv) x²(x − 2)/((x − 2)(x − 3)) at 2 = ?', -4, '4/(−1) = −4.');
      await numQ('(v) Combine to (x − 3)(x − 1)/(x(x − 1)(x − 2)) at 1 = ?', 2, '(1 − 3)/(1 · (1 − 2)) = 2.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'naⁿ⁻¹'; W.sub = 'Theorem 2'; });
      await discover('lim (xⁿ − aⁿ)/(x − a) = naⁿ⁻¹', 'True for rational n too (with a > 0).');
      const r0 = await order('Why?', ['xⁿ − aⁿ = (x − a)(xⁿ⁻¹ + xⁿ⁻²a + … + aⁿ⁻¹)', 'Cancel x − a', 'Plug x = a: n copies of aⁿ⁻¹', '= naⁿ⁻¹']); await verdict(r0, 'Factor, cancel, substitute.', 'Factor first.');
      hideFound(); exTag('Example 3');
      await numQ('(i) lim (x→1) (x¹⁵ − 1)/(x¹⁰ − 1) = 15/10 = ?', 1.5, '3/2.', { show: '3/2' });
      await numQ('(ii) lim (x→0) (√(1 + x) − 1)/x: put y = 1 + x, then (y^½ − 1)/(y − 1) → ?', 0.5, '½ · 1^(−½) = 1/2.', { show: '1/2' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['Polynomials: plug in.', '0/0: factor out (x − a) and cancel.', { t: 'lim (xⁿ − aⁿ)/(x − a) = naⁿ⁻¹', eq: true }]); },
  ],
}));

LESSONS.push(lesson({
  id: 'trig', title: 'sin x / x → 1', blurb: 'Squeeze sin x / x between cos x and 1 on the unit circle. Example 4.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('sand', (W) => { W.show = 0; });
      await slam('SANDWICH', 'Lesson ' + L.num + ' · Section 12.4');
      await J('idle', 'Unit circle, angle x. Triangle OAC (gold) < sector OAC (blue) < triangle OAB (pink).');
      for (let k = 1; k <= 3; k++) { W.show = k; SFX.pop(); await wait(0.5); }
      await quiz('In terms of x: ½ sin x < ½ x < ½ tan x gives…', ['cos x < sin x/x < 1', 'sin x < cos x < 1', 'sin x/x > 1', 'tan x < x'], 0, 'Divide by ½ sin x and flip.');
      slider('angle x', 0.02, 1.4, 0.01, 1.2, (v) => fmtN(v, 2), (v) => (W.x = v), 0.05);
      await task('Shrink x towards 0 and watch sin x/x get squeezed', () => W.x < 0.08, (W) => (W.x = 0.05));
      await discover('lim sin x / x = 1,  lim (1 − cos x)/x = 0', 'Sandwich theorem: cos x → 1 squeezes it.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => Math.sin(4 * x) / Math.sin(2 * x), -1.2, 1.2, { y: [-1, 3] }); W.holes.push([0, 2]); });
      exTag('Example 4');
      await order('(i) sin 4x / sin 2x', ['= (sin 4x / 4x) · (2x / sin 2x) · 2', 'Each bracket → 1', 'Limit = 2']).then((r) => verdict(r, 'Make each sine look like sin θ / θ.', 'Multiply and divide by 4x and 2x.'));
      await numQ('(i) = ?', 2, '2.');
      await numQ('(ii) tan x / x = (sin x / x)(1 / cos x) → ?', 1, '1 · 1 = 1.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'lim sin x / x = 1', eq: true }, 'lim (1 − cos x)/x = 0', 'lim sin ax / bx = a/b']); },
  ],
}));

LESSONS.push(lesson({
  id: 'deriv', title: 'The Derivative', blurb: 'Shrink h and watch the secant swing into the tangent. Examples 5–8.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => 2 * x * x + 3 * x - 5, -3, 1.5, { y: [-7, 4] }); W.a = -1; W.h = 1.5; grabCalc(W); });
      await slam("f′(a) = lim [f(a + h) − f(a)]/h", 'Lesson ' + L.num + ' · Section 12.5');
      await J('idle', 'The secant through P and Q has slope [f(a + h) − f(a)]/h. Drag Q (the hollow dot) towards P.');
      await task('Drag Q until h is tiny (|h| ≤ 0.05)', () => Math.abs(W.h) <= 0.05, (W) => gsap.to(W, { h: 0.01, duration: 0.8 }));
      W.tan = true; SFX.chime(); await K('wow', 'The secant became the tangent!');
      exTag('Example 6', 'f(x) = 2x² + 3x − 5');
      const r = await fields('Read the slopes (drag P to x = 0 for the second)', [{ l: "f′(−1)", a: -1 }, { l: "f′(0)", a: 3 }]); await verdict(r, "f′(0) + 3f′(−1) = 3 − 3 = 0.", "f′(−1) = −1, f′(0) = 3.");
      await cont();
    },
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => 3 * x, -1, 4, { y: [-2, 10] }); W.a = 2; W.h = 1; W.tan = true; grabCalc(W); });
      exTag('Example 5', 'f(x) = 3x at x = 2');
      await numQ('[3(2 + h) − 6]/h = 3h/h → ?', 3, "f′(2) = 3: a line's slope everywhere.");
      exTag('Example 7', 'sin x at 0');
      W.F = Math.sin; W.a = 0; calcView(W, Math.sin, -3.2, 3.2, { y: [-1.3, 1.3] });
      await numQ('lim sin h / h = ?', 1, "f′(0) = 1.");
      exTag('Example 8', 'f(x) = 3');
      W.F = () => 3; W.a = 3; calcView(W, () => 3, -1, 5, { y: [0, 4] });
      await quiz("f′(0) and f′(3) of a constant", ['0 and 0', '3 and 3', '0 and 3', 'undefined'], 0, 'A flat graph has zero slope.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: "f′(a) = lim (h→0) [f(a + h) − f(a)]/h", eq: true }, 'Geometrically: slope of the tangent at a.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'rules', title: 'Rules of Derivatives', blurb: 'Drag along a curve and watch f′(x) draw itself. xⁿ, sums, products, quotients, sin, cos, tan. Examples 9–18.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => x * x, -3, 3, { y: [-3, 6] }); W.a = -2; W.tan = true; grabCalc(W); W.trace = []; W.extraF = [{ f: (x) => (x <= W.a ? 2 * x : NaN), col: C.beni }]; });
      await slam("d/dx", 'Lesson ' + L.num + ' · Section 12.5.1');
      await J('idle', 'Drag P along y = x². The red curve records the tangent slope at every x you pass.');
      await task('Drag P all the way to x = 2', () => W.a >= 1.95, (W) => gsap.to(W, { a: 2, duration: 1 }));
      exTag('Example 10'); await quiz('The red curve is the line…', ['2x', 'x²', 'x', '2'], 0, "d/dx (x²) = 2x.");
      exTag('Example 9 · 11'); await quiz('d/dx (10x) and d/dx (a)', ['10 and 0', '10x and a', '1 and 0', '10 and a'], 0, '');
      exTag('Example 12'); await quiz('d/dx (1/x) from first principles', ['−1/x²', '1/x²', '−1/x', 'ln x'], 0, '[1/(x + h) − 1/x]/h = −1/(x(x + h)).');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'rules'; W.sub = 'Theorem 5'; });
      await discover("(u ± v)′ = u′ ± v′,  (uv)′ = u′v + uv′,  (u/v)′ = (u′v − uv′)/v²", 'And d/dx xⁿ = nxⁿ⁻¹.');
      const r = await match('Match', ['d/dx xⁿ', 'd/dx sin x', 'd/dx cos x', 'd/dx tan x'], ['−sin x', 'sec² x', 'nxⁿ⁻¹', 'cos x'], [2, 3, 0, 1]); await verdict(r, 'Examples 16, 17 and the table.', 'xⁿ → nxⁿ⁻¹, sin → cos, cos → −sin, tan → sec².');
      hideFound(); exTag('Example 13');
      await quiz('d/dx (6x¹⁰⁰ − x⁵⁵ + x)', ['600x⁹⁹ − 55x⁵⁴ + 1', '600x¹⁰⁰ − 55x⁵⁵ + 1', '6x⁹⁹ − x⁵⁴ + 1', '600x⁹⁹ − 55x⁵⁴'], 0, '');
      exTag('Example 14', '1 + x + … + x⁵⁰ at x = 1');
      await numQ('f′(1) = 1 + 2 + … + 50 = ?', 1275, '50 · 51/2 = 1275.');
      exTag('Example 15', '(x + 1)/x'); await quiz('Derivative', ['−1/x²', '1/x²', '1', '(x + 1)/x²'], 0, '1 + 1/x → −1/x².');
      exTag('Example 18', 'sin² x'); await quiz('(sin x · sin x)′ = ?', ['sin 2x', 'cos² x', '2 sin x', '2 cos x'], 0, 'Product rule: 2 sin x cos x.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'd/dx xⁿ = nxⁿ⁻¹', eq: true }, "(uv)′ = u′v + uv′,  (u/v)′ = (u′v − uv′)/v²", 'sin → cos,  cos → −sin,  tan → sec²']); },
  ],
}));

LESSONS.push(lesson({
  id: 'mixed', title: 'Derivatives in Action', blurb: 'First principles for trickier functions, then the quotient rule at full power. Examples 19–22.', face: 'jess-happy',
  steps: [
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => (2 * x + 3) / (x - 2), -2, 6, { y: [-8, 12] }); W.a = 4; W.tan = true; grabCalc(W); });
      await slam('MIXED', 'Lesson ' + L.num + ' · Examples 19–22');
      exTag('Example 19 (i)', '(2x + 3)/(x − 2)');
      await quiz('From first principles f′(x) = ?', ['−7/(x − 2)²', '7/(x − 2)²', '2/(x − 2)', '−7/(x − 2)'], 0, 'The numerator collapses to −7h.');
      await task('Drag P to x = 3 and read the slope', () => Math.abs(W.a - 3) < 0.01, (W) => (W.a = 3));
      await numQ('f′(3) = −7/1² = ?', -7, '−7.');
      exTag('Example 19 (ii)', 'x + 1/x'); await quiz('f′(x) = ?', ['1 − 1/x²', '1 + 1/x²', '1/x²', '−1/x²'], 0, '');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'trig'; W.sub = 'Examples 20–22'; });
      exTag('Example 20'); const r = await match('Match', ['sin x + cos x', 'x sin x'], ['x cos x + sin x', 'cos x − sin x'], [1, 0]); await verdict(r, '', 'cos x − sin x; x cos x + sin x.');
      exTag('Example 21'); await quiz('(i) d/dx sin 2x via 2 sin x cos x', ['2 cos 2x', 'cos 2x', '2 sin 2x', '−2 cos 2x'], 0, '2(cos² x − sin² x) = 2 cos 2x.');
      await quiz('(ii) d/dx cot x', ['−cosec² x', 'cosec² x', 'sec² x', '−sec² x'], 0, 'Quotient rule on cos x / sin x.');
      exTag('Example 22'); await quiz('(i) d/dx (x⁵ − cos x)/sin x', ['(−x⁵ cos x + 5x⁴ sin x + 1)/sin² x', '(5x⁴ + sin x)/cos x', '(x⁵ cos x + 5x⁴ sin x)/sin² x', '(5x⁴ sin x − 1)/sin² x'], 0, 'sin² + cos² = 1 tidies it.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['First principles always works.', { t: 'Quotient rule: (u′v − uv′)/v²', eq: true }]); },
  ],
}));

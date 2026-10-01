/* =========================================================
   CLASS 12 · CHAPTER 5 · CONTINUITY & DIFFERENTIABILITY — lessons (Examples 1–43)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const fl = Math.floor;

LESSONS.push(lesson({
  id: 'cont', title: 'Lift the Pen?', blurb: 'Continuous = draw it without lifting the pen: left limit = right limit = value. Examples 1–13 and 15.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('pw', (W) => pwSet(W, (x) => (x <= 0 ? 1 : 2), [0], [-4, 4, -1, 3.5]));
      await slam('LIFT THE PEN', 'Class 12 · Lesson 1 · Section 5.2');
      await J('idle', 'Watch the pen trace f(x) = 1 for x ≤ 0 and 2 for x > 0.');
      await penRun(W);
      await quiz('Why did the pen lift at x = 0?', ['left limit 1 ≠ right limit 2', 'f(0) is undefined', 'the graph is curved', 'it did not lift'], 0, 'The two sides do not meet.');
      W.F = (x) => (x === 0 ? 2 : 1); SFX.flip(); await J('think', 'Now f(x) = 1 for x ≠ 0 but f(0) = 2. Both limits are 1, yet the dot is somewhere else.');
      await penRun(W);
      await discover('f continuous at c ⇔ lim f(x) = f(c)', 'Left limit, right limit and the value must all agree.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('pw', (W) => pwSet(W, (x) => 2 * x + 3, [1], [-3, 3, -2, 9]));
      exTag('Example 1', 'f(x) = 2x + 3 at x = 1');
      await numQ('lim (x→1) (2x + 3) = ? (and f(1) is the same)', 5, 'Both are 5: continuous at 1.');
      exTag('Example 2', 'x² at 0'); W.F = (x) => x * x; W.cuts = [0]; planeView(W, -3, 3, -1, 6);
      await tf('x² is continuous at x = 0', true).then((r) => verdict(r, 'lim x² = 0 = f(0).', 'True.'));
      exTag('Example 3', '|x| at 0'); W.F = Math.abs; await penRun(W);
      await tf('|x| is continuous at 0 (both one-sided limits are 0)', true).then((r) => verdict(r, 'No lift: continuous.', 'True.'));
      await cont();
    },
    async function () {
      enterScene('pw', (W) => pwSet(W, (x) => (x === 0 ? 1 : x ** 3 + 3), [0], [-2, 2, -3, 8]));
      exTag('Example 4', 'x³ + 3, but f(0) = 1');
      await numQ('lim (x→0) f(x) = ?', 3, 'The limit is 3 but f(0) = 1, so f is NOT continuous at 0.');
      exTag('Examples 5–9', 'constant, identity, |x|, cubic, 1/x');
      W.F = (x) => 1 / x; W.cuts = []; planeView(W, -4, 4, -4, 4); SFX.flip();
      await J('think', 'f(x) = 1/x has a gap at 0, but 0 is NOT in its domain. At every point where it is defined, it is continuous.');
      await quiz('Is f(x) = 1/x (x ≠ 0) a continuous function?', ['Yes: continuous at every point of its domain', 'No: it breaks at 0', 'Only for x > 0', 'No: it has an asymptote'], 0, 'Continuity is checked only inside the domain.');
      await quiz('As x → 0⁺, 1/x →', ['+∞ (the limit does not exist)', '0', '1', '−∞'], 0, 'It grows past every number; ∞ is not a real number.');
      await cont();
    },
    async function () {
      enterScene('pw', (W) => pwSet(W, (x) => (x <= 1 ? x + 2 : x - 2), [1], [-4, 4, -4, 5], { flags: [-1, 0, 1, 2] }));
      exTag('Example 10', 'x + 2 (x ≤ 1), x − 2 (x > 1)');
      await penRun(W); flagTaps(W);
      await task('Tap the flag where the pen lifted', () => W.picked.has(1) && W.picked.size === 1, (W) => W.picked.add(1));
      await fields('At x = 1', [{ l: 'left limit', a: 3 }, { l: 'right limit', a: -1 }]).then((r) => verdict(r, 'They differ: only x = 1 is a break.', '3 and −1.'));
      exTag('Example 11', 'f(1) = 0 in between'); W.F = (x) => (x < 1 ? x + 2 : x === 1 ? 0 : x - 2); W.picked = new Set(); W.onTap = null;
      await tf('Changing f(1) to 0 fixes the break', false).then((r) => verdict(r, 'No value can fix it: the two limits still differ.', 'False.'));
      exTag('Example 12', 'x + 2 (x < 0), −x + 2 (x > 0)'); W.F = (x) => (x < 0 ? x + 2 : x > 0 ? -x + 2 : NaN); W.cuts = [0];
      await quiz('f is undefined at 0. Is f continuous?', ['Yes: 0 is not in the domain', 'No: break at 0', 'Only on x < 0', 'No'], 0, 'We only test points of the domain.');
      exTag('Example 13', 'x (x ≥ 0), x² (x < 0)'); W.F = (x) => (x >= 0 ? x : x * x);
      await penRun(W); await tf('This f is continuous everywhere', true).then((r) => verdict(r, 'At 0 both pieces give 0.', 'True.'));
      await cont();
    },
    async function () {
      const cuts = [-3, -2, -1, 0, 1, 2, 3];
      enterScene('pw', (W) => pwSet(W, fl, cuts, [-3.6, 3.6, -3.6, 3.6]));
      exTag('Example 15', 'greatest integer [x]');
      await J('idle', 'The steps of [x]: filled dot on the left end, hollow on the right.');
      await penRun(W, 3);
      await pickQ('Where is [x] discontinuous?', ['every integer', 'nowhere', 'only at 0', 'every non-integer'], ['every integer'], 'At c ∈ ℤ: left limit c − 1, right limit c.', { brace: false, single: true });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'lim (x→c⁻) f = lim (x→c⁺) f = f(c)', eq: true }, 'Only test points of the domain. Breaks: jump, wrong dot, or [x] steps.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'algebra', title: 'Building Continuous Functions', blurb: 'Sums, products, quotients and compositions of continuous functions stay continuous. Examples 14, 16–20.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('pw', (W) => pwSet(W, (x) => x ** 3 - 2 * x, [], [-3, 3, -4, 4]));
      await slam('f ± g, f·g, f/g', 'Lesson ' + L.num + ' · Section 5.2.1');
      exTag('Example 14', 'every polynomial');
      await penRun(W);
      await tf('Every polynomial is continuous everywhere', true).then((r) => verdict(r, 'lim p(x) = p(c) for every c.', 'True.'));
      exTag('Example 16', 'rational functions'); W.F = (x) => (x * x + 1) / (x - 1); W.cuts = [1]; planeView(W, -4, 5, -8, 10);
      await quiz('p(x)/q(x) is continuous…', ['wherever q(x) ≠ 0 (its whole domain)', 'everywhere', 'nowhere', 'only for x > 0'], 0, 'Quotient of continuous functions.');
      exTag('Examples 17–18', 'sin x and tan x'); W.F = Math.tan; W.cuts = []; planeView(W, -5, 5, -4, 4);
      await quiz('tan x = sin x / cos x is continuous at', ['all x ≠ (2n + 1)π/2', 'all real x', 'only x = 0', 'nowhere'], 0, 'Its domain leaves out where cos x = 0.');
      await cont();
    },
    async function () {
      enterScene('pw', (W) => pwSet(W, (x) => Math.sin(x * x), [], [-4, 4, -1.6, 1.6]));
      exTag('Example 19', 'sin(x²)');
      await J('idle', 'sin(x²) is sin applied to x²: a composition of two continuous functions.');
      await penRun(W);
      exTag('Example 20', '|1 − x + |x||'); W.F = (x) => Math.abs(1 - x + Math.abs(x)); planeView(W, -4, 4, -1, 6);
      await penRun(W);
      await quiz('|1 − x + |x|| is continuous because', ['it is |·| composed with a sum of continuous functions', 'it is a polynomial', 'it is never zero', 'it is differentiable'], 0, 'Composition and sums keep continuity.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'f, g continuous ⇒ f ± g, fg, f/g (g ≠ 0), f∘g continuous', eq: true }, 'Polynomials, rational, trig, |x| are continuous on their domains.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'diff', title: 'Kinks & the Chain Rule', blurb: 'Differentiable means the left and right slopes agree. |x| is continuous but has a kink. Chain rule: Example 21.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('pw', (W) => { pwSet(W, Math.abs, [], [-3, 3, -1, 3]); W.lr = { c: 0, h: 1.2 }; });
      await slam('KINK!', 'Lesson ' + L.num + ' · Section 5.3');
      await J('idle', 'Shrink h. The left secant slope stays −1 and the right one stays +1. They never agree.');
      slider('h', 0.01, 1.2, 0.01, 1.2, (v) => fmtN(v, 2), (v) => (W.lr.h = v), 0.05);
      await quiz('Is |x| differentiable at 0?', ['No: left derivative −1 ≠ right derivative 1', 'Yes: it is continuous', 'Yes: slope 0', 'No: it is not continuous'], 0, 'Continuous but not differentiable.');
      await discover('Differentiable ⇒ continuous', 'But NOT the other way round (|x| at 0).');
      await cont(); hideFound();
    },
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => Math.sin(x * x), -2.5, 2.5); W.a = 0.5; W.tan = true; grabCalc(W); });
      exTag('Example 21', 'sin(x²)');
      await J('think', 'Chain rule: outside derivative (cos of the inside) times inside derivative (2x).');
      await quiz('d/dx sin(x²) =', ['2x cos(x²)', 'cos(x²)', 'cos(2x)', '2x sin(x²)'], 0, 'dv/dt · dt/dx with t = x².');
      await task('Drag P to x = 1', () => Math.abs(W.a - 1) < 0.026, (W) => (W.a = 1));
      await numQ('Read the slope at x = 1 (2 decimals)', 2 * Math.cos(1), '2 cos 1 ≈ 1.081.', { tol: 0.011, show: fmtN(2 * Math.cos(1), 3) });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'df/dx = (dv/dt)(dt/dx)', eq: true }, 'Differentiable at c: left and right derivatives exist and are equal.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'implicit', title: 'Implicit & Inverse Trig', blurb: 'Differentiate both sides, treat y as a function of x. Then sin⁻¹, cos⁻¹, tan⁻¹. Examples 22–24.', face: 'jess-excited',
  steps: [
    async function () {
      const G = (x, y) => y + Math.sin(y) - Math.cos(x);
      enterScene('imp', (W) => { W.G = G; planeView(W, -5, 5, -2.5, 2.5); W.P = [0, impSnap(G, 0, 0.5)]; impDrag(W); });
      await slam('dy/dx IMPLICITLY', 'Lesson ' + L.num + ' · Section 5.3.2');
      exTag('Example 22', 'x − y = π');
      await numQ('Differentiate: 1 − dy/dx = 0, so dy/dx = ?', 1, 'dy/dx = 1.');
      exTag('Example 23', 'y + sin y = cos x');
      await J('idle', 'Drag P along the curve. The tangent follows it.');
      await task('Drag P to x = 1', () => Math.abs(W.P[0] - 1) < 1e-6, (W) => (W.P = [1, impSnap(G, 1, W.P[1])]));
      await quiz('dy/dx + cos y · dy/dx = −sin x gives', ['dy/dx = −sin x / (1 + cos y)', 'dy/dx = sin x / (1 + cos y)', 'dy/dx = −sin x', 'dy/dx = cos x / cos y'], 0, 'Factor dy/dx.');
      await numQ('Slope at P (2 decimals)', -Math.sin(1) / (1 + Math.cos(W.P[1])), 'Matches the green tangent.', { tol: 0.011, show: fmtN(-Math.sin(1) / (1 + Math.cos(impSnap(G, 1, 0.3))), 3) });
      await cont();
    },
    async function () {
      enterScene('calc', (W) => { calcView(W, Math.asin, -1, 1, { y: [-1.8, 1.8] }); W.a = 0; W.tan = true; grabCalc(W, { snap: 0.05 }); });
      exTag('Example 24', 'sin⁻¹ x');
      await J('think', 'y = sin⁻¹ x means x = sin y. Then 1 = cos y · dy/dx, and cos y = √(1 − x²).');
      await task('Drag P to x = 0.6', () => Math.abs(W.a - 0.6) < 0.026, (W) => (W.a = 0.6));
      await numQ('1/√(1 − 0.36) = ?', 1.25, '1/0.8 = 1.25: the tangent agrees.');
      const r = await match('Match the derivatives', ['sin⁻¹ x', 'cos⁻¹ x', 'tan⁻¹ x'], ['1/(1 + x²)', '1/√(1 − x²)', '−1/√(1 − x²)'], [1, 2, 0]); await verdict(r, 'cos⁻¹ is just a minus sign away from sin⁻¹.', 'See the table.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Differentiate both sides; every y-term gets a dy/dx', eq: true }, '(sin⁻¹x)′ = 1/√(1−x²), (cos⁻¹x)′ = −1/√(1−x²), (tan⁻¹x)′ = 1/(1+x²)']); },
  ],
}));

LESSONS.push(lesson({
  id: 'explog', title: 'eˣ and log x', blurb: 'eˣ is its own derivative; log x has slope 1/x. Mirror images in y = x. Examples 25–26.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('calc', (W) => { calcView(W, Math.exp, -3, 2.5, { y: [-0.5, 8] }); W.a = 1; W.tan = true; grabCalc(W); W.extraF = [{ f: Math.log, col: C.beni }, { f: (x) => x, col: C['ink-muted'], dash: [6, 5] }]; });
      await slam('eˣ', 'Lesson ' + L.num + ' · Section 5.4');
      await J('idle', 'Drag P anywhere on y = eˣ. Compare the height f(x) with the tangent slope.');
      await task('Drag P to x = 1.5', () => Math.abs(W.a - 1.5) < 0.026, (W) => (W.a = 1.5));
      await quiz('At every point of y = eˣ, the slope equals…', ['the height eˣ', '1', 'x', '1/x'], 0, 'd/dx eˣ = eˣ.');
      exTag('Example 25', 'x = e^(log x)?');
      await quiz('x = e^(log x) is true for', ['x > 0 only', 'all real x', 'x ≥ 0', 'no x'], 0, 'log x needs x > 0.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 26'; W.sub = 'chain rule with eˣ, log x'; });
      exTag('Example 26', 'four functions');
      const r = await match('Match each derivative', ['e⁻ˣ', 'sin(log x)', 'cos⁻¹(eˣ)', 'e^(cos x)'], ['−eˣ/√(1 − e²ˣ)', '−sin x · e^(cos x)', '−e⁻ˣ', 'cos(log x)/x'], [2, 3, 0, 1]); await verdict(r, 'Each is outside′ × inside′.', 'Chain rule each time.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '(eˣ)′ = eˣ, (log x)′ = 1/x', eq: true }, 'log means base e here; logₐ p = log_b p / log_b a.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'logdiff', title: 'Logarithmic Differentiation', blurb: 'Take log, bring powers down, differentiate. For xˣ, aˣ and big products. Examples 27–30.', face: 'jess-happy',
  steps: [
    async function () {
      const f = (x) => x ** Math.sin(x);
      enterScene('calc', (W) => { calcView(W, f, 0.05, 6, { y: [-0.3, 3.5] }); W.a = 1; W.tan = true; grabCalc(W); });
      await slam('log y = v log u', 'Lesson ' + L.num + ' · Section 5.5');
      exTag('Example 29', 'x^(sin x)');
      const r = await order('Differentiate x^(sin x)', ['log y = sin x · log x', '(1/y) dy/dx = cos x log x + sin x / x', 'dy/dx = y (cos x log x + sin x / x)', '= x^(sin x)(cos x log x + sin x / x)']); await verdict(r, 'Log turns the power into a product.', 'Start with log y.');
      await task('Drag P to x = 2', () => Math.abs(W.a - 2) < 0.026, (W) => (W.a = 2));
      const d = f(2) * (Math.cos(2) * Math.log(2) + Math.sin(2) / 2);
      await numQ('Formula at x = 2 (2 decimals)', d, 'Matches the tangent: ' + fmtN(d, 4) + '.', { tol: 0.011, show: fmtN(d, 3) });
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 27–28'; W.sub = 'products and aˣ'; });
      exTag('Example 27', '√((x − 3)(x² + 4)/(3x² + 4x + 5))');
      await quiz('log y = ½[log(x − 3) + log(x² + 4) − log(3x² + 4x + 5)], so dy/dx =', ['(y/2)[1/(x − 3) + 2x/(x² + 4) − (6x + 4)/(3x² + 4x + 5)]', 'y[1/(x − 3) + 2x/(x² + 4)]', '½[1/(x − 3) + 2x/(x² + 4) − (6x + 4)/(3x² + 4x + 5)]', '(y/2)(x − 3)(x² + 4)'], 0, 'Multiply back by y.');
      exTag('Example 28', 'aˣ');
      await quiz('d/dx aˣ =', ['aˣ log a', 'x aˣ⁻¹', 'aˣ', 'aˣ / log a'], 0, 'log y = x log a.');
      exTag('Example 30', 'yˣ + xʸ + xˣ = aᵇ');
      await quiz('d/dx (xˣ) =', ['xˣ(1 + log x)', 'x · xˣ⁻¹', 'xˣ log x', 'xˣ'], 0, 'log w = x log x.');
      await J('think', 'Doing the same for yˣ and xʸ and adding gives dy/dx = −[yˣ log y + y·xʸ⁻¹ + xˣ(1 + log x)] / [x·yˣ⁻¹ + xʸ log x].');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'y = u^v ⇒ dy/dx = y[v u′/u + v′ log u]', eq: true }, '(aˣ)′ = aˣ log a, (xˣ)′ = xˣ(1 + log x)']); },
  ],
}));

LESSONS.push(lesson({
  id: 'param', title: 'Parametric Curves', blurb: 'x and y both move with t. dy/dx = (dy/dt)/(dx/dt). Circles, parabolas, cycloids, astroids. Examples 31–34.', face: 'kimmy-lookup',
  steps: [
    async function () {
      enterScene('par', (W) => parSet(W, (t) => 2 * Math.cos(t), (t) => 2 * Math.sin(t), 0, 2 * PI, 0.6, [-4, 4, -3, 3], 'θ'));
      await slam('dy/dx = ẏ / ẋ', 'Lesson ' + L.num + ' · Section 5.6');
      exTag('Example 31', 'x = a cos θ, y = a sin θ');
      await J('idle', 'Slide θ. The red arrow is dx/dθ, the blue one dy/dθ; their ratio is the tangent slope.');
      W.sl = parSlider(W);
      await task('Slide θ to about 2', () => Math.abs(W.t - 2) < 0.006, (W) => { W.t = 2; W.sl.value = 2; });
      await quiz('dy/dx =', ['−cot θ', 'cot θ', '−tan θ', 'tan θ'], 0, 'a cos θ / (−a sin θ).');
      await numQ('−cot 2 = ? (2 decimals)', -1 / Math.tan(2), 'Matches the readout.', { tol: 0.011, show: fmtN(-1 / Math.tan(2), 3) });
      await cont();
    },
    async function () {
      enterScene('par', (W) => parSet(W, (t) => t * t, (t) => 2 * t, -2.5, 2.5, 1, [-1, 7, -5.5, 5.5]));
      exTag('Example 32', 'x = at², y = 2at');
      await quiz('dy/dx = 2a / 2at =', ['1/t', 't', '2t', 'a/t'], 0, 'A parabola y² = 4ax.');
      exTag('Example 33', 'cycloid x = a(θ + sin θ), y = a(1 − cos θ)');
      parSet(W, (t) => t + Math.sin(t), (t) => 1 - Math.cos(t), -3, 9, 1, [-4, 11, -1, 4], 'θ'); SFX.flip();
      await quiz('dy/dx = a sin θ / a(1 + cos θ) =', ['tan(θ/2)', 'cot(θ/2)', 'tan θ', 'sin θ'], 0, 'Half-angle formulas.');
      exTag('Example 34', 'x^⅔ + y^⅔ = a^⅔');
      parSet(W, (t) => Math.cos(t) ** 3 * 2, (t) => Math.sin(t) ** 3 * 2, 0, 2 * PI, 0.7, [-3, 3, -2.3, 2.3], 'θ'); SFX.flip();
      await quiz('With x = a cos³θ, y = a sin³θ: dy/dx =', ['−tan θ = −∛(y/x)', 'tan θ', '−cot θ', '∛(x/y)'], 0, '3a sin²θ cos θ / (−3a cos²θ sin θ).');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'dy/dx = (dy/dt) / (dx/dt), dx/dt ≠ 0', eq: true }, 'The answer may stay in terms of t.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'second', title: 'Second Derivatives', blurb: 'Differentiate twice. The second derivative is the slope of the slope. Examples 35–38.', face: 'jess-thinking',
  steps: [
    async function () {
      const f = (x) => x ** 3 + Math.tan(x);
      enterScene('calc', (W) => { calcView(W, f, -1.3, 1.3, { y: [-5, 5] }); W.extraF = [{ f: (x) => ND(f, x), col: C.beni, dash: [7, 5] }]; W.a = 0.5; W.tan = true; grabCalc(W); W.pl.caption = 'solid: y · dashed: dy/dx'; });
      await slam('d²y/dx²', 'Lesson ' + L.num + ' · Section 5.7');
      exTag('Example 35', 'y = x³ + tan x');
      await quiz('dy/dx = 3x² + sec²x, so d²y/dx² =', ['6x + 2sec²x tan x', '6x + sec²x', '6x + 2 sec x', '3x² + tan x'], 0, 'd/dx sec²x = 2 sec x · sec x tan x.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 36–38'; W.sub = 'differential equations'; });
      exTag('Example 36', 'y = A sin x + B cos x');
      await quiz('y″ =', ['−A sin x − B cos x = −y', 'A sin x + B cos x', 'A cos x − B sin x', '0'], 0, 'So y″ + y = 0.');
      exTag('Example 37', 'y = 3e²ˣ + 2e³ˣ');
      await fields('y″ − 5y′ + 6y: coefficients of e²ˣ and e³ˣ', [{ l: 'e²ˣ', a: 12 - 30 + 18 }, { l: 'e³ˣ', a: 18 - 30 + 12 }]).then((r) => verdict(r, 'Both 0: y″ − 5y′ + 6y = 0.', '0 and 0.'));
      exTag('Example 38', 'y = sin⁻¹ x');
      await order('Show (1 − x²)y₂ − xy₁ = 0', ['y₁ = 1/√(1 − x²)', '(1 − x²)y₁² = 1', 'Differentiate: (1 − x²)·2y₁y₂ − 2x y₁² = 0', 'Divide by 2y₁: (1 − x²)y₂ − xy₁ = 0']).then((r) => verdict(r, 'Squaring first avoids messy roots.', 'Square y₁ first.'));
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'y₂ = d/dx (dy/dx)', eq: true }, 'Trick: square or clear denominators before the second differentiation.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'miscex', title: 'Tricks & Substitutions', blurb: 'Simplify first: cos⁻¹(sin x) = π/2 − x, tan⁻¹(sin x/(1 + cos x)) = x/2. Examples 39–43.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('calc', (W) => { calcView(W, (x) => Math.acos(Math.sin(x)), -1.5, 1.5); W.a = 0; W.tan = true; grabCalc(W); });
      await slam('SIMPLIFY FIRST', 'Lesson ' + L.num + ' · Miscellaneous Examples');
      exTag('Example 39', '√(3x + 2) + 1/√(2x² + 4) and log₇(log x)');
      await quiz('d/dx log₇(log x) =', ['1/(x log 7 log x)', '1/(x log x)', 'log 7/(x log x)', '1/(7x log x)'], 0, 'log₇ u = log u / log 7.');
      exTag('Example 40', 'cos⁻¹(sin x), tan⁻¹(sin x/(1 + cos x)), sin⁻¹(2ˣ⁺¹/(1 + 4ˣ))');
      await J('idle', 'The graph of cos⁻¹(sin x) here is a straight line of slope −1: it IS π/2 − x.');
      await numQ('d/dx cos⁻¹(sin x) = ?', -1, '−1.');
      await quiz('tan⁻¹(sin x/(1 + cos x)) simplifies to', ['x/2', 'x', '2x', 'tan x'], 0, 'Half-angle: tan(x/2). Derivative 1/2.');
      await quiz('With 2ˣ = tan θ, sin⁻¹(2ˣ⁺¹/(1 + 4ˣ)) = 2 tan⁻¹(2ˣ). Its derivative is', ['2ˣ⁺¹ log 2 / (1 + 4ˣ)', '2ˣ log 2', '2/(1 + 4ˣ)', '2ˣ⁺¹/(1 + 4ˣ)'], 0, '2 · (2ˣ log 2)/(1 + 4ˣ).');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 41–43'; W.sub = 'log, parametric, d/dv'; });
      exTag('Example 41', '(sin x)^(sin x)');
      await quiz('f′(x) =', ['(1 + log sin x) cos x · (sin x)^(sin x)', 'sin x (sin x)^(sin x − 1)', 'cos x log sin x', '(sin x)^(cos x)'], 0, 'log y = sin x log sin x.');
      exTag('Example 42', 'y = a^(t + 1/t), x = (t + 1/t)ᵃ');
      await quiz('dy/dx =', ['a^(t + 1/t) log a / [a(t + 1/t)^(a − 1)]', 'a^(t + 1/t) log a', '(t + 1/t)ᵃ', 'log a / a'], 0, 'The (1 − 1/t²) factors cancel.');
      exTag('Example 43', 'sin²x with respect to e^(cos x)');
      await quiz('du/dv = (du/dx)/(dv/dx) =', ['−2 cos x / e^(cos x)', '2 cos x e^(cos x)', '−2 sin x', 'sin 2x'], 0, '2 sin x cos x / (−sin x e^(cos x)).');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Simplify inverse-trig expressions before differentiating', eq: true }, 'd(u)/d(v) = (du/dx)/(dv/dx)']); },
  ],
}));

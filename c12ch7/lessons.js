/* =========================================================
   CLASS 12 · CHAPTER 7 · INTEGRALS — lessons (Examples 1–42)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const { sin, cos, tan, log, exp, sqrt, abs, asin, atan } = Math;
const PI = Math.PI, ln = (x) => log(abs(x));
const sec = (x) => 1 / cos(x), csc = (x) => 1 / sin(x), cot = (x) => 1 / tan(x);
const pk = { keys: 'π √', tol: 1e-4 };

LESSONS.push(lesson({
  id: 'anti', title: 'Undo the Derivative', blurb: 'An antiderivative F has slope f everywhere. Slide the constant C to see the whole family. Examples 1–4.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('integ', (W) => { integSet(W, (x) => cos(2 * x), (x) => sin(2 * x) / 2, -3.2, 3.2, { withF: true, Fp: 1 }); W.P = 0.5; });
      await slam('∫ f dx', 'Class 12 · Lesson 1 · Section 7.2');
      await J('idle', 'Blue is f(x) = cos 2x. Red is F(x) = ½ sin 2x. Drag the gold point: the slope of red always equals the height of blue.');
      W.drags = [{ get: () => [W.P, (W.F(W.P) + W.C) / W.ys], r: 0.8, set: (x) => { const v = clamp(Math.round(x * 20) / 20, -3.1, 3.1); if (v !== W.P) { W.P = v; SFX.tick(); W.moved = (W.moved || 0) + 1; } } }];
      await task('Drag the gold point to x = 1', () => Math.abs(W.P - 1) < 0.026, (W) => (W.P = 1));
      const sl = slider('constant C', -2, 2, 0.25, 0, (v) => 'C = ' + v, (v) => (W.C = v), 1);
      await J('think', 'Now slide C. Every shifted copy has the same slopes, so every one is an antiderivative.');
      await task('Shift the curve up by C = 1', () => W.C === 1, (W) => { W.C = 1; sl.value = 1; });
      await discover('∫ f dx = F(x) + C', 'One antiderivative plus any constant gives them all.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 1–3'; W.sub = 'by inspection'; });
      exTag('Example 1', 'antiderivatives by inspection');
      await match('Match each f with an antiderivative', ['cos 2x', '3x² + 4x³', '1/x'], ['log |x|', '½ sin 2x', 'x³ + x⁴'], [1, 2, 0]).then((r) => verdict(r, 'Differentiate back to check.', 'See the arrows.'));
      exTag('Example 2', 'power rule');
      await quiz('∫ (x³ − 1)/x² dx =', ['x²/2 + 1/x + C', 'x²/2 − 1/x + C', 'x⁴/4 − x + C', '3x² + C'], 0, 'Split: x − x⁻².');
      await quiz('∫ (x^(3/2) + 2eˣ − 1/x) dx =', ['(2/5)x^(5/2) + 2eˣ − log|x| + C', '(3/2)x^(1/2) + 2eˣ + 1/x² + C', '(2/5)x^(5/2) + eˣ − log x + C', 'x^(5/2) + 2eˣ + C'], 0, 'Term by term.');
      exTag('Example 3', 'trig');
      await quiz('∫ cosec x (cosec x + cot x) dx =', ['−cot x − cosec x + C', 'cot x + cosec x + C', '−cot x + cosec x + C', 'tan x − sec x + C'], 0, '∫ cosec² + ∫ cosec cot.');
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => 4 * x ** 3 - 6, (x) => x ** 4 - 6 * x, -2, 2.4, { withF: true, Fp: 1 }));
      exTag('Example 4', 'F′ = 4x³ − 6 with F(0) = 3');
      const sl = slider('C', -4, 6, 1, 0, (v) => 'C = ' + v, (v) => (W.C = v), 3);
      await task('Slide C until the red curve passes through (0, 3)', () => W.C === 3, (W) => { W.C = 3; sl.value = 3; });
      await numQ('So F(x) = x⁴ − 6x + C with C = ?', 3, 'F(x) = x⁴ − 6x + 3.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: '∫ xⁿ dx = xⁿ⁺¹/(n + 1) + C (n ≠ −1), ∫ dx/x = log|x| + C', eq: true }, 'Integrate term by term; a condition like F(0) = 3 fixes C.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'subst', title: 'Substitution', blurb: 'Spot an inside function whose derivative is also present. Plus ∫tan, cot, sec, cosec and trig identities. Examples 5–7.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => 2 * x * sin(x * x + 1), (x) => -cos(x * x + 1), -2.2, 2.2, { ab: [0, 1.5] }));
      await slam('PUT t = g(x)', 'Lesson ' + L.num + ' · Section 7.3.1');
      exTag('Example 5', '2x sin(x² + 1)');
      await J('idle', 'The derivative of x² + 1 is 2x, and 2x is sitting right there. Put t = x² + 1, dt = 2x dx.');
      await quiz('∫ 2x sin(x² + 1) dx =', ['−cos(x² + 1) + C', 'cos(x² + 1) + C', '−2x cos(x² + 1) + C', 'sin(x² + 1) + C'], 0, '∫ sin t dt = −cos t.');
      await showF(W); await shadeRun(W);
      await quiz('∫ sin(tan⁻¹ x)/(1 + x²) dx =', ['−cos(tan⁻¹ x) + C', 'cos(tan⁻¹ x) + C', 'sin(tan⁻¹ x) + C', 'tan⁻¹(sin x) + C'], 0, 't = tan⁻¹ x, dt = dx/(1 + x²).');
      await quiz('∫ tan⁴√x sec²√x / √x dx =', ['(2/5) tan⁵√x + C', '(1/5) tan⁵√x + C', '2 tan⁵√x + C', 'tan⁴√x + C'], 0, 't = √x then u = tan t.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '7.3.1'; W.sub = 'four standard results'; });
      await match('Match the standard integrals', ['∫ tan x dx', '∫ cot x dx', '∫ sec x dx', '∫ cosec x dx'], ['log |sin x| + C', 'log |cosec x − cot x| + C', 'log |sec x| + C', 'log |sec x + tan x| + C'], [2, 0, 3, 1]).then((r) => verdict(r, 'Each comes from a clever t.', 'tan: t = cos x; cot: t = sin x; sec: multiply by sec + tan.'));
      exTag('Example 6', 'sin³x cos²x, sin x/sin(x + a), 1/(1 + tan x)');
      await quiz('∫ sin³x cos²x dx =', ['−cos³x/3 + cos⁵x/5 + C', 'sin⁴x cos³x/12 + C', 'cos³x/3 − cos⁵x/5 + C', '−cos⁴x/4 + C'], 0, 'Keep one sin x, t = cos x.');
      await quiz('∫ sin x / sin(x + a) dx =', ['x cos a − sin a log |sin(x + a)| + C', 'x sin a − cos a log |sin(x + a)| + C', 'log |sin(x + a)| + C', 'x + C'], 0, 'Put t = x + a and expand sin(t − a).');
      await quiz('∫ dx/(1 + tan x) =', ['x/2 + ½ log |cos x + sin x| + C', 'log |1 + tan x| + C', 'x + log |cos x| + C', 'x/2 − ½ log |cos x + sin x| + C'], 0, 'Write as cos x/(cos x + sin x) and split.');
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => cos(x) ** 2, (x) => x / 2 + sin(2 * x) / 4, -3.2, 3.2, { ab: [0, PI], lab: piLab7, withF: true }));
      exTag('Example 7', 'cos²x, sin 2x cos 3x, sin³x');
      await quiz('cos²x = (1 + cos 2x)/2, so ∫ cos²x dx =', ['x/2 + (1/4) sin 2x + C', 'x/2 − (1/4) sin 2x + C', 'cos³x/3 + C', 'sin²x/2 + C'], 0, 'Lower the power with the double angle.');
      await showF(W); await shadeRun(W);
      await quiz('∫ sin 2x cos 3x dx =', ['−(1/10) cos 5x + ½ cos x + C', '(1/10) cos 5x − ½ cos x + C', '−(1/5) cos 5x + cos x + C', 'sin 5x/10 + C'], 0, 'sin 2x cos 3x = ½(sin 5x − sin x).');
      await quiz('∫ sin³x dx =', ['−(3/4) cos x + (1/12) cos 3x + C', '(3/4) cos x − (1/12) cos 3x + C', '−cos⁴x/4 + C', 'sin⁴x/4 + C'], 0, 'sin³x = (3 sin x − sin 3x)/4 (same as −cos x + cos³x/3).');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '∫ f(g(x)) g′(x) dx = ∫ f(t) dt', eq: true }, 'Trig powers: use double/triple angle or product-to-sum identities.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'special', title: 'Special Integrals', blurb: 'Six standard forms with x² ± a² and a² − x², completing the square, and the A·(derivative) + B trick. Examples 8–10.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => 1 / (x * x - 16), (x) => (1 / 8) * ln((x - 4) / (x + 4)), -3.5, 3.5, { ab: [-2, 2] }));
      await slam('a² ± x²', 'Lesson ' + L.num + ' · Section 7.4');
      await match('Match the forms', ['∫ dx/(x² − a²)', '∫ dx/(x² + a²)', '∫ dx/√(a² − x²)', '∫ dx/√(x² + a²)'], ['(1/a) tan⁻¹(x/a)', 'sin⁻¹(x/a)', '(1/2a) log |(x − a)/(x + a)|', 'log |x + √(x² + a²)|'], [2, 0, 1, 3]).then((r) => verdict(r, 'The six standard formulae (two more: a² − x² and √(x² − a²)).', 'See the table.'));
      exTag('Example 8', '1/(x² − 16), 1/√(2x − x²)');
      await quiz('∫ dx/(x² − 16) =', ['(1/8) log |(x − 4)/(x + 4)| + C', '(1/4) tan⁻¹(x/4) + C', '(1/8) log |(x + 4)/(x − 4)| + C', 'log |x² − 16| + C'], 0, 'a = 4.'); await showF(W); await shadeRun(W);
      await quiz('2x − x² = 1 − (x − 1)², so ∫ dx/√(2x − x²) =', ['sin⁻¹(x − 1) + C', 'cos⁻¹(x − 1) + C', 'log |x − 1 + √(2x − x²)| + C', 'tan⁻¹(x − 1) + C'], 0, 'Form (5).');
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => 1 / (x * x - 6 * x + 13), (x) => 0.5 * atan((x - 3) / 2), -1, 7, { ab: [1, 5] }));
      exTag('Example 9', 'complete the square');
      await fields('x² − 6x + 13 = (x − h)² + k²', [{ l: 'h', a: 3 }, { l: 'k', a: 2 }]).then((r) => verdict(r, '(x − 3)² + 2².', 'h = 3, k = 2.'));
      await quiz('So ∫ dx/(x² − 6x + 13) =', ['½ tan⁻¹((x − 3)/2) + C', 'tan⁻¹(x − 3) + C', '¼ log |(x − 5)/(x − 1)| + C', '½ tan⁻¹(x − 3) + C'], 0, 'Form (3) with a = 2.'); await showF(W); await shadeRun(W);
      await quiz('∫ dx/(3x² + 13x − 10) =', ['(1/17) log |(3x − 2)/(x + 5)| + C', '(1/17) log |(x + 5)/(3x − 2)| + C', '(1/13) tan⁻¹ x + C', '(1/3) log |3x² + 13x − 10| + C'], 0, '3[(x + 13/6)² − (17/6)²].');
      await quiz('∫ dx/√(5x² − 2x) =', ['(1/√5) log |x − 1/5 + √(x² − 2x/5)| + C', '√5 log |x + √(5x² − 2x)| + C', 'sin⁻¹(5x − 1) + C', '(1/√5) sin⁻¹(5x − 1) + C'], 0, '√5 √((x − 1/5)² − (1/5)²).');
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => (x + 2) / (2 * x * x + 6 * x + 5), (x) => 0.25 * log(2 * x * x + 6 * x + 5) + 0.5 * atan(2 * x + 3), -4, 2, { ab: [-3, 1] }));
      exTag('Example 10', '(x + 2)/(2x² + 6x + 5)');
      await J('idle', 'Write the top as A × (derivative of the bottom) + B: x + 2 = A(4x + 6) + B.');
      await fields('Compare coefficients', [{ l: 'A', a: 0.25, show: '1/4' }, { l: 'B', a: 0.5, show: '1/2' }]).then((r) => verdict(r, '4A = 1 and 6A + B = 2.', 'A = 1/4, B = 1/2.'));
      await quiz('∫ =', ['¼ log |2x² + 6x + 5| + ½ tan⁻¹(2x + 3) + C', '¼ log |2x² + 6x + 5| + tan⁻¹(2x + 3) + C', '½ log |2x² + 6x + 5| + C', 'tan⁻¹(2x + 3) + C'], 0, 'Log part + arctan part.'); await showF(W); await shadeRun(W);
      await quiz('∫ (x + 3)/√(5 − 4x − x²) dx =', ['−√(5 − 4x − x²) + sin⁻¹((x + 2)/3) + C', '√(5 − 4x − x²) + sin⁻¹((x + 2)/3) + C', '−2√(5 − 4x − x²) + C', 'sin⁻¹((x + 2)/3) + C'], 0, 'x + 3 = −½(−4 − 2x) + 1.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Complete the square, then use a standard form', eq: true }, 'px + q = A·(ax² + bx + c)′ + B splits into a log/root part and a standard part.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'partial', title: 'Partial Fractions', blurb: 'Tune A and B with sliders until the simple fractions rebuild the rational function. Examples 11–16.', face: 'jess-excited',
  steps: [
    async function () {
      const f = (x) => 1 / ((x + 1) * (x + 2));
      enterScene('integ', (W) => { integSet(W, f, null, -5, 2, { y: [-6, 6] }); W.A = 0; W.B = 0; W.cap = 'blue: 1/((x + 1)(x + 2)) · red: A/(x + 1) + B/(x + 2)'; W.F = (x) => W.A / (x + 1) + W.B / (x + 2); W.Fp = 1; });
      await slam('A/(x−a) + B/(x−b)', 'Lesson ' + L.num + ' · Section 7.5');
      exTag('Example 11', '1/((x + 1)(x + 2))');
      await J('idle', 'The red curve is A/(x + 1) + B/(x + 2). Slide A and B until red sits exactly on blue.');
      const sa = slider('A', -3, 3, 0.5, 0, (v) => 'A = ' + v, (v) => (W.A = v), 1), sb = slider('B', -3, 3, 0.5, 0, (v) => 'B = ' + v, (v) => (W.B = v), -1);
      await task('Match the curves', () => W.A === 1 && W.B === -1, (W) => { W.A = 1; W.B = -1; sa.value = 1; sb.value = -1; });
      sa.parentNode.remove(); sb.parentNode.remove();
      await quiz('So ∫ dx/((x + 1)(x + 2)) =', ['log |(x + 1)/(x + 2)| + C', 'log |(x + 2)/(x + 1)| + C', 'log |(x + 1)(x + 2)| + C', '1/(x + 2) + C'], 0, 'log|x + 1| − log|x + 2|.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 12–16'; W.sub = 'more forms'; });
      exTag('Example 12', '(x² + 1)/(x² − 5x + 6)');
      await quiz('Divide first: 1 + (5x − 5)/((x − 2)(x − 3)) = 1 − 5/(x − 2) + 10/(x − 3). So ∫ =', ['x − 5 log |x − 2| + 10 log |x − 3| + C', 'x + 5 log |x − 2| − 10 log |x − 3| + C', '5 log |x − 2| + C', 'x − log |x² − 5x + 6| + C'], 0, 'Improper: divide before splitting.');
      exTag('Example 13', '(3x − 2)/((x + 1)²(x + 3))');
      await fields('A/(x + 1) + B/(x + 1)² + C/(x + 3)', [{ l: 'A', a: 11 / 4, show: '11/4' }, { l: 'B', a: -5 / 2, show: '−5/2' }, { l: 'C', a: -11 / 4, show: '−11/4' }]).then((r) => verdict(r, '∫ = (11/4) log |(x + 1)/(x + 3)| + 5/(2(x + 1)) + C.', 'A = 11/4, B = −5/2, C = −11/4.'));
      exTag('Example 14', 'x²/((x² + 1)(x² + 4))');
      await quiz('Put x² = y: y/((y + 1)(y + 4)) = −1/(3(y + 1)) + 4/(3(y + 4)). So ∫ =', ['−(1/3) tan⁻¹ x + (2/3) tan⁻¹(x/2) + C', '(1/3) tan⁻¹ x − (2/3) tan⁻¹(x/2) + C', '−(1/3) tan⁻¹ x + (4/3) tan⁻¹(x/2) + C', 'log |(x² + 4)/(x² + 1)| + C'], 0, '∫ 4/(3(x² + 4)) = (4/3)(1/2) tan⁻¹(x/2).');
      exTag('Example 15', '(3 sin φ − 2) cos φ/(5 − cos²φ − 4 sin φ)');
      await quiz('y = sin φ turns it into (3y − 2)/(y − 2)² = 3/(y − 2) + 4/(y − 2)². So ∫ =', ['3 log (2 − sin φ) + 4/(2 − sin φ) + C', '3 log (2 − sin φ) − 4/(2 − sin φ) + C', '3 log |sin φ| + C', '4/(2 − sin φ) + C'], 0, '∫ 4/(y − 2)² = −4/(y − 2).');
      exTag('Example 16', '(x² + x + 1)/((x + 2)(x² + 1))');
      await fields('A/(x + 2) + (Bx + C)/(x² + 1)', [{ l: 'A', a: 0.6, show: '3/5' }, { l: 'B', a: 0.4, show: '2/5' }, { l: 'C', a: 0.2, show: '1/5' }]).then((r) => verdict(r, '∫ = (3/5) log |x + 2| + (1/5) log (x² + 1) + (1/5) tan⁻¹ x + C.', 'A = 3/5, B = 2/5, C = 1/5.'));
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Proper fraction → partial fractions → logs and arctans', eq: true }, '(x − a)² needs A/(x − a) + B/(x − a)²; x² + bx + c needs (Bx + C)/(x² + bx + c).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'parts', title: 'Integration by Parts', blurb: 'First × ∫second − ∫(first′ × ∫second). Pick the first with ILATE. eˣ[f + f′]. Examples 17–24.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => x * cos(x), (x) => x * sin(x) + cos(x), -4, 4, { ab: [0, 2], withF: true }));
      await slam('∫ u v dx', 'Lesson ' + L.num + ' · Section 7.6');
      exTag('Example 17', 'x cos x');
      await order('Integrate x cos x by parts', ['First = x, second = cos x', '= x sin x − ∫ 1 · sin x dx', '= x sin x + cos x + C']).then((r) => verdict(r, 'Choosing cos x as first makes it worse.', 'Take x as the first function.'));
      await showF(W); await shadeRun(W);
      exTag('Examples 18–20', 'log x, x eˣ, x sin⁻¹x/√(1 − x²)');
      await match('Match the results', ['∫ log x dx', '∫ x eˣ dx', '∫ x sin⁻¹x/√(1 − x²) dx'], ['x eˣ − eˣ + C', 'x − √(1 − x²) sin⁻¹x + C', 'x log x − x + C'], [2, 0, 1]).then((r) => verdict(r, 'log x: take 1 as the second function.', 'See the arrows.'));
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => exp(x) * sin(x), (x) => (exp(x) / 2) * (sin(x) - cos(x)), -3, 2.5, { ab: [0, 2] }));
      exTag('Example 21', 'eˣ sin x');
      await J('think', 'Do parts twice and the original integral comes back: I = −eˣ cos x + eˣ sin x − I.');
      await quiz('So I =', ['(eˣ/2)(sin x − cos x) + C', '(eˣ/2)(sin x + cos x) + C', 'eˣ(sin x − cos x) + C', '−eˣ cos x + C'], 0, '2I = eˣ(sin x − cos x).'); await showF(W); await shadeRun(W);
      exTag('Example 22', 'eˣ[f(x) + f′(x)] = eˣ f(x)');
      await quiz('∫ eˣ (tan⁻¹x + 1/(1 + x²)) dx =', ['eˣ tan⁻¹x + C', 'eˣ/(1 + x²) + C', 'eˣ(1 + x²) + C', 'tan⁻¹(eˣ) + C'], 0, 'f = tan⁻¹ x.');
      await quiz('∫ (x² + 1)eˣ/(x + 1)² dx =', ['(x − 1)eˣ/(x + 1) + C', 'eˣ/(x + 1) + C', '(x + 1)eˣ + C', 'x eˣ/(x + 1)² + C'], 0, 'f = (x − 1)/(x + 1), f′ = 2/(x + 1)².');
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => sqrt(x * x + 2 * x + 5), (x) => 0.5 * (x + 1) * sqrt(x * x + 2 * x + 5) + 2 * log(abs(x + 1 + sqrt(x * x + 2 * x + 5))), -4, 2, { ab: [-2, 1] }));
      exTag('Examples 23–24', '√(x² + 2x + 5), √(3 − 2x − x²)');
      await match('Match the three special results', ['∫ √(x² − a²) dx', '∫ √(x² + a²) dx', '∫ √(a² − x²) dx'], ['(x/2)√(a² − x²) + (a²/2) sin⁻¹(x/a)', '(x/2)√(x² − a²) − (a²/2) log |x + √(x² − a²)|', '(x/2)√(x² + a²) + (a²/2) log |x + √(x² + a²)|'], [1, 2, 0]).then((r) => verdict(r, 'Parts with 1 as the second function.', 'See the arrows.'));
      await quiz('∫ √(x² + 2x + 5) dx with x + 1 = y, a = 2:', ['½(x + 1)√(x² + 2x + 5) + 2 log |x + 1 + √(x² + 2x + 5)| + C', '½(x + 1)√(x² + 2x + 5) + 2 sin⁻¹((x + 1)/2) + C', '(x + 1)√(x² + 2x + 5) + C', '2 log |x + 1 + √(x² + 2x + 5)| + C'], 0, 'a²/2 = 2.'); await showF(W); await shadeRun(W);
      await quiz('∫ √(3 − 2x − x²) dx =', ['½(x + 1)√(3 − 2x − x²) + 2 sin⁻¹((x + 1)/2) + C', '½(x + 1)√(3 − 2x − x²) − 2 sin⁻¹((x + 1)/2) + C', '(x + 1)√(3 − 2x − x²) + C', '2 log |x + 1 + √(3 − 2x − x²)| + C'], 0, '4 − (x + 1)².');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '∫ u v dx = u∫v dx − ∫(u′ ∫v dx) dx', eq: true }, '∫ eˣ[f(x) + f′(x)] dx = eˣ f(x) + C']); },
  ],
}));

LESSONS.push(lesson({
  id: 'definite', title: 'Area & the Fundamental Theorem', blurb: 'Shade the area under f; it equals the rise of any antiderivative: ∫ₐᵇ f = F(b) − F(a). Examples 25–27.', face: 'jess-happy',
  steps: [
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => x * x, (x) => x ** 3 / 3, 1, 3.6, { ab: [2, 3], withF: true }));
      await slam('F(b) − F(a)', 'Lesson ' + L.num + ' · Section 7.8');
      exTag('Example 25 (i)', '∫₂³ x² dx');
      await J('idle', 'Fill the area with rectangles. More rectangles, better fit. The limit is the exact area.');
      W.shade = 1; const sl = slider('rectangles n', 1, 40, 1, 1, (v) => 'n = ' + v, (v) => (W.n = v), 40);
      await task('Slide to 40 rectangles', () => W.n >= 40, (W) => { W.n = 40; sl.value = 40; });
      await showF(W);
      await numQ('F(3) − F(2) = 9 − 8/3 = ?', 19 / 3, '19/3: the red curve rises exactly by the blue area.', { show: '19/3' });
      await discover('∫ₐᵇ f(x) dx = F(b) − F(a)', 'Second fundamental theorem: the constant C cancels.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (t) => sin(2 * t) ** 3 * cos(2 * t), (t) => sin(2 * t) ** 4 / 8, -0.2, 1, { ab: [0, PI / 4], lab: piLab7 }));
      exTag('Example 25 (ii–iv)', 'substitute, partial fractions, trig');
      await numQ('∫₄⁹ √x/(30 − x^(3/2))² dx = (2/3)[1/(30 − x^(3/2))]₄⁹ = ?', 19 / 99, '(2/3)(1/3 − 1/22) = 19/99.', { show: '19/99' });
      await numQ('∫₁² x/((x + 1)(x + 2)) dx = log(32/27) ≈ ? (2 decimals)', log(32 / 27), 'log(32/27) ≈ 0.17.', { tol: 0.006, show: fmtN(log(32 / 27), 3) });
      await shadeRun(W);
      await numQ('∫₀^(π/4) sin³2t cos 2t dt = [sin⁴2t/8] = ?', 1 / 8, '1/8.', { show: '1/8' });
      exTag('Example 26', '∫₋₁¹ 5x⁴√(x⁵ + 1) dx');
      await numQ('t = x⁵ + 1 runs from 0 to 2: (2/3)·2^(3/2) = ? (use √)', (4 * sqrt(2)) / 3, '4√2/3.', { ...pk, show: '4√2/3' });
      exTag('Example 27', '∫₀¹ tan⁻¹x/(1 + x²) dx');
      await numQ('t = tan⁻¹ x from 0 to π/4: [t²/2] = ? (use π)', PI * PI / 32, 'π²/32.', { ...pk, show: 'π²/32' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'A′(x) = f(x) and ∫ₐᵇ f = F(b) − F(a)', eq: true }, 'With a substitution, change the limits too.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'props', title: 'Properties P₀–P₇', blurb: 'Flip, fold and split the interval: odd functions cancel, even ones double, f(a − x) tricks. Examples 28–34.', face: 'kimmy-lookup',
  steps: [
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => sin(x) ** 5 * cos(x) ** 4, null, -1.6, 1.6, { ab: [-1, 1] }));
      await slam('ODD CANCELS', 'Lesson ' + L.num + ' · Section 7.10');
      exTag('Example 31', '∫₋₁¹ sin⁵x cos⁴x dx');
      await shadeRun(W);
      await J('idle', 'The blue part above and the pink part below are mirror images: an odd function on [−a, a] cancels.');
      await numQ('So the integral = ?', 0, 'P₇(ii).', { tol: 1e-6 });
      exTag('Example 28', '∫₋₁² |x³ − x| dx'); integSet(W, (x) => abs(x ** 3 - x), null, -1.5, 2.4, { ab: [-1, 2] }); await shadeRun(W);
      await numQ('Split at −1, 0, 1, 2: total = ?', 11 / 4, '11/4.', { show: '11/4' });
      exTag('Example 29', '∫ sin²x over [−π/4, π/4]'); integSet(W, (x) => sin(x) ** 2, null, -1.2, 1.2, { ab: [-PI / 4, PI / 4], lab: piLab7 }); await shadeRun(W);
      await numQ('Even: 2∫₀^(π/4) sin²x dx = ? (use π)', PI / 4 - 0.5, 'π/4 − 1/2.', { ...pk, show: 'π/4 − 1/2' });
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => (x * sin(x)) / (1 + cos(x) ** 2), null, -0.3, 3.4, { ab: [0, PI], lab: piLab7 }));
      exTag('Example 30', '∫₀^π x sin x/(1 + cos²x) dx');
      await order('Use P₄: replace x by π − x', ['I = ∫₀^π (π − x) sin x/(1 + cos²x) dx', '2I = π ∫₀^π sin x/(1 + cos²x) dx', 't = cos x: 2I = π ∫₋₁¹ dt/(1 + t²)', 'I = π · π/4 = π²/4']).then((r) => verdict(r, 'Adding the two forms removes the x.', 'Replace x by π − x and add.'));
      await shadeRun(W); await numQ('Value = ? (use π)', PI * PI / 4, 'π²/4.', { ...pk, show: 'π²/4' });
      exTag('Example 32', '∫₀^(π/2) sin⁴x/(sin⁴x + cos⁴x) dx');
      await numQ('Add I with its P₄ twin: 2I = π/2, so I = ? (use π)', PI / 4, 'π/4.', { ...pk, show: 'π/4' });
      exTag('Example 33', '∫ over [π/6, π/3] of dx/(1 + √tan x)');
      await numQ('P₃ gives 2I = π/3 − π/6, so I = ? (use π)', PI / 12, 'π/12.', { ...pk, show: 'π/12' });
      exTag('Example 34', '∫₀^(π/2) log sin x dx');
      await numQ('= −(π/2) log 2 ≈ ? (2 decimals)', (-PI / 2) * log(2), '−(π/2) log 2 ≈ −1.09.', { tol: 0.006, show: fmtN((-PI / 2) * log(2), 3) });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '∫₀ᵃ f(x) dx = ∫₀ᵃ f(a − x) dx (P₄)', eq: true }, 'Odd on [−a, a] → 0; even → 2∫₀ᵃ. Split |·| where the sign changes.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'miscex', title: 'Mixed Integrals', blurb: 'Substitutions, partial fractions, parts and properties together. Examples 35–42.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 35–40'; W.sub = 'mixed'; });
      await slam('MIXED', 'Lesson ' + L.num + ' · Miscellaneous Examples');
      exTag('Example 35', 'cos 6x √(1 + sin 6x)');
      await quiz('t = 1 + sin 6x gives', ['(1/9)(1 + sin 6x)^(3/2) + C', '(1/6)(1 + sin 6x)^(3/2) + C', '(2/3)(1 + sin 6x)^(3/2) + C', '(1 + sin 6x)^(1/2) + C'], 0, '(1/6)(2/3)t^(3/2).');
      exTag('Example 36', '(x⁴ − x)^(1/4)/x⁵');
      await quiz('t = 1 − 1/x³ gives', ['(4/15)(1 − 1/x³)^(5/4) + C', '(4/5)(1 − 1/x³)^(5/4) + C', '(1/3)(1 − 1/x³)^(1/4) + C', '(4/15)(1 − x³)^(5/4) + C'], 0, '(1/3)(4/5)t^(5/4).');
      exTag('Example 37', 'x⁴/((x − 1)(x² + 1))');
      await quiz('∫ =', ['x²/2 + x + ½ log |x − 1| − ¼ log(x² + 1) − ½ tan⁻¹x + C', 'x²/2 + x + log |x − 1| + C', 'x + ½ log |x − 1| + ½ tan⁻¹ x + C', 'x²/2 − ½ log(x² + 1) + C'], 0, 'Divide, then A/(x − 1) + (Bx + C)/(x² + 1).');
      exTag('Example 38', 'log(log x) + 1/(log x)²');
      await quiz('∫ =', ['x log(log x) − x/log x + C', 'x log(log x) + x/log x + C', 'log(log x) + C', 'x/log x + C'], 0, 'Parts twice; two integrals cancel.');
      exTag('Example 39', '√cot x + √tan x');
      await quiz('tan x = t² leads to', ['√2 tan⁻¹((tan x − 1)/√(2 tan x)) + C', '√2 tan⁻¹(tan x − 1) + C', 'log |sin x + cos x| + C', '2√(tan x) + C'], 0, 'y = t − 1/t.');
      exTag('Example 40', 'sin 2x cos 2x/√(9 − cos⁴2x)');
      await quiz('t = cos²2x gives', ['−¼ sin⁻¹(cos²2x/3) + C', '¼ sin⁻¹(cos²2x/3) + C', '−¼ cos⁻¹(cos²2x/3) + C', '−(1/12) sin⁻¹(cos 2x) + C'], 0, '−¼ ∫ dt/√(9 − t²).');
      await cont();
    },
    async function () {
      enterScene('integ', (W) => integSet(W, (x) => abs(x * sin(PI * x)), null, -1.3, 1.8, { ab: [-1, 1.5] }));
      exTag('Example 41', '∫ |x sin πx| from −1 to 3/2');
      await shadeRun(W);
      await numQ('= 3/π + 1/π² ≈ ? (2 decimals)', 3 / PI + 1 / (PI * PI), '3/π + 1/π².', { tol: 0.006, show: fmtN(3 / PI + 1 / (PI * PI), 3) });
      exTag('Example 42', '∫₀^π x/(a²cos²x + b²sin²x) dx');
      await quiz('P₄ then split at π/2 gives', ['π²/(2ab)', 'π²/(ab)', 'π/(2ab)', 'π²/(4ab)'], 0, 'Each half gives (π/ab)(π/2)… total π²/2ab.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Choose the method from the shape of the integrand', eq: true }, 'Inside′ present → substitute · rational → partial fractions · product → parts']); },
  ],
}));

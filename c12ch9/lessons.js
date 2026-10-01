/* =========================================================
   CLASS 12 · CHAPTER 9 · DIFFERENTIAL EQUATIONS — lessons (Examples 1–22)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
async function tapN(W, n, seeds, text) { W.tapOn = true; await task(text || 'Tap the field to release ' + n + ' solution curves', () => W.taps >= n, async (W) => { for (const s of seeds.slice(0, n)) await release(W, ...s); }); W.tapOn = false; }
async function tapIC(W, ic, lab) { W.ic = ic; W.icLab = lab; W.tapOn = true; await task('Tap the pulsing point ' + lab, () => W.taps > 0, (W) => release(W, ...ic)); W.tapOn = false; }

LESSONS.push(lesson({
  id: 'order', title: 'Order & Degree', blurb: 'Stack the derivatives as blocks. Order = tallest column; degree = its power, unless a derivative is caged inside sin, cos, e or log. Section 9.2, Example 1.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('tower', (W) => towerSet(W, 'y‴ + x²(y″)³ = 0', [{ d: 3, p: 1, lab: 'y‴' }, { d: 2, p: 3, lab: 'x²(y″)³' }]));
      await slam('dy/dx = ?', 'Class 12 · Ch 9 · Section 9.2');
      await J('idle', 'A differential equation contains derivatives of the unknown function y. Each derivative sits in its own column: y′ is order 1, y″ order 2, y‴ order 3.');
      await task('Tap the column of the highest derivative', () => W.pick === 3, (W) => (W.pick = 3));
      await discover('Order = highest derivative present', 'Here y‴, so order 3, even though (y″) has the bigger power.');
      await K('think', 'And the degree? Is it the biggest power, 3?');
      await J('happy', 'No: degree is the power of the highest-order derivative only. y‴ has power 1, so degree 1.');
      W.show = 1; await cont(); hideFound();
    },
    async function () {
      enterScene('tower', (W) => towerSet(W, '(y′)² + y′ − sin²y = 0', [{ d: 1, p: 2, lab: '(y′)²' }, { d: 1, p: 1, lab: 'y′' }, { d: 0, p: 1, lab: 'sin²y' }]));
      exTag('9.2.2', 'degree');
      await quiz('Degree of (y′)² + y′ − sin²y = 0?', ['2', '1', 'not defined', '3'], 0, 'A polynomial in y′; highest power of y′ is 2. sin²y is fine: y is not a derivative.');
      W.show = 1;
      towerSet(W, 'y′ + sin(y′) = 0', [{ d: 1, p: 1, lab: 'y′' }, { d: 1, p: 1, lab: 'sin(y′)', cage: 'sin' }]);
      await quiz('Degree of y′ + sin(y′) = 0?', ['not defined', '1', '2', '0'], 0, 'y′ is caged inside sin: not a polynomial in y′.');
      await discover('Degree: only for polynomials in the derivatives', 'Then it is the power of the highest-order derivative. Order and degree are positive integers.');
      await cont(); hideFound();
    },
    async function () {
      exTag('Example 1', 'three equations');
      enterScene('tower', (W) => towerSet(W, 'dy/dx − cos x = 0', [{ d: 1, p: 1, lab: 'y′' }]));
      await quiz('(i) dy/dx − cos x = 0: order, degree', ['1, 1', '1, 0', '2, 1', '1, not defined'], 0, 'y′ to the first power.');
      towerSet(W, 'xy y″ + x(y′)² − y y′ = 0', [{ d: 2, p: 1, lab: 'xy·y″' }, { d: 1, p: 2, lab: 'x(y′)²' }, { d: 1, p: 1, lab: 'y·y′' }]);
      await quiz('(ii) xy y″ + x(y′)² − y y′ = 0: order, degree', ['2, 1', '2, 2', '1, 2', '2, not defined'], 0, 'Highest is y″, power 1.');
      towerSet(W, 'y‴ + y² + e^(y′) = 0', [{ d: 3, p: 1, lab: 'y‴' }, { d: 0, p: 2, lab: 'y²' }, { d: 1, p: 1, lab: 'e^(y′)', cage: 'e^' }]);
      await quiz('(iii) y‴ + y² + e^(y′) = 0: order, degree', ['3, not defined', '3, 1', '1, not defined', '3, 2'], 0, 'e^(y′) is not a polynomial in y′.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'Order = highest derivative · Degree = its power (if polynomial)', eq: true }, 'A derivative inside sin, cos, eˣ, log… makes the degree undefined.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'solutions', title: 'General vs Particular', blurb: 'A solution is a whole function. Slide its constants: the residual stays flat at zero. Section 9.3, Examples 2–3.', face: 'jess-thinking',
  steps: [
    async function () {
      let a = 1, k = 0; const yf = (x) => a * sin(x + (k * PI) / 4);
      enterScene('field', (W) => { fieldSet(W, null, null, [-5, 5, -3.2, 3.2], { fx: piLab9 }); W.fam = [{ f: (x) => yf(x) }]; W.res = resid((x) => yf(x), (x, y, y1, y2) => y2 + y); });
      await slam('y = a sin(x + b)', 'Section 9.3');
      await J('idle', 'For y″ + y = 0 the answer is not a number but a function. Blue is y = a sin(x + b). Red is LHS − RHS = y″ + y, computed from the blue curve.');
      const s1 = slider('a', 0.5, 3, 0.5, 1, (v) => 'a = ' + v, (v) => (a = v), 2), s2 = slider('b', 0, 4, 1, 0, (v) => 'b = ' + ['0', 'π/4', 'π/2', '3π/4', 'π'][v], (v) => (k = v), 1);
      await task('Make a = 2 and b = π/4. Watch the red line.', () => a === 2 && k === 1, () => { a = 2; k = 1; s1.value = 2; s2.value = 1; });
      await K('surprised', 'The red line never moved off zero!');
      await discover('General solution: arbitrary constants', 'y = a sin(x + b) solves y″ + y = 0 for every a, b. Fixing them (a = 2, b = π/4) gives a particular solution.');
      await quiz('How many arbitrary constants does the general solution of this 2nd-order equation have?', ['2', '1', '0', '3'], 0, 'As many as the order.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('field', (W) => { fieldSet(W, null, null, [-1.5, 2, -1, 4]); W.fam = [{ f: (x) => exp(-3 * x) }]; });
      exTag('Example 2', 'y = e^(−3x), y″ + y′ − 6y = 0');
      await quiz('y′ and y″ for y = e^(−3x):', ['−3e^(−3x), 9e^(−3x)', '3e^(−3x), 9e^(−3x)', '−3e^(−3x), −9e^(−3x)', 'e^(−3x), e^(−3x)'], 0, 'Chain rule twice.');
      await numQ('LHS = 9 − 3 − 6 times e^(−3x) = ?', 0, 'So y = e^(−3x) is a solution.');
      W.res = resid((x) => exp(-3 * x), (x, y, y1, y2) => y2 + y1 - 6 * y); SFX.swish(); await wait(0.8);
      exTag('Example 3', 'y = a cos x + b sin x, y″ + y = 0');
      let a = 1, b = 1; W.fam = [{ f: (x) => a * cos(x) + b * sin(x) }]; W.res = resid((x) => a * cos(x) + b * sin(x), (x, y, y1, y2) => y2 + y); planeView(W, -5, 5, -3, 3);
      const s1 = slider('a', -2, 2, 1, 1, (v) => 'a = ' + v, (v) => (a = v), -1), s2 = slider('b', -2, 2, 1, 1, (v) => 'b = ' + v, (v) => (b = v), 2);
      await task('Try a = −1, b = 2', () => a === -1 && b === 2, () => { a = -1; b = 2; s1.value = -1; s2.value = 2; });
      await quiz('y″ for y = a cos x + b sin x is', ['−a cos x − b sin x = −y', 'a cos x + b sin x', '−a sin x + b cos x', '0'], 0, 'So y″ + y = 0.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 2'; }); await summary([{ t: 'General solution: as many arbitrary constants as the order', eq: true }, 'Particular solution: constants fixed. To verify, substitute and get LHS = RHS.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'separable', title: 'Separate the Variables', blurb: 'Slope fields: every tiny dash is dy/dx. Tap to release a solution; separate, integrate, and the answer lands on it. Examples 4–9.', face: 'kimmy-excited',
  steps: [
    async function () {
      const F = (x, y) => (x + 1) / (2 - y), G = (x, y) => x * x + y * y + 2 * x - 4 * y;
      enterScene('field', (W) => fieldSet(W, F, G, [-5, 3, -1.5, 5.5]));
      await slam('SLOPE FIELD', 'Section 9.4.1');
      exTag('Example 4', 'dy/dx = (x + 1)/(2 − y)');
      await J('idle', 'Each dash has slope (x + 1)/(2 − y) at its point. A solution curve must follow the dashes everywhere. Tap anywhere to drop a ball and let it flow.');
      await tapN(W, 3, [[0, 2.5], [-1, 4], [1, 1]]);
      await K('think', 'They look like circles! Can we get the formula without tapping?');
      await quiz('Separate the variables:', ['(2 − y) dy = (x + 1) dx', 'dy/(2 − y) = (x + 1) dx', '(x + 1) dy = (2 − y) dx', 'dy = (x + 1)(2 − y) dx'], 0, 'y-stuff with dy, x-stuff with dx.');
      await quiz('Integrate: 2y − y²/2 = x²/2 + x + C₁ becomes', ['x² + y² + 2x − 4y + C = 0', 'x² − y² + 2x + 4y = C', 'x² + y² = C', 'y = x + C'], 0, 'Multiply by −2 and tidy: circles centred at (−1, 2).');
      await overlay(W);
      await discover('dy/dx = g(x)h(y) ⇒ ∫dy/h(y) = ∫g(x) dx', 'Variables separable: integrate both sides, one constant.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('field', (W) => fieldSet(W, (x, y) => (1 + y * y) / (1 + x * x), (x, y) => atan(y) - atan(x), [-4, 4, -3, 3]));
      exTag('Example 5', 'dy/dx = (1 + y²)/(1 + x²)');
      await quiz('General solution:', ['tan⁻¹y = tan⁻¹x + C', 'y = x + C', 'log(1 + y²) = log(1 + x²) + C', 'tan⁻¹y = x + C'], 0, 'dy/(1 + y²) = dx/(1 + x²).');
      await tapN(W, 2, [[0, 0.5], [-1, -1]]); await overlay(W); await wait(0.6);
      fieldSet(W, (x, y) => -4 * x * y * y, (x, y) => 1 / y - 2 * x * x, [-2.5, 2.5, -0.5, 1.6]);
      exTag('Example 6', 'dy/dx = −4xy², y(0) = 1');
      await quiz('General solution:', ['y = 1/(2x² − C)', 'y = 2x² + C', 'y = Ce^(−2x²)', 'y = 1/(x² + C)'], 0, '−1/y = −2x² + C.');
      await tapIC(W, [0, 1], '(0, 1)');
      await numQ('Put x = 0, y = 1 in y = 1/(2x² − C): C = ?', -1, 'So y = 1/(2x² + 1).');
      await overlay(W); await cont();
    },
    async function () {
      enterScene('field', (W) => fieldSet(W, (x) => (2 * x * x + 1) / x, (x, y) => y - x * x - ln(x), [0.1, 3, -2, 5]));
      exTag('Example 7', 'x dy = (2x² + 1) dx through (1, 1)');
      await quiz('General solution:', ['y = x² + log|x| + C', 'y = 2x² + x + C', 'y = x² + 1/x + C', 'y = log|x| + C'], 0, 'dy = (2x + 1/x) dx.');
      await tapIC(W, [1, 1], '(1, 1)');
      await numQ('1 = 1 + log 1 + C, so C = ?', 0, 'Curve: y = x² + log|x|.'); await overlay(W);
      fieldSet(W, (x, y) => (2 * x) / (y * y), (x, y) => y ** 3 / 3 - x * x, [-4, 3, -0.5, 5]);
      exTag('Example 8', 'slope 2x/y² through (−2, 3)');
      await tapIC(W, [-2, 3], '(−2, 3)');
      await numQ('y³/3 = x² + C at (−2, 3): C = ?', 5, '9 = 4 + C.');
      await overlay(W);
      await quiz('So the curve is', ['y = (3x² + 15)^(1/3)', 'y = (x² + 5)^(1/3)', 'y³ = x² + 5', 'y = 3x² + 15'], 0, 'y³ = 3x² + 15.');
      await cont();
    },
    async function () {
      enterScene('field', (W) => fieldSet(W, (x, y) => y / 20, (x, y) => y * exp(-x / 20), [-2, 25, -0.3, 3], { cap: 'P in ₹1000s, t in years' }));
      exTag('Example 9', 'continuous growth at 5%');
      await J('think', 'dP/dt = (5/100)P = P/20. Every dash gets steeper as P grows: growth feeds growth.');
      await tapIC(W, [0, 1], '₹1000 at t = 0');
      await quiz('Solving dP/P = dt/20 with P(0) = 1000:', ['P = 1000e^(t/20)', 'P = 1000 + 50t', 'P = 1000(1.05)ᵗ', 'P = 1000e^(20t)'], 0, 'log P = t/20 + C.');
      await overlay(W);
      await numQ('Doubling time t = 20 logₑ2 = ? years (2 decimals)', 20 * log(2), 't = 20 log 2 ≈ 13.86 years.', { tol: 0.006, show: '13.86' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 3'; }); await summary([{ t: 'dy/dx = g(x)h(y)  ⇒  ∫ dy/h(y) = ∫ g(x) dx + C', eq: true }, 'A given point fixes C: that is the particular solution.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'homog', title: 'Homogeneous Equations', blurb: 'When the slope depends only on y/x, every ray from O carries the same slope. Put y = vx. Examples 10–13.', face: 'jess-excited',
  steps: [
    async function () {
      const F = (x, y) => (x + 2 * y) / (x - y); let lam = 1;
      enterScene('field', (W) => { fieldSet(W, F, null, [-4, 4, -3, 3]); W.fam = [{ f: (x) => 0.5 * x, col: C.kin, w: 2.5, dash: [6, 5] }]; W.seed = [1, 0.5]; W.rd = [['slope at P = ' + fmtN(F(1, 0.5), 3), C['matcha-deep']]]; });
      await slam('y = vx', 'Section 9.4.2');
      await J('idle', 'F(x, y) = (x + 2y)/(x − y). Replace x, y by λx, λy: the λ cancels. So the slope is the same all along each ray from O.');
      const sl = slider('λ', 0.5, 3, 0.5, 1, (v) => 'λ = ' + v, (v) => { lam = v; W.seed = [v, 0.5 * v]; W.rd = [['P = (' + fmtN(v, 2) + ', ' + fmtN(v / 2, 2) + ')   slope = ' + fmtN(F(v, v / 2), 3), C['matcha-deep']]]; }, 3);
      await task('Slide P along the ray to λ = 3', () => lam === 3, () => { lam = 3; sl.value = 3; W.seed = [3, 1.5]; });
      await discover('Homogeneous: F(λx, λy) = λ⁰F(x, y)', 'Then F = g(y/x). Put y = vx, dy/dx = v + x dv/dx, and the variables separate.');
      await match('Match each function with its degree of homogeneity', ['y² + 2xy', '2x − 3y', 'cos(y/x)', 'sin x + cos y'], ['not homogeneous', '0', '2', '1'], [2, 3, 1, 0]).then((r) => verdict(r, 'Only degree-0 functions give homogeneous equations.', 'See the arrows.'));
      await cont(); hideFound();
    },
    async function () {
      const F = (x, y) => (x + 2 * y) / (x - y), G = (x, y) => log(x * x + x * y + y * y) - 2 * sqrt(3) * atan((x + 2 * y) / (sqrt(3) * x));
      enterScene('field', (W) => fieldSet(W, F, G, [-4, 4, -3, 3]));
      exTag('Example 10', '(x − y) dy/dx = x + 2y');
      await quiz('With y = vx: x dv/dx = ?', ['(v² + v + 1)/(1 − v)', '(1 + 2v)/(1 − v)', '(1 − v²)/(1 + v)', 'v + 1'], 0, '(1 + 2v)/(1 − v) − v.');
      await quiz('Integrating gives', ['log|x² + xy + y²| = 2√3 tan⁻¹((x + 2y)/(√3x)) + C', 'x² + xy + y² = C', 'tan⁻¹(y/x) = log|x| + C', 'log|x − y| = x + C'], 0, 'Split (v − 1)/(v² + v + 1) into a log part and a tan⁻¹ part.');
      await tapN(W, 2, [[1, 0.3], [2, -1]]); await overlay(W);
      await K('excited', 'Spirals! The red answer sits right on them.');
      exTag('Example 11', 'x cos(y/x) dy/dx = y cos(y/x) + x');
      await quiz('Solution:', ['sin(y/x) = log|Cx|', 'cos(y/x) = log|Cx|', 'sin(y/x) = Cx', 'tan(y/x) = log|x| + C'], 0, 'x dv/dx = 1/cos v, so cos v dv = dx/x.');
      await cont();
    },
    async function () {
      const F = (x, y) => (2 * y * exp(x / y)) / (2 * x * exp(x / y) - y), G = (x, y) => 2 * exp(x / y) + log(abs(y));
      enterScene('field', (W) => fieldSet(W, F, G, [-3, 2, 0.2, 3.5]));
      exTag('Example 12', '2y e^(x/y) dx + (y − 2x e^(x/y)) dy = 0, x = 0 when y = 1');
      await quiz('dx/dy depends on x/y, so put', ['x = vy', 'y = vx', 'v = xy', 'x = v + y'], 0, 'Then dx/dy = v + y dv/dy.');
      await tapIC(W, [0, 1], '(0, 1)');
      await numQ('2e^(x/y) + log|y| = C at (0, 1): C = ?', 2, '2e⁰ + log 1 = 2.'); await overlay(W);
      fieldSet(W, (x, y) => (x * x + y * y) / (2 * x * y), (x, y) => (x * x - y * y) / x, [-4, 4, -3, 3]);
      exTag('Example 13', 'slope (x² + y²)/(2xy)');
      await tapN(W, 2, [[1, 1.5], [-2, 0.5]]);
      await quiz('The family is', ['x² − y² = Cx', 'x² + y² = Cx', 'xy = C', 'y = Cx'], 0, '2v/(1 − v²) dv = dx/x.');
      await overlay(W); await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 4'; }); await summary([{ t: 'dy/dx = g(y/x): put y = vx (or x = vy for dx/dy = h(x/y))', eq: true }, 'Then x dv/dx = g(v) − v separates.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'linear', title: 'Integrating Factor', blurb: 'dy/dx + Py = Q: multiply by e^(∫P dx) and the left side becomes one derivative. Examples 14–18.', face: 'kimmy-lookup',
  steps: [
    async function () {
      const F = (x, y) => y + cos(x), G = (x, y) => (y - (sin(x) - cos(x)) / 2) * exp(-x);
      enterScene('field', (W) => fieldSet(W, F, G, [-5, 2.5, -2.5, 3]));
      await slam('× e^(∫P dx)', 'Section 9.4.3');
      exTag('Example 14', 'dy/dx − y = cos x');
      await J('idle', 'P = −1 and Q = cos x. Multiply by e^(−x): e^(−x)y′ − e^(−x)y is exactly d/dx(y e^(−x)). The product rule, run backwards.');
      await quiz('I.F. = e^(∫P dx) = ?', ['e^(−x)', 'eˣ', '−x', 'e^(cos x)'], 0, '∫(−1) dx = −x.');
      await quiz('y e^(−x) = ∫ e^(−x) cos x dx gives', ['y = (sin x − cos x)/2 + Ceˣ', 'y = sin x + Ceˣ', 'y = (sin x + cos x)/2 + Ce^(−x)', 'y = cos x + C'], 0, 'Integrate by parts twice.');
      await tapN(W, 2, [[-2, 0], [0, 1]]); await overlay(W);
      await discover('y·(I.F.) = ∫ Q·(I.F.) dx + C', 'I.F. = e^(∫P dx). For dx/dy + P₁x = Q₁, swap the roles of x and y.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('field', (W) => fieldSet(W, (x, y) => x - (2 * y) / x, (x, y) => x * x * y - x ** 4 / 4, [0.2, 3, -2, 3]));
      exTag('Example 15', 'x dy/dx + 2y = x²');
      await quiz('I.F. = ?', ['x²', 'e^(2x)', '2 log x', '1/x²'], 0, 'P = 2/x, e^(2 log x) = x².');
      await quiz('Solution:', ['y = x²/4 + Cx⁻²', 'y = x²/2 + C', 'y = x/4 + C/x', 'y = x² + Cx'], 0, 'x²y = ∫x³ dx.');
      await tapN(W, 2, [[1, 1], [1, -0.5]]); await overlay(W);
      fieldSet(W, (x, y) => y / (x + 2 * y * y), (x, y) => x / y - 2 * y, [-3, 4, 0.2, 2.5]);
      exTag('Example 16', 'y dx − (x + 2y²) dy = 0');
      await quiz('As a linear equation in x:', ['dx/dy − x/y = 2y', 'dy/dx − y/x = 2x', 'dx/dy + x/y = 2y', 'dx/dy − x = 2y²'], 0, 'x is the unknown, y the variable.');
      await quiz('I.F. = ?', ['1/y', 'y', 'e^(−y)', 'log y'], 0, 'e^(−log y).');
      await tapN(W, 2, [[0, 1], [2, 1.5]]); await overlay(W);
      await quiz('General solution:', ['x = 2y² + Cy', 'x = y² + C', 'y = 2x² + Cx', 'x = 2y + C'], 0, 'x/y = 2y + C.');
      await cont();
    },
    async function () {
      enterScene('field', (W) => fieldSet(W, (x, y) => 2 * x + x * x / tan(x) - y / tan(x), (x, y) => y * sin(x) - x * x * sin(x), [0.3, 3, -3, 8], { fx: piLab9 }));
      exTag('Example 17', 'dy/dx + y cot x = 2x + x² cot x, y(π/2) = 0');
      await quiz('I.F. = ?', ['sin x', 'cos x', 'e^(cot x)', 'cosec x'], 0, 'e^(log sin x).');
      await quiz('y sin x = ?', ['x² sin x + C', '2x sin x + C', 'x² + C', 'x² cos x + C'], 0, 'The ∫x² cos x pieces cancel.');
      await tapIC(W, [PI / 2, 0], '(π/2, 0)');
      await numQ('0 = (π/2)² sin(π/2) + C, so C = ?', -(PI * PI) / 4, 'y = x² − π²/(4 sin x).', { show: '−π²/4', keys: 'π √' });
      await overlay(W); await cont();
    },
    async function () {
      enterScene('field', (W) => fieldSet(W, (x, y) => x + x * y, (x, y) => (y + 1) * exp(-x * x / 2), [-2.5, 2.5, -2, 6]));
      exTag('Example 18', 'slope = x + xy, through (0, 1)');
      await quiz('As dy/dx + Py = Q:', ['dy/dx − xy = x', 'dy/dx + xy = x', 'dy/dx − y = x', 'dy/dx − x = xy'], 0, 'P = −x, Q = x.');
      await quiz('I.F. = ?', ['e^(−x²/2)', 'e^(x²/2)', 'e^(−x)', '−x²/2'], 0, '∫(−x) dx = −x²/2.');
      await tapIC(W, [0, 1], '(0, 1)');
      await numQ('y = −1 + Ce^(x²/2) through (0, 1): C = ?', 2, 'y = −1 + 2e^(x²/2).'); await overlay(W);
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 5'; }); await summary([{ t: 'dy/dx + Py = Q:  y·e^(∫P dx) = ∫ Q e^(∫P dx) dx + C', eq: true }, 'For dx/dy + P₁x = Q₁: x·e^(∫P₁ dy) = ∫ Q₁ e^(∫P₁ dy) dy + C.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'miscex', title: 'Mixed Examples', blurb: 'Recognise the type, then solve. Examples 19–22.', face: 'jess-happy',
  steps: [
    async function () {
      let c1 = 1, c2 = 1; const A = 0.5, B = 2, yf = (x) => exp(A * x) * (c1 * cos(B * x) + c2 * sin(B * x));
      enterScene('field', (W) => { fieldSet(W, null, null, [-4, 3, -3, 3]); W.fam = [{ f: (x) => yf(x) }]; W.res = resid((x) => yf(x), (x, y, y1, y2) => y2 - 2 * A * y1 + (A * A + B * B) * y); W.cap = 'a = ½, b = 2'; });
      exTag('Example 19', 'y = c₁e^(ax) cos bx + c₂e^(ax) sin bx');
      await J('idle', 'Verify y″ − 2ay′ + (a² + b²)y = 0. Slide c₁ and c₂: the red residual should not budge.');
      const s1 = slider('c₁', -2, 2, 1, 1, (v) => 'c₁ = ' + v, (v) => (c1 = v), -2), s2 = slider('c₂', -2, 2, 1, 1, (v) => 'c₂ = ' + v, (v) => (c2 = v), 0);
      await task('Set c₁ = −2, c₂ = 0', () => c1 === -2 && c2 === 0, () => { c1 = -2; c2 = 0; s1.value = -2; s2.value = 0; });
      await tf('It is a solution for every c₁, c₂.', true).then((r) => verdict(r, 'Two arbitrary constants for a 2nd-order equation: the general solution.', 'True: the residual stays 0.'));
      await cont();
    },
    async function () {
      enterScene('field', (W) => fieldSet(W, (x, y) => exp(3 * x + 4 * y), (x, y) => 4 * exp(3 * x) + 3 * exp(-4 * y), [-2.5, 1, -2, 1]));
      exTag('Example 20', 'log(dy/dx) = 3x + 4y, y(0) = 0');
      await quiz('Rewrite as', ['dy/dx = e^(3x)·e^(4y)', 'dy/dx = 3x + 4y', 'dy/dx = e^(3x) + e^(4y)', 'dy/dx = log(3x + 4y)'], 0, 'Separable!');
      await tapIC(W, [0, 0], '(0, 0)');
      await numQ('4e^(3x) + 3e^(−4y) + 12C = 0 at (0, 0): C = ?', -7 / 12, '4 + 3 + 12C = 0.', { show: '−7/12' }); await overlay(W);
      exTag('Example 21', '(x dy − y dx) y sin(y/x) = (y dx + x dy) x cos(y/x)');
      await quiz('Type and answer:', ['homogeneous; sec(y/x) = Cxy', 'separable; y = Cx', 'linear; y = Cx²', 'homogeneous; sin(y/x) = Cx'], 0, 'Divide by x²: a function of y/x. Then y = vx.');
      exTag('Example 22', '(tan⁻¹y − x) dy = (1 + y²) dx');
      await quiz('Treat it as', ['dx/dy + x/(1 + y²) = tan⁻¹y/(1 + y²)', 'dy/dx + y = tan⁻¹y', 'homogeneous', 'separable'], 0, 'Linear in x, I.F. = e^(tan⁻¹y).');
      await quiz('General solution:', ['x = (tan⁻¹y − 1) + Ce^(−tan⁻¹y)', 'x = tan⁻¹y + C', 'x e^(tan⁻¹y) = C', 'x = (tan⁻¹y + 1) + Ce^(tan⁻¹y)'], 0, '∫ t eᵗ dt = eᵗ(t − 1).');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 6'; }); await summary(['Separable → split. Homogeneous → y = vx. Linear → integrating factor.', { t: 'Check: the answer curve must follow the slope field.', eq: true }]); },
  ],
}));

const BOSS9 = [
  ['Order of y‴ + (y′)⁴ = 0', ['3', '4', '1', '2'], 0],
  ['Degree of (y″)² + y′ = 0', ['2', '1', '4', 'not defined'], 0],
  ['Degree of y″ + cos(y′) = 0', ['not defined', '1', '2', '0'], 0],
  ['Constants in the general solution of a 2nd-order equation', ['2', '1', '0', '3'], 0],
  ['Solution of dy/dx = y', ['y = Ceˣ', 'y = x + C', 'y = Cx', 'y = eˣ + C'], 0],
  ['I.F. of dy/dx + y/x = x', ['x', '1/x', 'eˣ', 'log x'], 0],
  ['For dy/dx = (x + y)/x, substitute', ['y = vx', 'x = vy', 'v = x + y', 'y = v'], 0],
  ['Solution of dy/dx = −x/y', ['x² + y² = C', 'x² − y² = C', 'xy = C', 'y = Cx'], 0],
  ['I.F. of dy/dx − 2y = 1', ['e^(−2x)', 'e^(2x)', '−2x', 'e^(−2)'], 0],
  ['Is dy/dx = (x² + y²)/(xy) homogeneous?', ['Yes, degree 0', 'No', 'Yes, degree 2', 'Only for x > 0'], 0],
];

{
  const byId = (id) => LESSONS.find((l) => l.id === id);
  const [od, so, se, ho, li, mx] = ['order', 'solutions', 'separable', 'homog', 'linear', 'miscex'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(od, exLesson({ id: 'ex91', title: 'Exercise 9.1', blurb: 'All 12: order and degree on the derivative tower.', face: 'kimmy-playful', qs: EX91 }), so, exLesson({ id: 'ex92', title: 'Exercise 9.2', blurb: 'All 12: verify solutions with sliders and a residual meter.', face: 'jess-happy', qs: EX92 }), se, exLesson({ id: 'ex93', title: 'Exercise 9.3', blurb: 'All 23: separable equations on slope fields, plus growth problems.', face: 'kimmy-curious', qs: EX93 }), ho, exLesson({ id: 'ex94', title: 'Exercise 9.4', blurb: 'All 17 homogeneous equations.', face: 'jess-thinking', qs: EX94 }), li, exLesson({ id: 'ex95', title: 'Exercise 9.5', blurb: 'All 19 linear equations with integrating factors.', face: 'kimmy-excited', qs: EX95 }), mx, exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 15 Miscellaneous Exercise questions (Q1, Q2 in parts).', face: 'jess-excited', qs: EX9M }));
}
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 9'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Solve them faster than me!'); await cont('Fight'); }, ...BOSS9.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 9'; }); await summary(['Chapter complete!', { t: 'Separable · Homogeneous · Linear', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

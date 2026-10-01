/* =========================================================
   CLASS 12 · CHAPTER 2 · INVERSE TRIGONOMETRIC FUNCTIONS — lessons (Examples 1–6)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const pv = (a, show) => ({ a, show, keys: 'π', tol: 1e-4 });
/* both sides of an identity as curves on the plane */
async function overlay(W, L, R, x0, x1, y0, y1, labs = ['LHS', 'RHS']) { planeView(W, x0, x1, y0, y1); W.curves = []; await drawCurves(W, [curve(L, C.sora, { x0, x1, w: 6, t: labs[0] }), curve(R, C.beni, { x0, x1, dash: [8, 6], w: 3, t: labs[1] })], 0.8); }

LESSONS.push(lesson({
  id: 'branches', title: 'Making Trig Invertible', blurb: 'Trig functions repeat, so they have no inverse… until you keep one branch and reflect it in y = x.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('inv', (W) => invView(W, 'sin'));
      await slam('sin⁻¹ x', 'Class 12 · Lesson 1 · Section 2.2');
      await J('idle', 'y = sin x hits every y in [−1, 1] infinitely often: not one-one. Keep only the bold red piece on [−π/2, π/2].');
      await quiz('On [−π/2, π/2], sin x is…', ['one-one and onto [−1, 1]', 'still many-one', 'onto ℝ', 'constant'], 0, 'So it has an inverse there.');
      const b = button('Reflect in y = x'); await waitFor(() => b.clicked()); b.stop(); W.full = false; SFX.whoosh(); await tw(W, { m: 1, duration: 1.4, ease: 'power2.inOut' });
      planeView(W, -2, 2, -2, 2); W.pl.lab = 0.5; W.pl.grid = 0.25; W.pl.fx = null; invProbe(W, 0.5);
      await K('wow', 'The red branch flipped into y = sin⁻¹ x!');
      await task('Drag the gold point to x = −1', () => W.probe <= -0.99, (W) => (W.probe = -1));
      await discover('sin⁻¹ : [−1, 1] → [−π/2, π/2]', 'The principal value branch.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('inv', (W) => invView(W, 'cos'));
      await J('think', 'For cos we keep [0, π] instead, so cos⁻¹ : [−1, 1] → [0, π].');
      const b = button('Reflect'); await waitFor(() => b.clicked()); b.stop(); W.full = false; SFX.whoosh(); await tw(W, { m: 1, duration: 1.2 });
      const r = await match('Match each principal range', ['sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'cot⁻¹', 'sec⁻¹', 'cosec⁻¹'], ['(0, π)', '[0, π] − {π/2}', '[−π/2, π/2]', '[−π/2, π/2] − {0}', '(−π/2, π/2)', '[0, π]'], [2, 5, 4, 0, 1, 3]); await verdict(r, 'The table on page 25.', 'sin⁻¹ [−π/2, π/2], cos⁻¹ [0, π], tan⁻¹ (−π/2, π/2), cot⁻¹ (0, π), sec⁻¹ [0, π] − {π/2}, cosec⁻¹ [−π/2, π/2] − {0}.');
      await quiz('sin⁻¹ x means…', ['the inverse function (arcsin)', '1/sin x', 'sin(1/x)', '−sin x'], 0, '(sin x)⁻¹ = 1/sin x is different!');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'Restrict, then reflect in y = x', eq: true }, 'sin⁻¹, cosec⁻¹: around 0 · cos⁻¹, sec⁻¹, cot⁻¹: from 0 to π · tan⁻¹: open (−π/2, π/2)']); },
  ],
}));

LESSONS.push(lesson({
  id: 'pv', title: 'Principal Values', blurb: 'Drag a line across the unit circle: two angles share the value, only one sits on the green principal arc. Examples 1–2.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('pcirc', (W) => pcircSet(W, 'sin', 0.2));
      await slam('PRINCIPAL VALUE', 'Lesson ' + L.num + ' · Section 2.2');
      await J('idle', 'For sin⁻¹ v, slide the red line to height v. It cuts the circle twice; the star is on the green principal arc.');
      exTag('Example 1', 'sin⁻¹(1/√2)');
      await task('Slide the line to v ≈ 0.71 (= 1/√2)', () => Math.abs(W.v - 0.71) < 0.015, (W) => (W.v = 0.71));
      await numQ('Principal value = ? (type with π)', PI / 4, 'π/4: sin(π/4) = 1/√2 and π/4 ∈ [−π/2, π/2].', pv(PI / 4, 'π/4'));
      await cont();
    },
    async function () {
      enterScene('pcirc', (W) => pcircSet(W, 'tan', -1.73, { showAns: false }));
      exTag('Example 2', 'cot⁻¹(−1/√3)');
      await J('think', 'cot y = −1/√3 means tan y = −√3. But cot⁻¹ lives in (0, π), so take the angle in the upper half.');
      await numQ('cot⁻¹(−1/√3) = ?', 2 * PI / 3, '2π/3 ∈ (0, π) and cot(2π/3) = −1/√3.', pv(2 * PI / 3, '2π/3'));
      W.showAns = true;
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Principal value = the angle on the principal branch', eq: true }, 'Negative inputs: sin⁻¹, tan⁻¹ go negative; cos⁻¹, cot⁻¹ go past π/2.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'props', title: 'Properties & Simplifying', blurb: 'sin(sin⁻¹ x) = x always, but sin⁻¹(sin x) is a sawtooth. Substitute x = sin θ to simplify. Examples 3–6.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('plane', (W) => planeView(W, -7, 7, -2.2, 2.2));
      await slam('sin⁻¹(sin x)', 'Lesson ' + L.num + ' · Section 2.3');
      await drawCurves(W, [curve((x) => Math.asin(Math.sin(x)), C.beni, { w: 4, t: 'sin⁻¹(sin x)' }), curve((x) => x, C['ink-muted'], { dash: [6, 5], w: 2, t: 'y = x', x0: -1.6, x1: 1.6 })], 1);
      await J('idle', 'It equals x only on [−π/2, π/2]. Elsewhere it zig-zags back into the principal range.');
      exTag('Example 6', 'sin⁻¹(sin 3π/5)');
      await numQ('3π/5 is outside the range; sin(3π/5) = sin(2π/5). Value = ?', 2 * PI / 5, '2π/5.', pv(2 * PI / 5, '2π/5'));
      await cont();
    },
    async function () {
      enterScene('plane', (W) => planeView(W, -1, 1, -3.4, 3.4));
      exTag('Example 3', 'sin⁻¹(2x√(1 − x²)) = 2 sin⁻¹ x for |x| ≤ 1/√2');
      const r = await order('Substitute x = sin θ', ['x = sin θ, so θ = sin⁻¹ x', '2x√(1 − x²) = 2 sin θ cos θ = sin 2θ', 'sin⁻¹(sin 2θ) = 2θ (as 2θ ∈ [−π/2, π/2])', '= 2 sin⁻¹ x']); await verdict(r, 'The interval keeps 2θ in the principal range.', 'Put x = sin θ.');
      await overlay(W, (x) => Math.asin(2 * x * Math.sqrt(1 - x * x)), (x) => (Math.abs(x) <= 1 / Math.SQRT2 + 1e-9 ? 2 * Math.asin(x) : NaN), -1, 1, -3.4, 3.4, ['sin⁻¹(2x√(1−x²))', '2 sin⁻¹ x']);
      await K('wow', 'They match exactly on |x| ≤ 1/√2, then part ways!');
      await cont();
    },
    async function () {
      enterScene('plane');
      exTag('Example 4', 'tan⁻¹(cos x / (1 − sin x)), −3π/2 < x < π/2');
      await quiz('Simplest form', ['π/4 + x/2', 'π/4 − x/2', 'x/2', 'π/2 − x'], 0, 'Half-angle forms turn it into tan(π/4 + x/2).');
      await overlay(W, (x) => Math.atan(Math.cos(x) / (1 - Math.sin(x))), (x) => PI / 4 + x / 2, -4.6, 1.5, -1, 1.7);
      exTag('Example 5', 'cot⁻¹(1/√(x² − 1)), x > 1');
      await quiz('Put x = sec θ: simplest form', ['sec⁻¹ x', 'cos⁻¹ x', 'tan⁻¹ x', 'π/2 − sec⁻¹ x'], 0, '√(x² − 1) = tan θ, so cot⁻¹(cot θ) = θ.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'sin(sin⁻¹ x) = x on [−1, 1]; sin⁻¹(sin x) = x only on [−π/2, π/2]', eq: true }, 'Substitute x = sin θ, cos θ, tan θ, sec θ to simplify.']); },
  ],
}));

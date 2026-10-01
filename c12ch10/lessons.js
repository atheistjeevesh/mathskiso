/* =========================================================
   CLASS 12 · CHAPTER 10 · VECTOR ALGEBRA — lessons (Examples 1–30)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const fieldsQ = (q, f, yes, keys = '√') => fields(q, f, { keys }).then((r) => verdict(r, yes, 'Answer: ' + f.map((s) => s.l + ' = ' + (s.show || fracStr(s.a))).join(', ') + '. ' + yes));

LESSONS.push(lesson({
  id: 'basics', title: 'What is a Vector?', blurb: 'Magnitude plus direction. Drag arrows by compass bearings, sort scalars from vectors, and read direction cosines in 3D. Examples 1–3.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('vec', (W) => { vecSet(W, { v: [-4.5, 4.5, -4.6, 1.2], arr: [{ v: [0, -2, 0], col: C.sora, t: 'OP' }] }); W.rd = () => { const v = W.arr[0].v; return [['length = ' + fmtN(V.norm(v) * 10, 1) + ' km', C.sora], ['bearing: ' + bearTxt(bearing(v)), C.beni]]; }; });
      await slam('a⃗', 'Class 12 · Ch 10 · Section 10.2');
      exTag('Example 1', '40 km, 30° west of south');
      await J('idle', 'A vector carries a size and a direction. A displacement of 40 km means nothing until you say which way. One square is 10 km here.');
      dragHeads(W, [0], { polar: [5, 0.5] });
      await task('Drag the gold head: 40 km at S 30° W', () => Math.abs(V.norm(W.arr[0].v) - 4) < 0.01 && bearing(W.arr[0].v) === 210, (W) => (W.arr[0].v = [-2, -2 * S3, 0]));
      W.drags = []; W.heads = [];
      await discover('Vector = magnitude + direction', 'Written AB⃗ or a⃗; its length is |a⃗|, never negative.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('vec', (W) => vecSet(W, { v: [-3.5, 3, -3.4, 2.4], arr: [{ o: [-2, -1, 0], v: [0, 2, 0], col: C.sora, t: 'a⃗' }, { o: [1, 0, 0], v: [-3, -1, 0], col: C.beni, t: 'b⃗' }, { o: [1, 0, 0], v: [0, 2, 0], col: C['matcha-deep'], t: 'c⃗' }, { o: [1, 0, 0], v: [0, -3, 0], col: C.kin, t: 'd⃗' }] }));
      exTag('Example 2', 'scalars and vectors');
      await pickQ('Tap the vectors', ['5 seconds', '1000 cm³', '10 newton', '30 km/hr', '10 g/cm³', '20 m/s towards north'], ['10 newton', '20 m/s towards north'], 'Force and velocity have direction; speed (30 km/hr) does not.', { brace: false });
      exTag('Example 3', 'Fig 10.5');
      await pickQ('Collinear vectors', ['a⃗', 'b⃗', 'c⃗', 'd⃗'], ['a⃗', 'c⃗', 'd⃗'], 'All parallel to the same line.', { brace: false });
      await pickQ('Equal vectors', ['a⃗', 'b⃗', 'c⃗', 'd⃗'], ['a⃗', 'c⃗'], 'Same length, same direction (start point does not matter).', { brace: false });
      await pickQ('Coinitial vectors', ['a⃗', 'b⃗', 'c⃗', 'd⃗'], ['b⃗', 'c⃗', 'd⃗'], 'Same starting point.', { brace: false });
      await match('Match each type', ['zero vector', 'unit vector', 'negative of AB⃗', 'free vector'], ['BA⃗', 'can slide anywhere without changing', 'AA⃗', 'magnitude 1'], [2, 3, 0, 1]).then((r) => verdict(r, 'Section 10.3.', 'See the arrows.'));
      await cont();
    },
    async function () {
      const P = [2, 2, 1];
      enterScene('vec', (W) => { vecSet(W, { d3: true, R: 4, arr: [{ v: P, col: C.sora, t: 'r⃗' }] }); W.rd = () => { const r = V.norm(P); return r ? [['r = ' + rt(V.dot(P, P)), C.ink], ['l = ' + fmtN(P[0] / r, 3) + '  m = ' + fmtN(P[1] / r, 3) + '  n = ' + fmtN(P[2] / r, 3), C.sora], ['l² + m² + n² = ' + fmtN((P[0] ** 2 + P[1] ** 2 + P[2] ** 2) / r ** 2, 3), C['matcha-deep']]] : []; }; });
      exTag('10.2', 'direction cosines');
      await J('idle', 'The angles α, β, γ that r⃗ makes with the axes give l = cos α = x/r, m = y/r, n = z/r. Drag the stage to orbit. Move the point with the sliders.');
      ['x', 'y', 'z'].forEach((n, i) => slider(n, -3, 3, 1, P[i], (v) => n + ' = ' + v, (v) => { P[i] = v; W.arr[0].v = P.slice(); }, i === 2 ? -2 : i === 0 ? 1 : 2));
      await task('Move the point to (1, 2, −2)', () => P[0] === 1 && P[1] === 2 && P[2] === -2, () => { P.splice(0, 3, 1, 2, -2); W.arr[0].v = P.slice(); });
      await fieldsQ('Direction cosines of î + 2ĵ − 2k̂', [{ l: 'l', a: 1 / 3, show: '1/3' }, { l: 'm', a: 2 / 3, show: '2/3' }, { l: 'n', a: -2 / 3, show: '−2/3' }], 'r = 3.');
      await discover('l² + m² + n² = 1', 'Direction ratios (a, b, c) are any multiple of (l, m, n); their squares need not add to 1.');
      await cont(); hideFound();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: '|r⃗| = √(x² + y² + z²),  l = x/r, m = y/r, n = z/r', eq: true }, 'Zero, unit, coinitial, collinear, equal and negative vectors.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'addition', title: 'Add, Scale, Split', blurb: 'Tip-to-tail addition, scalar multiples, î ĵ k̂ components, the section formula. Examples 4–12.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('vec', (W) => { vecSet(W, { v: [-3, 5, -1.5, 4], arr: [{ v: [3, 1, 0], col: C.sora, t: 'a⃗' }, { o: [3, 1, 0], v: [1, 1, 0], col: C.beni, t: 'b⃗' }, { v: [4, 2, 0], col: C.kin, t: 'a⃗ + b⃗', w: 5 }] }); W.rd = () => [['a⃗ + b⃗ = ' + vs(W.arr[2].v.slice(0, 2), ['î', 'ĵ']), C.kin]]; });
      await slam('TIP TO TAIL', 'Section 10.4');
      await J('idle', 'Walk along a⃗, then along b⃗. Where you end up is a⃗ + b⃗: the triangle law.');
      dragHeads(W, [1], { on: (W) => { W.arr[2].v = V.add(W.arr[0].v, W.arr[1].v); } });
      await task('Drag b⃗ so that a⃗ + b⃗ = î + 3ĵ', () => W.arr[2].v[0] === 1 && W.arr[2].v[1] === 3, (W) => { W.arr[1].v = [-2, 2, 0]; W.arr[2].v = [1, 3, 0]; });
      W.drags = []; W.heads = [];
      W.para = [{ u: W.arr[0].v, v: W.arr[1].v, col: C.kin }]; W.arr.push({ v: W.arr[1].v.slice(), col: C.beni, dash: [6, 5], t: 'b⃗' }); SFX.pop();
      await discover('a⃗ + b⃗: triangle or parallelogram law', 'Shift b⃗ to start at O: the sum is the diagonal. Addition is commutative and associative.');
      await quiz('In triangle ABC, AB⃗ + BC⃗ + CA⃗ = ?', ['0⃗', '2AC⃗', 'AC⃗', 'BA⃗'], 0, 'You end where you started.');
      await cont(); hideFound();
    },
    async function () {
      let lam = 1; enterScene('vec', (W) => { vecSet(W, { v: [-4.5, 4.5, -3, 3], arr: [{ v: [2, 1, 0], col: C.sora, t: 'a⃗', w: 3 }, { v: [2, 1, 0], col: C.kin, t: 'λa⃗', w: 6, tp: 0.8 }] }); W.rd = () => [['λ = ' + lam + '   |λa⃗| = ' + fmtN(Math.abs(lam), 2) + '|a⃗|', C.kin]]; });
      exTag('10.5', 'multiply by a scalar');
      const sl = slider('λ', -2, 2, 0.5, 1, (v) => 'λ = ' + v, (v) => { lam = v; W.arr[1].v = V.mul(v, [2, 1, 0]); }, -1.5);
      await task('Slide λ to −1.5', () => lam === -1.5, () => { lam = -1.5; sl.value = -1.5; W.arr[1].v = V.mul(-1.5, [2, 1, 0]); });
      await quiz('For λ < 0, λa⃗ points', ['opposite to a⃗, with |λ| times the length', 'the same way as a⃗', 'perpendicular to a⃗', 'nowhere: it is 0⃗'], 0, 'Always collinear with a⃗.');
      await quiz('The unit vector along a⃗ is', ['a⃗/|a⃗|', '|a⃗|a⃗', 'a⃗ − 1', '1/a⃗'], 0, 'λ = 1/|a⃗|.');
      await cont();
    },
    async function () {
      enterScene('vec', (W) => vecSet(W, { d3: true, R: 4, arr: [A3([2, 3, 1], C.sora, 'a⃗')] }));
      await growAll(W);
      exTag('Example 4', 'equal vectors');
      await fieldsQ('xî + 2ĵ + zk̂ = 2î + yĵ + k̂: x, y, z', [{ l: 'x', a: 2 }, { l: 'y', a: 2 }, { l: 'z', a: 1 }], 'Equal vectors have equal components.', '');
      exTag('Example 5', '|a⃗| = |b⃗| but a⃗ ≠ b⃗');
      await quiz('a⃗ = î + 2ĵ, b⃗ = 2î + ĵ:', ['|a⃗| = |b⃗| = √5, but a⃗ ≠ b⃗', 'a⃗ = b⃗', '|a⃗| ≠ |b⃗|', 'they are collinear'], 0, 'Same length, different components.');
      exTag('Example 6', 'unit vector along 2î + 3ĵ + k̂');
      await fieldsQ('â = ?', cmp([2 / S14, 3 / S14, 1 / S14], ['2/√14', '3/√14', '1/√14']), '|a⃗| = √14.');
      exTag('Example 7', 'magnitude 7 along î − 2ĵ');
      await fieldsQ('7â = ?', cmp([7 / S5, -14 / S5], ['7/√5', '−14/√5'], ['î', 'ĵ']), 'â = (î − 2ĵ)/√5.');
      exTag('Example 8', 'unit vector along a⃗ + b⃗');
      await fieldsQ('a⃗ = 2î + 2ĵ − 5k̂, b⃗ = 2î + ĵ + 3k̂: a⃗ + b⃗ = ?', cmp([4, 3, -2]), '|a⃗ + b⃗| = √29, so the unit vector is (4î + 3ĵ − 2k̂)/√29.', '');
      exTag('Example 9', 'direction ratios and cosines of î + ĵ − 2k̂');
      await fieldsQ('Direction cosines', [{ l: 'l', a: 1 / S6, show: '1/√6' }, { l: 'm', a: 1 / S6, show: '1/√6' }, { l: 'n', a: -2 / S6, show: '−2/√6' }], 'Direction ratios 1, 1, −2; r = √6.');
      await cont();
    },
    async function () {
      let m = 2, n = 1; const P = [-3, -1, 0], Q = [3, 2, 0];
      enterScene('vec', (W) => { vecSet(W, { v: [-4.5, 5.5, -2.5, 3.5], arr: [{ v: P, col: C.sora, t: 'a⃗' }, { v: Q, col: C.beni, t: 'b⃗' }], dots: [{ p: P, t: 'P' }, { p: Q, t: 'Q' }, { p: V.sec(P, Q, 2, 1), t: 'R', col: C.kin }] }); W.rd = () => [['R divides PQ in ' + m + ' : ' + n, C.kin], ['r⃗ = (m b⃗ + n a⃗)/(m + n)', C.ink]]; });
      exTag('Example 10', 'vector joining two points');
      await fieldsQ('P(2, 3, 0) to Q(−1, −2, −4): PQ⃗ = ?', cmp([-3, -5, -4]), 'Head minus tail.', '');
      exTag('10.5.3', 'section formula');
      const s1 = slider('m', 1, 4, 1, 2, (v) => 'm = ' + v, (v) => { m = v; W.dots[2].p = V.sec(P, Q, m, n); }, 1), s2 = slider('n', 1, 4, 1, 1, (v) => 'n = ' + v, (v) => { n = v; W.dots[2].p = V.sec(P, Q, m, n); }, 3);
      await task('Make R divide PQ in 1 : 3', () => m === 1 && n === 3, () => { m = 1; n = 3; s1.value = 1; s2.value = 3; W.dots[2].p = V.sec(P, Q, 1, 3); });
      await discover('r⃗ = (m b⃗ + n a⃗)/(m + n)', 'Internal division in m : n. External: (m b⃗ − n a⃗)/(m − n). Midpoint: (a⃗ + b⃗)/2.');
      exTag('Example 11', 'OP⃗ = 3a⃗ − 2b⃗, OQ⃗ = a⃗ + b⃗, ratio 2 : 1');
      await quiz('(i) Internally:', ['5a⃗/3', '(4b⃗ − a⃗)', '(5a⃗ − b⃗)/3', 'a⃗ + b⃗'], 0, '(2(a⃗ + b⃗) + (3a⃗ − 2b⃗))/3.');
      await quiz('(ii) Externally:', ['4b⃗ − a⃗', '5a⃗/3', '4a⃗ − b⃗', '−a⃗'], 0, '2(a⃗ + b⃗) − (3a⃗ − 2b⃗).');
      exTag('Example 12', 'right-angled triangle');
      await fieldsQ('A(2î − ĵ + k̂), B(î − 3ĵ − 5k̂), C(3î − 4ĵ − 4k̂): squared sides', [{ l: '|AB|²', a: 41 }, { l: '|BC|²', a: 6 }, { l: '|CA|²', a: 35 }], '41 = 6 + 35: right angle at C.', '');
      hideFound(); await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 2'; }); await summary([{ t: 'a⃗ + b⃗ adds components;  â = a⃗/|a⃗|;  PQ⃗ = q⃗ − p⃗', eq: true }, 'Section formula: (m b⃗ + n a⃗)/(m + n), external (m b⃗ − n a⃗)/(m − n).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'dot', title: 'The Dot Product', blurb: 'a⃗·b⃗ = |a⃗||b⃗|cos θ: swing b⃗ around and watch the number change sign. Projections and two famous inequalities. Examples 13–21.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('vec', (W) => { vecSet(W, { v: [-4, 4.5, -3, 3.5], arr: [{ v: [3, 0, 0], col: C.sora, t: 'a⃗' }, { v: [2, 2, 0], col: C.beni, t: 'b⃗' }] }); W.ang = [{ u: [3, 0], v: [2, 2], t: 'θ', r: 0.8 }]; W.proj = { a: [2, 2], b: [3, 0] }; W.rd = () => { const b = W.arr[1].v, d = V.dot([3, 0, 0], b); return [['θ = ' + Math.round((V.ang([3, 0, 0], b) * 180) / Math.PI) + '°', C.ink], ['a⃗·b⃗ = ' + fmtN(d, 2), d > 1e-9 ? C['matcha-deep'] : d < -1e-9 ? C.beni : C.kin]]; }; });
      await slam('a⃗ · b⃗', 'Section 10.6.1');
      await J('idle', 'a⃗·b⃗ = |a⃗||b⃗|cos θ is a number, not a vector. The green arrow is the shadow of b⃗ on a⃗.');
      dragHeads(W, [1], { polar: [15, 0.5], on: (W) => { W.ang[0].v = W.arr[1].v; W.proj.a = W.arr[1].v; } });
      await task('Swing b⃗ until a⃗·b⃗ = 0', () => Math.abs(V.dot([3, 0, 0], W.arr[1].v)) < 1e-9, (W) => { W.arr[1].v = [0, 2.5, 0]; W.ang[0].v = W.arr[1].v; W.proj.a = W.arr[1].v; });
      await K('surprised', 'Zero! The shadow vanished: b⃗ is perpendicular to a⃗.');
      await task('Now make a⃗·b⃗ negative', () => V.dot([3, 0, 0], W.arr[1].v) < -1e-9, (W) => { W.arr[1].v = [-2, 1.5, 0]; W.ang[0].v = W.arr[1].v; W.proj.a = W.arr[1].v; });
      W.drags = []; W.heads = [];
      await discover('a⃗·b⃗ = |a⃗||b⃗|cos θ = a₁b₁ + a₂b₂ + a₃b₃', 'Zero ⇔ perpendicular; negative ⇔ obtuse. Projection of a⃗ on b⃗ = a⃗·b⃗/|b⃗|.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('vec', (W) => vecSet(W, angS([1, 1, -1], [1, -1, 1], 2.5)));
      await growAll(W);
      exTag('Example 13', '|a⃗| = 1, |b⃗| = 2, a⃗·b⃗ = 1');
      await quiz('θ = ?', ['π/3', 'π/6', 'π/4', 'π/2'], 0, 'cos θ = 1/2.');
      exTag('Example 14', 'î + ĵ − k̂ and î − ĵ + k̂');
      await numQ('cos θ = ?', -1 / 3, 'a⃗·b⃗ = 1 − 1 − 1 = −1, |a⃗||b⃗| = 3. θ = cos⁻¹(−1/3).', { show: '−1/3' });
      exTag('Example 15', '(a⃗ + b⃗)·(a⃗ − b⃗)');
      await numQ('a⃗ = 5î − ĵ − 3k̂, b⃗ = î + 3ĵ − 5k̂: (a⃗ + b⃗)·(a⃗ − b⃗) = ?', 0, '24 − 8 − 16 = 0: perpendicular. (|a⃗| = |b⃗| = √35.)');
      exTag('Example 16', 'projection of 2î + 3ĵ + 2k̂ on î + 2ĵ + k̂');
      await numQ('Projection = ?', 10 / S6, '10/√6 = (5/3)√6.', { show: '10/√6', keys: '√' });
      exTag('Example 17', '|a⃗| = 2, |b⃗| = 3, a⃗·b⃗ = 4');
      await numQ('|a⃗ − b⃗| = ?', S5, '4 − 8 + 9 = 5.', { show: '√5', keys: '√' });
      exTag('Example 18', '(x⃗ − a⃗)·(x⃗ + a⃗) = 8, |a⃗| = 1');
      await numQ('|x⃗| = ?', 3, '|x⃗|² − 1 = 8.');
      await cont();
    },
    async function () {
      enterScene('vec', (W) => { vecSet(W, { v: [-1, 6.5, -1, 4], arr: [{ v: [3, 0, 0], col: C.sora, t: 'a⃗' }, { o: [3, 0, 0], v: [1, 2, 0], col: C.beni, t: 'b⃗' }, { v: [4, 2, 0], col: C.kin, t: 'a⃗ + b⃗' }] }); W.rd = () => { const b = W.arr[1].v; return [['|a⃗ + b⃗| = ' + fmtN(V.norm(V.add([3, 0, 0], b)), 3), C.kin], ['|a⃗| + |b⃗| = ' + fmtN(3 + V.norm(b), 3), C.ink]]; }; });
      exTag('Examples 19–20', 'Cauchy–Schwarz and the triangle inequality');
      await J('think', '|a⃗·b⃗| ≤ |a⃗||b⃗| because |cos θ| ≤ 1. Squaring |a⃗ + b⃗| then gives |a⃗ + b⃗| ≤ |a⃗| + |b⃗|. Try to make them equal.');
      dragHeads(W, [1], { on: (W) => { W.arr[2].v = V.add([3, 0, 0], W.arr[1].v); } });
      await task('Drag b⃗ until |a⃗ + b⃗| = |a⃗| + |b⃗|', () => Math.abs(W.arr[1].v[1]) < 1e-9 && W.arr[1].v[0] > 0, (W) => { W.arr[1].v = [2, 0, 0]; W.arr[2].v = [5, 0, 0]; });
      W.drags = []; W.heads = [];
      await quiz('Equality happens only when', ['a⃗ and b⃗ point the same way (collinear)', 'a⃗ ⟂ b⃗', 'a⃗ = −b⃗', '|a⃗| = |b⃗|'], 0, 'The triangle flattens into a line.');
      exTag('Example 21', 'A(−2, 3, 5), B(1, 2, 3), C(7, 0, −1)');
      await fieldsQ('|AB|, |BC|, |AC| as multiples of √14', [{ l: '|AB|/√14', a: 1 }, { l: '|BC|/√14', a: 2 }, { l: '|AC|/√14', a: 3 }], '1 + 2 = 3: collinear.', '');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 3'; }); await summary([{ t: 'a⃗·b⃗ = |a⃗||b⃗|cos θ = a₁b₁ + a₂b₂ + a₃b₃', eq: true }, 'Projection of a⃗ on b⃗ = a⃗·b⃗/|b⃗|.  |a⃗·b⃗| ≤ |a⃗||b⃗|,  |a⃗ + b⃗| ≤ |a⃗| + |b⃗|.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'cross', title: 'The Cross Product', blurb: 'a⃗ × b⃗ stands up out of the parallelogram: its length is the area. Right-hand rule, determinants, triangle areas. Examples 22–25.', face: 'jess-thinking',
  steps: [
    async function () {
      let th = 45; const a = [3, 0, 0], bOf = (t) => [2 * Math.cos((t * Math.PI) / 180), 2 * Math.sin((t * Math.PI) / 180), 0];
      enterScene('vec', (W) => { vecSet(W, crossS(a, bOf(45), 4)); W.arr.forEach((r) => (r.p = 1)); W.arr[2].hide = false; W.rd = () => [['θ = ' + th + '°', C.ink], ['|a⃗ × b⃗| = 6 sin θ = ' + fmtN(6 * Math.sin((th * Math.PI) / 180), 2), C.kin], ['parallelogram area = same', C['ink-muted']]]; });
      await slam('a⃗ × b⃗', 'Section 10.6.3');
      await J('idle', 'The cross product is a vector perpendicular to both a⃗ and b⃗. Its length |a⃗||b⃗|sin θ is the area of the gold parallelogram. Drag the stage to look around.');
      const sl = slider('θ', 0, 180, 15, 45, (v) => 'θ = ' + v + '°', (v) => { th = v; const b = bOf(v); W.arr[1].v = b; W.para[0].v = b; W.arr[2].v = V.cross(a, b); }, 90);
      await task('Set θ = 90° for the biggest area', () => th === 90, () => { th = 90; sl.value = 90; const b = bOf(90); W.arr[1].v = b; W.para[0].v = b; W.arr[2].v = V.cross(a, b); });
      await quiz('At θ = 180° (or 0°) a⃗ × b⃗ is', ['0⃗', 'its biggest', 'along a⃗', 'undefined'], 0, 'Parallel vectors span no area.');
      await match('Right-hand rule: match', ['î × ĵ', 'ĵ × k̂', 'k̂ × î', 'ĵ × î'], ['ĵ', '−k̂', 'k̂', 'î'], [2, 3, 0, 1]).then((r) => verdict(r, 'Cyclic order î → ĵ → k̂ gives +; reversed gives −.', 'See the arrows.'));
      await discover('a⃗ × b⃗ = |a⃗||b⃗| sin θ n̂ = det[î ĵ k̂; a₁ a₂ a₃; b₁ b₂ b₃]', 'b⃗ × a⃗ = −a⃗ × b⃗. Area of parallelogram = |a⃗ × b⃗|, triangle = ½|a⃗ × b⃗|.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('vec', (W) => vecSet(W, crossS([2, 1, 3], [3, 5, -2], 18)));
      await growAll(W);
      exTag('Example 22', 'a⃗ = 2î + ĵ + 3k̂, b⃗ = 3î + 5ĵ − 2k̂');
      await fieldsQ('a⃗ × b⃗ = ?', cmp([-17, 13, 7]), '(−2 − 15)î − (−4 − 9)ĵ + (10 − 3)k̂.', '');
      W.arr[2].hide = false; await grow(W, 2);
      await numQ('|a⃗ × b⃗| = ?', Math.sqrt(507), '289 + 169 + 49 = 507.', { show: '√507', keys: '√' });
      exTag('Example 23', 'unit vector ⟂ a⃗ + b⃗ and a⃗ − b⃗; a⃗ = î + ĵ + k̂, b⃗ = î + 2ĵ + 3k̂');
      await fieldsQ('(a⃗ + b⃗) × (a⃗ − b⃗) = ?', cmp([-2, 4, -2]), 'a⃗ + b⃗ = 2î + 3ĵ + 4k̂, a⃗ − b⃗ = −ĵ − 2k̂. Divide by 2√6 for a unit vector.', '');
      await cont();
    },
    async function () {
      enterScene('vec', (W) => vecSet(W, { d3: true, R: 4, arr: [A3([0, 1, 2], C.sora, 'AB', [1, 1, 1]), A3([1, 2, 0], C.beni, 'AC', [1, 1, 1])], tri: [{ pts: [[1, 1, 1], [1, 2, 3], [2, 3, 1]] }] }));
      await growAll(W);
      exTag('Example 24', 'triangle A(1, 1, 1), B(1, 2, 3), C(2, 3, 1)');
      await fieldsQ('AB⃗ × AC⃗ = ?', cmp([-4, 2, -1]), 'AB⃗ = ĵ + 2k̂, AC⃗ = î + 2ĵ.', '');
      await numQ('Area = ½|AB⃗ × AC⃗| = ?', Math.sqrt(21) / 2, '½√21.', { show: '√21/2', keys: '√' });
      exTag('Example 25', 'parallelogram, a⃗ = 3î + ĵ + 4k̂, b⃗ = î − ĵ + k̂');
      await numQ('Area = |a⃗ × b⃗| = |5î + ĵ − 4k̂| = ?', Math.sqrt(42), '√42.', { show: '√42', keys: '√' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 4'; }); await summary([{ t: '|a⃗ × b⃗| = |a⃗||b⃗| sin θ = area of the parallelogram', eq: true }, 'a⃗ × b⃗ ⟂ both; a⃗ × b⃗ = 0⃗ ⇔ parallel; b⃗ × a⃗ = −a⃗ × b⃗.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'miscex', title: 'Mixed Examples', blurb: 'Unit circle, collinear segments, perpendicular sums and splitting a vector. Examples 26–30.', face: 'kimmy-lookup',
  steps: [
    async function () {
      let t = 30; enterScene('vec', (W) => { vecSet(W, { v: [-1.6, 1.6, -1.3, 1.3], arr: [{ v: [Math.cos(Math.PI / 6), 0.5, 0], col: C.sora, t: 'r̂' }] }); W.curves = [{ f: (x) => Math.sqrt(Math.max(0, 1 - x * x)), x0: -1, x1: 1, col: C['ink-muted'], w: 2 }, { f: (x) => -Math.sqrt(Math.max(0, 1 - x * x)), x0: -1, x1: 1, col: C['ink-muted'], w: 2 }]; W.rd = () => [['r̂ = cos ' + t + '° î + sin ' + t + '° ĵ', C.sora]]; });
      exTag('Example 26', 'all unit vectors in the XY-plane');
      const sl = slider('θ', 0, 360, 15, 30, (v) => 'θ = ' + v + '°', (v) => { t = v; W.arr[0].v = [Math.cos((v * Math.PI) / 180), Math.sin((v * Math.PI) / 180), 0]; }, 135);
      await task('Turn r̂ to θ = 135°', () => t === 135, () => { t = 135; sl.value = 135; W.arr[0].v = [-S2 / 2, S2 / 2, 0]; });
      await quiz('Every unit vector in the XY-plane is', ['cos θ î + sin θ ĵ', 'θî + θĵ', 'î + ĵ', 'sin θ î + sin θ ĵ'], 0, 'Its tip runs around the unit circle.');
      exTag('Example 27', 'AB⃗ = î + 4ĵ − k̂, CD⃗ = −2î − 8ĵ + 2k̂');
      await numQ('cos θ = ?', -1, 'θ = π: AB⃗ = −½CD⃗, collinear.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 28–30'; W.sub = 'dot-product tricks'; });
      exTag('Example 28', '|a⃗| = 3, |b⃗| = 4, |c⃗| = 5, each ⟂ to the sum of the other two');
      await numQ('|a⃗ + b⃗ + c⃗| = ?', 5 * S2, '9 + 16 + 25 = 50.', { show: '5√2', keys: '√' });
      exTag('Example 29', 'a⃗ + b⃗ + c⃗ = 0⃗, |a⃗| = 3, |b⃗| = 4, |c⃗| = 2');
      await numQ('μ = a⃗·b⃗ + b⃗·c⃗ + c⃗·a⃗ = ?', -14.5, '2μ = −(9 + 16 + 4).', { show: '−29/2' });
      exTag('Example 30', 'β⃗ = 2î + ĵ − 3k̂ = β⃗₁ + β⃗₂, β⃗₁ ∥ α⃗ = 3î − ĵ, β⃗₂ ⟂ α⃗');
      await numQ('β⃗₁ = λα⃗ with λ = ?', 0.5, '3(2 − 3λ) − (1 + λ) = 0.', { show: '1/2' });
      await fieldsQ('β⃗₂ = β⃗ − β⃗₁ = ?', cmp([0.5, 1.5, -3], ['1/2', '3/2', '−3']), 'β⃗₁ = (3/2)î − (1/2)ĵ.', '');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 5'; }); await summary(['|v⃗|² = v⃗·v⃗ unlocks most problems.', { t: 'Parallel part: (β⃗·α̂)α̂, perpendicular part: the rest', eq: true }]); },
  ],
}));

const BOSS10 = [
  ['|2î − 3ĵ + 6k̂| = ?', ['7', '5', '√11', '49'], 0],
  ['î·ĵ = ?', ['0', '1', 'k̂', '−1'], 0],
  ['î × ĵ = ?', ['k̂', '−k̂', '0⃗', '1'], 0],
  ['a⃗·b⃗ = 0 (both nonzero) means', ['perpendicular', 'parallel', 'equal', 'opposite'], 0],
  ['a⃗ × b⃗ = 0⃗ (both nonzero) means', ['parallel', 'perpendicular', 'unit', 'equal'], 0],
  ['Unit vector along 3î + 4ĵ', ['(3î + 4ĵ)/5', '3î + 4ĵ', '(3î + 4ĵ)/7', 'î + ĵ'], 0],
  ['Midpoint of a⃗ and b⃗', ['(a⃗ + b⃗)/2', 'a⃗ − b⃗', '(a⃗ − b⃗)/2', 'a⃗ + b⃗'], 0],
  ['Area of the parallelogram on a⃗, b⃗', ['|a⃗ × b⃗|', 'a⃗·b⃗', '½|a⃗ × b⃗|', '|a⃗||b⃗|'], 0],
  ['l² + m² + n² = ?', ['1', '0', '3', 'depends'], 0],
  ['b⃗ × a⃗ = ?', ['−a⃗ × b⃗', 'a⃗ × b⃗', '0⃗', 'a⃗·b⃗'], 0],
];

{
  const byId = (id) => LESSONS.find((l) => l.id === id);
  const [ba, ad, dt, cr, mx] = ['basics', 'addition', 'dot', 'cross', 'miscex'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(ba, exLesson({ id: 'ex101', title: 'Exercise 10.1', blurb: 'All 5: compass arrows, scalars vs vectors, the square.', face: 'kimmy-playful', qs: EX101 }), ad, exLesson({ id: 'ex102', title: 'Exercise 10.2', blurb: 'All 19: components, unit vectors, section formula in 3D.', face: 'jess-happy', qs: EX102 }), dt, exLesson({ id: 'ex103', title: 'Exercise 10.3', blurb: 'All 18 dot-product questions.', face: 'kimmy-curious', qs: EX103 }), cr, exLesson({ id: 'ex104', title: 'Exercise 10.4', blurb: 'All 12 cross-product questions.', face: 'jess-thinking', qs: EX104 }), mx, exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 19 Miscellaneous Exercise questions.', face: 'jess-excited', qs: EX10M }));
}
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 10'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Vectors at full speed!'); await cont('Fight'); }, ...BOSS10.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 10'; }); await summary(['Chapter complete!', { t: 'a⃗·b⃗ = |a⃗||b⃗|cos θ,  |a⃗ × b⃗| = |a⃗||b⃗|sin θ', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

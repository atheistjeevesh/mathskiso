/* =========================================================
   CLASS 12 · CHAPTER 11 · THREE DIMENSIONAL GEOMETRY — lessons (Examples 1–10), Exercises 11.1, 11.2, Miscellaneous
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const fieldsQ = (q, f, yes, keys = '√') => fields(q, f, { keys }).then((r) => verdict(r, yes, 'Answer: ' + f.map((s) => s.l + ' = ' + (s.show || fracStr(s.a))).join(', ') + '. ' + yes));
const R2 = Math.SQRT2, R3 = Math.sqrt(3), dcF = (v, shows) => { const r = V.norm(v); return v.map((x, i) => ({ l: ['l', 'm', 'n'][i], a: x / r, show: shows ? shows[i] : undefined })); };
const ACOS = (x) => Math.acos(x);

LESSONS.push(lesson({
  id: 'dcs', title: 'Direction Cosines', blurb: 'A line’s direction in three numbers. Direction ratios are any multiple of them; two points give both. Examples 1–5.', face: 'kimmy-curious',
  steps: [
    async function () {
      const P = [2, 2, 1];
      enterScene('line3', (W) => { lineSet(W, [{ a: [0, 0, 0], b: P.slice(), col: C.sora, t: 'L' }], { R: 4 }); W.ang = [{ u: [1, 0, 0], v: P, t: 'α', r: 0.9 }]; W.rd = () => { const r = V.norm(P); return [['direction ratios: ' + P.join(', '), C.ink], ['l, m, n = ' + P.map((x) => fmtN(x / r, 3)).join(', '), C.sora], ['l² + m² + n² = 1', C['matcha-deep']]]; }; });
      await slam('l, m, n', 'Class 12 · Ch 11 · Section 11.2');
      await J('idle', 'A directed line makes angles α, β, γ with the axes. Their cosines l, m, n are the direction cosines. Any numbers proportional to them are direction ratios. Drag the stage to orbit.');
      ['a', 'b', 'c'].forEach((n, i) => slider(n, -3, 3, 1, P[i], (v) => n + ' = ' + v, (v) => { P[i] = v; W.lines[0].b = P.slice(); W.ang[0].v = P.slice(); }, [2, -1, -2][i]));
      await task('Set the direction ratios to 2, −1, −2', () => P[0] === 2 && P[1] === -1 && P[2] === -2, () => { P.splice(0, 3, 2, -1, -2); W.lines[0].b = P.slice(); W.ang[0].v = P.slice(); });
      exTag('Example 2', 'ratios 2, −1, −2');
      await fieldsQ('Direction cosines', dcF([2, -1, -2], ['2/3', '−1/3', '−2/3']), 'Divide by √(4 + 1 + 4) = 3.', '');
      await discover('l = a/√(a² + b² + c²), …', 'Reversing the line flips all three signs.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('line3', (W) => lineSet(W, [{ a: [-2, 4, -5], b: [3, -2, 8], col: C.sora, t: 'PQ' }], { R: 6, dots: [{ p: [-2, 4, -5], t: 'P' }, { p: [1, 2, 3], t: 'Q' }] }));
      await drawLines(W);
      exTag('Example 1', 'angles 90°, 60°, 30°');
      await fieldsQ('l, m, n = cos 90°, cos 60°, cos 30°', [{ l: 'l', a: 0 }, { l: 'm', a: 0.5, show: '1/2' }, { l: 'n', a: R3 / 2, show: '√3/2' }], '');
      exTag('Example 3', 'through (−2, 4, −5) and (1, 2, 3)');
      await fieldsQ('Direction cosines of PQ', dcF([3, -2, 8], ['3/√77', '−2/√77', '8/√77']), 'PQ = √(9 + 4 + 64) = √77.');
      exTag('Example 4', 'the axes');
      await quiz('Direction cosines of the x-axis', ['1, 0, 0', '0, 1, 1', '1, 1, 1', '0, 0, 0'], 0, 'Angles 0°, 90°, 90°.');
      exTag('Example 5', 'A(2, 3, −4), B(1, −2, 3), C(3, 8, −11)');
      await quiz('Direction ratios of AB and BC are −1, −5, 7 and 2, 10, −14. So', ['A, B, C are collinear', 'AB ⟂ BC', 'they form a triangle', 'nothing'], 0, 'Proportional ratios and a common point B.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'l² + m² + n² = 1;  d.c.s of PQ: (x₂ − x₁)/PQ, …', eq: true }, 'Direction ratios: any nonzero multiple of (l, m, n).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'lines', title: 'Equation of a Line', blurb: 'r⃗ = a⃗ + λb⃗: slide λ and a point rides the line. Cartesian form and the angle between two lines. Examples 6–8.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('line3', (W) => lineSet(W, [{ a: [5, 2, -4], b: [3, 2, -8], col: C.sora, t: 'l', tl: 0.8 }], { R: 7, arr: [{ v: [5, 2, -4], col: C.beni, t: 'a⃗' }], dots: [] }));
      await slam('r⃗ = a⃗ + λb⃗', 'Section 11.3');
      exTag('Example 6', 'through (5, 2, −4), parallel to 3î + 2ĵ − 8k̂');
      await J('idle', 'Start at A (position vector a⃗), then walk any multiple λ of b⃗. Every λ lands on the line; every point of the line comes from some λ.');
      await drawLines(W);
      const L = W.lines[0]; L.lam = 0; const sl = slider('λ', -1, 1, 0.25, 0, (v) => 'λ = ' + v, (v) => (L.lam = v), 0.5);
      W.rd = () => [['r⃗ = (' + [5 + 3 * L.lam, 2 + 2 * L.lam, -4 - 8 * L.lam].map((x) => fmtN(x, 2)).join(', ') + ')', C.sora]];
      await task('Slide λ to ½', () => L.lam === 0.5, () => { L.lam = 0.5; sl.value = 0.5; });
      await quiz('Cartesian form:', ['(x − 5)/3 = (y − 2)/2 = (z + 4)/(−8)', '(x − 3)/5 = (y − 2)/2 = (z + 8)/(−4)', '(x + 5)/3 = (y + 2)/2 = (z − 4)/(−8)', 'x/5 = y/2 = z/(−4)'], 0, 'Eliminate λ from x = 5 + 3λ, y = 2 + 2λ, z = −4 − 8λ.');
      await discover('(x − x₁)/a = (y − y₁)/b = (z − z₁)/c', 'Point (x₁, y₁, z₁) and direction ratios a, b, c.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('line3', (W) => lineSet(W, [{ a: [0, 0, 0], b: [1, 2, 2], col: C.sora, t: 'b⃗₁' }, { a: [0, 0, 0], b: [3, 2, 6], col: C.beni, t: 'b⃗₂', tl: 0.8 }], { R: 5, ang: [{ u: [1, 2, 2], v: [3, 2, 6], t: 'θ', r: 1.6 }] }));
      await drawLines(W);
      exTag('Example 7', 'r⃗ = 3î + 2ĵ − 4k̂ + λ(î + 2ĵ + 2k̂), r⃗ = 5î − 2ĵ + μ(3î + 2ĵ + 6k̂)');
      await J('think', 'Only the directions matter for the angle, so slide both lines to pass through O.');
      await numQ('cos θ = |b⃗₁·b⃗₂|/(|b⃗₁||b⃗₂|) = ?', 19 / 21, '(3 + 4 + 12)/(3 · 7). θ = cos⁻¹(19/21).', { show: '19/21' });
      exTag('Example 8', '(x + 3)/3 = (y − 1)/5 = (z + 3)/4 and (x + 1)/1 = (y − 4)/1 = (z − 5)/2');
      await numQ('cos θ = ?', 16 / (Math.sqrt(50) * Math.sqrt(6)), '16/(√50 √6) = 8√3/15.', { show: '8√3/15', keys: '√' });
      await quiz('Two lines with ratios a₁, b₁, c₁ and a₂, b₂, c₂ are perpendicular when', ['a₁a₂ + b₁b₂ + c₁c₂ = 0', 'a₁/a₂ = b₁/b₂ = c₁/c₂', 'a₁ + a₂ = 0', 'a₁b₁c₁ = a₂b₂c₂'], 0, 'cos θ = 0. Proportional ratios mean parallel.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 2'; }); await summary([{ t: 'r⃗ = a⃗ + λb⃗  ⇔  (x − x₁)/a = (y − y₁)/b = (z − z₁)/c', eq: true }, 'cos θ = |b⃗₁·b⃗₂|/(|b⃗₁||b⃗₂|).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'skew', title: 'Shortest Distance', blurb: 'Skew lines never meet and are not parallel. Hunt for the closest pair of points, then compute it with the cross product. Examples 9–10.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('line3', (W) => lineSet(W, [{ a: [1, 1, 0], b: [2, -1, 1], col: C.sora, t: 'l₁' }, { a: [2, 1, -1], b: [3, -5, 2], col: C.beni, t: 'l₂', tl: 0.9 }], { R: 6 }));
      await slam('SKEW LINES', 'Section 11.5');
      exTag('Example 9', 'r⃗ = î + ĵ + λ(2î − ĵ + k̂), r⃗ = 2î + ĵ − k̂ + μ(3î − 5ĵ + 2k̂)');
      await drawLines(W);
      await J('idle', 'These lines are neither parallel nor meeting: skew. Drag the stage to see. A rider P sits on l₁, Q on l₂. Make PQ as short as you can.');
      const p = huntP(); await p.pre(W); await task(p.q, () => p.check(W), p.auto); await huntEnd.run(W);
      await K('think', 'At the shortest spot, PQ looks perpendicular to both lines!');
      await J('happy', 'Exactly. So PQ is along b⃗₁ × b⃗₂, and its length is the projection of a⃗₂ − a⃗₁ onto that direction.');
      await fieldsQ('b⃗₁ × b⃗₂ = ?', cmp([3, -1, -7]), '', '');
      await numQ('d = |(b⃗₁ × b⃗₂)·(a⃗₂ − a⃗₁)|/|b⃗₁ × b⃗₂| = ?', 10 / Math.sqrt(59), 'a⃗₂ − a⃗₁ = î − k̂: |3 + 7|/√59.', { show: '10/√59', keys: '√' });
      await discover('d = |(b⃗₁ × b⃗₂)·(a⃗₂ − a⃗₁)| / |b⃗₁ × b⃗₂|', 'Zero means the lines meet.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('line3', (W) => lineSet(W, [{ a: [1, 2, -4], b: [2, 3, 6], col: C.sora, t: 'l₁' }, { a: [3, 3, -5], b: [2, 3, 6], col: C.beni, t: 'l₂', tl: 0.9 }], { R: 7 }));
      await drawLines(W);
      exTag('Example 10', 'parallel lines, b⃗ = 2î + 3ĵ + 6k̂');
      await quiz('Why does the skew formula fail here?', ['b⃗ × b⃗ = 0⃗: the lines are parallel', 'the lines meet', 'the points are equal', 'it works fine'], 0, 'Use d = |b⃗ × (a⃗₂ − a⃗₁)|/|b⃗| instead.');
      await fieldsQ('b⃗ × (a⃗₂ − a⃗₁) = ?', cmp([-9, 14, -4]), 'a⃗₂ − a⃗₁ = 2î + ĵ − k̂.', '');
      await numQ('d = ?', Math.sqrt(293) / 7, '√293/√49.', { show: '√293/7', keys: '√' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 3'; }); await summary([{ t: 'Skew: |(b⃗₁ × b⃗₂)·(a⃗₂ − a⃗₁)|/|b⃗₁ × b⃗₂|', eq: true }, 'Parallel: |b⃗ × (a⃗₂ − a⃗₁)|/|b⃗|.']); },
  ],
}));

/* ===================== EXERCISE 11.1 ===================== */
const EX111 = [
  lQ('Ex 11.1', 'Q1', 'A line makes 90°, 135°, 45° with the x, y and z-axes. Find its direction cosines.', [{ a: [0, 0, 0], b: [0, -1, 1], col: C.sora, t: 'L' }], [fldP('l, m, n = cos 90°, cos 135°, cos 45°', [{ l: 'l', a: 0 }, { l: 'm', a: -1 / R2, show: '−1/√2' }, { l: 'n', a: 1 / R2, show: '1/√2' }])], '0, −1/√2, 1/√2', { R: 3 }),
  lQ('Ex 11.1', 'Q2', 'Direction cosines of a line making equal angles with the coordinate axes', [{ a: [0, 0, 0], b: [1, 1, 1], col: C.sora, t: 'L' }], [numP('l = m = n and 3l² = 1: l = ?', 1 / R3, '1/√3'), mcqP('So the direction cosines are', ['±(1/√3, 1/√3, 1/√3)', '(1, 1, 1)', '(1/3, 1/3, 1/3)', '(√3, √3, √3)'], 'Either direction along the line.')], '±(1/√3, 1/√3, 1/√3)', { R: 3 }),
  lQ('Ex 11.1', 'Q3', 'Direction ratios −18, 12, −4. Direction cosines?', [{ a: [0, 0, 0], b: [-18, 12, -4], col: C.sora, t: 'L', tl: 0.2 }], [numP('√(324 + 144 + 16) = ?', 22, '22', '', { keys: '' }), fldP('Direction cosines', dcF([-18, 12, -4], ['−9/11', '6/11', '−2/11']), 'Divide by 22 (or take all signs reversed).', '')], '−9/11, 6/11, −2/11', { R: 4 }),
  lQ('Ex 11.1', 'Q4', 'Show (2, 3, 4), (−1, −2, 1), (5, 8, 7) are collinear', [{ a: [2, 3, 4], b: [-3, -5, -3], col: C.sora, t: 'line' }], [fldP('Direction ratios of AB', cmp([-3, -5, -3], null, ['a', 'b', 'c']), '', ''), fldP('Direction ratios of BC', cmp([6, 10, 6], null, ['a', 'b', 'c']), '', ''), { k: 'tf', q: 'They are proportional (BC = −2·AB) and share B: collinear.', a: true, x: '' }], 'Ratios −3, −5, −3 and 6, 10, 6 are proportional', { R: 9, dots: [{ p: [2, 3, 4], t: 'A' }, { p: [-1, -2, 1], t: 'B' }, { p: [5, 8, 7], t: 'C' }] }),
  lQ('Ex 11.1', 'Q5', 'Direction cosines of the sides of the triangle (3, 5, −4), (−1, 1, 2), (−5, −5, −2)', [], [fldP('AB (|AB| = 2√17)', dcF([-4, -4, 6], ['−2/√17', '−2/√17', '3/√17'])), fldP('BC (|BC| = 2√17)', dcF([-4, -6, -4], ['−2/√17', '−3/√17', '−2/√17'])), fldP('CA (|CA| = 2√42)', dcF([8, 10, -2], ['4/√42', '5/√42', '−1/√42']))], 'AB: −2/√17, −2/√17, 3/√17; BC: −2/√17, −3/√17, −2/√17; CA: 4/√42, 5/√42, −1/√42', { R: 6, tri: [{ pts: [[3, 5, -4], [-1, 1, 2], [-5, -5, -2]] }], dots: [{ p: [3, 5, -4], t: 'A' }, { p: [-1, 1, 2], t: 'B' }, { p: [-5, -5, -2], t: 'C' }] }),
];

/* ===================== EXERCISE 11.2 ===================== */
const angL = (b1, b2) => ({ lines: [{ a: [0, 0, 0], b: b1, col: C.sora, t: 'L₁' }, { a: [0, 0, 0], b: b2, col: C.beni, t: 'L₂', tl: 0.8 }], ang: [{ u: b1, v: b2, t: 'θ', r: 1.2 }] });
const angQ = (ex, n, q, b1, b2, cosv, cshow, ans, opts, o = {}) => lQ(ex, n, q, angL(b1, b2).lines, [...(o.steps || []), numP('cos θ = ?', cosv, cshow, o.x || '', { keys: '√' }), ...(ans ? [mcqP('θ = ?', [ans, ...opts], '')] : [])], ans || 'cos θ = ' + cshow, { R: o.R || 4, ang: angL(b1, b2).ang });
const sdQ = (ex, n, q, a1, b1, a2, b2, show, o = {}) => lQ(ex, n, q, [{ a: a1, b: b1, col: C.sora, t: 'l₁' }, { a: a2, b: b2, col: C.beni, t: 'l₂', tl: 0.9 }], [...(o.steps || []), ...(o.hunt ? [huntP(), huntEnd] : []), fldP('b⃗₁ × b⃗₂ = ?', cmp(V.cross(b1, b2))), fldP('a⃗₂ − a⃗₁ = ?', cmp(V.sub(a2, a1)), '', ''), numP('Shortest distance = ?', skewD(a1, b1, a2, b2), show, '|(b⃗₁ × b⃗₂)·(a⃗₂ − a⃗₁)|/|b⃗₁ × b⃗₂|.', { keys: '√ ( )' })], 'd = ' + show, { R: o.R || 6 });
const EX112 = [
  lQ('Ex 11.2', 'Q1', 'Show the lines with direction cosines 12/13, −3/13, −4/13; 4/13, 12/13, 3/13; 3/13, −4/13, 12/13 are mutually perpendicular', [{ a: [0, 0, 0], b: [12, -3, -4], col: C.sora, t: 'L₁', tl: 0.15 }, { a: [0, 0, 0], b: [4, 12, 3], col: C.beni, t: 'L₂', tl: 0.15 }, { a: [0, 0, 0], b: [3, -4, 12], col: C['matcha-deep'], t: 'L₃', tl: 0.15 }], [fldP('Products l₁l₂ + m₁m₂ + n₁n₂ (× 169)', [{ l: 'L₁·L₂', a: 0 }, { l: 'L₂·L₃', a: 0 }, { l: 'L₃·L₁', a: 0 }], '48 − 36 − 12 = 0, 12 − 48 + 36 = 0, 36 + 12 − 48 = 0.', '')], 'All three products are 0', { R: 3 }),
  lQ('Ex 11.2', 'Q2', 'Show the line through (1, −1, 2), (3, 4, −2) is perpendicular to the line through (0, 3, 2), (3, 5, 6)', [{ a: [1, -1, 2], b: [2, 5, -4], col: C.sora, t: 'L₁' }, { a: [0, 3, 2], b: [3, 2, 4], col: C.beni, t: 'L₂' }], [fldP('Direction ratios', [{ l: 'L₁ (a)', a: 2 }, { l: '(b)', a: 5 }, { l: '(c)', a: -4 }], 'L₂: 3, 2, 4.', ''), numP('a₁a₂ + b₁b₂ + c₁c₂ = ?', 0, '0', '6 + 10 − 16.', { keys: '' })], '2·3 + 5·2 + (−4)·4 = 0', { R: 6 }),
  lQ('Ex 11.2', 'Q3', 'Show the line through (4, 7, 8), (2, 3, 4) is parallel to the line through (−1, −2, 1), (1, 2, 5)', [{ a: [4, 7, 8], b: [-2, -4, -4], col: C.sora, t: 'L₁' }, { a: [-1, -2, 1], b: [2, 4, 4], col: C.beni, t: 'L₂' }], [mcqP('Direction ratios', ['−2, −4, −4 and 2, 4, 4: proportional', '2, 4, 4 and 2, 4, 4: equal points', 'perpendicular', 'not related'], 'b⃗₂ = −b⃗₁: parallel.')], 'Ratios −2, −4, −4 and 2, 4, 4', { R: 9 }),
  lQ('Ex 11.2', 'Q4', 'Equation of the line through (1, 2, 3) parallel to 3î + 2ĵ − 2k̂', [{ a: [1, 2, 3], b: [3, 2, -2], col: C.sora, t: 'l', tl: 0.8 }], [rideP(0, 1), mcqP('Vector form', ['r⃗ = î + 2ĵ + 3k̂ + λ(3î + 2ĵ − 2k̂)', 'r⃗ = 3î + 2ĵ − 2k̂ + λ(î + 2ĵ + 3k̂)', 'r⃗ = λ(3î + 2ĵ − 2k̂)', 'r⃗ = î + 2ĵ + 3k̂'], 'a⃗ + λb⃗.')], 'r⃗ = î + 2ĵ + 3k̂ + λ(3î + 2ĵ − 2k̂)', { R: 6, dots: [{ p: [1, 2, 3], t: '(1, 2, 3)' }] }),
  lQ('Ex 11.2', 'Q5', 'Line through 2î − ĵ + 4k̂ in the direction î + 2ĵ − k̂: vector and cartesian forms', [{ a: [2, -1, 4], b: [1, 2, -1], col: C.sora, t: 'l', tl: 1.2 }], [mcqP('Vector form', ['r⃗ = 2î − ĵ + 4k̂ + λ(î + 2ĵ − k̂)', 'r⃗ = î + 2ĵ − k̂ + λ(2î − ĵ + 4k̂)', 'r⃗ = λ(î + 2ĵ − k̂)', 'r⃗ = 2î − ĵ + 4k̂'], ''), mcqP('Cartesian form', ['(x − 2)/1 = (y + 1)/2 = (z − 4)/(−1)', '(x − 1)/2 = (y − 2)/(−1) = (z + 1)/4', '(x + 2)/1 = (y − 1)/2 = (z + 4)/(−1)', 'x/2 = y/(−1) = z/4'], '')], 'r⃗ = 2î − ĵ + 4k̂ + λ(î + 2ĵ − k̂); (x − 2)/1 = (y + 1)/2 = (z − 4)/(−1)', { R: 6 }),
  lQ('Ex 11.2', 'Q6', 'Cartesian equation of the line through (−2, 4, −5) parallel to (x + 3)/3 = (y − 4)/5 = (z + 8)/6', [{ a: [-3, 4, -8], b: [3, 5, 6], col: C['ink-muted'], t: 'given', tl: 0.7 }, { a: [-2, 4, -5], b: [3, 5, 6], col: C.sora, t: 'new', tl: 0.4 }], [mcqP('Answer', ['(x + 2)/3 = (y − 4)/5 = (z + 5)/6', '(x − 2)/3 = (y + 4)/5 = (z − 5)/6', '(x + 3)/(−2) = (y − 4)/4 = (z + 8)/(−5)', '(x + 2)/3 = (y − 4)/5 = (z + 8)/6'], 'Same direction ratios 3, 5, 6.')], '(x + 2)/3 = (y − 4)/5 = (z + 5)/6', { R: 9 }),
  lQ('Ex 11.2', 'Q7', 'The cartesian equation of a line is (x − 5)/3 = (y + 4)/7 = (z − 6)/2. Write its vector form.', [{ a: [5, -4, 6], b: [3, 7, 2], col: C.sora, t: 'l', tl: 0.6 }], [fldP('Point a⃗', cmp([5, -4, 6]), '', ''), fldP('Direction b⃗', cmp([3, 7, 2]), '', '')], 'r⃗ = 5î − 4ĵ + 6k̂ + λ(3î + 7ĵ + 2k̂)', { R: 9 }),
  angQ('Ex 11.2', 'Q8(i)', 'Angle between r⃗ = 2î − 5ĵ + k̂ + λ(3î + 2ĵ + 6k̂) and r⃗ = 7î − 6k̂ + μ(î + 2ĵ + 2k̂)', [3, 2, 6], [1, 2, 2], 19 / 21, '19/21', 'cos⁻¹(19/21)', ['cos⁻¹(19/7)', 'π/4', 'cos⁻¹(19/√21)'], { x: '(3 + 4 + 12)/(7 · 3).' }),
  angQ('Ex 11.2', 'Q8(ii)', 'Angle between r⃗ = 3î + ĵ − 2k̂ + λ(î − ĵ − 2k̂) and r⃗ = 2î − ĵ − 56k̂ + μ(3î − 5ĵ − 4k̂)', [1, -1, -2], [3, -5, -4], 16 / (Math.sqrt(6) * Math.sqrt(50)), '8√3/15', 'cos⁻¹(8√3/15)', ['cos⁻¹(16/√6)', 'π/6', 'cos⁻¹(8/15)'], { x: '16/(√6 · 5√2) = 8/(5√3).', R: 6 }),
  angQ('Ex 11.2', 'Q9(i)', 'Angle between (x − 2)/2 = (y − 1)/5 = (z + 3)/(−3) and (x + 2)/(−1) = (y − 4)/8 = (z − 5)/4', [2, 5, -3], [-1, 8, 4], 26 / (9 * Math.sqrt(38)), '26/(9√38)', 'cos⁻¹(26/(9√38))', ['cos⁻¹(26/9)', 'π/3', 'cos⁻¹(13/(9√38))'], { x: '(−2 + 40 − 12)/(√38 · 9).', R: 8 }),
  angQ('Ex 11.2', 'Q9(ii)', 'Angle between x/2 = y/2 = z/1 and (x − 5)/4 = (y − 2)/1 = (z − 3)/8', [2, 2, 1], [4, 1, 8], 2 / 3, '2/3', 'cos⁻¹(2/3)', ['cos⁻¹(1/3)', 'π/4', 'cos⁻¹(18/9)'], { x: '(8 + 2 + 8)/(3 · 9).', R: 8 }),
  lQ('Ex 11.2', 'Q10', 'Find p so that (1 − x)/3 = (7y − 14)/(2p) = (z − 3)/2 and (7 − 7x)/(3p) = (y − 5)/1 = (6 − z)/5 are at right angles', [{ a: [1, 2, 3], b: [-3, 20 / 11, 2], col: C.sora, t: 'L₁' }, { a: [1, 5, 6], b: [-30 / 11, 1, -5], col: C.beni, t: 'L₂', tl: 0.8 }], [mcqP('Standard form of the first line: direction ratios', ['−3, 2p/7, 2', '3, 2p, 2', '1, 7, 1', '−3, 2p, 2'], '(x − 1)/(−3) = (y − 2)/(2p/7) = (z − 3)/2.'), mcqP('Second line: direction ratios', ['−3p/7, 1, −5', '3p, 1, 5', '−7, 1, −1', '−3p, 1, −5'], '(x − 1)/(−3p/7) = (y − 5)/1 = (z − 6)/(−5).'), numP('9p/7 + 2p/7 − 10 = 0 gives p = ?', 70 / 11, '70/11', '', { keys: '' })], 'p = 70/11', { R: 6 }),
  lQ('Ex 11.2', 'Q11', 'Show (x − 5)/7 = (y + 2)/(−5) = z/1 and x/1 = y/2 = z/3 are perpendicular', [{ a: [5, -2, 0], b: [7, -5, 1], col: C.sora, t: 'L₁', tl: 0.6 }, { a: [0, 0, 0], b: [1, 2, 3], col: C.beni, t: 'L₂' }], [numP('7·1 + (−5)·2 + 1·3 = ?', 0, '0', '', { keys: '' })], 'Sum of products 0', { R: 7 }),
  sdQ('Ex 11.2', 'Q12', 'Shortest distance between r⃗ = (î + 2ĵ + k̂) + λ(î − ĵ + k̂) and r⃗ = 2î − ĵ − k̂ + μ(2î + ĵ + 2k̂)', [1, 2, 1], [1, -1, 1], [2, -1, -1], [2, 1, 2], '3√2/2', { hunt: true }),
  sdQ('Ex 11.2', 'Q13', 'Shortest distance between (x + 1)/7 = (y + 1)/(−6) = (z + 1)/1 and (x − 3)/1 = (y − 5)/(−2) = (z − 7)/1', [-1, -1, -1], [7, -6, 1], [3, 5, 7], [1, -2, 1], '2√29', { R: 8 }),
  sdQ('Ex 11.2', 'Q14', 'Shortest distance between r⃗ = (î + 2ĵ + 3k̂) + λ(î − 3ĵ + 2k̂) and r⃗ = 4î + 5ĵ + 6k̂ + μ(2î + 3ĵ + k̂)', [1, 2, 3], [1, -3, 2], [4, 5, 6], [2, 3, 1], '3/√19', { hunt: true, R: 7 }),
  sdQ('Ex 11.2', 'Q15', 'Shortest distance between r⃗ = (1 − t)î + (t − 2)ĵ + (3 − 2t)k̂ and r⃗ = (s + 1)î + (2s − 1)ĵ − (2s + 1)k̂', [1, -2, 3], [-1, 1, -2], [1, -1, -1], [1, 2, -2], '8/√29', { steps: [mcqP('Read off the first line: a⃗₁ and b⃗₁', ['a⃗₁ = î − 2ĵ + 3k̂, b⃗₁ = −î + ĵ − 2k̂', 'a⃗₁ = −î + ĵ − 2k̂, b⃗₁ = î − 2ĵ + 3k̂', 'a⃗₁ = î + ĵ + k̂, b⃗₁ = î − ĵ', 'a⃗₁ = 0⃗, b⃗₁ = î'], 'Collect the t terms.')] }),
];

/* ===================== MISCELLANEOUS ===================== */
const EX11M = [
  bQ('Misc 11', 'Q1', 'Angle between the lines with direction ratios a, b, c and b − c, c − a, a − b', [mcqP('a(b − c) + b(c − a) + c(a − b) = ?', ['0', 'abc', 'a² + b² + c²', '1'], 'Everything cancels.'), mcqP('So the angle is', ['90°', '0°', '45°', '60°'], '')], '90°'),
  lQ('Misc 11', 'Q2', 'Equation of the line parallel to the x-axis through the origin', [{ a: [0, 0, 0], b: [1, 0, 0], col: C.kin, t: 'line', tl: 2 }], [mcqP('Answer', ['r⃗ = λî (x/1 = y/0 = z/0)', 'r⃗ = λĵ', 'x = y = z', 'r⃗ = î + λĵ'], 'Direction ratios 1, 0, 0.')], 'r⃗ = λî', { R: 3 }),
  lQ('Misc 11', 'Q3', 'If (x − 1)/(−3) = (y − 2)/(2k) = (z − 3)/2 and (x − 1)/(3k) = (y − 1)/1 = (z − 6)/(−5) are perpendicular, find k', [{ a: [1, 2, 3], b: [-3, -20 / 7, 2], col: C.sora, t: 'L₁' }, { a: [1, 1, 6], b: [-30 / 7, 1, -5], col: C.beni, t: 'L₂', tl: 0.8 }], [mcqP('Condition', ['−9k + 2k − 10 = 0', '−3·3k + 2k·1 + 2·5 = 0', '−3 + 2k + 2 = 0', '9k + 2k + 10 = 0'], '(−3)(3k) + (2k)(1) + (2)(−5).'), numP('k = ?', -10 / 7, '−10/7', '', { keys: '' })], 'k = −10/7', { R: 7 }),
  sdQ('Misc 11', 'Q4', 'Shortest distance between r⃗ = 6î + 2ĵ + 2k̂ + λ(î − 2ĵ + 2k̂) and r⃗ = −4î − k̂ + μ(3î − 2ĵ − 2k̂)', [6, 2, 2], [1, -2, 2], [-4, 0, -1], [3, -2, -2], '9', { R: 8 }),
  lQ('Misc 11', 'Q5', 'Vector equation of the line through (1, 2, −4) perpendicular to (x − 8)/3 = (y + 19)/(−16) = (z − 10)/7 and (x − 15)/3 = (y − 29)/8 = (z − 5)/(−5)', [{ a: [1, 2, -4], b: [2, 3, 6], col: C.kin, t: 'answer', tl: 0.9 }], [fldP('(3, −16, 7) × (3, 8, −5) = ?', cmp(V.cross([3, -16, 7], [3, 8, -5])), 'Perpendicular to both directions.', ''), mcqP('So the line is', ['r⃗ = î + 2ĵ − 4k̂ + λ(2î + 3ĵ + 6k̂)', 'r⃗ = 2î + 3ĵ + 6k̂ + λ(î + 2ĵ − 4k̂)', 'r⃗ = î + 2ĵ − 4k̂ + λ(3î − 16ĵ + 7k̂)', 'r⃗ = λ(24î + 36ĵ + 72k̂)'], '(24, 36, 72) = 12(2, 3, 6).')], 'r⃗ = î + 2ĵ − 4k̂ + λ(2î + 3ĵ + 6k̂)', { R: 7 }),
];

const BOSS11 = [
  ['Direction cosines of the z-axis', ['0, 0, 1', '1, 0, 0', '1, 1, 1', '0, 1, 0'], 0],
  ['l² + m² + n² = ?', ['1', '0', '3', 'l + m + n'], 0],
  ['Ratios 2, 3, 6 → direction cosines', ['2/7, 3/7, 6/7', '2, 3, 6', '1/2, 1/3, 1/6', '2/11, 3/11, 6/11'], 0],
  ['Line through a⃗ parallel to b⃗', ['r⃗ = a⃗ + λb⃗', 'r⃗ = b⃗ + λa⃗', 'r⃗ = λa⃗b⃗', 'r⃗ = a⃗ × b⃗'], 0],
  ['Lines with ratios 1, 2, 3 and 3, 0, −1 are', ['perpendicular', 'parallel', 'the same', 'skew for sure'], 0],
  ['Skew lines are', ['neither parallel nor intersecting', 'parallel', 'perpendicular', 'coplanar'], 0],
  ['Shortest distance between intersecting lines', ['0', '1', 'undefined', '|b⃗₁ × b⃗₂|'], 0],
  ['Distance between parallel lines uses', ['|b⃗ × (a⃗₂ − a⃗₁)|/|b⃗|', '|b⃗·(a⃗₂ − a⃗₁)|', '|a⃗₂ − a⃗₁|', '|b⃗₁ × b⃗₂|'], 0],
  ['(x − 1)/2 = (y + 3)/1 = z/4 passes through', ['(1, −3, 0)', '(2, 1, 4)', '(−1, 3, 0)', '(0, 0, 0)'], 0],
  ['cos θ between ratios (1, 0, 0) and (0, 1, 0)', ['0', '1', '½', '−1'], 0],
];

{
  const byId = (id) => LESSONS.find((l) => l.id === id);
  const [dc, li, sk] = ['dcs', 'lines', 'skew'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(dc, exLesson({ id: 'ex111', title: 'Exercise 11.1', blurb: 'All 5 direction-cosine questions.', face: 'kimmy-playful', qs: EX111 }), li, sk, exLesson({ id: 'ex112', title: 'Exercise 11.2', blurb: 'All 15: equations, angles and shortest distances (hunt them with sliders).', face: 'jess-happy', qs: EX112 }), exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 5 Miscellaneous Exercise questions.', face: 'jess-excited', qs: EX11M }));
}
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 11'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Lines in space, fast!'); await cont('Fight'); }, ...BOSS11.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 11'; }); await summary(['Chapter complete!', { t: 'r⃗ = a⃗ + λb⃗ · cos θ = |b⃗₁·b⃗₂|/(|b⃗₁||b⃗₂|) · skew distance', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

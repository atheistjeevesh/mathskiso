/* =========================================================
   CHAPTER 4 · COMPLEX NUMBERS — concept lessons (Examples 1–8)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const abF = (z, o = {}) => [{ l: 'a', a: z[0], show: o.sa || fracStr(z[0]), tol: o.tol }, { l: 'b', a: z[1], show: o.sb || fracStr(z[1]), tol: o.tol }];
async function abQ(q, z, yes, o = {}) { const r = await fields(q + '   (answer as a + ib)', abF(z, o), { keys: o.keys || '' }); await verdict(r, yes, 'Answer: ' + (o.str || Cx.str(z)) + '. ' + yes); return r; }

/* ================= LESSON 1 · MEET i ================= */
LESSONS.push(lesson({
  id: 'meet', title: 'Meet i', blurb: 'x² + 1 = 0 has no real root. Enter i = √−1, a + ib, and Example 1.', face: 'kimmy-surprised',
  steps: [
    async function () {
      enterScene('plane', (W) => planeView(W, -3, 3, -1.5, 5));
      await slam('MEET  i', 'Lesson 1 · Sections 4.1–4.2');
      await drawCurves(W, [curve((x) => x * x + 1, C.sora, { t: 'y = x² + 1' })]);
      await J('idle', 'Solve x² + 1 = 0. On the graph that means: where does the curve touch the x-axis?');
      await quiz('How many real solutions?', ['0', '1', '2', 'infinitely many'], 0, 'The curve never reaches y = 0: x² is never negative.');
      await K('think', 'So we just… make one up?');
      await J('happy', 'Exactly what mathematicians did. Call i = √−1, so i² = −1. Then i and −i solve x² + 1 = 0.');
      await discover('i² = −1', 'Numbers a + ib (a, b real) are complex numbers. Re z = a, Im z = b.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('argand', (W) => { argView(W, 5); W.zs.push(zObj([2, 5], { col: C.beni })); });
      await J('idle', 'z = 2 + i5 lives at the point (2, 5). Its real part is 2, its imaginary part is 5.');
      await quiz('Im(−1 + i√3) = ?', ['−1', '√3', 'i√3', '3'], 1, 'The imaginary part is the REAL number b, without the i.');
      await quiz('z₁ = a + ib, z₂ = c + id are equal when…', ['a = c and b = d', 'a + b = c + d', 'a = d and b = c', 'a² + b² = c² + d²'], 0, 'Real parts match AND imaginary parts match.');
      await cont();
    },
    async function () {
      enterScene('argand', (W) => argView(W, 9));
      exTag('Example 1', '4x + i(3x − y) = 3 + i(−6)');
      await J('think', 'Equate real parts and imaginary parts.');
      const r = await fields('Find x and y', [{ l: 'x', a: '3/4' }, { l: 'y', a: '33/4' }]); await verdict(r, '4x = 3 ⇒ x = 3/4; 3x − y = −6 ⇒ y = 9/4 + 6 = 33/4.', 'x = 3/4, y = 33/4.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; });
      await summary([{ t: 'i = √−1,  i² = −1', eq: true }, 'z = a + ib: Re z = a, Im z = b (both real).', 'a + ib = c + id ⇔ a = c and b = d.']);
    },
  ],
}));

/* ================= LESSON 2 · THE ARGAND PLANE ================= */
LESSONS.push(lesson({
  id: 'argand', title: 'The Argand Plane', blurb: 'Plot complex numbers, modulus as distance, conjugate as a mirror.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('argand', (W) => argView(W, 5));
      await slam('ARGAND PLANE', 'Lesson ' + L.num + ' · Section 4.5');
      await J('idle', 'x + iy ↔ the point (x, y). Horizontal = real axis, vertical = imaginary axis. Fig 4.1: plot them!');
      const z = zObj([0, 0], { col: C.beni, t: '' }); W.zs.push(z); zDrag(W, z, { snap: 1 });
      for (const [t, p] of [['A: 2 + 4i', [2, 4]], ['B: −2 + 3i', [-2, 3]], ['E: −5 − 2i', [-5, -2]], ['F: 1 − 2i', [1, -2]]]) {
        await task('Drag the red point to ' + t, () => z.re === p[0] && z.im === p[1] && !W.dragging, (W) => { z.re = p[0]; z.im = p[1]; });
        W.pts.push({ x: p[0], y: p[1], t: t.split(':')[0], col: C.sora }); FX.ono('PITA!', { x: 30 + Math.random() * 40, y: 25, hold: 0.3 }); SFX.snap();
      }
      z.drag = false; W.drags = [];
      await quiz('C: 0 + 1i and D: 2 + 0i lie on…', ['C on the imaginary axis, D on the real axis', 'both on the real axis', 'C on the real axis, D on the imaginary axis', 'neither axis'], 0, 'Purely imaginary numbers sit on the vertical axis.');
      await cont();
    },
    async function () {
      enterScene('argand', (W) => { argView(W, 5); });
      await J('idle', 'Modulus |z| = √(a² + b²) = distance from O. Conjugate z̄ = a − ib = mirror image in the real axis.');
      const z = zObj([3, 4], { col: C.sora }); W.zs.push(z); zDrag(W, z, { snap: 1 });
      W.overlay = () => { W.circ = { r: Cx.abs([z.re, z.im]), t: '|z| = ' + fmtN(Cx.abs([z.re, z.im]), 3) }; live('z = <b>' + esc(Cx.str([z.re, z.im])) + '</b><br>z̄ = ' + esc(Cx.str([z.re, -z.im])) + '<br>|z| = ' + fmtN(Cx.abs([z.re, z.im]), 3)); };
      await task('Drag z around and watch |z|', () => (z.moved || 0) > 6, (W) => (z.moved = 9));
      W.overlay = null; live(null); z.re = 3; z.im = 4; z.drag = false; W.drags = [];
      await quiz('|3 + 4i| = ?', ['7', '5', '25', '√7'], 1, '√(9 + 16) = 5.');
      await animConj(W, [3, 4]);
      await quiz('|2 − 5i| = ?', ['√29', '7', '√21', '3'], 0, '√(4 + 25).');
      await quiz('Conjugate of −3i − 5 = ?', ['3i − 5', '−3i + 5', '3i + 5', '−5 − 3i'], 0, 'Flip the sign of the imaginary part: −5 + 3i.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: '|z| = √(a² + b²)', eq: true }, 'z̄ = a − ib: reflection in the real axis.', 'Real axis: a + i0. Imaginary axis: 0 + ib.']);
    },
  ],
}));

/* ================= LESSON 3 · ADD, SUBTRACT, MULTIPLY ================= */
LESSONS.push(lesson({
  id: 'ops', title: 'Add, Subtract, Multiply', blurb: 'Tip-to-tail addition, multiplication as rotate + stretch, Examples 2–4.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('argand', (W) => argView(W, 9));
      await slam('ALGEBRA OF z', 'Lesson ' + L.num + ' · Section 4.3');
      await J('idle', 'Add real parts, add imaginary parts. On the plane: put the second arrow on the tip of the first.');
      const r = await kahoot('(2 + 3i) + (−6 + 5i) = ?', ['−4 + 8i', '8 + 8i', '−4 − 2i', '−12 + 15i'], 0, 15);
      await animAdd(W, [2, 3], [-6, 5]);
      await verdict(r, '(2 − 6) + (3 + 5)i = −4 + 8i.', 'Add part by part: −4 + 8i.');
      await quiz('Additive inverse of z = a + ib', ['−a − ib', 'a − ib', '1/z', 'b + ia'], 0, 'z + (−z) = 0.');
      await cont();
    },
    async function () {
      enterScene('argand', (W) => argView(W, 6));
      await J('think', 'Subtraction is adding the negative: (6 + 3i) − (2 − i) = (6 + 3i) + (−2 + i).');
      await abQ('(6 + 3i) − (2 − i) = ?', [4, 4], '6 − 2 = 4 and 3 − (−1) = 4.');
      await animAdd(W, [6, 3], [-2, 1]);
      await quiz('(2 − i) − (6 + 3i) = ?', ['−4 − 4i', '4 + 4i', '−4 + 4i', '8 + 2i'], 0, 'The negative of the previous answer.');
      await cont();
    },
    async function () {
      enterScene('argand', (W) => argView(W, 4));
      await J('idle', 'Multiplying by i turns an arrow 90° anticlockwise. Watch 2 + i.');
      const b = button('Multiply by i'); await waitFor(() => b.clicked()); b.stop(); await animMul(W, [2, 1], I); FX.burst('90°!', { x: 70, y: 25 });
      await quiz('i(2 + i) = ?', ['−1 + 2i', '2i + 1', '1 + 2i', '−2 + i'], 0, '2i + i² = −1 + 2i.');
      await J('happy', 'General rule: (a + ib)(c + id) = (ac − bd) + i(ad + bc). On the plane: angles add, lengths multiply.');
      enterScene('argand', (W) => argView(W, 30));
      const r = await kahoot('(3 + 5i)(2 + 6i) = ?', ['6 + 30i', '−24 + 28i', '36 + 28i', '−24 + 18i'], 1, 20);
      await animMul(W, [3, 5], [2, 6]);
      await verdict(r, '(6 − 30) + i(18 + 10).', '(3·2 − 5·6) + i(3·6 + 5·2) = −24 + 28i.');
      await cont();
    },
    async function () {
      enterScene('argand', (W) => argView(W, 2));
      exTag('Example 2', 'a + ib form');
      await abQ('(i) (−5i)(i/8) = ?', [5 / 8, 0], '−5i²/8 = 5/8.');
      await quiz('(ii) (−i)(2i)(−i/8)³ = ?', ['i/256', '−i/256', '1/256', '2i/512'], 0, '(−i)(2i) = 2 and (−i/8)³ = i/512. 2 × i/512 = i/256.');
      exTag('Example 3', '(5 − 3i)³');
      await abQ('(5 − 3i)³ = 125 − 225i + 135i² − 27i³ = ?', [-10, -198], '125 − 225i − 135 + 27i = −10 − 198i.');
      exTag('Example 4', '(−√3 + √−2)(2√3 − i)');
      await quiz('√−2 = ?', ['√2 i', '−√2', '2i', '−√2 i'], 0, '√−a = √a i for a > 0.');
      await quiz('So the product = (−√3 + √2 i)(2√3 − i) = ?', ['(−6 + √2) + √3(1 + 2√2)i', '−6 + √2 i', '(6 + √2) + √3 i', '−6 − √2 + 3i'], 0, '−6 + √3i + 2√6 i − √2 i² = (−6 + √2) + (√3 + 2√6)i.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: '(a + ib)(c + id) = (ac − bd) + i(ad + bc)', eq: true }, 'Addition: tip to tail. Multiplication: angles add, lengths multiply.', 'Closure, commutative, associative laws hold; 0 and 1 are identities.']);
    },
  ],
}));

/* ================= LESSON 4 · POWERS OF i & SQUARE ROOTS ================= */
LESSONS.push(lesson({
  id: 'powers', title: 'Powers of i', blurb: 'i spins in a cycle of 4. √(−a) = √a i, and the √a·√b trap.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('argand', (W) => argView(W, 1.6));
      await slam('POWERS OF i', 'Lesson ' + L.num + ' · Section 4.3.5');
      await J('idle', 'Each power of i is one more quarter turn. Start at 1 and spin.');
      const b = button('Spin to i⁷'); await waitFor(() => b.clicked()); b.stop(); await ipowSpin(W, 7);
      await K('wow', 'It goes 1, i, −1, −i and repeats!');
      await discover('i^{4k} = 1, i^{4k+1} = i, i^{4k+2} = −1, i^{4k+3} = −i', 'Divide the power by 4 and look at the remainder.');
      await quiz('i^{19} = ?', ['i', '−1', '−i', '1'], 2, '19 = 4·4 + 3.');
      await ipowSpin(W, 19); hideFound();
      await quiz('i^{−1} = 1/i = ?', ['i', '−i', '−1', '1'], 1, 'Multiply top and bottom by i: i/i² = −i.');
      await ipowSpin(W, -1);
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '√−3'; W.sub = 'square roots'; });
      await J('think', '(√3 i)² = 3i² = −3 and (−√3 i)² = −3. So −3 has two square roots, but the SYMBOL √−3 means √3 i.');
      await quiz('√−25 = ?', ['5i', '−5i', '±5', '25i'], 0, '√25 · i.');
      await K('play', 'So √−1 × √−1 = √((−1)(−1)) = √1 = 1?');
      await quiz('Is Kimmy right?', ['Yes, it is 1', 'No: √a·√b = √(ab) fails when both a, b < 0', 'Yes, but only for i', 'It equals 0'], 1, '√−1 · √−1 = i · i = −1. The rule needs at least one of a, b ≥ 0.');
      FX.burst('TRAP!', { x: 50, y: 35 });
      await J('happy', 'Identities like (z₁ + z₂)² = z₁² + 2z₁z₂ + z₂² still work for all complex numbers.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'i⁴ = 1: powers repeat every 4', eq: true }, 'i^{−1} = −i, i^{−2} = −1, i^{−3} = i', '√−a = √a i (a > 0)', '√a·√b ≠ √(ab) when a, b are both negative.']);
    },
  ],
}));

/* ================= LESSON 5 · DIVISION, INVERSE, CONJUGATE ================= */
LESSONS.push(lesson({
  id: 'div', title: 'Divide & Conjugate', blurb: 'z·z̄ = |z|², 1/z = z̄/|z|², and Examples 5–8.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('argand', (W) => argView(W, 4));
      await slam('DIVISION', 'Lesson ' + L.num + ' · Section 4.4');
      await J('idle', 'The magic: z·z̄ = (a + ib)(a − ib) = a² + b² — a REAL number.');
      await animConj(W, [2, -3]);
      await quiz('(2 − 3i)(2 + 3i) = ?', ['13', '4 − 9i', '−5', '13i'], 0, '4 + 9 = 13.');
      exTag('Example 5', 'multiplicative inverse of 2 − 3i');
      await abQ('1/(2 − 3i) = z̄/|z|² = ?', [2 / 13, 3 / 13], '(2 + 3i)/13.');
      await cont();
    },
    async function () {
      enterScene('argand', (W) => argView(W, 4));
      exTag('Example 6', '(5 + √2 i)/(1 − √2 i)');
      await J('think', 'Multiply top and bottom by the conjugate of the bottom, 1 + √2 i.');
      await quiz('Denominator becomes…', ['1 + 2 = 3', '1 − 2 = −1', '1 + √2', '3i'], 0, '1 − (√2 i)² = 1 + 2 = 3.');
      await quiz('Result', ['1 + 2√2 i', '5 + √2 i', '3 + 6√2 i', '1 − 2√2 i'], 0, '(5 + 5√2 i + √2 i − 2)/3 = (3 + 6√2 i)/3.');
      await quiz('(ii) i^{−35} = ?', ['i', '−i', '1', '−1'], 0, '1/i^{35} = 1/(−i) = i.');
      await cont();
    },
    async function () {
      enterScene('argand', (W) => argView(W, 4));
      exTag('Example 7', 'conjugate of (3 − 2i)(2 + 3i) / [(1 + 2i)(2 − i)]');
      await abQ('Top: (3 − 2i)(2 + 3i) = ?', [12, 5], '6 + 9i − 4i + 6 = 12 + 5i.');
      await abQ('Bottom: (1 + 2i)(2 − i) = ?', [4, 3], '2 − i + 4i + 2 = 4 + 3i.');
      await abQ('(12 + 5i)/(4 + 3i) = ?', [63 / 25, -16 / 25], '(12 + 5i)(4 − 3i)/25 = (63 − 16i)/25.');
      await quiz('So the conjugate is…', ['63/25 + 16/25 i', '63/25 − 16/25 i', '−63/25 + 16/25 i', '16/25 + 63/25 i'], 0, 'Flip the imaginary sign.');
      await animConj(W, [63 / 25, -16 / 25]);
      await cont();
    },
    async function () {
      enterScene('argand', (W) => { argView(W, 1.6); W.circ = { r: 1, t: '|z| = 1' }; });
      exTag('Example 8', 'x + iy = (a + ib)/(a − ib) ⇒ x² + y² = 1');
      const r = await order('Order the proof', ['x + iy = (a + ib)²/(a² + b²) = [(a² − b²) + 2abi]/(a² + b²)', 'So x − iy = [(a² − b²) − 2abi]/(a² + b²)', 'x² + y² = (x + iy)(x − iy) = [(a² − b²)² + 4a²b²]/(a² + b²)²', '= (a² + b²)²/(a² + b²)² = 1']); await verdict(r, 'Multiply by the conjugate.', 'Rationalise, then use (x + iy)(x − iy).');
      await J('happy', 'A number divided by its own conjugate always lands on the unit circle.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'z·z̄ = |z|²,  z⁻¹ = z̄/|z|²', eq: true }, 'Divide: multiply top and bottom by the conjugate of the bottom.', '|z₁z₂| = |z₁||z₂|,  conj(z₁z₂) = z̄₁ z̄₂,  conj(z₁ ± z₂) = z̄₁ ± z̄₂']);
    },
  ],
}));

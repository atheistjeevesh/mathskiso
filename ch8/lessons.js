/* =========================================================
   CHAPTER 8 · SEQUENCES & SERIES — concept lessons (Examples 1–14)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));

LESSONS.push(lesson({
  id: 'seq', title: 'Sequences & Series', blurb: 'A sequence is a function of n. Slide n, watch the terms grow, then add them up. Examples 1–3.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('seq', (W) => { W.top = 'aₙ = 2n + 5'; });
      await slam('SEQUENCES', 'Lesson 1 · Sections 8.1–8.3');
      await J('idle', 'A sequence is a list in a definite order: a₁, a₂, a₃, … It is really a function whose inputs are 1, 2, 3, …');
      exTag('Example 1 (i)', 'aₙ = 2n + 5');
      let n = 1; const show = () => { seqSet(W, Array.from({ length: n }, (_, i) => 2 * (i + 1) + 5)); W.bars.forEach((b) => (b.k = 1)); W.sel = n - 1; };
      slider('n', 1, 8, 1, 1, (v) => 'n = ' + v + '  →  aₙ = ' + (2 * v + 5), (v) => { n = v; show(); }, 3);
      await task('Slide n up to 3 to see the first three terms', () => n >= 3);
      await fields('First three terms', [{ l: 'a₁', a: 7 }, { l: 'a₂', a: 9 }, { l: 'a₃', a: 11 }]).then((r) => verdict(r, '7, 9, 11.', '7, 9, 11.'));
      await cont();
    },
    async function () {
      enterScene('seq', (W) => { W.top = 'aₙ = (n − 3)/4'; seqSet(W, [-0.5, -0.25, 0]); });
      exTag('Example 1 (ii)');
      const r = await fields('First three terms', [{ l: 'a₁', a: -0.5, show: '−1/2' }, { l: 'a₂', a: -0.25, show: '−1/4' }, { l: 'a₃', a: 0 }]); await seqGrow(W); await verdict(r, 'Negative terms hang below the axis.', '−1/2, −1/4, 0.');
      exTag('Example 2', 'aₙ = (n − 1)(2 − n)(3 + n)');
      await numQ('a₂₀ = 19 × (−18) × 23 = ?', -7866, '−7866.');
      await cont();
    },
    async function () {
      enterScene('seq', (W) => { W.top = 'a₁ = 1,  aₙ = aₙ₋₁ + 2'; });
      exTag('Example 3', 'a recursive rule');
      await J('think', 'A recursive rule builds each term from the one before. Tap Next term to grow it.');
      await seqAdd(W, 1);
      const b = button('Next term ➜'); await waitFor(() => { while (W.bars.length - 1 < (AUTO ? 9 : b.hits) && W.bars.length < 5) seqAdd(W, W.bars[W.bars.length - 1].v + 2); return W.bars.length >= 5; }); b.stop();
      await K('wow', '1, 3, 5, 7, 9: the odd numbers!');
      await numQ('Series: 1 + 3 + 5 + 7 + 9 = ?', 25, '25. A series is the indicated sum of the terms.');
      await discover('Series', 'a₁ + a₂ + a₃ + … is the series of the sequence. Finite series → a number.');
      await cont(); hideFound();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary(['Sequence: a function on 1, 2, 3, …', 'Explicit rule aₙ = f(n) or a recursive rule.', { t: 'Series = a₁ + a₂ + a₃ + …', eq: true }]); },
  ],
}));

LESSONS.push(lesson({
  id: 'gp', title: 'Geometric Progressions', blurb: 'Same multiplier every step. Spot r, then jump straight to aₙ = arⁿ⁻¹. Examples 4–6.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('seq', (W) => { W.top = '2, 4, 8, 16, …'; seqSet(W, [2, 4, 8, 16, 32]); W.ratio = true; W.rtext = () => '×2'; });
      await slam('G.P.', 'Lesson ' + L.num + ' · Section 8.4');
      await seqGrow(W);
      await J('idle', 'Each term is the previous one times the same number r, the common ratio.');
      await quiz('Which is a G.P.?', ['1/9, −1/27, 1/81, …', '1, 3, 5, 7, …', '1, 4, 9, 16, …', '2, 3, 5, 8, …'], 0, 'Ratio −1/3 every time.');
      await numQ('Common ratio of .01, .0001, .000001, … = ?', 0.01, '0.01.');
      await discover('aₙ = a rⁿ⁻¹', 'a = first term, r = common ratio (aₖ₊₁/aₖ).');
      await cont(); hideFound();
    },
    async function () {
      enterScene('seq', (W) => { W.top = '5, 25, 125, …'; W.ratio = true; W.rtext = () => '×5'; });
      exTag('Example 4');
      let n = 1; slider('n', 1, 6, 1, 1, (v) => 'a' + subN(v) + ' = 5' + supN(v) + ' = ' + (5 ** v).toLocaleString('en-IN'), (v) => { n = v; seqSet(W, Array.from({ length: v }, (_, i) => 5 ** (i + 1))); W.bars.forEach((b) => (b.k = 1)); }, 6);
      await task('Drag n to 6. Feel how fast a G.P. explodes', () => n >= 6);
      await quiz('a₁₀ = 5 · 5⁹ = ?', ['5¹⁰', '5⁹', '50', '10⁵'], 0, 'And aₙ = 5ⁿ.');
      await cont();
    },
    async function () {
      enterScene('seq', (W) => { W.top = '2, 8, 32, … = 131072?'; seqSet(W, [2, 8, 32, 128, 512, 2048, 8192, 32768, 131072]); W.ratio = true; W.rtext = () => '×4'; });
      exTag('Example 5');
      await numQ('2 · 4ⁿ⁻¹ = 131072 ⇒ 4ⁿ⁻¹ = 65536 = 4⁸ ⇒ n = ?', 9, 'The 9th term.'); await seqGrow(W, 0.1); W.bars[8].hl = true;
      exTag('Example 6', 'a₃ = 24, a₆ = 192');
      const r = await fields('Divide a₆ by a₃: r³ = 8', [{ l: 'r', a: 2 }, { l: 'a', a: 6 }, { l: 'a₁₀', a: 3072 }]); await verdict(r, 'r = 2, a = 6, a₁₀ = 6 · 2⁹ = 3072.', 'r = 2, a = 6, a₁₀ = 3072.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'aₙ = a rⁿ⁻¹', eq: true }, 'Divide two given terms to kill a and find r.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'sum', title: 'Sum of a G.P.', blurb: 'Slide rSₙ under Sₙ, everything cancels but two blocks. Examples 7–11.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('shift', (W) => { W.top = ['a', 'ar', 'ar²', 'ar³', 'ar⁴']; W.bot = ['ar', 'ar²', 'ar³', 'ar⁴', 'ar⁵']; });
      await slam('Sₙ', 'Lesson ' + L.num + ' · Section 8.4.2');
      await J('idle', 'Multiply Sₙ by r: every block moves one step along. Slide it under and subtract.');
      const b = button('Slide & subtract'); await waitFor(() => b.clicked()); b.stop(); await shiftRun(W);
      await K('wow', 'Only a and arⁿ survive!');
      await discover('Sₙ = a(rⁿ − 1)/(r − 1)', '= a(1 − rⁿ)/(1 − r) for r ≠ 1. If r = 1, Sₙ = na.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('seq', (W) => { W.top = '1 + 2/3 + 4/9 + …'; seqSet(W, [1, 2 / 3, 4 / 9, 8 / 27, 16 / 81]); W.ratio = true; W.rtext = () => '×⅔'; });
      exTag('Example 7');
      await seqGrow(W);
      await numQ('S₅ = 3(1 − (2/3)⁵) = ?', 211 / 81, '211/81.', { show: '211/81' });
      exTag('Example 8', '3, 3/2, 3/4, … sum 3069/512');
      await numQ('6(1 − 1/2ⁿ) = 3069/512 ⇒ 2ⁿ = 1024 ⇒ n = ?', 10, 'n = 10.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'a/r, a, ar'; W.sub = 'Example 9'; });
      exTag('Example 9', 'sum 13/12, product −1');
      await J('think', 'Take the terms as a/r, a, ar: the product is a³.');
      await numQ('a³ = −1 ⇒ a = ?', -1, 'a = −1.');
      await quiz('−1/r − 1 − r = 13/12 gives 12r² + 25r + 12 = 0, so r = ?', ['−3/4 or −4/3', '3/4 or 4/3', '−3/4 only', '1 or −1'], 0, 'Terms: 4/3, −1, 3/4 (or reversed).');
      exTag('Example 10', '7 + 77 + 777 + … n terms');
      const r = await order('Build the sum', ['7/9 × (9 + 99 + 999 + …)', '7/9 × [(10 − 1) + (10² − 1) + (10³ − 1) + …]', '7/9 × [10(10ⁿ − 1)/9 − n]']); await verdict(r, 'Turn 7s into 9s, then 9s into (10ᵏ − 1).', 'Multiply and divide by 9 first.');
      await cont();
    },
    async function () {
      enterScene('dots', (W) => { W.a = 2; W.m = 2; W.rows = 5; W.unit = 'ancestors'; });
      exTag('Example 11', 'ancestors over 10 generations');
      await J('idle', '2 parents, 4 grandparents, 8 great-grandparents… Tap to add a generation.');
      const b = button('Add generation'); await waitFor(() => { const want = Math.min(AUTO ? 5 : b.hits, 5); if (W.gens < want) dotsGen(W, want); return W.gens >= 5; }); b.stop();
      await numQ('Ten generations: S₁₀ = 2(2¹⁰ − 1) = ?', 2046, '2046 ancestors.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Sₙ = a(rⁿ − 1)/(r − 1)', eq: true }, 'Three terms in G.P.: use a/r, a, ar.', '77…7 type: write it as 7/9 × (10ᵏ − 1).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'gm', title: 'G.M. and A.M. ≥ G.M.', blurb: 'Drag a point on a semicircle: the radius is the A.M., the half-chord is the G.M. Examples 12–14.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('seq', (W) => { W.top = '1, G₁, G₂, G₃, 256'; seqSet(W, [1, 4, 16, 64, 256]); W.ratio = true; W.rtext = () => '×4'; });
      await slam('MEANS', 'Lesson ' + L.num + ' · Sections 8.4.3 & 8.5');
      await J('idle', 'The G.M. of positive a and b is √(ab): then a, G, b is a G.P.');
      exTag('Example 12', 'insert 3 numbers between 1 and 256');
      await numQ('256 = r⁴ ⇒ r = ? (positive)', 4, 'r = 4 (r = −4 also works: −4, 16, −64).');
      await seqGrow(W);
      await cont();
    },
    async function () {
      enterScene('amgm');
      await J('think', 'Split the diameter into a and b. The radius is (a + b)/2 = A. The half-chord at the split point is √(ab) = G. Drag the gold point!');
      const t0 = W.t; await task('Drag P along the diameter', () => Math.abs(W.t - t0) > 0.15, (W) => gsap.to(W, { t: 0.7, duration: 0.6 }));
      await quiz('Can the half-chord ever be longer than the radius?', ['Never: G ≤ A', 'Yes, near the ends', 'Only if a = b', 'Sometimes'], 0, 'A chord’s half is at most the radius.');
      await task('Make G equal to A', () => Math.abs(W.t - 0.5) < 0.02, (W) => gsap.to(W, { t: 0.5, duration: 0.6 }));
      W.lock = true; await K('wow', 'Only when a = b!');
      await discover('A ≥ G', 'A − G = (√a − √b)²/2 ≥ 0, equality iff a = b.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('amgm', (W) => { W.L = 7.2; W.t = 0.5; W.scale = 20 / 7.2; W.lock = true; });
      exTag('Example 13', 'A.M. = 10, G.M. = 8');
      const r = await fields('a + b = 20, ab = 64, (a − b)² = 400 − 256', [{ l: 'a − b', a: 12, hint: '√144' }, { l: 'smaller', a: 4 }, { l: 'larger', a: 16 }]); gsap.to(W, { t: 0.2, duration: 1, ease: 'power2.inOut' }); SFX.whoosh(); await verdict(r, 'The numbers are 4 and 16. On the stage: a = 4, b = 16 (scaled).', '4 and 16.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Σ(…)² ≤ 0'; W.sub = 'Example 14'; });
      exTag('Example 14', '(a²+b²+c²)p² − 2(ab+bc+cd)p + (b²+c²+d²) ≤ 0');
      const r = await order('Order the proof', ['Regroup LHS as (ap − b)² + (bp − c)² + (cp − d)²', 'A sum of squares is ≥ 0, but it is given ≤ 0', 'So each square is 0: ap = b, bp = c, cp = d', 'b/a = c/b = d/c = p ⇒ a, b, c, d in G.P.']); await verdict(r, 'Squeeze between ≥ 0 and ≤ 0.', 'Regroup into squares first.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'G = √(ab),  A = (a + b)/2,  A ≥ G', eq: true }, 'Insert n means: b = arⁿ⁺¹.', 'a + b and ab known ⇒ use (a − b)² = (a + b)² − 4ab.']); },
  ],
}));

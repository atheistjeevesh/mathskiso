/* =========================================================
   CHAPTER 7 · BINOMIAL THEOREM — concept lessons (Examples 1–4)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));

LESSONS.push(lesson({
  id: 'pascal', title: 'Pascal’s Triangle', blurb: 'Spot the pattern in (a + b)ⁿ, then build the triangle yourself, cell by cell.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('terms', (W) => { W.head = '(a + b)⁴'; });
      await slam('PASCAL’S TRIANGLE', 'Lesson 1 · Section 7.2');
      await J('idle', '(a + b)² = a² + 2ab + b², (a + b)³ = a³ + 3a²b + 3ab² + b³. Watch (a + b)⁴ assemble.');
      await dealTerms(W, [['a⁴', '1'], ['a³b', '4'], ['a²b²', '6'], ['ab³', '4'], ['b⁴', '1']]);
      await quiz('How many terms does (a + b)ⁿ have?', ['n', 'n + 1', '2n', 'n − 1'], 1, 'One more than the index.');
      await quiz('In every term of (a + b)⁴, the powers of a and b add up to…', ['4', '5', '2', 'it varies'], 0, 'a³b: 3 + 1 = 4, and so on.');
      await cont();
    },
    async function () {
      enterScene('pascal', (W) => { W.N = 6; pascalShow(W, 3); });
      await J('idle', 'The coefficients stack into a triangle. Each inside number is the sum of the two just above it. Fill row 4.');
      pascalTapRow(W, 4);
      await task('Tap every cell of row n = 4', () => W.shown[4].filter(Boolean).length === 5, (W) => { for (let r = 0; r <= 4; r++) W.shown[4][r] = { fresh: true }; });
      pascalTapRow(W, 5);
      await task('Now row n = 5', () => W.shown[5].filter(Boolean).length === 6, (W) => { for (let r = 0; r <= 5; r++) W.shown[5][r] = { fresh: true }; });
      W.onTap = null; await K('wow', '1 5 10 10 5 1!');
      await discover('Pascal’s triangle (Meru Prastara)', 'Pingala described it more than 2000 years ago.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('terms', (W) => { W.head = '(2x + 3y)⁵'; });
      await J('think', 'Use row 5: 1 5 10 10 5 1, with a = 2x and b = 3y.');
      await quiz('Coefficient of x⁴y = 5 × (2)⁴ × 3 = ?', ['240', '80', '120', '480'], 0, '5 × 16 × 3 = 240.');
      await dealTerms(W, [['(2x)⁵', '32x⁵'], ['5(2x)⁴(3y)', '240x⁴y'], ['10(2x)³(3y)²', '720x³y²'], ['10(2x)²(3y)³', '1080x²y³'], ['5(2x)(3y)⁴', '810xy⁴'], ['(3y)⁵', '243y⁵']]);
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary(['(a + b)ⁿ has n + 1 terms.', 'Powers of a fall, powers of b rise; they always add to n.', { t: 'Each entry = sum of the two above', eq: true }]); },
  ],
}));

LESSONS.push(lesson({
  id: 'theorem', title: 'The Binomial Theorem', blurb: 'ⁿCᵣ as Pascal’s numbers, the general expansion, and special cases.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('pascal', (W) => { W.N = 5; pascalShow(W, 5); W.labC = true; });
      await slam('(a + b)ⁿ', 'Lesson ' + L.num + ' · Section 7.2.1');
      await J('idle', 'Every entry of Pascal’s triangle is ⁿCᵣ. Toggle to see.');
      const b = button('Show numbers'); await waitFor(() => b.clicked()); b.stop(); W.labC = false; SFX.flip();
      await discover('(a + b)ⁿ = Σ ⁿCₖ aⁿ⁻ᵏ bᵏ', 'ⁿC₀aⁿ + ⁿC₁aⁿ⁻¹b + … + ⁿCₙbⁿ, for every positive integer n.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('terms', (W) => { W.head = '(x + 2)⁶'; });
      await J('think', 'Coefficient of x⁶⁻ᵏ is ⁶Cₖ 2ᵏ.');
      const r = await fields('Fill the coefficients of x⁵, x⁴, x³', [{ l: 'x⁵', a: 12 }, { l: 'x⁴', a: 60 }, { l: 'x³', a: 160 }]); await verdict(r, '6·2, 15·4, 20·8.', '12, 60, 160.');
      await dealTerms(W, binomCards(1, 1, 2, 0, 6));
      W.total = '(x + 2)⁶ = x⁶ + 12x⁵ + 60x⁴ + 160x³ + 240x² + 192x + 64';
      await cont();
    },
    async function () {
      enterScene('terms', (W) => { W.head = '(x − 2y)⁵'; });
      await J('idle', 'With a minus sign, b = −y: the signs alternate.');
      await dealTerms(W, [['⁵C₀', 'x⁵'], ['⁵C₁', '−10x⁴y'], ['⁵C₂', '40x³y²'], ['⁵C₃', '−80x²y³'], ['⁵C₄', '80xy⁴'], ['⁵C₅', '−32y⁵']]);
      await quiz('Put x = 1 in (1 + x)ⁿ. Then ⁿC₀ + ⁿC₁ + … + ⁿCₙ = ?', ['n', '2ⁿ', 'n!', '0'], 1, '(1 + 1)ⁿ = 2ⁿ.');
      await quiz('And ⁿC₀ − ⁿC₁ + ⁿC₂ − … + (−1)ⁿⁿCₙ = ?', ['0', '1', '2ⁿ', '−1'], 0, '(1 − 1)ⁿ = 0.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'P(k) ⇒ P(k+1)'; W.sub = 'the proof'; });
      const r = await order('Order the induction proof', ['P(1): (a + b)¹ = ¹C₀a + ¹C₁b is true', 'Assume (a + b)ᵏ = Σ ᵏCᵣ aᵏ⁻ʳ bʳ', 'Multiply by (a + b) and group like terms', 'Use ᵏCᵣ + ᵏCᵣ₋₁ = ᵏ⁺¹Cᵣ to get P(k + 1)']); await verdict(r, 'Mathematical induction.', 'Base case, assumption, multiply, Pascal’s rule.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '(a + b)ⁿ = Σ ⁿCₖ aⁿ⁻ᵏ bᵏ', eq: true }, '(x − y)ⁿ: signs alternate.', 'Σ ⁿCₖ = 2ⁿ,  Σ (−1)ᵏ ⁿCₖ = 0']); },
  ],
}));

LESSONS.push(lesson({
  id: 'uses', title: 'Big Powers Made Easy', blurb: '(x² + 3/x)⁴, 98⁵, (1.01)¹⁰⁰⁰⁰⁰⁰ vs 10000, and 6ⁿ − 5n mod 25. Examples 1–4.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('terms', (W) => { W.head = '(x² + 3/x)⁴'; });
      await slam('USING THE THEOREM', 'Lesson ' + L.num + ' · Examples 1–4');
      exTag('Example 1');
      const p = Poly.pow(Poly.add(Poly.mono(1, 2), Poly.mono(3, -1)), 4);
      await quiz('Term with k = 1: ⁴C₁ (x²)³ (3/x) = ?', ['12x⁵', '4x⁵', '12x⁶', '3x⁵'], 0, '4 × 3 × x⁶/x = 12x⁵.');
      await dealTerms(W, binomCards(1, 2, 3, -1, 4)); W.total = Poly.str(p);
      await cont();
    },
    async function () {
      enterScene('terms', (W) => { W.head = '98⁵ = (100 − 2)⁵'; });
      exTag('Example 2');
      await dealTerms(W, [['⁵C₀ 100⁵', '10000000000'], ['⁵C₁ 100⁴·2', '−1000000000'], ['⁵C₂ 100³·4', '40000000'], ['⁵C₃ 100²·8', '−800000'], ['⁵C₄ 100·16', '8000'], ['⁵C₅ 32', '−32']]);
      await numQ('Add them: 98⁵ = ?', 9039207968, '9039207968.');
      exTag('Example 3');
      await quiz('(1.01)¹⁰⁰⁰⁰⁰⁰ = 1 + 1000000 × 0.01 + (positive terms). Compared with 10000 it is…', ['larger', 'smaller', 'equal', 'cannot tell'], 0, '1 + 10000 + more > 10000.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '6ⁿ − 5n'; W.sub = 'Example 4'; });
      exTag('Example 4', 'remainder when 6ⁿ − 5n is divided by 25');
      await J('think', 'Write 6 = 1 + 5 and expand: 6ⁿ = 1 + 5n + 5²ⁿC₂ + …');
      const r = await order('Order the proof', ['(1 + 5)ⁿ = 1 + 5n + 5²·ⁿC₂ + 5³·ⁿC₃ + … + 5ⁿ', '6ⁿ − 5n = 1 + 25(ⁿC₂ + 5·ⁿC₃ + … + 5ⁿ⁻²)', '= 25k + 1, so the remainder is 1']); await verdict(r, 'Every term after the second has 25 in it.', 'Expand (1 + 5)ⁿ.');
      await numQ('Check n = 3: 6³ − 15 = 201. 201 mod 25 = ?', 1, '201 = 8 × 25 + 1.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['Split a number near a power of 10: 98 = 100 − 2.', 'Keep the first two terms to compare sizes.', { t: '(1 + a)ⁿ = 1 + na + a²(…)', eq: true }]); },
  ],
}));

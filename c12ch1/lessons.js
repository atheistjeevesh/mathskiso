/* =========================================================
   CLASS 12 · CHAPTER 1 · RELATIONS AND FUNCTIONS — concept lessons (Examples 1–26)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const PROPS = ['Reflexive', 'Symmetric', 'Transitive'];
const A3 = [1, 2, 3];

LESSONS.push(lesson({
  id: 'relations', title: 'Types of Relations', blurb: 'Tap pairs on A × A and watch the reflexive, symmetric and transitive badges flip live. Examples 1–4.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('board', (W) => { W.tag = 'R ⊂ A × A'; W.sub = 'boys school'; });
      await slam('RELATIONS', 'Class 12 · Lesson 1 · Section 1.2');
      exTag('Example 1', 'A = students of a boys school');
      await quiz('R = {(a, b): a is sister of b} is…', ['the empty relation φ', 'the universal relation', 'reflexive', 'symmetric only'], 0, 'No boy is anyone’s sister.');
      await quiz('R′ = {(a, b): heights differ by less than 3 m} is…', ['the universal relation A × A', 'empty', 'not a relation', 'transitive only'], 0, 'Every pair qualifies.');
      await cont();
    },
    async function () {
      enterScene('grid', (W) => relLoad(W, A3, [[1, 2]], { tap: true }));
      await J('idle', 'Reflexive: every (a, a). Symmetric: (a, b) ⇒ (b, a). Transitive: (a, b), (b, c) ⇒ (a, c). Watch the badges on the right as you tap.');
      await task('Make R reflexive (fill the green diagonal)', () => relProps(A3, W.on).R, (W) => A3.forEach((a) => W.on.add(pk(a, a))));
      await task('Now make it symmetric too', () => { const p = relProps(A3, W.on); return p.R && p.S; }, (W) => W.on.add(pk(2, 1)));
      await task('Add (2, 3) and keep everything else: what breaks?', () => W.on.has(pk(2, 3)), (W) => W.on.add(pk(2, 3)));
      await K('think', 'Symmetric broke: no (3, 2). And (1, 2), (2, 3) needs (1, 3)…');
      await task('Repair it into an equivalence relation', () => { const p = relProps(A3, W.on); return p.R && p.S && p.T; }, (W) => { for (const a of A3) for (const b of A3) W.on.add(pk(a, b)); });
      await discover('Equivalence relation = reflexive + symmetric + transitive', 'The diagonal, mirror symmetry, and closed chains.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('grid', (W) => relLoad(W, A3, [[1, 1], [2, 2], [3, 3], [1, 2], [2, 3]]));
      exTag('Example 4', 'R = {(1, 1), (2, 2), (3, 3), (1, 2), (2, 3)}');
      await pickQ('Which properties does R have?', PROPS, ['Reflexive'], 'Not symmetric: (1, 2) but no (2, 1). Not transitive: (1, 2), (2, 3) but no (1, 3).', { brace: false });
      exTag('Example 2 · 3');
      await quiz('“T₁ is congruent to T₂” on triangles is…', ['an equivalence relation', 'symmetric only', 'reflexive only', 'not transitive'], 0, 'Congruence is reflexive, symmetric and transitive.');
      await quiz('“L₁ ⟂ L₂” on lines is…', ['symmetric, not reflexive, not transitive', 'an equivalence relation', 'reflexive only', 'transitive only'], 0, 'L₁ ⟂ L₂ ⟂ L₃ makes L₁ ∥ L₃.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary(['Empty relation φ, universal relation A × A', { t: 'Equivalence = reflexive + symmetric + transitive', eq: true }, 'One counter-example kills a property.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'equiv', title: 'Equivalence Classes', blurb: 'An equivalence relation sorts a set into disjoint classes. Watch integers fall into bins. Examples 5–6.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('classes');
      await slam('[a]', 'Lesson ' + L.num + ' · Section 1.2');
      exTag('Example 5', 'R = {(a, b): 2 divides a − b} on Z');
      await J('idle', 'a − a = 0 is even (reflexive); if a − b is even so is b − a (symmetric); (a − b) + (b − c) = a − c (transitive).');
      const b = button('Sort −4 … 5'); await waitFor(() => b.clicked()); b.stop();
      await sortClasses(W, [-4, -3, -2, -1, 0, 1, 2, 3, 4, 5], ['[0]: even', '[1]: odd'], (x) => ((x % 2) + 2) % 2);
      await discover('Equivalence classes partition the set', 'Every element is in exactly one class; classes are disjoint and cover everything.');
      await quiz('Under “3 divides a − b”, how many classes does Z split into?', ['3', '2', '1', 'infinitely many'], 0, '[0], [1], [2].');
      await sortClasses(W, [-3, -2, -1, 0, 1, 2, 3, 4, 5, 6], ['[0]', '[1]', '[2]'], (x) => ((x % 3) + 3) % 3);
      hideFound(); await cont();
    },
    async function () {
      enterScene('classes');
      exTag('Example 6', 'A = {1, …, 7}, both odd or both even');
      await pickQ('All elements related to 1', ['1', '2', '3', '4', '5', '6', '7'], ['1', '3', '5', '7'], '{1, 3, 5, 7}.');
      await sortClasses(W, [1, 2, 3, 4, 5, 6, 7], ['{1, 3, 5, 7}', '{2, 4, 6}'], (x) => (x % 2 ? 0 : 1));
      await K('happy', 'No odd number is related to an even one.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '[a] = {x : x R a}', eq: true }, 'Classes are disjoint and their union is the whole set.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'types', title: 'One-one and Onto', blurb: 'Slide a horizontal line: at most one hit means one-one, at least one hit for every y in the co-domain means onto. Examples 7–14.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('hlt', (W) => hltSetup(W, (x) => x * x, [-3, 3, -2, 5], 'R', 'R', { c: 2 }));
      await slam('INJECTIVE · SURJECTIVE', 'Lesson ' + L.num + ' · Section 1.3');
      await J('idle', 'f(x) = x² on R. Drag the red line y = c. Gold stars are the x with f(x) = c.');
      await task('Find a y with 2 pre-images, then a y with none', () => { W.seen2 = W.seen2 || hltSolve(W, W.c).length === 2; W.seen0 = W.seen0 || hltSolve(W, W.c).length === 0; return W.seen2 && W.seen0; }, (W) => { W.seen2 = W.seen0 = true; W.c = -1; });
      exTag('Example 11'); await quiz('So f(x) = x² : R → R is…', ['neither one-one nor onto', 'one-one only', 'onto only', 'bijective'], 0, 'f(−1) = f(1), and −2 has no pre-image.');
      await discover('One-one: f(x₁) = f(x₂) ⇒ x₁ = x₂ · Onto: every y has a pre-image', 'Bijective = both.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('hlt', (W) => hltSetup(W, (x) => 2 * x, [-1, 8, -1, 12], 'N', 'N', { c: 3, snap: 1 }));
      exTag('Example 8', 'f(x) = 2x on N');
      await J('think', 'Only the dots exist now. Try y = 3.');
      await quiz('f : N → N, f(x) = 2x is…', ['one-one but not onto', 'onto but not one-one', 'bijective', 'neither'], 0, 'Odd numbers are never hit.');
      exTag('Example 9', 'f(x) = 2x on R'); W.dom = 'R'; W.cod = 'R'; W.snap = 0.1; SFX.swish();
      await quiz('f : R → R, f(x) = 2x is…', ['bijective', 'one-one only', 'onto only', 'neither'], 0, 'Every y has exactly one pre-image y/2.');
      exTag('Example 7', 'roll numbers of 50 students → N'); await quiz('f is…', ['one-one, not onto', 'onto, not one-one', 'bijective', 'neither'], 0, 'No student has roll number 51.');
      await cont();
    },
    async function () {
      enterScene('hlt', (W) => hltSetup(W, (x) => (x <= 2 ? 1 : x - 1), [-0.5, 8, -1, 8], 'N', 'N', { c: 1, snap: 1 }));
      exTag('Example 10', 'f(1) = f(2) = 1, f(x) = x − 1 for x > 2');
      await quiz('This f : N → N is…', ['onto but not one-one', 'one-one but not onto', 'bijective', 'neither'], 0, 'y = 1 has two pre-images; every y is reached.');
      exTag('Example 12', 'x + 1 (odd x), x − 1 (even x)'); W.F = (x) => (x % 2 ? x + 1 : x - 1); SFX.swish();
      await quiz('This f : N → N is…', ['bijective', 'one-one only', 'onto only', 'neither'], 0, 'It swaps 1↔2, 3↔4, …');
      exTag('Example 13 · 14', 'f : {1, 2, 3} → {1, 2, 3}');
      await quiz('For a FINITE set X, a map f : X → X that is one-one is automatically…', ['onto', 'constant', 'not onto', 'the identity'], 0, 'Three different images fill all three places. (Not true for infinite sets: Example 8.)');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'One-one: each horizontal line hits at most once', eq: true }, 'Onto: every y in the co-domain is hit', 'Domain and co-domain matter (N vs R).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'compose', title: 'Composition & Inverses', blurb: 'Chain f then g; un-chain with the inverse. Examples 15–17.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('compose', (W) => { composeSet(W, [2, 3, 4, 5], [3, 4, 5, 9], [7, 11, 15], { 2: 3, 3: 4, 4: 5, 5: 5 }, { 3: 7, 4: 7, 5: 11, 9: 11 }); });
      await slam('g∘f', 'Lesson ' + L.num + ' · Section 1.4');
      await J('idle', 'gof(x) = g(f(x)): first f, then g. Follow each arrow chain.');
      exTag('Example 15');
      const r = await fields('gof', [{ l: 'gof(2)', a: 7 }, { l: 'gof(3)', a: 7 }, { l: 'gof(4)', a: 11 }, { l: 'gof(5)', a: 11 }]); gsap.to(W, { kc: 1, duration: 0.8 }); SFX.whoosh(); await verdict(r, '2 → 3 → 7, 3 → 4 → 7, 4 → 5 → 11, 5 → 5 → 11.', '7, 7, 11, 11.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'gof ≠ fog'; W.sub = 'Example 16'; });
      exTag('Example 16', 'f(x) = cos x, g(x) = 3x²');
      const r = await match('Match', ['gof(x)', 'fog(x)'], ['cos 3x²', '3 cos² x'], [1, 0]); await verdict(r, 'Order matters.', 'gof = 3cos²x, fog = cos 3x².');
      await fields('At x = 0', [{ l: 'gof(0)', a: 3 }, { l: 'fog(0)', a: 1 }]).then((r2) => verdict(r2, '3 ≠ 1, so gof ≠ fog.', '3 and 1.'));
      await cont();
    },
    async function () {
      enterScene('hlt', (W) => hltSetup(W, (x) => 4 * x + 3, [-1, 8, -1, 32], 'N', 'N', { c: 11, snap: 1, line: true }));
      await discover('f is invertible ⇔ f is one-one and onto', 'Then f⁻¹ undoes f: f⁻¹∘f = I, f∘f⁻¹ = I.');
      exTag('Example 17', 'f(x) = 4x + 3 : N → Y (Y = its range)');
      await quiz('f⁻¹(y) = ?', ['(y − 3)/4', '(y + 3)/4', '4y + 3', 'y/4 − 3'], 0, 'Solve y = 4x + 3 for x.');
      await numQ('f⁻¹(11) = ?', 2, '(11 − 3)/4 = 2, and f(2) = 11 ✓');
      hideFound(); await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'gof(x) = g(f(x))', eq: true }, 'Usually gof ≠ fog.', 'Invertible ⇔ bijective.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'mixed', title: 'Counting Relations & Functions', blurb: 'Intersections of equivalences, fractions as pairs, and counting relations by building them. Examples 18–26.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('board', (W) => { W.tag = 'R₁ ∩ R₂'; W.sub = 'Examples 18–21'; });
      await slam('MIXED', 'Lesson ' + L.num + ' · Examples 18–26');
      exTag('Example 18'); await tf('If R₁, R₂ are equivalence relations, R₁ ∩ R₂ is one too.', true).then((r) => verdict(r, 'Each property survives the intersection.', 'True.'));
      exTag('Example 19', '(x, y) R (u, v) ⇔ xv = yu'); await quiz('This says x/y = u/v. It is…', ['an equivalence relation', 'not reflexive', 'not symmetric', 'not transitive'], 0, 'Equal fractions: (1, 2) R (2, 4).');
      exTag('Example 20', 'X = {1, …, 9}, R₁: 3 | x − y'); await pickQ('Elements related to 1 under R₁', ['1', '2', '3', '4', '5', '6', '7', '8', '9'], ['1', '4', '7'], 'That is exactly the block {1, 4, 7} of R₂, so R₁ = R₂.');
      exTag('Example 21', 'a R b ⇔ f(a) = f(b)'); await tf('This is always an equivalence relation.', true).then((r) => verdict(r, '“Same output” is reflexive, symmetric and transitive.', 'True.'));
      await cont();
    },
    async function () {
      enterScene('grid', (W) => relLoad(W, A3, [[1, 1], [2, 2], [3, 3], [1, 2], [2, 3], [1, 3]], { tap: true }));
      exTag('Example 23', 'contains (1, 2), (2, 3); reflexive, transitive, not symmetric');
      await J('think', 'This is the smallest one. Try adding (2, 1). Then try (3, 2) instead. What about adding both?');
      await task('Add (2, 1) and check the badges', () => W.on.has(pk(2, 1)), (W) => W.on.add(pk(2, 1)));
      await quiz('How many such relations are there?', ['3', '1', '2', '4'], 0, 'R₁, R₁ ∪ {(2, 1)}, R₁ ∪ {(3, 2)}; adding more forces symmetry.');
      exTag('Example 24', 'equivalence relations containing (1, 2), (2, 1)'); await quiz('How many?', ['2', '1', '3', '5'], 0, '{1, 2}{3} and the universal relation.');
      exTag('Example 22'); await numQ('One-one functions {1, 2, 3} → {1, 2, 3} = 3! = ?', 6, 'Permutations of 3 symbols.');
      await cont();
    },
    async function () {
      enterScene('hlt', (W) => hltSetup(W, (x) => Math.sin(x) + Math.cos(x), [-0.3, 2, -0.5, 2], 'I', 'R', { I: [0, Math.PI / 2], c: 1, snap: 0.05 }));
      exTag('Example 26', 'sin and cos are one-one on [0, π/2]; is sin + cos?');
      await task('Slide the line to y = 1', () => Math.abs(W.c - 1) < 0.01, (W) => (W.c = 1));
      await quiz('sin x + cos x on [0, π/2] is…', ['not one-one: 0 and π/2 both give 1', 'one-one', 'onto R', 'constant'], 0, 'Two stars on y = 1.');
      exTag('Example 25'); await quiz('I + I : N → N, x ↦ 2x is…', ['not onto (3 is missed)', 'onto', 'not one-one', 'bijective'], 0, 'A sum of onto maps need not be onto.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['Count relations by building the smallest one, then adding pairs.', { t: 'One-one maps of an n-set to itself: n!', eq: true }]); },
  ],
}));

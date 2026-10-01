/* =========================================================
   CHAPTER 1 · SETS — concept lessons (all textbook examples live here)
   ========================================================= */

/* ================= LESSON 1 · WHAT IS A SET? ================= */
LESSONS.push(lesson({
  id: 'what', title: 'What is a Set?', blurb: 'Well-defined collections, ∈ and ∉, roster form and the set-builder machine.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('board', (W) => { W.tag = 'SETS'; W.sub = 'Chapter 1'; });
      await slam('WHAT IS A SET?', 'Lesson 1 · Sections 1.1–1.2');
      await J('idle', 'Kimmy, a cricket team, a pack of cards, the vowels. All collections. Maths calls some of them SETS.');
      await K('think', 'Some of them? Which ones count?');
      await J('think', 'Only the ones where anybody can decide, for sure, what is in and what is out. Let us test that.');
      await cont('Test it');
    },
    async function () {
      enterScene('judges', (W) => { W.title = 'The vowels of the English alphabet'; });
      await J('idle', 'We both write down “the vowels of the English alphabet” separately. No peeking.');
      const r = await kahoot('Will our two lists match?', ['Yes, exactly', 'No, they will differ', 'Only partly', 'Cannot say'], 0, 12);
      await judgeRun(W, ['a', 'e', 'i', 'o', 'u'], ['a', 'e', 'i', 'o', 'u'], true);
      await verdict(r, 'Same five letters. Anyone would write the same list.', 'They matched exactly: a, e, i, o, u.');
      await cont();
    },
    async function () {
      enterScene('judges', (W) => { W.title = 'The five most renowned mathematicians'; });
      await K('play', 'My turn to pick a hard one: “the five most renowned mathematicians”.');
      const r = await kahoot('Will these two lists match?', ['Yes, exactly', 'No, they will differ', 'Only if we use Google', 'Always'], 1, 12);
      await judgeRun(W, ['Ramanujan', 'Euler', 'Gauss', 'Aryabhata', 'Newton'], ['Gauss', 'Euler', 'Noether', 'Euclid', 'Ramanujan'], false);
      await verdict(r, '“Most renowned” is an opinion. Different people, different lists.', '“Most renowned” is an opinion, so the lists differ.');
      await discover('A set is a WELL-DEFINED collection', 'Anyone can decide for certain whether an object belongs.');
      await J('happy', 'Well-defined means one test, same answer for everybody. Then it is a set.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'V = vowels', items: ['a', 'e', 'i', 'o', 'u'] }]));
      await J('idle', 'Objects in a set are its elements. We write a ∈ V, read “a belongs to V”. And b ∉ V.');
      await quiz('b ___ V', ['∈', '∉'], 1, 'b is not a vowel, so b ∉ V.', null, 10);
      enterScene('bag', (W) => bagSet(W, [{ label: 'P = prime factors of 30', items: [2, 3, 5] }]));
      await quiz('15 ___ P', ['∈', '∉'], 1, '15 is a factor of 30 but not prime. 15 ∉ P.', null, 12);
      await quiz('3 ___ P', ['∈', '∉'], 0, '3 is prime and divides 30. 3 ∈ P.', null, 10);
      await cont();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'letters of SCHOOL', items: [] }]));
      await J('idle', 'Roster form: list every element inside braces { }, separated by commas. Watch me spell SCHOOL into a set.');
      for (const ch of 'SCHOOL') { await bagDrop(W.bags[0], ch); await wait(0.25); }
      await K('wow', 'The second O got kicked out!');
      await J('happy', 'In a set each element is listed once. Repeats add nothing. So the set is {S, C, H, O, L}.');
      const b = button('Shuffle the order'); await waitFor(() => b.clicked()); b.stop();
      const it = W.bags[0].items; for (let k = 0; k < 3; k++) { it.push(it.shift()); SFX.swish(); await wait(0.25); } it.reverse(); SFX.don();
      await K('think', 'Now it says {L, O, H, C, S}. Different set?');
      await quiz('Is {L, O, H, C, S} the same set as {S, C, H, O, L}?', ['Yes, order does not matter', 'No, order matters'], 0, 'Same elements, same set. Order is irrelevant.');
      await cont();
    },
    async function () {
      enterScene('filter', (W) => { W.rule = 'x is a natural number and 3 < x < 10'; });
      await J('idle', 'Set-builder form describes the common property: A = {x : x is a natural number and 3 < x < 10}. Read “:” as “such that”.');
      await K('play', 'And this machine?');
      await J('happy', 'It tests every candidate against the property. Predict first.');
      const r = await kahoot('How many numbers will pass the machine?', ['5', '6', '7', '8'], 1, 15);
      await runFilter(W, SET.range(1, 12).map((v) => ({ t: String(v), ok: v > 3 && v < 10 })));
      await verdict(r, '4, 5, 6, 7, 8, 9: six elements.', 'Only 4 to 9 passed. 3 and 10 fail “strictly between”.');
      await discover('Two ways to write a set', 'Roster: {4, 5, 6, 7, 8, 9}. Set-builder: {x : x ∈ N, 3 < x < 10}.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('filter', (W) => { W.rule = 'x² + x − 2 = 0'; });
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 1'), h('span', { class: 'ychip' }, 'roster form')));
      await J('think', 'Example 1. Write the solution set of x² + x − 2 = 0 in roster form.');
      await quiz('Factorise x² + x − 2', ['(x − 1)(x + 2)', '(x + 1)(x − 2)', '(x − 1)(x − 2)', '(x + 1)(x + 2)'], 0, '(x − 1)(x + 2) = x² + x − 2.');
      await runFilter(W, [-3, -2, -1, 0, 1, 2, 3].map((v) => ({ t: SET.lbl(v), ok: v * v + v - 2 === 0 })), { fast: 0.25 });
      await pickQ('So the solution set is…', ['−3', '−2', '−1', '0', '1', '2', '3'], ['−2', '1'], '{1, −2}: only these make it zero.');
      await cont();
    },
    async function () {
      enterScene('filter', (W) => { W.rule = 'x is a positive integer and x² < 40'; });
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 2'), h('span', { class: 'ychip' }, 'roster form')));
      await J('idle', 'Example 2. Write {x : x is a positive integer and x² < 40} in roster form. Pick first, then the machine checks you.');
      await pickQ('Tap every element', ['1', '2', '3', '4', '5', '6', '7', '8'], ['1', '2', '3', '4', '5', '6'], '6² = 36 < 40 but 7² = 49 > 40. So {1, 2, 3, 4, 5, 6}.');
      await runFilter(W, SET.range(1, 8).map((v) => ({ t: String(v), ok: v * v < 40 })), { fast: 0.22 });
      await cont();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'A', items: [1, 4, 9, 16, 25, '…'] }]));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Examples 3 & 4'), h('span', { class: 'ychip' }, 'set-builder form')));
      await J('think', 'Going the other way. Spot the pattern in {1, 4, 9, 16, 25, …}.');
      await quiz('Set-builder form of A', ['{x : x = n², n ∈ N}', '{x : x = 2n, n ∈ N}', '{x : x = n + 3, n ∈ N}', '{x : x is odd}'], 0, 'Squares of natural numbers: 1², 2², 3², …');
      enterScene('bag', (W) => bagSet(W, [{ label: 'Example 4', items: ['1/2', '2/3', '3/4', '4/5', '5/6', '6/7'] }]));
      await K('think', 'Fractions! The top is always one less than the bottom.');
      await quiz('Which describes {1/2, 2/3, 3/4, 4/5, 5/6, 6/7}?', ['{x : x = [[n|n+1]], n ∈ N, 1 ≤ n ≤ 6}', '{x : x = [[n+1|n]], n ∈ N, 1 ≤ n ≤ 6}', '{x : x = [[n|n+1]], n ∈ N}', '{x : x = [[1|n]], 2 ≤ n ≤ 7}'], 0, 'Numerator n from 1 to 6, denominator n + 1.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'MATCH!'; W.sub = 'Example 5'; });
      await J('idle', 'Example 5. Match each roster set with its set-builder twin.');
      const r = await match('Pair them up', ['{P, R, I, N, C, A, L}', '{0}', '{1, 2, 3, 6, 9, 18}', '{3, −3}'], ['x is a positive integer and a divisor of 18', 'x is an integer and x² − 9 = 0', 'x is an integer and x + 1 = 1', 'x is a letter of the word PRINCIPAL'], [3, 2, 0, 1]);
      await verdict(r, 'PRINCIPAL has repeats P and I, so 7 letters. x + 1 = 1 gives 0. Divisors of 18. x² = 9 gives ±3.', 'PRINCIPAL→(i), x+1=1→{0}, divisors of 18→(iii), x²−9=0→{3, −3}.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; });
      await summary(['A set is a well-defined collection of objects.', 'a ∈ A: a belongs to A.   b ∉ A: b does not.', { t: 'Roster {4, 5, 6} · Set-builder {x : property}', eq: true }, 'Order and repetition never change a set.']);
    },
  ],
}));

/* ================= LESSON 2 · EMPTY, FINITE, EQUAL ================= */
LESSONS.push(lesson({
  id: 'empty', title: 'Empty, Finite & Equal', blurb: 'φ, counting with n(S), infinite conveyors, and when two sets are equal.', face: 'kimmy-surprised',
  steps: [
    async function () {
      enterScene('filter', (W) => { W.rule = 'x is a natural number and 1 < x < 2'; });
      await slam('EMPTY · FINITE · EQUAL', 'Lesson ' + L.num + ' · Sections 1.3–1.5');
      await K('play', 'Run the machine! Natural numbers between 1 and 2.');
      const r = await kahoot('What comes out?', ['{1}', '{1.5}', 'Nothing at all', '{1, 2}'], 2, 12);
      await runFilter(W, SET.range(0, 4).map((v) => ({ t: String(v), ok: false })), { fast: 0.25 });
      await verdict(r, 'No natural number lies strictly between 1 and 2.', 'Nothing passed. 1.5 is not a natural number.');
      await discover('The empty set φ = { }', 'A set with no elements. Also called the null or void set.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'φ ?'; W.sub = 'empty or not'; });
      await J('think', 'Quick-fire. Empty or not?');
      await quiz('{x : x² − 2 = 0 and x is rational}', ['Empty', 'Not empty'], 0, '√2 is irrational, so no rational x works.');
      await quiz('{x : x is an even prime number greater than 2}', ['Empty', 'Not empty'], 0, '2 is the only even prime.');
      await quiz('{x : x² = 4, x is odd}', ['Empty', 'Not empty'], 0, 'x = ±2, both even.');
      await quiz('{x : x is a student of Class XI in your school}', ['Empty', 'Not empty'], 1, 'Your school has Class XI students. Not empty, and finite.');
      await cont();
    },
    async function () {
      enterScene('filter', (W) => { W.rule = 'x is a natural number and x is odd'; });
      await J('idle', 'n(S) counts the distinct elements of S. If that count is a definite number (or zero) the set is FINITE.');
      await K('think', 'And if the machine never stops?');
      runFilter(W, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((v) => ({ t: String(v), ok: v % 2 === 1 })), { fast: 0.2, more: true }).catch(() => { });
      await J('happy', 'Then the set is INFINITE. Odd numbers go on forever: {1, 3, 5, 7, …}.');
      await wait(2);
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex. 6'; W.sub = 'finite or infinite'; });
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 6'), h('span', { class: 'ychip' }, '5 parts')));
      const F = ['Finite', 'Infinite'];
      await quiz('{x : x ∈ N and (x − 1)(x − 2) = 0}', F, 0, 'It is {1, 2}.');
      await quiz('{x : x ∈ N and x² = 4}', F, 0, 'It is {2}. −2 is not natural.');
      await quiz('{x : x ∈ N and 2x − 1 = 0}', F, 0, 'x = 1/2 is not natural, so φ. φ is finite.');
      await quiz('{x : x ∈ N and x is prime}', F, 1, 'There are infinitely many primes.');
      await quiz('{x : x ∈ N and x is odd}', F, 1, 'Odd numbers never end.');
      await cont();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'A', items: [1, 2, 3, 4] }, { label: 'B', items: [3, 1, 4, 2] }]));
      await J('idle', 'Two sets are EQUAL if they have exactly the same elements. A = {1, 2, 3, 4}, B = {3, 1, 4, 2}.');
      const b = button('Sort B'); await waitFor(() => b.clicked()); b.stop();
      W.bags[1].items.sort((p, q) => +p.t - +q.t); SFX.don(); bagHL(W, 0, [1, 2, 3, 4]); bagHL(W, 1, [1, 2, 3, 4]);
      await K('happy', 'Twins! So A = B.');
      enterScene('bag', (W) => bagSet(W, [{ label: '{1, 2, 3}', items: [1, 2, 3] }, { label: '{2, 2, 1, 3, 3}', items: [] }]));
      await J('think', 'Now drop 2, 2, 1, 3, 3 into the second bag.');
      for (const v of [2, 2, 1, 3, 3]) { await bagDrop(W.bags[1], v); await wait(0.15); }
      await quiz('So {1, 2, 3} and {2, 2, 1, 3, 3} are…', ['Equal', 'Not equal'], 0, 'Repeats are ignored. Same elements.');
      await cont();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'A', items: [0] }, { label: 'B', items: [], empty: true }, { label: 'C', items: [5] }, { label: 'D', items: [-5, 5] }, { label: 'E', items: [5] }]));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 7'), h('span', { class: 'ychip' }, 'equal pairs')));
      await J('idle', 'A = {0}, B = {x : x > 15 and x < 5}, C = {x : x − 5 = 0}, D = {x : x² = 25}, E = positive integral root of x² − 2x − 15 = 0. I already filled the bags.');
      await K('think', 'E is the positive root… (x − 5)(x + 3) = 0, so 5.');
      await pickQ('Which pairs are equal?', ['A = B', 'B = C', 'C = D', 'C = E', 'D = E', 'A = E'], ['C = E'], 'C = {5} and E = {5}. D has −5 too. B is empty.', { brace: false });
      await cont();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'letters of ALLOY', items: [] }, { label: 'letters of LOYAL', items: [] }]));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 8')));
      for (const ch of 'ALLOY') { await bagDrop(W.bags[0], ch); await wait(0.08); }
      for (const ch of 'LOYAL') { await bagDrop(W.bags[1], ch); await wait(0.08); }
      await quiz('(i) X = letters of “ALLOY”, B = letters of “LOYAL”. Equal?', ['Equal', 'Not equal'], 0, 'Both are {A, L, O, Y}.');
      enterScene('bag', (W) => bagSet(W, [{ label: 'A = {n ∈ Z : n² ≤ 4}', items: [-2, -1, 0, 1, 2] }, { label: 'B = {x ∈ R : x² − 3x + 2 = 0}', items: [1, 2] }]));
      await quiz('(ii) Are A and B equal?', ['Equal', 'Not equal'], 1, '0 ∈ A but 0 ∉ B.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary(['φ = { } has no elements.', 'n(S) = number of distinct elements.', 'Finite: definite count (φ too). Infinite: never ends.', { t: 'A = B ⇔ exactly the same elements', eq: true }]);
    },
  ],
}));

/* ================= LESSON 3 · SUBSETS, INTERVALS, UNIVERSAL ================= */
LESSONS.push(lesson({
  id: 'subsets', title: 'Subsets & Intervals', blurb: '⊂ and ⊄, power sets, N ⊂ Z ⊂ Q ⊂ R, intervals on the number line, universal set.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'A', items: [1, 2, 3] }, { label: 'B', items: [1, 2, 3, 4] }]));
      await slam('SUBSETS', 'Lesson ' + L.num + ' · Sections 1.6–1.7');
      await J('idle', 'A ⊂ B (A is a subset of B) when EVERY element of A is also in B.');
      const b = button('Check each element of A'); await waitFor(() => b.clicked()); b.stop();
      for (const it of W.bags[0].items) { it.hl = 1; const tgt = W.bags[1].items.find((x) => x.t === it.t); tgt.hl = 1; SFX.snap(); await wait(0.35); }
      await K('happy', 'All three found in B. So A ⊂ B!');
      await J('happy', 'And A ≠ B, so A is a PROPER subset of B, and B is a superset of A.');
      await cont();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'A', items: [1, 3] }, { label: 'B', items: [1, 5, 9] }, { label: 'C', items: [1, 3, 5, 7, 9] }]));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 9')));
      const S2 = ['⊂', '⊄'];
      await quiz('φ ___ B', S2, 0, 'φ is a subset of every set.');
      await quiz('A ___ B', S2, 1, '3 ∈ A but 3 ∉ B.');
      await quiz('A ___ C', S2, 0, '1 and 3 are both in C.');
      await quiz('B ___ C', S2, 0, '1, 5, 9 are all in C.');
      enterScene('bag', (W) => bagSet(W, [{ label: 'A = vowels', items: ['a', 'e', 'i', 'o', 'u'] }, { label: 'B', items: ['a', 'b', 'c', 'd'] }]));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 10')));
      await quiz('Is A ⊂ B or B ⊂ A?', ['A ⊂ B', 'B ⊂ A', 'Neither', 'Both'], 2, 'e ∈ A but e ∉ B; b ∈ B but b ∉ A.');
      await cont();
    },
    async function () {
      enterScene('bag', (W) => bagSet(W, [{ label: 'A', items: [1] }, { label: 'B', items: ['{1}', 2] }, { label: 'C', items: ['{1}', 2, 3] }]));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 11')));
      await J('think', 'A ∈ B and B ⊂ C. Is A ⊂ C? Look: B contains the SET {1} as an element.');
      await quiz('A = {1}. Is A ⊂ C?', ['Yes', 'No'], 1, '1 ∈ A but 1 ∉ C. C contains {1}, not 1.');
      await K('wow', 'So a box holding 1 is different from 1 itself!');
      await cont();
    },
    async function () {
      enterScene('power');
      await J('idle', 'How many subsets does a set have? Deal them out.');
      await powerDeal(W, ['a']); await wait(0.6); await powerDeal(W, ['a', 'b']); await wait(0.6);
      const r = await kahoot('{1, 2, 3} has how many subsets?', ['3', '6', '8', '9'], 2, 15);
      await powerDeal(W, [1, 2, 3], 0.1);
      await verdict(r, 'φ, three singletons, three pairs, and the set itself: 8.', 'Count the cards: 8.');
      await quiz('Then {1, 2, 3, 4} has…', ['10', '12', '16', '24'], 2, 'Each element is either in or out: 2 × 2 × 2 × 2 = 16.');
      await discover('n(A) = m ⇒ 2^{m} subsets', 'Every set is a subset of itself, and φ is a subset of every set.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('nested', (W) => nestSetup(W, [['−5', 'Z'], ['5/7', 'Q'], ['√2', 'T'], ['3', 'N'], ['π', 'T'], ['−11/3', 'Q']]));
      await J('idle', 'Subsets of real numbers: N ⊂ Z ⊂ Q ⊂ R. T = irrationals = R − Q.');
      await task('Drag each number into its smallest home.', () => W.toks.every((t) => t.done), (W) => W.toks.forEach((t) => { const c = { N: [-2, -0.3], Z: [-2.5, 1.2], Q: [0.8, 1.6], T: [3.4, -0.6] }[t.cls]; t.x = c[0] + Math.random() * 0.3; t.y = c[1] + Math.random() * 0.3; t.done = true; }));
      await K('happy', '√2 and π live outside Q. And 3 sits deep inside N.');
      await quiz('Which is FALSE?', ['N ⊂ Z', 'Q ⊂ R', 'N ⊂ T', 'T ⊂ R'], 2, 'Natural numbers are rational, so N ⊄ T.');
      await cont();
    },
    async function () {
      enterScene('numline', (W) => { Object.assign(W.nl, { lo: -2, hi: 8 }); MINI.numline.fit(W); });
      await J('idle', 'Intervals are subsets of R. Take a = 1, b = 5.');
      const kinds = [{ a: 1, b: 5, lc: false, rc: false, t: '(1, 5) open' }, { a: 1, b: 5, lc: true, rc: true, t: '[1, 5] closed' }, { a: 1, b: 5, lc: true, rc: false, t: '[1, 5)' }, { a: 1, b: 5, lc: false, rc: true, t: '(1, 5]' }];
      for (const [i, k] of kinds.entries()) { W.segs.push(Object.assign({ p: 0, y: 0.55 + i * 0.5, col: i % 2 ? C.beni : C.sora }, k)); await tw(W.segs[i], { p: 1, duration: 0.6 }); SFX.pop(); await wait(0.3); }
      await J('think', 'Round bracket: end NOT included (hollow dot). Square bracket: end included (filled dot). Length is b − a = 4 for all of them.');
      await cont();
    },
    async function () {
      enterScene('numline');
      const p = ivPart('Write {x : x ∈ R, −5 < x ≤ 7} as an interval. Build it.', { a: -5, b: 7, lc: false, rc: true }, { lo: -8, hi: 10 });
      await p.pre(); const r = await ask(p); await p.act(W, r); await verdict(r, '(−5, 7]: −5 left out, 7 kept in.', 'It is (−5, 7].');
      await quiz('And [−3, 5) in set-builder form is…', ['{x : −3 ≤ x < 5}', '{x : −3 < x ≤ 5}', '{x : −3 < x < 5}', '{x : −3 ≤ x ≤ 5}'], 0, 'Square bracket at −3 means ≤.');
      await quiz('A = (−3, 5), B = [−7, 9]. Then…', ['A ⊂ B', 'B ⊂ A', 'A = B', 'neither'], 0, 'Everything between −3 and 5 is also between −7 and 9.');
      await cont();
    },
    async function () {
      enterScene('venn', (W) => { vennLoad(W, { A: [2, 4, 6, 8, 10] }, { U: SET.range(1, 10), lay: 'one' }); });
      await J('idle', 'The UNIVERSAL set U is the big basic set of the context. Here U = {1, 2, …, 10} and A = even numbers in it. Rectangle = U, circle = A.');
      await quiz('For the set of all integers, which can be a universal set?', ['N', 'R', '{0}', 'φ'], 1, 'U must contain every integer: Q or R both work.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary(['A ⊂ B: every element of A is in B. A = B ⇔ A ⊂ B and B ⊂ A.', { t: 'φ ⊂ A,  A ⊂ A,  2^{n} subsets', eq: true }, 'N ⊂ Z ⊂ Q ⊂ R,  T ⊂ R,  N ⊄ T.', '(a, b) open · [a, b] closed · length b − a.']);
    },
  ],
}));

/* ================= LESSON 4 · VENN DIAGRAMS & OPERATIONS ================= */
LESSONS.push(lesson({
  id: 'ops', title: 'Union, Intersection, Difference', blurb: 'Tap-to-shade Venn diagrams, with Examples 12–19 and the laws.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: [2, 4, 6, 8], B: [6, 8, 10, 12] }, {}));
      await slam('VENN POWER', 'Lesson ' + L.num + ' · Sections 1.8–1.9');
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 12'), h('span', { class: 'ychip' }, 'union')));
      await J('idle', 'A = {2, 4, 6, 8}, B = {6, 8, 10, 12}. 6 and 8 sit in the overlap because they are in both.');
      await pickQ('A ∪ B = everything in A or B (or both)', ['2', '4', '6', '8', '10', '12'], ['2', '4', '6', '8', '10', '12'], 'Common elements 6 and 8 are taken only once.');
      await vennShade(W, regionsWhere(W, (a, b) => a || b));
      await discover('A ∪ B = {x : x ∈ A or x ∈ B}', 'Shade both circles completely.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: ['a', 'e', 'i', 'o', 'u'], B: ['a', 'i', 'u'] }, { lay: 'subset' }));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 13')));
      await J('think', 'A = {a, e, i, o, u}, B = {a, i, u}. B sits inside A.');
      await quiz('A ∪ B = ?', ['A', 'B', '{a, i, u}', 'φ'], 0, 'If B ⊂ A then A ∪ B = A.');
      await vennShade(W, regionsWhere(W, (a, b) => a || b));
      enterScene('venn', (W) => vennLoad(W, { X: ['Ram', 'Geeta', 'Akbar'], Y: ['Geeta', 'David', 'Ashok'] }, {}));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Examples 14 & 16')));
      await J('idle', 'X = Class XI students in hockey, Y = in football.');
      await pickQ('X ∪ Y', ['Ram', 'Geeta', 'Akbar', 'David', 'Ashok'], ['Ram', 'Geeta', 'Akbar', 'David', 'Ashok'], 'Hockey or football or both.');
      await pickQ('X ∩ Y (in BOTH teams)', ['Ram', 'Geeta', 'Akbar', 'David', 'Ashok'], ['Geeta'], 'Only Geeta plays both.');
      await vennShade(W, regionsWhere(W, (a, b) => a && b));
      await cont();
    },
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: [2, 4, 6, 8], B: [6, 8, 10, 12] }, {}));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 15'), h('span', { class: 'ychip' }, 'intersection')));
      await J('idle', 'Intersection A ∩ B: elements in BOTH. Your turn to shade.');
      vennTapMode(W);
      const p = { k: 'task', q: 'Shade A ∩ B', check: (W) => W.userShade.size === 1 && W.userShade.has('11'), auto: (W) => { W.userShade.add('11'); W.shade['11'] = 0.75; }, reveal: (W) => vennShade(W, ['11']) };
      const r = await ask(p); W.onTap = null; await verdict(r, 'Just the lens in the middle: {6, 8}.', 'Only the overlap is A ∩ B = {6, 8}.');
      if (r.ok) await vennShade(W, ['11']);
      await cont();
    },
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: SET.range(1, 10), B: [2, 3, 5, 7] }, { lay: 'subset' }));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 17')));
      await quiz('A = {1, …, 10}, B = {2, 3, 5, 7}. A ∩ B = ?', ['A', 'B', 'φ', '{1}'], 1, 'B ⊂ A, so A ∩ B = B.');
      await vennShade(W, ['11']);
      enterScene('venn', (W) => vennLoad(W, { A: [2, 4, 6, 8], B: [1, 3, 5, 7] }, { lay: 'disjoint' }));
      await J('idle', 'A = {2, 4, 6, 8} and B = {1, 3, 5, 7} share nothing. A ∩ B = φ: they are DISJOINT.');
      await K('happy', 'Two circles that do not even touch!');
      await cont();
    },
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: [1, 2, 3, 4, 5, 6], B: [2, 4, 6, 8] }, {}));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 18'), h('span', { class: 'ychip' }, 'difference')));
      await J('idle', 'A − B: in A but NOT in B. A = {1, …, 6}, B = {2, 4, 6, 8}.');
      await pickQ('A − B', ['1', '2', '3', '4', '5', '6', '8'], ['1', '3', '5'], '2, 4, 6 are in B, so they leave.');
      await vennShade(W, ['10']);
      await pickQ('B − A', ['1', '2', '3', '4', '5', '6', '8'], ['8'], 'Only 8 is in B and not in A.');
      await vennShade(W, ['01']);
      await K('wow', 'A − B ≠ B − A. Order matters here!');
      await cont();
    },
    async function () {
      enterScene('venn', (W) => vennLoad(W, { V: ['a', 'e', 'i', 'o', 'u'], B: ['a', 'i', 'k', 'u'] }, {}));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 19')));
      await pickQ('V − B', ['a', 'e', 'i', 'k', 'o', 'u'], ['e', 'o'], 'e and o are vowels not in B.');
      await pickQ('B − V', ['a', 'e', 'i', 'k', 'o', 'u'], ['k'], 'k is in B, not a vowel.');
      await J('happy', 'A − B, A ∩ B and B − A are mutually disjoint: three separate pieces.');
      for (const r of ['10', '11', '01']) { W.shadeCol = r === '11' ? C.peach : r === '10' ? C.sakura : C['sora-tint']; await vennShade(W, [r], { only: false, hlToks: false }); }
      await cont();
    },
    async function () {
      enterScene('venn', (W) => { W.lay = 'three'; W.names = ['A', 'B', 'C']; W.toks = []; });
      await J('think', 'Laws! Distributive: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C). Watch both sides.');
      W.shadeCol = C['sora-tint']; await vennShade(W, regionsWhere(W, (a, b, c) => b || c)); W.title = 'B ∪ C'; await wait(0.8);
      W.shadeCol = C.sakura; await vennShade(W, regionsWhere(W, (a, b, c) => a && (b || c))); W.title = 'A ∩ (B ∪ C)'; await wait(0.8);
      W.shade = {}; W.title = 'A ∩ B  then  A ∩ C'; await vennShade(W, regionsWhere(W, (a, b) => a && b)); await vennShade(W, regionsWhere(W, (a, b, c) => a && c), { only: false });
      await K('happy', 'Same three pieces both times!');
      await quiz('A ∪ φ = ?', ['φ', 'A', 'U', 'A′'], 1, 'φ is the identity for ∪.');
      await quiz('U ∩ A = ?', ['U', 'A', 'φ', 'A′'], 1, 'Everything of A is already in U.');
      await quiz('A ∩ A = ?', ['A', 'φ', 'U', '2A'], 0, 'Idempotent law.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'A ∪ B: in A or B · A ∩ B: in both', eq: true }, 'A − B: in A, not in B. A ∩ B = φ ⇒ disjoint.', 'B ⊂ A ⇒ A ∪ B = A and A ∩ B = B.', 'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).']);
    },
  ],
}));

/* ================= LESSON 5 · COMPLEMENT & DE MORGAN ================= */
LESSONS.push(lesson({
  id: 'comp', title: 'Complement & De Morgan', blurb: 'A′ = U − A, double complement, and De Morgan’s laws shaded live.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: [11, 13, 17] }, { U: [2, 3, 7, 11, 13, 17], lay: 'one', names: ['A'] }));
      await slam('COMPLEMENT', 'Lesson ' + L.num + ' · Section 1.10');
      W.Ulab = 'U = primes';
      await J('idle', 'Let U = all prime numbers and A = primes that do NOT divide 42. (I drew a few.) Which primes of U are left outside A?');
      await pickQ('A′ (the complement of A)', ['2', '3', '5', '7', '11', '13'], ['2', '3', '7'], '2, 3 and 7 divide 42, so they are in U but not in A.');
      await vennShade(W, ['0']);
      await discover('A′ = {x : x ∈ U and x ∉ A} = U − A', 'Shade everything in the rectangle outside the circle.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: [1, 3, 5, 7, 9] }, { U: SET.range(1, 10), lay: 'one' }));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 20')));
      await pickQ('U = {1, …, 10}, A = {1, 3, 5, 7, 9}. A′ = ?', SET.range(1, 10).map(String), ['2', '4', '6', '8', '10'], 'The even numbers of U.');
      await vennShade(W, ['0']);
      await J('think', 'Now take the complement AGAIN.');
      const b = button('Flip to (A′)′'); await waitFor(() => b.clicked()); b.stop(); SFX.flip(); FX.lines(); await vennShade(W, ['1']);
      await K('wow', 'Back to A! So (A′)′ = A.');
      await quiz('Example 21: U = all Class XI students (co-ed), A = all girls. A′ = ?', ['All girls', 'All boys', 'φ', 'All students'], 1, 'Everyone in U who is not a girl.');
      await cont();
    },
    async function () {
      enterScene('venn', (W) => vennLoad(W, { A: [2, 3], B: [3, 4, 5] }, { U: SET.range(1, 6) }));
      sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, 'Example 22'), h('span', { class: 'ychip' }, 'De Morgan')));
      await J('idle', 'U = {1, …, 6}, A = {2, 3}, B = {3, 4, 5}. Four quick builds.');
      const P = SET.range(1, 6).map(String);
      await pickQ('A′', P, ['1', '4', '5', '6'], 'U minus {2, 3}.');
      await pickQ('B′', P, ['1', '2', '6'], 'U minus {3, 4, 5}.');
      await pickQ('A′ ∩ B′', P, ['1', '6'], 'Common to both complements.');
      await pickQ('(A ∪ B)′', P, ['1', '6'], 'A ∪ B = {2, 3, 4, 5}; what is left is {1, 6}.');
      await vennShade(W, ['00']);
      await K('wow', 'Both gave {1, 6}!');
      await cont();
    },
    async function () {
      enterScene('venn', (W) => { W.lay = 'two'; W.toks = []; });
      await J('think', 'Is that luck? Shade (A ∩ B)′ yourself and compare it with A′ ∪ B′.');
      const p = shadePart('Shade (A ∩ B)′', (a, b) => !(a && b)); await p.pre(); const r = await ask(p); await p.act(); await verdict(r, 'Everything except the middle lens.', 'It is everything except the lens.');
      W.shade = {}; W.shadeCol = C['sora-tint']; W.title = 'A′'; await vennShade(W, regionsWhere(W, (a) => !a), { hlToks: false }); W.title = 'A′ ∪ B′'; await vennShade(W, regionsWhere(W, (a, b) => !a || !b), { hlToks: false });
      await discover('De Morgan’s laws', '(A ∪ B)′ = A′ ∩ B′   and   (A ∩ B)′ = A′ ∪ B′');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'LAWS'; W.sub = 'of complements'; });
      propCards([['A ∪ A′ = U,  A ∩ A′ = φ', 'Complement laws', '1'], ['(A ∪ B)′ = A′ ∩ B′,  (A ∩ B)′ = A′ ∪ B′', 'De Morgan’s laws', '2'], ['(A′)′ = A', 'Double complementation', '3'], ['φ′ = U,  U′ = φ', 'Empty set and universal set', '4']]);
      await quiz('U′ = ?', ['U', 'φ', 'A', '{0}'], 1, 'Nothing in U is outside U.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'A′ = U − A', eq: true }, '(A′)′ = A,  A ∪ A′ = U,  A ∩ A′ = φ.', '(A ∪ B)′ = A′ ∩ B′', '(A ∩ B)′ = A′ ∪ B′']);
    },
  ],
}));

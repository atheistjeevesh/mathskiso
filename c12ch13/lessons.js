/* =========================================================
   CLASS 12 · CHAPTER 13 · PROBABILITY — lessons (Examples 1–24), exercises, boss
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const sameSet = (sel, want) => sel.size === want.length && want.every((i) => sel.has(i));
async function tapTask(W, test, text) { W.sel = new Set(); W.tapOn = true; await task(text, () => sameSet(W.sel, idxs(W.space, test)), (W) => { W.sel = new Set(idxs(W.space, test)); }); W.tapOn = false; W.sel = new Set(); }
const numSpace = (k) => ({ items: Array.from({ length: k }, (_, i) => ({ lab: String(i + 1), n: i + 1, w: 1 })), cols: 5, aspect: 0.8 });
const pq = (q, r, x) => numQ(q, qv(r), x || '', { show: qshow(r), tol: ptol(qv(r)) });

LESSONS.push(lesson({
  id: 'cond', title: 'Given That…', blurb: 'New information shrinks the sample space. Tap outcomes into events, then zoom into what you know. Section 13.2, Examples 1–7.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('out', (W) => { outSet(W, coinSpace(3), { E: (it) => heads(it) >= 2, F: (it) => it.lab[0] === 'T' }, { names: { E: 'E: at least two heads', F: 'F: first coin tail' } }); W.vis = { E: 0, F: 0, G: 0 }; });
      await slam('P(E | F)', 'Class 12 · Ch 13 · Section 13.2');
      await J('idle', 'Toss three fair coins: eight equally likely outcomes. E is “at least two heads”. F is “the first coin shows tail”. Before we know anything, P(E) = 1/2.');
      await tapTask(W, (it) => it.lab[0] === 'T', 'Tap every outcome in F (first coin tail)'); W.vis.F = 1; SFX.pop();
      await J('think', 'Now somebody tells us F happened. Outcomes outside F are impossible: the universe shrinks to these four.');
      await tapTask(W, (it) => heads(it) >= 2 && it.lab[0] === 'T', 'Tap the outcomes that are in both E and F'); W.vis.E = 1;
      W.given = 'F'; SFX.whoosh(); await wait(0.8);
      await pq('Inside the shrunken universe, P(E | F) = ?', F_(1, 4), 'Only THH has two heads: 1 of 4.');
      await discover('P(E | F) = P(E ∩ F) / P(F)', 'Conditional probability: the share of F taken by E ∩ F. It needs P(F) ≠ 0.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('venn', (W) => vennSet(W, F_(1, 2), F_(2, 5), F_(1, 5), { names: ['A', 'B'] }));
      exTag('13.2.1', 'properties of conditional probability');
      await J('idle', 'Here P(A) = 1/2, P(B) = 2/5 and P(A ∩ B) = 1/5. The bar below is the whole probability space. Watch it stretch when we are told B happened.');
      await vennGiven(W, 'B');
      await pq('Given B, how much of the (stretched) bar does A take? P(A | B) = ?', F_(1, 2), '(1/5)/(2/5).');
      await quiz('Property 1: P(S | F) = ?', ['1', '0', 'P(F)', 'P(S)'], 0, 'Given F, every possible outcome is in F: certain.');
      await quiz('Property 3: P(E′ | F) = ?', ['1 − P(E | F)', '1 − P(E)', 'P(E | F)', '0'], 0, 'Within the shrunken universe, E and E′ still split it.');
      await quiz('Property 2 (disjoint A, B): P((A ∪ B) | F) = ?', ['P(A|F) + P(B|F)', 'P(A|F)·P(B|F)', 'P(A|F) − P(B|F)', '1'], 0, 'Addition works inside the shrunken universe too.');
      await cont();
    },
    async function () {
      await qStep(vnQ('Example 1', '', 'If P(A) = 7/13, P(B) = 9/13 and P(A ∩ B) = 4/13, evaluate P(A|B)', F_(7, 13), F_(9, 13), F_(4, 13), [{ q: 'P(A | B) = ?', r: F_(4, 9), x: '(4/13)/(9/13).', given: 'B' }]))();
    },
    async function () {
      await qStep(condO('Example 2', '', 'A family has two children. What is the probability that both are boys given that at least one is a boy?', famSpace, [{ a: 'both boys', A: (it) => it.e === 'b' && it.y === 'b', b: 'at least one boy', B: (it) => it.e === 'b' || it.y === 'b' }]))();
    },
    async function () {
      await qStep(condO('Example 3', '', 'Ten cards numbered 1 to 10 are mixed. One is drawn. Given that the number is more than 3, what is the probability that it is even?', () => numSpace(10), [{ a: 'even', A: (it) => it.n % 2 === 0, b: '> 3', B: (it) => it.n > 3 }]))();
    },
    async function () {
      await qStep(vnQ('Example 4', '', 'Of 1000 students 430 are girls, and 10% of the girls study in Class XII. A student is chosen; given that she is a girl, what is the probability that she studies in Class XII?', F_(1, 4), F_(43, 100), F_(43, 1000), [{ q: 'P(F ∩ E) = 0.1 × 0.43 = ?', r: F_(43, 1000), x: '43 girls in Class XII out of 1000.' }, { q: 'P(E | F) = ?', r: F_(1, 10), x: '0.043/0.43.', given: 'B' }], { names: ['E (class XII)', 'F (girl)'], hide: ['aOnly', 'none'] }))();
    },
    async function () {
      await qStep(condO('Example 5', '', 'A die is thrown three times. A: 4 on the third throw. B: 6 on the first and 5 on the second. Find P(A|B)', dice3Space, [{ a: 'A', A: (it) => it.r === 3, b: 'B', B: (it) => it.a === 6 && it.b === 5 }]))();
    },
    async function () {
      await qStep(condO('Example 6', '', 'A die is thrown twice and the sum is 6. What is the conditional probability that 4 has appeared at least once?', diceSpace, [{ a: '4 at least once', A: (it) => it.a === 4 || it.b === 4, b: 'sum is 6', B: (it) => it.a + it.b === 6 }]))();
    },
    async function () {
      const sp = () => { const it = [{ lab: 'HH', w: 3, t2: '1/4', coin: 'HH', die: 0 }, { lab: 'HT', w: 3, t2: '1/4', coin: 'HT', die: 0 }]; for (let k = 1; k <= 6; k++) it.push({ lab: 'T' + k, w: 1, t2: '1/12', coin: 'T', die: k }); return { items: it, cols: 4, aspect: 0.6 }; };
      await qStep(condO('Example 7', '', 'Toss a coin. If it shows head, toss it again; if it shows tail, throw a die. Find the conditional probability that the die shows a number greater than 4 given that there is at least one tail', sp, [{ a: 'die > 4', A: (it) => it.die > 4, b: 'at least one tail', B: (it) => it.coin === 'HT' || it.coin === 'T' }], { prob: true }))();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'P(E|F) = P(E ∩ F)/P(F),  P(F) ≠ 0', eq: true }, 'The sample space shrinks to F. Equally likely outcomes: n(E ∩ F)/n(F).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'mult', title: 'Multiplication Rule', blurb: 'P(E ∩ F) = P(E)·P(F|E). Chains of draws shrink a bar step by step. Section 13.3, Examples 8–9.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('shrink', (W) => shrinkSet(W, [{ lab: '1st ball black', p: F_(2, 3) }, { lab: '2nd black | 1st black', p: F_(9, 14) }], { title: '10 black, 5 white; two drawn without replacement' }));
      await slam('P(E)·P(F|E)', 'Section 13.3');
      exTag('Example 8', 'urn with 10 black and 5 white balls');
      await J('idle', 'Draw two balls without replacement. The chance both are black is the chance the first is black, times the chance the second is black given that the first was. Each step shrinks what is left.');
      await pq('P(first black) = ?', F_(2, 3), '10 of 15.');
      await tw(W, { k: 1, duration: 0.7 });
      await pq('Now 9 black and 5 white remain. P(second black | first black) = ?', F_(9, 14));
      await tw(W, { k: 2, duration: 0.7 });
      await pq('P(both black) = ?', F_(3, 7), '10/15 × 9/14 = 3/7.');
      await discover('P(E ∩ F) = P(E)·P(F|E) = P(F)·P(E|F)', 'Extends to three or more events: P(E∩F∩G) = P(E)·P(F|E)·P(G|E∩F).');
      await cont(); hideFound();
    },
    async function () {
      await qStep(chainQ('Example 9', '', 'Three cards are drawn successively, without replacement, from 52. Probability that the first two are kings and the third is an ace', [{ lab: '1st card king', p: F_(1, 13), x: '4 kings of 52.' }, { lab: '2nd king | 1st king', p: F_(1, 17), x: '3 kings of 51.' }, { lab: '3rd ace | two kings gone', p: F_(2, 25), x: '4 aces of 50.' }], { title: 'K, K, A' }))();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 2'; }); await summary([{ t: 'P(E ∩ F ∩ G) = P(E)·P(F|E)·P(G|E∩F)', eq: true }, 'Without replacement the denominators shrink; with replacement they do not.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'indep', title: 'Independent Events', blurb: 'E and F are independent when knowing F tells you nothing about E: the two heights match. Section 13.4, Examples 10–14.', face: 'kimmy-excited',
  steps: [
    async function () {
      let h1 = 0.8; const E = F_(1, 3);
      enterScene('areas', (W) => { areaSet(W, [hy('E', E, D_(h1)), hy('E′', F_(2, 3), F_(1, 2))], 'F', { ph: 1 }); W.showJ = false; W.rd = () => [['P(F | E) = ' + h1 + '   P(F | E′) = 0.5', C.ink], [Math.abs(h1 - 0.5) < 1e-9 ? 'same height: F ignores E: independent!' : 'heights differ: F depends on E', Math.abs(h1 - 0.5) < 1e-9 ? C['matcha-deep'] : C.beni]]; });
      await slam('INDEPENDENT', 'Section 13.4');
      await J('idle', 'Two strips: E (width P(E)) and E′. The shaded height is the chance of F inside each. If F is equally likely whether or not E happened, the heights match.');
      const sl = slider('P(F | E)', 0, 1, 0.1, 0.8, (v) => 'P(F | E) = ' + v, (v) => { h1 = v; W.hy[0].like = D_(v); }, 0.5);
      await task('Slide P(F | E) until the two heights match', () => Math.abs(h1 - 0.5) < 1e-9, () => { h1 = 0.5; W.hy[0].like = D_(0.5); sl.value = 0.5; });
      await discover('Independent: P(F|E) = P(F), P(E ∩ F) = P(E)·P(F)', 'Not the same as mutually exclusive: events with nonzero probability that cannot occur together are dependent.');
      await quiz('Mutually exclusive events with P(E) > 0, P(F) > 0 are', ['never independent', 'always independent', 'independent if equally likely', 'independent only for coins'], 0, 'If E happens, F cannot: P(F|E) = 0 ≠ P(F).');
      await cont(); hideFound();
    },
    async function () { await qStep(indepO('Example 10', '', 'A die is thrown. E: the number is a multiple of 3. F: the number is even. Are E and F independent?', dieSpace, 'multiple of 3', (it) => it.n % 3 === 0, 'even', (it) => it.n % 2 === 0))(); },
    async function () { await qStep(indepO('Example 11', '', 'A die is thrown twice. A: odd on the first throw. B: odd on the second throw. Are A and B independent?', diceSpace, 'odd on first', (it) => it.a % 2 === 1, 'odd on second', (it) => it.b % 2 === 1))(); },
    async function () {
      const E = (it) => it.lab === 'HHH' || it.lab === 'TTT', Fv = (it) => heads(it) >= 2, G = (it) => heads(it) <= 2;
      await qStep(indepO('Example 12', '(E, F)', 'Three coins are tossed. E: three heads or three tails. F: at least two heads. Are E and F independent?', coinSpace.bind(null, 3), 'HHH or TTT', E, '≥ 2 heads', Fv))();
      await qStep(indepO('Example 12', '(E, G)', 'E: three heads or three tails. G: at most two heads. Are E and G independent?', coinSpace.bind(null, 3), 'HHH or TTT', E, '≤ 2 heads', G))();
      await qStep(indepO('Example 12', '(F, G)', 'F: at least two heads. G: at most two heads. Are F and G independent?', coinSpace.bind(null, 3), '≥ 2 heads', Fv, '≤ 2 heads', G))();
    },
    async function () {
      enterScene('venn', (W) => vennSet(W, F_(1, 3), F_(1, 2), F_(1, 6), { names: ['E', 'F'] }));
      exTag('Example 13', 'E, F independent ⇒ E, F′ independent');
      await J('idle', 'P(E) = 1/3, P(F) = 1/2, P(E ∩ F) = 1/6 = P(E)P(F). Now look at E and F′ (the part of E outside F).');
      await pq('P(E ∩ F′) = P(E) − P(E ∩ F) = ?', F_(1, 6), 'The left crescent.');
      await pq('P(E)·P(F′) = (1/3)(1/2) = ?', F_(1, 6), 'Equal, so E and F′ are independent too.');
      exTag('Example 14', 'at least one of A, B');
      await quiz('For independent A and B, P(at least one) =', ['1 − P(A′)P(B′)', 'P(A) + P(B)', 'P(A)P(B)', '1 − P(A)P(B)'], 0, 'Complement: neither happens, and A′, B′ are independent.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 3'; }); await summary([{ t: 'Independent ⇔ P(E ∩ F) = P(E)·P(F)', eq: true }, 'If E, F are independent, so are E, F′ and E′, F′. Mutually exclusive ≠ independent.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'bayes', title: 'Total Probability & Bayes', blurb: 'Hypotheses are strips, evidence is the shaded part. Total probability = all the shading; Bayes = one strip’s share. Section 13.5, Examples 15–21.', face: 'jess-thinking',
  steps: [
    async function () {
      let p = 0.01;
      const post = () => { const a = p * 0.9, b = (1 - p) * 0.01; return a / (a + b); };
      enterScene('areas', (W) => { areaSet(W, [hy('sick', D_(p), D_(0.9)), hy('healthy', D_(1 - p), D_(0.01))], 'positive', { ph: 1 }); W.showJ = false; W.rd = () => [['prevalence P(sick) = ' + fmtN(p, 3), C.ink], ['P(sick | positive) = ' + fmtN(post(), 3), C.beni]]; });
      await slam('BAYES', 'Section 13.5');
      await J('idle', 'A test detects 90% of sick people but also flags 1% of healthy ones. A person tests positive. How likely are they sick? Slide how common the disease is.');
      const sl = slider('P(sick)', 0.001, 0.5, 0.001, 0.01, (v) => 'P(sick) = ' + v, (v) => { p = v; W.hy[0].prior = D_(v); W.hy[1].prior = D_(1 - v); }, 0.001);
      await task('Make the disease rare: P(sick) = 0.001', () => Math.abs(p - 0.001) < 1e-9, () => { p = 0.001; sl.value = 0.001; W.hy[0].prior = D_(0.001); W.hy[1].prior = D_(0.999); });
      await K('surprised', 'Only about 8%! Almost all the shaded area belongs to the healthy strip.');
      await task('Now make the disease common: P(sick) = 0.5', () => Math.abs(p - 0.5) < 1e-9, () => { p = 0.5; sl.value = 0.5; W.hy[0].prior = D_(0.5); W.hy[1].prior = D_(0.5); });
      await discover('P(Eᵢ | A) = P(Eᵢ)P(A|Eᵢ) / Σ P(Eⱼ)P(A|Eⱼ)', 'A positive test means little when the disease is rare: the strip is thin. Prior × likelihood, then share of the total.');
      await cont(); hideFound();
    },
    async function () { await qStep(areaQ('Example 15', '', 'The probability of a strike is 0.65. The job is completed on time with probability 0.32 if there is a strike and 0.80 if there is none. Probability that the job is completed on time', [hy('strike', D_(0.65), D_(0.32)), hy('no strike', D_(0.35), D_(0.8))], 'on time', { kind: 'total' }))(); },
    async function () { await qStep(areaQ('Example 16', '', 'Bag I has 3 red and 4 black balls, Bag II has 5 red and 6 black. A ball is drawn from a random bag and is red. Probability it came from Bag II', [hy('Bag I', F_(1, 2), F_(3, 7)), hy('Bag II', F_(1, 2), F_(5, 11))], 'red', { target: 1 }))(); },
    async function () { await qStep(areaQ('Example 17', '', 'Three boxes of two coins: I both gold, II both silver, III one gold one silver. A random box, a coin is drawn and is gold. Probability that the other coin is also gold', [hy('box I (GG)', F_(1, 3), Q1), hy('box II (SS)', F_(1, 3), Q0), hy('box III (GS)', F_(1, 3), F_(1, 2))], 'gold coin', { target: 0 }))(); },
    async function () { await qStep(areaQ('Example 18', '', 'A HIV test detects 90% of those with HIV but also flags 1% of those without it. 0.1% of the population has HIV. A person tests positive. Probability that the person has HIV', [hy('HIV', D_(0.001), D_(0.9)), hy('no HIV', D_(0.999), D_(0.01))], 'positive', { target: 0 }))(); },
    async function () { await qStep(areaQ('Example 19', '', 'Machines A, B, C make 25%, 35%, 40% of bolts, with 5%, 4%, 2% defective. A bolt is found defective. Probability that machine B made it', [hy('A', F_(1, 4), D_(0.05)), hy('B', D_(0.35), D_(0.04)), hy('C', F_(2, 5), D_(0.02))], 'defective', { target: 1 }))(); },
    async function () { await qStep(areaQ('Example 20', '', 'A doctor comes by train, bus, scooter or other means with probabilities 3/10, 1/5, 1/10, 2/5. He is late with probability 1/4, 1/3, 1/12 by the first three and never by other means. He arrives late. Probability he came by train', [hy('train', F_(3, 10), F_(1, 4)), hy('bus', F_(1, 5), F_(1, 3)), hy('scooter', F_(1, 10), F_(1, 12)), hy('other', F_(2, 5), Q0)], 'late', { target: 0 }))(); },
    async function () { await qStep(areaQ('Example 21', '', 'A man speaks the truth 3 times out of 4. He throws a die and reports a six. Probability that it was actually a six', [hy('six', F_(1, 6), F_(3, 4)), hy('not six', F_(5, 6), F_(1, 4))], 'reports six', { target: 0 }))(); },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 4'; }); await summary([{ t: 'P(A) = Σ P(Eⱼ)P(A|Eⱼ),   P(Eᵢ|A) = P(Eᵢ)P(A|Eᵢ)/P(A)', eq: true }, 'Hypotheses are a partition: disjoint, exhaustive, nonzero.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'miscex', title: 'Mixed Examples', blurb: 'Four boxes, an alternating game, and a machine set-up. Examples 22–24.', face: 'kimmy-lookup',
  steps: [
    async function () {
      await qStep(areaQ('Example 22', '', 'Boxes I–IV hold (black, white, red, blue) balls: I (3, 4, 5, 6), II (2, 2, 2, 2), III (1, 2, 3, 1), IV (4, 3, 1, 5). A box is chosen at random and a black ball is drawn. Probability that it came from box III', [hy('I', F_(1, 4), F_(1, 6)), hy('II', F_(1, 4), F_(1, 4)), hy('III', F_(1, 4), F_(1, 7)), hy('IV', F_(1, 4), F_(4, 13))], 'black', { target: 2 }))();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'Ex 23'; W.sub = 'A and B throw a die alternately'; });
      exTag('Example 23', 'first to throw a six wins; A starts');
      await pq('P(A wins on the 1st throw) = ?', F_(1, 6), '1/6.');
      await pq('P(A wins on the 3rd throw) = (5/6)(5/6)(1/6) = ?', F_(25, 216), 'Two failures, then a six.');
      await quiz('Each later chance of A is the previous one times', ['(5/6)² = 25/36', '5/6', '1/6', '25/6'], 0, 'Two more failures (A\'s and B\'s) in between.');
      await pq('Infinite G.P. a/(1 − r): P(A wins) = (1/6)/(1 − 25/36) = ?', F_(6, 11), 'Sum of 1/6 + (25/36)(1/6) + … = 6/11.');
      await pq('P(B wins) = 1 − 6/11 = ?', F_(5, 11), 'Somebody wins eventually.');
      await cont();
    },
    async function () { await qStep(areaQ('Example 24', '', 'A correctly set machine produces 90% acceptable items, an incorrectly set one only 40%. 80% of set-ups are correct. After a set-up the machine produces 2 acceptable items. Probability that it was correctly set up', [hy('correct set-up', D_(0.8), F_(81, 100)), hy('incorrect set-up', D_(0.2), F_(4, 25))], '2 acceptable', { target: 0, steps: [step('P(2 acceptable | correct) = 0.9 × 0.9 = ?', F_(81, 100)), step('P(2 acceptable | incorrect) = 0.4 × 0.4 = ?', F_(4, 25))] }))(); },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 5'; }); await summary(['Total probability, then Bayes: prior × likelihood, share of the total.', { t: 'Alternating games: sum an infinite G.P.', eq: true }]); },
  ],
}));

const BOSS13 = [
  ['P(E|F) = ?', ['P(E ∩ F)/P(F)', 'P(E)P(F)', 'P(E ∩ F)/P(E)', 'P(E) + P(F)'], 0],
  ['E, F independent means', ['P(E ∩ F) = P(E)P(F)', 'E ∩ F = φ', 'P(E) = P(F)', 'E ⊂ F'], 0],
  ['P(A) = 0.3, P(B) = 0.5, independent. P(A ∩ B) =', ['0.15', '0.8', '0.2', '0.65'], 0],
  ['P(A ∩ B) = 0.2, P(B) = 0.5. P(A|B) =', ['0.4', '0.1', '2.5', '0.7'], 0],
  ['Two cards without replacement, both aces: probability', ['1/221', '1/169', '4/52', '1/13'], 0],
  ['Bayes: P(Eᵢ|A) is', ['P(Eᵢ)P(A|Eᵢ) / P(A)', 'P(A|Eᵢ)', 'P(Eᵢ)', 'P(A)P(Eᵢ)'], 0],
  ['Mutually exclusive events with nonzero probabilities are', ['never independent', 'always independent', 'complements', 'equal'], 0],
  ['P(S | F) = ?', ['1', '0', 'P(F)', '1/2'], 0],
  ['A, B independent. P(at least one) =', ['1 − P(A′)P(B′)', 'P(A) + P(B)', 'P(A)P(B)', '1 − P(A)P(B)'], 0],
  ['Total probability P(A) =', ['Σ P(Eⱼ)P(A|Eⱼ)', 'Σ P(Eⱼ)', 'Π P(A|Eⱼ)', 'P(A|E₁)'], 0],
];

{
  const byId = (id) => LESSONS.find((l) => l.id === id);
  const [co, mu, ind, ba, mx] = ['cond', 'mult', 'indep', 'bayes', 'miscex'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(co, exLesson({ id: 'ex131', title: 'Exercise 13.1', blurb: 'All 17: tap outcomes, shrink the universe, stretch the bar.', face: 'kimmy-playful', qs: EX131 }), mu, ind, exLesson({ id: 'ex132', title: 'Exercise 13.2', blurb: 'All 18: independence, chains of draws, Venn bars.', face: 'jess-happy', qs: EX132 }), ba, exLesson({ id: 'ex133', title: 'Exercise 13.3', blurb: 'All 14 Bayes questions as area models.', face: 'kimmy-curious', qs: EX133 }), mx, exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 19 Miscellaneous Exercise parts.', face: 'jess-excited', qs: EX13M }));
}
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 13'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Probabilities at full speed!'); await cont('Fight'); }, ...BOSS13.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 13'; }); await summary(['Chapter complete!', { t: 'P(E|F) = P(E∩F)/P(F) · Bayes', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

/* =========================================================
   CHAPTER 14 · PROBABILITY — concept lessons (Examples 1–12)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const COINS2 = ['HH', 'HT', 'TH', 'TT'], COINS3 = ['HHH', 'HHT', 'HTH', 'THH', 'HTT', 'THT', 'TTH', 'TTT'], DIE = ['1', '2', '3', '4', '5', '6'];
const ev = (name, col, has) => ({ name, col, has });

LESSONS.push(lesson({
  id: 'events', title: 'Events', blurb: 'An event is a subset of outcomes. Tap outcomes, combine events with or, and, not, and spot mutually exclusive ones. Examples 1–3.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('board', (W) => { W.tag = 'S = {HH, HT, TH, TT}'; W.sub = 'toss a coin twice'; });
      await slam('EVENTS', 'Lesson 1 · Section 14.1');
      await J('idle', 'Toss a coin twice. Any subset of the sample space is an event. Build the event “exactly one head”.');
      await pickQ('Exactly one head', COINS2, ['HT', 'TH'], 'E = {HT, TH}.');
      await pickQ('At least one tail', COINS2, ['HT', 'TH', 'TT'], 'B = {HT, TH, TT}.');
      await pickQ('More than two tails (impossible!)', COINS2, [], 'φ: the impossible event.');
      await discover('Event = subset of S', 'φ: impossible event · S: sure event · one outcome: simple · more: compound.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'A or B, A and B'; W.sub = 'algebra of events'; });
      exTag('Example 1', 'die: A prime = {2, 3, 5}, B odd = {1, 3, 5}');
      await pickQ('“A or B” = A ∪ B', DIE, ['1', '2', '3', '5'], 'A ∪ B.');
      await pickQ('“A and B” = A ∩ B', DIE, ['3', '5'], 'A ∩ B.');
      await pickQ('“A but not B” = A − B', DIE, ['2'], 'A − B = A ∩ B′.');
      await pickQ('“not A” = A′', DIE, ['1', '4', '6'], 'S − A.');
      await cont();
    },
    async function () {
      enterScene('dice36', (W) => { W.ev = [ev('C: sum < 4', C['sora-tint'], (a, b) => a + b < 4), ev('D: sum > 11', C.sakura, (a, b) => a + b > 11)]; });
      exTag('Example 2', 'two dice: A sum even, B sum a multiple of 3, C sum < 4, D sum > 11');
      await J('think', 'Mutually exclusive = no outcome in common (A ∩ B = φ). Look at C and D on the grid.');
      await quiz('Which pair is mutually exclusive?', ['C and D', 'A and B', 'A and C', 'B and D'], 0, 'C ∩ D = φ; every other pair shares an outcome, e.g. (6, 6) is in A, B and D.');
      W.ev.push(ev('B: multiple of 3', C['matcha-tint'], (a, b) => (a + b) % 3 === 0)); SFX.pop();
      await K('wow', '(6, 6) turns gold: B and D overlap!');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'A, B, C'; W.sub = 'Example 3'; });
      exTag('Example 3', 'three coins: A no head, B exactly one head, C at least two heads');
      await pickQ('Build C: at least two heads', COINS3, ['HHH', 'HHT', 'HTH', 'THH'], 'C has 4 outcomes.');
      await quiz('A ∪ B ∪ C = S and they are pairwise disjoint, so they are…', ['mutually exclusive and exhaustive', 'only exhaustive', 'only mutually exclusive', 'neither'], 0, 'Exactly one of them happens every time.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary(['A or B = A ∪ B, A and B = A ∩ B, not A = A′', { t: 'Mutually exclusive: A ∩ B = φ', eq: true }, 'Exhaustive: E₁ ∪ … ∪ Eₙ = S']); },
  ],
}));

LESSONS.push(lesson({
  id: 'axioms', title: 'Probability', blurb: 'Roll hundreds of times and watch the frequencies settle; then the axioms and P(E) = n(E)/n(S). Examples 4–6.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('roll', (W) => Object.assign(W, { kind: 'die', faces: [1, 2, 3, 4, 5, 6], counts: [0, 0, 0, 0, 0, 0], target: 1 / 6 }));
      await slam('P(E)', 'Lesson ' + L.num + ' · Section 14.2');
      await J('idle', 'Roll a die. Each bar is how often that face came up, as a fraction of all rolls.');
      const b1 = button('Roll 10'); const b2 = button('Roll 200', 'btn', b1.el.parentNode);
      await task('Roll at least 300 times', () => { if (b1.hits > (W.h1 || 0)) { W.h1 = b1.hits; doRolls(W, 10); } if (b2.hits > (W.h2 || 0)) { W.h2 = b2.hits; doRolls(W, 200, true); } return W.n >= 300; }, (W) => doRolls(W, 300, true));
      b1.stop(); b2.stop();
      await K('wow', 'Every bar creeps towards 1/6!');
      await discover('Axioms: P(E) ≥ 0, P(S) = 1, P(E ∪ F) = P(E) + P(F) if E ∩ F = φ', 'So each P(ωᵢ) is in [0, 1] and they add to 1.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'valid?'; W.sub = 'Example 4'; });
      exTag('Example 4', 'probabilities for ω₁, …, ω₆');
      const tfQ = async (q, a, x) => verdict(await tf(q, a), x, 'Answer: ' + (a ? 'True' : 'False') + '. ' + x);
      await tfQ('(a) 1/6 each: valid?', true, 'Each in [0, 1] and they sum to 1.'); await tfQ('(b) 1, 0, 0, 0, 0, 0: valid?', true, 'Sum 1, none negative.');
      await tfQ('(c) 1/8, 2/3, 1/3, 1/3, −1/4, −1/3: valid?', false, 'Negative probabilities.'); await tfQ('(d) 1/12, 1/12, 1/6, 1/6, 1/6, 3/2: valid?', false, '3/2 > 1.'); await tfQ('(e) 0.1, 0.2, …, 0.6: valid?', false, 'They sum to 2.1.');
      await J('idle', 'Equally likely outcomes: P(E) = n(E)/n(S).');
      await cont();
    },
    async function () {
      enterScene('deck', (W) => { W.hl = (s) => s === '♦'; W.capName = 'diamonds'; });
      exTag('Example 5', 'one card from 52');
      const r = await fields('Probabilities', [{ l: '(i) diamond', a: 1 / 4, show: '1/4' }, { l: '(ii) not an ace', a: 12 / 13, show: '12/13' }, { l: '(iii) black', a: 1 / 2, show: '1/2' }]); await verdict(r, 'P(not A) = 1 − P(A).', '1/4, 12/13, 1/2.');
      W.hl = (s, r) => r !== 'A'; W.capName = 'not an ace'; SFX.pop();
      await fields('More', [{ l: '(iv) not a diamond', a: 3 / 4, show: '3/4' }, { l: '(v) not black', a: 1 / 2, show: '1/2' }]).then((r2) => verdict(r2, '3/4 and 1/2.', '3/4, 1/2.'));
      await cont();
    },
    async function () {
      enterScene('roll', (W) => Object.assign(W, { kind: 'bag', faces: ['R', 'R', 'R', 'R', 'B', 'B', 'B', 'Y', 'Y'], counts: Array(9).fill(0) }));
      exTag('Example 6', 'bag: 4 red, 3 blue, 2 yellow');
      const r = await fields('Probabilities', [{ l: 'red', a: 4 / 9, show: '4/9' }, { l: 'yellow', a: 2 / 9, show: '2/9' }, { l: 'blue', a: 1 / 3, show: '1/3' }, { l: 'not blue', a: 2 / 3, show: '2/3' }, { l: 'red or blue', a: 7 / 9, show: '7/9' }]); await verdict(r, 'Red and blue are mutually exclusive, so add: 4/9 + 3/9 = 7/9.', '4/9, 2/9, 1/3, 2/3, 7/9.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'P(E) = n(E)/n(S)', eq: true }, '0 ≤ P(ωᵢ) ≤ 1, ΣP(ωᵢ) = 1', 'P(not A) = 1 − P(A)']); },
  ],
}));

LESSONS.push(lesson({
  id: 'addition', title: 'A or B', blurb: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B): the overlap would count twice. Examples 7–8.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('pvenn', (W) => Object.assign(W, { a: 3 / 8, b: 3 / 8, ab: 2 / 8 }));
      await slam('P(A ∪ B)', 'Lesson ' + L.num + ' · Section 14.2.3');
      await J('idle', 'Three coins. A = {HHT, HTH, THH}, B = {HTH, THH, HHH}. P(A) + P(B) = 6/8, but A ∪ B has only 4 outcomes!');
      W.lit = ['ab']; SFX.pop();
      await K('think', 'The gold overlap got counted twice…');
      await discover('P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', 'If A, B are mutually exclusive the overlap is 0.');
      await numQ('3/8 + 3/8 − 2/8 = ?', 0.5, '1/2 = 4/8 ✓', { show: '1/2' });
      hideFound(); await cont();
    },
    async function () {
      enterScene('pvenn', (W) => Object.assign(W, { a: 0.05, b: 0.1, ab: 0.02, labA: 'Anil', labB: 'Ashima' }));
      exTag('Example 7', 'P(E) = 0.05, P(F) = 0.10, P(E ∩ F) = 0.02');
      W.lit = ['out']; SFX.pop();
      await numQ('(a) neither qualifies: 1 − P(E ∪ F) = ?', 0.87, '1 − 0.13 = 0.87.');
      W.lit = ['a-b', 'b-a', 'out']; SFX.pop();
      await numQ('(b) at least one does not qualify: 1 − P(E ∩ F) = ?', 0.98, '0.98.');
      W.lit = ['a-b', 'b-a']; SFX.pop();
      await numQ('(c) exactly one qualifies = ?', 0.11, '0.03 + 0.08 = 0.11.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '2M + 2W'; W.sub = 'Example 8'; });
      exTag('Example 8', 'committee of 2 from 2 men and 2 women');
      const r = await fields('⁴C₂ = 6 committees', [{ l: 'no man', a: 1 / 6, show: '1/6' }, { l: 'one man', a: 2 / 3, show: '2/3' }, { l: 'two men', a: 1 / 6, show: '1/6' }]); await verdict(r, '²C₂/6, ²C₁·²C₁/6, ²C₂/6.', '1/6, 2/3, 1/6.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'P(A ∪ B) = P(A) + P(B) − P(A ∩ B)', eq: true }, 'P(A′ ∩ B′) = 1 − P(A ∪ B)', 'Count with ⁿCᵣ when choosing.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'counting', title: 'Counting Chances', blurb: 'Orders of cities, hands of cards, relay finishes, and the three-event addition rule. Examples 9–12.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('board', (W) => { W.tag = '4! = 24'; W.sub = 'Example 9'; });
      await slam('COUNTING', 'Lesson ' + L.num + ' · Examples 9–12');
      exTag('Example 9', 'Veena visits A, B, C, D in random order');
      const r = await fields('Probabilities (out of 24 orders)', [{ l: '(i) A before B', a: 1 / 2, show: '1/2' }, { l: '(ii) A < B < C', a: 1 / 6, show: '1/6' }, { l: '(iii) A first, B last', a: 1 / 12, show: '1/12' }, { l: '(iv) A first or second', a: 1 / 2, show: '1/2' }, { l: '(v) A just before B', a: 1 / 4, show: '1/4' }]); await verdict(r, '12, 4, 2, 12, 6 of 24.', '1/2, 1/6, 1/12, 1/2, 1/4.');
      await cont();
    },
    async function () {
      enterScene('deck', (W) => { W.hl = (s, r) => r === 'K'; W.capName = 'kings'; });
      exTag('Example 10', '7-card hand');
      await numQ('(i) all 4 kings: ⁴C₄ · ⁴⁸C₃ / ⁵²C₇ = ?', (nCk(4, 4) * nCk(48, 3)) / nCk(52, 7), '1/7735.', { show: '1/7735', tol: 1e-7 });
      await numQ('(ii) exactly 3 kings: ⁴C₃ · ⁴⁸C₄ / ⁵²C₇ = ?', (nCk(4, 3) * nCk(48, 4)) / nCk(52, 7), '9/1547.', { show: '9/1547', tol: 1e-6 });
      await numQ('(iii) at least 3 kings = ?', (nCk(4, 4) * nCk(48, 3) + nCk(4, 3) * nCk(48, 4)) / nCk(52, 7), '46/7735.', { show: '46/7735', tol: 1e-6 });
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'A ∪ B ∪ C'; W.sub = 'Example 11'; });
      exTag('Example 11');
      const r = await order('Prove P(A ∪ B ∪ C)', ['Let E = B ∪ C: P(A ∪ E) = P(A) + P(E) − P(A ∩ E)', 'P(E) = P(B) + P(C) − P(B ∩ C)', 'A ∩ E = (A ∩ B) ∪ (A ∩ C), so P(A ∩ E) = P(A ∩ B) + P(A ∩ C) − P(A ∩ B ∩ C)', 'Substitute: P(A) + P(B) + P(C) − P(A∩B) − P(A∩C) − P(B∩C) + P(A∩B∩C)']); await verdict(r, 'Inclusion–exclusion for three events.', 'Group B ∪ C first.');
      exTag('Example 12', 'relay with 5 teams: top-three orders = ⁵P₃ = 60');
      const r2 = await fields('Probabilities', [{ l: '(a) A, B, C in that order', a: 1 / 60, show: '1/60' }, { l: '(b) A, B, C are the top three', a: 1 / 10, show: '1/10' }]); await verdict(r2, '1/60 and 3!/60 = 1/10.', '1/60, 1/10.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['Equally likely orders: count arrangements.', { t: 'P = favourable / total, counted with ⁿPᵣ, ⁿCᵣ', eq: true }]); },
  ],
}));

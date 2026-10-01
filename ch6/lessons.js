/* =========================================================
   CHAPTER 6 · PERMUTATIONS & COMBINATIONS — concept lessons (Examples 1–24)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));

/* ================= LESSON 1 · COUNTING PRINCIPLE ================= */
LESSONS.push(lesson({
  id: 'fpc', title: 'The Counting Principle', blurb: 'Pants and shirts, bags and bottles, ROSE and flags: multiply the choices. Examples 1–4.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['7', '2nd', '3rd', '4th']));
      await slam('HOW MANY WAYS?', 'Lesson 1 · Sections 6.1–6.2');
      await J('idle', 'A 4-wheel suitcase lock, digits 0–9, no repeats. You remember the first digit is 7. How many codes might you have to try?');
      W.slots[0].t = '7'; W.slots[0].fill = true; W.slots[0].c = 1;
      const r = await kahoot('How many 3-digit endings are possible?', ['27', '504', '729', '1000'], 1, 20);
      W.slots[0].c = ''; await slotsFill(W, [1, 9, 8, 7], ['7']);
      await verdict(r, '9 choices, then 8, then 7: 9 × 8 × 7 = 504.', '9 × 8 × 7 = 504. Each wheel has one fewer option.');
      await cont();
    },
    async function () {
      enterScene('tree');
      await J('idle', 'Mohan has 3 pants and 2 shirts. Every pant branches into 2 shirts.');
      await treeGrow(W, [['P1', 'P2', 'P3'], ['S1', 'S2']]);
      await K('think', 'And Sabnam with 2 bags, 3 tiffins and 2 bottles?');
      const r = await kahoot('How many ways can Sabnam carry them?', ['7', '12', '6', '18'], 1, 15);
      await treeGrow(W, [['B1', 'B2'], ['T1', 'T2', 'T3'], ['W1', 'W2']]);
      await verdict(r, '2 × 3 × 2 = 12 leaves.', '2 × 3 × 2 = 12.');
      await discover('Fundamental principle of counting', 'm ways, then n ways, then p ways ⇒ m × n × p ways in that order.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['1st', '2nd', '3rd', '4th'], ['R', 'O', 'S', 'E']));
      exTag('Example 1', '4-letter words from ROSE, no repetition');
      await numQ('How many words?', 24, '4 × 3 × 2 × 1 = 24.');
      await slotsFill(W, [4, 3, 2, 1], ['O', 'S', 'E', 'R']);
      await quiz('If repetition WERE allowed?', ['24', '64', '256', '16'], 2, 'Each place has 4 choices: 4⁴ = 256.');
      await cont();
    },
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['upper', 'lower']));
      exTag('Example 2', '2 of 4 flags, one below the other');
      await numQ('How many signals?', 12, '4 × 3 = 12.'); await slotsFill(W, [4, 3]);
      enterScene('slots', (W) => slotsSet(W, ['tens', 'units'], ['1', '2', '3', '4', '5']));
      exTag('Example 3', '2-digit even numbers from 1–5, repetition allowed');
      await J('think', 'Start with the restricted place: the units digit must be 2 or 4.');
      await numQ('How many?', 10, 'Units: 2 ways, tens: 5 ways ⇒ 10.'); W.repeat = true; await slotsFill(W, [5, 2], ['3', '4']);
      await cont();
    },
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['1', '2', '3', '4', '5']));
      exTag('Example 4', 'signals with at least 2 of 5 flags');
      await J('idle', 'Count 2-flag, 3-flag, 4-flag and 5-flag signals separately, then ADD.');
      const r = await fields('Fill each case', [{ l: '2 flags', a: 20 }, { l: '3 flags', a: 60 }, { l: '4 flags', a: 120 }, { l: '5 flags', a: 120 }]); await verdict(r, '5×4, 5×4×3, 5×4×3×2, 5!.', '20, 60, 120, 120.');
      await slotsFill(W, [5, 4, 3, 2, 1]);
      await numQ('Total signals = ?', 320, '20 + 60 + 120 + 120 = 320.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; });
      await summary([{ t: 'm ways then n ways ⇒ m × n', eq: true }, 'Fill the most restricted place first.', 'Separate cases (2 flags OR 3 flags…) are ADDED.']);
    },
  ],
}));

/* ================= LESSON 2 · FACTORIALS & nPr ================= */
LESSONS.push(lesson({
  id: 'npr', title: 'Factorials & ⁿPᵣ', blurb: 'n!, the permutation formula, NUMBER and the chairman problem. Examples 5–8.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['', '', '', '', '']));
      await slam('n FACTORIAL', 'Lesson ' + L.num + ' · Section 6.3');
      await J('idle', 'n! = 1 × 2 × 3 × … × n. Fill 5 places with 5 different things: 5!.');
      await slotsFill(W, [5, 4, 3, 2, 1]);
      exTag('Example 5');
      const r = await fields('Evaluate', [{ l: '5!', a: 120 }, { l: '7!', a: 5040 }, { l: '7! − 5!', a: 4920 }]); await verdict(r, '7! − 5! = 5040 − 120 = 4920.', '120, 5040, 4920.');
      await quiz('0! = ?', ['0', '1', 'undefined', '∞'], 1, 'Defined as 1, so that formulas keep working.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'n! = n(n−1)!'; W.sub = 'Examples 6–8'; });
      exTag('Example 6');
      await numQ('7!/5! = ?', 42, '7 × 6 × 5!/5! = 42.');
      await numQ('12!/(10! · 2!) = ?', 66, '12 × 11/2 = 66.');
      exTag('Example 7');
      await numQ('n!/(r!(n − r)!) for n = 5, r = 2', 10, '5!/(2! 3!) = 10.');
      exTag('Example 8', '1/8! + 1/9! = x/10!');
      await J('think', 'Multiply everything by 10!: 10 × 9 + 10 = x.');
      await numQ('x = ?', 100, '90 + 10 = 100.');
      await cont();
    },
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['1st', '2nd', '3rd'], 'NUMBER'.split('')));
      await J('idle', 'r places from n different things: ⁿPᵣ = n(n − 1)…(n − r + 1) = n!/(n − r)!.');
      await quiz('3-letter words from NUMBER, no repetition', ['120', '216', '20', '720'], 0, '⁶P₃ = 6 × 5 × 4 = 120.'); await slotsFill(W, [6, 5, 4], ['B', 'U', 'M']);
      await quiz('With repetition allowed?', ['120', '216', '18', '729'], 1, '6³ = 216: Theorem 2, nʳ.');
      await quiz('Chairman and Vice-Chairman from 12 people', ['66', '132', '144', '24'], 1, '¹²P₂ = 12 × 11 = 132.');
      await discover('ⁿPᵣ = n!/(n − r)!', 'With repetition allowed: nʳ.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'ⁿPᵣ = n!/(n − r)!', eq: true }, 'n! = n × (n − 1)!,  0! = 1', 'Repetition allowed: nʳ']);
    },
  ],
}));

/* ================= LESSON 3 · REPEATED OBJECTS ================= */
LESSONS.push(lesson({
  id: 'repeat', title: 'Repeats & Restrictions', blurb: 'ROOT, ALLAHABAD, glued vowels, INDEPENDENCE. Examples 9–16.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('tiles', (W) => tilesSet(W, 'ROOT'));
      await slam('REPEATED LETTERS', 'Lesson ' + L.num + ' · Section 6.3.4');
      await J('idle', 'ROOT has two identical O tiles (same colour). Swapping them changes nothing.');
      const b = button('Shuffle'); await waitFor(() => b.clicked()); b.stop(); await tilesShuffle(W, 3);
      const r = await kahoot('Distinct arrangements of ROOT?', ['24', '12', '6', '4'], 1, 15);
      W.count = '4!/2! = 12'; await verdict(r, '4! counts each word twice (O₁O₂ and O₂O₁): 24/2 = 12.', '4!/2! = 12.');
      await discover('n!/(p₁! p₂! … pₖ!)', 'Divide by the factorial of each group of identical objects.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('tiles', (W) => { tilesSet(W, 'ALLAHABAD'); });
      exTag('Example 9', 'ALLAHABAD');
      await numQ('9 letters: 4 A, 2 L. Arrangements = ?', 7560, '9!/(4! 2!) = 7560.'); W.count = '9!/(4!·2!) = 7560'; await tilesShuffle(W, 2);
      enterScene('tiles', (W) => tilesSet(W, 'RRRRYYYGG'));
      exTag('Example 15', '4 red, 3 yellow, 2 green discs');
      await numQ('Arrangements = ?', 1260, '9!/(4! 3! 2!) = 1260.'); W.count = '1260';
      await cont();
    },
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['th', 'h', 't', 'u']));
      exTag('Example 10', '4-digit numbers from 1–9, no repeats');
      await numQ('⁹P₄ = ?', 3024, '9 × 8 × 7 × 6.'); await slotsFill(W, [9, 8, 7, 6]);
      enterScene('slots', (W) => slotsSet(W, ['hundreds', 'tens', 'units'], ['0', '1', '2', '3', '4', '5']));
      exTag('Example 11', '100 to 1000 from 0–5, no repeats');
      await J('think', 'Hundreds place cannot be 0. So 5 × 5 × 4.');
      await numQ('How many?', 100, '⁶P₃ − ⁵P₂ = 120 − 20 = 100, or 5 × 5 × 4.'); await slotsFill(W, [5, 5, 4], ['3', '0', '5']);
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'ⁿP₅ = 42 ⁿP₃'; W.sub = 'Examples 12–13'; });
      exTag('Example 12');
      await numQ('(i) ⁿP₅ = 42 ⁿP₃ ⇒ (n − 3)(n − 4) = 42 ⇒ n = ?', 10, 'n² − 7n − 30 = 0 ⇒ n = 10 (not −3).');
      await numQ('(ii) ⁿP₄ / ⁿ⁻¹P₄ = 5/3 ⇒ 3n = 5(n − 4) ⇒ n = ?', 10, 'n = 10.');
      exTag('Example 13', '5 · ⁴Pᵣ = 6 · ⁵Pᵣ₋₁');
      await pickQ('(6 − r)(5 − r) = 6 gives r² − 11r + 24 = 0. Which values of r are VALID?', ['2', '3', '4', '6', '8'], ['3'], 'Roots are 3 and 8, but ⁴Pᵣ needs r ≤ 4, so only r = 3 works.', { brace: false });
      sheet.append(h('div', { class: 'hint', html: '<b>Answer-key check:</b> the textbook writes “r = 8, 3”. r = 8 is impossible because ⁴P₈ is not defined (you cannot arrange 8 of 4 objects). The correct answer is r = 3.' }));
      await cont();
    },
    async function () {
      enterScene('tiles', (W) => tilesSet(W, 'DAUGHTER'));
      exTag('Example 14', 'DAUGHTER, vowels together');
      await J('idle', 'Glue A, U, E into one block. Now arrange 6 objects, then shuffle inside the block.');
      const b = button('Glue the vowels'); await waitFor(() => b.clicked()); b.stop(); await tilesGlue(W, (c) => 'AEU'.includes(c));
      await numQ('(i) 6! × 3! = ?', 4320, '720 × 6.'); W.count = '6! × 3! = 4320';
      await numQ('(ii) Vowels NOT all together = 8! − 4320 = ?', 36000, '40320 − 4320.');
      await cont();
    },
    async function () {
      enterScene('tiles', (W) => tilesSet(W, 'INDEPENDENCE'));
      exTag('Example 16', 'INDEPENDENCE: N×3, E×4, D×2');
      await numQ('All arrangements = 12!/(3! 4! 2!) = ?', 1663200, '1663200.');
      await numQ('(i) Starting with P: 11!/(3! 4! 2!) = ?', 138600, 'Fix P, arrange 11.');
      await tilesGlue(W, (c) => 'EI'.includes(c));
      await numQ('(ii) Vowels EEEEI together: 8!/(3! 2!) × 5!/4! = ?', 16800, '3360 × 5.');
      await numQ('(iii) Vowels never together = ?', 1646400, '1663200 − 16800.');
      await numQ('(iv) Begin with I, end with P: 10!/(3! 4! 2!) = ?', 12600, 'Fix both ends.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'n!/(p₁! p₂! … pₖ!)', eq: true }, 'Together: glue into one block, multiply by inner arrangements.', 'Never together = total − together.', 'Fixed positions: place them first, arrange the rest.']);
    },
  ],
}));

/* ================= LESSON 4 · COMBINATIONS ================= */
LESSONS.push(lesson({
  id: 'ncr', title: 'Combinations', blurb: 'Teams, handshakes, chords and cards: order does not matter. Examples 17–19.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('pick', (W) => pickSetup(W, [['players', 3, C.sakura, 'P']]));
      await slam('COMBINATIONS', 'Lesson ' + L.num + ' · Section 6.4');
      W.groups[0].items.forEach((it, i) => (it.t = 'XYZ'[i]));
      await J('idle', 'A team of 2 from X, Y, Z. Is team XY different from team YX?');
      await quiz('How many teams?', ['6', '3', '2', '9'], 1, 'XY, YZ, ZX. Order does not matter.');
      await pickTake(W, [[0, 2]]);
      await K('think', 'So a selection is a permutation with the order forgotten?');
      await J('happy', 'Exactly: each team of r can be ordered in r! ways. ⁿPᵣ = ⁿCᵣ × r!.');
      await discover('ⁿCᵣ = n!/(r!(n − r)!)', 'ⁿC₀ = ⁿCₙ = 1,  ⁿCᵣ = ⁿCₙ₋ᵣ.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('pick');
      await J('think', 'Twelve people all shake hands. Each handshake is a pair.');
      await numQ('Handshakes = ¹²C₂ = ?', 66, '12 × 11/2 = 66.');
      await J('idle', 'Seven points on a circle, join every pair.');
      await chordsDraw(W, 7);
      await numQ('Chords = ⁷C₂ = ?', 21, '7 × 6/2 = 21.');
      await quiz('ⁿCᵣ + ⁿCᵣ₋₁ = ?', ['ⁿ⁺¹Cᵣ', 'ⁿCᵣ₊₁', '²ⁿCᵣ', 'ⁿ⁺¹Cᵣ₋₁'], 0, 'Theorem 6 (Pascal’s rule).');
      exTag('Example 17', 'ⁿC₉ = ⁿC₈');
      await numQ('Then n = 9 + 8 = ?', 17, 'ⁿCₐ = ⁿC_b ⇒ n = a + b.');
      await numQ('So ⁿC₁₇ = ?', 1, '¹⁷C₁₇ = 1.');
      await cont();
    },
    async function () {
      enterScene('pick', (W) => pickSetup(W, [['men', 2, C['sora-tint'], 'M'], ['women', 3, C.sakura, 'W']]));
      exTag('Example 18', 'committee of 3 from 2 men, 3 women');
      await numQ('Any 3 of 5: ⁵C₃ = ?', 10, '10.');
      await numQ('1 man and 2 women: ²C₁ × ³C₂ = ?', 6, '2 × 3 = 6.');
      await pickTake(W, [[0, 1], [1, 2]]);
      await cont();
    },
    async function () {
      enterScene('pick', (W) => { W.mode = 'cards'; });
      exTag('Example 19', '4 cards from 52');
      await numQ('Total ways ⁵²C₄ = ?', 270725, '52·51·50·49/24 = 270725.');
      W.hl = (r, s) => s === 2; W.cap = 'one whole suit (13 cards)';
      await numQ('(i) all four of the same suit: 4 × ¹³C₄ = ?', 2860, '4 × 715.');
      W.hl = (r, s) => r === 5; W.cap = 'one from each suit';
      await numQ('(ii) four different suits: 13⁴ = ?', 28561, '13 × 13 × 13 × 13.');
      W.hl = (r) => r >= 10; W.cap = '12 face cards';
      await numQ('(iii) all face cards: ¹²C₄ = ?', 495, '495.');
      W.hl = (r, s) => s >= 2; W.cap = '26 red';
      await numQ('(iv) 2 red and 2 black: ²⁶C₂ × ²⁶C₂ = ?', 105625, '325².');
      await numQ('(v) all the same colour: 2 × ²⁶C₄ = ?', 29900, '2 × 14950.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'ⁿCᵣ = n!/(r!(n − r)!)', eq: true }, 'ⁿPᵣ = ⁿCᵣ × r!', 'ⁿCᵣ = ⁿCₙ₋ᵣ,  ⁿCᵣ + ⁿCᵣ₋₁ = ⁿ⁺¹Cᵣ', 'Order matters → P. Order doesn’t → C.']);
    },
  ],
}));

/* ================= LESSON 5 · MIXED PROBLEMS ================= */
LESSONS.push(lesson({
  id: 'mixed', title: 'Select, then Arrange', blurb: 'INVOLUTE, teams with conditions, dictionary order, seating gaps. Examples 20–24.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('tiles', (W) => tilesSet(W, 'INVOLUTE'));
      await slam('SELECT · THEN · ARRANGE', 'Lesson ' + L.num + ' · Miscellaneous Examples');
      exTag('Example 20', '3 vowels + 2 consonants from INVOLUTE');
      const r = await fields('Select first', [{ l: '⁴C₃ vowels', a: 4 }, { l: '⁴C₂ consonants', a: 6 }]); await verdict(r, 'I, O, U, E and N, V, L, T.', '4 and 6.');
      await numQ('Then arrange the 5 letters: 4 × 6 × 5! = ?', 2880, '24 × 120.');
      await cont();
    },
    async function () {
      enterScene('pick', (W) => pickSetup(W, [['girls', 4, C.sakura, 'G'], ['boys', 7, C['sora-tint'], 'B']]));
      exTag('Example 21', 'team of 5 from 4 girls, 7 boys');
      await numQ('(i) no girl: ⁷C₅ = ?', 21, '21.'); await pickTake(W, [[1, 5]]); pickReset(W);
      await J('think', '“At least one boy and one girl” = cases 1B4G, 2B3G, 3B2G, 4B1G.');
      await numQ('(ii) 7 + 84 + 210 + 140 = ?', 441, '441.');
      await numQ('(iii) at least 3 girls: ⁴C₃·⁷C₂ + ⁴C₄·⁷C₁ = ?', 91, '84 + 7.'); await pickTake(W, [[0, 3], [1, 2]]);
      await cont();
    },
    async function () {
      enterScene('tiles', (W) => tilesSet(W, 'AGAIN'));
      exTag('Example 22', 'AGAIN in dictionary order');
      await numQ('Words = 5!/2! = ?', 60, '60.');
      await J('think', 'Starting with A: 4! = 24. With G: 4!/2! = 12. With I: 12. That is 48 words before N.');
      await quiz('49th word is NAAGI. The 50th is…', ['NAAIG', 'NAGAI', 'NAIAG', 'NGAAI'], 0, 'Next in dictionary order: NAAIG.');
      exTag('Example 23', '> 1000000 using 1, 2, 0, 2, 4, 2, 4');
      await numQ('7-digit arrangements 7!/(3! 2!) minus those starting with 0 (6!/(3! 2!)) = ?', 360, '420 − 60 = 360.');
      await cont();
    },
    async function () {
      enterScene('slots', (W) => slotsSet(W, ['×', 'G', '×', 'G', '×', 'G', '×', 'G', '×', 'G', '×']));
      exTag('Example 24', '5 girls, 3 boys, no two boys together');
      await J('idle', 'Seat the girls first (5!), then boys go into the 6 gaps marked ×.');
      W.slots.forEach((s, i) => { if (i % 2) { s.t = 'G'; s.fill = true; } });
      await numQ('5! × ⁶P₃ = ?', 14400, '120 × 120.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary(['Words with chosen letters: C to select, then r! to arrange.', '“At least” → add the cases, or total − complement.', { t: 'No two together: seat the others, use the gaps', eq: true }]);
    },
  ],
}));

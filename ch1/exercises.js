/* =========================================================
   CHAPTER 1 · SETS — every exercise question as a sim
   Set-operation answers are COMPUTED from the sets (never typed by hand).
   ========================================================= */
/* filter-machine roster question */
function rosterQ(ex, n, q, rule, cands, test, extra = {}) {
  const ans = cands.filter(test); return {
    ex, n, q, scene: 'filter', setup: (W) => { W.rule = rule; },
    parts: [{ k: 'pick', q: 'Tap every element of the set', pool: NUMS(extra.pool || cands), a: NUMS(ans), x: extra.x || SET.str(ans) + '.', act: async () => { await runFilter(W, cands.map((v) => ({ t: SET.lbl(v), ok: test(v) })), { fast: cands.length > 10 ? 0.14 : 0.2 }); } }],
    w: extra.w || [((q.match(/([A-Z]) = /) || [0, 'The set'])[1]) + ' = ' + SET.str(ans)],
  };
}
/* letters of a word, dropped into braces */
function wordQ(ex, n, q, word, label, pool) {
  const ans = letters(word); return {
    ex, n, q, scene: 'bag', setup: (W) => bagSet(W, [{ label, items: [] }]),
    parts: [{ k: 'pick', q: 'Tap the letters of the set', pool, a: ans, x: 'Repeated letters are written once: ' + SET.str(ans) + '.', act: async () => { for (const c of word) { await bagDrop(W.bags[0], c); await wait(0.05); } } }],
    w: [label + ' = ' + SET.str(ans)],
  };
}
/* venn operation: answer = elements satisfying f(membership flags) */
function opQ(ex, n, sets, expr, f, o = {}) {
  const keys = Object.keys(sets); const all = SET.sort(SET.of([...keys.flatMap((k) => sets[k]), ...(o.U || [])]));
  const ans = all.filter((e) => f(...keys.map((k) => sets[k].includes(e))));
  const named = keys.map((k) => k + ' = ' + SET.str(sets[k])).join(', ');
  return {
    ex, n, q: o.q || (o.U ? 'U = ' + SET.str(o.U) + ', ' : '') + named + '. Find ' + expr + '.', scene: 'venn', setup: (W) => vennLoad(W, sets, { U: o.U, lay: o.lay }),
    parts: [{ k: 'pick', q: expr + ' = ?', pool: NUMS(all), a: NUMS(ans), x: o.x || expr + ' = ' + SET.str(ans) + '.', act: async () => { await vennShade(W, regionsWhere(W, f)); } }],
    w: [expr + ' = ' + SET.str(ans)],
  };
}
const SUB = ['⊂', '⊄'], IN = ['∈', '∉'], FI = ['Finite', 'Infinite'], EQ = ['A = B', 'A ≠ B'];
const judgeAct = (title, jl, kl, ok) => async () => { enterScene('judges', (W) => { W.title = title; }); await judgeRun(W, jl, kl, ok); };

/* ===================== EXERCISE 1.1 ===================== */
const EX11 = [
  {
    ex: 'Ex 1.1', n: 'Q1', q: 'Which of the following are sets? Justify your answer.', scene: 'judges', setup: (W) => { W.title = 'Is it well-defined?'; },
    kim: 'Same test every time: would Jeevesh and I write the same list?',
    parts: [
      { k: 'tf', q: '(i) The collection of all the months of a year beginning with the letter J.', o: ['Set', 'Not a set'], a: 0, x: 'January, June, July. Anyone can check.', act: judgeAct('Months beginning with J', ['January', 'June', 'July'], ['January', 'June', 'July'], true) },
      { k: 'tf', q: '(ii) The collection of ten most talented writers of India.', o: ['Set', 'Not a set'], a: 1, x: '“Most talented” varies from person to person.', act: judgeAct('Ten most talented writers', ['Tagore', 'Premchand', 'Narayan', 'Ruskin Bond'], ['Premchand', 'Amrita Pritam', 'Tagore', 'Vikram Seth'], false) },
      { k: 'tf', q: '(iii) A team of eleven best cricket batsmen of the world.', o: ['Set', 'Not a set'], a: 1, x: '“Best” is an opinion, so not well-defined.', act: judgeAct('Eleven best batsmen', ['Tendulkar', 'Bradman', 'Lara', 'Kohli'], ['Bradman', 'Richards', 'Smith', 'Tendulkar'], false) },
      { k: 'tf', q: '(iv) The collection of all boys in your class.', o: ['Set', 'Not a set'], a: 0, x: 'Check the register: everybody gets the same list.' },
      { k: 'tf', q: '(v) The collection of all natural numbers less than 100.', o: ['Set', 'Not a set'], a: 0, x: '{1, 2, …, 99}: well-defined.' },
      { k: 'tf', q: '(vi) A collection of novels written by the writer Munshi Prem Chand.', o: ['Set', 'Not a set'], a: 0, x: 'His novels are a definite list (Godaan, Nirmala, …).', act: judgeAct('Novels by Premchand', ['Godaan', 'Nirmala', 'Gaban'], ['Godaan', 'Nirmala', 'Gaban'], true) },
      { k: 'tf', q: '(vii) The collection of all even integers.', o: ['Set', 'Not a set'], a: 0, x: 'Infinite, but well-defined: any integer is even or not.' },
      { k: 'tf', q: '(viii) The collection of questions in this Chapter.', o: ['Set', 'Not a set'], a: 0, x: 'You can count them in the book.' },
      { k: 'tf', q: '(ix) A collection of most dangerous animals of the world.', o: ['Set', 'Not a set'], a: 1, x: '“Most dangerous” depends on who judges.', act: judgeAct('Most dangerous animals', ['Tiger', 'Shark', 'Snake'], ['Mosquito', 'Hippo', 'Tiger'], false) },
    ],
    w: ['Sets: (i), (iv), (v), (vi), (vii), (viii) — they are well-defined.', 'Not sets: (ii), (iii), (ix) — “most talented / best / most dangerous” are not well-defined.'],
  },
  {
    ex: 'Ex 1.1', n: 'Q2', q: 'Let A = {1, 2, 3, 4, 5, 6}. Insert ∈ or ∉ in the blanks.', scene: 'bag', setup: (W) => bagSet(W, [{ label: 'A', items: [1, 2, 3, 4, 5, 6] }]),
    parts: [[5, 1], [8, 0], [0, 0], [4, 1], [2, 1], [10, 0]].map(([v, isIn], i) => ({ k: 'tf', q: '(' + ['i', 'ii', 'iii', 'iv', 'v', 'vi'][i] + ') ' + v + ' ___ A', o: IN, a: isIn ? 0 : 1, time: 10, x: v + (isIn ? ' ∈ A' : ' ∉ A') + '.', act: async () => { if (isIn) { bagHL(W, 0, [v]); SFX.snap(); } else { await bagDrop(W.bags[0], v, { dupCheck: false }); const it = W.bags[0].items[W.bags[0].items.length - 1]; it.bg = C.sakura; FX.ono('NOT IN A!', { x: 60, y: 30, red: true }); SFX.boing(); await tw(it, { dy: -3, a: 0, duration: 0.5 }); W.bags[0].items.pop(); } } })),
    w: ['5 ∈ A, 8 ∉ A, 0 ∉ A, 4 ∈ A, 2 ∈ A, 10 ∉ A'],
  },
  rosterQ('Ex 1.1', 'Q3 (i)', 'Write in roster form: A = {x : x is an integer and −3 ≤ x < 7}', 'x is an integer and −3 ≤ x < 7', SET.range(-5, 8), (x) => x >= -3 && x < 7, { x: '−3 is included (≤), 7 is not (<).' }),
  rosterQ('Ex 1.1', 'Q3 (ii)', 'B = {x : x is a natural number less than 6}', 'x is a natural number less than 6', SET.range(0, 7), (x) => x >= 1 && x < 6, { x: 'Natural numbers start at 1. 0 is not natural.' }),
  rosterQ('Ex 1.1', 'Q3 (iii)', 'C = {x : x is a two-digit natural number such that the sum of its digits is 8}', 'two-digit, digits add to 8', [8, 17, 18, 26, 35, 36, 44, 53, 62, 70, 71, 80, 88], (x) => x >= 10 && x <= 99 && Math.floor(x / 10) + (x % 10) === 8, { x: '17, 26, 35, 44, 53, 62, 71, 80. (8 is one-digit.)' }),
  rosterQ('Ex 1.1', 'Q3 (iv)', 'D = {x : x is a prime number which is a divisor of 60}', 'x is prime and divides 60', [1, 2, 3, 4, 5, 6, 7, 10, 12, 15], (x) => [2, 3, 5].includes(x), { x: '60 = 2² × 3 × 5. 1 is not prime.' }),
  wordQ('Ex 1.1', 'Q3 (v)', 'E = the set of all letters in the word TRIGONOMETRY', 'TRIGONOMETRY', 'E', ['A', 'E', 'G', 'H', 'I', 'M', 'N', 'O', 'P', 'R', 'S', 'T', 'Y']),
  wordQ('Ex 1.1', 'Q3 (vi)', 'F = the set of all letters in the word BETTER', 'BETTER', 'F', ['A', 'B', 'E', 'L', 'R', 'S', 'T']),
  ...[
    ['(i)', '{3, 6, 9, 12}', [3, 6, 9, 12], ['{x : x = 3n, n ∈ N and 1 ≤ n ≤ 4}', '{x : x = n + 3, n ∈ N, n ≤ 4}', '{x : x is a multiple of 3}', '{x : x = 3n, n ∈ N and 1 ≤ n ≤ 12}'], 0],
    ['(ii)', '{2, 4, 8, 16, 32}', [2, 4, 8, 16, 32], ['{x : x = 2n, n ∈ N, n ≤ 5}', '{x : x = 2^{n}, n ∈ N and 1 ≤ n ≤ 5}', '{x : x is even and x ≤ 32}', '{x : x = n², 1 ≤ n ≤ 5}'], 1],
    ['(iii)', '{5, 25, 125, 625}', [5, 25, 125, 625], ['{x : x = 5n, n ∈ N, n ≤ 4}', '{x : x = n⁵}', '{x : x = 5^{n}, n ∈ N and 1 ≤ n ≤ 4}', '{x : x is a multiple of 5}'], 2],
    ['(iv)', '{2, 4, 6, …}', [2, 4, 6, 8, '…'], ['{x : x is a natural number}', '{x : x = 2^{n}, n ∈ N}', '{x : x is an even natural number}', '{x : x is an even number less than 7}'], 2],
    ['(v)', '{1, 4, 9, …, 100}', [1, 4, 9, '…', 100], ['{x : x = n², n ∈ N and 1 ≤ n ≤ 10}', '{x : x = n², n ∈ N}', '{x : x = 2n − 1, n ≤ 10}', '{x : x = n³, 1 ≤ n ≤ 10}'], 0],
  ].map(([p, set, items, o, a]) => ({ ex: 'Ex 1.1', n: 'Q4 ' + p, q: 'Write in set-builder form: ' + set, scene: 'bag', setup: (W) => bagSet(W, [{ label: set, items }]), kim: p === '(i)' ? 'Look for the pattern hiding in the numbers.' : null, parts: [{ k: 'mcq', q: 'Set-builder form of ' + set, o, a, x: plain(o[a]) + '.' }], w: [set + ' = ' + o[a]] })),
  { ex: 'Ex 1.1', n: 'Q5 (i)', q: 'List all elements: A = {x : x is an odd natural number}', scene: 'filter', setup: (W) => { W.rule = 'x is an odd natural number'; }, parts: [{ k: 'mcq', q: 'A = ?', o: ['{1, 3, 5, 7, …}', '{1, 3, 5, 7, 9}', '{…, −3, −1, 1, 3, …}', '{0, 1, 3, 5, …}'], a: 0, x: 'Infinite: 1, 3, 5, … with no end.', act: async () => { await runFilter(W, SET.range(1, 10).map((v) => ({ t: String(v), ok: v % 2 === 1 })), { fast: 0.15, more: true }); } }], w: ['A = {1, 3, 5, 7, …}'] },
  rosterQ('Ex 1.1', 'Q5 (ii)', 'B = {x : x is an integer, −1/2 < x < 9/2}', 'integer, −0.5 < x < 4.5', SET.range(-2, 5), (x) => x > -0.5 && x < 4.5, { x: '−1/2 = −0.5 and 9/2 = 4.5: the integers 0 to 4.' }),
  rosterQ('Ex 1.1', 'Q5 (iii)', 'C = {x : x is an integer, x² ≤ 4}', 'integer with x² ≤ 4', SET.range(-3, 3), (x) => x * x <= 4, { x: '(−2)² = 4 is allowed too.' }),
  wordQ('Ex 1.1', 'Q5 (iv)', 'D = {x : x is a letter in the word “LOYAL”}', 'LOYAL', 'D', ['A', 'E', 'L', 'O', 'T', 'Y']),
  { ex: 'Ex 1.1', n: 'Q5 (v)', q: 'E = {x : x is a month of a year not having 31 days}', scene: 'filter', setup: (W) => { W.rule = 'month without 31 days'; }, parts: [{ k: 'pick', q: 'Tap the months', pool: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], a: ['Feb', 'Apr', 'Jun', 'Sep', 'Nov'], x: '“Thirty days hath September, April, June and November”, plus February.', act: async () => { await runFilter(W, ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => ({ t: m, ok: ['Feb', 'Apr', 'Jun', 'Sep', 'Nov'].includes(m) })), { fast: 0.13 }); } }], w: ['E = {February, April, June, September, November}'] },
  { ex: 'Ex 1.1', n: 'Q5 (vi)', q: 'F = {x : x is a consonant in the English alphabet which precedes k}', scene: 'filter', setup: (W) => { W.rule = 'consonant that comes before k'; }, parts: [{ k: 'pick', q: 'Tap the letters', pool: 'abcdefghijk'.split(''), a: ['b', 'c', 'd', 'f', 'g', 'h', 'j'], x: 'Drop the vowels a, e, i and k itself.', act: async () => { await runFilter(W, 'abcdefghijk'.split('').map((c) => ({ t: c, ok: 'bcdfghj'.includes(c) })), { fast: 0.14 }); } }], w: ['F = {b, c, d, f, g, h, j}'] },
  { ex: 'Ex 1.1', n: 'Q6', q: 'Match each set in roster form with the same set in set-builder form.', scene: 'board', parts: [{ k: 'match', q: 'Pair them', L: ['{1, 2, 3, 6}', '{2, 3}', '{M, A, T, H, E, I, C, S}', '{1, 3, 5, 7, 9}'], R: ['x is a prime number and a divisor of 6', 'x is an odd natural number less than 10', 'x is a natural number and divisor of 6', 'x is a letter of the word MATHEMATICS'], a: [2, 0, 3, 1], x: 'Divisors of 6 → (c); prime divisors → (a); MATHEMATICS → (d); odd < 10 → (b).' }], w: ['(i) ↔ (c), (ii) ↔ (a), (iii) ↔ (d), (iv) ↔ (b)'] },
];

EX11[0].parts.forEach((p) => { p.pre = () => { if (W.__scene !== MINI.judges) enterScene('judges'); W.jp = []; W.kp = []; W.stamp = ''; W.title = plain(p.q).replace(/^\(\w+\) /, ''); }; });

/* ===================== EXERCISE 1.2 ===================== */
const NULL = ['Null set (φ)', 'Not null'];
const EX12 = [
  {
    ex: 'Ex 1.2', n: 'Q1', q: 'Which of the following are examples of the null set?', scene: 'filter', setup: (W) => { W.rule = 'is anything inside?'; },
    parts: [
      { k: 'tf', q: '(i) Set of odd natural numbers divisible by 2', o: NULL, a: 0, x: 'An odd number is never divisible by 2.', act: async () => { W.rule = 'odd and divisible by 2'; await runFilter(W, [1, 2, 3, 4, 5, 6].map((v) => ({ t: String(v), ok: false })), { fast: 0.15 }); } },
      { k: 'tf', q: '(ii) Set of even prime numbers', o: NULL, a: 1, x: 'It is {2}.', act: async () => { W.rule = 'even and prime'; await runFilter(W, [1, 2, 3, 4, 5, 6].map((v) => ({ t: String(v), ok: v === 2 })), { fast: 0.15 }); } },
      { k: 'tf', q: '(iii) {x : x is a natural number, x < 5 and x > 7}', o: NULL, a: 0, x: 'No number is both below 5 and above 7.' },
      { k: 'tf', q: '(iv) {y : y is a point common to any two parallel lines}', o: NULL, a: 0, x: 'Parallel lines never meet.' },
    ],
    w: ['(i), (iii), (iv) are null sets. (ii) = {2} is not.'],
  },
  {
    ex: 'Ex 1.2', n: 'Q2', q: 'Which of the following sets are finite or infinite?', scene: 'board',
    parts: [['(i) The set of months of a year', 0, '12 months.'], ['(ii) {1, 2, 3, …}', 1, 'The dots never end.'], ['(iii) {1, 2, 3, …, 99, 100}', 0, '100 elements.'], ['(iv) The set of positive integers greater than 100', 1, '101, 102, … forever.'], ['(v) The set of prime numbers less than 99', 0, 'Only 25 primes are below 99.']].map(([q, a, x]) => ({ k: 'tf', q, o: FI, a, x })),
    w: ['Finite: (i), (iii), (v). Infinite: (ii), (iv).'],
  },
  {
    ex: 'Ex 1.2', n: 'Q3', q: 'State whether each set is finite or infinite.', scene: 'plane', setup: (W) => planeView(W, -5, 5, -3.5, 3.5),
    parts: [
      { k: 'tf', q: '(i) The set of lines which are parallel to the x-axis', o: FI, a: 1, x: 'y = c for every real c: infinitely many.', act: async () => { for (let i = 0; i < 14; i++) { const c = -3.25 + i * 0.5; W.curves.push({ f: () => c, col: C.sora, p: 0, w: 2 }); gsap.to(W.curves[i], { p: 1, duration: 0.3 }); SFX.tick(); await wait(0.06); } W.caption = 'y = c for every real c …'; } },
      { k: 'tf', q: '(ii) The set of letters in the English alphabet', o: FI, a: 0, x: '26 letters.' },
      { k: 'tf', q: '(iii) The set of numbers which are multiples of 5', o: FI, a: 1, x: '5, 10, 15, … never stops.' },
      { k: 'tf', q: '(iv) The set of animals living on the earth', o: FI, a: 0, x: 'Huge, but a definite number at any time.' },
      { k: 'tf', q: '(v) The set of circles passing through the origin (0, 0)', o: FI, a: 1, x: 'Any centre (a, b) works with radius √(a² + b²).', pre: () => { W.curves = []; W.caption = ''; }, act: async () => { for (let i = 0; i < 10; i++) { const a = Math.cos(i) * (0.6 + i * 0.2), b = Math.sin(i * 1.7) * (0.5 + i * 0.15), r = Math.hypot(a, b); W.curves.push({ f: (x) => b + Math.sqrt(Math.max(0, r * r - (x - a) ** 2)), x0: a - r, x1: a + r, col: C.beni, w: 2, p: 0 }, { f: (x) => b - Math.sqrt(Math.max(0, r * r - (x - a) ** 2)), x0: a - r, x1: a + r, col: C.beni, w: 2, p: 0 }); gsap.to(W.curves.slice(-2), { p: 1, duration: 0.3 }); SFX.tick(); await wait(0.08); } W.pts.push({ x: 0, y: 0, t: 'O', col: C.ink }); } },
    ],
    w: ['Infinite: (i), (iii), (v). Finite: (ii), (iv).'],
  },
  {
    ex: 'Ex 1.2', n: 'Q4', q: 'In the following, state whether A = B or not.', scene: 'bag',
    parts: [
      { pre: () => bagSet(W, [{ label: 'A', items: ['a', 'b', 'c', 'd'] }, { label: 'B', items: ['d', 'c', 'b', 'a'] }]), k: 'tf', q: '(i) A = {a, b, c, d}, B = {d, c, b, a}', o: EQ, a: 0, x: 'Same four letters, different order.' },
      { pre: () => bagSet(W, [{ label: 'A', items: [4, 8, 12, 16] }, { label: 'B', items: [8, 4, 16, 18] }]), k: 'tf', q: '(ii) A = {4, 8, 12, 16}, B = {8, 4, 16, 18}', o: EQ, a: 1, x: '12 ∈ A but 12 ∉ B (and 18 ∈ B, 18 ∉ A).', act: async () => { bagHL(W, 0, [12]); bagHL(W, 1, [18]); } },
      { pre: () => bagSet(W, [{ label: 'A', items: [2, 4, 6, 8, 10] }, { label: 'B = positive even x ≤ 10', items: [2, 4, 6, 8, 10], hide: true }]), k: 'tf', q: '(iii) A = {2, 4, 6, 8, 10}, B = {x : x is a positive even integer and x ≤ 10}', o: EQ, a: 0, x: 'B = {2, 4, 6, 8, 10} too.', act: async () => { W.bags[1].items.forEach((it, i) => gsap.to(it, { a: 1, delay: i * 0.1, duration: 0.3 })); } },
      { pre: () => bagSet(W, [{ label: 'A = multiples of 10', items: [10, 20, 30, 40, '…'] }, { label: 'B', items: [10, 15, 20, 25, 30, '…'] }]), k: 'tf', q: '(iv) A = {x : x is a multiple of 10}, B = {10, 15, 20, 25, 30, …}', o: EQ, a: 1, x: '15 ∈ B but 15 is not a multiple of 10.', act: async () => { bagHL(W, 1, [15, 25]); } },
    ],
    w: ['(i) A = B  (ii) A ≠ B  (iii) A = B  (iv) A ≠ B'],
  },
  {
    ex: 'Ex 1.2', n: 'Q5', q: 'Are the following pairs of sets equal? Give reasons.', scene: 'bag',
    parts: [
      { pre: () => bagSet(W, [{ label: 'A', items: [2, 3] }, { label: 'B: x² + 5x + 6 = 0', items: [] }]), k: 'mcq', q: '(i) Solve x² + 5x + 6 = 0. B = ?', o: ['{2, 3}', '{−2, −3}', '{−2, 3}', '{2, −3}'], a: 1, x: '(x + 2)(x + 3) = 0 gives x = −2, −3.', act: async () => { await bagFill(W, 1, [-2, -3]); } },
      { k: 'tf', q: 'So is A = {2, 3} equal to B?', o: EQ, a: 1, x: 'The signs differ: {2, 3} ≠ {−2, −3}.' },
      { pre: () => bagSet(W, [{ label: 'letters of FOLLOW', items: [] }, { label: 'letters of WOLF', items: [] }]), k: 'tf', q: '(ii) A = letters of FOLLOW, B = letters of WOLF. Equal?', o: EQ, a: 0, x: 'Both are {F, O, L, W}.', act: async () => { for (const c of 'FOLLOW') { await bagDrop(W.bags[0], c); await wait(0.03); } for (const c of 'WOLF') { await bagDrop(W.bags[1], c); await wait(0.03); } } },
    ],
    w: ['(i) Not equal: B = {−2, −3} ≠ {2, 3}.', '(ii) Equal: both are {F, O, L, W}.'],
  },
  {
    ex: 'Ex 1.2', n: 'Q6', q: 'From the sets below, select equal sets: A = {2, 4, 8, 12}, B = {1, 2, 3, 4}, C = {4, 8, 12, 14}, D = {3, 1, 4, 2}, E = {−1, 1}, F = {0, a}, G = {1, −1}, H = {0, 1}', scene: 'bag', setup: (W) => bagSet(W, [{ label: 'B', items: [1, 2, 3, 4], size: 12 }, { label: 'D', items: [3, 1, 4, 2], size: 12 }, { label: 'E', items: [-1, 1], size: 12 }, { label: 'G', items: [1, -1], size: 12 }]),
    parts: [{ k: 'pick', q: 'Tap every equal pair', brace: false, pool: ['A = C', 'B = D', 'E = G', 'F = H', 'A = B', 'E = H'], a: ['B = D', 'E = G'], x: 'B = D = {1, 2, 3, 4} and E = G = {−1, 1}.' }],
    w: ['B = D and E = G.'],
  },
];

/* ===================== EXERCISE 1.3 ===================== */
const EX13 = [
  {
    ex: 'Ex 1.3', n: 'Q1', q: 'Fill in ⊂ or ⊄ in the blank spaces.', scene: 'bag',
    parts: [
      { pre: () => bagSet(W, [{ label: 'left', items: [2, 3, 4] }, { label: 'right', items: [1, 2, 3, 4, 5] }]), k: 'tf', q: '(i) {2, 3, 4} ___ {1, 2, 3, 4, 5}', o: SUB, a: 0, x: '2, 3, 4 are all there.', act: async () => bagHL(W, 1, [2, 3, 4]) },
      { pre: () => bagSet(W, [{ label: 'left', items: ['a', 'b', 'c'] }, { label: 'right', items: ['b', 'c', 'd'] }]), k: 'tf', q: '(ii) {a, b, c} ___ {b, c, d}', o: SUB, a: 1, x: 'a is missing on the right.', act: async () => bagHL(W, 0, ['a']) },
      { k: 'tf', q: '(iii) {x : x is a student of Class XI of your school} ___ {x : x is a student of your school}', o: SUB, a: 0, x: 'Every Class XI student is a student of the school.' },
      { k: 'tf', q: '(iv) {x : x is a circle in the plane} ___ {x : x is a circle in the same plane with radius 1 unit}', o: SUB, a: 1, x: 'A circle of radius 2 is not in the right-hand set.' },
      { k: 'tf', q: '(v) {x : x is a triangle in a plane} ___ {x : x is a rectangle in the plane}', o: SUB, a: 1, x: 'A triangle is never a rectangle.' },
      { k: 'tf', q: '(vi) {x : x is an equilateral triangle in a plane} ___ {x : x is a triangle in the same plane}', o: SUB, a: 0, x: 'Every equilateral triangle is a triangle.' },
      { k: 'tf', q: '(vii) {x : x is an even natural number} ___ {x : x is an integer}', o: SUB, a: 0, x: 'Even natural numbers are integers.' },
    ],
    w: ['(i) ⊂ (ii) ⊄ (iii) ⊂ (iv) ⊄ (v) ⊄ (vi) ⊂ (vii) ⊂'],
  },
  {
    ex: 'Ex 1.3', n: 'Q2', q: 'Examine whether the following statements are true or false.', scene: 'bag',
    parts: [
      { pre: () => bagSet(W, [{ label: '{a, b}', items: ['a', 'b'] }, { label: '{b, c, a}', items: ['b', 'c', 'a'] }]), k: 'tf', q: '(i) {a, b} ⊄ {b, c, a}', a: false, x: 'a and b are both in {b, c, a}, so {a, b} ⊂ it. The statement is false.' },
      { k: 'tf', q: '(ii) {a, e} ⊂ {x : x is a vowel in the English alphabet}', a: true, x: 'a and e are vowels.' },
      { pre: () => bagSet(W, [{ label: '{1, 2, 3}', items: [1, 2, 3] }, { label: '{1, 3, 5}', items: [1, 3, 5] }]), k: 'tf', q: '(iii) {1, 2, 3} ⊂ {1, 3, 5}', a: false, x: '2 ∉ {1, 3, 5}.', act: async () => bagHL(W, 0, [2]) },
      { pre: () => bagSet(W, [{ label: '{a}', items: ['a'] }, { label: '{a, b, c}', items: ['a', 'b', 'c'] }]), k: 'tf', q: '(iv) {a} ⊂ {a, b, c}', a: true, x: 'a ∈ {a, b, c}.' },
      { k: 'tf', q: '(v) {a} ∈ {a, b, c}', a: false, x: 'The elements are a, b, c. The SET {a} is not one of them. (a ∈ {a, b, c} is true.)' },
      { pre: () => bagSet(W, [{ label: 'even natural < 6', items: [2, 4] }, { label: 'natural divisors of 36', items: [1, 2, 3, 4, 6, 9, 12, 18, 36], size: 12 }]), k: 'tf', q: '(vi) {x : x is an even natural number less than 6} ⊂ {x : x is a natural number which divides 36}', a: true, x: '{2, 4}: both divide 36.', act: async () => bagHL(W, 1, [2, 4]) },
    ],
    w: ['(i) False (ii) True (iii) False (iv) True (v) False (vi) True'],
  },
  {
    ex: 'Ex 1.3', n: 'Q3', q: 'Let A = {1, 2, {3, 4}, 5}. Which of the following statements are incorrect and why?', scene: 'bag', setup: (W) => bagSet(W, [{ label: 'A', items: [1, 2, '{3, 4}', 5] }]),
    kim: 'Careful: {3, 4} is ONE element of A. 3 alone is not in A.',
    parts: [
      ['(i) {3, 4} ⊂ A', 1, '3 ∉ A (only the set {3, 4} is), so incorrect.'], ['(ii) {3, 4} ∈ A', 0, '{3, 4} is an element of A. Correct.'], ['(iii) {{3, 4}} ⊂ A', 0, 'Its only element {3, 4} is in A. Correct.'],
      ['(iv) 1 ∈ A', 0, 'Correct.'], ['(v) 1 ⊂ A', 1, '1 is an element, not a set. Write {1} ⊂ A or 1 ∈ A.'], ['(vi) {1, 2, 5} ⊂ A', 0, '1, 2, 5 are all elements of A. Correct.'],
      ['(vii) {1, 2, 5} ∈ A', 1, '{1, 2, 5} is not one of the four elements of A.'], ['(viii) {1, 2, 3} ⊂ A', 1, '3 ∉ A.'], ['(ix) φ ∈ A', 1, 'φ is not an element of A.'],
      ['(x) φ ⊂ A', 0, 'φ is a subset of every set. Correct.'], ['(xi) {φ} ⊂ A', 1, 'That needs φ ∈ A, which is false.'],
    ].map(([q, a, x]) => ({ k: 'tf', q, o: ['Correct', 'Incorrect'], a, x, time: 15 })),
    w: ['Incorrect: (i) 3 ∉ A; (v) 1 is not a set; (vii) {1, 2, 5} ∉ A; (viii) 3 ∉ A; (ix) φ ∉ A; (xi) φ ∉ A.', 'Correct: (ii), (iii), (iv), (vi), (x).'],
  },
  ...[['(i)', ['a'], ['φ', '{a}', 'a', '{φ}']], ['(ii)', ['a', 'b'], ['φ', '{a}', '{b}', '{a, b}', '{b, a, b}', 'a']], ['(iii)', [1, 2, 3], ['φ', '{1}', '{2}', '{3}', '{1, 2}', '{1, 3}', '{2, 3}', '{1, 2, 3}', '{4}', '1']], ['(iv)', [], ['φ', '{φ}', '{0}', '0']]].map(([p, els, pool]) => {
    const ans = [...Array(1 << els.length).keys()].map((m) => subsetLabel(els, m)).map((s) => s.replace(/\{(.+)\}/, (m, g) => '{' + g + '}'));
    return { ex: 'Ex 1.3', n: 'Q4 ' + p, q: 'Write down all the subsets of ' + (els.length ? '{' + els.join(', ') + '}' : 'φ'), scene: 'power', setup: (W) => { W.note = 'subsets of ' + (els.length ? '{' + els.join(', ') + '}' : 'φ'); }, parts: [{ k: 'pick', brace: false, q: 'Tap every subset', pool, a: ans, x: ans.length + ' subsets: ' + ans.join(', ') + '.', act: async () => { await powerDeal(W, els); W.note = '2^' + els.length + ' = ' + (1 << els.length) + ' subsets'; } }], w: ['Subsets: ' + ans.join(', ')] };
  }),
  ...[['(i)', '{x : x ∈ R, −4 < x ≤ 6}', { a: -4, b: 6, lc: false, rc: true }], ['(ii)', '{x : x ∈ R, −12 < x < −10}', { a: -12, b: -10, lc: false, rc: false }], ['(iii)', '{x : x ∈ R, 0 ≤ x < 7}', { a: 0, b: 7, lc: true, rc: false }], ['(iv)', '{x : x ∈ R, 3 ≤ x ≤ 4}', { a: 3, b: 4, lc: true, rc: true }]].map(([p, s, ans]) => ({ ex: 'Ex 1.3', n: 'Q5 ' + p, q: 'Write as an interval: ' + s, scene: 'numline', parts: [ivPart('Build ' + s, ans, { lo: ans.a - 3, hi: ans.b + 3, start: { a: ans.a - 1, b: ans.b + 1, lc: !ans.lc, rc: !ans.rc } })], w: [s + ' = ' + ivText(ans)] })),
  ...[['(i)', '(−3, 0)', 0], ['(ii)', '[6, 12]', 1], ['(iii)', '(6, 12]', 2], ['(iv)', '[−23, 5)', 3]].map(([p, iv, k]) => {
    const O = [['{x : x ∈ R, −3 < x < 0}', '{x : x ∈ R, −3 ≤ x ≤ 0}', '{x : x ∈ R, −3 < x ≤ 0}', '{x : x ∈ Z, −3 < x < 0}'], ['{x : x ∈ R, 6 < x < 12}', '{x : x ∈ R, 6 ≤ x ≤ 12}', '{x : x ∈ R, 6 ≤ x < 12}', '{x : x ∈ N, 6 ≤ x ≤ 12}'], ['{x : x ∈ R, 6 < x ≤ 12}', '{x : x ∈ R, 6 ≤ x < 12}', '{x : x ∈ R, 6 < x < 12}', '{x : x ∈ R, 6 ≤ x ≤ 12}'], ['{x : x ∈ R, −23 < x < 5}', '{x : x ∈ R, −23 < x ≤ 5}', '{x : x ∈ R, −23 ≤ x ≤ 5}', '{x : x ∈ R, −23 ≤ x < 5}']][k];
    const a = [0, 1, 0, 3][k]; const seg = [{ a: -3, b: 0, lc: false, rc: false }, { a: 6, b: 12, lc: true, rc: true }, { a: 6, b: 12, lc: false, rc: true }, { a: -23, b: 5, lc: true, rc: false }][k];
    return { ex: 'Ex 1.3', n: 'Q6 ' + p, q: 'Write ' + iv + ' in set-builder form.', scene: 'numline', setup: (W) => { Object.assign(W.nl, { lo: seg.a - 3, hi: seg.b + 3, step: seg.b - seg.a > 12 ? 2 : 1, label: seg.b - seg.a > 12 ? 4 : 1 }); MINI.numline.fit(W); W.segs.push(Object.assign({ p: 1, t: iv }, seg)); }, parts: [{ k: 'mcq', q: iv + ' = ?', o: O, a, x: 'Round bracket → strict <, square bracket → ≤.' }], w: [iv + ' = ' + O[a]] };
  }),
  { ex: 'Ex 1.3', n: 'Q7', q: 'What universal set(s) would you propose for (i) the set of right triangles, (ii) the set of isosceles triangles?', scene: 'board', parts: [{ k: 'mcq', q: '(i) Right triangles', o: ['The set of all triangles in the plane', 'The set of equilateral triangles', 'The set of right triangles with a 45° angle', 'φ'], a: 0, x: 'U must contain every right triangle.' }, { k: 'mcq', q: '(ii) Isosceles triangles', o: ['The set of equilateral triangles', 'The set of all triangles in the plane', 'The set of right triangles', 'The set of scalene triangles'], a: 1, x: 'All triangles (or all polygons) work as U.' }], w: ['(i) and (ii): the set of all triangles in the plane (or all polygons).'] },
  {
    ex: 'Ex 1.3', n: 'Q8', q: 'A = {1, 3, 5}, B = {2, 4, 6}, C = {0, 2, 4, 6, 8}. Which can be a universal set for all three?', scene: 'bag', setup: (W) => bagSet(W, [{ label: 'A ∪ B ∪ C', items: [0, 1, 2, 3, 4, 5, 6, 8] }]),
    kim: 'U must contain A ∪ B ∪ C = {0, 1, 2, 3, 4, 5, 6, 8}.',
    parts: [['(i) {0, 1, 2, 3, 4, 5, 6}', 1, '8 is missing.'], ['(ii) φ', 1, 'Empty: holds nothing.'], ['(iii) {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10}', 0, 'Contains every element.'], ['(iv) {1, 2, 3, 4, 5, 6, 7, 8}', 1, '0 is missing.']].map(([q, a, x]) => ({ k: 'tf', q, o: ['Can be U', 'Cannot'], a, x })),
    w: ['Only (iii) {0, 1, 2, …, 10} contains A, B and C.'],
  },
];

/* ===================== EXERCISE 1.4 ===================== */
const A4 = [1, 2, 3, 4], B4 = [3, 4, 5, 6], C4 = [5, 6, 7, 8], D4 = [7, 8, 9, 10];
const A6 = [3, 5, 7, 9, 11], B6 = [7, 9, 11, 13], C6 = [11, 13, 15], D6 = [15, 17];
const A9 = [3, 6, 9, 12, 15, 18, 21], B9 = [4, 8, 12, 16, 20], C9 = [2, 4, 6, 8, 10, 12, 14, 16], D9 = [5, 10, 15, 20];
const U2 = (a, b) => a || b, I2 = (a, b) => a && b, M2 = (a, b) => a && !b;
const EX14 = [
  opQ('Ex 1.4', 'Q1 (i)', { X: [1, 3, 5], Y: [1, 2, 3] }, 'X ∪ Y', U2),
  opQ('Ex 1.4', 'Q1 (ii)', { A: ['a', 'e', 'i', 'o', 'u'], B: ['a', 'b', 'c'] }, 'A ∪ B', U2),
  { ex: 'Ex 1.4', n: 'Q1 (iii)', q: 'A = {x : x is a natural number and multiple of 3}, B = {x : x is a natural number less than 6}. Find A ∪ B.', scene: 'venn', setup: (W) => vennLoad(W, { A: [3, 6, 9, 12, '…'], B: [1, 2, 3, 4, 5] }), parts: [{ k: 'mcq', q: 'A ∪ B = ?', o: ['{1, 2, 3, 4, 5, 6, 9, 12, …}', '{3}', '{1, 2, 4, 5}', '{3, 6, 9, …}'], a: 0, x: '{x : x = 1, 2, 4, 5 or a multiple of 3}.', act: async () => vennShade(W, regionsWhere(W, U2)) }], w: ['A ∪ B = {1, 2, 4, 5, 3, 6, 9, 12, …} = {x : x = 1, 2, 4, 5 or a multiple of 3}'] },
  opQ('Ex 1.4', 'Q1 (iv)', { A: [2, 3, 4, 5, 6], B: [7, 8, 9] }, 'A ∪ B', U2, { q: 'A = {x : x ∈ N, 1 < x ≤ 6} = {2, …, 6}, B = {x : x ∈ N, 6 < x < 10} = {7, 8, 9}. Find A ∪ B.', lay: 'disjoint' }),
  opQ('Ex 1.4', 'Q1 (v)', { A: [1, 2, 3], B: [] }, 'A ∪ B', U2, { q: 'A = {1, 2, 3}, B = φ. Find A ∪ B.' }),
  { ex: 'Ex 1.4', n: 'Q2', q: 'Let A = {a, b}, B = {a, b, c}. Is A ⊂ B? What is A ∪ B?', scene: 'venn', setup: (W) => vennLoad(W, { B: ['a', 'b', 'c'], A: ['a', 'b'] }, { lay: 'subset' }), parts: [{ k: 'tf', q: 'Is A ⊂ B?', o: ['Yes', 'No'], a: 0, x: 'a and b are in B.' }, { k: 'pick', q: 'A ∪ B = ?', pool: ['a', 'b', 'c'], a: ['a', 'b', 'c'], x: 'A ∪ B = {a, b, c} = B.', act: async () => vennShade(W, regionsWhere(W, U2)) }], w: ['Yes, A ⊂ B. A ∪ B = {a, b, c} = B.'] },
  { ex: 'Ex 1.4', n: 'Q3', q: 'If A and B are two sets such that A ⊂ B, then what is A ∪ B?', scene: 'venn', setup: (W) => { W.lay = 'subset'; W.names = ['B', 'A']; W.toks = []; }, parts: [{ k: 'mcq', q: 'A ⊂ B ⇒ A ∪ B = ?', o: ['A', 'B', 'φ', 'A ∩ B'], a: 1, x: 'A adds nothing new to B.', act: async () => vennShade(W, regionsWhere(W, U2)) }], w: ['A ∪ B = B'] },
  ...[['(i)', 'A ∪ B', { A: A4, B: B4 }], ['(ii)', 'A ∪ C', { A: A4, C: C4 }], ['(iii)', 'B ∪ C', { B: B4, C: C4 }], ['(iv)', 'B ∪ D', { B: B4, D: D4 }]].map(([p, e, s]) => opQ('Ex 1.4', 'Q4 ' + p, s, e, U2)),
  ...[['(v)', 'A ∪ B ∪ C', { A: A4, B: B4, C: C4 }], ['(vi)', 'A ∪ B ∪ D', { A: A4, B: B4, D: D4 }], ['(vii)', 'B ∪ C ∪ D', { B: B4, C: C4, D: D4 }]].map(([p, e, s]) => opQ('Ex 1.4', 'Q4 ' + p, s, e, (a, b, c) => a || b || c)),
  opQ('Ex 1.4', 'Q5 (i)', { X: [1, 3, 5], Y: [1, 2, 3] }, 'X ∩ Y', I2),
  opQ('Ex 1.4', 'Q5 (ii)', { A: ['a', 'e', 'i', 'o', 'u'], B: ['a', 'b', 'c'] }, 'A ∩ B', I2),
  { ex: 'Ex 1.4', n: 'Q5 (iii)', q: 'A = multiples of 3 (natural), B = natural numbers less than 6. Find A ∩ B.', scene: 'venn', setup: (W) => vennLoad(W, { A: [3, 6, 9, 12, '…'], B: [1, 2, 3, 4, 5] }), parts: [{ k: 'pick', q: 'A ∩ B = ?', pool: ['1', '2', '3', '4', '5', '6', '9'], a: ['3'], x: 'Only 3 is a multiple of 3 below 6.', act: async () => vennShade(W, ['11']) }], w: ['A ∩ B = {3}'] },
  opQ('Ex 1.4', 'Q5 (iv)', { A: [2, 3, 4, 5, 6], B: [7, 8, 9] }, 'A ∩ B', I2, { lay: 'disjoint', x: 'No common element: φ.' }),
  opQ('Ex 1.4', 'Q5 (v)', { A: [1, 2, 3], B: [] }, 'A ∩ B', I2, { q: 'A = {1, 2, 3}, B = φ. Find A ∩ B.', x: 'Anything ∩ φ = φ.' }),
  opQ('Ex 1.4', 'Q6 (i)', { A: A6, B: B6 }, 'A ∩ B', I2),
  opQ('Ex 1.4', 'Q6 (ii)', { B: B6, C: C6 }, 'B ∩ C', I2),
  opQ('Ex 1.4', 'Q6 (iii)', { A: A6, C: C6, D: D6 }, 'A ∩ C ∩ D', (a, c, d) => a && c && d, { x: 'Nothing is in all three: φ.' }),
  opQ('Ex 1.4', 'Q6 (iv)', { A: A6, C: C6 }, 'A ∩ C', I2),
  opQ('Ex 1.4', 'Q6 (v)', { B: B6, D: D6 }, 'B ∩ D', I2, { x: 'φ: they share nothing.' }),
  opQ('Ex 1.4', 'Q6 (vi)', { A: A6, B: B6, C: C6 }, 'A ∩ (B ∪ C)', (a, b, c) => a && (b || c)),
  opQ('Ex 1.4', 'Q6 (vii)', { A: A6, D: D6 }, 'A ∩ D', I2, { x: 'φ.' }),
  opQ('Ex 1.4', 'Q6 (viii)', { A: A6, B: B6, D: D6 }, 'A ∩ (B ∪ D)', (a, b, d) => a && (b || d)),
  opQ('Ex 1.4', 'Q6 (ix)', { A: A6, B: B6, C: C6 }, '(A ∩ B) ∩ (B ∪ C)', (a, b, c) => a && b && (b || c)),
  (() => {
    const AD = SET.uni(A6, D6), BC = SET.uni(B6, C6), ans = SET.int(AD, BC); return {
      ex: 'Ex 1.4', n: 'Q6 (x)', q: 'A = {3, 5, 7, 9, 11}, B = {7, 9, 11, 13}, C = {11, 13, 15}, D = {15, 17}. Find (A ∪ D) ∩ (B ∪ C).', scene: 'bag', setup: (W) => bagSet(W, [{ label: 'A ∪ D', items: [] }, { label: 'B ∪ C', items: [] }]),
      parts: [{ k: 'pick', q: 'A ∪ D = ?', pool: NUMS(SET.range(3, 17).filter((x) => x % 2)), a: NUMS(AD), x: SET.str(AD) + '.', act: async () => bagFill(W, 0, AD, 0.05) }, { k: 'pick', q: 'B ∪ C = ?', pool: NUMS(SET.range(3, 17).filter((x) => x % 2)), a: NUMS(BC), x: SET.str(BC) + '.', act: async () => bagFill(W, 1, BC, 0.05) }, { k: 'pick', q: '(A ∪ D) ∩ (B ∪ C) = ?', pool: NUMS(SET.range(3, 17).filter((x) => x % 2)), a: NUMS(ans), x: SET.str(ans) + '.', act: async () => { bagHL(W, 0, ans); bagHL(W, 1, ans); } }],
      w: ['A ∪ D = ' + SET.str(AD) + ', B ∪ C = ' + SET.str(BC), '(A ∪ D) ∩ (B ∪ C) = ' + SET.str(ans)],
    };
  })(),
  {
    ex: 'Ex 1.4', n: 'Q7', q: 'A = natural numbers, B = even natural numbers, C = odd natural numbers, D = prime numbers. Find:', scene: 'venn', setup: (W) => vennLoad(W, { B: [2, 4, 6, 8], C: [1, 3, 5, 7, 9] }, { lay: 'disjoint', names: ['B (even)', 'C (odd)'] }),
    parts: [
      { k: 'mcq', q: '(i) A ∩ B', o: ['A', 'B', 'C', 'φ'], a: 1, x: 'B ⊂ A, so A ∩ B = B.' },
      { k: 'mcq', q: '(ii) A ∩ C', o: ['A', 'B', 'C', 'φ'], a: 2, x: 'C ⊂ A.' },
      { k: 'mcq', q: '(iii) A ∩ D', o: ['A', 'D', 'φ', '{2}'], a: 1, x: 'Primes are natural numbers: D ⊂ A.' },
      { k: 'mcq', q: '(iv) B ∩ C', o: ['A', 'φ', '{1}', 'D'], a: 1, x: 'No number is both even and odd.' },
      { k: 'mcq', q: '(v) B ∩ D', o: ['φ', '{2}', 'B', '{2, 4}'], a: 1, x: '2 is the only even prime.', act: async () => { W.toks.forEach((t) => { t.hl = t.v === 2 ? 1 : 0; t.dim = t.v === 2 ? 0 : 1; }); SFX.snap(); } },
      { k: 'mcq', q: '(vi) C ∩ D', o: ['D', '{x : x is an odd prime number}', 'φ', 'C'], a: 1, x: 'All primes except 2: 3, 5, 7, 11, …', act: async () => { W.toks.forEach((t) => { const on = [3, 5, 7].includes(t.v); t.hl = on; t.dim = !on; }); SFX.snap(); } },
    ],
    w: ['(i) B (ii) C (iii) D (iv) φ (v) {2} (vi) {x : x is an odd prime number}'],
  },
  {
    ex: 'Ex 1.4', n: 'Q8', q: 'Which of the following pairs of sets are disjoint?', scene: 'venn',
    parts: [
      { pre: () => vennLoad(W, { P: [1, 2, 3, 4], Q: [4, 5, 6] }), k: 'tf', q: '(i) {1, 2, 3, 4} and {x : x ∈ N, 4 ≤ x ≤ 6}', o: ['Disjoint', 'Not disjoint'], a: 1, x: '4 is common.', act: async () => vennShade(W, ['11']) },
      { pre: () => { W.shade = {}; vennLoad(W, { P: ['a', 'e', 'i', 'o', 'u'], Q: ['c', 'd', 'e', 'f'] }); }, k: 'tf', q: '(ii) {a, e, i, o, u} and {c, d, e, f}', o: ['Disjoint', 'Not disjoint'], a: 1, x: 'e is common.', act: async () => vennShade(W, ['11']) },
      { pre: () => { W.shade = {}; vennLoad(W, { E: [-4, -2, 0, 2, 4], O: [-3, -1, 1, 3] }, { lay: 'disjoint' }); }, k: 'tf', q: '(iii) {x : x is an even integer} and {x : x is an odd integer}', o: ['Disjoint', 'Not disjoint'], a: 0, x: 'No integer is both even and odd.' },
    ],
    w: ['Only (iii) is a disjoint pair. (i) share 4, (ii) share e.'],
  },
  ...[['(i)', 'A − B', { A: A9, B: B9 }], ['(ii)', 'A − C', { A: A9, C: C9 }], ['(iii)', 'A − D', { A: A9, D: D9 }], ['(iv)', 'B − A', { B: B9, A: A9 }], ['(v)', 'C − A', { C: C9, A: A9 }], ['(vi)', 'D − A', { D: D9, A: A9 }], ['(vii)', 'B − C', { B: B9, C: C9 }], ['(viii)', 'B − D', { B: B9, D: D9 }], ['(ix)', 'C − B', { C: C9, B: B9 }], ['(x)', 'D − B', { D: D9, B: B9 }], ['(xi)', 'C − D', { C: C9, D: D9 }], ['(xii)', 'D − C', { D: D9, C: C9 }]].map(([p, e, s]) => opQ('Ex 1.4', 'Q9 ' + p, s, e, M2, { q: 'A = {3, 6, 9, 12, 15, 18, 21}, B = {4, 8, 12, 16, 20}, C = {2, 4, 6, 8, 10, 12, 14, 16}, D = {5, 10, 15, 20}. Find ' + e + '.' })),
  opQ('Ex 1.4', 'Q10 (i)', { X: ['a', 'b', 'c', 'd'], Y: ['f', 'b', 'd', 'g'] }, 'X − Y', M2),
  opQ('Ex 1.4', 'Q10 (ii)', { Y: ['f', 'b', 'd', 'g'], X: ['a', 'b', 'c', 'd'] }, 'Y − X', M2),
  opQ('Ex 1.4', 'Q10 (iii)', { X: ['a', 'b', 'c', 'd'], Y: ['f', 'b', 'd', 'g'] }, 'X ∩ Y', I2),
  { ex: 'Ex 1.4', n: 'Q11', q: 'If R is the set of real numbers and Q is the set of rational numbers, then what is R − Q?', scene: 'nested', setup: (W) => nestSetup(W, []), parts: [{ k: 'mcq', q: 'R − Q = ?', o: ['φ', 'The set of irrational numbers', 'The set of integers', 'R'], a: 1, x: 'Remove every rational: what is left are the irrationals T (√2, π, …).', act: async () => { nestSetup(W, [['√2', 'T'], ['π', 'T'], ['√5', 'T']]); W.toks.forEach((t, i) => gsap.to(t, { x: 2.9 + (i % 2) * 0.9, y: 0.4 - i * 0.6, duration: 0.6, delay: i * 0.15 })); SFX.whoosh(); } }], w: ['R − Q = set of irrational numbers.'] },
  {
    ex: 'Ex 1.4', n: 'Q12', q: 'State whether each statement is true or false. Justify.', scene: 'venn',
    parts: [[[2, 3, 4, 5], [3, 6], false, '3 is common.'], [['a', 'e', 'i', 'o', 'u'], ['a', 'b', 'c', 'd'], false, 'a is common.'], [[2, 6, 10, 14], [3, 7, 11, 15], true, 'Nothing in common.'], [[2, 6, 10], [3, 7, 11], true, 'Nothing in common.']].map(([p, q, ok, x], i) => ({ pre: () => { W.shade = {}; vennLoad(W, { P: p, Q: q }, { lay: ok ? 'disjoint' : 'two' }); }, k: 'tf', q: '(' + ['i', 'ii', 'iii', 'iv'][i] + ') ' + SET.str(p) + ' and ' + SET.str(q) + ' are disjoint sets.', a: ok, x, act: async () => { if (!ok) await vennShade(W, ['11']); } })),
    w: ['(i) False (ii) False (iii) True (iv) True'],
  },
];

/* ===================== EXERCISE 1.5 ===================== */
const U5 = SET.range(1, 9), A5 = [1, 2, 3, 4], B5 = [2, 4, 6, 8], C5 = [3, 4, 5, 6];
const UL = 'abcdefgh'.split('');
const EX15 = [
  opQ('Ex 1.5', 'Q1 (i)', { A: A5 }, 'A′', (a) => !a, { U: U5, lay: 'one' }),
  opQ('Ex 1.5', 'Q1 (ii)', { B: B5 }, 'B′', (b) => !b, { U: U5, lay: 'one' }),
  opQ('Ex 1.5', 'Q1 (iii)', { A: A5, C: C5 }, '(A ∪ C)′', (a, c) => !(a || c), { U: U5 }),
  opQ('Ex 1.5', 'Q1 (iv)', { A: A5, B: B5 }, '(A ∪ B)′', (a, b) => !(a || b), { U: U5 }),
  opQ('Ex 1.5', 'Q1 (v)', { A: A5 }, '(A′)′', (a) => a, { U: U5, lay: 'one', x: '(A′)′ = A = {1, 2, 3, 4}.' }),
  opQ('Ex 1.5', 'Q1 (vi)', { B: B5, C: C5 }, '(B − C)′', (b, c) => !(b && !c), { U: U5, x: 'B − C = {2, 8}; everything else of U is the complement.' }),
  ...[['(i)', 'A', ['a', 'b', 'c']], ['(ii)', 'B', ['d', 'e', 'f', 'g']], ['(iii)', 'C', ['a', 'c', 'e', 'g']], ['(iv)', 'D', ['f', 'g', 'h', 'a']]].map(([p, nm, s]) => opQ('Ex 1.5', 'Q2 ' + p, { [nm]: s }, nm + '′', (a) => !a, { U: UL, lay: 'one' })),
  {
    ex: 'Ex 1.5', n: 'Q3', q: 'Taking the set of natural numbers as the universal set, write down the complements of the following sets.', scene: 'filter', setup: (W) => { W.rule = 'U = N'; },
    parts: [
      ['(i) {x : x is an even natural number}', ['{x : x is an odd natural number}', '{x : x is even}', 'φ', 'N'], 0, (v) => v % 2 === 0],
      ['(ii) {x : x is an odd natural number}', ['{x : x is a prime}', '{x : x is an even natural number}', 'φ', '{1}'], 1, (v) => v % 2 === 1],
      ['(iii) {x : x is a positive multiple of 3}', ['{x : x ∈ N and x is not a multiple of 3}', '{x : x is a multiple of 6}', '{1, 2}', '{x : x is odd}'], 0, (v) => v % 3 === 0],
      ['(iv) {x : x is a prime number}', ['{x : x is odd}', '{x : x is a positive composite number or x = 1}', '{x : x is composite}', 'φ'], 1, (v) => [2, 3, 5, 7, 11].includes(v)],
      ['(v) {x : x is a natural number divisible by 3 and 5}', ['{x : x is not divisible by 3}', '{x : x is not divisible by 5}', '{x : x ∈ N and x is not divisible by 15}', '{x : x is divisible by 3 or 5}'], 2, (v) => v % 15 === 0],
      ['(vi) {x : x is a perfect square}', ['{x : x ∈ N and x is not a perfect square}', '{x : x is a perfect cube}', '{2, 3}', 'φ'], 0, (v) => [1, 4, 9].includes(v)],
      ['(vii) {x : x is a perfect cube}', ['{x : x is a perfect square}', '{x : x ∈ N and x is not a perfect cube}', '{x : x is odd}', '{1, 8}'], 1, (v) => [1, 8].includes(v)],
      ['(viii) {x : x + 5 = 8}', ['{3}', '{x : x ∈ N and x ≠ 3}', 'φ', 'N'], 1, (v) => v === 3],
      ['(ix) {x : 2x + 5 = 9}', ['{x : x ∈ N and x ≠ 2}', '{2}', '{x : x ≠ 9}', 'φ'], 0, (v) => v === 2],
      ['(x) {x : x ≥ 7}', ['{7, 8, 9, …}', '{x : x ∈ N and x < 7}', '{x : x ≤ 7}', '{1, 2, 3, 4, 5}'], 1, (v) => v >= 7],
      ['(xi) {x : x ∈ N and 2x + 1 > 10}', ['{x : x ∈ N and x ≤ 9/2}', '{x : x > 9/2}', '{1, 2, 3, 4, 5}', 'φ'], 0, (v) => 2 * v + 1 > 10],
    ].map(([q, o, a, inA]) => ({ k: 'mcq', q: 'Complement of ' + q, o, a, x: plain(o[a]) + '.', time: 30, act: async () => { W.rule = 'in the complement?'; await runFilter(W, SET.range(1, 12).map((v) => ({ t: String(v), ok: !inA(v) })), { fast: 0.08 }); } })),
    w: ['(i) odd naturals (ii) even naturals (iii) not multiples of 3 (iv) composites and 1 (v) not divisible by 15 (vi) not perfect squares (vii) not perfect cubes (viii) N − {3} (ix) N − {2} (x) {1, 2, 3, 4, 5, 6} (xi) {x ∈ N : x ≤ 9/2} = {1, 2, 3, 4}'],
  },
  (() => {
    const U = SET.range(1, 9), A = [2, 4, 6, 8], B = [2, 3, 5, 7]; const P = NUMS(U);
    const c = (s) => SET.dif(U, s);
    return {
      ex: 'Ex 1.5', n: 'Q4', q: 'U = {1, …, 9}, A = {2, 4, 6, 8}, B = {2, 3, 5, 7}. Verify (i) (A ∪ B)′ = A′ ∩ B′ (ii) (A ∩ B)′ = A′ ∪ B′.', scene: 'venn', setup: (W) => vennLoad(W, { A, B }, { U }),
      parts: [
        { k: 'pick', q: 'A ∪ B', pool: P, a: NUMS(SET.uni(A, B)), x: SET.str(SET.uni(A, B)) },
        { k: 'pick', q: '(A ∪ B)′', pool: P, a: NUMS(c(SET.uni(A, B))), x: SET.str(c(SET.uni(A, B))), act: async () => vennShade(W, ['00']) },
        { k: 'pick', q: 'A′', pool: P, a: NUMS(c(A)), x: SET.str(c(A)) },
        { k: 'pick', q: 'B′', pool: P, a: NUMS(c(B)), x: SET.str(c(B)) },
        { k: 'pick', q: 'A′ ∩ B′', pool: P, a: NUMS(SET.int(c(A), c(B))), x: SET.str(SET.int(c(A), c(B))) + ' = (A ∪ B)′ ✓' },
        { k: 'pick', q: '(A ∩ B)′', pool: P, a: NUMS(c(SET.int(A, B))), x: 'A ∩ B = {2}, so (A ∩ B)′ = ' + SET.str(c(SET.int(A, B))), act: async () => { W.shade = {}; await vennShade(W, regionsWhere(W, (a, b) => !(a && b))); } },
        { k: 'pick', q: 'A′ ∪ B′', pool: P, a: NUMS(SET.uni(c(A), c(B))), x: SET.str(SET.uni(c(A), c(B))) + ' = (A ∩ B)′ ✓' },
      ],
      w: ['(A ∪ B)′ = ' + SET.str(c(SET.uni(A, B))) + ' = A′ ∩ B′', '(A ∩ B)′ = ' + SET.str(c(SET.int(A, B))) + ' = A′ ∪ B′'],
    };
  })(),
  { ex: 'Ex 1.5', n: 'Q5', q: 'Draw an appropriate Venn diagram for each: (i) (A ∪ B)′ (ii) A′ ∩ B′ (iii) (A ∩ B)′ (iv) A′ ∪ B′', scene: 'venn', setup: (W) => { W.toks = []; }, parts: [shadePart('(i) Shade (A ∪ B)′', (a, b) => !(a || b)), shadePart('(ii) Shade A′ ∩ B′', (a, b) => !a && !b, { x: 'Same picture as (i): De Morgan!' }), shadePart('(iii) Shade (A ∩ B)′', (a, b) => !(a && b)), shadePart('(iv) Shade A′ ∪ B′', (a, b) => !a || !b, { x: 'Same picture as (iii).' })], w: ['(i) and (ii): only the outside region. (iii) and (iv): everything except the lens.'] },
  { ex: 'Ex 1.5', n: 'Q6', q: 'Let U be the set of all triangles in a plane. If A is the set of all triangles with at least one angle different from 60°, what is A′?', scene: 'board', kim: 'Not “at least one angle ≠ 60°” means… every angle = 60°!', parts: [{ k: 'mcq', q: 'A′ = ?', o: ['Right triangles', 'Equilateral triangles', 'Isosceles triangles', 'φ'], a: 1, x: 'All three angles 60°: the equilateral triangles.' }], w: ['A′ = the set of all equilateral triangles.'] },
  {
    ex: 'Ex 1.5', n: 'Q7', q: 'Fill in the blanks to make each statement true.', scene: 'venn', setup: (W) => { W.lay = 'one'; W.toks = []; },
    parts: [
      { k: 'mcq', q: '(i) A ∪ A′ = …', o: ['φ', 'U', 'A', 'A′'], a: 1, x: 'Inside plus outside = everything.', act: async () => vennShade(W, ['1', '0']) },
      { k: 'mcq', q: '(ii) φ′ ∩ A = …', o: ['φ', 'U', 'A', 'A′'], a: 2, x: 'φ′ = U and U ∩ A = A.', act: async () => vennShade(W, ['1']) },
      { k: 'mcq', q: '(iii) A ∩ A′ = …', o: ['φ', 'U', 'A', 'A′'], a: 0, x: 'Nothing is inside and outside.', act: async () => vennShade(W, []) },
      { k: 'mcq', q: '(iv) U′ ∩ A = …', o: ['φ', 'U', 'A', 'A′'], a: 0, x: 'U′ = φ, and φ ∩ A = φ.' },
    ],
    w: ['(i) U (ii) A (iii) φ (iv) φ'],
  },
];

/* ===================== MISCELLANEOUS ===================== */
const EXM = [
  { ex: 'Example', n: 'Example 23', q: 'Show that the set of letters needed to spell “CATARACT” and the set of letters needed to spell “TRACT” are equal.', scene: 'bag', setup: (W) => bagSet(W, [{ label: 'X: CATARACT', items: [] }, { label: 'Y: TRACT', items: [] }]), parts: [{ k: 'run', run: async () => { for (const c of 'CATARACT') { await bagDrop(W.bags[0], c); await wait(0.03); } for (const c of 'TRACT') { await bagDrop(W.bags[1], c); await wait(0.03); } } }, { k: 'tf', q: 'Is X = Y?', o: ['Equal', 'Not equal'], a: 0, x: 'X = {C, A, T, R} = Y.' }], w: ['X = {C, A, T, R}, Y = {T, R, A, C}. Every element of X is in Y and vice versa, so X = Y.'] },
  { ex: 'Example', n: 'Example 24', q: 'List all the subsets of the set {−1, 0, 1}.', scene: 'power', parts: [{ k: 'pick', brace: false, q: 'Tap all subsets', pool: ['φ', '{−1}', '{0}', '{1}', '{−1, 0}', '{−1, 1}', '{0, 1}', '{−1, 0, 1}', '{2}', '−1'], a: ['φ', '{−1}', '{0}', '{1}', '{−1, 0}', '{−1, 1}', '{0, 1}', '{−1, 0, 1}'], x: '2³ = 8 subsets.', act: async () => powerDeal(W, [-1, 0, 1]) }], w: ['φ, {−1}, {0}, {1}, {−1, 0}, {−1, 1}, {0, 1}, {−1, 0, 1}'] },
  { ex: 'Example', n: 'Example 25', q: 'Show that A ∪ B = A ∩ B implies A = B.', scene: 'venn', setup: (W) => { W.toks = []; }, parts: [{ k: 'order', q: 'Put the proof in order', s: ['Let a ∈ A. Then a ∈ A ∪ B.', 'Since A ∪ B = A ∩ B, a ∈ A ∩ B, so a ∈ B. Hence A ⊂ B.', 'Similarly, b ∈ B ⇒ b ∈ A ∪ B = A ∩ B ⇒ b ∈ A. Hence B ⊂ A.', 'A ⊂ B and B ⊂ A, therefore A = B.'], x: 'Two-way subset proof.' }], w: ['a ∈ A ⇒ a ∈ A ∪ B = A ∩ B ⇒ a ∈ B, so A ⊂ B.', 'b ∈ B ⇒ b ∈ A ∪ B = A ∩ B ⇒ b ∈ A, so B ⊂ A. Hence A = B.'] },
  {
    ex: 'Misc', n: 'Q1', q: 'Decide which sets are subsets of one another: A = {x : x ∈ R and x² − 8x + 12 = 0}, B = {2, 4, 6}, C = {2, 4, 6, 8, …}, D = {6}.', scene: 'bag', setup: (W) => bagSet(W, [{ label: 'A', items: [] }, { label: 'B', items: [2, 4, 6] }, { label: 'C', items: [2, 4, 6, 8, '…'] }, { label: 'D', items: [6] }]),
    parts: [{ k: 'pick', q: 'First: A = ?', pool: ['2', '4', '6', '8', '−2', '−6'], a: ['2', '6'], x: '(x − 2)(x − 6) = 0.', act: async () => bagFill(W, 0, [2, 6]) }, { k: 'pick', brace: false, q: 'Tap every TRUE statement', pool: ['A ⊂ B', 'A ⊂ C', 'A ⊂ D', 'B ⊂ A', 'B ⊂ C', 'B ⊂ D', 'C ⊂ A', 'C ⊂ B', 'D ⊂ A', 'D ⊂ B', 'D ⊂ C', 'C ⊂ D'], a: ['A ⊂ B', 'A ⊂ C', 'B ⊂ C', 'D ⊂ A', 'D ⊂ B', 'D ⊂ C'], x: 'A ⊂ B, A ⊂ C, B ⊂ C, D ⊂ A, D ⊂ B, D ⊂ C.' }],
    w: ['A = {2, 6}. A ⊂ B, A ⊂ C, B ⊂ C, D ⊂ A, D ⊂ B, D ⊂ C.'],
  },
  {
    ex: 'Misc', n: 'Q2', q: 'True or false? If true prove it, if false give an example.', scene: 'board',
    parts: [
      { k: 'tf', q: '(i) If x ∈ A and A ∈ B, then x ∈ B', a: false, x: 'A = {1}, B = {{1}, 2}: 1 ∈ A, A ∈ B, but 1 ∉ B.' },
      { k: 'tf', q: '(ii) If A ⊂ B and B ∈ C, then A ∈ C', a: false, x: 'A = {1}, B = {1, 2}, C = {{1, 2}, 3}: A ∉ C.' },
      { k: 'tf', q: '(iii) If A ⊂ B and B ⊂ C, then A ⊂ C', a: true, x: 'x ∈ A ⇒ x ∈ B ⇒ x ∈ C.' },
      { k: 'tf', q: '(iv) If A ⊄ B and B ⊄ C, then A ⊄ C', a: false, x: 'A = {1, 2}, B = {0, 6, 8}, C = {0, 1, 2, 6, 9}: A ⊂ C.' },
      { k: 'tf', q: '(v) If x ∈ A and A ⊄ B, then x ∈ B', a: false, x: 'A = {1, 2}, B = {3}, x = 1: x ∉ B.' },
      { k: 'tf', q: '(vi) If A ⊂ B and x ∉ B, then x ∉ A', a: true, x: 'If x were in A it would be in B.' },
    ],
    w: ['(i) F (ii) F (iii) T (iv) F (v) F (vi) T, with the counterexamples above.'],
  },
  { ex: 'Misc', n: 'Q3', q: 'Let A, B, C be sets such that A ∪ B = A ∪ C and A ∩ B = A ∩ C. Show that B = C.', scene: 'venn', setup: (W) => { W.lay = 'three'; W.toks = []; W.names = ['A', 'B', 'C']; }, parts: [{ k: 'order', q: 'Order the proof', s: ['Let x ∈ B. Then x ∈ A ∪ B = A ∪ C, so x ∈ A or x ∈ C.', 'Case x ∈ A: x ∈ A ∩ B = A ∩ C, so x ∈ C.', 'Case x ∈ C: done. Either way x ∈ C, so B ⊂ C.', 'Swapping the roles of B and C gives C ⊂ B. Hence B = C.'], x: 'Case split on x ∈ A.' }], w: ['x ∈ B ⇒ x ∈ A ∪ C. If x ∈ A then x ∈ A ∩ B = A ∩ C ⇒ x ∈ C. So B ⊂ C; similarly C ⊂ B; B = C.'] },
  {
    ex: 'Misc', n: 'Q4', q: 'Show that the four conditions are equivalent: (i) A ⊂ B (ii) A − B = φ (iii) A ∪ B = B (iv) A ∩ B = A', scene: 'venn', setup: (W) => vennLoad(W, { B: [1, 2, 3, 4], A: [2, 3] }, { lay: 'subset', names: ['B', 'A'] }),
    parts: [
      { k: 'mcq', q: '(i) ⇒ (ii): if A ⊂ B, A − B = ?', o: ['A', 'B', 'φ', 'U'], a: 2, x: 'Every element of A is in B, so nothing is left.', act: async () => vennShade(W, []) },
      { k: 'mcq', q: '(ii) ⇒ (iii): A − B = φ means every element of A is in B, so A ∪ B = ?', o: ['A', 'B', 'φ', 'A ∩ B'], a: 1, x: 'A adds nothing to B.', act: async () => vennShade(W, regionsWhere(W, (b, a) => a || b)) },
      { k: 'mcq', q: '(iii) ⇒ (iv): A ∪ B = B gives A ⊂ B, so A ∩ B = ?', o: ['A', 'B', 'φ', 'U'], a: 0, x: 'The common part is all of A.', act: async () => vennShade(W, regionsWhere(W, (b, a) => a && b)) },
      { k: 'mcq', q: '(iv) ⇒ (i): A ∩ B = A means…', o: ['every element of A is in B, so A ⊂ B', 'B ⊂ A', 'A = φ', 'A = B'], a: 0, x: 'x ∈ A = A ∩ B ⇒ x ∈ B. The chain closes.' },
    ],
    w: ['(i)⇒(ii)⇒(iii)⇒(iv)⇒(i), each step as above, so all four are equivalent.'],
  },
  { ex: 'Misc', n: 'Q5', q: 'Show that if A ⊂ B, then C − B ⊂ C − A.', scene: 'venn', setup: (W) => { W.lay = 'three'; W.toks = []; }, parts: [{ k: 'order', q: 'Order the proof', s: ['Let x ∈ C − B. Then x ∈ C and x ∉ B.', 'Since A ⊂ B, x ∉ B ⇒ x ∉ A.', 'So x ∈ C and x ∉ A, i.e. x ∈ C − A.', 'Hence C − B ⊂ C − A.'], x: 'Use the contrapositive of A ⊂ B.' }], w: ['x ∈ C − B ⇒ x ∈ C, x ∉ B ⇒ x ∉ A (as A ⊂ B) ⇒ x ∈ C − A.'] },
  { ex: 'Misc', n: 'Q6', q: 'Show that for any sets A and B, A = (A ∩ B) ∪ (A − B) and A ∪ (B − A) = A ∪ B.', scene: 'venn', setup: (W) => { W.toks = []; }, parts: [shadePart('Shade (A ∩ B) ∪ (A − B)', (a, b) => (a && b) || (a && !b), { x: 'That is exactly circle A.' }), shadePart('Shade A ∪ (B − A)', (a, b) => a || (b && !a), { x: 'That is exactly A ∪ B.' }), { k: 'mcq', q: 'Which law turns (A ∩ B) ∪ (A ∩ B′) into A ∩ (B ∪ B′) = A ∩ U?', o: ['Distributive law', 'Commutative law', 'De Morgan’s law', 'Idempotent law'], a: 0, x: 'Then A ∩ U = A.' }], w: ['(A ∩ B) ∪ (A − B) = (A ∩ B) ∪ (A ∩ B′) = A ∩ (B ∪ B′) = A ∩ U = A.', 'A ∪ (B − A) = A ∪ (B ∩ A′) = (A ∪ B) ∩ (A ∪ A′) = (A ∪ B) ∩ U = A ∪ B.'] },
  { ex: 'Misc', n: 'Q7', q: 'Using properties of sets, show that (i) A ∪ (A ∩ B) = A (ii) A ∩ (A ∪ B) = A.', scene: 'venn', setup: (W) => { W.toks = []; }, parts: [shadePart('(i) Shade A ∪ (A ∩ B)', (a, b) => a || (a && b), { x: 'Just A.' }), { k: 'mcq', q: '(i) A ∪ (A ∩ B) = (A ∪ A) ∩ (A ∪ B) = A ∩ (A ∪ B) = ?', o: ['A', 'B', 'A ∪ B', 'φ'], a: 0, x: 'A ⊂ A ∪ B, so their intersection is A.' }, shadePart('(ii) Shade A ∩ (A ∪ B)', (a, b) => a && (a || b), { x: 'Just A again.' }), { k: 'mcq', q: '(ii) A ∩ (A ∪ B) = (A ∩ A) ∪ (A ∩ B) = A ∪ (A ∩ B) = ?', o: ['A', 'B', 'A ∩ B', 'U'], a: 0, x: 'A ∩ B ⊂ A.' }], w: ['A ∪ (A ∩ B) = (A ∪ A) ∩ (A ∪ B) = A ∩ (A ∪ B) = A', 'A ∩ (A ∪ B) = (A ∩ A) ∪ (A ∩ B) = A ∪ (A ∩ B) = A'] },
  { ex: 'Misc', n: 'Q8', q: 'Show that A ∩ B = A ∩ C need not imply B = C.', scene: 'venn', setup: (W) => vennLoad(W, { A: [0, 1], B: [0, 2, 3], C: [0, 2, 4] }), parts: [{ k: 'mcq', q: 'Which example works?', o: ['A = {0, 1}, B = {0, 2, 3}, C = {0, 2, 4}', 'A = {1}, B = {1}, C = {1}', 'A = φ, B = φ, C = φ', 'A = {1, 2}, B = {1, 2}, C = {1, 2}'], a: 0, x: 'A ∩ B = {0} = A ∩ C, yet B ≠ C.', act: async () => { await vennShade(W, regionsWhere(W, (a, b) => a && b)); await vennShade(W, regionsWhere(W, (a, b, c) => a && c)); } }], w: ['A = {0, 1}, B = {0, 2, 3}, C = {0, 2, 4}: A ∩ B = A ∩ C = {0} but B ≠ C.'] },
  { ex: 'Misc', n: 'Q9', q: 'If A ∩ X = B ∩ X = φ and A ∪ X = B ∪ X for some set X, show that A = B.', scene: 'venn', setup: (W) => { W.lay = 'three'; W.names = ['A', 'B', 'X']; W.toks = []; }, parts: [{ k: 'order', q: 'Order the proof', s: ['A = A ∩ (A ∪ X)', '= A ∩ (B ∪ X)   (since A ∪ X = B ∪ X)', '= (A ∩ B) ∪ (A ∩ X)   (distributive law)', '= (A ∩ B) ∪ φ = A ∩ B', 'Similarly B = B ∩ A. Hence A = B.'], x: 'Exactly the hint’s route.' }], w: ['A = A ∩ (A ∪ X) = A ∩ (B ∪ X) = (A ∩ B) ∪ (A ∩ X) = A ∩ B. Similarly B = A ∩ B. So A = B.'] },
  { ex: 'Misc', n: 'Q10', q: 'Find sets A, B and C such that A ∩ B, B ∩ C and A ∩ C are non-empty sets and A ∩ B ∩ C = φ.', scene: 'venn', setup: (W) => vennLoad(W, { A: [0, 1], B: [1, 2], C: [2, 0] }), parts: [{ k: 'mcq', q: 'Pick a valid example', o: ['A = {0, 1}, B = {1, 2}, C = {2, 0}', 'A = {1}, B = {1}, C = {1}', 'A = {1, 2}, B = {3}, C = {4}', 'A = {0, 1, 2}, B = {0, 1, 2}, C = {0}'], a: 0, x: 'Each pair shares one element, no element is in all three.', act: async () => { await vennShade(W, regionsWhere(W, (a, b, c) => (a && b) || (b && c) || (a && c))); } }], w: ['A = {0, 1}, B = {1, 2}, C = {2, 0}: A ∩ B = {1}, B ∩ C = {2}, A ∩ C = {0}, A ∩ B ∩ C = φ.'] },
];

/* ===================== BOSS QUIZ ===================== */
const BOSS = [
  ['Which is a set?', ['Good movies of 2024', 'Vowels in English', 'Tall students', 'Hard questions'], 1],
  ['n({S, C, H, O, O, L}) = ?', ['6', '5', '4', '1'], 1],
  ['{x : x ∈ N, x² = 4} = ?', ['{2, −2}', '{2}', 'φ', '{4}'], 1],
  ['How many subsets has {a, b, c, d}?', ['8', '12', '16', '4'], 2],
  ['[2, 5) contains…', ['2 and 5', '2, not 5', '5, not 2', 'neither'], 1],
  ['A = {1, 2}, B = {2, 3}. A ∪ B = ?', ['{2}', '{1, 2, 3}', '{1, 3}', '{1, 2, 2, 3}'], 1],
  ['A − B for A = {1, 2, 3}, B = {2, 4} is…', ['{1, 3}', '{4}', '{2}', '{1, 3, 4}'], 0],
  ['(A ∪ B)′ = ?', ['A′ ∪ B′', 'A′ ∩ B′', 'A ∩ B', 'U'], 1],
  ['If A ⊂ B, A ∩ B = ?', ['B', 'A', 'φ', 'U'], 1],
  ['φ′ = ?', ['φ', 'U', '{0}', '{φ}'], 1],
];
LESSONS.splice(1, 0, exLesson({ id: 'ex11', title: 'Exercise 1.1', blurb: 'Sets or not, ∈/∉, roster and set-builder forms.', qs: EX11 }));
LESSONS.splice(3, 0, exLesson({ id: 'ex12', title: 'Exercise 1.2', blurb: 'Null, finite, infinite and equal sets.', face: 'kimmy-curious', qs: EX12 }));
LESSONS.splice(5, 0, exLesson({ id: 'ex13', title: 'Exercise 1.3', blurb: 'Subsets, all subsets, intervals, universal sets.', face: 'kimmy-playful', qs: EX13 }));
LESSONS.splice(7, 0, exLesson({ id: 'ex14', title: 'Exercise 1.4', blurb: 'Union, intersection, difference on live Venn diagrams.', face: 'kimmy-excited', qs: EX14 }));
LESSONS.push(exLesson({ id: 'ex15', title: 'Exercise 1.5', blurb: 'Complements and De Morgan, shaded.', face: 'kimmy-content', qs: EX15 }));
LESSONS.push(exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'Examples 23–25 and the Miscellaneous Exercise: proofs as puzzles.', face: 'jess-thinking', qs: EXM }));
LESSONS.push(lesson({
  id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited',
  steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Chapter 1'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'I scored 7,200. Beat that!'); await cont('Fight'); }, ...BOSS.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); const r = await kahoot(q, o, a, 15); await verdict(r, plain(o[a]) + '.', 'Answer: ' + plain(o[a]) + '.'); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Chapter 1'; }); await summary(['Chapter 1 complete!', 'Sets · Subsets · Venn · Complements', { t: 'n(P(A)) = 2^{n(A)}', eq: true }]); }],
}));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

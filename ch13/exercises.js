/* =========================================================
   CHAPTER 13 · STATISTICS — every exercise question as a sim
   All answers are computed from the data with ST (and compared with the book's key by the test page).
   ========================================================= */
const T2 = (v) => ({ a: v, show: fm2(v), tol: Math.max(0.011, Math.abs(v) * 0.0006) });
const span = (v) => [Math.floor(Math.min(...v) / 5) * 5 - 2, Math.ceil(Math.max(...v) / 5) * 5 + 2];
/* ungrouped data on the dot strip */
function mdU(n, data, about) {
  const c = about === 'median' ? ST.median(data) : ST.mean(data); const [lo, hi] = span(data);
  return { ex: 'Ex 13.1', n, q: 'Mean deviation about the ' + about + ': ' + data.join(', '), scene: 'strip', setup: (W) => { stripSet(W, data, lo, hi, { lock: true, showMean: about === 'mean', showMed: about === 'median', center: about === 'median' ? 'median' : null, ys: data.length > 10 ? 0.42 : 0.55, tick: hi - lo > 40 ? 10 : hi - lo > 20 ? 5 : 2 }); W.drags = []; }, book: BOOK131[n],
    parts: [{ k: 'num', q: about === 'median' ? 'Sort the data. Median M = ?' : 'Mean x̄ = ?', ...T2(c), x: (about === 'median' ? 'M = ' : 'x̄ = ') + fm2(c) + '.' }, { k: 'fields', q: 'Deviations', f: [{ l: 'Σ|xᵢ − ' + (about === 'median' ? 'M' : 'x̄') + '|', ...T2(ST.sumAbs(data, c)) }, { l: 'M.D.', ...T2(ST.md(data, c)) }], x: 'M.D. = ' + fm2(ST.sumAbs(data, c)) + '/' + data.length + ' = ' + fm2(ST.md(data, c)) + '.', pre: async () => { W.mode = 'dev'; SFX.swish(); } }],
    w: [(about === 'median' ? 'M = ' : 'x̄ = ') + fm2(c) + ', M.D. = ' + fm2(ST.md(data, c))], ans: ST.md(data, c) };
}
/* discrete or grouped frequency tables */
function mdF(n, q, xs, fs, about, o = {}) {
  const grouped = !!o.lo; const mid = grouped ? o.lo.map((l) => l + o.h / 2) : xs; const c = about === 'median' ? (grouped ? ST.medianG(o.lo, o.h, fs) : ST.medianD(xs, fs)) : ST.mean(mid, fs);
  return { ex: 'Ex 13.1', n, q, scene: 'freq', setup: (W) => Object.assign(W, grouped ? { lo: o.lo, h: o.h, fs, k: 1 } : { xs, fs, k: 1 }), book: BOOK131[n], kim: o.kim,
    parts: [{ k: 'num', q: 'N = Σfᵢ = ?', a: ST.N(fs), x: 'N = ' + ST.N(fs) + '.', act: growFreq }, { k: 'num', q: about === 'median' ? (grouped ? 'Median M = l + (N/2 − C)/f × h = ?' : 'Median (use cumulative frequencies) = ?') : (grouped ? 'Mean of the mid-points x̄ = ?' : 'x̄ = Σfᵢxᵢ / N = ?'), ...T2(c), x: (about === 'median' ? 'M = ' : 'x̄ = ') + fm2(c) + '.', act: async () => { if (about === 'median') W.med = c; else W.mean = c; SFX.pop(); } }, { k: 'fields', q: 'Weighted deviations', f: [{ l: 'Σfᵢ|xᵢ − ' + (about === 'median' ? 'M' : 'x̄') + '|', ...T2(ST.sumAbs(mid, c, fs)) }, { l: 'M.D.', ...T2(ST.md(mid, c, fs)) }], x: 'M.D. = ' + fm2(ST.md(mid, c, fs)) + '.' }],
    w: [(about === 'median' ? 'M = ' : 'x̄ = ') + fm2(c) + ', M.D. = ' + fm2(ST.md(mid, c, fs))], ans: ST.md(mid, c, fs) };
}
/* mean and variance (and σ) of a frequency table or a list */
function varF(n, q, xs, fs, o = {}) {
  const grouped = !!o.lo; const mid = grouped ? o.lo.map((l) => l + o.h / 2) : xs; const m = ST.mean(mid, fs), v = ST.vr(mid, fs);
  return { ex: o.ex || 'Ex 13.2', n, q, scene: fs ? 'freq' : 'strip', book: BOOK132[n], kim: o.kim,
    setup: fs ? (W) => Object.assign(W, grouped ? { lo: o.lo, h: o.h, fs, k: 1 } : { xs, fs, k: 1 }) : (W) => { const [lo, hi] = span(xs); stripSet(W, xs, lo, hi, { lock: true, ys: 0.45, tick: hi - lo > 40 ? 10 : 2 }); W.drags = []; },
    parts: [...(o.pre || []), { k: 'num', q: 'Mean x̄ = ?', ...T2(m), x: 'x̄ = ' + fm2(m) + '.', act: async () => { if (fs) { await growFreq(W); W.mean = m; } else { W.mode = 'sq'; SFX.swish(); } } }, { k: 'fields', q: o.sd ? 'Variance and standard deviation' : 'Variance', f: [{ l: 'σ²', ...T2(v) }, ...(o.sd ? [{ l: 'σ', ...T2(Math.sqrt(v)) }] : [])], x: 'σ² = ' + fm2(v) + (o.sd ? ', σ = ' + fm2(Math.sqrt(v)) : '') + '.' }],
    w: ['x̄ = ' + fm2(m) + ', σ² = ' + fm2(v) + (o.sd ? ', σ = ' + fm2(Math.sqrt(v)) : '')], ans: [m, v] };
}
/* the book's printed answers, for the test page */
const BOOK131 = { Q1: 3, Q2: 8.4, Q3: 2.33, Q4: 7, Q5: 6.32, Q6: 16, Q7: 3.23, Q8: 5.1, Q9: 157.92, Q10: 11.28, Q11: 10.34, Q12: 7.35 };
const BOOK132 = { Q1: [9, 9.25], Q3: [16.5, 74.25], Q4: [19, 43.4], Q5: [100, 29.09], Q6: [64, 1.69 ** 2], Q7: [107, 2276], Q8: [27, 132], Q9: [93, 105.58], Q10: [43.5, 5.55 ** 2] };

/* ===================== EXERCISE 13.1 ===================== */
const EX131 = [
  mdU('Q1', [4, 7, 8, 9, 10, 12, 13, 17], 'mean'),
  mdU('Q2', [38, 70, 48, 40, 42, 55, 63, 46, 54, 44], 'mean'),
  mdU('Q3', [13, 17, 16, 14, 11, 13, 10, 16, 11, 18, 12, 17], 'median'),
  mdU('Q4', [36, 72, 46, 42, 60, 45, 53, 46, 51, 49], 'median'),
  mdF('Q5', 'Mean deviation about the mean: x = 5, 10, 15, 20, 25 with f = 7, 4, 6, 3, 5.', [5, 10, 15, 20, 25], [7, 4, 6, 3, 5], 'mean'),
  mdF('Q6', 'Mean deviation about the mean: x = 10, 30, 50, 70, 90 with f = 4, 24, 28, 16, 8.', [10, 30, 50, 70, 90], [4, 24, 28, 16, 8], 'mean'),
  mdF('Q7', 'Mean deviation about the median: x = 5, 7, 9, 10, 12, 15 with f = 8, 6, 2, 2, 2, 6.', [5, 7, 9, 10, 12, 15], [8, 6, 2, 2, 2, 6], 'median', { kim: 'N = 26: average the 13th and 14th values.' }),
  mdF('Q8', 'Mean deviation about the median: x = 15, 21, 27, 30, 35 with f = 3, 5, 6, 7, 8.', [15, 21, 27, 30, 35], [3, 5, 6, 7, 8], 'median'),
  mdF('Q9', 'Mean deviation about the mean: income per day 0–100, …, 700–800 (₹) for 4, 8, 9, 10, 7, 5, 4, 3 persons.', null, [4, 8, 9, 10, 7, 5, 4, 3], 'mean', { lo: [0, 100, 200, 300, 400, 500, 600, 700], h: 100 }),
  mdF('Q10', 'Mean deviation about the mean: heights 95–105, …, 145–155 cm for 9, 13, 26, 30, 12, 10 boys.', null, [9, 13, 26, 30, 12, 10], 'mean', { lo: [95, 105, 115, 125, 135, 145], h: 10 }),
  mdF('Q11', 'Mean deviation about the median: marks 0–10, …, 50–60 for 6, 8, 14, 16, 4, 2 girls.', null, [6, 8, 14, 16, 4, 2], 'median', { lo: [0, 10, 20, 30, 40, 50], h: 10 }),
  mdF('Q12', 'Mean deviation about the median age: ages 16–20, 21–25, …, 51–55 for 5, 6, 12, 14, 26, 12, 16, 9 persons.', null, [5, 6, 12, 14, 26, 12, 16, 9], 'median', { lo: [15.5, 20.5, 25.5, 30.5, 35.5, 40.5, 45.5, 50.5], h: 5, kim: 'Make it continuous first: 15.5–20.5, 20.5–25.5, …' }),
];

/* ===================== EXERCISE 13.2 ===================== */
const EX132 = [
  varF('Q1', 'Mean and variance of 6, 7, 10, 12, 13, 4, 8, 12.', [6, 7, 10, 12, 13, 4, 8, 12], null),
  { ex: 'Ex 13.2', n: 'Q2', q: 'Mean and variance of the first n natural numbers.', scene: 'strip', setup: (W) => { stripSet(W, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 0, 11, { lock: true, mode: 'sq' }); W.drags = []; W.cap = 'n = 10 shown'; }, parts: [{ k: 'mcq', q: 'Mean = ?', o: ['(n + 1)/2', 'n/2', 'n(n + 1)/2', '(n − 1)/2'], a: 0 }, { k: 'mcq', q: 'Variance = Σx²/n − x̄² = (n + 1)(2n + 1)/6 − (n + 1)²/4 = ?', o: ['(n² − 1)/12', '(n² + 1)/12', '(n + 1)²/12', 'n²/12'], a: 0 }, { k: 'num', q: 'Check with n = 10: variance = ?', a: 8.25, x: '99/12 = 8.25 ✓' }], w: ['x̄ = (n + 1)/2, σ² = (n² − 1)/12'] },
  varF('Q3', 'Mean and variance of the first 10 multiples of 3.', [3, 6, 9, 12, 15, 18, 21, 24, 27, 30], null),
  varF('Q4', 'Mean and variance: x = 6, 10, 14, 18, 24, 28, 30 with f = 2, 4, 7, 12, 8, 4, 3.', [6, 10, 14, 18, 24, 28, 30], [2, 4, 7, 12, 8, 4, 3]),
  varF('Q5', 'Mean and variance: x = 92, 93, 97, 98, 102, 104, 109 with f = 3, 2, 3, 2, 6, 3, 3.', [92, 93, 97, 98, 102, 104, 109], [3, 2, 3, 2, 6, 3, 3]),
  varF('Q6', 'Mean and standard deviation (short-cut): x = 60, …, 68 with f = 2, 1, 12, 29, 25, 12, 10, 4, 5.', [60, 61, 62, 63, 64, 65, 66, 67, 68], [2, 1, 12, 29, 25, 12, 10, 4, 5], { sd: true, kim: 'Short-cut: yᵢ = xᵢ − 64.' }),
  varF('Q7', 'Mean and variance: classes 0–30, …, 180–210 with f = 2, 3, 5, 10, 3, 5, 2.', null, [2, 3, 5, 10, 3, 5, 2], { lo: [0, 30, 60, 90, 120, 150, 180], h: 30 }),
  varF('Q8', 'Mean and variance: classes 0–10, …, 40–50 with f = 5, 8, 15, 16, 6.', null, [5, 8, 15, 16, 6], { lo: [0, 10, 20, 30, 40], h: 10 }),
  varF('Q9', 'Mean, variance and SD (short-cut): heights 70–75, …, 110–115 cm for 3, 4, 7, 7, 15, 9, 6, 6, 3 children.', null, [3, 4, 7, 7, 15, 9, 6, 6, 3], { lo: [70, 75, 80, 85, 90, 95, 100, 105, 110], h: 5, sd: true }),
  varF('Q10', 'Diameters 33–36, 37–40, 41–44, 45–48, 49–52 mm for 15, 17, 21, 22, 25 circles: SD and mean diameter.', null, [15, 17, 21, 22, 25], { lo: [32.5, 36.5, 40.5, 44.5, 48.5], h: 4, sd: true, kim: 'Continuous classes: 32.5–36.5, 36.5–40.5, …' }),
];

/* ===================== MISCELLANEOUS ===================== */
const EX13M = [
  { ex: 'Misc', n: 'Q1', q: 'Mean 9 and variance 9.25 of eight observations; six are 6, 7, 10, 12, 12, 13. Find the other two.', scene: 'board', parts: [{ k: 'fields', q: 'Sums', f: [{ l: 'x + y', a: 72 - 60 }, { l: 'x² + y²', a: 8 * (9.25 + 81) - (36 + 49 + 100 + 144 + 144 + 169) }], x: 'x + y = 12, x² + y² = 722 − 642 = 80.' }, { k: 'fields', q: 'The two numbers', f: [{ l: 'smaller', a: 4 }, { l: 'larger', a: 8 }], x: '(x − y)² = 160 − 144 = 16 ⇒ 4 and 8.' }], w: ['The remaining observations are 4 and 8'] },
  { ex: 'Misc', n: 'Q2', q: 'Mean 8 and variance 16 of 7 observations; five are 2, 4, 10, 12, 14. Find the other two.', scene: 'board', parts: [{ k: 'fields', q: 'Sums', f: [{ l: 'x + y', a: 56 - 42 }, { l: 'x² + y²', a: 7 * (16 + 64) - (4 + 16 + 100 + 144 + 196) }], x: 'x + y = 14, x² + y² = 560 − 460 = 100.' }, { k: 'fields', q: 'The two numbers', f: [{ l: 'smaller', a: 6 }, { l: 'larger', a: 8 }], x: '(x − y)² = 200 − 196 = 4 ⇒ 6 and 8.' }], w: ['The remaining observations are 6 and 8'] },
  { ex: 'Misc', n: 'Q3', q: 'Mean 8, SD 4 for six observations. Each is multiplied by 3: new mean and SD?', scene: 'board', parts: [{ k: 'fields', q: 'After × 3', f: [{ l: 'mean', a: 24 }, { l: 'SD', a: 12 }], x: 'Both scale by 3 (variance by 9).' }], w: ['New mean 24, new SD 12'] },
  { ex: 'Misc', n: 'Q4', q: 'Prove that ax₁, …, axₙ have mean a x̄ and variance a²σ².', scene: 'board', parts: [{ k: 'order', q: 'Order the proof', s: ['New mean = Σaxᵢ/n = a x̄', 'New deviations: axᵢ − a x̄ = a(xᵢ − x̄)', 'Squares: a²(xᵢ − x̄)²', 'New variance = a² Σ(xᵢ − x̄)²/n = a²σ²'] }], w: ['Mean a x̄, variance a²σ²'] },
  { ex: 'Misc', n: 'Q5', q: 'Mean 10, SD 2 for 20 observations; an observation 8 was wrong. Correct mean and SD if (i) it is omitted (ii) it is replaced by 12.', scene: 'board', parts: [{ k: 'fields', q: 'Original sums', f: [{ l: 'Σx', a: 200 }, { l: 'Σx²', a: 20 * (4 + 100) }], x: 'Σx² = 20(σ² + x̄²) = 2080.' }, { k: 'fields', q: '(i) Omit 8 (19 values)', f: [{ l: 'mean', ...T2(192 / 19) }, { l: 'SD', ...T2(Math.sqrt(2016 / 19 - (192 / 19) ** 2)) }], x: 'Σx = 192, Σx² = 2016.' }, { k: 'fields', q: '(ii) Replace 8 by 12', f: [{ l: 'mean', a: 10.2 }, { l: 'SD', ...T2(Math.sqrt(2160 / 20 - 10.2 ** 2)) }], x: 'Σx = 204, Σx² = 2160.' }], w: ['(i) 10.11, 1.99   (ii) 10.2, 1.99'] },
  { ex: 'Misc', n: 'Q6', q: 'Mean 20, SD 3 for 100 observations; 21, 21 and 18 were incorrect. Mean and SD with them omitted?', scene: 'board', parts: [{ k: 'fields', q: 'Original sums', f: [{ l: 'Σx', a: 2000 }, { l: 'Σx²', a: 100 * (9 + 400) }] }, { k: 'fields', q: 'Remove 21, 21, 18 (97 values)', f: [{ l: 'mean', a: 20 }, { l: 'SD', ...T2(Math.sqrt((40900 - 441 - 441 - 324) / 97 - 400)) }], x: 'Σx = 1940, Σx² = 39694.' }], w: ['Mean 20, SD ≈ 3.04'] },
];

const BOSS13 = [['Range of 3, 9, 4, 12', ['9', '12', '3', '7'], 0], ['Mean of 2, 4, 6', ['4', '6', '12', '3'], 0], ['Median of 1, 3, 3, 8, 10', ['3', '5', '8', '1'], 0], ['M.D. about the mean of 1, 3', ['1', '2', '0', '4'], 0], ['Variance of 2, 2, 2', ['0', '2', '4', '6'], 0], ['σ² = 16 ⇒ σ', ['4', '16', '8', '256'], 0], ['Add 5 to every value: σ', ['unchanged', '+5', '×5', '+25'], 0], ['Multiply every value by 3: σ²', ['×9', '×3', 'unchanged', '+9'], 0], ['Σ(x − c)² is smallest at c =', ['the mean', 'the median', '0', 'the mode'], 0], ['For classes we use the', ['mid-points', 'lower limits', 'upper limits', 'widths'], 0]];
LESSONS.splice(2, 0, exLesson({ id: 'ex131', title: 'Exercise 13.1', blurb: 'All 12 mean-deviation questions: lists, tables, classes.', face: 'kimmy-playful', qs: EX131 }));
LESSONS.splice(4, 0, exLesson({ id: 'ex132', title: 'Exercise 13.2', blurb: 'All 10 mean, variance and SD questions.', face: 'jess-happy', qs: EX132 }));
LESSONS.push(exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 6: missing values, scaling and correcting mistakes.', face: 'jess-thinking', qs: EX13M }));
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Chapter 13'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Spread out!'); await cont('Fight'); }, ...BOSS13.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Chapter 13'; }); await summary(['Chapter 13 complete!', { t: 'σ² = Σfᵢ(xᵢ − x̄)²/N', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

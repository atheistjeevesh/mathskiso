/* =========================================================
   CHAPTER 5 · LINEAR INEQUALITIES — concept lessons (Examples 1–13)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const NL = (lo, hi, step = 1, label) => (W) => { Object.assign(W.nl, { lo, hi, step, label: label || step }); MINI.numline.fit(W); };
async function showSeg(W, seg, d = 0.7) { const s = Object.assign({ p: 0, col: C.beni }, seg); W.segs.push(s); SFX.swish(); await tw(s, { p: 1, duration: d }); return s; }
async function solveIv(q, ans, x, o = {}) { const p = ivPart(q, ans, o); await p.pre(); const r = await ask(p); await p.act(W, r); await verdict(r, x, 'It is ' + ivText(ans) + '. ' + x); return r; }

/* ================= LESSON 1 · WHAT IS AN INEQUALITY ================= */
LESSONS.push(lesson({
  id: 'intro', title: 'Inequalities', blurb: 'Ravi’s rice, Reshma’s pens, strict vs slack, and trial-and-error solutions.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('bars', (W) => { W.max = 240; W.bars = [{ v: 0, lab: 'spent' }, { v: 200, lab: 'has ₹', col: C['matcha-tint'] }]; W.line = { v: 200, t: '₹200' }; });
      await slam('INEQUALITIES', 'Lesson 1 · Sections 5.1–5.2');
      await J('idle', 'Ravi has ₹200. Rice comes in ₹30 packets. If he buys x packets he spends 30x, and 30x < 200.');
      barDrag(W, W.bars[0], { lo: 0, hi: 240, step: 30 });
      await task('Drag the “spent” bar up packet by packet. Find where it crosses ₹200.', () => W.bars[0].v >= 210, (W) => (W.bars[0].v = 210));
      await K('wow', '7 packets is ₹210. Too much!');
      await pickQ('Which values of x make 30x < 200 true? (x = packets)', ['0', '1', '2', '3', '4', '5', '6', '7', '8'], ['0', '1', '2', '3', '4', '5', '6'], 'x = 0, 1, …, 6. That set is the SOLUTION SET.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '40x + 20y ≤ 120'; W.sub = 'Reshma'; });
      await J('idle', 'Reshma: registers at ₹40, pens at ₹20, she has ₹120. 40x + 20y ≤ 120. That ≤ hides two statements: < and =.');
      await quiz('Which is a STRICT inequality?', ['ax + b ≤ 0', 'ax + b > 0', 'ax + by ≥ c', 'ax² + bx + c ≤ 0'], 1, '< and > are strict, ≤ and ≥ are slack.');
      await quiz('Which is NOT linear?', ['3x + 5 < 7', 'x + y ≥ 2', 'ax² + bx + c > 0', '40x + 20y ≤ 120'], 2, 'It has x²: quadratic.');
      await quiz('3 < x < 5 is called a…', ['double inequality', 'slack equation', 'quadratic', 'numerical inequality'], 0, 'x is between 3 and 5.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; });
      await summary([{ t: '<  >  ≤  ≥', eq: true }, 'Strict: < >. Slack: ≤ ≥.', 'A solution makes the inequality TRUE. All of them = the solution set.']);
    },
  ],
}));

/* ================= LESSON 2 · THE TWO RULES ================= */
LESSONS.push(lesson({
  id: 'rules', title: 'The Two Rules', blurb: 'The balance stays tipped when you add; it FLIPS when you multiply by a negative.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('scale', (W) => { W.L = '3'; W.R = '2'; W.sign = '>'; W.tilt = 0.18; });
      await slam('THE TWO RULES', 'Lesson ' + L.num + ' · Section 5.3');
      await J('idle', '3 > 2: the left pan is heavier. Add 5 to both pans.');
      await scaleStep(W, '+5 to both sides', '8', '7', { weight: '+5' });
      await K('happy', 'Still tipped the same way: 8 > 7.');
      const r = await kahoot('Now multiply both sides by −1. 3 > 2 becomes…', ['−3 > −2', '−3 < −2', '−3 = −2', '3 < 2'], 1, 15);
      W.L = '3'; W.R = '2';
      await scaleStep(W, '× (−1) both sides', '−3', '−2', { neg: true });
      await verdict(r, '−3 is LESS than −2. The sign flips.', 'Multiplying by a negative reverses the sign: −3 < −2.');
      await discover('Rule 2: × or ÷ by a NEGATIVE ⇒ flip the sign', 'Rule 1: adding or subtracting the same number keeps the sign.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('scale', (W) => { W.L = '−8'; W.R = '−7'; W.sign = '<'; W.tilt = -0.18; });
      await J('think', '−8 < −7. Multiply by −2.');
      await quiz('Result', ['16 < 14', '16 > 14', '−16 < −14', '16 = 14'], 1, 'Flip! 16 > 14.');
      await scaleStep(W, '× (−2) both sides', '16', '14', { neg: true });
      await cont();
    },
    async function () {
      enterScene('numline', NL(-2, 10));
      exTag('Example 1', '30x < 200');
      await J('idle', 'Divide by 30 (positive, no flip): x < 20/3 ≈ 6.67.');
      intDots(W, -2, 10, (k) => k < 20 / 3);
      await pickQ('(i) x natural: solution set', ['0', '1', '2', '3', '4', '5', '6', '7'], ['1', '2', '3', '4', '5', '6'], 'Natural numbers start at 1.');
      await lightDots(W);
      await quiz('(ii) x an integer: solution set', ['{…, −2, −1, 0, 1, …, 6}', '{1, …, 6}', '{0, …, 6}', '{…, 6, 7}'], 0, 'Every integer below 20/3.');
      await cont();
    },
    async function () {
      enterScene('scale', (W) => { W.L = '5x − 3'; W.R = '3x + 1'; W.sign = '<'; W.tilt = -0.16; });
      exTag('Example 2', '5x − 3 < 3x + 1');
      await scaleStep(W, '+3 both sides', '5x', '3x + 4', { weight: '+3' });
      await scaleStep(W, '−3x both sides', '2x', '4', { weight: '−3x' });
      await scaleStep(W, '÷ 2 (positive)', 'x', '2');
      await quiz('(i) x an integer: solutions', ['{…, −1, 0, 1}', '{…, 0, 1, 2}', '{2, 3, …}', '{0, 1}'], 0, 'Integers below 2.');
      await solveIv('(ii) x real: build the solution set', { a: -INF, b: 2, lc: false, rc: false }, 'x ∈ (−∞, 2).', { lo: -4, hi: 6 });
      await cont();
    },
    async function () {
      enterScene('scale', (W) => { W.L = '4x + 3'; W.R = '6x + 7'; W.sign = '<'; W.tilt = -0.16; });
      exTag('Example 3', '4x + 3 < 6x + 7');
      await scaleStep(W, '−6x and −3 both sides', '−2x', '4', { weight: '−6x' });
      const r = await kahoot('Divide by −2:', ['x < −2', 'x > −2', 'x < 2', 'x > 2'], 1, 15);
      await scaleStep(W, '÷ (−2)', 'x', '−2', { neg: true });
      await verdict(r, 'Dividing by a negative flips < into >.', 'Flip! x > −2.');
      await solveIv('Build the solution set', { a: -2, b: INF, lc: false, rc: false }, '(−2, ∞).', { lo: -6, hi: 4 });
      await cont();
    },
    async function () {
      enterScene('scale', (W) => { W.L = '(5 − 2x)/3'; W.R = 'x/6 − 5'; W.sign = '≤'; W.tilt = -0.12; });
      exTag('Example 4', '(5 − 2x)/3 ≤ x/6 − 5');
      await scaleStep(W, '× 6 (positive)', '2(5 − 2x)', 'x − 30');
      await scaleStep(W, 'expand', '10 − 4x', 'x − 30');
      await scaleStep(W, '−x, −10 both sides', '−5x', '−40', { weight: '−x' });
      await scaleStep(W, '÷ (−5)', 'x', '8', { neg: true });
      await solveIv('Build the solution set', { a: 8, b: INF, lc: true, rc: false }, '[8, ∞): 8 included because of ≥.', { lo: 4, hi: 12 });
      await cont();
    },
    async function () {
      enterScene('numline', NL(-2, 6));
      exTag('Examples 5 & 6', 'graph on the number line');
      await J('idle', '7x + 3 < 5x + 9 ⇒ 2x < 6 ⇒ x < 3. Strict, so a HOLLOW circle at 3, shading to the left.');
      await showSeg(W, { a: -INF, b: 3, lc: false, rc: false, t: 'x < 3' });
      await J('think', '(3x − 4)/2 ≥ (x + 1)/4 − 1 ⇒ 2(3x − 4) ≥ x − 3 ⇒ 5x ≥ 5 ⇒ x ≥ 1. Slack, so a FILLED circle.');
      await showSeg(W, { a: 1, b: INF, lc: true, rc: false, t: 'x ≥ 1', col: C.sora });
      await quiz('A filled dot means the end point is…', ['included', 'excluded', 'infinity', 'zero'], 0, '≤ or ≥.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: '× or ÷ by a negative ⇒ FLIP', eq: true }, 'Add / subtract anything: the sign stays.', 'Hollow dot: < or >.  Filled dot: ≤ or ≥.']);
    },
  ],
}));

/* ================= LESSON 3 · WORD PROBLEMS & DOUBLE INEQUALITIES ================= */
LESSONS.push(lesson({
  id: 'word', title: 'Word Problems & Systems', blurb: 'Marks, odd numbers, double inequalities, systems, °C/°F and mixing acid. Examples 7–13.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('bars', (W) => { W.max = 100; W.bars = [{ v: 62, lab: 'Term 1' }, { v: 48, lab: 'Term 2' }, { v: 40, lab: 'Annual' }]; W.line = { v: 60, t: 'need avg ≥ 60' }; });
      await slam('WORD PROBLEMS', 'Lesson ' + L.num + ' · Miscellaneous Examples');
      exTag('Example 7', 'average of at least 60');
      W.avg = (62 + 48 + 40) / 3; barDrag(W, W.bars[2], { onMove: () => (W.avg = (62 + 48 + W.bars[2].v) / 3) });
      await task('Drag the Annual bar until the blue average reaches the red line', () => W.avg >= 60 - 1e-9, (W) => { W.bars[2].v = 70; W.avg = 60; });
      await numQ('(62 + 48 + x)/3 ≥ 60 ⇒ minimum x = ?', 70, '110 + x ≥ 180 ⇒ x ≥ 70.');
      await cont();
    },
    async function () {
      enterScene('numline', NL(8, 22));
      exTag('Example 8', 'consecutive odd numbers > 10, sum < 40');
      await J('think', 'x > 10 and x + (x + 2) < 40 ⇒ x < 19. So 10 < x < 19 with x odd.');
      intDots(W, 8, 22, (k) => k > 10 && k < 19 && k % 2 === 1); await showSeg(W, { a: 10, b: 19, lc: false, rc: false, t: '10 < x < 19' }); await lightDots(W, 0.15);
      await pickQ('All pairs', ['(9, 11)', '(11, 13)', '(13, 15)', '(15, 17)', '(17, 19)', '(19, 21)'], ['(11, 13)', '(13, 15)', '(15, 17)', '(17, 19)'], 'x = 11, 13, 15, 17.', { brace: false });
      await cont();
    },
    async function () {
      enterScene('numline', NL(-3, 4));
      exTag('Example 9', '−8 ≤ 5x − 3 < 7');
      await J('idle', 'A double inequality: do the same thing to all THREE parts. Add 3: −5 ≤ 5x < 10. Divide by 5.');
      await solveIv('Build the solution', { a: -1, b: 2, lc: true, rc: false }, '−1 ≤ x < 2.', { lo: -3, hi: 4 });
      exTag('Example 10', '−5 ≤ (5 − 3x)/2 ≤ 8');
      await J('think', '× 2: −10 ≤ 5 − 3x ≤ 16. −5: −15 ≤ −3x ≤ 11. ÷ (−3): BOTH signs flip: 5 ≥ x ≥ −11/3.');
      await solveIv('Build the solution', { a: -11 / 3, b: 5, lc: true, rc: true }, '−11/3 ≤ x ≤ 5.', { lo: -5, hi: 7, step: 1, snap: 1 / 3 });
      await cont();
    },
    async function () {
      enterScene('numline', NL(-1, 8));
      exTag('Example 11', 'system: 3x − 7 < 5 + x and 11 − 5x ≤ 1');
      await J('idle', 'Solve each, then keep only what is common.');
      await quiz('3x − 7 < 5 + x gives…', ['x < 6', 'x > 6', 'x < 1', 'x ≤ 6'], 0, '2x < 12.');
      await showSeg(W, { a: -INF, b: 6, lc: false, rc: false, t: 'x < 6', col: C.sora });
      await quiz('11 − 5x ≤ 1 gives…', ['x ≤ 2', 'x ≥ 2', 'x ≥ −2', 'x < 2'], 1, '−5x ≤ −10 ⇒ flip ⇒ x ≥ 2.');
      await showSeg(W, { a: 2, b: INF, lc: true, rc: false, t: 'x ≥ 2', col: C.khaki });
      await solveIv('The common part (bold line in Fig 5.3)', { a: 2, b: 6, lc: true, rc: false }, '2 ≤ x < 6.', { lo: -1, hi: 8 });
      await cont();
    },
    async function () {
      enterScene('thermo', (W) => { W.cLo = 20; W.cHi = 40; W.band = [30, 35]; });
      exTag('Example 12', '30 < C < 35, C = 5(F − 32)/9');
      await J('think', '30 < 5(F − 32)/9 < 35. Multiply all parts by 9/5: 54 < F − 32 < 63.');
      const r = await fields('So F lies between…', [{ l: 'F >', a: 86 }, { l: 'F <', a: 95 }]); await verdict(r, '86 < F < 95.', '86°F < F < 95°F.');
      await cont();
    },
    async function () {
      enterScene('tank', (W) => { W.base = 600; W.pct0 = 12; W.pct1 = 30; W.lo = 15; W.hi = 18; W.cap = 1300; });
      exTag('Example 13', '600 L of 12% + x L of 30%, want 15% to 18%');
      await J('idle', 'Pour in the 30% solution. Watch the mixture percentage.');
      slider('x (litres of 30% added)', 0, 400, 10, 0, (v) => v + ' L', (v) => (W.add = v), 200);
      await task('Find an amount that lands the mix between 15% and 18%', () => { const c = MINI.tank.conc(W); return c > 15 && c < 18; }, (W) => (W.add = 200));
      const r = await fields('Exact range: x is between…', [{ l: 'x >', a: 120 }, { l: 'x <', a: 300 }]); await verdict(r, '30x + 7200 > 15x + 9000 ⇒ x > 120; 30x + 7200 < 18x + 10800 ⇒ x < 300.', '120 < x < 300 litres.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; });
      await summary([{ t: 'Double inequality: do it to all three parts', eq: true }, 'System: solve each, keep the overlap.', 'Word problems: name x, write the inequality, solve, check it makes sense.']);
    },
  ],
}));

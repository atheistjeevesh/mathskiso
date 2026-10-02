/* =========================================================
   CLASS 12 · CHAPTER 12 · LINEAR PROGRAMMING — lessons (Examples 1–5), Exercise 12.1
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const DEAL = [[5, 1, '≤', 100], [1, 1, '≤', 60]], DOBJ = [250, 75];
const dealRd = (W) => () => { const [x, y] = W.pt || [0, 0], ok = DEAL.every((c) => okC(c, x, y)); return [['tables x = ' + x + ',  chairs y = ' + y, C.ink], ['money: ₹' + (2500 * x + 500 * y).toLocaleString('en-IN') + ' (limit ₹50,000)', 2500 * x + 500 * y <= 50000 ? C['matcha-deep'] : C.beni], ['space: ' + (x + y) + ' pieces (limit 60)', x + y <= 60 ? C['matcha-deep'] : C.beni], ['profit Z = ₹' + (250 * x + 75 * y).toLocaleString('en-IN'), ok ? C.sora : C['ink-muted']]]; };
function dragPt(W, snap = 5, lim = [90, 90]) { W.drags = [{ get: () => W.pt, r: 6, set: (x, y) => { const nx = clamp(Math.round(x / snap) * snap, 0, lim[0]), ny = clamp(Math.round(y / snap) * snap, 0, lim[1]); if (nx !== W.pt[0] || ny !== W.pt[1]) { W.pt = [nx, ny]; SFX.tick(); } } }]; }

LESSONS.push(lesson({
  id: 'dealer', title: 'Tables & Chairs', blurb: 'A dealer has ₹50,000 and room for 60 pieces. Try buying plans, then turn the limits into inequalities. Sections 12.1–12.2.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('lp', (W) => { lpSet(W, DEAL, DOBJ, { dir: 'max' }); W.pt = [0, 0]; W.lab = false; W.rd = dealRd(W); dragPt(W); });
      await slam('MAX PROFIT', 'Class 12 · Ch 12 · Section 12.1');
      await J('idle', 'A table costs ₹2500 and earns ₹250. A chair costs ₹500 and earns ₹75. He has ₹50,000 and room for 60 pieces. Drag the dot: x tables across, y chairs up.');
      await task('Buy only tables: 20 tables, 0 chairs', () => W.pt[0] === 20 && W.pt[1] === 0, (W) => (W.pt = [20, 0]));
      await J('happy', 'All the money goes on 20 tables: profit ₹5000.');
      await task('Now only chairs: the room limit lets you buy 60', () => W.pt[0] === 0 && W.pt[1] === 60, (W) => (W.pt = [0, 60]));
      await K('think', 'That is only ₹4500. What about a mix?');
      await task('Try 10 tables and 50 chairs', () => W.pt[0] === 10 && W.pt[1] === 50, (W) => (W.pt = [10, 50]));
      await K('surprised', '₹6250! Better than either extreme.');
      await task('Drag to 25 tables and 40 chairs', () => W.pt[0] === 25 && W.pt[1] === 40, (W) => (W.pt = [25, 40]));
      await J('think', 'Money used ₹82,500: more than he has. That buying plan is not allowed.');
      await discover('Optimisation problem', 'Maximise (or minimise) something subject to limits. With everything linear, it is a linear programming problem.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '12.2.1'; W.sub = 'formulation'; });
      exTag('Formulation', 'tables x, chairs y');
      await quiz('x and y must satisfy', ['x ≥ 0 and y ≥ 0', 'x ≤ 0 and y ≤ 0', 'x + y = 60', 'x = y'], 0, 'You cannot buy a negative number of pieces.');
      await quiz('Money limit: 2500x + 500y ≤ 50000 simplifies (÷ 500) to', ['5x + y ≤ 100', 'x + 5y ≤ 100', '5x + y ≤ 50000', '25x + 5y ≤ 100'], 0, '2500/500 = 5, 500/500 = 1.');
      await quiz('Room limit', ['x + y ≤ 60', 'x + y ≥ 60', '60x + 60y ≤ 1', 'xy ≤ 60'], 0, 'At most 60 pieces.');
      await quiz('Objective function (profit)', ['Z = 250x + 75y', 'Z = 2500x + 500y', 'Z = 75x + 250y', 'Z = x + y'], 0, 'Profit per table times x plus profit per chair times y.');
      await match('Match the term', ['objective function', 'decision variables', 'constraints', 'feasible region'], ['x and y', 'the inequalities (limits)', 'points satisfying every constraint', 'the linear function Z to maximise'], [3, 0, 1, 2]).then((r) => verdict(r, 'Section 12.2.1.', 'See the arrows.'));
      await cont();
    },
    async function () {
      enterScene('lp', (W) => { lpSet(W, DEAL, DOBJ, { dir: 'max' }); W.pt = [25, 40]; W.rd = dealRd(W); dragPt(W); });
      exTag('12.2.2', 'graphical method');
      await J('idle', 'Draw 5x + y = 100, then x + y = 60. Every point satisfying all the constraints is a feasible solution; together they form the feasible region.');
      await lpDraw(W);
      await K('think', 'The region is OABC. And (25, 40) sits outside it.');
      await task('Drag the dot inside the region (it turns green)', () => DEAL.every((c) => okC(c, W.pt[0], W.pt[1])), (W) => (W.pt = [10, 30]));
      await pickQ('Which buying plans are feasible?', ['(10, 50)', '(0, 60)', '(20, 0)', '(25, 40)', '(30, 30)'], ['(10, 50)', '(0, 60)', '(20, 0)'], '5x + y ≤ 100 and x + y ≤ 60 both hold.', { brace: false });
      await discover('Feasible region', 'All points satisfying every constraint. Points outside are infeasible solutions.');
      await cont(); hideFound();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'Maximise Z = 250x + 75y  subject to  5x + y ≤ 100, x + y ≤ 60, x, y ≥ 0', eq: true }, 'Objective function, decision variables, constraints, feasible region.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'corner', title: 'The Corner Point Method', blurb: 'Slide the profit line outwards: the best plan is where it leaves the region, always at a corner. Theorems 1 and 2, Examples 1 and 2.', face: 'jess-excited',
  steps: [
    async function () {
      let zs = 2000;
      enterScene('lp', (W) => { lpSet(W, DEAL, DOBJ, { dir: 'max', draw: false }); W.z = zs; W.tapOn = true; W.rd = () => [['Z = 250x + 75y = ' + fmtN(W.z, 0), C.ink]]; });
      await slam('SLIDE Z', 'Section 12.2.2 · Theorems 1 and 2');
      await J('idle', 'Every point on this dashed line earns the same profit Z. Slide Z up and the line moves outward. We want the highest Z that still touches the region.');
      const sl = slider('Z (profit)', 0, 8000, 250, 2000, (v) => 'Z = ₹' + v, (v) => (W.z = v), 6250);
      await task('Slide Z up until the line is just about to leave the region', () => W.z === 6250, () => { W.z = 6250; sl.value = 6250; });
      await K('surprised', 'It leaves at a corner, not along an edge.');
      await quiz('At Z = 6250 the line touches the region only at', ['B (10, 50)', 'A (20, 0)', 'O (0, 0)', 'every point'], 0, 'Beyond 6250 it misses the whole region.');
      await task('Tap all four corners to read Z at each', () => W.shown.size >= 4, (W) => W.corners.forEach((_, i) => W.shown.add(i)));
      W.best = [W.corners.findIndex((p) => p[0] === 10 && p[1] === 50)];
      await discover('Theorem 1', 'An optimal value of a linear objective on a convex polygon occurs at a corner point.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('lp', (W) => { lpSet(W, DEAL, DOBJ, { dir: 'max', draw: false }); W.tapOn = false; });
      exTag('Corner point table', 'dealer problem');
      await fields('Z = 250x + 75y at each corner', [{ l: 'O(0, 0)', a: 0 }, { l: 'C(0, 60)', a: 4500 }, { l: 'B(10, 50)', a: 6250 }, { l: 'A(20, 0)', a: 5000 }]).then((r) => verdict(r, 'Maximum ₹6250 at B: 10 tables and 50 chairs.', 'O 0, C 4500, B 6250, A 5000.'));
      W.corners.forEach((_, i) => W.shown.add(i)); W.best = [W.corners.findIndex((p) => p[0] === 10 && p[1] === 50)]; SFX.pop();
      await discover('Theorem 2', 'On a bounded region, Z has both a maximum and a minimum, each at a corner point.');
      await quiz('The corner point method', ['1. find corners  2. evaluate Z at each  3. take the largest (or smallest)', 'try random points', 'always pick the origin', 'solve 2 equations once'], 0, 'For an unbounded region you also test an open half-plane.');
      await cont(); hideFound();
    },
    async function () {
      await qStep(lpQ('Example 1', 'Max', 'Maximise Z = 4x + y subject to x + y ≤ 50, 3x + y ≤ 90, x ≥ 0, y ≥ 0', [[1, 1, '≤', 50], [3, 1, '≤', 90]], [4, 1], 'max'))();
    },
    async function () {
      await qStep(lpQ('Example 2', 'Min', 'Minimise Z = 200x + 500y subject to x + 2y ≥ 10, 3x + 4y ≤ 24, x ≥ 0, y ≥ 0', [[1, 2, '≥', 10], [3, 4, '≤', 24]], [200, 500], 'min'))();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 2'; }); await summary([{ t: 'Optimal Z is at a corner point: evaluate Z at every corner', eq: true }, 'Bounded region: both a maximum and a minimum exist.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'special', title: 'Ties, Open Regions, Nothing', blurb: 'Two corners with the same best value, an unbounded region that has no minimum, and a problem with no solution at all. Examples 3–5.', face: 'kimmy-excited',
  steps: [
    async function () {
      const cons = [[1, 3, '≤', 60], [1, 1, '≥', 10], [1, -1, '≤', 0]];
      enterScene('lp', (W) => { lpSet(W, cons, [3, 9], { dir: 'max', draw: false }); W.z = 120; W.tapOn = true; W.rd = () => [['Z = 3x + 9y = ' + fmtN(W.z, 0), C.ink]]; });
      exTag('Example 3', 'x + 3y ≤ 60, x + y ≥ 10, x ≤ y');
      await J('idle', 'The profit line 3x + 9y = Z has the same slope as the edge x + 3y = 60 (it is just 3 times it). Slide Z and watch.');
      const sl = slider('Z', 0, 240, 15, 120, (v) => 'Z = ' + v, (v) => (W.z = v), 180);
      await task('Slide Z to 180', () => W.z === 180, () => { W.z = 180; sl.value = 180; });
      await K('surprised', 'The whole line lies along the edge CD! Every point of it earns 180.');
      await discover('Multiple optimal solutions', 'If two corners give the same optimum, every point on the segment joining them does too.');
      await cont(); hideFound();
    },
    async function () { await qStep(lpQ('Example 3', 'Both', 'Minimise and maximise Z = 3x + 9y subject to x + 3y ≤ 60, x + y ≥ 10, x ≤ y, x, y ≥ 0', [[1, 3, '≤', 60], [1, 1, '≥', 10], [1, -1, '≤', 0]], [3, 9], ['min', 'max']))(); },
    async function () { await qStep(lpQ('Example 4', 'Open', 'Determine graphically the minimum of Z = −50x + 20y subject to 2x − y ≥ −5, 3x + y ≥ 3, 2x − 3y ≤ 12, x, y ≥ 0', [[2, -1, '≥', -5], [3, 1, '≥', 3], [2, -3, '≤', 12]], [-50, 20], 'min'))(); },
    async function () { await qStep(lpQ('Example 5', 'None', 'Minimise Z = 3x + 2y subject to x + y ≥ 8, 3x + 5y ≤ 15, x ≥ 0, y ≥ 0', [[1, 1, '≥', 8], [3, 5, '≤', 15]], [3, 2], 'min'))(); },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 3'; }); await summary(['The feasible region is always convex.', { t: 'Unbounded: test the open half-plane. Empty: no solution.', eq: true }]); },
  ],
}));

const BOSS12 = [
  ['The function Z = ax + by to optimise is the', ['objective function', 'constraint', 'feasible region', 'decision variable'], 0],
  ['The optimal value of Z on a bounded region occurs at', ['a corner point', 'the centre', 'any interior point', 'the origin always'], 0],
  ['A point outside the feasible region is', ['an infeasible solution', 'optimal', 'a corner', 'a decision variable'], 0],
  ['Corners (0, 0), (4, 0), (0, 3). Z = x + 2y has maximum', ['6', '4', '0', '10'], 0],
  ['Two corners give the same maximum. Then', ['every point between them does too', 'only those two do', 'no maximum exists', 'the region is empty'], 0],
  ['Constraints x + y ≤ 1 and x + y ≥ 3 give', ['no feasible region', 'a bounded region', 'an unbounded region', 'a single point'], 0],
  ['For an unbounded region you also check', ['an open half-plane', 'the origin', 'the slope', 'nothing'], 0],
  ['The feasible region of an LPP is always', ['convex', 'a circle', 'concave', 'a line'], 0],
  ['Maximise Z = x + y with x + y ≤ 5, x, y ≥ 0 gives', ['5', '10', '0', '25'], 0],
  ['The non-negativity constraints are', ['x ≥ 0, y ≥ 0', 'x ≤ 0, y ≤ 0', 'x = y', 'x + y ≥ 0'], 0],
];

{
  const byId = (id) => LESSONS.find((l) => l.id === id);
  const [de, co, sp] = ['dealer', 'corner', 'special'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(de, co, sp, exLesson({ id: 'ex121', title: 'Exercise 12.1', blurb: 'All 10: draw the region, tap the corners, slide the profit line.', face: 'jess-happy', qs: EX121 }));
}
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 12'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Optimise faster than me!'); await cont('Fight'); }, ...BOSS12.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 12'; }); await summary(['Chapter complete!', { t: 'Optimum at a corner point', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.title.replace('Exercise ', ''); });

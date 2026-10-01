/* =========================================================
   CHAPTER 10 · CONIC SECTIONS — every exercise question as a sim
   a, b, c, e and latus rectum are computed from the denominators (surd() writes exact forms).
   ========================================================= */
const F = (v) => fracStr(v).replace('-', '−');
function conicView(K) {
  if (K.type === 'circle') return [K.h - K.r - 1.6, K.h + K.r + 1.6, K.k - K.r - 1.1, K.k + K.r + 1.1];
  if (K.type === 'parabola') { const a = Math.abs(K.a), s = Math.sign(K.a); const lo = -1.7 * a, hi = 3.9 * a; const [p0, p1] = s > 0 ? [lo, hi] : [-hi, -lo]; return K.vert ? [-4.2 * a, 4.2 * a, p0, p1] : [p0, p1, -4.2 * a, 4.2 * a]; }
  if (K.type === 'ellipse') return [-K.A * 1.45 - 0.4, K.A * 1.45 + 0.4, -K.B * 1.3 - 0.3, K.B * 1.3 + 0.3];
  const c = Math.hypot(K.A, K.B); return [-2 * c, 2 * c, -1.5 * c, 1.5 * c];
}
const conicScene = (K) => (W) => { planeView(W, ...conicView(K)); W.cn = Object.assign({ p: 0 }, K); };
const showConic = async () => { await tw(W.cn, { p: 1, duration: 1 }); SFX.swish(); };
const C10 = (ex, n, q, parts, w, o = {}) => Object.assign({ ex, n, q, scene: o.K ? 'conic' : o.view ? 'conic' : 'board', setup: o.K ? conicScene(o.K) : o.view ? (W) => { planeView(W, ...o.view); if (o.setup) o.setup(W); } : null, kim: o.kim, parts, w: [w] }, o.K && o.setup ? { setup: (W) => { conicScene(o.K)(W); o.setup(W); } } : {});
const sqF = (v, l, o = {}) => Object.assign({ l, a: Math.sqrt(v), show: surd(v), tol: 0.01 }, o);

/* ---------- parabola: focus, axis, directrix, latus rectum ---------- */
function parQ(n, eq, a, vert) {
  const K = { type: 'parabola', a, vert, span: 1.85 }; const open = vert ? (a > 0 ? 2 : 3) : a > 0 ? 0 : 1;
  return C10('Ex 10.2', n, 'Find the focus, axis, directrix and latus rectum of ' + eq + '.', [
    { k: 'mcq', q: 'Axis and opening', o: ['x-axis, opens right', 'x-axis, opens left', 'y-axis, opens up', 'y-axis, opens down'], a: open, x: (vert ? 'x²' : 'y²') + ' term ⇒ axis is the ' + (vert ? 'y' : 'x') + '-axis.', act: showConic },
    { k: 'fields', q: '4a = ' + F(4 * a) + '. Fill in', f: [{ l: 'focus x', a: vert ? 0 : a, show: vert ? '0' : F(a) }, { l: 'focus y', a: vert ? a : 0, show: vert ? F(a) : '0' }, { l: vert ? 'directrix y =' : 'directrix x =', a: -a, show: F(-a) }, { l: 'latus rectum', a: 4 * Math.abs(a), show: F(4 * Math.abs(a)) }], x: 'Focus ' + (vert ? '(0, ' + F(a) + ')' : '(' + F(a) + ', 0)') + ', LR ' + F(4 * Math.abs(a)) + '.', act: async () => { W.cn.showLR = true; grabP(W, 0.7); SFX.pop(); } }],
  'Focus ' + (vert ? '(0, ' + F(a) + ')' : '(' + F(a) + ', 0)') + ', axis ' + (vert ? 'y-axis' : 'x-axis') + ', directrix ' + (vert ? 'y = ' : 'x = ') + F(-a) + ', latus rectum ' + F(4 * Math.abs(a)), { K });
}
/* ---------- ellipse / hyperbola facts from the denominators ---------- */
function ellQ(n, eq, X2, Y2, norm) {
  const vert = Y2 > X2, a2 = Math.max(X2, Y2), b2 = Math.min(X2, Y2), c2 = a2 - b2; const K = { type: 'ellipse', A: Math.sqrt(X2), B: Math.sqrt(Y2) };
  const fv = (s) => (vert ? '(0, ±' + s + ')' : '(±' + s + ', 0)'); const sa = surd(a2), sc2 = surd(c2);
  return C10('Ex 10.3', n, 'Find the foci, vertices, major and minor axes, eccentricity and latus rectum of ' + eq + '.', [
    ...(norm ? [{ k: 'fields', q: 'Divide to get x²/□ + y²/□ = 1', f: [{ l: 'under x²', a: X2 }, { l: 'under y²', a: Y2 }], x: 'x²/' + X2 + ' + y²/' + Y2 + ' = 1.' }] : []),
    { k: 'mcq', q: 'The major axis lies along…', o: ['the x-axis', 'the y-axis'], a: vert ? 1 : 0, x: 'The larger denominator (' + a2 + ') is under ' + (vert ? 'y²' : 'x²') + '.', act: showConic },
    { k: 'fields', q: 'a, b and c = √(a² − b²)', f: [sqF(a2, 'a'), sqF(b2, 'b'), sqF(c2, 'c')], keys: '√', x: 'a = ' + sa + ', b = ' + surd(b2) + ', c = ' + sc2 + '.' },
    { k: 'fields', q: 'Lengths and eccentricity', f: [sqF(4 * a2, 'major 2a'), sqF(4 * b2, 'minor 2b'), sqF(c2 / a2, 'e'), sqF((4 * b2 * b2) / a2, 'LR')], keys: '√', x: 'e = ' + surd(c2 / a2) + ', LR = 2b²/a = ' + surd((4 * b2 * b2) / a2) + '.', act: async () => { W.cn.showLR = true; grabP(W, 0.9); SFX.pop(); } },
    { k: 'mcq', q: 'Foci and vertices', o: ['foci ' + fv(sc2) + ', vertices ' + fv(sa), 'foci ' + fv(sa) + ', vertices ' + fv(sc2), 'foci ' + (vert ? '(±' + sc2 + ', 0)' : '(0, ±' + sc2 + ')') + ', vertices ' + fv(sa), 'foci ' + fv(surd(a2 + b2)) + ', vertices ' + fv(sa)], a: 0, x: 'Both on the major axis.' }],
    'Foci ' + fv(sc2) + ', vertices ' + fv(sa) + ', major ' + surd(4 * a2) + ', minor ' + surd(4 * b2) + ', e = ' + surd(c2 / a2) + ', LR = ' + surd((4 * b2 * b2) / a2), { K });
}
function hypQ(n, eq, vert, a2, b2, norm) {
  const c2 = a2 + b2; const K = { type: 'hyperbola', A: Math.sqrt(a2), B: Math.sqrt(b2), vert, span: 1.7 };
  const fv = (s) => (vert ? '(0, ±' + s + ')' : '(±' + s + ', 0)'); const sa = surd(a2), sc2 = surd(c2);
  const nx = vert ? b2 : a2, ny = vert ? a2 : b2;
  return C10('Ex 10.4', n, 'Find the foci, vertices, eccentricity and latus rectum of ' + eq + '.', [
    ...(norm ? [{ k: 'fields', q: 'Divide to standard form', f: [{ l: vert ? 'under y² (+)' : 'under x² (+)', a: a2, show: F(a2) }, { l: vert ? 'under x² (−)' : 'under y² (−)', a: b2, show: F(b2) }], x: vert ? 'y²/' + F(ny) + ' − x²/' + F(nx) + ' = 1.' : 'x²/' + F(nx) + ' − y²/' + F(ny) + ' = 1.' }] : []),
    { k: 'mcq', q: 'The transverse axis lies along…', o: ['the x-axis', 'the y-axis'], a: vert ? 1 : 0, x: 'The positive term is ' + (vert ? 'y²' : 'x²') + '.', act: showConic },
    { k: 'fields', q: 'a, b and c = √(a² + b²)', f: [sqF(a2, 'a'), sqF(b2, 'b'), sqF(c2, 'c')], keys: '√', x: 'a = ' + sa + ', b = ' + surd(b2) + ', c = ' + sc2 + '.' },
    { k: 'fields', q: 'Eccentricity and latus rectum', f: [sqF(c2 / a2, 'e'), sqF((4 * b2 * b2) / a2, 'LR')], keys: '√', x: 'e = ' + surd(c2 / a2) + ', LR = ' + surd((4 * b2 * b2) / a2) + '.', act: async () => { W.cn.showLR = true; grabP(W, 0.6); SFX.pop(); } },
    { k: 'mcq', q: 'Foci and vertices', o: ['foci ' + fv(sc2) + ', vertices ' + fv(sa), 'foci ' + fv(sa) + ', vertices ' + fv(sc2), 'foci ' + (vert ? '(±' + sc2 + ', 0)' : '(0, ±' + sc2 + ')') + ', vertices ' + fv(sa), 'foci ' + fv(surd(Math.abs(a2 - b2))) + ', vertices ' + fv(sa)], a: 0, x: 'Both on the transverse axis.' }],
    'Foci ' + fv(sc2) + ', vertices ' + fv(sa) + ', e = ' + surd(c2 / a2) + ', LR = ' + surd((4 * b2 * b2) / a2), { K });
}
/* ---------- find the equation: one intermediate step, then the two denominators ---------- */
function eqE(n, q, X2, Y2, step) {
  const K = { type: 'ellipse', A: Math.sqrt(X2), B: Math.sqrt(Y2) };
  return C10('Ex 10.3', n, q, [Object.assign({ k: 'num', x: step.x || '' }, step), { k: 'fields', q: 'x²/□ + y²/□ = 1', f: [{ l: 'under x²', a: X2, show: F(X2) }, { l: 'under y²', a: Y2, show: F(Y2) }], x: 'x²/' + F(X2) + ' + y²/' + F(Y2) + ' = 1.', act: async () => { await showConic(); grabP(W, 0.9); } }], 'x²/' + F(X2) + ' + y²/' + F(Y2) + ' = 1', { K });
}
function eqH(n, q, vert, a2, b2, step) {
  const K = { type: 'hyperbola', A: Math.sqrt(a2), B: Math.sqrt(b2), vert, span: 1.7 }; const s = vert ? 'y²/' + F(a2) + ' − x²/' + F(b2) + ' = 1' : 'x²/' + F(a2) + ' − y²/' + F(b2) + ' = 1';
  return C10('Ex 10.4', n, q, [Object.assign({ k: 'num', x: step.x || '' }, step), { k: 'fields', q: (vert ? 'y²/□ − x²/□' : 'x²/□ − y²/□') + ' = 1', f: [{ l: 'a²', a: a2, show: F(a2) }, { l: 'b²', a: b2, show: F(b2) }], x: s + '.', act: async () => { await showConic(); grabP(W, 0.6); } }], s, { K });
}
const circEq = (n, q, h0, k0, r, opts, ans, o = {}) => C10('Ex 10.1', n, q, [circlePart('Build the circle on the grid', h0, k0, r, Object.assign({ c: [0, 0], r: 1.2 }, o)), { k: 'mcq', q: 'Expanded equation', o: opts, a: ans, x: 'Expand (x − h)² + (y − k)² = r².' }], opts[ans], { view: [h0 - r - 2, h0 + r + 2, k0 - r - 1.2, k0 + r + 1.2] });

/* ===================== EXERCISE 10.1 ===================== */
const EX101 = [
  circEq('Q1', 'Circle with centre (0, 2) and radius 2.', 0, 2, 2, ['x² + y² − 4y = 0', 'x² + y² + 4y = 0', 'x² + y² − 4 = 0', 'x² + y² − 2y = 0'], 0),
  circEq('Q2', 'Circle with centre (−2, 3) and radius 4.', -2, 3, 4, ['x² + y² + 4x − 6y − 3 = 0', 'x² + y² − 4x + 6y − 3 = 0', 'x² + y² + 4x − 6y + 3 = 0', 'x² + y² + 4x − 6y − 16 = 0'], 0),
  C10('Ex 10.1', 'Q3', 'Circle with centre (1/2, 1/4) and radius 1/12.', [{ k: 'num', q: 'r² = ?', a: 1 / 144, show: '1/144', x: '1/144.' }, { k: 'mcq', q: '(x − 1/2)² + (y − 1/4)² = 1/144, times 144, ÷ 4:', o: ['36x² + 36y² − 36x − 18y + 11 = 0', '144x² + 144y² − 144x − 72y + 1 = 0', '36x² + 36y² − 18x − 36y + 11 = 0', '36x² + 36y² − 36x − 18y − 11 = 0'], a: 0, x: '144x² + 144y² − 144x − 72y + 44 = 0, then ÷ 4.' }], '36x² + 36y² − 36x − 18y + 11 = 0', { K: { type: 'circle', h: 0.5, k: 0.25, r: 1 / 12 }, setup: (W) => planeView(W, -0.2, 1.2, -0.3, 0.8) }),
  circEq('Q4', 'Circle with centre (1, 1) and radius √2.', 1, 1, Math.SQRT2, ['x² + y² − 2x − 2y = 0', 'x² + y² + 2x + 2y = 0', 'x² + y² − 2x − 2y − 2 = 0', 'x² + y² − 2 = 0'], 0, { rs: '√2' }),
  C10('Ex 10.1', 'Q5', 'Circle with centre (−a, −b) and radius √(a² − b²).', [{ k: 'mcq', q: '(x + a)² + (y + b)² = a² − b² simplifies to', o: ['x² + y² + 2ax + 2by + 2b² = 0', 'x² + y² + 2ax + 2by = 0', 'x² + y² − 2ax − 2by + 2b² = 0', 'x² + y² + 2ax + 2by − 2a² = 0'], a: 0, x: 'a² cancels; b² + b² = 2b².' }], 'x² + y² + 2ax + 2by + 2b² = 0'),
  C10('Ex 10.1', 'Q6', 'Centre and radius of (x + 5)² + (y − 3)² = 36.', [{ k: 'fields', q: 'Read it off', f: [{ l: 'h', a: -5 }, { l: 'k', a: 3 }, { l: 'r', a: 6 }], x: 'Centre (−5, 3), r = 6.', act: showConic }], 'Centre (−5, 3), radius 6', { K: { type: 'circle', h: -5, k: 3, r: 6 } }),
  C10('Ex 10.1', 'Q7', 'Centre and radius of x² + y² − 4x − 8y − 45 = 0.', [{ k: 'order', q: 'Complete the squares', s: ['(x² − 4x) + (y² − 8y) = 45', '(x − 2)² + (y − 4)² = 45 + 4 + 16', '(x − 2)² + (y − 4)² = 65'] }, { k: 'fields', q: 'Centre and radius', f: [{ l: 'h', a: 2 }, { l: 'k', a: 4 }, sqF(65, 'r')], keys: '√', x: 'Centre (2, 4), r = √65.', act: showConic }], 'Centre (2, 4), radius √65', { K: { type: 'circle', h: 2, k: 4, r: Math.sqrt(65) } }),
  C10('Ex 10.1', 'Q8', 'Centre and radius of x² + y² − 8x + 10y − 12 = 0.', [{ k: 'order', q: 'Complete the squares', s: ['(x² − 8x) + (y² + 10y) = 12', '(x − 4)² + (y + 5)² = 12 + 16 + 25', '(x − 4)² + (y + 5)² = 53'] }, { k: 'fields', q: 'Centre and radius', f: [{ l: 'h', a: 4 }, { l: 'k', a: -5 }, sqF(53, 'r')], keys: '√', x: 'Centre (4, −5), r = √53.', act: showConic }], 'Centre (4, −5), radius √53', { K: { type: 'circle', h: 4, k: -5, r: Math.sqrt(53) } }),
  C10('Ex 10.1', 'Q9', 'Centre and radius of 2x² + 2y² − x = 0.', [{ k: 'order', q: 'Steps', s: ['Divide by 2: x² + y² − x/2 = 0', '(x − 1/4)² + y² = 1/16'] }, { k: 'fields', q: 'Centre and radius', f: [{ l: 'h', a: 0.25, show: '1/4' }, { l: 'k', a: 0 }, { l: 'r', a: 0.25, show: '1/4' }], x: 'Centre (1/4, 0), r = 1/4.', act: showConic }], 'Centre (1/4, 0), radius 1/4', { K: { type: 'circle', h: 0.25, k: 0, r: 0.25 }, setup: (W) => planeView(W, -0.3, 0.8, -0.4, 0.4) }),
  C10('Ex 10.1', 'Q10', 'Circle through (4, 1) and (6, 5) with centre on 4x + y = 16.', [{ k: 'fields', q: 'The centre is on the perpendicular bisector x + 2y = 11 and on 4x + y = 16', f: [{ l: 'h', a: 3 }, { l: 'k', a: 4 }, { l: 'r²', a: 10 }], x: 'Centre (3, 4), r² = 10.', act: showConic }, { k: 'mcq', q: 'Equation', o: ['x² + y² − 6x − 8y + 15 = 0', 'x² + y² + 6x + 8y + 15 = 0', 'x² + y² − 6x − 8y − 15 = 0', 'x² + y² − 6x − 8y + 25 = 0'], a: 0, x: '9 + 16 − 10 = 15.' }], 'x² + y² − 6x − 8y + 15 = 0', { K: { type: 'circle', h: 3, k: 4, r: Math.sqrt(10) }, setup: (W) => W.pts.push({ x: 4, y: 1, t: '(4, 1)', col: C.sora }, { x: 6, y: 5, t: '(6, 5)', col: C.sora }) }),
  C10('Ex 10.1', 'Q11', 'Circle through (2, 3) and (−1, 1) with centre on x − 3y − 11 = 0.', [{ k: 'fields', q: 'Centre and r²', f: [{ l: 'h', a: 3.5, show: '7/2' }, { l: 'k', a: -2.5, show: '−5/2' }, { l: 'r²', a: 130 / 4, show: '65/2' }], x: 'Centre (7/2, −5/2), r² = 65/2.', act: showConic }, { k: 'mcq', q: 'Equation', o: ['x² + y² − 7x + 5y − 14 = 0', 'x² + y² + 7x − 5y − 14 = 0', 'x² + y² − 7x + 5y + 14 = 0', 'x² + y² − 7x − 5y − 14 = 0'], a: 0, x: '49/4 + 25/4 − 130/4 = −14.' }], 'x² + y² − 7x + 5y − 14 = 0', { K: { type: 'circle', h: 3.5, k: -2.5, r: Math.sqrt(32.5) }, setup: (W) => W.pts.push({ x: 2, y: 3, t: '(2, 3)', col: C.sora }, { x: -1, y: 1, t: '(−1, 1)', col: C.sora }) }),
  C10('Ex 10.1', 'Q12', 'Circle of radius 5, centre on the x-axis, through (2, 3).', [{ k: 'fields', q: '(2 − h)² + 9 = 25', f: [{ l: 'h₁', a: 6 }, { l: 'h₂', a: -2 }], x: 'h = 6 or −2.', act: async () => { W.cn.p = 1; W.extra.push({ txt: '2nd circle', x: -2, y: 5.6, col: C.sora }); W.curves.push(curve((x) => Math.sqrt(Math.max(0, 25 - (x + 2) ** 2)), C.sora, { p: 1, x0: -7, x1: 3 }), curve((x) => -Math.sqrt(Math.max(0, 25 - (x + 2) ** 2)), C.sora, { p: 1, x0: -7, x1: 3 })); SFX.swish(); } }, { k: 'mcq', q: 'Equations', o: ['x² + y² − 12x + 11 = 0 or x² + y² + 4x − 21 = 0', 'x² + y² − 12x − 11 = 0 only', 'x² + y² + 12x + 11 = 0', 'x² + y² − 4x − 21 = 0 only'], a: 0, x: 'Two circles.' }], 'x² + y² − 12x + 11 = 0 or x² + y² + 4x − 21 = 0', { K: { type: 'circle', h: 6, k: 0, r: 5 }, setup: (W) => { planeView(W, -8, 12, -6.5, 6.5); W.pts.push({ x: 2, y: 3, t: '(2, 3)', col: C.ink }); } }),
  C10('Ex 10.1', 'Q13', 'Circle through (0, 0) making intercepts a and b on the axes.', [{ k: 'mcq', q: 'It passes through (0, 0), (a, 0), (0, b): the equation is', o: ['x² + y² − ax − by = 0', 'x² + y² + ax + by = 0', 'x² + y² = a² + b²', 'x² + y² − ax + by = 0'], a: 0, x: 'Centre (a/2, b/2).' }], 'x² + y² − ax − by = 0'),
  C10('Ex 10.1', 'Q14', 'Circle with centre (2, 2) through (4, 5).', [{ k: 'num', q: 'r² = 2² + 3² = ?', a: 13, x: '13.', act: showConic }, { k: 'mcq', q: 'Equation', o: ['x² + y² − 4x − 4y − 5 = 0', 'x² + y² − 4x − 4y + 5 = 0', 'x² + y² + 4x + 4y − 5 = 0', 'x² + y² − 4x − 4y − 13 = 0'], a: 0, x: '8 − 13 = −5.' }], 'x² + y² − 4x − 4y − 5 = 0', { K: { type: 'circle', h: 2, k: 2, r: Math.sqrt(13) }, setup: (W) => W.pts.push({ x: 4, y: 5, t: '(4, 5)', col: C.sora }) }),
  C10('Ex 10.1', 'Q15', 'Does (−2.5, 3.5) lie inside, outside or on x² + y² = 25?', [{ k: 'num', q: '(−2.5)² + 3.5² = ?', a: 18.5, x: '18.5.' }, { k: 'mcq', q: '18.5 vs 25 ⇒ the point is', o: ['inside', 'outside', 'on the circle'], a: 0, x: '18.5 < 25.', act: showConic }], 'Inside (18.5 < 25)', { K: { type: 'circle', h: 0, k: 0, r: 5 }, setup: (W) => W.pts.push({ x: -2.5, y: 3.5, t: '(−2.5, 3.5)', col: C.sora }) }),
];

/* ===================== EXERCISE 10.2 ===================== */
const pEq = (n, q, a, vert, eq, step) => C10('Ex 10.2', n, q, [step, { k: 'mcq', q: 'Equation', o: eq, a: 0, x: eq[0] + '.', act: showConic }], eq[0], { K: { type: 'parabola', a, vert, span: 1.85 } });
const EX102 = [
  parQ('Q1', 'y² = 12x', 3, false), parQ('Q2', 'x² = 6y', 1.5, true), parQ('Q3', 'y² = −8x', -2, false),
  parQ('Q4', 'x² = −16y', -4, true), parQ('Q5', 'y² = 10x', 2.5, false), parQ('Q6', 'x² = −9y', -9 / 4, true),
  pEq('Q7', 'Parabola with focus (6, 0) and directrix x = −6.', 6, false, ['y² = 24x', 'y² = 12x', 'x² = 24y', 'y² = −24x'], { k: 'num', q: 'a = ?', a: 6, x: 'a = 6.' }),
  pEq('Q8', 'Parabola with focus (0, −3) and directrix y = 3.', -3, true, ['x² = −12y', 'x² = 12y', 'y² = −12x', 'x² = −6y'], { k: 'num', q: 'a = ? (signed)', a: -3, x: 'Opens down: a = −3.' }),
  pEq('Q9', 'Parabola with vertex (0, 0) and focus (3, 0).', 3, false, ['y² = 12x', 'x² = 12y', 'y² = 3x', 'y² = −12x'], { k: 'num', q: 'a = ?', a: 3, x: 'a = 3.' }),
  pEq('Q10', 'Parabola with vertex (0, 0) and focus (−2, 0).', -2, false, ['y² = −8x', 'y² = 8x', 'x² = −8y', 'y² = −2x'], { k: 'num', q: 'a = ? (signed)', a: -2, x: 'Opens left.' }),
  pEq('Q11', 'Parabola with vertex (0, 0), axis along the x-axis, through (2, 3).', 9 / 8, false, ['2y² = 9x', 'y² = 9x', '2x² = 9y', '3y² = 2x'], { k: 'num', q: 'y² = 4ax through (2, 3): 9 = 8a ⇒ a = ?', a: 9 / 8, show: '9/8', x: 'a = 9/8.' }),
  pEq('Q12', 'Parabola with vertex (0, 0), symmetric about the y-axis, through (5, 2).', 25 / 8, true, ['2x² = 25y', 'x² = 25y', '2y² = 25x', 'x² = 10y'], { k: 'num', q: 'x² = 4ay through (5, 2): 25 = 8a ⇒ a = ?', a: 25 / 8, show: '25/8', x: 'a = 25/8.' }),
];

/* ===================== EXERCISE 10.3 ===================== */
const EX103 = [
  ellQ('Q1', 'x²/36 + y²/16 = 1', 36, 16), ellQ('Q2', 'x²/4 + y²/25 = 1', 4, 25), ellQ('Q3', 'x²/16 + y²/9 = 1', 16, 9),
  ellQ('Q4', 'x²/25 + y²/100 = 1', 25, 100), ellQ('Q5', 'x²/49 + y²/36 = 1', 49, 36), ellQ('Q6', 'x²/100 + y²/400 = 1', 100, 400),
  ellQ('Q7', '36x² + 4y² = 144', 4, 36, true), ellQ('Q8', '16x² + y² = 16', 1, 16, true), ellQ('Q9', '4x² + 9y² = 36', 9, 4, true),
  eqE('Q10', 'Ellipse with vertices (±5, 0) and foci (±4, 0).', 25, 9, { q: 'b² = 25 − 16 = ?', a: 9 }),
  eqE('Q11', 'Ellipse with vertices (0, ±13) and foci (0, ±5).', 144, 169, { q: 'b² = 169 − 25 = ?', a: 144 }),
  eqE('Q12', 'Ellipse with vertices (±6, 0) and foci (±4, 0).', 36, 20, { q: 'b² = 36 − 16 = ?', a: 20 }),
  eqE('Q13', 'Ellipse with ends of major axis (±3, 0) and minor axis (0, ±2).', 9, 4, { q: 'a = 3, b = 2. b² = ?', a: 4 }),
  eqE('Q14', 'Ellipse with ends of major axis (0, ±√5) and minor axis (±1, 0).', 1, 5, { q: 'a² = ?', a: 5 }),
  eqE('Q15', 'Ellipse with major axis 26 and foci (±5, 0).', 169, 144, { q: 'a = 13, b² = 169 − 25 = ?', a: 144 }),
  eqE('Q16', 'Ellipse with minor axis 16 and foci (0, ±6).', 64, 100, { q: 'b = 8, a² = 64 + 36 = ?', a: 100 }),
  eqE('Q17', 'Ellipse with foci (±3, 0) and a = 4.', 16, 7, { q: 'b² = 16 − 9 = ?', a: 7 }),
  eqE('Q18', 'Ellipse with b = 3, c = 4, centre at the origin, foci on the x-axis.', 25, 9, { q: 'a² = 9 + 16 = ?', a: 25 }),
  eqE('Q19', 'Ellipse with centre (0, 0), major axis on the y-axis, through (3, 2) and (1, 6).', 10, 40, { q: '9/b² + 4/a² = 1 and 1/b² + 36/a² = 1 ⇒ a² = ?', a: 40, x: 'Then b² = 10.' }),
  eqE('Q20', 'Ellipse with major axis on the x-axis, through (4, 3) and (6, 2).', 52, 13, { q: '16/a² + 9/b² = 1 and 36/a² + 4/b² = 1 ⇒ a² = ?', a: 52, x: 'Then b² = 13.' }),
];

/* ===================== EXERCISE 10.4 ===================== */
const EX104 = [
  hypQ('Q1', 'x²/16 − y²/9 = 1', false, 16, 9), hypQ('Q2', 'y²/9 − x²/27 = 1', true, 9, 27), hypQ('Q3', '9y² − 4x² = 36', true, 4, 9, true),
  hypQ('Q4', '16x² − 9y² = 576', false, 36, 64, true), hypQ('Q5', '5y² − 9x² = 36', true, 36 / 5, 4, true), hypQ('Q6', '49y² − 16x² = 784', true, 16, 49, true),
  eqH('Q7', 'Hyperbola with vertices (±2, 0) and foci (±3, 0).', false, 4, 5, { q: 'b² = 9 − 4 = ?', a: 5 }),
  eqH('Q8', 'Hyperbola with vertices (0, ±5) and foci (0, ±8).', true, 25, 39, { q: 'b² = 64 − 25 = ?', a: 39 }),
  eqH('Q9', 'Hyperbola with vertices (0, ±3) and foci (0, ±5).', true, 9, 16, { q: 'b² = 25 − 9 = ?', a: 16 }),
  eqH('Q10', 'Hyperbola with foci (±5, 0) and transverse axis 8.', false, 16, 9, { q: 'a = 4, b² = 25 − 16 = ?', a: 9 }),
  eqH('Q11', 'Hyperbola with foci (0, ±13) and conjugate axis 24.', true, 25, 144, { q: 'b = 12, a² = 169 − 144 = ?', a: 25 }),
  eqH('Q12', 'Hyperbola with foci (±3√5, 0) and latus rectum 8.', false, 25, 20, { q: 'b² = 4a and a² + 4a = 45 ⇒ a = ?', a: 5, x: 'a = 5 (−9 rejected), b² = 20.' }),
  eqH('Q13', 'Hyperbola with foci (±4, 0) and latus rectum 12.', false, 4, 12, { q: 'b² = 6a and a² + 6a = 16 ⇒ a = ?', a: 2, x: 'a = 2 (−8 rejected), b² = 12.' }),
  eqH('Q14', 'Hyperbola with vertices (±7, 0) and e = 4/3.', false, 49, 343 / 9, { q: 'c = 7 × 4/3 = ?', a: 28 / 3, show: '28/3', x: 'b² = 784/9 − 49 = 343/9, i.e. x²/49 − 9y²/343 = 1.' }),
  eqH('Q15', 'Hyperbola with foci (0, ±√10) through (2, 3).', true, 5, 5, { q: '9/a² − 4/(10 − a²) = 1 ⇒ a² = ? (the root below 10)', a: 5, x: 'a² = 5 (18 rejected: it exceeds c² = 10), b² = 5.' }),
];

/* ===================== MISCELLANEOUS ===================== */
const EX10M = [
  C10('Misc', 'Q1', 'A parabolic reflector is 20 cm in diameter and 5 cm deep. Find the focus.', [{ k: 'num', q: 'y² = 4ax through (5, 10): 100 = 20a ⇒ a = ?', a: 5, x: 'Focus (5, 0): 5 cm from the vertex, at the mid-point of the diameter.', act: async () => { await showConic(); W.extra.push({ seg: [[5, -10], [5, 10]], col: C.sora, w: 3 }); } }], 'Focus at (5, 0), the mid-point of the rim diameter', { K: { type: 'parabola', a: 5, span: 1, showD: false }, setup: (W) => planeView(W, -3, 9, -12, 12) }),
  C10('Misc', 'Q2', 'A parabolic arch, axis vertical, is 10 m high and 5 m wide at the base. How wide is it 2 m from the vertex?', [{ k: 'num', q: 'x² = −4ay through (2.5, −10) ⇒ a = ?', a: 5 / 32, show: '5/32', x: 'a = 5/32.' }, { k: 'num', q: 'At y = −2: x² = 5/4 ⇒ width 2x = ? (√5)', a: Math.sqrt(5), show: '√5', keys: '√', tol: 0.01, x: '√5 ≈ 2.24 m (the book rounds to 2.23 m).', act: async () => { await showConic(); W.extra.push({ seg: [[-Math.sqrt(5) / 2, -2], [Math.sqrt(5) / 2, -2]], col: C.sora, w: 4 }); } }], 'Width = √5 ≈ 2.24 m', { K: { type: 'parabola', a: -5 / 32, vert: true, span: 8 }, setup: (W) => { planeView(W, -6, 6, -11, 1); W.cn.showF = false; W.cn.showD = false; } }),
  C10('Misc', 'Q3', 'A suspension cable is parabolic: roadway 100 m, longest wire 30 m, shortest 6 m. Find the wire 18 m from the middle.', [{ k: 'order', q: 'Set up', s: ['Vertex (0, 6), ends (±50, 30)', 'x² = 4a(y − 6) with 2500 = 4a × 24', 'At x = 18: y − 6 = 324 × 24/2500'] }, { k: 'num', q: 'Wire length y ≈ ? (2 decimals)', a: 6 + (324 * 24) / 2500, tol: 0.01, show: '9.11', x: '≈ 9.11 m.', act: async () => { W.curves.push(curve((x) => 6 + (24 * x * x) / 2500, C.beni, { p: 1, x0: -50, x1: 50 })); W.extra.push({ seg: [[18, 0], [18, 9.11]], col: C.sora, w: 3 }); SFX.swish(); } }], 'y = 6 + 24 × 18²/2500 ≈ 9.11 m', { view: [-55, 55, -4, 34] }),
  C10('Misc', 'Q4', 'A semi-elliptical arch is 8 m wide and 2 m high. Find the height 1.5 m from one end.', [{ k: 'num', q: 'x²/16 + y²/4 = 1. 1.5 m from the end means x = ?', a: 2.5, x: 'x = 4 − 1.5 = 2.5.' }, { k: 'num', q: 'y = 2√(1 − 6.25/16) ≈ ? (2 decimals)', a: 2 * Math.sqrt(1 - 6.25 / 16), tol: 0.01, show: '1.56', x: '≈ 1.56 m.', act: async () => { await showConic(); W.extra.push({ seg: [[2.5, 0], [2.5, 1.56]], col: C.sora, w: 3 }); } }], 'Height ≈ 1.56 m', { K: { type: 'ellipse', A: 4, B: 2, showF: false }, setup: (W) => planeView(W, -5, 5, -0.5, 3) }),
  C10('Misc', 'Q5', 'A 12 cm rod slides with its ends on the axes. Find the locus of P, 3 cm from the end on the x-axis.', [{ k: 'run', run: async () => { W.rod = { L: 12, ap: 3, th: 1.4, trail: [] }; const s = slider('Rod angle θ', 2, 88, 1, 80, (v) => v + '°', (v) => (W.rod.th = (v * Math.PI) / 180), 5); await wait(AUTO ? 0.2 : 2.5); } }, { k: 'mcq', q: 'x = 9 cos θ, y = 3 sin θ ⇒ locus', o: ['x²/81 + y²/9 = 1', 'x²/9 + y²/81 = 1', 'x²/144 + y²/9 = 1', 'x² + y² = 81'], a: 0, x: 'An ellipse.' }], 'x²/81 + y²/9 = 1', { view: [-1, 13, -1, 8] }),
  C10('Misc', 'Q6', 'Area of the triangle joining the vertex of x² = 12y to the ends of its latus rectum.', [{ k: 'fields', q: 'a = 3: latus rectum ends', f: [{ l: 'x (right end)', a: 6 }, { l: 'y', a: 3 }], x: '(±6, 3).', act: async () => { await showConic(); W.polys.push({ pts: [[0, 0], [-6, 3], [6, 3]], col: C['kin-tint'], a: 0.6 }); } }, { k: 'num', q: 'Area = ½ × 12 × 3 = ?', a: 18, x: '18 square units.' }], 'Area = 18', { K: { type: 'parabola', a: 3, vert: true, span: 1.6, showLR: true } }),
  C10('Misc', 'Q7', 'A runner’s distances to two flag posts 8 m apart always sum to 10 m. Find the path.', [{ k: 'fields', q: '2a = 10, 2c = 8', f: [{ l: 'a', a: 5 }, { l: 'c', a: 4 }, { l: 'b²', a: 9 }], x: 'b² = 25 − 16 = 9.', act: async () => { await showConic(); grabP(W, 1); } }, { k: 'mcq', q: 'Path', o: ['x²/25 + y²/9 = 1', 'x²/25 + y²/16 = 1', 'x²/16 + y²/9 = 1', 'x²/100 + y²/64 = 1'], a: 0, x: 'An ellipse with the posts as foci.' }], 'x²/25 + y²/9 = 1', { K: { type: 'ellipse', A: 5, B: 3 } }),
  C10('Misc', 'Q8', 'An equilateral triangle is inscribed in y² = 4ax with one vertex at the vertex of the parabola. Find its side.', [{ k: 'num', q: 'Other vertices (x, ±x/√3): x²/3 = 4ax ⇒ x = ? (in units of a; take a = 1)', a: 12, x: 'x = 12a.', act: async () => { await showConic(); const y = 12 / Math.sqrt(3); W.polys.push({ pts: [[0, 0], [12, y], [12, -y]], col: C['sora-tint'], a: 0.6 }); } }, { k: 'mcq', q: 'Side = 2y = ?', o: ['8√3a', '12a', '4√3a', '24a'], a: 0, x: '2 × 12a/√3 = 8√3a.' }], 'Side = 8√3a', { K: { type: 'parabola', a: 1, span: 4.2, showD: false }, setup: (W) => planeView(W, -2, 16, -9, 9) }),
];

const BOSS10 = [['β = α gives a', ['parabola', 'circle', 'ellipse', 'hyperbola'], 0], ['Centre of x² + y² − 6x + 4y = 0', ['(3, −2)', '(−3, 2)', '(6, −4)', '(3, 2)'], 0], ['Focus of y² = 20x', ['(5, 0)', '(20, 0)', '(0, 5)', '(10, 0)'], 0], ['Latus rectum of x² = 8y', ['8', '2', '4', '16'], 0], ['Ellipse: c² = ?', ['a² − b²', 'a² + b²', 'b² − a²', 'ab'], 0], ['e of x²/25 + y²/16 = 1', ['3/5', '4/5', '5/3', '1'], 0], ['Hyperbola: e is', ['> 1', '< 1', '= 1', '= 0'], 0], ['x²/9 − y²/16 = 1: c', ['5', '√7', '7', '25'], 0], ['Ellipse: PF₁ + PF₂ =', ['2a', '2b', '2c', 'a + b'], 0], ['Directrix of x² = −12y', ['y = 3', 'y = −3', 'x = 3', 'x = −3'], 0]];

LESSONS.splice(2, 0, exLesson({ id: 'ex101', title: 'Exercise 10.1', blurb: 'All 15: build circles, complete squares, find centres.', face: 'kimmy-playful', qs: EX101 }));
LESSONS.splice(4, 0, exLesson({ id: 'ex102', title: 'Exercise 10.2', blurb: 'All 12: foci, directrices, latus recta, equations.', face: 'jess-happy', qs: EX102 }));
LESSONS.splice(6, 0, exLesson({ id: 'ex103', title: 'Exercise 10.3', blurb: 'All 20 ellipse questions.', face: 'kimmy-excited', qs: EX103 }));
LESSONS.splice(8, 0, exLesson({ id: 'ex104', title: 'Exercise 10.4', blurb: 'All 15 hyperbola questions.', face: 'jess-excited', qs: EX104 }));
LESSONS.push(exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 8: reflectors, arches, bridges, rods, racecourses.', face: 'jess-thinking', qs: EX10M }));
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Chapter 10'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Slice it!'); await cont('Fight'); }, ...BOSS10.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Chapter 10'; }); await summary(['Chapter 10 complete!', { t: 'Circle · Parabola · Ellipse · Hyperbola', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

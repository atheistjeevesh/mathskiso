/* =========================================================
   CHAPTER 10 · CONIC SECTIONS — concept lessons (Examples 1–19)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const cv10 = (x0, x1, y0, y1) => (W) => planeView(W, x0, x1, y0, y1);

LESSONS.push(lesson({
  id: 'cone', title: 'Slicing a Cone', blurb: 'Tilt a plane through a double cone: circle, ellipse, parabola, hyperbola, and the degenerate cases.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('cone', (W) => { W.beta = 90; W.off = 1.2; });
      await slam('CONIC SECTIONS', 'Lesson 1 · Section 10.2');
      await J('idle', 'A double cone with half-angle α = 30°. Tilt the red plane: β is its angle with the axis.');
      let seen = new Set(); slider('Plane angle β', 0, 90, 1, 90, (v) => v + '°', (v) => { W.beta = v; seen.add(W.type); }, 30);
      await task('Find all four: circle, ellipse, parabola, hyperbola', () => { seen.add(W.type); return ['CIRCLE', 'ELLIPSE', 'PARABOLA', 'HYPERBOLA'].every((t) => seen.has(t)); }, (W) => { ['CIRCLE', 'ELLIPSE', 'PARABOLA', 'HYPERBOLA'].forEach((t) => seen.add(t)); W.beta = 30; });
      await K('wow', 'At β = α it is a parabola; below α the plane cuts both nappes!');
      await discover('β vs α decides the curve', 'β = 90°: circle · α < β < 90°: ellipse · β = α: parabola · β < α: hyperbola.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('cone', (W) => { W.beta = 60; W.off = 0; });
      await J('think', 'Now the plane passes through the vertex: degenerate conics.');
      slider('Plane angle β', 0, 90, 1, 60, (v) => v + '°', (v) => (W.beta = v), 10);
      await quiz('Plane through the vertex with β < α gives…', ['a pair of intersecting lines', 'a point', 'a single line', 'a circle'], 0, 'It is the degenerate hyperbola.');
      await quiz('Plane through the vertex with α < β ≤ 90° gives…', ['a point', 'two lines', 'a parabola', 'an ellipse'], 0, 'Only the vertex is shared.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'Circle · Ellipse · Parabola · Hyperbola', eq: true }, 'Through the vertex: point, line, two lines.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'circle', title: 'Circles', blurb: 'Every point is r from the centre. Build circles, then complete the square. Examples 1–4.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('conic', cv10(-6, 6, -4, 4)); W.cn = { type: 'circle', h: 0, k: 0, r: 2.5 }; grabP(W, 0.6);
      await slam('(x − h)² + (y − k)² = r²', 'Lesson ' + L.num + ' · Section 10.3');
      await J('idle', 'Drag P around the circle. CP never changes: that is the definition.');
      await task('Drag P all the way to the bottom', () => conicPoint(W.cn, W.cn.t)[1] < -2.3, (W) => (W.cn.t = -Math.PI / 2));
      exTag('Example 1', 'centre (0, 0), radius r');
      await quiz('Equation', ['x² + y² = r²', 'x + y = r', 'x² − y² = r²', '(x − r)² + y² = 0'], 0, 'h = k = 0.');
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-9, 3, -3, 7));
      exTag('Example 2', 'centre (−3, 2), radius 4');
      const p = circlePart('Build the circle', -3, 2, 4, { c: [0, 0], r: 1.5 }); await p.pre(); const r = await ask(p); await p.act(W, r); await verdict(r, '(x + 3)² + (y − 2)² = 16.', '(x + 3)² + (y − 2)² = 16.');
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-13, 4, -13, 3)); W.cn = { type: 'circle', h: -4, k: -5, r: 7, p: 0 };
      exTag('Example 3', 'x² + y² + 8x + 10y − 8 = 0');
      const r1 = await order('Complete the square', ['(x² + 8x) + (y² + 10y) = 8', '(x² + 8x + 16) + (y² + 10y + 25) = 8 + 16 + 25', '(x + 4)² + (y + 5)² = 49']); await verdict(r1, 'Add (half the coefficient)² to both sides.', 'Group, add 16 and 25, factor.');
      const r2 = await fields('Centre and radius', [{ l: 'h', a: -4 }, { l: 'k', a: -5 }, { l: 'r', a: 7 }]); await traceConic(W, W.cn); await verdict(r2, 'Centre (−4, −5), radius 7.', 'Centre (−4, −5), radius 7.');
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-4, 6, -3, 6)); W.pts.push({ x: 2, y: -2, t: '(2, −2)', col: C.beni }, { x: 3, y: 4, t: '(3, 4)', col: C.beni }); W.curves.push(curve((x) => 2 - x, C.ink, { p: 1 }));
      exTag('Example 4', 'through (2, −2), (3, 4), centre on x + y = 2');
      const r = await fields('Solve the three equations', [{ l: 'h', a: 0.7 }, { l: 'k', a: 1.3 }, { l: 'r²', a: 12.58 }]); await traceConic(W, { type: 'circle', h: 0.7, k: 1.3, r: Math.sqrt(12.58) }); await verdict(r, '(x − 0.7)² + (y − 1.3)² = 12.58.', 'h = 0.7, k = 1.3, r² = 12.58.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '(x − h)² + (y − k)² = r²', eq: true }, 'x² + y² + 2gx + 2fy + c = 0: centre (−g, −f), r = √(g² + f² − c)']); },
  ],
}));

LESSONS.push(lesson({
  id: 'parabola', title: 'Parabolas', blurb: 'Same distance from a point and a line. Drag P and watch PF = PM. Examples 5–8.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('conic', cv10(-4, 9, -6, 6)); W.cn = { type: 'parabola', a: 2, span: 2.2 }; grabP(W, 1);
      await slam('y² = 4ax', 'Lesson ' + L.num + ' · Section 10.4');
      await J('idle', 'Focus F(a, 0), directrix x = −a. Every point P has PF = PM. Drag P and check!');
      await task('Drag P into the lower half', () => conicPoint(W.cn, W.cn.t)[1] < -1, (W) => (W.cn.t = -1));
      W.cn.showLR = true; SFX.pop();
      await discover('Latus rectum = 4a', 'The chord through the focus, perpendicular to the axis.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('board', (W) => { W.tag = '4 forms'; W.sub = 'standard parabolas'; });
      const r = await match('Match each parabola to where it opens', ['y² = 4ax', 'y² = −4ax', 'x² = 4ay', 'x² = −4ay'], ['right', 'left', 'up', 'down'], [0, 1, 2, 3]); await verdict(r, 'The squared variable tells the axis; the sign tells the direction.', 'right, left, up, down.');
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-4, 9, -6, 6)); await traceConic(W, { type: 'parabola', a: 2, span: 2.2, showLR: true });
      exTag('Example 5', 'y² = 8x');
      const r = await fields('4a = 8', [{ l: 'a', a: 2 }, { l: 'focus x', a: 2 }, { l: 'directrix x =', a: -2 }, { l: 'latus rectum', a: 8 }]); await verdict(r, 'Focus (2, 0), directrix x = −2, LR 8.', 'a = 2: focus (2, 0), x = −2, LR = 8.');
      exTag('Example 6', 'focus (2, 0), directrix x = −2');
      await quiz('Equation', ['y² = 8x', 'x² = 8y', 'y² = 4x', 'y² = −8x'], 0, 'a = 2 again.');
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-6, 6, -6, 4)); await traceConic(W, { type: 'parabola', a: -1 / 3, vert: true, span: 3.3 }); W.pts.push({ x: 2, y: -3, t: '(2, −3)', col: C.sora });
      exTag('Example 7', 'vertex (0, 0), focus (0, 2)');
      await quiz('Equation', ['x² = 8y', 'y² = 8x', 'x² = 2y', 'x² = −8y'], 0, 'a = 2, opens up.');
      exTag('Example 8', 'symmetric about the y-axis, through (2, −3)');
      await numQ('x² = −4ay through (2, −3): 4 = 12a ⇒ a = ?', 1 / 3, 'a = 1/3, so 3x² = −4y.', { show: '1/3' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'y² = 4ax: F(a, 0), x = −a, LR 4a', eq: true }, 'x² = 4ay: F(0, a), y = −a.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'ellipse', title: 'Ellipses', blurb: 'PF₁ + PF₂ stays constant. Drag P, find a, b, c, e and the latus rectum. Examples 9–13.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('conic', cv10(-7, 7, -4.5, 4.5)); W.cn = { type: 'ellipse', A: 5, B: 3 }; grabP(W, 1);
      await slam('x²/a² + y²/b² = 1', 'Lesson ' + L.num + ' · Section 10.5');
      await J('idle', 'Foci F₁, F₂. For every P on the ellipse, PF₁ + PF₂ = 2a. Drag P!');
      await task('Drag P to the far right vertex', () => conicPoint(W.cn, W.cn.t)[0] > 4.9, (W) => (W.cn.t = 0));
      await discover('c² = a² − b²,  e = c/a < 1', 'Latus rectum = 2b²/a.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('conic', cv10(-7, 7, -4.5, 4.5)); await traceConic(W, { type: 'ellipse', A: 5, B: 3, showLR: true });
      exTag('Example 9', 'x²/25 + y²/9 = 1');
      const r = await fields('Find', [{ l: 'c', a: 4 }, { l: 'e', a: 0.8, show: '4/5' }, { l: 'LR', a: 3.6, show: '18/5' }]); await verdict(r, 'Foci (±4, 0), vertices (±5, 0), major 10, minor 6.', 'c = 4, e = 4/5, LR = 18/5.');
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-5, 5, -3.6, 3.6)); await traceConic(W, { type: 'ellipse', A: 2, B: 3 });
      exTag('Example 10', '9x² + 4y² = 36');
      await quiz('x²/4 + y²/9 = 1: the major axis is along…', ['the y-axis', 'the x-axis', 'y = x', 'neither'], 0, 'The larger denominator is under y².');
      await fields('Find', [{ l: 'c', a: Math.sqrt(5), show: '√5', tol: 0.01 }, { l: 'e', a: Math.sqrt(5) / 3, show: '√5/3', tol: 0.01 }], { keys: '√' }).then((r) => verdict(r, 'Foci (0, ±√5), vertices (0, ±3).', 'c = √5, e = √5/3.'));
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'a, b, c'; W.sub = 'Examples 11–13'; });
      exTag('Example 11', 'vertices (±13, 0), foci (±5, 0)');
      await numQ('b² = 169 − 25 = ?', 144, 'x²/169 + y²/144 = 1.');
      exTag('Example 12', 'major axis 20, foci (0, ±5)');
      await numQ('a = 10, b² = 100 − 25 = ?', 75, 'x²/75 + y²/100 = 1.');
      exTag('Example 13', 'through (4, 3) and (−1, 4)');
      const r = await fields('16/a² + 9/b² = 1 and 1/a² + 16/b² = 1', [{ l: 'a²', a: 247 / 7, show: '247/7' }, { l: 'b²', a: 247 / 15, show: '247/15' }]); await verdict(r, '7x² + 15y² = 247.', 'a² = 247/7, b² = 247/15.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'PF₁ + PF₂ = 2a,  c² = a² − b²', eq: true }, 'e = c/a,  LR = 2b²/a', 'Larger denominator ⇒ major axis.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'hyperbola', title: 'Hyperbolas', blurb: '|PF₁ − PF₂| stays constant. Two branches, c² = a² + b². Examples 14–16.', face: 'kimmy-playful',
  steps: [
    async function () {
      enterScene('conic', cv10(-8, 8, -5, 5)); W.cn = { type: 'hyperbola', A: 3, B: 4, span: 1.6 }; grabP(W, 0.5);
      await slam('x²/a² − y²/b² = 1', 'Lesson ' + L.num + ' · Section 10.6');
      await J('idle', 'For every P on a hyperbola, |PF₁ − PF₂| = 2a. Drag P, even onto the other branch!');
      await task('Drag P onto the left branch', () => conicPoint(W.cn, W.cn.t)[0] < 0, (W) => (W.cn.br = -1));
      await discover('c² = a² + b²,  e = c/a > 1', 'Latus rectum = 2b²/a.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('conic', cv10(-8, 8, -5, 5)); await traceConic(W, { type: 'hyperbola', A: 3, B: 4, span: 1.6, showLR: true });
      exTag('Example 14 (i)', 'x²/9 − y²/16 = 1');
      const r = await fields('Find', [{ l: 'c', a: 5 }, { l: 'e', a: 5 / 3, show: '5/3' }, { l: 'LR', a: 32 / 3, show: '32/3' }]); await verdict(r, 'Foci (±5, 0), vertices (±3, 0).', 'c = 5, e = 5/3, LR = 32/3.');
      exTag('Example 14 (ii)', 'y² − 16x² = 16');
      await quiz('y²/16 − x²/1 = 1: the foci are', ['(0, ±√17)', '(±√17, 0)', '(0, ±4)', '(0, ±√15)'], 0, 'a = 4, b = 1, c = √17, e = √17/4, LR = 1/2.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'find it'; W.sub = 'Examples 15–16'; });
      exTag('Example 15', 'foci (0, ±3), vertices (0, ±√11/2)');
      await numQ('b² = 9 − 11/4 = ?', 25 / 4, '100y² − 44x² = 275.', { show: '25/4' });
      exTag('Example 16', 'foci (0, ±12), LR 36');
      const r = await fields('2b²/a = 36 ⇒ b² = 18a; 144 = a² + 18a', [{ l: 'a', a: 6 }, { l: 'b²', a: 108 }]); await verdict(r, 'y²/36 − x²/108 = 1 (a = −24 rejected).', 'a = 6, b² = 108.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: '|PF₁ − PF₂| = 2a,  c² = a² + b²', eq: true }, 'e = c/a > 1,  LR = 2b²/a', 'Positive term tells the transverse axis.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'apps', title: 'Conics at Work', blurb: 'A parabolic mirror, a sagging beam and a sliding rod that draws an ellipse. Examples 17–19.', face: 'jess-happy',
  steps: [
    async function () {
      enterScene('conic', cv10(-5, 50, -34, 34)); await traceConic(W, { type: 'parabola', a: 5, span: 3, showF: true, showD: false });
      await slam('REAL CONICS', 'Lesson ' + L.num + ' · Examples 17–19');
      exTag('Example 17', 'mirror: focus 5 cm from the vertex, 45 cm deep');
      W.extra.push({ seg: [[45, -30], [45, 30]], col: C.sora, w: 3 }, { txt: 'AB', x: 47, y: 0, align: 'left' });
      await numQ('y² = 20x at x = 45 ⇒ y = ±30 ⇒ AB = ?', 60, '60 cm.');
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-7, 7, -1, 4)); W.curves.push(curve((x) => (x * x) / 12, C.beni, { p: 1, x0: -6, x1: 6 })); W.extra.push({ txt: 'deflection 3 cm at the centre', x: 0, y: 3.4 });
      exTag('Example 18', 'beam 12 m, deflection 3 cm at the centre');
      await numQ('x² = 4ay through (6, 3/100) ⇒ a = ? (m)', 300, 'a = 300 m.');
      await numQ('Deflection 1 cm means 2 cm above the lowest point: x² = 4 × 300 × 2/100 ⇒ x = ? (2√6)', 2 * Math.sqrt(6), '2√6 ≈ 4.9 m from the centre.', { show: '2√6', keys: '√', tol: 0.01 });
      await cont();
    },
    async function () {
      enterScene('conic', cv10(-1, 16, -1, 9)); W.rod = { L: 15, ap: 6, th: 1.2, trail: [] };
      exTag('Example 19', 'rod AB = 15 cm, AP = 6 cm');
      await J('idle', 'Slide the rod with the slider and watch P trace its path.');
      slider('Rod angle θ', 2, 88, 1, 70, (v) => v + '°', (v) => (W.rod.th = (v * Math.PI) / 180), 5);
      await task('Sweep θ all the way down to near 0°', () => W.rod.th < 0.15, (W) => (W.rod.th = 0.1));
      await quiz('x = 9 cos θ, y = 6 sin θ, so the locus is', ['x²/81 + y²/36 = 1', 'x²/36 + y²/81 = 1', 'x² + y² = 81', 'x/9 + y/6 = 1'], 0, 'cos²θ + sin²θ = 1: an ellipse!');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['Mirrors and dishes: parabolas focus parallel rays.', 'A sliding rod draws an ellipse.', { t: 'Choose axes at the vertex or centre', eq: true }]); },
  ],
}));

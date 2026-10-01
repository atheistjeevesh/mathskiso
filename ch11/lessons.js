/* =========================================================
   CHAPTER 11 · INTRODUCTION TO 3D GEOMETRY — concept lessons (Examples 1–9)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));

LESSONS.push(lesson({
  id: 'space', title: 'Axes, Planes & Octants', blurb: 'Spin 3D space with your finger, slide a point around and watch its octant change. Examples 1–2.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('space');
      await slam('3D SPACE', 'Lesson 1 · Sections 11.2–11.3');
      await J('idle', 'Three mutually perpendicular axes: x (towards you), y (right), z (up). Drag anywhere on the stage to spin it.');
      await task('Spin the space around', () => W.spun > 1.2, (W) => { W.spun = 2; gsap.to(W, { yaw: 0.5, duration: 0.6, yoyo: true, repeat: 1 }); });
      W.planes = [{ n: 'xy', a: 0 }, { n: 'yz', a: 0 }, { n: 'zx', a: 0 }]; for (const p of W.planes) { gsap.to(p, { a: 0.5, duration: 0.5 }); SFX.pop(); await wait(0.35); }
      await K('wow', 'Three coordinate planes cut space into 8 octants!');
      await quiz('The x-axis and y-axis together determine…', ['the XY-plane', 'the YZ-plane', 'the ZX-plane', 'an octant'], 0, 'The floor of our room.');
      await cont();
    },
    async function () {
      enterScene('space', (W) => { W.planes = ['xy']; });
      await J('think', 'A point P(x, y, z): x, y, z are its distances from the YZ, ZX and XY planes. Slide P to (2, 4, 5).');
      const P = xyzSliders(W, [1, 1, 1], 5, [2, 4, 5]); W.pts.push({ p: () => P, t: () => P3(P), drop: true }); W.cap = () => (octOf(P) >= 0 ? 'octant ' + ROMAN[octOf(P)] : 'on a plane');
      await task('Move P to (2, 4, 5)', () => P[0] === 2 && P[1] === 4 && P[2] === 5);
      exTag('Example 1', 'P(2, 4, 5): F is on the ZX-plane');
      W.boxes.push({ a: [0, 0, 0], b: [2, 4, 5] }); SFX.swish();
      await quiz('F lies in the ZX-plane under P’s box: F = ?', ['(2, 0, 5)', '(2, 4, 0)', '(0, 4, 5)', '(2, 0, 0)'], 0, 'Distance along OY is 0.');
      await cont();
    },
    async function () {
      enterScene('space'); const P = xyzSliders(W, [3, 3, 3], 5, [-3, 1, 2]); W.pts.push({ p: () => P, t: () => P3(P), drop: true }); W.cap = () => { const o = octOf(P); W.oct = o; return o >= 0 ? 'octant ' + ROMAN[o] : 'on a plane'; };
      await J('idle', 'The signs of (x, y, z) decide the octant: I is (+, +, +), then II, III, IV going round with z > 0; V–VIII are below.');
      exTag('Example 2', '(−3, 1, 2) and (−3, 1, −2)');
      await task('Slide P to (−3, 1, 2)', () => P[0] === -3 && P[1] === 1 && P[2] === 2);
      await quiz('(−3, 1, 2) is in octant…', ['II', 'III', 'VI', 'I'], 0, '(−, +, +).');
      await quiz('Flip z: (−3, 1, −2) is in octant…', ['VI', 'II', 'VII', 'V'], 0, '(−, +, −).');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary(['x-axis: (x, 0, 0) · YZ-plane: (0, y, z)', { t: '8 octants decided by the signs of x, y, z', eq: true }]); },
  ],
}));

LESSONS.push(lesson({
  id: 'dist', title: 'Distance in Space', blurb: 'Pythagoras twice: the diagonal of a box. Collinear points, right triangles, loci. Examples 3–6.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('space', (W) => { W.yaw = -0.8; }); const Pp = [1, -3, 4], Q = [-4, 1, 2];
      await slam('PQ = √(Δx² + Δy² + Δz²)', 'Lesson ' + L.num + ' · Section 11.4');
      W.pts.push({ p: Pp, t: 'P(1, −3, 4)' }, { p: Q, t: 'Q(−4, 1, 2)', col: C.sora }); W.boxes.push({ a: Pp, b: Q, col: C.ink });
      await J('idle', 'Build a box with PQ as its diagonal. Its edges are |Δx|, |Δy|, |Δz|. Pythagoras on the floor, then again up the side.');
      const r = await fields('Edges', [{ l: '|Δx|', a: 5 }, { l: '|Δy|', a: 4 }, { l: '|Δz|', a: 2 }]); await verdict(r, '5, 4, 2.', '5, 4, 2.');
      W.segs.push({ a: Pp, b: Q, col: C.beni, p: 0, t: 'PQ' }); gsap.to(W.segs[0], { p: 1, duration: 0.7 }); SFX.swish();
      exTag('Example 3');
      await numQ('PQ = √(25 + 16 + 4) = ? (type 3√5)', 3 * Math.sqrt(5), '√45 = 3√5.', { show: '3√5', keys: '√', tol: 0.01 });
      await cont();
    },
    async function () {
      enterScene('space'); const A = [-2, 3, 5], B = [1, 2, 3], Cc = [7, 0, -1]; W.R = 7; W.s = 0.36; W.pts.push({ p: A, t: 'P' }, { p: B, t: 'Q' }, { p: Cc, t: 'R' });
      exTag('Example 4', 'P(−2, 3, 5), Q(1, 2, 3), R(7, 0, −1)');
      const r = await fields('Distances', [{ l: 'PQ', a: Math.sqrt(14), show: '√14', tol: 0.01 }, { l: 'QR', a: 2 * Math.sqrt(14), show: '2√14', tol: 0.01 }, { l: 'PR', a: 3 * Math.sqrt(14), show: '3√14', tol: 0.01 }], { keys: '√' }); await verdict(r, 'PQ + QR = PR ⇒ collinear.', '√14, 2√14, 3√14.');
      W.segs.push({ a: A, b: Cc, col: C.beni, p: 0 }); gsap.to(W.segs[0], { p: 1, duration: 0.8 }); SFX.swish();
      exTag('Example 5', 'A(3, 6, 9), B(10, 20, 30), C(25, −41, 5)');
      await quiz('AB² = 686, BC² = 4571, CA² = 2709. Right-angled?', ['No: 686 + 2709 ≠ 4571', 'Yes, at A', 'Yes, at B', 'Yes, at C'], 0, 'The two smaller squares must add to the largest.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'locus'; W.sub = 'Example 6'; });
      exTag('Example 6', 'PA² + PB² = 2k², A(3, 4, 5), B(−1, 3, −7)');
      const r = await order('Build the equation', ['PA² = (x − 3)² + (y − 4)² + (z − 5)²', 'PB² = (x + 1)² + (y − 3)² + (z + 7)²', 'Add and expand: 2x² + 2y² + 2z² − 4x − 14y + 4z + 109', '= 2k², so 2x² + 2y² + 2z² − 4x − 14y + 4z = 2k² − 109']); await verdict(r, 'A locus is just the condition written in x, y, z.', 'Write PA², PB², add, simplify.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'PQ = √((x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²)', eq: true }, 'Collinear: the two short lengths add to the long one.', 'Locus: write the condition with P(x, y, z).']); },
  ],
}));

LESSONS.push(lesson({
  id: 'mixed', title: 'Shapes in Space', blurb: 'Parallelograms that are not rectangles, equidistant planes and a missing vertex from the centroid. Examples 7–9.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('space', (W) => { W.R = 7; W.s = 0.34; }); const A = [1, 2, 3], B = [-1, -2, -1], Cc = [2, 3, 2], Dd = [4, 7, 6];
      await slam('MIXED', 'Lesson ' + L.num + ' · Examples 7–9');
      W.pts.push({ p: A, t: 'A' }, { p: B, t: 'B' }, { p: Cc, t: 'C' }, { p: Dd, t: 'D' }); W.segs.push({ a: A, b: B }, { a: B, b: Cc }, { a: Cc, b: Dd }, { a: Dd, b: A });
      exTag('Example 7', 'A(1, 2, 3), B(−1, −2, −1), C(2, 3, 2), D(4, 7, 6)');
      const r = await fields('Sides', [{ l: 'AB', a: 6 }, { l: 'BC', a: Math.sqrt(43), show: '√43', tol: 0.01 }, { l: 'CD', a: 6 }, { l: 'DA', a: Math.sqrt(43), show: '√43', tol: 0.01 }], { keys: '√' }); await verdict(r, 'Opposite sides equal ⇒ parallelogram.', '6, √43, 6, √43.');
      W.segs.push({ a: A, b: Cc, col: C.beni, dash: [6, 4], t: 'AC = √3' }, { a: B, b: Dd, col: C.sora, dash: [6, 4], t: 'BD = √155' }); SFX.swish();
      await quiz('Diagonals AC = √3, BD = √155. Rectangle?', ['No: diagonals unequal', 'Yes', 'Only a square', 'Cannot tell'], 0, 'A rectangle needs equal diagonals.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'PA = PB'; W.sub = 'Example 8'; });
      exTag('Example 8', 'equidistant from A(3, 4, −5) and B(−2, 1, 4)');
      await quiz('Square both sides and cancel x², y², z²:', ['10x + 6y − 18z − 29 = 0', '10x − 6y + 18z = 29', 'x + y + z = 0', '5x + 3y − 9z = 0'], 0, 'A plane: the perpendicular bisector plane of AB.');
      exTag('Example 9', 'centroid (1, 1, 1), A(3, −5, 7), B(−1, 7, −6)');
      const r = await fields('C = 3G − A − B', [{ l: 'x', a: 1 }, { l: 'y', a: 1 }, { l: 'z', a: 2 }]); await verdict(r, 'C(1, 1, 2).', 'C(1, 1, 2).');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['Parallelogram: opposite sides equal (or diagonals bisect).', 'Rectangle also needs equal diagonals.', { t: 'Centroid = ((x₁+x₂+x₃)/3, (y₁+y₂+y₃)/3, (z₁+z₂+z₃)/3)', eq: true }]); },
  ],
}));

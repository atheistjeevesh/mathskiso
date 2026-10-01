/* =========================================================
   CLASS 12 · CHAPTER 6 · APPLICATION OF DERIVATIVES — lessons (Examples 1–37)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));
const piK = { tol: 1e-3, keys: 'π' };
/* picture helpers for the optimisation playground (screen space, left panel) */
const PIC = {
  box(W, x, a, b) { const { cx, cy, s } = LP(); const k = Math.min((SW * (SW > 600 ? 0.42 : 0.4)) / b, (SH * 0.62) / a) / 1, X = (u) => cx + (u - b / 2) * k, Y = (v) => cy + (v - a / 2) * k; ctx.fillStyle = C['sora-tint']; ctx.fillRect(X(0), Y(0), b * k, a * k); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(X(0), Y(0), b * k, a * k); ctx.fillStyle = C.sakura; for (const [u, v] of [[0, 0], [b - x, 0], [0, a - x], [b - x, a - x]]) { ctx.fillRect(X(u), Y(v), x * k, x * k); ctx.strokeRect(X(u), Y(v), x * k, x * k); } ctx.setLineDash([5, 4]); ctx.strokeRect(X(x), Y(x), (b - 2 * x) * k, (a - 2 * x) * k); ctx.setLineDash([]); D.text('cut ' + fmtN(x, 2), X(x / 2), Y(x / 2) + 4, { size: 11, w: 800 }); D.text((b - 2 * x > 0 ? fmtN(b - 2 * x, 2) : 0) + ' × ' + fmtN(Math.max(0, a - 2 * x), 2) + ' × ' + fmtN(x, 2), X(b / 2), Y(a) + 18, { size: 12, w: 800 }); },
  split(W, x, S, la = 'x', lb = 'S − x') { const { cx, cy } = LP(); const w = SW * (SW > 600 ? 0.42 : 0.4), x0 = cx - w / 2, k = w / S; ctx.fillStyle = C.kin; ctx.fillRect(x0, cy - 12, x * k, 24); ctx.fillStyle = C['sora-tint']; ctx.fillRect(x0 + x * k, cy - 12, (S - x) * k, 24); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.strokeRect(x0, cy - 12, w, 24); D.text(la + ' = ' + fmtN(x, 2), x0 + (x * k) / 2, cy - 20, { size: 12, w: 800 }); D.text(lb + ' = ' + fmtN(S - x, 2), x0 + x * k + ((S - x) * k) / 2, cy + 32, { size: 12, w: 800 }); },
  rectCircle(W, t) { const { cx, cy, s } = LP(); const R = Math.min(SW * 0.17, SH * 0.3); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); const w = R * Math.cos(t), h = R * Math.sin(t); ctx.fillStyle = C['sora-tint']; ctx.fillRect(cx - w, cy - h, 2 * w, 2 * h); ctx.strokeRect(cx - w, cy - h, 2 * w, 2 * h); ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(cx - w, cy + h); ctx.lineTo(cx + w, cy - h); ctx.stroke(); ctx.setLineDash([]); },
  cylIn(W, x, kind, R = 1, H = 1) { const { cx, cy } = LP(); const k = Math.min(SW * 0.17, SH * 0.3); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; let r, h, y0; if (kind === 'sphere') { ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 7); ctx.stroke(); r = x; h = 2 * Math.sqrt(Math.max(0, R * R - x * x)); y0 = cy - (h / 2) * k; } else { const base = cy + H * k * 0.5; ctx.beginPath(); ctx.moveTo(cx - R * k, base); ctx.lineTo(cx + R * k, base); ctx.lineTo(cx, base - H * k); ctx.closePath(); ctx.stroke(); r = x; h = (H * (R - x)) / R; y0 = base - h * k; } ctx.fillStyle = C['sora-tint']; ctx.fillRect(cx - r * k, y0, 2 * r * k, h * k); ctx.strokeRect(cx - r * k, y0, 2 * r * k, h * k); D.text('r = ' + fmtN(r, 2) + ', h = ' + fmtN(h, 2), cx, cy + k + 22, { size: 12, w: 800 }); },
  coneIn(W, x, R = 1) { const { cx, cy } = LP(); const k = Math.min(SW * 0.17, SH * 0.3); ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R * k, 0, 7); ctx.stroke(); const h = x, r = Math.sqrt(Math.max(0, h * (2 * R - h))), top = cy - R * k, base = top + h * k; ctx.fillStyle = C['kin-tint']; ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx - r * k, base); ctx.lineTo(cx + r * k, base); ctx.closePath(); ctx.fill(); ctx.stroke(); D.text('h = ' + fmtN(h, 2), cx, cy + R * k + 22, { size: 12, w: 800 }); },
  window(W, x, P = 10) { const { cx, cy } = LP(); const y = (P - x - (Math.PI * x) / 2) / 2, k = Math.min(SW * 0.06, SH * 0.1), base = cy + 1.5 * k; if (y < 0) return; ctx.fillStyle = C['sora-tint']; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.fillRect(cx - (x / 2) * k, base - y * k, x * k, y * k); ctx.strokeRect(cx - (x / 2) * k, base - y * k, x * k, y * k); ctx.beginPath(); ctx.arc(cx, base - y * k, (x / 2) * k, Math.PI, 0); ctx.fill(); ctx.stroke(); D.text('width ' + fmtN(x, 2) + ', height ' + fmtN(y, 2), cx, base + 20, { size: 12, w: 800 }); },
};

LESSONS.push(lesson({
  id: 'rates', title: 'Rates of Change', blurb: 'Ripples, cubes, rectangles and cost curves: every rate is a derivative, chained through time. Examples 1–6.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('rate', (W) => rateSet(W, 'circle', 2, [['A = πr²'], ['dA/dr = 2πr', C.beni]], { scale: 0.45 }));
      await slam('dA/dr', 'Class 12 · Lesson 1 · Section 6.2');
      exTag('Example 1', 'area of a circle, r = 5 cm');
      rateSlider(W, 'r', 1, 6, 0.5, (v) => v + ' cm', (v) => [['A = πr² = ' + fmtN(PI * v * v, 2)], ['dA/dr = 2πr = ' + fmtN(2 * PI * v, 2), C.beni]]);
      await task('Grow r to 5 cm', () => W.v === 5, (W) => { W.v = 5; W.lines = [['A = 25π'], ['dA/dr = 10π', C.beni]]; });
      await numQ('dA/dr at r = 5 = ? (type with π)', 10 * PI, '10π cm² per cm.', { ...piK, show: '10π' });
      await cont();
    },
    async function () {
      enterScene('rate', (W) => rateSet(W, 'cube', 6, [['V = x³, S = 6x²'], ['dV/dt = 9 cm³/s', C.sora]], { scale: 0.25 }));
      exTag('Example 2', 'cube: dV/dt = 9, x = 10');
      await J('idle', 'Chain through time: dV/dt = 3x² dx/dt, so dx/dt = 3/x². Then dS/dt = 12x dx/dt = 36/x.');
      rateSlider(W, 'edge x', 2, 12, 1, (v) => v + ' cm', (v) => [['dx/dt = 3/x² = ' + fmtN(3 / (v * v), 3)], ['dS/dt = 36/x = ' + fmtN(36 / v, 3), C.beni]]);
      await task('Set the edge to 10 cm', () => W.v === 10, (W) => (W.v = 10));
      await numQ('dS/dt at x = 10 = ?', 3.6, '3.6 cm²/s.');
      exTag('Example 3', 'stone in a lake: dr/dt = 4, r = 10');
      W.kind = 'circle'; W.v = 10; W.scale = 0.22; SFX.drop ? SFX.drop() : SFX.pop();
      await numQ('dA/dt = 2πr dr/dt = ? (type with π)', 80 * PI, '80π cm²/s.', { ...piK, show: '80π' });
      await cont();
    },
    async function () {
      enterScene('rate', (W) => rateSet(W, 'rect', 10, [['dx/dt = −3, dy/dt = 2']], { v2: 6, scale: 0.25 }));
      exTag('Example 4', 'rectangle: x shrinks, y grows');
      const b = button('Play 1 minute'); await waitFor(() => b.clicked()); b.stop(); await tw(W, { v: 7, v2: 8, duration: AUTO ? 0.05 : 1.2 });
      const r = await fields('At x = 10, y = 6', [{ l: 'dP/dt', a: -2 }, { l: 'dA/dt', a: 2 }]); await verdict(r, 'dP/dt = 2(−3 + 2) = −2 cm/min; dA/dt = −3·6 + 10·2 = 2 cm²/min.', '−2 and 2.');
      await cont();
    },
    async function () {
      enterScene('calc', (W) => { const Cx = (x) => 0.005 * x ** 3 - 0.02 * x * x + 30 * x + 5000; calcView(W, Cx, 0, 6); W.a = 1; W.tan = true; grabCalc(W); W.fLab = 'C'; });
      exTag('Example 5', 'marginal cost');
      await J('idle', 'Marginal cost is dC/dx: the slope of the cost curve.');
      await task('Drag P to x = 3', () => Math.abs(W.a - 3) < 0.026, (W) => (W.a = 3));
      await numQ('MC = 0.015(9) − 0.04(3) + 30 = ?', 30.015, '₹30.02 (nearly).', { tol: 0.006 });
      exTag('Example 6', 'R(x) = 3x² + 36x + 5');
      await numQ('Marginal revenue 6x + 36 at x = 5 = ?', 66, '₹66.', { pre: '₹' });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary([{ t: 'dy/dt = (dy/dx)(dx/dt)', eq: true }, 'Marginal cost/revenue = derivative of cost/revenue.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'incdec', title: 'Rising & Falling', blurb: 'Paint the sign of f′ under the graph: green rises, red falls. Critical points cut the line. Examples 7–13.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('mono', (W) => monoSet(W, (x) => x ** 3 - 3 * x * x + 4 * x, -1, 3, { strip: 0 }));
      await slam("SIGN OF f′", 'Lesson ' + L.num + ' · Section 6.3');
      exTag('Examples 7–8', '7x − 3 and x³ − 3x² + 4x');
      await J('idle', 'f′(x) = 3x² − 6x + 4 = 3(x − 1)² + 1 > 0 everywhere. Watch the strip.');
      await stripRun(W);
      await quiz('So x³ − 3x² + 4x is', ['increasing on ℝ', 'decreasing on ℝ', 'neither', 'constant'], 0, 'f′ > 0 everywhere.');
      exTag('Example 9', 'cos x'); monoSet(W, Math.cos, 0, 2 * PI, { strip: 0, crit: [PI], critLab: () => 'π' }); await stripRun(W);
      await quiz('cos x on (0, 2π) is', ['decreasing on (0, π), increasing on (π, 2π)', 'increasing throughout', 'decreasing throughout', 'constant'], 0, 'f′ = −sin x.');
      await cont();
    },
    async function () {
      enterScene('mono', (W) => monoSet(W, (x) => 4 * x ** 3 - 6 * x * x - 72 * x + 30, -5, 6, { strip: 0, crit: [-2, 3] }));
      exTag('Example 10', 'x² − 4x + 6');
      await quiz('f′ = 2x − 4 = 0 at x = 2. Then f is', ['decreasing on (−∞, 2), increasing on (2, ∞)', 'increasing on (−∞, 2)', 'increasing everywhere', 'decreasing everywhere'], 0, 'Sign of 2x − 4.');
      exTag('Example 11', '4x³ − 6x² − 72x + 30');
      await J('think', 'f′ = 12(x − 3)(x + 2): the critical points −2 and 3 cut the line into three pieces.');
      await stripRun(W);
      await pickQ('Where is f increasing?', ['(−∞, −2)', '(−2, 3)', '(3, ∞)'], ['(−∞, −2)', '(3, ∞)'], 'Both factors share a sign there.', { brace: false });
      await cont();
    },
    async function () {
      enterScene('mono', (W) => monoSet(W, (x) => Math.sin(3 * x), 0, PI / 2, { strip: 0, crit: [PI / 6], critLab: () => 'π/6', dom: [0, PI / 2] }));
      exTag('Example 12', 'sin 3x on [0, π/2]'); await stripRun(W);
      await quiz('sin 3x is', ['increasing on [0, π/6], decreasing on [π/6, π/2]', 'increasing on [0, π/2]', 'decreasing on [0, π/6]', 'constant'], 0, 'f′ = 3 cos 3x.');
      exTag('Example 13', 'sin x + cos x on [0, 2π]'); monoSet(W, (x) => Math.sin(x) + Math.cos(x), 0, 2 * PI, { strip: 0, crit: [PI / 4, 5 * PI / 4], critLab: (c) => (c < 1 ? 'π/4' : '5π/4') }); await stripRun(W);
      await pickQ('Where is it decreasing?', ['[0, π/4)', '(π/4, 5π/4)', '(5π/4, 2π]'], ['(π/4, 5π/4)'], 'f′ = cos x − sin x < 0 there.', { brace: false });
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'f′ > 0 ⇒ increasing; f′ < 0 ⇒ decreasing', eq: true }, 'Find f′ = 0, split the line, test one point per piece.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'extrema', title: 'Hills & Valleys', blurb: 'Local maxima and minima: f′ changes sign (first test) or f″ has a sign (second test). Examples 14–21.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('mono', (W) => monoSet(W, (x) => x * x, -3, 3, { strip: 0 }));
      await slam('MAX / MIN', 'Lesson ' + L.num + ' · Section 6.4');
      exTag('Examples 14–16', 'x², |x|, x on (0, 1)');
      await quiz('x² on ℝ has', ['minimum 0, no maximum', 'maximum 0', 'both', 'neither'], 0, 'It grows without bound.');
      W.F = Math.abs; SFX.flip();
      await quiz('|x| on ℝ has', ['minimum 0 (at a kink), no maximum', 'no minimum', 'maximum 0', 'both'], 0, 'Extrema can sit where f is not differentiable.');
      await quiz('f(x) = x on the OPEN interval (0, 1) has', ['neither max nor min', 'max 1', 'min 0', 'both'], 0, 'The endpoints are not included.');
      await cont();
    },
    async function () {
      const f = (x) => x ** 3 - 3 * x + 3;
      enterScene('mono', (W) => monoSet(W, f, -2.5, 2.5, { strip: 0, crit: [-1, 1], a: -2, tan: true }));
      exTag('Example 17', 'x³ − 3x + 3');
      await J('idle', 'Drag P across x = −1 and x = 1: the tangent goes flat and the strip changes colour.');
      await stripRun(W);
      W.marks = [{ x: -1, kind: turn(f, -1) }, { x: 1, kind: turn(f, 1) }]; SFX.chime();
      const r = await fields('Local values', [{ l: 'local max f(−1)', a: 5 }, { l: 'local min f(1)', a: 1 }]); await verdict(r, 'Green→red is a hill; red→green is a valley.', '5 and 1.');
      exTag('Examples 18 & 21', '2x³ − 6x² + 6x + 5'); monoSet(W, (x) => 2 * x ** 3 - 6 * x * x + 6 * x + 5, -1, 3, { strip: 0, crit: [1] }); await stripRun(W);
      await quiz('f′ = 6(x − 1)² never changes sign, so x = 1 is', ['a point of inflexion', 'a local max', 'a local min', 'not critical'], 0, 'f″(1) = 0 too: the second test fails.');
      await cont();
    },
    async function () {
      const f = (x) => 3 * x ** 4 + 4 * x ** 3 - 12 * x * x + 12;
      enterScene('mono', (W) => monoSet(W, f, -3, 2, { strip: 0, crit: [-2, 0, 1], y: [-25, 30] }));
      exTag('Example 19', '3 + |x|');
      await quiz('f(x) = 3 + |x| has at x = 0', ['a local minimum 3 (first test)', 'a local max 3', 'no extremum', 'f″(0) > 0'], 0, 'Not differentiable at 0, but f′ goes − to +.');
      exTag('Example 20', '3x⁴ + 4x³ − 12x² + 12');
      await J('think', "Second derivative test: f″ = 12(3x² + 2x − 2). f″(0) = −24 < 0 (hill), f″(1) = 36 > 0, f″(−2) = 72 > 0 (valleys).");
      await stripRun(W); W.marks = [-2, 0, 1].map((x) => ({ x, kind: turn(f, x) })); SFX.chime();
      const r = await fields('Values', [{ l: 'local max f(0)', a: 12 }, { l: 'local min f(1)', a: 7 }, { l: 'local min f(−2)', a: -20 }]); await verdict(r, '12, 7 and −20.', '12, 7, −20.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: "f′(c) = 0: f″(c) < 0 max, f″(c) > 0 min, f″(c) = 0 test fails", eq: true }, 'First derivative test: + → − hill, − → + valley, no change: inflexion.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'optimise', title: 'Optimisation Playground', blurb: 'Slide to the best value, then prove it with f′ = 0. Squares, parabolas, poles, trapeziums, cylinders in cones. Examples 22–26.', face: 'jess-excited',
  steps: [
    async function () {
      enterScene('opt', (W) => optSet(W, (x) => x * x + (15 - x) ** 2, 0, 15, 2, (W, x) => PIC.split(W, x, 15, 'x', '15 − x'), { flab: 'x² + (15 − x)²' }));
      await slam('BEST POSSIBLE', 'Lesson ' + L.num + ' · Applications');
      exTag('Example 22', 'sum 15, least sum of squares');
      const sl = slider('x', 0, 15, 0.5, 2, (v) => fmtN(v, 1), (v) => (W.x = v), 7.5);
      await task('Slide x to the lowest point of the graph', () => W.x === 7.5, (W) => { W.x = 7.5; sl.value = 7.5; });
      W.found = true; SFX.chime();
      await numQ("S′(x) = 4x − 30 = 0 gives x = ?", 7.5, 'x = 15/2: the numbers are 15/2 and 15/2.', { show: '15/2' });
      await cont();
    },
    async function () {
      const c = 3, Dk = (k) => Math.sqrt(k + (k - c) ** 2);
      enterScene('opt', (W) => optSet(W, Dk, 0, 5, 0.5, (W, k) => { const { cx, cy } = LP(); const s = Math.min(SW * 0.04, SH * 0.06); ctx.strokeStyle = C.sora; ctx.lineWidth = 3; ctx.beginPath(); for (let i = -60; i <= 60; i++) { const x = i / 25, y = x * x; const px = cx + x * s * 1.6, py = cy + 2.4 * s - y * s * 0.6; i === -60 ? ctx.moveTo(px, py) : ctx.lineTo(px, py); } ctx.stroke(); const hx = Math.sqrt(k); const P = [cx + hx * s * 1.6, cy + 2.4 * s - k * s * 0.6], Q = [cx, cy + 2.4 * s - c * s * 0.6]; ctx.strokeStyle = C.beni; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(...P); ctx.lineTo(...Q); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = C.kin; ctx.beginPath(); ctx.arc(P[0], P[1], 7, 0, 7); ctx.fill(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(Q[0], Q[1], 5, 0, 7); ctx.fill(); D.text('(0, c)', Q[0] - 10, Q[1] - 8, { size: 11, w: 800, align: 'right' }); }, { flab: 'distance D', xlab: 'k = h²' }));
      exTag('Example 23', '(0, c) to y = x², shown with c = 3');
      const sl = slider('k', 0, 5, 0.25, 0.5, (v) => fmtN(v, 2), (v) => (W.x = v), 2.5);
      await task('Slide k to make D smallest', () => W.x === 2.5, (W) => { W.x = 2.5; sl.value = 2.5; });
      W.found = true; await quiz('D′(k) = 0 at k = (2c − 1)/2. The least distance is', ['√(4c − 1)/2', 'c', '(2c − 1)/2', '√c'], 0, 'With c = 3: √11/2 ≈ 1.658.');
      exTag('Example 24', 'poles 16 m and 22 m, 20 m apart');
      await numQ('S(x) = 2x² − 40x + 1140 is least at x = ? (m from A)', 10, 'S′ = 4x − 40 = 0.');
      await cont();
    },
    async function () {
      const A = (x) => (x + 10) * Math.sqrt(100 - x * x);
      enterScene('opt', (W) => optSet(W, A, 0, 10, 1, (W, x) => { const { cx, cy } = LP(); const s = Math.min(SW * 0.012, SH * 0.02); const h = Math.sqrt(100 - x * x); ctx.fillStyle = C['sora-tint']; ctx.strokeStyle = C.ink; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - (5 + x) * s, cy + (h / 2) * s); ctx.lineTo(cx + (5 + x) * s, cy + (h / 2) * s); ctx.lineTo(cx + 5 * s, cy - (h / 2) * s); ctx.lineTo(cx - 5 * s, cy - (h / 2) * s); ctx.closePath(); ctx.fill(); ctx.stroke(); D.text('three sides 10 cm', cx, cy + (h / 2) * s + 20, { size: 12, w: 800 }); }, { flab: 'area A' }));
      exTag('Example 25', 'trapezium with three sides 10 cm');
      const sl = slider('x', 0, 10, 0.5, 1, (v) => fmtN(v, 1), (v) => (W.x = v), 5);
      await task('Slide x for the largest area', () => W.x === 5, (W) => { W.x = 5; sl.value = 5; });
      W.found = true; await numQ('A(5) = 15√75 = 75√3 ≈ ? (2 decimals)', 75 * R3, '75√3 cm² ≈ 129.9 cm².', { tol: 0.011, show: fmtN(75 * R3, 3) });
      exTag('Example 26', 'cylinder in a cone');
      optSet(W, (x) => x * (1 - x), 0, 1, 0.2, (W, x) => PIC.cylIn(W, x, 'cone', 1, 1.6), { flab: 'curved area ∝ x(r − x)', xlab: 'x/r' }); W.found = false; sl.parentNode.remove();
      await quiz('S(x) = (2πh/r)(rx − x²) is largest when x =', ['r/2', 'r/3', '2r/3', 'r'], 0, 'S′ = (2πh/r)(r − 2x) = 0.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Write the quantity in ONE variable, set the derivative to 0, check f″', eq: true }, 'Throw away values that make no physical sense.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'absolute', title: 'Closed Intervals', blurb: 'On [a, b] check every critical point AND both ends; the biggest value wins. Examples 27–29.', face: 'kimmy-playful',
  steps: [
    async function () {
      const f = (x) => 2 * x ** 3 - 15 * x * x + 36 * x + 1;
      enterScene('mono', (W) => monoSet(W, f, 1, 5, { strip: 0, crit: [2, 3], dom: [1, 5] }));
      await slam('[a, b]', 'Lesson ' + L.num + ' · Section 6.4.1');
      exTag('Example 27', '2x³ − 15x² + 36x + 1 on [1, 5]');
      await stripRun(W);
      const r = await fields('Values at the candidates', [{ l: 'f(1)', a: 24 }, { l: 'f(2)', a: 29 }, { l: 'f(3)', a: 28 }, { l: 'f(5)', a: 56 }]); await verdict(r, 'Absolute max 56 at x = 5 (an END point!), absolute min 24 at x = 1.', '24, 29, 28, 56.');
      await cont();
    },
    async function () {
      const f = (x) => 12 * Math.cbrt(x) ** 4 - 6 * Math.cbrt(x);
      enterScene('mono', (W) => monoSet(W, f, -1, 1, { strip: 0, crit: [0, 1 / 8], critLab: (c) => (c ? '1/8' : '0'), dom: [-1, 1], y: [-3, 19] }));
      exTag('Example 28', '12x^(4/3) − 6x^(1/3) on [−1, 1]');
      await J('think', 'f′ = 2(8x − 1)/x^(2/3): zero at 1/8 and undefined at 0. Both are critical.');
      await stripRun(W);
      const r = await fields('Absolute values', [{ l: 'max', a: 18 }, { l: 'min', a: -9 / 4, show: '−9/4' }]); await verdict(r, 'Max 18 at x = −1, min −9/4 at x = 1/8.', '18 and −9/4.');
      exTag('Example 29', 'helicopter on y = x² + 7, soldier at (3, 7)');
      await quiz('f(x) = (x − 3)² + x⁴ has f′ = 2(x − 1)(2x² + 2x + 3) = 0 only at x = 1. Nearest distance', ['√5', '5', '3', '√3'], 0, '√f(1) = √5.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Candidates: f′ = 0, f′ undefined, and the end points', eq: true }, 'Evaluate f at all of them; pick the largest and smallest.']); },
  ],
}));

LESSONS.push(lesson({
  id: 'miscex', title: 'Mixed Applications', blurb: 'A car that stops, a cone tank, a shadow, a disc, a box and a profit. Examples 30–37.', face: 'jess-happy',
  steps: [
    async function () {
      enterScene('calc', (W) => { const x = (t) => t * t * (2 - t / 3); calcView(W, x, 0, 5); W.a = 1; W.tan = true; grabCalc(W); W.fLab = 'x'; });
      await slam('MIXED', 'Lesson ' + L.num + ' · Miscellaneous Examples');
      exTag('Example 30', 'x = t²(2 − t/3)');
      await J('idle', 'The car stops when the slope (velocity) v = 4t − t² is 0 again.');
      await task('Drag P to where the tangent is flat (t > 0)', () => Math.abs(W.a - 4) < 0.026, (W) => (W.a = 4));
      const r = await fields('Time and distance', [{ l: 't', a: 4, post: 's' }, { l: 'PQ', a: 32 / 3, show: '32/3', post: 'm' }]); await verdict(r, 't = 4 s, 32/3 m.', '4 s, 32/3 m.');
      await cont();
    },
    async function () {
      enterScene('rate', (W) => rateSet(W, 'cone', 2, [['r = h/2, V = πh³/12'], ['dV/dt = 5 m³/h', C.sora]], { scale: 0.65 }));
      exTag('Example 31', 'cone tank, depth 4 m');
      rateSlider(W, 'depth h', 0.5, 4, 0.5, (v) => v + ' m', (v) => [['V = πh³/12'], ['dh/dt = 20/(πh²) = ' + fmtN(20 / (PI * v * v), 4), C.beni]]);
      await task('Fill to h = 4 m', () => W.v === 4, (W) => (W.v = 4));
      await numQ('dh/dt = 5/(4π) = ? (use π = 22/7, as a fraction)', 35 / 88, '35/88 m/h.', { show: '35/88', tol: 1e-4 });
      exTag('Example 32', 'shadow of a 2 m man, 6 m lamp');
      rateSet(W, 'shadow', 3, [['l = 2s'], ['dl/dt = 5 km/h', C.sora]]); SFX.flip();
      await numQ('ds/dt = ½ dl/dt = ?', 2.5, '5/2 km/h.', { show: '5/2' });
      await cont();
    },
    async function () {
      const f = (x) => 0.3 * x ** 4 - 0.8 * x ** 3 - 3 * x * x + 7.2 * x + 11;
      enterScene('mono', (W) => monoSet(W, f, -3.5, 4.5, { strip: 0, crit: [-2, 1, 3] }));
      exTag('Example 33', 'f′ = (6/5)(x − 1)(x + 2)(x − 3)');
      await stripRun(W);
      await pickQ('Where is f increasing?', ['(−∞, −2)', '(−2, 1)', '(1, 3)', '(3, ∞)'], ['(−2, 1)', '(3, ∞)'], 'An even number of negative factors there.', { brace: false });
      exTag('Example 34', 'tan⁻¹(sin x + cos x) on (0, π/4)');
      await quiz("f′ = (cos x − sin x)/(2 + sin 2x). On (0, π/4) it is", ['positive: increasing', 'negative', 'zero', 'undefined'], 0, 'cos x > sin x there.');
      await cont();
    },
    async function () {
      enterScene('opt', (W) => optSet(W, (x) => x * (3 - 2 * x) * (8 - 2 * x), 0, 1.5, 0.2, (W, x) => PIC.box(W, x, 3, 8), { flab: 'V (m³)' }));
      exTag('Example 35', 'disc: r = 3.2, dr/dt = 0.05');
      await numQ('dA ≈ 2πr dr = ? (with π)', 0.32 * PI, '0.32π cm²/s.', { ...piK, show: '0.32π' });
      exTag('Example 36', 'box from a 3 m × 8 m sheet');
      const sl = slider('cut x', 0, 1.5, 0.01, 0.2, (v) => fmtN(v, 2), (v) => (W.x = v), 0.67);
      await task('Cut squares to get the biggest box', () => Math.abs(W.x - 2 / 3) < 0.006, (W) => { W.x = 0.67; sl.value = 0.67; });
      W.found = true; const r = await fields('x = 2/3 m gives', [{ l: 'V', a: 200 / 27, show: '200/27', post: 'm³' }]); await verdict(r, 'V′ = 4(x − 3)(3x − 2); x = 3 is impossible.', '200/27 m³.');
      exTag('Example 37', 'profit P(x) = 24x/5 − x²/100 − 500');
      await numQ('P′(x) = 24/5 − x/50 = 0 at x = ?', 240, 'Sell 240 items (P″ < 0).');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'Velocity, rates, monotonicity and optimisation are all f′', eq: true }]); },
  ],
}));

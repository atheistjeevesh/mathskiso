/* =========================================================
   CHAPTER 13 · STATISTICS — concept lessons (Examples 1–16)
   ========================================================= */
const exTag = (t, c) => sheet.append(h('div', { class: 'exh' }, h('span', { class: 'etag' }, t), c ? h('span', { class: 'ychip' }, c) : null));

LESSONS.push(lesson({
  id: 'spread', title: 'Spread & Mean Deviation', blurb: 'Drag the dots: the mean balances them, the deviation bars measure the spread. Examples 1–3.', face: 'kimmy-curious',
  steps: [
    async function () {
      enterScene('strip', (W) => stripSet(W, [46, 48, 50, 52, 54, 56], 40, 62));
      await slam('DISPERSION', 'Lesson 1 · Sections 13.2–13.4');
      await J('idle', 'Two batters can have the same average but very different consistency. Range = max − min is the crudest measure of spread. Drag a dot!');
      await task('Drag a dot to make the range bigger than 15', () => { const v = W.xs.map((d) => d.v); return Math.max(...v) - Math.min(...v) > 15; }, (W) => (W.xs[0].v = 40));
      await K('think', 'Range only looks at two values. We want everyone to count…');
      W.mode = 'dev'; SFX.swish();
      await discover('M.D.(x̄) = Σ|xᵢ − x̄| / n', 'Average distance from the mean. About the median: Σ|xᵢ − M| / n.');
      await cont(); hideFound();
    },
    async function () {
      enterScene('strip', (W) => { stripSet(W, [6, 7, 10, 12, 13, 4, 8, 12], 0, 16, { lock: true }); W.drags = []; });
      exTag('Example 1', '6, 7, 10, 12, 13, 4, 8, 12');
      const r = await fields('Step by step', [{ l: 'x̄', a: 9 }, { l: 'Σ|xᵢ − x̄|', a: 22 }, { l: 'M.D.', a: 2.75 }]); W.mode = 'dev'; SFX.swish(); await verdict(r, '72/8 = 9, deviations 3, 2, 1, 3, 4, 5, 1, 3 → 22, so 22/8 = 2.75.', '9, 22, 2.75.');
      await cont();
    },
    async function () {
      enterScene('strip', (W) => { stripSet(W, [12, 3, 18, 17, 4, 9, 17, 19, 20, 15, 8, 17, 2, 3, 16, 11, 3, 1, 0, 5], 0, 21, { lock: true, ys: 0.42 }); W.drags = []; });
      exTag('Example 2', '20 observations');
      const r = await fields('Mean and M.D.', [{ l: 'x̄', a: 10 }, { l: 'Σ|xᵢ − x̄|', a: 124 }, { l: 'M.D.', a: 6.2 }]); W.mode = 'dev'; SFX.swish(); await verdict(r, 'x̄ = 200/20 = 10 and M.D. = 124/20 = 6.2.', '10, 124, 6.2.');
      await cont();
    },
    async function () {
      enterScene('strip', (W) => { stripSet(W, [3, 9, 5, 3, 12, 10, 18, 4, 7, 19, 21], 0, 22, { lock: true, showMean: false, showMed: true, center: 'median' }); W.drags = []; });
      exTag('Example 3', 'about the median: 3, 9, 5, 3, 12, 10, 18, 4, 7, 19, 21');
      await numQ('Sorted, the 6th of 11 values is the median = ?', 9, 'M = 9.');
      W.mode = 'dev'; SFX.swish();
      const r = await fields('Then', [{ l: 'Σ|xᵢ − M|', a: 58 }, { l: 'M.D.(M)', a: 58 / 11, show: '5.27', tol: 0.01 }]); await verdict(r, '58/11 ≈ 5.27.', '58 and 5.27.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson 1'; }); await summary(['Range = max − min', { t: 'M.D.(a) = Σ|xᵢ − a| / n,  a = x̄ or M', eq: true }]); },
  ],
}));

LESSONS.push(lesson({
  id: 'grouped', title: 'Grouped Data', blurb: 'Frequency tables and histograms: weigh each deviation by its frequency. Examples 4–7.', face: 'jess-excited',
  steps: [
    async function () {
      const xs = [2, 5, 6, 8, 10, 12], fs = [2, 8, 10, 7, 8, 5];
      enterScene('freq', (W) => Object.assign(W, { xs, fs, title: 'Example 4' }));
      await slam('Σ fᵢ|xᵢ − x̄| / N', 'Lesson ' + L.num + ' · Section 13.4.2');
      await growFreq(W); exTag('Example 4', 'discrete frequencies');
      const r1 = await fields('N and Σfx', [{ l: 'N', a: 40 }, { l: 'Σfᵢxᵢ', a: 300 }, { l: 'x̄', a: 7.5 }]); W.mean = 7.5; await verdict(r1, 'x̄ = 300/40 = 7.5.', '40, 300, 7.5.');
      const r2 = await fields('Weighted deviations', [{ l: 'Σfᵢ|xᵢ − x̄|', a: ST.sumAbs(xs, 7.5, fs) }, { l: 'M.D.', a: ST.md(xs, 7.5, fs), show: fm2(ST.md(xs, 7.5, fs)) }]); await verdict(r2, '92/40 = 2.3.', '92 and 2.3.');
      await cont();
    },
    async function () {
      const xs = [3, 6, 9, 12, 13, 15, 21, 22], fs = [3, 4, 5, 2, 4, 5, 4, 3]; const M = ST.medianD(xs, fs);
      enterScene('freq', (W) => Object.assign(W, { xs, fs, title: 'Example 5' })); await growFreq(W);
      exTag('Example 5', 'about the median');
      await J('think', 'N = 30: the median is the average of the 15th and 16th values. Use cumulative frequencies 3, 7, 12, 14, 18, …');
      await numQ('Median = ?', M, '13: both the 15th and 16th values are 13.'); W.med = M;
      await numQ('M.D.(M) = Σfᵢ|xᵢ − 13| / 30 = ?', ST.md(xs, M, fs), fm2(ST.md(xs, M, fs)) + '.', { show: fm2(ST.md(xs, M, fs)), tol: 0.01 });
      await cont();
    },
    async function () {
      const lo = [10, 20, 30, 40, 50, 60, 70], fs = [2, 3, 8, 14, 8, 3, 2], mid = lo.map((l) => l + 5); const m = ST.mean(mid, fs);
      enterScene('freq', (W) => Object.assign(W, { lo, h: 10, fs, title: 'Example 6: marks' })); await growFreq(W);
      exTag('Example 6', 'classes → use mid-points');
      await J('idle', 'For classes, pretend every value sits at the class mid-point: 15, 25, 35, …');
      const r = await fields('Mean deviation about the mean', [{ l: 'x̄', a: m }, { l: 'M.D.', a: ST.md(mid, m, fs), show: fm2(ST.md(mid, m, fs)) }]); W.mean = m; await verdict(r, 'x̄ = 45, M.D. = 400/40 = 10.', '45 and 10.');
      await cont();
    },
    async function () {
      const lo = [0, 10, 20, 30, 40, 50], fs = [6, 7, 15, 16, 4, 2], mid = lo.map((l) => l + 5); const M = ST.medianG(lo, 10, fs);
      enterScene('freq', (W) => Object.assign(W, { lo, h: 10, fs, title: 'Example 7' })); await growFreq(W);
      exTag('Example 7', 'median of a grouped distribution');
      await discover('M = l + (N/2 − C)/f × h', 'l: lower limit of the median class, C: cumulative frequency before it, f: its frequency, h: width.');
      const r = await fields('Median class 20–30: l = 20, C = 13, f = 15', [{ l: 'M', a: M, show: fm2(M), tol: 0.01 }, { l: 'M.D.(M)', a: ST.md(mid, M, fs), show: fm2(ST.md(mid, M, fs)), tol: 0.01 }]); W.med = M; await verdict(r, 'M = 20 + (25 − 13)/15 × 10 = 28, M.D. = 508/50 = 10.16.', '28 and 10.16.');
      hideFound(); await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'M.D. = Σ fᵢ|xᵢ − a| / N', eq: true }, 'Classes: use mid-points.', 'Median of classes: l + (N/2 − C)/f × h']); },
  ],
}));

LESSONS.push(lesson({
  id: 'variance', title: 'Variance & Standard Deviation', blurb: 'Square the deviations and they become real squares. Slide a point c to find what makes Σ(x − c)² smallest. Examples 8–11.', face: 'kimmy-excited',
  steps: [
    async function () {
      enterScene('strip', (W) => { stripSet(W, [6, 8, 10, 12, 14, 16, 18, 20, 22, 24], 0, 30, { lock: true, mode: 'sq', center: 4, showMean: true }); W.drags = [{ get: () => [W.X(W.center), -1.6], r: 0.7, set: (x) => { const v = clamp(Math.round(((x + 5.4) / 10.8) * 30), 0, 30); if (v !== W.center) { W.center = v; SFX.tick(); } } }]; });
      await slam('σ² = Σ(xᵢ − x̄)² / n', 'Lesson ' + L.num + ' · Section 13.5');
      await J('idle', 'Each pink square has side |x − c|. Drag the red point c: where is the total area smallest?');
      await task('Make Σ(x − c)² as small as you can', () => W.center === 15, (W) => (W.center = 15));
      await K('wow', 'Exactly at the mean, 15!');
      exTag('Example 8', '6, 8, …, 24');
      W.center = null; SFX.swish();
      const r = await fields('Variance', [{ l: 'Σ(xᵢ − x̄)²', a: 330 }, { l: 'σ²', a: 33 }]); await verdict(r, '330/10 = 33.', '330 and 33.');
      await cont();
    },
    async function () {
      const xs = [4, 8, 11, 17, 20, 24, 32], fs = [3, 5, 9, 5, 4, 3, 1]; const m = ST.mean(xs, fs), v = ST.vr(xs, fs);
      enterScene('freq', (W) => Object.assign(W, { xs, fs, title: 'Example 9' })); await growFreq(W);
      exTag('Example 9');
      const r = await fields('Mean, variance, SD', [{ l: 'x̄', a: m }, { l: 'σ²', a: v, show: fm2(v), tol: 0.01 }, { l: 'σ', a: Math.sqrt(v), show: fm2(Math.sqrt(v)), tol: 0.01 }]); W.mean = m; await verdict(r, 'x̄ = 14, σ² = 45.8, σ ≈ 6.77.', '14, 45.8, 6.77.');
      await cont();
    },
    async function () {
      const lo = [30, 40, 50, 60, 70, 80, 90], fs = [3, 7, 12, 15, 8, 3, 2], mid = lo.map((l) => l + 5); const m = ST.mean(mid, fs), v = ST.vr(mid, fs);
      enterScene('freq', (W) => Object.assign(W, { lo, h: 10, fs, title: 'Example 10' })); await growFreq(W);
      exTag('Example 10', 'short-cut: yᵢ = (xᵢ − 65)/10');
      await discover('σ² = (h²/N²)[NΣfy² − (Σfy)²]', 'With yᵢ = (xᵢ − A)/h: smaller numbers, same answer.');
      const r = await fields('With A = 65, h = 10: Σfy = −15, Σfy² = 105', [{ l: 'x̄', a: m }, { l: 'σ²', a: v }, { l: 'σ', a: Math.sqrt(v), show: fm2(Math.sqrt(v)), tol: 0.01 }]); W.mean = m; await verdict(r, 'x̄ = 62, σ² = 201, σ ≈ 14.18.', '62, 201, 14.18.');
      hideFound(); await cont();
    },
    async function () {
      const xs = [3, 8, 13, 18, 23], fs = [7, 10, 15, 10, 6]; const v = ST.vr(xs, fs);
      enterScene('freq', (W) => Object.assign(W, { xs, fs, title: 'Example 11' })); await growFreq(W);
      exTag('Example 11', 'σ = (1/N)√(NΣfx² − (Σfx)²)');
      const r = await fields('N = 48, Σfx = 614, Σfx² = 9652', [{ l: 'σ', a: Math.sqrt(v), show: fm2(Math.sqrt(v)), tol: 0.01 }]); await verdict(r, '√(48 × 9652 − 614²)/48 ≈ 6.12.', '≈ 6.12.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary([{ t: 'σ² = Σfᵢ(xᵢ − x̄)²/N,  σ = √σ²', eq: true }, 'σ = (1/N)√(NΣfx² − (Σfx)²)', 'Short-cut: yᵢ = (xᵢ − A)/h, σₓ = hσᵧ']); },
  ],
}));

LESSONS.push(lesson({
  id: 'tricks', title: 'Scaling, Shifting & Fixing Mistakes', blurb: 'What happens to σ when you add or multiply? And how to repair a wrong mean and SD. Examples 13–16.', face: 'jess-thinking',
  steps: [
    async function () {
      enterScene('strip', (W) => stripSet(W, [4, 6, 7, 9, 10], 0, 30, { lock: true, mode: 'sq' })); W.drags = [];
      await slam('MIXED', 'Lesson ' + L.num + ' · Examples 13–16');
      const b1 = button('Add 10 to every value'); await waitFor(() => b1.clicked()); b1.stop(); W.xs.forEach((d) => gsap.to(d, { v: d.v + 10, duration: 0.6, onUpdate: () => (d.v = Math.round(d.v)) })); SFX.whoosh(); await wait(0.8);
      exTag('Example 15'); await quiz('Adding a constant to every observation changes the variance by…', ['nothing', '+a', '+a²', '×a'], 0, 'The squares just slide along.');
      const b2 = button('Now multiply by 2'); await waitFor(() => b2.clicked()); b2.stop(); W.xs.forEach((d) => (d.v = Math.min(30, (d.v - 10) * 2))); SFX.whoosh(); await wait(0.5);
      exTag('Example 13', 'variance 5, every value × 2'); await numQ('New variance = 2² × 5 = ?', 20, 'Variance scales by the square: 20.');
      await cont();
    },
    async function () {
      enterScene('board', (W) => { W.tag = 'find x, y'; W.sub = 'Example 14'; });
      exTag('Example 14', 'mean 4.4, variance 8.24; values 1, 2, 6, x, y');
      const r = await order('Steps', ['x + y = 5 × 4.4 − 9 = 13', 'Σx² = 5(8.24 + 4.4²) = 138.0', 'x² + y² = 138 − 41 = 97', '(x − y)² = 2 × 97 − 13² = 25 ⇒ x, y = 4, 9']); await verdict(r, 'The other two are 4 and 9.', 'Use Σx and Σx².');
      exTag('Example 16', 'mean 40, σ = 5.1 for 100 values; 50 was read instead of 40');
      const r2 = await fields('Correct them', [{ l: 'mean', a: 39.9 }, { l: 'σ', a: 5, tol: 0.01 }]); await verdict(r2, 'Σx: 4000 − 50 + 40 = 3990; Σx²: 162601 − 2500 + 1600 = 161701, σ = √(1617.01 − 1592.01) = 5.', '39.9 and 5.');
      await cont();
    },
    async function () { enterScene('board', (W) => { W.tag = 'CLEAR!'; W.sub = 'Lesson ' + L.num; }); await summary(['xᵢ + a: mean + a, σ unchanged', { t: 'axᵢ: mean × a, σ² × a²', eq: true }, 'Fix a wrong value through Σx and Σx².']); },
  ],
}));

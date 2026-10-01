/* =========================================================
   CLASS 12 · CHAPTER 2 · INVERSE TRIGONOMETRIC FUNCTIONS — every exercise question as a sim
   Answers are computed with Math.asin/acos/atan; identities are drawn as two coinciding graphs.
   ========================================================= */
const S3 = Math.sqrt(3), S2 = Math.SQRT2;
const acot = TR.cot.inv, asec = TR.sec.inv, acosec = TR.cosec.inv;
/* principal value on the unit circle (mode/v describe the equivalent sin, cos or tan line) */
const pvQ = (ex, n, q, mode, v, ans, show, x) => ({ ex, n, q, scene: 'pcirc', setup: (W) => pcircSet(W, mode, v, { showAns: false, lock: true }), parts: [{ k: 'num', q: 'Principal value = ? (type with π)', ...pv(ans, show), x, act: async () => { W.showAns = true; SFX.pop(); } }], w: [q.replace('Find the principal value of ', '') + ' = ' + show] });
const valQ = (ex, n, q, ans, show, x, o = {}) => ({ ex, n, q, scene: 'board', kim: o.kim, parts: [...(o.pre || []), o.mcq ? { k: 'mcq', q: 'Answer', o: o.mcq, a: 0, x } : { k: 'num', q: o.nq || 'Value = ? (type with π if needed)', ...pv(ans, show), x }], w: [o.w || 'Value = ' + show] });
/* identity / simplification: optional steps, a graph overlay, then the answer */
const idQ = (ex, n, q, L, R, view, o = {}) => ({ ex, n, q, scene: 'plane', kim: o.kim, setup: (W) => { planeView(W, ...view); W.curves = [curve(L, C.sora, { x0: view[0], x1: view[1], w: 6, p: 1, t: (o.labs || ['LHS'])[0] })]; }, parts: [...(o.steps || []), { k: 'run', run: async () => { await overlay(W, L, R, ...view, o.labs); await wait(AUTO ? 0.1 : 0.6); } }, ...(o.after || [])], w: [o.w || q], L, R, view });

/* ===================== EXERCISE 2.1 ===================== */
const EX21 = [
  pvQ('Ex 2.1', 'Q1', 'Find the principal value of sin⁻¹(−1/2)', 'sin', -0.5, -PI / 6, '−π/6', 'sin(−π/6) = −1/2, in [−π/2, π/2].'),
  pvQ('Ex 2.1', 'Q2', 'Find the principal value of cos⁻¹(√3/2)', 'cos', S3 / 2, PI / 6, 'π/6', 'cos(π/6) = √3/2.'),
  pvQ('Ex 2.1', 'Q3', 'Find the principal value of cosec⁻¹(2)', 'sin', 0.5, PI / 6, 'π/6', 'cosec y = 2 ⇔ sin y = 1/2.'),
  pvQ('Ex 2.1', 'Q4', 'Find the principal value of tan⁻¹(−√3)', 'tan', -S3, -PI / 3, '−π/3', 'tan(−π/3) = −√3.'),
  pvQ('Ex 2.1', 'Q5', 'Find the principal value of cos⁻¹(−1/2)', 'cos', -0.5, 2 * PI / 3, '2π/3', 'cos⁻¹ stays in [0, π].'),
  pvQ('Ex 2.1', 'Q6', 'Find the principal value of tan⁻¹(−1)', 'tan', -1, -PI / 4, '−π/4', 'tan(−π/4) = −1.'),
  pvQ('Ex 2.1', 'Q7', 'Find the principal value of sec⁻¹(2/√3)', 'cos', S3 / 2, PI / 6, 'π/6', 'sec y = 2/√3 ⇔ cos y = √3/2.'),
  pvQ('Ex 2.1', 'Q8', 'Find the principal value of cot⁻¹(√3)', 'tan', 1 / S3, PI / 6, 'π/6', 'cot y = √3 ⇔ tan y = 1/√3 with y ∈ (0, π).'),
  pvQ('Ex 2.1', 'Q9', 'Find the principal value of cos⁻¹(−1/√2)', 'cos', -1 / S2, 3 * PI / 4, '3π/4', 'In the upper half: 3π/4.'),
  pvQ('Ex 2.1', 'Q10', 'Find the principal value of cosec⁻¹(−√2)', 'sin', -1 / S2, -PI / 4, '−π/4', 'sin y = −1/√2 in [−π/2, π/2] − {0}.'),
  valQ('Ex 2.1', 'Q11', 'Find tan⁻¹(1) + cos⁻¹(−1/2) + sin⁻¹(−1/2)', PI / 4 + 2 * PI / 3 - PI / 6, '3π/4', 'π/4 + 2π/3 − π/6 = 3π/4.', { pre: [{ k: 'fields', q: 'Each term (type with π)', f: [{ l: 'tan⁻¹ 1', ...pv(PI / 4, 'π/4') }, { l: 'cos⁻¹(−1/2)', ...pv(2 * PI / 3, '2π/3') }, { l: 'sin⁻¹(−1/2)', ...pv(-PI / 6, '−π/6') }], keys: 'π' }] }),
  valQ('Ex 2.1', 'Q12', 'Find cos⁻¹(1/2) + 2 sin⁻¹(1/2)', PI / 3 + PI / 3, '2π/3', 'π/3 + 2(π/6) = 2π/3.'),
  valQ('Ex 2.1', 'Q13', 'If sin⁻¹ x = y, then (A) 0 ≤ y ≤ π (B) −π/2 ≤ y ≤ π/2 (C) 0 < y < π (D) −π/2 < y < π/2', null, '(B)', 'The principal range of sin⁻¹ is closed: [−π/2, π/2].', { mcq: ['(B)', '(A)', '(C)', '(D)'] }),
  valQ('Ex 2.1', 'Q14', 'tan⁻¹ √3 − sec⁻¹(−2) is equal to (A) π (B) −π/3 (C) π/3 (D) 2π/3', null, '(B) −π/3', 'π/3 − 2π/3 = −π/3.', { pre: [{ k: 'num', q: 'sec⁻¹(−2) = ?', ...pv(2 * PI / 3, '2π/3') }], mcq: ['(B) −π/3', '(A) π', '(C) π/3', '(D) 2π/3'] }),
];

/* ===================== EXERCISE 2.2 ===================== */
const EX22 = [
  idQ('Ex 2.2', 'Q1', 'Prove 3 sin⁻¹ x = sin⁻¹(3x − 4x³), x ∈ [−1/2, 1/2]', (x) => 3 * Math.asin(x), (x) => Math.asin(3 * x - 4 * x ** 3), [-0.5, 0.5, -1.8, 1.8], { steps: [{ k: 'order', q: 'Order the proof', s: ['Put x = sin θ, θ ∈ [−π/6, π/6]', '3x − 4x³ = 3 sin θ − 4 sin³ θ = sin 3θ', 'sin⁻¹(sin 3θ) = 3θ since 3θ ∈ [−π/2, π/2]', '= 3 sin⁻¹ x'] }], labs: ['3 sin⁻¹ x', 'sin⁻¹(3x − 4x³)'] }),
  idQ('Ex 2.2', 'Q2', 'Prove 3 cos⁻¹ x = cos⁻¹(4x³ − 3x), x ∈ [1/2, 1]', (x) => 3 * Math.acos(x), (x) => Math.acos(4 * x ** 3 - 3 * x), [0.5, 1, -0.3, 3.4], { steps: [{ k: 'order', q: 'Order the proof', s: ['Put x = cos θ, θ ∈ [0, π/3]', '4x³ − 3x = cos 3θ', 'cos⁻¹(cos 3θ) = 3θ since 3θ ∈ [0, π]', '= 3 cos⁻¹ x'] }], labs: ['3 cos⁻¹ x', 'cos⁻¹(4x³ − 3x)'] }),
  idQ('Ex 2.2', 'Q3', 'Simplest form: tan⁻¹((√(1 + x²) − 1)/x), x ≠ 0', (x) => Math.atan((Math.sqrt(1 + x * x) - 1) / x), (x) => 0.5 * Math.atan(x), [-6, 6, -1, 1], { steps: [{ k: 'mcq', q: 'Put x = tan θ: (sec θ − 1)/tan θ = tan(θ/2). So the answer is', o: ['½ tan⁻¹ x', '2 tan⁻¹ x', 'tan⁻¹ x', '½ cot⁻¹ x'], a: 0 }], w: '½ tan⁻¹ x' }),
  idQ('Ex 2.2', 'Q4', 'Simplest form: tan⁻¹ √((1 − cos x)/(1 + cos x)), 0 < x < π', (x) => Math.atan(Math.sqrt((1 - Math.cos(x)) / (1 + Math.cos(x)))), (x) => x / 2, [0.05, 3.1, -0.3, 1.8], { steps: [{ k: 'mcq', q: '(1 − cos x)/(1 + cos x) = tan²(x/2). So the answer is', o: ['x/2', 'x', '2x', 'π/2 − x'], a: 0 }], w: 'x/2' }),
  idQ('Ex 2.2', 'Q5', 'Simplest form: tan⁻¹((cos x − sin x)/(cos x + sin x)), −π/4 < x < 3π/4', (x) => Math.atan((Math.cos(x) - Math.sin(x)) / (Math.cos(x) + Math.sin(x))), (x) => PI / 4 - x, [-0.7, 2.3, -1.7, 1.7], { steps: [{ k: 'mcq', q: 'Divide by cos x: (1 − tan x)/(1 + tan x) = tan(π/4 − x). Answer', o: ['π/4 − x', 'x − π/4', 'π/4 + x', 'x'], a: 0 }], w: 'π/4 − x' }),
  idQ('Ex 2.2', 'Q6', 'Simplest form: tan⁻¹(x/√(a² − x²)), |x| < a', (x) => Math.atan(x / Math.sqrt(4 - x * x)), (x) => Math.asin(x / 2), [-1.95, 1.95, -1.8, 1.8], { steps: [{ k: 'mcq', q: 'Put x = a sin θ. Answer', o: ['sin⁻¹(x/a)', 'cos⁻¹(x/a)', 'tan⁻¹(x/a)', 'sin⁻¹(a/x)'], a: 0 }], labs: ['LHS (a = 2)', 'sin⁻¹(x/2)'], w: 'sin⁻¹(x/a)' }),
  idQ('Ex 2.2', 'Q7', 'Simplest form: tan⁻¹((3a²x − x³)/(a³ − 3ax²)), a > 0, −a/√3 < x < a/√3', (x) => Math.atan((12 * x - x ** 3) / (8 - 6 * x * x)), (x) => 3 * Math.atan(x / 2), [-1.15, 1.15, -1.8, 1.8], { steps: [{ k: 'mcq', q: 'Put x = a tan θ: tan 3θ. Answer', o: ['3 tan⁻¹(x/a)', 'tan⁻¹(x/a)', '3 tan⁻¹(a/x)', 'tan⁻¹(3x/a)'], a: 0 }], labs: ['LHS (a = 2)', '3 tan⁻¹(x/2)'], w: '3 tan⁻¹(x/a)' }),
  valQ('Ex 2.2', 'Q8', 'Find tan⁻¹[2 cos(2 sin⁻¹ ½)]', PI / 4, 'π/4', '2 sin⁻¹ ½ = π/3, 2 cos(π/3) = 1, tan⁻¹ 1 = π/4.', { pre: [{ k: 'num', q: '2 cos(2 sin⁻¹ ½) = ?', a: 1 }] }),
  valQ('Ex 2.2', 'Q9', 'Find tan ½[sin⁻¹(2x/(1 + x²)) + cos⁻¹((1 − y²)/(1 + y²))], |x| < 1, y > 0, xy < 1', null, '(x + y)/(1 − xy)', 'The bracket is 2 tan⁻¹ x + 2 tan⁻¹ y.', { mcq: ['(x + y)/(1 − xy)', '(x − y)/(1 + xy)', 'x + y', 'xy'], pre: [{ k: 'num', q: 'Check x = 0.2, y = 0.3: value = ? (3 decimals)', a: Math.tan(0.5 * (Math.asin(0.4 / 1.04) + Math.acos(0.91 / 1.09))), tol: 0.002, show: fmtN(Math.tan(0.5 * (Math.asin(0.4 / 1.04) + Math.acos(0.91 / 1.09))), 3), x: '0.5/0.94 ≈ 0.532.' }] }),
  valQ('Ex 2.2', 'Q10', 'Find sin⁻¹(sin 2π/3)', Math.asin(Math.sin(2 * PI / 3)), 'π/3', '2π/3 is outside [−π/2, π/2]; sin(2π/3) = sin(π/3).'),
  valQ('Ex 2.2', 'Q11', 'Find tan⁻¹(tan 3π/4)', Math.atan(Math.tan(3 * PI / 4)), '−π/4', 'tan(3π/4) = −1 = tan(−π/4).'),
  valQ('Ex 2.2', 'Q12', 'Find tan(sin⁻¹ 3/5 + cot⁻¹ 3/2)', Math.tan(Math.asin(0.6) + acot(1.5)), '17/6', 'tan A = 3/4, tan B = 2/3: (3/4 + 2/3)/(1 − 1/2) = 17/6.', { pre: [{ k: 'fields', q: 'Tangents of the two angles', f: [{ l: 'tan(sin⁻¹ 3/5)', a: 0.75, show: '3/4' }, { l: 'tan(cot⁻¹ 3/2)', a: 2 / 3, show: '2/3' }] }] }),
  valQ('Ex 2.2', 'Q13', 'cos⁻¹(cos 7π/6) is equal to (A) 7π/6 (B) 5π/6 (C) π/3 (D) π/6', null, '(B) 5π/6', 'cos(7π/6) = cos(5π/6) and 5π/6 ∈ [0, π].', { mcq: ['(B) 5π/6', '(A) 7π/6', '(C) π/3', '(D) π/6'] }),
  valQ('Ex 2.2', 'Q14', 'sin(π/3 − sin⁻¹(−½)) is equal to (A) ½ (B) ⅓ (C) ¼ (D) 1', null, '(D) 1', 'π/3 + π/6 = π/2.', { mcq: ['(D) 1', '(A) 1/2', '(B) 1/3', '(C) 1/4'] }),
  valQ('Ex 2.2', 'Q15', 'tan⁻¹ √3 − cot⁻¹(−√3) is equal to (A) π (B) −π/2 (C) 0 (D) 2√3', null, '(B) −π/2', 'π/3 − 5π/6 = −π/2.', { pre: [{ k: 'num', q: 'cot⁻¹(−√3) = ?', ...pv(acot(-S3), '5π/6') }], mcq: ['(B) −π/2', '(A) π', '(C) 0', '(D) 2√3'] }),
];

/* ===================== MISCELLANEOUS ===================== */
const EX2M = [
  valQ('Misc', 'Q1', 'Find cos⁻¹(cos 13π/6)', Math.acos(Math.cos(13 * PI / 6)), 'π/6', '13π/6 = 2π + π/6.'),
  valQ('Misc', 'Q2', 'Find tan⁻¹(tan 7π/6)', Math.atan(Math.tan(7 * PI / 6)), 'π/6', 'tan has period π: 7π/6 − π = π/6.'),
  idQ('Misc', 'Q3', 'Prove 2 sin⁻¹(3/5) = tan⁻¹(24/7)', (x) => 2 * Math.asin(0.6), (x) => Math.atan(24 / 7), [0, 1, 0, 2], { steps: [{ k: 'fields', q: 'sin⁻¹(3/5) = θ: tan θ = 3/4, so tan 2θ = ?', f: [{ l: 'tan 2θ', a: 24 / 7, show: '24/7' }] }], labs: ['2 sin⁻¹(3/5)', 'tan⁻¹(24/7)'] }),
  idQ('Misc', 'Q4', 'Prove sin⁻¹(8/17) + sin⁻¹(3/5) = tan⁻¹(77/36)', () => Math.asin(8 / 17) + Math.asin(0.6), () => Math.atan(77 / 36), [0, 1, 0, 2], { steps: [{ k: 'fields', q: 'tan of each angle, then add', f: [{ l: 'tan(sin⁻¹ 8/17)', a: 8 / 15, show: '8/15' }, { l: 'tan(sin⁻¹ 3/5)', a: 0.75, show: '3/4' }, { l: 'tan(sum)', a: 77 / 36, show: '77/36' }] }], labs: ['LHS', 'RHS'] }),
  idQ('Misc', 'Q5', 'Prove cos⁻¹(4/5) + cos⁻¹(12/13) = cos⁻¹(33/65)', () => Math.acos(0.8) + Math.acos(12 / 13), () => Math.acos(33 / 65), [0, 1, 0, 1.6], { steps: [{ k: 'num', q: 'cos(A + B) = (4/5)(12/13) − (3/5)(5/13) = ?', a: 33 / 65, show: '33/65' }], labs: ['LHS', 'RHS'] }),
  idQ('Misc', 'Q6', 'Prove cos⁻¹(12/13) + sin⁻¹(3/5) = sin⁻¹(56/65)', () => Math.acos(12 / 13) + Math.asin(0.6), () => Math.asin(56 / 65), [0, 1, 0, 1.6], { steps: [{ k: 'num', q: 'sin(A + B) = (5/13)(4/5) + (12/13)(3/5) = ?', a: 56 / 65, show: '56/65' }], labs: ['LHS', 'RHS'] }),
  idQ('Misc', 'Q7', 'Prove tan⁻¹(63/16) = sin⁻¹(5/13) + cos⁻¹(3/5)', () => Math.atan(63 / 16), () => Math.asin(5 / 13) + Math.acos(0.6), [0, 1, 0, 1.8], { steps: [{ k: 'num', q: 'tan(sum) = (5/12 + 4/3)/(1 − 5/9) = ?', a: 63 / 16, show: '63/16' }], labs: ['LHS', 'RHS'] }),
  idQ('Misc', 'Q8', 'Prove tan⁻¹ √x = ½ cos⁻¹((1 − x)/(1 + x)), x ∈ [0, 1]', (x) => Math.atan(Math.sqrt(x)), (x) => 0.5 * Math.acos((1 - x) / (1 + x)), [0, 1, -0.1, 1], { steps: [{ k: 'order', q: 'Order the proof', s: ['Put x = tan² θ', '(1 − tan² θ)/(1 + tan² θ) = cos 2θ', '½ cos⁻¹(cos 2θ) = θ', '= tan⁻¹ √x'] }] }),
  idQ('Misc', 'Q9', 'Prove cot⁻¹[(√(1 + sin x) + √(1 − sin x))/(√(1 + sin x) − √(1 − sin x))] = x/2, x ∈ (0, π/4)', (x) => acot((Math.sqrt(1 + Math.sin(x)) + Math.sqrt(1 - Math.sin(x))) / (Math.sqrt(1 + Math.sin(x)) - Math.sqrt(1 - Math.sin(x)))), (x) => x / 2, [0.02, 0.78, 0, 0.5], { steps: [{ k: 'mcq', q: '√(1 ± sin x) = cos(x/2) ± sin(x/2), so the fraction is', o: ['cot(x/2)', 'tan(x/2)', 'cot x', '1'], a: 0 }] }),
  idQ('Misc', 'Q10', 'Prove tan⁻¹[(√(1 + x) − √(1 − x))/(√(1 + x) + √(1 − x))] = π/4 − ½ cos⁻¹ x, −1/√2 ≤ x ≤ 1', (x) => Math.atan((Math.sqrt(1 + x) - Math.sqrt(1 - x)) / (Math.sqrt(1 + x) + Math.sqrt(1 - x))), (x) => PI / 4 - 0.5 * Math.acos(x), [-0.7, 1, -0.6, 0.9], { steps: [{ k: 'order', q: 'Order the proof (hint x = cos 2θ)', s: ['x = cos 2θ: √(1 + x) = √2 cos θ, √(1 − x) = √2 sin θ', 'Fraction = (1 − tan θ)/(1 + tan θ) = tan(π/4 − θ)', 'tan⁻¹ gives π/4 − θ', 'θ = ½ cos⁻¹ x'] }] }),
  valQ('Misc', 'Q11', 'Solve 2 tan⁻¹(cos x) = tan⁻¹(2 cosec x)', PI / 4, 'π/4', '2 tan⁻¹ c = tan⁻¹(2c/(1 − c²)) ⇒ 2cos x/sin² x = 2/sin x ⇒ cot x = 1.', { nq: 'x = ? (type with π)' }),
  valQ('Misc', 'Q12', 'Solve tan⁻¹((1 − x)/(1 + x)) = ½ tan⁻¹ x, x > 0', 1 / S3, '1/√3', 'π/4 − tan⁻¹ x = ½ tan⁻¹ x ⇒ tan⁻¹ x = π/6.', { nq: 'x = ? (type √ or a decimal)', pre: [{ k: 'mcq', q: 'tan⁻¹((1 − x)/(1 + x)) = π/4 − tan⁻¹ x, so tan⁻¹ x = ?', o: ['π/6', 'π/4', 'π/3', 'π/12'], a: 0 }] }),
  valQ('Misc', 'Q13', 'sin(tan⁻¹ x), |x| < 1, is equal to (A) x/√(1 − x²) (B) 1/√(1 − x²) (C) 1/√(1 + x²) (D) x/√(1 + x²)', null, '(D)', 'Right triangle with opposite x and adjacent 1.', { mcq: ['(D) x/√(1 + x²)', '(A) x/√(1 − x²)', '(B) 1/√(1 − x²)', '(C) 1/√(1 + x²)'] }),
  valQ('Misc', 'Q14', 'sin⁻¹(1 − x) − 2 sin⁻¹ x = π/2, then x = (A) 0, ½ (B) 1, ½ (C) 0 (D) ½', null, '(C) 0', 'Solving gives x = 0 or ½, but x = ½ fails: sin⁻¹ ½ − 2 sin⁻¹ ½ = −π/6.', { mcq: ['(C) 0', '(A) 0, 1/2', '(B) 1, 1/2', '(D) 1/2'], pre: [{ k: 'num', q: 'Check x = 1/2: LHS = sin⁻¹ ½ − 2 sin⁻¹ ½ = ?', ...pv(-PI / 6, '−π/6') }] }),
];

const BOSS2 = [['sin⁻¹(1)', ['π/2', 'π', '0', '1'], 0], ['cos⁻¹(0)', ['π/2', '0', 'π', '−π/2'], 0], ['tan⁻¹(1)', ['π/4', 'π/2', '1', '−π/4'], 0], ['Range of cos⁻¹', ['[0, π]', '[−π/2, π/2]', '(0, π)', 'ℝ'], 0], ['sin⁻¹(−1/2)', ['−π/6', '7π/6', '5π/6', 'π/6'], 0], ['cos⁻¹(−1)', ['π', '−π', '0', 'π/2'], 0], ['sin⁻¹(sin 5π/6)', ['π/6', '5π/6', '−π/6', 'π/3'], 0], ['Domain of sin⁻¹', ['[−1, 1]', 'ℝ', '[0, π]', '(−1, 1)'], 0], ['tan⁻¹(−√3)', ['−π/3', '2π/3', 'π/3', '−π/6'], 0], ['sin⁻¹ x + cos⁻¹ x (|x| ≤ 1)', ['π/2', 'π', '0', 'π/4'], 0]];
LESSONS.splice(2, 0, exLesson({ id: 'ex21', title: 'Exercise 2.1', blurb: 'All 14 principal values on the unit circle.', face: 'kimmy-playful', qs: EX21 }));
LESSONS.push(exLesson({ id: 'ex22', title: 'Exercise 2.2', blurb: 'All 15: prove, simplify and evaluate, with both sides graphed.', face: 'jess-happy', qs: EX22 }));
LESSONS.push(exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 14 Miscellaneous Exercise questions.', face: 'jess-thinking', qs: EX2M }));
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 2'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Principal only!'); await cont('Fight'); }, ...BOSS2.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 2'; }); await summary(['Chapter complete!', { t: 'Principal branches make trig invertible', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

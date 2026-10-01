/* =========================================================
   CLASS 12 · CHAPTER 7 · INTEGRALS — Exercises 7.8 to 7.10 and Miscellaneous
   vQ(ex, n, q, f, a, b, value, shown): the test checks value against quadrature of f.
   Answers with log or e are typed to 2 decimals (dec: true).
   ========================================================= */
const L2 = log(2), r3 = sqrt(3), dq = (show) => ({ dec: true, show });
const decQ = (ex, n, q, f, a, b, val, show, o = {}) => vQ(ex, n, q, f, a, b, val, show + ' ≈ ' + fmtN(val, 3), { ...o, dec: true });
const lb = { lab: piLab7, fx: piLab7 };

/* ===================== EXERCISE 7.8 ===================== */
const EX78 = [
  vQ('Ex 7.8', 'Q1', 'Evaluate ∫₋₁¹ (x + 1) dx', (x) => x + 1, -1, 1, 2, '2'),
  decQ('Ex 7.8', 'Q2', 'Evaluate ∫₂³ dx/x', (x) => 1 / x, 2, 3, log(1.5), 'log(3/2)'),
  vQ('Ex 7.8', 'Q3', 'Evaluate ∫₁² (4x³ − 5x² + 6x + 9) dx', (x) => 4 * x ** 3 - 5 * x * x + 6 * x + 9, 1, 2, 64 / 3, '64/3'),
  vQ('Ex 7.8', 'Q4', 'Evaluate ∫₀^(π/4) sin 2x dx', (x) => sin(2 * x), 0, PI / 4, 0.5, '1/2', lb),
  vQ('Ex 7.8', 'Q5', 'Evaluate ∫₀^(π/2) cos 2x dx', (x) => cos(2 * x), 0, PI / 2, 0, '0', { ...lb, tol: 1e-6 }),
  decQ('Ex 7.8', 'Q6', 'Evaluate ∫₄⁵ eˣ dx', exp, 4, 5, exp(5) - exp(4), 'e⁴(e − 1)'),
  decQ('Ex 7.8', 'Q7', 'Evaluate ∫₀^(π/4) tan x dx', tan, 0, PI / 4, L2 / 2, '½ log 2', lb),
  decQ('Ex 7.8', 'Q8', 'Evaluate ∫ cosec x dx from π/6 to π/4', csc, PI / 6, PI / 4, log((sqrt(2) - 1) / (2 - r3)), 'log((√2 − 1)/(2 − √3))', lb),
  vQ('Ex 7.8', 'Q9', 'Evaluate ∫₀¹ dx/√(1 − x²)', (x) => 1 / S(1 - x * x), 0, 1, PI / 2, 'π/2', { y: [0, 6] }),
  vQ('Ex 7.8', 'Q10', 'Evaluate ∫₀¹ dx/(1 + x²)', (x) => 1 / (1 + x * x), 0, 1, PI / 4, 'π/4'),
  decQ('Ex 7.8', 'Q11', 'Evaluate ∫₂³ dx/(x² − 1)', (x) => 1 / (x * x - 1), 2, 3, 0.5 * log(1.5), '½ log(3/2)'),
  vQ('Ex 7.8', 'Q12', 'Evaluate ∫₀^(π/2) cos²x dx', (x) => cos(x) ** 2, 0, PI / 2, PI / 4, 'π/4', lb),
  decQ('Ex 7.8', 'Q13', 'Evaluate ∫₂³ x/(x² + 1) dx', (x) => x / (x * x + 1), 2, 3, 0.5 * L2, '½ log 2'),
  decQ('Ex 7.8', 'Q14', 'Evaluate ∫₀¹ (2x + 3)/(5x² + 1) dx', (x) => (2 * x + 3) / (5 * x * x + 1), 0, 1, 0.2 * log(6) + (3 / sqrt(5)) * atan(sqrt(5)), '(1/5) log 6 + (3/√5) tan⁻¹√5'),
  decQ('Ex 7.8', 'Q15', 'Evaluate ∫₀¹ x e^(x²) dx', (x) => x * exp(x * x), 0, 1, (E - 1) / 2, '½(e − 1)'),
  decQ('Ex 7.8', 'Q16', 'Evaluate ∫₁² 5x²/(x² + 4x + 3) dx', (x) => (5 * x * x) / (x * x + 4 * x + 3), 1, 2, 5 - 2.5 * (9 * log(5 / 4) - log(3 / 2)), '5 − (5/2)[9 log(5/4) − log(3/2)]'),
  decQ('Ex 7.8', 'Q17', 'Evaluate ∫₀^(π/4) (2 sec²x + x³ + 2) dx', (x) => 2 * sec(x) ** 2 + x ** 3 + 2, 0, PI / 4, 2 + PI ** 4 / 1024 + PI / 2, '2 + π⁴/1024 + π/2', lb),
  vQ('Ex 7.8', 'Q18', 'Evaluate ∫₀^π (sin²(x/2) − cos²(x/2)) dx', (x) => sin(x / 2) ** 2 - cos(x / 2) ** 2, 0, PI, 0, '0', { ...lb, tol: 1e-6, steps: [mcqP('sin²(x/2) − cos²(x/2) =', ['−cos x', 'cos x', '1', 'sin x'], 'Double angle.')] }),
  decQ('Ex 7.8', 'Q19', 'Evaluate ∫₀² (6x + 3)/(x² + 4) dx', (x) => (6 * x + 3) / (x * x + 4), 0, 2, 3 * L2 + (3 * PI) / 8, '3 log 2 + 3π/8'),
  decQ('Ex 7.8', 'Q20', 'Evaluate ∫₀¹ (x eˣ + sin(πx/4)) dx', (x) => x * exp(x) + sin((PI * x) / 4), 0, 1, 1 + 4 / PI - (2 * sqrt(2)) / PI, '1 + 4/π − 2√2/π'),
  vQ('Ex 7.8', 'Q21', '∫₁^√3 dx/(1 + x²) equals (A) π/3 (B) 2π/3 (C) π/6 (D) π/12', (x) => 1 / (1 + x * x), 1, r3, PI / 12, 'π/12', { post: [mcqP('Answer', ['(D) π/12', '(A)', '(B)', '(C)'], 'π/3 − π/4.')] }),
  vQ('Ex 7.8', 'Q22', '∫₀^(2/3) dx/(4 + 9x²) equals (A) π/6 (B) π/12 (C) π/24 (D) π/4', (x) => 1 / (4 + 9 * x * x), 0, 2 / 3, PI / 24, 'π/24', { post: [mcqP('Answer', ['(C) π/24', '(A)', '(B)', '(D)'], '(1/6) tan⁻¹(3x/2) at 2/3 = (1/6)(π/4).')] }),
];

/* ===================== EXERCISE 7.9 ===================== */
const EX79 = [
  decQ('Ex 7.9', 'Q1', 'Evaluate ∫₀¹ x/(x² + 1) dx by substitution', (x) => x / (x * x + 1), 0, 1, 0.5 * L2, '½ log 2'),
  vQ('Ex 7.9', 'Q2', 'Evaluate ∫₀^(π/2) √(sin φ) cos⁵φ dφ', (x) => S(sin(x)) * cos(x) ** 5, 0, PI / 2, 64 / 231, '64/231', { ...lb, steps: [mcqP('t = sin φ turns it into', ['∫₀¹ √t (1 − t²)² dt', '∫₀¹ t⁵ dt', '∫₀¹ √t dt', '∫₀¹ (1 − t)² dt'], 'cos⁵φ dφ = (1 − t²)² dt.')] }),
  decQ('Ex 7.9', 'Q3', 'Evaluate ∫₀¹ sin⁻¹(2x/(1 + x²)) dx', (x) => asin((2 * x) / (1 + x * x)), 0, 1, PI / 2 - L2, 'π/2 − log 2'),
  vQ('Ex 7.9', 'Q4', 'Evaluate ∫₀² x√(x + 2) dx (put x + 2 = t²)', (x) => x * S(x + 2), 0, 2, (16 * sqrt(2) * (sqrt(2) + 1)) / 15, '16√2(√2 + 1)/15'),
  vQ('Ex 7.9', 'Q5', 'Evaluate ∫₀^(π/2) sin x/(1 + cos²x) dx', (x) => sin(x) / (1 + cos(x) ** 2), 0, PI / 2, PI / 4, 'π/4', lb),
  decQ('Ex 7.9', 'Q6', 'Evaluate ∫₀² dx/(x + 4 − x²)', (x) => 1 / (x + 4 - x * x), 0, 2, (1 / sqrt(17)) * log((21 + 5 * sqrt(17)) / 4), '(1/√17) log((21 + 5√17)/4)'),
  vQ('Ex 7.9', 'Q7', 'Evaluate ∫₋₁¹ dx/(x² + 2x + 5)', (x) => 1 / (x * x + 2 * x + 5), -1, 1, PI / 8, 'π/8'),
  decQ('Ex 7.9', 'Q8', 'Evaluate ∫₁² (1/x − 1/(2x²)) e²ˣ dx', (x) => (1 / x - 1 / (2 * x * x)) * exp(2 * x), 1, 2, (exp(2) * (exp(2) - 2)) / 4, 'e²(e² − 2)/4'),
  vQ('Ex 7.9', 'Q9', 'The value of ∫ from 1/3 to 1 of (x − x³)^(1/3)/x⁴ dx is (A) 6 (B) 0 (C) 3 (D) 4', (x) => cbrt(x - x ** 3) / x ** 4, 1 / 3, 1, 6, '6', { post: [mcqP('Answer', ['(A) 6', '(B) 0', '(C) 3', '(D) 4'], 't = 1/x² − 1 gives (3/8)t^(4/3) from 8 to 0 … = 6.')] }),
  { ex: 'Ex 7.9', n: 'Q10', q: 'If f(x) = ∫₀ˣ t sin t dt, then f′(x) is (A) cos x + x sin x (B) x sin x (C) x cos x (D) sin x + x cos x', scene: 'integ', setup: (W) => integSet(W, (t) => t * sin(t), (x) => sin(x) - x * cos(x), -0.3, 4, { ab: [0, 2.5], withF: true, Fp: 1 }), parts: [{ k: 'run', run: async (W) => { await shadeRun(W); } }, mcqP('First fundamental theorem: A′(x) = f(x), so f′(x) =', ['(B) x sin x', '(A)', '(C)', '(D)'], 'The derivative of the area function is the integrand at x.')], w: ['(B) x sin x'] },
];

/* ===================== EXERCISE 7.10 ===================== */
const EX710 = [
  vQ('Ex 7.10', 'Q1', 'Evaluate ∫₀^(π/2) cos²x dx', (x) => cos(x) ** 2, 0, PI / 2, PI / 4, 'π/4', { ...lb, steps: [mcqP('With P₄, ∫cos² = ∫sin² on [0, π/2], so 2I =', ['∫₀^(π/2) 1 dx = π/2', '0', 'π', '1'], 'sin² + cos² = 1.')] }),
  vQ('Ex 7.10', 'Q2', 'Evaluate ∫₀^(π/2) √(sin x)/(√(sin x) + √(cos x)) dx', (x) => S(sin(x)) / (S(sin(x)) + S(cos(x))), 0, PI / 2, PI / 4, 'π/4', lb),
  vQ('Ex 7.10', 'Q3', 'Evaluate ∫₀^(π/2) sin^(3/2)x/(sin^(3/2)x + cos^(3/2)x) dx', (x) => sin(x) ** 1.5 / (sin(x) ** 1.5 + cos(x) ** 1.5), 0, PI / 2, PI / 4, 'π/4', lb),
  vQ('Ex 7.10', 'Q4', 'Evaluate ∫₀^(π/2) cos⁵x/(sin⁵x + cos⁵x) dx', (x) => cos(x) ** 5 / (sin(x) ** 5 + cos(x) ** 5), 0, PI / 2, PI / 4, 'π/4', lb),
  vQ('Ex 7.10', 'Q5', 'Evaluate ∫₋₅⁵ |x + 2| dx', (x) => abs(x + 2), -5, 5, 29, '29'),
  vQ('Ex 7.10', 'Q6', 'Evaluate ∫₂⁸ |x − 5| dx', (x) => abs(x - 5), 2, 8, 9, '9'),
  vQ('Ex 7.10', 'Q7', 'Evaluate ∫₀¹ x(1 − x)ⁿ dx', (x) => x * (1 - x) ** 3, 0, 1, 1 / 20, '1/20', { cap: 'graph with n = 3: answer 1/((n + 1)(n + 2))', w: '1/((n + 1)(n + 2)) (= 1/20 for n = 3)', steps: [mcqP('P₄: replace x by 1 − x. Then ∫₀¹ (1 − x)xⁿ dx =', ['1/(n + 1) − 1/(n + 2)', '1/(n + 1)', '1/n', 'n/(n + 1)'], '= 1/((n + 1)(n + 2)).')] }),
  decQ('Ex 7.10', 'Q8', 'Evaluate ∫₀^(π/4) log(1 + tan x) dx', (x) => log(1 + tan(x)), 0, PI / 4, (PI / 8) * L2, '(π/8) log 2', lb),
  vQ('Ex 7.10', 'Q9', 'Evaluate ∫₀² x√(2 − x) dx', (x) => x * S(2 - x), 0, 2, (16 * sqrt(2)) / 15, '16√2/15'),
  decQ('Ex 7.10', 'Q10', 'Evaluate ∫₀^(π/2) (2 log sin x − log sin 2x) dx', (x) => 2 * log(sin(x)) - log(sin(2 * x)), 0, PI / 2, (PI / 2) * log(0.5), '(π/2) log(1/2)', lb),
  vQ('Ex 7.10', 'Q11', 'Evaluate ∫ sin²x dx from −π/2 to π/2', (x) => sin(x) ** 2, -PI / 2, PI / 2, PI / 2, 'π/2', lb),
  vQ('Ex 7.10', 'Q12', 'Evaluate ∫₀^π x/(1 + sin x) dx', (x) => x / (1 + sin(x)), 0, PI, PI, 'π', lb),
  vQ('Ex 7.10', 'Q13', 'Evaluate ∫ sin⁷x dx from −π/2 to π/2', (x) => sin(x) ** 7, -PI / 2, PI / 2, 0, '0', { ...lb, tol: 1e-6, steps: [mcqP('sin⁷x is', ['odd, so the integral is 0', 'even', 'neither', 'periodic only'], 'P₇(ii).')] }),
  vQ('Ex 7.10', 'Q14', 'Evaluate ∫₀^(2π) cos⁵x dx', (x) => cos(x) ** 5, 0, 2 * PI, 0, '0', { ...lb, tol: 1e-6 }),
  vQ('Ex 7.10', 'Q15', 'Evaluate ∫₀^(π/2) (sin x − cos x)/(1 + sin x cos x) dx', (x) => (sin(x) - cos(x)) / (1 + sin(x) * cos(x)), 0, PI / 2, 0, '0', { ...lb, tol: 1e-6 }),
  decQ('Ex 7.10', 'Q16', 'Evaluate ∫₀^π log(1 + cos x) dx', (x) => log(1 + cos(x)), 0, PI, -PI * L2, '−π log 2', lb),
  vQ('Ex 7.10', 'Q17', 'Evaluate ∫₀ᵃ √x/(√x + √(a − x)) dx', (x) => S(x) / (S(x) + S(2 - x)), 0, 2, 1, 'a/2 (= 1 for a = 2)', { cap: 'graph with a = 2', w: 'a/2' }),
  vQ('Ex 7.10', 'Q18', 'Evaluate ∫₀⁴ |x − 1| dx', (x) => abs(x - 1), 0, 4, 5, '5'),
  xs7('Ex 7.10', 'Q19', 'Show that ∫₀ᵃ f(x)g(x) dx = 2∫₀ᵃ f(x) dx if f(x) = f(a − x) and g(x) + g(a − x) = 4', [{ k: 'order', q: 'Order the proof', s: ['I = ∫₀ᵃ f(x)g(x) dx = ∫₀ᵃ f(a − x)g(a − x) dx (P₄)', '= ∫₀ᵃ f(x)(4 − g(x)) dx', '= 4∫₀ᵃ f(x) dx − I', 'So 2I = 4∫₀ᵃ f, I = 2∫₀ᵃ f(x) dx'] }], 'I = 2∫₀ᵃ f(x) dx'),
  vQ('Ex 7.10', 'Q20', 'The value of ∫ (x³ + x cos x + tan⁵x + 1) dx from −π/2 to π/2 is (A) 0 (B) 2 (C) π (D) 1', (x) => x ** 3 + x * cos(x) + 1, -PI / 2, PI / 2, PI, 'π', { ...lb, cap: 'tan⁵x (odd) left out of the picture', y: [-3, 5], steps: [mcqP('x³, x cos x and tan⁵x are odd, so only ∫1 dx survives:', ['(C) π', '(A) 0', '(B) 2', '(D) 1'], 'Odd parts cancel on a symmetric interval (the tan⁵ parts cancel as a principal value).')] }),
  vQ('Ex 7.10', 'Q21', 'The value of ∫₀^(π/2) log((4 + 3 sin x)/(4 + 3 cos x)) dx is (A) 2 (B) 3/4 (C) 0 (D) −2', (x) => log((4 + 3 * sin(x)) / (4 + 3 * cos(x))), 0, PI / 2, 0, '0', { ...lb, tol: 1e-6, post: [mcqP('Answer', ['(C) 0', '(A) 2', '(B) 3/4', '(D) −2'], 'P₄ turns I into −I.')] }),
];

/* ===================== MISCELLANEOUS ===================== */
const EX7M = [
  aQ('Misc', 'Q1', '∫ dx/(x − x³)', (x) => 1 / (x - x ** 3), (x) => log(abs(x)) - 0.5 * log(abs(1 - x * x)), ['log |x| − ½ log |1 − x²|', 'log |x| + ½ log |1 − x²|', '½ log |x/(1 − x²)|', 'log |x − x³|'], { view: [0.1, 0.9] }),
  aQ('Misc', 'Q2', '∫ dx/(√(x + a) + √(x + b))', (x) => 1 / (S(x + 2) + S(x + 1)), (x) => (2 / 3) * ((x + 2) ** 1.5 - (x + 1) ** 1.5), ['(2/(3(a − b)))[(x + a)^(3/2) − (x + b)^(3/2)]', '(2/3)[(x + a)^(3/2) + (x + b)^(3/2)]', '(1/(a − b))[√(x + a) − √(x + b)]', '2[√(x + a) − √(x + b)]'], { cap: 'graph with a = 2, b = 1', view: [-1, 3] }),
  aQ('Misc', 'Q3', '∫ dx/(x√(ax − x²)) [put x = a/t]', (x) => 1 / (x * S(2 * x - x * x)), (x) => -S((2 - x) / x), ['−(2/a)√((a − x)/x)', '(2/a)√((a − x)/x)', '−√((a − x)/x)', 'sin⁻¹(x/a)'], { cap: 'graph with a = 2', view: [0.2, 1.95] }),
  aQ('Misc', 'Q4', '∫ dx/(x²(x⁴ + 1)^(3/4))', (x) => 1 / (x * x * (x ** 4 + 1) ** 0.75), (x) => -((1 + 1 / x ** 4) ** 0.25), ['−(1 + 1/x⁴)^(1/4)', '(1 + 1/x⁴)^(1/4)', '−¼(1 + 1/x⁴)^(1/4)', '(x⁴ + 1)^(1/4)/x'], { view: [0.4, 3] }),
  aQ('Misc', 'Q5', '∫ dx/(x^(1/2) + x^(1/3)) [put x = t⁶]', (x) => 1 / (S(x) + cbrt(x)), (x) => 2 * S(x) - 3 * cbrt(x) + 6 * x ** (1 / 6) - 6 * log(1 + x ** (1 / 6)), ['2√x − 3x^(1/3) + 6x^(1/6) − 6 log(1 + x^(1/6))', '2√x + 3x^(1/3) + 6x^(1/6) + 6 log(1 + x^(1/6))', '6 log(1 + x^(1/6))', '2√x − 3x^(1/3)'], { view: [0.05, 4] }),
  aQ('Misc', 'Q6', '∫ 5x/((x + 1)(x² + 9)) dx', (x) => (5 * x) / ((x + 1) * (x * x + 9)), (x) => -0.5 * ln(x + 1) + 0.25 * log(x * x + 9) + 1.5 * atan(x / 3), ['−½ log |x + 1| + ¼ log(x² + 9) + (3/2) tan⁻¹(x/3)', '½ log |x + 1| − ¼ log(x² + 9) + (3/2) tan⁻¹(x/3)', '−½ log |x + 1| + ¼ log(x² + 9)', '5 log |x + 1| − tan⁻¹(x/3)'], { view: [-0.8, 4] }),
  aQ('Misc', 'Q7', '∫ sin x/sin(x − a) dx', (x) => sin(x) / sin(x - 1), (x) => (x - 1) * cos(1) + sin(1) * log(abs(sin(x - 1))), ['sin a log |sin(x − a)| + x cos a', 'cos a log |sin(x − a)| + x sin a', 'log |sin(x − a)|', 'x cos a − sin a log |sin(x − a)|'], { cap: 'graph with a = 1', view: [1.2, 3.9] }),
  aQ('Misc', 'Q8', '∫ (e^(5 log x) − e^(4 log x))/(e^(3 log x) − e^(2 log x)) dx', (x) => (x ** 5 - x ** 4) / (x ** 3 - x * x), (x) => x ** 3 / 3, ['x³/3', 'x²/2', 'x³', 'x⁴/4 − x³/3'], { view: [1.2, 3], steps: [mcqP('e^(k log x) = xᵏ, so the integrand simplifies to', ['x²', 'x', 'x³', '1'], '(x⁵ − x⁴)/(x³ − x²) = x².')] }),
  aQ('Misc', 'Q9', '∫ cos x/√(4 − sin²x) dx', (x) => cos(x) / S(4 - sin(x) ** 2), (x) => asin(sin(x) / 2), ['sin⁻¹(½ sin x)', '½ sin⁻¹(sin x)', 'log |sin x + √(4 − sin²x)|', 'tan⁻¹(sin x/2)']),
  aQ('Misc', 'Q10', '∫ (sin⁸x − cos⁸x)/(1 − 2 sin²x cos²x) dx', (x) => (sin(x) ** 8 - cos(x) ** 8) / (1 - 2 * sin(x) ** 2 * cos(x) ** 2), (x) => -sin(2 * x) / 2, ['−½ sin 2x', '½ sin 2x', '−cos 2x', 'sin²x − cos²x'], { steps: [mcqP('The integrand simplifies to', ['−cos 2x', 'cos 2x', '1', 'sin 2x'], 'sin⁸ − cos⁸ = (sin⁴ − cos⁴)(sin⁴ + cos⁴), and sin⁴ + cos⁴ = 1 − 2 sin²cos².')] }),
  aQ('Misc', 'Q11', '∫ dx/(cos(x + a) cos(x + b))', (x) => 1 / (cos(x + 0.6) * cos(x + 0.2)), (x) => (1 / sin(0.4)) * log(abs(cos(x + 0.2) / cos(x + 0.6))), ['(1/sin(a − b)) log |cos(x + b)/cos(x + a)|', '(1/sin(a − b)) log |cos(x + a)/cos(x + b)|', 'tan(x + a) − tan(x + b)', '(1/cos(a − b)) log |sin(x + b)/sin(x + a)|'], { cap: 'graph with a = 0.6, b = 0.2', view: [-1.6, 0.9] }),
  aQ('Misc', 'Q12', '∫ x³/√(1 − x⁸) dx', (x) => x ** 3 / S(1 - x ** 8), (x) => asin(x ** 4) / 4, ['¼ sin⁻¹(x⁴)', 'sin⁻¹(x⁴)', '½ sin⁻¹(x⁴)', '¼ log |x⁴ + √(1 − x⁸)|'], { view: [-0.97, 0.97] }),
  aQ('Misc', 'Q13', '∫ eˣ/((1 + eˣ)(2 + eˣ)) dx', (x) => exp(x) / ((1 + exp(x)) * (2 + exp(x))), (x) => log((1 + exp(x)) / (2 + exp(x))), ['log |(1 + eˣ)/(2 + eˣ)|', 'log |(2 + eˣ)/(1 + eˣ)|', 'log |(1 + eˣ)(2 + eˣ)|', 'tan⁻¹ eˣ']),
  aQ('Misc', 'Q14', '∫ dx/((x² + 1)(x² + 4))', (x) => 1 / ((x * x + 1) * (x * x + 4)), (x) => atan(x) / 3 - atan(x / 2) / 6, ['(1/3) tan⁻¹x − (1/6) tan⁻¹(x/2)', '(1/3) tan⁻¹x + (1/6) tan⁻¹(x/2)', '(1/3) tan⁻¹x − (1/3) tan⁻¹(x/2)', '(1/6) log |(x² + 1)/(x² + 4)|']),
  aQ('Misc', 'Q15', '∫ cos³x e^(log sin x) dx', (x) => cos(x) ** 3 * sin(x), (x) => -(cos(x) ** 4) / 4, ['−¼ cos⁴x', '¼ cos⁴x', '¼ sin⁴x', '−cos⁴x'], { view: [0.05, 3] }),
  aQ('Misc', 'Q16', '∫ e^(3 log x)(x⁴ + 1)⁻¹ dx', (x) => x ** 3 / (x ** 4 + 1), (x) => 0.25 * log(x ** 4 + 1), ['¼ log(x⁴ + 1)', 'log(x⁴ + 1)', '¼ tan⁻¹ x⁴', 'x⁴/4']),
  aQ('Misc', 'Q17', '∫ f′(ax + b)[f(ax + b)]ⁿ dx', (x) => cos(2 * x + 1) * sin(2 * x + 1) ** 2, (x) => sin(2 * x + 1) ** 3 / 6, ['[f(ax + b)]ⁿ⁺¹/(a(n + 1))', '[f(ax + b)]ⁿ⁺¹/(n + 1)', 'a[f(ax + b)]ⁿ⁺¹/(n + 1)', 'n[f(ax + b)]ⁿ⁻¹'], { cap: 'graph with f = sin, a = 2, b = 1, n = 2' }),
  aQ('Misc', 'Q18', '∫ dx/√(sin³x sin(x + α))', (x) => 1 / S(sin(x) ** 3 * sin(x + 0.8)), (x) => (-2 / sin(0.8)) * S(sin(x + 0.8) / sin(x)), ['−(2/sin α)√(sin(x + α)/sin x)', '(2/sin α)√(sin(x + α)/sin x)', '−2√(sin x/sin(x + α))', '(1/sin α) log |sin(x + α)/sin x|'], { cap: 'graph with α = 0.8', view: [0.3, 2.2] }),
  aQ('Misc', 'Q19', '∫ √((1 − √x)/(1 + √x)) dx', (x) => S((1 - S(x)) / (1 + S(x))), (x) => -2 * S(1 - x) + acos(S(x)) + S(x * (1 - x)), ['−2√(1 − x) + cos⁻¹√x + √(x(1 − x))', '2√(1 − x) + cos⁻¹√x − √(x(1 − x))', 'cos⁻¹√x', '−2√(1 − x) − cos⁻¹√x'], { view: [0.02, 0.98], steps: [mcqP('A good substitution is', ['x = cos²θ', 'x = tan θ', 'x = t²', 'x = sec θ'], 'Then √x = cos θ and the root becomes tan(θ/2).')] }),
  aQ('Misc', 'Q20', '∫ (2 + sin 2x)eˣ/(1 + cos 2x) dx', (x) => ((2 + sin(2 * x)) * exp(x)) / (1 + cos(2 * x)), (x) => exp(x) * tan(x), ['eˣ tan x', 'eˣ sec x', 'eˣ sec²x', '−eˣ cot x'], { view: [-1.3, 1.3], steps: [mcqP('(2 + sin 2x)/(1 + cos 2x) =', ['sec²x + tan x', 'sec x + tan x', 'tan²x + 1', '2 sec²x'], 'Then it is eˣ[f + f′] with f = tan x.')] }),
  aQ('Misc', 'Q21', '∫ (x² + x + 1)/((x + 1)²(x + 2)) dx', (x) => (x * x + x + 1) / ((x + 1) ** 2 * (x + 2)), (x) => -2 * ln(x + 1) - 1 / (x + 1) + 3 * ln(x + 2), ['−2 log |x + 1| − 1/(x + 1) + 3 log |x + 2|', '2 log |x + 1| + 1/(x + 1) − 3 log |x + 2|', '−2 log |x + 1| + 1/(x + 1) + 3 log |x + 2|', 'log |x + 2| − 1/(x + 1)'], { view: [-0.7, 3], steps: [pf('A/(x + 1) + B/(x + 1)² + C/(x + 2)', [{ l: 'A', a: -2 }, { l: 'B', a: 1 }, { l: 'C', a: 3 }], 'B from x = −1, C from x = −2, A from x².')] }),
  aQ('Misc', 'Q22', '∫ tan⁻¹√((1 − x)/(1 + x)) dx', (x) => atan(S((1 - x) / (1 + x))), (x) => 0.5 * (x * acos(x) - S(1 - x * x)), ['½ (x cos⁻¹x − √(1 − x²))', '½ (x cos⁻¹x + √(1 − x²))', 'x cos⁻¹x − √(1 − x²)', '½ cos⁻¹ x'], { view: [-0.95, 0.95], steps: [mcqP('With x = cos θ, the integrand is', ['½ cos⁻¹x', 'cos⁻¹x', 'tan⁻¹x', '½ sin⁻¹x'], 'tan⁻¹ tan(θ/2) = θ/2.')] }),
  aQ('Misc', 'Q23', '∫ √(x² + 1)[log(x² + 1) − 2 log x]/x⁴ dx', (x) => (S(x * x + 1) * (log(x * x + 1) - 2 * log(x))) / x ** 4, (x) => -(1 / 3) * (1 + 1 / (x * x)) ** 1.5 * (log(1 + 1 / (x * x)) - 2 / 3), ['−⅓(1 + 1/x²)^(3/2)[log(1 + 1/x²) − 2/3]', '⅓(1 + 1/x²)^(3/2)[log(1 + 1/x²) − 2/3]', '−⅓(1 + 1/x²)^(3/2) log(1 + 1/x²)', '(1 + 1/x²)^(3/2)'], { view: [0.5, 3], steps: [mcqP('The integrand is (1/x³)√(1 + 1/x²) log(1 + 1/x²). Put', ['t = 1 + 1/x²', 't = x²', 't = log x', 't = √(x² + 1)'], 'dt = −2/x³ dx, then integrate √t log t by parts.')] }),
  decQ('Misc', 'Q24', 'Evaluate ∫ from π/2 to π of eˣ(1 − sin x)/(1 − cos x) dx', (x) => (exp(x) * (1 - sin(x))) / (1 - cos(x)), PI / 2, PI, exp(PI / 2), 'e^(π/2)', lb),
  vQ('Misc', 'Q25', 'Evaluate ∫₀^(π/4) sin x cos x/(cos⁴x + sin⁴x) dx', (x) => (sin(x) * cos(x)) / (cos(x) ** 4 + sin(x) ** 4), 0, PI / 4, PI / 8, 'π/8', lb),
  vQ('Misc', 'Q26', 'Evaluate ∫₀^(π/2) cos²x/(cos²x + 4 sin²x) dx', (x) => cos(x) ** 2 / (cos(x) ** 2 + 4 * sin(x) ** 2), 0, PI / 2, PI / 6, 'π/6', lb),
  decQ('Misc', 'Q27', 'Evaluate ∫ from π/6 to π/3 of (sin x + cos x)/√(sin 2x) dx', (x) => (sin(x) + cos(x)) / S(sin(2 * x)), PI / 6, PI / 3, 2 * asin((r3 - 1) / 2), '2 sin⁻¹((√3 − 1)/2)', lb),
  vQ('Misc', 'Q28', 'Evaluate ∫₀¹ dx/(√(1 + x) − √x)', (x) => 1 / (S(1 + x) - S(x)), 0, 1, (4 * sqrt(2)) / 3, '4√2/3'),
  decQ('Misc', 'Q29', 'Evaluate ∫₀^(π/4) (sin x + cos x)/(9 + 16 sin 2x) dx', (x) => (sin(x) + cos(x)) / (9 + 16 * sin(2 * x)), 0, PI / 4, log(9) / 40, '(1/40) log 9', lb),
  vQ('Misc', 'Q30', 'Evaluate ∫₀^(π/2) sin 2x tan⁻¹(sin x) dx', (x) => sin(2 * x) * atan(sin(x)), 0, PI / 2, PI / 2 - 1, 'π/2 − 1', lb),
  vQ('Misc', 'Q31', 'Evaluate ∫₁⁴ [|x − 1| + |x − 2| + |x − 3|] dx', (x) => abs(x - 1) + abs(x - 2) + abs(x - 3), 1, 4, 19 / 2, '19/2'),
  decQ('Misc', 'Q32', 'Prove ∫₁³ dx/(x²(x + 1)) = 2/3 + log(2/3)', (x) => 1 / (x * x * (x + 1)), 1, 3, 2 / 3 + log(2 / 3), '2/3 + log(2/3)'),
  vQ('Misc', 'Q33', 'Prove ∫₀¹ x eˣ dx = 1', (x) => x * exp(x), 0, 1, 1, '1'),
  vQ('Misc', 'Q34', 'Prove ∫₋₁¹ x¹⁷ cos⁴x dx = 0', (x) => x ** 17 * cos(x) ** 4, -1, 1, 0, '0', { tol: 1e-6 }),
  vQ('Misc', 'Q35', 'Prove ∫₀^(π/2) sin³x dx = 2/3', (x) => sin(x) ** 3, 0, PI / 2, 2 / 3, '2/3', lb),
  decQ('Misc', 'Q36', 'Prove ∫₀^(π/4) 2 tan³x dx = 1 − log 2', (x) => 2 * tan(x) ** 3, 0, PI / 4, 1 - L2, '1 − log 2', lb),
  vQ('Misc', 'Q37', 'Prove ∫₀¹ sin⁻¹x dx = π/2 − 1', asin, 0, 1, PI / 2 - 1, 'π/2 − 1'),
  aQ('Misc', 'Q38', '∫ dx/(eˣ + e⁻ˣ) equals (A) tan⁻¹(eˣ) (B) tan⁻¹(e⁻ˣ) (C) log(eˣ − e⁻ˣ) (D) log(eˣ + e⁻ˣ)', (x) => 1 / (exp(x) + exp(-x)), (x) => atan(exp(x)), ['(A) tan⁻¹(eˣ)', '(B)', '(C)', '(D)']),
  aQ('Misc', 'Q39', '∫ cos 2x/(sin x + cos x)² dx equals (A) −1/(sin x + cos x) (B) log |sin x + cos x| (C) log |sin x − cos x| (D) 1/(sin x + cos x)²', (x) => cos(2 * x) / (sin(x) + cos(x)) ** 2, (x) => log(abs(sin(x) + cos(x))), ['(B) log |sin x + cos x|', '(A)', '(C)', '(D)'], { view: [-0.7, 2.3] }),
  xs7('Misc', 'Q40', 'If f(a + b − x) = f(x), then ∫ₐᵇ x f(x) dx equals (A) ((a + b)/2)∫ₐᵇ f(b − x) (B) ((a + b)/2)∫ₐᵇ f(b + x) (C) ((b − a)/2)∫ₐᵇ f(x) (D) ((a + b)/2)∫ₐᵇ f(x) dx', [mcqP('P₃: I = ∫ₐᵇ (a + b − x) f(x) dx, so 2I = (a + b)∫ₐᵇ f. Answer', ['(D)', '(A)', '(B)', '(C)'], 'Add the two forms of I.')], '(D)'),
];
function xs7(ex, n, q, parts, w) { return { ex, n, q, scene: 'board', parts, w: [w] }; }

const BOSS7 = [['∫ x³ dx', ['x⁴/4 + C', '3x² + C', 'x⁴ + C', 'x³/3 + C'], 0], ['∫ dx/x', ['log |x| + C', '1/x² + C', '−1/x² + C', 'x + C'], 0], ['∫ eˣ dx', ['eˣ + C', 'xeˣ + C', 'eˣ⁺¹/(x + 1)', 'log x'], 0], ['∫ sec²x dx', ['tan x + C', 'sec x + C', '−cot x + C', 'sec³x/3'], 0], ['∫ dx/(1 + x²)', ['tan⁻¹x + C', 'sin⁻¹x + C', 'log(1 + x²)', '1/x'], 0], ['∫₀¹ 2x dx', ['1', '2', '½', '0'], 0], ['Odd f: ∫₋ₐᵃ f dx', ['0', '2∫₀ᵃ f', 'a', 'undefined'], 0], ['∫ x eˣ dx (by parts)', ['(x − 1)eˣ + C', 'x eˣ + C', 'x²eˣ/2', '(x + 1)eˣ'], 0], ['∫ tan x dx', ['log |sec x| + C', 'sec²x + C', 'log |cos x| + C', '−log |sec x|'], 0], ['d/dx ∫ₐˣ f(t) dt', ['f(x)', 'F(x)', 'f(a)', '0'], 0]];
const byId = (id) => LESSONS.find((l) => l.id === id);
(() => {
  const [an, su, sp, pa, pt, de, pr, mi] = ['anti', 'subst', 'special', 'partial', 'parts', 'definite', 'props', 'miscex'].map(byId);
  LESSONS.length = 0;
  LESSONS.push(an, exLesson({ id: 'ex71', title: 'Exercise 7.1', blurb: 'All 22: antiderivatives by inspection, F rising by the area.', face: 'kimmy-playful', qs: EX71 }), su, exLesson({ id: 'ex72', title: 'Exercise 7.2', blurb: 'All 39 substitution integrals.', face: 'jess-happy', qs: EX72 }), exLesson({ id: 'ex73', title: 'Exercise 7.3', blurb: 'All 24 trigonometric-identity integrals.', face: 'kimmy-curious', qs: EX73 }), sp, exLesson({ id: 'ex74', title: 'Exercise 7.4', blurb: 'All 25 special forms.', face: 'jess-thinking', qs: EX74 }), pa, exLesson({ id: 'ex75', title: 'Exercise 7.5', blurb: 'All 23 partial-fraction integrals.', face: 'kimmy-excited', qs: EX75 }), pt, exLesson({ id: 'ex76', title: 'Exercise 7.6', blurb: 'All 24 by parts.', face: 'jess-excited', qs: EX76 }), exLesson({ id: 'ex77', title: 'Exercise 7.7', blurb: 'All 11 square-root integrals.', face: 'kimmy-lookup', qs: EX77 }), de, exLesson({ id: 'ex78', title: 'Exercise 7.8', blurb: 'All 22 definite integrals with Riemann rectangles.', face: 'jess-happy', qs: EX78 }), exLesson({ id: 'ex79', title: 'Exercise 7.9', blurb: 'All 10 by substitution.', face: 'kimmy-playful', qs: EX79 }), pr, exLesson({ id: 'ex710', title: 'Exercise 7.10', blurb: 'All 21 with the properties.', face: 'kimmy-curious', qs: EX710 }), mi, exLesson({ id: 'misc', title: 'Miscellaneous', blurb: 'All 40 Miscellaneous Exercise questions.', face: 'jess-thinking', qs: EX7M }));
})();
LESSONS.push(lesson({ id: 'boss', title: 'Boss Battle', blurb: 'Ten fast questions. Speed points. Beat Kimmy.', face: 'jess-excited', steps: [async function () { enterScene('board', (W) => { W.tag = 'BOSS'; W.sub = 'Class 12 · Ch 7'; }); await slam('BOSS BATTLE', '10 questions · speed counts'); await K('play', 'Integrate faster than me!'); await cont('Fight'); }, ...BOSS7.map(([q, o, a], i) => async function () { enterScene('board', (W) => { W.tag = 'Q' + (i + 1); W.sub = 'Boss Battle'; }); await quiz(q, o, a, plain(o[a]) + '.', null, 15); await cont(); }), async function () { enterScene('board', (W) => { W.tag = 'K.O.!'; W.sub = 'Class 12 · Ch 7'; }); await summary(['Chapter complete!', { t: '∫ₐᵇ f = F(b) − F(a)', eq: true }]); }] }));
LESSONS.forEach((l) => { if (l.kind === 'ex') l.short = l.id === 'misc' ? 'M' : l.title.replace('Exercise ', ''); });

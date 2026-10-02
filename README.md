# Kiso Maths · Class 11

Interactive, simulation-first lessons for NCERT Class 11 Mathematics, Chapters 1–14, plus Class 12 (Chapters 1–13), in the Kiso style (Jeevesh and Kimmy, manga panels, Kahoot-style speed rounds).

Open `index.html` in a browser (any static server works, for example `python3 -m http.server`).

| Page | Chapter | Sims |
|---|---|---|
| `ch1.html` | Sets | tap-to-shade Venn diagrams, set-builder machine, power-set dealer, N ⊂ Z ⊂ Q ⊂ R drag, interval builder |
| `ch2.html` | Relations & Functions | tap-the-grid Cartesian products, draw-your-own arrow diagrams, function machine, graph gallery with tracer and vertical-line test |
| `ch3.html` | Trigonometric Functions | spin-the-unit-circle (multi-turn winding), radian roller, pendulum, clock, wheel, sine-wave unroller, Fig 3.14 chords, LHS/RHS identity overlay |
| `ch4.html` | Complex Numbers | Argand plane with draggable z, tip-to-tail addition, rotate-and-stretch multiplication, conjugate mirror, powers-of-i spinner |
| `ch5.html` | Linear Inequalities | balance scale that flips on ×negative, number-line builder, marks bar chart, acid-mixing tank, °C/°F thermometer |
| `ch6.html` | Permutations & Combinations | fill-the-slots counter, growing choice trees, letter tiles that shuffle and glue, team/committee picker, circle chords, card hands |
| `ch7.html` | Binomial Theorem | tap-to-build Pascal’s triangle, expansion cards that flip as coefficients are answered (exact polynomial engine) |
| `ch8.html` | Sequences & Series | term bars with ×r arrows, slide-and-subtract proof of the G.P. sum, doubling generations, draggable A.M.–G.M. semicircle |
| `ch9.html` | Straight Lines | drag-the-line plane (two handles or a pivot) with live slope and equation, slope triangles, perpendicular feet, mirror images, axis sliders |
| `ch10.html` | Conic Sections | double-cone slicer (inset drawn from e = cos β / cos α), circle builder, draggable P with live PF / PM / PF₁ ± PF₂, sliding-rod locus |
| `ch11.html` | Introduction to 3D Geometry | drag-to-orbit space with x, y, z sliders, drop lines, octants that light up, distance boxes |
| `ch12.html` | Limits & Derivatives | points sliding in from both sides, holes and jumps, a secant collapsing into the tangent, unit-circle sandwich for sin x / x |
| `ch13.html` | Statistics | draggable dot plot (mean as balance point, deviations as bars or real squares), frequency bars and histograms with mean/median lines |
| `ch14.html` | Probability | tap-to-build events on the 36 two-dice outcomes, 52-card deck, die/coin roller with settling frequencies, probability Venn |
| `c12ch1.html` | Class 12 · Relations & Functions | tap pairs on A × A with live reflexive/symmetric/transitive badges and counter-examples, equivalence-class sorter, horizontal-line test for one-one/onto, composition arrows |
| `c12ch2.html` | Class 12 · Inverse Trigonometric Functions | reflect a principal branch in y = x, unit-circle principal-value finder, identities checked as two coinciding graphs |
| `c12ch3.html` | Class 12 · Matrices | tap a cell of AB to light up its row and column with the dot product, unit-square transformations, transpose flips, symmetric + skew splits |
| `c12ch4.html` | Class 12 · Determinants | determinant as area, tap-to-expand minors and cofactors on a sign checkerboard, draggable triangle area, consistency as crossing/parallel lines |
| `c12ch5.html` | Class 12 · Continuity & Differentiability | a pen that lifts at every break, k-sliders that join graphs, kink secants, drag along implicit curves, parametric tangents, live second-derivative checks |
| `c12ch6.html` | Class 12 · Application of Derivatives | living related-rate pictures (ripples, balloons, ladders, cone tanks, shadows), f′ sign strips, hill/valley markers, optimisation playgrounds |
| `c12ch7.html` | Class 12 · Integrals | slide the constant C through a family of antiderivatives, Riemann rectangles that settle on the area, F rising by exactly the shaded area, partial-fraction sliders |
| `c12ch8.html` | Class 12 · Application of Integrals | sweep a strip across the region, horizontal strips for x = g(y), one quadrant of a circle or ellipse mirrored ×4, signed pieces vs total area |
| `c12ch9.html` | Class 12 · Differential Equations | derivative tower for order and degree, slope fields where a tap releases a solution curve and the textbook answer glows on top of it, residual meter for verification |
| `c12ch10.html` | Class 12 · Vector Algebra | compass-snapping arrows, tip-to-tail sums, swing b⃗ until a⃗·b⃗ = 0 with a projection shadow, cross products standing up from their parallelograms in orbitable 3D |
| `c12ch11.html` | Class 12 · Three Dimensional Geometry | riders sliding along r⃗ = a⃗ + λb⃗, angle arcs between lines, two-slider hunt for the shortest distance between skew lines |
| `c12ch12.html` | Class 12 · Linear Programming | constraint lines that draw themselves, shaded feasible region, tap-to-evaluate corners, a sliding profit line that leaves at the optimal corner, unbounded and infeasible cases |
| `c12ch13.html` | Class 12 · Probability | tap outcomes into events and shrink the universe for “given F”, a Venn plus proportional bar that stretches for P(A|B), shrinking-bar draw chains, the area model for total probability and Bayes |

Every in-text example and every exercise question (including Miscellaneous) is implemented, split into small steps where needed.

## Layout

- `shared/engine.js` — stage, step runner, sound board, manga FX, scoring, inputs (tiles, true/false, chips, keypad, ordering, matching), exercise runner, chapter map
- `shared/scenes.js` — number line (with interval builder), coordinate plane, set helpers, brace “bag” scene
- `shared/kiso.css` — design tokens and no-scroll layout
- `chN/sims.js`, `chN/lessons.js`, `chN/exercises.js` — per-chapter sims, concept lessons and question banks
- `m/` — mascot artwork

Every page has a ⏱ timer button (also on the hub): switch it off to think at your own pace; each right answer then scores a flat 750 and the choice is remembered.

Append `?auto` to a chapter URL to watch the autopilot play through (used for testing).

Where the textbook’s answer key is incomplete or wrong, the lesson teaches the correct answer and shows an “Answer-key check” note (for example Ch 6 Example 13 and Ch 8 Ex 8.2 Q15). Multiple-choice tiles are shown in random order.

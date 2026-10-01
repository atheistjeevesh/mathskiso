# Kiso Maths · Class 11

Interactive, simulation-first lessons for NCERT Class 11 Mathematics, Chapters 1–10, in the Kiso style (Jeevesh and Kimmy, manga panels, Kahoot-style speed rounds).

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

Every in-text example and every exercise question (including Miscellaneous) is implemented, split into small steps where needed.

## Layout

- `shared/engine.js` — stage, step runner, sound board, manga FX, scoring, inputs (tiles, true/false, chips, keypad, ordering, matching), exercise runner, chapter map
- `shared/scenes.js` — number line (with interval builder), coordinate plane, set helpers, brace “bag” scene
- `shared/kiso.css` — design tokens and no-scroll layout
- `chN/sims.js`, `chN/lessons.js`, `chN/exercises.js` — per-chapter sims, concept lessons and question banks
- `m/` — mascot artwork

Append `?auto` to a chapter URL to watch the autopilot play through (used for testing).

Where the textbook’s answer key is incomplete or wrong, the lesson teaches the correct answer and shows an “Answer-key check” note (for example Ch 6 Example 13 and Ch 8 Ex 8.2 Q15).

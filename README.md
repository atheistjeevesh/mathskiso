# Kiso Maths · Class 11

Interactive, simulation-first lessons for NCERT Class 11 Mathematics, Chapters 1–5, in the Kiso style (Jeevesh and Kimmy, manga panels, Kahoot-style speed rounds).

Open `index.html` in a browser (any static server works, for example `python3 -m http.server`).

| Page | Chapter | Sims |
|---|---|---|
| `ch1.html` | Sets | tap-to-shade Venn diagrams, set-builder machine, power-set dealer, N ⊂ Z ⊂ Q ⊂ R drag, interval builder |
| `ch2.html` | Relations & Functions | tap-the-grid Cartesian products, draw-your-own arrow diagrams, function machine, graph gallery with tracer and vertical-line test |
| `ch3.html` | Trigonometric Functions | spin-the-unit-circle (multi-turn winding), radian roller, pendulum, clock, wheel, sine-wave unroller, Fig 3.14 chords, LHS/RHS identity overlay |
| `ch4.html` | Complex Numbers | Argand plane with draggable z, tip-to-tail addition, rotate-and-stretch multiplication, conjugate mirror, powers-of-i spinner |
| `ch5.html` | Linear Inequalities | balance scale that flips on ×negative, number-line builder, marks bar chart, acid-mixing tank, °C/°F thermometer |

Every in-text example and every exercise question (including Miscellaneous) is implemented, split into small steps where needed.

## Layout

- `shared/engine.js` — stage, step runner, sound board, manga FX, scoring, inputs (tiles, true/false, chips, keypad, ordering, matching), exercise runner, chapter map
- `shared/scenes.js` — number line (with interval builder), coordinate plane, set helpers, brace “bag” scene
- `shared/kiso.css` — design tokens and no-scroll layout
- `chN/sims.js`, `chN/lessons.js`, `chN/exercises.js` — per-chapter sims, concept lessons and question banks
- `m/` — mascot artwork

Append `?auto` to a chapter URL to watch the autopilot play through (used for testing).

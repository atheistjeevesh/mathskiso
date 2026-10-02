/* =========================================================
   CLASS 12 · CHAPTER 12 — Exercise 12.1 (all 10)
   Every answer comes from lpAnalyze (exact corner enumeration).
   ========================================================= */
const EX121 = [
  lpQ('Ex 12.1', 'Q1', 'Maximise Z = 3x + 4y subject to x + y ≤ 4, x ≥ 0, y ≥ 0', [[1, 1, '≤', 4]], [3, 4], 'max'),
  lpQ('Ex 12.1', 'Q2', 'Minimise Z = −3x + 4y subject to x + 2y ≤ 8, 3x + 2y ≤ 12, x ≥ 0, y ≥ 0', [[1, 2, '≤', 8], [3, 2, '≤', 12]], [-3, 4], 'min'),
  lpQ('Ex 12.1', 'Q3', 'Maximise Z = 5x + 3y subject to 3x + 5y ≤ 15, 5x + 2y ≤ 10, x ≥ 0, y ≥ 0', [[3, 5, '≤', 15], [5, 2, '≤', 10]], [5, 3], 'max'),
  lpQ('Ex 12.1', 'Q4', 'Minimise Z = 3x + 5y such that x + 3y ≥ 3, x + y ≥ 2, x, y ≥ 0', [[1, 3, '≥', 3], [1, 1, '≥', 2]], [3, 5], 'min'),
  lpQ('Ex 12.1', 'Q5', 'Maximise Z = 3x + 2y subject to x + 2y ≤ 10, 3x + y ≤ 15, x, y ≥ 0', [[1, 2, '≤', 10], [3, 1, '≤', 15]], [3, 2], 'max'),
  lpQ('Ex 12.1', 'Q6', 'Minimise Z = x + 2y subject to 2x + y ≥ 3, x + 2y ≥ 6, x, y ≥ 0. Show that the minimum of Z occurs at more than two points.', [[2, 1, '≥', 3], [1, 2, '≥', 6]], [1, 2], 'min'),
  lpQ('Ex 12.1', 'Q7', 'Minimise and maximise Z = 5x + 10y subject to x + 2y ≤ 120, x + y ≥ 60, x − 2y ≥ 0, x, y ≥ 0', [[1, 2, '≤', 120], [1, 1, '≥', 60], [1, -2, '≥', 0]], [5, 10], ['min', 'max']),
  lpQ('Ex 12.1', 'Q8', 'Minimise and maximise Z = x + 2y subject to x + 2y ≥ 100, 2x − y ≤ 0, 2x + y ≤ 200, x, y ≥ 0', [[1, 2, '≥', 100], [2, -1, '≤', 0], [2, 1, '≤', 200]], [1, 2], ['min', 'max']),
  lpQ('Ex 12.1', 'Q9', 'Maximise Z = −x + 2y subject to x ≥ 3, x + y ≥ 5, x + 2y ≥ 6, y ≥ 0', [[1, 0, '≥', 3], [1, 1, '≥', 5], [1, 2, '≥', 6]], [-1, 2], 'max'),
  lpQ('Ex 12.1', 'Q10', 'Maximise Z = x + y subject to x − y ≤ −1, −x + y ≤ 0, x, y ≥ 0', [[1, -1, '≤', -1], [-1, 1, '≤', 0]], [1, 1], 'max'),
];

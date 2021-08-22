'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  // Create an object of SudokuSolver.
  let sudoku = new SudokuSolver();
  // Handling the check request.
  app.route('/api/check')
    .post((req, res) => {
      // console.log(req.body);
      // Save the data the client sent to variables.
      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      // Check if there is any missing field.
      if (!puzzleString || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      // Check the validation of the submitted puzzle string input.
      const validate = sudoku.validate(puzzleString);
      if (validate.error) {
        return res.json(validate);
      }
      // Check the validation of the submitted value input.
      const regex_val = /^\d$/;
      if (!regex_val.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      // Check the validation of the submitted coordinate input.
      const regex_c = /^[abcdefghi]\d$/i;
      if (!regex_c.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

      // Check if there is any conflict of the submitted value in row, column or region placement.
      let result = { valid: true };
      let conflict = [];

      if (!sudoku.checkColPlacement(puzzleString, coordinate[0], coordinate[1], value)) {
        result.valid = false;
        conflict.push('column');
        result.conflict = conflict;
      }
      if (!sudoku.checkRowPlacement(puzzleString, coordinate[0], coordinate[1], value)) {
        result.valid = false;
        conflict.push('row');
        result.conflict = conflict;
      }
      if (!sudoku.checkRegionPlacement(puzzleString, coordinate[0], coordinate[1], value)) {
        result.valid = false;
        conflict.push('region');
        result.conflict = conflict;
      }
      res.json(result);
    });

  // Handling the solve request.
  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle;
      // Check if the submitted puzzle string input is misssing.
      if (!puzzleString) {
        return res.json({ error: 'Required field missing' });
      }
      // Check the validation of the submitted puzzle string.
      const validate = sudoku.validate(puzzleString);
      if (validate.error) {
        return res.json(validate);
      }
      // Solve the problem and send the solution if there is one, if not send an error message of 'Puzzle cannot be solved'.
      const solver = sudoku.solve(puzzleString);
      if (solver.result) {
        return res.json({ solution: solver.solution })
      } else {
        return res.json({ error: 'Puzzle cannot be solved' })
      }

    });
};

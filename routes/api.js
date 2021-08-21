'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let sudoku = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      // console.log(req.body);
      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      console.log('Check request:', req.body);
      if (!puzzleString || !coordinate || !value) {
        return res.json({ error: 'Required field(s) missing' });
      }
      const validate = sudoku.validate(puzzleString);
      if (validate.error) {
        return res.json(validate);
      }
      const regex_val = /^\d$/;
      if (!regex_val.test(value)) {
        return res.json({ error: 'Invalid value' });
      }
      const regex_c = /^[abcdefghi]\d$/i;
      if (!regex_c.test(coordinate)) {
        return res.json({ error: 'Invalid coordinate' });
      }

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

  app.route('/api/solve')
    .post((req, res) => {
      let puzzleString = req.body.puzzle;
      if (!puzzleString) {
        return res.json({ error: 'Required field missing' });
      }
      const validate = sudoku.validate(puzzleString);
      if (validate.error) {
        return res.json(validate);
      }
      const solver = sudoku.solve(puzzleString);
      if (solver.result) {
        return res.json({ solution: solver.solution })
      } else {
        return res.json({ error: 'Puzzle cannot be solved' })
      }

    });
};

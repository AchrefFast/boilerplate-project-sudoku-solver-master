// import { puzzlesAndSolutions } from './puzzle-strings';
// const pas = puzzlesAndSolutions;

class SudokuSolver {


  validate(puzzleString) {
    const regex = /[^.\d]/;
    //console.log('given puzzle string length: ', puzzleString.length);
    if (puzzleString.length == 81) {
      if (regex.test(puzzleString)) {
        return { error: 'Invalid characters in puzzle' };
      }
      else return { error: false };
    }
    else return { error: 'Expected puzzle to be 81 characters long' };

  }
  // ------------------------------------------ Checking ----------------------------------------//

  checkRowPlacement(puzzleString, row, column, value) {
    // Check if the given puzzleString is valid or not.
    if (!this.validate(puzzleString)) {
      //console.log('Invalid puzzle string');
      return false;
    }
    let rows = [];
    // make a copy of the puzzleString.
    let pzst = puzzleString;
    // this index variable will be used to devide the puzzleString into 9 rows.
    let index = 0;
    // Split the puzzleString into 9 rows and save them inside the array "rows"..
    for (let i = 0; i < 9; i++) {
      rows.push(pzst.slice(index, (index + 9)))
      index = index + 9;
    }
    //console.log(rows);
    // Convert the given column coordinate into a number. (A-I) to (1-9)
    let c = this.colToNum(row);
    // The checkRow fails if the given column coordinate isn't right. It should be one of these characters 'abcdefghi'.
    const regex = /^\d$/;
    if (c == 0 || !regex.test(column)) {
      //console.log("Invalid coordinates");
      return false;
    }
    else {
      // Check what is in the given coordinates.
      let curr_row = rows[c - 1];
      curr_row = curr_row.split('');
      curr_row[column - 1] = '.';
      let cell = curr_row[column - 1];
      //console.log(cell);
      // If a number is already exist in the given placement the checkRowPlacement function fails.
      if (cell != '.') {
        //console.log('There is a conflict with another number');
        return false;
      }
      else {
        // console.log(curr_row);
        // console.log(value);
        // If the provided number doesn't exist in the given row then the placement of that number is valid.
        if (curr_row.indexOf('' + value) < 0) {
          //console.log(value, 'Valid Placement in row');
          return true;
        }
        // The the provided number already exist in the given row checkRowPlacement fails.
        else {
          //console.log(value, 'Invalid Placement in row');
          return false;

        }
      }
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    let columns = [];
    let index = 0;
    let col = '';
    let pzls = puzzleString;
    // Check if the given puzzleString is valid or not.
    if (this.validate(puzzleString).error) {
      //console.log('Invalid puzzle string');
      return false;
    }

    for (let i = 0; i < 9; i++) {
      index = i;
      for (let j = 0; j < 9; j++) {
        col = col.concat(pzls[index]);
        index += 9;
      }
      columns.push(col);
      col = '';
    }
    //console.log(columns);
    let c = this.colToNum(row);
    const regex = /^\d$/;
    if (c == 0 || !regex.test(column)) {
      //console.log("Invalid coordinates");
      return false;
    }
    let curr_column = columns[column - 1];
    curr_column = curr_column.split('');
    curr_column[c - 1] = '.';
    const cell = curr_column[c - 1];
    if (cell != '.') {
      //console.log('Conflict with another number');
      return false;
    }
    else {
      if (curr_column.indexOf('' + value) < 0) {
        //console.log(value, 'Valid Placement in column');
        return true;
      }
      else {
        //console.log(value, 'Invalid placement in column');
        return false;
      }
    }

  }

  checkRegionPlacement(puzzleString, row, column, value) {

    let regions = [];
    let pzst = puzzleString;
    let grid = '';
    let grid_row = '';
    let index = 0;
    if (this.validate(puzzleString).error) {
      //console.log('Invalid Input');
      return false;
    }
    let next = 3;
    for (let i = 0; i < 81; i = i + next) {
      index = i;
      for (let j = 0; j < 3; j++) {
        grid_row = pzst.slice(index, index + 3);
        grid = grid.concat(grid_row);
        index += 9;
      }
      regions.push(grid);
      grid = '';
      if ((i + 3) % 9 == 0) {
        next = 21;
      } else { next = 3; }

    }
    // console.log(regions);
    let c = this.colToNum(row);

    const regex = /^\d$/;
    if (c == 0 || !regex.test(column)) {
      //console.log('Invalid coordinates');
      return false;
    }

    let region = -1;
    if (c < 4) {
      if (column < 4) {
        region = 0;
      } else if (column > 3 && column < 7) {
        region = 1;
      } else if (column > 6) {
        region = 2;
      }
    } else if (c > 3 && c < 7) {
      if (column < 4) {
        region = 3;
      } else if (column > 3 && column < 7) {
        region = 4;
      } else if (column > 6) {
        region = 5;
      }
    } else if (c > 6) {
      if (column < 4) {
        region = 6;
      } else if (column > 3 && column < 7) {
        region = 7;
      } else if (column > 6) {
        region = 8;
      }
    }
    let c_column = (column - 1) % 3;
    let c_row = (c - 1) % 3;
    let curr_region = regions[region];
    let pr_region = [];
    let ar_region = [];

    for (let i = 0; i < 10; i++) {
      if (i % 3 == 0 && i != 0) {
        ar_region.push(pr_region);
        pr_region = [];
      }
      pr_region[i % 3] = curr_region[i];
    }

    // console.log(curr_region);
    ar_region[c_row][c_column] = '.'
    // console.log('array of grid 3x3', ar_region);
    for (let i = 0; i < 3; i++) {
      if (ar_region[i].indexOf('' + value) >= 0) {
        //console.log(value, 'Valid placement in region');
        return false;
      }
    }
    return true;
  }


  solve(puzzleString) {
    if (this.validate(puzzleString).error) {
      return { result: false }
    }
    let pString = puzzleString.split('');
    const result = this.solver(pString, 1);
    // console.log(pString.join(''));
    //console.log(result);
    return { result: result, solution: pString.join('') };
  }



  solver(pString, i) {

    if (i == 82) {
      return true;
    }

    let str = pString.join('');
    let row = 0;
    let column = 0;
    // console.log('i = ', i);
    (i % 9) == 0 ? row = Math.floor(i / 9) : row = Math.floor((i / 9) + 1);
    //console.log('Row = ', row);
    (i % 9) == 0 ? column = 9 : column = (i % 9);
    row = String.fromCharCode(row + 96);
    //console.log('Column = ', column);

    if (pString[i - 1] != '.') {
      return this.solver(pString, i + 1);
    }

    for (let num = 1; num < 10; num++) {
      if (this.checkColPlacement(str, row, column, num) && this.checkRegionPlacement(str, row, column, num) && this.checkRowPlacement(str, row, column, num)) {
        //console.log('cool to go');
        pString[i - 1] = '' + num;

        if (this.solver(pString, i + 1)) {
          return true;
        }
      }
      pString[i - 1] = '.'

    }
    return false;

  }

  colToNum(column) {
    column = '' + column;

    switch (column.toLowerCase()) {
      case 'a': return 1;
      case 'b': return 2;
      case 'c': return 3;
      case 'd': return 4;
      case 'e': return 5;
      case 'f': return 6;
      case 'g': return 7;
      case 'h': return 8;
      case 'i': return 9;
      default: return 0;
    }
  }
}

module.exports = SudokuSolver;
// For test purposes
// const input = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
// const solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
// const sudoku = new SudokuSolver();
// // console.log(sudoku.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'));
// // sudoku.checkRowPlacement(input, 4, 'd', 1);
// // sudoku.checkColPlacement(input, 4, 'd', 1);
// // sudoku.checkRegionPlacement(input, 4, 'd', 1);
// console.log(sudoku.solve(input).solution);
// console.log(input);
// console.log(solution);


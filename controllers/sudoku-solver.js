// import { puzzlesAndSolutions } from './puzzle-strings';
// const pas = puzzlesAndSolutions;

class SudokuSolver {


  validate(puzzleString) {
    const regex = /[^.\d]/;
    //console.log('given puzzle string length: ', puzzleString.length);
    // Check if the puzzle string is 81 characters length
    if (puzzleString.length == 81) {
      // Check if there is any invalid character in the puzzle string.
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
    // this index variable will be used to divide the puzzleString into 9 rows.
    let index = 0;
    // Split the puzzleString into 9 rows and save them inside the "rows" array.
    for (let i = 0; i < 9; i++) {
      rows.push(pzst.slice(index, (index + 9)))
      index = index + 9;
    }
    //console.log(rows);

    // Convert the given row coordinate into a number. (A-I) to (1-9)
    let c = this.colToNum(row);
    // Check the validity of the coordinates.
    const regex = /^\d$/;
    if (c == 0 || !regex.test(column)) {
      //console.log("Invalid coordinates");
      return false;
    }
    else {
      // We select the specific row from "rows" array using "row" coordiante.
      let curr_row = rows[c - 1];
      // We convert the selected row string into an array of characters, so that we can access and change any character in the row.
      curr_row = curr_row.split('');
      // To be able to check the validation of a value in a row placement, we need first to empty the cell we're checking.
      // If we try to check the validation of a number in a specific place in a row and that number already exists in that cell then the result will always be a conflict. that is why we need to empty the cell we're checking first.
      curr_row[column - 1] = '.';
      let cell = curr_row[column - 1];
      //console.log(cell);
      // This block isn't necessary.
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
    // To be able to access and check the validation of a number a specific column, we need first to divide the puzzle string input to 9 columns.
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
    // Convert the row input from (A-I) to (1-9).
    let c = this.colToNum(row);
    // Check the validation of the provided coordinate input.
    const regex = /^\d$/;
    if (c == 0 || !regex.test(column)) {
      //console.log("Invalid coordinates");
      return false;
    }
    // Select the column that we're going to check using the provided column coordinate.
    let curr_column = columns[column - 1];
    // Convert the selected column string to an array.
    curr_column = curr_column.split('');
    // To be able to check the validation of a value in a column placement, we need first to empty the cell we're checking.
    // If we try to check the validation of a number in a specific place in a column and that number already exists in that cell then the result will always be a conflict. that is why we need to empty the cell we're checking first.
    curr_column[c - 1] = '.';

    // This block isn't necessary.
    const cell = curr_column[c - 1];
    if (cell != '.') {
      //console.log('Conflict with another number');
      return false;
    }
    else {
      // If the provided number doesn't exist in the provided column then the placement of that number is valid.
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

    // Check the validation of the sumbitted puzzle string.
    if (this.validate(puzzleString).error) {
      //console.log('Invalid Input');
      return false;
    }
    // To be able to check the validation of a number in a grid(3x3) placement, we need first to divide the puzzle string into 9 (3x3) grids and put them in an array.
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
    // Convert the row coordinate from (A-I) to (1-9).
    let c = this.colToNum(row);
    // Check the validation of the coordinate.
    const regex = /^\d$/;
    if (c == 0 || !regex.test(column)) {
      //console.log('Invalid coordinates');
      return false;
    }
    // Decide which region or grid we're using to check the validation of a region placement based on row and column coordinates.

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
    // Select the region or grid we're checking. 
    let c_column = (column - 1) % 3;
    let c_row = (c - 1) % 3;
    let curr_region = regions[region];
    let pr_region = [];
    let ar_region = [];
    // To be able to specify which cell we're working on, we're going to convert the selected region into an array of three rows and columns.
    for (let i = 0; i < 10; i++) {
      if (i % 3 == 0 && i != 0) {
        ar_region.push(pr_region);
        pr_region = [];
      }
      pr_region[i % 3] = curr_region[i];
    }
    // console.log(curr_region);

    // To make it possible to select the spicfic cell using row and column, we convert them from 1-9 to 1-3 using this formula: "new_coordinate = (row||column) % 3"
    // We empty the selected cell to get a right result when checking the placement.
    ar_region[c_row][c_column] = '.'
    // console.log('array of grid 3x3', ar_region);

    // If the provided number doesn't exist in the selected region then the placement of that number is valid.
    for (let i = 0; i < 3; i++) {
      if (ar_region[i].indexOf('' + value) >= 0) {
        //console.log(value, 'Valid placement in region');
        return false;
      }
    }
    return true;
  }

  // -------------------------------------------------- Solver ------------------------------------------------//


  solve(puzzleString) {
    // Check the validation of the given puzzle string.
    if (this.validate(puzzleString).error) {
      return { result: false }
    }
    // Convert the puzzle string into an array so that can be used in the solver function.
    let pString = puzzleString.split('');
    const result = this.solver(pString, 1);
    // console.log(pString.join(''));
    //console.log(result);
    return { result: result, solution: pString.join('') };
  }


  // For more information check: https://www.geeksforgeeks.org/sudoku-backtracking-7/.
  solver(pString, i) {
    // The base case for the recursive function.(if we reach the end of the puzzle).
    if (i == 82) {
      return true;
    }
    // We convert the puzzle array into a string so that we can pass the puzzle to the check functions. (the check functions accept string puzzle).
    let str = pString.join('');
    let row = 0;
    let column = 0;
    // console.log('i = ', i);
    // Calculating the current row and column coordinates using the index of the current cell in the puzzle( i: is the current cell number in the grid 9x9);
    (i % 9) == 0 ? row = Math.floor(i / 9) : row = Math.floor((i / 9) + 1);
    //console.log('Row = ', row);
    (i % 9) == 0 ? column = 9 : column = (i % 9);
    // Convert row from 1-9 to A-I(so that row will be accepted in check functions)
    row = String.fromCharCode(row + 96);
    //console.log('Column = ', column);

    // If there is a number in the current cell then jump to the next one 
    if (pString[i - 1] != '.') {
      return this.solver(pString, i + 1);
    }
    // If the current cell is empty try to find the appropriate number in this cell by trying all the possibility from 1 to 9.
    for (let num = 1; num < 10; num++) {
      // If the current number (num) we're checking pass the check row, column and region function then we assign it the current cell.
      if (this.checkColPlacement(str, row, column, num) && this.checkRegionPlacement(str, row, column, num) && this.checkRowPlacement(str, row, column, num)) {
        //console.log('cool to go');
        pString[i - 1] = '' + num;
        // If we find the appropriate number, we jump to the next cell.
        if (this.solver(pString, i + 1)) {
          return true;
        }
      }
      // Using the recursive function if all the next cells find the appropriate number, the solver function will return true.
      // if the next cell can't find any correct number from 1 to 9 that can pass the check functions then we have to try another number in the current cell and do the same work again.
      pString[i - 1] = '.'

    }
    // If none of the number we tried pass the check functions or lead to a solution for the next cells then the test fails and the function return false.
    return false;

  }

  // This function will transform the alphabet from (A-I) to (1-9)
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
// Export the module
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


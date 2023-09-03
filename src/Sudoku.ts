import { BOX_SIZE, GRID_SIZE } from "./constant";
import { IDuplicateValue, IGrid } from "./types";
import { findEmptyCell } from "./utils/findEmptyCell";
import { generateSudoku } from "./utils/generateSudoku";
console.log(generateSudoku);
export class Sudoku {
  public _grid: IGrid;

  public constructor() {
    this._grid = generateSudoku();
  }

  public getDuplicatePositions = (
    row: number,
    column: number,
    value: number | null
  ): IDuplicateValue[] => {
    const duplicatesInColumn = this.getDuplicatePositionsInColumn(
      row,
      column,
      value
    );
    const duplicatesInRow = this.getDuplicatePositionsInRow(row, column, value);
    const duplicatesInBox = this.getDuplicatePositionsInBox(row, column, value);

    // Need not to be duplication in box
    const duplicates = [...duplicatesInColumn, ...duplicatesInRow];

    for (let i = 0; i < duplicatesInBox.length; i++) {
      if (
        duplicatesInBox[i].row !== row &&
        duplicatesInBox[i].column !== column
      ) {
        duplicates.push(duplicatesInBox[i]);
      }
    }

    return duplicates;
  };

  public getDuplicatePositionsInColumn = (
    row: number,
    column: number,
    value: number | null
  ): IDuplicateValue[] => {
    const duplicates: IDuplicateValue[] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      if (this._grid[i][column] === value && i !== row) {
        duplicates.push({ row: i, column: column });
      }
    }

    return duplicates;
  };

  public getDuplicatePositionsInRow = (
    row: number,
    column: number,
    value: number | null
  ): IDuplicateValue[] => {
    const duplicates: IDuplicateValue[] = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      if (this._grid[row][i] === value && i !== column) {
        duplicates.push({ row: row, column: i });
      }
    }

    return duplicates;
  };

  public getDuplicatePositionsInBox = (
    row: number,
    column: number,
    value: number | null
  ): IDuplicateValue[] => {
    const duplicates: IDuplicateValue[] = [];
    const firstRowInBox = row - (row % BOX_SIZE);
    const firstColumnInBox = column - (column % BOX_SIZE);

    for (let i = firstRowInBox; i < firstRowInBox + BOX_SIZE; i++) {
      for (let j = firstColumnInBox; j < firstColumnInBox + BOX_SIZE; j++) {
        if (this._grid[i][j] === value && i !== row && j !== column) {
          duplicates.push({
            row: i,
            column: j,
          });
        }
      }
    }

    return duplicates;
  };

  public hasEmptyCells = (): boolean => {
    return Boolean(findEmptyCell(this._grid));
  };
}

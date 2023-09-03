import { IGrid } from "../types";
import { GRID_SIZE, BOX_SIZE } from "../constant";

export function validateColumn(
  grid: IGrid,
  row: number,
  column: number,
  value: number | null
): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[i][column] === value && i !== row) {
      return false;
    }
  }

  return true;
}

export function validateRow(
  grid: IGrid,
  row: number,
  column: number,
  value: number | null
): boolean {
  for (let i = 0; i < GRID_SIZE; i++) {
    if (grid[row][i] === value && i !== column) {
      return false;
    }
  }

  return true;
}

export function validateBox(
  grid: IGrid,
  row: number,
  column: number,
  value: number | null
) {
  const firstRowInBox = row - (row % BOX_SIZE);
  const firstColumnInBox = column - (column % BOX_SIZE);

  for (let i = firstRowInBox; i < firstRowInBox; i++) {
    for (let j = firstColumnInBox; j < firstColumnInBox; j++) {
      if (grid[i][j] === value && i !== row && j !== column) {
        return false;
      }
    }
  }

  return true;
}

export const validators = {
  validateRow: validateRow,
  validateColumn: validateColumn,
  validateBox: validateBox,
};

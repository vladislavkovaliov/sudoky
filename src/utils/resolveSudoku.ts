import { IGrid } from "../types";
import { findEmptyCell } from "./findEmptyCell";
import { getRandomNumbers } from "./getRandomNumbers";
import { validators } from "./validators";

export function resolveSudoku(grid: IGrid) {
  const emptyCell = findEmptyCell(grid);

  if (!emptyCell) {
    return true;
  }

  const numbers = getRandomNumbers();

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    // console.log(numbers);
  }

  for (let i = 0; i < numbers.length; i++) {
    if (!validate(grid, emptyCell.row, emptyCell.column, numbers[i])) {
      continue;
    }

    grid[emptyCell.row][emptyCell.column] = numbers[i];

    if (resolveSudoku(grid)) {
      return true;
    }

    grid[emptyCell.row][emptyCell.column] = null;
  }
}

export function validate(
  grid: IGrid,
  row: number,
  column: number,
  value: number | null
): boolean {
  return (
    validators.validateColumn(grid, row, column, value) &&
    validators.validateRow(grid, row, column, value) &&
    validators.validateBox(grid, row, column, value)
  );
}

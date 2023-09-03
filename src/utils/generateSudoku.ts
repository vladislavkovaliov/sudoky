import { GRID_SIZE } from "../constant";
import { resolveSudoku } from "./resolveSudoku";
import { removeCells } from "./removeCells";
import { IGrid } from "../types";

export function generateSudoku(): IGrid {
  const sudoku = generateEmptyGrid();

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    console.table(sudoku);
  }

  resolveSudoku(sudoku);

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    console.table(sudoku);
  }

  return removeCells(sudoku);
}

export function generateEmptyGrid(): IGrid {
  return new Array(GRID_SIZE)
    .fill(null)
    .map(() => new Array(GRID_SIZE).fill(null));
}

import { GRID_SIZE, DEFAULT_DIFFICULTY } from "../constant";
import { resolveSudoku } from "./resolveSudoku";
import { removeCells } from "./removeCells";
import { IGrid } from "../types";

export function generateSudoku(difficulty: number = DEFAULT_DIFFICULTY): IGrid {
  const sudoku = generateEmptyGrid();

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    console.table(sudoku);
  }

  resolveSudoku(sudoku);

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    console.table(sudoku);
  }

  return removeCells(sudoku, difficulty);
}

export function generateEmptyGrid(): IGrid {
  return new Array(GRID_SIZE)
    .fill(null)
    .map(() => new Array(GRID_SIZE).fill(null));
}

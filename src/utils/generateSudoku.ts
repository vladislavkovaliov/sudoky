import { GRID_SIZE } from "../constant";
import { resolveSudoku } from "./resolveSudoku";

export function generateSudoku(): void {
  const sudoku = generateEmptyGrid();

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    console.table(sudoku);
  }

  resolveSudoku(sudoku);

  console.table(sudoku);
}

export function generateEmptyGrid() {
  return new Array(GRID_SIZE)
    .fill(null)
    .map(() => new Array(GRID_SIZE).fill(null));
}

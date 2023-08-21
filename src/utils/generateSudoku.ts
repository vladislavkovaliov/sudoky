import { GRID_SIZE } from "../constant";

export function generateSudoku() {
  const sudoku = generateEmptyGrid();

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    console.table(sudoku);
  }
}

export function generateEmptyGrid() {
  return new Array(GRID_SIZE)
    .fill(null)
    .map(() => new Array(GRID_SIZE).fill(null));
}

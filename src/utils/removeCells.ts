import { GRID_SIZE, DEFAULT_DIFFICULTY } from "../constant";
import { IGrid } from "../types";

export function removeCells(
  grid: IGrid,
  difficulty: number = DEFAULT_DIFFICULTY
): IGrid {
  const resultGrid = [...grid].map((x) => [...x]);

  let i = 0;

  // We remove DIFFICULTY count of cells and return a new grid.
  while (i < difficulty) {
    const row = Math.floor(Math.random() * GRID_SIZE);
    const column = Math.floor(Math.random() * GRID_SIZE);
    //console.log(grid, row, column);
    if (resultGrid[row][column] !== null) {
      resultGrid[row][column] = null;

      i = i + 1;
    }
  }

  if (import.meta.env.VITE_DEBUG_MODE === "true") {
    //console.table(resultGrid);
  }

  return resultGrid;
}

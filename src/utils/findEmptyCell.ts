import { GRID_SIZE } from "../constant";
import { IGrid } from "../types";

export type ReturnFindEmptyCell = {
  row: number;
  column: number;
};

export function findEmptyCell(grid: IGrid): ReturnFindEmptyCell | null {
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === null) {
        return { row: i, column: j };
      }
    }
  }

  return null;
}

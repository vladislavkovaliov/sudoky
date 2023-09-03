import { GRID_SIZE } from "../constant";

export function convertIndexToPosition(index: number) {
  return {
    row: Math.floor(index / GRID_SIZE),
    column: index % GRID_SIZE,
  };
}

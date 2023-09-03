import { GRID_SIZE } from "../constant";

export function convertPositionToIndex(row: number, column: number) {
  return row * GRID_SIZE + column;
}

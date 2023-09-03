import { GRID_SIZE, FILLED_CLASSNAME, EMPTY_STRING } from "../constant";
import { Sudoku } from "../Sudoku";
import { convertIndexToPosition } from "./convertIndexToPosition";

export function fillCells(sudoku: Sudoku, cells: NodeListOf<Element>) {
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const { row, column } = convertIndexToPosition(i);

    if (sudoku._grid[row][column] !== null) {
      cells[i].classList.add(FILLED_CLASSNAME);
      cells[i].textContent =
        sudoku._grid[row][column]?.toString() ?? EMPTY_STRING;
    }
  }
}

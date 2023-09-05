import { Sudoku } from "./Sudoku";
import { fillCells } from "./utils/fillCells";
import { convertPositionToIndex } from "./utils/convertPositionToIndex";
import {
  FILLED_CLASSNAME,
  GRID_SIZE,
  SELECTED_CLASSNAME,
  HIGHLIGHT_CLASSNAME,
  EMPTY_STRING,
  ERROR_CLASSNAME,
  ZOOM_CLASSNAME,
} from "./constant";
import { IDuplicateValue, IState } from "./types";

import "./style.css";
import { convertIndexToPosition } from "./utils/convertIndexToPosition";
import { getEmptyArray } from "./utils/getEmptyArray";

// TODO: don't show error if user clicks on already filled cell

if (import.meta.env.VITE_DEBUG_MODE === "true") {
  //console.log(import.meta.env);
}

if (import.meta.env.VITE_DEBUG_MODE === "true") {
  //console.table(sudoky._grid);
}

const state: IState = {
  selectedCellIndex: -1,
  selectedCell: null,
  cells: [],
  sudoku: null,
};

export function main() {
  const sudoku = new Sudoku();
  const cells = getCellsFromDOM();

  state.cells = cells;
  state.sudoku = sudoku;

  fillCells(sudoku, state.cells);

  initCellsEvents(state.cells);
  initNumbersEvents();
}

export function removeClassname(cells: NodeListOf<Element> | never[]) {
  cells.forEach((x) =>
    x.classList.remove(SELECTED_CLASSNAME, HIGHLIGHT_CLASSNAME, ERROR_CLASSNAME)
  );
}

export function handleCellClick(cell: Element, idx: number) {
  if (cell.classList.contains(FILLED_CLASSNAME)) {
    state.selectedCell = null;
    state.selectedCellIndex = -1;
  } else {
    state.selectedCellIndex = idx;
    state.selectedCell = cell;

    cell.classList.add(SELECTED_CLASSNAME);

    const column: number[] = getColumnByIndex(idx);

    column.forEach((x) => state.cells[x].classList.add(HIGHLIGHT_CLASSNAME));

    const row: number[] = getRowByIndex(idx);

    row.forEach((x) => state.cells[x].classList.add(HIGHLIGHT_CLASSNAME));
  }

  if (cell.textContent === EMPTY_STRING) {
    return;
  }

  state.cells.forEach((x) => {
    if (x.textContent?.toString() === cell.textContent?.toString()) {
      x.classList.add(SELECTED_CLASSNAME);
    }
  });
}

export function handleNumberClick(value: number) {
  if (!state.selectedCell) {
    return;
  }

  if (
    state.selectedCell &&
    state.selectedCell.classList.contains(FILLED_CLASSNAME)
  ) {
    return;
  }

  state.cells.forEach((cell) =>
    cell.classList.remove(ERROR_CLASSNAME, ZOOM_CLASSNAME)
  );
  state.selectedCell.classList.add(SELECTED_CLASSNAME);

  setValueInSelectedCell(value, state.selectedCellIndex);

  console.log(value);
}

export function setValueInSelectedCell(value: number, selectedIndex: number) {
  const { row, column } = convertIndexToPosition(selectedIndex);

  const dupsPositions = state.sudoku?.getDuplicatePositions(row, column, value);

  if (dupsPositions?.length) {
    highlightDuplicates(dupsPositions);
    return;
  }

  if (state.sudoku) {
    state.sudoku._grid[row][column] = value;
  }

  if (state.selectedCell) {
    state.selectedCell.textContent = value.toString();
  }

  if (state.sudoku && state.selectedCell) {
    setTimeout(() => {
      state.selectedCell?.classList.add(ZOOM_CLASSNAME);
    }, 0);
  }
}

export function highlightDuplicates(dups: IDuplicateValue[]) {
  dups.forEach(({ row, column }) => {
    const index = convertPositionToIndex(row, column);

    setTimeout(() => {
      state.cells[index].classList.add(ERROR_CLASSNAME, ZOOM_CLASSNAME);
    }, 0);
  });
}

export function getColumnByIndex(index: number) {
  const column = index % GRID_SIZE;

  return getEmptyArray(GRID_SIZE).map((_, i) =>
    convertPositionToIndex(i, column)
  );
}

export function getRowByIndex(index: number) {
  const row = Math.floor(index / GRID_SIZE);

  return getEmptyArray(GRID_SIZE).map((_, i) => convertPositionToIndex(row, i));
}

export function initCellsEvents(cells: NodeListOf<Element> | never[]) {
  cells.forEach((cell, index) =>
    cell.addEventListener("click", () => {
      removeClassname(cells);
      handleCellClick(cell, index);
    })
  );
}

export function initNumbersEvents() {
  const numbers = document.querySelectorAll(".number")!;

  numbers.forEach((x) =>
    x.addEventListener("click", () => handleNumberClick(Number(x.textContent)))
  );
}

export function getCellsFromDOM(): NodeListOf<Element> {
  const cells = document.querySelectorAll(".cell")!;

  return cells;
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

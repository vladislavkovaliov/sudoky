import { Sudoku } from "./Sudoku";
import { fillCells } from "./utils/fillCells";
import { convertPositionToIndex } from "./utils/convertPositionToIndex";
import {
  FILLED_CLASSNAME,
  GRID_SIZE,
  SELECTED_CLASSNAME,
  HIGHLIGHT_CLASSNAME,
  EMPTY_STRING,
} from "./constant";
import { IState } from "./types";

import "./style.css";

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
};

export function main() {
  const sudoku = new Sudoku();
  const cells = getCellsFromDOM();

  state.cells = cells;

  fillCells(sudoku, state.cells);
  initCellsEvents(state.cells);
}

export function removeClassname(cells: NodeListOf<Element> | never[]) {
  cells.forEach((x) =>
    x.classList.remove(SELECTED_CLASSNAME, HIGHLIGHT_CLASSNAME)
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

export function getColumnByIndex(index: number) {
  const column = index % GRID_SIZE;

  return new Array(GRID_SIZE)
    .fill(0)
    .map((_, i) => convertPositionToIndex(i, column));
}

export function getRowByIndex(index: number) {
  const row = Math.floor(index / GRID_SIZE);

  return new Array(GRID_SIZE)
    .fill(0)
    .map((_, i) => convertPositionToIndex(row, i));
}

export function initCellsEvents(cells: NodeListOf<Element> | never[]) {
  cells.forEach((cell, index) =>
    cell.addEventListener("click", () => {
      removeClassname(cells);
      handleCellClick(cell, index);
    })
  );
}

export function getCellsFromDOM(): NodeListOf<Element> {
  const cells = document.querySelectorAll(".cell")!;

  return cells;
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

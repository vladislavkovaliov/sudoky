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
  DEFAULT_DIFFICULTY,
} from "./constant";
import { IDuplicateValue, IState } from "./types";

import "./style.css";
import { convertIndexToPosition } from "./utils/convertIndexToPosition";
import { getEmptyArray } from "./utils/getEmptyArray";
import { getDifficultyFromUrlAndFlush } from "./utils/getDifficultyFromUrlAndFlush";

import { EventEmitter } from "./core/EventEmitter";

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
  isDifficultSelected: false,
};

export function preMain() {
  const eventEmitter = new EventEmitter();

  window.eventEmitter = eventEmitter;

  initDifficultSelection();
}

export function main(difficult: number = DEFAULT_DIFFICULTY) {
  const hasParam =
    new URL(window.location.href).searchParams.get("diff") ?? null;
  const diff = hasParam ? getDifficultyFromUrlAndFlush("diff") : difficult;

  const sudoku = new Sudoku(diff);
  const cells = getCellsFromDOM();

  state.cells = cells;
  state.sudoku = sudoku;

  fillCells(sudoku, state.cells);

  initCellsEvents(state.cells);
  initNumbersEvents();

  const header = document.querySelector(".header")!;
  const content = document.querySelector(".content")!;
  const footer = document.querySelector(".footer")!;

  [header, content, footer].forEach((x) => x.classList.remove("hide"));

  const popup = document.querySelector(".popup")!;
  popup.classList.add("hide");
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

export function handleWinnerAnimation() {
  state.cells.forEach((cell) =>
    cell.classList.remove(
      ERROR_CLASSNAME,
      ZOOM_CLASSNAME,
      HIGHLIGHT_CLASSNAME,
      FILLED_CLASSNAME,
      SELECTED_CLASSNAME
    )
  );

  function backtrace(
    cells: NodeListOf<Element> | [],
    row: number,
    column: number,
    delay: number,
    globalRow: number,
    globalColumn: number,
    classNames: string[]
  ) {
    if (row > GRID_SIZE || column > GRID_SIZE) {
      return;
    }

    if (row < 0 || column < 0) {
      return;
    }

    const index = convertPositionToIndex(row, column);

    if (index >= GRID_SIZE * GRID_SIZE) {
      return;
    }

    setTimeout(() => {
      cells[index].classList.remove(HIGHLIGHT_CLASSNAME, ERROR_CLASSNAME);

      cells[index].classList.add(...classNames);
    }, delay * 150);

    if (row > globalRow - 1) {
      backtrace(
        cells,
        row + 1,
        column,
        delay + 1,
        globalRow,
        globalColumn,
        classNames
      );
    }

    if (row < globalRow + 1) {
      backtrace(
        cells,
        row - 1,
        column,
        delay + 1,
        globalRow,
        globalColumn,
        classNames
      );
    }

    if (column > globalColumn - 1) {
      backtrace(
        cells,
        row,
        column + 1,
        delay + 1,
        globalRow,
        globalColumn,
        classNames
      );
    }

    if (column < globalColumn + 1) {
      backtrace(
        cells,
        row,
        column - 1,
        delay + 1,
        globalRow,
        globalColumn,
        classNames
      );
    }
  }
  // TODO: store last index of last filled cell
  backtrace(state.cells, 4, 4, 1, 4, 4, [HIGHLIGHT_CLASSNAME, ZOOM_CLASSNAME]);

  setTimeout(() => {
    backtrace(state.cells, 4, 4, 1, 4, 4, [ZOOM_CLASSNAME]);
  }, 150 * 3);
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

  // procceed win case
  if (state.sudoku?.hasEmptyCells() === false) {
    setTimeout(() => {
      handleWinnerAnimation();
    }, 500);
  }
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
    // Need to update local storage
    const VALUE_WEIGHT = 45;

    window.eventEmitter.emit("score", value * VALUE_WEIGHT);
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

export function initDifficultSelection() {
  const difficultElements = document.querySelectorAll(".popup-item") ?? [];

  difficultElements.forEach((element) => {
    element.addEventListener(
      "click",
      (event: Event) => {
        const target = event.target as HTMLElement;
        const difficult = Number(target.dataset["value"]);

        window.eventEmitter.emit("difficult", difficult);

        main(difficult);
      },
      false
    );
  });
}

preMain();

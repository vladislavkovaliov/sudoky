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
import { IDuplicateValue, IState, IScore } from "./types";

import "./style.css";
import { convertIndexToPosition } from "./utils/convertIndexToPosition";
import { getEmptyArray } from "./utils/getEmptyArray";
import { getDifficultyFromUrlAndFlush } from "./utils/getDifficultyFromUrlAndFlush";
import { convertHumanTimeToSeconds } from "./utils/convertHumanTimeToSeconds";

import { EventEmitter } from "./core/EventEmitter";

import { Drawer } from "./Drawer";

import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import {
  getDocs,
  query,
  addDoc,
  collection,
  getFirestore,
  Firestore,
} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC4USY35f2sy8ea54uMFavGhQVrYjMKOL0",
  authDomain: "sudoky-47d5d.firebaseapp.com",
  projectId: "sudoky-47d5d",
  storageBucket: "sudoky-47d5d.appspot.com",
  messagingSenderId: "1034159942531",
  appId: "1:1034159942531:web:3d837d2dbabf6d7b3924b6",
  measurementId: "G-8VQQT16LHX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore();

/**
 * Request to firebase to get list of scores
 * for displaying in top 10 player drawer.
 * */
export async function getScores() {
  try {
    const queryScores = query(collection(firestore, "end"));

    const snapshot = await getDocs(queryScores);
    const scores: IScore[] = [];

    snapshot.forEach((snap) => {
      scores.push(snap.data() as IScore);
    });

    return scores
      .sort(({ totalSeconds: x }, { totalSeconds: y }) => Math.sign(x - y))
      .slice(0, 10);
  } catch (e) {
    console.error(e);
  }
}

getScores();

/**
 * The function to send into firebase storage data
 * regarding passed collection name
 * and event name and custom payload.
 * */
export async function sendEvent(
  firestore: Firestore,
  collectionName: string,
  eventName: string,
  payload: Record<string, any>
) {
  const col = collection(firestore, collectionName);

  const data = {
    eventName: eventName,
    ...payload,
  };

  try {
    await addDoc(col, data);
  } catch (e) {
    console.log(e);
  }
}

const state: IState = {
  selectedCellIndex: -1,
  selectedCell: null,
  cells: [],
  sudoku: null,
  isDifficultSelected: false,
  score: 0,
  difficult: 0,
};

export function preMain() {
  const eventEmitter = new EventEmitter();

  window.eventEmitter = eventEmitter;

  register();
  initDifficultSelection();

  const reffer = document.referrer;

  logEvent(analytics, "reffer", { reffer: reffer });
  sendEvent(firestore, "events", "reffer", { reffer: reffer });
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

  const drawer = new Drawer();

  drawer.init();

  window.eventEmitter.on("score-click", async () => {
    try {
      const scores = (await getScores()) ?? [];

      drawer.onDrawerShow({ scores });
    } catch (e) {
      console.error(e);
    }
  });

  const header = document.querySelector(".header")!;
  const content = document.querySelector(".content")!;
  const footer = document.querySelector(".footer")!;

  [header, content, footer].forEach((x: Element) =>
    x.classList?.remove("hide")
  );

  const popup = document.querySelector(".popup");

  if (popup) {
    popup.classList.add("hide");
  }

  sendEvent(firestore, "start", "start_game", { difficult: state.difficult });

  window.eventEmitter.emit("start_timer", {});
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

    getColumnByIndex(idx).forEach((x) =>
      state.cells[x].classList.add(HIGHLIGHT_CLASSNAME)
    );

    getRowByIndex(idx).forEach((x) =>
      state.cells[x].classList.add(HIGHLIGHT_CLASSNAME)
    );
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
      logEvent(analytics, "event_win", {});

      const timer = document.querySelector("#timer-value");

      sendEvent(firestore, "end", "end_game", {
        score: state.score,
        time: timer?.textContent ?? null,
        totalSeconds: convertHumanTimeToSeconds(timer?.textContent ?? "00:00"),
      });

      window.alert("Your won");

      window.eventEmitter.emit("win");

      freezeNumbers();

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

export function freezeNumbers() {
  const numbersElement = document.querySelector(".numbers")!;

  numbersElement.classList.add("disable-events");
}

export function getCellsFromDOM(): NodeListOf<Element> {
  const cells = document.querySelectorAll(".cell")!;

  return cells;
}

export function register() {
  window.eventEmitter.on("difficult", (difficult: number) => {
    state.difficult = difficult;
  });

  window.eventEmitter.on("score", (score: number) => {
    state.score = score;
  });

  window.eventEmitter.on("win", () => {
    console.log("win");
  });
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

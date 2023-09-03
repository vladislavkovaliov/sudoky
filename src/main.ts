import { Sudoku } from "./Sudoku";
import { fillCells } from "./utils/fillCells";
import "./style.css";

if (import.meta.env.VITE_DEBUG_MODE === "true") {
  //console.log(import.meta.env);
}

if (import.meta.env.VITE_DEBUG_MODE === "true") {
  //console.table(sudoky._grid);
}

export function main() {
  const sudoku = new Sudoku();
  const cells = getCellFromDOM();

  fillCells(sudoku, cells);
}

export function getCellFromDOM(): NodeListOf<Element> {
  const cells = document.querySelectorAll(".cell")!;

  return cells;
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

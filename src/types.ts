import { Sudoku } from "./Sudoku";

export type IDuplicateValue = { row: number; column: number };

export type IGrid = Array<Array<number | null>>;

export interface IState {
  selectedCell: Element | null;
  selectedCellIndex: -1 | number;
  cells: NodeListOf<Element> | [];
  sudoku: Sudoku | null;
  isDifficultSelected: boolean;
  score: number;
  difficult: number;
}

export interface IScore {
  totalSeconds: number;
  time: string;
  score: number;
  eventName: string;
}

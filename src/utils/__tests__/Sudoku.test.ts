import { describe, test, vi, expect } from "vitest";
import { Sudoku } from "../../Sudoku";

const mockGrid = [
  [null, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [null, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [null, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [null, 2, 3, 4, 5, 6, 7, 8, 9],
];
vi.mock("../generateSudoku", () => ({
  generateSudoku: () => mockGrid,
}));

describe("[Sudoku.ts]", () => {
  describe("hasEmptyCells()", () => {
    test("should return true if the grid has empty at least one empty cell", () => {
      const sudoky = new Sudoku();
      const result = sudoky.hasEmptyCells();
      // console.log(sudoky._grid);
      // console.log(sudoky.getDuplicatePositionsInBox(1, 1, 1));
      expect(result).toBe(true);
    });
  });
});

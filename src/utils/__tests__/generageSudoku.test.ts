import { describe, test, expect } from "vitest";
import { generateEmptyGrid, generateSudoku } from "../generateSudoku.ts";

describe("[generateSudoku.ts]", () => {
  test("should generate empty sudoku grid", () => {
    const result = generateSudoku();

    expect(result).toMatchSnapshot();
  });

  test("should create the empty grid with null values", () => {
    const expectedResult = [
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null, null],
    ];
    const result = generateEmptyGrid();

    expect(result).toStrictEqual(expectedResult);
  });
});

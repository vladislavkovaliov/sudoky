import { describe, test, expect } from "vitest";
import { generateSudoku } from "../generateSudoku.ts";

describe("[generateSudoku.ts]", () => {
  test("should generate empty sudoku grid", () => {
    const result = generateSudoku();

    expect(result).toMatchSnapshot();
  });
});

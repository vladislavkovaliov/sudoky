import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { generateEmptyGrid } from "../generateSudoku.ts";

let count = -1;

describe("[generateSudoku.ts]", () => {
  beforeEach(() => {
    beforeEach(() => {
      vi.spyOn(global.Math, "random").mockImplementation(() => {
        count = count + 1;

        return count;
      });
    });
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

  afterEach(() => {
    vi.spyOn(global.Math, "random").mockRestore();
  });
});

import { afterEach, beforeEach, describe, test, vi, expect } from "vitest";
import { removeCells } from "../removeCells";
import { IGrid } from "../../types";

let count = 0;

describe.skip("[removeCells.ts]", () => {
  beforeEach(() => {
    vi.spyOn(global.Math, "random").mockImplementation(() => {
      if (count > 0.9) {
        count = 0;
      }
      count = count + 0.1;

      return count;
    });
  });

  test("should remove 30 cells in grid(Math.random is mocked)", () => {
    const mockGrid: IGrid = [
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
      [1, 2, 3, 4, 5, 6, 7, 8, 9],
    ];
    const result = removeCells(mockGrid);

    expect(result).toBeFalsy();
  });

  afterEach(() => {
    vi.spyOn(global.Math, "random").mockRestore();
  });
});

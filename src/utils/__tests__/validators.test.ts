import { describe, test, expect, beforeEach } from "vitest";
import { validators } from "../validators";
import { IGrid } from "../../types";

describe("[validators.ts]", () => {
  let mockGrid: IGrid;

  beforeEach(() => {
    mockGrid = [
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
  });

  test("validateColumn()", () => {
    test("should return false if the cell can not be filled value", () => {
      const result = validators.validateColumn(mockGrid, 0, 0, 1);

      expect(result).toBeFalsy();
    });

    test("should return true if the cell can be filled value", () => {
      mockGrid[0][0] = null;

      let result = validators.validateColumn(mockGrid, 0, 0, 1);

      expect(result).toBeTruthy();

      mockGrid[9][9] = null;

      result = validators.validateColumn(mockGrid, 0, 0, 1);

      expect(result).toBeTruthy();
    });
  });

  test("validateRow()", () => {
    test("should return false if the cell can not be filled by value", () => {
      const result = validators.validateRow(mockGrid, 0, 0, 1);

      expect(result).toBeFalsy();
    });

    test("should return true if the cell can be filled by value", () => {
      mockGrid[0][0] = null;

      let result = validators.validateRow(mockGrid, 0, 0, 1);

      expect(result).toBeTruthy();

      mockGrid[9][9] = null;

      result = validators.validateRow(mockGrid, 0, 0, 1);

      expect(result).toBeTruthy();
    });
  });

  test("validateBox()", () => {
    test("should return false if the cell can not be filled by value", () => {
      const mockBox = [
        [1, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ];

      const result = validators.validateBox(mockBox, 0, 0, 1);

      expect(result).toBeFalsy();
    });

    test("should return true if the cell can be filled by value", () => {
      const mockBox = [
        [null, 2, 3],
        [1, 2, 3],
        [1, 2, 3],
      ];

      const result = validators.validateBox(mockBox, 0, 0, 1);

      expect(result).toBeFalsy();
    });
  });
});

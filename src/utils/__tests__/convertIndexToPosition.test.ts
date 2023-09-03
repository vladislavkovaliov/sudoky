import { describe, test, expect } from "vitest";
import { convertIndexToPosition } from "../convertIndexToPosition";

describe("[convertIndexToPosition.ts]", () => {
  test("should properly convert index to position", () => {
    expect(convertIndexToPosition(8)).toStrictEqual({ row: 0, column: 8 });
    expect(convertIndexToPosition(9)).toStrictEqual({ row: 1, column: 0 });
    expect(convertIndexToPosition(20)).toStrictEqual({ row: 2, column: 2 });
  });
});

import { describe, test, expect } from "vitest";

import { getEmptyArray } from "../getEmptyArray";

describe("[getEmptyArray.ts]", () => {
  test("should return array filled 0 by passed size", () => {
    expect(getEmptyArray(9)).toStrictEqual([0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });
});

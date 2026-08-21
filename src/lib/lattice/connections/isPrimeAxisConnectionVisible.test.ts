import { describe, expect, it } from "vitest";
import { isPrimeAxisConnectionVisible } from "./isPrimeAxisConnectionVisible";

describe("isPrimeAxisConnectionVisible", () => {
  it("shows a connection when axis-aligned positions have no blocker", () => {
    expect(
      isPrimeAxisConnectionVisible(new Map(), new Map([[3n, 2]]), []),
    ).toBe(true);
  });

  it("hides a connection when another position lies strictly between them", () => {
    expect(
      isPrimeAxisConnectionVisible(new Map(), new Map([[3n, 2]]), [
        new Map([[3n, 1]]),
      ]),
    ).toBe(false);
  });

  it("ignores positions on a different prime axis", () => {
    expect(
      isPrimeAxisConnectionVisible(new Map(), new Map([[3n, 2]]), [
        new Map([[5n, 1]]),
      ]),
    ).toBe(true);
  });

  it("ignores positions with different fixed prime coordinates", () => {
    expect(
      isPrimeAxisConnectionVisible(
        new Map([[5n, 1]]),
        new Map([
          [3n, 2],
          [5n, 1],
        ]),
        [
          new Map([
            [3n, 1],
            [5n, 2],
          ]),
        ],
      ),
    ).toBe(true);
  });

  it("rejects positions that are not on the same prime axis", () => {
    expect(
      isPrimeAxisConnectionVisible(new Map([[3n, 1]]), new Map([[5n, 1]]), []),
    ).toBe(false);
  });

  it("detects a blocker between opposite directions on the same axis", () => {
    expect(
      isPrimeAxisConnectionVisible(new Map([[3n, -1]]), new Map([[3n, 1]]), [
        new Map(),
      ]),
    ).toBe(false);
  });
});

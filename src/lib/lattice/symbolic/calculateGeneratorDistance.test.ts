import { describe, expect, it } from "vitest";
import { calculateGeneratorDistance } from "./calculateGeneratorDistance";

describe("calculateGeneratorDistance", () => {
  it("returns 0 for an empty prime-factor path", () => {
    expect(calculateGeneratorDistance([])).toBe(0);
  });

  it("returns the number of prime-factor steps in the path", () => {
    expect(
      calculateGeneratorDistance([
        { prime: 3n, direction: 1 },
        { prime: 3n, direction: 1 },
        { prime: 5n, direction: -1 },
        { prime: 11n, direction: 1 },
      ]),
    ).toBe(4);
  });
});

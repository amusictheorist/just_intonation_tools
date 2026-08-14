import { describe, expect, it } from "vitest";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";
import { createPrimeAnchorVector } from "./createPrimeAnchorVector";

describe("resolvePrimeAnchorVector", () => {
  it("uses the canonical anchor vector for a positive prime step", () => {
    expect(resolvePrimeAnchorVector({ prime: 11n, direction: 1 })).toEqual(
      createPrimeAnchorVector(11n),
    );
  });

  it("inverts the canonical anchor vector for a negative prime step", () => {
    const positive = createPrimeAnchorVector(11n);
    const inverse = resolvePrimeAnchorVector({ prime: 11n, direction: -1 });

    expect(inverse.x).toBeCloseTo(-positive.x);
    expect(inverse.y).toBeCloseTo(-positive.y);
    expect(inverse.z).toBeCloseTo(-positive.z);
  });
});

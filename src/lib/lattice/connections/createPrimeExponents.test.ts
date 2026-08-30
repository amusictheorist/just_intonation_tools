import { describe, expect, it } from "vitest";
import { createPrimeExponents } from "./createPrimeExponents";

describe("createPrimeExponents", () => {
  it("returns an empty map for an empty path", () => {
    expect(createPrimeExponents([])).toEqual(new Map());
  });

  it("collects exponents for different primes", () => {
    expect(
      createPrimeExponents([
        { prime: 3n, direction: 1 },
        { prime: 5n, direction: -1 },
      ]),
    ).toEqual(
      new Map([
        [3n, 1],
        [5n, -1],
      ]),
    );
  });

  it("combines repeated steps for the same prime", () => {
    expect(
      createPrimeExponents([
        { prime: 3n, direction: 1 },
        { prime: 3n, direction: 1 },
        { prime: 3n, direction: -1 },
      ]),
    ).toEqual(new Map([[3n, 1]]));
  });

  it("removes primes whose exponent returns to zero", () => {
    expect(
      createPrimeExponents([
        { prime: 3n, direction: 1 },
        { prime: 3n, direction: -1 },
      ]),
    ).toEqual(new Map());
  });
});

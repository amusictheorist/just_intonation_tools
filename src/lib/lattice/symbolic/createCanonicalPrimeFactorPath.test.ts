import { describe, expect, it } from "vitest";
import { createCanonicalPrimeFactorPath } from "./createCanonicalPrimeFactorPath";

describe("createCanonicalPrimeFactorPath", () => {
  it("returns an empty path for no prime factors", () => {
    expect(createCanonicalPrimeFactorPath(new Map())).toEqual([]);
  });

  it("creates one positive step for a numerator prime", () => {
    expect(createCanonicalPrimeFactorPath(new Map([[3n, 1]]))).toEqual([
      { prime: 3n, direction: 1 },
    ]);
  });

  it("creates one negative step for a denominator prime", () => {
    expect(createCanonicalPrimeFactorPath(new Map([[5n, -1]]))).toEqual([
      { prime: 5n, direction: -1 },
    ]);
  });

  it("creates one step for each occurrence of a prime factor", () => {
    expect(createCanonicalPrimeFactorPath(new Map([[3n, 2]]))).toEqual([
      { prime: 3n, direction: 1 },
      { prime: 3n, direction: 1 },
    ]);
  });

  it("creates steps for multiple prime factors", () => {
    expect(
      createCanonicalPrimeFactorPath(
        new Map([
          [3n, 1],
          [5n, -1],
        ]),
      ),
    ).toEqual([
      { prime: 3n, direction: 1 },
      { prime: 5n, direction: -1 },
    ]);
  });

  it("orders prime-factor steps by ascending prime", () => {
    expect(
      createCanonicalPrimeFactorPath(
        new Map([
          [11n, -1],
          [3n, 1],
          [7n, 1],
          [5n, -1],
        ]),
      ),
    ).toEqual([
      { prime: 3n, direction: 1 },
      { prime: 5n, direction: -1 },
      { prime: 7n, direction: 1 },
      { prime: 11n, direction: -1 },
    ]);
  });

  it("creates a canonical path with repeated positive and negative factors", () => {
    expect(
      createCanonicalPrimeFactorPath(
        new Map([
          [13n, -2],
          [3n, 2],
          [11n, 1],
          [5n, -1],
          [7n, 3],
        ]),
      ),
    ).toEqual([
      { prime: 3n, direction: 1 },
      { prime: 3n, direction: 1 },
      { prime: 5n, direction: -1 },
      { prime: 7n, direction: 1 },
      { prime: 7n, direction: 1 },
      { prime: 7n, direction: 1 },
      { prime: 11n, direction: 1 },
      { prime: 13n, direction: -1 },
      { prime: 13n, direction: -1 },
    ]);
  });
});

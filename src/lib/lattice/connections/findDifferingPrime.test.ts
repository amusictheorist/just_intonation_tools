import { describe, expect, it } from "vitest";
import { findDifferingPrime } from "./findDifferingPrime";

describe("findDifferingPrime", () => {
  it("returns the prime when exactly one exponent differs", () => {
    expect(findDifferingPrime(new Map([[3n, 1]]), new Map([[3n, 2]]))).toBe(3n);
  });

  it("returns a newly introduced prime", () => {
    expect(
      findDifferingPrime(
        new Map([[3n, 1]]),
        new Map([
          [3n, 1],
          [11n, 1],
        ]),
      ),
    ).toBe(11n);
  });

  it("returns null when multiple primes differ", () => {
    expect(
      findDifferingPrime(new Map([[3n, 1]]), new Map([[5n, 1]])),
    ).toBeNull();
  });

  it("returns null for identical positions", () => {
    expect(
      findDifferingPrime(new Map([[3n, 1]]), new Map([[3n, 1]])),
    ).toBeNull();
  });
});

import { describe, expect, it } from "vitest";
import { getHigherPrimeOrdinal } from "./getHigherPrimeOrdinal";

describe("getHigherPrimeOrdinal", () => {
  it("assigns zero to the first prime greater than seven", () => {
    expect(getHigherPrimeOrdinal(11n)).toBe(0n);
  });

  it("assigns increasing ordinals to successive higher primes", () => {
    expect(getHigherPrimeOrdinal(13n)).toBe(1n);
    expect(getHigherPrimeOrdinal(17n)).toBe(2n);
    expect(getHigherPrimeOrdinal(19n)).toBe(3n);
  });

  it("continues assigning ordinals across larger higher primes", () => {
    expect(getHigherPrimeOrdinal(23n)).toBe(4n);
    expect(getHigherPrimeOrdinal(29n)).toBe(5n);
    expect(getHigherPrimeOrdinal(31n)).toBe(6n);
  });
});

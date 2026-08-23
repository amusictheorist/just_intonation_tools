import { describe, expect, it } from "vitest";
import { createPositiveInteger } from "../../ji/positiveInteger";
import { createRatio } from "../../ji/ratio";
import { createUnisonRatio } from "../../ji/createUnisonRatio";
import { factorPrimesIgnoringTwo } from "./factorPrimesIgnoringTwo";

const ratio = (numerator: bigint, denominator: bigint) =>
  createRatio(
    createPositiveInteger(numerator),
    createPositiveInteger(denominator),
  );

describe("factorPrimesIgnoringTwo", () => {
  it("returns no factor for unison", () => {
    expect(factorPrimesIgnoringTwo(createUnisonRatio())).toEqual(new Map());
  });

  it("omits powers of 2", () => {
    expect(factorPrimesIgnoringTwo(ratio(3n, 2n))).toEqual(new Map([[3n, 1]]));
  });

  it("uses negative exponents for denominator factors", () => {
    expect(factorPrimesIgnoringTwo(ratio(5n, 3n))).toEqual(
      new Map([
        [3n, -1],
        [5n, 1],
      ]),
    );
  });

  it("combines numerator and denominator odd-prime factors", () => {
    expect(factorPrimesIgnoringTwo(ratio(45n, 77n))).toEqual(
      new Map([
        [3n, 2],
        [5n, 1],
        [7n, -1],
        [11n, -1],
      ]),
    );
  });

  it("represents a higher prime in the denominator", () => {
    expect(factorPrimesIgnoringTwo(ratio(8n, 11n))).toEqual(
      new Map([[11n, -1]]),
    );
  });
});

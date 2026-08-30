import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { partialClassSetArbitrary } from "../test/partialClassSetArbitraries";
import { partialClassSetIntervalMatrix } from "./partialClassSetIntervalMatrix";

describe("partialClassSetIntervalMatrix properties", () => {
  it("has dimensions matching set cardinality", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        const matrix = partialClassSetIntervalMatrix(partialClassSet);

        expect(matrix).toHaveLength(partialClassSet.members.length);

        for (const row of matrix) {
          expect(row).toHaveLength(partialClassSet.members.length);
        }
      }),
    );
  });

  it("contains unison on every diagonal entry", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        const matrix = partialClassSetIntervalMatrix(partialClassSet);

        for (let index = 0; index < matrix.length; index += 1) {
          expect(matrix[index][index].numerator).toBe(1n);
          expect(matrix[index][index].denominator).toBe(1n);
        }
      }),
    );
  });

  it("contains reciprocal ratios across opposite matrix positions", () => {
    fc.assert(
      fc.property(partialClassSetArbitrary, (partialClassSet) => {
        const matrix = partialClassSetIntervalMatrix(partialClassSet);

        for (let row = 0; row < matrix.length; row += 1) {
          for (let column = 0; column < matrix.length; column += 1) {
            expect(matrix[row][column].numerator).toBe(
              matrix[column][row].denominator,
            );
            expect(matrix[row][column].denominator).toBe(
              matrix[column][row].numerator,
            );
          }
        }
      }),
    );
  });
});

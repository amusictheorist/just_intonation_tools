import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { primeExponentsArbitrary } from "../../symbolic/arbitraries/primeExponentsArbitrary";
import { canonicalizeConnection } from "../test/canonicalizeConnections";
import { createPrimeExponentsKey } from "../../symbolic/test/createPrimeExponentsKey";
import { createRadialConnections } from "./createRadialConnections";

describe("createRadialConnections properties", () => {
  it("produces the same undirected graph regardless of input order", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(primeExponentsArbitrary, {
          minLength: 0,
          maxLength: 8,
          selector: createPrimeExponentsKey,
        }),
        (exponents) => {
          const points = exponents.map((pointExponents, index) => ({
            id: `point-${index}`,
            exponents: pointExponents,
          }));

          const reversedPoints = [...points].reverse();

          const originalConnections = createRadialConnections(points)
            .map(canonicalizeConnection)
            .sort();

          const reversedConnections = createRadialConnections(reversedPoints)
            .map(canonicalizeConnection)
            .sort();

          expect(reversedConnections).toEqual(originalConnections);
        },
      ),
    );
  });
});

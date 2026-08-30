import { describe, expect, it } from "vitest";
import fc from "fast-check";
import { primeExponentsArbitrary } from "../../symbolic/arbitraries/primeExponentsArbitrary";
import { createExpandedCubicAddress } from "../../symbolic/cubic/createExpandedCubicAddress";
import { createExpandedCubicConnections } from "./createExpandedCubicConnections";
import { canonicalizeConnection } from "../test/canonicalizeConnections";
import { createPrimeExponentsKey } from "../../symbolic/test/createPrimeExponentsKey";

describe("createExpandedCubicConnections properties", () => {
  it("produces the same undirected graph regardless of input order", () => {
    fc.assert(
      fc.property(
        fc.uniqueArray(primeExponentsArbitrary, {
          maxLength: 8,
          selector: createPrimeExponentsKey,
        }),
        (factors) => {
          const points = factors.map((pointFactors, index) => ({
            id: `point-${index}`,
            address: createExpandedCubicAddress(pointFactors),
          }));

          const reversedPoints = [...points].reverse();

          const originalConnections = createExpandedCubicConnections(points)
            .map(canonicalizeConnection)
            .sort();

          const reversedConnections = createExpandedCubicConnections(
            reversedPoints,
          )
            .map(canonicalizeConnection)
            .sort();

          expect(reversedConnections).toEqual(originalConnections);
        },
      ),
    );
  });
});

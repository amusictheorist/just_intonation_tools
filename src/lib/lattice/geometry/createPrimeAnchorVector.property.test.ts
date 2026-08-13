import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPrimeAnchorVector } from "./createPrimeAnchorVector";
import { vectorLength } from "./vector";

describe("createPrimeAnchorVector properties", () => {
  it("places higher-prime anchors on the unit sphere", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n),
        (prime) => {
          expect(vectorLength(createPrimeAnchorVector(prime))).toBeCloseTo(1);
        },
      ),
    );
  });

  it("returns the same anchor for the same higher prime", () => {
    fc.assert(
      fc.property(
        fc.constantFrom(11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n),
        (prime) => {
          expect(createPrimeAnchorVector(prime)).toEqual(
            createPrimeAnchorVector(prime),
          );
        },
      ),
    );
  });

  it("gives distinct higher primes distinct anchor vectors", () => {
    const primes = [11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n];

    const anchors = primes.map(createPrimeAnchorVector);

    for (let first = 0; first < anchors.length; first += 1) {
      for (let second = first + 1; second < anchors.length; second += 1) {
        expect(anchors[first]).not.toEqual(anchors[second]);
      }
    }
  });
});

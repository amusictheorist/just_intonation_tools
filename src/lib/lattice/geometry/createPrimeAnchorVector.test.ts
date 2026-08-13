import { describe, expect, it } from "vitest";
import { createPrimeAnchorVector } from "./createPrimeAnchorVector";
import { vectorLength } from "./vector";

describe("createPrimeAnchorVector", () => {
  it("returns the same anchor vector for the same prime", () => {
    expect(createPrimeAnchorVector(11n)).toEqual(createPrimeAnchorVector(11n));
  });

  it("places a prime anchor on the unit sphere", () => {
    const anchor = createPrimeAnchorVector(11n);
    expect(vectorLength(anchor)).toBeCloseTo(1);
  });

  it("gives distinct higher primes distinct anchor vectors", () => {
    const primes = [11n, 13n, 17n, 19n, 23n];

    const anchors = primes.map((prime) => createPrimeAnchorVector(prime));

    for (let first = 0; first < anchors.length; first += 1) {
      for (let second = first + 1; second < anchors.length; second += 1) {
        expect(anchors[first]).not.toEqual(anchors[second]);
      }
    }
  });

  it("does not change anchor positions when primes are requested in a different order", () => {
    const elevenFirst = createPrimeAnchorVector(11n);
    createPrimeAnchorVector(13n);
    createPrimeAnchorVector(17n);
    createPrimeAnchorVector(17n);
    createPrimeAnchorVector(13n);
    const elevenLast = createPrimeAnchorVector(11n);

    expect(elevenLast).toEqual(elevenFirst);
  });

  it("assigns different positions to successive higher-prime ordinals", () => {
    expect(createPrimeAnchorVector(11n)).not.toEqual(
      createPrimeAnchorVector(13n),
    );

    expect(createPrimeAnchorVector(13n)).not.toEqual(
      createPrimeAnchorVector(17n),
    );
  });

  it("distributes early higher-prime anchors across both hemispheres", () => {
    const primes = [11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n, 41n, 43n];

    const anchors = primes.map(createPrimeAnchorVector);

    expect(anchors.some((anchor) => anchor.z > 0)).toBe(true);
    expect(anchors.some((anchor) => anchor.z < 0)).toBe(true);
  });
});

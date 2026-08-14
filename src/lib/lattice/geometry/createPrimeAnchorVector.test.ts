import { describe, expect, it } from "vitest";
import { createPrimeAnchorVector } from "./createPrimeAnchorVector";

describe("createPrimeAnchorVector", () => {
  it("does not change anchor vectors when primes are requested in a different order", () => {
    const elevenFirst = createPrimeAnchorVector(11n);

    createPrimeAnchorVector(13n);
    createPrimeAnchorVector(17n);
    createPrimeAnchorVector(17n);
    createPrimeAnchorVector(13n);

    const elevenLast = createPrimeAnchorVector(11n);

    expect(elevenLast).toEqual(elevenFirst);
  });

  it("assigns different vectors to successive higher-prime ordinals", () => {
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

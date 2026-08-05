import { factor357 } from "../math/factors";
import type { PlacementResult, Ratio } from "../types";

export const placeCubic = (ratio: Ratio): PlacementResult | null => {
  const { num, den } = ratio.octave;
  const numeratorFactors = factor357(num);
  const denominatorFactors = factor357(den);

  if (numeratorFactors.leftover !== 1 || denominatorFactors.leftover !== 1) {
    return null;
  }

  const x = numeratorFactors.a - denominatorFactors.a;
  const y = numeratorFactors.b - denominatorFactors.b;
  const z = numeratorFactors.c - denominatorFactors.c;

  return {
    x,
    y,
    z,
    lattice: [x, y, z],
    latticeType: "global",
    primeAnchor: null,
  };
};

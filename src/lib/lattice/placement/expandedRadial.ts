import { BASE_RADIUS, Y_STEP } from "../math/constants";
import { factorRatio } from "../math/factors";
import { getPrimeStepDir } from "../math/highPrimeGeometry";
import { vec } from "../math/vectors";
import type { PlacementControls, PlacementResult, Ratio } from "../types";

export const placeExpandedRadial = (
  ratio: Ratio,
  _controls: PlacementControls = {},
): PlacementResult => {
  const factors = factorRatio(ratio);

  if (factors.size === 0) {
    return {
      x: 0,
      y: 0,
      z: 0,
      lattice: [],
      latticeType: "radial",
      primeAnchor: null,
    };
  }

  const isBelowOne = ratio.canonical.value < 1;

  const position = vec(0, 0, 0);
  let totalSteps = 0;

  for (const [prime, exponent] of factors) {
    if (exponent === 0) continue;

    const orientedExponent = isBelowOne ? -exponent : exponent;

    if (orientedExponent === 0) continue;

    const sign = orientedExponent > 0 ? 1 : -1;
    const steps = Math.abs(orientedExponent);
    const direction = getPrimeStepDir(prime, sign);

    position.x += direction.x * BASE_RADIUS * steps;
    position.z += direction.z * BASE_RADIUS * steps;
    totalSteps += steps;
  }

  return {
    x: position.x,
    y: (isBelowOne ? -1 : 1) * totalSteps * Y_STEP,
    z: position.z,
    lattice: Array.from(factors.entries()),
    latticeType: "radial",
    primeAnchor: null,
  };
};

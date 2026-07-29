import { SPACING, SUB_PRIME_STEP } from "../math/constants";
import { factorRatio } from "../math/factors";
import { computePrimePosition, getPrimeFrame } from "../math/highPrimeGeometry";
import {
  addScaled,
  applyRotation,
  normalize,
  scale,
  sub,
} from "../math/vectors";
import type { PlacementControls, PlacementResult, Ratio } from "../types";
import { placeCubic } from "./cubic";

export const placeExpandedCubic = (
  ratio: Ratio,
  controls: PlacementControls = {},
): PlacementResult | null => {
  const { radiusScale = 1, rotation = {} } = controls;

  const factors = factorRatio(ratio);

  const a = factors.get(3) ?? 0;
  const b = factors.get(5) ?? 0;
  const c = factors.get(7) ?? 0;

  const highPrimes = [...factors.entries()].filter(
    ([prime, exponent]) => prime > 7 && exponent !== 0,
  );

  if (highPrimes.length === 0) {
    const base = placeCubic(ratio);

    if (!base) {
      return null;
    }

    return {
      ...base,
      lattice: base.lattice ?? [base.x, base.y, base.z],
      latticeType: "global",
      primeAnchor: null,
    };
  }

  const [anchorPrime, anchorExponent] = highPrimes.reduce(
    (current, candidate) => (candidate[0] > current[0] ? candidate : current),
  );

  const sign = anchorExponent > 0 ? 1 : -1;
  const frame = getPrimeFrame(anchorPrime, radiusScale, 0, sign);

  let position = { ...frame.origin };

  if (a !== 0) {
    position = addScaled(position, frame.Xp, a * SPACING);
  }

  if (b !== 0) {
    position = addScaled(position, frame.Yp, b * SPACING);
  }

  if (c !== 0) {
    position = addScaled(position, frame.Zp, c * SPACING);
  }

  for (const [prime, exponent] of highPrimes) {
    if (prime === anchorPrime) {
      continue;
    }

    const otherOrigin = scale(
      computePrimePosition(prime, radiusScale),
      exponent > 0 ? 1 : -1,
    );

    const direction = normalize(sub(otherOrigin, frame.origin));

    position = addScaled(
      position,
      direction,
      Math.abs(exponent) * SUB_PRIME_STEP,
    );
  }

  const finalPosition = applyRotation(position, rotation);

  return {
    x: finalPosition.x,
    y: finalPosition.y,
    z: finalPosition.z,
    lattice: [a, b, c],
    latticeType: "prime",
    primeAnchor: anchorPrime,
  };
};

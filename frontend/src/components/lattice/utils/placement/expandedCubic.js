import { SPACING, SUB_PRIME_STEP } from "../../utils/math/constants";
import { factorRatio } from "../math/factors";
import { computePrimePosition, getPrimeFrame } from "../math/highPrimeGeometry";
import { scale, normalize, addScaled, sub, applyRotation } from "../math/vectors";
import { place as placeCubic } from "./cubic";

export const placeExpanded = (ratio, controls = {}) => {
  const { radiusScale = 1, rotation = {} } = controls;
  const factors = factorRatio(ratio);

  const a = factors.get(3) || 0;
  const b = factors.get(5) || 0;
  const c = factors.get(7) || 0;

  const highPrimes = [...factors.entries()].filter(([p, e]) => p > 7 && e !== 0);

  if (highPrimes.length === 0) {
    const base = placeCubic(ratio);
    if (!base) return null;

    return {
      x: base.x,
      y: base.y,
      z: base.z,
      lattice: base.lattice || [base.x, base.y, base.z],
      latticeType: 'global',
      primeAnchor: null
    };
  }

  const anchor = highPrimes.reduce((m, c) => (c[0] > m[0] ? c : m));
  const [anchorPrime, anchorExp] = anchor;
  const sign = anchorExp > 0 ? +1 : -1;

  const frame = getPrimeFrame(anchorPrime, radiusScale, 0, sign);

  let pos = { ...frame.origin };

  if (a !== 0) pos = addScaled(pos, frame.Xp, a * SPACING);
  if (b !== 0) pos = addScaled(pos, frame.Yp, b * SPACING);
  if (c !== 0) pos = addScaled(pos, frame.Zp, c * SPACING);

  for (const [p, e] of highPrimes) {
    if (p === anchorPrime) continue;

    const otherOrigin = scale(computePrimePosition(p, radiusScale), e > 0 ? +1 : -1);
    const dir = normalize(sub(otherOrigin, frame.origin));
    pos = addScaled(pos, dir, Math.abs(e) * SUB_PRIME_STEP);
  }

  let finalPos = pos;
  if (highPrimes.length > 0) {
    finalPos = applyRotation(pos, rotation);
  }

  return {
    x: finalPos.x,
    y: finalPos.y,
    z: finalPos.z,
    lattice: [a, b, c],
    latticeType: 'prime',
    primeAnchor: anchorPrime
  }
};
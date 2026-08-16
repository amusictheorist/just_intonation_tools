import type { PrimeFactorStep } from "../../symbolic/createCanonicalPrimeFactorPath";
import type { Vector3 } from "../createRadialDirectionVector";

const anchorVectors = new Map<bigint, Vector3>([
  [11n, { x: 2, y: 0, z: 0 }],
  [13n, { x: 0, y: 3, z: 0 }],
  [17n, { x: 0, y: 0, z: 4 }],
]);

export function resolveTestPrimeAnchorVector(step: PrimeFactorStep): Vector3 {
  const vector = anchorVectors.get(step.prime);

  if (!vector) {
    throw new Error(`Unexpected test prime: ${step.prime}`);
  }

  return {
    x: vector.x * step.direction,
    y: vector.y * step.direction,
    z: vector.z * step.direction,
  };
}

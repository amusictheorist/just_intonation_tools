import { createPrimeAnchorVector } from "../../../lib/lattice/geometry/createPrimeAnchorVector";
import type { LatticeSceneManager } from "./types";

const PROTOTYPE_PRIMES = [
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
  41n,
  43n,
  47n,
  53n,
  59n,
  61n,
  67n,
  71n,
  73n,
  79n,
  83n,
  89n,
];

export function addPrimeAnchorPrototype(manager: LatticeSceneManager): void {
  manager.clearPoints();

  for (const prime of PROTOTYPE_PRIMES) {
    const { x, y, z } = createPrimeAnchorVector(prime);

    manager.addPoint(x, y, z, prime.toString(), 0x0000ff, {});
  }
}

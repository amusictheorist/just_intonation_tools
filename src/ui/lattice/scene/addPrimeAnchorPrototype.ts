import { createAnchorPositionsFromPrimePath } from "../../../lib/lattice/geometry/createAnchorPositionsFromPrimePath";
import { createPrimeAnchorVector } from "../../../lib/lattice/geometry/createPrimeAnchorVector";
import { resolvePrimeAnchorVector } from "../../../lib/lattice/geometry/resolvePrimeAnchorVector";
import type { LatticeSceneManager } from "./types";

const ELEVEN_COLOR = 0x0000ff;
const THIRTEEN_COLOR = 0x228b22;
const SEVENTEEN_COLOR = 0xc0ffee;

const PROTOTYPE_PRIMES = [
  { prime: 11n, color: ELEVEN_COLOR },
  { prime: 13n, color: THIRTEEN_COLOR },
  { prime: 17n, color: SEVENTEEN_COLOR },
];

const INITIAL_POSITION = { x: 0, y: 0, z: 0 };

export function addPrimeAnchorPrototype(manager: LatticeSceneManager): void {
  manager.clearPoints();

  for (const { prime, color } of PROTOTYPE_PRIMES) {
    const { x, y, z } = createPrimeAnchorVector(prime);

    manager.addPoint(x, y, z, prime.toString(), color, {});
  }

  const elevenElevenFrames = createAnchorPositionsFromPrimePath(
    [
      { prime: 11n, direction: 1 },
      { prime: 11n, direction: 1 },
    ],
    INITIAL_POSITION,
    resolvePrimeAnchorVector,
  );

  const elevenThirteenFrames = createAnchorPositionsFromPrimePath(
    [
      { prime: 11n, direction: 1 },
      { prime: 13n, direction: 1 },
    ],
    INITIAL_POSITION,
    resolvePrimeAnchorVector,
  );

  const elevenSeventeenFrames = createAnchorPositionsFromPrimePath(
    [
      { prime: 11n, direction: 1 },
      { prime: 17n, direction: 1 },
    ],
    INITIAL_POSITION,
    resolvePrimeAnchorVector,
  );

  const elevenEleven = elevenElevenFrames[elevenElevenFrames.length - 1];
  const elevenThirteen = elevenThirteenFrames[elevenThirteenFrames.length - 1];

  const elevenSeventeen =
    elevenSeventeenFrames[elevenSeventeenFrames.length - 1];

  manager.addPoint(
    elevenEleven.x,
    elevenEleven.y,
    elevenEleven.z,
    "11·11",
    ELEVEN_COLOR,
    {},
  );
  manager.addPoint(
    elevenThirteen.x,
    elevenThirteen.y,
    elevenThirteen.z,
    "11·13",
    ELEVEN_COLOR,
    {},
  );

  manager.addPoint(
    elevenSeventeen.x,
    elevenSeventeen.y,
    elevenSeventeen.z,
    "11·17",
    ELEVEN_COLOR,
    {},
  );
}

import { describe, expect, it } from "vitest";
import { createAnchorPositionsFromPrimePath } from "./createAnchorPositionsFromPrimePath";
import { resolvePrimeAnchorVector } from "./resolvePrimeAnchorVector";

function resolveAnchorVector() {
  return { x: 0, y: 0, z: 1 };
}

const initialPosition = { x: 0, y: 0, z: 0 };

describe("createAnchorPositionsFromPrimePath", () => {
  it("returns one position for each prime step", () => {
    const positions = createAnchorPositionsFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
        { prime: 17n, direction: 1 },
      ],
      initialPosition,
      resolveAnchorVector,
    );

    expect(positions).toHaveLength(3);

    expect(positions[0].z).toBeCloseTo(1);
    expect(positions[1].z).toBeCloseTo(2);
    expect(positions[2].z).toBeCloseTo(3);
  });

  it("returns no positions for an empty path", () => {
    expect(
      createAnchorPositionsFromPrimePath(
        [],
        initialPosition,
        resolveAnchorVector,
      ),
    ).toEqual([]);
  });

  it("continues repeated steps of the same prime along the same direction", () => {
    const positions = createAnchorPositionsFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 11n, direction: 1 },
      ],
      initialPosition,
      resolvePrimeAnchorVector,
    );

    const first = positions[0];
    const second = positions[1];

    expect(second.x).toBeCloseTo(first.x * 2);
    expect(second.y).toBeCloseTo(first.y * 2);
    expect(second.z).toBeCloseTo(first.z * 2);
  });

  it("continues repeated inverse steps of the same prime along the same direction", () => {
    const positions = createAnchorPositionsFromPrimePath(
      [
        { prime: 11n, direction: -1 },
        { prime: 11n, direction: -1 },
      ],
      initialPosition,
      resolvePrimeAnchorVector,
    );

    const first = positions[0];
    const second = positions[1];

    expect(second.x).toBeCloseTo(first.x * 2);
    expect(second.y).toBeCloseTo(first.y * 2);
    expect(second.z).toBeCloseTo(first.z * 2);
  });

  it("establishes a new nested direction when the prime changes", () => {
    const positions = createAnchorPositionsFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
      ],
      initialPosition,
      resolvePrimeAnchorVector,
    );

    const first = positions[0];
    const second = positions[1];
    const third = positions[2];

    expect(second.x).toBeCloseTo(first.x * 2);
    expect(second.y).toBeCloseTo(first.y * 2);
    expect(second.z).toBeCloseTo(first.z * 2);

    const secondStep = {
      x: second.x - first.x,
      y: second.y - first.y,
      z: second.z - first.z,
    };

    const thirdStep = {
      x: third.x - second.x,
      y: third.y - second.y,
      z: third.z - second.z,
    };

    expect(thirdStep).not.toEqual(secondStep);
  });

  it("preserves canonical prime directions across sublattices", () => {
    const positions = createAnchorPositionsFromPrimePath(
      [
        { prime: 11n, direction: 1 },
        { prime: 13n, direction: 1 },
      ],
      initialPosition,
      resolvePrimeAnchorVector,
    );

    const eleven = positions[0];
    const elevenThirteen = positions[1];
    const thirteen = resolvePrimeAnchorVector({
      prime: 13n,
      direction: 1,
    });

    expect(elevenThirteen.x - eleven.x).toBeCloseTo(thirteen.x);

    expect(elevenThirteen.y - eleven.y).toBeCloseTo(thirteen.y);

    expect(elevenThirteen.z - eleven.z).toBeCloseTo(thirteen.z);
  });
});

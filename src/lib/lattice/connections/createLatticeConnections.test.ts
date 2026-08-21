import { describe, expect, it } from "vitest";
import { createLatticeConnections } from "./createLatticeConnections";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createUnisonRatio } from "../../ji/createUnisonRatio";

describe("createLatticeConnections", () => {
  it("creates connections from cubic positiond ratios", () => {
    expect(
      createLatticeConnections([
        {
          latticeRatio: {
            id: "a",
            rawInput: "1",
            ratio: createUnisonRatio(),
          },
          placement: {
            type: "cubic",
            placement: {
              type: "standard",
              coordinates: { x: 0, y: 0, z: 0 },
            },
          },
          position: { x: 0, y: 0, z: 0 },
        },
        {
          latticeRatio: {
            id: "b",
            rawInput: "9",
            ratio: createTestRatio(9n, 1n),
          },
          placement: {
            type: "cubic",
            placement: {
              type: "standard",
              coordinates: { x: 2, y: 0, z: 0 },
            },
          },
          position: { x: 2, y: 0, z: 0 },
        },
      ]),
    ).toEqual([{ fromId: "a", toId: "b" }]);
  });

  it("creates connections from radial positioned ratios", () => {
    expect(
      createLatticeConnections([
        {
          latticeRatio: {
            id: "a",
            rawInput: "1",
            ratio: createUnisonRatio(),
          },
          placement: {
            type: "radial",
            placement: {
              type: "standard",
              address: {
                normalizedRatio: createUnisonRatio(),
                path: [],
                distance: 0,
              },
            },
          },
          position: { x: 0, y: 0, z: 0 },
        },
        {
          latticeRatio: {
            id: "b",
            rawInput: "3/2",
            ratio: createTestRatio(3n, 2n),
          },
          placement: {
            type: "radial",
            placement: {
              type: "standard",
              address: {
                normalizedRatio: createTestRatio(3n, 2n),
                path: [{ prime: 3n, direction: 1 }],
                distance: 1,
              },
            },
          },
          position: { x: 1, y: 0, z: 0 },
        },
      ]),
    ).toEqual([{ fromId: "a", toId: "b" }]);
  });

  it("rejects mixed cubic and radial positioned ratios", () => {
    expect(() =>
      createLatticeConnections([
        {
          latticeRatio: {
            id: "a",
            rawInput: "1",
            ratio: createUnisonRatio(),
          },
          placement: {
            type: "cubic",
            placement: {
              type: "standard",
              coordinates: { x: 0, y: 0, z: 0 },
            },
          },
          position: { x: 0, y: 0, z: 0 },
        },
        {
          latticeRatio: {
            id: "b",
            rawInput: "3/2",
            ratio: createTestRatio(3n, 2n),
          },
          placement: {
            type: "radial",
            placement: {
              type: "standard",
              address: {
                normalizedRatio: createTestRatio(3n, 2n),
                path: [{ prime: 3n, direction: 1 }],
                distance: 1,
              },
            },
          },
          position: { x: 1, y: 0, z: 0 },
        },
      ]),
    ).toThrow(
      "Cannot create connections for mixed lattice visualization types",
    );
  });
});

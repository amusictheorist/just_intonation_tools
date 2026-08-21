import { describe, expect, it } from "vitest";
import { createRadialVisualizationConnections } from "./createRadialVisualizationConnections";
import { createTestRatio } from "../../ji/test/ratioTestHelpers";
import { createUnisonRatio } from "../../ji/createUnisonRatio";

describe("createRadialVisualizationConnections", () => {
  it("creates connections from standard radial placements", () => {
    expect(
      createRadialVisualizationConnections([
        {
          id: "three",
          placement: {
            type: "standard",
            address: {
              normalizedRatio: createTestRatio(3n, 2n),
              path: [{ prime: 3n, direction: 1 }],
              distance: 1,
            },
          },
        },
        {
          id: "fifteen",
          placement: {
            type: "standard",
            address: {
              normalizedRatio: createTestRatio(15n, 8n),
              path: [
                { prime: 3n, direction: 1 },
                { prime: 5n, direction: 1 },
              ],
              distance: 1,
            },
          },
        },
      ]),
    ).toEqual([{ fromId: "three", toId: "fifteen", prime: 5n }]);
  });

  it("creates connections from expanded radial placements", () => {
    expect(
      createRadialVisualizationConnections([
        {
          id: "lower-three",
          placement: {
            type: "expanded",
            address: {
              normalizedRatio: createTestRatio(3n, 4n),
              side: "lower",
              path: [{ prime: 3n, direction: 1 }],
              distance: 1,
            },
          },
        },
        {
          id: "unison",
          placement: {
            type: "expanded",
            address: {
              normalizedRatio: createUnisonRatio(),
              side: "upper",
              path: [],
              distance: 0,
            },
          },
        },
        {
          id: "upper-three",
          placement: {
            type: "expanded",
            address: {
              normalizedRatio: createTestRatio(3n, 2n),
              side: "upper",
              path: [{ prime: 3n, direction: 1 }],
              distance: 1,
            },
          },
        },
      ]),
    ).toEqual([
      { fromId: "lower-three", toId: "unison", prime: 3n },
      { fromId: "unison", toId: "upper-three", prime: 3n },
    ]);
  });

  it("connects higher-prime composites along every visible radial prime axis", () => {
    expect(
      createRadialVisualizationConnections([
        {
          id: "three",
          placement: {
            type: "standard",
            address: {
              normalizedRatio: createTestRatio(3n, 2n),
              path: [{ prime: 3n, direction: 1 }],
              distance: 1,
            },
          },
        },
        {
          id: "eleven",
          placement: {
            type: "standard",
            address: {
              normalizedRatio: createTestRatio(11n, 8n),
              path: [{ prime: 11n, direction: 1 }],
              distance: 1,
            },
          },
        },
        {
          id: "thirty-three",
          placement: {
            type: "standard",
            address: {
              normalizedRatio: createTestRatio(33n, 32n),
              path: [
                { prime: 3n, direction: 1 },
                { prime: 11n, direction: 1 },
              ],
              distance: 2,
            },
          },
        },
      ]),
    ).toEqual([
      { fromId: "three", toId: "thirty-three", prime: 11n },
      { fromId: "eleven", toId: "thirty-three", prime: 3n },
    ]);
  });
});

import { describe, expect, it } from "vitest";
import { createCubicVisualizationConnections } from "./createCubicVisualizationConnections";

describe("createCubicVisualizationConnections", () => {
  it("creates connections for standard cubic placements", () => {
    expect(
      createCubicVisualizationConnections([
        {
          id: "a",
          placement: {
            type: "standard",
            coordinates: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "b",
          placement: {
            type: "standard",
            coordinates: { x: 2, y: 0, z: 0 },
          },
        },
      ]),
    ).toEqual([{ fromId: "a", toId: "b", prime: 3n }]);
  });

  it("creates connections for expanded cubic placements", () => {
    expect(
      createCubicVisualizationConnections([
        {
          id: "origin",
          placement: {
            type: "expanded",
            address: {
              anchorPath: [],
              coordinates357: { x: 0, y: 0, z: 0 },
            },
          },
        },
        {
          id: "high-prime",
          placement: {
            type: "expanded",
            address: {
              anchorPath: [{ prime: 11n, direction: 1 }],
              coordinates357: { x: 0, y: 0, z: 0 },
            },
          },
        },
      ]),
    ).toEqual([{ fromId: "origin", toId: "high-prime", prime: 11n }]);
  });

  it("rejects mixed standard and expanded cubic placements", () => {
    expect(() =>
      createCubicVisualizationConnections([
        {
          id: "standard",
          placement: {
            type: "standard",
            coordinates: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "expanded",
          placement: {
            type: "expanded",
            address: {
              anchorPath: [],
              coordinates357: { x: 0, y: 0, z: 0 },
            },
          },
        },
      ]),
    ).toThrow("Mixed cubic visualization placements");
  });
});

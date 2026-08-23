import { describe, expect, it } from "vitest";
import { createCubicVisualizationConnections } from "./createCubicVisualizationConnections";

describe("createCubicVisualizationConnections", () => {
  it("creates connections for standard cubic variants", () => {
    expect(
      createCubicVisualizationConnections([
        {
          id: "a",
          variant: {
            type: "standard",
            coordinates: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "b",
          variant: {
            type: "standard",
            coordinates: { x: 2, y: 0, z: 0 },
          },
        },
      ]),
    ).toEqual([{ fromId: "a", toId: "b", prime: 3n }]);
  });

  it("creates connections for expanded cubic variants", () => {
    expect(
      createCubicVisualizationConnections([
        {
          id: "origin",
          variant: {
            type: "expanded",
            address: {
              anchorPath: [],
              coordinates357: { x: 0, y: 0, z: 0 },
            },
          },
        },
        {
          id: "high-prime",
          variant: {
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

  it("rejects mixed standard and expanded cubic variants", () => {
    expect(() =>
      createCubicVisualizationConnections([
        {
          id: "standard",
          variant: {
            type: "standard",
            coordinates: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "expanded",
          variant: {
            type: "expanded",
            address: {
              anchorPath: [],
              coordinates357: { x: 0, y: 0, z: 0 },
            },
          },
        },
      ]),
    ).toThrow("Mixed cubic visualization variants");
  });
});

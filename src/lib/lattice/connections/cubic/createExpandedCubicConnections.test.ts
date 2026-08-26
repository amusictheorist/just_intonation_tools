import { describe, expect, it } from "vitest";
import { createExpandedCubicConnections } from "./createExpandedCubicConnections";

describe("createExpandedCubicConnections", () => {
  it("creates visible local and higher-prime connections", () => {
    expect(
      createExpandedCubicConnections([
        {
          id: "origin",
          address: {
            anchorPath: [],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "local",
          address: {
            anchorPath: [],
            coordinates357: { x: 1, y: 0, z: 0 },
          },
        },
        {
          id: "high-prime",
          address: {
            anchorPath: [{ prime: 11n, direction: 1 }],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        },
      ]),
    ).toEqual([
      { fromId: "origin", toId: "local", prime: 3n },
      { fromId: "origin", toId: "high-prime", prime: 11n },
    ]);
  });

  it("does not create a local connection through an intervening point", () => {
    expect(
      createExpandedCubicConnections([
        {
          id: "a",
          address: {
            anchorPath: [],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "b",
          address: {
            anchorPath: [],
            coordinates357: { x: 1, y: 0, z: 0 },
          },
        },
        {
          id: "c",
          address: {
            anchorPath: [],
            coordinates357: { x: 2, y: 0, z: 0 },
          },
        },
      ]),
    ).toEqual([
      { fromId: "a", toId: "b", prime: 3n },
      { fromId: "b", toId: "c", prime: 3n },
    ]);
  });

  it("does not create a higher-prime connection through an intervening point", () => {
    expect(
      createExpandedCubicConnections([
        {
          id: "lower",
          address: {
            anchorPath: [{ prime: 11n, direction: -1 }],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "origin",
          address: {
            anchorPath: [],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        },
        {
          id: "upper",
          address: {
            anchorPath: [{ prime: 11n, direction: 1 }],
            coordinates357: { x: 0, y: 0, z: 0 },
          },
        },
      ]),
    ).toEqual([
      { fromId: "lower", toId: "origin", prime: 11n },
      { fromId: "origin", toId: "upper", prime: 11n },
    ]);
  });
});

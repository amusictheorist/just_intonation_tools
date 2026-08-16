import { describe, expect, it } from "vitest";
import { createStandardCubicConnections } from "./createStandardCubicConnections";

describe("createStandardCubicConnections", () => {
  it("connects only unobstructed points along a cubic axis", () => {
    expect(
      createStandardCubicConnections([
        { id: "a", coordinates: { x: 0, y: 0, z: 0 } },
        { id: "b", coordinates: { x: 1, y: 0, z: 0 } },
        { id: "c", coordinates: { x: 2, y: 0, z: 0 } },
      ]),
    ).toEqual([
      { fromId: "a", toId: "b" },
      { fromId: "b", toId: "c" },
    ]);
  });

  it("connects axis-aligned points across multiple steps when nothing blocks them", () => {
    expect(
      createStandardCubicConnections([
        { id: "a", coordinates: { x: 0, y: 0, z: 0 } },
        { id: "c", coordinates: { x: 2, y: 0, z: 0 } },
      ]),
    ).toEqual([{ fromId: "a", toId: "c" }]);
  });

  it("does not connect points that are not aligned on a cubic axis", () => {
    expect(
      createStandardCubicConnections([
        { id: "a", coordinates: { x: 0, y: 0, z: 0 } },
        { id: "c", coordinates: { x: 1, y: 1, z: 0 } },
      ]),
    ).toEqual([]);
  });
});

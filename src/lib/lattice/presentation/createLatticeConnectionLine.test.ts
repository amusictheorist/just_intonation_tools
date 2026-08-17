import { describe, expect, it } from "vitest";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import { createLatticeConnectionLine } from "./createLatticeConnectionLine";

describe("createLatticeConnectionLine", () => {
  it("creates a line between the scene connection endpoints", () => {
    const connection = {
      fromId: "ratio-1",
      toId: "ratio-2",
      fromPosition: { x: 1, y: 2, z: 3 },
      toPosition: { x: 4, y: 5, z: 6 },
    } satisfies LatticeSceneConnection;

    const line = createLatticeConnectionLine(connection);

    const positionAttribute = line.geometry.getAttribute("position");

    expect(positionAttribute.count).toBe(2);

    expect(positionAttribute.getX(0)).toBe(1);
    expect(positionAttribute.getY(0)).toBe(2);
    expect(positionAttribute.getZ(0)).toBe(3);

    expect(positionAttribute.getX(1)).toBe(4);
    expect(positionAttribute.getY(1)).toBe(5);
    expect(positionAttribute.getZ(1)).toBe(6);
  });

  it("stores the connection endpoint ids on the line", () => {
    const connection = {
      fromId: "ratio-1",
      toId: "ratio-2",
      fromPosition: { x: 1, y: 2, z: 3 },
      toPosition: { x: 4, y: 5, z: 6 },
    } satisfies LatticeSceneConnection;

    const line = createLatticeConnectionLine(connection);

    expect(line.userData.fromLatticeScenePointId).toBe("ratio-1");
    expect(line.userData.toLatticeScenePointId).toBe("ratio-2");
  });
});

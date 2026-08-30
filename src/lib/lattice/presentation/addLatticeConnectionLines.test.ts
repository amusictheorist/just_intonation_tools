import * as THREE from "three";
import { describe, expect, it } from "vitest";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import { addLatticeConnectionLines } from "./addLatticeConnectionLines";

describe("addLatticeConnectionLines", () => {
  it("adds a line for each scene connection", () => {
    const scene = new THREE.Scene();

    const sceneConnections = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        fromPosition: { x: 0, y: 0, z: 0 },
        toPosition: { x: 1, y: 0, z: 0 },
      },
      {
        fromId: "ratio-2",
        toId: "ratio-3",
        fromPosition: { x: 1, y: 0, z: 0 },
        toPosition: { x: 1, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeSceneConnection[];

    addLatticeConnectionLines(scene, sceneConnections);

    expect(scene.children).toHaveLength(2);

    expect(scene.children[0]?.userData.fromLatticeScenePointId).toBe("ratio-1");
    expect(scene.children[0]?.userData.toLatticeScenePointId).toBe("ratio-2");
    expect(scene.children[1]?.userData.fromLatticeScenePointId).toBe("ratio-2");
    expect(scene.children[1]?.userData.toLatticeScenePointId).toBe("ratio-3");
  });

  it("returns the lines it adds to the scene", () => {
    const scene = new THREE.Scene();

    const sceneConnections = [
      {
        fromId: "ratio-1",
        toId: "ratio-2",
        fromPosition: { x: 0, y: 0, z: 0 },
        toPosition: { x: 1, y: 0, z: 0 },
      },
      {
        fromId: "ratio-2",
        toId: "ratio-3",
        fromPosition: { x: 1, y: 0, z: 0 },
        toPosition: { x: 1, y: 1, z: 0 },
      },
    ] satisfies readonly LatticeSceneConnection[];

    const lines = addLatticeConnectionLines(scene, sceneConnections);

    expect(lines).toHaveLength(2);
    expect(lines[0]).toBe(scene.children[0]);
    expect(lines[1]).toBe(scene.children[1]);
  });
});

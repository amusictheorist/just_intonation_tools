import * as THREE from "three";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import { createLatticeConnectionLine } from "./createLatticeConnectionLine";

export function addLatticeConnectionLines(
  scene: THREE.Scene,
  sceneConnections: readonly LatticeSceneConnection[],
): readonly THREE.Line[] {
  const lines: THREE.Line[] = [];

  for (const sceneConnection of sceneConnections) {
    const line = createLatticeConnectionLine(sceneConnection);
    scene.add(line);
    lines.push(line);
  }

  return lines;
}

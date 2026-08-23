import * as THREE from "three";
import type { LatticeSceneConnection } from "./latticeSceneConnection";
import { createLatticeConnectionLine } from "./createLatticeConnectionLine";

/**
 * Creates and adds connection lines for the supplied scene connections.
 *
 * @param scene The Three.js scene that receives the connection lines.
 * @param sceneConnections The scene connections to render.
 * @returns The connection lines added to the scene, in input order.
 */

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

import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { addLatticePointMeshes } from "./addLatticePointMeshes";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import { addLatticeConnectionLines } from "../../../lib/lattice/presentation/addLatticeConnectionLines";

export class LatticeSceneRenderer {
  readonly scene: THREE.Scene;
  pointMeshes: readonly THREE.Mesh[];
  connectionLines: readonly THREE.Line[];

  constructor(
    scenePoints: readonly LatticeScenePoint[],
    sceneConnections: readonly LatticeSceneConnection[] = [],
  ) {
    this.scene = new THREE.Scene();

    this.pointMeshes = addLatticePointMeshes(this.scene, scenePoints);
    this.connectionLines = addLatticeConnectionLines(
      this.scene,
      sceneConnections,
    );
  }

  setScene(
    scenePoints: readonly LatticeScenePoint[],
    sceneConnections: readonly LatticeSceneConnection[],
  ): void {
    this.disposePointMeshes();
    this.disposeConnectionLines();

    this.pointMeshes = addLatticePointMeshes(this.scene, scenePoints);
    this.connectionLines = addLatticeConnectionLines(
      this.scene,
      sceneConnections,
    );
  }

  dispose(): void {
    this.disposePointMeshes();
    this.disposeConnectionLines();
  }

  private disposePointMeshes(): void {
    for (const mesh of this.pointMeshes) {
      this.scene.remove(mesh);
      mesh.geometry.dispose();

      const material = mesh.material;

      if (Array.isArray(material)) {
        for (const item of material) item.dispose();
        continue;
      }

      material.dispose();
    }

    this.pointMeshes = [];
  }

  private disposeConnectionLines(): void {
    for (const line of this.connectionLines) {
      this.scene.remove(line);
      line.geometry.dispose();

      const material = line.material;

      if (Array.isArray(material)) {
        for (const item of material) item.dispose();
        continue;
      }

      material.dispose();
    }

    this.connectionLines = [];
  }
}

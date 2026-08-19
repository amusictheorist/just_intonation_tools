import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { addLatticePointMeshes } from "./addLatticePointMeshes";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import { addLatticeConnectionLines } from "../../../lib/lattice/presentation/addLatticeConnectionLines";
import { addLatticeSceneLights } from "./addLatticeSceneLights";

type LatticeSceneRendererOptions = Readonly<{
  higherPrimeColor?: THREE.ColorRepresentation;
}>;

export class LatticeSceneRenderer {
  readonly scene: THREE.Scene;
  pointMeshes: readonly THREE.Mesh[];
  connectionLines: readonly THREE.Line[];
  private higherPrimeColor: THREE.ColorRepresentation | undefined;

  constructor(
    scenePoints: readonly LatticeScenePoint[],
    sceneConnections: readonly LatticeSceneConnection[] = [],
    options: LatticeSceneRendererOptions = {},
  ) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color("white");
    addLatticeSceneLights(this.scene);

    this.higherPrimeColor = options.higherPrimeColor;

    this.pointMeshes = addLatticePointMeshes(this.scene, scenePoints, {
      higherPrimeColor: this.higherPrimeColor,
    });
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

    this.pointMeshes = addLatticePointMeshes(this.scene, scenePoints, {
      higherPrimeColor: this.higherPrimeColor,
    });
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
      this.disposePointLabelSprites(mesh);

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

  setHigherPrimeColor(color: THREE.ColorRepresentation): void {
    this.higherPrimeColor = color;

    for (const mesh of this.pointMeshes) {
      if (!mesh.userData.hasHigherPrimeFactors) continue;

      const material = mesh.material;

      if (!(material instanceof THREE.MeshStandardMaterial)) continue;

      material.color.set(color);
      material.needsUpdate = true;
    }
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

  private disposePointLabelSprites(mesh: THREE.Mesh): void {
    for (const child of mesh.children) {
      if (!(child instanceof THREE.Sprite)) continue;

      child.material.map?.dispose();
      child.material.dispose();
    }
  }
}

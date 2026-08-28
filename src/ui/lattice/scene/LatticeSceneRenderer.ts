import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { addLatticePointMeshes } from "./addLatticePointMeshes";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import { addLatticeConnectionLines } from "../../../lib/lattice/presentation/addLatticeConnectionLines";
import { addLatticeSceneLights } from "./addLatticeSceneLights";

type LatticeSceneRendererOptions = Readonly<{
  higherPrimeColor?: THREE.ColorRepresentation;
}>;

/**
 * Owns the renderable objects that represent the current lattice scene.
 *
 * Point meshes are preserved across scene updates when their lattice-point
 * identities remain stable, allowing their positions to interpolate smoothly
 * toward new targets. Connection lines are recreated as scene data changes and
 * updated each frame to follow the current point-mesh positions.
 *
 * Owned Three.js resources are disposed when removed or when the renderer is
 * disposed.
 */

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

  /**
   * Synchronizes the rendered lattice points and connections with new scene data.
   *
   * Existing point meshes are preserved when their ids remain present and are
   * assigned new target positions. New point meshes are created, removed meshes
   * are disposed, and connection lines are rebuilt for the supplied connections.
   *
   * @param scenePoints The scene points to render.
   * @param sceneConnections The scene connections to render.
   * @returns Nothing.
   */

  setScene(
    scenePoints: readonly LatticeScenePoint[],
    sceneConnections: readonly LatticeSceneConnection[],
  ): void {
    const existingMeshesById = new Map(
      this.pointMeshes.map((mesh) => [
        mesh.userData.latticeScenePointId as string,
        mesh,
      ]),
    );

    const nextPointMeshes: THREE.Mesh[] = [];

    for (const scenePoint of scenePoints) {
      const existingMesh = existingMeshesById.get(scenePoint.id);

      if (existingMesh) {
        existingMesh.userData.targetPosition = {
          x: scenePoint.position.x,
          y: scenePoint.position.y,
          z: scenePoint.position.z,
        };

        nextPointMeshes.push(existingMesh);
        existingMeshesById.delete(scenePoint.id);
        continue;
      }

      const [newMesh] = addLatticePointMeshes(this.scene, [scenePoint], {
        higherPrimeColor: this.higherPrimeColor,
      });

      if (!newMesh) continue;

      newMesh.userData.targetPosition = {
        x: scenePoint.position.x,
        y: scenePoint.position.y,
        z: scenePoint.position.z,
      };

      nextPointMeshes.push(newMesh);
    }

    for (const removedMesh of existingMeshesById.values()) {
      this.disposePointMesh(removedMesh);
    }

    this.pointMeshes = nextPointMeshes;

    this.disposeConnectionLines();
    this.connectionLines = addLatticeConnectionLines(
      this.scene,
      sceneConnections,
    );
  }
  /**
   * Advances point-mesh interpolation toward each mesh's target position and
   * updates connection-line endpoints to match the current interpolated point positions.
   *
   * @param deltaSeconds The elapsed time since the previous animation frame, in seconds.
   * @returns Nothing.
   */

  update(deltaSeconds: number): void {
    const smoothing = 12;
    const alpha = 1 - Math.exp(-smoothing * deltaSeconds);

    for (const mesh of this.pointMeshes) {
      const target = mesh.userData.targetPosition;

      if (!target) continue;

      mesh.position.lerp(
        new THREE.Vector3(target.x, target.y, target.z),
        alpha,
      );
    }

    this.updateConnectionLines();
  }

  /**
   * Updates connection-line endpoints from the current positions of their
   * associated lattice point meshes.
   *
   * @returns Nothing.
   */

  private updateConnectionLines(): void {
    const pointMeshesById = new Map(
      this.pointMeshes.map((mesh) => [
        mesh.userData.latticeScenePointId as string,
        mesh,
      ]),
    );

    for (const line of this.connectionLines) {
      const fromId = line.userData.fromLatticeScenePointId;
      const toId = line.userData.toLatticeScenePointId;

      const fromMesh = pointMeshesById.get(fromId);
      const toMesh = pointMeshesById.get(toId);

      if (!fromMesh || !toMesh) continue;

      const positions = line.geometry.getAttribute("position");

      positions.setXYZ(
        0,
        fromMesh.position.x,
        fromMesh.position.y,
        fromMesh.position.z,
      );

      positions.setXYZ(
        1,
        toMesh.position.x,
        toMesh.position.y,
        toMesh.position.z,
      );

      positions.needsUpdate = true;
    }
  }

  /**
   * Removes and disposes a single lattice point mesh and its owned label resources.
   *
   * @param mesh The point mesh to remove and dispose.
   * @returns Nothing.
   */

  private disposePointMesh(mesh: THREE.Mesh): void {
    this.disposePointLabelSprites(mesh);

    this.scene.remove(mesh);
    mesh.geometry.dispose();

    const material = mesh.material;

    if (Array.isArray(material)) {
      for (const item of material) item.dispose();
      return;
    }

    material.dispose();
  }

  /**
   * Disposes all point-mesh and connection-line resources owned by the renderer.
   *
   * @returns Nothing.
   */

  dispose(): void {
    this.disposePointMeshes();
    this.disposeConnectionLines();
  }

  /**
   * Removes and disposes all currently owned lattice point meshes.
   *
   * @returns Nothing.
   */
  private disposePointMeshes(): void {
    for (const mesh of this.pointMeshes) {
      this.disposePointMesh(mesh);
    }

    this.pointMeshes = [];
  }

  /**
   * Updates the color used by existing and subsequently created higher-prime points.
   *
   * @param color The Three.js color representation to apply.
   * @returns Nothing.
   */

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

  /**
   * Removes and disposes all currently owned lattice connection lines.
   *
   * @returns Nothing.
   */

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

  /**
   * Disposes label sprites and their owned texture resources for a point mesh.
   *
   * @param mesh The point mesh whose label sprites should be disposed.
   * @returns Nothing.
   */

  private disposePointLabelSprites(mesh: THREE.Mesh): void {
    for (const child of mesh.children) {
      if (!(child instanceof THREE.Sprite)) continue;

      child.material.map?.dispose();
      child.material.dispose();
    }
  }
}

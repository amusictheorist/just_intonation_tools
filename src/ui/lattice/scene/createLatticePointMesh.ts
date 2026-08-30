import * as THREE from "three";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { createLatticePointLabelSprite } from "./createLatticePointLabelSprite";
import {
  DEFAULT_HIGHER_PRIME_POINT_COLOR,
  DEFAULT_LATTICE_POINT_COLOR,
} from "../../../lib/lattice/presentation/latticePointStyle";

type CreateLatticePointMeshOptions = Readonly<{
  higherPrimeColor?: THREE.ColorRepresentation;
}>;

/**
 * Creates a Three.js mesh representing a lattice scene point.
 *
 * The mesh stores scene-point metadata in `userData` and includes a label
 * sprite derived from the point's presentation label ratio.
 *
 * @param scenePoint The renderer-ready lattice scene point to represent.
 * @param options Optional point-mesh appearance settings.
 * @returns The Three.js mesh representing the scene point.
 */

export function createLatticePointMesh(
  scenePoint: LatticeScenePoint,
  options: CreateLatticePointMeshOptions = {},
): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);

  const higherPrimeColor =
    options.higherPrimeColor ?? DEFAULT_HIGHER_PRIME_POINT_COLOR;

  const color = scenePoint.hasHigherPrimeFactors
    ? higherPrimeColor
    : DEFAULT_LATTICE_POINT_COLOR;

  const material = new THREE.MeshStandardMaterial({ color });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(
    scenePoint.position.x,
    scenePoint.position.y,
    scenePoint.position.z,
  );

  mesh.userData.latticeScenePointId = scenePoint.id;
  mesh.userData.hasHigherPrimeFactors = scenePoint.hasHigherPrimeFactors;

  const labelText = `${scenePoint.labelRatio.numerator}/${scenePoint.labelRatio.denominator}`;
  const label = createLatticePointLabelSprite(labelText);

  label.position.set(0, 0.4, 0);

  mesh.add(label);

  return mesh;
}

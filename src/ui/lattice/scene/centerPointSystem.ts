import * as THREE from "three";
import type { LatticePointMesh } from "./types";
import { createLabel } from "./labelFactory";

export const createCenterPoint = (
  scene: THREE.Scene,
  points: LatticePointMesh[],
): LatticePointMesh => {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);

  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 1,
  });

  const mesh = new THREE.Mesh(geometry, material) as LatticePointMesh;

  mesh.position.set(0, 0, 0);

  mesh.userData = {
    lattice: [0, 0, 0],
    latticeType: "global",
    primeAnchor: null,
    octaveLabel: "1/1",
    rawInput: "1/1",
    rawValue: 1,
    octaveValue: 1,
    canonicalKey: "1/1",
  };

  scene.add(mesh);
  points.push(mesh);

  const sprite = createLabel("1/1");
  sprite.material.opacity = 1;
  sprite.position.set(0, 0.4, 0);

  scene.add(sprite);
  mesh.userData.labelSprite = sprite;

  return mesh;
};

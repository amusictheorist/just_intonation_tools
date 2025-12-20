import * as THREE from 'three';
import { createLabel } from './LabelFactory';

export const createCenterPoint = (scene, points) => {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    transparent: true,
    opacity: 1
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.userData = {
    lattice: [0, 0, 0],
    latticeType: 'global',
    octabeLabel: '1/1'
  };

  scene.add(mesh);
  points.push(mesh);

  const sprite = createLabel('1/1');
  sprite.material.opacity = 1;
  sprite.position.set(0, 0.4, 0);
  scene.add(sprite);

  mesh.userData.labelSprite = sprite;
};
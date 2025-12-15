import * as THREE from 'three';
import { createLabel } from './LabelFactory';

const SPACING = 2;

export const createPoint = ({ x, y, z, label, color, data }) => {
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    transparent: true,
    opacity: 0
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(x * SPACING, y * SPACING, z * SPACING);

  mesh.userData = {
    ...data,
    lattice: data?.lattice ?? [x, y, z],
    latticeType: data?.latticeType ?? 'global',
    octaveLabel: data?.octaveLabel ?? label,
    rawInput: data?.rawInput ?? null,
    rawValue: data?.canonical.value ?? null,
    octaveValue: data?.octave?.value ?? null
  };

  if (label) {
    const sprite = createLabel(label);
    sprite.material.opacity = 0;
    sprite.position.set(x * SPACING, y * SPACING + 0.4, z * SPACING);
    mesh.userData.labelSprite = sprite;
  }

  return mesh;
};
import * as THREE from 'three';

export const tryConnect = (scene, connections, p1, p2) => {
  const [x1, y1, z1] = p1.userData.lattice;
  const [x2, y2, z2] = p2.userData.lattice;

  const sameX = x1 === x2;
  const sameY = y1 === y2;
  const sameZ = z1 === z2;

  const axesDifferent = (sameX ? 0 : 1) +
                        (sameY ? 0 : 1) +
                        (sameZ ? 0 : 1);
  
  if (axesDifferent !== 1) return;

  const geometry = new THREE.BufferGeometry().setFromPoints([
    p1.position,
    p2.position
  ]);

  const material = new THREE.LineBasicMaterial({
    color: 0x999999,
    transparent: true,
    opacity: 0
  });

  const line = new THREE.Line(geometry, material);

  scene.add(line);
  connections.push(line);

  return line;
};
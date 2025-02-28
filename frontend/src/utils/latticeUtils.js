import * as THREE from 'three';

const factorize = (numerator, denominator) => {
  const factors = {};
  const primeFactorize = (num, sign = 1) => {
    let n = Math.abs(num);
    for (let i = 2; i <= n; i++) {
      while (n % i === 0) {
        factors[i] = (factors[i] || 0) + sign;
        n /= i;
      }
    }
  };
  primeFactorize(numerator, 1);
  primeFactorize(denominator, -1);
  return factors;
};

const computePosition = (factors, spacing = 2) => {
  let x = 0, y = 0, z = 0;
  Object.entries(factors).forEach(([prime, exponent]) => {
    if (parseInt(prime) === 3) x = exponent * spacing;
    if (parseInt(prime) === 5) y = exponent * spacing;
    if (parseInt(prime) === 7) z = exponent * spacing;
  });
  return { x, y, z };
};

const addLabels = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 512;
  canvas.height = 128;

  context.fillStyle = 'white';
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'black';
  context.font = '64px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.transparent = true;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 0.5, 1);
  return sprite;
};

export const generateLattice = (newRatio, scene, spheresRef) => {
  // console.log('Generating lattice for: ', newRatio);
  // console.log('Current spheres before adding: ', spheresRef.current);
  const [numerator, denominator] = newRatio.split('/').map(Number);
  if (isNaN(numerator) || isNaN(denominator)) {
    console.error("Invalid ratio input:", newRatio);
    return;
  }

  const factors = factorize(numerator, denominator);
  const position = computePosition(factors);

  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 'red' });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(position.x, position.y, position.z);

  const label = addLabels(newRatio);
  label.position.set(position.x, position.y + 0.4, position.z);

  let line = null;
  if (spheresRef.current.length > 0) {
    const lastSphere = spheresRef.current[spheresRef.current.length - 1].sphere;
    const lastPosition = lastSphere.position;

    const points = [lastPosition, sphere.position];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    line = new THREE.Line(geometry, material);
    // scene.add(line);

    // console.log("Line created:", line);
  }

  spheresRef.current.push({ sphere, label, line });
  scene.add(sphere);
  scene.add(label);
  // console.log("Sphere, label, and line added at position: ", position);
  // console.log("Scene children: ", scene.children);
  // console.log("Spheres Ref content after adding:", spheresRef.current);
};

export const undoLast = (scene, spheresRef, renderer, camera) => {
  if (spheresRef.current.length > 0) {
    const lastObject = spheresRef.current.pop();
    const { sphere, label, line } = lastObject;

    if (sphere) scene.remove(sphere);
    if (label) scene.remove(label);
    if (line) scene.remove(line);

    // console.log('Removing Sphere, Label, and Line: ', lastObject);
    // console.log('Remaining Spheres: ', spheresRef.current);

    if (renderer && camera) {
      renderer.render(scene, camera);
    }
  } else {
    // console.log("No spheres left to remove");
  }
};

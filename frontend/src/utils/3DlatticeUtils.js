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

const computeCubicPosition = (factors, spacing = 2) => {
  let x = 0, y = 0, z = 0;
  
  Object.entries(factors).forEach(([prime, exponent]) => {
    prime = parseInt(prime);
    
    if (prime === 3) x += exponent * spacing;
    else if (prime === 5) y += exponent * spacing;
    else if (prime === 7) z += exponent * spacing;
  });

  return { x, y, z };
};

const computeRadialPosition = (factors, spacing = 2) => {
  let x = 0, y = 0, z = 0;
  
  Object.entries(factors).forEach(([prime, exponent]) => {
    prime = parseInt(prime);

    if (prime > 7) {
      const index = Math.log2(prime);
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      const theta = 2 * Math.PI * ((index * goldenRatio) % 1);
      const phi = Math.acos(1 - (2 * (index % 1)));

      let r = spacing * Math.abs(exponent); 
      if (exponent < 0) r = -r;

      x += r * Math.sin(phi) * Math.cos(theta);
      y += r * Math.sin(phi) * Math.sin(theta);
      z += r * Math.cos(phi);
    }
  });

  return { x, y, z };
};


const addLabels = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = canvas.width = 512;
  const height = canvas.height = 128;
  
  context.fillStyle = 'black';
  context.clearRect(0, 0, width, height);
  context.font = '64px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, width / 2, height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.transparent = true;

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 0.5, 1);
  return sprite;
};

const findNeighbours = (position, spheresRef) => {
  const neighbours = [];
  
  spheresRef.current.forEach(({ sphere }) => {
    const { x, y, z } = sphere.position;

    const sameX = x === position.x && z === position.z;
    const sameY = y === position.y && z === position.z;
    const sameZ = x === position.x && y === position.y;

    if ((sameX && Math.abs(y - position.y) % 2 === 0) ||
        (sameY && Math.abs(x - position.x) % 2 === 0) ||
        (sameZ && Math.abs(z - position.z) % 2 === 0)) {
      neighbours.push({ x, y, z });
    }
  });

  return neighbours;
};

export const generate3DLattice = (ratio, scene, spheresRef) => {
  const [numerator, denominator] = ratio.split('/').map(Number);
  if (isNaN(numerator) || isNaN(denominator)) {
    console.error('Invalid ratio input: ', ratio);
    return;
  }

  const factors = factorize(numerator, denominator);
  
  let hasCubicPrime = false;
  let hasRadialPrime = false;

  Object.keys(factors).forEach(prime => {
    prime = parseInt(prime);
    if (prime === 3 || prime === 5 || prime === 7) {
      hasCubicPrime = true;
    } else if (prime > 7) {
      hasRadialPrime = true;
    }
  });

  let position;
  if (hasCubicPrime && !hasRadialPrime) {
    position = computeCubicPosition(factors);
  } else if (!hasCubicPrime && hasRadialPrime) {
    position = computeRadialPosition(factors);
  } else {
    const cubicPos = computeCubicPosition(factors);
    const radialPos = computeRadialPosition(factors);
    position = {
      x: cubicPos.x + radialPos.x,
      y: cubicPos.y + radialPos.y,
      z: cubicPos.z + radialPos.z,
    };
  }

  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: '#B22222' });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(position.x, position.y, position.z);

  const label = addLabels(ratio);
  label.position.set(position.x, position.y + 0.4, position.z);

  const lines = [];
  const neighbouringPositions = findNeighbours(position, spheresRef) || [];

  neighbouringPositions.forEach((neighbourPos) => {
    const points = [
      new THREE.Vector3(neighbourPos.x, neighbourPos.y, neighbourPos.z),
      new THREE.Vector3(position.x, position.y, position.z),
    ];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    geometry.computeBoundingSphere();
    const material = new THREE.LineBasicMaterial({ color: 'black' });
    const line = new THREE.Line(geometry, material);
    scene.add(line);
    lines.push(line);
  });

  spheresRef.current.push({ sphere, label, lines });
  scene.add(sphere);
  scene.add(label);
};

export const undo3DLast = (scene, spheresRef, renderer, camera) => {
  if (spheresRef.current.length === 0) return;

  let lastObject;
  do {
    lastObject = spheresRef.current.pop();
  } while (
    lastObject &&
    lastObject.sphere.position.x === 0 &&
    lastObject.sphere.position.y === 0 &&
    lastObject.sphere.position.z === 0 &&
    spheresRef.current.length > 0
  );

  if (!lastObject) return;

  const { sphere, label, lines } = lastObject;

  if (sphere) scene.remove(sphere);
  if (label) scene.remove(label);
  if (lines?.length) lines.forEach((line) => scene.remove(line));

  if (renderer && camera) {
    renderer.render(scene, camera);
  }
};

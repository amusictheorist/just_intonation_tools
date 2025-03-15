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

const computeRadialPosition = (factors, radiusFactor = 2, angleShift = 0) => {
  let x = 0, y = 0, z = 0;
  
  Object.entries(factors).forEach(([prime, exponent]) => {
    prime = parseInt(prime);

    if (prime > 7) {
      const index = Math.log2(prime);
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      
      // Apply the angleShift to theta calculation
      const theta = 2 * Math.PI * (((index * goldenRatio) + angleShift) % 1);
      const phi = Math.acos(1 - (2 * (index % 1)));

      let r = radiusFactor * Math.abs(exponent); 
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
    
    // Ensure only cubic lattice points are considered
    if (sphere.userData.isRadialPrime) return; // Skip radial primes

    // Check direct cubic connections (only along one axis at a time)
    const isCubicX = x !== position.x && y === position.y && z === position.z;
    const isCubicY = y !== position.y && x === position.x && z === position.z;
    const isCubicZ = z !== position.z && x === position.x && y === position.y;

    if (isCubicX || isCubicY || isCubicZ) {
      neighbours.push({ x, y, z });
    }
  });

  return neighbours;
};

export const generate3DLattice = (ratio, scene, spheresRef, radiusFactor = 2, angleShift = 0, radialColor = '#B22222') => {
  const [numerator, denominator] = ratio.split('/').map(Number);
  if (isNaN(numerator) || isNaN(denominator)) {
    console.error('Invalid ratio input: ', ratio);
    return false;
  }

  const factors = factorize(numerator, denominator);
  let hasRadialPrime = false;

  Object.keys(factors).forEach(prime => {
    if (parseInt(prime) > 7) {
      hasRadialPrime = true;
    }
  });

  // Compute positions correctly
  const cubicPos = computeCubicPosition(factors);
  const radialPos = hasRadialPrime ? computeRadialPosition(factors, radiusFactor, angleShift) : { x: 0, y: 0, z: 0 };
  const finalPos = {
    x: cubicPos.x + radialPos.x,
    y: cubicPos.y + radialPos.y,
    z: cubicPos.z + radialPos.z,
  };

  // Create sphere
  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: radialColor });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(finalPos.x, finalPos.y, finalPos.z);

  // Create label
  const label = addLabels(ratio);
  label.position.set(finalPos.x, finalPos.y + 0.4, finalPos.z);

  scene.add(sphere);
  scene.add(label);

  // Create connections only for cubic primes
  const lines = [];
  if (!hasRadialPrime) {
    const neighbouringPositions = findNeighbours(finalPos, spheresRef);
    neighbouringPositions.forEach((neighbourPos) => {
      const points = [
        new THREE.Vector3(neighbourPos.x, neighbourPos.y, neighbourPos.z),
        new THREE.Vector3(finalPos.x, finalPos.y, finalPos.z),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 'black' });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      lines.push(line);
    });
  }
  
  // Store sphere with additional data
  sphere.userData = { isRadialPrime: hasRadialPrime, factors, lines };
  spheresRef.current.push({ sphere, label, lines });

  return hasRadialPrime;
};

export const updateRadialPrimes = (scene, spheresRef, radiusFactor, angleShift, radialColor) => {
  spheresRef.current.forEach(({ sphere, label, lines }) => {
    // Update all radial primes regardless of the last placed sphere
    if (!sphere.userData.isRadialPrime) return; // Only update radial primes

    const factors = sphere.userData.factors;
    
    // Keep cubic position
    const cubicPos = computeCubicPosition(factors);
    const radialPos = computeRadialPosition(factors, radiusFactor, angleShift);

    // New final position
    const newX = cubicPos.x + radialPos.x;
    const newY = cubicPos.y + radialPos.y;
    const newZ = cubicPos.z + radialPos.z;

    // Move sphere and label
    sphere.position.set(newX, newY, newZ);
    label.position.set(newX, newY + 0.4, newZ);
    sphere.material.color.set(radialColor);

    // Remove old lines
    lines.forEach((line) => scene.remove(line));

    // Find new neighbours and redraw lines
    const neighbours = findNeighbours({ x: newX, y: newY, z: newZ }, spheresRef) || [];
    const newLines = [];

    neighbours.forEach((neighbourPos) => {
      const points = [
        new THREE.Vector3(neighbourPos.x, neighbourPos.y, neighbourPos.z),
        new THREE.Vector3(newX, newY, newZ),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 'black' });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      newLines.push(line);
    });

    // Update stored lines
    sphere.userData.lines = newLines;
  });
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

import * as THREE from 'three';

const captureRatio = (input) => {
  const ratio = {};
  ratio.string = input;

  const [numerator, denominator] = input.split('/').map(Number);

  if (isNaN(numerator) || isNaN(denominator) || denominator === 0) {
    console.error(`Invalid ratio captured: ${input}. Numerator: ${numerator}, Denominator: ${denominator}`);
    return null;
  }

  ratio.values = [numerator, denominator];
  // console.log('Captured ratio:', ratio);
  return ratio;
};


const log2 = (n) => Math.log(n) / Math.log(2);

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const closestPowerOf2 = (n) => {
  if (n <= 0) return null;
  const exponent = Math.floor(Math.log2(n));
  return Math.pow(2, exponent);
};

const analyzeNumber = (n) => {
  if (isPrime(n)) {
    return {
      type: 'prime', base: n, exponent: 1, isPerfectPower: false, closestPowerOf2: closestPowerOf2(n)
    };
  }
  for (let base = 2; base <= Math.sqrt(n); base++) {
    let exponent = 2;
    while (Math.pow(base, exponent) <= n) {
      if (Math.pow(base, exponent) === n) {
        return { type: 'perfectPower', base, exponent, isPerfectPower: true, closestPowerOf2: closestPowerOf2(n) };
      }
      exponent++;
    }
  }
  return { type: 'composite', base: n, exponent: 1, isPerfectPower: false, closestPowerOf2: closestPowerOf2(n) };
};

const factorize = (input) => {
  const ratio = captureRatio(input);
  if (!ratio) {
    console.error('Factorization aborted due to invalid ratio.');
    return {};
  }

  const { values: [numerator, denominator] } = ratio;
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

  // console.log('Factorization result:', factors);
  return factors;
};


const computePosition = (factors, input, spacing = 2, visualizationMode = '3D') => {
  let x = 0, y = 0, z = 0;

  if (visualizationMode === '3D') {
    Object.entries(factors).forEach(([prime, exponent]) => {
      const parsedPrime = parseInt(prime);
      // console.log(`Prime: ${parsedPrime}, Exponent: ${exponent}, Spacing: ${spacing}`);
    
      if (parsedPrime === 3) {
        x = exponent * spacing;
        // console.log(`Computed x: ${x}`);
      }
      if (parsedPrime === 5) {
        y = exponent * spacing;
        // console.log(`Computed y: ${y}`);
      }
      if (parsedPrime === 7) {
        z = exponent * spacing;
        // console.log(`Computed z: ${z}`);
      }
    });
    

  } else if (visualizationMode === '2D') {
    const ratioData = captureRatio(input);
    if (!ratioData) {
      console.error('Invalid ratio data for 2D visualization.');
      return { x: 0, y: 0, z: 0 };
    }

    const { values: [numerator, denominator] } = ratioData;
    const ratio = numerator / denominator;

    if (!Number.isFinite(ratio) || isNaN(ratio)) {
      console.error(`Invalid ratio computed: ${ratio}. Numerator: ${numerator}, Denominator: ${denominator}`);
      return { x: 0, y: 0, z: 0 };
    }

    const analysis = analyzeNumber(numerator);
    // console.log('Number analysis:', analysis);
    let r = 2;

    if (analysis.type === 'prime') {
      const angle = log2(ratio) * 360;
      const radians = angle * (Math.PI / 180);
      x = r * Math.sin(radians);
      y = r * Math.cos(radians);
      // console.log(`Prime Position (angle: ${angle}, radians: ${radians}): x=${x}, y=${y}`);

    } else if (analysis.type === 'perfectPower') {
      const base = analysis.base;
      const baseRatio = base / closestPowerOf2(base);

      if (!Number.isFinite(baseRatio) || isNaN(baseRatio)) {
        console.error(`Invalid base ratio: ${baseRatio}. Base: ${base}`);
        return { x: 0, y: 0, z: 0 };
      }

      const angle = log2(baseRatio) * 360;
      const radians = angle * (Math.PI / 180);
      r *= analysis.exponent;
      x = r * Math.sin(radians);
      y = r * Math.cos(radians);
      // console.log(`Perfect Power Position: x=${x}, y=${y}`);

    } else if (analysis.type === 'composite') {
      const primeFactors = Object.entries(factors).filter(([prime, exp]) => exp > 0);

      if (primeFactors.length === 2) {
        const [[prime1, exp1], [prime2, exp2]] = primeFactors.map(([p, e]) => [parseInt(p), e]);
        // console.log('Composite Primes:', { prime1, exp1, prime2, exp2 });

        const primeRatio1 = prime1 / closestPowerOf2(prime1);
        const primeRatio2 = prime2 / closestPowerOf2(prime2);

        if (isNaN(primeRatio1) || isNaN(primeRatio2)) {
          console.error(`Invalid prime ratios: prime1=${primeRatio1}, prime2=${primeRatio2}`);
          return { x: 0, y: 0, z: 0 };
        }

        const angle1 = log2(primeRatio1) * 360;
        const radians1 = angle1 * (Math.PI / 180);
        const angle2 = log2(primeRatio2) * 360;
        const radians2 = angle2 * (Math.PI / 180);

        const r1 = 2 * exp1;
        const r2 = 2 * exp2;

        x = r1 * Math.sin(radians1) + r2 * Math.sin(radians2);
        y = r1 * Math.cos(radians1) + r2 * Math.cos(radians2);

        // console.log('Composite Position:', { x, y });
      }
    }
  }

  // console.log('Computed position:', { x, y, z });
  if (isNaN(x) || isNaN(y) || isNaN(z)) {
    console.error('NaN detected in computed position:', { x, y, z });
  }
  return { x, y, z };
};


const addLabels = (text) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const width = canvas.width = 512;
  const height = canvas.height = 128;
  context.fillStyle = 'white';
  context.clearRect(0, 0, width, height);
  context.fillStyle = 'black';
  context.font = '64px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, width / 2, height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.transparent = true;
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(2, 0.5, 1);
  return sprite;
};

// const createLine = (start, end) => {
//   const material = new THREE.LineBasicMaterial({ color: 'black' });
//   const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
//   const line = new THREE.Line(geometry, material);
//   return line;
// }

export const generateLattice = (input, scene, spheresRef, visualizationMode = '3D') => {
  console.log('generating ratio for ', input);
  console.log('visualization mode: ', visualizationMode);

  const { string } = captureRatio(input);
  const factors = factorize(input);
  const position = computePosition(factors, input, 2, visualizationMode);

  if (isNaN(position.x) || isNaN(position.y) || isNaN(position.z)) {
    console.error('Invalid position detected. Skipping object creation.', position);
    return;
  }

  const geometry = new THREE.SphereGeometry(0.2, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 'red' });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.set(position.x, position.y, position.z);

  const label = addLabels(string);
  label.position.set(position.x, position.y + 0.4, position.z);

  spheresRef.current.push({ sphere, label });
  console.log('Adding sphere at position ', sphere.position);
  console.log('Adding label at position ', label.position);
  scene.add(sphere);
  scene.add(label);

  // const createdSpheres = new Set();
  // createdSpheres.add(`${position.x},${position.y},${position.z}`);

  // // Line Creation Logic Based on Visualization Mode
  // if (visualizationMode === '3D') {
  //   // For 3D mode, create lines connecting spheres along the cubic lattice

  //   // Define neighboring positions in the cubic lattice
  //   const neighbors = [
  //     new THREE.Vector3(position.x + 1, position.y, position.z), // x + 1
  //     new THREE.Vector3(position.x - 1, position.y, position.z), // x - 1
  //     new THREE.Vector3(position.x, position.y + 1, position.z), // y + 1
  //     new THREE.Vector3(position.x, position.y - 1, position.z), // y - 1
  //     new THREE.Vector3(position.x, position.y, position.z + 1), // z + 1
  //     new THREE.Vector3(position.x, position.y, position.z - 1)  // z - 1
  //   ];

  //   // Create lines to each neighboring sphere if they already exist
  //   neighbors.forEach((neighborPos) => {
  //     if (createdSpheres.has(`${neighborPos.x},${neighborPos.y},${neighborPos.z}`)) {
  //       const line = createLine(sphere.position, neighborPos);
  //       scene.add(line);
  //       console.log('Adding line from ', sphere.position, ' to ', neighborPos);
  //     }
  //   });
  // }

  // if (visualizationMode === '2D') {
  //   // For 2D mode, create lines based on prime ratios and their connections
  //   const { values: [numerator, denominator] } = captureRatio(input);
  //   const ratio = numerator / denominator;
  //   const analysis = analyzeNumber(numerator);

  //   // Prime ratios: Connect to 1/1
  //   if (analysis.type === 'prime') {
  //     const line = createLine(sphere.position, new THREE.Vector3(0, 0, 0)); // Connect to 1/1 sphere
  //     scene.add(line);
  //   }

  //   // Perfect powers: Connect to base ratio
  //   if (analysis.type === 'perfectPower') {
  //     const baseRatio = analysis.base / closestPowerOf2(analysis.base);
  //     const baseSpherePosition = computePosition(factorize(`${analysis.base}/1`), `${analysis.base}/1`, visualizationMode);
  //     const line = createLine(sphere.position, new THREE.Vector3(baseSpherePosition.x, baseSpherePosition.y, baseSpherePosition.z));
  //     scene.add(line);
  //   }

  //   // Composite ratios: Connect to prime factors
  //   if (analysis.type === 'composite') {
  //     const primeFactors = Object.entries(factors).filter(([prime, exp]) => exp > 0);
  //     primeFactors.forEach(([prime, exp]) => {
  //       const primeRatioSpherePosition = computePosition({ [prime]: exp }, prime, visualizationMode);
  //       const line = createLine(sphere.position, new THREE.Vector3(primeRatioSpherePosition.x, primeRatioSpherePosition.y, primeRatioSpherePosition.z));
  //       scene.add(line);
  //     });
  //   }
  // }
};

export const undoLast = () => { };

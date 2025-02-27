import React, { useEffect, useRef, useState } from "react";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";

const rendererRef = useRef(null);
const cameraRef = useRef(null);

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
    const factor = parseInt(prime);
    if (factor === 3) x = exponent * spacing;
    else if (factor === 5) y = -exponent * spacing;
    else if (factor === 7) z = exponent * spacing;
  });
  return new THREE.Vector3(x, y, z);
};

const LatticePage = () => {
  const mountRef = useRef(null);
  const [ratios, setRatios] = useState(['1/1']);
  const spheresRef = useRef([]);
  const sceneRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 10);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
    
    const addSphere = (ratio) => {
      const [numerator, denominator] = ratio.split('/').map(Number);
      const factors = factorize(numerator, denominator);
      const position = computePosition(factors);

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.copy(position);
      scene.add(sphere);

      spheresRef.current.push({ ratio, factors, position, sphere });

      if (spheresRef.current.length > 1) {
        let parentSphere = null;
        spheresRef.current.forEach((existingSphere) => {
          if (existingSphere.ratio == ratio) return;

          let diffCount = 0;
          Object.keys(factors).forEach((prime) => {
            const diff = Math.abs((factors[prime] || 0) - (existingSphere.factors[prime] || 0));
            if (diff > 0) diffCount += diff;
          });

          if (diffCount === 1) {
            parentSphere = existingSphere;
          }
        });

        if (parentSphere) {
          const points = [parentSphere.position.clone(), position.clone()];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({ color: 0x00000 });
          const line = new THREE.Line(geometry, material);
          scene.add(line);
        }
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = 512;
      canvas.height = 256;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = '64px Arial';
      context.fillStyle = 'black';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(ratio, canvas.width / 2, canvas.height / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.transparent = true;

      const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.position.set(position.x, position.y + 0.6, position.z);
      sprite.scale.set(2, 1, 1);
      scene.add(sprite);
    };

    ratios.forEach((ratio) => addSphere(ratio));

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  const handleAddRatio = (event) => {
    event.preventDefault();
    const inputRatio = event.target.elements.ratio.value.trim();
  
    if (/^\d+\/\d+$/.test(inputRatio)) {
      setRatios((prevRatios) => [...prevRatios, inputRatio]);
  
      if (sceneRef.current) {
        const [numerator, denominator] = inputRatio.split('/').map(Number);
        const factors = factorize(numerator, denominator);
        const position = computePosition(factors);
  
        console.log("New Sphere Position:", position);
  
        // Create sphere
        const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const sphereMaterial = new THREE.MeshStandardMaterial({ color: 'red' });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(position);
        sceneRef.current.add(sphere);
  
        // Store sphere
        spheresRef.current.push({ ratio: inputRatio, factors, position, sphere });
  
        // **Find the parent sphere**
        let parentSphere = null;
        let minDiffCount = Infinity;
  
        spheresRef.current.forEach((existingSphere) => {
          if (existingSphere.ratio === inputRatio) return;
  
          let diffCount = 0;
          Object.keys(factors).forEach((prime) => {
            const diff = Math.abs((factors[prime] || 0) - (existingSphere.factors[prime] || 0));
            if (diff > 0) diffCount += diff;
          });
  
          if (diffCount === 1 && diffCount < minDiffCount) {
            parentSphere = existingSphere;
            minDiffCount = diffCount;
          }
        });
  
        console.log("Parent Sphere:", parentSphere);
  
        // **Draw the line**
        if (parentSphere) {
          console.log("Adding line between", parentSphere.position, "and", position);
  
          const points = new Float32Array([
            parentSphere.position.x, parentSphere.position.y, parentSphere.position.z,
            position.x, position.y, position.z
          ]);
  
          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
  
          const material = new THREE.LineBasicMaterial({ color: 0x000000 });
          const line = new THREE.Line(geometry, material);
  
          sceneRef.current.add(line);
        }
  
        // Force re-render
        if (rendererRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      }
    }
    event.target.reset();
  };

  return (
    <div>
      <form onSubmit={handleAddRatio}>
        <input type="text" name="ratio" placeholder="Enter ratio (e.g. 3/2)" required />
        <button type="submit">Add Ratio</button>
      </form>
      <div ref={mountRef} style={{ width: '100vw', height: '90vh' }} />
    </div>
  );
};

export default LatticePage;
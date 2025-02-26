import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const decimalToFraction = (decimal, tolerance = 1e-6) => {
  let numerator = 1;
  let denominator = 1;
  let error = Math.abs(numerator / denominator - decimal);

  while (error > tolerance) {
    if (numerator / denominator < decimal) {
      numerator++;
    } else {
      denominator++;
      numerator = Math.round(decimal * denominator);
    }
    error = Math.abs(numerator / denominator - decimal);
  }

  return `${numerator}/${denominator}`;
};

const generate5LimitLattice = (steps = 2, spacing = 2) => {
  const lattice = [];
  const primeIntervals = { 3: 3 / 2, 5: 5 / 4, 7: 7 / 4 };

  for (let p = -steps; p <= steps; p++) {
    for (let q = -steps; q <= steps; q++) {
      for (let r = -steps; r <= steps; r++) {
        const ratio = (primeIntervals[3] ** p) * (primeIntervals[5] ** q) * (primeIntervals[7] ** r);
        lattice.push({
          x: spacing * p,
          y: spacing * -q,
          z: spacing * r,
          ratio: decimalToFraction(ratio),
        });
      }
    }
  }

  return lattice;
};

const LatticePage = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(5, 5, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.background = new THREE.Color(0xffffff);


    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const lattice = generate5LimitLattice(2, 2);

    const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const sphereMaterial = new THREE.MeshStandardMaterial({ color: "red" });

    lattice.forEach((point) => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(point.x, point.y, point.z);
      scene.add(sphere);

      const textLoader = new THREE.TextureLoader();
      const textSprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: textLoader.load(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="50">
              <text x="10" y="25" font-size="24" fill="black">${point.ratio}</text>
            </svg>`
          )}`),
          transparent: true,
        })
      );
      textSprite.position.set(point.x, point.y + 0.4, point.z);
      textSprite.scale.set(1, 0.5, 1);
      scene.add(textSprite);
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} />;
};

export default LatticePage;

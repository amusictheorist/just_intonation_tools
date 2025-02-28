import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { generateLattice, undoLast } from '../utils/latticeUtils';
import '../styles/Lattice.css';

const LatticePage = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const [ratios, setRatios] = useState(["1/1"]);

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

    const light = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(light);

    generateLattice('1/1', scene, spheresRef);

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
    const inputRatio = event.target.elements.ratio.value;
    // console.log('Adding ratio: ', inputRatio);

    if (/^\d+\/\d+$/.test(inputRatio) && sceneRef.current) {
      generateLattice(inputRatio, sceneRef.current, spheresRef);
    }

    event.target.reset();
  };

  const handleUndo = () => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (scene && renderer && camera) {
      undoLast(scene, spheresRef, renderer, camera);
    }
  };

  return (
    <div className="lattice-page">
      <header className="header">
        <h1>Ratio Lattice Generator</h1>
        <p className="description">Currently, this generator only supports 7-limit lattices, but I am working on expanding its functionality.</p>
      </header>
      <div className="controls">
        <form onSubmit={handleAddRatio} className="form">
          <input className="input" type="text" name="ratio" placeholder="Enter ratio (e.g. 3/2)" required />
          <button className="button" type="submit">Add Ratio</button>
          <button className="button" onClick={handleUndo} >Undo</button>
        </form>
      </div>
      <div ref={mountRef} style={{ width: "100vw", height: "80vh" }} />
    </div>
  );
};

export default LatticePage;

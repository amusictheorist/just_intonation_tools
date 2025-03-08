import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { generateLattice/*, undoLast*/ } from '../utils/latticeUtils';
import '../styles/Lattice.css';

const LatticePage = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const [visualizationMode, setVisualizationMode] = useState('3D');

  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    
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

    generateLattice('1/1', scene, spheresRef, visualizationMode);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [visualizationMode]);

  const handleAddRatio = (event) => {
    event.preventDefault();
    const inputRatio = event.target.elements.ratio.value;

    if (/^\d+\/\d+$/.test(inputRatio) && sceneRef.current) {
      generateLattice(inputRatio, sceneRef.current, spheresRef, visualizationMode);
    }

    event.target.reset();
  };

  // const handleUndo = () => {
  //   const scene = sceneRef.current;
  //   const renderer = rendererRef.current;
  //   const camera = cameraRef.current;
  //   if (scene && renderer && camera) {
  //     undoLast(scene, spheresRef, renderer, camera);
  //   }
  // };

  const resetLattice = (mode = visualizationMode) => {
    console.log('resetting lattice in mode ', mode);
    const scene = sceneRef.current;
    if (scene) {
      spheresRef.current.forEach(({ sphere, label, line }) => {
        if (sphere) scene.remove(sphere);
        if (label) scene.remove(label);
        if (line) scene.remove(line);
      });
      spheresRef.current = [];
      generateLattice('1/1', scene, spheresRef, mode);
    }
  };

  const toggleVisualizationMode = () => {
    setVisualizationMode((prevMode) => {
      const newMode = prevMode === '3D' ? '2D' : '3D';
      console.log('switching to mode ', newMode);
      resetLattice(newMode);
      return newMode;
    });
  };
  

  return (
    <div className="lattice-page">
      <header className="header">
        <h1>Ratio Lattice Generator</h1>
        <p className="description">Currently, 3D visualization only supports 7-limit lattices, but I am working on expanding its functionality.</p>
      </header>
      <div className="controls">
        <form onSubmit={handleAddRatio} className="form">
          <input className="input" type="text" name="ratio" placeholder="Enter ratio (e.g. 3/2)" required />
          <button className="button" type="submit">Add Ratio</button>
          {/* <button className="button" type="button" onClick={handleUndo} >Undo</button> */}
          <button className="button" type="button" onClick={resetLattice} >Reset</button>
          <button className="button" type="button" onClick={toggleVisualizationMode} >Switch to {visualizationMode === '3D' ? '2D' : '3D'} Visualization</button>
        </form>
        <div className="mode-label">
          Current Mode: <strong>{visualizationMode}</strong>
        </div>
      </div>
      <div ref={mountRef} style={{ width: "100vw", height: "80vh" }} />
    </div>
  );
};

export default LatticePage;
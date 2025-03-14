import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { generate3DLattice, undo3DLast } from '../utils/3DlatticeUtils';
import '../styles/Lattice.css';

const LatticePage = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  // const [visualizationMode, setVisualizationMode] = useState('3D cubic');

  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && mountRef.current) {
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
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

    generate3DLattice('1/1', scene, spheresRef);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [/*visualizationMode*/]);

  const handleAddRatio = (event) => {
    event.preventDefault();
    const inputRatio = event.target.elements.ratio.value;

    if (/^\d+\/\d+$/.test(inputRatio) && sceneRef.current) {
      generate3DLattice(inputRatio, sceneRef.current, spheresRef/*, visualizationMode*/);
    }

    event.target.reset();
  };

  const handle3DUndo = () => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (scene && renderer && camera) {
      undo3DLast(scene, spheresRef, renderer, camera);
    }
  };

  const resetLattice = (/*mode = visualizationMode*/) => {
    const scene = sceneRef.current;
    if (scene) {
      spheresRef.current.forEach(({ sphere, label, lines }) => {
        if (sphere) scene.remove(sphere);
        if (label) scene.remove(label);
        if (lines && lines.length > 0) {
          lines.forEach((line) => {
            scene.remove(line);
          });
        }
      });
      spheresRef.current = [];
      generate3DLattice('1/1', scene, spheresRef);
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  // const toggleVisualizationMode = () => {
  //   setVisualizationMode((prevMode) => {
  //     const newMode = prevMode === '3D cubic' ? 'Radial' : '3D cubic';
  //     console.log('switching to mode ', newMode);
  //     resetLattice(newMode);
  //     return newMode;
  //   });
  // };
  
  return (
    <div className="lattice-page">
      <header className="header">
        <h1>Ratio Lattice Generator</h1>
      </header>
      <div className="controls">
        <form onSubmit={handleAddRatio} className="form">
          <input className="input" type="text" name="ratio" placeholder="Enter ratio (e.g. 3/2)" required />
          <button className="button" type="submit">Add Ratio</button>
          <button className="button" type="button" onClick={handle3DUndo} >Undo</button>
          <button className="button" type="button" onClick={resetLattice} >Reset</button>
          {/* <button className="button" type="button" onClick={toggleVisualizationMode} >Switch to {visualizationMode === '3D cubic' ? 'Radial' : '3D cubic'} Visualization</button> */}
        </form>
        <div className="mode-label">
          {/* Current Mode: <strong>{visualizationMode}</strong> visualization */}
        </div>
      </div>

      <button className="info-button" onClick={toggleModal}>
        ℹ️
      </button>

      {modalOpen && (
        <div className="info-modal">
          <div className="info-content">
            <h2>About the Lattice Generator</h2>
            <p>This 3D lattice generator arranges ratios as spheres on a lattice based on their prime factorizations.</p>
            <p>It uses a combination of cubic and radial positioning to place ratios in 3D space. As is traditionally done in musical ratio theory, I've mapped primes 3, 5, and 7 to the x, y, and z axes respectively, and these are the primary intervals shown through lines.</p>
            <p> I am experimenting with placing prime ratios above 7, since it introduces a fourth spatial dimension, which is always an issue on a 2D sheet of paper. But here, in 3D space, I'm using higher primes and the golden ratio to distribute ratios on an imaginary sphere around the central 1/1 sphere ensuring that they are uniquely placed but not on the cubic lattice. The primary intervals are also highlighted when compounded with higher primes, which I find helpful in visualizing the higher spatial dimensions as well.</p>
            <button className="close-modal" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}
      
      <div className="scene-container">
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default LatticePage;
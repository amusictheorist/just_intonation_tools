import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { generate3DLattice, undo3DLast, updateRadialPrimes } from '../utils/3DlatticeUtils';

const LatticePage = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const spheresRef = useRef([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [radiusFactor, setRadiusFactor] = useState(2);
  const [angleShift, setAngleShift] = useState(0);
  const [radialColor, setRadialColor] = useState('#B22222');
  const [hasRadialPrime, setHasRadialPrime] = useState(false);
  const [slidersVisible, setSlidersVisible] = useState(false);
  // const [visualizationMode, setVisualizationMode] = useState('3D cubic);

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
      const radialPrimeExists = generate3DLattice(inputRatio, sceneRef.current, spheresRef/*, visualizationMode*/, radiusFactor, angleShift, radialColor);
      setHasRadialPrime(radialPrimeExists);
      if (radialPrimeExists) {
        setSlidersVisible(true);
      }
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

  useEffect(() => {
    if (hasRadialPrime) {
      console.log("A radial prime was added.");
    }
  }, [hasRadialPrime]);
  

  const resetLattice = (/*visualizationMode*/) => {
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
      setHasRadialPrime(false);
      setSlidersVisible(false);
    }
  };

  useEffect(() => {
    if (sceneRef.current) {
      updateRadialPrimes(sceneRef.current, spheresRef, radiusFactor, angleShift, radialColor);
    }
  }, [radiusFactor, angleShift, radialColor]);

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
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Ratio Lattice Generator</h1>
      </header>
      <div>
        <form onSubmit={handleAddRatio} className="flex justify-center items-center gap-4 mb-8 flex-wrap">
          <input
            type="text"
            name="ratio"
            placeholder="Enter ratio (e.g. 3/2)"
            required
            className="p-3 text-base border border-gray-300 rounded-md w-72"
          />
          <button
            type="submit"
            className="p-3 px-6 text-lg bg-green-600 text-white font-semibold rounded-md transition hover:bg-green-700 hover:underline"
          >
            Add Ratio
          </button>
          <button
            type="button"
            onClick={handle3DUndo}
            className="p-3 px-6 text-lg bg-green-600 text-white font-semibold rounded-md transition hover:bg-green-700 hover:underline"
          >
            Undo
          </button>
          <button
            type="button"
            onClick={resetLattice}
            className="p-3 px-6 text-lg bg-green-600 text-white font-semibold rounded-md transition hover:bg-green-700 hover:underline"
          >
            Reset
          </button>
          {/* <button className="button" type="button" onClick={toggleVisualizationMode} >Switch to {visualizationMode === '3D cubic' ? 'Radial' : '3D cubic'} Visualization</button> */}
        </form>
        <div>
          {/* Current Mode: <strong>{visualizationMode}</strong> visualization */}
        </div>
      </div>

      {slidersVisible && (
        <div className="flex justify-center gap-8 mt-8 items-center flex-wrap">
          <label className="text-gray-600 text-base text-center">
            Radius Factor:
            <input
              type="range"
              min="1"
              max="5"
              step="0.1"
              value={radiusFactor}
              onChange={(e) => setRadiusFactor(parseFloat(e.target.value))}
              className="w-52 mt-2"
            />
          </label>
          <label className="text-gray-600 text-base text-center">
            Angle Shift:
            <input
              type="range"
              min="-1"
              max="1"
              step="0.01"
              value={angleShift}
              onChange={(e) => setAngleShift(parseFloat(e.target.value))}
              className="w-52 mt-2"
            />
          </label>
          <label className="text-gray-600 text-base text-center">
            Radial Sphere Color:
            <select
              value={radialColor}
              onChange={(e) => setRadialColor(e.target.value)}
              className="p-2 text-base border border-gray-300 rounded-md mt-2 cursor-pointer"
            >
              <option value="#B22222">Red</option>
              <option value="#1E90FF">Blue</option>
              <option value="#32CD32">Green</option>
              <option value="#FFD700">Yellow</option>
              <option value="#8A2BE2">Purple</option>
            </select>
          </label>
        </div>
      )}

      <button className="fixed bottom-5 right-5 w-12 h-12 bg-blue-600 text-white text-2xl rounded-full flex items-center justify-center shadow-md hover:bg-blue-800" onClick={toggleModal}>
        ℹ️
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-5 max-w-sm w-11/12 rounded-lg shadow-lg text-left">
            <h2 className="text-xl font-bold mb-3">About the Lattice Generator</h2>
            <p className="mb-2">This 3D lattice generator arranges ratios as spheres on a lattice based on their prime factorizations.</p>
            <p className="mb-2">
              It uses a combination of cubic and radial positioning to place ratios in 3D space. As is traditionally done in musical ratio theory, I've mapped primes 3, 5, and 7 to the x, y, and z axes respectively, and these are the primary intervals shown through lines.
            </p>
            <p className="mb-2">
              I am experimenting with placing prime ratios above 7, since it introduces a fourth spatial dimension, which is always an issue on a 2D sheet of paper. But here, in 3D space, I'm using higher primes and the golden ratio to distribute ratios on an imaginary sphere around the central 1/1 ratio ensuring that prime ratios are uniquely placed, but not on the cubic lattice.
            </p>
            <p className="mb-2">
              I've added sliders to change the radius of the imaginary sphere and the radial angles of higher primes so that one can move them around for better visualization. It is also possible to change to color of the radial spheres so they contrast more against the spheres on the cubic lattice.
            </p>
            <button className="mt-5 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={toggleModal}>Close</button>
          </div>
        </div>
      )}

      <div className="w-full h-[70vh] max-w-[1200px] mx-auto p-4 border border-gray-300 bg-gray-100 rounded-lg">
        <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
};

export default LatticePage;

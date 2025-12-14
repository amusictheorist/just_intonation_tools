import { useMemo, useState } from "react";
import { useRatios, Modes } from "./hooks/useRatios";
import LatticeCanvas from "./LatticeCanvas";
import { factorRatio } from "./placement/expandedCubic";
import RatioControls from "./RatioControls";
import RotationSliders from "./RotationSliders";
import RotationPanel from "./RotationPanel";
import Modal from "./Modal";

const LatticePage = () => {
  const {
    ratios,
    addRatio,
    removeRatio,
    undo,
    reset,
    mode,
    setMode
  } = useRatios();

  const [inputError, setInputError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [radiusScale, setRadiusScale] = useState(2);

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  const [masterRot, setMasterRot] = useState(0);
  const [rotXY, setRotXY] = useState(0);
  const [rotYZ, setRotYZ] = useState(0);
  const [rotXZ, setRotXZ] = useState(0);

  const handleAdd = raw => {
    const { success, error } = addRatio(raw);
    if (!success) setInputError(error);
    else setInputError(null);
  };

  const hasHighPrime = useMemo(() => {
    return ratios.some(r => {
      const factors = factorRatio(r);
      return [...factors.keys()].some(p => p > 7);
    });
  }, [ratios]);

  const modeOptions = [
    { value: Modes.CUBIC, label: 'Cubic' },
    { value: Modes.EXPANDED_CUBIC, label: 'Expanded Cubic' },
    { value: Modes.RADIAL, label: 'Radial' },
    { value: Modes.EXPANDED_RADIAL, label: 'Expanded Radial' },
  ];

  const combinedRot = useMemo(() => {
    return {
      rotX: rotX + masterRot + rotXY + rotXZ,
      rotY: rotY + masterRot + rotXY + rotYZ,
      rotZ: rotZ + masterRot + rotYZ + rotXZ
    };
  }, [rotX, rotY, rotZ, masterRot, rotXY, rotYZ, rotXZ]);

  const resetRotation = () => {
    setRotX(0);
    setRotY(0);
    setRotZ(0);
    setMasterRot(0);
    setRotXY(0);
    setRotYZ(0);
    setRotXZ(0);
  };

  const controls = useMemo(
    () => ({
      radiusScale,
      rotation: {
        rotX: combinedRot.rotX,
        rotY: combinedRot.rotY,
        rotZ: combinedRot.rotZ
      }
    }),
    [radiusScale, combinedRot]
  );

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">

      {/* ratio input */}
      <RatioControls
        onAdd={handleAdd}
        undo={undo}
        reset={reset}
        mode={mode}
        setMode={setMode}
        inputError={inputError}
        modeOptions={modeOptions}
      />

      {/* rotation sliders */}
      <RotationSliders
        hasHighPrime={hasHighPrime}
        radiusScale={radiusScale} setRadiusScale={setRadiusScale}
        rotX={rotX} setRotX={setRotX}
        rotY={rotY} setRotY={setRotY}
        rotZ={rotZ} setRotZ={setRotZ}
        masterRot={masterRot} setMasterRot={setMasterRot}
        rotXY={rotXY} setRotXY={setRotXY}
        rotYZ={rotYZ} setRotYZ={setRotYZ}
        rotXZ={rotXZ} setRotXZ={setRotXZ}
      />

      {/* effective rotation panel */}
      {hasHighPrime && (
        <RotationPanel
          combinedRot={combinedRot}
          onResetRotation={resetRotation}
        />
      )}

      {/* 3D canvas */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-[1000px] mx-auto mt-6">
        <LatticeCanvas
          ratios={ratios}
          mode={mode}
          controls={controls}
          removeRatio={removeRatio}
        />
      </div>

      {/* tooltip container */}
      <div
        id="lattice-tooltip"
        style={{
          position: "fixed",
          display: "none",
          pointerEvents: "none",
          background: "rgba(255,255,255,0.95)",
          padding: "6px 10px",
          border: "1px solid #444",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#000",
          whiteSpace: "nowrap",
          zIndex: 9999
        }}
      />
      <button className="fixed bottom-5 right-5 w-12 h-12 bg-blue-600 text-white text-2xl rounded-full flex items-center justify-center shadow-md hover:bg-blue-800" onClick={toggleModal}>
        ℹ️
      </button>

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={toggleModal} />
      )}
    </div>
  );
};

export default LatticePage;
import { useState } from "react";
import InfoPanel from "./InfoPanel";
import SpiralCanvas from "./SpiralCanvas";
import Modal from "./Modal";
import { useSpiral } from "./hooks/useSpiral";
import InputControls from "./ui/InputControls";
import { useSpiralCamera } from "./hooks/useSpiralCamera";
import SpiralCameraControls from "./ui/SpiralCameraControls";

const SpiralPage = () => {
  const {
    values,
    selected,
    setSelected,
    addPointBatch,
    removeValue,
    undoLastBatch,
    resetToOne,
    svgGroupRef,
    pathRef,
    maxTheta
  } = useSpiral();

  const {
    zoom,
    setTargetZoom,
    pan,
    setPan,
    resetView
  } = useSpiralCamera();

  const [modalOpen, setModalOpen] = useState(false);
  const toggleModal = () => setModalOpen(!modalOpen);
  const handleClear = () => setSelected(new Set());

  return (
    <div>
      <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Harmonic Spiral</h1>

          <InputControls
            onAdd={addPointBatch}
            onUndo={undoLastBatch}
            onRemoveSelected={() => {
              const first = [...selected][0];
              if (first !== undefined) removeValue(first);
            }}
            onReset={resetToOne}
            hasSelection={selected.size > 0}
          />
        </header>
        
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <div className="aspect-square w-full max-w-[720px] mx-auto">
            <SpiralCameraControls
              zoom={zoom}
              onZoomIn={() =>
              setTargetZoom(z => Math.min(z * 1.25, 8))
            }
              onZoomOut={() =>
              setTargetZoom(z => Math.max(z / 1.25, 0.25))
            }
              onReset={resetView}
            />

            <SpiralCanvas
              svgGroupRef={svgGroupRef}
              pathRef={pathRef}
              values={values}
              selected={selected}
              maxTheta={maxTheta}
              zoom={zoom}
              pan={pan}
              setPan={setPan}
            />
          </div>

          <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full">
            <InfoPanel selected={selected} onClear={handleClear} />
          </div>
        </div>
      </div>

      <button className="fixed bottom-5 right-5 w-12 h-12 bg-blue-600 text-white text-2xl rounded-full flex items-center justify-center shadow-md hover:bg-blue-800" onClick={toggleModal}>
        ℹ️
      </button>

      {modalOpen && (
        <Modal isOpen={modalOpen} onClose={toggleModal} />
      )}
    </div>
  );
};

export default SpiralPage;
import { useEffect, useState } from "react";
import InfoPanel from "./InfoPanel";
import SpiralCanvas from "./SpiralCanvas";
import Modal from "./Modal";
import { useSpiral } from "./hooks/useSpiral";
import InputControls from "./ui/InputControls";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [targetZoom, setTargetZoom] = useState(1);
  const [zoom, setZoom] = useState(1);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleClear = () => setSelected(new Set());

  useEffect(() => {
    let raf;
    const duration = 180;
    const start = performance.now();
    const startZoom = zoom;
    const delta = targetZoom - startZoom;

    if (Math.abs(delta) < 0.001) return;

    const animate = t => {
      const elapsed = t - start;
      const lin = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - lin, 3);

      setZoom(startZoom + delta * eased);

      if (lin < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(raf);
  }, [targetZoom]);

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
            <div className="flex justify-center items-center space-x-4 mt-4">
              <button
                onClick={() => setTargetZoom(z => Math.min(z * 1.25, 8))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>

              <span className="text-sm text-gray-600">
                Zoom: {zoom.toFixed(2)}
              </span>

              <button
                onClick={() => setTargetZoom(z => Math.max(z / 1.25, 0.25))}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                -
              </button>

              <button
                onClick={() => setTargetZoom(1)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Reset View
              </button>
            </div>
            <SpiralCanvas
              svgGroupRef={svgGroupRef}
              pathRef={pathRef}
              values={values}
              selected={selected}
              maxTheta={maxTheta}
              zoom={zoom}
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
import { useState } from "react";
import InfoPanel from "./ui/InfoPanel";
import SpiralCanvas from "./ui/SpiralCanvas";
import { useSpiral } from "./hooks/useSpiral";
import InputControls from "./ui/InputControls";
import { useSpiralCamera } from "./hooks/useSpiralCamera";
import SpiralCameraControls from "./ui/SpiralCameraControls";
import HelpButton from "./ui/HelpButton";
import HelpPanel from "./ui/HelpPanel";

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

  const [helpOpen, setHelpOpen] = useState(false);

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col items-center">
              <div className="w-full max-w-[560px]">
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
                <div className="aspect-square w-full mt-2">

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
              </div>
            </div>

            <div className="lg:col-span-1">
              <InfoPanel selected={selected} onClear={handleClear} />
            </div>
          </div>
        </div>
      </div>

      <HelpButton onClick={() => setHelpOpen(true)} />
      <HelpPanel
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

    </div>
  );
};

export default SpiralPage;
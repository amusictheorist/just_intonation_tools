import { useState } from "react";
import HelpButton from "../components/HelpButton";
import ContentCard from "../layout/ContentCard";
import PageHeader from "../layout/PageHeader";
import PageLayout from "../layout/PageLayout";
import HelpPanel from "./components/HelpPanel";
import InfoPanel from "./components/InfoPanel";
import InputControls from "./components/InputControls";
import SpiralCameraControls from "./components/SpiralCameraControls";
import SpiralCanvas from "./components/SpiralCanvas";
import { useSpiral } from "./hooks/useSpiral";
import { useSpiralCamera } from "./hooks/useSpiralCamera";

const MINIMUM_ZOOM = 0.25;
const MAXIMUM_ZOOM = 8;
const ZOOM_FACTOR = 1.25;

function SpiralPage() {
  const {
    selected,
    setSelected,
    addPointBatch,
    removeValue,
    undoLastBatch,
    resetToOne,
    svgGroupRef,
    pathRef,
    maxTheta,
  } = useSpiral();

  const { zoom, setTargetZoom, pan, setPan, resetView } = useSpiralCamera();

  const [helpOpen, setHelpOpen] = useState(false);

  const handleClearSelection = (): void => {
    setSelected(new Set());
  };

  const handleRemoveSelected = (): void => {
    const selectedValue = selected.values().next().value;

    if (selectedValue !== undefined) {
      removeValue(selectedValue);
    }
  };

  const handleZoomIn = (): void => {
    setTargetZoom((currentZoom) =>
      Math.min(currentZoom * ZOOM_FACTOR, MAXIMUM_ZOOM),
    );
  };

  const handleZoomOut = (): void => {
    setTargetZoom((currentZoom) =>
      Math.max(currentZoom / ZOOM_FACTOR, MINIMUM_ZOOM),
    );
  };

  return (
    <>
      <PageLayout width="wide">
        <PageHeader
          title="Harmonic Spiral"
          description="Plot partials along a logarithmic spiral and examine the sets formed by selected points."
        />

        <div className="space-y-6">
          <ContentCard>
            <InputControls
              onAdd={addPointBatch}
              onUndo={undoLastBatch}
              onRemoveSelected={handleRemoveSelected}
              onReset={resetToOne}
              hasSelection={selected.size > 0}
            />
          </ContentCard>

          <ContentCard>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center lg:col-span-2">
                <div className="w-full max-w-140">
                  <SpiralCameraControls
                    zoom={zoom}
                    onZoomIn={handleZoomIn}
                    onZoomOut={handleZoomOut}
                    onReset={resetView}
                  />

                  <div className="mt-3 aspect-square w-full">
                    <SpiralCanvas
                      svgGroupRef={svgGroupRef}
                      pathRef={pathRef}
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
                <InfoPanel selected={selected} onClear={handleClearSelection} />
              </div>
            </div>
          </ContentCard>
        </div>
      </PageLayout>

      <HelpButton onClick={() => setHelpOpen(true)} label="Open spiral help" />

      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}

export default SpiralPage;

import { useState } from "react";
import { useRatios, Modes } from "./hooks/useRatios";
import { useRotationControls } from "./hooks/useRotationControls";
import { useHighPrimeFlag } from "./hooks/useHighPrimeFlag";
import { useControls } from "./hooks/useControls";
import LatticeCanvas from "./ui/LatticeCanvas";
import RatioControls from "./ui/RatioControls";
import RotationSliders from "./ui/RotationSliders";
import RotationPanel from "./ui/RotationPanel";
import CollapsibleSection from "./ui/CollapsibleSection";
import Appear from "./ui/Appear";
import HelpButton from "./ui/HelpButton";
import HelpPanel from "./ui/HelpPanel";

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
  const [helpOpen, setHelpOpen] = useState(false);
  const [primeColor, setPrimeColor] = useState('#ff3366');
  const [radiusScale, setRadiusScale] = useState(2);

  const rotation = useRotationControls();
  const hasHighPrime = useHighPrimeFlag(ratios);
  const showAdvanced = mode === Modes.EXPANDED_CUBIC && hasHighPrime;
  const controls = useControls(radiusScale, rotation.combinedRot, primeColor);

  const handleAdd = raw => {
    const { success, error } = addRatio(raw);
    if (!success) setInputError(error);
    else setInputError(null);
  };

  const modeOptions = [
    { value: Modes.CUBIC, label: 'Cubic' },
    { value: Modes.EXPANDED_CUBIC, label: 'Expanded Cubic' },
    { value: Modes.RADIAL, label: 'Radial' },
    { value: Modes.EXPANDED_RADIAL, label: 'Expanded Radial' },
  ];

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
      {showAdvanced && (
        <Appear className="mt-4">
          <CollapsibleSection title='Advanced Controls'>
            <RotationSliders
              hasHighPrime={hasHighPrime}
              radiusScale={radiusScale} setRadiusScale={setRadiusScale}
              primeColor={primeColor}
              setPrimeColor={setPrimeColor}
              {...rotation}
            />

            {/* effective rotation panel */}
            <RotationPanel
                combinedRot={rotation.combinedRot}
                onResetRotation={rotation.resetRotation}
                primeColor={primeColor}
                setPrimeColor={setPrimeColor}
              />
          </CollapsibleSection>
        </Appear>
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

      <HelpButton onClick={() => setHelpOpen(true)} />
      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </div>
  );
};

export default LatticePage;
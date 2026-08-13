import { useState } from "react";
import { MODES, useRatios } from "./hooks/useRatios";
import { useRotationControls } from "./hooks/useRotationControls";
import { useHighPrimeFlag } from "./hooks/useHighPrimeFlag";
import { useControls } from "./hooks/useControls";
import PageLayout from "../layout/PageLayout";
import PageHeader from "../layout/PageHeader";
import ContentCard from "../layout/ContentCard";
import RatioControls from "./components/RatioControls";
import { LATTICE_MODE_OPTIONS } from "../../data/latticeModes";
import Appear from "./components/Appear";
import Collapsible from "./components/Collapsible";
import RotationSliders from "./components/RotationSliders";
import RotationPanel from "./components/RotationPanel";
import LatticeCanvas from "./components/LatticeCanvas";
import HelpPanel from "./components/HelpPanel";
import HelpButton from "../components/HelpButton";
import PrimeAnchorPrototypeCanvas from "./components/PrimeAnchorPrototypeCanvas";

function LatticePage() {
  const { ratios, addRatio, removeRatio, undo, reset, mode, setMode } =
    useRatios();

  const [inputError, setInputError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [primeColor, setPrimeColor] = useState("#ff3366");
  const [radiusScale, setRadiousScale] = useState(2);

  const rotation = useRotationControls();
  const hasHighPrime = useHighPrimeFlag(ratios);
  const showAdvancedControls = mode === MODES.EXPANDED_CUBIC && hasHighPrime;
  const controls = useControls(radiusScale, rotation.combinedRot, primeColor);

  const handleAdd = (raw: string) => {
    const result = addRatio(raw);

    if ("error" in result) {
      setInputError(result.error);
      return;
    }

    setInputError(null);
  };

  return (
    <>
      <PageLayout width="full">
        <PageHeader
          title="Ratio Lattice Visualizer"
          description="Build and explore just-intonation relationships in an interactive three-dimensional lattice."
        />

        <div className="space-y-6">
          <ContentCard>
            <RatioControls
              onAdd={handleAdd}
              undo={undo}
              reset={reset}
              mode={mode}
              setMode={setMode}
              inputError={inputError}
              modeOptions={LATTICE_MODE_OPTIONS}
            />
          </ContentCard>

          {showAdvancedControls && (
            <Appear>
              <ContentCard>
                <Collapsible
                  title="Advanced controls"
                  animated
                  titleClassName="rounded-lg bg-gray-100 px-4 py-3 font-semibold text-gray-900 transition hover:bg-gray-200"
                  contentClassName="space-y-6 pt-5"
                >
                  <RotationSliders
                    hasHighPrime={hasHighPrime}
                    radiusScale={radiusScale}
                    setRadiusScale={setRadiousScale}
                    rotX={rotation.rotX}
                    setRotX={rotation.setRotX}
                    rotY={rotation.rotY}
                    setRotY={rotation.setRotY}
                    rotZ={rotation.rotZ}
                    setRotZ={rotation.setRotZ}
                    masterRot={rotation.masterRot}
                    setMasterRot={rotation.setMasterRot}
                    rotXY={rotation.rotXY}
                    setRotXY={rotation.setRotXY}
                    rotYZ={rotation.rotYZ}
                    setRotYZ={rotation.setRotYZ}
                    rotXZ={rotation.rotXZ}
                    setRotXZ={rotation.setRotXZ}
                  />

                  <RotationPanel
                    combinedRot={rotation.combinedRot}
                    onResetRotation={rotation.resetRotation}
                    primeColor={primeColor}
                    setPrimeColor={setPrimeColor}
                  />
                </Collapsible>
              </ContentCard>
            </Appear>
          )}

          <ContentCard className="p-3 sm:p-4">
            <LatticeCanvas
              ratios={ratios}
              mode={mode}
              controls={controls}
              removeRatio={removeRatio}
            />
          </ContentCard>
        </div>

        <ContentCard>
          <PrimeAnchorPrototypeCanvas />
        </ContentCard>
      </PageLayout>

      <div
        id="lattice-tooltip"
        className="pointer-events-none fixed z-[9999] hidden whitespace-nowrap rounded-md border border-gray-700 bg-white/95 px-3 py-2 text-xs text-gray-900 shadow-md"
      />

      <HelpButton onClick={() => setHelpOpen(true)} />
      <HelpPanel isOpen={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}

export default LatticePage;

import { useState } from "react";
import { useLatticePositioning } from "../hooks/useLatticePositioning";
import { useLatticeRatios } from "../hooks/useLatticeRatios";
import { useLatticeSceneData } from "../hooks/useLatticeSceneData";
import LatticeCanvas from "./LatticeCanvas";
import LatticeRatioControls from "./LatticeRatioControls";
import { DEFAULT_HIGHER_PRIME_POINT_COLOR } from "../../../lib/lattice/presentation/latticePointStyle";
import LatticeVisualizationControls from "./LatticeVisualizationControls";
import LatticeAppearanceControls from "./LatticeAppearanceControls";

function LatticeVisualizer() {
  const { ratios, addRatio, undo, reset } = useLatticeRatios();
  const {
    positionedRatios,
    configuration,
    setIncludeHigherPrimes,
    setHigherPrimeRadius,
    setLocalRotation,
    setVisualizationType,
    setIncludeLowerOctave,
    setIncludeGeneratorHeight,
    setLowerSymmetry,
  } = useLatticePositioning(ratios);
  const { scenePoints, sceneConnections } =
    useLatticeSceneData(positionedRatios);

  const [inputError, setInputError] = useState<string | null>(null);
  const [higherPrimeColor, setHigherPrimeColor] = useState(
    DEFAULT_HIGHER_PRIME_POINT_COLOR,
  );

  function handleAdd(rawInput: string): boolean {
    const result = addRatio(rawInput);

    if (result.status === "added") {
      setInputError(null);
      return true;
    }

    if (result.status === "invalid") {
      setInputError(result.error);
      return false;
    }

    setInputError(`Ratio ${result.existingRatio.rawInput} is already present`);
    return false;
  }

  return (
    <>
      <LatticeRatioControls
        onAdd={handleAdd}
        onUndo={undo}
        onReset={reset}
        inputError={inputError}
      />

      <LatticeVisualizationControls
        configuration={configuration}
        onVisualizationTypeChange={setVisualizationType}
        onIncludeHigherPrimesChange={setIncludeHigherPrimes}
        onHigherPrimeRadiusChange={setHigherPrimeRadius}
        onLocalRotationChange={setLocalRotation}
        onIncludeLowerOctaveChange={setIncludeLowerOctave}
        onIncludeGeneratorHeightChange={setIncludeGeneratorHeight}
        onLowerSymmetryChange={setLowerSymmetry}
      />

      <LatticeAppearanceControls
        higherPrimeColor={higherPrimeColor}
        onHigherPrimeColorChange={setHigherPrimeColor}
      />

      <LatticeCanvas
        scenePoints={scenePoints}
        sceneConnections={sceneConnections}
        higherPrimeColor={higherPrimeColor}
      />
    </>
  );
}

export default LatticeVisualizer;

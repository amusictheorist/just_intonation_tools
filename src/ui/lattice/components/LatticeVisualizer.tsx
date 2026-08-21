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

  const [showConnections, setShowConnections] = useState(true);
  const [visibleConnectionPrimes, setVisibleConnectionPrimes] =
    useState<ReadonlySet<bigint> | null>(null);

  const { scenePoints, sceneConnections, availableConnectionPrimes } =
    useLatticeSceneData(positionedRatios, {
      showConnections,
      visiblePrimes: visibleConnectionPrimes,
    });

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

  function toggleConnectionPrime(prime: bigint, visible: boolean): void {
    const currentVisiblePrimes =
      visibleConnectionPrimes ?? new Set(availableConnectionPrimes);

    const nextVisiblePrimes = new Set(currentVisiblePrimes);

    if (visible) nextVisiblePrimes.add(prime);

    if (!visible) nextVisiblePrimes.delete(prime);

    setVisibleConnectionPrimes(nextVisiblePrimes);
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
        showConnections={showConnections}
        onShowConnectionsChange={setShowConnections}
        availableConnectionPrimes={availableConnectionPrimes}
        visibleConnectionPrimes={visibleConnectionPrimes}
        onConnectionPrimeVisibilityChange={toggleConnectionPrime}
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

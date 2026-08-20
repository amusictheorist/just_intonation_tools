import type {
  CubicLocalRotation,
  LowerRadialSymmetry,
} from "../../../lib/lattice/state/latticeGeometry";
import type { LatticePositioningConfiguration } from "../../../lib/lattice/state/latticePositioningConfiguration";

type LatticeVisualizationControlsProps = {
  configuration: LatticePositioningConfiguration;
  onVisualizationTypeChange: (type: "cubic" | "radial") => void;
  onIncludeHigherPrimesChange: (include: boolean) => void;
  onHigherPrimeRadiusChange: (radius: number) => void;
  onLocalRotationChange: (rotation: CubicLocalRotation) => void;
  onIncludeLowerOctaveChange: (include: boolean) => void;
  onIncludeGeneratorHeightChange: (include: boolean) => void;
  onLowerSymmetryChange: (symmetry: LowerRadialSymmetry) => void;
};

function LatticeVisualizationControls({
  configuration,
  onVisualizationTypeChange,
  onIncludeHigherPrimesChange,
  onHigherPrimeRadiusChange,
  onLocalRotationChange,
  onIncludeLowerOctaveChange,
  onIncludeGeneratorHeightChange,
  onLowerSymmetryChange,
}: LatticeVisualizationControlsProps) {
  const isCubic = configuration.visualization.type === "cubic";

  const showHigherPrimeControls =
    isCubic &&
    configuration.visualization.includeHigherPrimes &&
    configuration.geometry.type === "cubic";

  function updateLocalRotation(
    axis: keyof CubicLocalRotation,
    value: number,
  ): void {
    if (configuration.geometry.type !== "cubic") return;

    onLocalRotationChange({
      ...configuration.geometry.localRotation,
      [axis]: value,
    });
  }

  return (
    <div>
      <fieldset>
        <legend>Visualization</legend>

        <label>
          <input
            type="radio"
            name="visualization-type"
            checked={configuration.visualization.type === "cubic"}
            onChange={() => onVisualizationTypeChange("cubic")}
          />
          Cubic
        </label>

        <label>
          <input
            type="radio"
            name="visualization-type"
            checked={configuration.visualization.type === "radial"}
            onChange={() => onVisualizationTypeChange("radial")}
          />
          Radial
        </label>
      </fieldset>

      {isCubic && (
        <label>
          <input
            type="checkbox"
            checked={configuration.visualization.includeHigherPrimes}
            onChange={(event) =>
              onIncludeHigherPrimesChange(event.target.checked)
            }
          />
          Include higher primes
        </label>
      )}

      {showHigherPrimeControls && (
        <div>
          <label>
            Higher-prime radius:{" "}
            {configuration.geometry.higherPrimeRadius.toFixed(1)}
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.1"
              value={configuration.geometry.higherPrimeRadius}
              onChange={(event) =>
                onHigherPrimeRadiusChange(Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate X:{configuration.geometry.localRotation.x.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={configuration.geometry.localRotation.x}
              onChange={(event) =>
                updateLocalRotation("x", Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate Y:{configuration.geometry.localRotation.y.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={configuration.geometry.localRotation.y}
              onChange={(event) =>
                updateLocalRotation("y", Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate Z:{configuration.geometry.localRotation.z.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={configuration.geometry.localRotation.z}
              onChange={(event) =>
                updateLocalRotation("z", Number(event.target.value))
              }
            />
          </label>
        </div>
      )}

      {!isCubic && configuration.geometry.type === "radial" && (
        <>
          <label>
            <input
              type="checkbox"
              checked={configuration.visualization.includeLowerOctave}
              onChange={(event) =>
                onIncludeLowerOctaveChange(event.target.checked)
              }
            />
            Include lower octave
          </label>

          <label>
            <input
              type="checkbox"
              checked={configuration.geometry.includeGeneratorHeight}
              onChange={(event) =>
                onIncludeGeneratorHeightChange(event.target.checked)
              }
            />
            Include generator height
          </label>

          <fieldset>
            <legend>Lower-side symmetry</legend>

            <label>
              <input
                type="radio"
                name="lower-symmetry"
                checked={configuration.geometry.lowerSymmetry === "continuous"}
                onChange={() => onLowerSymmetryChange("continuous")}
              />
              Continuous
            </label>

            <label>
              <input
                type="radio"
                name="lower-symmetry"
                checked={configuration.geometry.lowerSymmetry === "aligned"}
                onChange={() => onLowerSymmetryChange("aligned")}
              />
              Aligned
            </label>
          </fieldset>
        </>
      )}
    </div>
  );
}

export default LatticeVisualizationControls;

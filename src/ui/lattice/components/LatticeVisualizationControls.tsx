import { useState } from "react";
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

type RotationControlsState = Readonly<{
  x: number;
  y: number;
  z: number;
  master: number;
  xy: number;
  yz: number;
  xz: number;
}>;

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
  const initialLocalRotation =
    configuration.geometry.type === "cubic"
      ? configuration.geometry.localRotation
      : { x: 0, y: 0, z: 0 };

  const [rotationControls, setRotationControls] =
    useState<RotationControlsState>({
      x: initialLocalRotation.x,
      y: initialLocalRotation.y,
      z: initialLocalRotation.z,
      master: 0,
      xy: 0,
      yz: 0,
      xz: 0,
    });

  const isCubic = configuration.visualization.type === "cubic";

  const showHigherPrimeControls =
    isCubic &&
    configuration.visualization.includeHigherPrimes &&
    configuration.geometry.type === "cubic";

  function createCombinedRotation(
    controls: RotationControlsState,
  ): CubicLocalRotation {
    return {
      x: controls.x + controls.master + controls.xy + controls.xz,
      y: controls.y + controls.master + controls.xy + controls.yz,
      z: controls.z + controls.master + controls.yz + controls.xz,
    };
  }

  function updateRotationControl(
    controls: keyof RotationControlsState,
    value: number,
  ): void {
    const nextControls = {
      ...rotationControls,
      [controls]: value,
    };

    setRotationControls(nextControls);
    onLocalRotationChange(createCombinedRotation(nextControls));
  }

  function resetRotationControls(): void {
    const resetControls: RotationControlsState = {
      x: 0,
      y: 0,
      z: 0,
      master: 0,
      xy: 0,
      yz: 0,
      xz: 0,
    };

    setRotationControls(resetControls);
    onLocalRotationChange(createCombinedRotation(resetControls));
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
            Rotate X: {configuration.geometry.localRotation.x.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationControls.x}
              onChange={(event) =>
                updateRotationControl("x", Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate Y: {configuration.geometry.localRotation.y.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationControls.y}
              onChange={(event) =>
                updateRotationControl("y", Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate Z: {configuration.geometry.localRotation.z.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationControls.z}
              onChange={(event) =>
                updateRotationControl("z", Number(event.target.value))
              }
            />
          </label>

          <label>
            Master rotation: {rotationControls.master.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationControls.master}
              onChange={(event) =>
                updateRotationControl("master", Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate XY: {rotationControls.xy.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationControls.xy}
              onChange={(event) =>
                updateRotationControl("xy", Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate YZ: {rotationControls.yz.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationControls.yz}
              onChange={(event) =>
                updateRotationControl("yz", Number(event.target.value))
              }
            />
          </label>

          <label>
            Rotate XZ: {rotationControls.xz.toFixed(0)}°
            <input
              type="range"
              min="-180"
              max="180"
              step="1"
              value={rotationControls.xz}
              onChange={(event) =>
                updateRotationControl("xz", Number(event.target.value))
              }
            />
          </label>

          <button type="button" onClick={resetRotationControls}>
            Reset rotation
          </button>
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

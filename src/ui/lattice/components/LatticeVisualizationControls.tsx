import { useEffect, useRef, useState } from "react";
import type {
  CubicLocalRotation,
  LowerRadialSymmetry,
} from "../../../lib/lattice/state/latticeGeometry";
import type { LatticePositioningConfiguration } from "../../../lib/lattice/state/latticePositioningConfiguration";
import { DEFAULT_CUBIC_LOCAL_ROTATION } from "../../../lib/lattice/geometry/latticeGeometryConstants";
import Collapsible from "./Collapsible";

type LatticeVisualizationControlsProps = {
  configuration: LatticePositioningConfiguration;
  onVisualizationTypeChange: (type: "cubic" | "radial") => void;
  onIncludeHigherPrimesChange: (include: boolean) => void;
  higherPrimeColor: string;
  onHigherPrimeColorChange: (color: string) => void;
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

function createRotationControls(
  localRotation: CubicLocalRotation,
): RotationControlsState {
  return {
    x: localRotation.x,
    y: localRotation.y,
    z: localRotation.z,
    master: 0,
    xy: 0,
    yz: 0,
    xz: 0,
  };
}

function createCombinedRotation(
  controls: RotationControlsState,
): CubicLocalRotation {
  return {
    x: controls.x + controls.master + controls.xy + controls.xz,
    y: controls.y + controls.master + controls.xy + controls.yz,
    z: controls.z + controls.master + controls.yz + controls.xz,
  };
}

function LatticeVisualizationControls({
  configuration,
  onVisualizationTypeChange,
  onIncludeHigherPrimesChange,
  onHigherPrimeRadiusChange,
  higherPrimeColor,
  onHigherPrimeColorChange,
  onLocalRotationChange,
  onIncludeLowerOctaveChange,
  onIncludeGeneratorHeightChange,
  onLowerSymmetryChange,
}: LatticeVisualizationControlsProps) {
  const pendingLocalRotation = useRef<CubicLocalRotation | null>(null);

  const initialLocalRotation =
    configuration.geometry.type === "cubic"
      ? configuration.geometry.localRotation
      : DEFAULT_CUBIC_LOCAL_ROTATION;

  const [rotationControls, setRotationControls] =
    useState<RotationControlsState>(() =>
      createRotationControls(initialLocalRotation),
    );

  const isCubic = configuration.visualization.type === "cubic";

  const showHigherPrimeControls =
    isCubic &&
    configuration.visualization.includeHigherPrimes &&
    configuration.geometry.type === "cubic";

  function updateRotationControl(
    control: keyof RotationControlsState,
    value: number,
  ): void {
    const nextControls = {
      ...rotationControls,
      [control]: value,
    };

    const nextRotation = createCombinedRotation(nextControls);

    setRotationControls(nextControls);
    pendingLocalRotation.current = nextRotation;
    onLocalRotationChange(nextRotation);
  }

  function resetRotationControls(): void {
    const resetControls = createRotationControls(DEFAULT_CUBIC_LOCAL_ROTATION);
    const resetRotation = createCombinedRotation(resetControls);

    setRotationControls(resetControls);
    pendingLocalRotation.current = resetRotation;
    onLocalRotationChange(resetRotation);
  }

  const configuredRotation =
    configuration.geometry.type === "cubic"
      ? configuration.geometry.localRotation
      : null;

  const configuredRotationX = configuredRotation?.x ?? null;
  const configuredRotationY = configuredRotation?.y ?? null;
  const configuredRotationZ = configuredRotation?.z ?? null;

  useEffect(() => {
    if (
      configuredRotationX === null ||
      configuredRotationY === null ||
      configuredRotationZ === null
    )
      return;

    const pendingRotation = pendingLocalRotation.current;

    if (
      pendingRotation &&
      pendingRotation.x === configuredRotationX &&
      pendingRotation.y === configuredRotationY &&
      pendingRotation.z === configuredRotationZ
    ) {
      pendingLocalRotation.current = null;
      return;
    }

    pendingLocalRotation.current = null;

    setRotationControls(
      createRotationControls({
        x: configuredRotationX,
        y: configuredRotationY,
        z: configuredRotationZ,
      }),
    );
  }, [configuredRotationX, configuredRotationY, configuredRotationZ]);

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-start gap-3">
        <fieldset className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
          <legend className="px-1 font-medium text-gray-700">
            Visualization
          </legend>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="visualization-type"
                checked={configuration.visualization.type === "cubic"}
                onChange={() => onVisualizationTypeChange("cubic")}
              />
              Cubic
            </label>

            <label className="flex items-center gap-1">
              <input
                type="radio"
                name="visualization-type"
                checked={configuration.visualization.type === "radial"}
                onChange={() => onVisualizationTypeChange("radial")}
              />
              Radial
            </label>
          </div>
        </fieldset>

        {isCubic && (
          <fieldset className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
            <legend className="px-1 font-medium text-gray-700">
              Higher primes
            </legend>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={configuration.visualization.includeHigherPrimes}
                  onChange={(event) =>
                    onIncludeHigherPrimesChange(event.target.checked)
                  }
                />
                Include
              </label>

              {configuration.visualization.includeHigherPrimes && (
                <label className="flex items-center gap-2">
                  <span>Color</span>
                  <input
                    type="color"
                    value={higherPrimeColor}
                    onChange={(event) =>
                      onHigherPrimeColorChange(event.target.value)
                    }
                  />
                </label>
              )}
            </div>
          </fieldset>
        )}

        {showHigherPrimeControls && (
          <Collapsible
            title="Placement"
            defaultOpen={false}
            animated={false}
            className="max-w-3xl rounded-md border border-gray-300 bg-white px-3"
            titleClassName="text-sm font-medium text-gray-700"
          >
            <div className="grid w-fit gap-x-5 gap-y-2 pt-1 sm:grid-cols-2 xl:grid-cols-4">
              <label className="flex items-center gap-2 text-sm">
                <span aria-hidden="true" className="whitespace-nowrap">
                  Radius {configuration.geometry.higherPrimeRadius.toFixed(1)}
                </span>

                <input
                  aria-label="Higher-prime radius"
                  className="w-28"
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

              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">
                  X {configuration.geometry.localRotation.x.toFixed(0)}°
                </span>

                <input
                  aria-label="Rotate X"
                  className="w-28"
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

              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">
                  Y {configuration.geometry.localRotation.y.toFixed(0)}°
                </span>

                <input
                  aria-label="Rotate Y"
                  className="w-28"
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

              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">
                  Z {configuration.geometry.localRotation.z.toFixed(0)}°
                </span>

                <input
                  aria-label="Rotate Z"
                  className="w-28"
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

              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">
                  Master {rotationControls.master.toFixed(0)}°
                </span>

                <input
                  aria-label="Master rotation"
                  className="w-28"
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

              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">
                  XY {rotationControls.xy.toFixed(0)}°
                </span>

                <input
                  aria-label="Rotate XY"
                  className="w-28"
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

              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">
                  YZ {rotationControls.yz.toFixed(0)}°
                </span>

                <input
                  aria-label="Rotate YZ"
                  className="w-28"
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

              <label className="flex items-center gap-2 text-sm">
                <span className="whitespace-nowrap">
                  XZ {rotationControls.xz.toFixed(0)}°
                </span>

                <input
                  aria-label="Rotate XZ"
                  className="w-28"
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
            </div>

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={resetRotationControls}
                className="rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700"
              >
                Reset rotation
              </button>
            </div>
          </Collapsible>
        )}

        {!isCubic && configuration.geometry.type === "radial" && (
          <>
            <fieldset className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
              <legend className="px-1 font-medium text-gray-700">
                Radial options
              </legend>

              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={configuration.visualization.includeLowerOctave}
                    onChange={(event) =>
                      onIncludeLowerOctaveChange(event.target.checked)
                    }
                  />
                  Lower octave
                </label>

                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={configuration.geometry.includeGeneratorHeight}
                    onChange={(event) =>
                      onIncludeGeneratorHeightChange(event.target.checked)
                    }
                  />
                  Generator height
                </label>
              </div>
            </fieldset>

            {configuration.visualization.includeLowerOctave && (
              <fieldset className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                <legend className="px-1 font-medium text-gray-700">
                  Lower-side symmetry
                </legend>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="lower-symmetry"
                      checked={
                        configuration.geometry.lowerSymmetry === "continuous"
                      }
                      onChange={() => onLowerSymmetryChange("continuous")}
                    />
                    Continuous
                  </label>

                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="lower-symmetry"
                      checked={
                        configuration.geometry.lowerSymmetry === "aligned"
                      }
                      onChange={() => onLowerSymmetryChange("aligned")}
                    />
                    Aligned
                  </label>
                </div>
              </fieldset>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default LatticeVisualizationControls;

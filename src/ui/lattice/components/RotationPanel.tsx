import type { Dispatch, SetStateAction } from "react";
import type { Rotation } from "../../../lib/lattice/types";

type RotationPanelProps = {
  combinedRot: Rotation;
  onResetRotation: () => void;
  primeColor: string;
  setPrimeColor: Dispatch<SetStateAction<string>>;
};

function RotationPanel({
  combinedRot,
  onResetRotation,
  primeColor,
  setPrimeColor,
}: RotationPanelProps) {
  const { rotX = 0, rotY = 0, rotZ = 0 } = combinedRot;

  return (
    <div className="flex flex-col gap-4 border-t border-gray-200 pt-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="rounded-lg bg-gray-100 px-4 py-3 font-mono text-xs text-gray-700">
        <p className="font-sans font-semibold text-gray-900">
          Effective rotation
        </p>

        <dl className="mt-2 grid grid-cols-3 gap-4">
          <div>
            <dt className="text-gray-500">X</dt>
            <dd>{rotX.toFixed(1)}°</dd>
          </div>

          <div>
            <dt className="text-gray-500">Y</dt>
            <dd>{rotY.toFixed(1)}°</dd>
          </div>

          <div>
            <dt className="text-gray-500">Z</dt>
            <dd>{rotZ.toFixed(1)}°</dd>
          </div>
        </dl>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label
            htmlFor="prime-colour"
            className="block text-sm font-semibold text-gray-800"
          >
            High-prime colour
          </label>

          <input
            id="prime-colour"
            type="color"
            value={primeColor}
            onChange={(e) => setPrimeColor(e.target.value)}
            className="mt-2 h-10 w-1/6 cursor-pointer rounded border border-gray-300 bg-white p-1"
          />
        </div>

        <button
          type="button"
          onClick={onResetRotation}
          className="rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Reset rotation
        </button>
      </div>
    </div>
  );
}

export default RotationPanel;

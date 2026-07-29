import type { Dispatch, SetStateAction } from "react";
import type {
  PlacementMode,
  PlacementModeOption,
} from "../../../lib/lattice/types";
import RatioInput from "./RatioInput";

type ratioControlsProps = {
  onAdd: (value: string) => void;
  undo: () => void;
  reset: () => void;
  mode: PlacementMode;
  setMode: Dispatch<SetStateAction<PlacementMode>>;
  inputError: string | null;
  modeOptions: PlacementModeOption[];
};

function RatioControls({
  onAdd,
  undo,
  reset,
  mode,
  setMode,
  inputError,
  modeOptions,
}: ratioControlsProps) {
  return (
    <section aria-label="Lattice controls">
      <div className="flex flex-col gap-3 lg:flex-row">
        <RatioInput onAdd={onAdd} />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={undo}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-300"
          >
            Undo
          </button>

          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-300"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label
          htmlFor="placement-mode"
          className="text-sm font-semibold text-gray-800"
        >
          Placement mode
        </label>

        <select
          id="placement-mode"
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
          value={mode}
          onChange={(event) => setMode(event.target.value as PlacementMode)}
        >
          {modeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {inputError && (
        <p className="mt-3 text-sm font-medium text-red-700" role="alert">
          {inputError}
        </p>
      )}
    </section>
  );
}

export default RatioControls;

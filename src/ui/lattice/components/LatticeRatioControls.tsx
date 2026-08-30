import { useState } from "react";

type LatticeRatioControlsProps = {
  onAdd: (rawInput: string) => boolean;
  onUndo: () => void;
  onReset: () => void;
  inputError: string | null;
};

function LatticeRatioControls({
  onAdd,
  onUndo,
  onReset,
  inputError,
}: LatticeRatioControlsProps) {
  const [rawInput, setRawInput] = useState("");

  return (
    <div className="flex flex-wrap items-start gap-2">
      <form
        className="flex items-start gap-2"
        onSubmit={(event) => {
          event.preventDefault();

          const wasAdded = onAdd(rawInput);

          if (!wasAdded) return;

          setRawInput("");
        }}
      >
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <span>Ratio</span>

          <input
            className="w-28 rounded-md border border-gray-300 px-2 py-1.5 text-sm"
            value={rawInput}
            placeholder="e.g. 3/2"
            onChange={(event) => setRawInput(event.target.value)}
          />
        </label>

        <button
          type="submit"
          className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white"
        >
          Add
        </button>
      </form>

      <button
        type="button"
        onClick={onUndo}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
      >
        Undo
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700"
      >
        Reset
      </button>

      {inputError && (
        <p role="alert" className="basis-full text-sm text-red-700">
          {inputError}
        </p>
      )}
    </div>
  );
}

export default LatticeRatioControls;

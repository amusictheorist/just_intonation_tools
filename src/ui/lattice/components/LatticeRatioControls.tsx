import { useState } from "react";

type LatticeRatioControlsProps = {
  onAdd: (rawInput: string) => void;
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
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(rawInput);
        }}
      >
        <label>
          Ratio
          <input
            value={rawInput}
            onChange={(event) => setRawInput(event.target.value)}
          />
        </label>

        <button type="submit">Add ratio</button>
      </form>

      {inputError && <p role="alert">{inputError}</p>}

      <button type="button" onClick={onUndo}>
        Undo
      </button>

      <button type="button" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default LatticeRatioControls;

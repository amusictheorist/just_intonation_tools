import RatioInput from "./RatioInput";

const RatioControls = ({
  onAdd,
  undo,
  reset,
  mode,
  setMode,
  inputError,
  modeOptions
}) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-4">Ratio lattice Generator</h1>

      <div className="flex justify-center gap-4 mb-4">
        <RatioInput onAdd={onAdd} />

        <button
          onClick={undo}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Undo
        </button>

        <button
          onClick={reset}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Reset
        </button>
      </div>

      <div className="flex justify-center gap-4 mb-2">
        <label className="text-sm font-medium">Mode:</label>

        <select
          className="px-3 py-2 border rounded"
          value={mode}
          onChange={e => setMode(e.target.value)}
        >
          {modeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {inputError && (
        <div className="text-red-600 text-sm mt-2">{inputError}</div>
      )}

    </header>
  );
};

export default RatioControls;
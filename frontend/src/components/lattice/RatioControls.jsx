import RatioInput from "./RatioInput";

const RatioControls = ({
  onAdd,
  undo,
  reset,
  mode,
  setMode,
  inputError
}) => {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold mb-4">Ratio lattice Generator</h1>

      <div className="flex justify-center gap-4 mb-4">
        <RatioInput onAdd={onaAdd} />

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
          <option value="cubic">Cubic</option>
          <option value="expanded_cubic">Expanded Cubic</option>
          <option value="radial">Radial</option>
          <option value="expanded_radial">Expanded Radial</option>
        </select>
      </div>

      {inputError && (
        <div className="text-red-600 text-sm mt-2">{inputError}</div>
      )}

    </header>
  );
};

export default RatioControls;
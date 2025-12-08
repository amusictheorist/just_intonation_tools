import { useState } from "react";
import { useRatios, Modes } from "./hooks/useRatios";
import RatioInput from './RatioInput';
import LatticeCanvas from './LatticeCanvas';

const LatticePage = () => {
  const {
    ratios,
    addRatio,
    removeRatio,
    undo,
    reset,
    mode,
    setMode,
  } = useRatios();

  const [inputError, setInputError] = useState(null);

  const handleAdd = (raw) => {
    const { success, error } = addRatio(raw);
    if (!success) setInputError(error);
    else setInputError(null);
  };

  return (
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Ratio Lattice Generator</h1>

        <div className="flex justify-center gap-4 mb-4">
          <RatioInput onAdd={handleAdd} />
          <button
            onClick={undo}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Undo
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
          >
            Reset
          </button>
        </div>

        <div className="flex justify-center gap-4 mb-2">
          <label className="text-sm font-medium">Mode:</label>
          <select
            className="px-3 py-2 border rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value={Modes.CUBIC}>Cubic</option>
            <option value={Modes.EXPANDED_CUBIC}>Expanded Cubic</option>
            <option value={Modes.RADIAL}>Radial</option>
            <option value={Modes.EXPANDED_RADIAL}>Expanded Radial</option>
          </select>
        </div>

        {inputError && (
          <div className="text-red-600 text-sm mt-2">
            {inputError}
          </div>
        )}
      </header>
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-[1000px] mx-auto">
        <LatticeCanvas
          ratios={ratios}
          mode={mode}
          removeRatio={removeRatio}
        />
      </div>
      <div
        id='lattice-tooltip'
        style={{
          position: "fixed",
          display: 'none',
          pointerEvents: 'none',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '6px 10px',
          border: '1px solid #444',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#000',
          whiteSpace: 'nowrap',
          zIndex: '9999'
        }}
      />
    </div>
  );
};

export default LatticePage;
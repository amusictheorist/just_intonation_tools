import { useMemo, useState } from "react";
import { useRatios, Modes } from "./hooks/useRatios";
import RatioInput from './RatioInput';
import LatticeCanvas from './LatticeCanvas';
import { factorRatio } from "./placement/expandedCubic";

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
  const [radiusScale, setRadiusScale] = useState(1);
  const [rotationAngle, setRotationAngle] = useState(0);

  const handleAdd = (raw) => {
    const { success, error } = addRatio(raw);
    if (!success) setInputError(error);
    else setInputError(null);
  };

  const hasHighPrime = useMemo(() => {
    return ratios.some(r => {
      const factors = factorRatio(r);
      return [...factors.keys()].some(p => p > 7);
    });
  }, [ratios]);

  const controls = useMemo(
    () => ({
      radiusScale,
      rotationAngle
    }),
    [radiusScale, rotationAngle]
  );

  return (
    <div className="pt-[100px] px-8 py-12 text-center bg-gray-50">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Ratio Lattice Generator</h1>

        {/* input controls */}
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

        {/* sliders for expanded cubic mode */}
        <div className="w-full flex flex-col items-center gap-4">
          {hasHighPrime && (
            <div className="flex flex-row gap-8 w-full max-w-xl justify-center">
              <div className="flex flex-col items-center">
                <label className="dont-medium mb-1">Sphere Radius</label>
                <input
                  type="range"
                  min='0.5'
                  max='2'
                  step='0.01'
                  value={radiusScale}
                  onChange={e => setRadiusScale(parseFloat(e.target.value))}
                  className="w-40"
                />
                <div className="text-sm">Scale: {radiusScale.toFixed(2)}</div>
              </div>

              <div className="flex flex-col items-center">
                <label className="font-medium mb-1">Local Lattice Rotation</label>
                <input
                  type="range"
                  min='0'
                  max='360'
                  step='1'
                  value={rotationAngle}
                  onChange={e => setRotationAngle(parseFloat(e.target.value))}
                  className="w-40"
                />
                <div className="text-sm">Angle: {rotationAngle}º</div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* 3d canvas */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-[1000px] mx-auto">
        <LatticeCanvas
          ratios={ratios}
          mode={mode}
          controls={controls}
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
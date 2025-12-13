import { useMemo, useState } from "react";
import { useRatios, Modes } from "./hooks/useRatios";
import RatioInput from "./RatioInput";
import LatticeCanvas from "./LatticeCanvas";
import { factorRatio } from "./placement/expandedCubic";

const LatticePage = () => {
  const {
    ratios,
    addRatio,
    removeRatio,
    undo,
    reset,
    mode,
    setMode
  } = useRatios();

  const [inputError, setInputError] = useState(null);
  const [radiusScale, setRadiusScale] = useState(2);

  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [rotZ, setRotZ] = useState(0);

  const [masterRot, setMasterRot] = useState(0);
  const [rotXY, setRotXY] = useState(0);
  const [rotYZ, setRotYZ] = useState(0);
  const [rotXZ, setRotXZ] = useState(0);

  const handleAdd = raw => {
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

  const combinedRot = {
    rotX: rotX + masterRot + rotXY + rotXZ,
    rotY: rotY + masterRot + rotXY + rotYZ,
    rotZ: rotZ + masterRot + rotYZ + rotXZ
  };

  const controls = useMemo(
    () => ({
      radiusScale,
      rotation: combinedRot
    }),
    [radiusScale, combinedRot]
  );

  const controlsReady =
    radiusScale !== undefined &&
    combinedRot.rotX !== undefined &&
    combinedRot.rotY !== undefined &&
    combinedRot.rotZ !== undefined;

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
            onChange={e => setMode(e.target.value)}
          >
            <option value={Modes.CUBIC}>Cubic</option>
            <option value={Modes.EXPANDED_CUBIC}>Expanded Cubic</option>
            <option value={Modes.RADIAL}>Radial</option>
            <option value={Modes.EXPANDED_RADIAL}>Expanded Radial</option>
          </select>
        </div>

        {inputError && (
          <div className="text-red-600 text-sm mt-2">{inputError}</div>
        )}

        {/* slider matrix for expanded cubic mode */}
        {/* ---------------- SLIDER MATRIX ---------------- */}
        {hasHighPrime && (
          <div className="mt-6 w-full flex flex-col items-center gap-6">

            {/* ---------- COMPACT GRID LAYOUT ---------- */}
            <div className="grid grid-cols-4 gap-x-8 gap-y-4 max-w-4xl mx-auto">

              {/* Radius */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Radius</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.01"
                  value={radiusScale}
                  onChange={e => setRadiusScale(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

              {/* Rot X */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Rot X</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotX}
                  onChange={e => setRotX(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

              {/* Rot Y */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Rot Y</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotY}
                  onChange={e => setRotY(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

              {/* Rot Z */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Rot Z</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotZ}
                  onChange={e => setRotZ(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

              {/* Master Rotation */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Master Rot</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={masterRot}
                  onChange={e => setMasterRot(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

              {/* Rot XY */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Rot XY</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotXY}
                  onChange={e => setRotXY(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

              {/* Rot YZ */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Rot YZ</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotYZ}
                  onChange={e => setRotYZ(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

              {/* Rot XZ */}
              <div className="flex flex-col items-center text-sm">
                <label className="font-medium mb-1">Rot XZ</label>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={rotXZ}
                  onChange={e => setRotXZ(parseFloat(e.target.value))}
                  className="w-28"
                />
              </div>

            </div>

            {/* ---------- Effective rotation + Reset in one row ---------- */}
            <div className="flex flex-row items-center gap-4 mt-2">

              {/* Effective rotation panel */}
              <div className="bg-gray-200 px-4 py-2 rounded-lg text-xs font-mono">
                <div className="font-semibold">Effective Rotation:</div>
                <div>X: {combinedRot.rotX.toFixed(1)}°</div>
                <div>Y: {combinedRot.rotY.toFixed(1)}°</div>
                <div>Z: {combinedRot.rotZ.toFixed(1)}°</div>
              </div>

              {/* Reset button */}
              <button
                onClick={() => {
                  setRotX(0);
                  setRotY(0);
                  setRotZ(0);
                  setMasterRot(0);
                  setRotXY(0);
                  setRotYZ(0);
                  setRotXZ(0);
                }}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-xs"
              >
                Reset Rotation
              </button>

            </div>
          </div>
        )}
      </header>

      {/* 3d canvas */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200 w-full max-w-[1000px] mx-auto">
        <LatticeCanvas
          ratios={ratios}
          mode={mode}
          controls={controls}
          controlsReady={controlsReady}
          removeRatio={removeRatio}
        />
      </div>

      {/* tooltip element */}
      <div
        id="lattice-tooltip"
        style={{
          position: "fixed",
          display: "none",
          pointerEvents: "none",
          background: "rgba(255, 255, 255, 0.95)",
          padding: "6px 10px",
          border: "1px solid #444",
          borderRadius: "6px",
          fontSize: "12px",
          color: "#000",
          whiteSpace: "nowrap",
          zIndex: "9999"
        }}
      />
    </div>
  );
};

export default LatticePage;

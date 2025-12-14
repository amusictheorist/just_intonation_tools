const RotationPanel = ({ combinedRot, onResetRotation, primeColor, setPrimeColor }) => {
  return (
    <div className="flex flex-row items-center gap-6 mt-3 justify-center">

      {/* effective rotation panel */}
      <div className="bg-gray-200 px-4 py-2 rounded-lg text-xs font-mono">
        <div className="font-semibold">Effective Rotation:</div>
        <div>X: {combinedRot.rotX.toFixed(1)}°</div>
        <div>Y: {combinedRot.rotY.toFixed(1)}°</div>
        <div>Z: {combinedRot.rotZ.toFixed(1)}°</div>
      </div>

      <button
        onClick={onResetRotation}
        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-xs"
      >
        Reset Rotation
      </button>

      {/* color picker */}
      <div className="flex flex-col items-center text-xs">
        <label className="font-semibold mb-1">High-Prime Sphere Color</label>
        <input
          type="color"
          value={primeColor}
          onChange={e => setPrimeColor(e.target.value)}
          className="w-10 h-6 cursor-pointer border rounded"
        />
      </div>
    </div>
  );
};

export default RotationPanel;
const RotationPanel = ({ combinedRot, onResetRotation }) => {
  return (
    <div className="flex flex-row items-center gap-4 mt-2">
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
    </div>
  );
};

export default RotationPanel;
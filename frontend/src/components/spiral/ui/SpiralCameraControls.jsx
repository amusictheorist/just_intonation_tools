const SpiralCameraControls = ({ zoom, onZoomIn, onZoomOut, onReset }) => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-4">
      <button
        onClick={onZoomIn}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        +
      </button>
      
      <span className="text-sm text-gray-600">
        Zoom: {zoom.toFixed(2)}
      </span>
      
      <button
        onClick={onZoomOut}
        className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
      >
        -
      </button>
      
      <button
        onClick={onReset}
        className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
      >
        Reset View
      </button>
    </div>
  );
};

export default SpiralCameraControls;
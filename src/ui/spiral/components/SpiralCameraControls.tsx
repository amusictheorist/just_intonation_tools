type SpiralCameraControlsProps = {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
};

function SpiralCameraControls({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
}: SpiralCameraControlsProps) {
  return (
    <div className="mt-4 flwx flex-wrap items-center justify-center gap-3">
      <button
        type="button"
        onClick={onZoomOut}
        aria-label="Zoom out"
        className="rounded-md bg-gray-200 px-3 py-1.5 font-semibold transition hover:bg-gray-300"
      >
        −
      </button>

      <output className="min-w-24 text-center text-sm text-gray-600">
        Zoom {zoom.toFixed(2)}
      </output>

      <button
        type="button"
        onClick={onZoomIn}
        aria-label="Zoom in"
        className="rounded-md bg-gray-200 px-3 py-1.5 font-semibold transition hover:bg-gray-300"
      >
        +
      </button>

      <button
        type="button"
        onClick={onReset}
        className="rounded-md bg-gray-200 px-3 py-1.5 font-semibold transition hover:bg-gray-300"
      >
        Reset view
      </button>
    </div>
  );
}

export default SpiralCameraControls;

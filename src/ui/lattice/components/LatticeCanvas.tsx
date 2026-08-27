import * as THREE from "three";
import { useRef, useState } from "react";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { useLatticeScene } from "../hooks/useLatticeScene";
import type { LatticePointHover } from "../scene/latticePointHover";

type LatticeCanvasProps = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
  higherPrimeColor: THREE.ColorRepresentation;
  onPointRemove: (pointId: string) => void;
};

type LatticePointTooltip = Readonly<{
  pointId: string;
  left: number;
  top: number;
}> | null;

function LatticeCanvas({
  scenePoints,
  sceneConnections,
  higherPrimeColor,
  onPointRemove,
}: LatticeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointTooltip, setPointTooltip] = useState<LatticePointTooltip>(null);

  function handlePointHover(hover: LatticePointHover): void {
    if (!hover) {
      setPointTooltip(null);
      return;
    }

    const container = containerRef.current;

    if (!container) {
      setPointTooltip(null);
      return;
    }

    const bounds = container.getBoundingClientRect();

    setPointTooltip({
      pointId: hover.pointId,
      left: hover.clientX - bounds.left + 12,
      top: hover.clientY - bounds.top + 12,
    });
  }

  useLatticeScene(containerRef, {
    scenePoints,
    sceneConnections,
    higherPrimeColor,
    onPointHover: handlePointHover,
    onPointRemove,
  });

  const hoveredPoint = pointTooltip
    ? scenePoints.find((point) => point.id === pointTooltip.pointId)
    : undefined;

  return (
    <div
      ref={containerRef}
      aria-label="Interactive ratio-lattice visualizer"
      className="relative min-h-64 w-full flex-1 overflow-hidden rounded-lg border border-gray-300 bg-white"
    >
      {hoveredPoint && pointTooltip && (
        <div
          className="pointer-events-none absolute z-10 rounded border border-gray-300 bg-white px-2 py-1 text-sm shadow-sm"
          style={{
            left: pointTooltip.left,
            top: pointTooltip.top,
          }}
        >
          <div className="font-medium">
            {hoveredPoint.labelRatio.numerator.toString()}/
            {hoveredPoint.labelRatio.denominator.toString()}
          </div>

          {hoveredPoint.rawInput !==
            `${hoveredPoint.labelRatio.numerator}/${hoveredPoint.labelRatio.denominator}` && (
            <div className="text-gray-600">
              Entered as {hoveredPoint.rawInput}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LatticeCanvas;

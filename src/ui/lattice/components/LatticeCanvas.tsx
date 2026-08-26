import * as THREE from "three";
import { useRef } from "react";
import type { LatticeSceneConnection } from "../../../lib/lattice/presentation/latticeSceneConnection";
import type { LatticeScenePoint } from "../../../lib/lattice/presentation/latticeScenePoint";
import { useLatticeScene } from "../hooks/useLatticeScene";

type LatticeCanvasProps = {
  scenePoints: readonly LatticeScenePoint[];
  sceneConnections: readonly LatticeSceneConnection[];
  higherPrimeColor: THREE.ColorRepresentation;
};

function LatticeCanvas({
  scenePoints,
  sceneConnections,
  higherPrimeColor,
}: LatticeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLatticeScene(containerRef, {
    scenePoints,
    sceneConnections,
    higherPrimeColor,
  });

  return (
    <div
      ref={containerRef}
      aria-label="Interactive ratio-lattice visualizer"
      className="relative min-h-64 w-full flex-1 overflow-hidden rounded-lg border border-gray-300 bg-white"
    />
  );
}

export default LatticeCanvas;

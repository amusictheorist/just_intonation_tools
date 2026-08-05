import type * as THREE from "three";
import type {
  FractionWithValue,
  LatticeControls,
  LatticeCoordinate,
  LatticeType,
  PlacementMode,
  Ratio,
} from "../../../lib/lattice/types";
import type { PrimeFactors } from "../../../lib/lattice/math/factors";

export type LatticePointData = Partial<Ratio> & {
  lattice: LatticeCoordinate;
  latticeType: LatticeType;
  primeAnchor: number | null;
  octaveLabel: string;
  rawInput: string | null;
  rawValue: number | null;
  octaveValue: number | null;
  canonicalKey?: string;
  canonical?: FractionWithValue;
  factors?: PrimeFactors;
  labelSprite?: THREE.Sprite;
};

export type LatticePointMesh = THREE.Mesh<
  THREE.SphereGeometry,
  THREE.MeshStandardMaterial
> & {
  userData: LatticePointData;
};

export type ConnectionLine = THREE.Line<
  THREE.BufferGeometry,
  THREE.LineBasicMaterial
> & {
  userData: {
    p1: LatticePointMesh;
    p2: LatticePointMesh;
  };
};

export type RemovableLatticePoint = LatticePointMesh;

export type SceneManagerInteractionTarget = {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  points: LatticePointMesh[];
  toRemove: RemovableLatticePoint[];
  tooltip: {
    show: (data: LatticePointData, x: number, y: number) => void;
    hide: () => void;
  };
  onRemove?: (id: string) => void;
};

export type ScenePointInput = {
  x: number;
  y: number;
  z: number;
  label: string;
  color: THREE.ColorRepresentation;
  data: Partial<LatticePointData>;
};

export type LatticeSceneManager = SceneManagerInteractionTarget & {
  connections: {
    lines: ConnectionLine[];
    rebuild: (points: LatticePointMesh[]) => void;
    update: () => void;
    clear: () => void;
  };
  addPoint: (
    x: number,
    y: number,
    z: number,
    label: string,
    color: THREE.ColorRepresentation,
    data: Partial<LatticePointData>,
  ) => void;
  clearPoints: () => void;
  rebuildConnections: () => void;
};

export type SceneUpdateOptions = {
  ratios: Ratio[];
  mode: PlacementMode;
  controls: LatticeControls;
};

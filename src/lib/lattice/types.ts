export type Fraction = {
  num: number;
  den: number;
};

export type FractionWithValue = Fraction & {
  value: number;
};

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type RatioParseOptions = {
  maxDen?: number;
  allowNegatives?: boolean;
};

export type ParsedRatio =
  | {
      valid: true;
      raw: string;
      error: null;
      canonical: FractionWithValue;
      octave: FractionWithValue;
    }
  | {
      valid: false;
      raw: string;
      error: string;
      canonical: null;
      octave: null;
    };

export type Ratio = {
  id: string;
  raw: string;
  valid: true;
  error: null;
  canonical: FractionWithValue;
  octave: FractionWithValue;
  num: number;
  den: number;
  value: number;
};

export type InvalidRatio = {
  id: null;
  raw: string;
  valid: false;
  error: string;
};

export type RatioResult = Ratio | InvalidRatio;

export type Rotation = {
  rotX?: number;
  rotY?: number;
  rotZ?: number;
};

export type PlacementControls = {
  radiusScale?: number;
  rotation?: Rotation;
};

export type LatticeType = "global" | "prime" | "radial";

export type LatticeCoordinate = number[] | Array<[number, number]>;

export type PlacementResult = {
  x: number;
  y: number;
  z: number;
  lattice: LatticeCoordinate;
  latticeType: LatticeType;
  primeAnchor: number | null;
};

export type PlacementMode =
  | "cubic"
  | "expanded_cubic"
  | "radial"
  | "expanded_radial";

export type PlacementModeOption = {
  value: PlacementMode;
  label: string;
};

export type PrimeFrame = {
  origin: Vector3;
  Xp: Vector3;
  Yp: Vector3;
  Zp: Vector3;
};

export type LatticeControls = PlacementControls & {
  primeColor: string;
};

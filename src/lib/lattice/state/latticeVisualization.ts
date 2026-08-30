export type LatticeVisualization =
  | Readonly<{
      type: "cubic";
      includeHigherPrimes: boolean;
    }>
  | Readonly<{
      type: "radial";
      includeLowerOctave: boolean;
    }>;

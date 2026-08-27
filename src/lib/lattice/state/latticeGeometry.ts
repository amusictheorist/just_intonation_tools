/**
 * Selects the relationship between upper- and lower-side expanded radial positions.
 *
 * `continuous` preserves the lower ratio's signed horizontal direction, placing it 180 degrees around the origin from its aligned upper-side counterpart.
 *
 * `aligned` places a lower-side ratio at the same horizontal position as its upper-side inverse, with the vertical coordinate reflected below the origin.
 */
export type LowerRadialSymmetry = "continuous" | "aligned";

export type CubicRotation = Readonly<{
  x: number;
  y: number;
  z: number;
}>;

export type LatticeGeometry =
  | Readonly<{
      type: "cubic";
      higherPrimeRadius: number;
      higherPrimeRotation: CubicRotation;
    }>
  | Readonly<{
      type: "radial";
      includeGeneratorHeight: boolean;
      lowerSymmetry: LowerRadialSymmetry;
    }>;

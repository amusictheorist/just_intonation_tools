/**
 * Selects how lower-side expanded radial positions are reflected.
 *
 * `continuous` reflects through the origin, preserving continuity around the radial path. `aligned` reflects only the vertical axis, keeping lower-side positions horizontally aligned with their upper-side counterparts.
 */

export type LowerRadialSymmetry = "continuous" | "aligned";

export type CubicLocalRotation = Readonly<{
  x: number;
  y: number;
  z: number;
}>;

export type LatticeGeometry =
  | Readonly<{
      type: "cubic";
      higherPrimeRadius: number;
      localRotation: CubicLocalRotation;
    }>
  | Readonly<{
      type: "radial";
      includeGeneratorHeight: boolean;
      lowerSymmetry: LowerRadialSymmetry;
    }>;

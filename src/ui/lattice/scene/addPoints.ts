import {
  factorRatio,
  normalizeBelowOne,
} from "../../../lib/lattice/math/factors";
import { placeRatio } from "../../../lib/lattice/placement/placementIndex";
import type {
  LatticeControls,
  PlacementMode,
  Ratio,
} from "../../../lib/lattice/types";
import type { LatticeSceneManager } from "./types";

export const addPoints = (
  manager: LatticeSceneManager,
  ratios: Ratio[],
  mode: PlacementMode,
  controls: LatticeControls,
): void => {
  manager.clearPoints();

  for (const ratio of ratios) {
    const coordinates = placeRatio(ratio, mode, controls);

    if (!coordinates) continue;

    const { x, y, z } = coordinates;

    let labelNumerator: number;
    let labelDenominator: number;

    if (mode === "expanded_radial" && ratio.canonical.value < 1) {
      const normalized = normalizeBelowOne(
        ratio.canonical.num,
        ratio.canonical.den,
      );

      labelNumerator = normalized.num;
      labelDenominator = normalized.den;
    } else {
      labelNumerator = ratio.octave.num;
      labelDenominator = ratio.octave.den;
    }

    const octaveLabel = `${labelNumerator}/${labelDenominator}`;

    const isHighPrime = coordinates.latticeType === "prime";

    const color = isHighPrime ? controls.primeColor : 0xff000;

    const canonicalKey = `${ratio.canonical.num}/${ratio.canonical.den}`;

    manager.addPoint(x, y, z, octaveLabel, color, {
      ...ratio,
      rawInput: ratio.raw,
      rawValue: ratio.canonical.value,
      octaveValue: ratio.octave.value,
      octaveLabel,
      lattice: coordinates.lattice,
      latticeType: coordinates.latticeType,
      primeAnchor: coordinates.primeAnchor,
      canonicalKey,
      factors: factorRatio(ratio),
    });
  }

  manager.rebuildConnections();
};

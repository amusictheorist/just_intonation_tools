import { placeRatio } from "../placement";
import { factorRatio } from "../placement/expandedCubic";

const normalizeBelowOne = (num, den) => {
  while (num / den < 0.5) {
    num *= 2;
  }
  return { num, den };
};

export const addPoints = (manager, ratios, mode, controls) => {
  manager.clearPoints();

  ratios.forEach(ratio => {
    const coords = placeRatio(ratio, mode, controls);
    if (!coords) return;

    const { x, y, z } = coords;

    let labelNum, labelDen;

    if (mode === 'expanded_radial') {
      const baseValue = ratio.canonical.value;

      if (baseValue >= 1) {
        labelNum = ratio.octave.num;
        labelDen = ratio.octave.den;
      } else {
        const { num, den } = normalizeBelowOne(
          ratio.canonical.num,
          ratio.canonical.den
        );
        labelNum = num;
        labelDen = den;
      }
    } else {
      labelNum = ratio.octave.num;
      labelDen = ratio.octave.den;
    }

    const octaveLabel = `${labelNum}/${labelDen}`;

    const isHighPrime = coords.latticeType === 'prime';
    const color = isHighPrime ? controls.primeColor : 0xff0000;

    const canonical = ratio.canonical;
    const canonicalValue = canonical ? canonical.value : null;
    const canonicalKey = `${canonical.num}/${canonical.den}`;
    const factors = factorRatio(ratio);

    manager.addPoint(
      x,
      y,
      z,
      octaveLabel,
      color,
      {
        ...ratio,
        rawInput: ratio.raw,
        octaveLabel,
        lattice: coords.lattice,
        latticeType: coords.latticeType,
        primeAnchor: coords.primeAnchor,
        canonical,
        canonicalValue,
        canonicalKey,
        factors
      }
    );
  });

  manager.rebuildConnections();
};

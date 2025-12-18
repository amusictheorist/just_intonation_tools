import { placeRatio } from "../placement";
import { factorRatio } from "../placement/expandedCubic";

export const addPoints = (manager, ratios, mode, controls) => {
  manager.clearPoints();

  ratios.forEach(ratio => {
    const coords = placeRatio(ratio, mode, controls);
    if (!coords) return;

    const { x, y, z } = coords;
    const octaveLabel = `${ratio.octave.num}/${ratio.octave.den}`;
    const isHighPrime = coords.latticeType === 'prime';
    const color = isHighPrime ? controls.primeColor : 0xff0000;

    const canonical = ratio.canonical;
    const canonicalValue = canonical ? canonical.value : null;
    const canonicalKey = `${ratio.canonical.num}/${ratio.canonical.den}`;
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
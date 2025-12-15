import { placeRatio } from "../placement";

export const addPoints = (manager, ratios, mode, controls) => {
  manager.clearPoints();

  ratios.forEach(ratio => {
    const coords = placeRatio(ratio, mode, controls);
    if (!coords) return;

    const { x, y, z } = coords;
    const octaveLabel = `${ratio.octave.num}/${ratio.octave.den}`;
    const isHighPrime = coords.latticeType === 'prime';
    const color = isHighPrime ? controls.primeColor : 0x3366ff;


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
        primeAnchor: coords.primeAnchor
      }
    );
  });

  manager.rebuildConnections();
};
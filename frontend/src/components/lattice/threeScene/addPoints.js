import { placeRatio } from "../placement";

export const addPoints = (manager, ratios, mode, controls) => {
  manager.clearPoints();

  ratios.forEach(ratio => {
    const coords = placeRatio(ratio, mode, controls);
    if (!coords) return;

    const { x, y, z } = coords;

    const isHighPrime = coords.latticeType === 'prime';
    const color = isHighPrime ? controls.primeColor : 0x3366ff;

    const octaveLabel = `${ratio.octave.num}/${ratio.octave.den}`;

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
        latticeType: coords.latticeType
      }
    );
  });
};
import { factor357 } from '../../utils/math/helpers';

export const place = (ratio) => {
  const { num, den } = ratio.octave;
  const fn = factor357(num);
  const fd = factor357(den);

  if (fn.leftover !== 1 || fd.leftover !== 1) return null;

  const x = fn.a - fd.a;
  const y = fn.b - fd.b;
  const z = fn.c - fd.c;

  return {
    x,
    y,
    z,
    lattice: [x, y, z],
    latticeType: 'global',
    primeAnchor: null
  };
};
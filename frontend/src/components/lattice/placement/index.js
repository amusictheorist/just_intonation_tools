import * as cubic from './cubic';
import * as expandedCubic from './expandedCubic';
import * as radial from './radial';
import * as expandedRadial from './expandedRadial';

const MAP = {
  cubic,
  expandedCubic,
  radial,
  expandedRadial
};

export const placeRatio = (ratio, mode) => {
  return MAP[mode].place(ratio);
};
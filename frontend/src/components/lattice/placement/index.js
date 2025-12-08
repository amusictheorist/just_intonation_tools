import { place as placeCubic } from './cubic';
import { placeExpanded } from './expandedCubic';

export const placeRatio = (ratio, mode) => {
  switch (mode) {
    case 'cubic':
      return placeCubic(ratio);
    case 'expanded_cubic':
      return placeExpanded(ratio);
    default:
      return placeCubic(ratio);
  }
};
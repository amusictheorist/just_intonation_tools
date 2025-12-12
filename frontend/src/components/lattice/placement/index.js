import { place as placeCubic } from './cubic';
import { placeExpanded } from './expandedCubic';

export const placeRatio = (ratio, mode, controls = {}) => {
  switch (mode) {
    case 'cubic':
      return placeCubic(ratio);
    
    case 'expanded_cubic':
      return placeExpanded(ratio, controls);
    
    default:
      return placeCubic(ratio);
  }
};
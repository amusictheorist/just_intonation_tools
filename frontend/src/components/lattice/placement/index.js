import { place as placeCubic } from './cubic';
import { placeExpanded } from './expandedCubic';
import { placeExpandedRadial } from './expandedRadial';
import { placeRadial } from './radial';

export const placeRatio = (ratio, mode, controls = {}) => {
  switch (mode) {
    case 'cubic':
      return placeCubic(ratio);
    
    case 'expanded_cubic':
      return placeExpanded(ratio, controls);
    
    case 'radial':
      return placeRadial(ratio, controls);
    
    case 'expanded_radial':
      return placeExpandedRadial(ratio, controls);
    
    default:
      return placeCubic(ratio);
  }
};
import * as classic from './classic';

const MAP = {
  classic
};

export const placeRatio = (ratio, mode) => {
  return MAP[mode].place(ratio);
};
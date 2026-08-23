import fc from "fast-check";

export const coordinateArbitrary = fc
  .double({ min: -1000, max: 1000, noNaN: true, noDefaultInfinity: true })
  .filter((value) => Math.abs(value) >= 1e-6 || value === 0);

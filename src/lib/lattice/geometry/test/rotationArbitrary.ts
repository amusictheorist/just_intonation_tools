import fc from "fast-check";

const doubleArbitrary = fc.double({
  min: -360,
  max: 360,
  noNaN: true,
  noDefaultInfinity: true,
});

export const rotationArbitrary = fc.record({
  x: doubleArbitrary,
  y: doubleArbitrary,
  z: doubleArbitrary,
});

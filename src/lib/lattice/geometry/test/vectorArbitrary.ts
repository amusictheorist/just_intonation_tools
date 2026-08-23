import fc from "fast-check";

const coordinateArbitrary = fc.integer({ min: -100, max: 100 });

export const vectorArbitrary = fc.record({
  x: coordinateArbitrary,
  y: coordinateArbitrary,
  z: coordinateArbitrary,
});

export const useSpiralViewBox = ({
  maxTheta,
  zoom,
  pan,
  r0 = 30,
  padding = 60
}) => {
  const rMax = r0 * (maxTheta / 360);
  const baseExtent = Math.max(rMax + padding, 120);
  const extent = baseExtent / zoom;

  const viewBox = [
    -extent + pan.x,
    -extent + pan.y,
    extent * 2,
    extent * 2
  ].join(' ');

  return {
    viewBox,
    extent,
    baseExtent
  };
};
import { useEffect } from "react";

export const useSpiralSelectionStyling = (svgGroupRef, selected) => {
  useEffect(() => {
    if (!svgGroupRef.current) return;

    svgGroupRef.current
      .querySelectorAll('circle')
      .forEach(dot => {
        const val = Number(dot.getAttribute('data-value'));
        if (!isNaN(val)) {
          dot.setAttribute(
            'fill',
            selected.has(val) ? 'red' : 'black'
          );
        }
      });
  }, [selected, svgGroupRef]);
};
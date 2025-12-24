import { useEffect } from "react";

export const useSpiralVisibility = svgGroupRef => {
  useEffect(() => {
    if (!svgGroupRef) return;

    svgGroupRef.current
      .querySelectorAll('text[data-value]')
      .forEach(label => {
        const n = Number(label.getAttribute('data-value'));
        if (isNaN(n)) return;

        const shouldShow =
          n < 120 || (n >= 120 && n % 2 === 0);
        label.style.display = shouldShow ? 'block' : 'none'
      });
  });
};
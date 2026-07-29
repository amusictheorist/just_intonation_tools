import { useEffect, type RefObject } from "react";

export const useSpiralSelectionStyling = (
  svgGroupRef: RefObject<SVGGElement | null>,
  selected: Set<number>,
): void => {
  useEffect(() => {
    const groupElement = svgGroupRef.current;

    if (!groupElement) {
      return;
    }

    const dots = Array.from(
      groupElement.querySelectorAll<SVGCircleElement>("circle[data-value]"),
    );

    for (const dot of dots) {
      const attribute = dot.getAttribute("data-value");

      if (attribute === null) {
        continue;
      }

      const value = Number(attribute);

      if (!Number.isFinite(value)) {
        continue;
      }

      dot.setAttribute("fill", selected.has(value) ? "red" : "black");
    }
  }, [selected, svgGroupRef]);
};

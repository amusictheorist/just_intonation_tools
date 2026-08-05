import {
  useRef,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import type { SpiralPan } from "../../../lib/spiral/types";

type UseDragPanOptions = {
  extent: number;
  baseExtent: number;
  setPan: Dispatch<SetStateAction<SpiralPan>>;
  margin?: number;
};

type DragPanHandlers = {
  onMouseDown: (event: MouseEvent<SVGSVGElement>) => void;
  onMouseMove: (event: MouseEvent<SVGSVGElement>) => void;
  onMouseUp: () => void;
};

const clamp = (value: number, minimum: number, maximum: number): number =>
  Math.min(maximum, Math.max(minimum, value));

export function useDragPan({
  extent,
  baseExtent,
  setPan,
  margin = 40,
}: UseDragPanOptions): DragPanHandlers {
  const draggingRef = useRef(false);

  const lastPointerRef = useRef<SpiralPan>({
    x: 0,
    y: 0,
  });

  const maximumPan = Math.max(0, baseExtent - extent + margin);

  const onMouseDown = (event: MouseEvent<SVGSVGElement>): void => {
    draggingRef.current = true;

    lastPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onMouseMove = (event: MouseEvent<SVGSVGElement>): void => {
    if (!draggingRef.current) {
      return;
    }

    const deltaX = event.clientX - lastPointerRef.current.x;

    const deltaY = event.clientY - lastPointerRef.current.y;

    const width = event.currentTarget.clientWidth;

    if (width <= 0) {
      return;
    }

    const coordinateScale = (extent * 2) / width;

    setPan((currentPan) => ({
      x: clamp(
        currentPan.x - deltaX * coordinateScale,
        -maximumPan,
        maximumPan,
      ),
      y: clamp(
        currentPan.y - deltaY * coordinateScale,
        -maximumPan,
        maximumPan,
      ),
    }));

    lastPointerRef.current = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const onMouseUp = (): void => {
    draggingRef.current = false;
  };

  return {
    onMouseDown,
    onMouseMove,
    onMouseUp,
  };
}

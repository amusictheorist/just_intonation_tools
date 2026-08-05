import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { SpiralPan } from "../../../lib/spiral/types";

const ZOOM_DURATION = 180;
const PAN_STEP = 30;

export type SpiralCamera = {
  zoom: number;
  targetZoom: number;
  setTargetZoom: Dispatch<SetStateAction<number>>;
  pan: SpiralPan;
  setPan: Dispatch<SetStateAction<SpiralPan>>;
  resetView: () => void;
};

export const useSpiralCamera = (): SpiralCamera => {
  const [targetZoom, setTargetZoom] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<SpiralPan>({ x: 0, y: 0 });
  const zoomRef = useRef(zoom);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    const startZoom = zoomRef.current;
    const difference = targetZoom - startZoom;

    if (Math.abs(difference) < 0.001) {
      setZoom(targetZoom);
      return;
    }

    const startTime = performance.now();

    let animationFrameId: number | null = null;

    const animate = (timestamp: number): void => {
      const elapsed = timestamp - startTime;

      const linearProgress = Math.min(elapsed / ZOOM_DURATION, 1);

      const easedProgress = 1 - (1 - linearProgress) ** 3;

      const nextZoom = startZoom + difference * easedProgress;

      zoomRef.current = nextZoom;
      setZoom(nextZoom);

      if (linearProgress < 1) animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
    };
  }, [targetZoom]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      )
        return;

      const movement: Record<string, SpiralPan> = {
        ArrowUp: {
          x: 0,
          y: -PAN_STEP,
        },
        w: {
          x: 0,
          y: -PAN_STEP,
        },
        W: {
          x: 0,
          y: -PAN_STEP,
        },
        ArrowDown: {
          x: 0,
          y: PAN_STEP,
        },
        s: {
          x: 0,
          y: PAN_STEP,
        },
        S: {
          x: 0,
          y: PAN_STEP,
        },
        ArrowLeft: {
          x: -PAN_STEP,
          y: 0,
        },
        a: {
          x: -PAN_STEP,
          y: 0,
        },
        A: {
          x: -PAN_STEP,
          y: 0,
        },
        ArrowRight: {
          x: PAN_STEP,
          y: 0,
        },
        d: {
          x: PAN_STEP,
          y: 0,
        },
        D: {
          x: PAN_STEP,
          y: 0,
        },
      };

      const delta = movement[event.key];
      if (!delta) return;

      event.preventDefault();

      setPan((currentPan) => ({
        x: currentPan.x + delta.x,
        y: currentPan.y + delta.y,
      }));
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const resetView = useCallback((): void => {
    setTargetZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  return {
    zoom,
    targetZoom,
    setTargetZoom,
    pan,
    setPan,
    resetView,
  };
};

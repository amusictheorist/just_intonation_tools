import { useState, useCallback } from "react";
import { createRatio } from "../utils/math/parseRatio";
import { place } from "../utils/placement/cubic";

export const Modes = {
  CUBIC: 'cubic',
  EXPANDED_CUBIC: 'expanded_cubic',
  RADIAL: 'radial',
  EXPANDED_RADIAL: 'expanded_radial'
};

export const useRatios = (initial = []) => {
  const [ratios, setRatios] = useState(initial);
  const [, setHistory] = useState([]);
  const [mode, setMode] = useState(Modes.CUBIC);

  const pushHistory = useCallback(() => {
    setHistory(prev => [...prev, ratios]);
  }, [ratios]);

  const addRatio = useCallback((input) => {
    const r = createRatio(input);

    if (!r.valid) {
      return { success: false, error: r.error };
    }

    if (mode === Modes.CUBIC) {
      const coords = place(r);

      if (!coords) {
        return {
          success: false,
          error: 'Cubic mode only allows 3-, 5-, and 7-limit ratios. Please switch to Expanded Cubic mode or one of the Radial modes for higher limit ratios.'
        }
      }
    }

    pushHistory();

    setRatios(prev => [...prev, r]);
    return { success: true, ratio: r };
  }, [pushHistory, mode]);

  const removeRatio = useCallback((id) => {
    pushHistory();

    setRatios(prev => prev.filter(r => r.id !== id));
  }, [pushHistory]);

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.length === 0) return prev;

      const last = prev[prev.length - 1];
      setRatios(last);
      return prev.slice(0, -1);
    });
  }, []);

  const reset = useCallback(() => {
    pushHistory();
    setRatios([]);
  }, [pushHistory]);

  return {
    ratios,
    addRatio,
    removeRatio,
    undo,
    reset,
    mode,
    setMode
  };
};
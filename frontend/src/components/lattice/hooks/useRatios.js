import { useState, useCallback } from "react";
import { createRatio } from "../math/parseRatio";

export const Modes = {
  CANONICAL: 'canonical',
  OCTAVE: 'octave',
  RADIAL: 'radial',
  SPHERICAL: 'spherical'
};

export const useRatios = (initial = []) => {
  const [ratios, setRatios] = useState(initial);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState(Modes.OCTAVE);

  const pushHistory = useCallback(() => {
    setHistory(prev => [...prev, ratios]);
  }, [ratios]);

  const addRatio = useCallback((input) => {
    const r = createRatio(input);

    if (!r.valid) {
      return { success: false, error: r.error };
    }

    pushHistory();

    setRatios(prev => [...prev, r]);
    return { success: true, ratio: r };
  }, [pushHistory]);

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
import { useCallback, useState } from "react";

export const useSpiralState = () => {
  const [values, setValues] = useState(new Set([1]));
  const [batches, setBatches] = useState([[1]]);
  const [selected, setSelected] = useState(new Set());
  const [maxTheta, setMaxTheta] = useState(0);

  const addValues = useCallback(newVals => {
    setValues(prev => {
      const next = new Set(prev);
      newVals.forEach(n => next.add(n));
      return next;
    });

    setBatches(prev => [...prev, newVals]);
  }, []);

  const removeValue = useCallback(n => {
    setValues(prev => {
      const next = new Set(prev);
      next.delete(n);
      return next;
    });

    setSelected(prev => {
      const s = new Set(prev);
      s.delete(n);
      return s;
    });

    setBatches(prev =>
      prev
        .map(b => b.filter(x => x !== n))
        .filter(b => b.length > 0)
    );
  }, []);

  const undoLastBatch = useCallback(() => {
    setBatches(prev => {
      if (prev.length <= 1) return prev;
      const last = prev[prev.length - 1];

      setValues(valsPrev => {
        const next = new Set(valsPrev);
        last.forEach(n => next.delete(n));
        return next;
      });

      setSelected(selPrev => {
        const next = new Set(selPrev);
        last.forEach(n => next.delete(n));
        return next;
      });

      return prev.slice(0, -1);
    });
  }, []);

  const resetState = useCallback(() => {
    setValues(new Set([1]));
    setBatches([[1]]);
    setSelected(new Set());
    setMaxTheta(0);
  }, []);

  return {
    values,
    setValues,
    batches,
    setBatches,
    selected,
    setSelected,
    maxTheta,
    setMaxTheta,
    addValues,
    removeValue,
    undoLastBatch,
    resetState
  };
};
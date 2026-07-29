import { useCallback, useState } from "react";

export const useSpiralState = () => {
  const [values, setValues] = useState<Set<number>>(() => new Set([1]));
  const [batches, setBatches] = useState<number[][]>(() => [[1]]);
  const [selected, setSelected] = useState<Set<number>>(() => new Set());
  const [maxTheta, setMaxTheta] = useState(0);

  const addValues = useCallback((newValues: number[]): void => {
    setValues((currentValues) => {
      const nextValues = new Set(currentValues);

      for (const value of newValues) nextValues.add(value);

      return nextValues;
    });

    setBatches((currentBatches) => [...currentBatches, newValues]);
  }, []);

  const removeValue = useCallback((value: number): void => {
    setValues((currentValues) => {
      const nextValues = new Set(currentValues);
      nextValues.delete(value);
      return nextValues;
    });

    setSelected((currentSelection) => {
      const nextSelection = new Set(currentSelection);
      nextSelection.delete(value);
      return nextSelection;
    });

    setBatches((currentBatches) =>
      currentBatches
        .map((batch) => batch.filter((item) => item !== value))
        .filter((batch) => batch.length > 0),
    );
  }, []);

  const undoLastBatch = useCallback((): void => {
    setBatches((currentBatches) => {
      if (currentBatches.length <= 1) return currentBatches;

      const lastBatch = currentBatches[currentBatches.length - 1];

      setValues((currentValues) => {
        const nextValues = new Set(currentValues);

        for (const value of lastBatch) nextValues.delete(value);

        return nextValues;
      });

      setSelected((currentSelection) => {
        const nextSelection = new Set(currentSelection);

        for (const value of lastBatch) nextSelection.delete(value);

        return nextSelection;
      });

      return currentBatches.slice(0, -1);
    });
  }, []);

  const resetState = useCallback((): void => {
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
    resetState,
  };
};

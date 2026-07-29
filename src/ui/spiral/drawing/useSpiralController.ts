import { useCallback } from "react";
import type { SpiralDrawing } from "../drawing/createSpiralDrawing";
import type { useSpiralState } from "../hooks/useSpiralState";

type SpiralState = ReturnType<typeof useSpiralState>;

export type SpiralController = {
  addPointBatch: (values: number[]) => void;
  removeValue: (value: number) => void;
  undoLastBatch: () => void;
  resetToOne: () => void;
};

export const useSpiralController = (
  state: SpiralState,
  drawing: SpiralDrawing,
): SpiralController => {
  const {
    values,
    addValues,
    removeValue: removeValueFromState,
    undoLastBatch: undoLastBatchInState,
    resetState,
    maxTheta,
    setMaxTheta,
    batches,
    setSelected,
  } = state;

  const {
    drawPoint,
    extendSpiral,
    shrinkSpiralTo,
    removeValueVisual,
    clearExceptOne,
  } = drawing;

  const getTheta = useCallback(
    (value: number): number => 360 * Math.log2(value),
    [],
  );

  const addPointBatch = useCallback(
    (inputValues: number[]): void => {
      const uniqueValues = Array.from(new Set(inputValues)).filter(
        (value) => Number.isFinite(value) && value > 0,
      );

      const newValues = uniqueValues.filter((value) => !values.has(value));

      if (newValues.length === 0) {
        return;
      }

      const valuesWithTheta: Array<[number, number]> = newValues.map(
        (value) => [value, getTheta(value)],
      );

      const newMaximumTheta = Math.max(
        ...valuesWithTheta.map(([, theta]) => theta),
      );

      if (newMaximumTheta > maxTheta) {
        extendSpiral(maxTheta, newMaximumTheta);

        setMaxTheta(newMaximumTheta);
      }

      for (const [value, theta] of valuesWithTheta) {
        drawPoint(value, theta, () => {
          setSelected((currentSelection) => {
            const nextSelection = new Set(currentSelection);

            if (nextSelection.has(value)) {
              nextSelection.delete(value);
            } else {
              nextSelection.add(value);
            }

            return nextSelection;
          });
        });
      }

      addValues(newValues);
    },
    [
      addValues,
      drawPoint,
      extendSpiral,
      getTheta,
      maxTheta,
      setMaxTheta,
      setSelected,
      values,
    ],
  );

  const removeValue = useCallback(
    (value: number): void => {
      if (value === 1) {
        return;
      }

      removeValueVisual(value);
      removeValueFromState(value);

      const remainingValues = new Set(values);

      remainingValues.delete(value);

      if (remainingValues.size === 0) {
        return;
      }

      const newMaximumValue = Math.max(...remainingValues);

      const newTheta = newMaximumValue > 1 ? getTheta(newMaximumValue) : 0;

      if (newTheta < maxTheta) {
        shrinkSpiralTo(newTheta);
        setMaxTheta(newTheta);
      }
    },
    [
      getTheta,
      maxTheta,
      removeValueFromState,
      removeValueVisual,
      setMaxTheta,
      shrinkSpiralTo,
      values,
    ],
  );

  const undoLastBatch = useCallback((): void => {
    if (batches.length <= 1) {
      return;
    }

    const lastBatch = batches[batches.length - 1];

    for (const value of lastBatch) {
      removeValueVisual(value);
    }

    const remainingValues = new Set(values);

    for (const value of lastBatch) {
      remainingValues.delete(value);
    }

    undoLastBatchInState();

    if (remainingValues.size === 0) {
      return;
    }

    const newMaximumValue = Math.max(...remainingValues);

    const newTheta = newMaximumValue > 1 ? getTheta(newMaximumValue) : 0;

    if (newTheta < maxTheta) {
      shrinkSpiralTo(newTheta);
      setMaxTheta(newTheta);
    }
  }, [
    batches,
    getTheta,
    maxTheta,
    removeValueVisual,
    setMaxTheta,
    shrinkSpiralTo,
    undoLastBatchInState,
    values,
  ]);

  const resetToOne = useCallback((): void => {
    clearExceptOne();
    resetState();
  }, [clearExceptOne, resetState]);

  return {
    addPointBatch,
    removeValue,
    undoLastBatch,
    resetToOne,
  };
};

export const useSpiralController = (state, drawing, r0) => {
  const {
    values,
    addValues,
    removeValue: stateRemoveValue,
    undoLastBatch: stateUndoBatch,
    resetState,
    maxTheta,
    setMaxTheta,
    batches
  } = state;

  const {
    drawPoint,
    extendSpiral,
    shrinkSpiralTo,
    removeValueVisual,
    clearExceptOne
  } = drawing;

  const getTheta = n => 360 * Math.log2(n);

  const addPointBatch = arr => {
    const unique = [...new Set(arr)].filter(n => n > 0);
    const newVals = unique.filter(n => !values.has(n));
    if (newVals.length === 0) return;

    const thetas = newVals.map(n => [n, getTheta(n)]);
    const newMaxTheta = Math.max(...thetas.map(([, t]) => t));
    if (newMaxTheta > maxTheta) {
      extendSpiral(maxTheta, newMaxTheta);
      setMaxTheta(newMaxTheta);
    }

    thetas.forEach(([n, theta]) => {
      drawPoint(n, theta, () => {
        state.setSelected(prev => {
          const next = new Set(prev);
          next.has(n) ? next.delete(n) : next.add(n);
          return next;
        });
      });
    });

    addValues(newVals);
  };

  const removeValue = n => {
    if (n === 1) return;

    removeValueVisual(n);
    stateRemoveValue(n);

    const current = new Set(values);
    current.delete(n);
    if (current.size === 0) return;

    const oldMax = maxTheta;
    const newMaxVal = Math.max(...current);
    const newTheta = newMaxVal > 1 ? getTheta(newMaxVal) : 0;

    if (newTheta < oldMax) {
      shrinkSpiralTo(newTheta);
      setMaxTheta(newTheta);
    }
  };

  const undoLastBatch = () => {
    if (batches.length <= 1) return;

    const last = batches[batches.length - 1];
    last.forEach(n => removeValueVisual(n));

    const prevValues = new Set(values);
    last.forEach(n => prevValues.delete(n));
    stateUndoBatch();

    if (prevValues.size === 0) return;

    const oldMax = maxTheta;
    const newMaxVal = Math.max(...prevValues);
    const newTheta = newMaxVal > 1 ? getTheta(newMaxVal) : 0;

    if (newTheta < oldMax) {
      shrinkSpiralTo(newTheta);
      setMaxTheta(newTheta);
    }
  };

  const resetToOne = () => {
    clearExceptOne();
    resetState();
  };

  return {
    addPointBatch,
    removeValue,
    undoLastBatch,
    resetToOne
  };
};
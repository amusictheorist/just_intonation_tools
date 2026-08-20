import { useCallback, useRef, useState } from "react";
import {
  addLatticeRatioFromInput,
  type AddLatticeRatioFromInputResult,
} from "../../../lib/lattice/state/addLatticeRatioFromInput";
import type { LatticeRatio } from "../../../lib/lattice/state/latticeRatio";
import { removeLastLatticeRatioById } from "../../../lib/lattice/state/removeLastLatticeRatioById";
import { createInitialLatticeRatio } from "../../../lib/lattice/state/createInitialLatticeRatio";

type UseLatticeRatiosResult = {
  ratios: readonly LatticeRatio[];
  addRatio: (rawInput: string) => AddLatticeRatioFromInputResult;
  removeRatio: (id: string) => void;
  reset: () => void;
  undo: () => void;
};

export function useLatticeRatios(): UseLatticeRatiosResult {
  const [ratios, setRatios] = useState<readonly LatticeRatio[]>(() =>
    createInitialLatticeRatio(crypto.randomUUID()),
  );
  const ratiosRef = useRef<readonly LatticeRatio[]>(ratios);
  const historyRef = useRef<readonly (readonly LatticeRatio[])[]>([]);

  function pushHistory(): void {
    historyRef.current = [...historyRef.current, ratiosRef.current];
  }

  const addRatio = useCallback(
    (rawInput: string): AddLatticeRatioFromInputResult => {
      const id = crypto.randomUUID();

      const result = addLatticeRatioFromInput(ratiosRef.current, id, rawInput);

      if (result.status !== "added") return result;

      pushHistory();

      ratiosRef.current = result.ratios;
      setRatios(result.ratios);

      return result;
    },
    [],
  );

  const removeRatio = useCallback((id: string): void => {
    const ratioToRemove = ratiosRef.current.find((ratio) => ratio.id === id);

    if (!ratioToRemove) return;

    if (
      ratioToRemove.ratio.numerator === 1n &&
      ratioToRemove.ratio.denominator === 1n
    )
      return;

    const nextRatios = removeLastLatticeRatioById(ratiosRef.current, id);

    if (nextRatios.length === ratiosRef.current.length) return;

    pushHistory();

    ratiosRef.current = nextRatios;
    setRatios(nextRatios);
  }, []);

  const reset = useCallback((): void => {
    const initialRatio = createInitialLatticeRatio(crypto.randomUUID());

    pushHistory();

    ratiosRef.current = initialRatio;
    setRatios(initialRatio);
  }, []);

  const undo = useCallback((): void => {
    const previous = historyRef.current.at(-1);

    if (!previous) return;

    historyRef.current = historyRef.current.slice(0, -1);
    ratiosRef.current = previous;
    setRatios(previous);
  }, []);

  return { ratios, addRatio, removeRatio, reset, undo };
}

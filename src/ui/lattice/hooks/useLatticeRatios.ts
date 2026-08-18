import { useCallback, useRef, useState } from "react";
import {
  addLatticeRatioFromInput,
  type AddLatticeRatioFromInputResult,
} from "../../../lib/lattice/state/addLatticeRatioFromInput";
import type { LatticeRatio } from "../../../lib/lattice/state/latticeRatio";
import { removeLastLatticeRatioById } from "../../../lib/lattice/state/removeLastLatticeRatioById";

type UseLatticeRatiosResult = {
  ratios: readonly LatticeRatio[];
  addRatio: (rawInput: string) => AddLatticeRatioFromInputResult;
  removeRatio: (id: string) => void;
  reset: () => void;
  undo: () => void;
};

export function useLatticeRatios(): UseLatticeRatiosResult {
  const [ratios, setRatios] = useState<readonly LatticeRatio[]>([]);
  const ratiosRef = useRef<readonly LatticeRatio[]>([]);
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
    const nextRatios = removeLastLatticeRatioById(ratiosRef.current, id);

    if (nextRatios.length === ratiosRef.current.length) return;

    pushHistory();

    ratiosRef.current = nextRatios;
    setRatios(nextRatios);
  }, []);

  const reset = useCallback((): void => {
    if (ratiosRef.current.length === 0) return;

    pushHistory();

    ratiosRef.current = [];
    setRatios([]);
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

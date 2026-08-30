import type { PartialClassSet } from "../ji/set/partialClassSet";
import type { PartialSet } from "../ji/set/partialSet";

export type CalculatorResult = {
  partial: {
    set: PartialSet;
    setClass: PartialSet;
    lowInverse: PartialSet;
    lowInverseSetClass: PartialSet;
  };
  partialClass: {
    set: PartialClassSet;
    setClass: PartialClassSet;
    lowInverse: PartialClassSet;
    lowInverseSetClass: PartialClassSet;
  };
};

export type TransposedCalculatorResult = {
  partialSet: PartialSet;
  partialClassSet: PartialClassSet;
};

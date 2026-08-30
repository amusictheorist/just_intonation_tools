import fc from "fast-check";
import { partialArbitrary } from "./partialArbitraries";
import { createPartialSet } from "../set/partialSet";

export const partialSetArbitrary = fc
  .array(partialArbitrary, { minLength: 1 })
  .map(createPartialSet);

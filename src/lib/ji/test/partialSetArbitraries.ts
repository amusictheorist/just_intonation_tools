import fc from "fast-check";
import { partialArbitrary } from "./partialArbitraries";
import { createPartialSet } from "../partialSet";

export const partialSetArbitrary = fc
  .array(partialArbitrary, { minLength: 1 })
  .map(createPartialSet);

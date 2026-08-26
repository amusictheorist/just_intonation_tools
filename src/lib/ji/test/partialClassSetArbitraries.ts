import fc from "fast-check";
import { partialClassArbitrary } from "./partialClassArbitraries";
import { createPartialClassSet } from "../set/partialClassSet";

export const partialClassSetArbitrary = fc
  .array(partialClassArbitrary, { minLength: 1 })
  .map(createPartialClassSet);

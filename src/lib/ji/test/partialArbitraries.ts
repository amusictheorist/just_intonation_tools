import fc from "fast-check";
import { createPartial } from "../partial/partial";

export const partialArbitrary = fc.bigInt({ min: 1n }).map(createPartial);

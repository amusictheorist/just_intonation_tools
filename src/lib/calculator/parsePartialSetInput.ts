import { createPartial } from "../ji/partial";
import { createPartialSet, type PartialSet } from "../ji/partialSet";

export function parsePartialSetInput(input: string): PartialSet {
  const members = input
    .trim()
    .split(/[, \s]+/)
    .map((token) => createPartial(BigInt(token)));

  return createPartialSet(members);
}

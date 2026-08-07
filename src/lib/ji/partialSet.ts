import type { Partial } from "./partial";

/**
 * A non-empty immutable set of validate partials.
 *
 * Members are unique and exposed in ascending order.
 */

export type PartialSet = {
  readonly members: readonly Partial[];
};

/**
 * Creates a normalized partial set from validated partials.
 *
 * Duplicate members are removed and the resulting members are exposed in ascending order.
 *
 * @param members A non-empty collection of validate partials.
 * @returns The normalized immutable partial set.
 * @throws {Error} If the collection is empty.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function createPartialSet(members: readonly Partial[]): PartialSet {
  if (members.length === 0) {
    throw new Error("A partial set cannot be empty");
  }

  const normalizedSetMembers = Array.from(new Set(members)).sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  );

  return {
    members: Object.freeze(normalizedSetMembers),
  };
}

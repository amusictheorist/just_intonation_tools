import type { PartialClass } from "./partialClass";

/**
 * A non-empty immutable set of validated partial classes.
 *
 * Members are unique and exposed in ascending order.
 */

export type PartialClassSet = {
  readonly members: readonly PartialClass[];
};

/**
 * Creates a normalized partial-class set from validated partial classes.
 *
 * Duplicate members are removed and the resulting members are exposed in ascending order.
 *
 * @param members A non-empty collection of validated partial classes.
 * @returns The normalized immutable partial-class set.
 * @throws {Error} If the collection is empty.
 *
 * @see `docs/domain/CORE_JI_DOMAIN.md`
 */

export function createPartialClassSet(members: readonly PartialClass[]) {
  if (members.length === 0) {
    throw new Error("A partial-class set cannot be empty");
  }

  const normalizedSetMembers = Array.from(new Set(members)).sort((a, b) =>
    a < b ? -1 : a > b ? 1 : 0,
  );

  return {
    members: Object.freeze(normalizedSetMembers),
  };
}

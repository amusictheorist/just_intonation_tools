# Legacy Partial Migration

**Status:** Accepted

## 1. Purpose

This document records the migration from legacy partial, partial-class, set,
and related helper logic to the shared JI domain under `src/lib/ji/`, and
identifies remaining migration work in the spiral subsystem.

Most shared-domain operations described by the original plan have now been
implemented. Sections that describe those operations as future work are
retained as migration history unless explicitly marked as remaining work.

The remaining migration concern is primarily the removal of duplicated
number-based partial, partial-class, set, and interval mathematics from the
spiral where equivalent shared-domain operations now exist.

## 2. Current legacy responsibilities

Legacy partial and partial-class behaviour currently exists in two places:

- the removed Python calculator backend, retained in Git history
- the current spiral implementation under `src/lib/spiral/`.

The migration should treat the Python code as historical behaviour to review, not as an implementation to port directly. Where it conflicts with the normative domain specification, the specification takes precedence.

### 2.1 Historical Python partial and set values

The removed calculator backend defined:

- `PartialSet`, which validated non-empty collections of positive integers and removed duplicates
- `PartialClassSet`, which validated non-empty collections of positive odd integers and removed duplicates
- `PartialSetClass`, which derived a canonical representative by dividing every member by the set's greatest common divisor
- `PartialClassSetClass`, which derived a canonical representative for partial-class sets and could also implicitly convert partial sets or partial-set classes to partial classes

These classes combined several responsibilities that should remain separate in the shared TypeScript domain:

- single-value validation
- set construction and deduplication
- set-class canonicalization
- partial-to-partial-class conversion
- harmonic-complexity calculations

### 2.2 Historical partial-to-partial-class conversion

The Python `par_to_parc` helper:

- accepted a collection of integer partials
- removed every factor of 2 from each value
- removed duplicate results
- returned a `PartialClassSet`

The shared domain now separates these responsibilities.

`partialToPartialClass` owns only the single-value transformation from a validated `Partial` to its octave-equivalent `PartialClass`.

Mapping a collection of partials, removing duplicate partial classes, and constructing a validated partial-class set belong to future set-domain operations.

### 2.3 Historical harmonic-complexity coupling

The Python set-class types also exposed harmonic-complexity operations directly:

- `HCp`
- `cardHCp`
- `HCpc`
- `cardHCpc`

These calculations should not remain methods on fundamental set or set-class domain values.

Harmonic-complexity measures belong in separate shared-domain modules that consume validated canonical representations.

### 2.4 Historical low-inversion behaviour

The Python `low_inverse` helper combined validation and low-inversion calculation over raw sets.

Its singleton behaviour must not be preserved: the historical implementation returned the singleton unchanged, while the normative domain specification defines the low inverse of a singleton parset as `{1}`.

Future low-inversion work must follow the [core JI domain specification](../domain/CORE_JI_DOMAIN.md).

### 2.5 Current spiral duplication

The spiral currently retains local number-based mathematical helpers and set
operations that overlap with the shared domain.

`src/lib/spiral/helpers.ts` contains:

- `gcd`, a number-based greatest-common-divisor helper;
- `gcdArray`, which derives a greatest common divisor across a collection;
- `stripPowersOf2`, which duplicates partial-to-partial-class reduction.

`src/lib/spiral/sets.ts` contains:

- `getParset`;
- `getParcset`;
- `getParSC`;
- `getParcSC`;
- partial and partial-class interval-matrix construction.

Several of these functions combine domain mathematics with collection
normalization or display-oriented output. They should be migrated only after
the corresponding shared set and interval operations are defined.

## 3. Dependency inventory and target equivalents

The shared JI domain now implements most of the mathematical responsibilities
identified by the original migration plan.

The remaining migration work is primarily concerned with moving spiral
consumers away from duplicated number-based helpers and onto the shared domain.

| Legacy or current item         | Current responsibility                                                    | Shared replacement                                                                              | Status                                              |
| ------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Python `PartialSet`            | Validates positive integer collections and removes duplicates             | shared partial-set construction                                                                 | Replaced                                            |
| Python `PartialClassSet`       | Validates positive odd integer collections and removes duplicates         | shared partial-class-set construction                                                           | Replaced                                            |
| Python `PartialSetClass`       | Computes a GCD-reduced partial-set representative                         | shared partial-set canonicalization                                                             | Replaced                                            |
| Python `PartialClassSetClass`  | Converts inputs and computes a canonical partial-class-set representative | explicit partial-to-partial-class conversion plus shared partial-class-set canonicalization     | Replaced                                            |
| Python `par_to_parc`           | Converts collections of partials to deduplicated partial classes          | `partialToPartialClass` plus shared partial-class-set construction                              | Replaced                                            |
| Python `HCp` / `HCpc`          | Sums canonical set-class representatives                                  | shared Spectral Extension operations                                                            | Replaced                                            |
| Python `cardHCp` / `cardHCpc`  | Computes cardinality-scaled harmonic complexity                           | shared cardinality-scaled Spectral Extension operations                                         | Replaced                                            |
| Python `low_inverse`           | Computes low inverses over raw sets                                       | shared partial-set and partial-class-set low-inversion operations                               | Replaced                                            |
| spiral `gcd`                   | Number-based greatest common divisor                                      | `greatestCommonDivisor`                                                                         | Shared replacement exists; spiral migration remains |
| spiral `gcdArray`              | Greatest common divisor across a collection                               | shared canonicalization operations where the semantics match                                    | Shared replacement exists; spiral migration remains |
| spiral `stripPowersOf2`        | Removes factors of 2 from a partial                                       | `partialToPartialClass`                                                                         | Shared replacement exists; spiral migration remains |
| spiral `getParset`             | Normalizes and sorts partial collections                                  | shared partial-set construction and deterministic exposure                                      | Shared replacement exists; spiral migration remains |
| spiral `getParcset`            | Converts partials, removes duplicates, and sorts partial classes          | explicit conversion plus shared partial-class-set construction                                  | Shared replacement exists; spiral migration remains |
| spiral `getParSC`              | Computes a canonical partial-set representative                           | shared partial-set canonicalization                                                             | Shared replacement exists; spiral migration remains |
| spiral `getParcSC`             | Reduces a set and derives canonical partial classes                       | shared partial-class conversion, set construction, and canonicalization                         | Shared replacement exists; spiral migration remains |
| spiral interval-matrix helpers | Derive and format partial or partial-class interval ratios                | shared directed-interval and interval-matrix operations plus spiral-specific display formatting | Shared replacement exists; spiral migration remains |

The existence of a shared replacement does not by itself mean that a legacy
spiral helper can be removed.

A helper should be removed only after all of its production consumers have
migrated to the shared domain or to an explicit spiral-specific adapter around
shared operations. Display formatting and other genuinely subsystem-specific
behaviour may remain in the spiral.

## 4. Migration rules

Migration from legacy partial and partial-class helpers should preserve the shared-domain boundaries already established under `src/lib/ji/`.

### 4.1 Prefer explicit domain operations

Legacy code sometimes combines validation, conversion, normalization, and set construction in a single helper or constructor.

The migrated design should instead compose explicit operations.

For example:

- partial validation belongs to `createPartial`
- partial-class validation belongs to `createPartialClass`
- partial-to-partial-class conversion belongs to `partialToPartialClass`
- future set construction should own deduplication and deterministic ordering
- future set-class operations should own canonical representative reduction

Constructors should not perform unrelated implicit conversion merely because the input can be transformed into the required domain value.

### 4.2 Preserve exact integer representations

Shared partial and partial-class mathematics must use exact `bigint` values.

Legacy spiral helpers currently operate on `number`. Those values should cross into the shared domain only through explicit adapters that establish the required invariants.

Conversion back to `number` should occur only where a subsystem requires it for rendering, geometry, browser APIs, or other explicitly approximate concerns.

### 4.3 Do not duplicate shared mathematics

Once a shared-domain operation exists, new production code should not introduce another local implementation of the same mathematical rule.

In particular:

- local partial-to-partial-class reduction should use `partialToPartialClass`
- local greatest-common-divisor logic should use the shared exact GCD operation where the input belongs to the shared domain

Legacy helpers may remain temporarily while existing consumers are migrated, but they should not become the basis for new code.

### 4.4 Keep collection behaviour separate from scalar behaviour

A `Partial` and a `PartialClass` are scalar domain values.

Operations such as:

- removing duplicate members
- enforcing non-empty collections
- sorting for deterministic output
- deriving a set-class representative

belong to future set-domain operations rather than to scalar constructors or scalar conversion functions.

This preserves the distinction between:

- converting a partial to one partial class, and
- deriving a partial-class set from a collection of partials.

### 4.5 Keep harmonic-complexity measures separate

Harmonic-complexity calculations should consume validated domain values or canonical representatives.

They should not be methods or construction side effects of partial, set, or set-class values.

Legacy `HCp`, `HCpc`, `cardHCp`, and `cardHCpc` behaviour should therefore be migrated only when the corresponding harmonic-complexity modules are implemented.

### 4.6 Follow the normative specification when legacy behaviour differs

Legacy behaviour is useful for identifying existing consumers and characterization cases, but it is not authoritative.

Where historical code conflicts with the [core JI domain specification](../domain/CORE_JI_DOMAIN.md), the normative domain specification takes precedence.

Known examples include historical singleton low inversion, which must not be preserved when low inversion is reimplemented.

## 5. Migration sequence

Migration should proceed in dependency order so that shared domain behavior is
defined before production consumers are rewritten around it.

### 5.1 Scalar domain values and conversion

This stage is complete.

The shared domain now provides:

- `Partial`;
- `createPartial`;
- `PartialClass`;
- `createPartialClass`;
- `partialToPartialClass`.

These operations establish the scalar validation and octave-equivalence
boundaries required by later set operations.

### 5.2 Partial-set construction

Introduce a shared representation of a non-empty finite set of validated
partials.

This stage should define:

- construction from validated partial values;
- duplicate removal;
- deterministic ascending exposure where required;
- rejection of empty collections;
- the public set representation and immutability guarantees.

This operation should not perform set-class reduction or harmonic-complexity
calculation.

### 5.3 Partial-class-set construction

Introduce the corresponding shared representation of a non-empty finite set of
validated partial classes.

This stage should define:

- construction from validated partial-class values;
- duplicate removal;
- deterministic ascending exposure where required;
- rejection of empty collections.

Deriving a partial-class set from a partial set should be an explicit operation
that composes `partialToPartialClass` with set construction.

### 5.4 Set-class canonicalization

Implement canonical representative derivation separately for:

- partial sets;
- partial-class sets.

Partial-set-class reduction should divide every member by the collection GCD.

Partial-class-set-class reduction should do the same while preserving the
positive odd invariant of every resulting member.

These operations should return canonical shared-domain representations rather
than mutate their inputs.

### 5.5 Shared interval operations

Review current partial and partial-class interval behavior against the shared
ratio domain.

Exact interval-ratio calculation should use shared canonical `Ratio` values.

String formatting and matrix construction should remain outside the shared
mathematical operation unless they are genuinely reusable domain behavior.

### 5.6 Harmonic-complexity measures

Implement harmonic-complexity measures only after the relevant canonical set
representations exist.

The first migration should separate the legacy sum-based and
cardinality-scaled calculations from set construction and set-class
canonicalization.

### 5.7 Low inversion

Implement low inversion over the shared set domain after partial-set
construction is available.

The implementation must follow `CORE_JI_DOMAIN.md`, including the normative
singleton behavior, rather than preserving conflicting historical behavior.

### 5.8 Migrate spiral consumers

After the required shared operations exist, migrate spiral consumers in small,
characterized steps.

Likely migration targets include:

1. `stripPowersOf2`;
2. `gcd`;
3. `gcdArray`;
4. `getParset`;
5. `getParcset`;
6. `getParSC`;
7. `getParcSC`;
8. partial interval-matrix logic;
9. partial-class interval-matrix logic.

Each helper should be removed only after all of its production consumers use
the shared operation or an explicit subsystem adapter.

### 5.9 Remove obsolete helpers

Delete legacy helpers only after:

- all production consumers have migrated;
- equivalent shared behavior is covered by focused tests;
- subsystem-specific formatting or display behavior has been preserved where
  required;
- no new duplicate mathematical implementation remains;
- the full project quality gate passes.

## 6. Removal conditions

Legacy partial and partial-class helpers may be removed only when all of the
following are true:

- scalar partial construction uses `Partial` and `createPartial`;
- scalar partial-class construction uses `PartialClass` and
  `createPartialClass`;
- partial-to-partial-class conversion uses `partialToPartialClass`;
- shared partial-set construction exists and owns non-empty validation,
  deduplication, and deterministic exposure;
- shared partial-class-set construction exists and owns the corresponding
  collection invariants;
- shared set-class canonicalization replaces local GCD-reduction logic;
- exact interval calculations use shared ratio-domain operations where their
  semantics match;
- harmonic-complexity calculations no longer live on set or set-class values;
- low inversion follows the normative shared-domain specification;
- spiral consumers no longer depend on `stripPowersOf2`, local exact-domain GCD
  logic, or duplicate set-class reduction;
- any remaining spiral helpers are demonstrably subsystem-specific rather than
  duplicate shared mathematics;
- focused migration tests and the full project quality gate pass.

Historical Python implementations do not need to be recreated before removal.
They are retained in Git history only as migration evidence and
characterization reference.

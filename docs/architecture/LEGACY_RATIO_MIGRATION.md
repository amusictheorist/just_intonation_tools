# Legacy Ratio Migration

**Status:** Accepted

## 1. Purpose

This document defines the planned migration from the existing lattice and
spiral ratio helpers to the shared Just Intonation domain under `src/lib/ji/`.

The migration is intended to:

- remove duplicated exact-ratio logic;
- separate mathematical domain values from parsing, UI state, identifiers,
  decimal approximation, and placement data;
- move lattice and spiral consumers toward the shared exact `bigint` ratio
  representation;
- preserve tool-specific behavior only where it belongs;
- establish clear removal conditions for legacy helpers and types.

This document does not redefine ratio mathematics. The normative source of
truth remains the
[core JI domain specification](../domain/CORE_JI_DOMAIN.md).

The exact numeric and domain-value representation is established by
[ADR 0005](./decisions/0005-use-bigint-for-exact-ji-domain-values.md).

## 2. Current legacy responsibilities

The existing lattice ratio code combines several responsibilities that must
be separated during migration.

### 2.1 Exact ratio operations

`src/lib/lattice/math/fractions.ts` currently contains:

- a local greatest-common-divisor implementation;
- fraction reduction;
- octave reduction;
- decimal-to-fraction approximation.

The local greatest-common-divisor and fraction-reduction behavior duplicate
functionality now provided by the shared JI domain.

### 2.2 Parsing and approximation

`src/lib/lattice/math/parseRatio.ts` currently:

- accepts unknown runtime input;
- parses `/` and `:` ratio syntax;
- accepts integers and decimal values;
- approximates decimals as fractions;
- optionally permits negative values;
- creates validation errors;
- calculates canonical and octave-reduced forms.

Parsing and decimal approximation are adapter concerns and must remain outside
the shared mathematical domain.

### 2.3 Lattice UI and application state

The legacy lattice ratio factory also:

- preserves raw input;
- generates identifiers;
- records validation state;
- stores user-facing error messages;
- stores floating-point values;
- duplicates canonical and octave-reduced terms;
- exposes octave-reduced numerator and denominator fields directly.

These responsibilities belong to lattice input and application-state models,
not to the shared `Ratio` value.

### 2.4 Factorization and placement

`src/lib/lattice/math/factors.ts` currently:

- factors legacy lattice ratios;
- removes powers of two from prime-factor maps;
- extracts powers of 3, 5, and 7 for placement;
- normalizes ratios below a placement threshold.

These operations are mathematical consumers of ratio values, but several are
specific to lattice placement. Their migration must preserve the distinction
between shared exact-domain behavior and lattice-only geometry preparation.

### 2.5 Spiral duplication

`src/lib/spiral/sets.ts` contains a separate fraction-simplification helper.

This indicates that exact ratio reduction is duplicated outside the lattice as
well. Spiral migration should therefore be reviewed after the shared ratio
adapters and consumer boundaries are established.

## 3. Dependency inventory

### 3.1 Lattice input and state

`src/ui/lattice/hooks/useRatios.ts`:

- calls the legacy lattice `createRatio`;
- stores arrays of the legacy lattice `Ratio` type;
- manages add, remove, undo, reset, and placement-mode state;
- exposes parser failures to the UI.

This hook is the primary boundary between raw user input and stored lattice
ratio state.

### 3.2 Lattice factorization consumers

The legacy `factorRatio` operation is consumed by:

- `src/ui/lattice/hooks/useHighPrimeFlag.ts`;
- `src/ui/lattice/scene/addPoints.ts`;
- `src/lib/lattice/placement/radial.ts`;
- `src/lib/lattice/placement/expandedRadial.ts`;
- `src/lib/lattice/placement/expandedCubic.ts`.

These consumers currently expect the mixed legacy lattice `Ratio` shape.

### 3.3 Placement consumers

The legacy lattice `Ratio` type is passed through:

- `src/lib/lattice/placement/cubic.ts`;
- `src/lib/lattice/placement/radial.ts`;
- `src/lib/lattice/placement/expandedCubic.ts`;
- `src/lib/lattice/placement/expandedRadial.ts`;
- `src/lib/lattice/placement/placementIndex.ts`.

Placement migration depends on first defining whether these modules consume a
shared `Ratio` directly or a lattice-specific adapter containing both exact
domain data and placement-facing derived data.

### 3.4 Scene consumers

The scene layer depends on legacy ratio fields through:

- `src/ui/lattice/scene/types.ts`;
- `src/ui/lattice/scene/addPoints.ts`;
- `src/ui/lattice/scene/updatePoints.ts`;
- `src/ui/lattice/scene/ConnectionSystem.ts`;
- `src/ui/lattice/scene/SceneManager.ts`.

`ConnectionSystem.ts` also calls the legacy `reduceFraction` helper directly
when reconstructing ratios from prime-factor maps.

### 3.5 UI consumers

The legacy `Ratio` type flows through:

- `src/ui/lattice/components/LatticeCanvas.tsx`;
- `src/ui/lattice/hooks/useSceneManager.ts`;
- `src/ui/lattice/LatticePage.tsx`;
- lattice scene and control components.

UI migration must preserve identifiers, removal behavior, history, validation
feedback, and display values without embedding those concerns in the shared
domain object.

### 3.6 Legacy type dependencies

The principal legacy types are defined in `src/lib/lattice/types.ts`:

- `Fraction`;
- `FractionWithValue`;
- `ParsedRatio`;
- legacy lattice `Ratio`;
- `InvalidRatio`;
- `RatioResult`.

The legacy lattice `Ratio` is not a mathematical value object. It combines
identity, input, validation, canonical representation, octave representation,
and floating-point display data.

These types should remain in place only until all consumers have migrated to
separate domain, adapter, and UI-state representations.

## 4. Target boundaries

The migrated design should separate exact mathematical values from lattice
adapter data and user-interface state.

### 4.1 Shared JI domain

`src/lib/ji/` owns:

- validated positive integers;
- exact canonical ratios;
- ratio equality;
- ratio multiplication;
- greatest-common-divisor behavior;
- future exact ratio operations that are not specific to one visualization.

Shared domain values must not contain:

- raw user input;
- generated identifiers;
- validation flags;
- user-facing error messages;
- decimal approximations;
- placement coordinates;
- automatically derived octave representatives.

### 4.2 Parsing adapters

Parsing adapters own:

- trimming and normalizing raw text;
- recognizing supported ratio syntax;
- converting accepted text into exact integer terms;
- decimal approximation, where intentionally supported;
- producing stable parser errors;
- calling shared domain constructors after parsing succeeds.

A parser result may contain either a shared `Ratio` or structured parser-error
data. It must not redefine canonical reduction independently.

### 4.3 Lattice application state

The lattice may define an adapter or state model that combines:

- a generated identifier;
- the original user input;
- a shared canonical `Ratio`;
- an explicitly derived octave representative;
- display-oriented approximate values;
- other lattice-specific derived data.

This model must contain shared domain values rather than duplicate their
numerator and denominator logic.

### 4.4 Lattice placement

Placement modules may consume:

- a shared `Ratio` directly; or
- a lattice-specific adapter that contains a shared `Ratio`.

Placement-only normalization, prime-coordinate extraction, and conversion to
floating-point geometry remain under `src/lib/lattice/`.

Exact domain values should be converted to `number` only at an explicit
geometry boundary.

### 4.5 Spiral consumers

Spiral code should consume shared exact ratio operations wherever its
mathematical behavior matches the shared domain.

Spiral-specific set construction, ordering, and drawing behavior remain
separate. The existing `simplifyFraction` helper should be removed only after
its callers have been reviewed against the shared ratio contract.

### 4.6 Temporary compatibility code

Temporary compatibility adapters are permitted when they:

- clearly identify legacy and shared representations;
- perform explicit conversion in one direction;
- avoid introducing new duplicated mathematical logic;
- are covered by focused tests;
- have a documented removal condition.

Temporary adapters must not become a second permanent ratio API.

## 5. Helper-by-helper migration plan

| Legacy item                      | Current responsibility                                                            | Target responsibility                           | Migration action                                                                                                               | Removal condition                                                    |
| -------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| local `gcd` in `fractions.ts`    | Reduces number-based fractions                                                    | Shared exact integer arithmetic                 | Replace with `greatestCommonDivisor` through shared ratio construction                                                         | No lattice code calls the local helper                               |
| `reduceFraction`                 | Canonicalizes number numerator and denominator terms                              | Shared `createRatio`                            | Replace exact-ratio uses with shared construction; retain conversion adapters only where number output is temporarily required | All consumers use shared ratios or explicit adapters                 |
| `octaveReduce`                   | Canonicalizes and octave-reduces a number-based fraction                          | Explicit octave-reduction operation             | Reimplement over shared `Ratio`; keep approximation separate                                                                   | All octave representatives derive from the new operation             |
| `rationalApproximation`          | Approximates decimal numbers as fractions                                         | Parsing-adapter concern                         | Retain outside `src/lib/ji/`; review limits and error behavior separately                                                      | Parser no longer imports legacy fraction types                       |
| `parseRatio`                     | Parses text and computes canonical and octave forms                               | Lattice input adapter                           | Rewrite to return shared domain values or parser errors                                                                        | `useRatios` no longer consumes `ParsedRatio`                         |
| legacy lattice `createRatio`     | Parses text, validates, assigns IDs, and builds UI state                          | Lattice state factory                           | Rename to distinguish it from shared `createRatio`, then compose parser, domain construction, and state creation               | No name collision or imported legacy factory remains                 |
| `factorInteger`                  | Factors number values                                                             | Exact factorization helper or lattice adapter   | Reimplement for `bigint` before migrating ratio factorization                                                                  | All exact factorization avoids unsafe `number` conversion            |
| `factorRatio`                    | Factors the canonical fields of a legacy lattice ratio                            | Consumer of shared `Ratio`                      | Change input to shared `Ratio`; return a bigint-compatible factor map                                                          | Placement and high-prime consumers use the migrated function         |
| `factor357`                      | Extracts powers of 3, 5, and 7 for placement                                      | Lattice-specific placement helper               | Keep in lattice; migrate to exact validated inputs                                                                             | No unsafe integer assumptions remain                                 |
| `normalizeBelowOne`              | Multiplies a number numerator by powers of two for display or placement           | Lattice-specific ratio normalization            | Replace number-pair input with an explicit ratio-oriented operation                                                            | Scene code no longer passes loose numerator and denominator values   |
| `Fraction`                       | Carries number numerator and denominator fields                                   | Temporary adapter data only                     | Remove from mathematical APIs                                                                                                  | No production consumer imports it                                    |
| `FractionWithValue`              | Adds a floating-point value to `Fraction`                                         | Display adapter                                 | Replace with shared `Ratio` plus explicit approximation                                                                        | No production consumer imports it                                    |
| `ParsedRatio`                    | Combines parsing result with canonical and octave fractions                       | Structured parser result                        | Redefine around shared `Ratio` and parser errors                                                                               | Legacy parser is removed                                             |
| legacy lattice `Ratio`           | Combines ID, raw input, validation, exact terms, octave terms, and decimal values | Lattice-specific state containing shared values | Replace with a dedicated lattice state model                                                                                   | Placement, scene, hooks, and UI no longer depend on the legacy shape |
| `RatioResult` and `InvalidRatio` | Represent success or parser failure                                               | Parser or hook result types                     | Redefine without pretending invalid input is a domain ratio                                                                    | Legacy factory is removed                                            |
| spiral `simplifyFraction`        | Reduces integer pairs locally                                                     | Shared canonical ratio construction             | Review callers and replace where semantics match                                                                               | No duplicate exact reduction remains in spiral code                  |

## 6. Migration sequence

The migration should proceed in small, independently testable stages.

### 6.1 Define the new lattice state model

Introduce a lattice-specific state type that contains a shared canonical
`Ratio` rather than duplicating canonical numerator and denominator fields.

The initial model should preserve only the lattice concerns still required by
current consumers, such as:

- generated identity;
- original raw input;
- canonical shared ratio;
- explicit octave representative;
- approximate display value.

The final shape should be chosen after reviewing current rendering and control
consumers in detail.

### 6.2 Replace the parsing boundary

Rewrite lattice ratio parsing so that successful parsing produces validated
shared domain values.

This stage should:

- preserve currently accepted syntax only where it is still intentional;
- keep decimal approximation outside the shared domain;
- return structured parser failures;
- stop performing independent canonical reduction;
- avoid generating IDs inside the parser itself.

### 6.3 Add explicit octave reduction

Implement octave reduction as a separate operation over a shared `Ratio`.

This stage should define and test:

- the exact target interval;
- behavior for ratios below `1/1`;
- behavior for unison;
- exact canonical output;
- whether the operation belongs in `src/lib/ji/` or remains a lattice adapter.

The operation must not occur automatically during shared ratio construction.

### 6.4 Migrate factorization

Introduce exact factorization over `bigint` values, then update `factorRatio`
to consume a shared `Ratio`.

Placement-specific filtering, including removal of powers of two, should remain
explicit rather than being hidden inside general factorization.

### 6.5 Migrate lattice placement

Update placement modules in dependency order:

1. `factorRatio`;
2. `cubic.ts`;
3. `radial.ts`;
4. `expandedCubic.ts`;
5. `expandedRadial.ts`;
6. `placementIndex.ts`.

Each migration should preserve existing placement behavior with focused
characterization tests before changing representations.

### 6.6 Migrate scene consumers

Update scene types and operations after placement accepts the new ratio model.

This includes:

- point creation;
- point updates;
- connection generation;
- stored point metadata;
- high-prime detection;
- removal and history behavior.

Number conversion must occur only where rendering or geometry APIs require it.

### 6.7 Remove legacy lattice helpers

Delete legacy helpers and types only after all production consumers have
migrated and the full test suite confirms preserved behavior.

### 6.8 Review spiral fraction reduction

Review each use of `simplifyFraction` in `src/lib/spiral/sets.ts`.

Replace it with shared ratio construction only where the operation represents
the same positive rational-domain behavior. Spiral-specific tuple or display
representations may still require a thin adapter.

## 7. Temporary compatibility rules

During migration:

- new code must use shared `PositiveInteger` and `Ratio` values for exact
  mathematical behavior;
- legacy number-based types may be accepted only at explicit adapter
  boundaries;
- conversions between `bigint` and `number` must be named and localized;
- compatibility adapters must not perform independent ratio reduction;
- shared and legacy `createRatio` functions must use distinct names at every
  call site;
- no new production consumer may import `Fraction`,
  `FractionWithValue`, or the legacy lattice `Ratio`;
- characterization tests should protect current lattice placement and scene
  behavior before representations change;
- temporary adapters should include a removal note tied to the relevant
  migration stage.

## 8. Removal conditions

The legacy ratio system may be removed when all of the following are true:

- raw lattice input is handled by a dedicated parsing adapter;
- successful parsing produces a shared canonical `Ratio`;
- lattice state stores shared ratio values rather than duplicate exact terms;
- octave reduction is an explicit tested operation;
- factorization accepts shared ratio values and exact integer inputs;
- all lattice placement modules consume the migrated representation;
- scene metadata no longer relies on the legacy ratio shape;
- `ConnectionSystem.ts` no longer calls `reduceFraction`;
- `useRatios.ts` no longer imports the legacy lattice ratio factory or types;
- no production source imports `Fraction`, `FractionWithValue`,
  `ParsedRatio`, `RatioResult`, or the legacy lattice `Ratio`;
- the duplicated local GCD and fraction-reduction helpers are deleted;
- spiral fraction simplification has been reviewed and migrated where
  appropriate;
- focused tests and the full quality gate pass.

## 9. Deferred questions

The following questions should be resolved during the relevant migration
stage rather than guessed in advance.

### 9.1 Lattice state shape

Should the lattice store both the canonical ratio and octave representative,
or derive the octave representative when needed?

### 9.2 Decimal input

Should decimal approximation remain supported by the lattice input, and if so:

- what denominator limit should apply;
- how should approximation be communicated to the user;
- should approximate and exact text input produce visibly different states?

### 9.3 Parser errors

Should parser failures use simple discriminated unions, custom error objects,
or shared application error codes?

### 9.4 Octave-reduction ownership

Is octave reduction a generally useful shared JI operation, or should it
remain a lattice-specific adapter until another subsystem requires it?

### 9.5 Exact factorization output

Should prime-factor maps use `bigint` prime keys, and what exponent type should
they use?

### 9.6 Derived decimal values

Should floating-point ratio values be stored in lattice state or derived only
at rendering and display boundaries?

### 9.7 Connection reconstruction

Should `ConnectionSystem.ts` reconstruct a shared ratio from factor maps, or
should connection data remain factor-based until the final rendering boundary?

### 9.8 Spiral representation

Does the spiral require full shared `Ratio` objects, or only exact canonical
integer pairs adapted from them?

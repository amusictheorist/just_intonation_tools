# ADR 0006: Separate symbolic lattice placement from rendered geometry

## Status

Accepted

## Context

The lattice subsystem places exact Just Intonation ratios into several three-dimensional visualizations.

The [lattice placement specification](../../subsystems/lattice/PLACEMENT.md) defines placement behaviour including:

- octave-normalized ratio placement
- signed odd-prime factorization
- canonical shortest generator paths
- generator distance
- 3–5–7 cubic coordinates
- radial prime-generator relationships
- higher-prime anchor lattices
- nested higher-prime placement
- lower-octave placement where supported

The legacy lattice implementation combines several of these responsibilities directly inside geometry-producing functions.

Placement functions currently consume lattice-specific ratio objects, perform prime factorization and classification, determine lattice relationships, and immediately return floating-point `x`, `y`, and `z` coordinates.

This makes several conceptually different concerns difficult to test independently:

- exact ratio classification
- signed prime-exponent structure
- canonical shortest generator paths
- generator distance
- higher-prime precedence
- nested prime-anchor identity
- local 3–5–7 coordinates
- floating-point spacing and orientation
- rendered scene placement

The expanded cubic model especially requires a stable representation of hierarchical placement.

For example, a ratio containing higher-prime factors $11$ and $13$ belongs first to the 11-prime lattice and then to a nested 13-prime lattice because its canonical shortest generator path processes prime generators in ascending prime order. Its factors of $3$, $5$, and $7$ determine its position within the resulting local lattice.

Representing this relationship only as final XYZ coordinates loses the structure that produced those coordinates.

The project testing strategy also requires mathematical and placement logic to be testable independently from visualization and scene behaviour.

## Decision

Lattice placement will be separated into two stages:

1. symbolic placement
2. geometric placement

Symbolic placement will consume exact shared JI-domain `Ratio` values and produce lattice-specific representations of placement identity.

Geometric placement will consume those symbolic representations and convert them into floating-point coordinates suitable for visualization.

Symbolic placement may derive, as required by the lattice placement specification:

- octave representatives
- signed odd-prime factorization
- canonical shortest generator paths
- generator distance
- mode-specific lattice coordinates
- higher-prime anchor paths

These values do not need to be stored in one combined object. The exact TypeScript representation is an implementation decision.

Symbolic placement must not depend on Three.js objects, camera state, rendering state, floating-point scene coordinates, or other UI concerns.

For cubic placement, symbolic placement will represent the signed exponents of the selected prime generators.

With the default 3–5–7 mapping, the relevant coordinate is conceptually:

```ts
type CubicCoordinates = Readonly<{
  prime3: number;
  prime5: number;
  prime7: number;
}>;
```

The exact implementation type may differ.

For expanded cubic placement, symbolic placement will additionally represent a canonical higher-prime anchor path.

A signed generator step is conceptually:

```ts
type GeneratorStep = Readonly<{
  prime: bigint;
  direction: 1 | -1;
}>;
```

An expanded-cubic address may therefore be represented conceptually as:

```ts
type ExpandedCubicAddress = Readonly<{
  anchorPath: readonly GeneratorStep[];
  coordinates357: readonly [number, number, number];
}>;
```

For example, a ratio with higher-prime structure:

```text
11 × 13
```

and 3–5–7 exponents:

```text
[2, -1, 0]
```

will be represented conceptually as:

```ts
{
  anchorPath: [
    { prime: 11n, direction: 1 },
    { prime: 13n, direction: 1 },
  ],
  coordinates357: [2, -1, 0],
}
```

A ratio with higher-prime structure:

```text
11⁻¹ × 13
```

may be represented conceptually as:

```ts
{
  anchorPath: [
    { prime: 11n, direction: -1 },
    { prime: 13n, direction: 1 },
  ],
  coordinates357: [0, 0, 0],
}
```

Higher-prime anchor paths will use the canonical shortest-generator ordering defined by the lattice placement specification.

The symbolic representation records which lattice contains the ratio and where the ratio belongs within that lattice.

It does not define the final rendered XYZ coordinate.

Radial symbolic placement will likewise preserve the exact signed generator structure and generator distance required by the lattice placement specification.

Prime directions, vertical displacement, flattening, and lower-octave symmetry belong to geometric placement rather than symbolic ratio identity.

Geometric placement is responsible for converting symbolic placement into scene coordinates using concerns such as:

- prime-anchor sphere positions
- local coordinate frames
- lattice spacing
- radial radius
- vertical step distance
- rotations
- geometry scale

These geometric parameters may change the rendered position without changing the ratio's symbolic lattice identity.

Shared ratio construction, reduction, equality, and other cross-subsystem exact ratio operations remain the responsibility of the shared JI domain.

Exact operations whose semantics are specific to lattice placement remain under `src/lib/lattice/`.

Lattice-specific symbolic placement remains under `src/lib/lattice/`.

Floating-point conversion must occur only at the explicit geometry boundary or later.

## Consequences

### Positive

- exact placement behaviour can be tested without rendering a scene
- ratio classification and placement identity remain independent of floating-point geometry
- canonical generator paths and generator distance have explicit testable representations
- expanded cubic higher-prime relationships have an explicit representation
- nested prime-anchor placement can be tested before its geometric transformation is implemented
- radial symbolic behaviour can be tested independently from prime-direction and height calculations
- placement tests can distinguish mathematical failures from geometry failures
- scene and Three.js code do not need to reconstruct ratio semantics
- geometric algorithms can be changed without redefining symbolic lattice identity
- visualization spacing, scale, and rotation can vary without changing exact placement expectations
- the architecture supports the project's TDD workflow for placement logic
- legacy placement code can be replaced incrementally rather than migrated as one coupled unit

### Negative

- placement requires an additional intermediate representation
- some placement operations will require separate symbolic and geometric modules
- tests must distinguish symbolic expectations from geometric expectations
- simple placement cases may involve more explicit plumbing than direct `Ratio`-to-XYZ functions
- symbolic placement types must be designed and maintained as part of the lattice subsystem
- some legacy helpers cannot be reused directly because they combine classification and geometry

### Required boundaries

- symbolic placement consumes validated shared JI `Ratio` values
- exact prime factorization must occur before floating-point geometry
- powers of two and octave normalization must be handled according to the lattice placement specification
- symbolic placement must not depend on Three.js or UI state
- geometric placement must not redefine ratio classification, canonical generator paths, generator distance, or higher-prime ordering
- final XYZ coordinates must not be treated as the authoritative identity of a lattice point
- symbolic generator paths, mode-specific coordinates, and expanded-cubic anchor paths must remain independent of geometry
- higher-prime anchor ordering must be deterministic
- conversion from exact integer values to JavaScript `number` must be explicit
- scene code must consume placement results rather than independently reproduce placement mathematics

## Alternatives considered

### Convert directly from `Ratio` to XYZ coordinates

Rejected because final floating-point coordinates do not preserve the exact structural relationships that produced them.

This approach would continue coupling ratio classification, generator-path semantics, higher-prime rules, lattice identity, and geometry in the same operation and would make exact placement behaviour harder to test independently.

### Preserve the existing placement functions and add tests around them

Rejected as the target architecture.

Characterization tests may still be useful for legacy behaviour that has been confirmed as intentional, but the current placement functions combine responsibilities that the rebuild is intended to separate.

Preserving their API as the architectural boundary would retain that coupling.

### Store rendered XYZ coordinates as the lattice point's placement identity

Rejected because geometry depends on presentation choices such as spacing, sphere radius, rotation, and vertical scaling.

Those choices may change without changing the mathematical or structural identity of the ratio within the lattice.

### Encode higher-prime relationships only as a flat prime-factor map

Rejected because a flat factor map does not by itself represent the canonical nested anchor relationship required by expanded cubic placement.

Although signed prime exponents are sufficient to reconstruct a generator path mathematically, the placement layer requires an explicit canonical path representation so that ordering and nesting are deterministic and independently testable.

The expanded cubic model distinguishes between the higher-prime path that determines which nested lattice is reached and the 3–5–7 coordinates that determine placement within that lattice.

### Move lattice placement into the shared JI domain

Rejected because lattice placement is visualization-specific behaviour.

The shared JI domain defines exact mathematical ratios and operations that apply across tools.

Cubic coordinates, radial generator paths as visualization inputs, generator-distance interpretation, prime-anchor hierarchy, and rendered geometry are responsibilities of the lattice subsystem.

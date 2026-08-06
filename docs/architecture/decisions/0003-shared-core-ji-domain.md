# ADR 0003: Treat the shared core JI domain as the mathematical source of truth

## Status

Accepted

## Context

The calculator, harmonic spiral, and ratio lattice rely on overlapping Just Intonation concepts and operations.

Historically, related behaviour existed in multiple places, including Python domain classes and tool-specific JavaScript or TypeScript helpers. That duplication made it possible for ratios, partials, parcs, set equivalence, inversion, and harmonic-complexity calculations to diverge.

The refactor now has a completed mathematical specification:

```text
docs/domain/CORE_JI_DOMAIN.md
```

## Decision

The [core JI domain specification](../../domain/CORE_JI_DOMAIN.md) is the normative mathematical source of truth for the shared Just Intonation domain.

The shared TypeScript domain will conform to that specification.

The domain includes validated positive rational ratios, partials, parcs, parsets, parcsets, canonical forms, equivalence relations, supported operations, low inversion, and Spectral Extension.

Tool-specific parsing, presentation, numeric display, placement, rendering, persistence, and performance limits remain outside the shared domain.

Legacy Python, JavaScript, and TypeScript implementations may be consulted for examples and migration evidence, but they are not normative.

When legacy behaviour conflicts with the specification, tests and implementation should follow the specification unless it is deliberately revised.

## Consequences

### Positive

- all tools share one mathematical vocabulary and behavioural contract
- tests can be written as specification-conformance tests
- invalid states can be rejected at a clear domain boundary
- tool-specific conveniences no longer alter mathematical definitions
- future harmonic-complexity measures can build on stable shared values
- mathematical documentation becomes reviewable independently of implementation

### Negative

- existing code cannot be assumed correct merely because it works today
- legacy tests may need replacement rather than direct migration
- some tool-specific helpers must be moved, rewritten, or removed
- unresolved implementation choices remain, including exact numeric and domain-object representation

### Required boundaries

- the core ratio domain accepts only strictly positive rational ratios
- zero, negatives, decimals, malformed strings, and parsing conveniences remain outside the core domain
- domain values should be immutable or otherwise protected from invalid mutation
- visualization code may consume validated domain values but must not define their mathematical meaning
- exact results should remain exact where practical

## Alternatives considered

### Preserve each tool's existing mathematical helpers

Rejected because it would retain duplicated behaviour and incompatible assumptions.

### Treat legacy Python behaviour as authoritative

Rejected because the completed specification intentionally supersedes conflicting legacy behaviour.

### Define behaviour only through tests

Rejected because the mathematical domain requires an explicit human-readable specification in addition to executable expectations.

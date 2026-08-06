# ADR 0005: Use `bigint` for exact JI-domain values

## Status

Accepted

## Context

The shared Just Intonation domain is defined using positive integers and exact positive rational ratios.

The [core JI domain specification](../../domain/CORE_JI_DOMAIN.md) requires that:

- ratio numerators and denominators are positive integers
- ratios remain exact
- ratios are stored in reduced canonical form
- invalid numeric states cannot enter the domain
- programming-language limitations must not silently weaken the mathematical rules

JavaScript `number` values cannot represent every integer exactly. Integers outside the safe-integer range may be rounded without an explicit failure, which could corrupt ratio reduction, equality, factorization, set-class representatives, transposition, low inversion, and harmonic-complexity calculations.

The existing lattice code uses `number` values for parsing, rational approximation, reduction, octave-reduction, factorization, and geometry. That code also carries tool-specific concerns such as raw input, generated identifiers, validation results, decimal values, and automatically derived octave representatives.

Those concerns do not define the shared mathematical domain.

## Decision

Shared JI-domain integers will use JavaScript `bigint`.

A validated positive integer will be represented as a branded `bigint` and created only through a runtime-validated construction boundary.

Conceptually:

```ts
declare const positiveIntegerBrand: unique symbol;

export type PositiveInteger = bigint & {
  readonly [positiveIntegerBrand]: true;
};
```

The construction boundary will accept only `bigint` values greater than `0n`.

Shared rational ratios will be immutable value objects containing:

- a validated positive-integer numerator
- a validated positive-integer denominator

Conceptually:

```ts
export type Ratio = Readonly<{
  numerator: PositiveInteger;
  denominator: PositiveInteger;
}>;
```

Ratio construction will reduce both terms by their greatest common divisor before returning the value. Every constructed ratio will therefore be in reduced canonical form.

Ratio values will not contain:

- raw user input
- generated identifiers
- validation-result flags
- UI-facing error messages
- floating-point decimal approximations
- automatically calculated octave representatives

Parsing, decimal approximation, formatting, serialization, and tool-specific validation will remain outside the core domain. Successful adapters must produce validated domain values before calling shared mathematical operations.

Octave reduction will be an explicit operation and will not occur automatically during ratio construction.

## Consequences

### Positive

- exact integer and rational values are preserved
- the domain is not limited by JavaScript's safe-integer range
- canonical reduction and equality can use exact arithmetic
- later domain operations can share one numeric representation
- invalid numeric states are rejected at a clear boundary
- floating-point conversion becomes explicit rather than accidental
- lattice and spiral code can distinguish exact domain mathematics from geometric calculations

### Negative

- `bigint` cannot be mixed directly with `number`
- geometry and rendering adapters must explicitly convert suitable values to `number`
- JSON does not serialize `bigint` directly
- parsers and persistence adapters will require explicit conversion strategies
- test arbitraries and fixtures must generate `bigint` values
- some existing lattice helpers cannot directly consume the new domain values without migration

### Required boundaries

- core positive-integer construction accepts only `bigint`
- zero and negative values are rejected
- JavaScript `number` and string values must be converted by an external parser or adapter
- decimal approximation remains outside the core domain
- conversion to `number` must occur only where floating-point APIs require it
- serialization must use an explicit adapter rather than relying on default JSON behaviour
- domain ratios must remain canonical and immutable
- legacy lattice ratio types must not become the shared domain representation

## Alternatives considered

### Use JavaScript `number` with safe-integer validation

Rejected because it would impose an implementation-specific maximum on a mathematical domain that does not otherwise require one. It would also require every operation to manage overflow within the safe-integer range.

### Use unbranded `bigint` values throughout the domain

Rejected because plain `bigint` values do not communicate or enforce the positive-integer invariant at TypeScript boundaries.

### Use a ratio library

Deferred. The required initial behaviour is small and well specified. Introducing an external abstraction would add an additional dependency and API without yet demonstrating a need that the shared domain cannot meet directly.

### Preserve the existing lattice ratio representation

Rejected because it combines parsing, UI state, decimal approximation, octave reduction, identifiers, and geometry-facing values with the mathematical ratio itself.

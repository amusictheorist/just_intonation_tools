# ADR 0004: Adopt the project testing stack

## Status

Accepted

## Context

Testing is a central goal of the refactor.

The project requires strong coverage of exact mathematical behaviour, generated invariants, visualization placement, SVG and DOM adapters, React interaction, Three.js scene responsibilities, and essential browser workflows.

The testing stack must integrate cleanly with TypeScript, React, and Vite while keeping pure mathematical tests fast and independent of browser setup.

The project-wide policy is defined in:

```text
docs/testing/TESTING_STRATEGY.md
```

## Decision

The project will use:

- Vitest for unit, specification, property, placement, DOM, component, and hook tests
- Node as the default Vitest environment
- jsdom for tests requiring DOM, SVG, React, or browser APIs
- `@testing-library/dom` for direct DOM and SVG adapters
- `@testing-library/react` for React components and hooks
- `@testing-library/user-event` for realistic interaction
- `@testing-library/jest-dom` for DOM and accessibility assertions
- fast-check for property-based testing
- Playwright Test for end-to-end workflows and selected screenshot comparisons
- Vitest's V8 provider for coverage

Vitest functions will be imported explicitly rather than enabled as globals.

Tests will normally be colocated as `*.test.ts` or `*.test.tsx`.

Shared test support will live under a root-level `test/` directory.

Playwright tests will live under a root-level `e2e/` directory.

Numeric coverage thresholds will not be enforced initially.

## Consequences

### Positive

- pure mathematical tests can run quickly in Node
- DOM-dependent tests can opt into jsdom only when needed
- React tests can focus on observable behaviour
- fast-check supports broad invariant testing and failure shrinking
- Playwright covers real-browser workflows and selected visual baselines
- Vite and TypeScript integration remain straightforward
- test responsibilities align with the documented architecture

### Negative

- the project must maintain both Vitest and Playwright configuration
- browser tests require installed browser binaries
- jsdom cannot prove complete browser rendering fidelity
- visual-regression baselines require a stable execution environment
- property tests require carefully constrained generators

### Quality-gate direction

The intended local quality gate will include linting, the Vitest suite, TypeScript compilation, and the production build.

Playwright tests will initially run separately because they have a slower feedback cycle and require browser installation.

## Alternatives considered

### Jest

Rejected because Vitest integrates more directly with the existing Vite pipeline and TypeScript configuration.

### Browser-only testing

Rejected because mathematical and placement tests should remain fast and independent of rendering.

### Vitest Browser Mode for all browser testing

Not selected as the initial approach. Vitest remains responsible for unit, DOM, and component tests, while Playwright Test provides a clearer dedicated boundary for complete browser workflows.

### Snapshot-heavy testing

Rejected because large snapshots of SVG paths, React trees, or Three.js scenes obscure intent and do not prove mathematical correctness.

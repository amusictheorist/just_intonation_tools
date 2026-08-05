# ADR 0002: Preserve the three-directory source structure

## Status

Accepted

## Context

The calculator, harmonic spiral, and ratio lattice share mathematical concepts but also have distinct presentation and visualization responsibilities.

The refactor needs a simple top-level source structure that prevents domain and mathematical logic from becoming coupled to React, SVG, Three.js, or tool-specific state.

At the same time, the project should avoid an unnecessarily deep or framework-driven folder hierarchy.

## Decision

The source tree will preserve three top-level directories under `src/`:

```text
src/
├── data/
├── lib/
└── ui/
```

Their responsibilities are:

- `src/data/`: static configuration, presets, labels, and mode definitions
- `src/lib/`: deterministic domain, mathematical, parsing, geometry, placement, and transformation logic
- `src/ui/`: React components, hooks, browser interaction, SVG drawing, and Three.js scene management

The shared JI domain belongs under `src/lib/`.

Visualization mathematics and placement calculations should remain in `src/lib/` when they can be expressed without browser or rendering APIs.

Rendering adapters and scene systems belong under `src/ui/`.

## Consequences

### Positive

- the top-level architecture remains small and memorable
- deterministic logic can be tested independently of rendering
- React and Three.js dependencies remain outside the shared mathematical domain
- calculator, lattice, and spiral code can share domain operations
- subsystem-specific code can still be grouped beneath each responsibility

### Negative

- the distinction between `lib/` and `ui/` must be enforced during refactoring
- some existing visualization modules may need to be split into calculation and rendering portions
- directory placement alone cannot prevent inappropriate imports

### Dependency guidance

- `ui/` may depend on `lib/` and `data/`
- `lib/` may depend on other appropriate `lib/` modules
- `data/` should remain static and should not depend on UI code
- `lib/` must not depend on React components, hooks, DOM elements, SVG elements, canvas state, or Three.js scenes
- production code must not depend on test-support modules

## Alternatives considered

### Organize primarily by tool

A fully tool-first structure would keep calculator, spiral, and lattice code together, but it would make shared mathematical ownership less clear and increase the risk of duplicated domain logic.

### Use a large number of top-level technical directories

Rejected because the project does not need separate top-level directories for components, hooks, services, utils, scenes, math, and types. Those distinctions can exist beneath `data/`, `lib/`, and `ui/`.

### Adopt a framework-specific feature architecture

Rejected because the project's central challenge is separation of mathematical behaviour from visualization and UI, not alignment with a framework convention.

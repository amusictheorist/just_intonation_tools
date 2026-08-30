# Just Intonation Tools

Just Intonation Tools is a collection of browser-based tools for exploring mathematical and visual relationships in just intonation.

The project currently includes:

- a set calculator for partial sets, partial-class sets, equivalence classes, transposition, inversion, and harmonic-complexity calculations
- a harmonic spiral for visualizing and selecting partials
- a ratio lattice for exploring harmonic# Just Intonation Tools

Just Intonation Tools is a collection of browser-based tools for exploring mathematical and visual relationships in just intonation.

The project includes:

- a set calculator for partial sets, partial-class sets, equivalence classes, transposition, inversion, interval relationships, and harmonic-complexity calculations;
- a harmonic spiral for visualizing and selecting partials;
- a three-dimensional ratio lattice with cubic and radial layouts, higher-prime placement, configurable connections, and interactive navigation.

The mathematical foundations of the project grow out of Alexis Millares Thomson's research in just-intonation set theory, including Parspace, Parcspace, and Spectral Extension.

## Project status

The application is being rebuilt as a TypeScript-and-Vite codebase.

Python and Django have been removed. Shared mathematical behaviour is implemented as a validated TypeScript domain, with documentation quality and test-driven development treated as project requirements.

The set calculator has been rebuilt on the shared JI domain. The ratio lattice has been rebuilt around deterministic symbolic placement and geometry, with a separate Three.js presentation and interaction layer.

The current mathematical source of truth is the [core JI domain specification](docs/domain/CORE_JI_DOMAIN.md).

## Technology

The project uses:

- TypeScript
- React
- Vite
- Tailwind CSS
- Three.js
- Vitest
- fast-check
- Playwright

Testing responsibilities and conventions are documented in the [testing strategy](docs/testing/TESTING_STRATEGY.md).

## Source structure

The source tree follows three top-level responsibilities:

```text
src/
├── data/
├── lib/
└── ui/
```

- `src/data/` contains static configuration, presets, and mode definitions.
- `src/lib/` contains deterministic mathematical, domain, parsing, symbolic-placement, geometry, and presentation logic.
- `src/ui/` contains React components, hooks, Three.js scene management, and browser interaction.

Shared JI behaviour belongs in `src/lib/` and must remain independent of React, SVG, canvas, Three.js scenes, persistence, and tool-specific input formatting.

## Getting started

### Prerequisites

Use a current Node.js release compatible with the versions declared in `package.json`.

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build the application

```bash
npm run build
```

### Lint the project

```bash
npm run lint
```

### Run tests

Run the Vitest suite in watch mode:

```bash
npm test
```

Run the Vitest suite once:

```bash
npm run test:run
```

Run the Vitest suite with coverage:

```bash
npm run test:coverage
```

Run the Playwright end-to-end tests:

```bash
npm run test:e2e
```

Run the full projet check:

```bash
npm run check
```

The full check runs linting, the test suite, coverage, and the production build.

## Testing

The project uses multiple levels of testing according to responsibility:

- unit tests cover deterministic domain, parsing, placement, geometry, presentation, and UI behaviour
- property-based tests use fast-check to verify mathematical invariants across larger input spaces
- component and hook tests verify React and scene-runtime integration
- Playwright end-to-end tests verify representative calculator and lattice workflows in the running application

End-to-end tests are intentionally selective. Exhaustive mathematical and visualization-placement behaviour belongs in lower-level tests rather than being duplicated through browser interactions.

See the [testing strategy](docs/testing/TESTING_STRATEGY.md) for the complete testing policy.

## Documentation

The [documentation index](docs/README.md) links to the project's mathematical specifications, engineering policies, architecture records, and subsystem documentation.

Important documents include:

- [Core JI domain](docs/domain/CORE_JI_DOMAIN.md)
- [Testing strategy](docs/testing/TESTING_STRATEGY.md)
- [Documentation conventions](docs/DOCUMENTATION_CONVENTIONS.md)
- [Architecture decisions](docs/architecture/decisions/)

## Documentation and implementation policy

Normative mathematical documentation defines the behaviour that implementation and tests must follow.

When existing code conflicts with the core JI domain specification, the implementation should be revised unless the specification is deliberately amended.

Documentation should be updated in the same task as the code, behaviour, or architectural decision it describes.

## Author

Just Intonation Tools is developed by Alexis Millares Thomson.

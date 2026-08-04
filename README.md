# Just Intonation Tools

Just Intonation Tools is a collection of browser-based tools for exploring mathematical and visual relationships in just intonation.

The project currently includes:

- a set calculator for partial sets, partial-class sets, equivalence classes, transposition, inversion, and harmonic-complexity calculations
- a harmonic spiral for visualizing and selecting partials
- a ratio lattice for exploring harmonic relationships in three-dimensional space

The mathematical foundations of the project grow out of Alexis Millares Thomson's research in just-intonation set theory, including Parspace, Parcspace, and Spectral Extension.

## Project status

The application is being refactored into a TypeScript-and-Vite codebase.

Python and Django have been removed. Shared mathematical behaviour is being rebuilt as a validated TypeScript domain, with documentation quality and test-driven development treated as project requirements.

The current mathematical source of truth is the [core JI domain specification](docs/domain/CORE_JI_DOMAIN.md).

## Technology

The project uses:

- TypeScript
- React
- Vite
- Tailwind CSS
- Three.js

The planned testing stack is documented in the [testing strategy](docs/testing/TESTING_STRATEGY.md).

## Source structure

The source tree follows three top-level responsibilities:

```text
src/
├── data/
├── lib/
└── ui/
```

- `src/data/` contains static configuration, presets, and mode definitions.
- `src/lib/` contains deterministic mathematical, domain, parsing, geometry, and placement logic.
- `src/ui/` contains React components, hooks, SVG drawing, Three.js scene management, and browser interaction.

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

Testing commands will be added when the testing infrastructure defined in `docs/testing/TESTING_STRATEGY.md` is installed.

## Documentation

The [documentation index](docs/README.md) links to the project's mathematical specifications, engineering policies, architecture records, and future subsystem documents.

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

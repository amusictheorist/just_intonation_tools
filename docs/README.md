# Project Documentation

This directory contains the long-form documentation for Just Intonation Tools.

## Documentation map

### Domain

[`domain/CORE_JI_DOMAIN.md`](./domain/CORE_JI_DOMAIN.md)

The normative mathematical source of truth for the shared Just Intonation domain. It defines valid values, invariants, canonical forms, equivalence relations, operations, and Spectral Extension.

Implementation and tests must conform to this document.

The current shared TypeScript domain primitives and operations are implemented
under `src/lib/ji/`. Their public contracts are documented with JSDoc alongside
the source.

### Testing

[`testing/TESTING_STRATEGY.md`](./testing/TESTING_STRATEGY.md)

The accepted project-wide testing strategy. It defines test layers, tooling, TDD workflow, assertion policy, file organization, quality gates, and the initial test matrix.

### Documentation conventions

[`DOCUMENTATION_CONVENTIONS.md`](./DOCUMENTATION_CONVENTIONS.md)

The accepted conventions for repository documentation, code comments, JSDoc, TODO comments, architectural decision records, naming, authority, and documentation maintenance.

### Architecture

`architecture/`

Cross-project architecture documentation belongs here.

The planned `architecture/OVERVIEW.md` will describe:

- the `data/`, `lib/`, and `ui/` boundaries
- allowed dependency directions
- separation of domain, placement, rendering, and interface code
- relationships among the calculator, lattice, spiral, and shared domain

### Architecture decisions

[`architecture/decisions/`](./architecture/decisions/)

Architectural decision records preserve durable cross-cutting decisions and their consequences.

Current foundation decisions:

- [`0001-typescript-vite-only.md`](./architecture/decisions/0001-typescript-vite-only.md)
- [`0002-three-directory-source-structure.md`](./architecture/decisions/0002-three-directory-source-structure.md)
- [`0003-shared-core-ji-domain.md`](./architecture/decisions/0003-shared-core-ji-domain.md)
- [`0004-testing-stack.md`](./architecture/decisions/0004-testing-stack.md)
- [`0005-use-bigint-for-exact-ji-domain-values.md`](./architecture/decisions/0005-use-bigint-for-exact-ji-domain-values.md)

Accepted migration plans for replacing legacy mathematical helpers with the
shared JI domain:

- [`architecture/LEGACY_RATIO_MIGRATION.md`](./architecture/LEGACY_RATIO_MIGRATION.md) — separates legacy lattice and spiral ratio helpers from the shared exact ratio domain
- [`architecture/LEGACY_PARTIAL_MIGRATION.md`](./architecture/LEGACY_PARTIAL_MIGRATION.md) — inventories legacy partial and partial-class helpers and defines their migration to shared domain operations

### Subsystems

`subsystems/`

Tool-specific specifications and design documents belong here.

Planned categories include:

```text
subsystems/
├── calculator/
├── lattice/
└── spiral/
```

Examples of appropriate subsystem documents include lattice placement rules, spiral drawing behaviour, scene-management responsibilities, tool-specific limits, and user-interaction behaviour.

Subsystem documents must not redefine the shared JI domain.

## Authority

The documentation authority order is:

1. normative domain specifications
2. accepted architectural decisions
3. accepted subsystem specifications
4. tests expressing executable expectations
5. implementation
6. introductory README material

Conflicts should be investigated and resolved deliberately. README files should summarize and link rather than become competing specifications.

## Adding documentation

Before adding a document, consult [`DOCUMENTATION_CONVENTIONS.md`](./DOCUMENTATION_CONVENTIONS.md).

Place new documentation in the most specific appropriate category. Do not create empty directories merely to reproduce the planned structure.

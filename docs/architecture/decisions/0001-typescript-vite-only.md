# ADR 0001: Use TypeScript and Vite only

## Status

Accepted

## Context

The repository previously contained a Django backend, Python mathematical logic, and a separate React frontend.

The application's main calculations are deterministic and do not require a server. Maintaining parallel Python and JavaScript implementations also created duplicated mathematical behaviour and made the codebase harder to document, test, and evolve consistently.

The refactor requires a single implementation environment that can support the calculator, spiral, lattice, shared domain logic, and browser interface.

## Decision

Just Intonation Tools will use TypeScript and Vite as its application platform.

Python and Django are removed completely from the target architecture.

Shared mathematical logic, tool-specific deterministic logic, and the user interface will all be implemented in TypeScript.

The application will remain browser-based unless a future architectural decision introduces a concrete need for a server.

## Consequences

### Positive

- mathematical behaviour has one implementation language
- shared logic can be consumed directly by every tool
- domain tests and UI integration tests can run in the same ecosystem
- the build and development workflow becomes simpler
- obsolete API and serialization boundaries can be removed
- Vite provides a modern development and production-build environment

### Negative

- useful legacy Python tests and implementations cannot be migrated mechanically
- mathematical behaviour must be re-expressed carefully in TypeScript
- exact numeric representation must be chosen explicitly within the JavaScript runtime
- server-side capabilities would require a later architectural decision if they become necessary

### Required follow-up

- rebuild the shared JI domain from the normative specification
- add TypeScript testing infrastructure
- remove remaining assumptions derived from the former Django API
- ensure tool parsers remain separate from the validated core domain

## Alternatives considered

### Retain Django as a calculation API

Rejected because the calculations are deterministic, the application has no current requirement for server-side persistence, and the API boundary would preserve unnecessary architectural complexity.

### Keep Python as a separate mathematical reference implementation

Rejected as a production architecture because it would maintain duplicate sources of truth. Legacy Python may still be consulted as migration evidence, but it is not normative.

### Use JavaScript without TypeScript

Rejected because validated domain values, explicit contracts, exhaustiveness checks, and cross-module architecture benefit materially from static typing.

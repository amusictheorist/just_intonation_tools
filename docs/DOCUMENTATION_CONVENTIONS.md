# Documentation Conventions

## 1. Purpose

This document defines how documentation is organized, written, maintained, and reviewed in Just Intonation Tools.

Its goals are to:

- keep mathematical, architectural, subsystem, and developer documentation distinct
- make authoritative sources easy to identify
- prevent duplicated or contradictory documentation
- preserve important design rationale
- support test-driven development and long-term maintenance
- ensure documentation changes accompany the code or planning work they describe

These conventions apply to repository Markdown files, architectural decision records, code comments, JSDoc, and substantial TODO comments.

---

## 2. Documentation principles

Project documentation should be accurate, clearly scoped, easy to locate, explicit about authority, consistent with project terminology, maintained alongside related code and decisions, detailed where behaviour or rationale is non-obvious, and concise where the code or type system already communicates the same information.

Documentation should explain the project rather than merely restate its implementation.

---

## 3. Documentation structure

The repository documentation should follow this structure:

```text
README.md

docs/
├── README.md
├── DOCUMENTATION_CONVENTIONS.md
├── architecture/
│   ├── OVERVIEW.md
│   └── decisions/
├── domain/
│   └── CORE_JI_DOMAIN.md
├── testing/
│   └── TESTING_STRATEGY.md
└── subsystems/
    ├── calculator/
    ├── lattice/
    └── spiral/
```

Directories do not need to exist before they contain useful documentation. New documents should be added to the most specific appropriate location rather than placed directly under `docs/` without a clear category.

---

## 4. Documentation categories

### 4.1 Root `README.md`

The root README is the main entry point for the repository. It should provide:

- a concise description of Just Intonation Tools
- the project’s research and musical context
- an overview of the calculator, lattice, and spiral tools
- the current TypeScript and Vite stack
- development prerequisites
- installation instructions
- common development commands
- a high-level explanation of `src/data/`, `src/lib/`, and `src/ui/`
- links to deeper technical documentation
- the current project or refactor status where useful

The root README should summarize and link rather than duplicate detailed specifications or architectural documents. Template-generated documentation that no longer describes the project should be removed.

### 4.2 `docs/README.md`

`docs/README.md` is the documentation index. It should:

- list the major documentation categories
- identify important normative and accepted documents
- explain where new documentation belongs
- link to architecture, domain, testing, and subsystem documents
- make draft or superseded documents easy to identify

It should not duplicate the contents of the documents it indexes.

### 4.3 Domain documentation

`docs/domain/` contains normative mathematical specifications.

The primary source of truth is:

```text
docs/domain/CORE_JI_DOMAIN.md
```

Domain documents define mathematical concepts, invariants, canonical forms, equivalence relations, valid operations, invalid states, exact expected results, and domain terminology.

Implementation and tests must conform to normative domain documentation.

Domain documents should not define user-interface layout, parsing conveniences, scene management, rendering details, animation, persistence, or tool-specific performance limits. Those concerns belong elsewhere unless explicitly discussed as exclusions.

### 4.4 Architecture documentation

`docs/architecture/` contains cross-project architectural guidance.

Architecture documents may explain:

- the `data/`, `lib/`, and `ui/` boundaries
- allowed dependency directions
- the shared JI domain
- separation between domain logic, placement logic, rendering, and UI
- subsystem relationships
- runtime data flow
- important integration boundaries
- architectural constraints that apply across multiple tools

`docs/architecture/OVERVIEW.md` should eventually serve as the high-level architectural map of the project.

### 4.5 Architectural decision records

`docs/architecture/decisions/` contains architectural decision records, or ADRs.

ADRs record durable cross-cutting decisions and their rationale.

Examples include:

- removing Python and Django
- adopting TypeScript and Vite
- preserving the `data/`, `lib/`, and `ui/` structure
- centralizing the core JI domain
- selecting the testing stack
- choosing an exact rational-number representation
- choosing a TypeScript domain-object representation

ADRs should not be used for routine dependency updates, minor naming decisions, local refactors, temporary implementation details, or decisions already fully contained within a subsystem specification.

### 4.6 Testing documentation

`docs/testing/` contains project-wide testing policy and architecture.

The primary testing document is:

```text
docs/testing/TESTING_STRATEGY.md
```

Testing documentation may define test layers, source-of-truth policy, tooling, test organization, TDD workflow, assertion policies, quality gates, coverage policy, and end-to-end or visual-regression strategy.

Individual test cases should normally remain near the code they verify rather than being catalogued in long-form documentation.

### 4.7 Subsystem documentation

`docs/subsystems/` contains tool- or subsystem-specific behaviour and design.

Examples include:

```text
docs/subsystems/lattice/PLACEMENT.md
docs/subsystems/lattice/SCENE_ARCHITECTURE.md
docs/subsystems/spiral/PLACEMENT.md
docs/subsystems/spiral/DRAWING.md
docs/subsystems/calculator/BEHAVIOUR.md
```

Subsystem documents may define placement rules, rendering responsibilities, interaction behaviour, accepted geometric invariants, scene lifecycle, subsystem-specific input and output behaviour, reviewed examples, and tool-specific limits.

Subsystem documentation must not redefine the shared JI domain. When a subsystem consumes shared mathematical values, it should link to the domain specification rather than reproduce it.

---

## 5. Authority and source-of-truth rules

Documentation has different levels of authority.

The intended hierarchy is:

1. normative domain specifications
2. accepted architectural decisions
3. accepted subsystem specifications
4. tests expressing executable expectations
5. implementation
6. introductory and explanatory README material

This hierarchy does not mean implementation should be ignored when documents conflict. A conflict should be investigated and resolved deliberately.

### 5.1 Normative specifications

A normative document defines behaviour that implementation and tests must follow.

The core JI domain specification is normative. When code conflicts with a normative document, the code should be treated as incorrect unless the specification is deliberately revised.

### 5.2 Architectural decisions

Accepted ADRs define durable project constraints and rationale.

A later decision should supersede an earlier ADR rather than silently rewrite its history.

### 5.3 Subsystem specifications

Accepted subsystem documents define tool-specific behaviour that is outside the shared domain.

They should be treated as authoritative for the subsystem until revised.

### 5.4 Introductory documentation

README files summarize and link to authoritative sources. They should not become competing specifications.

---

## 6. Document status

Long-form technical documents should make their status clear when that status is not obvious.

Useful statuses include:

- **Normative** — implementation and tests must conform
- **Accepted** — approved architectural or subsystem guidance
- **Draft** — incomplete and not yet authoritative
- **Historical** — retained for context but no longer current
- **Superseded** — replaced by another document or decision

A status may be presented near the top of a document:

```md
**Status:** Draft
```

Not every accepted document requires an explicit status line. Draft, historical, and superseded documents must be clearly marked.

---

## 7. File and directory naming

Directory names should use lowercase words.

Major standalone Markdown documents should use uppercase descriptive filenames.

Examples:

```text
CORE_JI_DOMAIN.md
TESTING_STRATEGY.md
DOCUMENTATION_CONVENTIONS.md
OVERVIEW.md
PLACEMENT.md
SCENE_ARCHITECTURE.md
```

ADR filenames should use a four-digit numeric prefix followed by lowercase kebab case.

Examples:

```text
0001-typescript-vite-only.md
0002-three-directory-source-structure.md
0003-shared-core-ji-domain.md
0004-testing-stack.md
```

Names should describe the document’s responsibility rather than the task or conversation that produced it.

---

## 8. Architectural decision records

### 8.1 When to create an ADR

Create an ADR when a decision is cross-cutting, difficult or costly to reverse, likely to be questioned later, not obvious from the code, based on meaningful alternatives or trade-offs, or important to future architectural work.

Do not create an ADR merely because a choice was made.

### 8.2 ADR format

Use this structure:

```md
# ADR 0001: Decision title

## Status

Accepted

## Context

What problem or decision prompted this record?

## Decision

What was decided?

## Consequences

What becomes easier, harder, required, or excluded?

## Alternatives considered

What serious alternatives were considered, and why were they rejected?
```

Additional sections may be added when they provide real value.

### 8.3 ADR statuses

Allowed ADR statuses are:

- Proposed
- Accepted
- Superseded
- Deprecated

A superseded ADR should identify the ADR that replaces it.

### 8.4 ADR history

Accepted ADRs should not be rewritten to hide later changes.

Minor corrections and link repairs are acceptable. A material change in architectural direction should be recorded in a new ADR that supersedes the earlier decision.

### 8.5 Initial ADR backlog

The following foundation decisions should be backfilled:

```text
0001-typescript-vite-only.md
0002-three-directory-source-structure.md
0003-shared-core-ji-domain.md
0004-testing-stack.md
```

The project does not need to reconstruct every historical decision.

---

## 9. Code comments

Comments should explain information that is not obvious from the code.

Use comments for:

- non-obvious mathematical reasoning
- domain invariants
- geometric assumptions
- placement logic
- architectural boundaries
- browser or Three.js lifecycle constraints
- intentional workarounds
- decisions whose rationale would otherwise be lost

Good:

```ts
// Remove every factor of 2 because parcs represent octave-equivalence classes.
```

Good:

```ts
// Keep the frame orthonormal so movement along local lattice axes does not
// distort distances around a high-prime anchor.
```

Avoid comments that narrate obvious operations:

```ts
// Increment the counter.
counter += 1;
```

Comments must be updated or removed when the code changes. A stale comment is considered a defect.

---

## 10. Mathematical comments

Mathematical comments must use the terminology established in `CORE_JI_DOMAIN.md`.

They should distinguish partials from parcs, distinguish literal sets from equivalence classes, name relevant invariants, name the transformation being applied, avoid introducing alternate terminology, and link to the domain specification when a full explanation is too large for the source file.

Example:

```ts
// Divide every member by the parset's greatest common divisor to obtain
// the canonical representative.
// See docs/domain/CORE_JI_DOMAIN.md.
```

Long mathematical definitions, proofs, and extensive examples belong in `docs/domain/`. Source comments should explain the local implementation consequence of those definitions.

### Implementation terminology

The normative domain specifications may use project-specific theoretical terminology such as _parc_, _parcset_, Parspace, and Parcspace.

Source-code identifiers should prefer descriptive terminology that is readily understandable without prior knowledge of that vocabulary when an equivalent domain term is available.

For example:

- use `PartialClass` rather than `Parc` for the TypeScript domain type
- use `partialToPartialClass` rather than `partialToParc` for the conversion operation
- prefer `partialClass` to `parc` for local variables

Documentaion, JSDoc, and mathematical comments may use the theoretical term when explaining the relationship to the normative domain. They should make the mapping explicit where it would otherwise be unclear.

Thie naming convention does not change the mathematical terminology or definitions in the [core JI domain](./domain/CORE_JI_DOMAIN.md).

---

## 11. JSDoc

JSDoc should be used selectively.

Use JSDoc for a function, type, class, or module when it:

- forms part of the shared domain API
- is imported across subsystem boundaries
- has non-obvious preconditions
- has important exactness guarantees
- has important immutability or mutation guarantees
- may return an exceptional, missing, or undefined result
- must distinguish domain behaviour from parser or UI behaviour
- would otherwise require callers to inspect the implementation

Example:

```ts
/**
 * Returns the canonical partial class of a validated positive partial by
 * removing every factor of 2.
 *
 * @param partial A validated positive partial.
 * @returns The corresponding positive odd parc.
 */
export const toParc = (partial: Partial): Parc => {
  // ...
};
```

JSDoc should not repeat information already clear from names and TypeScript types. Internal helpers with clear names, types, and behaviour do not require JSDoc.

---

## 12. File-level comments

A source file may begin with a short file-level comment when its role is not obvious from its name and location.

Appropriate cases include placement algorithms, subsystem boundaries, scene managers with lifecycle responsibilities, compatibility adapters, modules implementing a particular mathematical section, and modules whose constraints apply to every export.

Do not add boilerplate file headers to every source file.

---

## 13. TODO comments

TODO comments must be actionable and specific.

Good:

```ts
// TODO: Replace this characterization behaviour once expanded radial
// placement is specified in docs/subsystems/lattice/PLACEMENT.md.
```

Avoid:

```ts
// TODO: Fix this later.
```

Substantial or long-lived work should be tracked on the project board. A TODO may remain in code when it identifies the exact technical location of tracked work, but it should not replace a project task.

TODO comments should be removed when the related work is completed or no longer relevant.

---

## 14. Links and paths

Repository documentation should use relative links.

Examples:

```md
See the [core JI domain specification](domain/CORE_JI_DOMAIN.md).
```

```md
See the [testing strategy](testing/TESTING_STRATEGY.md).
```

Documents in nested directories should use the appropriate relative path:

```md
See the [core JI domain specification](../../domain/CORE_JI_DOMAIN.md).
```

Links should use descriptive text rather than phrases such as “click here.”

File and directory paths should be enclosed in backticks:

```md
`src/lib/`
```

Internal links should be checked when files are renamed or moved.

---

## 15. Examples and code snippets

Examples should be small enough to understand, accurate for the current specification or implementation, written using current project terminology, updated when the corresponding API changes, marked as illustrative when incomplete, and clearly labelled when they are pseudocode.

Use:

```text
Pseudocode
```

when an example is conceptual rather than valid production code.

Mathematical examples should preserve the notation established in the core domain specification. Code examples should not imply support for behaviour that the application does not provide.

---

## 16. External references

External links should be used primarily for official framework documentation, standards, primary research sources, and definitions that are intentionally external to the project.

External references should not replace documentation of the project’s own decision.

For example, linking to the Vitest documentation does not remove the need to explain why Vitest was selected for this repository.

---

## 17. Avoiding duplicated documentation

Detailed information should have one authoritative home.

Use the following ownership rules:

- the root README introduces and links
- `docs/README.md` indexes and classifies
- domain documents define mathematical behaviour
- architecture documents explain cross-project structure
- ADRs record durable decisions and trade-offs
- subsystem documents define tool-specific behaviour
- JSDoc defines public and cross-module code contracts
- comments explain local rationale and constraints
- tests express executable expectations

When one document needs information owned elsewhere, it should link to the authoritative source rather than copy a large section. Small summaries are acceptable when they help orient the reader.

---

## 18. Documentation maintenance

Documentation should be updated in the same task as the behaviour or architecture it describes.

A task is not complete when:

- code changes but a normative specification remains outdated
- an architectural decision changes but no ADR is added or superseded
- a public or cross-module API changes but its contract documentation is stale
- subsystem behaviour changes materially but its documentation describes the old behaviour
- setup commands or prerequisites change but the README remains inaccurate
- a comment or TODO no longer reflects the code

Documentation-only edits are not required for refactors that do not affect behaviour, contracts, architecture, setup, or developer understanding.

---

## 19. Documentation review questions

When reviewing a task, ask:

1. Did this change alter documented behaviour?
2. Did it create or change a public contract?
3. Did it introduce a durable architectural decision?
4. Did it change setup, commands, or prerequisites?
5. Did it make an existing comment or document inaccurate?
6. Did it introduce non-obvious mathematical or placement logic?
7. Would a future contributor understand why the code works this way?
8. Does the change use terminology consistent with the core domain specification?

A “yes” answer generally means documentation work is required.

---

## 20. Documentation definition of done

For any project task, documentation work is complete when the applicable items are satisfied:

- normative specifications reflect intended behaviour
- relevant ADRs are added, accepted, or superseded
- subsystem documentation reflects material design changes
- public and cross-module contracts have appropriate JSDoc
- non-obvious mathematical and architectural reasoning is commented
- stale comments and obsolete instructions are removed
- README commands and paths still work
- internal links resolve
- terminology matches the core domain specification
- documentation changes are committed with the related code or planning work

Documentation should be treated as part of the implementation rather than optional cleanup after the task is complete.

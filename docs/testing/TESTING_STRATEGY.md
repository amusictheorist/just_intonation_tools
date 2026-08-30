# Testing Strategy

## 1. Purpose

This document defines the testing strategy for Just Intonation Tools as the project is rebuilt in TypeScript and Vite.

The strategy is intended to provide confidence in:

- the correctness of the shared Just Intonation domain
- mathematical and geometric calculations
- spiral and lattice placement logic
- rendering and scene-management behaviour
- user-interface behaviour
- integration between the application's layers
- production builds and static quality checks

Testing is a central part of the refactor rather than a final verification step. New or substantially rewritten deterministic logic should normally be developed using a test-driven workflow.

This document defines testing responsibilities and principles. It does not yet prescribe the implementation of every test or lock the project into a particular internal domain-object design.

## 2. Sources of truth

### 2.1 Core JI domain specification

The normative source of truth for shared Just Intonation behaviour is:

```text
docs/domain/CORE_JI_DOMAIN.md
```

Core-domain tests must derive their expected behaviour from [that specification](../domain/CORE_JI_DOMAIN.md).

Existing Python, Django, JavaScript, and TypeScript implementations may be consulted for:

- useful examples
- known edge cases
- regression scenarios
- evidence of previous application behaviour
- identifying gaps between legacy behaviour and the specification

Legacy implementations are not normative.

When existing code conflicts with the core-domain specification, the implementation must eventually change. Tests must not preserve conflicting legacy behaviour merely because it already exists.

### 2.2 Visualization behaviour

Spiral and lattice placement behaviour is outside the scope of the core JI domain specification.

Expected visualization behaviour must therefore be documented through:

- placement specifications
- accepted geometric invariants
- reviewed examples
- intentional regression cases
- tool-specific design decisions

Existing visualization code can supply characterization cases, but existing behaviour must be reviewed before it becomes authoritative.

## 3. Testing goals

The test suite should provide confidence that:

1. core mathematical values cannot exist in invalid states.
2. canonical forms are produced consistently.
3. equivalent inputs produce equivalent domain results.
4. exact mathematical results remain exact where the specification requires exactness.
5. placement calculations can be verified independently of rendering.
6. rendering code faithfully represents calculated placement data.
7. user-interface tests focus on user-observable behaviour rather than duplicating domain tests.
8. major user workflows work in a real browser.
9. regressions are caught close to the layer in which they originate.
10. tests remain readable enough to function as executable documentation.

## 4. Architectural testing boundaries

The source structure preserves three top-level directories under `src/`:

```text
src/
├── data/
├── lib/
└── ui/
```

Each directory has a different testing responsibility.

### 4.1 `src/lib/`

`src/lib/` contains deterministic application logic.

This includes:

- the shared JI domain
- exact ratio operations
- factorization
- parset and parcset operations
- harmonic-complexity measures
- spiral mathematics
- lattice mathematics
- coordinate calculations
- placement algorithms
- transformations
- tool-specific parsers that do not require browser APIs

Logic in `src/lib/` should generally be testable without:

- React
- a browser DOM
- SVG elements
- an HTML canvas
- Three.js scenes
- network requests

### 4.2 `src/ui/`

`src/ui/` contains presentation and interaction behaviour.

This includes:

- React components
- React hooks
- SVG drawing adapters
- Three.js scene management
- browser events
- keyboard interaction
- accessibility behaviour
- tool workflows

Tests in this layer should verify how users and rendering systems interact with already-tested library logic.

### 4.3 `src/data/`

`src/data/` contains static configuration, presets, and mode definitions.

Tests are needed when static data has meaningful invariants, such as:

- unique identifiers
- supported placement modes
- valid labels
- consistency between configuration and corresponding domain types

Pure display copy does not require testing merely to increase coverage.

## 5. Test layers

The project will use several complementary testing layers.

No single layer is expected to probe the correctness of the entire application.

### 5.1 Core-domain specification tests

Core-domain tests verify the behaviour defined in [the domain specification](../domain/CORE_JI_DOMAIN.md).

They should cover:

- positive-integer validation
- positive rational ratios
- canonical fraction reduction
- octave equivalence
- octave reduction
- partials
- parsets
- parcs
- parcsets
- canonical representatives
- equivalence relations
- ratio multiplication
- directed interval ratios
- parset/parcset transposition
- low inversion
- Spectral Extension
- cardinality-scaled Spectral Extension
- invalid-value rejection

These tests are normative specification tests.

They are not direct ports of the legacy Python test suite.

### 5.2 Pure unit tests

Pure unit tests cover small deterministic functions.

Examples include:

- vector operations
- greatest common divisors
- factorizations
- coordinate conversion
- rotation
- prime-position calculations
- placement dispatch
- parser normalization
- small data transformations

These tests should be fast and should not require browser setup.

### 5.3 Property and invariant tests

Example-based tests are necessary but are not sufficient for mathematical code.

Property tests should be used where a broad class of values must satisfy a general rule.

Candidate properties include:

- reducing a ratio does not change its rational value
- canonical ratios are always reduced
- canonical ratio denominators are positive
- octave reduction returns an octave-equivalent ratio
- octave-reduced positive ratios lie within the specified octave range
- parcs are always positive odd integers
- canonical set representatives are invariant under valid equivalence transformations
- multiplying by the identity ratio changes nothing
- ratio multiplication is associative within supported numeric limits
- applying a zero rotation changes nothing
- normalized nonzero vectors have length approximately one
- a prime frame is orthonormal
- spiral radius and theta conversions are inverses within tolerance
- placement results are deterministic

Property tests should generate only values that are valid for the layer under test unless invalid-value generation is the explicit subject of the test.

Shared arbitraries should be used when they make the domain assumptions of a property clearer and remove repeated construction boilerplate.

Constructor property tests should generally generate primitive input values and invoke the constructor explicitly, because construction and validation are the behaviour under test.

Property tests for downstream operations may generate validated domain values directly through shared arbitraries. For example, a transposition property may begin with an arbitrary valid `PartialSet`, while a `createPartialSet` property should begin with primitive member values and construct the set explicitly.

### 5.4 Placement tests

Placement tests verify geometric calculations without constructing rendered scenes.

They should cover:

- known reference coordinates
- symmetry
- orientation
- distance relationships
- octave-equivalent placement
- reciprocal relationships where intentionally defined
- placement metadata
- high-prime anchoring
- radius scaling
- rotation
- placement-mode dispatch
- deterministic results
- documented geometric invariants

Placement tests should be the primary means of proving coordinate correctness.

A React component, SVG tree, or Three.js scene should not be required to determine whether a ratio has been assigned the correct coordinate.

### 5.5 Rendering-adapter tests

Rendering-adapter tests verify that mathematical results are represented correctly by browser or rendering APIs.

Examples include:

- converting coordinates into SVG attributes
- creating the expected number of points
- creating labels and connections
- passing world coordinates to Three.js objects
- updating existing scene objects
- removing obsolete scene objects
- attaching event handlers
- cleaning up listeners and graphical resources

These tests should not duplicate the complete mathematical test suite.

For example, a rendering test may verify that a calculated `x` coordinate is passed unchanged to a point object. It should not independently reimplement the formula that produced `x`.

### 5.6 React component and hook tests

React tests should focus on user-observable behaviour.

Examples include:

- submitting input
- displaying validation feedback
- showing calculated results
- switching placement modes
- selecting and deselecting partials
- opening help panels
- keyboard interaction
- accessible labels and roles
- coordinating state between controls and visualizations
- handling empty or invalid results

React tests should call real library functions where the integration matters, but exhaustive mathematical cases belong in `src/lib/` tests.

### 5.7 End-to-end tests

A small end-to-end suite verifies essential workflows in a real browser.

Current end-to-end coverage includes:

1. entering valid calculator input and receiving expected results;
2. transposing calculator results;
3. recovering from invalid calculator input;
4. creating lattice points from entered ratios;
5. enabling higher-prime lattice placement and accessing its controls;
6. recovering from invalid lattice input.

Additional end-to-end coverage should be added only for high-value user workflows that are not already protected more effectively at a lower test layer.

Likely future candidates include:

- navigating among the calculator, spiral, and lattice tools;
- drawing a spiral and selecting partials;
- switching representative lattice visualization modes where browser-level integration needs protection;
- refreshing or directly loading important routes.

End-to-end tests should remain limited to user-observable workflows.

They should not be used for exhaustive mathematical, placement, geometry, rendering, or animation coverage when those behaviours can be tested more precisely and reliably at lower layers.

### 5.8 Static checks

The following are part of the project quality gates:

- TypeScript compilation
- ESLint
- Vite production build

Static checks are required, but they do not replace behavioural tests.

## 6. Core-domain testing policy

### 6.1 Specification before implementation

Before implementing a core-domain behaviour:

1. identify the relevant statement in `CORE_JI_DOMAIN.md`
2. translate it into one or more observable test cases
3. include valid examples
4. include invalid examples where applicable
5. identify useful mathematical invariants
6. implement the minimum behaviour required to pass
7. refactor while retaining passing tests

If the specification does not provide enough information to determine an expected result, the specification should be clarified before the implementation is treated as complete.

### 6.2 Valid domain inputs

The shared ratio domain accepts only strictly positive rational ratios.

The domain must not silently accept or normalize:

- zero
- negative values
- non-integral numerator or denominator values
- `NaN`
- infinite values
- malformed strings
- decimal parsing conveniences

Parsing conveniences belong outside the core domain.

A tool-specific parser may accept additional forms, but successful parsing must produce a valid core-domain value before domain operations begin.

### 6.3 Exactness

Exact mathematical values should use exact assertions.

Examples include:

- reduced numerator and denominators
- factor exponents
- parset members
- parcset members
- canonical representatives
- Spectral Extension results
- exact scaled complexity ratios

Floating-point approximation should not be used where the expected result is rational and the domain representation can preserve that rational value exactly.

### 6.4 Invalid-state prevention

Tests should prefer verifying that invalid domain objects cannot be constructed over repeatedly checking defensive branches inside every operation.

Once a value has successfully crossed the domain boundary, internal functions should be able to rely on its invariants.

## 7. Legacy behaviour and migration tests

Existing behaviour falls into three categories.

### 7.1 Accepted behaviour

Behaviour that has been reviewed and intentionally retained should receive regression tests.

### 7.2 Conflicting behaviour

Behaviour that conflicts with the core-domain specification should receive replacement tests expressing the new required behaviour.

The old behaviour should not be enshrined in permanent tests.

### 7.3 Unclear behaviour

Behaviour whose intent is uncertain may temporarily receive characterization tests.

Characterization tests should be clearly identified as such. They record what the current code does without claiming that the behaviour is correct.

Before the related refactor is considered complete, each characterization test should be:

- promoted to an intentional regression test
- replaced by a specification-based test
- or removed because the behaviour is no longer relevant

## 8. Mathematical assertion policy

### 8.1 Exact assertions

Use exact equality for:

- integers
- canonical fractions
- factor maps
- set members
- lattice integer coordinates
- placement metadata
- array lengths
- element counts
- mode identifiers
- string output
- SVG attributes that contain exact non-geometric values

### 8.2 Approximate assertions

Use approximate equality for:

- trigonometric coordinates;
- vector lengths;
- normalized vectors;
- dot products;
- rotations;
- Euclidean distances;
- animated intermediate values;
- other calculated floating-point geometry.

Floating-point geometry tests should use a shared tolerance where repeated comparison logic would otherwise be duplicated.

A shared geometry tolerance may be represented by a constant such as:

`GEOMETRY_EPSILON`

Tests should use the smallest tolerance that is stable across supported environments and appropriate to the calculation under test.

Approximate assertions should remain explicit about what is being compared. Tests should not use unnecessarily loose tolerances merely to make unstable expectations pass.

### 8.3 Comparing vectors

Vector tests should use shared helpers that can express:

- approximate coordinate equality
- approximate vector length
- approximate orthogonality
- approximate antipodal relationships

Tests should not repeat ad hoc floating-point comparison code.

## 9. Lattice placement testing

Lattice placement tests should distinguish symbolic placement from geometric placement.

Symbolic tests verify the exact structural identity of a ratio within a lattice mode. Geometric tests verify the conversion of that symbolic representation into floating-point coordinates.

Placement tests should remain independent of React, Three.js scenes, camera state, and browser interaction.

### 9.1 Cubic placement

Cubic placement tests should verify:

- the identity ratio is placed at the origin;
- factors of 3 determine the x-axis;
- factors of 5 determine the y-axis;
- factors of 7 determine the z-axis;
- denominator exponents produce movement in the negative axis direction;
- powers of 2 do not affect cubic coordinates;
- octave-equivalent ratios receive the same placement;
- standard cubic placement rejects ratios containing primes above 7;
- results are deterministic.

Exact cubic coordinates should use exact assertions.

### 9.2 Expanded cubic placement

Expanded cubic tests should distinguish symbolic addressing from geometric positioning.

Symbolic tests should verify:

- ratios containing no prime above 7 have an empty higher-prime anchor path;
- factors of 3, 5, and 7 determine local cubic coordinates;
- higher-prime factors produce a canonical signed prime path;
- positive and negative generator steps are distinguished;
- repeated higher-prime powers produce repeated steps;
- higher-prime steps follow the documented canonical prime ordering;
- powers of 2 do not alter symbolic placement;
- equivalent inputs produce the same canonical address.

Geometric tests should verify:

- ratios with no higher-prime anchor path use the global 3–5–7 lattice directly;
- each higher-prime step contributes its deterministic anchor vector;
- negative higher-prime steps invert the corresponding anchor vector;
- repeated powers of a higher prime remain collinear and equally spaced;
- combinations of higher primes accumulate their anchor vectors deterministically;
- local 3–5–7 coordinates are translated from the resulting higher-prime anchor;
- local 3–5–7 axes remain parallel to the global axes;
- higher-prime radius changes anchor distance as intended;
- higher-prime rotation rotates the anchor and its attached local lattice together around the global origin;
- higher-prime rotation does not rotate the global 3–5–7 lattice;
- results are deterministic.

Tests should distinguish exact symbolic expectations from approximate geometric expectations.

### 9.3 Radial placement

Radial placement tests should verify both symbolic generator structure and resulting geometry.

Symbolic tests should verify:

- powers of 2 do not contribute generator steps;
- signed odd-prime factors produce the expected canonical prime path;
- generator distance equals the canonical path length;
- repeated powers of a prime produce repeated generator steps;
- numerator and denominator factors produce opposite directions;
- results are deterministic.

Geometric tests should verify:

- the identity ratio is placed at the origin;
- each odd prime has a deterministic radial direction;
- powers of the same prime remain collinear;
- negative generator steps reverse direction;
- composite ratios accumulate their generator vectors;
- standard radial placement uses the octave-normalized ratio;
- generator distance affects vertical placement only when height is enabled;
- disabling height removes the generator-distance contribution without changing horizontal placement;
- results are deterministic.

Floating-point radial coordinates should use approximate assertions.

### 9.4 Expanded radial placement

Expanded radial tests should verify the documented upper- and lower-side placement rules.

Symbolic tests should verify:

- ratios are classified onto the intended upper or lower side;
- the normalized ratio, canonical prime path, and generator distance are preserved in the expanded-radial address;
- powers of 2 are handled according to the expanded-radial normalization rules;
- results are deterministic.

Geometric tests should verify:

- upper-side placement follows the standard radial geometry;
- lower-side placement uses the documented symmetry mode;
- continuous symmetry negates all coordinates of the corresponding upper placement;
- aligned symmetry preserves x and z while negating y;
- generator height is applied consistently on both sides;
- changing symmetry mode changes geometry without changing symbolic placement;
- results are deterministic.

### 9.5 Higher-prime geometry

Higher-prime geometry tests should verify:

- each prime receives a deterministic anchor vector;
- repeated calls for the same prime produce the same vector;
- anchor-vector magnitude follows the configured higher-prime radius;
- positive generator steps use the canonical anchor vector;
- negative generator steps use its inverse;
- successive generator steps accumulate correctly;
- empty higher-prime paths resolve to the origin;
- anchor paths remain independent of local 3–5–7 coordinates;
- all produced coordinates are finite.

Testing every generated coordinate as a hard-coded floating-point fixture should be avoided.

A small number of reviewed reference cases should be combined with broader invariants such as determinism, symmetry, collinearity, vector accumulation, and stable distance relationships.

## 10. Spiral mathematics testing

Spiral mathematics should be tested independently of SVG drawing.

### 10.1 Polar conversion

Tests for polar conversion should cover:

- axis-aligned reference angles
- zero radius
- periodicity across 360 degrees
- preservation of distance from the origin
- negative or extended angles where supported

### 10.2 Radius and angle conversion

`radiusAtTheta` and `thetaOfRadius` should be tested as inverse operations within floating-point tolerance.

Reference cases should include:

- zero rotations
- one octave
- multiple octaves
- custom radius-per-octave values

### 10.3 Shared mathematical operations

Operations such as:

- greatest common divisor
- removing powers of 2
- ratio reduction
- octave reduction
- factorization

should eventually be owned and tested by the shared JI domain when they represent domain behaviour.

Tool-specific copies should not retain separate authoritative test suites after the shared implementation exists.

## 11. Spiral drawing testing

### 11.1 SVG path construction

Tests should verify:

- an empty path begins with a move command
- subsequent points use line commands
- extension preserves the existing path
- small non-animated paths produce expected coordinates
- custom radius settings affect coordinates
- animated paths request animation frames
- mocked animation time can advance to completion

Large full-path snapshots should be avoided.

### 11.2 Octave lines

Tests should verify:

- one line is created for each completed octave
- incomplete octaves do not add extra lines
- previous lines are removed before redraw
- endpoints use the calculated spiral coordinates
- expected classes and attributes are applied
- zero-length spirals create no octave lines

### 11.3 Spiral point drawing

Tests should verify:

- a point and label are created together
- matching data attributes are added
- accessible roles and labels are present
- click activates the supplied callback
- Enter activates the supplied callback
- Space activates the supplied callback
- unrelated keys do not activate the callback
- focus styling is applied and removed
- partial 1 receives its intended label treatment
- other labels receive radial offsets
- value removal removes all associated elements
- clearing preserves only the intended origin value
- missing SVG elements result in a safe no-op

These tests should use a DOM test environment rather than a real browser unless browser behaviour itself is under test.

## 12. Three.js and scene-management testing

Three.js scene tests should focus on application-owned behaviour rather than retesting Three.js itself.

Scene and runtime tests should verify responsibilities such as:

- creating lattice point meshes from scene-point descriptions;
- creating connection lines from scene-connection descriptions;
- preserving existing point meshes when scene-point identities remain stable;
- creating meshes for newly introduced scene points;
- removing and disposing meshes for removed scene points;
- assigning and updating target positions for point meshes;
- interpolating point meshes toward target positions using frame-delta timing;
- updating connection endpoints from the current interpolated point-mesh positions;
- updating higher-prime appearance without rebuilding unrelated scene objects;
- mapping lattice-scene identifiers to rendered objects;
- reporting frame deltas before rendering;
- coordinating camera updates and rendering;
- locating lattice points from pointer coordinates;
- forwarding hover and modified-click interactions through the scene runtime;
- adding and removing browser event listeners;
- starting and stopping the animation-frame loop;
- disposing geometries, materials, textures, camera controls, renderers, and other owned graphical resources.

Scene-management tests should verify application-owned state transitions and resource ownership directly. They should not assert internal Three.js implementation details unless those details form part of the application's own contract.

Where possible, scene systems should consume plain serializable scene-description objects rather than reconstructing mathematical placement semantics.

Testing compact scene descriptions, object identity, observable positions, event behaviour, and disposal effects is preferable to snapshotting entire Three.js object graphs.

Animation tests should use controlled frame deltas and observable intermediate positions rather than relying on real-time delays.

Exact lattice-placement correctness belongs in lower-level symbolic and geometry tests. Scene tests should verify that already-calculated placement data is represented and updated correctly.

## 13. Snapshot and visual-regression policy

### 13.1 Snapshots

Snapshots may be used for small, stable, reviewable outputs such as:

- a compact scene-description object
- a small SVG fragment
- stable accessibility markup
- structured calculator output

Snapshots should not be used merely to avoid writing meaningful assertions.

Avoid snapshots of:

- entire application pages
- large SVG paths
- large floating-point arrays
- full Three.js scenes
- implementation-heavy React component trees

### 13.2 Visual regression

A small visual-regression suite may be introduced for high-value cases that cannot be adequately protected by mathematical and structural tests.

Potential examples include:

- a canonical spiral view
- one cubic lattice view
- one expanded high-prime lattice view
- label-placement or collision behaviour
- responsive layout at key viewport sizes

Visual regression is supplementary.

A passing screenshot comparison does not prove that mathematical placement is correct.

## 14. Test organization

Tests should normally live near the code they verify.

The project will use colocated test files with the following naming convention:

```text
src/lib/ji/ratio.ts
src/lib/ji/ratio.test.ts

src/lib/lattice/placement/cubic.ts
src/lib/lattice/placement/cubic.test.ts

src/lib/spiral/drawing/spiralDrawing.ts
src/lib/spiral/drawing/spiralDrawing.test.ts
```

Domain-specific test support should live near the domain code it supports.

For the shared JI domain, reusable property-test arbitraries live under:

```text
src/lib/ji/test/
├── partialArbitraries.ts
├── partialClassArbitraries.ts
├── partialSetArbitraries.ts
├── partialClassSetArbitraries.ts
├── positiveIntegerArbitraries.ts
└── ratioArbitraries.ts
```

These modules are test-only support and must not be imported by production modules.

Cross-cutting test support that is shared across multiple application areas may live in the root-level test directory:

```text
test/
├── assertions/
│   └── geometry.ts
├── fixtures/
└── setup/
    └── dom.ts
```

Shared test support may include:

- validated domain arbitraries
- fixture builders
- ratio fixtures
- vector assertions
- geometry tolerances
- DOM setup
- scene test utilities

Production modules must not depend on test-support modules.

## 15. Test naming

Test names should describe observable behaviour.

Prefer:

```text
reduces equivalent ratios to the same canonical form
rejects zero as a ratio numerator
places octave-equivalent ratios at the same cubic coordinate
preserves lattice metadata when rotation changes
creates one octave line for each complete octave
```

Avoid names tied only to implementation structure, such as:

```text
calls helper
works correctly
test cubic
returns expected result
```

Where appropriate, test files should group behaviour according to the terminology used in the domain specification.

## 16. Fixtures and test data

### 16.1 Domain fixtures

Domain fixtures should use explicit mathematically meaningful values.

Useful fixture categories include:

- identity ratios
- reduced and unreduced equivalent ratios
- octave-equivalent ratios
- ratios above and below unison
- prime and composite partials
- parsets with duplicate input members
- equivalent set-class members
- single-member sets
- ratios with factors 3, 5, and 7
- ratios containing higher primes
- invalid boundary values

### 16.2 Fixture builders

Tests should avoid manually constructing domain objects in states that public production code cannot create.

Fixture builders should normally use the same validated public construction boundary used by the application.

Special unsafe fixture construction should be limited to tests explicitly concerned with defensive behaviour or migration code.

### 16.3 Property-test arbitraries

Reusable `fast-check` arbitraries should model meaningful validated domain values rather than merely abbreviating arbitrary expressions.

For example:

- `positiveIntegerArbitrary` generates validated positive integers
- `partialArbitrary` generates validated partials
- `partialClassArbitrary` generates validated positive odd partial classes
- `partialSetArbitrary` generates non-empty validated partial sets
- `partialClassSetArbitrary` generates non-empty validated partial-class sets
- `ratioArbitrary` generates validated canonical ratios

Arbitraries should compose existing public domain constructors rather than reproduce their validation logic independently.

Tests of constructors should normally generate primitive inputs directly rather than consume an arbitrary that has already invoked the constructor under test.

Tests of downstream operations should prefer the highest-level arbitrary matching the function's input contract. This keeps property bodies focused on the behaviour being tested rather than repeated domain-object construction.

### 16.4 Regression fixtures

When a real defect is found:

1. add the smallest test that reproduces it
2. use a mathematically or behaviourally meaningful fixture
3. confirm the test fails for the intended reason
4. fix the defect
5. retain the test as a regression case

## 17. TDD workflow

For new or rewritten deterministic logic, the preferred workflow is:

1. select one small behaviour
2. identify its specification or documented placement rule
3. write one failing test
4. implement the minimum
5. make the test pass
6. refactor
7. add the next behaviour
8. run the relevant focused test set
9. run the complete suite before the task is complete

For mathematical operations, examples should normally be followed by invariant or property tests where useful.

For visualization work, development should proceed in this order where practical:

1. define expected placement
2. test placement mathematics
3. implement placement mathematics
4. test rendering instructions
5. implement rendering integration
6. inspect the visual result
7. add visual-regression case only when it protects additional value

This order is intended to prevent scene debugging from obscuring mathematical errors.

## 18. Quality gates

A change should not be considered complete unless the applicable checks pass.

The full quality gate is expected to include:

```text
TypeScript checks
ESLint
unit tests
property tests
DOM/component tests
production build
end-to-end tests where applicable
```

The intended npm scripts are:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "check": "npm run lint && npm run test:coverage && npm run build && npm run test:e2e && git status"
  }
}
```

`npm run check` is the complete local quality gate. It runs:

1. ESLint
2. the Vitest suite coverage collection
3. TypeScript compilation and the Vite production build
4. the Playwright end-to-end suite

Because `npm run test:coverage` executes the Vitest suite, `npm run check` does not need to run `test:run` separately.

The production build runs `tsc -b` before Vite builds the application, so a successful build also verifies TypeScript compilation.

Focused tests should still be used during development for fast feedback, but npm run check should pass before a task is considered complete.

## 19. Coverage policy

Coverage is a diagnostic tool rather than the definition of test quality.

Coverage targets should not encourage tests that merely execute lines without asserting meaningful behaviour.

Higher coverage is expected for:

- the core JI domain
- exact mathematical operations
- placement algorithms
- parsers
- state transformations

Coverage may reasonably be lower for:

- declarative layout components
- visual styling
- thin framework adapters
- branches that only guard unavailable browser features

Initial numeric coverage thresholds will be selected after the first domain and visualization tests establish a realistic baseline.

Any threshold should be enforced gradually rather than used to block the initial test-infrastructure task.

## 20. Performance of the test suite

The default test command should remain fast enough to run frequently during development.

The suite should distinguish between:

- fast unit and property tests
- DOM and component tests
- browser end-to-end tests
- visual-regression tests

Expensive tests should not force developers to avoid running the core suite.

Property-test generation limits should balance confidence with predictable runtime.

## 21. Continuous integration

Continuous integration should run the same complete quality gate used locally:

```text
npm ci
npm run check
```

1. dependency installation from the lockfile
2. TypeScript checks
3. ESLint
4. unit, property, DOM, component and hook tests with coverage collection
5. TypeScript compilation
6. the production build
7. Playwright end-to-end tests

Visual-regression tests may be added later if they protect behaviour that is not adequately covered by structural, mathematical, or interaction tests.

Failures should identify the responsible layer as clearly as possible.

The exact CI provider and workflow configuration remain implementation decisions.

## 22. Selected testing tools

The project uses the following testing stack.

### 22.1 Vitest

Vitest is the unit-test runner for:

- core-domain specification tests;
- pure unit tests;
- property and invariant tests;
- placement tests;
- DOM tests;
- React component and hook tests.

Vitest test functions are imported explicitly rather than enabled as globals:

```ts
import { describe, expect, it } from "vitest";
```

The default Vitest environment will be Node.

### 22.2 jsdom

Tests that require DOM, SVG, React, or browser APIs will use jsdom.

DOM-dependent test files may select the environment explicitly:

```ts
// @vitest-environment jsdom
```

Pure mathematical and placement tests should remain in the default Node environment.

### 22.3 Testing Library

The project uses:

- `@testing-library/dom` for direct DOM and SVG adapters
- `@testing-library/react` for React components and hooks
- `@testing-library/user-event` for realistic interaction
- `@testing-library/jest-dom` for readable DOM and accessibility assertions

Testing Library tests should emphasize user-observable behaviour rather than component internals.

### 22.4 fast-check

The project uses `fast-check` for property-based testing.

Reusable domain arbitraries should be composed from the same validated public constructors used by production code and should live with the domain they support.

### 22.5 Playwright

The project uses Playwright Test for:

- real-browser end-to-end workflows
- route and refresh behaviour
- browser-level keyboard interaction
- selected visual-regression screenshots

Playwright does not replace unit, placement, DOM, or component tests.

### 22.6 Coverage

Vitest's V8 coverage provider is used through `@vitest/coverage-v8`.

Coverage reports are collected without enforcing numeric thresholds.

### 22.7 Current Infrastructure configuration

The testing infrastructure is configured as follows:

- Vitest uses Node as its default environment
- DOM-dependent Vitest files opt into jsdom with:

```ts
// @vitest-environment jsdom
```

- `test/setup/dom.ts` loads the `@testing-library/jest-dom` matchers
- Vitest excludes the root-level `e2e/` directory so Playwright specifications are not collected by both runners
- V8 coverage produces text and HTML reports
- Playwright runs the end-to-end suite in Chromium against the Vite production preview server
- generated coverage and Playwright report directories are ignored by Git and ESLint where applicable
- the full `npm run check` command includes linting, Vitest coverage, the production build, Playwright end-to-end tests, and Git status.

## 23. Open decisions

The following testing-policy decisions remain to be made:

1. whether a shared geometry tolerance should be introduced for repeated floating-point assertions;
2. whether numeric coverage thresholds should eventually be enforced;
3. the exact continuous-integration provider and workflow configuration;
4. whether selected visual-regression tests provide enough additional value to justify maintaining them.

These open decisions do not change the testing principles or selected stack established in this document.

## 24. Testing infrastructure status

The testing infrastructure is installed and operational.

Current infrastructure includes:

- Vitest with TypeScript and Vite integration;
- Node as the default Vitest environment;
- per-file jsdom opt-in;
- Testing Library and `jest-dom`;
- fast-check property testing;
- Playwright Test with Chromium;
- separate Vitest and Playwright test discovery;
- shared domain arbitraries and test support;
- unit and property coverage for the shared JI domain;
- placement and geometry coverage for the lattice subsystem;
- React component and hook coverage;
- Three.js scene-renderer and runtime coverage;
- calculator end-to-end workflows;
- lattice end-to-end workflows;
- coverage reporting;
- a complete local quality gate through `npm run check`.

Testing work now proceeds alongside implementation and refactoring rather than as a separate infrastructure phase.

New or substantially rewritten behaviour should receive coverage at the lowest appropriate layer, with higher-level integration and end-to-end tests added only where they protect additional user-observable behaviour.

## 25. Test matrix

The following matrix summarizes the principal areas of testing responsibility across the application.

It is not an exhaustive inventory of every test. It identifies the kinds of behaviour that should be protected and the most appropriate test layer for each area.

| Area                                                | Behaviours                                                                                                                                                               | Test approach                                            | Authority                                       |
| --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ----------------------------------------------- |
| Positive integers and ratios                        | reject invalid values; construct valid values; reduce equivalent ratios; preserve exact rational value                                                                   | example tests and property tests                         | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Octave equivalence and reduction                    | identify octave-equivalent ratios; reduce to the canonical octave range; preserve equivalence up to powers of 2                                                          | example tests and property tests                         | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Partials and partial classes                        | validate values; remove powers of 2 where required; preserve domain invariants                                                                                           | example tests and property tests                         | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Partial sets and partial-class sets                 | reject invalid sets; remove duplicate members; preserve deterministic ordering and set semantics                                                                         | example tests and property tests                         | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Set equivalence and canonical representatives       | identify equivalent sets; compute canonical representatives; preserve representatives under valid transformations                                                        | example tests and property tests                         | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Ratio multiplication and directed intervals         | multiply exactly; preserve identity; compute directed interval ratios; retain canonical forms                                                                            | example tests and property tests                         | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Transposition and low inversion                     | transpose sets correctly; preserve domain validity; compute defined low inversions                                                                                       | example tests and property tests                         | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Spectral Extension                                  | calculate exact Parspace and Parcspace values; calculate exact cardinality-scaled values                                                                                 | example tests and property tests where useful            | `docs/domain/CORE_JI_DOMAIN.md`                 |
| Tool-specific parsing                               | accept intentionally supported syntax; reject malformed input; produce validated domain values                                                                           | unit tests                                               | documented parser requirements                  |
| Vector mathematics                                  | add, scale, normalize, rotate, and combine vectors correctly                                                                                                             | unit tests and invariants                                | mathematical definitions                        |
| Prime factorization and symbolic lattice addressing | factor valid ratios; ignore powers of 2 where specified; produce deterministic signed prime paths and mode-specific addresses                                            | unit tests and invariants                                | lattice placement specification and ADR 0006    |
| Cubic lattice placement                             | place 3-, 5-, and 7-limit ratios; preserve octave-equivalent placement; reject unsupported higher primes in standard cubic mode                                          | reviewed examples and invariants                         | documented lattice placement rules              |
| Expanded cubic placement                            | produce canonical higher-prime anchor paths; preserve local 3–5–7 coordinates; accumulate deterministic anchor vectors; apply higher-prime radius and rotation correctly | symbolic tests, geometry tests, and invariants           | documented lattice placement rules and ADR 0006 |
| Radial placement                                    | produce canonical generator structure; calculate deterministic prime directions; accumulate generator vectors; apply optional generator height                           | symbolic tests, geometry tests, and invariants           | documented lattice placement rules              |
| Expanded radial placement                           | distinguish upper and lower sides; preserve symbolic identity; apply continuous or aligned lower-side symmetry                                                           | symbolic tests, geometry tests, and invariants           | documented lattice placement rules              |
| Spiral mathematics                                  | convert polar coordinates; calculate radius and angle; preserve inverse relationships                                                                                    | example tests and property tests                         | mathematical definitions                        |
| Spiral SVG drawing                                  | construct paths; draw octave lines; create and remove points and labels; support keyboard interaction                                                                    | DOM tests                                                | documented UI behaviour                         |
| Lattice presentation                                | convert placed ratios into scene points and semantic connections; filter connections by prime                                                                            | unit tests                                               | documented lattice presentation rules           |
| Lattice scene management                            | create and reconcile meshes; update target positions; interpolate movement; update connection endpoints; handle pointer interaction; dispose owned resources             | unit and integration tests with focused Three.js objects | documented scene responsibilities               |
| React tools                                         | accept input; show output and errors; switch modes; coordinate controls and visualizations                                                                               | component and hook tests                                 | user-observable application behaviour           |
| Application workflows                               | use calculator workflows; recover from invalid input; create lattice views; access higher-prime controls                                                                 | Playwright end-to-end tests                              | product requirements                            |
| Selected visual views                               | protect a small number of canonical or responsive visual states when structural tests are insufficient                                                                   | Playwright screenshot comparisons if introduced          | reviewed visual baselines                       |

### 25.1 Testing order

Testing should generally proceed from the lowest deterministic layer outward:

1. shared core-domain values and operations;
2. pure mathematical helpers;
3. symbolic placement and addressing;
4. geometric placement;
5. presentation and rendering adapters;
6. React integration;
7. essential browser workflows;
8. visual-regression cases only when they protect additional value.

This order places the greatest confidence at the lowest deterministic layer and prevents visual inspection from becoming the primary means of validating mathematical behaviour.

Higher-level tests should not duplicate behaviour that is already more precisely protected at a lower layer.

### 25.2 Normative and characterization coverage

Behaviour whose authority is the core-domain specification, an accepted architectural decision, or an approved subsystem specification should receive normative tests.

Characterization tests may be used temporarily when existing behaviour must be understood before it is replaced or formally approved.

Characterization coverage must not be mistaken for approval of the recorded behaviour.

When the relevant behaviour becomes specified, characterization tests should be replaced, promoted to intentional regression tests, or removed as appropriate.

## 26. Definition of done for testing work

A testing-related implementation task is complete when:

- expected behaviour has a documented source
- tests fail before the corresponding defect or missing behaviour is fixed
- tests pass after implementation
- tests assert behaviour rather than merely execution
- domain tests conform to `docs/domain/CORE_JI_DOMAIN.md`
- floating-point comparisons use shared tolerances
- rendering tests do not duplicate mathematical formulas
- test names explain the protected behaviour
- the relevant quality checks pass
- new unresolved behaviour is documented rather than silently encoded

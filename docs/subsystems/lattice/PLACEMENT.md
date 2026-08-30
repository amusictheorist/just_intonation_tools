# Lattice Placement

**Status:** Draft

## 1. Purpose

This document defines the intended placement behaviour of the lattice visualizations in Just Intonation Tools.

It specifies:

- how exact shared JI ratios are prepared for lattice visualization
- how ratios are classified for placement
- how cubic and radial placement are defined
- how higher-prime ratios are represented in expanded cubic placement
- how lower-octave ratios are represented in expanded radial placement
- which parts of placement are exact and symbolic
- which parts belong to floating-point geometry and rendering

This document is authoritative for lattice-specific placement behaviour.

It does not redefine the shared mathematical `Ratio` domain. Exact ratio construction, canonical reduction, equality, and other shared JI behaviour are defined by the [core JI domain specification](../../domain/CORE_JI_DOMAIN.md).

---

## 2. Placement principles

Lattice placement is a visualization of ratio relationships rather than a representation of unrestricted absolute pitch.

Except where explicitly stated otherwise, ratios are interpreted as pitch-class ratios modulo powers of 2 and are represented by an octave-equivalent ratio in the upper octave:

$$
1 \le r < 2.
$$

The lattice therefore treats ratios related by multiplication or division by powers of 2 as belonging to the same pitch class for placement purposes.

Octave normalization is a lattice operation performed over a shared exact `Ratio`. It is not an intrinsic property stored automatically by the shared ratio domain.

Placement behaviour distinguishes between:

1. **exact symbolic placement**, which describes the ratio's lattice identity and relationships, and
2. **geometric placement**, which converts that symbolic information into rendered three-dimensional coordinates.

Floating-point geometry must not determine exact ratio classification or symbolic lattice identity.

A ratio's symbolic placement is derived from its canonical shortest generator path from `1/1`. Cubic and radial visualizations interpret that underlying generator structure in different geometric ways.

---

## 3. Terminology

### 3.1 Upper-octave representative

The **upper-octave representative** of a ratio is its octave-equivalent value in:

$$
[1,2).
$$

Cubic, radial, and expanded cubic placement use this representative.

### 3.2 Lower-octave representative

The **lower-octave representative** of a ratio is its octave-equivalent value in:

$$
[1/2,1).
$$

Lower-octave representatives are used only where a placement mode explicitly supports them.

Expanded radial placement may use a lower-octave representative in order to preserve whether an input ratio lies below `1/1`.

### 3.3 Odd-prime factorization

For lattice placement, powers of 2 are disregarded after octave equivalence has been established.

A ratio may therefore be represented by its signed odd-prime exponents:

$$
r \sim \prod_{p\text{ odd prime}}p^{e_p},
$$

where:

- $e_p>0$ indicates a numerator factor
- $e_p<0$ indicates a denominator factor
- $e_p=0$ is omitted

### 3.4 Generator step

A **generator step** applies one occurrence of an odd-prime factor or its inverse.

For a prime $p$:

- multiplication by $p$ contributes one positive generator step
- division by $p$ contributes one negative generator step

Thus $p^2$ contributes two positive $p$ steps, while $p^{-2}$ contributes two negative $p$ steps.

Powers of 2 do not contribute generator steps because lattice placement treats octave-equivalent ratios as belonging to the same pitch class.

### 3.5 Generator path

A **generator path** is a sequence of signed odd-prime generator steps connecting `1/1` to a ratio's odd-prime factorization.

A shortest generator path uses the minimum number of such steps. For:

$$
r \sim \prod_p p^{e_p},
$$

every shortest generator path contains exactly $|e_p|$ steps for each prime $p$.

Multiple shortest paths may exist because prime multiplication is commutative. Lattice placement therefore uses a **canonical shortest generator path** in which prime generators are processed in ascending prime order, independently of exponent sign.

For example:

$$
11^{-1}13
$$

has the canonical shortest generator path:

$$
[11^{-1},13].
$$

Similarly:

$$
11^2 13^{-1}
$$

has:

$$
[11,11,13^{-1}].
$$

The exponent sign determines the direction of a generator step. It does not change that prime's position in the canonical ordering.

### 3.6 Generator distance

The **generator distance** of a ratio is the length of its shortest generator path from `1/1`.

For:

$$
r \sim \prod_p p^{e_p},
$$

the generator distance is:

$$
D(r)=\sum_p |e_p|.
$$

Generator distance is an exact symbolic property of lattice placement. A visualization may choose whether and how to encode it geometrically.

### 3.7 7-limit ratio

A ratio is **7-limit** for lattice placement when its odd-prime factorization contains no prime greater than $7$.

Its non-zero odd-prime exponents may therefore involve only:

$$
3,\quad 5,\quad 7.
$$

### 3.8 Higher-prime ratio

A ratio is a **higher-prime ratio** when its odd-prime factorization contains at least one prime greater than $7$.

### 3.9 Prime anchor

A **prime anchor** is the placement associated with a prime greater than $7$.

Prime anchors are positioned around the global `1/1` lattice and provide origins for local 3-5-7 lattices.

A negative higher-prime generator step uses the inverse orientation associated with that prime anchor.

### 3.10 Anchor path

An **anchor path** is the higher-prime portion of a ratio's canonical shortest generator path.

It is the ordered sequence of signed higher-prime steps through which expanded cubic placement reaches a local lattice.

For example, a ratio whose higher-prime factors are:

$$
11\cdot13
$$

has the anchor path:

$$
[11,13].
$$

A ratio containing:

$$
11^2\cdot13
$$

has:

$$
[11,11,13].
$$

A ratio containing:

$$
11^{-1}13
$$

has:

$$
[11^{-1},13].
$$

The path represents nested lattice structure rather than merely a collection of prime factors.

---

## 4. Symbolic placement before geometry

Placement should derive an exact symbolic lattice address before calculating rendered XYZ coordinates.

A symbolic expanded-cubic address may be represented conceptually as:

```text
{
  anchorPath: [11, 13],
  coordinates357: [2, -1, 0]
}
```

The exact TypeScript representation is an implementation decision and is not defined by this document.

The symbolic representation serves several purposes:

- it keeps ratio classification independent of floating-point geometry
- it makes placement behaviour directly testable
- it gives ratios a stable lattice identity even if rendering geometry later changes
- it separates musical and mathematical relationships from Three.js scene concerns
- it permits higher-prime placement to be defined recursively

The architectural rationale for this separation is recorded in [ADR 0006: Separate symbolic lattice placement from rendered geometry](../../architecture/decisions/0006-separate-lattice-addressing-from-geometry.md).

---

## 5. Cubic placement

### 5.1 Purpose

Cubic placement represents the 3-, 5-, and 7-prime exponent structure of a ratio as three orthogonal lattice dimensions.

The default mapping is:

$$
3\rightarrow x,\qquad 5\rightarrow y,\qquad 7\rightarrow z.
$$

Future versions may allow users to assign supported prime generators to different axes. Such configurability does not alter the basic cubic placement model.

### 5.2 Accepted ratios

Standard cubic placement accepts only 7-limit ratios.

A ratio involving any odd prime greater than $7$ cannot be placed in the standard cubic lattice.

### 5.3 Octave treatment

Ratios are first represented by their upper-octave equivalent:

$$
1\le r<2.
$$

Powers of 2 do not contribute lattice coordinates.

### 5.4 Coordinates

For a ratio with odd-prime representation:

$$
r\sim3^a5^b7^c,
$$

its cubic lattice coordinate is:

$$
(a,b,c).
$$

Under the default axis assignment:

$$
x=a,\qquad y=b,\qquad z=c.
$$

Positive exponents move in the positive direction of the corresponding axis. Negative exponents move in the negative direction.

These coordinates summarize the 3-, 5-, and 7-prime steps in the ratio's canonical shortest generator path.

### 5.5 Origin

`1/1` is the global origin:

$$
(0,0,0).
$$

### 5.6 Examples

$$
\frac32\sim3
$$

has lattice coordinates:

$$
(1,0,0).
$$

$$
\frac54\sim5
$$

has:

$$
(0,1,0).
$$

$$
\frac74\sim7
$$

has:

$$
(0,0,1).
$$

$$
\frac53\sim3^{-1}5
$$

has:

$$
(-1,1,0).
$$

---

## 6. Radial placement

### 6.1 Purpose

Radial placement maps odd-prime generators to directions arranged around `1/1`.

The horizontal plane represents directional relationships among prime generators.

The vertical dimension may represent a ratio's generator distance or remoteness from `1/1`.

### 6.2 Octave treatment

Standard radial placement uses the upper-octave representative:

$$
1\le r<2.
$$

Powers of 2 do not contribute radial generator steps.

### 6.3 Prime directions

For a positive prime generator with octave-normalized ratio $r\in[1,2)$, its angular position is:

$$
\theta(r)=\log_2(r)\cdot360^\circ.
$$

Equivalently:

$$
\theta(r)=\frac{\ln(r)}{\ln(2)}\cdot360^\circ.
$$

This gives each prime generator a deterministic direction according to its position within the octave.

### 6.4 Generator distance

Radial placement uses the generator distance defined in Section 3.6.

When vertical displacement is enabled, the ratio's height is proportional to:

$$
D(r)=\sum_p |e_p|.
$$

This is the number of odd-prime generator steps in the ratio's shortest path from `1/1`.

### 6.5 Vertical placement

When vertical displacement is enabled, the ratio's height is:

$$
y=D(r)s,
$$

where $s$ is the configured vertical step size.

This vertical displacement has both semantic and visual purposes:

- it encodes an aspect of complexity or remoteness from `1/1` and the prime generators
- it reduces overlap and clutter among related ratios
- it allows connections between ratios on different sides of the radial layout to remain more visible

### 6.6 Flattened view

Radial placement may support a flattened view in which vertical displacement is disabled:

$$
y=0.
$$

Flattening changes only the geometric presentation of the radial lattice. It does not change the ratio's symbolic prime-factor structure, canonical generator path, or horizontal placement.

**Open decision:** whether this should be exposed directly as a user-facing toggle and how that option should be represented in application state.

---

## 7. Expanded cubic placement

### 7.1 Purpose

Expanded cubic placement extends the ordinary cubic lattice to ratios containing primes greater than $7$.

The global lattice remains the 3-5-7 lattice around `1/1`.

Because only three spatial dimensions are available, higher primes do not introduce additional global Cartesian axes.

Instead, each prime greater than $7$ defines a prime anchor around the global lattice.

Each prime anchor acts as the origin of a local 3-5-7 lattice.

### 7.2 Prime-anchor sphere

Every prime greater than $7$ has a unique deterministic placement on an imaginary sphere surrounding the global `1/1` origin.

For a prime $p>7$, let:

$$
\mathbf v_p
$$

denote the vector from the global origin to that prime's anchor.

Prime-anchor placement must be computable on demand for any prime. It must not depend on a fixed list of supported primes, the order in which primes are encountered, or the number of prime anchors currently rendered.

Adding or encountering a new prime must not change the anchor position of any other prime.

The precise spherical distribution algorithm is a geometric concern and remains to be specified separately. It must define an infinite deterministic sequence of distinct anchor positions that remains approximately uniform over the sphere as additional primes are encountered.

The placement must nevertheless satisfy these invariants:

- every prime greater than $7$ has a deterministic anchor position
- distinct primes have distinct anchor positions
- a prime's anchor position is permanent
- anchor placement is independent of encounter order
- anchor placement is independent of the number of anchors currently rendered
- adding a new prime does not reposition any existing prime
- prime-anchor vectors retain a deterministic shared global orientation

### 7.3 Canonical high-prime precedence

When a ratio contains more than one prime greater than $7$, placement must not depend on arbitrary iteration or factorization order.

Expanded cubic placement therefore follows the canonical shortest generator path defined in Section 3.5.

Higher-prime factors are processed in ascending prime order, independently of exponent sign.

The lowest prime greater than $7$ receives precedence as the first prime anchor.

For example:

$$
11\cdot13
$$

uses `11` as its primary anchor rather than `13`.

Likewise:

$$
11^{-1}13
$$

begins with an inverse `11` step before the `13` step.

### 7.4 Higher-prime anchor translation

Additional higher-prime factors translate a ratio from one higher-prime lattice position to another while preserving the global orientation of the prime-anchor vectors.

Conceptually:

$$
\frac11 \rightarrow 11 \rightarrow 11\cdot13
$$

places the `13` step relative to the `11` anchor, but the direction of the `13` step remains the same as the canonical `13` direction from the global origin.

For each prime $p>7$, let:

$$
\mathbf v_p
$$

denote its canonical prime-anchor vector.

If a parent anchor has position:

$$
\mathbf P_{\text{parent}},
$$

then a positive child step for prime $p$ is placed at:

$$
\mathbf P_{\text{child}}
=
\mathbf P_{\text{parent}}
+
\mathbf v_p.
$$

A negative step uses the inverse vector:

$$
\mathbf P_{\text{child}}
=
\mathbf P_{\text{parent}}
-
\mathbf v_p.
$$

Prime-anchor vectors therefore retain the same global orientation at every higher-prime lattice position.

For example, the displacement:

$$
11 \rightarrow 11\cdot13
$$

is equal and parallel to:

$$
1 \rightarrow 13.
$$

Consequently, the points:

$$
1,\quad 11,\quad 13,\quad 11\cdot13
$$

form a parallelogram.

Likewise, the displacement from `11` to `11·17` is equal and parallel to the displacement from `1/1` to `17`.

This translation rule applies recursively through the canonical anchor path without rotating subsequent prime-anchor directions.

### 7.5 Generalization

For a ratio whose higher-prime factorization is:

$$
\prod_{p>7} p^{e_p},
$$

the geometric higher-prime anchor position is:

$$
\mathbf P
=
\sum_{p>7} e_p\mathbf v_p,
$$

where $\mathbf v_p$ is the canonical global anchor vector for prime $p$.

Positive exponents contribute positive multiples of the corresponding anchor vector. Negative exponents contribute negative multiples.

The canonical shortest generator path remains the authoritative symbolic representation of the ratio's higher-prime structure. Its ascending-prime ordering determines anchor precedence and lattice identity, but geometric placement preserves the shared global orientation of all prime-anchor vectors.

Thus:

$$
11^2\cdot13^{-1}
$$

has symbolic anchor path:

$$
[11,11,13^{-1}],
$$

and geometric anchor position:

$$
2\mathbf v_{11}-\mathbf v_{13}.
$$

### 7.6 Repeated prime factors

Each occurrence of a higher-prime factor contributes one generator step and therefore one entry in the anchor path.

Thus:

$$
11^2
$$

produces:

$$
[11,11],
$$

and:

$$
11^2\cdot13
$$

produces:

$$
[11,11,13].
$$

Similarly:

$$
11^{-2}\cdot13
$$

produces:

$$
[11^{-1},11^{-1},13].
$$

Repeated occurrences of the same higher prime extend the same prime axis.

Thus `11`, `11²`, and `11³` lie on a straight line beginning at the global origin and passing through the canonical `11` anchor, with each generator step contributing one additional copy of the `11` anchor vector.

Likewise, negative repeated powers extend the same axis in the inverse direction.

### 7.7 Local 3-5-7 coordinates

Higher-prime factors determine **which local lattice** contains a ratio.

The signed exponents of $3$, $5$, and $7$ determine **where within that lattice** the ratio is placed.

For:

$$
r\sim3^a5^b7^c\prod_{p>7}p^{e_p},
$$

the higher-prime portion of the canonical shortest generator path determines the anchor path, while:

$$
(a,b,c)
$$

defines the ratio's local cubic coordinates.

This yields the general principle:

> Higher primes determine which lattice; the 3-, 5-, and 7-prime exponents determine where within that lattice.

### 7.8 Example symbolic addresses

For:

$$
5\cdot7\cdot11,
$$

the address is conceptually:

```text
anchorPath: [11]
coordinates357: [0, 1, 1]
```

For:

$$
11\cdot13,
$$

the address is:

```text
anchorPath: [11, 13]
coordinates357: [0, 0, 0]
```

For:

$$
3^2\cdot5^{-1}\cdot11\cdot13,
$$

the address is:

```text
anchorPath: [11, 13]
coordinates357: [2, -1, 0]
```

For:

$$
11^{-1}13,
$$

the address is:

```text
anchorPath: [11^-1, 13]
coordinates357: [0, 0, 0]
```

These examples describe symbolic placement only. They do not prescribe the exact TypeScript representation of signed anchor steps.

### 7.9 Negative high-prime exponents

Higher-prime anchor ordering is determined by prime magnitude, not by exponent sign.

A negative exponent contributes one inverse generator step for each occurrence of that prime but does not alter the prime's position in the canonical anchor sequence.

For example:

$$
11^{-1}13
$$

has the canonical high-prime sequence:

$$
[11^{-1},13],
$$

while:

$$
11\,13^{-1}
$$

has:

$$
[11,13^{-1}].
$$

The geometry layer is responsible for interpreting the direction and orientation of each signed anchor step.

---

## 8. Expanded radial placement

### 8.1 Purpose

Expanded radial placement extends radial visualization by allowing ratios received below `1/1` to retain a lower-octave representative instead of always being normalized upward.

Its combined displayed octave range is therefore:

$$
\frac12\le r<2.
$$

Upper- and lower-octave representatives remain octave-equivalent to members of the same pitch class, but their distinct placement allows relationships on both sides of `1/1` to be visualized.

### 8.2 Side-preserving octave normalization

Expanded radial placement preserves which side of `1/1` the received ratio occupies before octave normalization.

For an input ratio $r$:

- if $r\ge1$, use its upper-octave representative in $[1,2)$
- if $r<1$, use its lower-octave representative in $[1/2,1)$

For example:

$$
\frac1{11}\rightarrow\frac8{11},
$$

while:

$$
11\rightarrow\frac{11}{8}.
$$

Powers of 2 still do not contribute generator steps. The odd-prime factorization and canonical generator path therefore remain unchanged by this octave normalization.

### 8.3 Upper and lower regions

Upper-octave representatives occupy the region above the central `1/1` plane.

Lower-octave representatives occupy a corresponding region below it.

Generator distance determines the magnitude of the vertical displacement, with the sign determined by whether the selected representative is in the upper or lower octave.

### 8.4 Lower-octave symmetry

Expanded radial placement supports two geometric symmetry options.

#### Aligned reflection

A lower-octave placement retains the same horizontal position and reverses only its vertical displacement:

$$
(x,y,z)\mapsto(x,-y,z).
$$

This prioritizes vertical alignment between corresponding upper- and lower-octave placements.

#### Continuous reflection

A lower-octave placement is reflected across the central plane and rotated by 180 degrees in the horizontal layout:

$$
(x,y,z)\mapsto(-x,-y,-z).
$$

This prioritizes geometric continuity of generator chains through the central plane.

Continuous reflection is the default expanded-radial symmetry.

Users may select aligned reflection when direct vertical comparison of upper- and lower-octave placements is preferred.

---

## 9. Visualization modes and expansion controls

The current application exposes cubic, radial, expanded cubic, and expanded radial as distinct placement modes.

A possible future model is to expose only two fundamental visualization modes:

- **Cubic**
- **Radial**

with expansion options layered onto them.

Under that model:

- cubic higher-prime anchors could be enabled or disabled
- radial lower-octave placement could be enabled or disabled
- radial vertical displacement could independently be enabled or disabled

This would reflect the conceptual relationship between the modes more directly: expanded behaviour extends an underlying placement model rather than defining an unrelated visualization.

**Open decision:** whether the user-facing and application-state model should adopt two base modes plus capabilities or retain four distinct modes.

This decision should be settled separately from the mathematical placement rules.

---

## 10. Placement invariants

The placement implementation must preserve the following invariants.

### 10.1 Exact ratio identity

Placement classification must operate on exact shared JI ratios.

Floating-point approximations must not determine:

- octave equivalence
- prime factorization
- generator paths or generator distance
- 7-limit classification
- higher-prime anchor paths
- local 3-5-7 coordinates

### 10.2 Determinism

The same exact ratio under the same placement configuration must always produce the same symbolic placement.

### 10.3 Octave equivalence

For modes restricted to the upper octave, ratios differing only by powers of 2 must receive the same symbolic lattice placement.

For expanded radial placement, octave normalization may preserve whether the received ratio lies above or below `1/1`, but powers of 2 still do not contribute to its generator path.

### 10.4 Canonical shortest generator path

Symbolic placement must derive generator steps from the minimum number of odd-prime factors and inverse factors required to reach the ratio from `1/1`.

Where multiple shortest paths exist, the canonical path must order generators by ascending prime value independently of exponent sign.

### 10.5 Cubic coordinate identity

For cubic placement, equal signed exponents of 3, 5, and 7 must produce equal symbolic cubic coordinates.

### 10.6 Canonical anchor ordering

Expanded cubic higher-prime placement must not depend on map iteration, object property order, or incidental factorization order.

Its anchor path must be the higher-prime portion of the canonical shortest generator path.

### 10.7 Geometry separation

Changing sphere radius, spacing, rotation, rendering scale, camera configuration, or other geometric presentation settings must not change a ratio's symbolic generator path, anchor path, or local prime coordinates.

---

## 11. Testing implications

Placement should be developed using test-driven development.

Tests should distinguish between exact symbolic behaviour and geometric behaviour.

### 11.1 Symbolic placement tests

Exact tests should cover:

- upper-octave normalization boundaries
- expanded-radial side-preserving octave normalization
- odd-prime factorization
- generator-step extraction
- generator-distance calculation
- canonical shortest generator paths
- ascending-prime ordering independently of exponent sign
- 7-limit classification
- cubic 3-5-7 coordinates
- rejection of higher-prime ratios by standard cubic placement
- repeated higher-prime factors
- expanded-cubic anchor paths
- negative and inverse higher-prime steps
- local 3-5-7 coordinates within higher-prime lattices

### 11.2 Geometric tests

Focused placement tests should cover:

- deterministic prime-anchor positions
- higher-prime translation preserving canonical global directions
- repeated-prime collinearity
- parallelogram relationships among combined higher-prime anchors
- inverse higher-prime orientation
- expected relative movement along cubic axes
- expected radial prime directions
- vertical generator-distance spacing
- inverse higher-prime orientation
- reciprocal or octave-related symmetry once expanded radial behaviour is settled

Geometric tests should prefer invariant and relationship assertions over fragile snapshots of incidental floating-point values.

### 11.3 Integration tests

Scene and application tests should verify that symbolic placement is correctly converted into rendered points and connections without reimplementing mathematical placement decisions in the UI or scene layer.

---

## 12. Relationship to legacy implementation

The existing lattice implementation is evidence of previous behaviour but is not automatically authoritative for this rebuild.

Legacy behaviour should be preserved only where it agrees with this accepted specification or is deliberately incorporated into it.

Known examples requiring deliberate treatment include:

- the legacy expanded-cubic implementation prefers the highest prime anchor, whereas the intended rule follows the canonical shortest generator path and therefore gives precedence to the lowest higher prime
- repeated occurrences of an anchor prime do not currently receive full recursive geometric treatment
- the legacy expanded-radial symmetry behaviour should be replaced by the configurable symmetry rules defined in this specification
- some existing helpers combine exact ratio classification with geometry preparation

Legacy characterization tests may be useful for behaviour that has already been confirmed as intentional.

They must not freeze unspecified or superseded behaviour.

---

## 13. Open decisions

The following decisions remain unresolved:

1. the infinite deterministic spherical sequence used to assign permanent, approximately uniform anchor positions to primes greater than 7
2. whether cubic and radial should become the only base modes with expansion options
3. whether radial vertical displacement should be exposed as a user-facing toggle
4. whether cubic prime-to-axis assignment should eventually be configurable

The spherical distribution and local-frame twist should be evaluated through an interactive lattice geometry prototype before being made normative.

The remaining visualization-mode and control questions are user-interface and application-state decisions and do not block implementation of the symbolic placement foundation.

---

## 14. Related documentation

See:

- [Core JI Domain](../../domain/CORE_JI_DOMAIN.md)
- [Documentation Conventions](../../DOCUMENTATION_CONVENTIONS.md)
- [Testing Strategy](../../testing/TESTING_STRATEGY.md)
- [ADR 0006: Separate symbolic lattice placement from rendered geometry](../../architecture/decisions/0006-separate-lattice-addressing-from-geometry.md)

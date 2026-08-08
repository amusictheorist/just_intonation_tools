# Core Just Intonation Domain

## 1. Purpose and scope

This document defines the shared mathematical domain for amusictheorist's Just Intonation Tools.

Its purpose is to provide one authoritative description of the concepts, invariants, canonical forms, equivalence relations, and operations used across the calculator, spiral, lattice, and future tools.

The domain is independent of:

- user-interface behaviour
- input formatting
- rendering and placement logic
- tool-specific limits
- persistence or API concerns
- any particular TypeScript implementation strategy

The implementation and test suite should conform to this document. Where legacy implementations disagree with this specification, this specification takes precedence.

The concepts of Parspace, Parcspace, and Spectral Extension used in this document originate in Alexis Millares Thomson's research. This specification adapts those theoretical concepts for use as a shared computational domain.

Other mathematical concepts used here, including rational-number reduction, octave equivalence, greatest common divisors, and least common multiples, are general mathematical operations and are not presented as original contributions.

The shared domain currently includes:

- positive rational ratios
- fraction reduction
- octave equivalence and octave reduction
- partials and parsets
- partial classes and parcsets
- partial space (Parspace)
- partial-class space (Parcspace)
- parset and parcset equivalence
- ratio multiplication
- directed interval ratios
- parset transposition
- low inversion
- harmonic-complexity measures, beginning with Spectral Extension

The domain should remain extensible so that additional harmonic-complexity measures can be added without changing the definitions of ratios, partials, or sets.

## 2. Terminology

### Notation

Partials and parcs are distinguished typographically throughout this document:

- partials are written as ordinary integers, such as $3$
- parcs are underlined, such as $\underline{3}$
- literal parsets are enclosed in curly braces, such as $\lbrace 1, 3, 5 \rbrace$
- parset classes are enclosed in square brackets, such as $[1, 3, 5]_p$
- literal parcsets contain underlined members and are enclosed in curly braces, such as $\lbrace \underline{1}, \underline{3}, \underline{5} \rbrace$
- parcset classes contain underlined members and are enclosed in square brackets, such as $[\underline{1}, \underline{3}, \underline{5}]_{pc}$
- ordered input collections or intermediate sequences are enclosed in angle brackets, such as $\langle 1, 3, 3, 5\rangle$

The underline is semantic: it identifies a value as a partial class rather than a partial. Curly braces identify literal sets. Square brackets identify equivalence classes through their canonical representative.

### Positive integer

A positive integer is a finite integer greater than zero.

Zero, negative numbers, non-integral numbers, `NaN`, and infinite values are not positive integers.

### Ratio

A ratio is an ordered pair of positive integers $(n, d)$, where:

- $n > 0$
- $d > 0$

It represents the rational number $\frac{n}{d}$.

A ratio must always be stored in reduced canonical form.

### Partial

A partial is a positive integer representing a member of the harmonic series.

### Partial set (Parset)

A parset is a non-empty finite set of partials.

A parset:

- contains no duplicate members
- has no semantically meaningful order
- is exposed in ascending order when deterministic output is required

### Partial class

The partial class, or parc, of a partial is the odd positive integer obtained by removing every factor of 2 from the partial.

For a partial $p$:

$$
\mathrm{parc}(p)=\frac{p}{2^{v_2(p)}}
$$

Here, $v_2(p)$ is the exponent of $2$ in the prime factorization of $p$.

Examples:

- $\mathrm{parc}(1)=\underline{1}$
- $\mathrm{parc}(6)=\underline{3}$
- $\mathrm{parc}(12)=\underline{3}$
- $\mathrm{parc}(20)=\underline{5}$

### Partial-class set (parcset)

A parcset is a non-empty finite set of odd positive integers.

The parcset associated with a parset is obtained by converting every partial to its partial class and removing duplicates.

For example:

$$
\lbrace 3, 4, 6, 12, 20 \rbrace
\longrightarrow
\langle\underline{3}, \underline{1}, \underline{3}, \underline{3}, \underline{5}\rangle
\longrightarrow
\lbrace \underline{1}, \underline{3}, \underline{5} \rbrace
$$

### Partial space (Parspace)

Partial space, or Parspace, is the domain of positive integer partials and the parsets formed from them.

Parspace preserves octave and registral distinctions. Partials such as $3$, $6$, and $12$ are therefore distinct members of Parspace, even though they belong to the same partial class.

Parspace is the part of pitch space used by this project to represent pitches as positive integer members of a harmonic series.

### Partial-class space (Parcspace)

Partial-class space, or Parcspace, is the domain of odd positive integer parcs and the parcsets formed from them.

Parcspace identifies partials related by powers of $2$. Thus, $3$, $6$, and $12$ all map to the parc $\underline{3}$.

Parcspace is the part of pitch-class space used by this project to represent octave-equivalent harmonic-series identities.

### Canonical form

A canonical form is the unique normalized representation used when comparing mathematically equivalent values.

Canonicalization does not change the mathematical value or equivalence class of an object.

### Set class and representative

A set class is an equivalence class of parsets or parcsets.

Set classes are written using square brackets. The members shown inside the brackets are the members of the class's canonical representative.

For example:

- $\lbrace 2, 4, 6 \rbrace$ is a literal parset
- $[1, 2, 3]_p$ is the parset class to which $\lbrace 2, 4, 6 \rbrace$ belongs
- $\lbrace \underline{9}, \underline{15}, \underline{21} \rbrace$ is a literal parcset
- $[\underline{3}, \underline{5}, \underline{7}]_{pc}$ is its parcset class

A representative is the canonical literal set used to identify a set class.

### Cardinality

The cardinality of a set is the number of distinct members it contains.

For a set $S$, its cardinality is denoted by $|S|$.

## 3. Domain values

### 3.1 Ratios

A valid ratio has:

- a positive integer numerator
- a positive integer denominator

The ratio is reduced by dividing both terms by their greatest common divisor:

```math
\mathrm{reduce}\left(\frac{n}{d}\right)
=
\frac{n/\gcd(n,d)}{d/\gcd(n,d)}
```

Examples:

$$
\frac{6}{4}\longrightarrow\frac{3}{2}
$$

$$
\frac{15}{10}\longrightarrow\frac{3}{2}
$$

The following are invalid domain ratios:

- $\frac{0}{1}$
- $-\frac{3}{2}$
- $\frac{3}{0}$
- ratios containing non-integral terms

Decimal input and rational approximation are parsing concerns. A decimal must be converted into a valid positive integer ratio before it enters the domain.

### 3.2 Partials

A valid partial is a positive integer.

Examples of valid partials:

- $1$
- $2$
- $3$
- $17$
- $1024$

Examples of invalid partials:

```text
0
-1
1.5
NaN
Infinity
```

The shared domain does not impose a maximum partial. A limit such as $1024$ is tool-specific validation.

### 3.3 Parsets

A parset must:

- contain at least one partial
- contain only valid partials
- contain each member only once

Construction normalizes duplicate input values.

For example:

$$
\langle5, 3, 5, 1\rangle
\longrightarrow
\lbrace 1, 3, 5 \rbrace
$$

An empty collection is not a valid parset.

### 3.4 Parcsets

A parcset must:

- contain at least one value
- contain only positive integers
- contain only odd values
- contain each member only once

For example, $\lbrace \underline{1}, \underline{3}, \underline{5} \rbrace$ is a valid parcset, while $\lbrace \underline{1}, \underline{2}, \underline{3} \rbrace$ is invalid because $\underline{2}$ is not a valid parc.

A parcset derived from a valid parset is always valid.

## 4. Canonicalization and equivalence

### 4.1 Fraction reduction

A ratio is in canonical form when its numerator and denominator share no common divisor greater than $1$.

To reduce a ratio, divide both terms by their greatest common divisor:

```math
\mathrm{reduce}\left(\frac{n}{d}\right)
=
\frac{n/\gcd(n,d)}{d/\gcd(n,d)}
```

Examples:

- $\frac{6}{4}\longrightarrow\frac{3}{2}$
- $\frac{15}{10}\longrightarrow\frac{3}{2}$
- $\frac{7}{5}\longrightarrow\frac{7}{5}$

Reducing a ratio does not change its rational value.

Two ratios are equal when their reduced canonical forms are equal.

For example:

- $\frac{6}{4}$ and $\frac{3}{2}$ represent the same ratio
- $\frac{9}{6}$ and $\frac{3}{2}$ represent the same ratio
- $\frac{3}{2}$ and $\frac{4}{3}$ do not represent the same ratio

### 4.2 Octave equivalence

Two positive ratios are octave-equivalent when one can be obtained from the other by multiplying by an integer power of $2$.

In other words, ratios $r_1$ and $r_2$ are octave-equivalent when:

$$
r_1 = 2^n r_2
$$

for some integer $n$.

Examples of octave-equivalent ratios include:

- $\frac{3}{4}$, $\frac{3}{2}$, and $\frac{3}{1}$
- $\frac{5}{8}$, $\frac{5}{4}$, and $\frac{5}{2}$
- $\frac{1}{1}$, $\frac{2}{1}$, and $\frac{4}{1}$

Octave equivalence is distinct from ordinary ratio equality. For example, $\frac{3}{4}$ and $\frac{3}{2}$ are octave-equivalent, but they are not the same ratio.

### 4.3 Octave reduction

The octave-reduced representative of a positive ratio is the unique octave-equivalent ratio in the half-open interval:

$$
1 \leq r < 2
$$

Examples:

$$
\frac{3}{4}\longrightarrow\frac{3}{2}
$$

$$
\frac{3}{2}\longrightarrow\frac{3}{2}
$$

$$
\frac{3}{1}\longrightarrow\frac{3}{2}
$$

$$
\frac{5}{2}\longrightarrow\frac{5}{4}
$$

$$
\frac{2}{1}\longrightarrow\frac{1}{1}
$$

The lower boundary is included and the upper boundary is excluded. Therefore, any ratio equivalent to $\frac{2}{1}$ reduces to $\frac{1}{1}$.

Octave reduction must return a reduced canonical ratio.

Octave reduction is an explicit operation. Ratios are not automatically octave-reduced when they are created, multiplied, or used to calculate directed intervals.

### 4.4 Parset classes

Two parsets belong to the same parset class when their canonical representatives are equal.

Equivalently, parsets $A$ and $B$ belong to the same parset class when there exist positive integers $m$ and $n$ such that:

$$
mA=nB
$$

where scalar multiplication applies to every member of a parset.

The representative set of a parset class is found by:

1. calculating the greatest common divisor of all members
2. dividing every member by that greatest common divisor

For a parset $S$:

```math
\mathrm{rep}_p(S)
=
\left\{
\frac{s}{\gcd(S)}
\;\middle|\;
s \in S
\right\}
```

Examples:

- $\lbrace 2, 4, 6 \rbrace\longrightarrow\lbrace 1, 2, 3 \rbrace$, so $\lbrace 2, 4, 6 \rbrace\in[1, 2, 3]_p$
- $\lbrace 3, 6, 9 \rbrace\longrightarrow\lbrace1, 2, 3 \rbrace$, so $\lbrace 3, 6, 9 \rbrace\in[1, 2, 3]_p$
- $\lbrace 5, 10, 15 \rbrace\longrightarrow\lbrace 1, 2, 3 \rbrace$, so $\lbrace 5, 10, 15 \rbrace\in[1, 2, 3]_p$
- $\lbrace 4, 6, 10 \rbrace\longrightarrow\lbrace 2, 3, 5 \rbrace$, so $\lbrace 4, 6, 10 \rbrace\in[2, 3, 5]_p$

Therefore, $\lbrace 2, 4, 6 \rbrace$, $\lbrace 3, 6, 9 \rbrace$, and $\lbrace 5, 10, 15 \rbrace$ belong to the parset class $[1, 2, 3]_p$.

The canonical representative of a parset class always has a greatest common divisor of $1$.

Parset equivalence is broader than octave equivalence. The common multiplier may be any positive integer, not only a power of $2$.

### 4.5 Parcset classes

Two parcsets belong to the same parcset class when their canonical representatives are equal.

Equivalently, parcsets $A$ and $B$ belong to the same parcset class when there exist odd positive integers $m$ and $n$ such that:

$$
mA=nB
$$

where scalar multiplication applies to every member of a parcset.

The representative set of a parcset class is found by:

1. calculating the greatest common divisor of all parcset members
2. dividing every member by that greatest common divisor

Because every parc is odd, the greatest common divisor is also odd, and the resulting members remain valid parcs.

Examples:

- $\lbrace \underline{3}, \underline{9}, \underline{15} \rbrace\longrightarrow\lbrace \underline{1}, \underline{3}, \underline{5} \rbrace$, so $\lbrace \underline{3}, \underline{9}, \underline{15} \rbrace\in[\underline{1}, \underline{3}, \underline{5}]_{pc}$
- $\lbrace \underline{5}, \underline{15}, \underline{25} \rbrace\longrightarrow\lbrace \underline{1}, \underline{3}, \underline{5} \rbrace$, so $\lbrace \underline{5}, \underline{15}, \underline{25} \rbrace\in[\underline{1}, \underline{3}, \underline{5}]_{pc}$
- $\lbrace \underline{3}, \underline{5}, \underline{7} \rbrace\longrightarrow\lbrace \underline{3}, \underline{5}, \underline{7} \rbrace$, so $\lbrace \underline{3}, \underline{5}, \underline{7} \rbrace\in[\underline{3}, \underline{5}, \underline{7}]_{pc}$

Therefore, $\lbrace \underline{3}, \underline{9}, \underline{15} \rbrace$ and $\lbrace \underline{5}, \underline{15}, \underline{25} \rbrace$ belong to the parcset class $[\underline{1}, \underline{3}, \underline{5}]_{pc}$.

The canonical representative of a parcset class always has a greatest common divisor of $1$.

### 4.6 Deriving a parcset-class representative from a parset

To derive a parcset-class representative from a parset:

1. convert every partial to its parc
2. remove duplicate parcs
3. calculate the greatest common divisor of the parcset
4. divide every parc by that greatest common divisor

For example:

$$
\lbrace 18, 30, 42 \rbrace
\longrightarrow
\lbrace \underline{9}, \underline{15}, \underline{21} \rbrace
\longrightarrow
\lbrace \underline{3}, \underline{5}, \underline{7} \rbrace
\longrightarrow
[\underline{3}, \underline{5}, \underline{7}]_{pc}
$$

Parset-class reduction and parcset-class reduction are separate operations. A parset should not be reduced to its parset-class representative before its parcset is derived unless the equivalence of the result has been established for the operation being performed.

## 5. Operations

### 5.1 Ratio multiplication

The product of two ratios is found by multiplying their numerators and denominators:

```math
\frac{a}{b}\times\frac{c}{d}
=
\frac{ac}{bd}
```

The result must then be reduced to canonical form.

For example:

```math
\frac{3}{2}\times\frac{5}{4}
=
\frac{15}{8}
```

and:

```math
\frac{6}{5}\times\frac{10}{9}
=
\frac{60}{45}
=
\frac{4}{3}
```

Ratio multiplication does not automatically octave-reduce the result.

### 5.2 Directed interval ratios

The directed interval from ratio $x$ to ratio $y$ is defined as:

```math
\mathrm{interval}(x,y)
=
\frac{y}{x}
```

If:

$$
x=\frac{a}{b}
\qquad\text{and}\qquad
y=\frac{c}{d}
$$

then:

```math
\mathrm{interval}(x,y)
=
\frac{c/d}{a/b}
=
\frac{bc}{ad}
```

The result must be reduced to canonical form.

For example, the directed interval from $\frac{3}{2}$ to $\frac{5}{2}$ is:

```math
\frac{5/2}{3/2}
=
\frac{5}{3}
```

The directed interval from $\frac{5}{2}$ to $\frac{3}{2}$ is:

```math
\frac{3/2}{5/2}
=
\frac{3}{5}
```

Directed intervals may therefore be less than $1$.

Directed interval calculation does not automatically octave-reduce the result. Octave reduction must be requested explicitly.

### 5.3 Partial-to-parc conversion

The parc of a partial is obtained by removing every factor of $2$.

For a partial $p$:

```math
\mathrm{parc}(p)
=
\frac{p}{2^{v_2(p)}}
```

To derive a parcset from a parset:

1. convert every partial to its parc
2. remove duplicate parcs
3. expose the resulting parcset in ascending order when deterministic output is required

For example:

$$
\lbrace 3, 4, 6, 12, 20 \rbrace
\longrightarrow
\langle
\underline{3},
\underline{1},
\underline{3},
\underline{3},
\underline{5}
\rangle
\longrightarrow
\lbrace \underline{1}, \underline{3}, \underline{5} \rbrace
$$

The intermediate collection may contain duplicate values, but the final parcset may not.

### 5.4 Parset and parcset transposition

A parset may be transposed by a positive integer factor $n$.

For a parset $S$:

```math
T_n(S)
=
\lbrace ns \mid s\in S \rbrace
```

The transposition factor must be a positive integer.

Examples:

```math
T_2(\lbrace 1, 3, 5 \rbrace)
=
\lbrace 2, 6, 10 \rbrace
```

```math
T_5(\lbrace 2, 3, 4 \rbrace)
=
\lbrace 10, 15, 20 \rbrace
```

Transposition by $1$ is the identity operation:

$$
T_1(S)=S
$$

Parset transposition preserves cardinality and parset-class membership.

A rational factor that is not an integer is not a valid parset transposition factor because it may produce non-integral values.

A parcset may be transposed by an odd positive integer factor $n$.

For a parcset $P$:

$$
T_n(P)=\lbrace\underline {np} \mid \underline p \in P \rbrace
$$

Because both the transposition factor and every parc are odd positive integers, every resulting member remains a valid parc.

For example:

$$
T_3(\lbrace \underline{1}, \underline{3}, \underline{5} \rbrace)=\lbrace \underline{3}, \underline{9}, \underline{15} \rbrace
$$

Transposition by $1$ is the identity operation:

$$
T_1(P)=P
$$

Parcset transition preserves cardinality and parcset-class membership.

An even factor is not a valid parcset transposition factor because it would produce even values outside Parcspace.

### 5.5 Low inversion

The low inverse of a parset is obtained by dividing the least common multiple of the set by each member.

For a non-empty parset $S$:

```math
I_{\mathrm{low}}(S)
=
\left\{
\frac{\mathrm{lcm}(S)}{s}
\;\middle|\;
s\in S
\right\}
```

For example:

$$
\mathrm{lcm}(\lbrace 2, 3, 5 \rbrace)=30
$$

therefore:

```math
I_{\mathrm{low}}(\{2, 3, 5\})
=
\left\{
\frac{30}{2},
\frac{30}{3},
\frac{30}{5}
\right\}
=
\{6, 10, 15\}
```

The order of the resulting set has no semantic significance.

For a singleton parset:

```math
I_{\mathrm{low}}(\{n\})
=
\{1\}
```

because:

```math
\frac{\mathrm{lcm}(\{n\})}{n}
=
\frac{n}{n}
=
1
```

Low inversion is defined for every valid non-empty parset.

### 5.6 Parset interval ratios

The interval ratio between two partials $a$ and $b$ is the reduced ratio:

$$
\frac{b}{a}
$$

The direction of the interval matters.

For example:

```math
\mathrm{interval}(6,9)
=
\frac{9}{6}
=
\frac{3}{2}
```

while:

```math
\mathrm{interval}(9,6)
=
\frac{6}{9}
=
\frac{2}{3}
```

An interval matrix derived from a parset should therefore preserve direction rather than replacing every interval with its value above $1$.

Octave reduction, where needed by a particular tool, must be applied as a separate operation.

## 6. Harmonic-complexity measures

Harmonic-complexity measures are functions that assign numeric values to ratios, parset classes, parcset classes, or other canonical representations.

The shared domain should support multiple harmonic-complexity measures. _Spectral Extension_ is the first such measure, but it must not be treated as the only possible model.

Harmonic-complexity calculations should therefore remain separate from the fundamental definitions of ratios, partials, parcs, parsets, parcsets, and their equivalence classes.

Unless a measure explicitly states otherwise:

- calculations operate on validated domain values
- calculations operate on the canonical representation specified by the measure
- equivalent inputs produce the same result where required by the measure
- calculations return unrounded values
- rounding and display formatting belong to the presentation layer

### 6.1 _Spectral Extension_ (_SpecExt_)

_Spectral Extension_, abbreviated _SpecExt_, is a sum-based measure of harmonic complexity developed by Alexis Millares Thomson.

It is defined separately in Parspace and Parcspace:

- Parspace _SpecExt_ is written as _SpecExt_<sub>p</sub>
- Parcspace _SpecExt_ is written as _SpecExt_<sub>pc</sub>
- cardinality-scaled Parspace _SpecExt_ is written as #_SpecExt_<sub>p</sub>
- cardinality-scaled Parcspace _SpecExt_ is written as #_SpecExt_<sub>pc</sub>

Both forms operate on the canonical representative of the relevant set class rather than directly on an unreduced literal set.

An implementation may accept a literal parset or parcset as input, but it must first derive the corresponding set class before calculating _SpecExt_.

### 6.2 Parspace _SpecExt_<sub>p</sub>

Let $[S]_p$ be a parset class, and let $\mathrm{rep}_p([S]_p)$ be its canonical representative.

Parspace _SpecExt_<sub>p</sub> is the sum of the partials in that representative:

```math
\mathrm{SpecExt}_p([S]_p)
=
\sum_{s\in\mathrm{rep}_p([S]_p)} s
```

For example:

$$
\lbrace 4, 8, 12 \rbrace
\longrightarrow
\lbrace 1, 2, 3 \rbrace
\longrightarrow
[1, 2, 3]_p
$$

Therefore:

```math
\mathrm{SpecExt}_p([1, 2, 3]_p)
=
1+2+3
=
6
```

The literal parsets $\lbrace 2, 4, 6 \rbrace$, $\lbrace 3, 6, 9 \rbrace$, and $\lbrace 1, 2, 3 \rbrace$ all belong to the same parset class:

$$
\lbrace 2, 4, 6 \rbrace,
\lbrace 3, 6, 9 \rbrace,
\lbrace 1, 2, 3 \rbrace
\in
[1, 2, 3]_p
$$

Consequently:

```math
\mathrm{SpecExt}_p([1, 2, 3]_p)
=
6
```

All parsets in the same parset class have the same _SpecExt_<sub>p</sub>.

### 6.3 Cardinality-scaled Parspace #_SpecExt_<sub>p</sub>

Let:

```math
k
=
\left|
\mathrm{rep}_p([S]_p)
\right|
```

Cardinality-scaled Parspace _SpecExt_, written #_SpecExt_<sub>p</sub>, is:

```math
\#\mathrm{SpecExt}_p([S]_p)
=
\frac{
\mathrm{SpecExt}_p([S]_p)
}{
\frac{k(k+1)}{2}
}
```

The denominator is the sum of the first $k$ positive integers:

```math
1+2+\cdots+k
=
\frac{k(k+1)}{2}
```

This scaling assigns a value of $1$ to the simplest cardinality $k$ parset class:

$$
[1, 2, \ldots, k]_p
$$

For example:

```math
\mathrm{SpecExt}_p([1, 2, 3]_p)
=
1+2+3
=
6
```

and:

```math
\frac{3(3+1)}{2}
=
6
```

Therefore:

```math
\#\mathrm{SpecExt}_p([1, 2, 3]_p)
=
\frac{6}{6}
=
1
```

For the parset class $[1, 3, 5]_p$:

```math
\mathrm{SpecExt}_p([1, 3, 5]_p)
=
1+3+5
=
9
```

Therefore:

```math
\#\mathrm{SpecExt}_p([1, 3, 5]_p)
=
\frac{9}{6}
=
\frac{3}{2}
```

### 6.4 Parcspace _SpecExt_<sub>pc</sub>

Let $`[P]_{pc}`$ be a parcset class, and let $`\mathrm{rep}_{pc}([P]_{pc})`$ be its canonical representative.

Parcspace _SpecExt_<sub>pc</sub> is the sum of the parcs in that representative:

```math
\mathrm{SpecExt}_{pc}([P]_{pc})
=
\sum_{
\underline{p}
\in
\mathrm{rep}_{pc}([P]_{pc})
}
\underline{p}
```

For example:

$$
\lbrace \underline{9}, \underline{15}, \underline{21} \rbrace
\longrightarrow
\lbrace \underline{3}, \underline{5}, \underline{7} \rbrace
\longrightarrow
[\underline{3}, \underline{5}, \underline{7}]_{pc}
$$

Therefore:

```math
\mathrm{SpecExt}_{pc}
\left(
[\underline{3}, \underline{5}, \underline{7}]_{pc}
\right)
=
3+5+7
=
15
```

All parcsets in the same parcset class have the same _SpecExt_<sub>pc</sub>.

### 6.5 Cardinality-scaled Parcspace #_SpecExt_<sub>pc</sub>

Let:

```math
k
=
\left|
\mathrm{rep}_{pc}([P]_{pc})
\right|
```

Cardinality-scaled Parcspace _SpecExt_, written #_SpecExt_<sub>pc</sub>, is:

```math
\#\mathrm{SpecExt}_{pc}([P]_{pc})
=
\frac{
\mathrm{SpecExt}_{pc}([P]_{pc})
}{
k^2
}
```

The denominator is the sum of the first $k$ positive odd integers:

```math
1+3+5+\cdots+(2k-1)
=
k^2
```

This scaling assigns a value of $1$ to the simplest cardinality $k$ parcset class:

$$
[
\underline{1},
\underline{3},
\underline{5},
\ldots,
\underline{2k-1}
]_{pc}
$$

For example:

```math
\mathrm{SpecExt}_{pc}
\left(
[\underline{1}, \underline{3}, \underline{5}]_{pc}
\right)
=
1+3+5
=
9
```

and:

```math
3^2
=
9
```

Therefore:

```math
\#\mathrm{SpecExt}_{pc}
\left(
[\underline{1}, \underline{3}, \underline{5}]_{pc}
\right)
=
\frac{9}{9}
=
1
```

For the parcset class
$[\underline{3}, \underline{5}, \underline{7}]_{pc}$:

```math
\mathrm{SpecExt}_{pc}
\left(
[\underline{3}, \underline{5}, \underline{7}]_{pc}
\right)
=
3+5+7
=
15
```

Therefore:

```math
\#\mathrm{SpecExt}_{pc}
\left(
[\underline{3}, \underline{5}, \underline{7}]_{pc}
\right)
=
\frac{15}{9}
=
\frac{5}{3}
```

### 6.6 Precision and formatting

_SpecExt_ calculations must return their full mathematical result.

The domain layer must not round results to a fixed number of decimal places.

Where a scaled result is rational, an implementation should preserve it as an exact ratio where practical or expose sufficient precision to avoid premature rounding.

A user interface may format a value for display, such as rounding it to two decimal places, without changing the underlying domain result.

## 7. Validation and errors

The shared domain must distinguish between invalid mathematical values and invalid user input.

Core domain constructors and operations enforce mathematical invariants. Input parsers and user-interface adapters handle text, formatting conventions, tool-specific limits, and ordinary validation feedback.

### 7.1 Domain validation

Domain constructors and operations must reject values that violate their mathematical preconditions.

Examples include:

- a ratio with a zero or negative term
- a non-integral partial
- an empty parset or parcset
- an even member of a parcset
- a non-positive or non-integral parset transposition factor

Invalid values must not be stored as valid domain objects.

### 7.2 Domain errors

When a domain constructor or operation receives an invalid value, it should throw a typed domain error.

A domain error should contain:

- a stable error code
- a clear message describing the violated invariant
- any relevant contextual information needed for debugging

Possible error codes include:

```ts
type DomainErrorCode =
  | "INVALID_RATIO"
  | "INVALID_PARTIAL"
  | "EMPTY_PARSET"
  | "INVALID_PARC"
  | "EMPTY_PARCSET"
  | "INVALID_TRANSPOSITION";
```

The exact TypeScript representation is an implementation decision, but error codes should remain stable enough for tests and application adapters to identify them reliably.

Domain error messages should describe mathematical invariants rather than tool-specific instructions.

Examples:

```text
A ratio numerator must be a positive integer.
A parset cannot be empty.
A parc must be an odd positive integer.
A parset transposition factor must be a positive integer.
```

### 7.3 Input parsing

Parsers handle untrusted user input and should not throw errors for ordinary invalid entries.

A parser should return a discriminated result describing either success or failure.

For example:

```ts
type ParseResult<T> =
  | {
      valid: true;
      value: T;
    }
  | {
      valid: false;
      error: string;
    };
```

A parser may:

1. normalize accepted syntax
2. interpret numbers, ratios, separators, or ranges
3. enforce tool-specific limits
4. call the relevant strict domain constructor
5. convert domain errors into user-facing validation messages

For example, a spiral input parser may accept:

```text
1, 3, 5
1 3 5
1-5
```

and may therefore enforce a range of $1$ through $1024$.

Those syntax rules and limits belong to the spiral parser, not to the shared definition of a parset.

### 7.4 Ratio parsing

The core ratio domain accepts only positive integer numerators and denominators.

A ratio parser may additionally accept:

- slash notation, such as `3/2`
- colon notation, such as `3:2`
- positive integers, such as `3`
- positive decimals that can be converted to rational approximations

Before a parsed value enters the domain, it must be converted into a ratio with positive integer terms.

The following concerns belong to parsing rather than to the ratio domain:

- trimming whitespace
- choosing accepted separators
- approximating decimals
- imposing a maximum denominator
- constructing user-facing error messages

### 7.5 Collection normalization

A parset or parcset constructor may accept an iterable collection of numeric values.

Construction must:

1. validate every member
2. remove duplicates
3. arrange members in ascending order for deterministic storage or output
4. reject the collection if any member is invalid
5. reject the collection if it is empty

Invalid members must not be silently discarded by the core domain.

For example, the input:

$$
\langle 1, 3, 3, 5\rangle
$$

may be normalized to the parset:

$$
\lbrace 1, 3, 5 \rbrace
$$

However, the input:

$$
\langle 1, 2.5, 3\rangle
$$

must be rejected rather than silently converted to $\lbrace 1, 3 \rbrace$.

A user-interface parser may choose to ignore malformed tokens, but it must make that behaviour explicit and must not represent the result as though the entire input had been valid.

### 7.6 Tool-specific validation

Individual tools may impose additional restrictions that are not part of the shared mathematical domain.

Examples include:

- a maximum partial of $1024$
- a maximum denominator for decimal approximation
- a maximum number of ratios displayed in a lattice
- restrictions imposed by rendering performance
- accepted separators and range syntax
- minimum or maximum values for visual controls

Tool-specific validation must not be embedded in shared domain constructors unless the restriction is mathematically necessary across all tools.

### 7.7 Programming-language numeric limits

The mathematical domain is defined using positive integers and positive rational numbers.

A TypeScript implementation must also account for the limits of JavaScript numeric representations.

An implementation must not silently accept values whose integer precision cannot be represented reliably.

If ordinary JavaScript `number` values are used, domain constructors should reject integers outside the reliably supported range.

If exact values beyond that range become necessary, the implementation should adopt an exact integer representation such as `bigint` rather than weakening the domain rules.

The chosen numeric representation must be documented in the implementation.

## 8. Required invariants

Validated domain values must remain valid after construction.

Domain objects and collections should therefore be immutable from the perspective of calling code.

### 8.1 Immutability

A ratio, parset, parcset, or set class must not expose mutable internal state that allows callers to violate its invariants after validation.

For example, a caller must not be able to construct the parset:

$$
\lbrace 1, 3, 5 \rbrace
$$

and later mutate it into:

$$
\lbrace 0, 1, 3, 5 \rbrace
$$

without passing through domain validation.

An implementation may enforce immutability through:

- readonly properties
- immutable value objects
- frozen arrays or objects
- private internal collections
- defensive copying
- another documented strategy that prevents invalid mutation

The exact TypeScript mechanism is an implementation decision.

### 8.2 Set semantics and deterministic ordering

Parsets and parcsets are mathematical sets.

Their members have no semantically meaningful order, and equality must not depend on input order.

For example:

```math
\{1, 3, 5\}
=
\{5, 1, 3\}
```

Likewise:

```math
\{\underline{1}, \underline{3}, \underline{5}\}
=
\{\underline{5}, \underline{1}, \underline{3}\}
```

Although order is not mathematically significant, implementations should expose members in ascending order when deterministic output is required.

Deterministic ordering is useful for:

- equality checks
- serialization
- documentation examples
- test expectations
- user-interface rendering
- cache keys
- stable debugging output

Sorting is therefore a representation rule, not part of the mathematical identity of a set.

### 8.3 Duplicate normalization

A mathematical set cannot contain duplicate members.

Construction from an input collection must remove duplicates after all members have been validated.

For example:

$$
\langle5, 3, 5, 1\rangle
\longrightarrow
\lbrace 1, 3, 5 \rbrace
$$

For parc conversion:

$$
\lbrace 3, 6, 12, 20 \rbrace
\longrightarrow
\langle\underline{3}, \underline{3}, \underline{3}, \underline{5}\rangle
\longrightarrow
\lbrace \underline{3}, \underline{5} \rbrace
$$

The intermediate collection may contain repeated converted values, but the resulting parcset may not.

### 8.4 Ratio invariants

Every valid ratio must satisfy all of the following:

- its numerator is a positive integer
- its denominator is a positive integer
- its numerator and denominator are relatively prime
- its denominator is never zero
- its stored value is not automatically octave-reduced unless the value specifically represents an octave-class representative

For a canonical ratio $\frac{n}{d}$:

$$
\gcd(n,d)=1
$$

### 8.5 Parset invariants

Every valid parset must satisfy all of the following:

- it is non-empty
- every member is a positive integer
- no member is duplicated
- member order has no semantic meaning
- deterministic output is ascending

For a parset class $[S]_p$, its canonical representative must additionally satisfy:

$$
\gcd\left(\mathrm{rep}_p([S]_p)\right)=1
$$

### 8.6 Parcset invariants

Every valid parcset must satisfy all of the following:

- it is non-empty
- every member is a positive integer
- every member is odd
- no member is duplicated
- member order has no semantic meaning
- deterministic output is ascending

For a parcset class $[P]_{pc}$, its canonical representative must additionally satisfy:

$$
\gcd\left(\mathrm{rep}_{pc}([P]_{pc})\right)=1
$$

Because all members of a parcset are odd, its greatest common divisor is also odd.

### 8.7 Canonicalization invariants

Canonicalization must be idempotent.

Applying the same canonicalization operation more than once must produce the same result as applying it once.

For ratio reduction:

```math
\mathrm{reduce}
\left(
\mathrm{reduce}\left(\frac{n}{d}\right)
\right)
=
\mathrm{reduce}\left(\frac{n}{d}\right)
```

For octave reduction:

```math
\mathrm{oct}
\left(
\mathrm{oct}(r)
\right)
=
\mathrm{oct}(r)
```

For parset-class reduction:

```math
\mathrm{rep}_p
\left(
[\mathrm{rep}_p([S]_p)]_p
\right)
=
\mathrm{rep}_p([S]_p)
```

For parcset-class reduction:

```math
\mathrm{rep}_{pc}
\left(
[\mathrm{rep}_{pc}([P]_{pc})]_{pc}
\right)
=
\mathrm{rep}_{pc}([P]_{pc})
```

### 8.8 Equivalence invariants

Equivalence relations in the domain must be:

- reflexive
- symmetric
- transitive

For parset equivalence:

- every parset is equivalent to itself
- if parset $A$ is equivalent to parset $B$, then $B$ is equivalent to $A$
- if parset $A$ is equivalent to parset $B$ and $B$ is equivalent to $C$, then $A$ is equivalent to $C$

The same requirements apply to parcset equivalence and octave equivalence.

### 8.9 Operation invariants

Domain operations must preserve the properties stated by their definitions.

Parset transposition by a positive integer must:

- produce a valid parset
- preserve cardinality
- preserve parset-class membership
- satisfy identity under transposition by $1$

For every valid parset $S$:

$$
T_1(S)=S
$$

Parcset transposition by an odd positive integer must:

- produce a valid parcset
- preserve cardinality
- preserve parcset-class membership
- satisfy identity under transposition by $1$

For every valid parcset $P$:

$$
T_1(P)=P
$$

Low inversion must:

- produce a valid parset
- return $\{1\}$ for a singleton
- be independent of input order

Partial-to-parc conversion must:

- produce only odd positive integers
- produce a non-empty parcset from a valid parset
- remove duplicates
- be independent of input order

_SpecExt_ must:

- depend only on the relevant set class
- return the same value for every literal set in that class
- operate on the canonical representative
- remain unrounded in the domain layer

## 9. Worked examples

This section brings several domain operations together in complete examples.

### 9.1 Ratio reduction and octave reduction

Consider the ratio:

$$
\frac{12}{5}
$$

Its numerator and denominator are relatively prime, so it is already in reduced canonical form:

```math
\mathrm{reduce}\left(\frac{12}{5}\right)
=
\frac{12}{5}
```

Because:

$$
\frac{12}{5} \geq 2,
$$

it lies outside the canonical octave interval.

Octave reduction gives:

```math
\mathrm{oct}\left(\frac{12}{5}\right)
=
\frac{6}{5}
```

The ratios $\frac{12}{5}$ and $\frac{6}{5}$ are octave-equivalent, but they are not equal as ratios.

### 9.2 Parset and parset class

Consider the literal parset:

$$
\lbrace 6, 12, 18 \rbrace
$$

Its greatest common divisor is:

$$
\gcd(6,12,18)=6
$$

Dividing each member by $6$ gives the canonical representative:

$$
\lbrace 6,12,18 \rbrace
\longrightarrow
\lbrace 1,2,3 \rbrace
$$

Therefore:

```math
\{6,12,18\}\in[1,2,3]_p
```

The literal parsets $\{1,2,3\}$, $\{2,4,6\}$, and $\{6,12,18\}$ all belong to the parset class $[1,2,3]_p$.

### 9.3 Parset-to-parcset conversion

Consider the literal parset:

$$
\lbrace 3,4,6,12,20 \rbrace
$$

Converting each partial to its parc gives:

$$
\langle
\underline{3},
\underline{1},
\underline{3},
\underline{3},
\underline{5}
\rangle
$$

Removing duplicates and arranging the result in ascending order gives the parcset:

$$
\lbrace
\underline{1},
\underline{3},
\underline{5}
\rbrace
$$

Therefore:

```math
\mathrm{parcset}
\left(
\{3,4,6,12,20\}
\right)
=
\{
\underline{1},
\underline{3},
\underline{5}
\}
```

### 9.4 Parcset and parcset class

Consider the literal parcset:

$$
\lbrace
\underline{9},
\underline{15},
\underline{21}
\rbrace
$$

Its greatest common divisor is:

$$
\gcd(9,15,21)=3
$$

Dividing each member by $3$ gives the canonical representative:

$$
\lbrace
\underline{9},
\underline{15},
\underline{21}
\rbrace
\longrightarrow
\lbrace
\underline{3},
\underline{5},
\underline{7}
\rbrace
$$

Therefore:

$$
\lbrace
\underline{9},
\underline{15},
\underline{21}
\rbrace
\in
[
\underline{3},
\underline{5},
\underline{7}
]_{pc}
$$

### 9.5 Parset transposition

Consider the parset:

$$
S=\lbrace 1,3,5 \rbrace
$$

Transposition by $4$ gives:

```math
T_4(S)
=
\lbrace 4,12,20 \rbrace
```

The original and transposed parsets belong to the same parset class:

$$
\lbrace 1,3,5 \rbrace\in[1,3,5]_p
$$

and:

$$
\lbrace 4,12,20 \rbrace\in[1,3,5]_p
$$

Transposition therefore preserves parset-class membership.

### 9.6 Low inversion

Consider the parset:

$$
S=\lbrace 2,3,5 \rbrace
$$

Its least common multiple is:

$$
\mathrm{lcm}(2,3,5)=30
$$

Its low inverse is:

```math
I_{\mathrm{low}}(S)
=
\left\langle
\frac{30}{2},
\frac{30}{3},
\frac{30}{5}
\right\rangle
=
\{6,10,15\}
```

The result is a valid parset.

For the singleton parset $\{5\}$:

```math
I_{\mathrm{low}}(\{5\})
=
\left\{
\frac{5}{5}
\right\}
=
\{1\}
```

### 9.7 Directed interval

Let:

$$
x=\frac{3}{2}
\qquad\text{and}\qquad
y=\frac{5}{2}
$$

The directed interval from $x$ to $y$ is:

```math
\mathrm{interval}(x,y)
=
\frac{y}{x}
=
\frac{5/2}{3/2}
=
\frac{5}{3}
```

The directed interval from $y$ to $x$ is:

```math
\mathrm{interval}(y,x)
=
\frac{x}{y}
=
\frac{3/2}{5/2}
=
\frac{3}{5}
```

The two directions produce reciprocal ratios.

### 9.8 _SpecExt_<sub>p</sub>

Consider the parset class:

$$
[1,3,5]_p
$$

Its canonical representative is:

$$
\lbrace 1,3,5 \rbrace
$$

Therefore:

```math
\mathrm{SpecExt}_p([1,3,5]_p)
=
1+3+5
=
9
```

The cardinality of the representative is $3$, so:

```math
\#\mathrm{SpecExt}_p([1,3,5]_p)
=
\frac{9}{\frac{3(3+1)}{2}}
=
\frac{9}{6}
=
\frac{3}{2}
```

### 9.9 _SpecExt_<sub>pc</sub>

Consider the parcset class:

$$
[
\underline{3},
\underline{5},
\underline{7}
]_{pc}
$$

Its canonical representative is:

$$
\lbrace
\underline{3},
\underline{5},
\underline{7}
\rbrace
$$

Therefore:

```math
\mathrm{SpecExt}_{pc}
\left(
[
\underline{3},
\underline{5},
\underline{7}
]_{pc}
\right)
=
3+5+7
=
15
```

The cardinality of the representative is $3$, so:

```math
\#\mathrm{SpecExt}_{pc}
\left(
[
\underline{3},
\underline{5},
\underline{7}
]_{pc}
\right)
=
\frac{15}{3^2}
=
\frac{15}{9}
=
\frac{5}{3}
```

## 10. Tool-specific behaviour excluded from the domain

The shared domain defines mathematical values and operations. It does not define how individual tools collect input, display results, arrange graphics, or limit computational work.

The following behaviours are outside the shared domain.

### 10.1 Input syntax

The shared domain does not specify:

- whether values are separated by commas or spaces
- whether ranges such as `1-5` are accepted
- whether ratios may use `/` or `:`
- whether decimal input is accepted
- how whitespace or typographic dashes are normalized
- whether malformed tokens are ignored or reported

These behaviours belong to tool-specific parsers.

### 10.2 Tool-specific numeric limits

The shared domain does not impose:

- a maximum partial
- a maximum ratio numerator or denominator beyond implementation safety requirements
- a maximum denominator for decimal approximation
- a maximum parset or parcset cardinality
- a maximum number of lattice points
- limits based only on rendering performance

For example, the spiral may restrict partial input to values from $1$ through $1024$. That is a spiral input constraint, not a property of Parspace.

### 10.3 Presentation formatting

The shared domain does not specify:

- decimal precision
- display rounding
- colours
- labels
- typography outside the semantic notation defined in this document
- table layout
- ordering of interface panels
- error-message placement
- responsive layout

Domain calculations must retain their underlying values regardless of how a tool formats them.

### 10.4 Visualization and placement

The shared domain does not define:

- spiral coordinates
- lattice coordinates
- point placement
- camera position
- rotation
- zoom
- line connections
- animation
- selection styling
- collision or label-placement behaviour

Visualization code may consume validated domain values but must remain separate from their mathematical definitions.

### 10.5 Persistence and identifiers

The shared domain does not assign:

- database identifiers
- generated interface identifiers
- timestamps
- storage formats
- API payload shapes
- network request behaviour

Identifiers used to track interface or persisted entities are application concerns rather than mathematical properties.

### 10.6 Audio behaviour

The shared domain may provide ratios or partial relationships to an audio system, but it does not define:

- reference frequency
- tuning presets
- waveform
- amplitude
- envelope
- duration
- channel assignment
- playback scheduling

Those decisions belong to future audio-specific modules.

### 10.7 Harmonic-complexity presentation

The shared domain defines the mathematical result of a harmonic-complexity measure.

It does not define:

- how measures are selected in the interface
- how multiple measures are compared
- whether results are displayed as fractions or decimals
- chart types
- ranking or sorting controls
- explanatory text shown to users

These concerns belong to the calculator, future harmonic-complexity tools, or other presentation layers.

## 11. Open questions

The core mathematical behaviour defined in this document is considered sufficiently specified to guide the initial TypeScript implementation and its tests.

Some implementation questions have now been resolved through accepted architectural decisions. The remaining questions do not alter the mathematical definitions in this document.

### 11.1 Numeric representation

Resolved by [ADR 0005](../architecture/decisions/0005-use-bigint-for-exact-ji-domain-values.md).

Shared JI-domain integers use JavaScript `bigint`.

Validated positive integers are represented as branded `bigint` values created through a runtime-validated construction boundary. Shared ratios will use exact positive-integer numerator and denominator terms and will be reduced to canonical form during construction.

JavaScript `number` remains appropriate only at explicit boundaries where floating-point values are required, such as geometry, rendering, or approximate display.

### 11.2 Exact scaled results

Cardinality-scaled harmonic-complexity measures may produce rational results.

The implementation must decide whether these results will be represented as:

- canonical ratio objects
- floating-point numbers
- objects containing both exact and approximate forms

Exact representation is preferred where practical.

### 11.3 Domain-object representation

Partially resolved by [ADR 0005](../architecture/decisions/0005-use-bigint-for-exact-ji-domain-values.md).

Positive integers use a branded primitive type with a public factory function that enforces the runtime invariant.

Ratios will use immutable readonly value objects containing validated positive-integer terms.

The precise representation of larger domain values, including parsets, parcsets, equivalence classes, and harmonic-complexity results, remains open. Their implementations must preserve validation, immutability, exactness where required, and clear domain boundaries.

### 11.4 Error representation

The implementation must determine the precise TypeScript structure of domain errors.

The chosen approach should provide:

- stable error codes
- useful debugging messages
- predictable behaviour for tests
- straightforward conversion into user-facing parser errors

### 11.5 Public API naming

The shared library must establish consistent names for:

- creating ratios
- creating parsets and parcsets
- deriving parset and parcset classes
- accessing canonical representatives
- transposition
- low inversion
- partial-to-parc conversion
- harmonic-complexity calculations

Names should reflect the terminology in this document and avoid preserving unclear legacy names solely for compatibility.

### 11.6 Module organization

The implementation must determine the exact file structure for:

- mathematical primitives
- ratio operations
- Parspace operations
- Parcspace operations
- transformations
- equivalence classes
- harmonic-complexity measures
- parsing adapters

Harmonic-complexity measures should remain extensible and separate from fundamental domain values.

### 11.7 Migration compatibility

The implementation must decide whether temporary adapters are needed for the existing spiral, lattice, and calculator code while duplicated mathematical functions are replaced.

Temporary compatibility code should be clearly identified and removed once all tools use the shared domain.

### 11.8 Further theoretical extensions

Future versions of the domain may define:

- additional harmonic-complexity measures
- harmonic-complexity profiles
- additional operations in Parspace or Parcspace
- relationships between parsets and ratio collections
- tuning systems or presets built on shared ratio values

These additions should extend the current domain without changing the established meanings of ratios, partials, parcs, parsets, parcsets, or their classes.

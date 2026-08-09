import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartial } from "./partial";
import { directedIntervalRatio } from "./directedIntervalRatio";
import { createPartialClass } from "./partialClass";
import {
  partialClassArbitrary,
  positiveOddBigIntArbitrary,
} from "./test/partialClassArbitraries";
import { partialArbitrary } from "./test/partialArbitraries";
import { createUnisonRatio } from "./createUnisonRatio";
import { positiveIntegerArbitrary } from "./test/positiveIntegerArbitraries";

describe("directedIntervalRatio properties", () => {
  it("returns unison from a partial and partial-class to themselves", () => {
    fc.assert(
      fc.property(
        partialArbitrary,
        partialClassArbitrary,
        (partial, partialClass) => {
          expect(directedIntervalRatio(partial, partial)).toEqual(
            createUnisonRatio(),
          );
          expect(directedIntervalRatio(partialClass, partialClass)).toEqual(
            createUnisonRatio(),
          );
        },
      ),
    );
  });

  it("produces reciprocal ratios when direction is reversed", () => {
    fc.assert(
      fc.property(
        partialArbitrary,
        partialArbitrary,
        partialClassArbitrary,
        partialClassArbitrary,
        (leftPartial, rightPartial, leftPartialClass, rightPartialClass) => {
          const forwardPartialInterval = directedIntervalRatio(
            leftPartial,
            rightPartial,
          );
          const backwardPartialInterval = directedIntervalRatio(
            rightPartial,
            leftPartial,
          );
          const forwardPartialClassInterval = directedIntervalRatio(
            leftPartialClass,
            rightPartialClass,
          );
          const backwardPartialClassInterval = directedIntervalRatio(
            rightPartialClass,
            leftPartialClass,
          );

          expect(forwardPartialInterval.numerator).toBe(
            backwardPartialInterval.denominator,
          );
          expect(forwardPartialInterval.denominator).toBe(
            backwardPartialInterval.numerator,
          );
          expect(forwardPartialClassInterval.numerator).toBe(
            backwardPartialClassInterval.denominator,
          );
          expect(forwardPartialClassInterval.denominator).toBe(
            backwardPartialClassInterval.numerator,
          );
        },
      ),
    );
  });

  it("is invariant when both partials are scaled by the same positive factor", () => {
    fc.assert(
      fc.property(
        partialArbitrary,
        partialArbitrary,
        positiveIntegerArbitrary,
        (source, target, scale) => {
          const scaledSource = createPartial(source * scale);
          const scaledTarget = createPartial(target * scale);
          expect(directedIntervalRatio(scaledSource, scaledTarget)).toEqual(
            directedIntervalRatio(source, target),
          );
        },
      ),
    );
  });

  it("is invariant when both partial classes are scaled by the same odd positive factor", () => {
    fc.assert(
      fc.property(
        partialClassArbitrary,
        partialClassArbitrary,
        positiveOddBigIntArbitrary,
        (source, target, scale) => {
          const scaledSource = createPartialClass(source * scale);
          const scaledTarget = createPartialClass(target * scale);
          expect(directedIntervalRatio(scaledSource, scaledTarget)).toEqual(
            directedIntervalRatio(source, target),
          );
        },
      ),
    );
  });
});

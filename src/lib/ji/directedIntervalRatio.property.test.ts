import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { createPartial } from "./partial";
import { directedIntervalRatio } from "./directedIntervalRatio";
import { createRatio } from "./ratio";
import { createPositiveInteger } from "./positiveInteger";
import { createPartialClass } from "./partialClass";

describe("directedIntervalRatio properties", () => {
  it("returns unison from a partial and partial-class to themselves", () => {
    fc.assert(
      fc.property(fc.bigInt({ min: 1n }), (value) => {
        const partial = createPartial(value);
        const partialClass = createPartialClass(value * 2n - 1n);

        expect(directedIntervalRatio(partial, partial)).toEqual(
          createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
        );
        expect(directedIntervalRatio(partialClass, partialClass)).toEqual(
          createRatio(createPositiveInteger(1n), createPositiveInteger(1n)),
        );
      }),
    );
  });

  it("produces reciprocal ratios when direction is reversed", () => {
    fc.assert(
      fc.property(
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (leftValue, rightValue) => {
          const leftPartial = createPartial(leftValue);
          const rightPartial = createPartial(rightValue);
          const leftPartialClass = createPartialClass(leftValue * 2n - 1n);
          const rightPartialClass = createPartialClass(rightValue * 2n - 1n);

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
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (sourceValue, targetValue, scale) => {
          const source = createPartial(sourceValue);
          const target = createPartial(targetValue);

          const scaledSource = createPartial(sourceValue * scale);
          const scaledTarget = createPartial(targetValue * scale);

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
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        fc.bigInt({ min: 1n }),
        (sourceValue, targetValue, scaleSeed) => {
          const source = createPartialClass(sourceValue * 2n - 1n);
          const target = createPartialClass(targetValue * 2n - 1n);
          const scale = scaleSeed * 2n - 1n;

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

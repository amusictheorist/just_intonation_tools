import type { Ratio } from "./ratio";

export function areRatiosEqual(left: Ratio, right: Ratio): boolean {
  return (
    left.numerator === right.numerator && left.denominator === right.denominator
  );
}

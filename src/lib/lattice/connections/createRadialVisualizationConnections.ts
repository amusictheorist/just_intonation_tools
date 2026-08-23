import type { RadialVisualizationVariant } from "../symbolic/createRadialVisualizationVariant";
import type { PrimeExponents } from "../symbolic/primeExponents";
import { createPrimeExponents } from "./createPrimeExponents";
import { createRadialConnections } from "./createRadialConnections";
import type { LatticeConnection } from "./latticeConnection";

export type RadialVisualizationConnectionPoint = Readonly<{
  id: string;
  variant: RadialVisualizationVariant;
}>;

function createRadialConnectionExponents(
  variant: RadialVisualizationVariant,
): PrimeExponents {
  const exponents = createPrimeExponents(variant.address.path);

  if (variant.type === "standard") return exponents;
  if (variant.address.side === "upper") return exponents;

  return new Map([...exponents].map(([prime, exponent]) => [prime, -exponent]));
}

export function createRadialVisualizationConnections(
  points: readonly RadialVisualizationConnectionPoint[],
): readonly LatticeConnection[] {
  return createRadialConnections(
    points.map((point) => ({
      id: point.id,
      exponents: createRadialConnectionExponents(point.variant),
    })),
  );
}

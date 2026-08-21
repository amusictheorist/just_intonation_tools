import type { RadialVisualizationPlacement } from "../symbolic/createRadialVisualizationPlacement";
import { createPrimeExponents } from "./createPrimeExponents";
import { createRadialConnections } from "./createRadialConnections";
import type { LatticeConnection } from "./latticeConnection";

export type RadialVisualizationConnectionPoint = Readonly<{
  id: string;
  placement: RadialVisualizationPlacement;
}>;

function createRadialConnectionExponents(
  placement: RadialVisualizationPlacement,
): ReadonlyMap<bigint, number> {
  const exponents = createPrimeExponents(placement.address.path);

  if (placement.type === "standard") return exponents;
  if (placement.address.side === "upper") return exponents;

  return new Map([...exponents].map(([prime, exponent]) => [prime, -exponent]));
}

export function createRadialVisualizationConnections(
  points: readonly RadialVisualizationConnectionPoint[],
): readonly LatticeConnection[] {
  return createRadialConnections(
    points.map((point) => ({
      id: point.id,
      exponents: createRadialConnectionExponents(point.placement),
    })),
  );
}

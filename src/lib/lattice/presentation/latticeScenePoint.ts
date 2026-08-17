import type { Vector3 } from "../geometry/createRadialDirectionVector";

export type LatticeScenePoint = Readonly<{
  id: string;
  position: Vector3;
}>;

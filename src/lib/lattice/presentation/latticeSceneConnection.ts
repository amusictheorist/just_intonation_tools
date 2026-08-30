import type { Vector3 } from "../geometry/vector";

export type LatticeSceneConnection = Readonly<{
  fromId: string;
  toId: string;
  fromPosition: Vector3;
  toPosition: Vector3;
}>;

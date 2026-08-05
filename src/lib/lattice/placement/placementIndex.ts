import type {
  PlacementControls,
  PlacementMode,
  PlacementResult,
  Ratio,
} from "../types";
import { placeCubic } from "./cubic";
import { placeExpandedCubic } from "./expandedCubic";
import { placeExpandedRadial } from "./expandedRadial";
import { placeRadial } from "./radial";

export const placeRatio = (
  ratio: Ratio,
  mode: PlacementMode,
  controls: PlacementControls = {},
): PlacementResult | null => {
  switch (mode) {
    case "cubic":
      return placeCubic(ratio);

    case "expanded_cubic":
      return placeExpandedCubic(ratio, controls);
    case "radial":
      return placeRadial(ratio);
    case "expanded_radial":
      return placeExpandedRadial(ratio);

    default: {
      const exhaustiveCheck: never = mode;
      return exhaustiveCheck;
    }
  }
};

import type { GridSize } from "../../types/Settings";

export const IMAGE_FADE_OPTIONS = { delay: 0, duration: 200 };

export const LIST_IMAGE_DIMENSIONS = {
  width: 40,
  height: 40,
}

export const GRID_IMAGE_DIMENSIONS: Record<GridSize, any> = {
  0: {},
  1: {
    width: 175,
    height: 175,
    gap: 5,
    infoHeight: 50
  },
  2: {
    width: 110,
    height: 110,
    gap: 5,
    infoHeight: 50
  },
  3: {
    width: 70,
    height: 70,
    gap: 5,
    infoHeight: 50
  }
}
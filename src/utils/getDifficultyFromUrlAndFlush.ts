import { DEFAULT_DIFFICULTY, GRID_SIZE } from "../constant";

export function getDifficultyFromUrlAndFlush(paramName: string): number {
  const diff = new URL(window.location.href).searchParams.get(paramName) ?? -1;

  if (isNaN(Number(diff))) {
    return DEFAULT_DIFFICULTY;
  }

  if (Number(diff) > GRID_SIZE * GRID_SIZE || Number(diff) < 0) {
    return DEFAULT_DIFFICULTY;
  }

  return diff === null ? DEFAULT_DIFFICULTY : Number(diff);
}

import type { Cell, DifficultyOptions } from "@shared/utils/sudoku/helper";

const CONFIG = {
  points_per_cell: 50,
  multipliers: {
    easy: 0.9, // Points projection: 1,600 - 2,025
    medium: 1.2, // Points projection: 2,460 - 2,960
    hard: 1.5, // Points projection: 3,500 - 3,925
    hardcore: 2.0, // Points projection: 5,100 - 5,600
  },
  time_penalty: { value: 100, interval_in_ms: 5 * 60 * 1000 }, // 5min * 60sec * 1000ms
};

export const useScore = () => {
  const calculateScore = (
    puzzle: Cell[][],
    difficulty: DifficultyOptions,
    completionTimeInMs: number,
  ) => {
    // Base points from missing cells (ensures harder puzzles = more points)
    const missingCellsCount = puzzle
      .flat()
      .filter((cell) => cell.isEditable).length;
    const basePoints = missingCellsCount * CONFIG.points_per_cell;

    const penalty =
      Math.floor(completionTimeInMs / CONFIG.time_penalty.interval_in_ms) *
      CONFIG.time_penalty.value;

    const score = basePoints * CONFIG.multipliers[difficulty] - penalty;

    return score;
  };

  return { calculateScore };
};

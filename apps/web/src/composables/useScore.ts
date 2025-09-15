import type { Cell, DifficultyOptions } from "@shared/utils/sudoku/helper";

export const useScore = () => {
  const calculateScore = (
    puzzle: Cell[][],
    difficulty: DifficultyOptions,
    completionTime: number,
  ) => {
    // Base points from missing cells (ensures harder puzzles = more points)
    const missingCells = puzzle.flat().filter((cell) => cell.isEditable).length;
    const basePoints = missingCells * 15; // 15 points per missing cell

    // Difficulty multiplier
    const difficultyMultipliers = {
      easy: 1.0,
      medium: 1.2,
      hard: 1.5,
      hardcore: 2.0,
    };

    // Time bonus (rewards speed)
    const parTimes = {
      easy: 300, // 5 minutes
      medium: 600, // 10 minutes
      hard: 900, // 15 minutes
      hardcore: 1200, // 20 minutes
    };

    const timeMultiplier = Math.max(0.3, parTimes[difficulty] / completionTime);

    return Math.floor(
      basePoints * difficultyMultipliers[difficulty] * timeMultiplier,
    );
  };

  return { calculateScore };
};

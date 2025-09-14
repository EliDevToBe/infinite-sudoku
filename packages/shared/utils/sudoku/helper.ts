import { sha256 } from "../sha256.js";
import { SudokuComplete } from "./generator-v2.js";

export type DifficultyOptions = "easy" | "medium" | "hard" | "hardcore";

export type Cell = {
  x: number;
  y: number;
  value: number;
  isEditable: boolean;
  hypothesis: number[];
};

export const DIFFICULTY_BY_MISSING_CELLS_RANGE = {
  wayTooEasy: [0, 40],
  easy: [41, 45],
  medium: [46, 49],
  advanced: [50, 53],
  hard: [54, 56],
  hardcore: [57, 59],
  diabolicExpert: [60, 64],
} as const;

export const REVAMPED_DIFFICULTY_BY_MISSING_CELLS_RANGE = {
  // wayTooEasy: [0, 40],
  easy: [40, 41, 42, 43, 44, 45], // 6
  medium: [46, 47, 48, 49, 50, 51], // 5
  hard: [52, 53, 54, 55], // 4
  hardcore: [56, 57, 58, 59], // 4
  // diabolicExpert: [60, 64], // 5
};

export const getRangeFromDifficulty = (difficulty: DifficultyOptions) => {
  return REVAMPED_DIFFICULTY_BY_MISSING_CELLS_RANGE[difficulty];
};

export const getDifficultyFromMissingCells = (
  missingCells: number,
): DifficultyOptions => {
  const difficultyWithRange = Object.entries(
    REVAMPED_DIFFICULTY_BY_MISSING_CELLS_RANGE,
  ).find(([_, range]) => range.includes(missingCells)) as [
    DifficultyOptions,
    number[],
  ];

  if (!difficultyWithRange) {
    return "medium";
  }

  return difficultyWithRange[0];
};

export const prepareForDatabase = (
  data: SudokuComplete,
  difficulty: number,
) => {
  return {
    puzzle: data.puzzle,
    solution: data.solution,
    difficulty,
    sha256: sha256(data),
  };
};

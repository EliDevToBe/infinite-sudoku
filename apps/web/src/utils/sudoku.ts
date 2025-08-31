export type Cell = {
  x: number;
  y: number;
  value: number;
  isEditable: boolean;
  hypothesis: number[];
};

export type DifficultyOptions = "easy" | "medium" | "hard" | "hardcore";

const POSSIBLE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const validateInput = (input: string) => {
  if (input === "") return true;
  if (POSSIBLE_VALUES.includes(Number.parseInt(input, 10))) return true;
  return false;
};

export const DIFFICULTY_BY_MISSING_CELLS_RANGE = {
  WayTooEasy: [0, 40],
  Easy: [41, 45],
  Medium: [46, 49],
  Advanced: [50, 53],
  Hard: [54, 56],
  VeryHard: [57, 59],
  DiabolicExpert: [60, 64],
} as const;

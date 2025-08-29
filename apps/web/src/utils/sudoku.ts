const POSSIBLE_VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const validateInput = (input: string) => {
  if (input === "") return true;
  if (POSSIBLE_VALUES.includes(Number.parseInt(input, 10))) return true;
  return false;
};

export type Cell = {
  x: number;
  y: number;
  value: number;
  isEditable: boolean;
  hypothesis: number[];
};

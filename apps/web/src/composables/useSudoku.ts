import type { DifficultyOptions } from "@shared/utils/sudoku/helper";
import type { Cell } from "../utils";
import { useApi } from "./useApi";

export const useSudoku = () => {
  const { fetchApi } = useApi();

  const formatPuzzle = (puzzle: number[][]): Cell[][] => {
    return puzzle.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        x: colIndex,
        y: rowIndex,
        value: cell,
        isEditable: cell === 0,
        hypothesis: [],
      })),
    );
  };

  const parsePuzzle = (puzzle: Cell[][]): number[][] => {
    return puzzle.map((row) => row.map((cell) => cell.value));
  };

  const createEmptyPuzzle = (): Cell[][] => {
    const data = Array.from({ length: 9 }, () =>
      Array.from({ length: 9 }, () => {
        return 0;
      }),
    );
    return formatPuzzle(data);
  };

  const isPuzzleCompleted = (puzzle: Cell[][]): boolean => {
    return puzzle.every((row) => row.every((cell) => cell.value !== 0));
  };

  const isPuzzleSolved = (puzzle: Cell[][], solution: number[][]): boolean => {
    return puzzle.every((row, rowIndex) =>
      row.every(
        (cell, colIndex) => cell.value === solution[rowIndex][colIndex],
      ),
    );
  };

  const getRandomPuzzle = async (difficulty: DifficultyOptions) => {
    const { data, error } = await fetchApi({
      path: "/grid/difficulty/:difficulty",
      method: "GET",
      params: { difficulty },
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data");
    }

    return data;
  };

  return {
    formatPuzzle,
    parsePuzzle,
    getRandomPuzzle,
    createEmptyPuzzle,
    isPuzzleCompleted,
    isPuzzleSolved,
  };
};

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

  return { formatPuzzle, getRandomPuzzle };
};

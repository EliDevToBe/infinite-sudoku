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

  const generatePlaceholderPuzzle = () => {
    return formatPuzzle(
      Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => Math.floor(Math.random() * 9) + 1),
      ),
    );
  };

  const getRandomPuzzle = async () => {
    const { data, error } = await fetchApi({
      path: "/grid/:id",
      method: "GET",
      params: { id: "f4a4b284-84a4-409f-b59e-5836787f7834	" },
    });

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data");
    }

    // return data[Math.floor(Math.random() * data.length)];
    return data;
  };

  return { formatPuzzle, getRandomPuzzle, generatePlaceholderPuzzle };
};

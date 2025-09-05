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

  const getRandomPuzzle = async () => {
    const { data, error } = await fetchApi({
      path: "/grid/:id",
      method: "GET",
      params: { id: "59109878-da5c-4a3b-9a06-0f58b638116a" },
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

  return { formatPuzzle, getRandomPuzzle };
};

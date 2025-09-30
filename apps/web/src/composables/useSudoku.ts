import type { Cell, DifficultyOptions } from "@shared/utils/sudoku/helper";
import { useApi } from "./useApi";
import { useSave } from "./useSave";

export const useSudoku = () => {
  const { fetchApi } = useApi();
  const { hardSave } = useSave();

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

  const hasErrorCells = (puzzle: Cell[][]): Cell[] | null => {
    const cellsToCheck = puzzle.flat().filter((cell) => cell.value !== 0);

    const errorCells = [];

    for (const currentCell of cellsToCheck) {
      const row = puzzle[currentCell.y].filter((c) => c.x !== currentCell.x);

      const col = puzzle
        .map((row) => row[currentCell.x])
        .filter((c) => c.y !== currentCell.y);

      const boxRow = Math.floor(currentCell.y / 3) * 3;
      const boxCol = Math.floor(currentCell.x / 3) * 3;

      const box = puzzle
        .slice(boxRow, boxRow + 3)
        .flatMap((row) => row.slice(boxCol, boxCol + 3))
        .filter((c) => c.x !== currentCell.x && c.y !== currentCell.y);

      const forbiddenValues = new Set(
        [...row, ...col, ...box]
          .map((c) => c.value)
          .filter((value) => value !== 0),
      );

      if (forbiddenValues.has(currentCell.value)) {
        errorCells.push(currentCell);

        const erroredRowCell = row.find((c) => c.value === currentCell.value);
        const erroredColCell = col.find((c) => c.value === currentCell.value);
        const erroredBoxCell = box.find((c) => c.value === currentCell.value);

        if (erroredRowCell) {
          errorCells.push(erroredRowCell);
        }
        if (erroredColCell) {
          errorCells.push(erroredColCell);
        }
        if (erroredBoxCell) {
          errorCells.push(erroredBoxCell);
        }

        return errorCells;
      }
    }
    return null;
  };

  const hintCell = (puzzle: Cell[][]) => {
    const emptyCells = puzzle.flat().filter((cell) => cell.value === 0);
    const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const possibleCells = [];

    for (const cell of emptyCells) {
      const rowCells = puzzle[cell.y];
      const colCells = puzzle.map((row) => row[cell.x]);

      const boxRow = Math.floor(cell.y / 3) * 3;
      const boxCol = Math.floor(cell.x / 3) * 3;
      const boxCells = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          boxCells.push(puzzle[boxRow + i][boxCol + j]);
        }
      }

      const forbiddenValues = new Set(
        [...rowCells, ...colCells, ...boxCells]
          .filter((cell) => cell.value !== 0)
          .map((cell) => cell.value),
      );

      const cellCandidates = possibleValues.filter(
        (value) => !forbiddenValues.has(value),
      );

      if (cellCandidates.length === 1) {
        possibleCells.push({ ...cell, value: cellCandidates[0] });
      }
    }

    return possibleCells;
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

  const insertVictory = async (score: number) => {
    const recordId = await hardSave();
    if (!recordId) {
      throw new Error("No record ID");
    }

    const { data, error } = await fetchApi({
      path: "/user-grid/:id",
      method: "PUT",
      params: { id: recordId },
      body: {
        finished_at: new Date().toISOString(),
        backup_wip: null,
        score,
      },
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
    insertVictory,
    hintCell,
    hasErrorCells,
  };
};

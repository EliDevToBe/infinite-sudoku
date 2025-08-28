type Cell = {
  x: number;
  y: number;
  value: number;
};

export const useSudoku = () => {
  const formatPuzzle = (puzzle: number[][]): Cell[][] => {
    return puzzle.map((row, rowIndex) =>
      row.map((cell, colIndex) => ({
        x: colIndex,
        y: rowIndex,
        value: cell,
      })),
    );
  };

  return { formatPuzzle };
};

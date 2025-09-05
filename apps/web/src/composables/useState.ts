import { useStorage } from "@vueuse/core";
import { ref } from "vue";
import type { Cell, DifficultyOptions } from "@/utils";

type SudokuSave = Partial<Record<DifficultyOptions, Cell[][]>>;

const selectedCell = ref<Cell | null>(null);
const sudokuSave = useStorage<SudokuSave>("infinite-sudoku-save", {});

export const useState = () => {
  const setSelectedCell = (cell: Cell | null) => {
    selectedCell.value = cell ? { ...cell } : null;
  };

  const getSelectedCell = () => {
    return selectedCell.value;
  };

  const setSudokuSave = (difficulty: DifficultyOptions, save: Cell[][]) => {
    if (sudokuSave.value) {
      sudokuSave.value[difficulty] = save;
    }
  };

  const getSudokuSave = (difficulty: DifficultyOptions) => {
    return sudokuSave.value[difficulty] || null;
  };

  const hasSudokuSave = (difficulty: DifficultyOptions) => {
    return !!sudokuSave.value[difficulty];
  };

  return {
    getSelectedCell,
    setSelectedCell,
    getSudokuSave,
    setSudokuSave,
    hasSudokuSave,
  };
};

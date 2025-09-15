import type { DifficultyOptions } from "@shared/utils/sudoku/helper";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";
import type { Cell } from "@/utils";

type Save = { value: Cell[][]; id: string };
type SudokuSave = Partial<Record<DifficultyOptions, Save>>;

const selectedCell = ref<Cell | null>(null);

const sudokuSave = useStorage<SudokuSave>("infinite-sudoku-save", {});
const currentSudokuSave = ref<Save | null>(null);

export const useState = () => {
  const setSelectedCell = (cell: Cell | null) => {
    selectedCell.value = cell ? { ...cell } : null;
  };

  const getSelectedCell = () => {
    return selectedCell.value;
  };

  const setSudokuSave = (difficulty: DifficultyOptions, save: Save) => {
    if (!sudokuSave.value) return;

    sudokuSave.value[difficulty] = save;
    currentSudokuSave.value = save;
  };

  const updateSudokuSave = (difficulty: DifficultyOptions, save: Cell[][]) => {
    if (!sudokuSave.value) return;

    sudokuSave.value[difficulty] = {
      value: save,
      id: currentSudokuSave.value?.id ?? "",
    };
    currentSudokuSave.value = {
      value: save,
      id: currentSudokuSave.value?.id ?? "",
    };
  };

  const getSudokuSave = (difficulty: DifficultyOptions) => {
    if (!sudokuSave.value[difficulty]) return null;

    currentSudokuSave.value = sudokuSave.value[difficulty];

    return sudokuSave.value[difficulty];
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
    currentSudokuSave,
    updateSudokuSave,
  };
};

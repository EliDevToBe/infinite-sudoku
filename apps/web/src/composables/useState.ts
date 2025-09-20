import type { Cell, DifficultyOptions } from "@shared/utils/sudoku/helper";
import { useStorage } from "@vueuse/core";
import { ref } from "vue";
import { useTimer } from "./useTimer";

type Save = { value: Cell[][]; id: string; time: number };
type SudokuSave = Partial<Record<DifficultyOptions, Save>>;

const selectedCell = ref<Cell | null>(null);

const sudokuSave = useStorage<SudokuSave>("infinite-sudoku-save", {});
const currentSudokuSave = ref<Save | null>(null);

export const useState = () => {
  const { setTotalElapsedTime } = useTimer();

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
    setTotalElapsedTime(save.time);
  };

  const updateSudokuSave = async (
    difficulty: DifficultyOptions,
    save: Partial<Save>,
  ) => {
    if (!sudokuSave.value) return;

    sudokuSave.value[difficulty] = {
      value: save.value ?? currentSudokuSave.value?.value ?? [],
      id: currentSudokuSave.value?.id ?? "",
      time: save.time ?? currentSudokuSave.value?.time ?? 0,
    };
    currentSudokuSave.value = {
      value: save.value ?? currentSudokuSave.value?.value ?? [],
      id: currentSudokuSave.value?.id ?? "",
      time: save.time ?? currentSudokuSave.value?.time ?? 0,
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

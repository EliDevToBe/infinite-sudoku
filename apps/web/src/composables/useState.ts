import { ref } from "vue";
import type { Cell } from "@/utils";

const selectedCell = ref<Cell | null>(null);

export const useState = () => {
  const setSelectedCell = (cell: Cell | null) => {
    selectedCell.value = { ...cell } as Cell;
  };

  const getSelectedCell = () => {
    return selectedCell.value;
  };

  return { getSelectedCell, setSelectedCell };
};

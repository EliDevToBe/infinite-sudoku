import { ref } from "vue";

const selectedCell = ref<{ x: number; y: number } | null>(null);

export const useState = () => {
  const setSelectedCell = (cell: { x: number; y: number } | null) => {
    selectedCell.value = cell;
  };

  const getSelectedCell = () => {
    return selectedCell.value;
  };

  return { getSelectedCell, setSelectedCell };
};

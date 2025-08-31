import { ref } from "vue";
import type { Cell } from "@/utils";

type Move = { prev: Cell; next: Cell };

const historyMoveStack = ref<Move[]>([]);
const previousMoveStack = ref<Cell[]>([]);

export const useMoveStack = () => {
  const getMoveStack = () => {
    return {
      previousMoveStack: previousMoveStack.value,
      historyMoveStack: historyMoveStack.value,
    };
  };

  const pushMove = (prev: Cell, next: Cell) => {
    historyMoveStack.value.push({ prev: { ...prev }, next: { ...next } });
    previousMoveStack.value.push({ ...prev });
  };

  const undoMove = () => {
    return previousMoveStack.value.pop();
  };

  const redoMove = () => {
    const previousIndex = previousMoveStack.value.length
      ? previousMoveStack.value.length
      : 0;

    const move = historyMoveStack.value[previousIndex];

    if (!move) return;
    const { prev, next } = move;

    console.log(prev);

    previousMoveStack.value.push(prev);
    return next;
  };

  return { pushMove, getMoveStack, undoMove, redoMove };
};

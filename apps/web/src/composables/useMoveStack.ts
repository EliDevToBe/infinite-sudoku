import { ref } from "vue";
import type { Cell } from "@/utils";

type Move = { prev: Cell; next: Cell };

const moveStack = ref<Move[]>([]);

export const useMoveStack = () => {
  const getMoveStack = () => {
    return moveStack.value;
  };

  const pushMove = (prev: Cell, next: Cell) => {
    moveStack.value.push({ prev: { ...prev }, next: { ...next } });
  };

  const popMove = () => {
    moveStack.value.pop();
  };

  return { pushMove, getMoveStack, popMove };
};

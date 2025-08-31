import { ref } from "vue";
import type { Cell } from "@/utils";

type Move = { prev: Cell; next: Cell };

/**
 * Stack containing the complete history of moves (prev -> next transitions)
 */
const historyMoveStack = ref<Move[]>([]);
const previousMoveStack = ref<Cell[]>([]);

/**
 * Composable for managing undo/redo functionality in Sudoku game
 *
 * This composable maintains two stacks:
 * - historyMoveStack: Complete move history with before/after states
 * - previousMoveStack: Previous cell states for undo operations
 *
 */
export const useMoveStack = () => {
  const getMoveStack = () => {
    return {
      previousMoveStack: previousMoveStack.value,
      historyMoveStack: historyMoveStack.value,
    };
  };

  /**
   * Pushes a new move to the stack
   *
   * Handles branching logic: if user makes a new move after undoing,
   * it truncates the history stack to maintain consistency
   *
   * @param prev - The cell state before the move
   * @param next - The cell state after the move
   */
  const pushMove = (prev: Cell, next: Cell) => {
    // Check if we're in a branched state (user made move after undo)
    if (historyMoveStack.value.length !== previousMoveStack.value.length) {
      const history = historyMoveStack.value[previousMoveStack.value.length];

      // If the next move differs from history, truncate the history
      if (history && history.next.value !== next.value) {
        historyMoveStack.value = historyMoveStack.value.slice(
          0,
          previousMoveStack.value.length,
        );
      }
    }

    historyMoveStack.value.push({ prev: { ...prev }, next: { ...next } });
    previousMoveStack.value.push({ ...prev });
  };

  const undoMove = () => {
    return previousMoveStack.value.pop();
  };

  /**
   * Redoes a previously undone move
   *
   * Uses the history stack to find the next state that should be applied
   * when redoing a move
   *
   * @returns The next cell state to apply, or undefined if no moves to redo
   */
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

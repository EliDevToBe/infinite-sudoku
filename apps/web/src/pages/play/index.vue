<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex items-center justify-center">
        <OptionBar
          v-model="currentDifficulty"
          @on-select="handleDifficultySwitch"
        />
      </div>
    </template>
    <MainContent class="gap-5">
      <SudokuGrid
        v-if="isPuzzleFetched"
        v-model="puzzle"
        :is-loading="isLoading"
      ></SudokuGrid>

      <ConfirmModal
        description="Confirm switching difficulties"
        v-model:show="isModalOpen"
        @on-secondary-action="handleCancel"
        @on-main-action="handleConfirm"
      >
        <span class="inline-block">
          Switching difficulty from
          <span class="font-bold text-green-500 text-lg">{{
            oldDifficulty
          }}</span>
          to
          <span class="font-bold text-dTheme-accent text-lg">{{
            currentDifficulty
          }}</span>
          will reset your current grid.
        </span>
        <span class="inline-block">You will lose your progress.</span>
      </ConfirmModal>

      <ActionBar
        @on-undo="handleUndo"
        @on-eraser="eraseCell"
        @on-redo="handleRedo"
      ></ActionBar>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { MainWrapper, OptionBar } from "@/components";
import { type Cell, type DifficultyOptions } from "@/utils";
import { useSudoku, usePresetToast, useMoveStack } from "@/composables";

const { getRandomPuzzle, formatPuzzle } = useSudoku();
const { toastError } = usePresetToast();
const { pushMove, undoMove, redoMove } = useMoveStack();

const isLoading = ref(false);
const isPuzzleFetched = ref(false);
const isModalOpen = ref(false);

const oldDifficulty = ref<DifficultyOptions>("medium");
const currentDifficulty = ref<DifficultyOptions>("medium");
const puzzle = ref<Cell[][]>([]);

const hasUserInput = computed(() => {
  return puzzle.value.some((row) =>
    row.some((cell) => cell.isEditable && cell.value !== 0)
  );
});

onMounted(async () => {
  try {
    await setPuzzle();
    isPuzzleFetched.value = true;
  } catch (error) {
    toastError(error, {
      title: "Oops 😱",
      description: "An error occurred loading the page",
    });
  }
});

const setPuzzle = async () => {
  const data = await getRandomPuzzle();
  puzzle.value = formatPuzzle(data.puzzle as number[][]);
};

const handleDifficultySwitch = () => {
  if (hasUserInput.value) {
    isModalOpen.value = true;
  } else {
    handleConfirm();
  }
};

const handleConfirm = () => {
  isModalOpen.value = false;
  isLoading.value = true;

  setTimeout(async () => {
    await setPuzzle();
    isLoading.value = false;
    oldDifficulty.value = currentDifficulty.value;
  }, 300);
};

const handleCancel = () => {
  setTimeout(() => {
    isLoading.value = false;
    currentDifficulty.value = oldDifficulty.value;
  }, 100);
};

const eraseCell = (event: { x: number; y: number }) => {
  pushMove(puzzle.value[event.y][event.x], {
    ...puzzle.value[event.y][event.x],
    value: 0,
  });
  puzzle.value[event.y][event.x].value = 0;
};

const handleUndo = () => {
  const move = undoMove();
  if (!move) return;

  puzzle.value[move.y][move.x].value = move.value;
};

const handleRedo = () => {
  const move = redoMove();
  if (!move) return;

  puzzle.value[move.y][move.x].value = move.value;
};
</script>

<style scoped lang=""></style>

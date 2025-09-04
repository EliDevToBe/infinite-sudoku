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
    <MainContent class="gap-3">
      <SudokuGrid
        v-if="isPuzzleFetched"
        v-model="puzzle"
        :is-loading="isLoading"
      ></SudokuGrid>

      <LazyActionModal
        title="Are you sure ?"
        description="Confirm switching difficulties"
        v-model:show="showPreventDifficultyModal"
        secondary-action-label="Cancel"
        main-action-label="Got it"
        @on-secondary-action="cancelDifficultySwitch"
        @on-main-action="switchDifficulty"
      >
        <DifficultyModalBody
          :old-difficulty="oldDifficulty"
          :current-difficulty="currentDifficulty"
        />
      </LazyActionModal>

      <div class="flex flex-col items-center h-17 sm:h-21">
        <ActionBar
          @on-undo="handleUndo"
          @on-eraser="eraseCell"
          @on-redo="handleRedo"
          @on-note="toastInfo({ description: 'Note mode coming soon 🥳' })"
          class="rounded-b-none"
        ></ActionBar>

        <NumberBar @on-select="setNumber"></NumberBar>
      </div>

      <FeatureArea
        class="mt-1"
        @on-leaderboard="handleLeaderboard"
        @on-save="handleSave"
      ></FeatureArea>

      <LazyActionModal
        :title="actionModalProps.title"
        :description="actionModalProps.description"
        v-model:show="showUnauthenticatedModal"
        :main-action-label="actionModalProps.mainActionLabel"
        @on-main-action="actionModalProps.mainFunction"
        :secondary-action-label="actionModalProps.secondaryActionLabel"
        @on-secondary-action="actionModalProps.secondaryFunction"
        special-main-action
      >
        <UnlockFeatureModalBody
          v-if="!showSubscribeModalBody"
          :context="subscribeModalContext"
          @on-click-login="console.log('CHANGE MODEL BODY INTO A LOGIN')"
        />

        <SubscribeModalBody v-else />
      </LazyActionModal>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { LazyActionModal } from "@/components";
import { type Cell, type DifficultyOptions } from "@/utils";
import {
  useSudoku,
  usePresetToast,
  useMoveStack,
  useState,
  useAuth,
} from "@/composables";

const { getRandomPuzzle, formatPuzzle } = useSudoku();
const { toastError, toastInfo } = usePresetToast();
const { pushMove, undoMove, redoMove, resetMoveStacks } = useMoveStack();
const { setSelectedCell, getSelectedCell } = useState();
const { isAuthenticated } = useAuth();

const isLoading = ref(false);
const isPuzzleFetched = ref(false);
const showPreventDifficultyModal = ref(false);
const showUnauthenticatedModal = ref(false);
const showSubscribeModalBody = ref(false);

const oldDifficulty = ref<DifficultyOptions>("medium");
const currentDifficulty = ref<DifficultyOptions>("medium");
const puzzle = ref<Cell[][]>([]);
const subscribeModalContext = ref<"leaderboard" | "save">();

const hasUserInput = computed(() => {
  return puzzle.value.some((row) =>
    row.some((cell) => cell.isEditable && cell.value !== 0)
  );
});

const actionModalProps = computed(() => {
  const normal = !showSubscribeModalBody.value;

  if (normal) {
    // Normal modal props
    return {
      title: "✨ Unlock all features ! ✨",
      description: "Register to unlock exclusive features",
      mainActionLabel: "I want it !",
      secondaryActionLabel: "Cancel",
      mainFunction: () => {
        showSubscribeModalBody.value = true;
      },
      secondaryFunction: closeUnauthenticatedModal,
    };
  }

  // Subscribe modal props
  return {
    title: "✨ Subscribe ✨",
    description: "and ",
    mainActionLabel: "Register",
    secondaryActionLabel: "Cancel",
    mainFunction: () => {
      showSubscribeModalBody.value = false;
    },
    secondaryFunction: closeUnauthenticatedModal,
  };
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
    showPreventDifficultyModal.value = true;
  } else {
    switchDifficulty();
  }
};

const switchDifficulty = () => {
  showPreventDifficultyModal.value = false;
  isLoading.value = true;
  resetMoveStacks();
  setSelectedCell(null);

  setTimeout(async () => {
    await setPuzzle();
    isLoading.value = false;
    oldDifficulty.value = currentDifficulty.value;
  }, 300);
};

const cancelDifficultySwitch = () => {
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
  setSelectedCell(null);
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

const setNumber = (number: number) => {
  const selectedCell = getSelectedCell();
  if (!selectedCell) return;

  pushMove(selectedCell, { ...selectedCell, value: number });

  puzzle.value[selectedCell.y][selectedCell.x].value = number;
  setSelectedCell(puzzle.value[selectedCell.y][selectedCell.x]);
};

const handleLeaderboard = () => {
  if (!isAuthenticated.value) {
    subscribeModalContext.value = "leaderboard";
    showUnauthenticatedModal.value = true;
    return;
  }

  console.log("SHOW LEADERBOARD");
};

const handleSave = () => {
  if (!isAuthenticated.value) {
    subscribeModalContext.value = "save";
    showUnauthenticatedModal.value = true;
    return;
  }

  console.log("SAVE ACTION");
};

const closeUnauthenticatedModal = () => {
  showUnauthenticatedModal.value = false;

  // Due to the modal animation
  setTimeout(() => {
    showSubscribeModalBody.value = false;
  }, 300);
};
</script>

<style scoped lang=""></style>

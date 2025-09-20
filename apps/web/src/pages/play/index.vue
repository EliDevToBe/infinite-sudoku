<template>
  <MainWrapper>
    <template #sub-header>
      <div class="mt-4 flex justify-center sm:h-13 h-11">
        <OptionBar
          v-model="currentDifficulty"
          @on-select="handleDifficultySwitchDebounced"
        />
      </div>
    </template>
    <MainContent class="gap-3 relative">
      <LazyTimer :difficulty="currentDifficulty" :grid="puzzle" />
      <SudokuGrid
        :is-initializing="!isPuzzleFetched"
        v-model="puzzle"
        :is-loading="isLoading"
        :difficulty="currentDifficulty"
        @on-puzzle-completed="handleCompletion"
      ></SudokuGrid>

      <LazyActionModal
        v-if="!isAuthenticated"
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
          @on-new-sudoku="
            hasUserInput ? (showNewSudokuModal = true) : resetSudoku()
          "
        ></ActionBar>

        <LazyActionModal
          title="Get a new sudoku ?"
          description="Confirm resetting your sudoku"
          v-model:show="showNewSudokuModal"
          main-action-label="Got it"
          @on-main-action="resetSudoku"
          @on-secondary-action="showNewSudokuModal = false"
          secondary-action-label="Cancel"
        >
          <div class="flex flex-col gap-2">
            <span class="inline-block">
              The new sudoku will <span class="text-red-500">erase</span> your
              current progress.
            </span>
            <span class="inline-block">Continue ?</span>
          </div>
        </LazyActionModal>

        <NumberBar @on-select="setNumber"></NumberBar>
      </div>

      <FeatureArea
        :has-user-input="hasUserInput"
        :is-saving="isSaving"
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
        :is-main-action-loading="isButtonLoading"
      >
        <UnlockFeatureModalBody
          v-if="!showFormModalBody"
          :context="subscribeModalContext"
          @on-click-login="
            () => {
              isRegisterMode = false;
              showFormModalBody = true;
            }
          "
        />

        <div v-else :class="ui.fromWrapper">
          <LoginRegisterForm
            ref="LoginRegisterFormRef"
            v-model:form="form"
            :mode-register="isRegisterMode"
            :is-form-locked="isButtonLoading"
            v-model:has-error="hasFormError"
            :hide-register-link="!isRegisterMode"
          />
        </div>
      </LazyActionModal>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, useTemplateRef, watch } from "vue";
import { LazyActionModal, LazyTimer } from "@/components";
import LoginRegisterForm from "@/components/LoginRegisterForm.vue";
import type { DifficultyOptions, Cell } from "@shared/utils/sudoku/helper";
import {
  useSudoku,
  usePresetToast,
  useMoveStack,
  useState,
  useAuth,
  useUser,
  useSave,
  Logger,
} from "@/composables";
import { normalize } from "@/utils";
import { isFrontError, throwFrontError } from "@/utils/error";
import { useDebounceFn } from "@vueuse/core";
import { useTimer } from "@/composables";

const { getRandomPuzzle, formatPuzzle, createEmptyPuzzle } = useSudoku();
const { toastError, toastInfo, toastSuccess } = usePresetToast();
const { pushMove, undoMove, redoMove, resetMoveStacks } = useMoveStack();
const {
  setSelectedCell,
  getSelectedCell,
  setSudokuSave,
  getSudokuSave,
  updateSudokuSave,
} = useState();
const {
  hardSave,
  loadHardSave,
  checkAndDeleteHardSave,
  checkHardSavesToLocal,
} = useSave();
const { isAuthenticated, register, login } = useAuth();
const { currentUser } = useUser();
const { startTimer, resetTimer } = useTimer();

const isLoading = ref(false);
const isPuzzleFetched = ref(false);
const showPreventDifficultyModal = ref(false);
const showUnauthenticatedModal = ref(false);
const showFormModalBody = ref(false);
const showNewSudokuModal = ref(false);
const hasFormError = ref(false);
const isButtonLoading = ref(false);
const isRegisterMode = ref(true);
const isSaving = ref(false);

const oldDifficulty = ref<DifficultyOptions>("medium");
const currentDifficulty = ref<DifficultyOptions>("medium");
const puzzle = ref<Cell[][]>(createEmptyPuzzle());
const subscribeModalContext = ref<"leaderboard" | "save">();

const loginRegisterFormRef = useTemplateRef<
  InstanceType<typeof LoginRegisterForm>
>("LoginRegisterFormRef");

const ui = computed(() => ({
  fromWrapper: [
    "flex place-self-center max-sm:w-45 sm:w-full",
    isRegisterMode.value ? "h-75" : "h-45",
  ],
}));

const form = ref({
  email: "",
  password: "",
  pseudo: "",
  confirmPassword: "",
});

const hasUserInput = computed(() => {
  return puzzle.value.some((row: Cell[]) =>
    row.some((cell: Cell) => cell.isEditable && cell.value !== 0)
  );
});

const actionModalProps = computed(() => {
  const normal = !showFormModalBody.value;

  if (normal) {
    // Normal modal props
    return {
      title: "✨ Unlock all features ! ✨",
      description: "Register to unlock exclusive features",
      mainActionLabel: "I want it !",
      secondaryActionLabel: "Cancel",
      mainFunction: () => {
        showFormModalBody.value = true;
      },
      secondaryFunction: closeUnauthenticatedModal,
    };
  }

  // Register modal props
  return {
    title: isRegisterMode.value ? "✨ Register ✨" : "✨ Login ✨",
    description: "Just a few steps away... ",
    mainActionLabel: isRegisterMode.value ? "Register" : "Login",
    secondaryActionLabel: "Cancel",
    mainFunction: isRegisterMode.value ? registerFlow : loginFlow,
    secondaryFunction: closeUnauthenticatedModal,
  };
});

onMounted(async () => {
  // Get hard & local save for authenticated users
  if (isAuthenticated.value && currentUser.value) {
    await checkHardSavesToLocal(currentUser.value.id);

    const localSave = getSudokuSave(currentDifficulty.value);

    if (localSave) {
      puzzle.value = localSave.value;

      isPuzzleFetched.value = true;
      return;
    }
  }

  // Either get a new puzzle
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

// Local auto-save for authenticated users
watch(
  puzzle,
  () => {
    if (isAuthenticated.value) {
      updateSudokuSave(currentDifficulty.value, puzzle.value);
    }
  },
  { deep: true }
);

const setPuzzle = async () => {
  const data = await getRandomPuzzle(currentDifficulty.value);

  setSudokuSave(currentDifficulty.value, {
    value: formatPuzzle(data.puzzle as number[][]),
    id: data.id,
  });

  puzzle.value = formatPuzzle(data.puzzle as number[][]);
};

const handleDifficultySwitch = () => {
  if (hasUserInput.value && !isAuthenticated.value) {
    showPreventDifficultyModal.value = true;
  } else {
    switchDifficulty();
  }
};
const handleDifficultySwitchDebounced = useDebounceFn(
  handleDifficultySwitch,
  400
);

/**
 * Switch difficulty and handles local save
 *
 * If the user is **authenticated**:
 * - **does** have a local save for the current difficulty, use it
 * - **does not** have a local save for the current difficulty, set a new puzzle
 *
 * If the user is **not authenticated**:
 * - set a new puzzle
 *
 */
const switchDifficulty = async () => {
  showPreventDifficultyModal.value = false;
  isLoading.value = true;
  resetMoveStacks();
  setSelectedCell(null);

  if (!isAuthenticated.value) {
    await setPuzzle();
  }

  if (isAuthenticated.value && currentUser.value) {
    const localSave = getSudokuSave(currentDifficulty.value);

    if (localSave) {
      puzzle.value = localSave.value;
    } else {
      await setPuzzle();
    }
  }

  isLoading.value = false;
  oldDifficulty.value = currentDifficulty.value;
};

const cancelDifficultySwitch = () => {
  showPreventDifficultyModal.value = false;

  // Due to animation
  setTimeout(() => {
    isLoading.value = false;
    currentDifficulty.value = oldDifficulty.value;
  }, 100);
};

const resetSudoku = async () => {
  showNewSudokuModal.value = false;
  isLoading.value = true;

  // if authenticated, checks user_grid for the current user/grid combo and deletes it
  // because only 1 hardSave per difficulty is allowed
  if (isAuthenticated.value) {
    const success = await checkAndDeleteHardSave(currentDifficulty.value);
    if (!success) {
      Logger.error(
        new Error("Failed to delete hard save while resetting sudoku")
      );
    }
  }

  await setPuzzle();
  isLoading.value = false;
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

  const currentCell = puzzle.value[selectedCell.y][selectedCell.x];
  if (currentCell.value === number || !currentCell.isEditable) return;

  pushMove(selectedCell, { ...selectedCell, value: number });

  startTimer();

  currentCell.value = number;
  setSelectedCell(currentCell);
};

const handleLeaderboard = async () => {
  if (!isAuthenticated.value) {
    subscribeModalContext.value = "leaderboard";
    showUnauthenticatedModal.value = true;
    return;
  }

  console.log("SHOW LEADERBOARD");
  if (!currentUser.value) return;

  const test = await loadHardSave(currentUser.value.id);
  console.log(test);
};

const handleSave = async () => {
  if (!isAuthenticated.value) {
    subscribeModalContext.value = "save";
    showUnauthenticatedModal.value = true;
    return;
  }

  isSaving.value = true;
  try {
    const success = await hardSave();

    if (success) {
      toastSuccess({ description: "Progress saved 🎉" });
    }
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  } finally {
    isSaving.value = false;
  }
};

const closeUnauthenticatedModal = () => {
  showUnauthenticatedModal.value = false;

  form.value = {
    email: "",
    password: "",
    pseudo: "",
    confirmPassword: "",
  };

  // Due to the modal animation
  setTimeout(() => {
    showFormModalBody.value = false;
    isRegisterMode.value = true;
  }, 300);
};

const registerFlow = async () => {
  isButtonLoading.value = true;

  const email = normalize(form.value.email);
  const password = form.value.password.trim();
  const pseudo = form.value.pseudo.trim();

  try {
    const isValid = loginRegisterFormRef.value?.validateForm();

    if (hasFormError.value || !isValid) {
      return;
    }

    const success = await register({ email, password, pseudo });
    if (success) {
      closeUnauthenticatedModal();
      toastSuccess({ description: "Successfully registered 🎉" });

      setTimeout(() => {
        toastInfo({ description: `Welcome ${currentUser.value?.pseudo} !` });
      }, 1000);
    }
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  } finally {
    isButtonLoading.value = false;
  }
};

const loginFlow = async () => {
  isButtonLoading.value = true;

  const email = normalize(form.value.email);
  const password = form.value.password.trim();

  try {
    const isValid = loginRegisterFormRef.value?.validateForm();

    if (hasFormError.value || !isValid) {
      return;
    }

    const success = await login(email, password);
    if (success) {
      if (!currentUser.value) {
        return throwFrontError("Current user not set", {
          context: "[loginFlow]",
        });
      }

      closeUnauthenticatedModal();
      toastSuccess({
        title: "Login successful",
        description: `Welcome ${currentUser.value.pseudo} !`,
      });

      await checkHardSavesToLocal(currentUser.value.id);

      const localSave = getSudokuSave(currentDifficulty.value);
      if (localSave) {
        puzzle.value = localSave.value;
      }
    }
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  } finally {
    isButtonLoading.value = false;
  }
};

const handleCompletion = () => {
  resetTimer();
  resetSudoku();
};
</script>

<style scoped lang=""></style>

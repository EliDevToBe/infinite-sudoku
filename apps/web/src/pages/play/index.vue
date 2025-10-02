<template>
  <MainWrapper>
    <template #sub-header>
      <div :class="ui.subHeaderWrapper">
        <!-- Keep this to regulate the grid display -->
        <div class="w-10 h-10 max-md:hidden"></div>

        <OptionBar
          v-model="currentDifficulty"
          @on-select="handleDifficultySwitchDebounced"
        />

        <Menu :class="ui.menu" @on-login="openLoginModal()"></Menu>
      </div>
    </template>

    <MainContent class="sm:gap-3 gap-2 relative">
      <Timer :difficulty="currentDifficulty" :grid="puzzle" />

      <FeatureArea
        :has-user-input="hasUserInput"
        :is-saving="isSaving"
        @on-leaderboard="handleLeaderboard"
        @on-save="handleSave"
      >
        <SudokuGrid
          :is-initializing="!isPuzzleFetched"
          v-model="puzzle"
          :is-loading="isLoading"
          :difficulty="currentDifficulty"
          @on-puzzle-completed="showVictoryModal = true"
        ></SudokuGrid>
      </FeatureArea>

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

      <div class="flex flex-col items-center h-fit sm:h-21">
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
          <ModalBodyWrapperUI>
            <div class="flex flex-col gap-2">
              <span class="inline-block">
                The new sudoku will <span class="text-red-500">erase</span> your
                current progress.
              </span>
              <span class="inline-block">Continue ?</span>
            </div>
          </ModalBodyWrapperUI>
        </LazyActionModal>

        <NumberBar @on-select="setNumber"></NumberBar>
      </div>

      <!-- FEATURES MODAL -->
      <LazyActionModal
        :title="featuresModalProps.title"
        :description="featuresModalProps.description"
        v-model:show="showFeaturesModal"
        :main-action-label="featuresModalProps.mainActionLabel"
        @on-main-action="featuresModalProps.mainFunction"
        :secondary-action-label="featuresModalProps.secondaryActionLabel"
        @on-secondary-action="featuresModalProps.secondaryFunction"
        special-main-action
        :is-main-action-loading="isButtonLoading"
      >
        <UnlockFeatureModalBody
          :context="featuresModalContext"
          @on-click-login="
            closeFeaturesModal();
            openLoginModal();
          "
        />
      </LazyActionModal>

      <!-- LOGIN REGISTER MODAL -->
      <LazyActionModal
        :title="loginRegisterModalProps.title"
        :description="loginRegisterModalProps.description"
        v-model:show="showLoginRegisterModal"
        :main-action-label="loginRegisterModalProps.mainActionLabel"
        :secondary-action-label="loginRegisterModalProps.secondaryActionLabel"
        @on-main-action="loginRegisterModalProps.mainFunction"
        @on-secondary-action="loginRegisterModalProps.secondaryFunction"
        :is-main-action-loading="isButtonLoading"
        special-main-action
      >
        <div :class="uiComputed.fromWrapper">
          <LoginRegisterForm
            ref="LoginRegisterFormRef"
            v-model:form="form"
            v-model:mode-register="isRegisterMode"
            :is-form-locked="isButtonLoading"
            v-model:has-error="hasFormError"
            v-model:mode-recovery="isRecoveryMode"
          />
        </div>
      </LazyActionModal>

      <!-- VICTORY MODAL && Confetti-->
      <LazyActionModal
        description="You have completed the puzzle!"
        title="🎉 Congratulations 🥳"
        v-model:show="showVictoryModal"
        main-action-label="Next one!"
        @on-main-action="handleCompletion"
        :dismissible="false"
        :close="false"
        class="overflow-visible"
      >
        <div
          v-confetti="{
            force: 0.7,
            particleClass: 'fixed top-[-65%] left-1/2',
          }"
        ></div>
        <VictoryModalBody
          @on-click-login="
            handleCompletion();
            openLoginModal();
          "
          :puzzle="puzzle"
          :current-difficulty="currentDifficulty"
        />
      </LazyActionModal>

      <!-- LEADERBOARD MODAL -->
      <LazyActionModal
        title=" Leaderboard"
        description="🧠 See who's crushing it!"
        v-model:show="showLeaderboardModal"
        close
        :class="ui.leaderboardModal"
      >
        <LeaderBoardModalBody />
      </LazyActionModal>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref,
  computed,
  useTemplateRef,
  watch,
  onUnmounted,
} from "vue";
import { LazyActionModal } from "@/components";
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
import { vConfetti } from "@neoconfetti/vue";
import { useRoute, useRouter } from "vue-router";

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
const { hardSave, checkAndDeleteHardSave, checkHardSavesToLocal } = useSave();
const { isAuthenticated, register, login, forgotPassword, confirmEmail } =
  useAuth();
const { currentUser } = useUser();
const {
  startTimer,
  resetTimer,
  getTimerActiveTime,
  setTotalElapsedTime,
  addTimerEvent,
  removeTimerEvent,
  pauseTimer,
} = useTimer();
const route = useRoute();
const router = useRouter();

const showPreventDifficultyModal = ref(false);
const showFeaturesModal = ref(false);
const showNewSudokuModal = ref(false);
const showVictoryModal = ref(false);
const showLeaderboardModal = ref(false);

const showLoginRegisterModal = ref(false);

const isLoading = ref(false);
const isPuzzleFetched = ref(false);
const hasFormError = ref(false);
const isButtonLoading = ref(false);
const isRegisterMode = ref(true);
const isRecoveryMode = ref(false);
const isSaving = ref(false);

const oldDifficulty = ref<DifficultyOptions>("medium");
const currentDifficulty = ref<DifficultyOptions>("medium");
const puzzle = ref<Cell[][]>(createEmptyPuzzle());
const featuresModalContext = ref<"leaderboard" | "save">();

const loginRegisterFormRef = useTemplateRef<
  InstanceType<typeof LoginRegisterForm>
>("LoginRegisterFormRef");

const uiComputed = computed(() => ({
  fromWrapper: [
    "flex justify-center w-full",
    isRegisterMode.value ? "h-88" : "h-60",
  ],
}));

const ui = {
  leaderboardModal: "sm:w-full sm:h-150 h-125",
  subHeaderWrapper: [
    "flex justify-center",
    "md:grid md:grid-cols-[1fr_auto_1fr]",
    "mt-1 sm:mt-4 sm:h-13 h-11",
  ],
  menu: [
    "z-1",
    "max-sm:fixed max-sm:top-150 max-sm:right-1/2 max-sm:translate-x-1/2",
    "max-md:fixed max-md:top-35 max-md:right-10",
  ],
};

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

const featuresModalProps = computed(() => {
  return {
    title: "✨ Unlock all features ! ✨",
    description: "Register to unlock exclusive features",
    mainActionLabel: "I want it !",
    secondaryActionLabel: "Cancel",
    mainFunction: () => {
      closeFeaturesModal();
      openRegisterModal();
    },
    secondaryFunction: closeFeaturesModal,
  };
});

const loginRegisterModalProps = computed(() => {
  if (isRecoveryMode.value) {
    return {
      title: "😱 Forgot your password ?",
      description: "Enter your account email to reset your password",
      mainActionLabel: "Reset password",
      secondaryActionLabel: "Cancel",
      mainFunction: resetPasswordFlow,
      secondaryFunction: closeLoginRegisterModal,
    };
  }

  return {
    title: isRegisterMode.value ? "Register" : "Login",
    description: isRegisterMode.value
      ? "Just a few steps away... "
      : "Usual stuff eh",
    mainActionLabel: isRegisterMode.value ? "Register" : "Login",
    secondaryActionLabel: "Cancel",
    mainFunction: isRegisterMode.value ? registerFlow : loginFlow,
    secondaryFunction: closeLoginRegisterModal,
  };
});

onMounted(async () => {
  confirmEmailFlow();

  addTimerEvent();

  // Get hard & local save for authenticated users
  if (isAuthenticated.value && currentUser.value) {
    const localSave = getSudokuSave(currentDifficulty.value);

    if (!localSave) {
      await checkHardSavesToLocal(currentUser.value.id);
    }

    const localSaveNewTry = getSudokuSave(currentDifficulty.value);
    if (localSaveNewTry) {
      puzzle.value = localSaveNewTry.value;
      setTotalElapsedTime(localSaveNewTry.time);

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

onUnmounted(() => {
  removeTimerEvent();
});

// Local auto-save for authenticated users
watch(
  puzzle,
  async () => {
    if (isAuthenticated.value) {
      await updateSudokuSave(currentDifficulty.value, {
        value: puzzle.value,
        time: getTimerActiveTime(),
      });
    }
  },
  { deep: true }
);

const setPuzzle = async () => {
  const data = await getRandomPuzzle(currentDifficulty.value);

  resetTimer();

  setSudokuSave(currentDifficulty.value, {
    value: formatPuzzle(data.puzzle as number[][]),
    id: data.id,
    time: 0,
  });

  puzzle.value = formatPuzzle(data.puzzle as number[][]);
};

const handleDifficultySwitch = async () => {
  if (hasUserInput.value && !isAuthenticated.value) {
    showPreventDifficultyModal.value = true;
  } else {
    await switchDifficulty();
  }
};
const handleDifficultySwitchDebounced = useDebounceFn(
  handleDifficultySwitch,
  300
);

/**
 * Switch difficulty and handles local save, with timer management.
 *
 * If the user is **authenticated**:
 * - **does** have a local save for the current difficulty, use it
 * - **does not** have a local save for the current difficulty, set a new puzzle
 *
 * If the user is **not authenticated**:
 * - set a new puzzle
 *
 * Timer management:
 * - Pauses it
 * - Saves the time locally to the previous difficulty
 * - Resets the timer, ready for the new difficulty
 */
const switchDifficulty = async () => {
  showPreventDifficultyModal.value = false;
  isLoading.value = true;
  resetMoveStacks();
  setSelectedCell(null);
  pauseTimer();

  if (!isAuthenticated.value) {
    await setPuzzle();
  }

  if (isAuthenticated.value && currentUser.value) {
    // Save time locally before initializing new timer
    await updateSudokuSave(oldDifficulty.value, {
      time: getTimerActiveTime(),
    });

    resetTimer();

    const localSave = getSudokuSave(currentDifficulty.value);

    if (localSave) {
      puzzle.value = localSave.value;
      setTotalElapsedTime(localSave.time);
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

  startTimer();

  setSelectedCell(puzzle.value[event.y][event.x]);
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
    featuresModalContext.value = "leaderboard";
    showFeaturesModal.value = true;
    return;
  }

  showLeaderboardModal.value = true;
};

const handleSave = async () => {
  if (!isAuthenticated.value) {
    featuresModalContext.value = "save";
    showFeaturesModal.value = true;
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

const closeFeaturesModal = () => {
  showFeaturesModal.value = false;
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
      closeLoginRegisterModal();
      toastSuccess({ description: "Successfully registered 🎉" });

      setTimeout(() => {
        toastInfo({
          description: `Welcome ${currentUser.value?.pseudo} ! Please confirm your email`,
        });
      }, 2000);
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

      closeLoginRegisterModal();

      toastSuccess({
        title: "Login successful",
        description: `Welcome ${currentUser.value.pseudo} !`,
      });

      const localSave = getSudokuSave(currentDifficulty.value);
      if (!localSave) {
        await checkHardSavesToLocal(currentUser.value.id);
      }

      const localSaveNewTry = getSudokuSave(currentDifficulty.value);
      if (localSaveNewTry) {
        puzzle.value = localSaveNewTry.value;
        setTotalElapsedTime(localSaveNewTry.time);

        isPuzzleFetched.value = true;
        return;
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

const resetPasswordFlow = async () => {
  isButtonLoading.value = true;

  const email = normalize(form.value.email);

  const isValid = loginRegisterFormRef.value?.validateForm();

  if (hasFormError.value || !isValid) {
    isButtonLoading.value = false;
    return;
  }

  try {
    const success = await forgotPassword(email);
    if (!success) {
      return;
    }

    toastInfo({
      title: "Password reset email sent",
      description: `An email has been sent`,
    });
    closeLoginRegisterModal();
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
  showVictoryModal.value = false;

  resetTimer();
  resetSudoku();
};

const openLoginModal = () => {
  isRegisterMode.value = false;
  isRecoveryMode.value = false;

  showLoginRegisterModal.value = true;
};
const openRegisterModal = () => {
  isRegisterMode.value = true;
  isRecoveryMode.value = false;

  showLoginRegisterModal.value = true;
};
const closeLoginRegisterModal = () => {
  showLoginRegisterModal.value = false;

  // Due to modal fade out animation
  // Delay the reset of the form to avoid seeing the form reset
  setTimeout(() => {
    isRecoveryMode.value = false;

    form.value = {
      email: "",
      password: "",
      pseudo: "",
      confirmPassword: "",
    };
  }, 300);
};

const confirmEmailFlow = async () => {
  const route = useRoute();
  const router = useRouter();

  const token = route.query.t as string;
  router.replace({
    query: {},
  });
  if (!token) {
    return;
  }

  try {
    const response = await confirmEmail(token);
    if (!response.success) {
      throw new Error("Could not confirm email");
    }

    toastSuccess({
      description: "Email confirmed successfully",
    });
  } catch (error) {
    if (isFrontError(error)) {
      toastError(error, { description: error.message });
    } else {
      toastError(error, { description: "An error occurred" });
    }
  }
};
</script>

<style scoped lang=""></style>

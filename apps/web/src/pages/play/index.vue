<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex justify-center sm:h-13 h-11">
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
        :isMainActionLoading="isButtonLoading"
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
import { LazyActionModal } from "@/components";
import LoginRegisterForm from "@/components/LoginRegisterForm.vue";
import { type Cell, type DifficultyOptions } from "@/utils";
import {
  useSudoku,
  usePresetToast,
  useMoveStack,
  useState,
  useAuth,
  useUser,
} from "@/composables";
import { normalize } from "@/utils";
import { isFrontError } from "@/utils/error";

const { getRandomPuzzle, formatPuzzle } = useSudoku();
const { toastError, toastInfo, toastSuccess } = usePresetToast();
const { pushMove, undoMove, redoMove, resetMoveStacks } = useMoveStack();
const { setSelectedCell, getSelectedCell, setSudokuSave, getSudokuSave } =
  useState();
const { isAuthenticated, register, login } = useAuth();
const { currentUser } = useUser();

const isLoading = ref(false);
const isPuzzleFetched = ref(false);
const showPreventDifficultyModal = ref(false);
const showUnauthenticatedModal = ref(false);
const showFormModalBody = ref(false);
const hasFormError = ref(false);
const isButtonLoading = ref(false);
const isRegisterMode = ref(true);

const oldDifficulty = ref<DifficultyOptions>("medium");
const currentDifficulty = ref<DifficultyOptions>("medium");
const puzzle = ref<Cell[][]>([]);
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
  return puzzle.value.some((row) =>
    row.some((cell) => cell.isEditable && cell.value !== 0)
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
  // Get local save for authenticated users
  if (isAuthenticated.value) {
    const localSave = getSudokuSave(currentDifficulty.value);

    if (localSave) {
      puzzle.value = localSave;

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
      setSudokuSave(currentDifficulty.value, puzzle.value);
    }
  },
  { deep: true }
);

const setPuzzle = async () => {
  const data = await getRandomPuzzle();
  puzzle.value = formatPuzzle(data.puzzle as number[][]);
};

const handleDifficultySwitch = () => {
  if (hasUserInput.value && !isAuthenticated.value) {
    showPreventDifficultyModal.value = true;
  } else {
    switchDifficulty();
  }
};

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
const switchDifficulty = () => {
  showPreventDifficultyModal.value = false;
  isLoading.value = true;
  resetMoveStacks();
  setSelectedCell(null);

  setTimeout(async () => {
    if (!isAuthenticated.value) {
      await setPuzzle();
    }

    if (isAuthenticated.value) {
      const localSave = getSudokuSave(currentDifficulty.value);

      if (localSave) {
        puzzle.value = localSave;
      } else {
        await setPuzzle();
      }
    }

    isLoading.value = false;
    oldDifficulty.value = currentDifficulty.value;
  }, 300);
};

const cancelDifficultySwitch = () => {
  showPreventDifficultyModal.value = false;
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

  const currentCell = puzzle.value[selectedCell.y][selectedCell.x];
  if (currentCell.value === number || !currentCell.isEditable) return;

  pushMove(selectedCell, { ...selectedCell, value: number });

  currentCell.value = number;
  setSelectedCell(currentCell);
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

  form.value = {
    email: "",
    password: "",
    pseudo: "",
    confirmPassword: "",
  };

  // Due to the modal animation
  setTimeout(() => {
    showFormModalBody.value = false;
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
      closeUnauthenticatedModal();
      toastSuccess({
        title: "Login successful",
        description: `Welcome ${currentUser.value?.pseudo} !`,
      });
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
</script>

<style scoped lang=""></style>

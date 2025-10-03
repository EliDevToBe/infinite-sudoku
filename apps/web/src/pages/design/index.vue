<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex items-center justify-center">
        <OptionBar v-model="difficulty" />
      </div>
    </template>

    <MainContent class="h-max gap-6 overflow-hidden p-5">
      <h1 class="text-3xl font-bold sticky top-0">Design & Playground</h1>
      <section :class="ui.buttonWrapper">
        <div :class="ui.buttonContainer">
          <ButtonUI size="icon" variant="danger">x</ButtonUI>
          <ButtonUI size="sm" disabled>Disabled</ButtonUI>
          <ButtonUI size="md" leadingIcon="mdi:apple">Button 3</ButtonUI>
          <ButtonUI size="lg">Button 4</ButtonUI>
        </div>
        <div :class="ui.buttonContainer">
          <ButtonUI size="icon-xs" variant="ghost">x</ButtonUI>
          <ButtonUI size="sm" variant="secondary">Button 2</ButtonUI>
          <ButtonUI size="md" isLoading>Loading</ButtonUI>
          <ButtonUI
            size="lg"
            variant="secondary"
            @click="console.log(currentUser)"
            >Who am I ?</ButtonUI
          >
        </div>
      </section>

      <FormField
        name="pseudo"
        type="text"
        placeholder="DISABLED"
        size="sm"
        label="Pseudo"
        disabled
      />

      <form :class="ui.formWrapper">
        <div :class="ui.formContainer">
          <label for="name">Name</label>
          <InputUI
            type="text"
            id="name"
            placeholder="Enter your name"
            size="sm"
            variant="secondary"
            hasError
          />
        </div>
        <div :class="ui.formContainer">
          <label for="email">Email</label>
          <InputUI type="email" id="email" placeholder="Enter your email" />
        </div>
        <div :class="ui.formContainer">
          <label for="password">Password</label>
          <InputUI
            type="password"
            id="password"
            placeholder="Enter your password"
            size="lg"
          />
        </div>
      </form>

      <section>
        <LazyTooltipUI
          text="Generate each toast variant"
          :options="{ align: 'start', side: 'top', sideOffset: 10 }"
        >
          <ButtonUI size="sm" variant="danger" @click="showToast">
            Multi Toasting (x4)
          </ButtonUI>
        </LazyTooltipUI>
      </section>

      <section class="flex justify-center">
        <SudokuGrid
          difficulty="hardcore"
          :is-initializing="false"
          v-model="formattedPuzzle"
          :is-loading="false"
        ></SudokuGrid>
      </section>

      <section>
        <ButtonUI @click="isModalOpen = !isModalOpen">Open Modal</ButtonUI>
        <ModalUI
          title="Modal Title"
          description="Modal Description"
          v-model:show="isModalOpen"
          @on-close="toastInfo({ description: 'Modal closed' })"
        >
          <template #body>Basic content</template>
          <template #footer>
            <div class="flex gap-5">
              <ButtonUI
                variant="secondary"
                size="sm"
                @click="
                  toastInfo({ description: 'Modal cancelled' });
                  isModalOpen = false;
                "
                >Cancel</ButtonUI
              >
              <ButtonUI
                size="sm"
                @click="
                  toastSuccess({ description: 'Modal confirmed' });
                  isModalOpen = false;
                "
                >Confirm</ButtonUI
              >
            </div>
          </template>
        </ModalUI>
      </section>

      <section>
        <ButtonUI @click="isConfirmModalOpen = !isConfirmModalOpen"
          >Confirm Modal</ButtonUI
        >
        <ActionModal
          description="Confirm changing difficulty"
          secondary-action-label="Return"
          main-action-label="OK"
          title="Are you sure ?"
          v-model:show="isConfirmModalOpen"
          @on-secondary-action="toastInfo({ description: 'Dismissed' })"
          @on-main-action="
            toastSuccess({ description: 'Confirmed the ConfirmModal' })
          "
        >
          <span class="inline-block">
            Changing difficulty to {{ difficulty }} will reset your current
            grid.
          </span>
          <span class="inline-block">You will lose your progress.</span>
        </ActionModal>
      </section>

      <section>
        <NumberBar></NumberBar>
      </section>

      <section>
        <FeatureArea :has-user-input="false" :is-saving="false"></FeatureArea>
      </section>

      <section class="flex">
        <ButtonUI
          size="sm"
          @click="isSubscribeModalOpen = !isSubscribeModalOpen"
        >
          sub
        </ButtonUI>
        <LazyActionModal
          title="Unlock full potential !"
          description="🚀 Register to unlock exclusive features"
          v-model:show="isSubscribeModalOpen"
          main-action-label="Register"
          @on-main-action="isSubscribeModalOpen = false"
          secondary-action-label="Cancel"
          @on-secondary-action="isSubscribeModalOpen = false"
        >
          <div>BODY</div>
        </LazyActionModal>
      </section>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { useSudoku, useUser, usePresetToast } from "@/composables";
import { ref, watch } from "vue";
import { Logger } from "@/composables/useLogger";
import type { DifficultyOptions, Cell } from "@shared/utils/sudoku/helper";
import { LazyTooltipUI } from "@/components";
import { LazyActionModal } from "@/components";

definePage({ meta: { requiresAuth: true, roles: ["admin"] } });

const ui = {
  buttonWrapper: "flex flex-col w-[75%] gap-5",
  buttonContainer: "flex justify-between items-center gap-5",
  formWrapper: "flex flex-col w-[75%] gap-5",
  formContainer: "flex flex-col gap-2",
};

const { currentUser } = useUser();
const { toastInfo, toastSuccess, toastError, toastAction } = usePresetToast();
const { formatPuzzle, getRandomPuzzle } = useSudoku();

const difficulty = ref<DifficultyOptions>("medium");
const isModalOpen = ref(false);
const isConfirmModalOpen = ref(false);
const isSubscribeModalOpen = ref(false);

const showToast = () => {
  toastInfo({ description: "This is a info toast" });
  toastSuccess({ description: "This is a success toast" });
  toastError(new Error("This is a new error"), {
    description: "This is a error toast",
  });
  toastAction({
    // description: "This is a action toast",
    title: "Action Toast",
    actions: [
      {
        label: "Click on me",
        onClick: () => {
          console.log("clicked from action toast");
        },
        leadingIcon: "i-lucide-refresh-cw",
      },
    ],
  });
};

watch(difficulty, async () => {
  console.log(difficulty.value);
  try {
    await getData();
    console.log(formattedPuzzle.value);
  } catch (error) {
    Logger.error(error);
  }
});

const getData = async () => {
  const data = await getRandomPuzzle("medium");
  formattedPuzzle.value = formatPuzzle(data.puzzle as number[][]);
};

const testData = ref([
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 4, 3, 4, 9, 8, 3, 6, 5],
  [8, 3, 4, 8, 3, 2, 6, 1, 6],
  [2, 3, 3, 5, 4, 8, 1, 3, 5],
  [5, 4, 9, 3, 6, 1, 8, 1, 4],
  [7, 8, 4, 6, 5, 5, 7, 8, 2],
  [1, 2, 6, 5, 6, 1, 4, 7, 3],
  [4, 8, 9, 7, 1, 7, 8, 2, 1],
  [3, 9, 6, 3, 4, 1, 6, 2, 5],
]);

const formattedPuzzle = ref<Cell[][]>(formatPuzzle(testData.value));

watch(
  formattedPuzzle,
  (newValue) => {
    console.log(newValue);
  },
  { deep: true }
);
</script>

<style scoped lang=""></style>

<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex items-center justify-center">
        <OptionBar />
      </div>
    </template>

    <MainContent class="h-max gap-5 overflow-hidden p-5">
      <h1 class="text-3xl font-bold sticky top-0">Design & Playground</h1>
      <div :class="ui.buttonWrapper">
        <div :class="ui.buttonContainer">
          <ButtonUI size="icon" variant="danger">x</ButtonUI>
          <ButtonUI size="sm" disabled>Disabled</ButtonUI>
          <ButtonUI size="md">Button 3</ButtonUI>
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
      </div>

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

      <div>
        <ButtonUI size="sm" variant="danger" @click="showToast">
          Multi Toasting (x3)
        </ButtonUI>
      </div>

      <div class="flex justify-center">
        <SudokuGrid v-model="formattedPuzzle"></SudokuGrid>
      </div>
    </MainContent>

    <!--  default Parent as MainContent-->
  </MainWrapper>
</template>

<script setup lang="ts">
import { usePresetToast } from "@/composables/toast";
import { useSudoku, useUser } from "@/composables";
import { reactive, ref, watch } from "vue";
// definePage({ meta: { requiresAuth: true, roles: ["admin"] } });

const ui = {
  buttonWrapper: "flex flex-col w-[75%] gap-5",
  buttonContainer: "flex justify-between items-center gap-5",
  formWrapper: "flex flex-col w-[75%] gap-5",
  formContainer: "flex flex-col gap-2",
};

const { currentUser } = useUser();
const { toastInfo, toastSuccess, toastError } = usePresetToast();
const { formatPuzzle } = useSudoku();

const showToast = () => {
  toastInfo({ description: "This is a info toast" });
  toastSuccess({ description: "This is a success toast" });
  toastError(new Error("This is a new error"), {
    description: "This is a error toast",
  });
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

const formattedPuzzle = reactive(formatPuzzle(testData.value));
</script>

<style scoped lang=""></style>

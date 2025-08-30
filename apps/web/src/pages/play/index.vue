<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex items-center justify-center">
        <OptionBar v-model="difficulty" />
      </div>
    </template>
    <MainContent>
      <SudokuGrid
        v-if="isPuzzleFetched"
        v-model="puzzle"
        :is-loading="isLoading"
      ></SudokuGrid>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { MainWrapper, OptionBar } from "@/components";
import { type Cell, type DifficultyOptions } from "@/utils";
import { useSudoku, usePresetToast } from "@/composables";

const { getRandomPuzzle, formatPuzzle } = useSudoku();
const { toastError } = usePresetToast();

const isLoading = ref(false);
const isPuzzleFetched = ref(false);

const difficulty = ref<DifficultyOptions>("medium");
const puzzle = ref<Cell[][]>([]);

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

watch(difficulty, async () => {
  isLoading.value = true;

  if (isPuzzleFetched.value) {
    console.log("POPUP MODAL TO CONFIRM");
  }

  // Delay to keep for visual effect
  // setTimeout(async () => {
  //   await setPuzzle();
  //   isLoading.value = false;
  // }, 200);
});
</script>

<style scoped lang=""></style>

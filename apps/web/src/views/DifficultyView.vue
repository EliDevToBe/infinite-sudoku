<template>
  <MainWrapper>
    <div class="flex flex-col h-full items-center justify-center">
      <h2 class="text-3xl font-bold mb-8">Choose Difficulty</h2>
      <div class="flex flex-col md:flex-row gap-6">
        <div
          v-for="difficulty in difficulties"
          :key="difficulty"
          class="p-8 w-64 h-32 border rounded-lg cursor-pointer flex items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-md"
          @click="selectDifficulty(difficulty)"
        >
          <h3 class="text-2xl font-semibold">
            {{ difficulty }}
          </h3>
        </div>
      </div>
    </div>
  </MainWrapper>
</template>

<script setup lang="ts">
import MainWrapper from "../components/MainWrapper.vue";
import { useNavigation } from "@/composables/useNavigation";

const { navigateTo } = useNavigation();

const difficulties = ["easy", "medium", "hard", "expert"];

const selectDifficulty = (difficulty: string) => {
  navigateTo("puzzle-choice", { difficulty });
};
</script>

<style scoped lang=""></style>

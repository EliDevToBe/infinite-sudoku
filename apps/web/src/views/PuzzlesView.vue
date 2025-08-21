<template>
  <MainWrapper>
    <div class="flex flex-col h-full items-center pt-8">
      <RouterLink
        to="/difficulty"
        class="self-start mb-6 text-primary hover:underline"
      >
        &lt; Back to difficulties
      </RouterLink>

      <h2 class="text-3xl font-bold mb-8 capitalize">
        {{ difficulty }} Puzzles
      </h2>
      <div
        class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-4"
      >
        <div
          v-for="n in 25"
          :key="n"
          class="w-16 h-16 border rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow"
          @click="selectPuzzle(n)"
        >
          <span class="text-xl font-medium">{{ n }}</span>
        </div>
      </div>
    </div>
  </MainWrapper>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { MainWrapper } from "@/components";
import { useNavigation } from "@/composables/useNavigation";

const { navigateTo } = useNavigation();

const props = defineProps<{
  difficulty: string;
}>();

const router = useRouter();

const selectPuzzle = (puzzleId: number) => {
  navigateTo("puzzle-game", {
    difficulty: props.difficulty,
    id: `${puzzleId}`,
  });
};
</script>

<style scoped lang=""></style>

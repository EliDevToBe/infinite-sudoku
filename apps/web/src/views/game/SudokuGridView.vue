<template>
  <div class="flex flex-col items-center p-4">
    <h1 class="text-2xl mb-4 capitalize">{{ difficulty }} Puzzle {{ id }}</h1>
    <div
      class="grid grid-cols-9 gap-0.5 bg-gray-400 dark:bg-gray-600 p-1 md:p-2 rounded-md shadow-lg"
    >
      <input
        v-for="i in 81"
        :key="i"
        class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-gray-50 dark:bg-gray-800 flex items-center justify-center border-gray-300 dark:border-gray-700"
        :class="{
          'border-t-2 border-t-gray-900 dark:border-t-gray-100':
            Math.floor((i - 1) / 9) % 3 === 0,
          'border-b-2 border-b-gray-900 dark:border-b-gray-100':
            Math.floor((i - 1) / 9) % 3 === 2,
          'border-l-2 border-l-gray-900 dark:border-l-gray-100':
            ((i - 1) % 9) % 3 === 0,
          'border-r-2 border-r-gray-900 dark:border-r-gray-100':
            ((i - 1) % 9) % 3 === 2,
          'border-t-gray-300 dark:border-t-gray-700':
            Math.floor((i - 1) / 9) % 3 !== 0,
          'border-b-gray-300 dark:border-b-gray-700':
            Math.floor((i - 1) / 9) % 3 !== 2,
          'border-l-gray-300 dark:border-l-gray-700': ((i - 1) % 9) % 3 !== 0,
          'border-r-gray-300 dark:border-r-gray-700': ((i - 1) % 9) % 3 !== 2,
        }"
      >
        <!-- Placeholder for number -->
      </input>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  difficulty: string;
  id: string;
}>();

// Logic to fetch and display the sudoku puzzle will go here
</script>

<style scoped lang=""></style>

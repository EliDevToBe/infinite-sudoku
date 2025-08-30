<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex items-center justify-center">
        <OptionBar v-model="difficulty" />
      </div>
    </template>
    <MainContent>
      <SudokuGrid></SudokuGrid>
    </MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MainWrapper, OptionBar } from "@/components";
import { type DifficultyOptions } from "@/utils";

const difficulty = ref<DifficultyOptions>("medium");

const difficulty = ref<string>("medium");
</script>

<style scoped lang=""></style>

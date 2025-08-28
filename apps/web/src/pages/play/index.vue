<template>
  <MainWrapper>
    <template #sub-header>
      <div class="flex items-center justify-center">
        <OptionBar v-model="difficulty" />
      </div>
    </template>
    <MainContent>GRID DISPLAY</MainContent>
  </MainWrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MainWrapper, OptionBar } from "@/components";

const difficulty = ref<string>("medium");
</script>

<style scoped lang=""></style>

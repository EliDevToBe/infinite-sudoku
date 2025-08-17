<template>
  <MainWrapper>
    <div :class="ui.content">
      <button :class="ui.button" @click="fetchApi">Fetch API test</button>
    </div>
  </MainWrapper>
</template>

<script setup lang="ts">
import MainWrapper from "../components/MainWrapper.vue";
import { useSudoku } from "@/composables/useSudoku";

const { fetchApi } = useSudoku();

const ui = {
  content: "flex flex-col h-full items-center justify-center bg-cyan-200",
  title: "text-3xl font-bold mb-8",
  button: "bg-red-500 text-white p-2 rounded-md cursor-pointer",
};
</script>

<style scoped lang=""></style>

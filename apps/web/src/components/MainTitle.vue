<template>
  <div :class="ui.wrapper">
    <div :class="ui.titleLeft" label="title">Infinite</div>

    <div :class="ui.logo" label="logo" @click="navigateTo('/')">logo</div>

    <div :class="ui.titleRight" label="title">Sudoku</div>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from "@/composables";

const { navigateTo } = useNavigation();

const ui = {
  wrapper: "flex items-center justify-center gap-10 m-b-5",
  titleLeft: "text-3xl rotate--12",
  titleRight: "text-3xl rotate-12",
  logo: "cursor-pointer",
};
</script>

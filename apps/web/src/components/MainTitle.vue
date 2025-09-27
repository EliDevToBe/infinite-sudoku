<template>
  <div :class="ui.wrapper">
    <div :class="[ui.titleLeft, ui.titleSize]" label="title">Infinite</div>

    <div :class="ui.logo" label="logo" @click="navigateTo('/play/')" alt="logo">
      <LogoUI class="absolute -translate-x-[43.5%] -top-2" />
    </div>

    <div :class="[ui.titleRight, ui.titleSize]" label="title">Sudoku</div>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from "@/composables";

const { navigateTo } = useNavigation();

const ui = {
  wrapper: "relative flex items-center justify-center gap-10 m-b-5 isolate",
  titleSize: "text-4xl font-extrabold font-nunito",
  titleLeft: "z-1 rotate--12",
  titleRight: "rotate-12",
  logo: "cursor-pointer",
};
</script>

<template>
  <div :class="ui.wrapper">
    <ButtonUI ref="leaderboardButton" size="md" :leadingIcon="leaderboardIcon"
      >Leaderboard</ButtonUI
    >
    <ButtonUI size="md" leadingIcon="lucide:lock">Save progress</ButtonUI>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useAuth } from "@/composables/";
import { useElementHover } from "@vueuse/core";

const ui = {
  wrapper: ["flex items-center justify-between", "w-68 sm:w-100 p-1 px-0"],
};

const { isAuthenticated } = useAuth();

const leaderboardButton =
  useTemplateRef<HTMLButtonElement>("leaderboardButton");
const isHovered = useElementHover(leaderboardButton);

const leaderboardIcon = computed(() => {
  if (!isAuthenticated.value) {
    return isHovered.value ? "lucide:unlock" : "lucide:lock";
  }
  return "lucide:crown";
});
</script>

<style scoped lang=""></style>

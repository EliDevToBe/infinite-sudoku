<template>
  <div :class="ui.wrapper">
    <LazyTooltipUI :disabled="isAuthenticated" text="Login to unlock">
      <ButtonUI
        ref="leaderboardButton"
        :size="size"
        :leadingIcon="leaderboardIcon"
        :variant="isAuthenticated ? 'primary' : 'ghost'"
        @click="emit('onLeaderboard')"
        >Leaderboard</ButtonUI
      >
    </LazyTooltipUI>

    <LazyTooltipUI :disabled="isAuthenticated" text="Login to unlock">
      <ButtonUI
        ref="saveButton"
        :size="size"
        :leadingIcon="saveIcon"
        :variant="isAuthenticated ? 'primary' : 'ghost'"
        @click="emit('onSave')"
        >Save progress</ButtonUI
      >
    </LazyTooltipUI>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useAuth } from "@/composables/";
import { useElementHover } from "@vueuse/core";
import { useWindowSize } from "@vueuse/core";
import { LazyTooltipUI } from "@/components";

const ui = {
  wrapper: ["flex items-center justify-between", "w-68 sm:w-100 p-1 px-0"],
};

const emit = defineEmits<{
  onLeaderboard: [];
  onSave: [];
}>();

const { isAuthenticated } = useAuth();
const { width } = useWindowSize();

const leaderboardButton =
  useTemplateRef<HTMLButtonElement>("leaderboardButton");
const isLeaderboardBtnHovered = useElementHover(leaderboardButton);

const saveButton = useTemplateRef<HTMLButtonElement>("saveButton");
const isSaveBtnHovered = useElementHover(saveButton);

const leaderboardIcon = computed(() => {
  if (!isAuthenticated.value) {
    return isLeaderboardBtnHovered.value ? "lucide:unlock" : "lucide:lock";
  }
  return "lucide:crown";
});

const saveIcon = computed(() => {
  if (!isAuthenticated.value) {
    return isSaveBtnHovered.value ? "lucide:unlock" : "lucide:lock";
  }
  return "lucide:save";
});

const size = computed(() => {
  return width.value < 640 ? "sm" : "md";
});
</script>

<style scoped lang=""></style>

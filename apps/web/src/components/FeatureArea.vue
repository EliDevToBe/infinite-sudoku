<template>
  <div :class="ui.wrapper">
    <LazyTooltipUI :disabled="isAuthenticated" text="Login to unlock">
      <ButtonUI
        ref="leaderboardButton"
        :size="size"
        :leadingIcon="leaderboardIcon"
        :variant="isAuthenticated ? 'primary' : 'ghost'"
        @click="emit('onLeaderboard')"
        id="leaderboard-button"
      >
        <label for="leaderboard-button">Leaderboard</label>
      </ButtonUI>
    </LazyTooltipUI>

    <LazyTooltipUI :disabled="isAuthenticated" text="Login to unlock">
      <ButtonUI
        ref="saveButton"
        :size="size"
        :leadingIcon="saveIcon"
        :variant="isAuthenticated ? 'primary' : 'ghost'"
        @click="emit('onSave')"
        id="save-button"
        :isLoading="isSaving"
        :disabled="isSaving || !hasUserInput"
      >
        <label
          :class="{ 'cursor-not-allowed': isSaving || !hasUserInput }"
          for="save-button"
          >Save progress</label
        >
      </ButtonUI>
    </LazyTooltipUI>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef } from "vue";
import { useAuth } from "@/composables/";
import { useElementHover, useWindowSize, useFocus } from "@vueuse/core";
import { LazyTooltipUI } from "@/components";

const ui = {
  wrapper: ["flex items-center justify-between", "w-68 sm:w-100 p-1 px-0"],
};

const emit = defineEmits<{
  onLeaderboard: [];
  onSave: [];
}>();

const props = defineProps<{
  isSaving: boolean;
  hasUserInput: boolean;
}>();

const { isAuthenticated } = useAuth();
const { width } = useWindowSize();

const leaderboardButtonElement =
  useTemplateRef<HTMLButtonElement>("leaderboardButton");
const isLeaderboardBtnHovered = useElementHover(leaderboardButtonElement);
const isLeaderboardBtnFocused = useFocus(leaderboardButtonElement).focused;

const saveButtonElement = useTemplateRef<HTMLButtonElement>("saveButton");
const isSaveBtnHovered = useElementHover(saveButtonElement);
const isSaveBtnFocused = useFocus(saveButtonElement).focused;

const leaderboardIcon = computed(() => {
  if (!isAuthenticated.value) {
    return isLeaderboardBtnHovered.value || isLeaderboardBtnFocused.value
      ? "lucide:unlock"
      : "lucide:lock";
  }
  return "lucide:crown";
});

const saveIcon = computed(() => {
  if (!isAuthenticated.value) {
    return isSaveBtnHovered.value || isSaveBtnFocused.value
      ? "lucide:unlock"
      : "lucide:lock";
  }
  return "lucide:save";
});

const size = computed(() => {
  return width.value < 640 ? "sm" : "md";
});
</script>

<style scoped lang=""></style>

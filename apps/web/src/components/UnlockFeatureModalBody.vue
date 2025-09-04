<template>
  <div :class="ui.wrapper">
    <div :class="ui.header">
      You wish you were able to
      <span :class="ui.context">
        {{ displayContext }}
      </span>
      ?
    </div>
    <div>
      <div class="text-center">
        <span :class="ui.loginText" role="link" @click="emit('onClickLogin')">
          {{ "Login" }}
        </span>
        or
        <span class="text-lg">Register</span>
        and enjoy :
      </div>
    </div>
    <ul>
      <li>
        <VueIcon
          :width="ui.iconSize"
          :height="ui.iconSize"
          :class="ui.icon"
          name="lucide:save"
        ></VueIcon>
        <span :class="[ui.goldenText, 'animate-duration-4333']"> Saving</span>
        your progress
      </li>
      <li class="ml-8">
        <VueIcon
          :width="ui.iconSize"
          :height="ui.iconSize"
          :class="ui.icon"
          name="lucide:crown"
        ></VueIcon>
        Checking the
        <span :class="[ui.goldenText, 'animate-duration-4666']"
          >leaderboard</span
        >
      </li>
      <li class="ml-20">
        <VueIcon
          :width="ui.iconSize"
          :height="ui.iconSize"
          :class="ui.icon"
          name="lucide:sparkles"
        ></VueIcon>
        Smart grid highlighting
        <span class="text-gray-400"> (coming soon)</span>
      </li>
      <li class="ml-36">
        <VueIcon
          :width="ui.iconSize"
          :height="ui.iconSize"
          :class="ui.icon"
          name="lucide:plus"
        ></VueIcon>
        And
        <span :class="[ui.goldenText, 'animate-duration-4999']">more...</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const ui = {
  wrapper: "flex flex-col gap-2",
  header: "text-lg text-center",
  context: "text-green font-semibold",
  loginText: "text-lg sm:hover:text-dTheme-accent underline cursor-pointer",
  icon: "inline text-dTheme-accent",
  iconSize: "20",
  goldenText: "text-amber-400 animate-pulse",
};

const emit = defineEmits<{
  onClickLogin: [];
}>();

const props = defineProps<{
  context: "leaderboard" | "save" | undefined;
}>();

const displayContext = computed(() => {
  return props.context === "save"
    ? "save your progress"
    : "check the leaderboard";
});
</script>

<style scoped lang=""></style>

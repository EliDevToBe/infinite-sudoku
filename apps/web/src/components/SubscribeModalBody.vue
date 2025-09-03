<template>
  <div class="flex flex-col gap-2">
    <div class="text-lg text-center">
      You wish you were able to
      <span :class="ui.context">
        {{ displayContext }}
      </span>
      ?
    </div>
    <div>
      <div class="text-center">
        <span
          class="text-lg sm:hover:text-dTheme-accent underline cursor-pointer"
          role="link"
        >
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
          width="20"
          height="20"
          class="inline text-dTheme-accent"
          name="lucide:save"
        ></VueIcon>
        <span class="text-amber-400 animate-pulse animate-duration-4333">
          Saving</span
        >
        your progress
      </li>
      <li class="ml-8">
        <VueIcon
          width="20"
          height="20"
          class="inline text-dTheme-accent"
          name="lucide:crown"
        ></VueIcon>
        Checking the
        <span class="text-amber-400 animate-pulse animate-duration-4666"
          >leaderboard</span
        >
      </li>
      <li class="ml-20">
        <VueIcon
          width="20"
          height="20"
          class="inline text-dTheme-accent"
          name="lucide:sparkles"
        ></VueIcon>
        Smart grid highlighting
        <span class="text-gray-400"> (coming soon)</span>
      </li>
      <li class="ml-36">
        <VueIcon
          width="20"
          height="20"
          class="inline text-dTheme-accent"
          name="lucide:plus"
        ></VueIcon>
        And
        <span class="text-amber-400 animate-pulse animate-duration-4999"
          >more...</span
        >
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const ui = {
  context: "text-green font-semibold",
};

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

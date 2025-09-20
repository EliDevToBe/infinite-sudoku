<template>
  <div :class="ui.wrapper">
    <ul :class="ui.listWrapper">
      <li :class="ui.list">
        <VueIcon
          :width="ui.iconSize"
          :height="ui.iconSize"
          :class="ui.icon"
          name="lucide:crown"
        ></VueIcon>
        <span>
          {{ isAuthenticated ? "Score: " : "Potential score: " }}
          <span :class="ui.goldenText">{{ score }}</span>
        </span>
      </li>
      <li :class="ui.list">
        <VueIcon
          :width="ui.iconSize"
          :height="ui.iconSize"
          :class="ui.icon"
          name="lucide:clock"
        ></VueIcon>
        <span>
          Finished in: <span :class="ui.goldenText">{{ display }}</span>
        </span>
      </li>
    </ul>
    <div
      v-if="!isAuthenticated"
      role="link"
      @click="emit('onClickLogin')"
      :class="ui.nonAuthWrapper"
    >
      <span>Tips: </span>
      <span :class="ui.loginText">
        You could've
        <span class="text-green-400">saved</span>
        this score while logged in !
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTimer, useAuth, useScore } from "@/composables";
import { onMounted, ref } from "vue";
import type { DifficultyOptions, Cell } from "@shared/utils/sudoku/helper";
import { formatTime } from "@/utils";

const props = defineProps<{
  currentDifficulty: DifficultyOptions;
  puzzle: Cell[][];
}>();

const emit = defineEmits<{
  onClickLogin: [];
}>();

const { getTimerActiveTime } = useTimer();
const { isAuthenticated } = useAuth();
const { calculateScore } = useScore();

const score = ref(0);
const display = ref("");

const ui = {
  wrapper: "flex flex-col gap-4",
  goldenText: "text-amber-400 animate-pulse animate-duration-4000",
  icon: "inline text-dTheme-accent",
  iconSize: "20",
  listWrapper: "flex justify-around",
  list: "flex gap-2",
  loginText: "sm:hover:text-green-400 hover:underline cursor-pointer",
  nonAuthWrapper: "text-xs",
};

onMounted(() => {
  const time = getTimerActiveTime();
  score.value = calculateScore(props.puzzle, props.currentDifficulty, time);

  display.value = formatTime(time);
});
</script>

<style scoped lang=""></style>

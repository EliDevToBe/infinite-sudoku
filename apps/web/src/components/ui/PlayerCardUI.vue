<template>
  <div :class="[ui.card, rank < 3 ? ui.topPlayers : '']">
    <!-- Rank -->
    <div :class="ui.rankWrapper">
      <div class="justify-center">
        <div v-if="rank < 3">
          <VueIcon
            :width="ui.medalIconSize"
            :height="ui.medalIconSize"
            :class="ui.medalIcon"
            :name="medalIcons[rank]"
          />
        </div>
        <span v-else :class="ui.rankText">{{ rank + 1 }}</span>
      </div>
    </div>

    <!-- Player Info -->
    <div :class="ui.playerInfo">
      <div :class="ui.playerName">
        {{ pseudo }}
        <VueIcon
          :width="ui.currentUserIconSize"
          :height="ui.currentUserIconSize"
          :class="ui.currentUserIcon"
          name="lucide:user"
        />
      </div>
      <div :class="ui.score">
        {{ formatScore(score) }}
      </div>
    </div>

    <!-- Total puzzle count -->
    <div :class="ui.colItemWrapper">
      <VueIcon
        :width="ui.colItemIconSize"
        :height="ui.colItemIconSize"
        :class="ui.colItemIcon"
        name="lucide:puzzle"
      />
      <span :class="ui.colItemText">{{ 8 }}</span>
    </div>

    <!-- Time -->
    <div :class="ui.colItemWrapper">
      <VueIcon
        :width="ui.colItemIconSize"
        :height="ui.colItemIconSize"
        :class="ui.colItemIcon"
        name="lucide:clock"
      />
      <span :class="ui.colItemText">{{ formatTime(time) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from "@/utils";

const ui = {
  card: [
    "grid grid-cols-[0.5fr_2fr_1fr_1fr] items-center gap-3 p-1 px-2 rounded-lg",
    "bg-dTheme-light/10 hover:bg-dTheme-light/20",
    "transition-colors duration-200",
  ],
  rankWrapper: "flex items-center justify-center",
  playerInfo: "flex grow flex-col gap-1",
  playerName: "flex items-center gap-2 text-dTheme-font font-medium text-sm",

  currentUserIcon: "text-dTheme-accent",
  currentUserIconSize: "20",

  score: "text-amber-400 font-bold text-lg",
  colItemWrapper: "flex items-center justify-center gap-1",
  colItemIcon: "text-dTheme-font/60",
  colItemIconSize: "14",
  colItemText: "text-dTheme-font/80 text-xs sm:text-sm",

  medalIcon: "text-amber-400",
  medalIconSize: "20",
  rankText: "text-dTheme-font font-bold text-sm",

  topPlayers:
    "bg-gradient-to-r from-amber-500/5 to-yellow-500/20 border border-amber-500/30",
};
const medalIcons = [
  "lucide:crown",
  "tabler:circle-number-2",
  "tabler:circle-dashed-number-3",
];

const props = defineProps<{
  icon?: string;
  pseudo: string;
  score: number;
  time: number;
  rank: number;
}>();

const formatScore = (score: number): string => {
  return score.toLocaleString();
};
</script>

<style scoped lang=""></style>

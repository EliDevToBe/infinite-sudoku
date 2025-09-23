<template>
  <div :class="[ui.card, topAndSelfUI]">
    <!-- Rank -->
    <div :class="ui.rankWrapper">
      <div class="justify-center">
        <div v-if="rank < 3">
          <VueIcon
            :width="topRankSizes[rank]"
            :height="topRankSizes[rank]"
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
          v-if="isCurrentUser"
          :width="ui.currentUserIconSize"
          :height="ui.currentUserIconSize"
          :class="ui.currentUserIcon"
          name="lucide:user"
        />
      </div>
      <div :class="ui.score">
        {{ formatScore(score) }}
        <span :class="ui.scorePts">pts</span>
      </div>
    </div>

    <!-- Stats -->
    <div :class="ui.statsBlock">
      <TooltipUI text="Puzzles solved" :options="{ side: 'top' }">
        <div :class="ui.statWrapper">
          <VueIcon
            :width="ui.statIconSize"
            :height="ui.statIconSize"
            :class="ui.statIcon"
            name="lucide:puzzle"
          />
          <span :class="ui.statText">{{ puzzleCount }}</span>
        </div>
      </TooltipUI>

      <TooltipUI text="Average time" :options="{ side: 'top' }">
        <div :class="ui.statWrapper">
          <VueIcon
            :width="ui.statIconSize"
            :height="ui.statIconSize"
            :class="ui.statIcon"
            name="lucide:clock"
          />
          <span :class="ui.statText">{{ formatTime(time) }}</span>
        </div>
      </TooltipUI>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from "@/utils";
import { computed } from "vue";

const props = defineProps<{
  icon?: string;
  pseudo: string;
  score: number;
  time: number;
  rank: number;
  puzzleCount: number;
  isCurrentUser?: boolean;
}>();

const ui = {
  card: [
    "grid grid-cols-[0.5fr_2fr_1fr] items-center gap-3 rounded-lg",
    "sm:p-1 p-0.5 px-2",
    "bg-dTheme-light/10 hover:bg-dTheme-light/20",
    "transition-colors duration-200",
  ],
  rankWrapper: "flex items-center justify-center",
  playerInfo: "flex flex-col sm:gap-1 gap-0 h-10 sm:h-12",
  playerName: "flex items-center gap-2 text-dTheme-font font-medium text-sm",

  currentUserIcon: "text-dTheme-accent max-sm:w-4 max-sm:h-4",
  currentUserIconSize: "20",

  score:
    "text-amber-400 font-bold text-lg line-height-none sm:line-height-normal text-right pr-6 ",
  scorePts: "text-dTheme-light/80 text-xs sm:text-sm",

  statsBlock: "flex max-sm:flex-col gap-1 justify-between sm:pr-2",
  statWrapper: "flex items-center max-sm:pl-2 gap-2 sm:gap-1",
  statIcon: "text-dTheme-light",
  statIconSize: "14",
  statText: "text-dTheme-light text-xs sm:text-sm",

  medalIcon: "text-amber-400",
  medalIconSize: "20",
  rankText: "text-dTheme-font font-bold text-sm",

  topPlayers:
    "bg-gradient-to-r from-amber-500/5 to-yellow-500/20 border border-amber-500/30",
  selfPlayer:
    "border border-dTheme-accent bg-gradient-to-r from-dTheme-accent/5 to-dTheme-accent/20",
};

const topAndSelfUI = computed(() => {
  if (props.rank < 3 && props.isCurrentUser) {
    return ui.selfPlayer;
  }
  if (props.rank < 3) {
    return ui.topPlayers;
  }
  if (props.isCurrentUser) {
    return ui.selfPlayer;
  }
  return "";
});

const medalIcons = [
  "lucide:crown",
  "tabler:circle-number-2",
  "tabler:circle-dashed-number-3",
];
const topRankSizes = [23, 22, 21];

const formatScore = (score: number): string => {
  return score.toLocaleString();
};
</script>

<style scoped lang=""></style>

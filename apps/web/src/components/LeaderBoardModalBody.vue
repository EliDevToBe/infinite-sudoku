<template>
  <div :class="[ui.mainWrapper, isEmptyState ? 'h-full' : '']">
    <div :class="ui.tabWrapper">
      <TabBarUI radio-group="leaderboard" :tabs="tabs" v-model="activeTab" />
    </div>

    <div ref="cursorRef" :class="ui.contentWrapper">
      <!-- Loading State -->
      <div
        v-if="isLoading"
        :class="[ui.loadingWrapper, isEmptyState ? ui.emptyStateClass : '']"
      >
        <VueIcon
          :width="ui.loadingIconSize"
          :height="ui.loadingIconSize"
          :class="ui.loadingIcon"
          name="svg-spinners:ring-resize"
        />
        <span :class="ui.loadingText">Loading leaderboard...</span>
      </div>

      <!-- Leaderboard List -->
      <div v-else :class="isEmptyState ? ui.emptyStateClass : ''">
        <!-- Top Players -->
        <div :class="ui.playersList">
          <PlayerCardUI
            :puzzle-count="player.puzzleCount"
            :rank="index"
            v-for="(player, index) in leaderboardData"
            :key="player.id"
            :pseudo="player.pseudo"
            :score="player.score"
            :time="player.time"
            :is-current-user="player.isCurrentUser"
          />
        </div>

        <!-- Current Player -->
        <div v-if="currentPlayerPosition && currentPlayerPosition.rank > 20">
          <div :class="ui.separator"></div>
          <PlayerCardUI
            :puzzle-count="999"
            :rank="currentPlayerPosition.rank"
            :pseudo="currentPlayerPosition.pseudo"
            :score="currentPlayerPosition.score"
            :time="currentPlayerPosition.time"
            is-current-user
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="!isLoading && leaderboardData.length === 0"
          :class="ui.emptyWrapper"
        >
          <VueIcon
            :width="ui.emptyIconSize"
            :height="ui.emptyIconSize"
            :class="ui.emptyIcon"
            name="lucide:trophy"
          />
          <span :class="ui.emptyText">No {{ activeTab }} scores yet</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { TabBarUI } from "./ui";
import type { Tab } from "./ui/TabBar.UI.vue";
import type {
  LeaderboardPlayer,
  CurrentPlayerPosition,
} from "@/composables/useLeaderBoard";
import { useLeaderBoard } from "@/composables";

const { fetchLeaderboard } = useLeaderBoard();

const activeTab = ref<"daily" | "weekly" | "monthly">("daily");
const isLoading = ref(false);
const leaderboardData = ref<LeaderboardPlayer[]>([]);
const currentPlayerPosition = ref<CurrentPlayerPosition | null>(null);

const tabs: Tab[] = [
  { value: "daily", label: "Daily", icon: "lucide:calendar" },
  { value: "weekly", label: "Weekly", icon: "lucide:calendar-days" },
  {
    value: "monthly",
    label: "Monthly",
    icon: "lucide:calendar-range",
  },
];

const ui = {
  mainWrapper: "flex flex-col sm:gap-4 grow gap-2",
  contentWrapper:
    "flex flex-col flex-1 gap-4 overflow-visible pb-8 px-6 sm:px-10",

  tabWrapper: "p-3 sm:px-4 sticky top-0 bg-transparent backdrop-blur-sm",

  loadingWrapper: "flex flex-col items-center justify-center h-full gap-3",
  loadingIcon: "text-dTheme-accent",
  loadingIconSize: "24",
  loadingText: "text-dTheme-font text-sm",

  playersList: "flex flex-col gap-1 sm:gap-2 mb-4",

  separator: "h-px bg-dTheme-light/30 mb-3",
  emptyWrapper: "flex flex-col items-center justify-center gap-3",
  emptyIcon: "text-dTheme-light/90",
  emptyIconSize: "48",
  emptyText: "text-dTheme-light/60 text-sm",

  emptyStateClass: "flex flex-col grow items-center justify-center",
};

const isEmptyState = computed(() => {
  return isLoading.value || leaderboardData.value.length === 0;
});

watch(
  activeTab,
  async () => {
    isLoading.value = true;
    const data = await fetchLeaderboard(activeTab.value);

    if (!data) {
      leaderboardData.value = [];
      currentPlayerPosition.value = null;
    } else {
      currentPlayerPosition.value = data.currentPlayer ?? null;
      leaderboardData.value = data.players;
    }

    isLoading.value = false;
  },
  { immediate: true }
);
</script>

<style scoped lang=""></style>

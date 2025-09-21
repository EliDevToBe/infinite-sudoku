<template>
  <div class="flex flex-col sm:gap-4 gap-2">
    <div class="p-3 sm:px-4 sticky top-0 bg-transparent backdrop-blur-sm">
      <TabBarUI radio-group="leaderboard" :tabs="tabs" v-model="activeTab" />
    </div>

    <div
      ref="cursorRef"
      :class="ui.wrapper"
      class="overflow-visible flex-1 pb-8 px-10 h-full"
    >
      <!-- Loading State -->
      <div v-if="isLoading" :class="ui.loadingWrapper">
        <VueIcon
          :width="ui.loadingIconSize"
          :height="ui.loadingIconSize"
          :class="ui.loadingIcon"
          name="svg-spinners:ring-resize"
        />
        <span :class="ui.loadingText">Loading leaderboard...</span>
      </div>

      <!-- Leaderboard List -->
      <div v-else>
        <!-- Top 20 Players -->
        <div :class="ui.playersList">
          <PlayerCardUI
            :rank="index"
            v-for="(player, index) in leaderboardData"
            :key="player.id"
            :pseudo="player.pseudo"
            :score="player.score"
            :time="player.time"
            :is-current-user="player.isCurrentUser"
          />
        </div>

        <!-- Current Player Position (if not in top 20) -->
        <div v-if="currentPlayerPosition && currentPlayerPosition.rank > 20">
          <div :class="ui.separator"></div>
          <PlayerCardUI
            :rank="currentPlayerPosition.rank"
            :pseudo="currentPlayerPosition.pseudo"
            :score="currentPlayerPosition.score"
            :time="currentPlayerPosition.time"
            :is-current-user="true"
          />
        </div>

        <!-- Empty State -->
        <div
          v-if="!isLoading && !error && leaderboardData.length === 0"
          :class="ui.emptyWrapper"
        >
          <VueIcon
            :width="ui.emptyIconSize"
            :height="ui.emptyIconSize"
            :class="ui.emptyIcon"
            name="lucide:trophy"
          />
          <span :class="ui.emptyText">No scores yet for this period</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
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
const error = ref<string | null>(null);
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
  wrapper: "flex flex-col gap-4",
  loadingWrapper: "flex flex-col items-center justify-center h-full gap-3",
  loadingIcon: "text-dTheme-accent",
  loadingIconSize: "24",
  loadingText: "text-dTheme-font text-sm",

  playersList: "flex flex-col gap-1 sm:gap-2 mb-4",

  separator: "h-px bg-dTheme-light/30 mb-3",
  emptyWrapper: "flex flex-col items-center justify-center h-full gap-3",
  emptyIcon: "text-dTheme-light/90",
  emptyIconSize: "48",
  emptyText: "text-dTheme-light/60 text-sm",
};

watch(activeTab, async () => {
  const data = await fetchLeaderboard(activeTab.value);
  if (!data) return;
  leaderboardData.value = data.players;
  if (data.currentPlayer) {
    currentPlayerPosition.value = data.currentPlayer;
  }
});

onMounted(async () => {
  const data = await fetchLeaderboard(activeTab.value);
  if (!data) return;
  leaderboardData.value = data.players;

  if (data.currentPlayer) {
    currentPlayerPosition.value = data.currentPlayer;
  }
});
</script>

<style scoped lang=""></style>

import { useNow } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref } from "vue";

const now = useNow({ interval: 500 });
const timerState = ref({
  isActive: false,
  startTime: 0,
  pausedTime: 0,
  lastPauseTime: 0,
});

export const useTimer = () => {
  const startTimer = () => {
    if (!timerState.value.isActive && !timerState.value.startTime) {
      timerState.value.startTime = now.value.getTime();
      timerState.value.isActive = true;
    }
  };

  const pauseTimer = () => {
    if (timerState.value.isActive) {
      timerState.value.lastPauseTime = now.value.getTime();
      timerState.value.isActive = false;
    }
  };

  const resumeTimer = () => {
    if (timerState.value.startTime && !timerState.value.isActive) {
      if (timerState.value.lastPauseTime) {
        timerState.value.pausedTime +=
          now.value.getTime() - timerState.value.lastPauseTime;
        timerState.value.lastPauseTime = 0;
      }

      timerState.value.isActive = true;
    }
  };

  const resetTimer = () => {
    timerState.value.startTime = 0;
    timerState.value.pausedTime = 0;
    timerState.value.lastPauseTime = 0;
    timerState.value.isActive = false;
  };

  /**
   * Return the active time in milliseconds
   */
  const getTimerActiveTime = () => {
    if (!timerState.value.startTime) return 0;

    const currentTime = now.value.getTime();
    const totalTime = currentTime - timerState.value.startTime;
    const currentPausedTime = timerState.value.isActive
      ? 0
      : currentTime - timerState.value.lastPauseTime;

    return totalTime - timerState.value.pausedTime - currentPausedTime;
  };

  const handleVisibilityChange = () => {
    if (document.hidden) {
      // Page is hidden - pause timer
      if (timerState.value.isActive) {
        timerState.value.lastPauseTime = now.value.getTime();
        timerState.value.isActive = false;
      }
    } else {
      // Page is visible - resume timer
      if (timerState.value.startTime && !timerState.value.isActive) {
        // Add the paused duration to total paused time
        if (timerState.value.lastPauseTime) {
          timerState.value.pausedTime +=
            now.value.getTime() - timerState.value.lastPauseTime;
          timerState.value.lastPauseTime = 0;
        }
        timerState.value.isActive = true;
      }
    }
  };

  const timerDisplay = computed(() => {
    const now = getTimerActiveTime();

    return new Intl.DateTimeFormat("fr-FR", {
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(now));
  });

  onMounted(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  });

  onUnmounted(() => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  });

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getTimerActiveTime,
    timerDisplay,
  };
};

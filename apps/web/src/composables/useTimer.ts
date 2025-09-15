import { useNow } from "@vueuse/core";
import { computed, onMounted, onUnmounted, ref } from "vue";

const timerState = ref({
  isActive: false,
  startTime: 0,
  pausedTime: 0,
  lastPauseTime: 0,
});
const now = useNow({ interval: 500 });

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

  const currentTimerTime = computed(() => {
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

  const getTimerState = () => {
    return timerState.value;
  };

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    getTimerActiveTime,
    currentTimerTime,
    getTimerState,
  };
};

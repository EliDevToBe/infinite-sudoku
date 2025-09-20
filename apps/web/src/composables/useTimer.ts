import { useNow } from "@vueuse/core";
import { computed, ref } from "vue";
import { formatTime } from "@/utils";

const now = useNow({ interval: 250 });
const timerState = ref({
  isActive: false,
  startTime: 0,
  pausedTime: 0,
  lastPauseTime: 0,
  totalElapsedTime: 0,
});

export const useTimer = () => {
  const getTimerState = () => {
    return timerState.value;
  };

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
    timerState.value.totalElapsedTime = 0;
  };

  const setTotalElapsedTime = (milliseconds: number) => {
    timerState.value.totalElapsedTime = milliseconds;
  };

  /**
   * Return the active time in milliseconds
   */
  const getTimerActiveTime = () => {
    if (!timerState.value.startTime && !timerState.value.totalElapsedTime)
      return 0;

    const currentTime = now.value.getTime();
    const totalTime = currentTime - timerState.value.startTime;
    const currentPausedTime = timerState.value.isActive
      ? 0
      : currentTime - timerState.value.lastPauseTime;

    return (
      totalTime -
      timerState.value.pausedTime -
      currentPausedTime +
      timerState.value.totalElapsedTime
    );
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
    timerState.value.totalElapsedTime > 0;
    const now = getTimerActiveTime();

    return formatTime(now);
  });

  const addTimerEvent = () => {
    document.addEventListener("visibilitychange", handleVisibilityChange);
  };

  const removeTimerEvent = () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };

  return {
    getTimerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
    getTimerActiveTime,
    setTotalElapsedTime,
    timerDisplay,
    addTimerEvent,
    removeTimerEvent,
  };
};

import posthog from "posthog-js";
import { ref } from "vue";

const initialized = ref(false);

export function usePostHog() {
  const init = () => {
    if (
      !import.meta.env.VITE_POSTHOG_KEY ||
      !import.meta.env.VITE_POSTHOG_HOST
    ) {
      console.warn("[POSTHOG] Not initialized");
      return;
    }

    if (initialized.value) {
      console.warn("[POSTHOG] Already initialized");
      return;
    }

    const key = import.meta.env.VITE_POSTHOG_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST;

    posthog.init(key, {
      api_host: host,
      defaults: "2025-05-24",
      person_profiles: "identified_only",
      autocapture: false,
    });

    initialized.value = true;
  };
  init();

  return { posthog };
}

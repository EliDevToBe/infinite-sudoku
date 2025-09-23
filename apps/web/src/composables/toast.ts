import { Logger } from "./useLogger";

// The namespace useToast is already used by @nuxt/ui

export const usePresetToast = () => {
  const toast = useToast();

  const toastInfo = (params: { description: string; title?: string }) => {
    toast.add({
      title: params.title || "Info",
      description: params.description,
      icon: "i-lucide-info",
      ui: {
        title: "text-lTheme-accent",
        icon: "text-lTheme-accent",
        description: "text-dTheme-font",
      },
    });
  };

  const toastSuccess = (params: { description: string; title?: string }) => {
    toast.add({
      title: params.title || "Success",
      description: params.description,
      icon: "i-lucide-check-circle",
      color: "success",
      ui: {
        title: "text-green-400",
        description: "text-dTheme-font",
      },
    });
  };

  /**
   * Toast error with custom error logging.
   * - Add errored toast
   * - Log appropriately the error (custom or unknown)
   *
   * @param error - The error to toast
   * @param params - The parameters to toast
   */
  const toastError = (
    error: unknown,
    params: { description: string; title?: string },
  ) => {
    toast.add({
      title: params.title || "Error",
      description: params.description,
      icon: "i-lucide-alert-circle",
      color: "error",
      ui: {
        title: "text-red-400",
        description: "text-dTheme-font",
      },
      duration: 3000,
    });

    Logger.error(error);
  };

  return {
    toastInfo,
    toastSuccess,

    /**
     * Toast error with custom error logging.
     * - Add errored toast
     * - Log appropriately the error (custom or unknown)
     *
     * @param error - The error to toast
     */
    toastError,
  };
};

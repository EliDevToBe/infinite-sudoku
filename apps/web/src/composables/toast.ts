import type { ButtonProps } from "@nuxt/ui";
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

  const toastAction = (params: {
    description?: string;
    title: string;
    actions: Pick<ButtonProps, "label" | "onClick" | "leadingIcon">[];
    duration?: number;
  }) => {
    toast.add({
      title: params.title,
      description: params.description || "",
      icon: "i-lucide-triangle-alert",
      color: "warning",
      ui: {
        title: "text-yellow-400",
        description: "text-dTheme-font",
      },
      duration: params.duration || 5000,
      actions: params.actions.map((action) => ({
        ...action,
        variant: "outline",
        size: "md",
        block: true,
        leading: true,
        ui: {
          base: "p-2",
        },
      })),
    });
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
    toastAction,
  };
};

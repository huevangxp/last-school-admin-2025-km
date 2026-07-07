import { defineStore } from "pinia";

export interface ConfirmOptions {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  color?: string; // "error" | "primary" | "warning" | "success"
  icon?: string;
}

type Notify = "success" | "error" | "info" | "warning";

// The confirm() promise resolver is kept out of reactive state (functions
// don't belong in a Pinia store's state).
let resolver: ((v: boolean) => void) | null = null;

// Global UI feedback: a modern confirm card and a toast, rendered once by
// <AppFeedback/> in the default layout and driven from anywhere via this store.
export const useUiStore = defineStore("ui", {
  state: () => ({
    confirmState: {
      show: false,
      title: "",
      message: "",
      confirmText: "",
      cancelText: "",
      color: "error",
      icon: "mdi-alert-outline",
    },
    snackbar: {
      show: false,
      message: "",
      type: "success" as Notify,
    },
  }),
  actions: {
    // Open the confirm card; resolves true (confirmed) or false (cancelled).
    confirm(opts: ConfirmOptions = {}): Promise<boolean> {
      this.confirmState.title = opts.title || "";
      this.confirmState.message = opts.message || "";
      this.confirmState.confirmText = opts.confirmText || "";
      this.confirmState.cancelText = opts.cancelText || "";
      this.confirmState.color = opts.color || "error";
      this.confirmState.icon = opts.icon || "mdi-alert-outline";
      this.confirmState.show = true;
      return new Promise<boolean>((resolve) => {
        resolver = resolve;
      });
    },
    // Called by the component's buttons / dismissal.
    resolveConfirm(value: boolean) {
      this.confirmState.show = false;
      resolver?.(value);
      resolver = null;
    },
    // Fire a toast notification.
    notify(message: string, type: Notify = "success") {
      this.snackbar.message = message;
      this.snackbar.type = type;
      this.snackbar.show = true;
    },
  },
});

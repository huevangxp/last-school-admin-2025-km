import { defineStore } from "pinia";

export interface ActivityLog {
  id: string;
  user_id: string | null;
  username: string | null;
  role: string | null;
  action: "create" | "update" | "delete";
  module: string | null;
  entity_id: string | null;
  method: string | null;
  path: string | null;
  status_code: number | null;
  description: string | null;
  created_at: string;
}

// Audit trail of create/update/delete actions by every user. Admin-only.
export const useActivityLogStore = defineStore("activityLog", {
  state: () => ({
    logs: [] as ActivityLog[],
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchLogs(params: {
      limit?: number;
      page?: number;
      action?: string;
      module?: string;
      search?: string;
    } = {}) {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/activity-logs", { params });
        const payload = res.data?.data ?? {};
        this.logs = payload.logs ?? [];
        this.total = payload.pagination?.total ?? this.logs.length;
        this.page = payload.pagination?.page ?? 1;
        this.pages = payload.pagination?.pages ?? 1;
      } catch (error: any) {
        this.error = error.response?.data?.message || "Failed to load logs.";
      } finally {
        this.loading = false;
      }
    },

    async clearLogs() {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete("/activity-logs");
      return res.data;
    },
  },
});

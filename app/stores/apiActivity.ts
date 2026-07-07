import { defineStore } from "pinia";

export const useActivityStore = defineStore("activity", {
  state: () => ({
    activities: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchActivities() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-all-activities");
        this.activities = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchActivities error:", error);
        this.error =
          error.response?.data?.message || "Failed to load activities.";
      } finally {
        this.loading = false;
      }
    },

    async createActivity(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/create-activity", payload);
      return res.data;
    },

    async updateActivity(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-activity/${id}`, payload);
      return res.data;
    },

    async deleteActivity(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-activity/${id}`);
      return res.data;
    },
  },
});

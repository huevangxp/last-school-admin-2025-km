import { defineStore } from "pinia";

export const useAnnouncementStore = defineStore("announcement", {
  state: () => ({
    announcements: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchAnnouncements() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-all-announcements");
        this.announcements = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchAnnouncements error:", error);
        this.error =
          error.response?.data?.message || "Failed to load announcements.";
      } finally {
        this.loading = false;
      }
    },

    async createAnnouncement(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/create-announcement", payload);
      return res.data;
    },

    async updateAnnouncement(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-announcement/${id}`, payload);
      return res.data;
    },

    async deleteAnnouncement(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-announcement/${id}`);
      return res.data;
    },
  },
});

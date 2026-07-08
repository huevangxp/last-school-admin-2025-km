import { defineStore } from "pinia";

export const useContactStore = defineStore("contact", {
  state: () => ({
    contacts: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchContacts() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-all-contacts");
        this.contacts = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchContacts error:", error);
        this.error =
          error.response?.data?.message || "Failed to load messages.";
      } finally {
        this.loading = false;
      }
    },

    async markRead(id: string, status: "read" | "unread" = "read") {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-contact/${id}`, { status });
      return res.data;
    },

    async deleteContact(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-contact/${id}`);
      return res.data;
    },
  },
});

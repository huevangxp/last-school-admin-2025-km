import { defineStore } from "pinia";

// Photo galleries (albums). Admin manages; the list is public.
export const useGalleryStore = defineStore("gallery", {
  state: () => ({
    galleries: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchGalleries() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-all-galleries");
        this.galleries = res.data?.data ?? [];
      } catch (error: any) {
        console.error("fetchGalleries error:", error);
        this.error = error.response?.data?.message || "Failed to load galleries.";
      } finally {
        this.loading = false;
      }
    },

    async createGallery(payload: {
      title: string;
      description?: string | null;
      gallery_status?: string;
      images: string[];
    }) {
      const { $axios } = useNuxtApp();
      const res = await $axios.post("/create-gallery", payload);
      return res.data;
    },

    async updateGallery(id: string, payload: Record<string, any>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-gallery/${id}`, payload);
      return res.data;
    },

    async deleteGallery(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/delete-gallery/${id}`);
      return res.data;
    },
  },
});

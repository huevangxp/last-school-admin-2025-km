import { defineStore } from "pinia";

export const useSubjectStore = defineStore("subject", {
  state: () => ({
    subjects: [] as any[],
    loading: false,
    error: "" as string,
  }),
  actions: {
    async fetchSubjects() {
      const { $axios } = useNuxtApp();
      this.loading = true;
      this.error = "";
      try {
        const res = await $axios.get("/get-all-subjects");
        const payload = res.data?.data;
        this.subjects = Array.isArray(payload)
          ? payload
          : (payload?.subjects ?? []);
      } catch (error: any) {
        console.error("fetchSubjects error:", error);
        this.error = error.response?.data?.message || "Failed to load subjects.";
      } finally {
        this.loading = false;
      }
    },

    async createSubject(payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      // Backend requires: subject_id, subject_name, subject_code, coefficient, grade_id
      const res = await $axios.post("/create-subject", payload);
      return res.data;
    },

    async updateSubject(id: string, payload: Record<string, unknown>) {
      const { $axios } = useNuxtApp();
      const res = await $axios.put(`/update-subject/${id}`, payload);
      return res.data;
    },

    async deleteSubject(id: string) {
      const { $axios } = useNuxtApp();
      const res = await $axios.delete(`/hard-delete-subject/${id}`);
      return res.data;
    },
  },
});
